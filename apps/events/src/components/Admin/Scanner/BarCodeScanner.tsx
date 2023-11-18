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
				constraints={{ aspectRatio: 30, facingMode: 'environment', height: 300 }}
			/>
		</>
	);
};
export default Test;
