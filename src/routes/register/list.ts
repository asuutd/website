import { supabase } from '../../supabaseClient';
import DOMPurify from 'isomorphic-dompurify';

//Endpoint to add someone to mailing list
export async function post({ request }) {
	const ans = await request.formData();
	const email: string = DOMPurify.sanitize(ans.get('email'));
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
