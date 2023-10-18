import { TRPCError } from '@trpc/server';
import { env } from '../../../env/server.mjs';
import stripe from '../../../utils/stripe';
import { authedProcedure, organizerProcedure, t } from '../trpc';
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
		const user = await ctx.prisma.user.findFirst({
			where: {
				id: ctx.session.user.id
			},
			include: {
				EventAdmin: {
					take: 1
				},
				Organizer: true
			}
		});
		console.log(user);

		if (user?.EventAdmin.length == 0 && !user.Organizer) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'You are not an event admin or organizer'
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
	}),
	createInvite: organizerProcedure
		.input(
			z.object({
				email: z.string().email('Not a valid email')
			})
		)
		.mutation(async ({ input, ctx }) => {
			const existingInvitee = await ctx.prisma.eventAdmin.findFirst({
				where: {
					user: {
						email: input.email
					}
				}
			});
			if (existingInvitee) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Collaborator already exists'
				});
			}
			const invite = await ctx.prisma.adminInvite.create({
				data: {
					eventId: input.eventId,
					email: input.email
				}
			});
			console.log(invite.token);

			return invite;
		}),
	getCollaborators: organizerProcedure.query(async ({ input, ctx }) => {
		return await ctx.prisma.eventAdmin.findMany({
			where: {
				eventId: input.eventId
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true
					}
				}
			}
		});
	}),
	removeCollaborator: organizerProcedure
		.input(
			z.object({
				userId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const collaborator = await ctx.prisma.eventAdmin.findFirstOrThrow({
				where: {
					userId: input.userId
				}
			});
			console.log(collaborator);
			const deletedColaborator = await ctx.prisma.eventAdmin.delete({
				where: {
					id: collaborator.id
				}
			});
			return;
		})
});
