import { Dialog, Transition } from '@headlessui/react';
import type { Tier } from '@prisma/client';
import React, { Fragment, useEffect, useState } from 'react';

type Ticket = {
	tier: Tier;
	quantity: number;
	amount: number;
};

const Modal = ({
	isOpen,
	closeModal,

	children
}: {
	isOpen: boolean;
	closeModal: () => void;
	children: React.ReactNode;
}) => {
	useEffect(() => {
		console.log(children);
	}, []);
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						{children}
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Modal;
