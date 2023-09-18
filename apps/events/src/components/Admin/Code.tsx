import React, { useState } from 'react';
import Modal from '../Modal';
import { trpc } from '@/utils/trpc';
import CodeForm from './CodeForm';

const Code = ({ eventId }: { eventId: string }) => {
	const tiers = trpc.tier.getTiersAdmin.useQuery({
		eventId
	});

	const codes = trpc.code.getCodes.useQuery({ eventId });

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
						</tr>
					</thead>
					<tbody>
						{/* row 1 */}
						{codes.data?.map((code) => (
							<tr key={code.id}>
								<td>{code._count.tickets < code.limit ? <>{code.code}</> : <s>{code.code}</s>}</td>
								<td>{code.tier.name}</td>
								<td>{code.type === 'percent' ? <>{code.value * 100}%</> : <>${code.value}</>}</td>
								<td>
									{code._count.tickets}/{code.limit}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<CodeForm tiers={tiers.data} closeModal={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};

export default Code;
