<script>
	export let image;
</script>

<div
	class="grid grid-cols-6 md:grid-cols-1 sm:undo:grid bg-secondary rounded-md drop-shadow-xl m-4"
>
	<div class="col-span-2 flex">
		{#if image !== undefined}
			<img
				class="object-cover h-24 w-24 md:h-36 md:w-36 sm: m-2 mask mask-squircle self-center mx-auto"
				src={image.image}
				alt="Profile Pic"
			/>
		{:else}
			<div class="w-12 bg-gray-300 h-12 rounded-full" />
		{/if}
	</div>

	<div class="col-span-4">
		<div class="flex flex-col">
			<h2
				class=" my-2 mx-0.5 text-center text-2xl font-semibold md:text-3xl px-2 md:py-4 text-base-100 justify-self-end"
			>
				{image.role}
			</h2>

			<h2
				class="text-xl mx-4 mb-2 md:text-2xl px-2 py-1 md:py-4 bg-base-100 text-center rounded-md text-secondary font-bold"
			>
				{image.name}
			</h2>

			<div class="self-end">
				<a href={`/board/${image.id}`}>
					<p
						class="text-base-100 bg-primary pl-2 py-1 pr-2.5 rounded-tl-md rounded-br-md self-center"
					>
						More...
					</p>
				</a>
			</div>
		</div>
	</div>
</div>

<!-- <div class="my-4 mx-auto w-48 h-48 flex items-center justify-center">
	<div class="justify-center items-center">
		<a href={`/board/${image.id}`}>
			<img
				for="my-modal-4"
				src={image.image}
				alt="Pelps"
				class="mask-squircle mask  modal-button"
			/>
		</a>
	</div>
</div> -->
