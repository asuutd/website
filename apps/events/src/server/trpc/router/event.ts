import { authedProcedure, superAdminProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { InferSelectModel, and, asc, eq, gte, lte, sql } from 'drizzle-orm';
import { event as eventSchema } from '../../db/drizzle/schema/event';
import { user } from '@/server/db/drizzle/schema/user';
import { tier } from '@/server/db/drizzle/schema/tier';
import { date } from 'drizzle-orm/mysql-core';
import { ticket } from '@/server/db/drizzle/schema/ticket';
import { eventLocation } from '@/server/db/drizzle/schema/eventlocation';
import { organizer } from '@/server/db/drizzle/schema/organizer';

type Event = typeof eventSchema.$inferSelect;
type Tier = typeof tier.$inferSelect;
type EventLocation = typeof eventLocation.$inferInsert;
import { Fee_Holder } from '@prisma/client';
import { env } from '@/env/server.mjs';
import { ZodCustomField } from '@/utils/forms';
import { splitEvents } from '@/utils/misc';
import schema from '@/server/db/drizzle/schema';
import { createOrUpdateGooglePassClass } from '@/lib/wallets';

export const eventRouter = t.router({
	getEvent: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const dbEvent = await ctx.drizzle
				.select({
					Event: eventSchema,
					Tier: tier,
					ticketNumber: sql<number>`count(${ticket.id})`.mapWith(Number),
					location: eventLocation,

					user: {
						name: user.name,
						image: user.image
					}
				})
				.from(eventSchema)
				.leftJoin(
					tier,
					and(
						eq(eventSchema.id, tier.eventId)
						/* lte(eventSchema.start, new Date()),
						gte(eventSchema.end, new Date()) */
					)
				)
				.leftJoin(ticket, eq(tier.id, ticket.tierId))
				.leftJoin(eventLocation, eq(eventSchema.id, eventLocation.id))
				.leftJoin(organizer, eq(eventSchema.organizerId, organizer.id))
				.leftJoin(user, eq(organizer.id, user.id))
				.groupBy(sql`${tier.id}`)
				.where(
					and(
						eq(eventSchema.id, input.eventId),
						lte(schema.tier.start, new Date()),
						gte(schema.tier.end, new Date())
					)
				);
			const result = dbEvent.reduce<
				Record<
					string,
					{
						event: Event & {
							tiers: (Tier & {
								_count: {
									Ticket: number;
								};
							})[];
							location: EventLocation | null;
							organizer: {
								user: {
									image: string | null;
									name: string | null;
								};
							} | null;
						};
					}
				>
			>((acc, row) => {
				const event = row.Event;
				acc[0]?.event;
				const tier = row.Tier;
				const ticketNumber = row.ticketNumber;

				if (!acc[event.id]) {
					acc[event.id] = {
						event: {
							...event,
							tiers: [],
							location: null,
							organizer: null
						}
					};
				}

				if (tier) {
					acc[event.id]?.event.tiers.push({
						...tier,
						_count: {
							Ticket: ticketNumber
						}
					});
				}

				if (row.location) {
					const currentEvent = acc[event.id];
					if (currentEvent) {
						currentEvent.event.location = row.location;
					}
				}

				if (row.user) {
					const currentEvent = acc[event.id];
					if (currentEvent) {
						currentEvent.event.organizer = {
							user: {
								image: row.user.image,
								name: row.user.name
							}
						};
					}
				}

				return acc;
			}, {});
			const arr = Object.values(result);
			console.log(arr[0]);
			/* const event = await ctx.prisma.event.findFirst({
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
			}); */

			return arr[0]?.event;
		}),

	getEventAdmin: superAdminProcedure.query(async ({ input, ctx }) => {
		const result = await ctx.drizzle.query.event.findFirst({
			where: eq(schema.event.id, input.eventId),
			with: {
				location: true,
				forms: {
					orderBy: [asc(schema.eventForm.updatedAt)]
				}
			}
		});
		if (!result) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Event not found'
			});
		}

		return result;
	}),
	getEvents: t.procedure.query(async ({ ctx }) => {
		const events = await ctx.drizzle.query.event.findMany({
			where: gte(eventSchema.start, new Date())
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
      const googlePassClassId = await createOrUpdateGooglePassClass(updatedEvent, shouldUpdatePassClass)
		
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
			return await ctx.drizzle.insert(schema.eventForm).values({
				eventId: input.eventId,
				form: input.forms
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
			const responses = await ctx.drizzle.query.formResponse.findMany({
				where: eq(schema.formResponse.formId, input.formId),
				orderBy: [asc(schema.formResponse.createdAt)]
			});

			return responses.map(({ response }) =>
				Object.assign({}, ...response.map((key) => ({ [key.label]: key.response })))
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
