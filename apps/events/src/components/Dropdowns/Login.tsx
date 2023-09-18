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
				<Menu.Button className="inline-flex w-full justify-center rounded-md  py-2 text-sm font-medium  hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					<div className="rounded-full">
						<label className="btn m-1 btn-primary uppercase">Sign In</label>
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
						{providers &&
							Object.values(providers)
								.filter((provider) => provider.name != 'Credentials')
								.map((provider) => (
									<Menu.Item key={provider.id}>
										{({ active }) => (
											<button
												className={`${
													active ? 'bg-base-200 ' : 'text-gray-900'
												} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
												onClick={() => signIn(provider.id, { callbackUrl: window.location.href })}
											>
												<img
													src={`/OAuthProviderIcons/${provider.name}.svg`}
													alt="Discord"
													className="h-6 w-6"
												/>
												Sign in with {provider.name}
											</button>
										)}
									</Menu.Item>
								))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default LoginDropDown;
