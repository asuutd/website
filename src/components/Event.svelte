<script>
	export let event;
	export let disabled;
	export let loading;

	console.log(loading);

	console.log(disabled);
	console.log(event?.link);
	console.log(Math.floor(new Date(event?.date).getTime()));
	console.log(Date.now());
	let useGIF = false;

	const startGIF = () => {
		console.log(event?.GIF);
		useGIF = true;
	};
	const stopGIF = () => {
		useGIF = false;
	};
</script>

<div class="w-80 max-w-xs md:max-w-md flex justify-center {disabled ? 'grayscale' : ''}">
	<div class="rounded-lg shadow-lg bg-secondary min-w-full max-w-xs md:max-w-md max-h-full">
		{#if event?.description !== undefined}
			<div
				class=""
				on:touchstart={() => startGIF()}
				on:mouseenter={() => startGIF()}
				on:mouseleave={() => stopGIF()}
				on:click={() => console.log('FUCK OFF')}
			>
				<img
					class="rounded-t-lg object-fill h-80 w-full"
					src={!useGIF
						? `${event?.image}`
						: event?.GIF !== null
						? `${event?.GIF}`
						: `${event?.image}`}
					alt="It is what is it is"
				/>
			</div>
		{:else}
			<div class=" bg-gray-400 h-80 w-80 object-cover object-center rounded-t-lg animate-pulse" />
		{/if}
		<div class="p-6 mx-auto">
			{#if event?.description !== undefined}
				<h5 class="text-base-100 text-lg font-epilogue font-bold mb-2 ">
					{event?.description}
				</h5>
			{:else}
				<!-- svelte-ignore a11y-missing-content -->
				<h5 class="bg-gray-400 animate-pulse h-7 w-2/3 mb-2" />
			{/if}

			<button
				type="button"
				class={`btn-primary ${
					event?.link === undefined || event?.link === null || event?.link === '' ? 'invisible' : ''
				} btn  mx-auto justify-self-center`}><a href={event?.link}>REGISTER</a></button
			>
		</div>
	</div>
</div>
