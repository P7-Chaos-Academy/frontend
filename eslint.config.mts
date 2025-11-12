import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { react: pluginReact, js },
    extends: ["js/recommended","react/recommended", "plugin:react/jsx-runtime"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-import-assign": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "n/no-missing-import": "off",
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
]);
