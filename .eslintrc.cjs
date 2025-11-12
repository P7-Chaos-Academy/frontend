module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "next/core-web-vitals",
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
      rules: {
        "react/react-in-jsx-scope": "off",
      }
    },
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "react/jsx-uses-react": "off",
    "no-import-assign": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "n/no-missing-import": "off",
  },
};
