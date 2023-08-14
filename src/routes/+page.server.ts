import { events } from '../../drizzle/schema';
import { db, pool } from '../lib/db';
import type { PageServerLoad } from './$types';
import { wrap } from '$lib/safeAPICall';
export const load = async ({ params, platform }) => {
	const dbEvents = await db.select().from(events).orderBy(events.importance).limit(4);

	return {
		events: dbEvents
	};
};
