import LoginForm from '@/components/LoginForm';
import type { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion, getProviders } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const LoginPage = () => {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<div className="flex flex-col justify-center min-h-[66vh] gap-3 items-center">
				<h2 className="text-center text-5xl font-bold text-primary">Sign In</h2>
				<LoginForm providers={providers} />

				<Link legacyBehavior href="/">
					<a className="underline text-center">Go home</a>
				</Link>
			</div>
		</>
	);
};

export default LoginPage;
