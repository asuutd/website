<script lang="ts">
	export let images: {
		id: number;
		name: string;
		imgurl: string;
	}[];

	let currentIndex = 0;
	$: currentImage = images[currentIndex];

	setInterval(() => {
		currentIndex = (currentIndex + 1) % images.length;
	}, 3000);
</script>

<!-- Hero -->
<div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
	<!-- Grid -->
	<div class="grid md:grid-cols-3 gap-4 md:gap-8 xl:gap-20 md:items-center">
		<div>
			<h1
				class="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white"
			>
				UT Dallas <span class="text-primary">ASU</span>
			</h1>
			<p class="mt-3 text-lg text-gray-800 dark:text-gray-400">
				Empowering, Uniting, and Celebrating the Rich Tapestry of African Diversity and Cultures
			</p>
		</div>
		<!-- End Col -->

		<div class="relative ml-4 col-span-2">
			<img
				class="w-full rounded-lg object-cover h-[12rem] sm:h-72 md:h-72 lg:h-[30rem] animate-[fadeIn_5s]"
				src={currentImage.imgurl}
				alt="ASU Events"
			/>
			<div
				class="absolute inset-0 -z-[1] bg-gradient-to-tr from-base-300 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 mr-4 -ml-4 lg:mt-6 lg:-mb-6 lg:mr-6 lg:-ml-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"
			/>

			<!-- SVG-->

			<!-- End SVG-->
		</div>
		<!-- End Col -->
	</div>
	<!-- End Grid -->
</div>

<div class="relative mt-20">
	<div class="custom-shape-divider-bottom-1691955919">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				class="shape-fill"
			/>
		</svg>
	</div>
</div>

<!-- End Hero -->
<style>
	.custom-shape-divider-bottom-1691955919 {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		line-height: 0;
		transform: rotate(180deg);
	}

	.custom-shape-divider-bottom-1691955919 svg {
		position: relative;
		display: block;
		width: calc(100% + 1.3px);
		height: 150px;
	}

	.custom-shape-divider-bottom-1691955919 .shape-fill {
		fill: #ffffff;
	}
</style>
