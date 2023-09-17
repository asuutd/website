<script>
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/supabaseClient';
	import { string } from 'yup';
	import { personId } from '../../stores/personStore';

	let success = false;

	const submitAttendance = async () => {
		try {
			const { data, error } = await supabase.from('Mailing List').delete().match({
				email: values.email
			});
			if (error) {
				console.log(error);
				showMessage('email_message', error.message);
			} else {
				showMessage('email_message', 'Successfully Removed');
				console.log(msgs.email_message);
				setTimeout(() => {
					goto('/');
				}, 450);
			}
			//console.log(data);
		} catch (error) {
			showMessage('email_message', error.message);
			if (error.message === 'You are not in the mailing list') {
				setTimeout(() => {
					goto(`/`);
				}, 500);
			}
		}
	};

	let values = {};
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
</script>

<div class="flex justify-center items-center">
	<div>
		<form class="my-6 w-96" on:submit|preventDefault={submitAttendance}>
			<div class="relative z-0 w-full mb-6">
				<input
					type="email"
					color="green"
					name="floating_email"
					on:focus={() => resetField('email_message')}
					id="email"
					class={` text-xl block py-2.5 px-0 w-full   bg-transparent border-0 border-b-2 ${
						msgs.email_message == null
							? 'border-gray-300 text-neutral'
							: msgs.email_message === 'Successfully Removed'
							? 'border-success text-success'
							: 'border-error text-error'
					}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
					placeholder=" "
					bind:value={values.email}
				/>
				<label
					for="floating_email"
					class={`peer-focus:font-medium absolute text-lg ${
						msgs.email_message == null
							? 'text-neutral'
							: msgs.email_message === 'Successfully Removed'
							? 'text-success'
							: 'text-error'
					} dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-secondary peer-focus:dark:text-neutral peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8`}
					>Email</label
				>
				<p
					class={`invisible ${
						msgs.email_message === 'Successfully Removed' ? 'text-success' : 'text-error'
					}`}
					id="email_message"
				>
					{`${msgs.email_message}`}
				</p>
			</div>
			<div class="">
				<button type="submit" class="btn btn-primary">SUBMIT</button>
			</div>
		</form>
	</div>
</div>
