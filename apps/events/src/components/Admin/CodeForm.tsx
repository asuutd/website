import { trpc } from '@/utils/trpc';
import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tier, Event } from '@prisma/client';
import { parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
	tiers:
		| (Tier & {
				event: Event;
				_count: {
					Ticket: number;
				};
		  })[]
		| undefined;
	closeModal: () => void;
};

const CodeForm: React.FC<Props> = ({ tiers, closeModal }) => {
	const root = useRef(null);
	const [startDate, setStartDate] = useState<Date>(new Date());
	const { data: session } = useSession();

	const mutation = trpc.code.createCode.useMutation();

	const FormSchema = z
		.object({
			amount: z.string(),
			tierId: z.string(),
			percentage: z.boolean(),
			price: z.string()
		})
		.refine(
			({ price, percentage, tierId }) =>
				percentage ||
				parseInt(price) <=
					(tiers?.find((tier) => tier.id === tierId)?.price || Number.MAX_SAFE_INTEGER),
			'Discount needs to be less or equal to the tier price'
		);
	type FormInput = z.infer<typeof FormSchema>;

	const {
		register,
		handleSubmit,
		watch: watchFunc,
		formState: { errors, dirtyFields },
		control
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema)
	});
	const watch = watchFunc(['percentage', 'tierId']);

	const onSubmit = (fields: FormInput) => {
		mutation.mutate(
			{
				type: fields.percentage ? 'percent' : 'flat',
				num_codes: parseInt(fields.amount),
				value: parseFloat(fields.price) * (fields.percentage ? 0.01 : 1), //Wrong wording
				tierId: fields.tierId
			},
			{
				onSuccess: () => {
					closeModal();
				}
			}
		);
		console.log(fields);
	};

	useEffect(() => {
		console.log(errors);
	}, [errors]);
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
								<select className="select select-bordered w-full max-w-xs" {...register('tierId')}>
									<option disabled selected>
										Pick a Tier
									</option>
									{tiers?.map((tier) => (
										<option key={tier.id} value={tier.id}>
											{tier.name}
										</option>
									))}
								</select>
							</div>
							<div className="form-control">
								<label className="label cursor-pointer">
									<span className="label-text">Flat</span>
									<input type="checkbox" className="toggle" {...register('percentage')} />
									<span className="label-text">Percentage</span>
								</label>
							</div>
							<div className="form-control">
								<label htmlFor="amount">How many?</label>
								<input
									id="amount"
									type="number"
									className="input input-bordered w-32"
									{...register('amount')}
								/>
								{errors.amount && (
									<span className="text-error">{errors.amount.message?.toString()}</span>
								)}
							</div>

							<div className="form-control">
								<label htmlFor="price">Discount</label>
								<div className="flex items-center">
									<input
										id="price"
										step="0.01"
										type="number"
										className="input input-bordered w-16"
										{...register('price')}
									/>
									{!watch[0] || <p>%</p>}
								</div>

								{errors.price && (
									<span className="text-error">{errors.price?.message?.toString()}</span>
								)}
							</div>
							<div className="form-control">
								<button className="btn btn-primary">GENERATE CODE(S)</button>
							</div>
						</form>
					</div>
				</div>
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default CodeForm;
