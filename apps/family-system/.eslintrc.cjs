/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['next/core-web-vitals'],
	parserOptions: {
		project: ['./tsconfig.json'],
		tsconfigRootDir: __dirname
	},
	plugins: [
		'eslint-plugin-react-compiler',
	  ],
	rules: {
		'react-compiler/react-compiler': "error",
	},
};
