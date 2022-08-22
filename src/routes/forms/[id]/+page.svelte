<script>
	export let data;
	let { id } = data;
	//import { events, getData } from '../../stores/eventStore';
	import Form from '../../../components/Form.svelte';

	//getData();
</script>

<Form {id} />
