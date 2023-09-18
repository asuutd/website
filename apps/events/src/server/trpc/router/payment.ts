import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t, authedProcedure } from '../trpc';
import stripe, { calculateApplicationFee } from '@/utils/stripe';
import { env } from '@/env/server.mjs';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

export const paymentRouter = t.router({
	createCheckoutLink: authedProcedure
		.input(
			z.object({
				eventId: z.string(),
				tiers: z.array(
					z.object({
						tierId: z.string(),
						quantity: z.number()
					})
				),
				codeId: z.string().optional(),
				refCodeId: z.string().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const [event, code] = await Promise.all([
				input.eventId
					? ctx.prisma.event.findFirst({
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
								}
							}
					  })
					: null,
				input.codeId
					? ctx.prisma.code.findFirst({
							where: {
								code: input.codeId
							},
							include: {
								_count: {
									select: { tickets: true }
								}
							}
					  })
					: null
			]);
			console.log(event);
			input.tiers.forEach((tier) => {
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
				}
			});

			let total = 0;
			if (event?.Tier && event.organizer?.stripeAccountId) {
				const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
				let remaining = 0;
				if (code) {
					remaining = code.limit - code._count.tickets;
					console.log(code._count.tickets);
				}
				event.Tier.forEach((tier) => {
					let unit_amount = tier.price;
					if (remaining > 0 && code && input.codeId && tier.id === code.tierId) {
						console.log(code, input.codeId);
						if (code.type === 'percent') {
							unit_amount = (1 - code.value) * tier.price;
						} else if (code.type === 'flat') {
							unit_amount = tier.price - code.value;
						}
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
						remaining -= 1;
					}
				});
				console.log(line_items);

				const sameOwner = ctx.session.user.id === input?.refCodeId;
				const dataArray: Prisma.TicketCreateManyInput[] = [];

				for (const tier of input.tiers) {
					for (let i = 0; i < tier.quantity; ++i) {
						if (input.eventId && ctx.session.user.id) {
							const ticket = {
								id: cuid(),
								userId: ctx.session.user.id,
								eventId: input.eventId,
								tierId: tier.tierId,
								...(code //Make sure to change this. Code should be serched before creating ticket
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
							dataArray.push(ticket);
						}
					}
				}
				console.log(dataArray);
				await ctx.prisma.ticket.createMany({
					data: dataArray
				});

				const session = await stripe.checkout.sessions.create({
					line_items: line_items,
					...(ctx.session.user?.email ? { customer_email: ctx.session.user.email } : {}),
					mode: 'payment',
					success_url: `${env.NEXT_PUBLIC_URL}/tickets`,
					cancel_url: `${ctx.headers.origin}/?canceled=true`,
					metadata: {
						eventId: input.eventId,
						tiers: JSON.stringify(input.tiers),
						codeId: input.codeId ?? '',
						refCodeId: input.refCodeId ?? '',
						userId: ctx.session.user.id,
						ticketIds: JSON.stringify(dataArray.map((ticket) => ticket.id))
					},
					payment_intent_data: {
						application_fee_amount: Math.ceil(calculateApplicationFee(total)),
						transfer_data: {
							destination: event.organizer.stripeAccountId
						},
						metadata: {
							eventId: input.eventId,
							tiers: JSON.stringify(input.tiers),
							codeId: input.codeId ?? '',
							refCodeId: input.refCodeId ?? '',
							userId: ctx.session.user.id,
							ticketIds: JSON.stringify(dataArray.map((ticket) => ticket.id))
						}
					},
					expires_at: Math.floor(Date.now() / 1000) + 30 * 60
				});
				if (session.url) {
					return {
						url: session.url
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
