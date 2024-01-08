import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { event as dbEvent } from '@/server/db/drizzle/schema/event';

//Accessible to all requests
export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	}
});

//Only accessible if the person to logged in
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			...ctx,
			// infers that `session` is non-nullable to downstream resolvers
			session: { ...ctx.session, user: ctx.session.user }
		}
	});
});

//Only accessible if the person is an admin or organizer
export const adminProcedure = authedProcedure
	.input(z.object({ eventId: z.string() }))
	.use(async ({ ctx, next, input }) => {
		const event = await ctx.drizzle.query.event.findFirst({
			where: eq(dbEvent.id, input.eventId),
			with: {
				admins: true,
				tiers: true
			}
		});

		if (!event) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Event not found'
			});
		}

		if (
			event.organizerId === ctx.session.user.id ||
			event.admins.find((admin) => admin.userId === ctx.session.user.id)
		) {
			return next({
				ctx: {
					...ctx,
					event
				}
			});
		} else {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
	});

export const superAdminProcedure = authedProcedure
	.input(z.object({ eventId: z.string() }))
	.use(async ({ ctx, next, input }) => {
		const event = await ctx.drizzle.query.event.findFirst({
			where: eq(dbEvent.id, input.eventId),
			with: {
				admins: true,
				tiers: true
			}
		});

		if (!event) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Event not found'
			});
		}

		const admin = event.admins.find(
			(admin) =>
				admin.userId === ctx.session.user.id &&
				(admin.role === 'SUPER_ADMIN' || admin.role === 'OWNER')
		);
		console.log(admin);
		if (event.organizerId === ctx.session.user.id || admin) {
			return next({
				ctx: {
					...ctx,
					event,
					admin
				}
			});
		} else {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
	});

//Only accessible if the person is an organizer
export const organizerProcedure = authedProcedure
	.input(z.object({ eventId: z.string() }))
	.use(async ({ ctx, next, input }) => {
		const event = await ctx.drizzle.query.event.findFirst({
			where: eq(dbEvent.id, input.eventId),
			with: {
				admins: true,
				tiers: true
			}
		});

		if (!event) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Event not found'
			});
		}

		if (event.organizerId === ctx.session.user.id) {
			return next({
				ctx: {
					...ctx,
					event
				}
			});
		} else {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
	});
