/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'false',
	theme: {
		extend: {
			animation: {
				'slow-spin': 'spin 50s linear infinite'
			},
			backgroundImage: {
				'hero-lg': "url('/BGImages/big.jpeg')",
				'hero-sm': "url('/BGImages/small.jpg')",
				'main-img': "url('/BGImages/bg.webp')",
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			}
		}
	},
	daisyui: {
		themes: [
			'autumn',
			{
				mytheme: {
					primary: '#E89700',

					secondary: '#455709',

					accent: '#4B140A',

					neutral: '#21202D',

					'base-100': '#EEEFF2',

					info: '#339EDB',

					success: '#1D8C65',

					warning: '#F4952F',

					error: '#E65B72'
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
