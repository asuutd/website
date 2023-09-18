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
	NEXTAUTH_URL: z.string().url(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	WEBHOOK_SECRET: z.string()
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
	// NEXT_PUBLIC_BAR: z.string(),
	NEXT_PUBLIC_URL: z.string(),
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
	NEXT_PUBLIC_UPLOADCARE_PUB_KEY: z.string(),
	NEXT_PUBLIC_GOOGLE_MAPS_KEY: z.string(),
	NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string()
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	NEXT_PUBLIC_UPLOADCARE_PUB_KEY: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY,
	NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
	NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
	// NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
};
