import { Fragment, useEffect, useMemo, useRef } from 'react';
import React from 'react';
import { OnResultFunction } from 'react-qr-reader';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
import { NextSeo } from 'next-seo';
import { Dialog, Transition } from '@headlessui/react';

export default function Wrapper() {
	const [text, setText] = React.useState<string | null>(null);
	const root = useRef(null);
	const validateMut = trpc.ticket.validateTicket.useMutation();
	const resetTime = 3000;

	const onNewScanResult: OnResultFunction = (result) => {
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
		<Transition.Child
			as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0 scale-95"
			enterTo="opacity-100 scale-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100 scale-100"
			leaveTo="opacity-0 scale-95"
		>
			<Dialog.Panel
				ref={root}
				className="w-[320px] bg-white transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all"
			>
				{text && (
					<div className="flex justify-start items-center">
						{validateMut.isSuccess && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="Layer_1"
								className=" w-5 h-5 fill-success"
								viewBox="0 0 122.88 101.6"
							>
								<title>tick-green</title>
								<path d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z" />
							</svg>
						)}

						{validateMut.isError && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								version="1.1"
								id="Layer_1"
								x="0px"
								y="0px"
								width="122.879px"
								height="122.879px"
								viewBox="0 0 122.879 122.879"
								enable-background="new 0 0 122.879 122.879"
								xmlSpace="preserve"
								className="w-5 h-5"
							>
								<g>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										fill="#FF4141"
										d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
									/>
								</g>
							</svg>
						)}
						<h2 className="font-semibold text-xl text-center">{text}</h2>
					</div>
				)}
				<Scanner onResult={onNewScanResult} />
			</Dialog.Panel>
		</Transition.Child>
	);
}

const Scanner = dynamic(() => import('./BarCodeScanner'), {
	ssr: false
});
