import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL_UNPOOLED')
  },
  schema: 'prisma/schema.prisma'
})