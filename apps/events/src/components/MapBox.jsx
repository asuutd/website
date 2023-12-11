import { env } from '@/env/client.mjs';
import { AddressAutofill, useAddressAutofillCore, useSearchBoxCore } from '@mapbox/search-js-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { v4 } from 'uuid';

/**
 *
 * @typedef {import('./EventForm').EventFormInput} EventFormInput
 * @param {import('react-hook-form').ControllerRenderProps<EventFormInput, 'location'> & {className: string}} props
 */
const MapBox = ({ onChange, value, className }) => {
	return (
		<form>
			<AddressAutofill
				accessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
				onRetrieve={(e) => {
					console.log(e);
					onChange({
						address: e.features[0]?.properties.place_name,
						coordinates: e.features[0]?.geometry.coordinates
					});
				}}
				options={{
					country: 'us'
				}}
			>
				<input
					autoComplete="shipping address-line1"
					value={value?.address}
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
		</form>
	);
};

export default MapBox;

const Comp = () => {
	return <></>;
};
