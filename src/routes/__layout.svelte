<script>
	import Navbar from '../components/Navbar.svelte';
	import Footer from '../components/Footer.svelte';
</script>

<div class="p-0  mx-auto m-0 ">
	<Navbar />

	<div class="min-h-full">
		<slot />
	</div>

	<Footer />
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
