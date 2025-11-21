import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/server/db/client';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import { createApplePass } from '@/lib/wallets';
import { constants } from '@walletpass/pass-js';
import { env } from '@/env/server.mjs';

const createApplePassRoute = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerAuthSession({ req, res });
	if (!session || !session.user) {
		const redirectDestination = new URL(env.NEXT_PUBLIC_URL + '/signin')
		redirectDestination.searchParams.set("callbackUrl", req.url as string)
		res.redirect(redirectDestination.toString())
		return
	}

	const id = req.query.id as string;
	const ticket = await prisma.ticket.findUnique({
		where: {
			id
		},
		include: {
			user: true,
			event: {
				include: {
					location: true,
					organizer: {
						include: { user: true }
					}
				}
			},
			tier: true
		}
	});

	if (!ticket || !ticket.event) {
		return res.status(404).send({ err: 'Not found' });
	}
	
	if (ticket.userId !== session.user.id) {
	 return res.redirect(env.NEXT_PUBLIC_URL + '/tickets')
	}

	const { pass, filename } = await createApplePass(ticket, ticket.event, ticket.tier);
	
	res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
	res.setHeader('Content-Type', constants.PASS_MIME_TYPE);
	res.status(200).send(pass);
};

export default createApplePassRoute;
