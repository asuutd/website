<script lang="ts">
	import GalleryModal from '../../components/GalleryModal.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	/*nsos*/
</script>

<div class="mx-auto flex flex-col items-center">
	<div class="text-primary text-6xl text-center my-6">ASU Gallery</div>

	<div class="grid grid-cols-3 gap-2 mx-2 max-w-5xl">
		{#await data.streamed.dbPromise}
			{#each new Array(6) as _}
				<a class="group relative block rounded-xl overflow-hidden" href="#">
					<div
						class=" bg-gray-100 animate-pulse aspect-w-12 aspect-square aspect-h-7 sm:aspect-none rounded-xl overflow-hidden bg-pulse"
					/>
				</a>
			{/each}
		{:then events}
			{#each events as event}
				<!-- Card -->
				<GalleryModal {event} />
				<!-- End Card -->
			{/each}
		{/await}
	</div>
</div>
