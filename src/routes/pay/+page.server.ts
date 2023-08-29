import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session) {
		throw redirect(303, '/sign-in');
	}
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 2500,
		currency: 'USD',
		automatic_payment_methods: {
			enabled: true
		},
		metadata: {
			user_id: session.user.email
		}
	});
	console.log(paymentIntent);
	return {
		clientSecret: paymentIntent.client_secret,
		amount: paymentIntent.amount
	};
};
