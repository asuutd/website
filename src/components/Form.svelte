<script>
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';
	import { string } from 'yup';
	import { personId, getPersonByNetId } from '../stores/personStore';
	export let id;

	let success = false;

	const submitAttendance = async () => {
		try {
			await getPersonByNetId(values.netID);

			const { data, error } = await supabase.from('events_people').insert([
				{
					event_id: id,
					people_id: $personId[0].id
				}
			]);
			if (error) {
				console.log(error);
				showMessage('netID_message', error.message);
			} else {
				showMessage('netID_message', 'Attendance Marked');
				console.log(msgs.netID_message);
				setTimeout(() => {
					goto('/');
				}, 450);
			}
			//console.log(data);
		} catch (error) {
			showMessage('netID_message', error.message);
			if (error.message === 'You are not registered') {
				setTimeout(() => {
					goto(`/register?attendance=${id}&netID=${values.netID}`);
				}, 500);
			}
		}
	};

	const schema = string()
		.required('netID is required')
		.test(
			'len',
			'netIDs follow the format abc123456',
			(val) =>
				val &&
				val.length === 9 &&
				/[a-zA-z]{3}/.test(val.slice(0, 3)) &&
				/[0-9]{6}/.test(val.slice(3))
		);

	let values = {};
	let errors = {};
	let msgs = {};

	const resetField = (name) => {
		msgs[name] = null;
		const error_element = document.getElementById(name);
		error_element.style.visibility = 'hidden';
	};

	const showMessage = (id, message) => {
		console.log(id);
		const error_element = document.getElementById(id);
		console.log(error_element);
		msgs[id] = message;
		setTimeout(() => {
			error_element.style.visibility = 'visible';
		}, 60);
	};

	const showSuccess = (id, message) => {
		console.log(id);
		const error_element = document.getElementById(id);
		console.log(error_element);
		msgs[id] = message;
		error_element.style.visibility = 'visible';
	};
</script>

<div class="flex justify-center items-center">
	<div>
		<form class="my-6 max-w-sm" on:submit|preventDefault={submitAttendance}>
			<div class="relative z-0 w-full mb-6 ">
				<input
					type="text"
					color="green"
					name="floating_first_name"
					on:focus={() => resetField('netID_message')}
					id="first_name"
					class={` text-xl block py-2.5 px-0 w-full   bg-transparent border-0 border-b-2 ${
						msgs.netID_message == null
							? 'border-gray-300 text-neutral'
							: msgs.netID_message === 'Attendance Marked'
							? 'border-success text-success'
							: 'border-error text-error'
					}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
					placeholder=" "
					bind:value={values.netID}
				/>
				<label
					for="first_name"
					class={`peer-focus:font-medium absolute text-lg ${
						msgs.netID_message == null
							? 'text-neutral'
							: msgs.netID_message === 'Attendance Marked'
							? 'text-success'
							: 'text-error'
					} dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-neutral peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8`}
					>netID</label
				>
				<p
					class={`invisible ${
						msgs.netID_message === 'Attendance Marked' ? 'text-success' : 'text-error'
					}`}
					id="netID_message"
				>
					{`${msgs.netID_message}`}
				</p>
			</div>
			<div class="">
				<button type="submit" class="btn btn-primary">SUBMIT</button>
			</div>
		</form>
	</div>
</div>
