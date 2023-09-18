import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
	eventId: string;
	closeModal: () => void;
};

const TiersForm: React.FC<Props> = ({ eventId, closeModal }) => {
	const tiers = trpc.tier.getTiers.useQuery({
		eventId
	});
	const utils = trpc.useContext();

	const root = useRef(null);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const { data: session } = useSession();

	const mutation = trpc.tier.createTier.useMutation();

	const FormSchema = z.object({
		name: z.string(),
		price: z.string(),
		startTime: z.string(),
		endTime: z.string()
	});
	type FormInput = z.infer<typeof FormSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema)
	});

	const onSubmit = (fields: FormInput) => {
		utils.tier.getTiersAdmin.invalidate({
			eventId
		});
		mutation.mutate(
			{
				name: fields.name,
				price: parseInt(fields.price),
				startTime: parseISO(fields.startTime),
				endTime: parseISO(fields.endTime),
				eventId: eventId
			},
			{
				onSuccess: (data) => {
					closeModal();
				}
			}
		);
		console.log(fields);
	};
	return (
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
				className=" transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all"
			>
				<div className="card w-96 bg-base-100 shadow-xl">
					<div className="card-body">
						<h2 className="card-title">Add New Tier</h2>
						<form className="card-body" onSubmit={handleSubmit(onSubmit)}>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Tier Name</span>
								</label>
								<input
									type="text"
									placeholder="Event Name"
									className="input input-bordered"
									{...register('name')}
								/>
								{errors.name && (
									<span className="text-error">{errors.name.message?.toString()}</span>
								)}
							</div>

							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input
									id="price"
									type="number"
									className="input input-bordered w-32"
									{...register('price')}
								/>
								{errors.price && (
									<span className="text-error">{errors.price.message?.toString()}</span>
								)}
							</div>

							<div className="form-control">
								<label htmlFor="appt">Start Time</label>
								<input
									id="endtime"
									type="datetime-local"
									className="input input-sm"
									{...register('startTime')}
								/>
								{errors.startTime && (
									<span className="text-error">{errors.startTime.message?.toString()}</span>
								)}
							</div>

							<div className="form-control">
								<label htmlFor="endtime">End Time</label>
								<input
									id="endtime"
									type="datetime-local"
									className="input input-sm"
									{...register('endTime')}
								/>
								{errors.endTime && (
									<span className="text-error">{errors.endTime.message?.toString()}</span>
								)}
							</div>

							<div className="form-control mt-6">
								<button className="btn btn-primary" type="submit">
									Create Tier
								</button>
							</div>
						</form>
					</div>
				</div>
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default TiersForm;
