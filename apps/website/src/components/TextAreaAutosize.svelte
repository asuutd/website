<script lang="ts">
	export let value = '';
	export let minRows = 1;
	export let maxRows: number;
	export let placeholder: string;
	export let name: string;

	$: minHeight = `${1 + minRows * 1.2}em`;
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;
</script>

<div class="relative">
	<pre aria-hidden="true" style="min-height: {minHeight}; max-height: {maxHeight}">{value +
			'\n'}</pre>

	<textarea
		class="textarea textarea-secondary border-neutral w-full p-2 focus:border-secondary focus:ring-secondary"
		bind:value
		{name}
		{placeholder}
	/>
</div>

<style>
	pre,
	textarea {
		font-family: inherit;
		padding: 0.5em;
		box-sizing: border-box;
		line-height: 1.2;
		overflow: hidden;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>
