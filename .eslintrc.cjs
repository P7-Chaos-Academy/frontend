module.exports = {
  root: true,
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "no-import-assign": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "next/core-web-vitals"
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: { project: "./tsconfig.json", ecmaFeatures: { jsx: true } },
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
        "no-import-assign": "off",
        "@typescript-eslint/no-unused-vars": "off",
      }
    }
  ]
};
