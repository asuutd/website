<script>
	import Menu from '../components/Menu.svelte';

	import { fly } from 'svelte/transition';
	import Hamburger from '../components/Hamburger.svelte';
	export let open = false;
	export let onClick = () => {
		open = !open;
		console.log(open);
	};

	let links = [
		{ href: '/', name: 'Home' },
		{ href: '/about', name: 'About' },
		{ href: '/register', name: 'JOIN ASU' }
	];
</script>

<header class="relative z-[2]">
	<div class="flex w-full m-0 p-0.5  justify-between">
		<div class="px-2 py-0.5 flex my-auto">
			<img class="h-20" src="static/images/pic_4.png" alt="hey" />
		</div>
		<div class="flex md:hidden">
			<Hamburger {open} {onClick} />
		</div>
		<div class="hidden md:visible px-3 py-0.5 md:flex my-auto">
			<div
				class="md:visible font-epilogue text-md px-3 py-3 hover:text-[#79424C] hover:font-bold hover:bg-white rounded-xl flex-auto mx-1"
			>
				<a href="/">Home</a>
			</div>

			<div
				class="md:visible font-epilogue text-md px-3 py-3 hover:text-[#79424C] hover:font-bold hover:bg-white rounded-xl flex-auto mx-1"
			>
				<a href="/about" class="p-0">About</a>
			</div>

			<div
				class="md:visible font-epilogue font-bold text-md px-3 py-3 transform transition duration-500 hover:scale-110 bg-[#490417] rounded-xl flex-auto mx-1"
			>
				<a href="/register " class="p-0">JOIN ASU</a>
			</div>
		</div>
	</div>
	{#if open}
		<nav
			class="absolute -z-10 flex w-full flex-col items-center gap-2 bg-background pb-4 bg-gray-600 shadow-md"
			transition:fly={{ y: -200, duration: 400 }}
		>
			{#each links as { href, name }}
				<a class="my-3 font-epilogue font-bold text-2xl" {href}>{name}</a>
			{/each}
		</nav>
	{/if}
</header>
