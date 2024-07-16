// @ts-check

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Members } from './collections/Members'
import { Families } from './collections/Families'
import { LedgerEntries } from './collections/LedgerEntries'
import { getMember, getMembers } from './utils/jonze'
import { getMembersByFamilyTag, recalculateScores } from './utils/scores'
import { env } from './env/server.mjs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Members, Families, LedgerEntries],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.POSTGRES_URL || '',
    },
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
              'Content-Type': 'text/plain',
            },
          })
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sendLog = (data) => {
                  const date = new Date();
                  const out = `${date.toLocaleTimeString()}.${date.getMilliseconds()}: ${data}\n` 
                  const chunkData = encoder.encode(out);
                  controller.enqueue(chunkData);
                }

                try {
                  sendLog(`Getting member list`)
                  const members = await getMembers()

                  sendLog(`Got ${members.length} members`)

                  for (const member of members) {
                    sendLog(`Getting member ${member.id}`)
                    const memberData = await getMember(member.id)
                    sendLog(`Got member ${member.id}`)

                    sendLog(`Upserting member ${member.id}`)
                    const body = {
                      jonze_member_id: memberData.id,
                      jonze_name: ((memberData.user.firstName ?? ' ') + ' ' + (memberData.user.lastName ?? '')).trim(),
                      jonze_tags: memberData.tags?.names ?? [],
                      updatedAt: new Date()
                    }
                    await req.payload.db.drizzle.insert(req.payload.db.tables.members).values(body).onConflictDoUpdate({
                      target: req.payload.db.tables.members.jonze_member_id,
                      set: body})
                    sendLog(`Created member ${member.id}`)
                  }
                  sendLog(`Done!`)
                } catch (e) {
                  sendLog(`An error occurred:\n${JSON.stringify(e)}`)
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
            'Connection': 'keep-alive',
          },
        })
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
              'Content-Type': 'text/plain',
            },
          })
        }
        
        await recalculateScores(req.payload)

        return new Response(null, {
          status: 200
        })
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
              'Content-Type': 'text/plain',
            },
          })
        }
        const tag = req.searchParams.get('tag')
        if (!tag) {
          return new Response('Missing tag', {
            status: 400,
            headers: {
              'Content-Type': 'text/plain',
            },
          })
        }

        const members = await getMembersByFamilyTag(req.payload, tag)

        return new Response(JSON.stringify(members), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    }
  ],
  graphQL: {
    disable: true
  }
})
