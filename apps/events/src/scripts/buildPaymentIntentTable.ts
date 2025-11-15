/*
  This script populates the paymentIntent table with payment intents from 
  the ticket table. This is needed since we can't apply the foreign key 
  constraint from the Ticket table to the PaymentIntent table without 
  having the corresponding payment intents exist in the new PaymentIntent table.
*/

import stripe from '@/utils/stripe';
import type Stripe from 'stripe';
import {prisma} from '@/server/db/client';
import { PaymentIntentStatus } from '@/server/db/generated';

const getPaymentIntentIdsFromTickets = async () => {
  const intents = await prisma.ticket.findMany({
    where: {
      paymentIntent: {
        not: null
      }
    },
    select: {
      paymentIntent: true
    },
    distinct: ['paymentIntent']
  });
  return intents.map((intent) => intent.paymentIntent as string);
}
const addPaymentIntentStubsToTable = async (paymentIntentIds: string[]) => {
  await prisma.paymentIntent.createMany({
    skipDuplicates: true,
    data: paymentIntentIds.map((id) => ({
      paymentIntentId: id,
      status: PaymentIntentStatus.PENDING
    }))
  })
}


async function getPaymentIntentIdsThatNeedUpdates() {
  const intents = await prisma.paymentIntent.findMany({
    where: {
      OR: [
        {status: PaymentIntentStatus.PENDING},
        {expiresAt: null}
      ]
    },
    select: {
      paymentIntentId: true
    }
  });
  return intents.map((intent) => intent.paymentIntentId as string);
}

const stripeStatusToPaymentIntentStatus = (status: Stripe.PaymentIntent.Status) => {
  switch (status) {
    case 'succeeded':
      return PaymentIntentStatus.SUCCESS;
    case 'canceled':
      return PaymentIntentStatus.CANCELED;
    case 'processing':
      return PaymentIntentStatus.FAILED;
    default:
      return PaymentIntentStatus.PENDING;
  }
}

async function main() {
  const paymentIntentIds = await getPaymentIntentIdsFromTickets();
  console.log(`Found ${paymentIntentIds.length} payment intents`);
  await addPaymentIntentStubsToTable(paymentIntentIds);
  console.log('Added payment intent stubs to table');
  
  const intentsToUpdate = await getPaymentIntentIdsThatNeedUpdates();
  console.log(`Found ${intentsToUpdate.length} payment intents that need updates`);
  for (const intentIndex in intentsToUpdate) {
    const intentId = intentsToUpdate[intentIndex]!;
    console.log(`Getting payment intent ${intentId} (${Number(intentIndex)+1}/${intentsToUpdate.length})`);
    const intent = await stripe.paymentIntents.retrieve(intentId);
    console.log("Getting payment session")
    const paymentSessions = await stripe.checkout.sessions.list({payment_intent: intentId}).autoPagingToArray({limit: -1});
    const paymentSessionWithLatestExpiryDate = paymentSessions.reduce((prev, curr) => curr.expires_at > prev.expires_at ? curr : prev);
    
    await prisma.paymentIntent.update({
      where: {
        paymentIntentId: intentId
      },
      data: {
        status: stripeStatusToPaymentIntentStatus(intent.status),
        expiresAt: new Date(paymentSessionWithLatestExpiryDate.expires_at * 1000)
      }
    })
  }
}

main().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});