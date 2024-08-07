import { TRPCError } from '@trpc/server';
import { authedProcedure, superAdminProcedure, t } from '../trpc';
import { z } from 'zod';

export const tierRouter = t.router({
	getTiers: t.procedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const tier = await ctx.prisma.tier.findMany({
				where: {
					eventId: input.eventId
				},
				include: {
					event: true
				}
			});

			return tier;
		}),

	getTiersAdmin: superAdminProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const tier = await ctx.prisma.tier.findMany({
				where: {
					eventId: input.eventId
				},
				include: {
					event: true,
					_count: {
						select: {
							Ticket: true
						}
					}
				}
			});

			return tier;
		}),
	editTier: authedProcedure
		.input(
			z.object({
				tierId: z.string(),
				name: z.string().optional(),
				price: z.number().optional(),
				limit: z.number().optional(),
				startTime: z.date().optional(),
				endTime: z.date().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const tier = await ctx.prisma.tier.findFirstOrThrow({
				where: {
					id: input.tierId
				},
				include: {
					event: {
						select: {
							EventAdmin: true,
							organizerId: true
						}
					}
				}
			});

			if (input.startTime && tier.end < input.startTime) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: "Can't DO THIS"
				});
			}

			if (input.endTime && tier.start > input.endTime) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: "Can't DO THIS"
				});
			}

			const changingPrice = input.price !== tier.price;

			if (changingPrice) {
				const ticket = await ctx.prisma.ticket.findFirst({
					where: {
						tierId: tier.id
					}
				});

				if (ticket) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: "Can't change tier price as tickets have been sold on this tier."
					});
				}
			}

			if (
				tier.event?.organizerId === ctx.session.user.id ||
				tier.event?.EventAdmin.find((admin) => admin.userId === ctx.session.user.id)
			) {
				const newEvent = await ctx.prisma.tier.update({
					where: {
						id: input.tierId
					},
					data: {
						name: input.name,
						price: input.price,
						start: input.startTime,
						limit: input.limit,
						end: input.endTime
					}
				});
				return newEvent;
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
		}),
	createTier: authedProcedure
		.input(
			z.object({
				name: z.string(),
				price: z.number(),
				limit: z.number().optional(),
				startTime: z.date(),
				endTime: z.date(),
				eventId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const event = await ctx.prisma.event.findFirstOrThrow({
				where: {
					id: input.eventId
				},
				include: {
					EventAdmin: true
				}
			});
			if (
				event.organizerId === ctx.session.user.id ||
				event.EventAdmin.find((admin) => admin.userId === ctx.session.user.id)
			) {
				const newEvent = await ctx.prisma.tier.create({
					data: {
						name: input.name,
						start: input.startTime,
						limit: input.limit,
						end: input.endTime,
						eventId: input.eventId,
						price: input.price
					}
				});
				return newEvent;
			} else {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
		})
});
