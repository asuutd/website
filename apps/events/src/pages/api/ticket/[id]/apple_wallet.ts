import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/server/db/client';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import { createApplePass } from '@/lib/wallets';
import { constants } from '@walletpass/pass-js';

const createApplePassRoute = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerAuthSession({ req, res });
	if (!session || !session.user) return res.status(403);

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

	if (!ticket || ticket.userId !== session.user.id) {
		return res.status(404);
	}

	const pass = await createApplePass(ticket, ticket.event, ticket.tier);
	res.setHeader('Content-Disposition', 'attachment; filename=ticket.pkpass');
	res.setHeader('Content-Type', constants.PASS_MIME_TYPE);
	res.status(200).send(pass);
};

export default createApplePassRoute;
