// @ts-check

import { withPayload } from '@payloadcms/next/withPayload';
import { env } from './src/env/server.mjs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Your Next.js config here
	reactStrictMode: true,
	experimental: {
		reactCompiler: true,
	},
	  // FIXME: This handles an issue with Box's TypeScript SDK which causes errors when running in Vercel deployment (see https://github.com/box/box-typescript-sdk-gen/issues/213#issuecomment-2287180102). Whenever the issue is resolved, this should be removed.
	outputFileTracingIncludes: {
	'/admin/[[\.\.\.segments]]/': [
		'node_modules/@tootallnate/quickjs-emscripten/**/*',
		'node_modules/agent-base/**/*',
		'node_modules/ast-types/**/*',
		'node_modules/asynckit/**/*',
		'node_modules/basic-ftp/**/*',
		'node_modules/combined-stream/**/*',
		'node_modules/data-uri-to-buffer/**/*',
		'node_modules/debug/**/*',
		'node_modules/degenerator/**/*',
		'node_modules/delayed-stream/**/*',
		'node_modules/escodegen/**/*',
		'node_modules/esprima/**/*',
		'node_modules/estraverse/**/*',
		'node_modules/esutils/**/*',
		'node_modules/form-data/**/*',
		'node_modules/fs-extra/**/*',
		'node_modules/get-uri/**/*',
		'node_modules/graceful-fs/**/*',
		'node_modules/http-proxy-agent/**/*',
		'node_modules/https-proxy-agent/**/*',
		'node_modules/ip-address/**/*',
		'node_modules/jsbn/**/*',
		'node_modules/jsonfile/**/*',
		'node_modules/lru-cache/**/*',
		'node_modules/mime-db/**/*',
		'node_modules/mime-types/**/*',
		'node_modules/ms/**/*',
		'node_modules/netmask/**/*',
		'node_modules/pac-proxy-agent/**/*',
		'node_modules/pac-resolver/**/*',
		'node_modules/proxy-agent/**/*',
		'node_modules/proxy-from-env/**/*',
		'node_modules/smart-buffer/**/*',
		'node_modules/socks/**/*',
		'node_modules/socks-proxy-agent/**/*',
		'node_modules/sprintf-js/**/*',
		'node_modules/tslib/**/*',
		'node_modules/universalify/**/*',
	  ],
	},
	// TODO: remove this after figuring out the TS error in src/app/(payload)/layout.tsx
	typescript: {
		ignoreBuildErrors: true
	},
	outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
};

export default withPayload(nextConfig);
