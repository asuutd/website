import { stripe } from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		// TODO log the user in
		console.log('HMMMM');
		const data = await event.request.formData();
		const email = data.get('email');
		if (typeof email !== 'string') {
			throw Error('Invalid String');
		}
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'ASU Membership'
						},
						unit_amount: 20 * 100
					},
					quantity: 1
				}
			],
			customer_email: email,
			mode: 'payment',
			success_url: `${import.meta.env.VITE_PUBLIC_URL}`,
			cancel_url: `${import.meta.env.VITE_PUBLIC_URL}/pay`
		});
		throw redirect(302, session.url);
	}
} satisfies Actions;
