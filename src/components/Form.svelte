<script>
	import { supabase } from '../supabaseClient';
	import { personId, getPerson } from '../stores/personStore';
	let firstName = '';
	let lastName = '';

	export let id;

	const submitAttendance = async () => {
		console.log(supabase);
		try {
			await getPerson(firstName, lastName);
			console.log('After getPerson');
			console.log($personId);
			console.log(id);

			const { data, error } = await supabase.from('events_people').insert([
				{
					event_id: id,
					people_id: $personId[0].id
				}
			]);
			if (error) {
				return alert(error.message);
			}
			console.log(data);
		} catch (error) {
			alert(error.message);
		}

		console.log(firstName, lastName);
	};
</script>

<form class="my-6 max-w-sm" on:submit|preventDefault={submitAttendance}>
	<div class="p-4">
		<label class="font-bold mb-2 text-gray-800" for="firstName">First Name</label>
		<input
			class="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500"
			type="text"
			bind:value={firstName}
			name="firstName"
			placeholder="First Name"
		/>
	</div>

	<div class="p-4">
		<label class="font-bold mb-2 text-gray-800" for="lastName">Last Name</label>
		<input
			class="appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500"
			type="text"
			bind:value={lastName}
			name="lastName"
			placeholder="Last Name"
		/>
	</div>
	<div class="p-4">
		<button type="submit" class="btn">Submit</button>
	</div>
</form>
