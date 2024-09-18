import stripe from '@/utils/stripe';
import Stripe from 'stripe';

const args: Stripe.RequestOptions = {
  stripeAccount: ''
}

async function main() { 
  const balances = {...await stripe.balance.retrieve(undefined, args), lastResponse: undefined};
  console.log(JSON.stringify(balances, null, 2));
  
  for (const a of balances.available) {
    const payoutParams = {...a, source_types: undefined};
    const payout = {
      ...await stripe.payouts.create(payoutParams, args),
       lastResponse: undefined
    }
    console.log(JSON.stringify(payout, null, 2));
  }
  
}

main().then(() => {
  console.log('done');
});
