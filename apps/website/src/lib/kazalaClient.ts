import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../events/src/server/trpc/router';
import superjson from 'superjson';

export const kazalaClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://kazala.co/api/trpc',
    })
  ],
  transformer: superjson
});
