import { useEffect, useMemo } from 'react';
import React from 'react';
import { OnResultFunction } from 'react-qr-reader';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
import { NextSeo } from 'next-seo';

export default function Test() {
	const [text, setText] = React.useState<string | null>(null);
	const validateMut = trpc.ticket.validateTicket.useMutation();
	const resetTime = 3000;

	const onNewScanResult: OnResultFunction = (result, error) => {
		if (!!result) {
			const url = new URL(result?.getText());
			const ticketId = url.searchParams.get('id');
			const eventId = url.searchParams.get('eventId');
			if (ticketId && eventId) {
				validateMut.mutate(
					{
						eventId,
						ticketId
					},
					{
						onSuccess: () => {
							setText('Checked In');
						},
						onError: ({ message }) => {
							setText(message);
						}
					}
				);
			}
		}
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Reset the state after 3 seconds
			setText(null);
		}, resetTime);

		return () => {
			// Clear the timeout if the component unmounts or if the state changes
			clearTimeout(timeoutId);
		};
	}, [text]);

	return (
		<>
			<NextSeo nofollow={true} />
		</>
	);
}

const Scanner = dynamic(() => import('../components/Admin/Scanner/BarCodeScanner'), {
	ssr: false
});
