import { env } from '@/env/server.mjs';
import { appRouter } from '@/server/trpc/router';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTrpcPanel } from 'trpc-panel';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
	res.status(200).send(
		renderTrpcPanel(appRouter, {
			url: `${env.NEXT_PUBLIC_URL}/api/trpc`,
			transformer: 'superjson'
		})
	);
}
