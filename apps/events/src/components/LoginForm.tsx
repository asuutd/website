import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import type { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import type { BuiltInProviderType } from 'next-auth/providers';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { env } from '../env/client.mjs';

const LoginForm = ({
	providers
}: {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}) => {
	const session = useSession();
	const router = useRouter();
	const [email, setEmail] = useState('')

	const callbackUrl = useMemo(() => {
		if (router.pathname === '/signin') {
			const callbackPath = typeof router.query.callbackUrl === 'string' ? router.query.callbackUrl : '';
			const url = new URL(callbackPath, env.NEXT_PUBLIC_URL)
			return url.toString();
		}
		return new URL(router.asPath, env.NEXT_PUBLIC_URL).toString();
	}, [router])
	useEffect(() => {
		if (session.status === 'authenticated') {
			router.push(callbackUrl);
		}
	}, [session, callbackUrl, router])

	const handleEmailLogin = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			signIn('email', { email, callbackUrl });
		},
		[email, callbackUrl]
	)

	const filteredProviders = useMemo(() => {
		if (!providers) return null;
		return Object.values(providers)
			.filter((provider) => !['Credentials', 'Email'].includes(provider.name))
	}, [providers])

	const error = useMemo(() => {
		if (typeof router.query.error !== 'string') {
			return
		}
		switch (router.query.error) {
			case 'OAuthAccountNotLinked':
				return "This account is registered with a different provider. Please sign in using the provider used to create your account."
			case 'SessionRequired': 
				return "Please sign in to continue."
			default: return "An error occurred while signing in. Please try again";
		}
	}, [router.query.error])

	return (
		<div className="flex w-full sm:max-w-xl bg-white rounded-lg p-8 flex-col">
			{error && <div className="alert alert-warning">
			
			<span>{error}</span>
			</div>}
			{filteredProviders && filteredProviders
				.map((provider) => (
					<div key={provider.name} className="flex justify-center">
						<button
							className={`btn flex gap-3 content-center px-2 w-full py-3 my-2 justify-start`}
							onClick={() => signIn(provider.id, { callbackUrl })}
						>
							<img
								src={`https://authjs.dev/img/providers/${provider.name.toLowerCase()}.svg`}
								alt={provider.name}
								className="h-6 w-6"
							/>
							Sign in with {provider.name}
						</button>
					</div>
			))}
			{filteredProviders && filteredProviders.length > 0 && <div className="divider">OR</div>}

			<form className="form-control" onSubmit={handleEmailLogin}>
				<label className="label" htmlFor="input-email-for-email-provider">Email</label>
				<input id="input-email-for-email-provider" className="input input-primary input-bordered" type="email" name="email" placeholder="email@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
				<button className="btn btn-outline my-2" type="submit">Sign in with Email</button>
			</form>
		</div>
	);
};

export default LoginForm;
