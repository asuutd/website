import Code from '@/components/Admin/Code';
import TicketTable from '@/components/Admin/TicketTable';
import Tiers from '@/components/Admin/Tiers';
import RefCode from '@/components/Admin/RefCode';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';
function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}
const EventsDetailsPage = () => {
	const router = useRouter();
	const { id, activeTab } = router.query;

	const eventId: string = typeof id === 'string' ? id : id == undefined ? ':)' : id[0]!;
	const activeTabInt = typeof activeTab === 'string' ? parseInt(activeTab) : undefined;

	return (
		<div>
			<div className="mx-auto">
				<div className="mx-auto">
					<Tab.Group defaultIndex={activeTabInt}>
						<Tab.List className="stats shadow mx-auto flex max-w-2xl">
							<Tab className={({ selected }) => classNames('stat', selected ? 'bg-base-200' : '')}>
								<div className="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="inline-block w-8 h-8 stroke-current"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
								</div>
								<div className="stat-title">Tickets</div>
							</Tab>

							<Tab className={({ selected }) => classNames('stat', selected ? 'bg-base-200' : '')}>
								<div className="stat-figure text-secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										className="inline-block w-8 h-8 stroke-current"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
										></path>
									</svg>
								</div>
								<div className="stat-title">Tiers</div>
							</Tab>
							<Tab className={({ selected }) => classNames('stat', selected ? 'bg-base-200' : '')}>
								<div className="stat-figure text-secondary">
									<BarCode />
								</div>
								<div className="stat-title">Code</div>
							</Tab>
							<Tab className={({ selected }) => classNames('stat', selected ? 'bg-base-200' : '')}>
								<div className="stat-figure text-secondary">
									<svg
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										x="0px"
										y="0px"
										className="inline-block w-8 h-8 fill-current "
										viewBox="0 0 256 256"
										enableBackground="new 0 0 256 256"
										xmlSpace="preserve"
									>
										<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
										<g>
											<g>
												<g>
													<path d="M73.7,19.1c-15.8,3-28.3,14.3-33.2,29.9c-1.9,6.2-2.1,17.5-0.3,23.4c4.1,13.7,14.6,24.7,28,29.3c4.4,1.5,15.3,2.4,19.4,1.6l2.2-0.4l0.4-5c1.4-18.2,13.5-37,28.2-44c4.4-2.1,4.4-2.1,4-4.3c-0.2-1.2-1.5-4.7-3-7.7c-3.5-7.3-11.4-15.3-18.5-18.7C92.2,18.9,82.4,17.4,73.7,19.1z" />
													<path d="M144.3,51.8c-20.5,4.6-36.2,19.6-41.5,39.8c-1.9,7.3-1.9,19.1,0,26.3c5.2,19.6,20.1,34.5,39.5,39.5c10.3,2.6,24.8,1.5,34.5-2.8c14.8-6.5,26.2-19.7,30.7-35.2c1.9-6.7,2.4-17.9,1-25c-5.2-25.6-27.3-43.7-53.3-43.5C151.4,50.9,146.4,51.4,144.3,51.8z" />
													<path d="M41.8,100.6c-8.6,5.6-16.1,13.5-21.5,22.5c-3.4,5.6-7.1,14.8-8.8,21.8c-2.4,9.6-3.1,8.7,7.8,8.7h9.5l13-13l13-13L65,137.8L75.2,148l5.4-5.4c4.6-4.6,13.4-11.4,15.9-12.3c0.6-0.2,0.3-2.6-1.3-9.1l-2.1-8.8l-4.2,0.5c-15.5,1.9-28.3-2.1-39.6-12.2l-3.3-3L41.8,100.6z" />
													<path d="M33,163.4l-18.2,17.5l10.1,0.3l10.2,0.3l1.7,6.8c5.9,23.2,21.4,38.9,46.1,46.6c3.3,1,7.1,2.1,8.3,2.3l2.2,0.4l-1.9-1.4c-4.4-3.2-10.9-10.1-14.1-14.9C71.4,212,68,201,67.2,187.9l-0.4-6.7l10.7-0.1l10.7-0.2l-18.3-17.5c-10.1-9.6-18.4-17.5-18.5-17.5C51.3,145.9,43,153.7,33,163.4z" />
													<path d="M104.5,155.3c-3.2,2.1-7.6,5.3-9.9,7.1l-4,3.5l11,11c6,6,11,11.2,11,11.5s-7.8,0.5-17.2,0.5H78.1l0.6,4c0.7,5.8,3.5,14.2,6.1,19.1c4.6,8.5,9.2,13.2,21.6,22.1l5.1,3.6h67.2H246v-5.3c-0.1-33.7-13.3-59.4-39.3-76.6l-6.2-4.1l-5.1,4.4c-8.2,7.1-16.7,11.5-26.8,14.1c-6.9,1.7-20.9,1.5-27.8-0.4c-10-2.7-20.5-8.6-26.9-15.1c-1.5-1.6-3-2.9-3.2-2.9S107.7,153.3,104.5,155.3z" />
												</g>
											</g>
										</g>
									</svg>
								</div>
								<div className="stat-title">Referrals</div>
							</Tab>
						</Tab.List>
						<Tab.Panels>
							<Tab.Panel className="">
								<TicketTable eventId={eventId} />
							</Tab.Panel>

							<Tab.Panel className="">
								<Tiers eventId={eventId} />
							</Tab.Panel>

							<Tab.Panel className="">
								<Code eventId={eventId} />
							</Tab.Panel>

							<Tab.Panel className="">
								<RefCode eventId={eventId} />
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>
		</div>
	);
};

export default EventsDetailsPage;

const BarCode = () => {
	return (
		<svg
			version="1.0"
			xmlns="http://www.w3.org/2000/svg"
			width="1280.000000pt"
			height="704.000000pt"
			className="inline-block w-8 h-8 fill-current "
			viewBox="0 0 1280.000000 704.000000"
			preserveAspectRatio="xMidYMid meet"
		>
			<metadata>Created by potrace 1.15, written by Peter Selinger 2001-2017</metadata>
			<g transform="translate(0.000000,704.000000) scale(0.100000,-0.100000)" stroke="none">
				<path d="M700 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M940 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M1170 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path
					d="M1570 4010 l0 -2950 145 0 145 0 0 2950 0 2950 -145 0 -145 0 0
   -2950z"
				/>
				<path d="M1960 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path
					d="M2120 4010 l0 -2950 110 0 110 0 0 2950 0 2950 -110 0 -110 0 0
   -2950z"
				/>
				<path
					d="M2440 4010 l0 -2950 105 0 105 0 0 2950 0 2950 -105 0 -105 0 0
   -2950z"
				/>
				<path d="M2750 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M3060 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M3300 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M3690 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M3930 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M4170 4010 l0 -2950 65 0 65 0 0 2950 0 2950 -65 0 -65 0 0 -2950z" />
				<path d="M4640 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M4880 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M5040 4010 l0 -2950 25 0 25 0 0 2950 0 2950 -25 0 -25 0 0 -2950z" />
				<path d="M5430 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M5660 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M5900 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M6060 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path
					d="M6290 4010 l0 -2950 150 0 150 0 0 2950 0 2950 -150 0 -150 0 0
   -2950z"
				/>
				<path d="M6770 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M6930 4010 l0 -2950 65 0 65 0 0 2950 0 2950 -65 0 -65 0 0 -2950z" />
				<path d="M7240 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M7630 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M8020 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M8260 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M8500 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M8890 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M9130 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M9365 4010 l0 -2950 28 0 27 0 0 2950 0 2950 -27 0 -28 0 0 -2950z" />
				<path d="M9600 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M9760 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path d="M10230 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path
					d="M10390 4010 l0 -2950 145 0 145 0 0 2950 0 2950 -145 0 -145 0 0
   -2950z"
				/>
				<path
					d="M10780 4010 l0 -2950 110 0 110 0 0 2950 0 2950 -110 0 -110 0 0
   -2950z"
				/>
				<path d="M11100 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
				<path
					d="M11490 4010 l0 -2950 110 0 110 0 0 2950 0 2950 -110 0 -110 0 0
   -2950z"
				/>
				<path d="M11800 4010 l0 -2950 30 0 30 0 0 2950 0 2950 -30 0 -30 0 0 -2950z" />
				<path d="M11960 4010 l0 -2950 70 0 70 0 0 2950 0 2950 -70 0 -70 0 0 -2950z" />
			</g>
		</svg>
	);
};
