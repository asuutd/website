import type { RequestHandler } from '@sveltejs/kit';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export const POST: RequestHandler = async ({ request }) => {
	const ans: any = await request.formData();

	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
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

	const res = await fetch(`${supabaseUrl}/rest/v1/Mailing%20List`, {
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
	const ans: any = await request.formData();

	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
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

	const res = await fetch(`${supabaseUrl}/rest/v1/Mailing%20List?email=eq.${email}`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			apikey: supabaseAnonKey,
			'Content-Type': 'application/json'
		}
	});
	if (res.ok) {
		return new Response(null, {
			status: 204
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

const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};
