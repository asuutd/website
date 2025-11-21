import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: env('DIRECT_URL')
  },
  schema: 'prisma/schema.prisma'
})