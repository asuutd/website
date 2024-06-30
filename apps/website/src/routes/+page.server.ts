// import { events } from '../../drizzle/schema';
// import { db } from '../lib/db';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, platform }) => {
	try {
		// TODO: Replace this with events from Jonze
		// const dbEvents = await db.select().from(events).orderBy(events.importance).limit(4);

		return {
			events: []
		};
	} catch (err) {
		return {
			events: []
		};
	}
};
