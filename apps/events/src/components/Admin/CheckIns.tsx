import { trpc } from '@/utils/trpc';
import { useState, useMemo } from 'react';
import type { RouterOutput } from '@/server/trpc/router';
import { twJoin } from 'tailwind-merge';
import ImageWithFallback from '../Utils/ImageWithFallback';

type GroupedTickets = RouterOutput['ticket']['getTicketsGroupedByUserForEvent'];
type UserGroup = GroupedTickets[string];

const CheckIns = ({ eventId }: { eventId: string }) => {
	const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState('');
	const utils = trpc.useUtils();

	const { data: groupedTickets, isLoading } = trpc.ticket.getTicketsGroupedByUserForEvent.useQuery(
		{
			eventId
		},
		{
			refetchInterval: 30000 // Refetch every 30 seconds to keep data fresh
		}
	);

	const validateTicket = trpc.ticket.validateTicket.useMutation({
		onSuccess: () => {
			// Refetch the data to update the UI
			utils.ticket.getTicketsGroupedByUserForEvent.invalidate({ eventId });
		},
		onError: (error) => {
			// Error handling is done via the mutation state
			console.error('Check-in error:', error);
		}
	});

	const toggleUser = (userId: string) => {
		setExpandedUsers((prev) => {
			const next = new Set(prev);
			if (next.has(userId)) {
				next.delete(userId);
			} else {
				next.add(userId);
			}
			return next;
		});
	};

	const handleCheckIn = async (ticketId: string) => {
		validateTicket.mutate({
			eventId,
			ticketId
		});
	};

	const formatCheckInTime = (checkedInAt: string | Date | null) => {
		if (!checkedInAt) return '';
		
		const checkInDate = new Date(checkedInAt);
		const today = new Date();
		
		// Check if the check-in date is today
		const isToday =
			checkInDate.getDate() === today.getDate() &&
			checkInDate.getMonth() === today.getMonth() &&
			checkInDate.getFullYear() === today.getFullYear();
		
		if (isToday) {
			return `today ${checkInDate.toLocaleTimeString()}`;
		} else {
			return `${checkInDate.toLocaleDateString()} ${checkInDate.toLocaleTimeString()}`;
		}
	};

	

		// Filter user groups based on search query
	const filteredUserGroups = useMemo(() => {
        if (!groupedTickets) return [];

        const userGroups: UserGroup[] = Object.values(groupedTickets);
        if (!searchQuery.trim()) {
            return userGroups;
		}

		const query = searchQuery.toLowerCase().trim();

		return userGroups.filter((userGroup) => {
			// Search in user name
			const userName = (userGroup.user.name ?? '').toLowerCase();
			if (userName.includes(query)) return true;

			// Search in email
			const email = (userGroup.user.email ?? '').toLowerCase();
			if (email.includes(query)) return true;

			// Search in ticket IDs
			const hasMatchingTicket = userGroup.tickets.some((ticket) =>
				ticket.id.toLowerCase().includes(query)
			);
			if (hasMatchingTicket) return true;

			return false;
		});
	}, [groupedTickets, searchQuery]);

    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

    if (!groupedTickets || Object.keys(groupedTickets).length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">No tickets found for this event.</p>
            </div>
        );
    }

	return (
		<div className="p-3">
			<div className="max-w-6xl mx-auto mb-4">
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">Search</span>
					</div>
					<input
						type="text"
						placeholder="Search by name, email, or ticket ID..."
						className="input input-bordered w-full"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</label>
				{searchQuery && (
					<p className="text-sm text-gray-500 mt-2">
						Found {filteredUserGroups.length} user{filteredUserGroups.length !== 1 ? 's' : ''}
					</p>
				)}
			</div>
			<div className="overflow-x-auto max-w-6xl mx-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th></th>
							<th>User</th>
							<th>Email</th>
							<th>Tickets</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredUserGroups.length === 0 ? (
							<tr>
								<td colSpan={5} className="text-center p-8">
									<p className="text-gray-500">
										{searchQuery
											? 'No users found matching your search.'
											: 'No tickets found for this event.'}
									</p>
								</td>
							</tr>
						) : (
							filteredUserGroups.map((userGroup) => {
							const isExpanded = expandedUsers.has(userGroup.user.id);
							const checkedInCount = userGroup.tickets.filter((t) => t.checkedInAt !== null).length;
							const totalTickets = userGroup.tickets.length;

							return (
								<>
									<tr
										key={userGroup.user.id}
										className="cursor-pointer hover:bg-base-200 h-min"
										onClick={() => toggleUser(userGroup.user.id)}
									>
										<td>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className={twJoin(
													'w-5 h-5 transition-transform',
													isExpanded && 'rotate-90'
												)}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M8.25 4.5l7.5 7.5-7.5 7.5"
												/>
											</svg>
										</td>
										<td>
											<div className="flex items-center space-x-3 gap-2">
                                                <ImageWithFallback
                                                    src={userGroup.user.image ?? '/placeholder.svg'}
                                                    width={30}
                                                    height={30}
                                                    className="rounded-full"
                                                    alt=""
                                                />
												<div>
													<p className="font-semibold">
														{userGroup.user.name ?? 'No Name'}
													</p>
												</div>
											</div>
										</td>
										<td>{userGroup.user.email}</td>
										<td>
											<span className="badge badge-neutral h-min">{totalTickets}</span>
										</td>
										<td>
											{checkedInCount === totalTickets ? (
												<span className="badge badge-success h-min">All Checked In</span>
											) : checkedInCount > 0 ? (
												<span className="badge badge-warning h-min">
													{checkedInCount}/{totalTickets} Checked In
												</span>
											) : (
												<span className="badge badge-ghost h-min">Not Checked In</span>
											)}
										</td>
									</tr>
									{isExpanded && (
										<tr key={`${userGroup.user.id}-expanded`}>
											<td colSpan={5} className="bg-base-200 p-4">
												<div className="space-y-2">
													<h3 className="font-semibold text-lg mb-3">Tickets</h3>
													<div className="overflow-x-auto">
														<table className="table table-sm table-zebra">
															<thead>
																<tr>
																	<th>Ticket ID</th>
																	<th>Tier</th>
																	<th>Purchased</th>
																	<th>Check-in Status</th>
																	<th>Action</th>
																</tr>
															</thead>
															<tbody>
																{userGroup.tickets.map((ticket) => {
																	const isCheckedIn = ticket.checkedInAt !== null;
																	const isCheckingIn =
																		validateTicket.isPending &&
																		validateTicket.variables?.ticketId === ticket.id;

																	return (
																		<tr key={ticket.id}>
																			<td>
																				<code className="text-xs">
																					{ticket.id.slice(0, 8)}...
																				</code>
																			</td>
																			<td>
																				{ticket.tier?.name ?? (
																					<span className="text-gray-500">Free Ticket</span>
																				)}
																			</td>
																			<td>
																				{ticket.createdAt.toLocaleDateString()} {ticket.createdAt.toLocaleTimeString()}
																			</td>
																			<td>
																				{isCheckedIn ? (
																					<span className="badge badge-success h-min">
																						{formatCheckInTime(ticket.checkedInAt)}
																					</span>
																				) : (
																					<span className="badge badge-ghost h-min">Not Checked In</span>
																				)}
																			</td>
																			<td>
																				<button
																					type="button"
																					className={twJoin(
																						'btn btn-sm',
																						isCheckedIn
																							? 'btn-disabled'
																							: 'btn-primary',
																						isCheckingIn && 'loading'
																					)}
																					disabled={isCheckedIn || isCheckingIn}
																					onClick={(e) => {
																						e.stopPropagation();
																						handleCheckIn(ticket.id);
																					}}
																				>
																					{isCheckingIn ? (
																						<>
																							<span className="loading loading-spinner loading-xs" />
																							Checking In...
																						</>
																					) : isCheckedIn ? (
																						'Checked In'
																					) : (
																						'Check In'
																					)}
																				</button>
																			</td>
																		</tr>
																	);
																})}
															</tbody>
														</table>
													</div>
												</div>
											</td>
										</tr>
									)}
								</>
							);
							})
						)}
					</tbody>
				</table>
			</div>
			{validateTicket.isError && (
				<div className="alert alert-error mt-4 max-w-6xl mx-auto">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{validateTicket.error?.message ?? 'An error occurred during check-in'}</span>
				</div>
			)}
		</div>
	);
};

export default CheckIns;

