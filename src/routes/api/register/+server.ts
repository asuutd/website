import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const ans: any = await request.formData();

	try {
		const member = await prisma.people.create({
			data: {
				email: ans.get('email'),
				first_name: ans.get('first_name'),
				last_name: ans.get('last_name'),
				class: ans.get('class'),
				phone_number: ans.get('phone'),
				netID: ans.get('netID'),
				major: ans.get('major'),
				is_paid: false
			}
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

		if (member !== null) {
			//Make more efficient
			console.log(ans?.get('dance'));
			const array = [
				...(ans?.get('dance') === 'true'
					? [
							prisma.dance_Interest.create({
								data: {
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							})
					  ]
					: []),
				...(ans?.get('basketball') === 'true'
					? [
							prisma.basketball_List.create({
								data: {
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							})
					  ]
					: []),
				...(ans?.get('volleyball') === 'true'
					? [
							prisma.volleyball_List.create({
								data: {
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							})
					  ]
					: []),
				...(ans?.get('soccer') === 'true'
					? [
							prisma.soccer_List.create({
								data: {
									name: ans.get('first_name') + ' ' + ans.get('last_name'),
									phone_number: ans.get('phone'),
									netID: ans.get('netID'),
									email: ans.get('email')
								}
							})
					  ]
					: []),
				...(ans?.get('attendance') !== null
					? [
							prisma.events_people.create({
								data: {
									people_id: member.id,
									event_id: ans?.get('attendance')
								}
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
			return new Response(member?.id, {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	} catch (err) {
		return new Response(JSON.stringify({ err: err.msg }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
