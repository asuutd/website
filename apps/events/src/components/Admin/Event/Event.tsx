import { trpc } from '@/utils/trpc';
import React, { useContext, useEffect, useState } from 'react';

import { RouterOutput } from '@/server/trpc/router';
import { twJoin } from 'tailwind-merge';
import Details from './Details';
import Form from './Form';
import { FormContext } from '../Forms/Creator';
import { transformData } from '@/utils/forms';

type Event = RouterOutput['event']['getEventAdmin'];

const Event = ({ eventId }: { eventId: string }) => {
	const { data, isSuccess } = trpc.event.getEventAdmin.useQuery(
		{ eventId: eventId },
		{
			onSuccess: (data) => {
				const parsedTemplate = transformData(data.forms);
				parsedTemplate && setData(parsedTemplate);
			}
		}
	);

	const { setData } = useContext(FormContext);

	return <>{data && <LoadedEvent event={data} />}</>;
};

const LoadedEvent = ({ event }: { event: Event }) => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<>
			<div className=" m-5">
				<div className="tabs w-auto">
					<button
						className={twJoin('tab tab-lifted', activeTab == 0 && 'tab-active')}
						onClick={() => setActiveTab(0)}
					>
						Details
					</button>
					<button
						className={twJoin('tab tab-lifted', activeTab == 1 && 'tab-active')}
						onClick={() => setActiveTab(1)}
					>
						Forms
					</button>
					<button
						className={twJoin('tab tab-lifted', activeTab == 2 && 'tab-active')}
						onClick={() => setActiveTab(2)}
					>
						Analytics
					</button>
				</div>
			</div>

			{(() => {
				switch (activeTab) {
					case 0:
						return <Details event={event} />;
					case 1:
						return <Form forms={event.forms} eventId={event.id} />;
					default:
						return null;
				}
			})()}
		</>
	);
};

export default Event;
