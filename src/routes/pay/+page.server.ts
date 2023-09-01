import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();
	const user_id = url.searchParams.get('email') ?? session?.user.email;
	if (user_id) {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 2500,
			currency: 'USD',
			automatic_payment_methods: {
				enabled: true
			},
			metadata: {
				user_id: url.searchParams.get('email') ?? session?.user.email
			}
		});
		console.log(paymentIntent);
		return {
			clientSecret: paymentIntent.client_secret,
			amount: paymentIntent.amount
		};
	}
	return {
		clientSecret: '',
		amount: ''
	};
};
