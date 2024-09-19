import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'node:stream/consumers';
import Stripe from 'stripe';
import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';
import stripe from '@/utils/stripe';
import Transaction from '@/lib/emails/transaction';
import { Resend } from 'resend';
import { uploadImage } from '@/utils/r2';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { getPostHog } from '@/server/posthog';

const resend = new Resend(env.RESEND_API_KEY);
const client = getPostHog();

export const config = {
	api: {
		bodyParser: false
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == 'POST') {
		const sig = req.headers['stripe-signature'];
		const buf = await buffer(req);
		const sigString: string = typeof sig === 'string' ? sig : sig == undefined ? ':)' : sig[0]!;

		let event: Stripe.Event;
		console.log(env.WEBHOOK_SECRET, sigString);

		try {
			event = stripe.webhooks.constructEvent(buf, sigString, env.WEBHOOK_SECRET);
		} catch (err: any) {
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
		try {
			switch (event.type) {
				case 'payment_intent.succeeded':
					console.log('HERE');
					const paymentIntentData = event.data.object as Stripe.PaymentIntent;
					const metadata = paymentIntentData.metadata;
					const tiers = JSON.parse(metadata.tiers ?? '{}');
					const dataArray: string[] = [];
					const userId = metadata.userId;

					const eventName = metadata.eventName;
					const eventId = metadata.eventId;
					const userEmail = metadata.userEmail;
					const userName = metadata.userName;
					const eventPhoto = metadata.eventPhoto;
					const user_ticket_ids = metadata.ticketIds && JSON.parse(metadata.ticketIds);
					console.log(user_ticket_ids);

					//Update the payment intent data

					const ticket = await prisma.ticket.updateMany({
						where: {
							id: {
								in: user_ticket_ids
							}
						},
						data: {
							paymentIntent: paymentIntentData.id
						}
					});

					try {
						if (userEmail && userName && eventName && eventPhoto && eventId) {
							const qr_code_links = await Promise.all(
								user_ticket_ids.map(async (ticketId: string) => {
									const result = await uploadImage({
										bucket: env.QRCODE_BUCKET,
										key: `${ticketId}`,
										body: await QRCode.toBuffer(
											`${env.NEXT_PUBLIC_URL}/tickets/validate?id=${ticketId}&eventId=${eventId}`,
											{
												width: 400,
												margin: 1
											}
										),
										contentType: 'image/png'
									});
									console.log(result);
									return {
										codeImg: `https://${env.QRCODE_BUCKET}.kazala.co/${ticketId}`,
										googleWalletLink: `https://${env.NEXT_PUBLIC_URL}/api/ticket/${ticketId}/google_wallet`,
										appleWalletLink: `https://${env.NEXT_PUBLIC_URL}/api/ticket/${ticketId}/apple_wallet`
									};
								})
							);

							const ticketData = await prisma.ticket.findMany({
								where: {
									id: { in: user_ticket_ids }
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

							const posthog = getPostHog();
							const uid = ticketData[0]?.user.id;

							const data = await resend.sendEmail({
								from: 'Kazala Tickets <ticket@mails.kazala.co>',
								to: userEmail, // Replace with the buyer's email
								subject: `Your Tickets for ${eventName} are in!`,
								react: Transaction({
									user_name: userName,
									event_name: eventName,
									event_photo: eventPhoto,
									order_date: new Date().toLocaleDateString(),
									tiers: tiers,
									tickets: qr_code_links,
									baseUrl: env.NEXT_PUBLIC_URL,
									googleWalletEnabled: uid
										? (await posthog.isFeatureEnabled('google-wallet-pass-generation', uid)) ??
										  false
										: false
								}),
								headers: {
									'X-Entity-Ref-ID': uuidv4()
								}
							});
						}
					} catch (error) {
						console.error(error);
					}

					if (userId){
						client.capture({
						distinctId: userId,
						event: 'ticket purchased',
						properties: {
							//ticket id
							ticket_ids : user_ticket_ids,
							quantity : user_ticket_ids.length,
						}
					  });
				  
					  //await client.shutdownAsync()
					}

					res.status(200).json({ received: true });
					break;
				case 'checkout.session.expired':
					const checkoutData = event.data.object as any;

					const checkoutMetadata = checkoutData.metadata as Record<string, string | undefined>;
					const ticketIds = checkoutMetadata.ticketIds && JSON.parse(checkoutMetadata.ticketIds);
					await prisma.ticket.deleteMany({
						where: {
							id: {
								in: ticketIds
							}
						}
					});
					res.status(200).send('Noice');
					break;
				//For now, Do nothing to their ticket.
				//FUTURE: Add conditions for refund. To enable manual refund in admin dashboard
				case 'charge.refunded':
					const chargeData = event.data.object as Stripe.Charge;
					console.log(chargeData.metadata.ticketId);

					if (chargeData.refunds) {
						const ticketIds = chargeData.refunds.data.map((data) => data.metadata?.ticketId);

						res.status(200).json({ received: true, tickets: ticketIds[0] });
					} else {
						res.status(200).json({
							received: true,
							message: 'PLEASE GOD'
						});
					}

					break;
				default:
					console.log(`Unhandled event type ${event.type}`);
			}
		} catch (err: any) {
			if (err instanceof Stripe.errors.StripeError) {
				res.status(err.statusCode || 500).json(err.message);
			} else {
				res.status(500);
			}
		}
	} else {
		res.status(405);
	}
}
