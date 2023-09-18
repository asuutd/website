import { env } from '@/env/client.mjs';
import { AddressAutofill, useAddressAutofillCore, useSearchBoxCore } from '@mapbox/search-js-react';
import { AddressAutofillProps } from '@mapbox/search-js-react/dist/components/AddressAutofill';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { v4 } from 'uuid';
import type { EventFormInput } from './EventForm';
type Props = ControllerRenderProps<EventFormInput, 'location'>;
const MapBox: React.FC<Props> = ({ onChange, value }) => {
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
					className="input input-bordered"
					type='text'
				/>
			</AddressAutofill>
		</form>
	);
};

export default MapBox;
