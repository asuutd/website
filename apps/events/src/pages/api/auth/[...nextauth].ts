import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';
import { CustomPrismaAdapter } from '../../../utils/adapter';
import EmailProvider from "next-auth/providers/email"
import LoginLinkEmail from '../../emails/login-email';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
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
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		})
		// ...add more providers here
	]
};

export default NextAuth(authOptions);
