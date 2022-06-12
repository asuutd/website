<script>
	export let images;
	import { Carousel } from 'flowbite-svelte';
</script>

<div class="rounded-lg">
	<Carousel
		{images}
		loop
		showCaptions={false}
		showThumbs={false}
		duration={5000}
		divClass="w-full p-2 "
	/>
</div>
