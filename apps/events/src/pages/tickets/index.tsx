import { Tab } from '@headlessui/react';
import type { Ticket, Event, Tier } from '@prisma/client';
import Head from 'next/head';
import Image from 'next/future/image';
import { NextPage } from 'next/types';
import React, { useState } from 'react';
import Modal from '../../components/Modal';
import TicketDetails from '../../components/TicketDetails';
import { trpc } from '../../utils/trpc';
import Tilt from '../../components/Tilt';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

type TicketWithEventData = Ticket & {
	event: Event;
	tier: Tier;
};

const Ticket: NextPage = () => {
	const [past, setPast] = useState<TicketWithEventData[]>([]);
	const [upcoming, setUpcoming] = useState<TicketWithEventData[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const ticket = trpc.ticket.getTicket.useQuery(undefined, {
		onSuccess: (data) => {
			const [small, large] = // Use "deconstruction" style assignment
				data.reduce(
					(result: any, element) => {
						result[element.event.end < new Date() ? 0 : 1].push(element); // Determine and push to small/large arr
						return result;
					},
					[[], []]
				);
			setErrorMsg(null);

			setPast(small);
			setUpcoming(large);
		},
		onError: (err) => {
			switch (err?.data?.code) {
				case 'UNAUTHORIZED':
					setErrorMsg('You are not authorized to view this page. Please sign in to continue.');
					break;
				default:
					setErrorMsg('An error occured while fetching your tickets. Please try again later.');
					break;
			}
		}
	});

	return (
		<>
			<Head>
				<title>Tickets</title>
			</Head>
			<div className="flex flex-col w-full gap-y-5 px-2 py-16 sm:px-0 mx-auto">
				<h1 className="text-4xl font-bold">Tickets</h1>
				{ticket.isLoading && <p>Loading...</p>}
				{ticket.isError && <p>{errorMsg}</p>}
				{ticket.data && (
					<Tab.Group>
						<Tab.List className="flex space-x-1 rounded-xl p-1">
							<Tab
								key={'upcoming'}
								className={({ selected }) =>
									classNames(
										'transition px-2 py-2.5 text-lg font-bold leading-5',
										'ring-white ring-opacity-60 ring-offset-2 ring-offset-base-200 focus:outline-none border-b-4 ',
										selected
											? 'border-b-primary'
											: 'border-b-transparent hover:bg-white/[0.12] hover:border-b-secondary/50 active:border-b-secondary/75'
									)
								}
							>
								Upcoming
							</Tab>
							<Tab
								key={'past'}
								className={({ selected }) =>
									classNames(
										'transition px-2 py-2.5 text-lg font-bold leading-5',
										'ring-white ring-opacity-60 ring-offset-2 ring-offset-base-200 focus:outline-none border-b-4 ',
										selected
											? 'border-b-primary'
											: 'border-b-transparent hover:bg-white/[0.12] hover:border-b-secondary/50 active:border-b-secondary/75'
									)
								}
							>
								Past
							</Tab>
						</Tab.List>
						<Tab.Panels className="mt-2 w-full">
							<Tab.Panel
								className={classNames(
									'rounded-xl p-3 mx-auto',
									'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
								)}
							>
								<div className="md:grid md:grid-cols-2 gap-8">
									{upcoming.length > 0 ? (
										upcoming.map((ticket) => (
											<TicketCard
												priority={true}
												key={ticket.id}
												ticket={ticket}
												hide={isOpen}
												onClick={() => {
													setSelectedTicket(ticket.id);
													setIsOpen(true);
												}}
											/>
										))
									) : (
										<p>You have no tickets for upcoming events.</p>
									)}
								</div>
							</Tab.Panel>

							<Tab.Panel
								className={classNames(
									'rounded-xl p-3 mx-auto',
									'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
								)}
							>
								<div className="md:grid mx-auto md:grid-cols-2 gap-8 grayscale-45">
									{past.length > 0 ? (
										past.map((ticket) => (
											<TicketCard
												priority={false}
												key={ticket.id}
												ticket={ticket}
												hide={isOpen}
												onClick={() => {
													setSelectedTicket(ticket.id);
													setIsOpen(true);
												}}
											/>
										))
									) : (
										<p>You have no tickets for past events.</p>
									)}
								</div>
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				)}
			</div>
			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<TicketDetails
					ticket={
						(ticket.data?.find((t) => t.id == selectedTicket) as unknown as TicketWithEventData) ||
						undefined
					}
				/>
			</Modal>
		</>
	);
};

export default Ticket;

function TicketCard(props: {
	ticket: TicketWithEventData;
	onClick: () => void;
	priority: boolean;
	hide?: boolean;
}) {
	const { ticket, onClick, priority, hide = false } = props;
	return (
		<Tilt>
			<div
				onClick={onClick}
				key={ticket.id}
				className={classNames(
					'border mx-auto relative rounded-md bg-white my-3 w-80 hover:scale-110 transition-all text-black shadow-xl hover:shadow-2xl hover:cursor-pointer',
					hide ? 'opacity-0 invisible' : 'opacity-100'
				)}
			>
				<div
					className={`relative flex flex-col w-full justify-center items-center overflow-hidden text-left ${
						priority ? '' : 'grayscale'
					} `}
				>
					<div className="w-full h-[60%] absolute top-0 left-0">
						<Image
							src={ticket.event.ticketImage || ''}
							alt=""
							sizes="33vw"
							fill
							className="object-cover opacity-30 animate-slow-spin blur-xl "
						/>
					</div>
					<div className="z-[1] flex flex-col content-start gap-2 p-4">
						<div className="place-self-center rounded-full my-2 h-4 w-16 bg-white border shadow-inner"></div>
						<Image
							src={ticket.event.ticketImage || ''}
							alt=""
							priority={priority}
							sizes="33vw"
							width={256}
							height={288}
							className="object-cover rounded-md"
						/>
						<ul className="text-xs font-mono flex  border border-primary divide-x divide-primary text-primary w-max">
							<li className="py-1 px-2">{ticket.event.start.toLocaleTimeString()}</li>
						</ul>
						<div className="flex flex-col ">
							<h3 className="font-bold text-2xl uppercase">{ticket.event.name}</h3>
							<h5 className="text-md text-gray-600">{ticket.event.start.toLocaleDateString()}</h5>
						</div>
						<button
							type="button"
							className="btn btn-sm rounded-sm border-none transition duration-200 flex justify-self-center bg-black text-white w-full hover:bg-primary hover:scale-125"
						>
							SHOW PASS →
						</button>
					</div>
				</div>
			</div>
		</Tilt>
	);
}
