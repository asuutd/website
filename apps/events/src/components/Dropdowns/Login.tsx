import { Menu, Transition } from '@headlessui/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from 'next-auth/react';
import React, { useState, useEffect, Fragment } from 'react';

const LoginDropDown = () => {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	//const url = new URL(window.location.href);

	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<button
					onClick={() => signIn('google', { callbackUrl: window.location.href })}
					className="inline-flex w-full justify-center rounded-md  py-2 text-sm font-medium  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
				>
					<div className="rounded-full">
						<label className="btn m-1 btn-primary uppercase">Sign In</label>
					</div>
				</button>
			</div>
		</Menu>
	);
};

export default LoginDropDown;
