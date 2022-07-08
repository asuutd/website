<script>
	import Navbar from '../components/Navbar.svelte';
	import Footer from '../components/Footer.svelte';

	let links = [
		{ href: '/', name: 'Home' },
		{ href: '/about', name: 'About' },
		{ href: '/board', name: 'Meet the Board' },
		{ href: '/register', name: 'JOIN ASU' }
	];
</script>

<div class="drawer p-0  mx-auto m-0 drawer-end">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div class="">
			<Navbar {links} />

			<div class="min-h-full">
				<slot />
			</div>

			<Footer />
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu p-4 overflow-y-auto w-80 bg-base-100 justify-start">
			<!-- Sidebar content here -->
			{#each links as link}
				<li
					class={`max-w-sm py-3 justify-items-center text-2xl ${
						link.name === 'JOIN ASU' ? 'bg-[#79424C]' : null
					}`}
				>
					<a href={link.href}>{link.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
