// src/pages/_app.tsx
import '../styles/globals.css';
import '@fontsource/inter';
import '@fontsource/inter/700.css';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import { DefaultSeo } from 'next-seo';
import Layout from '../components/Layout';
import SEOConfig from '../utils/nextseo-config';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Toaster } from 'sonner';

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { env } from '@/env/client.mjs';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps }
}) => {
  const router = useRouter()
  
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
    
      // Track page views
      const handleRouteChange = () => posthog?.capture('$pageview')
      router.events.on('routeChangeComplete', handleRouteChange)
  
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [])
    
	return (
		<PostHogProvider client={posthog}>
			<DefaultSeo {...SEOConfig} />
			<SessionProvider session={session}>
				<Layout>
					<Toaster richColors />
					<Component {...pageProps} />
				</Layout>
				<ReactQueryDevtools initialIsOpen={false} />
			</SessionProvider>
		 </PostHogProvider>
	);
};

export default trpc.withTRPC(MyApp);
