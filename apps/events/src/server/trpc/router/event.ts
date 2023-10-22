import { TRPCClientError } from '@trpc/client';
import { adminProcedure, authedProcedure, t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Fee_Holder, Prisma } from '@prisma/client';
import { env } from '@/env/server.mjs';
import { ZodCustomDropDownField, ZodCustomField, ZodCustomRadioGroupField } from '@/utils/forms';

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

	getEventAdmin: adminProcedure.query(async ({ input, ctx }) => {
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
		return await ctx.prisma.event.findMany({
			where: {
				start: {
					gte: new Date()
				}
			}
		});
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
						address: z.string().optional(),
						coordinates: z
							.array(z.number())
							.optional()
							.refine((data) => !data || data.length === 2, 'Location must have only two numbers')
					})
					.optional(),
				feeBearer: z.nativeEnum(Fee_Holder)
			})
		)
		.mutation(({ input, ctx }) => {
			if (ctx.session.user.role === 'ORGANIZER') {
				const newEvent = ctx.prisma.event.create({
					data: {
						name: input.name,
						start: input.startTime,
						end: input.endTime,
						image: input.bannerImage,
						ticketImage: input.ticketImage,
						organizerId: ctx.session.user.id,
						//RE-READ
						...(input.location?.coordinates &&
						input.location?.coordinates[0] &&
						input.location?.coordinates[1]
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
								userId: ctx.session.user.id
							}
						},
						fee_holder: input.feeBearer
					}
				});
				return newEvent;
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
		}),
	updateEvent: authedProcedure
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
						address: z.string().optional(),
						coordinates: z
							.array(z.number())
							.optional()
							.refine((data) => !data || data.length === 2, 'Location must have only two numbers')
					})
					.optional(),
				description: z.string().optional(),
				feeBearer: z.nativeEnum(Fee_Holder)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const event = await ctx.prisma.event.findFirstOrThrow({
				where: {
					id: input.eventId
				},
				include: {
					EventAdmin: true,
					Tier: true
				}
			});
			if (
				event.organizerId === ctx.session.user.id ||
				event.EventAdmin.find((admin) => admin.userId === ctx.session.user.id)
			) {
				const response = await fetch('https://api.uploadcare.com/files/storage/', {
					method: 'DELETE',
					body: JSON.stringify(
						[event.image, event.ticketImage]
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
				await ctx.prisma.event.update({
					where: {
						id: input.eventId
					},
					data: {
						name: input.name,
						start: input.startTime,
						end: input.endTime,
						image: input.bannerImage,
						ticketImage: input.ticketImage,
						organizerId: ctx.session.user.id,
						fee_holder: input.feeBearer,
						...(input.location?.coordinates &&
						input.location?.coordinates[0] &&
						input.location?.coordinates[1]
							? {
									location: {
										update: {
											long: input.location.coordinates[0],
											lat: input.location.coordinates[1],
											name: input.location.address
										}
									}
							  }
							: {}),
						description: input.description
					}
				});
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
		}),
	upsertEventForm: adminProcedure
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
	getEventForm: authedProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const userResponse = await ctx.prisma.formResponse.findFirst({
				where: {
					form: {
						eventId: input.eventId
					},
					userId: ctx.session.user.id
				}
			});
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
				return form[0];
			} else {
				throw new TRPCError({
					code: 'NOT_FOUND'
				});
			}
		}),

	getResponses: adminProcedure
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
	createSurveyResponse: authedProcedure
		.input(
			z.object({
				eventId: z.string(),
				value: z.array(
					z.object({
						label: z.string(),
						response: z.union([z.string(), z.array(z.string())])
					})
				)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const ticket = await ctx.prisma.ticket.findFirst({
				where: {
					eventId: input.eventId,
					userId: ctx.session.user.id
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
						userId: ctx.session.user.id,
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
	changeFormVersion: adminProcedure
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
