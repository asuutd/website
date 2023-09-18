import React from 'react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { TimerContainer } from '../Timer/TimerContainer';

const Timer = ({ endTime, className }: { endTime: Date; className?: string }) => {
	const [time, _] = useState<number>(endTime.getTime() - Date.now());
	const [days, setDays] = useState<number>(0);
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);

	const timeToDays = time;

	const countDownDate = new Date().getTime() + timeToDays;

	useEffect(() => {
		console.log(countDownDate);
		const updateTime = setInterval(() => {
			const now = Date.now();

			const difference = countDownDate - now;

			const newDays = Math.floor(difference / (1000 * 60 * 60 * 24));
			const newHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const newMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
			const newSeconds = Math.floor((difference % (1000 * 60)) / 1000);

			setDays(newDays);
			setHours(newHours);
			setMinutes(newMinutes);
			setSeconds(newSeconds);

			if (difference <= 0) {
				clearInterval(updateTime);
				setDays(0);
				setHours(0);
				setMinutes(0);
				setSeconds(0);
			}
		});

		return () => {
			clearInterval(updateTime);
		};
	}, [time]);

	return (
		<TimerContainer
			days={days}
			hours={hours}
			minutes={minutes}
			seconds={seconds}
			className={className}
			urgent={endTime.getTime() - new Date().getTime() < 86400000}
		/>
	);
};

export default Timer;
