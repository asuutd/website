import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Modal from '../Modal';
import TiersForm from './TiersForm';
import { Tier } from '@prisma/client';
import { format, formatISO } from 'date-fns';

const Tiers = ({ eventId }: { eventId: string }) => {
	const tiers = trpc.tier.getTiersAdmin.useQuery({
		eventId
	});
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="text-right">
				<button className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
					+ Add Tier
				</button>
			</div>
			<div className="md:grid md:grid-cols-2 mx-auto">
				{tiers.data?.map((tier) => (
					<TierCard tier={tier} key={tier.id} />
				))}
			</div>

			<Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
				<TiersForm eventId={eventId} closeModal={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};

export default Tiers;

const TierCard = ({ tier }: { tier: Tier }) => {
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
		formState: { errors, dirtyFields, isDirty }
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: tier.name,
			price: tier.price.toString(),
			startTime: format(tier.start, "yyyy-MM-dd'T'HH:mm"),
			endTime: format(tier.end, "yyyy-MM-dd'T'HH:mm")
		}
	});
	const mutation = trpc.tier.editTier.useMutation();
	const utils = trpc.useContext();

	const onSubmit = (fields: FormInput) => {
		mutation.mutate(
			{
				tierId: tier.id,
				name: fields.name,
				price: parseInt(fields.price),
				startTime: new Date(fields.startTime),
				endTime: new Date(fields.endTime)
			},
			{
				onSuccess: () => {
					utils.tier.getTiersAdmin.invalidate();
				}
			}
		);
	};
	return (
		<div className="card w-72 md:96 bg-base-100 shadow-xl my-4 mx-auto">
			<form className="card-body" onSubmit={handleSubmit(onSubmit)}>
				<input className="input card-title input-ghost ml-0" {...register('name')} />
				<span>
					$ <input className="input input-sm input-ghost w-12" {...register('price')} />
				</span>

				<div className="form-control">
					<label htmlFor="appt">Start Time</label>
					<input
						id="endtime"
						type="datetime-local"
						className="input input-sm"
						{...register('startTime')}
					/>
				</div>

				<div className="form-control">
					<label htmlFor="endtime">End Time</label>
					<input
						id="endtime"
						type="datetime-local"
						className="input input-sm"
						{...register('endTime')}
					/>
				</div>

				<div className="card-actions justify-end">
					<button className={`btn  ${isDirty ? 'btn-primary' : 'btn-disabled'}`}>Update</button>
				</div>
			</form>
		</div>
	);
};
