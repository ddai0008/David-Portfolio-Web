import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

// The same specs on the other browser engines: `pnpm test:webkit` (Safari's engine, desktop and an
// iPhone) and `pnpm test:firefox`. Not part of CI. The project names stay `desktop` and `mobile`
// because the specs branch on them. Once per machine: `pnpm exec playwright install webkit firefox`,
// and on Linux `sudo pnpm exec playwright install-deps webkit` for WebKit's system libraries.
const engines = {
  webkit: [
    { name: "desktop", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["iPhone 15"] } },
  ],
  firefox: [{ name: "desktop", use: { ...devices["Desktop Firefox"] } }],
} as const;

const engine = process.env.ENGINE === "firefox" ? "firefox" : "webkit";

export default defineConfig({
  ...base,
  projects: [...engines[engine]],
});
