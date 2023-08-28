import { SvelteKitAuth } from '@auth/sveltekit';
import EmailProvider, { type SendVerificationRequestParams } from '@auth/core/providers/email';
import GoogleProvider from '@auth/core/providers/google';
import { GOOGLE_ClIENT_ID, GOOGLE_ClIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { resend } from '$lib/resend';
import { db } from '$lib/db';

const sendVerificationRequest = async (params: SendVerificationRequestParams) => {
	try {
		await resend.emails.send({
			from: 'YOUR EMAIL FROM (eg: team@resend.com)',
			to: params.identifier,
			subject: 'YOUR EMAIL SUBJECT',
			html: 'YOUR EMAIL CONTENT'
		});
	} catch (error) {
		console.log({ error });
	}
};

export const handle = SvelteKitAuth({
	providers: [GoogleProvider({ clientId: GOOGLE_ClIENT_ID, clientSecret: GOOGLE_ClIENT_SECRET })],
	adapter: DrizzleAdapter(db),
	secret: AUTH_SECRET
});
