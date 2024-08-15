<script lang="ts">
	import type { Event } from '$lib/validationSchemas';
	export let event: Event;
</script>

<div >
	<div class="w-80 max-w-xs md:max-w-md flex justify-center">
		<div
			class="rounded-lg shadow-lg bg-gradient-to-r from-base-100 to-base-200 min-w-full max-w-xs md:max-w-md max-h-full"
		>
			<div>
				<img
					class="object-cover h-80 w-full mx-auto p-4 rounded-lg"
					src={event.image}
					alt=""
				/>
			</div>

			<div class="pt-0 p-6 mx-auto">
				<h5 class="text-neutral text-lg font-bold mb-2">
					{event.name}
				</h5>

				<p class="text-neutral text-sm pb-2">
					Starts on {event.startDate.toLocaleDateString() + ', ' + event.startDate.toLocaleTimeString()}
				</p>
				
				{#if event.description}
					<p>
						{event.description}
					</p>
				{/if}
				
				<a
					href={event.link}
					type="button"
					class={`btn-primary btn mx-auto justify-self-center`}
					>{event.type === 'jonze' ? 'MARK ATTENDANCE' : 'GET TICKETS'}</a
				>
			</div>
		</div>
	</div>
</div>
