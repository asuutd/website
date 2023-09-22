// src/server/router/context.ts
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { Session } from 'next-auth';
import { getServerAuthSession } from '../common/get-server-auth-session';
import { prisma } from '../db/client';
import { drizzle } from '../db/drizzle/index';
import { IncomingHttpHeaders } from 'http';

type CreateContextOptions = {
	session: Session | null;
	headers: IncomingHttpHeaders;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		prisma,
		drizzle,
		headers: opts.headers
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
	const { req, res } = opts;
	const headers = req.headers;

	// Get the session from the server using the unstable_getServerSession wrapper function
	const session = await getServerAuthSession({ req, res });

	return await createContextInner({
		session,
		headers: headers
	});
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
