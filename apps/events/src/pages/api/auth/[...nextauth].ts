import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';
import { CustomPrismaAdapter } from '@/utils/adapter';
import EmailProvider from "next-auth/providers/email"
import LoginLinkEmail from '@/server/trpc/router/emails/login';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
const resend = new Resend(env.RESEND_API_KEY);


export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		async session({ session, user }) {
			console.log(user);
			if (session.user) {
				session.user.id = user.id;
				const organizer = await prisma.organizer.findFirst({
					where: {
						id: user.id
					}
				});

				if (organizer) {
					session.user.role = 'ORGANIZER';
				}
			}

			return session;
		}
	},
	// Configure one or more authentication providers
	adapter: CustomPrismaAdapter(prisma),
	theme: {
		logo: '../../../favicon.png',
		brandColor: '#4B140A',
	},
	pages: {
		signIn: '/signin',
	},
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		}),
		EmailProvider({
			async sendVerificationRequest({
				identifier: email,
				url,
			  }) {
				const data = await resend.sendEmail({
					from: 'Kazala Tickets <login@mails.kazala.co>',
					to: email,
					subject: `Log in to Kazala`,
					react: LoginLinkEmail({
						login_link: url,
					}),
					headers: {
						'X-Entity-Ref-ID': uuidv4()
					}
				});
			}
		})
	]
};

export default NextAuth(authOptions);
