import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@/server/db/drizzle/adapter';
// Prisma adapter for NextAuth, optional and can be removed

import { drizzle } from '../../../server/db/drizzle';

import { env } from '../../../env/server.mjs';
import { organizer as dbOrganizer } from '@/server/db/drizzle/schema/organizer';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		async session({ session, user }) {
			console.log(user);
			if (session.user) {
				session.user.id = user.id;
				const organizer = await drizzle.query.organizer.findFirst({
					where: eq(dbOrganizer.id, user.id)
				});

				if (organizer) {
					session.user.role = 'ORGANIZER';
				}
			}

			return session;
		}
	},
	// Configure one or more authentication providers
	adapter: DrizzleAdapter(drizzle),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		})
		// ...add more providers here
	]
};

export default NextAuth(authOptions);
