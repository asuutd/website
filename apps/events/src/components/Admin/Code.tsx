import React, { useState, useRef, useEffect } from 'react';
import Modal from '../Modal';
import { trpc } from '@/utils/trpc';
import CodeForm from './CodeForm';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Code = ({ eventId }: { eventId: string }) => {
	const tiers = trpc.tier.getTiersAdmin.useQuery({
		eventId
	});
	const router = useRouter();

	const codeRefs = useRef<{
		[key: string]: React.RefObject<HTMLTableRowElement>;
	}>({});

	const [newCodes, setNewCodes] = useState<Set<string>>(new Set());
	const codes = trpc.code.getCodesWithSalesData.useQuery(
		{ eventId },
		{
			structuralSharing(oldData, newData) {
				if (!oldData) {
					setNewCodes(new Set());
					return newData;
				}
				const newCodes: Set<string> = new Set();
				for (const code of newData) {
					const newCode = oldData.find((c) => c.id === code.id);
					if (!newCode) {
						newCodes.add(code.id);
					}
				}
				setNewCodes(newCodes);
				return newData;
			}
		}
	);

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (typeof router.query.code === 'string') {
			console.log(router.query.code);
			codeRefs.current[router.query.code]?.current?.scrollIntoView();
		}
	}, [router.query.code]);
	return (
		<>
			<div className="text-right">
				<button className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
					+ Add Code
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="table">
					{/* head */}

					<thead>
						<tr>
							<th>Code</th>
							<th>Tier</th>
							<th>Value</th>
							<th>Used</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						{/* row 1 */}
						{codes.data?.map((code) => {
							if (!codeRefs.current[code.id]) {
								codeRefs.current[code.id] = React.createRef();
							}

							return (
								<tr key={code.id}>
									<td className="flex gap-1">
										{newCodes.has(code.id) && (
											<span className="ml-1 badge badge-neutral animate-pulse">New</span>
										)}

										{code.id === router.query.code && (
											<span className="ml-1 badge badge-neutral animate-pulse">Selected</span>
										)}
										<p>
											{code._count.tickets < code.limit ? <>{code.code}</> : <s>{code.code}</s>}
										</p>
									</td>
									<td>{code.tier.name}</td>
									<td>{code.type === 'percent' ? <>{code.value * 100}%</> : <>${code.value}</>}</td>
									<td>
										<Link
											href={{
												query: {
													tab: 'tickets',
													id: eventId,
													tableState: JSON.stringify({
														pagination: { pageIndex: 0, pageSize: 10 },
														filters: {
															tiers: [],
															code: code.code
														}
													})
												}
											}}
										>
											{' '}
											<>
												{code._count.tickets}/{code.limit}
											</>
										</Link>
									</td>
									<td>{code.notes}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<CodeForm
					tiers={tiers.data}
					closeModal={() => {
						setIsOpen(false);
						codes.refetch();
					}}
				/>
			</Modal>
		</>
	);
};

export default Code;
