import { SvelteKitAuth } from '@auth/sveltekit';
import { AUTH_SECRET } from '$env/static/private';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { resend } from '$lib/resend';
import { db } from '$lib/db';

export const handle = SvelteKitAuth({
	providers: [
		{
			id: 'resend',
			type: 'email',
			async sendVerificationRequest({ identifier: email, url }) {
				const { host } = new URL(url);
				// Call the cloud Email provider API for sending emails
				// See https://docs.sendgrid.com/api-reference/mail-send/mail-send
				const data = await resend.emails.send({
					from: 'ASU UTDallas <login@auth.utd-asu.com>',
					to: [email],
					subject: 'Sign in to UTD ASU',
					html: html({ url, host, email }),
					text: text({ url, host })
				});
			},
			maxAge: 24 * 60 * 60
		}
	],
	adapter: DrizzleAdapter(db),
	secret: AUTH_SECRET
});

// Email HTML body
function html({ url, host, email }: Record<'url' | 'host' | 'email', string>) {
	// Insert invisible space into domains and email address to prevent both the
	// email address and the domain from being turned into a hyperlink by email
	// clients like Outlook and Apple mail, as this is confusing because it seems
	// like they are supposed to click on their email address to sign in.
	const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
	const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

	// Some simple styling options
	const backgroundColor = '#f9f9f9';
	const textColor = '#444444';
	const mainBackgroundColor = '#ffffff';
	const buttonBackgroundColor = '#346df1';
	const buttonBorderColor = '#346df1';
	const buttonTextColor = '#ffffff';

	return `
  <body style="background: ${backgroundColor};">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  <strong>${escapedHost}</strong>
		</td>
	  </tr>
	</table>
	<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
	  <tr>
		<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  Sign in as <strong>${escapedEmail}</strong>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 20px 0;">
		  <table border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
			</tr>
		  </table>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  If you did not request this email you can safely ignore it.
		</td>
	  </tr>
	</table>
  </body>
  `;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<'url' | 'host', string>) {
	return `Sign in to ${host}\n${url}\n\n`;
}
