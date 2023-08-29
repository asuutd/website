<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	let innerWidth = writable(0);
	let Calendar = null;
	let TimeGrid = null;
	let ListView = null;
	let ec = null;
	export let data: PageData;
	onMount(async () => {
		Calendar = (await import('@event-calendar/core')).default;
		TimeGrid = (await import('@event-calendar/time-grid')).default;
		ListView = (await import('@event-calendar/list')).default;
		console.log(innerWidth);

		ec = new Calendar({
			target: document.getElementById('calendar'),
			props: {
				plugins: [TimeGrid, ListView],
				options: {
					view: $innerWidth > 1024 ? 'timeGridWeek' : 'listMonth',
					events: data.data
				}
			}
		});
	});

	let plugins = [TimeGrid];
	let options = {
		view: 'timeGridWeek',
		events: [
			// your list of events
		]
	};

	const handleResize = () => {
		if ($innerWidth >= 1024) {
			ec?.setOption('view', 'timeGridWeek');
		} else {
			ec?.setOption('view', 'listMonth');
		}
	};

	innerWidth.subscribe(() => {
		handleResize();
	});
</script>

<svelte:window bind:innerWidth={$innerWidth} />

<div id="calendar" />
