import { authedProcedure, t } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { env } from '../../../env/server.mjs';
import { TRPCError } from '@trpc/server';
import stripe from '../../../utils/stripe';

export const ticketRouter = t.router({
	createTicket: authedProcedure
		.input(
			z.object({
				codeId: z.string().nullish(),
				referralCode: z.string().nullish(),
				eventId: z.string(),
				tiers: z
					.array(
						z.object({
							tierId: z.string(),
							quantity: z.number()
						})
					)
					.min(1)
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId: string = ctx.session.user.id;
			const dataArray: Prisma.TicketCreateManyInput[] = [];
			let refCodeId: number | null = null;
			let sameOwner = false;

			//This hurts but its to prevent collisions
			if (input.referralCode) {
				const code = await ctx.prisma.refCode.findFirst({
					where: {
						code: input.referralCode
					},
					select: {
						id: true,
						userId: true
					}
				});
				if (code) refCodeId = code.id;
				if (userId === code?.userId) sameOwner = true;
			}
			for (const tier of input.tiers) {
				for (let i = 0; i < tier.quantity; ++i) {
					const ticket = {
						userId: userId,
						eventId: input.eventId,
						tierId: tier.tierId,
						...(input.codeId //Make sure to change this. Code should be serched before creating ticket
							? {
									codeId: input.codeId
							  }
							: {}),
						...(refCodeId && !sameOwner
							? {
									refCodeId: refCodeId
							  }
							: {})
					};
					dataArray.push(ticket);
				}
			}
			console.log(dataArray);
			const ticket = await ctx.prisma.ticket.createMany({
				data: dataArray
			});

			return ticket;
		}),
	createFreeTicket: authedProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId: string = ctx.session.user.id;

			const [tickets, refCode] = await Promise.all([
				ctx.prisma.ticket.findMany({
					where: {
						eventId: input.eventId,
						userId: userId
					},
					include: {
						tier: true
					}
				}),
				ctx.prisma.refCode.findFirst({
					where: {
						userId: userId,
						eventId: input.eventId
					},
					include: {
						_count: {
							select: { tickets: true }
						},
						event: true
					}
				})
			]);

			const freeTicket = tickets.find((ticket) => ticket.tierId === null);

			const lowestTierTicket =
				tickets.length === 0
					? null
					: tickets.reduce((prev, curr) => {
							return (prev.tier?.price || Number.MAX_SAFE_INTEGER) <
								(prev.tier?.price || Number.MAX_SAFE_INTEGER)
								? prev
								: curr;
					  });

			if (freeTicket) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Duplicate free ticket'
				});
			}

			if (lowestTierTicket) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Already have a base ticket for event'
				});
			}

			if (refCode) {
				//Check if the referal code has reached threshold
				if (refCode._count.tickets >= (refCode.event.ref_quantity || Number.MAX_SAFE_INTEGER)) {
					await ctx.prisma.ticket.create({
						data: {
							userId: userId,
							eventId: input.eventId
						}
					});
				} else {
					return {
						message: `Ticket threshold of ${refCode.event.ref_quantity} not reached`
					};
				}
			}
		}),

	refundTicket: authedProcedure
		.input(
			z.object({
				eventId: z.string(),
				ticketId: z.string().nullish()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;

			//WOWU
			const event = await ctx.prisma.event.findFirst({
				where: {
					id: input.eventId
				},
				include: {
					tickets: {
						where: {
							userId: userId
						},
						include: {
							tier: true
						}
					},
					_count: {
						select: {
							tickets: {
								where: {
									refCode: {
										userId: userId,
										eventId: input.eventId
									}
								}
							}
						}
					}
				}
			});

			if (!event) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'This event does not exist'
				});
			}
			if (userId === event.organizerId && input.ticketId) {
				const ticket = await ctx.prisma.ticket.findFirst({
					where: {
						id: input.ticketId
					},
					include: {
						tier: true
					}
				});

				if (ticket?.paymentIntent && ticket?.tier) {
					await stripe.refunds.create({
						payment_intent: ticket.paymentIntent,
						amount: ticket?.tier.price * 100,
						metadata: {
							ticketId: ticket.id
						}
					});
				}
				return;
			}

			const freeTicket = event.tickets.find((ticket) => ticket.tierId === null);

			if (event.tickets.length === 0) {
				return;
			}

			const lowestTierTicket = event.tickets.reduce((prev, curr) => {
				return (prev.tier?.price || Number.MAX_SAFE_INTEGER) <
					(prev.tier?.price || Number.MAX_SAFE_INTEGER)
					? prev
					: curr;
			});

			console.log(freeTicket, lowestTierTicket);
			//If user has free ticket already
			if (freeTicket) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Free ticket already exists'
				});
			}

			if (
				event.ref_quantity &&
				event._count.tickets >= event.ref_quantity &&
				lowestTierTicket.paymentIntent &&
				lowestTierTicket.tier
			) {
				console.log('214');
				await stripe.refunds.create({
					payment_intent: lowestTierTicket.paymentIntent,
					amount: lowestTierTicket.tier.price * 100,
					metadata: {
						ticketId: lowestTierTicket.id
					}
				});
			}
		}),

	getTicket: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.ticket.findMany({
			where: {
				userId: ctx.session.user.id,
				paymentIntent: {
					not: undefined
				}
			},
			include: {
				event: true,
				tier: true
			}
		});
	}),

	getTicketsAdmin: authedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const event = await ctx.prisma.event.findFirst({
				where: {
					AND: [
						{
							OR: [
								{ organizerId: ctx.session.user.id },
								{
									EventAdmin: {
										some: {
											userId: ctx.session.user.id
										}
									}
								}
							]
						},
						{
							id: input.eventId
						}
					]
				}
			});
			console.log(event);
			if (!event) {
				throw new TRPCError({
					code: 'UNAUTHORIZED'
				});
			}
			const limit = input.limit ?? 50;
			const { cursor } = input;
			const items = await ctx.prisma.ticket.findMany({
				take: limit + 1, // get an extra item at the end which we'll use as next cursor
				where: {
					eventId: input.eventId
				},
				include: {
					user: {
						select: {
							image: true,
							name: true
						}
					},
					tier: {
						select: {
							name: true
						}
					},
					event: {
						select: {
							start: true
						}
					}
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: {
					createdAt: 'asc'
				}
			});
			let nextCursor: typeof cursor | undefined = undefined;
			if (items.length > limit) {
				const nextItem = items.pop();
				nextCursor = nextItem!.id;
			}
			return {
				items,
				nextCursor
			};
		}),
	test: authedProcedure.mutation(async ({ input, ctx }) => {
		await ctx.prisma.code.updateMany({
			data: {
				tierId: 'clm57cmaz0001l108k4xsef7y',
				value: 2
			},
			where: {
				tierId: 'clmh7qxk90000lb08gfi6cchl',
				code: {
					in: ['1UFAJD', 'F3STP3', 'P2JGZ0', 'WCO608', 'EVN4PQ', 'BKP5PV']
				}
			}
		});
	}),

	validateTicket: authedProcedure
		.input(
			z.object({
				eventId: z.string(),
				ticketId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const admin = await ctx.prisma.eventAdmin.findFirst({
				where: {
					eventId: input.eventId,
					userId: ctx.session.user.id
				}
			});
			if (!admin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: `You are not an admin for this event`
				});
			}
			const ticket = await ctx.prisma.ticket.findFirst({
				where: {
					id: input.ticketId
				}
			});

			if (ticket?.checkedInAt !== null) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Already checked In'
				});
			}

			return ctx.prisma.ticket.update({
				where: {
					id: input.ticketId
				},
				data: {
					checkedInAt: new Date()
				}
			});
		}),

	getTicOrRef: authedProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			const refCode = await ctx.prisma.refCode.findFirst({
				where: {
					userId: userId,
					eventId: input.eventId
				},
				include: {
					_count: {
						select: { tickets: true }
					},
					event: true
				}
			});
			if (
				refCode &&
				refCode.event.ref_quantity &&
				refCode._count.tickets >= refCode.event.ref_quantity
			) {
				const tickets = await ctx.prisma.ticket.findMany({
					where: {
						userId: userId,
						eventId: input.eventId
					}
				});

				const freeTicket = tickets.find((ticket) => ticket.tierId === null);

				if (freeTicket) {
					return {
						type: 'none'
					};
				}
				if (tickets.length > 0) {
					return {
						type: 'refund'
					};
				}

				return {
					type: 'free'
				};
			}
			return {
				type: ':)'
			};
		})
});
