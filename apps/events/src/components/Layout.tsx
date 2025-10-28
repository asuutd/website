import type { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, getProviders, LiteralUnion } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import LoginForm from './LoginForm';
import Navbar from './Navbar';
import { Toaster } from './ui/toaster';

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="  p-0 mx-auto m-0">
			<div className="min-h-screen bg-base-100 min-w-full">
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Head>
				<Navbar />
				<div className="min-h-full max-w-7xl mx-auto p-4">{children}</div>

				<Footer />
				<Toaster />
			</div>
		</div>
	);
}
