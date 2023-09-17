import { TRPCError } from '@trpc/server';
import { env } from '../../../env/server.mjs';
import stripe from '../../../utils/stripe';
import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const organizerRouter = t.router({
	createOrganizer: authedProcedure.mutation(async ({ input, ctx }) => {
		const organizer = await ctx.prisma.organizer.findFirst({
			where: {
				id: ctx.session.user.id
			},
			include: {
				user: true
			}
		});
		console.log(organizer);
		let accountId: string;
		if (organizer?.stripeAccountId) {
			accountId = organizer.stripeAccountId;
		} else {
			//Create a stripe account
			const account = await stripe.accounts.create({
				country: 'US',
				type: 'express',
				...(ctx.session.user.email ? { email: ctx.session.user.email } : {}),
				business_type: 'individual',
				individual: {
					...(ctx.session.user.email ? { email: ctx.session.user.email } : {})
				},
				business_profile: {
					name: organizer?.user.name ?? ''
				}
			});
			accountId = account.id;
			if (!organizer) {
				await ctx.prisma.organizer.create({
					data: {
						id: ctx.session.user.id,
						stripeAccountId: account.id
					}
				});
			}
		}

		//Set users role to seller and create onboarding link for stripe account
		const [accountLink] = await Promise.all([
			stripe.accountLinks.create({
				account: accountId,
				refresh_url: `${env.NEXT_PUBLIC_URL}/register?refresh=true`,
				return_url: `${env.NEXT_PUBLIC_URL}/register?return=true`,
				type: 'account_onboarding'
			})
		]);

		return {
			accountLink
		};
	}),
	getEvents: authedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.role) {
			throw new TRPCError({
				code: 'UNAUTHORIZED'
			});
		}

		return ctx.prisma.event.findMany({
			where: {
				OR: [
					{ organizerId: ctx.session.user.id },
					{
						EventAdmin: {
							some: {}
						}
					}
				]
			},
			include: {
				_count: {
					select: {
						tickets: true
					}
				}
			}
		});
	})
});
