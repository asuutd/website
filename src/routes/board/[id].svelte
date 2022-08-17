<script context="module">
	export async function load({ params }) {
		const id = params.id;
		console.log(id);
		return { props: { id } };
	}
</script>

<script>
	const board = [
		{
			image: 'https://ucarecdn.com/efc2c8e1-6131-42d0-9b42-c798cfb80341/',
			role: 'PRESIDENT',
			id: 'titus',
			major: 'FINANCE & CS'
		},
		{
			image: 'https://ucarecdn.com/33c28fd1-a845-4ba9-996b-e276eeaf5823/',
			role: 'VICE PRESIDENT',
			id: 'mageto',
			major: 'SOFTWARE ENG.'
		},
		{
			image: 'https://ucarecdn.com/6e189636-a28d-4c37-a158-27ea78ac96b7/',
			role: 'SECRETARY',
			id: 'omolere',
			major: 'NEUROSCIENCE'
		},
		{
			image: 'https://ucarecdn.com/22faefc1-8aa4-4753-a4cf-6fb3627af920/',
			role: 'PUBLIC RELATIONS',
			id: 'abigail',
			major: 'HEALTHCARE STUDIES'
		},
		{
			image: 'https://ucarecdn.com/e006e704-3fff-44a4-b783-945d3ba039bc/',
			role: 'EVENT COORDINATOR',
			id: 'onyedi',
			major: 'BIOMEDICAL ENG.'
		},
		{
			image: 'https://ucarecdn.com/29e27694-0780-4bc6-96ed-979e64f8620e/',
			role: 'TREASURER',
			id: 'grace'
		},
		{
			image: 'https://ucarecdn.com/a9b9926b-c0f7-48db-a067-807eb3b35b00/',
			role: 'COMMITTEE CHAIR',
			id: 'chiedza'
		},
		{
			image: 'https://ucarecdn.com/1ec82d4b-ef17-4398-b622-923ade457995/',
			role: 'DANCE COORDINATOR',
			id: 'ayo'
		},
		{
			image: 'https://ucarecdn.com/76ad1993-83d6-4d67-b683-eca8f0478215/',
			role: 'CONTENT CREATOR',
			id: 'pelumi'
		}
	];

	export let id;
</script>

<div class="mx-auto">
	<img
		src={board.find((mem) => mem.id === id).image}
		alt=""
		class="mx-auto mask mask-circle w-64"
	/>
</div>
