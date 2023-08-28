import { stripe } from '$lib/stripe';
import type { PageLoad } from '../test/$types';
export const load: PageLoad = async () => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 2500,
		currency: 'USD',
		automatic_payment_methods: {
			enabled: true
		}
	});
	console.log(paymentIntent);
	return {
		clientSecret: paymentIntent.client_secret,
		amount: paymentIntent.amount
	};
};
