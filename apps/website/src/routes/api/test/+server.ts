import { db } from '$lib/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import { people as peopleSchema, users } from 'drizzle/schema';

export const POST: RequestHandler = async () => {
	const people = await db.select().from(peopleSchema);

	await db.insert(users).values(
		people.map((person) => ({
			id: person.id,
			name: person.firstName + ' ' + person.lastName,
			major: person.major,
			minor: person.minor,
			netId: person.netId,
			phoneNumber: person.phoneNumber,
			email: person.email
		}))
	);
	return json(people.length);
};
