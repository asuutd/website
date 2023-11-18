import React, { useState } from 'react';
import { QrReader, OnResultFunction } from 'react-qr-reader';
type QRScannerProps = {
	onResult: OnResultFunction;
};
const Test = ({ onResult }: QRScannerProps) => {
	return (
		<>
			<QrReader
				onResult={onResult}
				constraints={{ facingMode: 'environment' }}
				containerStyle={{ width: '100%', height: '100%' }}
			/>
		</>
	);
};
export default Test;
