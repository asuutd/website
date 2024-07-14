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
import { getMember, getMembers } from './jonze'
import { sum } from 'drizzle-orm'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Members, Families, LedgerEntries],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
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

                    sendLog(`Creating member ${member.id}`)
                    const body = {
                      jonze_member_id: memberData.id,
                      jonze_name: ((memberData.user.firstName ?? ' ') + ' ' + (memberData.user.lastName ?? '')).trim(),
                      jonze_tags: memberData.tags?.names ?? [],
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
        const ledger_entries = req.payload.db.tables.ledger_entries

        const newScores = await req.payload.db.drizzle.select({
          familyId: ledger_entries.Family, 
          newScore: sum(ledger_entries.amount).as('new_score')
        }).from(ledger_entries)
        .groupBy(ledger_entries.Family)

        for (const { newScore, familyId } of newScores) {
          await req.payload.update(
            {
              collection: 'families',
              id: familyId,
              data: {
                score: newScore ?? 0
              }
            }
          )
        }

        return new Response(null, {
          status: 200
        })
      }
    }
  ]
})
