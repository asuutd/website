// @ts-check

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Members } from './collections/Members';
import { Families } from './collections/Families';
import { createLedgerEntryForEventAttendance, LedgerEntries } from './collections/LedgerEntries';
import { Media } from './collections/Media';
import { BoxAccessToken } from '@/collections/BoxAccessToken';
import { jonzeClient } from './utils/jonze';
import { defaultFamily, getMembersByFamilyTag, recalculateScores } from './utils/scores';
import { env } from './env/server.mjs';
import { eq } from 'drizzle-orm';
import { resendAdapter } from '@payloadcms/email-resend';
import { Webhook } from 'svix';
import { boxStoragePlugin } from "@asu/payload-storage-box";
import { tokenStorage } from './utils/box';
import { BoxOAuth, OAuthConfig } from 'box-typescript-sdk-gen';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Sets up the default family in the database if it doesn't already exist.
 * 
 * @param {import('payload').Payload} payload - The Payload CMS instance.
 * @returns {Promise<void>}
 */
const setUpDefaultFamily = async (payload) => {
	const { totalDocs } = await payload.find({
		collection: 'families',
		where: {
			jonze_family_tag: { equals: defaultFamily.jonze_family_tag }
		}
	});

	if (totalDocs == 1) return;
	await payload.create({
		collection: 'families',
		data: defaultFamily
	});
};

const DEV_USER_EMAIL = 'dev@utd-asu.com'
const DEV_USER_PASSWORD = 'password'

/**
 * Sets up the development user in the database if it doesn't already exist.
 * 
 * @param {import('payload').Payload} payload - The Payload CMS instance.
 * @returns {Promise<void>}
 */
const setUpDevUser = async (payload) => {
	if (env.NODE_ENV !== 'development') {
		payload.logger.warn('Not in development environment, skipping dev user creation.')
		return
	}
	const { totalDocs } = await payload.find({
		collection: 'users',
		where: {
			email: { equals: DEV_USER_EMAIL }
		}
	});

	if (totalDocs == 1) {
		payload.logger.info(`Dev user already exists, skipping creation. Login with email '${DEV_USER_EMAIL}' and password '${DEV_USER_PASSWORD}'.`)
		return
	};

	await payload.create({
		collection: 'users',
		data: {
			email: DEV_USER_EMAIL,
			password: DEV_USER_PASSWORD,
		}
	});

	payload.logger.info(`Created dev user - login with email '${DEV_USER_EMAIL}' and password '${DEV_USER_PASSWORD}'`)
};

const payloadConfig = buildConfig({
	admin: {
		user: Users.slug,
		autoLogin: env.NODE_ENV === 'development' ? {
			email: DEV_USER_EMAIL,
			password: DEV_USER_PASSWORD,
			prefillOnly: true,
		} : false,
		importMap: {
			baseDir: dirname,
		},
	},
	debug: env.NODE_ENV === 'development',
	telemetry: true,
	onInit: async (payload) => {
		await setUpDefaultFamily(payload);
		await setUpDevUser(payload);	
	},
	collections: [Users, Members, Families, LedgerEntries, Media],
	globals: [BoxAccessToken],
	email: resendAdapter({
		apiKey: env.RESEND_API_KEY,
		defaultFromAddress: 'admin@mails.fam.utd-asu.com',
		defaultFromName: 'UTD African Student Union'
	}),
	editor: lexicalEditor(),
	secret: env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	},
	db: postgresAdapter({
		pool: {
			connectionString: env.POSTGRES_URL
		}
		// schemaName: 'git-' + process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ?? undefined
	}),
	sharp,
	endpoints: [
		{
			path: '/sync-jonze-members',
			method: 'post',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const encoder = new TextEncoder();
				const stream = new ReadableStream({
					async start(controller) {
						const sendLog = (data) => {
							const date = new Date();
							const out = `${date.toLocaleTimeString()}.${date.getMilliseconds()}: ${data}\n`;
							const chunkData = encoder.encode(out);
							controller.enqueue(chunkData);
						};

						try {
							sendLog(`Getting member list`);
							const members = await jonzeClient.getMembers();

							sendLog(`Got ${members.length} members`);

							for (const member of members) {
								sendLog(`Getting member ${member.id}`);
								const memberData = await jonzeClient.getMember(member.id);
								sendLog(`Got member ${member.id}`);

								sendLog(`Upserting member ${member.id}`);
								const body = {
									jonze_member_id: memberData.id,
									jonze_name: (
										(memberData.user.firstName ?? ' ') +
										' ' +
										(memberData.user.lastName ?? '')
									).trim(),
									jonze_tags: memberData.tags?.names ?? [],
									updatedAt: new Date()
								};
								await req.payload.db.drizzle
									.insert(req.payload.db.tables.members)
									.values(body)
									.onConflictDoUpdate({
										target: req.payload.db.tables.members.jonze_member_id,
										set: body
									});
								sendLog(`Created member ${member.id}`);
							}
							sendLog(`Done!`);
						} catch (e) {
							sendLog(`An error occurred:\n${JSON.stringify(e)}`);
						} finally {
							controller.close();
						}
					}
				});

				return new Response(stream, {
					status: 200,
					headers: {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache, no-transform',
						Connection: 'keep-alive'
					}
				});
			}
		},
		{
			method: 'post',
			path: '/refresh-scores',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				await recalculateScores(req.payload);

				return new Response(null, {
					status: 200
				});
			}
		},
		{
			method: 'post',
			path: '/webhook/jonze',
			handler: async (req) => {
				if (!req.json || !req.body) {
					return new Response('Bad Request', {
						status: 400,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const svix_id = req.headers.get('svix-id') ?? '';
				const svix_timestamp = req.headers.get('svix-timestamp') ?? '';
				const svix_signature = req.headers.get('svix-signature') ?? '';

				const payload = await req.json();
				const body = JSON.stringify(payload);

				const sivx = new Webhook(env.JONZE_WEBHOOK_SECRET);

				let evt;

				try {
					evt = sivx.verify(body, {
						'svix-id': svix_id,
						'svix-timestamp': svix_timestamp,
						'svix-signature': svix_signature
					});
				} catch (err) {
					payload.logger.error('Error verifying webhook:', err);
					return new Response('Bad Request', { status: 400 });
				}

				console.log(evt);

				const { data, type } = payload;
				console.log(data);

				switch (type) {
					case 'member.updated':
						console.log(data?.tags.names);
						await req.payload.db.drizzle
							.update(req.payload.db.tables['members'])
							.set({
								jonze_tags: data?.tags.names ?? [],
								updatedAt: new Date()
							})
							.where(eq(req.payload.db.tables['members'].jonze_member_id, data.id));

						break;
					case 'attendance.marked':
						await createLedgerEntryForEventAttendance(req.payload, data);
						break;
					default:
						req.payload.logger.warn('Received unhandled Jonze webhook type', type);
				}
				return new Response(null, {
					status: 200
				});
			}
		},
		{
			method: 'get',
			path: '/members-by-family-tag',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}
				const tag = req.searchParams.get('tag');
				if (!tag) {
					return new Response('Missing tag', {
						status: 400,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const members = await jonzeClient.getMembersByFamilyTag(req.payload, tag);

				return new Response(JSON.stringify(members), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	],
	graphQL: {
		disable: true
	},
	plugins: [
		boxStoragePlugin({
			enabled: true,
			collections: {
				[Media.slug]: true
			},
			options: {
				auth: new BoxOAuth({
					config: new OAuthConfig({
						clientId: env.BOX_OAUTH_CLIENT_ID,
						clientSecret: env.BOX_OAUTH_CLIENT_SECRET,
						tokenStorage,
					})
				}),
				folderId: env.BOX_FOLDER_ID
			}
		})
	]
});
export default payloadConfig;
