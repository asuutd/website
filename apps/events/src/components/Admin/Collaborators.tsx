import { RouterOutput } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { useState, useCallback, useMemo } from 'react';
import { ArrayElement } from '@/utils/misc';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table';
import ImageWithFallback from '../Utils/ImageWithFallback';
type Collaborator = ArrayElement<RouterOutput['organizer']['getCollaborators']>;

const columnHelper = createColumnHelper<Collaborator & { invite: boolean }>();
const model = getCoreRowModel();

const Collaborators = ({ eventId }: { eventId: string }) => {
	const collaboratorsQuery = trpc.organizer.getCollaborators.useQuery(
		{
			eventId
		},
		{
			refetchInterval: 60000,
			retry: 3
		}
	);
	const invitedCollaboratorsQuery = trpc.organizer.getInvitedCollaborators.useQuery(
		{
			eventId
		},
		{
			refetchInterval: 60000,
			retry: 3
		}
	);

	const removeCollaborator = trpc.organizer.removeCollaborator.useMutation({
		onSuccess: () => {
			collaboratorsQuery.refetch();
		}
	});
	const removeInvite = trpc.organizer.removeInvite.useMutation({
		onSuccess: () => {
			invitedCollaboratorsQuery.refetch();
		}
	});

	const createInvite = trpc.organizer.createInvite.useMutation({
		onSuccess: () => {
			invitedCollaboratorsQuery.refetch();
		}
	});

	const [email, setEmail] = useState<string>('');

	const handleInvite = () => {
		if (email && email !== '') {
			createInvite.mutate({
				eventId,
				email
			});
		}
	};

	const handleRemoveCollaborator = useCallback(
		async (userId: string, invite: boolean) => {
			if (invite)
				await removeInvite.mutateAsync({
					eventId,
					email: userId
				});
			else {
				await removeCollaborator.mutateAsync({
					eventId,
					userId
				});
			}
		},
		[eventId]
	);

	const columns = useMemo(
		() => [
			columnHelper.accessor('user.image', {
				cell: (info) => (
					<div className="flex items-center space-x-3 gap-2">
						<div className="h-12 w-12 tooltip ">
							<ImageWithFallback
								src={info.getValue() ?? '/placeholder.svg'}
								width={50}
								height={50}
								className="rounded-md "
							/>
						</div>
						<p>{info.row.original.user.name}</p>
					</div>
				)
			}),

			columnHelper.accessor('user.id', {
				cell: (info) => (
					<button
						className="btn btn-error btn-xs"
						onClick={() => {
							handleRemoveCollaborator(info.getValue(), info.row.original.invite);
						}}
					>
						Remove
					</button>
				),
				enableColumnFilter: true
			})
		],
		[handleRemoveCollaborator]
	);

	const data: any = useMemo(
		() => [
			...(collaboratorsQuery.data?.map((c) => ({ ...c, invite: false })) ?? []),
			...(invitedCollaboratorsQuery.data?.map((c) => ({
				id: c.email,
				eventId: c.eventId,
				userId: c.email,
				user: {
					id: c.email,
					name: c.email + ' (Invited)',
					image: '/placeholder.svg'
				},
				invite: true
			})) ?? [])
		],
		[collaboratorsQuery.data, invitedCollaboratorsQuery.data]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: model
	});
	return (
		<div className="p-3">
			<div className="flex justify-end">
				<div className="items-center sm:flex sm:space-x-3 max-w-2xl">
					<input
						type="email"
						className="input input-md w-64 bg-white input-bordered"
						placeholder="Invitee Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div className="pt-2 sm:pt-0 grid sm:block sm:flex-[0_0_auto]">
						<button className="btn btn-md btn-primary" onClick={handleInvite}>
							{createInvite.isLoading && <span className="loading loading-spinner loading-xs" />}
							INVITE
						</button>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto max-w-4xl mx-auto">
				<table className="table ">
					{/* head */}
					<thead>
						<tr>
							<th>Name</th>

							<th></th>
						</tr>
					</thead>
					<tbody>
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
		</div>
	);
};

export default Collaborators;
