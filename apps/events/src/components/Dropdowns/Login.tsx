import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const LoginDropDown = () => {
	const router = useRouter()
	const callbackUrl = useMemo(()=>
	router.pathname === '/signin' ? '' : router.asPath, [router.pathname, router.asPath])
	const signInUrl = useMemo(() => {
		const url = new URL('/signin', process.env.NEXT_PUBLIC_URL)
		url.searchParams.set('callbackUrl', callbackUrl)
		return url.toString()
	}, [callbackUrl])

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Link href={signInUrl}>
					<button
						className="inline-flex w-full justify-center rounded-md  py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
					>
						<div className="rounded-full">
							<label className="btn m-1 btn-primary uppercase">Sign In</label>
						</div>
					</button>
				</Link>
			</div>
		</Menu>
	);
};

export default LoginDropDown;
