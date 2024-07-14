import { withPayload } from '@payloadcms/next/withPayload'
import { env } from './src/env/server.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
}

export default withPayload(nextConfig)
