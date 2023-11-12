import { trpc } from '@/utils/trpc';
import { EventForm, FormResponse } from '@prisma/client';
import {
	RowModel,
	Table,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table';
import React, { createContext, useContext } from 'react';
import { FormContext } from '../Forms/Creator';

const columnHelper = createColumnHelper<any>();

const Responses = ({
	currentIndex,
	forms,
	eventId
}: {
	currentIndex: number;
	forms: EventForm[];
	eventId: string;
}) => {
	const responsesQuery = trpc.event.getResponses.useQuery({
		formId: forms[currentIndex]?.id ?? '',
		eventId
	});

	const { data } = useContext(FormContext);

	const columns = React.useMemo(
		() =>
			data.map((col) =>
				columnHelper.accessor(col.json.label, {
					cell: (info) => info.getValue(),
					id: col.json.label
				})
			),
		[]
	);

	/* [
        columnHelper.accessor('user.image', {
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 tooltip tooltip-right" data-tip={info.row.original.user.name}>
                        <Image
                            src={info.getValue() ?? '/placeholder.svg'}
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
    ], */

	const table = useReactTable({
		data: responsesQuery.data ?? [],
		columns: columns,
		getCoreRowModel: getCoreRowModel()
	});
	return (
		<div className=" flex flex-col items-end">
			<table className="table">
				{/* head */}

				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
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
	);
};

export default Responses;
