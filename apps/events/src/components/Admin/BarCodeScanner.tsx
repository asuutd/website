import { Html5Qrcode } from 'html5-qrcode';
import {
	Html5QrcodeError,
	Html5QrcodeResult,
	QrcodeErrorCallback,
	QrcodeResult,
	QrcodeSuccessCallback
} from 'html5-qrcode/esm/core';
import {
	Html5QrcodeScanner,
	Html5QrcodeScannerConfig
} from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect, useRef } from 'react';
const qrcodeRegionId = 'html5qr-code-full-region';

type BarcodeScannerProps = {
	onResult: QrcodeSuccessCallback;
	onError: QrcodeErrorCallback;
};

type newType = Html5QrcodeScannerConfig & {
	fps: number;
	verbose?: boolean;
	qrCodeSuccessCallback: QrcodeSuccessCallback;
	qrCodeErrorCallback: QrcodeErrorCallback;
};

const createConfig = (props: Html5QrcodeScannerConfig) => {
	const config: any = {};
	if (props.fps) {
		config.fps = props.fps;
	}
	if (props.qrbox) {
		config.qrbox = props.qrbox;
	}
	if (props.aspectRatio) {
		config.aspectRatio = props.aspectRatio;
	}
	if (props.disableFlip !== undefined) {
		config.disableFlip = props.disableFlip;
	}
	return config;
};

const Html5QrcodePlugin: React.FC<newType> = (props) => {
	useEffect(() => {
		// when component mounts
		const config = createConfig(props);
		const verbose = props.verbose === true;
		// Suceess callback is required.
		if (!props.qrCodeSuccessCallback) {
			throw 'qrCodeSuccessCallback is required callback.';
		}
		const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
		html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

		// cleanup function when component will unmount
		return () => {
			html5QrcodeScanner.clear().catch((error) => {
				console.error('Failed to clear html5QrcodeScanner. ', error);
			});
		};
	}, []);

	return <div id={qrcodeRegionId} />;
};

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onError }) => {
	return (
		<Html5QrcodePlugin
			fps={10}
			qrbox={250}
			rememberLastUsedCamera={false}
			disableFlip={false}
			qrCodeSuccessCallback={onResult}
			qrCodeErrorCallback={onError}
		/>
	);
};
export default BarcodeScanner;
