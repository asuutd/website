import React, { useEffect, useMemo, useState } from 'react';
import { trpc } from '../utils/trpc';
import { NextSeo } from 'next-seo';

const Register = () => {
	const mutation = trpc.organizer.createOrganizer.useMutation();

	const handleClick = () => {
		mutation.mutate(undefined, {
			onSuccess: ({ accountLink }) => {
				window.open(accountLink.url, '_self');
			},
			onError: (err) => {
				if (err.data?.code === 'UNAUTHORIZED') {
					if (err.message === "You haven't added your phone_number") {
						alert("You haven't added your phone_number");
					} else {
						document.getElementById('my-modal-4')?.click();
					}
				}
			}
		});
	};
	const [value, setValue] = useState<{
		perTicket: number;
		numTickets: number;
	}>({
		numTickets: 0,
		perTicket: 0
	});

	const fees = useMemo(() => {
		if (value?.numTickets !== 0 && value?.perTicket !== 0) {
			const kazala = 0.065 * value.perTicket + 0.8 * value.numTickets;
			let eventbrite = 0;
			if (value.numTickets < 25) {
				eventbrite += 0;
			} else if (value.numTickets < 100) {
				eventbrite += 9.99;
			} else if (value.numTickets < 250) {
				eventbrite += 24.99;
			} else {
				eventbrite += 49.99;
			}

			const ev_service_fee = 0.037 * value.perTicket + 1.79 * value.numTickets;
			const ev_tax = 0.0825 * ev_service_fee;
			const ev_order_fee = 0.029 * (ev_service_fee + ev_tax);

			eventbrite += ev_service_fee + ev_order_fee;

			return {
				kazala,
				eventbrite
			};
		}
	}, [value]);

	useEffect(() => {
		console.log(fees);
	}, [fees, value]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'perTicket' | 'numTickets'
	) => {
		const conversion = parseFloat(e.target.value);
		if (isNaN(conversion)) {
			return;
		}
		if (type === 'perTicket') {
			setValue({
				perTicket: conversion,
				numTickets: value?.numTickets ?? 0
			});
		} else {
			setValue({
				numTickets: conversion,
				perTicket: value?.perTicket ?? 0
			});
		}
	};
	return (
		<>
			<NextSeo title="Organizer | Kazala" />
			<div className="hero min-h-[70vh]   rounded-md">
				<div className="hero-content text-center w-full">
					<div className="max-w-md">
						<h1 className="text-3xl lg:text-5xl font-bold">
							<span className=" text-primary">Leave the ticketing to us </span>
							<span className="text-xl lg:text-3xl">and make your event the best it can be</span>
						</h1>
						<p className="text-sm">
							You already have a lot on your plate trying to plan your events. Don&apos;t let absurd
							ticketing fees stop you from giving the best experience to your attendees
						</p>
						<button className="btn btn-primary" onClick={() => handleClick()}>
							Become an Organizer
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
				<div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
					<h2 className="text-3xl lg:text-4xl text-gray-800 font-bold dark:text-gray-200">
						<span className="text-primary">Kazala</span> vs Other Platforms
					</h2>
				</div>

				<div className="relative xl:w-10/12 xl:mx-auto">
					<div className="card  bg-base-100 shadow-lg  m-4 max-w-md">
						<div className="card-body">
							<h2 className="card-title text-3xl lg:text-4xl">Calculate your Fees</h2>
							<div className="">
								<label htmlFor="" className="mr-3">
									Price per ticket: <span>${value.perTicket}</span>
								</label>
								<span className="">
									<input
										type="range"
										min={0}
										max={100}
										step={5}
										value={value.perTicket}
										className="range range-secondary"
										onChange={(e) => handleInputChange(e, 'perTicket')}
									/>
								</span>
							</div>
							<div className="">
								<label htmlFor="" className="mr-3">
									Number of Tickets:{' '}
									<span>
										<input
											className=" w-14 h-8 py-0 border-none bg-base-100 ring-0"
											onChange={(e) => handleInputChange(e, 'numTickets')}
											value={value.numTickets}
										/>
									</span>
								</label>
								<span className="">
									<input
										type="range"
										min={0}
										max={200}
										className="range range-accent"
										value={value.numTickets}
										onChange={(e) => handleInputChange(e, 'numTickets')}
									/>
								</span>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
						<div>
							<div className="p-4 relative z-10 bg-base-100 border rounded-xl md:p-10 dark:bg-slate-900 dark:border-gray-700">
								<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Kazala</h3>
								<div className="text-sm text-gray-500">One simple fee for everything</div>

								{fees && (
									<div className="mt-5">
										<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
											Total Fees
										</h3>
										<span className="text-4xl font-bold text-primary dark:text-gray-200">
											${fees.kazala.toFixed(2)}
										</span>
									</div>
								)}

								<div className="mt-5">
									<span className="text-6xl font-bold text-gray-800 dark:text-gray-200">6</span>
									<span className="text-2xl font-bold text-gray-800 dark:text-gray-200">.5%</span>
									<span className="text-2xl ml-3 text-gray-500">+ 80¢</span>
								</div>

								<div className="mt-5">
									<span className="text-6xl font-bold text-gray-800 dark:text-gray-200">
										That&apos;s all
									</span>
								</div>
							</div>
						</div>

						<div>
							<div className="shadow-xl shadow-gray-200 p-5 relative z-10 bg-base-100 border rounded-xl md:p-10 dark:bg-slate-900 dark:border-gray-700 dark:shadow-gray-900/[.2]">
								<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Eventbrite</h3>
								<div className="text-sm text-gray-500 invisible">For growing businesses.</div>

								{fees && (
									<div className="mt-5">
										<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
											Total Fees
										</h3>
										<span className="text-4xl font-bold dark:text-gray-200">
											${fees.eventbrite.toFixed(2)}
										</span>
									</div>
								)}

								<div className="mt-5">
									<span className="text-6xl font-bold text-gray-800 dark:text-gray-200">3</span>
									<span className="text-2xl font-bold text-gray-800 dark:text-gray-200">.7%</span>
									<span className="text-2xl ml-3 text-gray-500">+ $1.79</span>
								</div>
								<div className="">
									<span className="text-4xl font-bold text-gray-800 dark:text-gray-200">2</span>
									<span className="text-xl font-bold text-gray-800 dark:text-gray-200">.9%</span>
									<span className="text-xl ml-3 text-gray-500">per order</span>
								</div>
								<div className="mb-2">
									<span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
										$0 - $250
									</span>
									<span className="text-xl ml-3 text-gray-500">upfront fees</span>
								</div>
							</div>
						</div>
					</div>

					<div className="hidden md:block absolute top-0 right-0 translate-y-16 translate-x-16">
						<svg
							className="w-16 h-auto text-orange-500"
							width="121"
							height="135"
							viewBox="0 0 121 135"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
							<path
								d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
							<path
								d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
						</svg>
					</div>

					<div className="hidden md:block absolute bottom-0 left-0 translate-y-16 -translate-x-16">
						<svg
							className="w-56 h-auto text-cyan-500"
							width="347"
							height="188"
							viewBox="0 0 347 188"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
								stroke="currentColor"
								stroke-width="7"
								stroke-linecap="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;
