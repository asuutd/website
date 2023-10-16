import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FormContext } from '../Forms/Creator';
import Selector from '../Forms/Selector';
import Editor from '../Forms/Editor';
import Modal from '@/components/Modal';
import Preview from '../Forms/Preview';
import { isEqual } from 'lodash';
import { trpc } from '@/utils/trpc';
import { EventForm, Prisma } from '@prisma/client';
import { CustomFormData } from '@/utils/forms';

const Form = ({ forms, eventId }: { forms: EventForm[]; eventId: string }) => {
	const [showDrawer, setShowDrawer] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const sidebarContentEl = document.getElementById('sidebar-content');
	const { data, setData } = useContext(FormContext);
	const updateMut = trpc.event.upsertEventForm.useMutation();
	useEffect(() => {
		console.log(forms);
	}, [forms]);

	const handleSyncChanges = () => {
		updateMut.mutate({
			eventId,
			forms: data.map((val) => val.json)
		});
	};
	return (
		<>
			<div className="">
				<div className="flex justify-end">
					<button
						className="btn btn-sm join-item justify-end text-right"
						onClick={() => handleSyncChanges()}
					>
						{updateMut.isLoading && <span className="loading loading-spinner loading-xs" />}
						PUSH CHANGES
					</button>
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

				{showPreview ? <Preview /> : <Editor />}
			</div>
		</>
	);
};

export default Form;
