import { Event, Ticket, Code } from '@prisma/client';


export const calculateTicketDiscount = (ticketUnitCost: number, code: Code) => {
	if (code.type === 'percent') {
		console.log(code.value);
		return (1 - code.value) * ticketUnitCost;
	} else if (code.type === 'flat') {
		return ticketUnitCost - code.value;
	} else {
		throw new Error("Saw unexpected code type")
	}
}

export const calculateApplicationFee = (total: number): number => {
  const KAZALA_TRANSACTION_FEE_PERCENTAGE = 0.065
  const KAZALA_TRANSACTION_FEE_CENTS = 80
  
	const fee = KAZALA_TRANSACTION_FEE_PERCENTAGE * total + KAZALA_TRANSACTION_FEE_CENTS;
	return fee;
};

export function isValidHttpUrl(string: string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export function splitEvents(events: Event[]) {
	const now = new Date();
	const ongoingEvents: Event[] = [];
	const upcomingEvents: Event[] = [];

	events.forEach((event) => {
		if (event.start <= now && now <= event.end) {
			ongoingEvents.push(event);
		} else if (event.start > now) {
			upcomingEvents.push(event);
		}
	});

	return { ongoingEvents, upcomingEvents };
}



export function ticketIsValid(ticket: Ticket) {
  /*
    This function checks if a ticket is valid (i.e. it has been paid for and is able to be scanned).
    
    TODO: Use this function everywhere instead of checking if paymentIntent is null
  */
  return !!ticket.paymentIntent;
  
  // // TODO: use this new logic
  // if (!ticket.paymentIntent) return false;
  // return ticket.paymentIntentObject.status === 'succeeded'
}