import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { PageLoad } from '../test/$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zodSchema } from '$lib/validationSchemas';
import { db } from '$lib/db';
import { users } from 'drizzle/schema';
import { eq, sql } from 'drizzle-orm';


const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const actions = {
	default: async ({ request, url }) => {
		// TODO log the user in
		const form = await superValidate(request, zodSchema);
		console.log('POST', form);
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		const user = await db.select().from(users).where(eq(users.netId, form.data.netID))
		const attendance = url.searchParams.get("attendance");
		if(user.length > 0){
			const updatedUserId =  await db.update(users).set({
				name: form.data.name,
				major: form.data.major,
				netId: form.data.netID.toUpperCase(),
				phoneNumber: form.data.phone,
				minor: form.data.minor,
				class: form.data.class,
				updatedAt: new Date().toISOString()
			}).where(eq(users.email, form.data.email)).returning({updatedId: users.id, email: users.email})
			if(attendance){
				fetch(`${supabaseUrl}/rest/v1/events_people`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						apikey: supabaseAnonKey,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						people_id: updatedUserId[0].updatedId,
						event_id: attendance
					})
				})
			}
			throw redirect(303, `/pay?email=${updatedUserId[0].email}`)
	
		}else{
			const updatedUserId =  await db.insert(users).values({
				name: form.data.name,
				major: form.data.major,
				netId: form.data.netID.toUpperCase(),
				phoneNumber: form.data.phone,
				minor: form.data.minor,
				class: form.data.class,
				email: form.data.email,
				updatedAt: new Date().toISOString()
			}).returning({updatedId: users.id, email: users.email})

			fetch(`${supabaseUrl}/rest/v1/events_people`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					apikey: supabaseAnonKey,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					people_id: updatedUserId[0].updatedId,
					event_id: attendance
				})
			})
			throw redirect(303, `/pay?email=${updatedUserId[0].email}`)
	}

		

	}

	
} satisfies Actions;

export const load: PageServerLoad = async ({locals, url}) => {
	const session = await locals.getSession();
	
	console.log(session)
	if(session?.user?.name){
		console.log(":)")
		throw redirect(303, "/")
	}
	const form = await superValidate(zodSchema);
	
	if(url.searchParams.get("netID")){
		const netID = url.searchParams.get("netID").toUpperCase()
		const user = await db.select().from(users).where(eq(users.netId, netID))
		console.log(user)
		if(user.length > 0){
			form.data.email = user[0].email ?? ''
			form.data.name = user[0].name ?? ''
			form.data.class =user[0].class ?? ''
			form.data.major = user[0].major ?? ''
			form.data.minor = user[0].minor ?? ''
			form.data.netID = user[0].netId ?? ''
			form.data.phone = user[0].phoneNumber ?? ''
		}
		
	}
	
	// Always return { form } in load and form actions.
	return { form };
};
