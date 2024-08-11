<script lang="ts">
	import Carousel from '../components/Carousel.svelte';
	import Sponsors from '../components/Sponsors.svelte';
	import Event from '../components/Event.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { events } = data


	let images = [
		{ id: 0, name: '1', imgurl: 'https://ucarecdn.com/f1bdaffa-341b-423f-9d1f-3b5d7d22f5b2/' },
		{ id: 1, name: '2', imgurl: 'https://ucarecdn.com/5615b449-ec4f-4bdd-b64d-438bb127d8f7/' },
		{ id: 2, name: '3', imgurl: 'https://ucarecdn.com/e9c22a8e-785f-4640-a7b0-176ca929bcb8/' },
		{ id: 3, name: '4', imgurl: 'https://ucarecdn.com/5def4651-388e-497c-b0dc-b09ab5573363/' }
	];

	

	export const config = {
		isr: {
			// 10 minutes
			interval: 10 * 60,
		}
	}
</script>

<svelte:head>
	<title>ASU UT Dallas</title>
	<meta
		name="description"
		content="Connect more with the African community at UT Dallas. From volunteering events to galas, ASU UTD has activities for everyone"
	/>
</svelte:head>

<Carousel {images} />

<div class="bg-white">
	<div class="grid grid-cols-3 justify-center">
		<div class="col-start-2 self-center justify-self-center">
			<h2 class=" text-4xl text-secondary p-5 mx-auto font-black">Events</h2>
		</div>
	</div>

	<div class="flex overflow-x-auto xl:grid xl:grid-cols-4 snap-x snap-mandatory">
		{#each events as event}
			<div class="m-2 flex-shrink-0 snap-center" on:blur={() => console.log("Hello I'm pelps")}>
				<Event
					{event}
				/>
			</div>
		{/each}
	</div>
</div>
