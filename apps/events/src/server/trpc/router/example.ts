import { authedProcedure, t } from '../trpc';
import { z } from 'zod';

export const exampleRouter = t.router({
	hello: authedProcedure
		.input(z.object({ text: z.string().nullish() }).nullish())
		.query(async ({ input, ctx }) => {
			const result = await ctx.drizzle.query.ticket.findMany({
				where: (ticket, { eq }) => eq(ticket.userId, ctx.session.user.id)
			});
			console.log(result);
			return result;
		}),
	getAll: t.procedure.query(({ ctx }) => {
		return ctx.prisma.example.findMany();
	})
});
