import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js + TypeScript config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules and ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable Next.js and React warnings
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-sync-scripts": "off",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },
];

export default eslintConfig;
