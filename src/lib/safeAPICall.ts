import { pool } from './db';

type AnyFunction = (...args: any[]) => any;

export const wrap = <Func extends AnyFunction>(
	fn: Func
): ((...args: Parameters<Func>) => ReturnType<Func>) => {
	const wrappedFn = (...args: Parameters<Func>): ReturnType<Func> => {
		// your code here

		if (args[0]['platform']) {
			console.log('CLOSING');
			args[0].platform.context.waitUntil(pool.end());
		}
		return fn(...args);
	};
	return wrappedFn;
};
