import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
	try {
		const ans: any = await request.formData();
		const res = await fetch(`${supabaseUrl}/rest/v1/people`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Prefer: 'return=headers-only',
				apikey: supabaseAnonKey,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: ans.get('email'),
				first_name: ans.get('first_name'),
				last_name: ans.get('last_name'),
				class: ans.get('class'),
				phone_number: ans.get('phone'),
				netID: ans.get('netID').toUpperCase(),
				major: ans.get('major'),
				is_paid: false,
				minor: ans.get('minor')
			})
		});

		/* ([
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
		]); */

		if (res.ok) {
			//Make more efficient
			console.log(ans?.get('dance'));
			const id = res.headers.get('Location').split('.')[1];
			const array = [
				...(ans?.get('dance') === 'true'
					? [
							fetch(`${supabaseUrl}/rest/v1/Dance%20Interest`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								})
							})
					  ]
					: []),
				...(ans?.get('basketball') === 'true'
					? [
							fetch(`${supabaseUrl}/rest/v1/Basketball%20List`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								})
							})
					  ]
					: []),
				...(ans?.get('mails') === 'true'
					? [
							fetch(`${supabaseUrl}/rest/v1/Mailing%20List`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									first_name: ans.get('first_name'),
									last_name: ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								})
							})
					  ]
					: []),
				...(ans?.get('volleyball') === 'true'
					? [
							fetch(`${supabaseUrl}/rest/v1/Volleyball%20List`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								})
							})
					  ]
					: []),
				...(ans?.get('soccer') === 'true'
					? [
							fetch(`${supabaseUrl}/rest/v1/Soccer%20List`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								})
							})
					  ]
					: []),
				...(ans?.get('attendance') !== null
					? [
							fetch(`${supabaseUrl}/rest/v1/events_people`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									apikey: supabaseAnonKey,
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									people_id: id,
									event_id: ans?.get('attendance')
								})
							})
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
			const result = await res.json();
			return new Response(result.message, {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	} catch (err) {
		console.log(err.message);
		return new Response(err.message, {
			status: 500,
			headers: {}
		});
	}
};
