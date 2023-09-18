// src/server/trpc/router/index.ts
import { t } from '../trpc';
import { exampleRouter } from './example';
import { authRouter } from './auth';
import { ticketRouter } from './ticket';
import { codeRouter } from './code';
import { tierRouter } from './tier';
import { eventRouter } from './event';
import { organizerRouter } from './organizer';
import { paymentRouter } from './payment';

export const appRouter = t.router({
	example: exampleRouter,
	auth: authRouter,
	ticket: ticketRouter,
	code: codeRouter,
	tier: tierRouter,
	event: eventRouter,
	organizer: organizerRouter,
	payment: paymentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
