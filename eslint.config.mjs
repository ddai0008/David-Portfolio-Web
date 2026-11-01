import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local-only notes and the old site; never part of the app.
    ".context/**",
  ]),
  {
    // three.js objects (meshes, materials) are mutated imperatively inside useFrame, on every
    // frame and outside React's render, which is how react-three-fiber is meant to be used. The
    // compiler-derived rules below cannot tell that apart from mutating state during render.
    files: ["src/components/stage/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
