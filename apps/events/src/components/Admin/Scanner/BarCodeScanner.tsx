import React, { useState } from 'react';
import { QrReader, OnResultFunction } from 'react-qr-reader';
type QRScannerProps = {
	onResult: OnResultFunction;
};
const Test = ({ onResult }: QRScannerProps) => {
	return (
		<>
			<QrReader onResult={onResult} constraints={{ aspectRatio: 300, facingMode: 'environment' }} />
		</>
	);
};
export default Test;
