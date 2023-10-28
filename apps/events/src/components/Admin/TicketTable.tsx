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
import { DEFAULT_PROFILE_IMAGE_PATH } from '@/utils/constants';
import Modal from '../Modal';
import Wrapper from './Scanner/Wrapper';
type Ticket = ArrayElement<RouterOutput['ticket']['getTicketsAdmin']['items']>;

const columnHelper = createColumnHelper<Ticket>();

const TicketTable = ({ eventId }: { eventId: string }) => {
	const [page, setPage] = useState(0);
	const [filter, setFilter] = useState<Record<string, any>>();
	const [scannerModal, setScannerModal] = useState(false);
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
								src={info.getValue() ?? DEFAULT_PROFILE_IMAGE_PATH}
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
			<div className="flex flex-row items-center gap-2">
				<button className="btn" onClick={() => setScannerModal(true)}>
					<svg
						fill="#000000"
						height="200px"
						width="200px"
						version="1.1"
						id="Capa_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 74.207 74.207"
						xmlSpace="preserve"
						className="w-6 h-6"
					>
						<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							{' '}
							<g>
								{' '}
								<path
									d="M57.746,14.658h-2.757l-1.021-3.363c-0.965-3.178-3.844-5.313-7.164-5.313H28.801c-3.321,
								0-6.201,2.135-7.165,5.313 l-1.021,3.363h-4.153C7.385,14.658,0,22.043,0,31.121v20.642c0,9.077,7.385,
								16.462,16.462,16.462h41.283 c9.077,0,16.462-7.385,16.462-16.462V31.121C74.208,22.043,66.823,14.658,
								57.746,14.658z M68.208,51.762 c0,5.769-4.693,10.462-10.462,10.462H16.462C10.693,62.223,6,57.53,6,
								51.762V31.121c0-5.769,4.693-10.462,10.462-10.462h8.603 l2.313-7.621c0.192-0.631,0.764-1.055,
								1.423-1.055h18.003c0.659,0,1.23,0.424,1.423,1.057l2.314,7.619h7.204 c5.769,0,10.462,4.693,10.462,
								10.462L68.208,51.762L68.208,51.762z"
								></path>{' '}
								<path
									d="M37.228,25.406c-8.844,0-16.04,7.195-16.04,16.04c0,8.844,7.195,16.039,16.04,16.039s16.041-7.195,
								16.041-16.039 C53.269,32.601,46.073,25.406,37.228,25.406z M37.228,51.486c-5.536,0-10.04-4.504-10.04-10.039c0-5.536,
								4.504-10.04,10.04-10.04 c5.537,0,10.041,4.504,10.041,10.04C47.269,46.982,42.765,51.486,37.228,51.486z"
								></path>{' '}
							</g>{' '}
						</g>
					</svg>
					SCAN TICKET
				</button>
				<FilterCopmonent tiers={tiers.data ?? []} />
			</div>

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

			<Modal isOpen={scannerModal} closeModal={() => setScannerModal(false)}>
				<Wrapper />
			</Modal>
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
