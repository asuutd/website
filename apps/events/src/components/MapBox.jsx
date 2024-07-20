import { env } from '@/env/client.mjs';
import { AddressAutofill } from '@mapbox/search-js-react';
import { useEffect, useState } from 'react';

/**
 *
 * @typedef {import('./EventForm').EventFormInput} EventFormInput
 * @param {import('react-hook-form').ControllerRenderProps<EventFormInput, 'location'> & {className: string, value?: {coordinates: [number, number], address: string}}} props
 */
const MapBox = ({ onChange, value, className }) => {
	const [coords, setCoords] = useState(value?.coordinates ?? [0, 0]);
	useEffect(() => {
		onChange({
			...value,
			coordinates: coords
		});
	}, [coords]);
	if (!value) return null
	return (
		<AddressAutofill
			accessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			onRetrieve={(e) => {
				const coordinates = e.features[0]?.geometry.coordinates;
				setCoords(coordinates);
			}}
			options={{
				country: 'us'
			}}
		>
			<input
				autoComplete="shipping address-line1"
				value={value.address}
				onChange={(e) =>
					onChange({
						...value,
						address: e.target.value
					})
				}
				className={className}
				type="text"
			/>
		</AddressAutofill>
	);
};

export default MapBox;
