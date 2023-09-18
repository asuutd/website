import { motion } from 'framer-motion';
import React from 'react';

const Backdrop = ({
	children,
	onClick
}: {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}) => {
	return (
		<motion.div
			onClick={onClick}
			className="absolute top-0 left-0 h-full w-full overflow-y-scroll bg-black/60 flex items-center justify-center z-80"
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			{children}
		</motion.div>
	);
};

export default Backdrop;
