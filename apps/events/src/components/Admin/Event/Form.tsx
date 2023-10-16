import React, { useState, useContext, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FormContext } from '../Forms/Creator';
import Selector from '../Forms/Selector';
import Editor from '../Forms/Editor';
import Modal from '@/components/Modal';
import Preview from '../Forms/Parser';
import { isEqual } from 'lodash';
import { trpc } from '@/utils/trpc';
import { EventForm, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { twJoin } from 'tailwind-merge';
import { transformData } from '@/utils/forms';

const Form = ({ forms, eventId }: { forms: EventForm[]; eventId: string }) => {
	const [showDrawer, setShowDrawer] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const sidebarContentEl = document.getElementById('sidebar-content');
	const { data, setData } = useContext(FormContext);
	const updateMut = trpc.event.upsertEventForm.useMutation();
	useEffect(() => {
		console.log(forms);
	}, [forms]);

	const unChanged = useMemo(() => {
		return isEqual(transformData(forms), data);
	}, [data, forms]);

	const handleSyncChanges = () => {
		updateMut.mutate({
			eventId,
			forms: data.map((val) => val.json)
		});
	};
	return (
		<>
			<div className="">
				<div className="md:flex md:justify-between ">
					{forms[0] && <h1>Updated On {format(forms[0].updatedAt, 'EE dd yyyy, hh:mma')}</h1>}
					<div className="join">
						<button
							className={twJoin('btn btn-sm join-item text-right', unChanged && 'btn-disabled')}
							onClick={() => handleSyncChanges()}
						>
							{updateMut.isLoading && <span className="loading loading-spinner loading-xs" />}
							PUSH CHANGES
						</button>

						<button className="btn btn-sm btn-secondary join-item text-right">
							{updateMut.isLoading && <span className="loading loading-spinner loading-xs" />}
							VIEW RESPONSES
						</button>
					</div>
				</div>

				<div className="join flex justify-end my-4">
					<label
						className="btn btn-sm btn-secondary join-item"
						htmlFor="my-drawer"
						onClick={() => setShowDrawer(true)}
					>
						+ NEW ELEMENT
					</label>

					<button className="btn btn-sm join-item" onClick={() => setShowPreview(!showPreview)}>
						{!showPreview ? 'SHOW' : 'HIDE'} PREVIEW
					</button>
				</div>

				{showDrawer &&
					sidebarContentEl &&
					createPortal(
						<>
							<label
								htmlFor="my-drawer"
								aria-label="close sidebar"
								className="drawer-overlay"
							></label>
							<ul className="menu bg-base-200 w-56 rounded-box z-[1] dropdown-content">
								<Selector />
							</ul>
						</>,
						sidebarContentEl
					)}

				{showPreview ? (
					<Preview isPreview={true} onSubmit={(fields) => console.log(fields)} data={data} />
				) : (
					<Editor />
				)}
			</div>
		</>
	);
};

export default Form;
