import { events } from '../../drizzle/schema';
import { db } from '../lib/db';
import type { PageServerLoad } from './$types';
export async function load({ params }) {
	const dbEvents = await db.select().from(events).orderBy(events.importance).limit(4);
	return {
		events: dbEvents
	};
}
