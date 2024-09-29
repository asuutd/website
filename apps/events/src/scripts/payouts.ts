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
  const payouts = await stripe.payouts.list(undefined, args).autoPagingToArray({limit: -1})
  for (const payout of payouts) {
    const jsDate = new Date(payout.arrival_date * 1000)
    console.log({...payout, human_arrival_date: jsDate.toLocaleDateString() + " " + jsDate.toLocaleTimeString()})
  }
}

getPayouts().then(() => {console.log('done')});
// payoutAll().then(() => {console.log('done')});