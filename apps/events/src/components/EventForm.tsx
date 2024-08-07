import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { parseISO } from 'date-fns';
import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { imageUpload } from '@/utils/imageUpload';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
type Props = {
	closeModal: () => void;
};
const zodFileType = z
	.any()
	.refine((files) => files?.length == 1, 'Image is required.')
	.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
	.refine(
		(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
		'.jpg, .jpeg, .png and .webp files are accepted.'
	);
const FormSchema = z.object({
	name: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	location: z
		.object({
			address: z.string(),
			coordinates: z.tuple([z.number(), z.number()])
		})
		.optional(),

	bannerImage: zodFileType,
	ticketImage: zodFileType,
	feeBearer: z.boolean()
});
export type EventFormInput = z.infer<typeof FormSchema>;

const EventForm: React.FC<Props> = ({ closeModal }) => {
	const { data: session } = useSession();
	const utils = trpc.useContext();

	const mutation = trpc.event.createEvent.useMutation();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting }
	} = useForm<EventFormInput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			location: {
				address: '',
				coordinates: [0, 0]
			}
		}
	});

	const onSubmit = async (fields: EventFormInput) => {
		if (fields.bannerImage[0] && fields.ticketImage[0]) {
			const startTime = parseISO(fields.startTime);
			const endTime = parseISO(fields.endTime);
			if (endTime < startTime) {
				toast.error('End time should be greater than start time');
				return;
			}
			const [bannerUploadResponse, ticketImageUploadResponse] = await Promise.all([
				imageUpload(fields.bannerImage[0], { user: session?.user?.id ?? '' }),
				imageUpload(fields.ticketImage[0], { user: session?.user?.id ?? '' })
			]);

			if (bannerUploadResponse.ok && ticketImageUploadResponse.ok) {
				const [bannerResult, ticketImageResult] = await Promise.all([
					bannerUploadResponse.json(),
					ticketImageUploadResponse.json()
				]);
				console.log(bannerResult, ticketImageResult);

				mutation.mutate(
					{
						name: fields.name,
						startTime,
						endTime,
						bannerImage: `https://ucarecdn.com/${Object.values(bannerResult)[0]}/`,
						ticketImage: `https://ucarecdn.com/${Object.values(ticketImageResult)[0]}/`,
						...(fields.location && fields.location.address ? { location: fields.location } : {}),
						feeBearer: fields.feeBearer ? 'USER' : 'ORGANIZER'
					},
					{
						onSuccess: () => {
							utils.event.getEvents.invalidate();
							closeModal();
						}
					}
				);
			}
		}
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
			<Dialog.Panel className="w-[320px] transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
				<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
					<form className="card-body" onSubmit={handleSubmit(onSubmit)}>
						<h2 className="card-title">Event Form</h2>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Event Name</span>
							</label>
							<input
								type="text"
								placeholder="Event Name"
								className="input input-bordered"
								{...register('name')}
							/>
							{errors.name && <span className="text-error">{errors.name.message?.toString()}</span>}
						</div>

						<div className="form-control">
							<label>
								<span className="label-text">Location</span>
							</label>
							<Controller
								name="location"
								control={control}
								render={({ field }) => {
									// sending integer instead of string.
									return <MapBoxComponent {...field} className="input input-bordered" />;
								}}
							/>

							{errors.name && <span className="text-error">{errors.name.message?.toString()}</span>}
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

						<div className="form-control">
							<label className="label">
								<span className="label-text">Banner Image (Horizontal)</span>
							</label>
							<input
								type="file"
								className="file-input file-input-sm file-input-ghost w-full max-w-xs"
								{...register('bannerImage')}
							/>
							{errors.bannerImage && (
								<span className="text-error">{errors.bannerImage.message?.toString()}</span>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Ticket Image (Vertical)</span>
							</label>
							<input
								type="file"
								className="file-input file-input-sm file-input-ghost w-full max-w-xs"
								{...register('ticketImage')}
							/>
							{errors.ticketImage && (
								<span className="text-error">{errors.ticketImage.message?.toString()}</span>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Who bears the service fees?</span>
							</label>
							<label className="label cursor-pointer justify-start gap-5">
								<span className="label-text">You</span>
								<input type="checkbox" className="toggle" {...register('feeBearer')} />
								<span className="label-text">Attendee</span>
							</label>
						</div>

						<div className="form-control mt-6">
							<button
								className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`}
								type="submit"
								disabled={isSubmitting}
							>
								Create Event
							</button>
						</div>
					</form>
				</div>
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default EventForm;

const MapBoxComponent = dynamic(() => import('../components/MapBox'), {
	ssr: false
});
