import { kazalaClient } from '$lib/kazalaClient';
import type { PageServerLoad } from './$types';
import { EventTypes, type Event } from '$lib/validationSchemas';
import { jonzeClient } from '$lib/jonze';

export const load: PageServerLoad = async () => {

	const ASU_EVENT_ORGANIZER_IDS = ["cl981dcx80000l10asvu242yv"]
	const now = new Date()
	const [kazalaEvents, jonzeEvents] = await Promise.all([kazalaClient.event.getEvents.query(), jonzeClient.getEvents()]);

	const events: Event[] = [...kazalaEvents.upcomingEvents, ...kazalaEvents.ongoingEvents].filter((evt) => ASU_EVENT_ORGANIZER_IDS.includes(evt.organizerId)).map((evt) => ({
		id: evt.id,
		name: evt.name,
		description: evt.description,
		image: evt.image,
		link: 'https://kazala.co/events/' + evt.id,
		startDate: new Date(evt.start), 
		endDate: new Date(evt.end), 
		type: EventTypes.kazala,
	}))

	events.push(...jonzeEvents.map((evt) => ({
		id: evt.id,
		name: evt.name,
		description: evt.description,
		image: evt.image,
		link: `https://${jonzeClient.isDev ? 'dev.' : '' }jonze.co/event/attendance/${evt.id}`,
		startDate: new Date(evt.start),
		endDate: new Date(evt.end),
		type: EventTypes.jonze,
	})).filter((evt) => evt.endDate > now))


	const eventsOrderedByDateAscending = events.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

	return {
		events: eventsOrderedByDateAscending
	};
	
};
