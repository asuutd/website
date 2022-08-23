import { supabase } from '$lib/supabaseClient';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export async function POST({ request }) {
	const ans = await request.formData();
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
	const { data, error } = await supabase.from('Mailing List').insert([{ email: email }]);
	if (!error) {
		return new Response(null, {
			status: 201
		});
	} else {
		return new Response(JSON.stringify({ body: error.message }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};
