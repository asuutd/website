export const calculateApplicationFee = (total: number): number => {
	const fee = 0.065 * total + 80;
	console.log(total, fee);
	return 0.065 * total + 80;
};

export function isValidHttpUrl(string: string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
