// TODO(now): make sure this code is semantically correct


import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t, authedProcedure } from '../trpc';
import stripe from '@/utils/stripe';
import { calculateApplicationFee, calculateTicketUnitCostWithDiscount } from '@/utils/misc';
import { env } from '@/env/server.mjs';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { getPostHog } from '@/server/posthog';

const client = getPostHog();

export const paymentRouter = t.router({
	createCheckoutLink: t.procedure
		.input(
			z.object({
				eventId: z.string(),
				tiers: z.array(
					z.object({
						tierId: z.string(),
						quantity: z.number()
					})
				),
				codeIds: z.array(z.string().toUpperCase()),
				refCodeId: z.string().optional(),
				email: z.string().email().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
		
		let user = ctx.session?.user;
			if (!user) {
				if (input.email) {
					const dbUser = await ctx.prisma.user.upsert({
						where: {
							email: input.email
						},
						create: {
							email: input.email
						},
						update: {}
					});
					user = {
						id: dbUser.id,
						image: dbUser.image,
						email: dbUser.email,
						name: dbUser.name,
						role: undefined
					};
				} else {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Email needed for unauthenticated users'
					});
				}
			}

			const [event, codes] = await Promise.all([
				ctx.prisma.event.findFirst({
							where: {
								id: input.eventId,
								Tier: {
									some: {
										OR: input.tiers.map((tier) => ({
											id: tier.tierId
										}))
									}
								}
							},
							include: {
								Tier: {
									where: {
										AND: [
											{
												id: {
													in: input.tiers.map((tier) => tier.tierId)
												}
											},
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
								organizer: true,
								RefCode: {
									where: {
										code: input.refCodeId
									}
								},
								_count: {
									select: {
										forms: true
									}
								}
							}
					  })
					,
				ctx.prisma.code.findMany({
							where: {
								code: {
								  in: input.codeIds
								},
								tierId: {
									in: input.tiers.map((tier) => tier.tierId)
								}
							},
							include: {
								_count: {
									select: { tickets: true }
								}
							}
					  })
			]);
			
			if (!event) {
 			  throw new TRPCError({
 					code: 'NOT_FOUND',
 					message: 'Event not found'
   			});
			}
			
			if (!event.organizer.stripeAccountId) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Organizer has not set up Stripe'
				});
			}	
			
			//Make sure code is one-time use
			for (const code of codes) {
  			const codeTier = input.tiers.find((tier) => tier.tierId === code?.tierId);
  
  			if (codeTier && codeTier.quantity > 1) {
  				throw new TRPCError({
  					message: `Only one ticket is allowed for this code type. Code ID: ${code.id}, Tier ID: ${codeTier.tierId}`,
  					code: 'BAD_REQUEST'
  				});
  			}
			}

			console.log(event);
			const transformTiers = input.tiers
				.map((tier) => {
					const foundTier = event?.Tier.find((dbTier) => dbTier.id === tier.tierId);
					if (foundTier) {
						if (
							foundTier._count.Ticket + tier.quantity >
							(foundTier.limit ?? Number.MAX_SAFE_INTEGER)
						) {
							throw new TRPCError({
								code: 'CONFLICT',
								message: 'The ticket quantity is greater than the limit'
							});
						}
						return {
							tierName: foundTier.name,
							quantity: tier.quantity,
							tierId: foundTier.id,
							tierPrice: foundTier.price
						};
					} else {
						return null;
					}
				})
				.filter((tier) => tier !== null) as {
				tierName: string;
				quantity: number;
				tierId: string;
				tierPrice: number;
			}[];

			let total = 0;
			if (event?.Tier && event.organizer.stripeAccountId) {
				const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
				
				for (const tier of event.Tier) {
				  const code = codes.find(c => c.tierId === tier.id)
  				let remainingUsesOfCode = -1;
  				if (code) {
  					remainingUsesOfCode = code.limit - code._count.tickets;
  					console.log(code._count.tickets);
  				}
					let unit_amount = tier.price;
					if (remainingUsesOfCode > 0 && code) {
						unit_amount = calculateTicketUnitCostWithDiscount(unit_amount, code)
					}
					console.log(unit_amount, code?.type, 'line 67');
					total +=
						Number(unit_amount.toFixed(2)) *
						100 *
						(input.tiers.find((tier2) => tier2.tierId === tier.id)?.quantity || 1);
					console.log(total);
					const line_item = {
						// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
						price_data: {
							currency: 'usd',
							product_data: {
								name: tier.name || 'Free Ticket',
								...(event.image
									? {
											images: [event.image]
									  }
									: null)
							},
							unit_amount: unit_amount * 100
						},
						quantity: input.tiers.find((tier2) => tier2.tierId === tier.id)?.quantity || 1
					};
					line_items.push(line_item);
					if (code && tier.id === code.tierId) {
						remainingUsesOfCode -= 1;
					}
				}
				console.log(line_items);

				const sameOwner = user.id === input?.refCodeId;
				const ticketsToCreate: Prisma.TicketCreateManyInput[] = [];

				for (const tier of input.tiers) {
				  const code = codes.find(c => c.tierId === tier.tierId)
					for (let i = 0; i < tier.quantity; ++i) {
						if (input.eventId && user.id) {
							const ticket = {
								id: createId(),
								userId: user.id,
								eventId: event.id,
								tierId: tier.tierId,
								...(code
									? {
											codeId: code.id
									  }
									: {}),
								...(event.RefCode[0] && input.refCodeId && !sameOwner
									? {
											refCodeId: event.RefCode[0].id
									  }
									: {})
							};
							ticketsToCreate.push(ticket);
						}
					}
				}
				console.log(ticketsToCreate);

				if (event.fee_holder === 'USER') {
					line_items.push({
						price_data: {
							currency: 'usd',
							product_data: {
								name: 'Application Fee'
							},
							unit_amount: Math.ceil(calculateApplicationFee(total))
						},
						quantity: 1
					});
				}

				const return_url = new URL(`${env.NEXT_PUBLIC_URL}/tickets`);
				if (event._count.forms > 0) {
					return_url.searchParams.append('survey', event.id);
					if (user.email) {
						return_url.searchParams.append('email', user.email);
					}
				}
				
      
			 const stripeCheckoutSession = await stripe.checkout.sessions.create({
 					line_items,
 					...(user?.email ? { customer_email: user.email } : {}),
          mode: 'payment',
 					success_url: return_url.toString(),
 					cancel_url: `${ctx.headers.origin}/?canceled=true`,
 					metadata: {
						eventId: input.eventId,
						tiers: JSON.stringify(input.tiers),
						codeIds: JSON.stringify(input.codeIds),
						refCodeId: !sameOwner && input.refCodeId ? input.refCodeId : '',
						userId: user.id,
						ticketIds: JSON.stringify(ticketsToCreate.map((ticket) => ticket.id))
 					},
 					payment_intent_data: {
						application_fee_amount: Math.ceil(calculateApplicationFee(total)),
						transfer_data: {
 							destination: event.organizer.stripeAccountId
						},
						metadata: {
 							eventId: input.eventId,
 							eventName: event.name,
 							eventPhoto: event.ticketImage,
 							...(user?.email ? {
								userEmail: user.email,
								userName: user.name ?? user.email
 							} : {}),
 							tiers: JSON.stringify(transformTiers),
 							codeIds: JSON.stringify(input.codeIds),
 							refCodeId: !sameOwner && input.refCodeId ? input.refCodeId : '',
 							userId: (user?.id as string ?? ''),
 							ticketIds: JSON.stringify(ticketsToCreate.map((ticket) => ticket.id))
						}
 					},
				}, undefined);
				
				const paymentIntentId = stripeCheckoutSession.payment_intent ? (typeof stripeCheckoutSession.payment_intent === 'string' ? stripeCheckoutSession.payment_intent : stripeCheckoutSession.payment_intent.id) : null
				
        await ctx.prisma.$transaction(async (tx) => {
          if (paymentIntentId) {
            await tx.paymentIntent.create({
              data: {
                paymentIntentId,
                // TODO(now): double check this is correct
                expiresAt: new Date(stripeCheckoutSession.expires_at * 1000)
                
              }
            })
          } else {
            console.warn("Missing payment intent id - this is bad")
          }
          await tx.ticket.createMany({data: ticketsToCreate.map(t => ({...t, paymentIntentId}))});
        })
			

        // TODO: should we capture separate events for each ticket?
				client.capture({
					distinctId: user.id,
					event: 'ticket purchased',
					properties: {
						tickets: ticketsToCreate,
					}
			  });

				if (stripeCheckoutSession.url) {
					return {
						url: stripeCheckoutSession.url
					};
				} else {
					return {
						url: `${ctx.headers.origin}/?canceled=true`
					};
				}
			} else {
				throw new TRPCError({
					code: 'BAD_REQUEST'
				});
			}
		}),
	createStripeAccountLink: authedProcedure.mutation(async ({ ctx }) => {
		if (ctx.session.user.role !== 'ORGANIZER') {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You are not a seller'
			});
		}
		const seller = await ctx.prisma.organizer.findFirst({
			where: {
				id: ctx.session.user.id
			}
		});
		if (seller?.stripeAccountId) {
			const accountLink = await stripe.accounts.createLoginLink(seller.stripeAccountId);
			return accountLink;
		} else {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You have not finished the Stripe onboarding'
			});
		}
	})
});
