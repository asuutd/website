import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
	return (
		<>
			<Head>
				<title>Error Page</title>
			</Head>
			<div className="flex flex-col justify-center min-h-[66vh] gap-3">
				<h2 className="text-secondary text-7xl text-center">&#128517;</h2>
				<p className="text-center font-semibold text-primary">
					Life is hard as a solo developer. Don&apos;t make it harder
				</p>
				<Link href="/">
					<a className="underline text-center">Go home</a>
				</Link>
			</div>
		</>
	);
};

export default ErrorPage;
