import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { account as accounts } from './schema/account';
import { user as users } from './schema/user';
import { verificationToken as verificationTokens } from './schema/vertificationtoken';
import { session as sessions } from './schema/session';
import schema from './schema';
import type { Adapter } from 'next-auth/adapters';
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless';

export function DrizzleAdapter(db: PlanetScaleDatabase<typeof schema>): Adapter {
	return {
		async createUser(userData) {
			console.log('ATTEMPTING TO CREATE USER');
			await db
				.insert(users)
				.values({
					id: createId(),
					email: userData.email,
					emailVerified: userData.emailVerified,
					name: userData.name,
					image: userData.image
				})
				.onDuplicateKeyUpdate({ set: userData });
			const rows = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
			const row = rows[0];
			if (!row) throw new Error('User not found');
			return row;
		},
		async getUser(id) {
			console.log('ATTEMPTING TO FETCH USER');
			const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
			const row = rows[0];
			return row ?? null;
		},
		async getUserByEmail(email) {
			console.log('FETCHING BY USER EMAIL');
			const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
			console.log(rows);
			const row = rows[0];
			return row ?? null;
		},
		async getUserByAccount({ providerAccountId, provider }) {
			console.log('GET USER BY ACCOUNT', providerAccountId);
			let _a;
			const account = await db.query.account.findFirst({
				where: and(eq(accounts.providerAccountId, providerAccountId)),
				with: {
					user: true
				}
			});

			console.log(account);

			return (_a = account === null || account === void 0 ? void 0 : account.user) !== null &&
				_a !== void 0
				? _a
				: null;
		},
		async updateUser({ id, ...userData }) {
			if (!id) throw new Error('User not found');
			await db.update(users).set(userData).where(eq(users.id, id));
			const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
			const row = rows[0];
			if (!row) throw new Error('User not found');
			return row;
		},
		async deleteUser(userId) {
			await db.delete(users).where(eq(users.id, userId));
		},
		async linkAccount(account) {
			await db.insert(accounts).values({
				id: createId(),
				userId: account.userId,
				type: account.type,
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				accessToken: account.access_token,
				expiresAt: account.expires_in as number,
				idToken: account.id_token,
				refreshToken: account.refresh_token,
				scope: account.scope,
				tokenType: account.token_type,
				sessionState: account.session_state
			});
		},
		async unlinkAccount({ providerAccountId, provider }) {
			await db
				.delete(accounts)
				.where(
					and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider))
				);
		},
		async createSession(data) {
			await db.insert(sessions).values({
				id: createId(),
				expires: data.expires,
				sessionToken: data.sessionToken,
				userId: data.userId
			});
			const rows = await db
				.select()
				.from(sessions)
				.where(eq(sessions.sessionToken, data.sessionToken))
				.limit(1);
			const row = rows[0];
			if (!row) throw new Error('User not found');
			return row;
		},
		async getSessionAndUser(sessionToken) {
			const rows = await db
				.select({
					user: users,
					session: {
						id: sessions.id,
						userId: sessions.userId,
						sessionToken: sessions.sessionToken,
						expires: sessions.expires
					}
				})
				.from(sessions)
				.innerJoin(users, eq(users.id, sessions.userId))
				.where(eq(sessions.sessionToken, sessionToken))
				.limit(1);
			const row = rows[0];
			if (!row) return null;
			const { user, session } = row;
			return {
				user,
				session: {
					id: session.id,
					userId: session.userId,
					sessionToken: session.sessionToken,
					expires: session.expires
				}
			};
		},
		async updateSession(session) {
			await db.update(sessions).set(session).where(eq(sessions.sessionToken, session.sessionToken));
			const rows = await db
				.select()
				.from(sessions)
				.where(eq(sessions.sessionToken, session.sessionToken))
				.limit(1);
			const row = rows[0];
			if (!row) throw new Error('Coding bug: updated session not found');
			return row;
		},
		async deleteSession(sessionToken) {
			await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
		},
		async createVerificationToken(verificationToken) {
			await db.insert(verificationTokens).values({
				expires: verificationToken.expires,
				identifier: verificationToken.identifier,
				token: verificationToken.token
			});
			const rows = await db
				.select()
				.from(verificationTokens)
				.where(eq(verificationTokens.token, verificationToken.token))
				.limit(1);
			const row = rows[0];
			if (!row) throw new Error('Coding bug: inserted verification token not found');
			return row;
		},
		async useVerificationToken({ identifier, token }) {
			const rows = await db
				.select()
				.from(verificationTokens)
				.where(eq(verificationTokens.token, token))
				.limit(1);
			const row = rows[0];
			if (!row) return null;
			await db
				.delete(verificationTokens)
				.where(
					and(eq(verificationTokens.token, token), eq(verificationTokens.identifier, identifier))
				);
			return row;
		}
	};
}
