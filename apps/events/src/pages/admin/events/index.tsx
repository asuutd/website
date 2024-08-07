import { Tab } from '@headlessui/react';
import type { Event } from '@prisma/client';
import Head from 'next/head';
import { NextPage } from 'next/types';
import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import { trpc } from '../../../utils/trpc';
import EventForm from '../../../components/EventForm';
import Link from 'next/link';
import { format } from 'date-fns';
import ImageWithFallback from '@/components/Utils/ImageWithFallback';

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
					setErrorMsg(err?.message);
					break;
				default:
					setErrorMsg('An error occured while fetching your events. Please try again later.');
					break;
			}
		},
		retry: 3
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
					<h1 className="text-4xl font-bold">Organizer Dashboard</h1>

					{events.data && (
						<div className="join">
							<Link legacyBehavior className="" href="/scan">
								<p className="btn btn-sm join-item ">Scan Ticket</p>
							</Link>
							<button className="btn  btn-sm join-item" onClick={() => handlePaymentClick()}>
								Payments
							</button>
							<button className="btn btn-primary btn-sm join-item" onClick={() => setIsOpen(true)}>
								+ New
							</button>
						</div>
					)}
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
									<div className="flex flex-wrap gap-8 bg-white rounded-md p-2">
										<p>You have no upcoming events.</p>
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
									<div className="flex flex-wrap gap-8 bg-white rounded-md p-2">
										<p>You have no past events.</p>
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
				<EventForm
					closeModal={() => {
						setIsOpen(false);
						events.refetch();
					}}
				/>
			</Modal>
		</>
	);
};

export default Events;

const EventCard = ({ event }: { event: ReturnedEvent }) => {
	return (
		<div
			className="card w-72 sm:w-96 bg-base-100 shadow-xl my-4 mx-auto border-2 border-base-300"
			key={event.id}
		>
			<figure className="px-6 pt-6">
				<ImageWithFallback
					src={event.ticketImage ?? ''}
					alt="Image"
					className="rounded-xl object-cover aspect-square"
					width={400}
					height={400}
				/>
			</figure>
			<div className="card-body items-center text-center">
				<h2 className="card-title">{event.name}</h2>
				<div className="flex items-center gap-2">
					<img src="/clock.svg" alt="" className="w-5 h-5" />
					<h2>{format(event.start, 'PPP')}</h2>
				</div>
			</div>
			<div className="card-actions justify-end">
				<Link legacyBehavior href={`/admin/events/${event.id}`} shallow={true}>
					<a className="btn btn-primary rounded-tr-none rounded-bl-none">Details</a>
				</Link>
			</div>
		</div>
	);
};
