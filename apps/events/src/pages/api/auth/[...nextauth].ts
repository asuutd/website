import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';

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
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		})
		// ...add more providers here
	]
};

export default NextAuth(authOptions);
