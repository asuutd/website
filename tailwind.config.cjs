module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			fontFamily: {
				epilogue: ['"Epilogue"', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#490419',

					secondary: '#fde047',

					accent: '#87b7f2',

					neutral: '#273034',

					'base-100': '#4B5563',

					info: '#97B1DD',

					success: '#24E08B',

					warning: '#F9D36C',

					error: '#EB5674'
				}
			}
		]
	},

	plugins: [require('flowbite/plugin'), require('daisyui')]
};
