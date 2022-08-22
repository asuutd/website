import { supabase } from '../../../supabaseClient';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export async function post({ request }) {
	const ans = await request.formData();
	const email: string = DOMPurify.sanitize(ans.get('email'));
	if (!validateEmail(email)) {
		return {
			status: 400,
			body: 'Not a valid email'
		};
	}
	console.log(ans);
	const { data, error } = await supabase.from('Mailing List').insert([{ email: email }]);
	if (!error) {
		return {
			status: 201
		};
	} else {
		return {
			status: 400,
			body: error
		};
	}
}

const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};
