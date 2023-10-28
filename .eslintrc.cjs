module.exports = {
    root: true,
    extends: ['eslint:recommended', "plugin:@typescript-eslint/recommended"],
    settings: {
      next: {
        rootDir: ["apps/*/"],
      },
      "import/resolver": {
        "typescript": {
          "project": [
            "apps/website/tsconfig.json",
            "apps/events/tsconfig.json",
          ],
        }
      }
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {},
    "plugins": ["@typescript-eslint"],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    }
  };