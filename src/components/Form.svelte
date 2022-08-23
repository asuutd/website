<script>
	import { supabase } from '$lib/supabaseClient';
	import { personId, getPersonByNetId } from '../stores/personStore';
	let netID = '';
	export let id;

	const submitAttendance = async () => {
		console.log(supabase);
		try {
			await getPersonByNetId(netID);
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
			//console.log(data);
		} catch (error) {
			alert(error.message);
		}
	};
</script>

<div class="grid grid-cols-2">
	<div>
		<p>HELLO NIGGAS</p>
	</div>
	<div>
		<form class="my-6 max-w-sm" on:submit|preventDefault={submitAttendance}>
			<div class="relative z-0 w-full mb-6 m-4">
				<input
					type="text"
					color="green"
					name="floating_first_name"
					id="floating_first_name"
					class=" text-xl block py-2.5 px-0 w-full  text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-slate-100 dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer "
					placeholder=" "
					bind:value={netID}
				/>
				<label
					for="floating_first_name"
					class="peer-focus:font-medium absolute text-md text-slate-100 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-slate-100 peer-focus:dark:text-slate-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>NetID</label
				>
			</div>
			<div class="p-4">
				<button type="submit" class="btn">Submit</button>
			</div>
		</form>
	</div>
</div>
