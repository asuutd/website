import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';

const Invite: NextPage<{
	status?: string;
	event?: {
		id: string;
		name: string;
	};
}> = ({ event }) => {
	return (
		<>
			{event && (
				<div className="flex flex-col justify-center min-h-[66vh] gap-3">
					<h2 className="text-secondary text-7xl text-center">
						You are now an Admin for {event.name}
					</h2>
					<Link href={`/admin/events/${event.id}`}>
						<a className="underline text-center">Admin Dashboard</a>
					</Link>
				</div>
			)}
		</>
	);
};

export default Invite;

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
	const token =
		typeof query.token === 'string'
			? query.token
			: query.token == undefined
			? undefined
			: query.token[0];
	res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
	const session = await getServerAuthSession({ req, res });

	if (token && prisma) {
		if (session && session.user?.email) {
			const result = await prisma?.adminInvite.findFirst({
				where: {
					token: token
				},
				include: {
					user: {
						select: {
							id: true
						}
					},
					event: {
						select: {
							name: true
						}
					}
				}
			});
			if (result && result.email === session.user.email) {
				await prisma?.eventAdmin.create({
					data: {
						eventId: result.eventId,
						userId: result.user.id
					}
				});

				return {
					props: {
						status: 'successful',
						event: {
							id: result.eventId,
							name: result.event.name
						}
					}
				};
			}
		} else {
			return {
				redirect: {
					destination: `/api/auth/signin?callbackUrl=/admin/invite/${token}`,
					permanent: false
				}
			};
		}
	}

	return {
		props: {} // will be passed to the page component as props
	};
};
