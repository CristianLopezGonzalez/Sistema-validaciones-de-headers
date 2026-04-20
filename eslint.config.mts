import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore compiled and generated files
  {
    ignores: ["dist/**", "generated/**", "node_modules/**"],
  },

  // JS base rules
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Config para backend Node
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }
]);