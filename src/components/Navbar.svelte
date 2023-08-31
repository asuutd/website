<script lang="ts">
	import Menu from '../components/Menu.svelte';

	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import Hamburger from '../components/Hamburger.svelte';
	import { signOut } from '@auth/sveltekit/client';

	export let open: boolean = false;
	export const onClick = () => {
		open = !open;
		console.log(open);
	};

	export let links: { href: string; name: string }[];
</script>

<header
	class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full border-gray-200 text-sm py-3 sm:py-0 dark:bg-gray-800 dark:border-gray-700"
>
	<nav
		class="relative w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
		aria-label="Global"
	>
		<div class="flex items-center justify-between">
			<a
				class="flex flex-none text-xl font-semibold dark:text-white items-center"
				href="/"
				aria-label="ASU UTDallas"
			>
				<img src="/images/pic_4.png" class="w-10 h-10" />ASU UTDallas</a
			>
			<div class="sm:hidden">
				<button
					type="button"
					class=" p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
					data-hs-collapse="#navbar-collapse-with-animation"
					aria-controls="navbar-collapse-with-animation"
					aria-label="Toggle navigation"
					on:click={() => {
						open = !open;
					}}
				>
					<svg
						class="hs-collapse-open:hidden w-4 h-4"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
						/>
					</svg>
					<svg
						class="hs-collapse-open:block hidden w-4 h-4"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div
			id="navbar-collapse-with-animation"
			class={` ${open ? 'hidden' : ''} overflow-hidden transition-all duration-300 basis-full grow`}
		>
			<div
				class="p-2 flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7"
			>
				{#each links.filter((link) => link.name !== 'JOIN ASU') as link}
					<a
						class={`font-medium  sm:py-6 ${$page.url.pathname === link.href && 'text-primary'}`}
						href={link.href}
						aria-current="page">{link.name}</a
					>
				{/each}

				{#if $page.data.session?.user}
					<div
						class="hs-dropdown [--strategy:static] sm:[--strategy:fixed] [--adaptive:none] sm:[--trigger:hover] sm:py-4"
					>
						<button
							type="button"
							class="flex items-center w-full text-gray-800 hover:text-gray-500 font-medium dark:text-gray-200 dark:hover:text-gray-400"
						>
							<img
								class="h-10 w-10 mask mask-squircle"
								src={$page.data.session.user.image ?? '/images/officers/avatar.png'}
								alt=""
							/>
							<svg
								class="ml-2 w-2.5 h-2.5 text-gray-600"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</button>

						<div
							class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] sm:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 sm:w-48 hidden z-10 sm:shadow-md rounded-lg p-2 before:absolute top-full before:-top-5 before:right-0 before:w-full before:h-5"
						>
							<button class="btn" on:click={() => signOut()}> Sign Out </button>
						</div>
					</div>
				{:else}
					<a
						class={`font-medium  sm:py-6 ${$page.url.pathname === '/register' && 'text-primary'}`}
						href={'/register'}
						aria-current="page">JOIN ASU</a
					>
				{/if}
			</div>
		</div>
	</nav>
</header>
