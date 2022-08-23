import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '../../../supabaseClient';
import parsePhoneNumber from 'libphonenumber-js';

export async function POST({ request }) {
	const ans: any = await request.formData();

	for (var pair of ans.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}

	try {
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

		if (!error) {
			//Make more efficient
			console.log(ans?.get('dance'));
			const array = [
				...(ans?.get('dance') === 'true'
					? [
							supabase.from('Dance Interest').insert([
								{
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID')
								}
							])
					  ]
					: []),
				...(ans?.get('basketball') === 'true'
					? [
							supabase.from('Basketball List').insert([
								{
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							])
					  ]
					: []),
				...(ans?.get('volleyball') === 'true'
					? [
							supabase.from('Volleyball List').insert([
								{
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							])
					  ]
					: []),
				...(ans?.get('soccer') === 'true'
					? [
							supabase.from('Soccer List').insert([
								{
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							])
					  ]
					: [])
			];
			console.log(array, array.length);
			try {
				await Promise.all(array);

				return new Response(null, {
					status: 201,
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
		} else {
			return new Response(error.message, {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	} catch (err) {
		return new Response(err, {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
