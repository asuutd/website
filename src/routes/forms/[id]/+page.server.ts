import { db } from '$lib/db';
import { redirect, type Actions } from '@sveltejs/kit';
import { comments, eventsPeople, users } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { supabase } from '$lib/supabaseClient';
import { VITE_PUBLIC_URL } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		console.log(formData);
		const netID = formData.get('netID').toString();
		const improvements = formData.get('improvements').toString();
		const ideas = formData.get('ideas').toString();
		const anonymous = formData.get('anonymous') == 'on';
		const eventId = params.id;

		const person = await db.select().from(users).where(eq(users.netId, netID.toUpperCase()));
		console.log(person);
		/* const promises = [
			db.insert(eventsPeople).values({
				eventId,
				peopleId: person[0].id
			}),
			...(improvements !== '' && ideas !== ''
				? [
						db.insert(comments).values({
							eventId,
							...(!anonymous ? { peopleId: person[0].id } : {}),
							...(improvements !== '' ? { meetingFeedback: improvements } : {}),
							...(ideas !== '' ? { meetingIdeas: ideas } : {})
						})
				  ]
				: [])
		]; */

		try {
			if (person) {
				const promises = [
					supabase.from('events_people').insert([
						{
							event_id: eventId,
							people_id: person[0].id
						}
					]),
					...(improvements !== '' && ideas !== ''
						? [
								supabase.from('comments').insert([
									{
										event_id: eventId,
										...(!anonymous ? { people_id: person[0].id } : {}),
										...(improvements !== '' ? { meeting_feedback: improvements } : {}),
										...(ideas !== '' ? { meeting_ideas: ideas } : {})
									}
								])
						  ]
						: [])
				];
				await Promise.all(promises);
				console.log((await promises[0]).data);
			}

			const url = new URL(`${VITE_PUBLIC_URL}/register`);
			url.searchParams.set('attendance', eventId);
			url.searchParams.set('netID', netID);
			throw redirect(303, url.pathname);
		} catch (err) {
			if (err.message === 'You are not registered') {
				const url = new URL(`${VITE_PUBLIC_URL}/register`);
				url.searchParams.set('attendance', eventId);
				url.searchParams.set('netID', netID);

				throw redirect(303, url.pathname);
			}
			console.log(err.message);
		}

		throw redirect(303, '/');
	}
};
