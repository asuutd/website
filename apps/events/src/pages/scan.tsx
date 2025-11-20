import { useCallback, useEffect, useRef, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { NextSeo } from 'next-seo';
import { type IDetectedBarcode, Scanner, useDevices } from '@yudiel/react-qr-scanner';
import type { RouterOutput } from '@/server/trpc/router';
import TicketDetails from '@/components/TicketDetails';
import Modal from '@/components/Modal';
import { useSession } from 'next-auth/react';
import { imageUpload } from '@/utils/imageUpload';
import { useGeolocated } from "react-geolocated";
import { useHaptic } from 'react-haptic';


type ValidateMut = RouterOutput['ticket']['validateTicket'];

export default function ScanPage() {
	const { data: session } = useSession();
	const [text, setText] = useState<string | null>(null);
	const validateMut = trpc.ticket.validateTicket.useMutation();
	const [validationData, setValidationData] = useState<ValidateMut | null>(null);
	const resetTime = 3000;
	const scannerRef = useRef<HTMLDivElement>(null);
	const lastScanned = useRef<{ value: string; timestamp: number } | null>(null);
	const { vibrate } = useHaptic();

	const { coords } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
			isOptimisticGeolocationEnabled: false,
			watchPosition: true,
			watchLocationPermissionChange: true,
            userDecisionTimeout: 20000,
        });

	const [captureCanvasEl, setCaptureCanvasEl] = useState<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		const canvas = document.createElement('canvas');
		setCaptureCanvasEl(canvas);
	}, []);

	const captureImageFromVideo = useCallback(async () => {
		if (typeof window === 'undefined') {
			return undefined;
		}

		const video = scannerRef.current?.querySelector('video');
		if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
			return undefined;
		}


		if (!captureCanvasEl) {
			return undefined;
		}

		captureCanvasEl.width = video.videoWidth;
		captureCanvasEl.height = video.videoHeight;
		const ctx = captureCanvasEl.getContext('2d');
		if (!ctx) {
			return undefined;
		}

		ctx.drawImage(video, 0, 0, captureCanvasEl.width, captureCanvasEl.height);

		const blob = await new Promise<Blob | null>((resolve) => {
			captureCanvasEl.toBlob((result) => resolve(result), 'image/jpeg', 0.9);
		});

		if (!blob) {
			return undefined;
		}

		const file = new File([blob], `ticket-scan-${Date.now()}.jpg`, {
			type: 'image/jpeg'
		});

		try {
			const response = await imageUpload(file, { user: session?.user?.id ?? '' });
			if (!response.ok) {
				return undefined;
			}

			const payload = await response.json();
			const [fileId] = Object.values(payload);
			if (typeof fileId !== 'string') {
				return undefined;
			}

			return `https://ucarecdn.com/${fileId}/`;
		} catch (error) {
			console.error('Unable to upload scan image', error);
			return undefined;
		}
	}, [session?.user?.id, captureCanvasEl]);

	const collectMetadata = async () => {
		try {
			const imageUrl = await captureImageFromVideo();

			return {
				gpsLat: coords?.latitude,
				gpsLng: coords?.longitude,
				imageUrl
			};
		} catch (error) {
			console.error('Failed to collect scan metadata', error);
			return { gpsLat: undefined, gpsLng: undefined, imageUrl: undefined };
		}
	}

	

	useEffect(() => {
		if (!(text || validationData)) return
		const timeoutId = setTimeout(() => {
			// Reset the state after 3 seconds
			setText(null);
			setValidationData(null);
		}, resetTime);

		return () => {
			// Clear the timeout if the component unmounts or if the state changes
			clearTimeout(timeoutId);
		};
	}, [text, validationData]);

	const devices = useDevices();
  	const [selectedDevice, setSelectedDevice] = useState<string | null>(null);


	  const validateTicket = async (text: string) => {
		// Prevent duplicate scans within 5 seconds
		if (lastScanned.current?.value === text && Date.now() - lastScanned.current.timestamp < 5000) {
			return;
		}

		if (validateMut.isPending) {
			return;
		}

		// Update tracking before processing
		lastScanned.current = { value: text, timestamp: Date.now() };

		let url: URL;
		let ticketId: string | null = null;
		let eventId: string | null = null;
		try {
			url = new URL(text);
			ticketId = url.searchParams.get('id');
			eventId = url.searchParams.get('eventId');
		} catch (err) {
			setText('Invalid QR code: not a valid URL');
			return;
		}

		if (ticketId && eventId) {
			const metadata = await collectMetadata();

			validateMut.mutate(
				{
					eventId,
					ticketId,
					gpsLat: metadata.gpsLat,
					gpsLng: metadata.gpsLng,
					imageUrl: metadata.imageUrl
				},
				{
					onSuccess: (r) => {
						setText('Checked In');
						setValidationData(r);
					},
					onError: ({ message }) => {
						setText(message);
					}
				}
			);
		}
	};

	const handleScan = useCallback((results: IDetectedBarcode[]) => {
		vibrate();
		for (const result of results) {
			void validateTicket(result.rawValue);
		}
	}, [validateTicket, vibrate]);
	return (
		<>
			<NextSeo nofollow={true} />

			<Modal isOpen={!!validationData} closeModal={() => setValidationData(null)}>
				<TicketDetails
					showQR={false}
					ticket={validationData ?? undefined}
					user={validationData?.user ?? undefined}
				/>
			</Modal>

			<div className="flex justify-start items-center gap-2">
				{validateMut.isPending && <span className="loading loading-dots loading-md" />}

				{!!text && validateMut.isSuccess && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						id="Layer_1"
						className=" w-5 h-5 fill-success"
						viewBox="0 0 122.88 101.6"
					>
						<title>tick-green</title>
						<path d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z" />
					</svg>
				)}

				{!!text && validateMut.isError && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						version="1.1"
						id="Layer_1"
						x="0px"
						y="0px"
						width="122.879px"
						height="122.879px"
						viewBox="0 0 122.879 122.879"
						enableBackground="new 0 0 122.879 122.879"
						xmlSpace="preserve"
						className="w-5 h-5"
					>
						<g>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								fill="#FF4141"
								d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
							/>
						</g>
					</svg>
				)}
				<h2 className="font-semibold text-xl text-center">&nbsp;{text}</h2>
			</div>

			<div ref={scannerRef}>
				<Scanner
					formats={['qr_code']}
					onScan={handleScan}
					constraints={{
						deviceId: selectedDevice ?? undefined
					}}
				/>
			</div>
			<select onChange={(e) => setSelectedDevice(e.target.value as string)} value={selectedDevice ?? ''}>
				<option value="">Select a camera</option>
				{devices.map((device) => (
				<option key={device.deviceId} value={device.deviceId}>
					{device.label || `Camera ${device.deviceId}`}
				</option>
				))}
			</select>
		</>
	);
}
