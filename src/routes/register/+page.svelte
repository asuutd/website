<script context="module">
	import { fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
</script>

<script lang="ts">
	let disabled = false;
	import { page } from '$app/stores';
	import type { ActionData } from '../$types';
	import { object, string, bool, addMethod, type InferType } from 'yup';

	export let form: ActionData;
	console.log(form);

	import { phoneNumberAutoFormat } from '$lib/format';

	import { z } from 'zod';
	import { enhance } from '$app/forms';
	let eventAttended = $page.url.searchParams.get('attendance');

	let netID = $page.url.searchParams.get('netID');

	const onChange = (e) => {
		const targetValue = phoneNumberAutoFormat(e.target.value);
		values.phone = targetValue;
	};

	const netIDRegex = /[a-zA-z]{3}[0-9]{6}/;
	const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

	const schema = object({
		first_name: string().required('Please enter first name'),
		last_name: string().required('Please enter last name'),
		email: string()
			.required('Please provide your email')
			.email("Email doesn't look right")
			.lowercase(),
		netID: string()
			.required('netID is required')
			.matches(netIDRegex, 'netID is not valid')
			.test(
				'len',
				'netIDs follow the format abc123456',
				(val) =>
					val &&
					val.length === 9 &&
					/[a-zA-z]{3}/.test(val.slice(0, 3)) &&
					/[0-9]{6}/.test(val.slice(3))
			),
		phone: string()
			.required('Phone number is required')
			.matches(phoneRegex, 'phone number is not valid'),
		major: string().required('Major is required')
	});

	type FormSchema = InferType<typeof schema>;
	let values: FormSchema & { mails?: boolean } = {
		first_name: '',
		last_name: '',
		email: '',
		netID: '',
		phone: '',
		major: ''
	};
	values.mails = true;
	let errors = {};
	let error_msgs: any = {};
	let im_visible = false;

	const showError = (id, message) => {
		console.log(id);
		const error_element = document.getElementById(id);
		console.log(error_element);
		error_msgs[id] = message;
		error_element.style.visibility = 'visible';
		console.log(values);
	};

	async function submitHandler(event) {
		try {
			await schema.validate(values, { abortEarly: false });
			console.log(event.target);
			const formData = new FormData();
			Object.entries(values).forEach((value) => {
				formData.append(value[0], String(value[1]));
			});
			if (eventAttended !== null) {
				formData.append('attendance', eventAttended);
			}
			disabled = true;
			const res = await fetch('../api/register', {
				method: 'POST',
				body: formData
			});

			//If the data could not be stored on the database
			disabled = true;
			if (!res.ok) {
				const result = await res.text();
				if (result.includes('Unique constraint failed')) {
					if (result.includes('netID')) {
						showError('netID_error', 'netID already exists');
					}
				}
			} else {
				goto('/pay');
			}
			disabled = false;
			//alert(JSON.stringify(values, null, 2));
			//console.log(formData.get('last_name'));
		} catch (err) {
			errors = extractErrors(err);
			Object.entries(errors).forEach((message) => {
				console.log(message);
				showError(message[0] + '_error', message[1]);
			});
		}
	}
	/**
	 * @param {{ message: string; inner: any[]; }} err
	 */
	function extractErrors(err) {
		console.log(err.message);
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
	}

	const resetErrorField = (name) => {
		error_msgs[name] = null;
		const error_element = document.getElementById(name);
		error_element.style.visibility = 'hidden';
	};

	if (netID !== null) {
		values.netID = netID;
	}
</script>

<svelte:head>
	<title>Register - ASU UTDallas</title>
	<meta name="description" content="Register and become a member of ASU UTDallas" />
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<div class="md:hero">
	<div class="">
		<div class="card flex-shrink-0 w-5/6 md:w-full max-w-xl shadow-2xl bg-white mx-auto">
			<div class="card-body md:p-16">
				<div class="mx-auto text-5xl pb-3">
					Join <span class="text-primary font-bold">ASU</span>
				</div>
				<form
					id="registration "
					class=" rounded-lg max-w-2xl min-w-full"
					use:enhance={() => {
						return async ({ result, data }) => {
							const formData = Object.fromEntries(data);
							values = formData;
						};
					}}
					method="post"
				>
					<div class="relative z-0 w-full mb-6">
						<input
							type="text"
							color="green"
							name="first_name"
							on:focus={() => resetErrorField('first_name_error')}
							id="first_name"
							class={`input input-lg w-full bg-white ${
								form?.first_name_error == null
									? 'border-gray-300 text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="First Name"
							bind:value={values.first_name}
						/>
						<p
							class={` ${form?.first_name_error != null ? 'text-error visible' : 'invisible'}`}
							id="first_name_error"
						>
							{form?.first_name_error}
						</p>
					</div>
					<div class="relative z-0 w-full mb-6" in:fly|global={{ delay: 100, duration: 200 }}>
						<input
							type="text"
							name="last_name"
							id="last_name"
							on:focus={() => resetErrorField('last_name_error')}
							class={`input input-lg bg-white w-full ${
								error_msgs.last_name_error == null
									? 'border-gray-300 text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Last Name"
							bind:value={values.last_name}
						/>
						<p
							class={` ${form?.last_name_error != null ? 'text-error visible' : 'invisible'}`}
							id="last_name_error"
						>
							{form?.last_name_error}
						</p>
					</div>

					<div class="relative z-0 w-full mb-4 group">
						<input
							type="email"
							name="email"
							on:focus={() => resetErrorField('email_error')}
							class={`input input-lg bg-white w-full ${
								error_msgs.email_error == null
									? 'border-gray-300  text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Email Address"
							bind:value={values.email}
						/>
						<p
							class={` ${form?.email_error != null ? 'text-error visible' : 'invisible'}`}
							id="email_error"
						>
							{form?.email_error}
						</p>
					</div>

					<div class="relative z-0 mb-6 group">
						<input
							type="text"
							name="netID"
							on:focus={() => resetErrorField('netID_error')}
							class={`input input-lg bg-white w-full ${
								error_msgs.netID_error == null
									? 'border-gray-300 text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="NetID"
							bind:value={values.netID}
						/>
						<p
							class={` ${form?.netID_error != null ? 'text-error visible' : 'invisible'}`}
							id="netID_error"
						>
							{form?.netID_error}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group col-span-2">
						<input
							type="tel"
							name="phone"
							id="floating_phone"
							on:input={onChange}
							on:focus={() => resetErrorField('phone_error')}
							class={` input input-lg bg-white w-full ${
								error_msgs.phone_error == null ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Phone Number"
							maxlength="12"
							bind:value={values.phone}
						/>
						<p
							class={`invisible ${error_msgs.phone_error != null && 'visible text-error'}`}
							id="phone_error"
						>
							{error_msgs.phone_error}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="major"
							class={` input input-lg bg-white w-full ${
								error_msgs.major_error == null ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Major"
							bind:value={values.major}
						/>

						<p class="invisible" id="major_error">{error_msgs.major_error}</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="minor"
							class={` input input-lg bg-white w-full ${
								error_msgs.major_error == null ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Minor"
							bind:value={values.minor}
						/>
						<p class="invisible" id="major_error">{error_msgs.minor_error}</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<select
							class="select select-secondary"
							form="registration"
							bind:value={values.class}
							id="grid-state"
						>
							<option>Freshman</option>
							<option>Sophomore</option>
							<option>Junior</option>
							<option>Senior</option>
							<option>Graduate</option>
						</select>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							bind:checked={values.mails}
							id="checked-checkbox"
							type="checkbox"
							class="checkbox checkbox-secondary"
						/>
						<label
							for="checked-checkbox"
							class=" text-sm font-normal text-neutral dark:text-gray-300"
							>Do you want to receive Newsletters?</label
						>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							bind:checked={values.dance}
							id="checked-checkbox"
							type="checkbox"
							class="checkbox checkbox-secondary"
						/>
						<label
							for="checked-checkbox"
							class=" text-sm font-normal text-neutral dark:text-gray-300"
							>Are you interested in joining the Dance Team?</label
						>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							bind:checked={im_visible}
							id="checked-checkbox"
							type="checkbox"
							class="checkbox checkbox-secondary"
						/>
						<label
							for="checked-checkbox"
							class=" text-sm font-normal text-neutral dark:text-gray-300"
							>Are you interested in Intermurals?</label
						>
					</div>

					{#if im_visible}
						<div transition:fly|global={{ y: 20, duration: 400 }} class="flex justify-between">
							<div class="form-control">
								<label class="cursor-pointer label">
									<span class="label-text mr-3 text-neutral">Basketball</span>
									<input
										type="checkbox"
										class="checkbox checkbox-secondary"
										bind:checked={values.basketball}
									/>
								</label>
							</div>
							<div class="form-control">
								<label class="cursor-pointer label">
									<span class="label-text mr-3 text-neutral">Vollyeball</span>
									<input
										type="checkbox"
										class="checkbox checkbox-secondary"
										bind:checked={values.volleyball}
									/>
								</label>
							</div>
							<div class="form-control">
								<label class="cursor-pointer label">
									<span class="label-text mr-3 text-neutral">Soccer</span>
									<input
										type="checkbox"
										class="checkbox checkbox-secondary"
										bind:checked={values.soccer}
									/>
								</label>
							</div>
						</div>
					{/if}

					<button type="submit" class={` btn btn-primary ${disabled && 'btn-disabled'}`}
						>Submit</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
