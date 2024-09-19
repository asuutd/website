import { authedProcedure, superAdminProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Fee_Holder } from '@prisma/client';
import { env } from '@/env/server.mjs';
import { ZodCustomField } from '@/utils/forms';
import { splitEvents } from '@/utils/misc';
import { createOrUpdateGooglePassClass } from '@/lib/wallets';
import { getPostHog } from '@/server/posthog';

const client = getPostHog();

export const eventRouter = t.router({
	getEvent: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const tier = await ctx.prisma.event.findFirst({
				where: {
					id: input.eventId
				},
				include: {
					Tier: {
						where: {
							AND: [
								{
									start: {
										lte: new Date()
									}
								},
								{
									end: {
										gte: new Date()
									}
								}
							]
						},
						include: {
							_count: {
								select: {
									Ticket: true
								}
							}
						}
					},
					location: true,
					organizer: {
						select: {
							user: {
								select: {
									name: true,
									image: true
								}
							}
						}
					}
				}
			});

			return tier;
		}),

	getEventAdmin: superAdminProcedure.query(async ({ input, ctx }) => {
		const result = await ctx.prisma.event.findFirstOrThrow({
			where: {
				id: input.eventId
			},
			include: {
				location: true,
				forms: {
					orderBy: {
						updatedAt: 'desc'
					}
				}
			}
		});

		return result;
	}),
	getEvents: t.procedure.query(async ({ ctx }) => {
		const events = await ctx.prisma.event.findMany({
			where: {
				end: {
					gt: new Date()
				}
			}
		});
		console.log(splitEvents);

		return splitEvents(events);
	}),
	createEvent: authedProcedure
		.input(
			z.object({
				name: z.string(),
				startTime: z.date(),
				endTime: z.date(),
				bannerImage: z.string().url(),
				ticketImage: z.string().url(),
				location: z
					.object({
						address: z.string(),
						coordinates: z.tuple([z.number(), z.number()])
					})
					.optional(),
				feeBearer: z.nativeEnum(Fee_Holder)
			})
		)

		.mutation(async ({ input, ctx }) => {
			console.log(ctx.session.user.role)
			if (input.endTime < input.startTime) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'End time should be greater than start time'
				});
			}
      if (ctx.session.user.role !== 'ORGANIZER') {
        throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
      }	
      const newEvent = await ctx.prisma.event.create({
        data: {
          name: input.name,
          start: input.startTime,
          end: input.endTime,
          image: input.bannerImage,
          ticketImage: input.ticketImage,
          organizerId: ctx.session.user.id,
          google_pass_class_created: true,
          ...(input.location
            ? {
              location: {
                create: {
                  long: input.location.coordinates[0],
                  lat: input.location.coordinates[1],
                  name: input.location.address
                }
              }
            }
            : {}),
          EventAdmin: {
            create: {
              userId: ctx.session.user.id,
              role: 'OWNER'
            }
          },
          fee_holder: input.feeBearer
        },
        include: {
          location: true,
          organizer: {
            include: {
              user: true
            }
          }
        }
			});

			client.capture({
				distinctId: ctx.session.user.id,
				event: 'event created',
				properties: {
					
					name : newEvent.name,
					start_time : newEvent.start,
					end_time : newEvent.end,
					location : input.location?.address,
					bearer : input.feeBearer,

				}
			  });
      
      try {
        await createOrUpdateGooglePassClass(newEvent)
      } catch (e) {
        console.error(e)
        await ctx.prisma.event.update({
          where: {
            id: newEvent.id
          },
          data: {
            google_pass_class_created: false
          }
        })
      }
      
			return newEvent;
			
		}),
	updateEvent: superAdminProcedure
		.input(
			z.object({
				eventId: z.string(),
				name: z.string(),
				startTime: z.date(),
				endTime: z.date(),
				bannerImage: z.string().url(),
				ticketImage: z.string().url(),
				location: z
					.object({
						address: z.string(),
						coordinates: z.tuple([z.number(), z.number()])
					})
					.optional(),
				description: z.string().optional(),
				feeBearer: z.nativeEnum(Fee_Holder)
			})
		)
		.mutation(async ({ input, ctx }) => {
			if (input.endTime < input.startTime) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'End time should be greater than start time'
				});
			}
			const event = await ctx.prisma.event.findFirstOrThrow({
				where: {
					id: input.eventId
				},
				include: {
					EventAdmin: true,
					Tier: true
				}
			});

			const imagesToDelete: string[] = [];
			if (event.image && event.image !== input.bannerImage) {
				imagesToDelete.push(event.image);
			}

			if (event.ticketImage && event.ticketImage !== input.ticketImage) {
				imagesToDelete.push(event.ticketImage);
			}

			const updatedEvent = await ctx.prisma.event.update({
				where: {
					id: input.eventId
				},
				include: {
          location: true,
          organizer: {
            include: {
              user: true
            }
          }
				},
				data: {
					name: input.name,
					start: input.startTime,
					end: input.endTime,
					image: input.bannerImage,
					ticketImage: input.ticketImage,
					fee_holder: input.feeBearer,
					...(input.location
						? {
								location: {
									upsert: {
										where: {
											id: input.eventId
										},
										create: {
											long: input.location.coordinates[0],
											lat: input.location.coordinates[1],
											name: input.location.address
										},
										update: {
											long: input.location.coordinates[0],
											lat: input.location.coordinates[1],
											name: input.location.address
										}
									}
								}
						  }
						: {}),
					description: input.description
				}
			});
			
			const shouldUpdatePassClass = updatedEvent.google_pass_class_created
      const id = await createOrUpdateGooglePassClass(updatedEvent, shouldUpdatePassClass)
		
      if (!shouldUpdatePassClass) {
        await ctx.prisma.event.update({
          where: {
            id: updatedEvent.id
          },
          data: {
            google_pass_class_created: true
          }
        })
      }
			
			if (imagesToDelete.length > 0) {
				const response = await fetch('https://api.uploadcare.com/files/storage/', {
					method: 'DELETE',
					body: JSON.stringify(
						imagesToDelete
							.filter((input) => typeof input === 'string')
							.map((input) => input?.split('/')[3])
					),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Uploadcare.Simple ${env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY}:${env.UPLOADCARE_SECRET_KEY}`,
						Accept: 'application/vnd.uploadcare-v0.7+json'
					}
				});
				if (!response.ok) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Previous Image Deletion Failed'
					});
				}
			}
		}),
	upsertEventForm: superAdminProcedure
		.input(
			z.object({
				forms: z.array(ZodCustomField)
			})
		)
		.mutation(async ({ input, ctx }) => {
			return await ctx.prisma.eventForm.create({
				data: {
					eventId: input.eventId,
					form: input.forms
				}
			});
		}),

	//For User
	getEventForm: t.procedure
		.input(
			z.object({
				eventId: z.string(),
				userEmail: z.string().optional()
			})
		)
		.query(async ({ input, ctx }) => {
			if (!input.userEmail && !ctx.session?.user) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'You need to be logged in or have an email'
				});
			}
			console.log(ctx.session?.user?.id, input.userEmail);
			const userResponse = await ctx.prisma.formResponse.findFirst({
				where: {
					form: {
						eventId: input.eventId
					},
					OR: [
						{
							userId: ctx.session?.user?.id
						},
						{
							user: {
								email: input.userEmail
							}
						}
					]
				}
			});
			console.log(userResponse);
			if (userResponse) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: "You've already filled this form"
				});
			}
			const form = await ctx.prisma.eventForm.findMany({
				where: {
					eventId: input.eventId
				},
				orderBy: {
					updatedAt: 'desc'
				},
				take: 1
			});

			if (form[0]) {
				return form;
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND'
				});
			}
		}),

	getResponses: superAdminProcedure
		.input(
			z.object({
				formId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const responses = await ctx.prisma.formResponse.findMany({
				where: {
					formId: input.formId
				},
				orderBy: {
					createdAt: 'asc'
				}
			});

			return responses.map(({ response }: { response: any }) =>
				Object.assign({}, ...response.map((key: any) => ({ [key.label]: key.response })))
			);
		}),
	createSurveyResponse: t.procedure
		.input(
			z.object({
				eventId: z.string(),
				value: z.array(
					z.object({
						label: z.string(),
						response: z.union([z.string(), z.array(z.string())])
					})
				),
				userEmail: z.string().email().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			if (!input.userEmail && !ctx.session?.user) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'You need to be logged in or have an email'
				});
			}

			const ticket = await ctx.prisma.ticket.findFirst({
				where: {
					eventId: input.eventId,
					OR: [
						{
							userId: ctx.session?.user?.id
						},
						{
							user: {
								email: input.userEmail
							}
						}
					]
				},
				include: {
					event: {
						select: {
							forms: {
								orderBy: {
									updatedAt: 'desc'
								},
								take: 1
							}
						}
					}
				}
			});

			if (ticket && ticket.event.forms[0]) {
				await ctx.prisma.formResponse.create({
					data: {
						formId: ticket.event.forms[0].id,
						userId: ticket.userId,
						response: input.value
					}
				});
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You do not have a ticket for this event'
				});
			}
		}),
	changeFormVersion: superAdminProcedure
		.input(
			z.object({
				direction: z.enum(['forward', 'backwards']),
				currentFormTime: z.date()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const form = await ctx.prisma.eventForm.findMany({
				where: {
					eventId: input.eventId,
					updatedAt: {
						...(input.direction === 'backwards'
							? { lt: input.currentFormTime }
							: { gt: input.currentFormTime })
					}
				},
				orderBy: {
					updatedAt: input.direction === 'backwards' ? 'desc' : 'asc'
				},
				take: 1
			});
			return form[0];
		})
});
