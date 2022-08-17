<script lang="ts">
	import Menu from '../components/Menu.svelte';

	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import Hamburger from '../components/Hamburger.svelte';
	export let open: boolean = false;
	export const onClick = () => {
		open = !open;
		console.log(open);
	};

	export let links: { href: string; name: string }[];
</script>

<header class="relative z-[2] mb-7 drop-shadow">
	<div class="navbar">
		<div class="navbar-start">
			<a href="/">
				<img
					class="mask mask-circle h-20"
					src="https://ucarecdn.com/7288b6f4-6c2b-4e35-9da0-af992265a636/"
					alt="Hehe"
				/>
			</a>
		</div>
		<div class="hidden md:navbar-center md:block">
			<ul class="menu menu-horizontal">
				{#each links.filter((link) => link.name !== 'JOIN ASU') as link}
					<li class={`max-w-sm py-2 px-2 mx-2 `}>
						<a
							role="button"
							href={link.href}
							class={`rounded-md font-semibold ${
								$page.url.pathname === link.href && 'text-primary'
							}`}>{link.name}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<div class="navbar-end">
			<label tabindex="0" class="btn btn-ghost btn-circle md:hidden" for="my-drawer-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 stroke-primary"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/></svg
				>
			</label>

			<div class="flex-none hidden md:block">
				<div class="max-w-sm py-2 px-2 mx-2 ">
					<a
						role="button"
						href="/register"
						class={`rounded-md btn-primary btn-lg font-bold px-5 py-4 `}>JOIN ASU</a
					>
				</div>
			</div>
		</div>
	</div>
</header>
