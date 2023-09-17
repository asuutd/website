import type { TRPCError } from '@trpc/server';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';

const ValidatePage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const ticketId = typeof id === 'string' ? id : id == undefined ? ':)' : id[0]!;
	const [errorText, setErrorText] = useState<string | null>(null);
	const [admin, setAdmin] = useState<
		| {
				eventId: string;
		  }
		| undefined
	>();

	const validate = trpc.ticket.validateTicket.useMutation({
		onError: (err) => {
			setErrorText(err.message);
		}
	});
	const adminQuery = trpc.auth.getAdmin.useQuery(
		{
			ticketId: ticketId
		},
		{
			enabled: false,
			onError: (err) => {
				setErrorText(err.message);
			},
			retry: 0
		}
	);

	const validateTicket = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		admin &&
			validate.mutate({
				eventId: admin.eventId,
				ticketId: ticketId
			});
	};

	useEffect(() => {
		async function anyNameFunction() {
			const { data, isSuccess } = await adminQuery.refetch();
			if (isSuccess) {
				setAdmin(data);
			}
		}

		// Execute the created function directly
		anyNameFunction();
	}, [router.isReady]);
	return (
		<div className="flex flex-col justify-center min-h-[66vh] gap-3 max-w-md mx-auto">
			<button
				className={`btn btn-primary ${(errorText || validate.isLoading) && 'btn-disabled'}`}
				onClick={(e) => {
					validateTicket(e);
				}}
			>
				{validate.isLoading && (
					<svg
						className=" h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				)}
				{validate.isSuccess && (
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
				{validate.isError && (
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
				CHECK ATTENDEE
			</button>
			{errorText && <h2 className="text-error font-semibold text-xl text-center">{errorText}</h2>}
		</div>
	);
};

export default ValidatePage;
