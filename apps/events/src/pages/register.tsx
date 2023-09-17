import React from 'react';
import { trpc } from '../utils/trpc';

const register = () => {
	const mutation = trpc.organizer.createOrganizer.useMutation();

	const handleClick = () => {
		mutation.mutate(undefined, {
			onSuccess: ({ accountLink }) => {
				window.open(accountLink.url, '_self');
			},
			onError: (err) => {
				if (err.data?.code === 'UNAUTHORIZED') {
					if (err.message === "You haven't added your phone_number") {
						alert("You haven't added your phone_number");
					} else {
						document.getElementById('my-modal-4')?.click();
					}
				}
			}
		});
	};
	return (
		<div className="hero min-h-screen   rounded-md">
			<div className="hero-content text-center w-full">
				<div className="max-w-md">
					<h1 className="text-3xl lg:text-5xl font-bold">
						<span className=" text-primary">Leave the ticketing to us </span>
						<span className="text-xl lg:text-3xl">and make your event the best it can be</span>
					</h1>
					<p className="text-sm">
						You already have a lot on your plate trying to plan your events. Don&apos;t let absurd
						ticketing fees stop you from giving the best experience to your attendees
					</p>
					<button className="btn btn-primary" onClick={() => handleClick()}>
						Become an Organizer
					</button>
				</div>
			</div>
		</div>
	);
};

export default register;
