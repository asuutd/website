import Stripe from 'stripe';
import { env } from '../env/server.mjs';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
});
export default stripe;
