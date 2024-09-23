import React, { MouseEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
	signOut,
	useSession
} from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BuiltInProviderType } from 'next-auth/providers';
import { env } from '@/env/client.mjs';
import { DEFAULT_PROFILE_IMAGE_PATH } from '@/utils/constants';
import posthog from 'posthog-js'

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
	useEffect(() => {
	if (session != null && session.user != null)
		posthog.identify(
			session.user.id, 
			session.user
		  );
	}, [session]);
	const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
		//assertConfiguration().close(); //Close Ably Client on Logout
		posthog.reset()
		signOut({ redirect: true, callbackUrl: env.NEXT_PUBLIC_URL });
	};

	return (
		<div className="">
			<div className="dropdown dropdown-end">
				<label tabIndex={0} className="">
					<div className="w-10 hover:scale-110 transition ease-in-out">
						<Image
							src={session?.user?.image || DEFAULT_PROFILE_IMAGE_PATH}
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
						<Link legacyBehavior href="/tickets">
							<p className="group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2 hover:bg-base-200">
								Tickets
							</p>
						</Link>
					</li>
					<li>
						<Link legacyBehavior href="/register">
							<p className="group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2 hover:bg-base-200">
								Organize an Event
							</p>
						</Link>
					</li>

					<li>
						<Link legacyBehavior href="/admin/events">
							<p className="group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2 hover:bg-base-200">
								Dashboard
							</p>
						</Link>
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
