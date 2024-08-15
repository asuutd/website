export async function load({ params }) {
	const id = params.id;
	console.log(id);
	return { id };
}
