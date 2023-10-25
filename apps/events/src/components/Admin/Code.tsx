import React, { useState } from 'react';
import Modal from '../Modal';
import { trpc } from '@/utils/trpc';
import CodeForm from './CodeForm';

const Code = ({ eventId }: { eventId: string }) => {
	const tiers = trpc.tier.getTiersAdmin.useQuery({
		eventId
	});
	
	const [newCodes, setNewCodes] = useState<Set<string>>(new Set());
	const codes = trpc.code.getCodes.useQuery({ eventId }, {
		structuralSharing(oldData, newData) {
			if (!oldData) {
				setNewCodes(new Set())
				return newData
			}
			const newCodes: Set<string> = new Set()
			for (const code of newData) {
				const newCode = oldData.find((c) => c.id === code.id)
				if (!newCode) {
					newCodes.add(code.id)
				}
			}
			setNewCodes(newCodes)
			return newData
		},
	});

	const [isOpen, setIsOpen] = useState(false);
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
						{codes.data?.map((code) => (
							<tr key={code.id} >
								<td className='flex gap-1'>
									{!newCodes.has(code.id) && <span className="ml-1 badge badge-neutral">New</span>} 
									<p>{code._count.tickets < code.limit ? <>{code.code}</> : <s>{code.code}</s>}</p>
									</td>
								<td>{code.tier.name}</td>
								<td>{code.type === 'percent' ? <>{code.value * 100}%</> : <>${code.value}</>}</td>
								<td>
									{code._count.tickets}/{code.limit}
								</td>
								<td>
									{code.notes}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<CodeForm tiers={tiers.data} closeModal={() => {
					setIsOpen(false)
					codes.refetch()
				}} />
			</Modal>
		</>
	);
};

export default Code;
