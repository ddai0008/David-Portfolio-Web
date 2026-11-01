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

## Images and the résumé

Project and About images are prepared from raw captures that are not in the repo. `pnpm images` (needs the captures in `.context/asset/`) rebuilds the WebP files in `public/` and the size manifest in `src/content/images.json`; commit the results.

The "Download résumé" buttons link to `/David_Dai_Resume.pdf`. That file is deliberately not committed yet: this repository is public and the PDF prints a phone number and city. Add it as `public/David_Dai_Resume.pdf` once that is decided.
