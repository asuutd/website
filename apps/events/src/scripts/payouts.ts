import stripe from '@/utils/stripe';
import Stripe from 'stripe';

const args: Stripe.RequestOptions = {
  stripeAccount: ''
}

async function payoutAll() { 
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

async function getPayouts() {
  const payouts = {...await stripe.payouts.list(undefined, args), lastResponse: undefined};
  console.log(JSON.stringify(payouts, null, 2));
}

getPayouts().then(() => {console.log('done')});
// payoutAll().then(() => {console.log('done')});
