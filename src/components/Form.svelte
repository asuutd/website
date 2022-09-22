<script>
	import { goto } from '$app/navigation';
	import TextArea from './TextAreaAutosize.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { string, object, boolean } from 'yup';
	import { personId, getPersonByNetId } from '../stores/personStore';
	import { claim_svg_element } from 'svelte/internal';
	export let id;
	let feedback_val = '';
	let ideas_val = '';
	let success = false;
	let anonymous = false;

	const submitAttendance = async () => {
		console.log(values);

		if (feedback_val !== '' && ideas_val !== '') {
			console.log('SLEEP');
		}

		try {
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
				...(values.fall_ball_attendance === true
					? [
							supabase.from('fallball_questions').insert([
								{
									...(!anonymous ? { people_id: $personId[0].id } : {}),
									q1: values.q1,
									q2: values.q2,
									q3: values.q3
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
					goto('/');
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
		<div class="relative z-0 w-full mb-6 ">
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
				name="floating_first_name"
				id="first_name"
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
		<h2 class="text-lg text-secondary font-bold ">How can we improve?</h2>
		<TextArea
			bind:value={feedback_val}
			minRows={4}
			maxRows={40}
			placeholder="Comments (optional)"
		/>

		<h2 class="text-lg text-secondary font-bold mt-4">Any meeting ideas?</h2>
		<TextArea bind:value={ideas_val} minRows={4} maxRows={40} placeholder="Comments (optional)" />

		<h2 class="text-lg font-bold text-secondary mt-4">DID YOU ATTEND FALL BALL LAST YEAR?</h2>

		<div class="flex justify-between my-4">
			<div>
				<input
					type="radio"
					name="radio-1"
					class="radio"
					id="jjk"
					checked
					bind:group={values.fall_ball_attendance}
					value={true}
				/>
				<label for="jjk">YES</label>
			</div>

			<div>
				<input
					type="radio"
					name="radio-1"
					class="radio"
					id="jjk"
					checked
					bind:group={values.fall_ball_attendance}
					value={false}
				/>
				<label for="jjk">NO</label>
			</div>
		</div>
		{#if values.fall_ball_attendance}
			<div>
				<h2 class="text-lg font-bold text-secondary mt-4">HOW DID YOU FEEL ABOUT IT?</h2>
				<div class="flex justify-between my-4">
					<p>1 (Dislike)</p>
					<p>5 (Love)</p>
				</div>

				<div class="flex justify-between mb-4">
					<input
						type="radio"
						name="q1"
						class="radio"
						checked
						bind:group={values.q1}
						value={1}
						on:focus={() => resetField('q1_message')}
					/>
					<input
						type="radio"
						name="q1"
						class="radio"
						bind:group={values.q1}
						value={2}
						on:focus={() => resetField('q1_message')}
					/>
					<input
						type="radio"
						name="q1"
						class="radio"
						bind:group={values.q1}
						value={3}
						on:focus={() => resetField('q1_message')}
					/>
					<input
						type="radio"
						name="q1"
						class="radio"
						bind:group={values.q1}
						value={4}
						on:focus={() => resetField('q1_message')}
					/>
					<input
						type="radio"
						name="q1"
						class="radio"
						bind:group={values.q1}
						value={5}
						on:focus={() => resetField('q1_message')}
					/>
				</div>
				<p class={`invisible text-error`} id="q1_message">
					{`${msgs.q1_message}`}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold text-secondary my-4">WHAT WAS YOUR FAVORITE THING?</h2>

				<TextArea bind:value={values.q2} minRows={4} maxRows={40} placeholder="" />
			</div>

			<div>
				<h2 class="text-lg font-bold text-secondary my-4">WHAT WAS YOUR LEAST FAVORITE THING?</h2>

				<TextArea bind:value={values.q3} minRows={4} maxRows={40} placeholder="" />
			</div>
		{/if}

		<div class="py-4">
			<input
				bind:checked={anonymous}
				id="checked-checkbox"
				type="checkbox"
				class="checkbox checkbox-secondary"
			/>
			<label for="checked-checkbox" class=" text-sm font-normal text-neutral dark:text-gray-300"
				>Send feedback anonymously</label
			>
		</div>
		<div class="">
			<button
				type="submit"
				class="btn btn-primary mt-6 focus:ring-secondary focus:outline-none focus:ring-0"
				>SUBMIT</button
			>
		</div>
	</form>
</div>
