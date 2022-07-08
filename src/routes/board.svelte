<script>
	import BoardCard from '../components/BoardCard.svelte';

	const images = [
		'https://ucarecdn.com/02746da1-5547-480d-8e42-2af79125a6b4/',
		'https://ucarecdn.com/3d1958f1-a53a-413b-80d1-d737ab76e9fa/',
		'https://ucarecdn.com/adaca88f-f54b-476e-b28b-54f9e2d87ea8/',
		'https://ucarecdn.com/db36baa5-0279-479b-8732-3d669b788cd0/',
		'https://ucarecdn.com/dcbf67dc-c3e4-487a-ae9a-85f22c81b374/',
		'https://ucarecdn.com/2b21e1d9-5ea5-419d-8d00-4084bfeb1339/',
		'https://ucarecdn.com/93317900-16ab-4695-8ff7-50cc455d56d6/',
		'https://ucarecdn.com/2e2e097a-0e79-4b91-a8c8-cfd7da35efda/',
		'https://ucarecdn.com/98f1d39e-423c-477b-bff4-24cbc2d83671/'
	];
</script>

<div class="md:grid md:grid-cols-3">
	{#each images as image}
		<BoardCard {image} />
	{/each}
</div>
