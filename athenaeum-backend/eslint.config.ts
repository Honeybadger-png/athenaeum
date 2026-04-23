import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import checkFile from "eslint-plugin-check-file"
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js,'check-file' : checkFile }, 
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ], 
    languageOptions: { 
      ecmaVersion : "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jest
      }
     },
     rules: {
      "check-file/filename-naming-convention" : [
        "error",
        {
          "**/*.{ts,js}" : "KEBAB_CASE",
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/": "KEBAB_CASE",
        },
      ],
      "no-unused-vars" :"warn",
      "@typescript-eslint/no-explicit-any" : "warn"
     }
  },
  tseslint.configs.recommended,
]);
