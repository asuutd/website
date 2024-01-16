import {withSentryConfig} from '@sentry/nextjs';
// @ts-check
import { env } from './src/env/server.mjs';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config;
}

export default withSentryConfig(defineNextConfig({
	reactStrictMode: true,
	swcMinify: true,
	images: {
			domains: ['lh3.googleusercontent.com', 'pbs.twimg.com', 'ucarecdn.com', 'fastly.picsum.photos']
	},
	// Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
	i18n: {
			locales: ['en'],
			defaultLocale: 'en'
	}
	}), 
	{
		// For all available options, see:
		// https://github.com/getsentry/sentry-webpack-plugin#options

		// Suppresses source map uploading logs during build
		silent: true,
		org: "asu-utd",
		project: "kazala",
	}, 
	{
	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Transpiles SDK to be compatible with IE11 (increases bundle size)
	transpileClientSDK: true,

	// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
	tunnelRoute: "/monitoring",

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,
	}
);