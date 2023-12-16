import React, { useState, useContext, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FormContext } from '../Forms/Creator';
import Selector from '../Forms/Selector';
import Editor from '../Forms/Editor';
import Modal from '@/components/Modal';
import Preview from '../Forms/Parser';
import { isEqual } from 'lodash';
import { trpc } from '@/utils/trpc';
import { EventForm, FormResponse, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { twJoin } from 'tailwind-merge';
import { transformData } from '@/utils/forms';
import { version } from 'os';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import Responses from './Responses';

const Form = ({ forms, eventId }: { forms: EventForm[]; eventId: string }) => {
	const [showDrawer, setShowDrawer] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [showResponses, setShowResponses] = useState(false);
	const sidebarContentEl = document.getElementById('sidebar-content');
	const { data, setData } = useContext(FormContext);
	const updateMut = trpc.event.upsertEventForm.useMutation();
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		console.log(currentIndex);
	}, [currentIndex]);

	const unChanged = useMemo(() => {
		return isEqual(transformData(forms), data);
	}, [data, forms]);

	const handleSyncChanges = () => {
		updateMut.mutate({
			eventId,
			forms: data.map((val) => val.json)
		});
	};

	const changeVersion = (direction: 'increment' | 'decrement') => {
		if (direction === 'decrement' && currentIndex < forms.length - 1) {
			setCurrentIndex(currentIndex + 1);
			const transformedData = transformData(forms, currentIndex + 1);
			transformedData && setData(transformedData);
		}

		if (direction === 'increment' && currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			const transformedData = transformData(forms, currentIndex - 1);
			transformedData && setData(transformedData);
		}
	};
	return (
		<>
			<div className="">
				<div className="md:flex md:justify-between ">
					{forms[currentIndex] && (
						<div className="join">
							<button
								className={twJoin('join-item btn', showResponses && 'btn-disabled')}
								onClick={() => changeVersion('decrement')}
							>
								«
							</button>
							<h1 className="join-item btn">
								Updated On{' '}
								{format(forms[currentIndex]?.updatedAt ?? new Date(), 'EE dd yyyy, hh:mma')}
							</h1>
							<button
								className={twJoin('join-item btn', showResponses && 'btn-disabled')}
								onClick={() => changeVersion('increment')}
							>
								»
							</button>
						</div>
					)}
					<div className="join">
						<button
							className={twJoin(
								'btn btn-sm join-item text-right',
								(unChanged || currentIndex !== 0) && 'btn-disabled'
							)}
							onClick={() => handleSyncChanges()}
						>
							{updateMut.isLoading && <span className="loading loading-spinner loading-xs" />}
							PUSH CHANGES
						</button>

						<button
							className="btn btn-sm btn-secondary join-item text-right"
							onClick={() => setShowResponses(!showResponses)}
						>
							{!showResponses ? 'VIEW' : 'HIDE'} RESPONSES
						</button>
					</div>
				</div>

				<div className="join flex justify-end my-4">
					<Sheet key={'left'}>
						<SheetTrigger>
							<button
								className="btn btn-sm btn-secondary join-item"
								onClick={() => setShowDrawer(true)}
							>
								+ NEW ELEMENT
							</button>
						</SheetTrigger>
						<SheetContent side={'left'}>
							<Selector />
						</SheetContent>
					</Sheet>

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
				) : showResponses ? (
					<Responses forms={forms} currentIndex={currentIndex} eventId={eventId} />
				) : (
					<Editor />
				)}
			</div>
		</>
	);
};

export default Form;
