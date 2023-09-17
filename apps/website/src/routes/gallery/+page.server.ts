import { events } from 'drizzle/schema';
import { db } from '$lib/db';
import type { PageServerLoad } from './$types';
import { desc } from 'drizzle-orm';
export const load: PageServerLoad = async ({ params }) => {
	const dbEventsPromise = db.select().from(events).orderBy(desc(events.date));
	return {
		streamed: {
			dbPromise: dbEventsPromise
		}
	};
};
