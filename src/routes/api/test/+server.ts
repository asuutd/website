export const POST = () => {
	return new Response(import.meta.env.VITE_DATABASE_URL, {
		status: 200
	});
};
