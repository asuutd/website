import { RouterOutput } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useReducer, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { ArrayElement } from '@/utils/misc';
import { CSVLink } from 'react-csv';
import {
	FilterFn,
	PaginationState,
	VisibilityState,
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

import Link from 'next/link';
import { useRouter } from 'next/router';
import usePrevious from '@/utils/hooks/usePrevious';
import { z } from 'zod';
import useQueryReducer from '@/utils/hooks/useQueryReducer';
type Ticket = ArrayElement<RouterOutput['ticket']['getTicketsAdmin']['items']['items']>;

const columnHelper = createColumnHelper<Ticket>();
type OldState = {
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	filters: {
		tiers?: string[];
		userEmail?: string;
		code?: string;
	};
};

const zodState = z.object({
	pagination: z.object({
		pageIndex: z.number(),
		pageSize: z.number()
	}),
	filters: z.object({
		tiers: z.array(z.string()),
		userEmail: z.string().optional(),
		code: z.string().optional(),
		refCode: z.string().optional()
	}),
	cursor: z
		.object({
			cursorId: z.string(),
			cursorOffset: z.number()
		})
		.optional()
});

type State = z.infer<typeof zodState>;

const initialState: State = {
	pagination: { pageIndex: 0, pageSize: 10 },
	filters: {
		tiers: []
	}
};

type Action =
	| { type: 'SET_PAGE'; page: number }
	| { type: 'SET_PAGINATION'; pageIndex: number; pageSize: number }
	| { type: 'SET_PAGE_SIZE'; pageSize: number }
	| { type: 'TOGGLE_TIER_FILTER'; tier: string }
	| { type: 'SET_FILTER'; filters: State['filters'] }
	| { type: 'SET_CURSOR'; cursor: State['cursor'] };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SET_PAGE':
			return {
				...state,
				pagination: {
					...state.pagination,
					pageIndex: action.page
				}
			};
		case 'SET_PAGE_SIZE':
			return {
				...state,
				pagination: {
					...state.pagination,
					pageSize: action.pageSize
				}
			};
		case 'SET_PAGINATION':
			return {
				...state,
				pagination: {
					pageIndex: action.pageIndex,
					pageSize: action.pageSize
				}
			};
		case 'TOGGLE_TIER_FILTER':
			if (!state.filters.tiers) {
				return {
					...state,
					filters: {
						...state.filters,
						tiers: [action.tier]
					}
				};
			}

			return {
				...state,
				filters: {
					...state.filters,
					tiers: state.filters.tiers.includes(action.tier)
						? state.filters.tiers.filter((t) => t !== action.tier)
						: [...state.filters.tiers, action.tier]
				}
			};
		case 'SET_CURSOR':
			return {
				...state,
				cursor: action.cursor
			};
		case 'SET_FILTER':
			return {
				...state,
				filters: action.filters
			};
		default:
			throw new Error();
	}
};

type FilterAction =
	| { type: 'setTiers'; payload: string[] }
	| { type: 'setUserEmail'; payload: string | undefined }
	| { type: 'setCode'; payload: string | undefined }
	| { type: 'setRefCode'; payload: string | undefined };

// Filter reducer
const filterReducer = (state: State['filters'], action: FilterAction) => {
	switch (action.type) {
		case 'setTiers':
			return { ...state, tiers: action.payload };

		case 'setUserEmail':
			return { ...state, userEmail: action.payload };

		case 'setCode':
			return { ...state, code: action.payload };

		default:
			return state;
	}
};

const TicketTable = ({ eventId }: { eventId: string }) => {
	const [page, setPage] = useState(0);
	const [filter, setFilter] = useState<Record<string, any>>();
	const [scannerModal, setScannerModal] = useState(false);
	const router = useRouter();
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
		Code: false,
		'Purchase Time': false,
		Email: false
	});
	const columns = React.useMemo(
		() => [
			columnHelper.accessor('user.name', {
				cell: (info) => (
					<>
						{/* <div className="flex items-center space-x-3">
						<div
							className="h-12 w-12 tooltip tooltip-right"
							data-tip={info.row.original.user.name ?? info.row.original.user.email}
						>
							<Image
								src={info.getValue() ?? info.row.original.user.email}
								width={50}
								height={50}
								className="rounded-md "
							/>
						</div>
					</div> */}
						{info.getValue() ?? info.row.original.user.email}
					</>
				),
				id: 'User',
				header: 'Name'
			}),

			columnHelper.accessor('user.email', {
				cell: (info) => info.getValue(),
				enableColumnFilter: true,
				id: 'Email',
				header: 'Email'
			}),

			columnHelper.accessor('tier.name', {
				cell: (info) => info.getValue(),
				enableColumnFilter: true,
				id: 'Tier',
				header: 'Tier'
			}),

			columnHelper.accessor(
				(row) => `${row.checkedInAt ? row.checkedInAt.toLocaleString() : 'Not Checked In Yet'}`,
				{
					id: 'Check-In Time',
					header: 'Check-In Time'
				}
			),

			columnHelper.accessor((row) => `${row.createdAt.toLocaleString()}`, {
				id: 'Purchase Time',
				header: 'Purchase Time'
			}),

			columnHelper.accessor('code.code', {
				cell: (info) => (
					<>
						{info.getValue() && info.row.original.codeId && (
							<div>
								<button
									className="underline"
									onClick={() =>
										router.push({
											query: {
												tab: 'code',
												id: eventId,
												code: info.row.original.codeId
											}
										})
									}
								>
									{info.getValue()}
								</button>
							</div>
						)}
					</>
				),
				id: 'Code',
				header: 'Code'
			})
		],
		[]
	);

	const [{ pagination, filters, cursor }, dispatch] = useQueryReducer<Action, typeof zodState>(
		reducer,
		initialState,
		'tableState',
		zodState
	);
	const previousPageState = usePrevious<State>({
		pagination,
		filters
	});

	const myQuery = trpc.ticket.getTicketsAdmin.useInfiniteQuery(
		{
			limit: pagination.pageSize,
			eventId: eventId,
			filter: filters
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			enabled: eventId !== undefined,
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			staleTime: 0,
			cacheTime: 0,
			refetchInterval: 0
			// initialCursor: 1, // <-- optional you can pass an initialCursor
		}
	);
	useEffect(() => {
		console.log(pagination);
		console.log(myQuery?.data?.pageParams[previousPageState?.pagination.pageIndex ?? 0]);
		if (
			pagination.pageIndex < (previousPageState?.pagination.pageIndex ?? Number.MAX_SAFE_INTEGER)
		) {
			if (myQuery.hasPreviousPage) {
				myQuery.fetchPreviousPage().then(({ data }) => {
					dispatch({
						type: 'SET_CURSOR',
						cursor: {
							cursorId: data?.pages[pagination.pageIndex]?.items.items[0]?.id ?? '',
							cursorOffset: pagination.pageIndex
						}
					});
				});
			}
		} else {
			if (myQuery.hasNextPage) {
				myQuery.fetchNextPage().then(({ data }) => {
					console.log('FETCHED NEXT PAGE');
					dispatch({
						type: 'SET_CURSOR',
						cursor: {
							cursorId: data?.pages[pagination.pageIndex]?.items.items[0]?.id ?? '',
							cursorOffset: pagination.pageIndex
						}
					});
				});
			}
		}
	}, [pagination]);

	useEffect(() => {
		console.log(router.route, router.query.filters);
	}, [router.query]);

	const table = useReactTable({
		data: myQuery.data?.pages[pagination.pageIndex]?.items.items ?? [],
		columns,
		pageCount: -1,
		state: {
			pagination,
			columnVisibility
		},
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (e) => {
			if (pagination) {
				const newState = functionalUpdate(e, pagination);
				console.log(pagination, newState);
				if (newState) {
					dispatch({
						type: 'SET_PAGINATION',
						pageIndex: newState.pageIndex,
						pageSize: newState.pageSize
					});
				}
			}
		},
		manualPagination: true,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<div className="">
			<div className="flex justify-between items-center w-full">
				<div>
					{myQuery.data?.pages[0]?.items.count && (
						<>
							<span className="text-2xl">{pagination.pageIndex * pagination.pageSize + 1} - </span>
							<span className="text-2xl">
								{pagination.pageIndex * pagination.pageSize + table.getRowModel().rows.length}
							</span>{' '}
							of <span className="text-2xl">{myQuery.data?.pages[0]?.items.count}</span> tickets
						</>
					)}
				</div>

				<div>
					<CSVLink
						className="inline-block"
						target="_blank"
						filename={'ticket-details.csv'}
						data={table
							.getRowModel()
							.flatRows.map((row) =>
								Object.assign(
									{},
									...row
										.getVisibleCells()
										.map((visible) => ({ [visible.column.id]: visible.getValue() }))
								)
							)}
						headers={table.getFlatHeaders().map((header) => header.getContext().column.id)}
					>
						<button className="btn btn-sm">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									{' '}
									<path
										d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
										stroke="#000000"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>{' '}
								</g>
							</svg>
							DOWNLOAD
						</button>
					</CSVLink>
					<div className="dropdown dropdown-end">
						<label tabIndex={0} className="btn m-1 btn-sm">
							<svg
								fill="#000000"
								viewBox="0 0 256 256"
								id="Flat"
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									{' '}
									<path d="M83.99951,87.99353h-.00012l-44-.001a4,4,0,0,1,.00012-8h.00012l44,.001a4,4,0,0,1-.00012,8Zm136,84a4.00019,4.00019,0,0,1-4,4H191.65967a23.99507,23.99507,0,0,1-47.32031,0H39.99951a4,4,0,0,1,0-8H144.33936a23.99507,23.99507,0,0,1,47.32031,0h24.33984A4.0002,4.0002,0,0,1,219.99951,171.99353Zm-36,0a16,16,0,1,0-16,16A16.01833,16.01833,0,0,0,183.99951,171.99353Zm-104-88a23.99775,23.99775,0,0,1,47.66016-4l88.33984-.001a4,4,0,0,1,0,8l-88.33984.001a23.99775,23.99775,0,0,1-47.66016-4Zm8,0a16,16,0,1,0,16-16A16.01833,16.01833,0,0,0,87.99951,83.99353Z"></path>{' '}
								</g>
							</svg>
							VIEW
						</label>

						<ul
							tabIndex={0}
							className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
						>
							{table.getAllLeafColumns().map((column) => {
								return (
									<li key={column.id} className="px-1">
										<label>
											<input
												className="checkbox checkbox-sm"
												{...{
													type: 'checkbox',
													checked: column.getIsVisible(),
													onChange: column.getToggleVisibilityHandler()
												}}
											/>{' '}
											{column.id}
										</label>
									</li>
								);
							})}
						</ul>
					</div>

					<FilterComponent
						tiers={myQuery.data?.pages[0]?.items.tiers ?? []}
						filters={filters}
						dispatch={dispatch}
					/>
				</div>
			</div>

			<div className="overflow-x-auto p-4 border-2 border-base-300 rounded-lg shadow-lg">
				<table className="table">
					{/* head */}
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
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
			</div>

			<div className="flex gap-2 justify-end p-3">
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
						{[10, 20, 30, 40, 50, myQuery.data?.pages[0]?.items.count].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize === myQuery.data?.pages[0]?.items.count ? 'All' : pageSize}
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

const FilterComponent = ({
	tiers,
	filters,
	dispatch
}: {
	tiers: RouterOutput['ticket']['getTicketsAdmin']['items']['tiers'];
	filters: State['filters'];

	dispatch: React.Dispatch<Action>;
}) => {
	const [filterState, dispatchFilter] = useReducer(filterReducer, filters);

	// Action creators
	const handleTierChange = (id: string) => {
		let nextTiers = [];

		if (!filterState.tiers) {
			nextTiers = [id];
		} else {
			nextTiers = filterState.tiers.includes(id)
				? filterState.tiers.filter((t) => t !== id)
				: [...filterState.tiers, id];
		}

		dispatchFilter({ type: 'setTiers', payload: nextTiers });
	};
	const handleUserEmailChange = (email: string) => {
		dispatchFilter({
			type: 'setUserEmail',
			payload: email !== '' ? email : undefined
		});
	};

	const handleCodeChange = (code: string) => {
		dispatchFilter({
			type: 'setCode',
			payload: code !== '' ? code : undefined
		});
	};

	const handleRefCodeChange = (refCode: string) => {
		dispatchFilter({
			type: 'setRefCode',
			payload: refCode !== '' ? refCode : undefined
		});
	};

	const applyChanges = () => {
		dispatch({
			type: 'SET_FILTER',
			filters: filterState
		});
	};

	return (
		<div className="dropdown dropdown-end">
			<label className="btn  btn-sm m-1" tabIndex={0}>
				<svg
					fill="#fff"
					viewBox="0 0 32 32"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					stroke="#fff"
					className="w-5 h-5 fill-black stroke-black"
				>
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
					<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
					<g id="SVGRepo_iconCarrier">
						{' '}
						<title>bars-filter</title>{' '}
						<path d="M30 6.749h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM24 14.75h-16c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h16c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM19 22.75h-6.053c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.053c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>{' '}
					</g>
				</svg>
				Filter
			</label>

			<ul
				tabIndex={0}
				className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 menu gap-3"
			>
				<li>
					<details>
						<summary>Tier</summary>
						<ul>
							{tiers?.map((tier) => (
								<li className="" key={tier.id}>
									<label className="label cursor-pointer">
										<input
											type="checkbox"
											checked={filterState.tiers?.includes(tier.id)}
											className="checkbox checkbox-sm"
											onClick={() => handleTierChange(tier.id)}
										/>
										<span className="label-text">{tier.name}</span>
									</label>
								</li>
							))}
						</ul>
					</details>
				</li>

				<li className="disabled">
					<input
						type="text"
						value={filterState.userEmail ?? ''}
						onChange={(e) => handleUserEmailChange(e.target.value)}
						className="input input-sm input-bordered text-black"
						placeholder="User Email"
					/>
				</li>

				<li className="disabled">
					<input
						type="text"
						value={filterState.code ?? ''}
						onChange={(e) => handleCodeChange(e.target.value)}
						className="input input-sm input-bordered text-black"
						placeholder="Code"
					/>
				</li>

				<li className="disabled">
					<input
						type="text"
						value={filterState.refCode ?? ''}
						onChange={(e) => handleRefCodeChange(e.target.value)}
						className="input input-sm input-bordered text-black"
						placeholder="Referral Code"
					/>
				</li>

				<li className="disabled">
					<div className="">
						<button className="btn btn-primary py-1 btn-sm" onClick={() => applyChanges()}>
							APPLY
						</button>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default TicketTable;
