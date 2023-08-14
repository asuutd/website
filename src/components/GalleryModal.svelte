<script lang="ts">
	import type { InferModel } from 'drizzle-orm';
	import type { events } from 'drizzle/schema';
	export let event: InferModel<typeof events, 'select'> = null;
	import Modal from './Modal.svelte';

	let showModal = false;
	console.log(event);
</script>

<button on:click={() => (showModal = true)} class="group relative block rounded-xl overflow-hidden">
	<div class="aspect-w-12 aspect-h-7 sm:aspect-none rounded-xl overflow-hidden">
		<img
			class="h-80 aspect-square group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-xl w-full object-cover"
			src={event.image}
			alt=":)"
		/>
	</div>

	<div class="absolute top-3 right-3">
		<svg
			aria-label="Carousel"
			class="x1lliihq x1n2onr6"
			color="rgb(255, 255, 255)"
			fill="rgb(255, 255, 255)"
			height="22"
			role="img"
			viewBox="0 0 48 48"
			width="22"
			><title>Carousel</title><path
				d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"
			/></svg
		>
	</div>
</button>

<Modal bind:showModal>
	<div class="relative bg-transparent">
		<img src={event.image} class="rounded-lg" alt="" />
	</div>
</Modal>
