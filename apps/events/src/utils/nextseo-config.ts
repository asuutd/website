import { env } from '../env/client.mjs';
import { DefaultSeoProps } from 'next-seo';

//Must only be used on client side
const config: DefaultSeoProps = {
	openGraph: {
		type: 'website',
		locale: 'en_IE',
		url: `${env.NEXT_PUBLIC_URL}`,
		siteName: 'Kazala',
		images: [
			{
				url: 'https://ucarecdn.com/2d05d650-f706-46d0-aaec-65c924a95fcc/',
				width: 50,
				height: 50,
				alt: 'OG image Alt',
				type: 'image/png'
			}
		]
	}
};

export default config;
