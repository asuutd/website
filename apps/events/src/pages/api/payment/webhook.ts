import { Prisma } from '@prisma/client';
import { StripeError } from '@stripe/stripe-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { request } from 'node:http';
import { buffer } from 'node:stream/consumers';
import Stripe from 'stripe';
import { env } from '../../../env/server.mjs';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session.js';
import { prisma } from '../../../server/db/client';
import stripe from '@/utils/stripe';
import { NextResponse } from 'next/server';
import Transaction from './emails/transaction'
import { Resend } from 'resend'
import exp from 'node:constants';



const resend = new Resend(env.RESEND_API_KEY); 

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

					// // Send the email to the buyer
					// const emailTemplate = createEmailTemplate('URL_TO_PURCHASE_DETAILS'); // Replace with the actual URL
					// resend.sendEmail({
					// 	from: 'onboarding@resend',
					// 	to: 'buyer-email@example.com', // Replace with the buyer's email
					// 	subject: 'Purchase Successful',
					// 	html: emailTemplate,
					// });

					
					try{
						if (userEmail && userName && eventName  && eventPhoto){
							const data = await resend.sendEmail({
								from: 'ticket@mails.kazala.co',
								to: userEmail, // Replace with the buyer's email
								subject: `Your Tickets for ${eventName} are in!`,
								react: Transaction({
									user_name: userName,
									event_name: eventName,
									event_photo: eventPhoto,
									order_date: new Date().toLocaleDateString(),
									tiers: tiers
								}),
							})
						}
					} catch (error) {
						console.error(error)
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
				//Fix up refunds. Should differentiate between
				case 'charge.refunded':
					const chargeData = event.data.object as Stripe.Charge;
					console.log(chargeData.metadata.ticketId);

					if (chargeData.refunds) {
						const ticketIds = chargeData.refunds.data.map((data) => data.metadata?.ticketId);
						const result = await prisma.ticket.update({
							where: {
								id: ticketIds[0]
							},
							data: {
								tierId: null
							}
						});
						res.status(200).json({ received: true, result: result, tickets: ticketIds[0] });
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
