import { superAdminProcedure, authedProcedure, t } from '../trpc';
import { z } from 'zod';
import generateCode from '../../../utils/generateCode';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { alias } from 'drizzle-orm/mysql-core';
import { refCode as refCodeSchema } from '@/server/db/drizzle/schema/refcode';
import { ticket } from '@/server/db/drizzle/schema/ticket';
import { event as eventSchema } from '@/server/db/drizzle/schema/event';
import { eq } from 'drizzle-orm';
import { user } from '@/server/db/drizzle/schema/user';
import _ from 'lodash';
import { inspect } from 'util';
import schema from '@/server/db/drizzle/schema';

export const codeRouter = t.router({
	getCode: t.procedure
		.input(
			z.object({
				code: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			//const userId = ctx.session.user.id;
			const code = await ctx.prisma.code.findFirst({
				where: {
					code: input.code.toUpperCase()
				},
				include: {
					tier: true,
					_count: {
						select: { tickets: true }
					}
				}
			});

			return code;
		}),
	getCodes: superAdminProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			type Tier = typeof schema.tier.$inferSelect;
			type Code = typeof schema.code.$inferSelect;

			const rows = await ctx.drizzle
				.select()
				.from(schema.code)
				.innerJoin(schema.tier, eq(schema.code.tierId, schema.tier.id))
				.leftJoin(schema.ticket, eq(schema.code.id, schema.ticket.codeId))
				.where(eq(schema.tier.eventId, input.eventId));

			console.log(rows);

			const result = rows.reduce<
				Record<
					string,
					Code & {
						tier: Tier;
						_count: {
							tickets: number;
						};
					}
				>
			>((acc, row) => {
				const code = row.Code;
				if (!acc[code.id]) {
					acc[code.id] = {
						...code,
						tier: row.Tier,
						_count: {
							tickets: 0
						}
						// Add other properties if needed
					};
				} else {
					const found = acc[code.id];
					if (found) {
						found._count.tickets++;
					}
					// Add other logic if needed
				}

				return acc;
			}, {});

			/* 			const prismaQuery = await ctx.prisma.code.findMany({
				where: {
					tier: {
						eventId: input.eventId
					}
				},
				include: {
					_count: {
						select: {
							tickets: true
						}
					},
					tier: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}); */

			return Object.values(result);
		}),
	getReferralCodesAdmin: superAdminProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			type User = typeof user.$inferSelect;
			type RefCode = typeof refCodeSchema.$inferSelect;
			type Ticket = typeof ticket.$inferSelect;
			const { event } = ctx;
			if (!event.refQuantity || event.refQuantity === 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED'
				});
			}

			const referrer = alias(user, 'referrer');
			const referred = alias(user, 'referred');

			/* 			const xc = await ctx.prisma.refCode.findMany({
				where: {
					eventId: input.eventId,
					tickets: {
						some: {}
					}
				},
				include: {
					_count: {
						select: {
							tickets: true
						}
					},
					user: {
						select: {
							name: true,
							image: true
						}
					},
					tickets: {
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

			const referrals = await ctx.drizzle.query.refCode.findMany({
				where: eq(schema.refCode.eventId, input.eventId),
				with: {
					user: {
						columns: {
							name: true,
							image: true
						}
					},
					tickets: {
						with: {
							user: {
								columns: {
									name: true,
									image: true
								}
							}
						}
					}
				}
			});

			//Filter referral codes that have no usage
			return referrals.filter((referral) => referral.tickets.length > 0);
		}),
	createCode: superAdminProcedure
		.input(
			z.object({
				num_codes: z.number().default(1),
				tierId: z.string(),
				type: z.string().default('percent'),
				limit: z.number(),
				value: z.number(),
				notes: z.string(),
				eventId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			//const userId = ctx.session.user.id;
			const tier = await ctx.prisma.tier.findFirst({
				where: {
					id: input.tierId
				},
				include: {
					event: true
				}
			});

			if (!tier) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid tier'
				});
			}

			if (input.type === 'flat' && input.value > tier.price) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Discount more than ticket price'
				});
			}
			const codeData: Prisma.CodeCreateManyInput[] = [];
			for (let i = 0; i < input.num_codes; ++i) {
				codeData.push({
					tierId: input.tierId,
					type: input.type,
					limit: input.limit,
					value: input.value,
					code: generateCode(6),
					notes: input.notes
				});
			}
			const code = await ctx.prisma.code.createMany({
				data: codeData
			});
		}),
	createReferalCode: authedProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.user.id;
			try {
				const code = await ctx.prisma.refCode.create({
					data: {
						userId: userId,
						eventId: input.eventId,
						code: generateCode(6)
					},
					include: {
						event: true
					}
				});
				return { code: code.code, ref_req: code.event.ref_quantity, ref_completed: 0 };
			} catch (err) {
				if (err instanceof Prisma.PrismaClientKnownRequestError) {
					if (err.code === 'P2002') {
						const code = await ctx.prisma.refCode.findFirst({
							where: {
								userId: userId,
								eventId: input.eventId
							},
							include: {
								event: true,
								_count: {
									select: { tickets: true }
								}
							}
						});
						if (code) {
							return {
								code: code.code,
								ref_req: code.event.ref_quantity,
								ref_completed: code._count.tickets
							};
						} else {
							return { code: ':)' };
						}
					} else {
						return { code: err.code };
					}
				} else {
					return { code: ':(' };
				}
			}
		}),
	getMyRefCodes: authedProcedure
		.input(
			z.object({
				eventId: z.string().nullish()
			})
		)
		.query(({ ctx, input }) => {
			return ctx.prisma.refCode.findMany({
				where: {
					userId: ctx.session.user.id,
					...(input.eventId ? { eventId: input.eventId } : {})
				},
				include: {
					_count: {
						select: { tickets: true }
					}
				}
			});
		})
});
