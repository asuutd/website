module.exports = {
	"extends": ["../../.eslintrc.cjs", "next/core-web-vitals", "wesbos/typescript"],
	"rules": {
		"@next/next/no-html-link-for-pages": ["error", "./src/pages"],
		"camelcase": 'off',
		"no-else-return": 'warn'
	}
}
