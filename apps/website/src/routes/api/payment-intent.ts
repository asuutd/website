import { stripe } from '$lib/stripe';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './test/$types';
export const POST: RequestHandler = async () => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 2500,
		currency: 'USD',
		automatic_payment_methods: {
			enabled: true
		}
	});
	console.log(paymentIntent);
	return json({
		clientSecret: paymentIntent.client_secret,
		amount: paymentIntent.amount
	});
};
