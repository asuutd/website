import { Dialog, Tab, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import type { Ticket, Tier, Event } from '@prisma/client';
import QRCode from 'qrcode';
import Image from 'next/future/image';
import { useSession } from 'next-auth/react';
import VanillaTilt from 'vanilla-tilt';
import { env } from '@/env/client.mjs';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

type TicketWithEventData = Ticket & {
	event: Event;
	tier: Tier | null;
};

const TicketSummary = ({ ticket }: { ticket?: TicketWithEventData }) => {
	const [QRCodeUrl, setQRCodeURL] = useState('');
	const { data: session } = useSession();

	useEffect(() => {
		if (!ticket) return;

		const generateQR = async (text: string) => {
			try {
				setQRCodeURL(
					await QRCode.toDataURL(text, {
						width: 400,
						margin: 1,
						color: {
							dark: '#490419',
							light: '#FEE8E1'
						}
					})
				);
			} catch (err) {
				console.error(err);
			}
		};
		generateQR(`${env.NEXT_PUBLIC_URL}/tickets/validate?id=${ticket.id}&eventId=${ticket.eventId}`);
	}, []);
	const root = useRef(null);
	useEffect(() => {
		if (!root.current) return;
		VanillaTilt.init(root.current, {
			max: 7.5,
			scale: 1.05,
			speed: 700,
			glare: true,
			'max-glare': 0.35,
			gyroscope: true
		});
	}, [root]);
	if (!ticket) return <></>;
	return (
		<>
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
					className="w-[320px] transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all"
				>
					<TicketCap rotated={false} />
					<div className="pt-6 bg-white">
						<div className="flex flex-col place-items-center">
							<Image
								src={session?.user?.image || '/pic_4.png'}
								alt=""
								className="w-10 rounded-full"
								width="50"
								height="50"
							/>

							<h2 className="text-lg font-bold">{session?.user?.name}</h2>
							<p className="text-xs">{session?.user?.email}</p>

							<p className="text-4xl font-bold mt-4 mb-2 text-center">{ticket.event.name}</p>
							<p className="text-gray-500 text-xs mb-2">
								{ticket.event.start.toLocaleDateString()}
							</p>

							<Tab.Group>
								<Tab.List className="flex space-x-1 rounded-xl bg-primary/20 p-1">
									<Tab
										key={'QRCode'}
										className={({ selected }) =>
											classNames(
												'w-max rounded-lg p-2.5 text-sm font-medium leading-5 text-primary',
												'ring-white ring-opacity-60 ring-offset-2 ring-offset-base-200 focus:outline-none focus:ring-2',
												selected
													? 'bg-white shadow'
													: 'text-secondary hover:bg-white/[0.12] hover:text-white'
											)
										}
									>
										QR Code
									</Tab>
								</Tab.List>
								<Tab.Panels className="mt-2">
									<Tab.Panel
										className={classNames(
											'rounded-xl bg-white p-3',
											'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
										)}
									>
										{QRCodeUrl && (
											<Image
												src={QRCodeUrl}
												width={200}
												height={200}
												className="mx-auto rounded-lg w-10/12"
												alt=""
											></Image>
										)}
									</Tab.Panel>
								</Tab.Panels>
							</Tab.Group>
							<div className="mt-6 border-t-2 border-b-gray-400 border-dashed p-6 font-mono flex flex-col gap-4 align-middle">
								<p className="text-[0.5rem]">
									This digital ticket #{ticket.id} grants 1 entry to{' '}
									<span className="italic">{ticket.event.name}</span>, presented by UTD ASU.
								</p>
								<ul className="text-xs font-mono flex  border border-primary divide-x divide-primary text-primary w-max">
									<li className="py-1 px-2">${ticket.tier?.price || '0'}</li>
									<li className="py-1 px-2">
										{ticket.tier && ticket.paymentIntent
											? ticket.tier.name
											: ticket.tier
											? `${ticket.tier.name}(Cash)`
											: 'Free Ticket'}
									</li>
									<li className="py-1 px-2">{ticket.event.start.toLocaleTimeString()}</li>
								</ul>
							</div>
						</div>
					</div>
					<TicketCap rotated={true} />
				</Dialog.Panel>
			</Transition.Child>
		</>
	);
};

function TicketCap(props: { rotated: boolean }) {
	const { rotated } = props;
	return (
		<svg
			className={classNames('w-full', rotated ? 'rotate-180' : '')}
			height="50"
			viewBox="0 0 320 50"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M-2.18557e-06 0L0 50L160 50L320 50L320 -1.39876e-05L210 -9.17939e-06C210 27.6142 187.614 50 160 50C132.386 50 110 27.6142 110 -4.80825e-06L-2.18557e-06 0Z"
				fill="white"
			/>
		</svg>
	);
}

export default TicketSummary;
