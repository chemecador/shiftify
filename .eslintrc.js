// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "import/no-unresolved": "off", // Opcional: desactiva la regla si persiste el error
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
  },
};
