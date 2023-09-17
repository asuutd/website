import { env } from '@/env/client.mjs';
import React, { useMemo } from 'react';

const Display = ({ address }: { address: string }) => {
	const locationQuery = useMemo(() => {
		const url = new URL('https://www.google.com/maps/embed/v1/place');
		url.searchParams.append('key', env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
		url.searchParams.append('q', address);
		return url.toString();
	}, []);

	return (
		<iframe
			width={1600}
			height={900}
			referrerPolicy="no-referrer-when-downgrade"
			src={locationQuery}
			className="w-full aspect-video h-96 rounded-lg"
		></iframe>
	);
};

export default Display;
