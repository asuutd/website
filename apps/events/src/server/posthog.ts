import { PostHog } from 'posthog-node'
import { env } from '@/env/client.mjs';
export const getPostHog = () => new PostHog(
   env.NEXT_PUBLIC_POSTHOG_KEY,
   {
     host: env.NEXT_PUBLIC_POSTHOG_HOST,
     flushAt:1,
    flushInterval:0,
    disableGeoip:false,
   }
 )