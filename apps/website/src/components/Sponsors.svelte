<script>
	export let sponsors;
</script>

<div class="mx-auto">
	{#each sponsors as sponsor}
		<div class="p-4 mx-auto">
			<a href={sponsor.link}>
				<img
					src={sponsor.imgurl}
					alt={sponsor.name}
					class="mask mask-squircle object-cover transform transition duration-500 hover:scale-110 w-32 h-32 mx-auto"
				/>
			</a>
		</div>
	{/each}
</div>
