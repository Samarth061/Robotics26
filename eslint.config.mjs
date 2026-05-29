import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 removed `next lint`; ESLint runs via its own CLI with this flat config.
// eslint-config-next 16 ships native flat-config arrays, so we spread them
// directly (no FlatCompat shim).
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "scripts/**"],
  },
];

export default eslintConfig;
