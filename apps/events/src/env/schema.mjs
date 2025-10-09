// @ts-check
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.preprocess(
		// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
		// Since NextAuth automatically uses the VERCEL_URL if present.
		(str) => process.env.VERCEL_URL ?? str,
		// VERCEL_URL doesnt include `https` so it cant be validated as a URL
		process.env.VERCEL ? z.string() : z.string().url(),
	),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	WEBHOOK_SECRET: z.string(),
	APPLE_TEAM_ID: z.string(),
	APPLE_TICKET_PASS_TYPE_IDENTIFIER: z.string().default('pass.com.kazala.event'),
	// https://github.com/alexandercerutti/passkit-generator/wiki/Generating-Certificates#generate-certificates-through-terminal
	// https://developer.apple.com/documentation/walletpasses/building_a_pass
	APPLE_PASS_CERTIFICATE: z.string(),
	APPLE_PASS_PRIVATE_KEY: z.string(),
	APPLE_PASS_PRIVATE_KEY_PASSPHRASE: z.string().optional(),
	APPLE_PASS_CERTIFICATE_PASSWORD: z.string().optional(),
	UPLOADCARE_SECRET_KEY: z.string(),
	RESEND_API_KEY: z.string(),
	R2_ACCOUNT_ID: z.string(),
	R2_ACCESS_KEY_ID: z.string(),
	R2_SECRET_ACCESS_KEY: z.string(),
	QRCODE_BUCKET: z.string(),
	GOOGLE_WALLET_ISSUER: z.string(),
	GOOGLE_WALLET_SERVICE_ACCOUNT_CREDENTIALS_BASE64: z.string()
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
	NEXT_PUBLIC_URL: z.string().url(),
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_UPLOADCARE_PUB_KEY: z.string(),
	NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string(),
	NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
	NEXT_PUBLIC_POSTHOG_KEY: z.string(),
	NEXT_PUBLIC_POSTHOG_HOST: z.string()
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL ?? (process.env.NEXT_PUBLIC_VERCEL_URL ? ("https://" + process.env.NEXT_PUBLIC_VERCEL_URL) : undefined),
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	NEXT_PUBLIC_UPLOADCARE_PUB_KEY: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY,
	NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
	NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
	NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
	NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST
};
