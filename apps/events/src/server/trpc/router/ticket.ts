import { adminProcedure, authedProcedure, superAdminProcedure, t } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { env } from '../../../env/server.mjs';
import { TRPCError } from '@trpc/server';
import stripe from '../../../utils/stripe';
import { and, count, eq, gt, inArray, isNotNull, like, not, sql } from 'drizzle-orm';
import { event as eventSchema } from '@/server/db/drizzle/schema/event';
import { ticket as ticketSchema } from '@/server/db/drizzle/schema/ticket';
import { organizer } from '@/server/db/drizzle/schema/organizer';
import { FilterRuleName } from '@aws-sdk/client-s3';
import { user } from '@/server/db/drizzle/schema/user';
import { code } from '@/server/db/drizzle/schema/code';
import { refCode } from '@/server/db/drizzle/schema/refcode';
import { tier } from '@/server/db/drizzle/schema/tier';
import { eventAdmin } from '@/server/db/drizzle/schema/eventadmin';

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
							ticketIds: ticket.id
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

	getTicket: authedProcedure.query(async ({ ctx }) => {
		return await ctx.drizzle.query.ticket.findMany({
			where: and(
				eq(ticketSchema.userId, ctx.session.user.id),
				isNotNull(ticketSchema.paymentIntent)
			),
			with: {
				event: true,
				tier: true
			}
		});
	}),

	getTicketsAdmin: superAdminProcedure
		.input(
			z.object({
				limit: z.number().min(1).nullish(),
				cursor: z.string().nullish(),
				filter: z
					.object({
						tiers: z.array(z.string()).optional(),
						userEmail: z.string().optional(),
						code: z.string().optional(),
						refCode: z.string().optional()
					})
					.optional(),
				orderBy: z
					.object({
						createdAt: z.enum(['asc', 'desc']).default('asc'),
						checkedInAt: z.enum(['asc, desc'])
					})
					.optional()
			})
		)
		.query(async ({ input, ctx }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;
			console.log(cursor);

			const transaction = await Promise.all([
				ctx.drizzle
					.select({
						count: count()
					})
					.from(ticketSchema)
					.leftJoin(user, eq(user.id, ticketSchema.userId))
					.leftJoin(code, eq(code.id, ticketSchema.codeId))
					.leftJoin(refCode, eq(refCode.id, ticketSchema.refCodeId))

					.where(
						and(
							eq(ticketSchema.eventId, input.eventId),
							input.filter?.userEmail ? like(user.email, `${input.filter.userEmail}%`) : undefined,
							input.filter?.tiers && (input.filter?.tiers?.length ?? Number.MAX_SAFE_INTEGER) > 0
								? inArray(ticketSchema.tierId, input.filter.tiers)
								: undefined,

							input.filter?.code ? eq(code.code, input.filter.code) : undefined,
							input.filter?.refCode ? eq(refCode.code, input.filter.refCode) : undefined
						)
					),
				ctx.drizzle
					.select({
						id: ticketSchema.id,
						userId: ticketSchema.userId,
						tierId: ticketSchema.tierId,
						eventId: ticketSchema.eventId,
						codeId: ticketSchema.codeId,
						refCodeId: ticketSchema.refCodeId,
						checkedInAt: ticketSchema.checkedInAt,
						createdAt: ticketSchema.createdAt,
						paymentIntent: ticketSchema.paymentIntent,
						user: {
							id: user.id,
							name: user.name,
							image: user.image,
							email: user.email
						},
						tier: {
							id: tier.id,
							name: tier.name
						},
						code: {
							id: code.id,
							code: code.code
						},
						refCode: {
							id: refCode.id,
							refCode: refCode.code
						},
						event: {
							id: eventSchema.id,
							start: eventSchema.start
						}
					})
					.from(ticketSchema)
					.leftJoin(user, eq(user.id, ticketSchema.userId))
					.leftJoin(code, eq(code.id, ticketSchema.codeId))
					.leftJoin(refCode, eq(refCode.id, ticketSchema.refCodeId))
					.leftJoin(tier, eq(tier.id, ticketSchema.tierId))
					.leftJoin(eventSchema, eq(eventSchema.id, ticketSchema.eventId))
					.where(
						and(
							eq(ticketSchema.eventId, input.eventId),
							input.filter?.userEmail ? like(user.email, `${input.filter.userEmail}%`) : undefined,
							input.filter?.tiers && (input.filter?.tiers?.length ?? Number.MAX_SAFE_INTEGER) > 0
								? inArray(ticketSchema.tierId, input.filter.tiers)
								: undefined,

							input.filter?.code ? eq(code.code, input.filter.code) : undefined,
							input.filter?.refCode ? eq(refCode.code, input.filter.refCode) : undefined
						)
					)
					.orderBy(ticketSchema.createdAt)
					.limit(limit + 1),
				ctx.drizzle.query.tier.findMany({
					where: eq(tier.eventId, input.eventId),
					columns: {
						id: true,
						name: true
					}
				})
			]);

			/* const transaction2 = await ctx.prisma.$transaction([
				ctx.prisma.ticketSchema.count({
					where: filter
				}),
				ctx.prisma.ticketSchema.findMany({
					take: limit + 1, // get an extra item at the end which we'll use as next cursor
					where: filter,
					include: {
						user: {
							select: {
								image: true,
								name: true,
								email: true
							}
						},
						tier: {
							select: {
								name: true,
								id: true
							}
						},
						code: {
							select: {
								code: true
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
				}),
				ctx.prisma.tier.findMany({
					where: {
						eventId: input.eventId
					},
					select: {
						id: true,
						name: true
					}
				})
			]); */

			let nextCursor: typeof cursor | undefined = undefined;
			if (transaction[1].length > limit) {
				const nextItem = transaction[1].pop();
				nextCursor = nextItem!.id;
			}
			console.log(transaction[1]);
			console.log('COUNT cnovbcoerncieornvce', transaction[0]);
			return {
				items: {
					items: transaction[1],
					tiers: transaction[2],
					count: transaction[0][0]?.count ?? 0,
					nextCursor //Currently not accessible through React Query APIs
				},
				nextCursor
			};
		}),

	validateTicket: authedProcedure
		.input(
			z.object({
				eventId: z.string(),
				ticketId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const admin = await ctx.drizzle.query.eventAdmin.findFirst({
				where: and(
					eq(eventAdmin.eventId, input.eventId),
					eq(eventAdmin.userId, ctx.session.user.id)
				)
			});
			if (!admin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: `You are not an admin for this event`
				});
			}
			const ticket = await ctx.drizzle.query.ticket.findFirst({
				where: eq(ticketSchema.id, input.ticketId)
			});

			if (ticket?.checkedInAt !== null) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Already checked In'
				});
			}

			return ctx.drizzle
				.update(ticketSchema)
				.set({
					checkedInAt: new Date()
				})
				.where(eq(ticketSchema.id, input.ticketId));
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
