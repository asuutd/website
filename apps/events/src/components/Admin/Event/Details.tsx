import ImageWithFallback from '@/components/Utils/ImageWithFallback';
import { RouterOutput } from '@/server/trpc/router';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { imageUpload } from '@/utils/imageUpload';
import { isValidHttpUrl } from '@/utils/misc';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
type Event = RouterOutput['event']['getEventAdmin'];
import { toast } from 'sonner';

const zodFileType = z
	.any()
	.refine((files) => files?.length < 2, 'Image is required.')
	.refine(
		(files) => files.length == 0 || files?.[0]?.size <= MAX_FILE_SIZE,
		`Max file size is 5MB.`
	)
	.refine(
		(files) => files.length == 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
		'.jpg, .jpeg, .png and .webp files are accepted.'
	);
const Details = ({ event }: { event: Event }) => {
	const getDataURI = (file: File | undefined) => {
		return file ? URL.createObjectURL(file) : undefined;
	};
	const { data: session } = useSession();
	const FormSchema = z.object({
		name: z.string(),
		startTime: z.string(),
		endTime: z.string(),
		location: z.object({
			address: z.string(),
			coordinates: z.tuple([z.number(), z.number()])
		}),
		bannerImage: zodFileType.optional(),
		ticketImage: zodFileType.optional(),
		feeBearer: z.boolean(),
		description: z.string().optional()
	});
	type FormInput = z.infer<typeof FormSchema>;

	const {
		register,
		handleSubmit,
		control,
		getValues,
		formState: { errors, isDirty }
	} = useForm<FormInput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: event.name,
			startTime: format(event.start, "yyyy-MM-dd'T'HH:mm"),
			endTime: format(event.end, "yyyy-MM-dd'T'HH:mm"),
			feeBearer: event.fee_holder === 'USER' ? true : false,
			...(event.location
				? {
						location: {
							address: event.location.name ?? '',
							coordinates: [event.location.lat, event.location.long]
						}
				  }
				: {
						location: {
							address: '',
							coordinates: [0, 0]
						}
				  }),
			...(event.description && {
				description: event.description
			})
		}
	});

	const updateMutation = trpc.event.updateEvent.useMutation();
	const utils = trpc.useUtils();
	useEffect(() => {
		console.log(event);
	}, []);

	const onSubmit = async (fields: FormInput) => {
		const startTime = parseISO(fields.startTime);
		const endTime = parseISO(fields.endTime);
		if (endTime < startTime) {
			toast.error('End time should be greater than start time');
			return;
		}
		console.log(fields);
		const isBannerURL = isValidHttpUrl(event.image ?? '');
		const isTicketURL = isValidHttpUrl(event.ticketImage ?? '');
		if ((fields.bannerImage[0] || isBannerURL) && (fields.ticketImage[0] || isTicketURL)) {
			const [bannerUploadResponse, ticketImageUploadResponse] = await Promise.all([
				!isBannerURL
					? imageUpload(fields.bannerImage[0], { user: session?.user?.id ?? '' })
					: Promise.resolve(event.image ?? ''),
				!isTicketURL
					? imageUpload(fields.ticketImage[0], { user: session?.user?.id ?? '' })
					: Promise.resolve(event.ticketImage ?? '')
			]);
			if (
				(typeof bannerUploadResponse !== 'string' && !bannerUploadResponse.ok) ||
				(typeof ticketImageUploadResponse !== 'string' && !ticketImageUploadResponse.ok)
			) {
				return;
			}

			const [bannerResult, ticketImageResult] = await Promise.all([
				typeof bannerUploadResponse !== 'string'
					? bannerUploadResponse.json()
					: Promise.resolve(bannerUploadResponse),
				typeof ticketImageUploadResponse !== 'string'
					? ticketImageUploadResponse.json()
					: Promise.resolve(ticketImageUploadResponse)
			]);
			console.log(bannerResult, ticketImageResult);
			updateMutation.mutate(
				{
					eventId: event.id,
					name: fields.name,
					startTime,
					endTime,
					bannerImage:
						typeof bannerUploadResponse !== 'string'
							? `https://ucarecdn.com/${bannerResult[fields.bannerImage[0].name]}/`
							: bannerResult,
					ticketImage:
						typeof ticketImageUploadResponse !== 'string'
							? `https://ucarecdn.com/${ticketImageResult[fields.ticketImage[0].name]}/`
							: ticketImageResult,
					location: fields.location,
					feeBearer: fields.feeBearer ? 'USER' : 'ORGANIZER',
					description: fields.description
				},
				{
					onSuccess: () => {
						utils.event.getEvents.invalidate();
					}
				}
			);
		}
	};
	return (
		<main className="mx-2   py-2 ">
			<form
				className="flex flex-col justify-center mx-auto max-w-3xl"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="">
					<div className="flex justify-between items-center">
						<h2 className="text-4xl text-primary font-bold  my-6">Event</h2>
						<button className={`btn ${!isDirty ? 'btn-disabled' : ''}`}>SAVE CHANGES</button>
					</div>

					<input
						className="uppercase text-4xl sm:text-5xl font-semibold  my-6 input input-ghost bg-transparent w-72 md:w-auto"
						{...register('name')}
					/>

					<div className="my-6  ">
						<div className="flex mb-2 gap-3 collapse items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								className="fill-secondary"
								height="24"
								viewBox="0 0 24 24"
							>
								<path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
							</svg>
							<div className="form-control">
								<Controller
									name="location"
									control={control}
									render={({ field }) => {
										// sending integer instead of string.
										return (
											<MapBoxComponent
												{...field}
												className="input input-ghost w-screen md:w-96 m-0"
											/>
										);
									}}
								/>

								{errors.name && (
									<span className="text-error">{errors.name.message?.toString()}</span>
								)}
							</div>
						</div>

						<div className="mt-2 flex gap-3 items-center">
							<img src="/clock.svg" alt="" className="w-5 h-5 " />
							<div className="flex flex-col">
								<>
									<div>
										<input
											id="endtime"
											type="datetime-local"
											className="input input-sm"
											{...register('startTime')}
										/>
										to{' '}
										<input
											id="endtime"
											type="datetime-local"
											className="input input-sm"
											{...register('endTime')}
										/>
									</div>
								</>
							</div>
						</div>
					</div>

					<>
						<h2 className="text-4xl text-primary font-bold  my-6">Description</h2>

						<div>
							<textarea className="textarea textarea-lg w-full" {...register('description')} />
						</div>
					</>

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
				</div>

				<div className="mb-2">
					<label>
						<div className="relative group">
							<ImageWithFallback
								src={getDataURI(getValues('bannerImage')?.[0]) ?? event.image ?? ''}
								alt=""
								className="w-64 rounded-md object-cover mx-auto"
								width={1600}
								height={900}
							/>
							<div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 flex items-center justify-center transition-opacity">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 fill-white"
									viewBox="0 0 150 150"
								>
									<path
										d="M143.209,105.968c0,6.25-5.113,11.364-11.363,11.364H18.203c-6.25 
                                    0-11.363-5.113-11.363-11.364v-86.37c0-6.25,5.113-11.363 11.363-11.363h113.643c6.25,0,11.363,5.113,11.363,
                                    11.363V105.968z M18.203,17.326c-1.207,0-2.271,1.068-2.271,2.271v86.37c0,1.207,1.065 2.271,2.271,2.271h113.643c1.203,
                                    0,2.274-1.064 2.274-2.271v-86.37c0-1.203-1.071-2.271-2.274-2.271H18.203z M38.661,53.691c-7.529,0-13.641-6.108-13.641-13.635s6.112-13.638,
                                    13.641-13.638 c7.526,0,13.632,6.111,13.632,13.638S46.188,53.691,38.661,53.691z M125.025,99.15H25.02V85.51l22.73-22.724l11.363,11.36l36.365-36.361l29.547,
                                    29.547V99.15z"
									/>
								</svg>
							</div>
						</div>
						<input type="file" className="hidden" {...register('bannerImage')} />
					</label>
				</div>

				<div className="mt-2">
					<label>
						<div className="relative group w-56">
							<ImageWithFallback
								src={getDataURI(getValues('ticketImage')?.[0]) ?? event.ticketImage ?? ''}
								alt=""
								className="w-32 rounded-md object-cover mx-auto"
								width={300}
								height={300}
							/>
							<div className="absolute inset-0 w-auto bg-black opacity-50 group-hover:opacity-75 flex items-center justify-center transition-opacity">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 fill-white"
									viewBox="0 0 150 150"
								>
									<path
										d="M143.209,105.968c0,6.25-5.113,11.364-11.363,11.364H18.203c-6.25 
                                    0-11.363-5.113-11.363-11.364v-86.37c0-6.25,5.113-11.363 11.363-11.363h113.643c6.25,0,11.363,5.113,11.363,
                                    11.363V105.968z M18.203,17.326c-1.207,0-2.271,1.068-2.271,2.271v86.37c0,1.207,1.065 2.271,2.271,2.271h113.643c1.203,
                                    0,2.274-1.064 2.274-2.271v-86.37c0-1.203-1.071-2.271-2.274-2.271H18.203z M38.661,53.691c-7.529,0-13.641-6.108-13.641-13.635s6.112-13.638,
                                    13.641-13.638 c7.526,0,13.632,6.111,13.632,13.638S46.188,53.691,38.661,53.691z M125.025,99.15H25.02V85.51l22.73-22.724l11.363,11.36l36.365-36.361l29.547,
                                    29.547V99.15z"
									/>
								</svg>
							</div>
						</div>
						<input type="file" className="hidden" {...register('ticketImage')} />
					</label>
				</div>
			</form>
		</main>
	);
};

export default Details;

const MapBoxComponent = dynamic(() => import('../../MapBox'), {
	ssr: false
});
