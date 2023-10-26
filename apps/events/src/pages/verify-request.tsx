

import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const VerifyLoginPage = () => {
	return (
		<>
			<Head>
				<title>Verify Request</title>
			</Head>
			<div className="flex flex-col justify-center min-h-[66vh] gap-3 items-center">
				<h2 className="text-center text-5xl font-bold text-primary">
Check your email
				</h2>
				<div className="flex w-full sm:max-w-xl bg-white rounded-lg p-8 flex-col">
					<p>A sign in link has been sent to your email address. Check your spam or junk mailbox if you don&apos;t receive an email in the next 5 minutes, or <Link href="/">
					<a className="underline text-center">sign in again</a></Link> if you do not receive an email in this time.
				 	</p>
				</div>

				<Link href="/" >
					<a className="underline text-center">Go home</a>
				</Link>
			</div>
		</>
	);
};

export default VerifyLoginPage;
