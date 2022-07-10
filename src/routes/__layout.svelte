<script>
	import Navbar from '../components/Navbar.svelte';
	import Footer from '../components/Footer.svelte';
	import { page } from '$app/stores';
	import { LogoFooter } from 'flowbite-svelte';

	let links = [
		{ href: '/', name: 'Home' },
		{ href: '/about', name: 'About' },
		{ href: '/board', name: 'Meet the Board' },
		{ href: '/register', name: 'JOIN ASU' }
	];

	console.log($page.url.pathname);
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
		<div class="overflow-y-auto h-screen">
			<div class="w-64 bg-base-100 h-screen">
				<div class="grid grid-rows-3 p-4">
					{#each links as link}
						<div class="mx-2">
							<a
								role="button"
								on:mouseenter={() => console.log(link.href + ' ' + $page.url.pathname)}
								class={`p-4 btn btn-primary mx-2 my-4 btn-lg w-full
									${$page.url.pathname !== link.href && 'btn-outline'}`}
								href={link.href}>{link.name}</a
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
