import { env } from '@/env/server.mjs';
import { appRouter } from '@/server/trpc/router';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
	res.status(200);
}
