import type { RequestHandler } from '@sveltejs/kit';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export const POST: RequestHandler = async ({ request }) => {
	const ans: any = await request.formData();

	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
	const mailChimpKey = import.meta.env.VITE_MAILCHAMP_API_KEY;
	const netID: string = DOMPurify.sanitize(ans.get('netID'));

	console.log(netID);
	const result = await fetch(`${supabaseUrl}/rest/v1/people?netID=eq.${netID.toUpperCase()}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			apikey: supabaseAnonKey,
			'Content-Type': 'application/json'
		}
	});
	const [user] = await result.json();
	try {
		const danceResponse = await fetch(`${supabaseUrl}/rest/v1/Dance%20Interest`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				apikey: supabaseAnonKey,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: user.first_name + ' ' + user.last_name,
				phone_number: user.phone_number,
				netID: user.netID,
				email: user.email
			})
		});

		return new Response(JSON.stringify(user), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		console.log('SvelteKIt needs to step up');
		return new Response(err, {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	/* let res = await fetch(`${supabaseUrl}/rest/v1/Dance%20Interest`, {
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
	} */
};

const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};
