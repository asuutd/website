import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import MobileCarousel from '../components/MobileCarousel';
import TypeWriter from 'typewriter-effect';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { format } from 'date-fns';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';

const Home: NextPage = () => {
	const data = useMemo(
		() => [
			{
				id: 1,
				name: 'Rare Wind',
				description: '#a8edea → #fed6e3',
				css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
				height: 300,
				image: 'https://ucarecdn.com/1873c6d8-b49d-4346-8b13-c88802b1b567/'
			},
			{
				id: 2,
				name: 'Saint Petersburg',
				description: '#f5f7fa → #c3cfe2',
				css: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
				height: 300,
				image: 'https://ucarecdn.com/39567007-8c47-4d19-a39c-a8ecc39aecfc/'
			}
		],
		[]
	);

	const [currentIndex, setCurrentIndex] = useState(0);
	useEffect(() => {
		//Implementing the setInterval method
		const interval = setInterval(() => {
			setCurrentIndex((currentIndex) => (currentIndex + 1) % data.length);
		}, 3000);

		//Clearing the interval
		return () => clearInterval(interval);
	}, [data]);

	return (
		<>
			<Head>
				<title>Kazala</title>
				<meta name="description" content="Pay for special events that ASU hosts" />
				<link rel="icon" href="/favicon.svg" />
			</Head>
			<main className="py-2 ">
				<div className="relative overflow-hidden">
					<div
						aria-hidden="true"
						className="flex absolute -top-96 left-1/2 transform -translate-x-1/2"
					>
						<div className=" blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem] dark:from-violet-900/50 dark:to-purple-900"></div>
						<div className="  blur-3xl w-[90rem] h-[50rem] rounded-fulls origin-top-left -rotate-12 -translate-x-[15rem] dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
					</div>

					<div className="relative z-10">
						<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
							<div className="max-w-2xl text-center mx-auto">
								<p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-r from-[#EBDCD0] to-base-300">
									<span className="text-primary">Kazala:</span> Seamless & Inexpensive Ticketing
								</p>

								<div className="mt-5 max-w-2xl">
									<h1 className="text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl">
										Events{' '}
										<div className="text-primary font-semibold">
											<TypeWriter
												options={{
													strings: ['around your campus.', 'from your orgs.', 'run by you?'],
													autoStart: true,
													loop: true,
													delay: 100,
													wrapperClassName:
														' text-3xl font-bold  sm:text-4xl lg:text-6xl my-10  rounded-lg '
												}}
											/>
										</div>
									</h1>
								</div>

								<div className="mt-5 max-w-3xl">
									<p className="text-lg">
										Kazala links you to campus activities and organization-hosted gatherings,
										enabling you to explore and engage in what matters most to you.
									</p>
								</div>

								<div className="mt-8 grid gap-3 w-full sm:inline-flex sm:justify-center">
									<a href="#events" className="btn btn-primary">
										Upcoming Events{' '}
										<svg
											className="w-6 h-6 fill-white"
											clip-rule="evenodd"
											fill-rule="evenodd"
											stroke-linejoin="round"
											stroke-miterlimit="2"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="m9.001 13.022h-3.251c-.412 0-.75.335-.75.752 0 .188.071.375.206.518 1.685 1.775 4.692 4.945 6.069 6.396.189.2.452.312.725.312.274 0 .536-.112.725-.312 1.377-1.451 4.385-4.621 6.068-6.396.136-.143.207-.33.207-.518 0-.417-.337-.752-.75-.752h-3.251v-9.02c0-.531-.47-1.002-1-1.002h-3.998c-.53 0-1 .471-1 1.002z"
												fill-rule="nonzero"
											/>
										</svg>
									</a>
									<Link className="" href="/register">
										<a className="group py-3 px-4 bg-base-100 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold hover:bg-accent hover:text-white focus:outline-none focus:ring-2  focus:ring-offset-2 transition-all text-sm dark:text-white ">
											Run an Event?
											<svg
												className="w-6 h-6 fill-black group-hover:fill-white -rotate-90"
												clip-rule="evenodd"
												fill-rule="evenodd"
												stroke-linejoin="round"
												stroke-miterlimit="2"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="m9.001 13.022h-3.251c-.412 0-.75.335-.75.752 0 .188.071.375.206.518 1.685 1.775 4.692 4.945 6.069 6.396.189.2.452.312.725.312.274 0 .536-.112.725-.312 1.377-1.451 4.385-4.621 6.068-6.396.136-.143.207-.33.207-.518 0-.417-.337-.752-.75-.752h-3.251v-9.02c0-.531-.47-1.002-1-1.002h-3.998c-.53 0-1 .471-1 1.002z"
													fill-rule="nonzero"
												/>
											</svg>
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="my-5 ">
					<h2 className="text-3xl" id="events">
						Upcoming Events
					</h2>
					<EventCards />
				</div>
			</main>
		</>
	);
};

export default Home;

const EventCards = () => {
	const client = trpc.event.getEvents.useQuery();
	return (
		<div className="md:grid md:grid-cols-2  md:gap-2 ">
			{client.isLoading ? (
				<>
					<div className="card w-72 sm:w-96 bg-base-100 animate-pulse shadow-xl my-4 mx-auto h-96" />
					<div className="card w-72 sm:w-96 bg-base-100 animate-pulse shadow-xl my-4 mx-auto h-96" />
				</>
			) : (
				client.data?.map((event) => (
					<div className="card w-72 sm:w-96 bg-base-100 shadow-xl my-4 mx-auto" key={event.id}>
						<figure className="px-10 pt-10">
							<Image
								src={event.ticketImage ?? ''}
								alt="Shoes"
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
							<Link href={`/events/${event.id}`} shallow={true}>
								<a className="btn btn-primary rounded-tr-none rounded-bl-none">Get Tickets</a>
							</Link>
						</div>
					</div>
				))
			)}
		</div>
	);
};
