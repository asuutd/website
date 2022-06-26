<script context="module">
	import { object, string } from 'yup';
</script>

<script>
	import { getNotificationsContext } from 'svelte-notifications';
	import { phoneNumberAutoFormat } from '$lib/format';

	const onChange = (e) => {
		const targetValue = phoneNumberAutoFormat(e.target.value);
		values.phone = targetValue;
	};

	const { addNotification } = getNotificationsContext();

	const netIDRegex = /[a-zA-z]{3}[0-9]{6}/;
	const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
	const schema = object({
		first_name: string().required(),
		last_name: string().required(),
		email: string()
			.required('Please Provide your email')
			.email("Email doesn't look right")
			.lowercase(),
		netID: string().required().matches(netIDRegex, 'netID is not valid'),
		phone: string().required().matches(phoneRegex, 'phone number is not valid')
	});
	let values = {};
	let errors = {};

	async function submitHandler(event) {
		try {
			await schema.validate(values, { abortEarly: false });
			console.log(event.target);
			const formData = new FormData();
			Object.entries(values).forEach((value) => {
				formData.append(value[0], value[1]);
			});
			const res = await fetch('../api/register', {
				method: 'POST',
				body: formData
			});

			//If the data could not be stored on the database

			const result = await res.json();
			if (!res.ok) {
				if (result.message.includes('duplicate key')) {
					if (result.message.includes('netID')) {
						addNotification({
							id: result.code,
							text: 'netID already exists',
							position: 'top-right',
							removeAfter: 2000,
							type: 'danger'
						});
					}
				}
			}
			console.log(result);
			//alert(JSON.stringify(values, null, 2));
			//console.log(formData.get('last_name'));
		} catch (err) {
			errors = extractErrors(err);
			Object.entries(errors).forEach((message) =>
				addNotification({
					id: message[0],
					text: message[1],
					position: 'top-right',
					removeAfter: 2000,
					type: 'danger'
				})
			);
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
</script>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<form
	id="registration"
	class="my-5 mx-1 px-3 py-5 rounded-lg "
	on:submit|preventDefault={submitHandler}
>
	<div class="grid grid-cols-2 gap-6">
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="floating_first_name"
				id="floating_first_name"
				class="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
				placeholder=" "
				bind:value={values.first_name}
			/>
			<label
				for="floating_first_name"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>First name</label
			>
		</div>
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="floating_last_name"
				id="floating_last_name"
				class="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
				placeholder=" "
				bind:value={values.last_name}
			/>
			<label
				for="floating_last_name"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Last name</label
			>
		</div>
	</div>
	<div class="relative z-0 w-full mb-6 group">
		<input
			type="email"
			name="floating_email"
			class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
			placeholder=" "
			bind:value={values.email}
		/>
		<label
			for="floating_email"
			class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
			>Email address</label
		>
	</div>

	<div class="grid grid-cols-3 gap-6">
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="netID"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				bind:value={values.netID}
			/>
			<label
				for="netID"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>netID</label
			>
		</div>

		<div class="relative z-0 w-full mb-6 group col-span-2">
			<input
				type="tel"
				name="floating_phone"
				id="floating_phone"
				on:input={onChange}
				class="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				maxlength="12"
				bind:value={values.phone}
			/>
			<label
				for="floating_phone"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Phone number (No spaces)</label
			>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-6">
		<div class="relative z-0 w-full mb-6 group ">
			<input
				type="text"
				name="major"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				bind:value={values.major}
			/>
			<label
				for="major"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Major</label
			>
		</div>

		<div class="relative z-0 w-full mb-6 group">
			<select
				class="rounded-lg block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-6 h-12 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
			/>
		</div>
	</div>

	<div class="relative z-0 w-full mb-6 group">
		<input
			bind:checked={values.dance}
			id="checked-checkbox"
			type="checkbox"
			class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
		/>
		<label for="checked-checkbox" class="ml-2 text-sm font-normal text-slate-100 dark:text-gray-300"
			>Join the Dance Team</label
		>
	</div>

	<button
		type="submit"
		class=" text-white bg-[#79535C] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#79535C] dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>Submit</button
	>
</form>
