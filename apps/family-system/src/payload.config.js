// @ts-check

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig, getPayload } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Members } from './collections/Members';
import { Families } from './collections/Families';
import { LedgerEntries } from './collections/LedgerEntries';
import { Media } from './collections/Media';
import { getMember, getMembers } from './utils/jonze';
import { getMembersByFamilyTag, recalculateScores } from './utils/scores';
import { env } from './env/server.mjs';
import { eq } from 'drizzle-orm';
import { boxStoragePlugin } from "@asu/payload-storage-box";

import {resendAdapter} from '@payloadcms/email-resend'
import { BoxAccessToken } from './collections/BoxAccessToken';
import {
  BoxOAuth,
  OAuthConfig,
} from 'box-typescript-sdk-gen/lib/box/oauth.generated.js';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

class PayloadBackedInMemoryTokenStorage {
  constructor() {
    this.payload = null
    this.token = null
  }
  
  async store(t) {
    console.log("Storing", t)
    this.token = t
    
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    await this.payload.updateGlobal({
      slug: "box_access_token",
      data: {
        access_token: t
      }
    })
    
    return undefined
  }
  
  async get() {
    if (this.token) {
      console.log("Returning", this.token)
      return this.token
    }
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    
    const global = await this.payload.findGlobal({
      slug: "box_access_token"
    })
    
    if (!global || !global.access_token) throw new Error("Missing Box access token in db.")
    
    this.token = global.access_token
    console.log("Got", global)
    return this.token
  }
  
  async clear() {
    this.token = null
    if (!this.payload) this.payload = await getPayload({ config: payloadConfig })
    
    await this.payload.updateGlobal({
      slug: "box_access_token",
      data: {
        access_token: null
      }
    })
    console.log("Cleared")
    
    return undefined
  }
}


const payloadConfig = buildConfig({
	admin: {
		user: Users.slug
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
							const members = await getMembers();

							sendLog(`Got ${members.length} members`);

							for (const member of members) {
								sendLog(`Getting member ${member.id}`);
								const memberData = await getMember(member.id);
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
					return new Response('Unauthorized', {
						status: 401,
						headers: {
							'Content-Type': 'text/plain'
						}
					});
				}

				const { data, type } = await req.json();
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
					default:
						break;
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
            tokenStorage: new PayloadBackedInMemoryTokenStorage()
          })
				}),
				folderId: env.BOX_FOLDER_ID
			}
		})
	]
});
export default payloadConfig