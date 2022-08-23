<script>
	export let images;
	import { Carousel } from 'flowbite-svelte';
</script>

<div class="rounded-lg lg:grid lg:grid-cols-2">
	<div class="hidden lg:flex lg:flex-col self-center">
		<h2
			class="font-bold font-epilogue text-6xl max-w-xs pt-3 px-6 mx-6 leading-snug  text-secondary justify-center"
		>
			UTDALLAS
		</h2>
		<br />
		<h2
			class="font-black font-epilogue text-6xl max-w-xs pb-3 px-6 mx-6 leading-snug  text-primary justify-center"
		>
			ASU
		</h2>
		<p class="px-6 mx-6 text-3xl font-semibold font-epilogue leading-relaxed">
			A community for those away from home where we celebrate our unique heritages from across the
			continent and more
		</p>
	</div>
	<div>
		<Carousel
			{images}
			loop
			showCaptions={false}
			showThumbs={false}
			duration={5000}
			divClass="w-full p-2"
		/>
	</div>
</div>
