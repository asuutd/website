import { Event } from '@prisma/client';

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
