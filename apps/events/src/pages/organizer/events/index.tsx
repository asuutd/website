import { Tab } from '@headlessui/react';
import type { Ticket, Event, Tier } from '@prisma/client';
import Head from 'next/head';
import Image from 'next/future/image';
import { NextPage } from 'next/types';
import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import TicketDetails from '../../../components/TicketDetails';
import { trpc } from '../../../utils/trpc';
import Tilt from '../../../components/Tilt';
import EventForm from '../../../components/EventForm';
import Link from 'next/link';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

type ReturnedEvent = Event & {
	_count: {
		tickets: number;
	};
};

const Events: NextPage = () => {
	const [past, setPast] = useState<ReturnedEvent[]>([]);
	const [upcoming, setUpcoming] = useState<ReturnedEvent[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const events = trpc.organizer.getEvents.useQuery(undefined, {
		onSuccess: (data) => {
			const [small, large] = // Use "deconstruction" style assignment
				data.reduce(
					(result: any, element) => {
						result[element.end < new Date() ? 0 : 1].push(element); // Determine and push to small/large arr
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
	const paymentLink = trpc.payment.createStripeAccountLink.useMutation();
	const handlePaymentClick = () => {
		paymentLink.mutate(undefined, {
			onSuccess: (data) => {
				window.open(data.url, '_self');
			}
		});
	};

	return (
		<>
			<Head>
				<title>Events</title>
			</Head>
			<div className="flex flex-col w-full gap-y-5 px-2 py-16 sm:px-0 mx-auto">
				<div className="justify-between flex items-center">
					<h1 className="text-4xl font-bold">Events</h1>
					<div className="join">
						<button className="btn  btn-sm join-item" onClick={() => handlePaymentClick()}>
							Payments
						</button>
						<button className="btn btn-primary btn-sm join-item" onClick={() => setIsOpen(true)}>
							+ New
						</button>
					</div>
				</div>

				{events.isLoading && <p>Loading...</p>}
				{events.isError && <p>{errorMsg}</p>}
				{events.data && (
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
									'rounded-xl p-3 md:grid md:grid-cols-2 gap-2',
									'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
								)}
							>
								{upcoming.length === 0 ? (
									<div className="flex flex-wrap gap-8 bg-white">
										<p>You have no tickets for upcoming events.</p>
									</div>
								) : (
									upcoming.map((event) => (
										<div key={event.id} className=" ">
											<EventCard event={event} />
										</div>
									))
								)}
							</Tab.Panel>

							<Tab.Panel
								className={classNames(
									'rounded-xl  p-3 md:grid md:grid-cols-2 gap-2',
									'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
								)}
							>
								{past.length === 0 ? (
									<div className="flex flex-wrap gap-8 bg-white">
										<p>You have no tickets for past events.</p>
									</div>
								) : (
									past.map((event) => (
										<div key={event.id} className="grayscale">
											<EventCard event={event} />
										</div>
									))
								)}
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				)}
			</div>
			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<EventForm closeModal={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};

export default Events;

const EventCard = ({ event }: { event: ReturnedEvent }) => {
	return (
		<div className="card card-side bg-base-100 shadow-xl max-w-md my-4 h-80">
			<figure className="rounded-lg">
				{event.ticketImage ? (
					<Image
						src={event.ticketImage}
						alt="Movie"
						height={400}
						width={300}
						className="object-contain h-72 w-72 rounded-lg"
					/>
				) : (
					<p className="w-32 h-44 bg-base-200 animate-pulse" />
				)}
			</figure>
			<div className="card-body">
				<h2 className="card-title">{event.name}</h2>
				<h2>
					{' '}
					<span className="font-semibold">{event._count.tickets}</span> tickets sold.
				</h2>
				<div className="card-actions justify-end">
					<Link href={`/organizer/events/${event.id}`}>
						<a className="btn btn-primary btn-sm"> Details</a>
					</Link>
				</div>
			</div>
		</div>
	);
};
