module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/preline/dist/*.js'
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
					primary: '#096888',

					secondary: '#46616a',

					accent: '#87b7f2',

					neutral: '#4B5563',

					'base-100': '#e4f3f9',

					info: '#97B1DD',

					success: '#24E08B',

					warning: '#F9D36C',

					error: '#EB5674'
				}
			}
		]
	},

	plugins: [require('flowbite/plugin'), require('daisyui'), require('preline/plugin')]
};
