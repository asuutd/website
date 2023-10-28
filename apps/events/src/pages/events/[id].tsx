import type { Tier, Event } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage, GetStaticPaths, InferGetStaticPropsType, GetStaticPropsContext } from 'next/types';
import { createServerSideHelpers } from '@trpc/react-query/server';
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import RefCode from '../../components/RefCode';
import TicketSummary from '../../components/TicketSummary';
import Timer from '../../components/Timer/Timer';
import { appRouter } from '../../server/trpc/router';
import { trpc } from '../../utils/trpc';
import { prisma } from '../../server/db/client';
import { NextSeo } from 'next-seo';
import { env } from '../../env/client.mjs';
import Image from 'next/image';
import Display from '@/components/Map/Display';
import parse from 'html-react-parser';
import superjson from 'superjson';
import { createContextInner } from '@/server/trpc/context';
import { EVENT_PAGE_REVALIDATION } from '@/utils/constants';

type Ticket = {
	tier: Tier;
	quantity: number;
	amount: number;
};

enum UpOrDown {
	Asc = 'Ascending',
	Desc = 'Descending'
}

const Event: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
	const router = useRouter();
	const [checkout, setCheckout] = useState(false);
	const [quantity, setQuantity] = useState(0);

	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [mapsOpen, setMapsOpen] = useState(false);

	const [isOpen, setIsOpen] = useState(false);

	const [isRefOpen, setIsRefOpen] = useState(false);

	function closeRefModal() {
		setIsRefOpen(false);
	}
	function openRefModal() {
		setIsRefOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}
	const { id, refCode, code } = router.query;

	const eventId: string = typeof id === 'string' ? id : id == undefined ? ':)' : id[0]!;
	const ref: string | undefined =
		typeof refCode === 'string' ? refCode : refCode == undefined ? undefined : refCode[0]!;

	const discountCode: string | undefined =
		typeof code === 'string' ? code : code == undefined ? undefined : code[0]!;

	const event = trpc.event.getEvent.useQuery(
		{ eventId: eventId },
		{
			refetchInterval: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false 
		}
	);

	useEffect(() => {
		console.log(id, code);
	}, [router]);

	const setTicketQuantity = (val: number, dir: UpOrDown, tier: Tier) => {
		const newTickets = [...tickets];
		const newTicket = newTickets.find((ticket) => ticket.tier.id === tier.id);
		if (!newTicket) {
			if (dir !== UpOrDown.Desc) {
				const newTicket2: Ticket = { tier: tier, amount: tier.price, quantity: 1 };
				//setQuantity(quantity + 1);
				setTickets([...tickets, newTicket2]);
				setCheckout(true);
			}
		} else {
			if (newTicket?.quantity > 15 && dir === UpOrDown.Asc) return;
			if (newTicket?.quantity == 0 && dir === UpOrDown.Desc) return;
			const newAmount = dir === UpOrDown.Asc ? newTicket.quantity + 1 : newTicket.quantity - 1;

			newTicket.quantity = newAmount;
			if (newAmount === 0)
				newTickets.splice(newTickets.map((ticket) => ticket.tier.id).indexOf(tier.id), 1);
			setTickets(newTickets);

			/* 			if (dir === UpOrDown.Asc) setQuantity(quantity + 1);
			else setQuantity(val); */
			console.log(tickets);

			if (dir === UpOrDown.Desc) isDisabled();
			else setCheckout(true);
		}
	};

	const isDisabled = () => {
		let val = false;
		for (const ticket of tickets) {
			if (ticket.quantity > 0) {
				val = true;
				setCheckout(true);
				return;
			}
		}
		setCheckout(val);
	};

	return (
		<>
			<NextSeo
				title={event.data?.name ?? 'Event'}
				openGraph={{
					title: `${event.data?.name}` ?? 'Event',
					description: `Event Details of ${event.data?.name}`,
					url: `https://${env.NEXT_PUBLIC_URL}/seller/${event.data?.id}`,
					type: 'profile',
					profile: {
						username: event.data?.organizer?.user.name ?? undefined
					},
					images: (event.data?.image ? [{ url: event.data.image, width: 480, height: 270 }] : [])
					
				}}
				description={
					event.data?.description ??
					"Join us for an exciting event that promises to be a memorable experience. While the event details are not provided by the organizer, you can expect a day filled with fun, entertainment, and engagement. Stay tuned for updates and surprises as we get closer to the event date. Don't miss out on this fantastic opportunity to connect with like-minded individuals and enjoy a day of excitement. Save the date, and we look forward to sharing more information soon!"
				}
			/>
			<Head>
				<title>{event.data?.name ?? 'Event'}</title>
			</Head>
			<main className="mx-2 py-2 ">
				<div className="flex flex-col justify-center mx-auto max-w-3xl">
					<div className="">
						{event.data?.image ? (
							<Image
								src={event.data.image}
								alt=""
								className="w-auto rounded-md object-cover mx-auto"
								width={1600}
								height={900}
							/>
						) : (
							<img
								src="/placeholder.svg"
								alt=""
								className="w-full h-auto lg:h-96 rounded-md object-cover mx-auto bg-gray-200"
							/>
						)}
					</div>
					<div className="">
						<h2 className="text-4xl text-primary font-bold  my-6">Event</h2>
						{event.isFetched ? (
							<>
								<h3 className="uppercase text-4xl sm:text-5xl font-semibold  my-6">
									{event.data?.name}
								</h3>
								<div className="flex items-center gap-2">
									By
									<div className="flex items-center h-6 gap-2">
										<div className="h-6 w-6">
											<Image
												src={event.data?.organizer?.user.image ?? ''}
												alt=""
												width={200}
												height={200}
												className="object-contain"
											/>
										</div>

										{event.data?.organizer?.user.name}
									</div>
								</div>
							</>
						) : (
							<h3 className="h-12 w-72 bg-base-200 animate-pulse rounded-md my-6"></h3>
						)}

						<div className="my-6  ">
							<div className="flex mb-2 gap-3 collapse items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									className="fill-secondary"
									height="24"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
								</svg>
								{event.data?.location?.name ?? 'No Location'}
								<button
									className="btn btn-ghost btn-sm"
									onClick={() => setMapsOpen((mapsOpen) => !mapsOpen)}
								>
									{mapsOpen ? 'Hide' : 'Show'}
								</button>
							</div>

							{event.data?.location?.name && (
								<div className={`mb-2 ${mapsOpen ? '' : 'hidden'}`}>
									<Display address={event.data?.location?.name ?? ''} />
								</div>
							)}

							<div className="mt-2 flex gap-3 items-center">
								<img src="/clock.svg" alt="" className="w-5 h-5 " />
								<div className="flex flex-col">
									{event.data ? (
										<>
											<div>{event.data?.start.toLocaleDateString()}</div>
											<div>
												{event.data?.start.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												})}{' '}
												to{' '}
												{event.data?.end.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												})}
											</div>
										</>
									) : (
										<p className="h-12 w-48 animate-pulse bg-gray-200 rounded-md" />
									)}
								</div>
							</div>
						</div>
						{event.data?.description && (
							<>
								<h2 className="text-4xl text-primary font-bold  my-6">Description</h2>

								<div>{parse(event.data.description)}</div>
							</>
						)}

						<h2 className="text-4xl text-primary font-bold  my-6">Tickets</h2>

						{event.data ? (
							event.data.Tier.map((tier) => (
								<TierCard
									key={tier.id}
									tier={tier}
									tickets={tickets}
									quantity={quantity}
									setTicketQuantity={setTicketQuantity}
								/>
							))
						) : (
							<div className="flex flex-col lg:flex-row justify-between w-72 h-40 lg:h-auto animate-pulse gap-8 text-3xl items-center bg-base-200 px-4 py-8 rounded-md shadow-md my-3"></div>
						)}

						<div className="flex justify-between items-end">
							<button
								className={`flex btn btn-primary justify-self-center btn-lg ${
									!checkout && 'btn-disabled'
								}`}
								onClick={openModal}
							>
								CHECKOUT
							</button>
							{event.data?.ref_quantity && (
								<button className="text-xs underline" onClick={openRefModal}>
									Want a referral code?
								</button>
							)}
						</div>

						<Modal isOpen={isOpen} closeModal={closeModal}>
							<TicketSummary
								isOpen={isOpen}
								tickets={tickets}
								eventId={eventId}
								refCodeQuery={ref}
								discountCode={discountCode}
							/>
						</Modal>

						<Modal isOpen={isRefOpen} closeModal={closeRefModal}>
							<RefCode event={event.data} />
						</Modal>
					</div>
				</div>
			</main>
			{/* 			<AnimatePresence>
				{modalOpen && <Modal handleClose={close} text={'Hello World'} />}
			</AnimatePresence> */}
		</>
	);
};

export default Event;

const TierCard = ({
	tier,
	tickets,
	setTicketQuantity,
	quantity
}: {
	tier: Tier & {
		_count: {
			Ticket: number;
		};
	};
	tickets: Ticket[];
	setTicketQuantity: (val: number, dir: UpOrDown, tier: Tier) => void;
	quantity: number;
}) => {
	const soldOut = React.useMemo(() => {
		return tier._count.Ticket == (tier.limit ?? Number.MAX_SAFE_INTEGER);
	}, [tier]);
	return (
		<div
			className={` card max-w-md bg-base-100 shadow-xl my-4 ${soldOut ? 'grayscale' : ''}`}
			key={tier.id}
		>
			<div className="card-body">
				<h2 className="card-title text-2xl">{tier.name}</h2>
				{soldOut && <div className="w-32">(Sold Out)</div>}
				<div className="w-32">
					<Timer className="px-1 text-sm" endTime={tier?.end} />
				</div>

				<div className="card-actions justify-end">
					<div className="text-secondary text-lg font-semibold">${tier.price}</div>
					<div className="flex items-center gap-1">
						<button
							disabled={soldOut}
							onClick={() => setTicketQuantity(quantity - 1, UpOrDown.Desc, tier)}
						>
							<img src="/minus.svg" alt="" className="w-6 h-6 cursor-pointer" />
						</button>

						<div className="w-8 text-center">
							{tickets.find((ticket) => ticket.tier.id === tier.id)?.quantity || 0}
						</div>
						<button
							disabled={soldOut}
							onClick={() => setTicketQuantity(quantity + 1, UpOrDown.Asc, tier)}
						>
							<img src="/plus.svg" alt="" className="w-6 h-6 cursor-pointer" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export async function getStaticProps(
	context: GetStaticPropsContext<{ id: string }>,
  ) {
	const helpers = createServerSideHelpers({
	  router: appRouter,
	  transformer: superjson,
	  ctx: await createContextInner({
		session: null,
		headers: {}
	  }),
	});

	const id = context.params?.id as string;
	await helpers.event.getEvent.prefetch({ eventId: id });

	return {
	  props: {
		trpcState: helpers.dehydrate(),
		id,
	  },
	  revalidate: EVENT_PAGE_REVALIDATION,
	};
  }

export const getStaticPaths: GetStaticPaths = async () => {
	const events = await prisma.event.findMany({
		select: {
			id: true,
		},
		where: {
			end: {
				gt: new Date()
			}
		}
	});

	return {
		paths: events.map((post) => ({
			params: {
				id: post.id,
			},
		})),
		fallback: 'blocking',
	};
};