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

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps }
}) => {
	return (
		<React.Fragment>
			<DefaultSeo {...SEOConfig} />
			<SessionProvider session={session}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<ReactQueryDevtools initialIsOpen={false} />
			</SessionProvider>
		</React.Fragment>
	);
};

export default trpc.withTRPC(MyApp);
