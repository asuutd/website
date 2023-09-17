<script>
	import { goto } from '$app/navigation';

	let disabled = false;
	const addToDance = async () => {
		const form = new FormData();
		form.append('netID', val);
		disabled = true;
		const result = await fetch('../api/register/dance', {
			method: 'POST',
			body: form
		});

		if (result.ok) {
			goto('/');
			disabled = false;
		} else {
			disabled = false;
			alert('Please walk up to a board member');
		}
	};

	let val = '';
</script>

<div class="flex justify-center gap-2">
	<input type="text" bind:value={val} class={`input input-primary `} placeholder="netID" />
	<button
		class={`btn btn-primary ${disabled && 'btn-disabled'}`}
		on:click|preventDefault={addToDance}>SUBMIT</button
	>
</div>
