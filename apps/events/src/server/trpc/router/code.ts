import { adminProcedure, authedProcedure, t } from '../trpc';
import { z } from 'zod';
import generateCode from '../../../utils/generateCode';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const codeRouter = t.router({
	getCode: authedProcedure
		.input(
			z.object({
				code: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			//const userId = ctx.session.user.id;
			const code = await ctx.prisma.code.findFirst({
				where: {
					code: input.code
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
	getCodes: adminProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {

			return await ctx.prisma.code.findMany({
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
			});
		}),
	getReferralCodesAdmin: adminProcedure
		.input(
			z.object({
				eventId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const {event} = ctx
			if (!event.ref_quantity || event.ref_quantity === 0) {
				throw new TRPCError({
					code: 'PRECONDITION_FAILED'
				});
			}

			return await ctx.prisma.refCode.findMany({
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
			});
		}),
	createCode: adminProcedure
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
