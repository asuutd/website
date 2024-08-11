'use server';

import { env } from '@/env/server.mjs';
import { JonzeClient } from './JonzeClient';

export const jonzeClient = new JonzeClient(env.JONZE_API_KEY, !!env.USE_JONZE_DEV);
