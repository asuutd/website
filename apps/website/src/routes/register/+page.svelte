<script context="module">
	import { fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
</script>

<script lang="ts">
	let disabled = false;
	import { page } from '$app/stores';
	import type { ActionData } from '../$types';
	import { object, string, bool, addMethod, type InferType } from 'yup';

	export let data;

	import { phoneNumberAutoFormat } from '$lib/format';

	import { formFieldProxy, superForm } from 'sveltekit-superforms/client';
	import { zodSchema } from '$lib/validationSchemas';
	import { writable, type Writable } from 'svelte/store';
	const proxyForm = superForm(data.form, {
		validators: zodSchema,
		defaultValidator: 'clear',
		customValidity: true,
		dataType: 'json'
	});
	const { form, errors, enhance } = proxyForm;
	const { value, constraints } = formFieldProxy(proxyForm, 'newsletters');
	console.log($errors);
	let eventAttended = $page.url.searchParams.get('attendance');

	let netID = $page.url.searchParams.get('netID');
	let email = $page.url.searchParams.get('email');

	const onChange = (e) => {
		const targetValue = phoneNumberAutoFormat(e.target.value);
		$form.phone = targetValue;
	};

	const netIDRegex = /[a-zA-z]{3}[0-9]{6}/;
	const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
	errors.subscribe((err) => {
		console.log(err);
	});
	const test = writable('');
	test.subscribe((testval) => console.log(testval));
</script>

<svelte:head>
	<title>Register - ASU UT Dallas</title>
	<meta name="description" content="Register and become a member of ASU UT Dallas" />
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<div class="md:hero">
	<div class="">
		<div class="card flex-shrink-0 w-5/6 md:w-full max-w-xl shadow-2xl bg-white mx-auto">
			<div class="card-body md:p-16">
				<div class="mx-auto text-5xl pb-3">
					Join <span class="text-primary font-bold">ASU</span>
				</div>
				<form id="registration " class=" rounded-lg max-w-2xl min-w-full" method="post" use:enhance>
					<div class="relative z-0 w-full mb-6">
						<input
							type="text"
							color="green"
							name="name"
							id="name"
							class={`input input-lg w-full bg-white ${
								$errors?.name?.length !== 0
									? 'border-gray-300 text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="First Name"
							bind:value={$form.name}
						/>
						<p
							class={`invisible ${$errors?.name?.length !== 0 && 'visible text-error'}`}
							id="first_name_error"
						>
							{$errors?.name}
						</p>
					</div>

					<div class="relative z-0 w-full mb-4 group">
						<input
							type="email"
							name="email"
							class={`input input-lg bg-white w-full ${
								$errors?.email?.length !== 0
									? 'border-gray-300  text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Email Address"
							bind:value={$form.email}
						/>
						<p
							class={`invisible ${$errors?.email?.length !== 0 && 'visible text-error'}`}
							id="email_error"
						>
							{$errors?.email}
						</p>
					</div>

					<div class="relative z-0 mb-6 group">
						<input
							type="text"
							name="netID"
							class={`input input-lg bg-white w-full ${
								$errors?.netID?.length !== 0
									? 'border-gray-300 text-neutral'
									: 'border-error text-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="NetID"
							bind:value={$form.netID}
						/>
						<p
							class={`invisible ${$errors?.netID?.length !== 0 && 'visible text-error'}`}
							id="netID_error"
						>
							{$errors?.netID}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group col-span-2">
						<input
							type="tel"
							name="phone"
							id="floating_phone"
							on:input={onChange}
							class={` input input-lg bg-white w-full ${
								$errors?.phone?.length !== 0 ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Phone Number"
							maxlength="12"
							bind:value={$form.phone}
						/>
						<p
							class={`invisible ${$errors?.phone?.length !== 0 && 'visible text-error'}`}
							id="phone_error"
						>
							{$errors?.phone}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="major"
							class={` input input-lg bg-white w-full ${
								$errors?.major?.length !== 0 ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Major"
							bind:value={$form.major}
						/>

						<p
							class={`invisible ${$errors?.major?.length !== 0 && 'visible text-error'}`}
							id="major_error"
						>
							{$errors?.major}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							type="text"
							name="minor"
							class={` input input-lg bg-white w-full ${
								$errors?.minor?.length !== 0 ? 'border-gray-300' : 'border-error'
							}  appearance-none dark:text-neutral dark:border-gray-600 dark:focus:border-neutral focus:outline-none focus:ring-0 focus:border-secondary peer `}
							placeholder="Minor"
							bind:value={$form.minor}
						/>
						<p
							class={`invisible ${$errors?.minor?.length !== 0 && 'visible text-error'}`}
							id="minor_error"
						>
							{$errors?.minor}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<select class="select" bind:value={$form.class} name="class">
							<option value="Freshman">Freshman</option>
							<option value="Sophomore">Sophomore</option>
							<option value="Junior">Junior</option>
							<option value="Senior">Senior</option>
							<option value="Graduate">Graduate</option>
						</select>
						<p
							class={`invisible ${$errors?.class?.length !== 0 && 'visible text-error'}`}
							id="minor_error"
						>
							{$errors?.class}
						</p>
					</div>

					<div class="relative z-0 w-full mb-6 group">
						<input
							bind:checked={$value}
							id="checked-checkbox"
							type="checkbox"
							name="newsletters"
							class="checkbox checkbox-secondary"
						/>
						<label
							for="checked-checkbox"
							class=" text-sm font-normal text-neutral dark:text-gray-300"
							>Do you want to receive Newsletters?</label
						>
					</div>

					<button type="submit" class={` btn btn-primary ${disabled && 'btn-disabled'}`}
						>Submit</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
