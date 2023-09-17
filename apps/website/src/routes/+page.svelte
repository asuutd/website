<script lang="ts">
	import Carousel from '../components/Carousel.svelte';
	import Sponsors from '../components/Sponsors.svelte';
	import Event from '../components/Event.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.events);

	import { events as eventsData, getData } from '../stores/eventStore';

	let images = [
		{ id: 0, name: '1', imgurl: 'https://ucarecdn.com/f1bdaffa-341b-423f-9d1f-3b5d7d22f5b2/' },
		{ id: 1, name: '2', imgurl: 'https://ucarecdn.com/5615b449-ec4f-4bdd-b64d-438bb127d8f7/' },
		{ id: 2, name: '3', imgurl: 'https://ucarecdn.com/e9c22a8e-785f-4640-a7b0-176ca929bcb8/' },
		{ id: 3, name: '4', imgurl: 'https://ucarecdn.com/5def4651-388e-497c-b0dc-b09ab5573363/' }
	];

	const b = getData(4, 'all');
	let a = new Array(4).fill(null);

	let loading = true;
	eventsData.subscribe((val) => {
		if (val.length > 0) loading = false;
	});
</script>

<svelte:head>
	<title>ASU UTDallas</title>
	<meta
		name="description"
		content="Connect more with the African community at UTDallas. From volunteering events to galas, ASU UTD has activities for everyone"
	/>
</svelte:head>
<!-- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> -->
<!-- <p class="mx-4  p-4 ">
	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum aliquam repellat harum laborum non
	impedit error officia, fugit quis? Libero atque dicta quaerat ut harum laborum alias veniam minus!
	Nisi.
</p> -->

<Carousel {images} />

<div class="bg-white">
	<div class="grid grid-cols-3 justify-center">
		<div class="col-start-2 self-center justify-self-center">
			<h2 class=" text-4xl text-secondary p-5 mx-auto font-black">Events</h2>
		</div>

		<div class="col-start-3 justify-self-end self-center">
			<a href="/events" class="p-5 font-medium">See All</a>
		</div>
	</div>

	<div class="flex overflow-x-auto xl:grid xl:grid-cols-4 snap-x snap-mandatory">
		{#if !loading}
			{#each data.events as event}
				<div class="m-2 flex-shrink-0 snap-center" on:blur={() => console.log("Hello I'm pelps")}>
					<Event
						{event}
						disabled={Date.now() > Math.floor(new Date(event?.grayBy).getTime())}
						{loading}
					/>
				</div>
			{/each}
		{:else}
			{#each a as event}
				<div class="m-2">
					<Event
						{event}
						disabled={event?.date !== undefined &&
							Date.now() > Math.floor(new Date(event.date).getTime() / 1000)}
						{loading}
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>
