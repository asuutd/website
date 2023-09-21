export const calculateApplicationFee = (total: number): number => {
	const fee = 0.032 * total + 50;
	console.log(total, fee);
	return 0.032 * total + 50;
};
