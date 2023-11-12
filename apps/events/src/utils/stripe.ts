import Stripe from 'stripe';
import { env } from '../env/server.mjs';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
});
export default stripe;

export const calculateApplicationFee = (total: number): number => {
	const fee = 0.032 * total + 50;
	console.log(total, fee);
	return 0.032 * total + 50;
};
