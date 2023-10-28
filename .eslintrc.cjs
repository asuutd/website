module.exports = {
    root: true,
    extends: ['eslint:recommended', "plugin:@typescript-eslint/recommended"],
    settings: {
      next: {
        rootDir: ["apps/*/"],
      },
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {},
    "plugins": ["@typescript-eslint"],
  };