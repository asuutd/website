<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { expoInOut, expoOut } from 'svelte/easing';

	export let url: URL;
	console.log(url.pathname);
</script>

{#key url}
	{#if url.pathname === '/pay'}
		<div
			in:fly|global={{ y: 200, duration: 250, delay: 300, easing: expoInOut }}
			out:fly|global={{ y: 200, duration: 250, easing: expoOut }}
		>
			<slot />
		</div>
	{:else}
		<div in:fade|global={{ duration: 250, delay: 300 }}>
			<slot />
		</div>
	{/if}
{/key}
