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
			<div className="dropdown dropdown-end">
				<label tabIndex={0} className="">
					<div className="w-10 hover:scale-110 transition ease-in-out">
						<Image
							src={session?.user?.image || '/Missing_avatar.svg'}
							layout="intrinsic"
							className="w-10 mask mask-squircle"
							alt="Profile Pic"
							width="100"
							height="100"
						/>
					</div>
				</label>
				<ul
					tabIndex={0}
					className="mt-3 z-[30] p-2 gap-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
				>
					<li>
						<Link href="/tickets">
							<a
								className={`group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2 hover:bg-base-200`}
							>
								Tickets
							</a>
						</Link>
					</li>
					<li>
						<button
							className={`hover:bg-base-200 group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
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
					</li>
					<li>
						<button
							className={`hover:bg-base-200 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
							onClick={handleLogout}
						>
							Logout
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
