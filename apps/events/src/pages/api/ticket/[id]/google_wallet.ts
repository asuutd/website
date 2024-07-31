import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/server/db/client';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';
import { createGooglePassObject, googlePassJwtToSaveUrl, googlePassClass, createOrUpdateGooglePassClass } from '@/lib/wallets';
import { env } from '@/env/server.mjs';

const createGooglePassRoute = async (req: NextApiRequest, res: NextApiResponse) => {
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
	
	if (!ticket.event.google_pass_class_created) {
	  await createOrUpdateGooglePassClass(ticket.event)
		await prisma.event.update({
      where: {
        id: ticket.event.id
      },
      data: {
        google_pass_class_created: true
      }
    })
	}
	
	const jwt = createGooglePassObject(ticket, googlePassClass(ticket.event), ticket.tier)
	const url = googlePassJwtToSaveUrl(jwt)
	return res.redirect(url)
};

export default createGooglePassRoute;
