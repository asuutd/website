import { useEffect, useMemo } from 'react';
import React from 'react';
import { OnResultFunction } from 'react-qr-reader';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
import { NextSeo } from 'next-seo';
import useQueryReducer from '@/utils/hooks/useQueryReducer';
import { ZodSchema, z } from 'zod';

const zodSchema = z.object({
	count: z.number()
});
type State = z.infer<typeof zodSchema>;

type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: Action) {
	console.log(action);
	switch (action.type) {
		case 'increment':
			return { ...state, count: state.count + 1 };
		case 'decrement':
			return { ...state, count: state.count - 1 };
		default:
			return state;
	}
}

export default function Test() {
	const [parsedState, dispatch] = useQueryReducer<Action, typeof zodSchema>(
		reducer,
		{
			count: 0
		},
		'count',
		zodSchema
	);

	const [client, setClient] = React.useState(false);
	useEffect(() => {
		setClient(true);
	}, []);

	return (
		<>
			{client && (
				<button className="btn" onClick={() => dispatch({ type: 'increment' })}>
					STATE {parsedState?.count}
				</button>
			)}
		</>
	);
}

