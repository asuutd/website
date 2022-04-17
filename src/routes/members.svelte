<script>
	import { personId, getPeople } from '../stores/personStore';
	getPeople();
</script>

<main>
	{#each $personId as person}
		<div class="rounded p-4 m-4 max-w-md drop-shadow-lg hover:bg-slate-200">
			<p class="font-epilogue mx-auto p-4 ">{person.first_name} {person.last_name}</p>
		</div>
	{/each}
</main>
