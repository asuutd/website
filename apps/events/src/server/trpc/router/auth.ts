import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t, authedProcedure } from '../trpc';
import { eq } from 'drizzle-orm';
import schema from '@/server/db/drizzle/schema';

export const authRouter = t.router({
	getSession: t.procedure.query(({ ctx }) => {
		return ctx.session;
	}),
	getSecretMessage: authedProcedure.query(() => {
		return 'You are logged in and can see this secret message!';
	}),

	getAdmin: authedProcedure
		.input(
			z.object({
				ticketId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			//Get event details from ticketId
			const ticket = await ctx.drizzle.query.ticket.findFirst({
				where: eq(schema.ticket.id, input.ticketId),
				with: {
					event: true
				}
			});

			if (!ticket) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Ticket does not exist'
				});
			}

			const admin = await ctx.drizzle.query.eventAdmin.findFirst({
				where: eq(schema.eventAdmin.eventId, ticket.event.id)
			});

			if (!admin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: `You are not an admin for ${ticket.event.name}`
				});
			}

			return {
				eventId: ticket.event.id
			};
		})
});
