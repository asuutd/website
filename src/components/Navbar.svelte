<script>
	import Menu from '../components/Menu.svelte';

	import { fly } from 'svelte/transition';
	import Hamburger from '../components/Hamburger.svelte';
	export let open = false;
	export const onClick = () => {
		open = !open;
		console.log(open);
	};

	export let links;
</script>

<header class="relative z-[2]">
	<div class="navbar">
		<div class="navbar-start">
			<img
				class="mask mask-circle h-20"
				src="https://ucarecdn.com/7288b6f4-6c2b-4e35-9da0-af992265a636/"
				alt="Hehe"
			/>
		</div>
		<div class="navbar-center">
			<a class="btn btn-ghost normal-case text-xl font-epilogue font-bold" href="/">UTD ASU</a>
		</div>
		<div class="navbar-end">
			<label tabindex="0" class="btn btn-ghost btn-circle lg:hidden" for="my-drawer-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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

			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal">
					<!-- Navbar menu content here -->
					{#each links as link}
						<li class={`max-w-sm py-2 px-2 mx-2 `}>
							<a
								role="button"
								href={link.href}
								class={`rounded-md ${link.name === 'JOIN ASU' && 'btn-primary'}`}>{link.name}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</header>
