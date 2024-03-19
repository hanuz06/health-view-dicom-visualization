module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "**/*.png", "**/*.jpg", "**/*.gif"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/quotes": ["warn", "double"],
    "@typescript-eslint/no-explicit-any": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    quotes: "off",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ".",
      },
    },
    react: {
      version: "detect",
    },
  },
};
