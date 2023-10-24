import { RouterOutput } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { ArrayElement } from '@/utils/misc';
import {
	FilterFn,
	PaginationState,
	createColumnHelper,
	flexRender,
	functionalUpdate,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table';
import { createPortal } from 'react-dom';
type Ticket = ArrayElement<RouterOutput['ticket']['getTicketsAdmin']['items']>;

const columnHelper = createColumnHelper<Ticket>();

const TicketTable = ({ eventId }: { eventId: string }) => {
	const [page, setPage] = useState(0);
	const [filter, setFilter] = useState<Record<string, any>>();
	const columns = React.useMemo(
		() => [
			columnHelper.accessor('user.image', {
				cell: (info) => (
					<div className="flex items-center space-x-3">
						<div
							className="h-12 w-12 tooltip tooltip-right"
							data-tip={info.row.original.user.name ?? info.row.original.user.email}
						>
							<Image
								src={info.getValue() ?? '/email_assets/Missing_avatar.svg'}
								width={50}
								height={50}
								className="rounded-md "
							/>
						</div>
					</div>
				)
			}),

			columnHelper.accessor('tier.name', {
				cell: (info) => info.getValue(),
				enableColumnFilter: true
			}),

			columnHelper.accessor(
				(row) => `${row.checkedInAt ? row.checkedInAt.toLocaleDateString() : 'Not Checked In Yet'}`,
				{
					id: 'checkedInAtParsed'
				}
			)
		],
		[]
	);

	const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize
		}),
		[pageIndex, pageSize]
	);

	const myQuery = trpc.ticket.getTicketsAdmin.useInfiniteQuery(
		{
			limit: pageSize,
			eventId: eventId
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			keepPreviousData: true
			// initialCursor: 1, // <-- optional you can pass an initialCursor
		}
	);

	const tiers = trpc.tier.getTiersAdmin.useQuery(
		{
			eventId
		},
		{
			staleTime: Infinity,
			cacheTime: Infinity
		}
	);

	const table = useReactTable({
		data: myQuery.data?.pages[pagination.pageIndex]?.items ?? [],
		columns,
		pageCount: -1,
		state: {
			pagination
		},
		filterFns: {
			myCustomFilter: (rows, columns, filterValue) => {
				return true;
			}
		},
		onPaginationChange: (e) => {
			setPagination((old) => {
				const newState = functionalUpdate(e, old);
				console.log(newState, old);
				if (newState.pageIndex < old.pageIndex) {
					if (myQuery.hasPreviousPage) {
						myQuery.fetchPreviousPage();
						return newState;
					} else {
						if (pagination.pageIndex > 0) {
							console.log(page);
							return newState;
						}
					}
				} else {
					if (myQuery.hasNextPage) {
						myQuery.fetchNextPage();
						return newState;
					} else {
						if (myQuery.data?.pages.length && pagination.pageIndex < myQuery.data.pages.length) {
							return newState;
						}
					}
				}
				return old;
			});
		},
		manualPagination: true,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<div className=" flex flex-col items-end">
			<FilterCopmonent tiers={tiers.data ?? []} />
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

					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<div className="flex gap-2">
				<div className="join">
					<button
						className="join-item btn"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						«
					</button>
					<button className="join-item btn">
						Page {table.getState().pagination.pageIndex + 1}{' '}
					</button>
					<button
						className="join-item btn"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						»
					</button>
				</div>

				<div>
					<select
						value={table.getState().pagination.pageSize}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
						className="select"
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

const FilterCopmonent = ({ tiers }: { tiers: any[] }) => {
	const utils = trpc.useContext();
	const [showModal, setShowModal] = useState(false);
	const sidebarContentEl = document.getElementById('sidebar-content');

	useEffect(() => {
		console.log(sidebarContentEl);
		return () => {
			setShowModal(false);
		};
	}, []);
	return (
		<>
			<label
				htmlFor="my-drawer"
				className="btn btn-secondary drawer-button"
				onClick={() => setShowModal(true)}
			>
				<svg
					fill="#fff"
					viewBox="0 0 32 32"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					stroke="#fff"
					className="w-4 h-4"
				>
					<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
					<g id="SVGRepo_iconCarrier">
						{' '}
						<title>bars-filter</title>{' '}
						<path d="M30 6.749h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM24 14.75h-16c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h16c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM19 22.75h-6.053c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.053c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>{' '}
					</g>
				</svg>
				Filter
			</label>

			{showModal &&
				sidebarContentEl &&
				createPortal(
					<>
						<label
							htmlFor="my-drawer"
							aria-label="close sidebar"
							className="drawer-overlay"
						></label>
						<ul className="menu bg-base-200 w-56 rounded-box z-[1] dropdown-content">
							<li>
								<a>Item 1</a>
							</li>
							<li>
								<details>
									<summary>Tier</summary>
									<ul>
										{tiers?.map((tier) => (
											<li className="" key={tier.id}>
												<label className="label cursor-pointer">
													<input type="checkbox" checked={false} className="checkbox" />
													<span className="label-text">{tier.name}</span>
												</label>
											</li>
										))}
									</ul>
								</details>
							</li>
							<li>
								<a>Item 3</a>
							</li>
						</ul>
					</>,
					sidebarContentEl
				)}
			{/* <div className="dropdown dropdown-end">
			<label tabIndex={0} className="btn btn-sm btn-secondary">
				<svg
					fill="#fff"
					viewBox="0 0 32 32"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					stroke="#fff"
					className="w-4 h-4"
				>
					<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
					<g id="SVGRepo_iconCarrier">
						{' '}
						<title>bars-filter</title>{' '}
						<path d="M30 6.749h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM24 14.75h-16c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h16c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM19 22.75h-6.053c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.053c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>{' '}
					</g>
				</svg>
				Filter
			</label>

			<ul className="menu bg-base-200 w-56 rounded-box z-[1] dropdown-content">
				<li>
					<a>Item 1</a>
				</li>
				<li>
					<details>
						<summary>Tier</summary>
						<ul>
							{tiers?.map((tier) => (
								<li className="">
									<label className="label cursor-pointer">
										<input type="checkbox" checked={false} className="checkbox" />
										<span className="label-text">{tier.name}</span>
									</label>
								</li>
							))}
						</ul>
					</details>
				</li>
				<li>
					<a>Item 3</a>
				</li>
			</ul>
		</div> */}
		</>
	);
};

export default TicketTable;
