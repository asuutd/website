export const GET = () => {
	return new Response(
		JSON.stringify({
			name: 'Pelumi Adegoke'
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
