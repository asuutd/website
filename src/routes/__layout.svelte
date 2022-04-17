<script>
	import Navbar from '../components/Navbar.svelte';
</script>

<div class="p-0  mx-auto m-0 ">
	<Navbar />

	<slot />
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
