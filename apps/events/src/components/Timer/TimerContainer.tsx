import React, { useEffect } from 'react';
import { NumberBox } from './Numberbox';

interface timeProps {
	days: number | string;
	hours: number | string;
	minutes: number | string;
	seconds: number | string;
	urgent: boolean;
	className?: string;
}

export const TimerContainer = ({ days, hours, minutes, seconds, urgent, className }: timeProps) => {
	let daysFlip = false;
	let hoursFlip = false;
	let minutesFlip = false;
	let secondsFlip = true;

	useEffect(() => {
		console.log(urgent);
	}, []);

	const daysNum = Number(days);
	const hoursNum = Number(hours);
	const minutesNum = Number(minutes);
	const secondsNum = Number(seconds);

	if (secondsNum <= 0 && minutesNum <= 0 && hoursNum <= 0 && daysNum <= 0) {
		daysFlip = false;
		hoursFlip = false;
		minutesFlip = false;
		secondsFlip = false;
	}

	if (secondsNum == 0) {
		if (minutesNum != 0) {
			seconds = 59;
		}

		secondsFlip = false;
		minutesFlip = true;
	}
	if (minutesNum == 0) {
		if (hoursNum != 0) {
			minutes = 59;
		}

		minutesFlip = false;
		hoursFlip = true;
	}

	if (hoursNum == 0) {
		hoursFlip = false;
		if (daysNum != 0) {
			daysFlip = true;
		}
	}

	if (daysNum < 10) {
		days = '0' + days;
	}

	if (hoursNum < 10) {
		hours = '0' + hours;
	}

	if (minutesNum < 10) {
		minutes = '0' + minutes;
	}

	if (secondsNum < 10) {
		seconds = '0' + seconds;
	}

	return (
		<div className="rounded-xl  ">
			<div
				className={`gap-4 rounded-xl py-2 px-6 mt-2 flex items-center  justify-between ${className}`}
			>
				<NumberBox num={days} unit="Days" flip={daysFlip} urgent={urgent} />
				<span className="  text-3xl font-normal  inline-block  ">:</span>
				<NumberBox num={hours} unit="Hours" flip={hoursFlip} urgent={urgent} />
				<span className=" text-3xl font-normal  inline-block  ">:</span>
				<NumberBox num={minutes} unit="Minutes" flip={minutesFlip} urgent={urgent} />
				<span className="  text-3xl font-normal  inline-block">:</span>
				<NumberBox num={seconds} unit="Seconds" flip={secondsFlip} urgent={urgent} />
			</div>
		</div>
	);
};
