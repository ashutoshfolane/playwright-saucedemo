// eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.playwright/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  {
    files: ["**/*.{spec,test}.{ts,tsx,js,jsx}", "**/tests/**/*.{ts,tsx,js,jsx}"],
    plugins: { playwright },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Our assertions live in helpers, not inline expect()
      "playwright/expect-expect": [
        "warn",
        {
          assertFunctionNames: [
            "expectOnInventory",
            "expectLoginErrorContains",
            "expectCartBadge",
            "expectCheckoutComplete",
          ],
        },
      ],
    },
  },

  prettier,
];
