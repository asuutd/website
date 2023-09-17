<script>
	import Modal from '../../components/Modal.svelte';

	let showModal = false;
</script>

<button on:click={() => (showModal = true)}> show modal </button>

<Modal bind:showModal />
