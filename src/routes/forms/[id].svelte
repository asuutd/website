<script context="module">
	export async function load({ params }) {
		const id = params.id;
		console.log(id);
		return { props: { id } };
	}
</script>

<script>
	export let id;
	//import { events, getData } from '../../stores/eventStore';
	import Form from '../../components/Form.svelte';

	//getData();
</script>

<Form {id} />
