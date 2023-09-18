import { trpc } from '@/utils/trpc';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const TicketTable = ({ eventId }: { eventId: string }) => {
	const [page, setPage] = useState(0);
	const myQuery = trpc.ticket.getTicketsAdmin.useInfiniteQuery(
		{
			limit: 10,
			eventId: eventId
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			keepPreviousData: true
			// initialCursor: 1, // <-- optional you can pass an initialCursor
		}
	);
	const event = trpc
		.useContext()
		.event.getEvents.getData()
		?.find((event) => event.id === eventId);
	useEffect(() => {
		console.log(myQuery.data?.pages);
	}, [myQuery.data?.pages]);
	return (
		<div className=" flex flex-col items-end">
			<table className="table">
				{/* head */}
				<thead>
					<tr>
						<th>Name</th>
						<th>Tier</th>
						<th>Checked In</th>
						<th></th>
					</tr>
				</thead>
				<tbody className="">
					{/* row 1 */}
					{myQuery.data?.pages[page]?.items.map((ticket) => (
						<tr className="" key={ticket.id}>
							<td>
								<div className="flex items-center space-x-3">
									<div className="h-12 w-12 tooltip tooltip-right" data-tip={ticket.user.name}>
										<Image
											src={ticket.user.image ?? '/placeholder.svg'}
											width={50}
											height={50}
											className="rounded-md "
										/>
									</div>
								</div>
							</td>
							<td>{ticket.tier?.name ?? 'Free Ticket'}</td>
							{ticket.event ? (
								<td>
									{ticket.checkedInAt
										? format(ticket.checkedInAt, "yyyy-MM-dd'T'HH:mm")
										: 'Not Checked In Yet'}
								</td>
							) : (
								<td>
									{ticket.checkedInAt
										? format(ticket.createdAt, "yyyy-MM-dd'T'HH:mm")
										: 'Not Checked In Yet'}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>

			<div className="join">
				<button
					className="join-item btn"
					onClick={() => {
						if (myQuery.hasPreviousPage) {
							setPage((page) => page - 1);
							myQuery.fetchPreviousPage();
						} else {
							if (page > 0) {
								console.log(page);
								setPage((page) => page - 1);
							}
						}
					}}
				>
					«
				</button>
				<button className="join-item btn">Page {page + 1}</button>
				<button
					className="join-item btn"
					onClick={() => {
						if (myQuery.hasNextPage) {
							setPage((page) => page + 1);
							myQuery.fetchNextPage();
						} else {
							if (myQuery.data?.pages.length && page < myQuery.data.pages.length) {
								setPage((page) => page + 1);
							}
						}
					}}
				>
					»
				</button>
			</div>
		</div>
	);
};

export default TicketTable;
