import { Prisma, PrismaClient } from '@prisma/client';
import { Adapter, AdapterAccount } from 'next-auth/adapters';
import type { ProviderType } from 'next-auth/providers/index';

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
	return {
		createUser: (data) => {
			console.log('ATTEMPTING TO CREATE USER');
			return p.user.upsert({
				where: {
					email: data.email
				},
				create: data,
				update: data
			});
		},
		getUser: (id) => {
			console.log('ATTEMPTING TO FETCH USER');
			return p.user.findUnique({ where: { id } });
		},
		getUserByEmail: async (email) => {
			console.log('FETCHING BY USER EMAIL');
			const user = await p.user.findUnique({
				where: { email },
				include: {
					_count: {
						select: {
							accounts: true
						}
					}
				}
			});
			console.log(user?._count.accounts);

			return user && user._count.accounts > 0 ? user : null;
		},
		async getUserByAccount(provider_providerAccountId) {
			console.log('GET USER BY ACCOUNT', provider_providerAccountId);
			let _a;
			const account = await p.account.findUnique({
				where: { provider_providerAccountId },
				select: { user: true }
			});

			console.log(account);
			return (_a = account === null || account === void 0 ? void 0 : account.user) !== null &&
				_a !== void 0
				? _a
				: null;
		},
		updateUser: ({ id, ...data }) => {
			console.log('UPDATING USER');
			return p.user.update({ where: { id }, data });
		},
		deleteUser: (id) => p.user.delete({ where: { id } }),
		linkAccount: async (data) => {
			console.log('LINK IN PROGRESS');
			if (data.scope === undefined) {
				throw new Error('Scope must be defined');
			}

			const createdAccount = await p.account.create({
				data: {
					access_token: data.access_token,
					token_type: data.token_type,
					refresh_token: data.refresh_token,
					scope: data.scope,
					expires_at: data.expires_at ?? 0,
					providerAccountId: data.providerAccountId,
					userId: data.userId,
					provider: data.provider,
					type: data.type
				}
			});

			return {
				access_token: createdAccount.access_token as string,
				token_type: createdAccount.token_type as string,
				refresh_token: createdAccount.refresh_token as string,
				id_token: createdAccount.id_token as string,
				scope: createdAccount.scope,
				expires_at: createdAccount.expires_at,
				providerAccountId: createdAccount.providerAccountId,
				userId: createdAccount.userId,
				provider: createdAccount.provider,
				type: createdAccount.type as ProviderType
			};
		},
		unlinkAccount: async (provider_providerAccountId) => {
			const deleted = await p.account.delete({
				where: { provider_providerAccountId }
			});
			return {
				access_token: deleted.access_token as string,
				token_type: deleted.token_type as string,
				id_token: deleted.id_token as string,
				refresh_token: deleted.refresh_token as string,
				scope: deleted.scope,
				expires_at: deleted.expires_at,
				providerAccountId: deleted.providerAccountId,
				userId: deleted.userId,
				provider: deleted.provider,
				type: deleted.type as ProviderType
			};
		},
		async getSessionAndUser(sessionToken) {
			console.log('74 GETTTING SESSION');
			const userAndSession = await p.session.findUnique({
				where: { sessionToken },
				include: { user: true }
			});
			if (!userAndSession) return null;
			const { user, ...session } = userAndSession;
			return { user, session };
		},
		createSession: (data) => p.session.create({ data }),
		updateSession: (data) => p.session.update({ where: { sessionToken: data.sessionToken }, data }),
		deleteSession: (sessionToken) => p.session.delete({ where: { sessionToken } }),
		async createVerificationToken(data) {
			const verificationToken = await p.verificationToken.create({ data });
			// @ts-expect-errors // MongoDB needs an ID, but we don't
			if (verificationToken.id) delete verificationToken.id;
			return verificationToken;
		},
		async useVerificationToken(identifier_token) {
			try {
				const verificationToken = await p.verificationToken.delete({
					where: { identifier_token }
				});
				// @ts-expect-errors // MongoDB needs an ID, but we don't
				if (verificationToken.id) delete verificationToken.id;
				return verificationToken;
			} catch (error) {
				// If token already used/deleted, just return null
				// https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
				if (error instanceof Prisma.PrismaClientKnownRequestError) {
					// The .code property can be accessed in a type-safe manner
					if (error.code === 'P2025') {
						return null;
					}
				}
				throw error;
			}
		}
	};
}
