import React from 'react';

interface numProp {
	num: string | number;
	unit: string;
	flip: boolean;
	urgent: boolean;
}

export const NumberBox = ({ num, unit, flip, urgent }: numProp) => {
	return (
		<div className="flex flex-col items-center px-2">
			<div className=" relative  flex h-5  flex-col items-center justify-center rounded-lg  bg-transparent text-2xl md:text-4xl ">
				<div
					className={`font-mono absolute z-10 font-redhat text-3xl font-bold ${
						urgent ? 'text-rose-500' : 'text-neutral'
					} `}
				>
					{num}
				</div>

				{/* Two Small Dots */}
			</div>
		</div>
	);
};
