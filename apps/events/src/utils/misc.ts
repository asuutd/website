export const calculateApplicationFee = (total: number): number => {
	const fee = 0.032 * total + 50;
	console.log(total, fee);
	return 0.032 * total + 50;
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
