import type { RequestHandler } from '@sveltejs/kit';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export const POST: RequestHandler = async ({ request }) => {
	const ans: any = await request.formData();

	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
	const mailChimpKey = import.meta.env.VITE_MAILCHAMP_API_KEY;
	const email: string = DOMPurify.sanitize(ans.get('email'));
	if (!validateEmail(email)) {
		return new Response(JSON.stringify({ body: 'Not a valid email' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
	console.log(ans);

	let res = await fetch(`${supabaseUrl}/rest/v1/Mailing%20List`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			apikey: supabaseAnonKey,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email
		})
	});
	if (res.ok) {
		return new Response(null, {
			status: 201
		});
	} else {
		const result = await res.json();
		return new Response(JSON.stringify({ body: result.message }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	console.log('ans');
	const ans: any = await request.formData();
	if (ans.get('email') === null) {
		return new Response(null, {
			status: 400
		});
	}
	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
	const mailChimpKey = import.meta.env.VITE_MAILCHAMP_API_KEY;
	const email: string = DOMPurify.sanitize(ans.get('email'));

	let res = await fetch(`${supabaseUrl}/rest/v1/Mailing%20List?email=eq.${email}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			apikey: supabaseAnonKey,
			'Content-Type': 'application/json'
		}
	});
	if (res.ok) {
		const body = {
			email_address: email,
			email_type: 'html',
			status: 'subscribed'
		};
		console.log(mailChimpKey);
		res = await fetch('https://us13.api.mailchimp.com/3.0/lists/8f84fc042d/members', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${mailChimpKey}`,
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (res.ok) {
			return new Response(null, {
				status: 204
			});
		} else {
			return new Response(JSON.stringify(await res.json()), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 400
			});
		}
	} else {
		const result = await res.json();
		return new Response(JSON.stringify({ body: result.message }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};
