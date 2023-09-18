import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import type { Event, Tier } from '@prisma/client';
import { useRouter } from 'next/router';

const RefCode = ({
	event
}: {
	event:
		| (Event & {
				Tier: Tier[];
		  })
		| null
		| undefined;
}) => {
	useEffect(() => {
		console.log(event);
	});
	const router = useRouter();
	const refCode = trpc.code.createReferalCode.useMutation();
	const getRefund = trpc.ticket.refundTicket.useMutation({
		onSuccess: () => {
			router.push('/tickets');
		},

		onError: (error) => {
			if (error.message === 'Charge ch_3LsNzbJtrYCcdARG1VieC2Y4 has already been refunded.') {
				setError('Refund already processed');
			}
		}
	});
	const getTicket = trpc.ticket.createFreeTicket.useMutation({
		onSuccess: () => {
			router.push('/tickets');
		}
	});

	const [buttonText, setButtonText] = useState('GENERATE');
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [error, setError] = useState<string | null>(null);

	trpc.ticket.getTicOrRef.useQuery(
		{
			eventId: event?.id || ':)'
		},
		{
			refetchInterval: undefined,
			onSuccess: (data) => {
				if (data.type === 'refund') {
					setButtonText('GET REFUND');
				} else if (data.type === 'free') {
					setButtonText('CLAIM TICKET');
				}

				if (data.type === 'none') {
					setButtonText('CLAIM/REFUND');
					setBtnDisabled(true);
				}
			}
		}
	);

	const processButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		console.log('Fbnuioweno');
		if (event) {
			if (buttonText === 'GENERATE') {
				refCode.mutate({ eventId: event.id });
			} else if (buttonText === 'GET REFUND') {
				getRefund.mutate({ eventId: event.id });
			} else if (buttonText === 'CLAIM TICKET') {
				getTicket.mutate({ eventId: event.id });
			}
		}
	};

	const [refMsg, setRefMsg] = useState('Copy Referral Link');

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
			<Dialog.Panel className="w-32max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
				{event && (
					<>
						<Dialog.Title
							as="h3"
							className="text-lg font-medium leading-6 text-gray-900 text-center"
						>
							Referral Code for {event.name}
						</Dialog.Title>
						{refCode.isSuccess && (
							<div className="mx-auto flex flex-col gap-4 my-2">
								<h2 className="text-6xl  text-center font-bold text-primary">
									{refCode.data.code}
								</h2>
								<button
									className="btn btn-secondary"
									onClick={() => {
										const prevMsg = refMsg;
										const resetMsg = () => setTimeout(() => setRefMsg(prevMsg), 1000);
										const link = window.location.href;
										const url = new URL(link);
										url.searchParams.set('refCode', refCode.data.code);
										navigator.clipboard
											.writeText(url.toString())
											.then(() => {
												setRefMsg('Copied!');
												resetMsg();
											})
											.catch(() => {
												setRefMsg('Copy failed!');
												resetMsg();
											});
									}}
								>
									{refMsg}
								</button>
								{refCode.data.ref_req && refCode.data.ref_req - refCode.data.ref_completed > 0 && (
									<p className="text-center text-md">
										<span className="text-secondary">
											{' '}
											{refCode.data.ref_req - refCode.data.ref_completed}{' '}
										</span>
										people till a free ticket / refund
									</p>
								)}
							</div>
						)}
						{refCode.isLoading && (
							<div className="mx-auto text-center">
								<svg
									version="1.1"
									id="L9"
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									x="0px"
									y="0px"
									viewBox="0 0 100 100"
									enableBackground="new 0 0 0 0"
									xmlSpace="preserve"
									className="w-16 h-16 mx-auto"
								>
									<path
										fill="#000"
										d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
									>
										<animateTransform
											attributeName="transform"
											attributeType="XML"
											type="rotate"
											dur="1s"
											from="0 50 50"
											to="360 50 50"
											repeatCount="indefinite"
										/>
									</path>
								</svg>
							</div>
						)}
						<div className="mt-2 mx-auto">
							<button
								className={`btn btn-md mx-auto flex ${
									(btnDisabled ||
										refCode.isLoading ||
										getRefund.isLoading ||
										getTicket.isLoading) &&
									'btn-disabled'
								}`}
								onClick={(e) => processButton(e)}
							>
								{buttonText}
							</button>
						</div>
						{error && (
							<div className="mt-2 mx-auto text-center">
								<p className="text-error">{error}</p>
							</div>
						)}
					</>
				)}
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default RefCode;
