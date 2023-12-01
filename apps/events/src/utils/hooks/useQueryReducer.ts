import React, { useEffect } from 'react';
import { useQueryState } from 'next-usequerystate';
import { ZodTypeAny, z } from 'zod';
type Opts<Z extends ZodTypeAny> = {
	// ...other db opts
	schema: Z;
};

export default function useQueryReducer<A, Z extends z.ZodTypeAny = z.ZodNever>(
	reducer: (state: z.infer<Z>, action: A) => z.infer<Z>,
	initialState: z.infer<Z>,
	queryKey: string,
	schema: Z
): [z.infer<Z>, (action: A) => void] {
	const [state, setState] = useQueryState(queryKey);

	const dispatch: React.Dispatch<A> = (action: A) => {
		//For empty case
		const parsedState = schema.safeParse((state && JSON.parse(state)) ?? initialState);
		console.log(parsedState, state, 20);
		if (parsedState.success) {
			const nextState = reducer(parsedState.data, action);
			console.log(nextState);
			setState(JSON.stringify(nextState));
		}
	};

	const parsedState = React.useMemo(() => {
		const result = schema.safeParse((state && JSON.parse(state)) ?? initialState);
		if (result.success) {
			return result.data;
		} else {
			return undefined;
		}
	}, [state]);

	return [parsedState as z.infer<Z> | undefined, dispatch];
}
