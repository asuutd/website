import { env } from '@/env/server.mjs';
import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	Hr
} from '@react-email/components';
import * as React from 'react';

interface LoginLinkEmailProps {
	login_link: string;
}

const baseUrl = env.NEXT_PUBLIC_URL;

export const LoginLinkEmail = ({
	login_link = 'https://vercel.com/teams/invite/foo'
}: LoginLinkEmailProps) => {
	const previewText = `Log in to Kazala`;
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Bricolage Grotesque"
					fallbackFontFamily="Verdana"
					webFont={{
						url: 'https://db.onlinewebfonts.com/t/102353a74d2e0700af3e11ef8a917b26.woff2',
						format: 'woff2'
					}}
					fontWeight={100}
					fontStyle="normal"
				/>
			</Head>
			<Preview>{previewText}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Img src={`${baseUrl}/favicon.png`} width="40" height="48" alt="Kazala Logo" />

					<Section>
						<Text style={text}>Hi 👋,</Text>

						<Text style={text}>
							Welcome back to <Link href={baseUrl}>Kazala</Link>. Use the button below to sign in.
						</Text>

						<Section style={{ alignItems: 'center', textAlign: 'center' }}>
							<Button pX={10} pY={12} style={button} href={login_link}>
								Login
							</Button>
						</Section>
						<Text style={text}>
							Alternatively, copy and paste this URL into your browser:{' '}
							<Link href={login_link} style={anchor}>
								{login_link}
							</Link>
						</Text>

						<Hr style={hr} />
						<Text style={text}>
							If you did not request this email, you can safely ignore it. If you are concerned
							about your account&apos;s safety, please reply to this email to get in touch with us.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default LoginLinkEmail;

const main = {
	backgroundColor: '#f0ece9',
	margin: '0 auto',
	fontFamily: "'Bricolage Grotesque', sans-serif",
	padding: '10px 0'
	// "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
};

const container = {
	backgroundColor: '#eee5dd',
	maxWidth: '36rem',
	marginTop: '3rem',
	marginLeft: 'auto',
	marginRight: 'auto',
	padding: '2rem',
	borderRadius: '0.5rem',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

const text = {
	fontSize: '16px',
	color: '#404040',
	lineHeight: '26px'
};

const button = {
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	width: '180px',
	borderRadius: '8px',
	backgroundColor: '#8c0327',
	color: '#f0ece9',
	fontSize: '12px'
};

const anchor = {
	textDecoration: 'underline',
	color: '#8c0327'
};

const Font = ({
	webFont = { url: '', format: '' },
	fontStyle = 'normal',
	fontFamily = '',
	fontWeight = 400,
	fallbackFontFamily = ''
}) => {
	const src = webFont ? `src: url(${webFont.url}) format(${webFont.format});` : '';

	return (
		<style>
			{`
			  @font-face {
				  font-style: ${fontStyle};
				  font-family: ${fontFamily};
				  font-weight: ${fontWeight};
				  mso-font-alt: ${Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily};
				  ${src}
			  }
	
			  * {
				  font-family: ${fontFamily}, ${
				Array.isArray(fallbackFontFamily) ? fallbackFontFamily.join(', ') : fallbackFontFamily
			};
			  }
			  `}
		</style>
	);
};

const hr = {
	borderColor: '#8c0327',
	margin: '20px 0'
};
