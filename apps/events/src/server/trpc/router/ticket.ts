import { adminProcedure, authedProcedure, superAdminProcedure, t } from '../trpc';
import { z } from 'zod';
import type { Prisma } from '@/server/db/generated/client';

import { TRPCError } from '@trpc/server';
import stripe from '@/utils/stripe';
import { getPostHog } from '@/server/posthog';
import posthog from 'posthog-js';
import { generateAndSendTicketEmail, TierPurchase } from '@/lib/ticketEmail';

const client = getPostHog();

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

      posthog.capture('ticket bought', ticket);

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
  sendTicketEmail: adminProcedure
    .input(z.object({
      paymentIntent: z.string()
    }))
    .mutation(async ({ ctx, input: {paymentIntent} }) => {
      const tickets = (await ctx.prisma.ticket.findMany({
        where: {
          paymentIntent
        },
        select: {
          id: true,
          createdAt: true,
          user: true,
          tier: true,
        }
    }))
      
    console.log({tickets})
    
    if (tickets.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No tickets found for this payment intent"
      })
    }
    const orderDate = tickets[0]!.createdAt
    const user = tickets[0]!.user
    
    const ticketIds = tickets.map(t => t.id)
    if (!user) throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR"
    })
    const tiersMap = tickets.reduce((acc, curr) => {
      const tier = curr.tier
      if (!tier) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR"
      })
      
      if (!acc[curr.id]) {
        acc[curr.id] = {tierId: tier.id, tierName: tier.name, tierPrice: tier.price, quantity: 1}
      } else {
        acc[curr.id]!["quantity"] += 1
      }
      
      return acc
    }, {} as Record<string, TierPurchase>)
    
    console.log({tiersMap})
    
    const results = await generateAndSendTicketEmail(ticketIds, ctx.event.id, ctx.event.name, ctx.event.image ?? "", user?.email, user.name ?? "", orderDate, Object.values(tiersMap))
    console.log({results})
  }),
	getTicket: authedProcedure.query(({ ctx }) => {
		return ctx.prisma.ticket.findMany({
			where: {
				userId: ctx.session.user.id,
				paymentIntent: {
					not: null
				}
			},
			include: {
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

			const transaction = await ctx.prisma.$transaction([
				ctx.prisma.ticket.count({
					where: {
						eventId: input.eventId,
						tierId: {
							in:
								(input.filter?.tiers?.length ?? Number.MAX_SAFE_INTEGER) > 0
									? input.filter?.tiers
									: undefined
						},
						user: {
							email: {
								contains: input.filter?.userEmail
							}
						},
						code: {
							code: input.filter?.code
						},
						refCode: {
							code: input.filter?.refCode
						}
					}
				}),
				ctx.prisma.ticket.findMany({
					take: limit + 1, // get an extra item at the end which we'll use as next cursor
					where: {
						eventId: input.eventId,
						tierId: {
							in:
								(input.filter?.tiers?.length ?? Number.MAX_SAFE_INTEGER) > 0
									? input.filter?.tiers
									: undefined
						},
						user: {
							email: {
								contains: input.filter?.userEmail
							}
						},
						code: {
							code: input.filter?.code,
						},
						refCode: {
							code: input.filter?.refCode
						}
					},
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
								code: true,
								notes: true
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
			]);

			let nextCursor: typeof cursor | undefined = undefined;
			if (transaction[1].length > limit) {
				const nextItem = transaction[1].pop();
				nextCursor = nextItem!.id;
			}
			console.log('COUNT cnovbcoerncieornvce', transaction[0]);
			return {
				items: {
					items: transaction[1],
					tiers: transaction[2],
					count: transaction[0],
					nextCursor //Currently not accessible through React Query APIs
				},
				nextCursor
			};
		}),

	validateTicket: adminProcedure
		.input(
			z.object({
				ticketId: z.string(),
				gpsLat: z.number().min(-90).max(90).optional(),
				gpsLng: z.number().min(-180).max(180).optional(),
				imageUrl: z.string().url().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const ticket = await ctx.prisma.ticket.findFirst({
				where: {
					id: input.ticketId
				},
				include: {
					tier: true,
					user: true,
					event: true
				}
			});

			if (!ticket) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Ticket not found'
				});
			}

			const isFirstCheckIn = ticket.checkedInAt === null;
			const userAgentHeader = ctx.headers['user-agent'];
			const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader ?? null;

			const { updatedTicket, ticketScan } = await ctx.prisma.$transaction(async (tx) => {
				const createdScan = await tx.ticketScan.create({
					data: {
						ticketId: ticket.id,
						scannedByUserId: ctx.session.user.id,
						isCheckIn: isFirstCheckIn,
						gpsLat: input.gpsLat,
						gpsLng: input.gpsLng,
						imageUrl: input.imageUrl,
						userAgent: userAgent ?? undefined
					}
				});

				if (!isFirstCheckIn) {
					return {
						ticketScan: createdScan,
						updatedTicket: ticket
					};
				}

				const refreshedTicket = await tx.ticket.update({
					where: {
						id: ticket.id
					},
					data: {
						checkedInAt: new Date()
					},
					include: {
						tier: true,
						user: true,
						event: true
					}
				});

				return {
					ticketScan: createdScan,
					updatedTicket: refreshedTicket
				};
			});

			client.capture({
				distinctId: ctx.session.user.id,
				event: 'ticket scanned',
				properties: {
					ticketsuccess: updatedTicket,
					status: isFirstCheckIn ? 'checked_in' : 'duplicate'
				}
			});

			if (!isFirstCheckIn) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Already checked in'
				});
			}

			return {
				...updatedTicket,
				ticketScanId: ticketScan.id
			};
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
