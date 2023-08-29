import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import type { PageLoad } from '../test/$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zodSchema } from '$lib/validationSchemas';
import { db } from '$lib/db';
import { users } from 'drizzle/schema';
import { eq } from 'drizzle-orm';




export const actions = {
	default: async ({ request }) => {
		// TODO log the user in
		const form = await superValidate(request, zodSchema);
		console.log('POST', form);
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}
		const updatedUserId =  await db.update(users).set({
			name: form.data.name,
			major: form.data.major,
			netId: form.data.netID,
			phoneNumber: form.data.phone,
			minor: form.data.minor,
			class: form.data.class
		}).where(eq(users.email, form.data.email)).returning({updatedId: users.id})

		return redirect(303, "/")
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
	if(session.user.email){
		const email = session.user.email
		form.data.email = email
		form.data.netID = email.split("@")[0]
	}
	// Always return { form } in load and form actions.
	return { form };
};
