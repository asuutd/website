<script>
	import { events, getData } from '../../stores/eventStore';
	getData();
</script>

<main>
	{#each $events as event}
		<div class="rounded p-4 m-4  drop-shadow-lg hover:bg-slate-200">
			<p class="font-epilogue mx-auto p-4 ">{event.description}</p>
			<a class="rounded px-4 py-3 bg-purple-500 hover:bg-purple-400" href={`/forms/${event.id}`}>
				Register
			</a>
		</div>
	{/each}
</main>
