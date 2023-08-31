<script>
	export let event;
	export let disabled;
	export let loading;

	console.log(loading);

	console.log(disabled);
	console.log(event);
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

<div class="">
	<div class="w-80 max-w-xs md:max-w-md flex justify-center {disabled ? 'grayscale' : ''}">
		<div
			class="rounded-lg shadow-lg bg-gradient-to-r from-base-100 to-base-200 min-w-full max-w-xs md:max-w-md max-h-full"
		>
			{#if event?.description !== undefined}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="" on:click={() => console.log('FUCK OFF')}>
					<img
						class="object-cover h-80 w-full mx-auto p-4 rounded-lg"
						src={event.image}
						alt="It is what is it is"
					/>
				</div>
			{:else}
				<div class=" bg-gray-400 h-80 w-80 object-cover object-center rounded-t-lg animate-pulse" />
			{/if}
			<div class="pt-0 p-6 mx-auto">
				{#if event?.description !== undefined}
					<h5 class="text-neutral text-lg font-bold mb-2">
						{event?.description}
					</h5>
				{:else}
					<!-- svelte-ignore a11y-missing-content -->
					<h5 class="bg-gray-400 animate-pulse h-7 w-2/3 mb-2" />
				{/if}
				{#if event?.type === 'meeting'}
					<a
						href={`/forms/${event?.id}`}
						type="button"
						class={`btn-primary  btn  mx-auto justify-self-center`}
						>{event?.button_text || 'MARK ATTENDANCE'}</a
					>
				{:else}
					<a
						href={event?.link}
						type="button"
						class={`btn-primary ${
							event?.link === undefined || event?.link === null || event?.link === ''
								? 'invisible'
								: ''
						} btn  mx-auto justify-self-center`}>{event?.button_text || 'MARK ATTENDANCE'}</a
					>
				{/if}
			</div>
		</div>
	</div>
</div>
