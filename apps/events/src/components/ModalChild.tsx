import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useRef } from 'react';

const ModalChild = ({ children }: { children: React.ReactNode }) => {
	const root = useRef(null);

	return (
		<>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<Dialog.Panel
					ref={root}
					className="w-[320px] transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all"
				>
					{children}
				</Dialog.Panel>
			</Transition.Child>
		</>
	);
};
export default ModalChild;
