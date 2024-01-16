import { env } from '@/env/client.mjs';
import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Heading, 
	Section,
	Text,
	Row,
	Column, 
	Hr
} from '@react-email/components';
import * as React from 'react';
import { CSSProperties } from 'react';

interface OnboardingEmailProps {
	user_name?: string;
}

const baseUrl = env.NEXT_PUBLIC_URL;

  
export const OnboardingEmail = ({
	user_name = 'Collaborator',
}: OnboardingEmailProps) => {
	const previewText = `${user_name}, Welcome to Kazala!`;
	return (
		<Html>
			<Head>
				<Font
					fontFamily="Bricolage Grotesque"
					fallbackFontFamily="Helvetica"
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

			<Section style={logoSection}>
				<Img src={`${baseUrl}/favicon.png`} style={logo} width="40" height="40" alt="Kazala Logo" />
			</Section>

			<Container style={container}>			
				<Section style={header}>

					<Row style={headerContent}>
						<Heading style={headerContentTitle}>
							Welcome to Kazala
						</Heading>
					</Row>
					<Row style={topHeaderImageContainer}>
						<Img
							height={100}
							width={200}
							style={image}
							src={`${baseUrl}/hd-tickets-top.png`}
						/>
					</Row>
				</Section>

				<Section style={content}>
					<Row style={bottomHeaderImageContainer}>
						<Img
							height={100}
							width={200}
							style={image}
							src={`${baseUrl}/hd-tickets-bottom.png`}
						/>
					</Row>

					<Text style={paragraph}>
						Today&apos;s a great day! By signing up for Kazala, you&apos;re getting a tool that will help you most
						effiecently hangle you&apos;re ticket transactions at you&apos;re event.{' '}
					</Text>

					{/* <Hr style={hr} /> */}

					<Heading as="h2" style={title}>
						Here&apos;s What to Expect:
					</Heading>

					<Text style={paragraph}>
						Here are a few simple search tips to get you started:
					</Text>

					<Section>
						<Column>
							<Img
								src={`${baseUrl}/person-digging-solid.svg`}
								width="15"
								height="15"
								alt="Bullet Image"
								style = {{padding: '0px 0px 51px 0px'}}
							/>
						</Column>
						<Column style={{ padding: '0px 0px 0px 10px' }}>
							<Text style={productTitle}>
								Build for readers and writers
							</Text>
							<Text style={productDescription}>
								We&apos;re building a better place on the internet: an ad-free, 
								open platform where the best stores rise to the top.
							</Text>
						</Column>
					</Section>
					
					<Section>
						<Column>
							<Img
								src={`${baseUrl}/person-digging-solid.svg`}
								width="15"
								height="15"
								alt="Bullet Image"
								style = {{padding: '0px 0px 51px 0px'}}
							/>
						</Column>
						<Column style={{ padding: '0px 0px 0px 10px' }}>
							<Text style={productTitle}>
								Build for readers and writers
							</Text>
							<Text style={productDescription}>
								We&apos;re building a better place on the internet: an ad-free, 
								open platform where the best stores rise to the top.
							</Text>
						</Column>
					</Section>
					
					<Section>
						<Column>
							<Img
								src={`${baseUrl}/person-digging-solid.svg`}
								width="15"
								height="15"
								alt="Bullet Image"
								style = {{padding: '0px 0px 51px 0px'}}
							/>
						</Column>
						<Column style={{ padding: '0px 0px 0px 10px' }}>
							<Text style={productTitle}>
								Build for readers and writers
							</Text>
							<Text style={productDescription}>
								We&apos;re building a better place on the internet: an ad-free, 
								open platform where the best stores rise to the top.
							</Text>
						</Column>
					</Section>





					<Text style={paragraph}>
						The more information you can put in the search bar, the more likely
						you will be to either find the answer you need or feel confident
						that no one else has asked the question before.
					</Text>

					<Hr style={hr} />

					<Heading as="h2" style={title}>
						Take a break and read about the worst coder in the world
					</Heading>

					<Section style={buttonContainer}>
						<Link style={button} href="https://stackoverflow.blog/2019/10/22/">
						I need a break
						</Link>
					</Section>
				</Section>
			</Container>


			</Body>
		</Html>
	);
};
export default OnboardingEmail;

const main = {
	backgroundColor: '#f0ece9',
};

const logoSection = {
	width: '100%',
	margin: '0 auto',
	paddingBottom: '5px',
	zIndex: '999',
};

const logo = {
	margin: '0 auto',
	padding: '5px 0 0px'
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
                mso-font-alt: ${
									Array.isArray(fallbackFontFamily) ? fallbackFontFamily[0] : fallbackFontFamily
								};
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

const headerContent = { 
	padding: '20px 30px 15px 0px' 	
};

const headerContentTitle: CSSProperties  = {
  textAlign: 'center', // might need changing
  letterSpacing: '2.5px',
  color: '#f0ece9',
  fontSize: '30px',
  fontWeight: 'bold',
  lineHeight: '30px',
  padding: '30px 0px 0px 0px' 
};

const topHeaderImageContainer = {
  padding: '0px 10px 0px 0px',
};

const bottomHeaderImageContainer = {
	padding: '0px 10px 30px 0px',
};

const image = {
	margin: '0 auto'
}

const title: CSSProperties = {
  padding: '20px 0px 20px 0px',
  textAlign: 'center',
  margin: '0 0 15px',
  fontWeight: 'bold',
  fontSize: '19px',
  lineHeight: '21px',
  color: '#2e2e2e',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '21px',
  color: '#443c3c',
};


const container = {
  maxWidth: '32rem',
  width: '100%',
  margin: '0 auto',
  backgroundColor: '#eee5dd',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

const content = {
  padding: '0px 40px 30px 40px',
};

const header = {
  borderRadius: '10px 10px 0 0',
  flexDireciont: 'column',
  backgroundColor: '#8c0327',
};

const buttonContainer = {
  marginTop: '24px',
  display: 'block',
};

const button = {
  backgroundColor: '#0095ff',
  border: '1px solid #0077cc',
  fontSize: '17px',
  lineHeight: '17px',
  padding: '13px 17px',
  borderRadius: '4px',
  maxWidth: '120px',
  color: '#fff',
};





const productIcon = {
  margin: '0px 0px 0px 0px',
};

const resetText = {
  margin: '0',
  padding: '0',
  lineHeight: 2,
};

const productTitle = { 
  fontSize: '14px', 
  fontWeight: '600',
  color: 'ffffff',
  ...resetText,
};

const productDescription = {
  fontSize: '12px',
  color: '#443c3c',
  ...resetText,
};