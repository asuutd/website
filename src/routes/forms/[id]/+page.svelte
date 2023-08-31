<script>
	export let data;
	let { id } = data;
	//import { events, getData } from '../../stores/eventStore';
	import Form from '../../../components/Form.svelte';

	//getData();

	import { goto } from '$app/navigation';
	import TextArea from '../../../components/TextAreaAutosize.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { string, object, boolean } from 'yup';
	import { personId, getPersonByNetId } from '../../../stores/personStore';
	let feedback_val = '';
	let ideas_val = '';
	let african_night_val = '';
	let special_sug_val = '';
	let success = false;
	let anonymous = false;
	let org = '';

	const submitAttendance = async () => {
		console.log(values);

		if (feedback_val !== '' && ideas_val !== '') {
			console.log('SLEEP');
		}

		try {
			console.log(african_night_val);
			await schema.validate(values, { abortEarly: false });

			await getPersonByNetId(values.netID.toUpperCase());
			const promises = [
				supabase.from('events_people').insert([
					{
						event_id: id,
						people_id: $personId[0].id
					}
				]),
				...(feedback_val !== '' && ideas_val !== ''
					? [
							supabase.from('comments').insert([
								{
									event_id: id,
									...(!anonymous ? { people_id: $personId[0].id } : {}),
									...(feedback_val !== '' ? { meeting_feedback: feedback_val } : {}),
									...(ideas_val !== '' ? { meeting_ideas: ideas_val } : {})
								}
							])
					  ]
					: []),
				...(african_night_val !== '' || special_sug_val !== ''
					? [
							supabase.from('african_night').insert([
								{
									...(!anonymous ? { people_id: $personId[0].id } : {}),
									suggestions: ideas_val,
									artist_designer: special_sug_val
								}
							])
					  ]
					: [])
			];

			const [{ data, error }, _] = await Promise.all(promises);

			if (error) {
				console.log(error);
				showMessage('netID_message', error.message);
			} else {
				showMessage('netID_message', 'Attendance Marked');
				console.log(msgs.netID_message);
				setTimeout(() => {
					const url = new URL(`${import.meta.env.VITE_PUBLIC_URL}/register`);
					url.searchParams.set('attendance', id);
					url.searchParams.set('netID', values.netID);
					goto(`/register?attendance=${id}&netID=${values.netID}`);
				}, 450);
			}
			//console.log(data);
		} catch (error) {
			if (error.message === 'You are not registered') {
				setTimeout(() => {
					goto(`/register?attendance=${id}&netID=${values.netID}`);
				}, 500);
			} else {
				errors = extractErrors(error);
				Object.entries(errors).forEach((message) => {
					console.log(message);
					showMessage(message[0] + '_message', message[1]);
				});
			}
		}
	};

	const schema = object({
		netID: string()
			.required('netID is required')
			.test(
				'len',
				'netIDs follow the format abc123456',
				(val) =>
					val &&
					val.length === 9 &&
					/[a-zA-z]{3}/.test(val.slice(0, 3)) &&
					/[0-9]{6}/.test(val.slice(3))
			),
		fall_ball_attendance: boolean(),
		q1: string().when('fall_ball_attendance', {
			is: true,
			then: string().required('Please give your opinion')
		})
	});

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

	/**
	 * @param {{ message: string; inner: any[]; }} err
	 */
	function extractErrors(err) {
		console.log(err.message);
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
	}
</script>

<div class="flex justify-center items-center">
	<form
		class="my-6 w-72 md:w-96 justify-center flex flex-col"
		on:submit|preventDefault={submitAttendance}
	>
		<div class="relative z-0 w-full mb-6">
			<input
				type="text"
				placeholder="netID"
				on:focus={() => resetField('netID_message')}
				class={`input input-bordered w-full max-w-xs focus:ring-secondary focus:border-secondary ${
					msgs.netID_message == null
						? 'input-secondary'
						: msgs.netID_message === 'Attendance Marked'
						? 'input-success'
						: 'input-error'
				}`}
				bind:value={values.netID}
				name="netID"
				id="netID"
			/>
			<!-- <input
				type="text"
				color="green"
				name="floating_first_name"
				on:focus={() => resetField('netID_message')}
				id="first_name"
				class={`text-xl block py-2.5 px-0 max-w-sm  bg-transparent border-0 border-b-2 ${
					msgs.netID_message == null
						? 'border-gray-300 text-neutral'
						: msgs.netID_message === 'Attendance Marked'
						? 'border-success text-success'
						: 'border-error text-error'
				}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
				placeholder=" "
				bind:value={values.netID}
			/> -->

			<p
				class={`invisible ${
					msgs.netID_message === 'Attendance Marked' ? 'text-success' : 'text-error'
				}`}
				id="netID_message"
			>
				{`${msgs.netID_message}`}
			</p>
		</div>
		<h2 class="text-lg text-secondary font-bold">How can we improve?</h2>
		<TextArea
			bind:value={feedback_val}
			minRows={4}
			maxRows={40}
			placeholder="Comments (optional)"
			name="improvements"
		/>

		<h2 class="text-lg text-secondary font-bold mt-4">Any meeting ideas?</h2>
		<TextArea
			bind:value={ideas_val}
			minRows={4}
			maxRows={40}
			placeholder="Comments (optional)"
			name="ideas"
		/>

		<div class="py-4">
			<input
				bind:checked={anonymous}
				id="checked-checkbox"
				type="checkbox"
				name="anonymous"
				class="checkbox checkbox-secondary"
			/>
			<label for="checked-checkbox" class=" text-sm font-normal text-neutral dark:text-gray-300"
				>Send feedback anonymously</label
			>
		</div>

		<button
			type="submit"
			class="btn btn-primary mt-6 focus:ring-secondary focus:outline-none focus:ring-0"
			>SUBMIT</button
		>
	</form>
</div>
