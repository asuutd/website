<script context="module">
	import Carousel from '../components/Carousel.svelte';

	let images = [
		{ id: 0, name: '1', imgurl: '/static/images/c1.jpg' },
		{ id: 1, name: '2', imgurl: '/static/images/c2.jpg' },
		{ id: 2, name: '3', imgurl: '/static/images/c3.jpg' },
		{ id: 3, name: '4', imgurl: '/static/images/c4.jpg' },
		{ id: 4, name: '5', imgurl: '/static/images/c5.webp' },
		{ id: 5, name: '6', imgurl: '/static/images/c6.webp' }
	];
	//export const prerender = true;
</script>

<script>
	import Event from '../components/Event.svelte';

	import { events, events as eventsData, getData } from '../stores/eventStore';

	const b = getData(4);
	let a = new Array(4).fill(null);

	let loading = true;
	eventsData.subscribe((val) => {
		if (val.length > 0) loading = false;
	});
</script>

<Carousel {images} />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<p class="mx-4 font-epilogue p-4 ">
	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum aliquam repellat harum laborum non
	impedit error officia, fugit quis? Libero atque dicta quaerat ut harum laborum alias veniam minus!
	Nisi.
</p>

<div class="flex justify-between">
	<h2 class="font-epilogue text-3xl font-black p-5">Events</h2>

	<a href="/events" class="p-5 font-epilogue font-medium">See All</a>
</div>

<div class="flex overflow-x-auto md:grid md:grid-cols-4 ">
	{#if !loading}
		{#each $eventsData as event}
			<div class="m-2 flex-shrink-0" on:click={() => console.log("Hello I'm pelps")}>
				<Event
					{event}
					disabled={Date.now() > Math.floor(new Date(event.date).getTime())}
					{loading}
				/>
			</div>
		{/each}
	{:else}
		{#each a as event}
			<div class="m-2 ">
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
