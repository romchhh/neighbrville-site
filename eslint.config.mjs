import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Next.js 16 flat config (no FlatCompat).
 * `react-hooks/set-state-in-effect` is intentionally off — it flags valid
 * mount/fetch and URL-sync patterns used across the site.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "data/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
