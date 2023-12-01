import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { prisma } from '../../../server/db/client';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

const Invite: NextPage<{
	status?: string;
	event?: {
		id: string;
		name: string;
	};
}> = ({ event }) => {
	const acceptRouter = trpc.organizer.acceptInvite.useMutation();
	const router = useRouter();
	const { query } = router;
	const token =
		typeof query.token === 'string'
			? query.token
			: query.token == undefined
			? undefined
			: query.token[0];
	useEffect(() => {
		if (token) {
			acceptRouter.mutate(
				{
					token
				},
				{
					onError: (err) => {
						if (err.data?.code === 'UNAUTHORIZED') {
							signIn('google', {
								callbackUrl: window.location.href
							});
						}
					}
				}
			);
		}
	}, [router.isReady]);
	return (
		<>
			{acceptRouter.isSuccess && (
				<div className="flex flex-col justify-center min-h-[66vh] gap-3">
					<h2 className="text-secondary text-7xl text-center">
						You are now an Admin for {acceptRouter.data?.event.name}
					</h2>
					<Link legacyBehavior href={`/admin/events/${acceptRouter.data?.event.id}`}>
						<a className="underline text-center">Admin Dashboard</a>
					</Link>
				</div>
			)}
		</>
	);
};

export default Invite;
