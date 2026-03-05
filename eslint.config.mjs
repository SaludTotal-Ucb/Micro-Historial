import pluginJs from "@eslint/js";
import skipFormatting from "eslint-config-prettier";

export default [
  {
    // Esto detendrá los errores de "node_modules"
    ignores: ["**/node_modules/**", "dist/**", "build/**"]
  },
  pluginJs.configs.recommended,
  skipFormatting,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];