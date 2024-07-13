// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Members } from './collections/Members'
import { Families } from './collections/Families'
import { getMember, getMembers } from './jonze'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Members, Families],
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
  plugins: [
    // storage-adapter-placeholder
  ],
  endpoints: [
    {
      path: '/sync-members',
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
                  const out = `${date.toLocaleTimeString()}: ${data}\n` 
                  const chunkData = encoder.encode(out);
                  controller.enqueue(chunkData);
                }

                sendLog(`Getting members`)
                const members = await getMembers()

                sendLog(`Got ${members.length} members`)

                for (const member of members) {
                  sendLog(`Getting member ${member.id}`)
                  const memberData = await getMember(member.id)
                  sendLog(`Got member ${member.id}`)

                  sendLog(`Creating member ${member.id}`)
                  const body = {
                    jonze_member_id: memberData.id,
                    jonze_name: (memberData.user.firstName || ' ' + ' ' + memberData.user.lastName || '').trim(),
                    jonze_tags: memberData.tags?.names ?? [],
                  }
                  await req.payload.db.drizzle.insert(req.payload.db.tables.members).values(body).onConflictDoUpdate({
                    target: req.payload.db.tables.members.jonze_member_id,
                    set: body})
                  sendLog(`Created member ${member.id}`)
                }

                sendLog(`Done!`)
                controller.close();
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
    }
  ]
})
