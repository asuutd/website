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
import { defaultFamily, getMembersByFamilyTag, getTopFamilies, getTopMemberPointEarners, recalculateScores } from './utils/scores';
import { env } from './env/server.mjs';
import { eq } from 'drizzle-orm';
import { resendAdapter } from '@payloadcms/email-resend';
import { Webhook } from 'svix';
import { boxStoragePlugin } from "@asu/payload-storage-box";
import { tokenStorage } from './utils/box';
import { BoxOAuth, OAuthConfig } from 'box-typescript-sdk-gen';
import { randomUUID } from 'crypto';

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
	cors: '*',
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

				const members = await getMembersByFamilyTag(req.payload, tag);

				return new Response(JSON.stringify(members), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		
		{
			method: 'get',
			path: '/agg/get_top_members',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const topMembers = await getTopMemberPointEarners(req.payload);

				return new Response(JSON.stringify(topMembers), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		{
			method: 'get',
			path: '/agg/get_top_families',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const topFamilies = await getTopFamilies(req.payload);

				return new Response(JSON.stringify(topFamilies), {
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		},
		{
			method: 'get',
			path: '/dev/seed_families',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				if (env.NODE_ENV !== 'development') {
					return new Response('Not in development mode', {
						status: 403,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}
				
				const FAMILIES_TO_CREATE = 5;

				const createdFamilies = []
				const batch = randomUUID();
				for (let i = 1; i <= FAMILIES_TO_CREATE; i++) {
					const jonze_family_tag =  '#fam-seed-' + i + '-' + batch
					createdFamilies.push(await req.payload.create({
						collection: 'families',
						req,
						data: {
							jonze_family_tag,
							family_name: 'Seeded Family ' + i + ' (Batch ' + batch + ')',
							score: i * 10
						}
					}));
					req.payload.logger.info('Created family', jonze_family_tag);
				}

				req.payload.logger.info('Getting members');
				const members = await req.payload.find({
					collection: 'members',
					limit: 1000,
					req
				});
				req.payload.logger.info('Got members');

				let addToFamily = 0;
				
				for (const member of members.docs) {
					const family = createdFamilies[addToFamily];
					const newTagsArray = [...(member.jonze_tags || []).filter((tag) => tag.startsWith('#fam-seed-')), family.jonze_family_tag];
					
					req.payload.logger.info('Updating member', member.id);
					await req.payload.update({
						collection: 'members',
						id: member.id,
						data: {
							jonze_tags: newTagsArray
						},
						req
					});
					req.payload.logger.info('Updated member', member.id);

					addToFamily++;
					if (addToFamily >= FAMILIES_TO_CREATE) {
						addToFamily = 0;
					}
				}

				return new Response(null, {
					status: 200
				});

			}
		},
		{
			method: 'get',
			path: '/dev/seed_ledger_entries',
			handler: async (req) => {
				if (!req.user) {
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				if (env.NODE_ENV !== 'development') {
					return new Response('Not in development mode', {
						status: 403,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const MEMBER_POINT_DESCRIPTIONS = [
					'Checked into event',
					'Liked a post on Instagram',
					'Commented on a post on Instagram',
					'Shared a post on Instagram'
				];

				const FAMILY_POINT_DESCRIPTIONS = [
					'Attended volunteer event',
					'Submitted point request'
				];

				const AWARD_PTS_AMOUNT = 10;
				const MAX_AWARDS_PER_FAMILY = 10;
				const MAX_AWARDS_PER_MEMBER = 10;

				// TODO: ledger entry schema requires family_id to be non-null. eventually want to be able to award points to a member OR a family, need to figure out how to do that
				const members = await req.payload.find({
					collection: 'members',
					limit: 1000,
					req
				});
				const memberAwards = members.docs.map((m) => ({m, count: Math.floor(Math.random() * MAX_AWARDS_PER_MEMBER)}));

				for (const {m, count} of memberAwards) {
					const points = new Array(count).fill(0).map((_, i) => ({
						description: MEMBER_POINT_DESCRIPTIONS[Math.floor(Math.random() * MEMBER_POINT_DESCRIPTIONS.length)],
						amount: AWARD_PTS_AMOUNT
					}));

					for (const point of points) {
						req.payload.logger.info('Inserting ledger entry', point);
						await req.payload.create({
							collection: 'ledger_entries',
							data: {
								amount: point.amount,
								description: point.description,
								member: m.id
							},
							req
						});
						req.payload.logger.info('Inserted ledger entry', point);
					}
				}


				req.payload.logger.info('Getting families');
				const families = await req.payload.find({
					collection: 'families',
					limit: 1000,
					req
				});
				req.payload.logger.info('Got families');

				const familyAwards = families.docs.map((f) => ({f, count: Math.floor(Math.random() * MAX_AWARDS_PER_FAMILY)}));

				for (const {f, count} of familyAwards) {
					const points = new Array(count).fill(0).map((_, i) => ({
						description: FAMILY_POINT_DESCRIPTIONS[Math.floor(Math.random() * FAMILY_POINT_DESCRIPTIONS.length)],
						amount: AWARD_PTS_AMOUNT
					}));

					for (const point of points) {
						req.payload.logger.info('Inserting ledger entry', point);
						await req.payload.create({
							collection: 'ledger_entries',
							data: {
								amount: point.amount,
								description: point.description,
								Family: f.id
							},
							req
						});
						req.payload.logger.info('Inserted ledger entry', point);
					}
				}

				req.payload.logger.info('Recalculating scores');
				await recalculateScores(req.payload);
				req.payload.logger.info('Recalculated scores');

				return new Response(null, {
					status: 200
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
