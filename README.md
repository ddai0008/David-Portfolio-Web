# David-Portfolio-Web

David Dai's résumé and portfolio site: Next.js (static export), TypeScript and Tailwind. Work in progress; it replaces the plain-HTML site at daviddai-website.netlify.app.

## Run it

Needs Node 24 (`nvm use`) and pnpm (`corepack enable` once).

```sh
pnpm install
pnpm dev                                 # http://localhost:3000
pnpm build                               # static site in out/
pnpm lint && pnpm typecheck
pnpm exec playwright install chromium    # once per machine
pnpm test:e2e                            # build first; it serves out/
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, build and the Playwright checks on every pull request.
