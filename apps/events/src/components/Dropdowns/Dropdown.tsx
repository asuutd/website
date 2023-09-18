import { Menu, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import React, { MouseEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
	signIn,
	signOut,
	useSession
} from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BuiltInProviderType } from 'next-auth/providers';
import { env } from '@/env/client.mjs';

export default function Example() {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	//const url = new URL(window.location.href);

	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	const router = useRouter();

	useEffect(() => {
		console.log(window.location.href);
	}, [router]);
	const { data: session, status } = useSession();
	const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
		//assertConfiguration().close(); //Close Ably Client on Logout
		signOut({ redirect: true, callbackUrl: env.NEXT_PUBLIC_URL });
	};

	return (
		<div className="">
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex w-full justify-center rounded-md  py-2 text-sm font-medium  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
						<div className="w-10 rounded-full">
							<Image
								src={session?.user?.image || '/Missing_avatar.svg'}
								layout="intrinsic"
								className="w-10 rounded-full"
								width="100"
								height="100"
							/>
						</div>
					</Menu.Button>
				</div>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="z-30 absolute right-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-base-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="px-1 py-2 ">
							<Menu.Item>
								{({ active }) => (
									<Link className={`${active ? 'bg-base-100 ' : 'text-gray-900'}`} href="/tickets">
										<a
											className={`${
												active ? 'bg-base-200 ' : 'text-gray-900'
											} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2 hover:bg-base-200`}
										>
											Tickets
										</a>
									</Link>
								)}
							</Menu.Item>

							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? 'bg-base-200 ' : 'text-gray-900'
										} group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
									>
										{session?.user?.role === 'ORGANIZER' ? (
											<Link href="/organizer/events" className="flex ">
												<div className="justify-between gap-2">Your Events</div>
											</Link>
										) : (
											<Link href="/register">
												<div className="justify-between gap-0">Organise an event</div>
											</Link>
										)}
									</button>
								)}
							</Menu.Item>

							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? 'bg-base-200 ' : 'text-gray-900'
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
										onClick={handleLogout}
									>
										Logout
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
