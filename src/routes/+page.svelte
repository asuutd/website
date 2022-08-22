<script context="module">
	throw new Error("@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)");

	// import Carousel from '../components/Carousel.svelte';

	// let images = [
	// 	{ id: 0, name: '1', imgurl: 'https://ucarecdn.com/323827ea-002a-4d40-b253-07f781db6295/' },
	// 	{ id: 1, name: '2', imgurl: 'https://ucarecdn.com/7d65c601-b673-4788-88bb-e5f64e1e7317/' },
	// 	{ id: 2, name: '3', imgurl: 'https://ucarecdn.com/9bfd0001-9ca4-4601-8ea2-6b35955d5371/' },
	// 	{
	// 		id: 3,
	// 		name: '4',
	// 		imgurl: 'https://ucarecdn.com/2b0e2129-6bfa-4eb3-aab8-4f6de7c13360/'
	// 	}
	// ];
	// //export const prerender = true;

	// let sponsors = [
	// 	{
	// 		id: 0,
	// 		name: 'Aso Rock',
	// 		imgurl: 'https://ucarecdn.com/3620a88e-dda2-4f64-b047-f8e4f9f2fcd3/',
	// 		link: 'https://www.asorockmarket.com/'
	// 	}
	// ];
</script>

<script>
	import Sponsors from '../components/Sponsors.svelte';
	import Event from '../components/Event.svelte';

	import { events as eventsData, getData } from '../stores/eventStore';

	const b = getData(4);
	let a = new Array(4).fill(null);

	let loading = true;
	eventsData.subscribe((val) => {
		if (val.length > 0) loading = false;
	});
</script>

<Carousel {images} />
<svelte:head>
	<title>ASU UTDallas</title>
	<meta
		name="description"
		content="Connect more with the African community at UTDallas. From volunteering events to galas, ASU UTD has activities for "
	/>
</svelte:head>
<!-- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> -->
<!-- <p class="mx-4 font-epilogue p-4 ">
	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum aliquam repellat harum laborum non
	impedit error officia, fugit quis? Libero atque dicta quaerat ut harum laborum alias veniam minus!
	Nisi.
</p> -->

<div class="flex">
	<h2 class="font-epilogue text-4xl text-secondary p-5 mx-auto font-black">EVENTS</h2>

	<!-- <a href="/events" class="p-5 font-epilogue font-medium">See All</a> -->
</div>

<div class="flex overflow-x-auto xl:grid xl:grid-cols-4 snap-x snap-mandatory">
	{#if !loading}
		{#each $eventsData as event}
			<div class="m-2 flex-shrink-0 snap-center" on:blur={() => console.log("Hello I'm pelps")}>
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
<div class="flex ">
	<h2 class="font-epilogue text-3xl text-secondary font-black p-5 mx-auto">SPONSOR</h2>
</div>
<Sponsors {sponsors} />
