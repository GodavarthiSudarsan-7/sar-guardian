import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Was "off", which is how the dead imports accumulated. Underscore-prefixed
      // names stay exempt so intentionally-unused bindings can be marked as such.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Build/tooling config files execute in Node, not the browser.
  {
    files: ["*.config.{ts,js}"],
    languageOptions: { globals: globals.node },
  },

  // Tests get both environments plus Vitest globals.
  {
    files: ["**/*.{test,spec}.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
);
