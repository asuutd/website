import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { rm } from 'fs';
import { NextPage } from 'next/types';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { trpc } from '../utils/trpc';
import { animated, useSpring, useTransition, config } from '@react-spring/web';
import Image from 'next/image';
function shiftFirstElement(arr: any) {
	const shiftedArray = arr?.slice(1) ?? [];
	shiftedArray?.push(arr?.[0]);
	return shiftedArray;
}
const data = [
	{
		id: 1,
		name: 'Rare Wind',
		description: '#a8edea → #fed6e3',
		css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
		height: 300,
		image: 'https://ucarecdn.com/1873c6d8-b49d-4346-8b13-c88802b1b567/'
	},
	{
		id: 2,
		name: 'Saint Petersburg',
		description: '#f5f7fa → #c3cfe2',
		css: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
		height: 300,
		image: 'https://ucarecdn.com/39567007-8c47-4d19-a39c-a8ecc39aecfc/'
	}
];

const getScale = (data: any, index: number) => {
	return (data.length - index) * 0.1 + 1;
};
const MobileCarousel: React.FC = () => {
	const [rows, set] = useState(data);
	useEffect(() => {
		const t = setInterval(() => set(shiftFirstElement), 2300);
		return () => clearInterval(t);
	}, []);

	let height = 0;

	const transitions = useTransition(
		rows.map((data, index) => ({
			...data,
			y: (height += data.height - 280) - data.height,
			scale: 1,
			index
		})),
		{
			key: (item: any) => item.name,
			from: { height: 0, opacity: 0 },
			leave: { height: 0, opacity: 0 },
			enter: ({ y, height, index }) => ({ y, height, opacity: 1, scale: getScale(rows, index) }),
			update: ({ y, height, index }) => ({ y, height, scale: getScale(rows, index) })
		}
	);
	useEffect(() => {
		console.log(height);
	}, [height]);

	return (
		<div className="relative mt-[200px] max-w-full flex w-[60vw] md:w-[30vw] 2xl:w-96 mx-auto">
			{transitions((style, item, t, index) => (
				<animated.div
					className="absolute will-change-[transform, height, opacity] mx-auto my-auto  bottom-3 top-[250px] "
					style={{ zIndex: data.length - index, ...style }}
				>
					<div className="relative bg-cover overflow-hidden  flex max-w-lg items-center justify-center">
						<Image
							src={item.image}
							className="rounded-lg"
							alt="name"
							height={900}
							width={1600}
							style={{ objectFit: 'contain' }}
						/>
					</div>
				</animated.div>
			))}
		</div>
	);
};

export default MobileCarousel;
