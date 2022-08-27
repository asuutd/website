export const POST = () => {
	return new Response(import.meta.env.DATABASE_URL, {
		status: 200
	});
};
