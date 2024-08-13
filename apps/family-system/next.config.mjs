// @ts-check

import { withPayload } from '@payloadcms/next/withPayload';
import { env } from './src/env/server.mjs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Your Next.js config here
	reactStrictMode: true,
	experimental: {
		reactCompiler: true
	},
	// TODO: remove this after figuring out the TS error in src/app/(payload)/layout.tsx
	typescript: {
		ignoreBuildErrors: true
	},
	outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
};

export default withPayload(nextConfig);
