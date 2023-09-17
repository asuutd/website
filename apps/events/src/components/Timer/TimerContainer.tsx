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

	if (seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0) {
		daysFlip = false;
		hoursFlip = false;
		minutesFlip = false;
		secondsFlip = false;
	}

	if (seconds == 0) {
		if (minutes != 0) {
			seconds = 59;
		}

		secondsFlip = false;
		minutesFlip = true;
	}
	if (minutes == 0) {
		if (hours != 0) {
			minutes = 59;
		}

		minutesFlip = false;
		hoursFlip = true;
	}

	if (hours == 0) {
		hoursFlip = false;
		if (days != 0) {
			daysFlip = true;
		}
	}

	if (days < 10) {
		days = '0' + days;
	}

	if (hours < 10) {
		hours = '0' + hours;
	}

	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	if (seconds < 10) {
		seconds = '0' + seconds;
	}

	return (
		<div className="rounded-xl  ">
			<div
				className={`gap-4 rounded-xl py-2 px-6 mt-2 flex items-center  justify-between ${className}`}
			>
				<NumberBox num={days} unit="Days" flip={daysFlip} urgent />
				<span className="  text-3xl font-normal  inline-block  ">:</span>
				<NumberBox num={hours} unit="Hours" flip={hoursFlip} urgent />
				<span className=" text-3xl font-normal  inline-block  ">:</span>
				<NumberBox num={minutes} unit="Minutes" flip={minutesFlip} urgent />
				<span className="  text-3xl font-normal  inline-block">:</span>
				<NumberBox num={seconds} unit="Seconds" flip={secondsFlip} urgent />
			</div>
		</div>
	);
};
