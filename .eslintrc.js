module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "expo",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "import/no-unresolved": "off",
    "comma-dangle": ["error", "always-multiline"],
    "react/react-in-jsx-scope": "off",
    "no-undef": "off",
  },
  ignorePatterns: ["/dist/*"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
      alias: {
        map: [["@env", "./.env"]],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
    react: {
      version: "detect",
    },
  },
  "prettier/prettier": [
    "error",
    {
      endOfLine: "auto",
    },
  ],
};
