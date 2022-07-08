import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '../../supabaseClient';
import parsePhoneNumber from 'libphonenumber-js';

export async function post({ request }) {
	const ans: any = await request.formData();
	const phone: string = ans.get('phone')?.toString();
	console.log(phone);
	if (!phone) {
		return {
			status: 400
		};
	}
	const phoneNumber = parsePhoneNumber(ans?.get('phone')?.toString());
	console.log(phoneNumber);

	for (const pair of ans.entries()) {
		console.log(`${pair[0]}: ${pair[1]}`);
	}

	const { data, error } = await supabase.from('people').insert([
		{
			email: ans.get('email'),
			first_name: ans.get('first_name'),
			last_name: ans.get('last_name'),
			class: ans.get('class'),
			phone_number: ans.get('phone'),
			netID: ans.get('netID'),
			major: ans.get('major'),
			is_member: false
		}
	]);

	const { data: data2, error: error2 } = await supabase.from('Dance Interest').insert([
		{
			name: ans.get('first_name') + ' ' + ans.get('last_name'),
			phone_number: ans.get('phone'),
			netID: ans.get('netID')
		}
	]);

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
	return {
		status: 201
	};
}
