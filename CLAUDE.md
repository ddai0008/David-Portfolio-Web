# David-Portfolio-Web

Notes for the development agent and for people. Keep this short and true: the agent reads it at the start of every run.

Résumé and portfolio site for David Dai, a graduating Monash IT & Business student applying for graduate roles. It replaces the plain-HTML site at daviddai-website.netlify.app. Status: built and live at https://david-portfolio-web.vercel.app (hero, capstone, impact numbers, three projects with detail sheets and a scroll-driven 3D device stage, education, skills, about, contact, a share card and a 404 page). What is left is mostly content and assets. `PRODUCT.md` (public) is the design brief with the binding brand commitments; decisions, content and asset status live in `.context/` (local only, gitignored): read `.context/decisions.md` first.

## Commands
- Setup: Node 24 via nvm (non-interactive shells need `source ~/.nvm/nvm.sh`), `corepack enable` once for pnpm, then `pnpm install`.
- `pnpm dev` runs the dev server, `pnpm build` writes the static site to `out/`, `pnpm preview` serves `out/`.
- `pnpm lint` and `pnpm typecheck` (runs `next typegen` first).
- Test: `pnpm build && pnpm test:e2e` (Playwright smoke, axe accessibility in light and dark including the `data-theme` override, an open detail sheet and the 404 page, theme toggle, tap areas, dot-grid text contrast, share tags and card size, a guard that private details stay off the page; desktop and mobile). It serves `out/`, so build first. Once per machine: `pnpm exec playwright install chromium`.
- `pnpm test:webkit` (Safari's engine, desktop and an iPhone) and `pnpm test:firefox` run the same specs on the other engines; not part of CI. Once per machine: `pnpm exec playwright install webkit firefox`, plus `sudo pnpm exec playwright install-deps webkit` on Linux. Firefox has no scroll-driven animation or `text-wrap: pretty`, so those two checks skip there.
- `pnpm og` redraws the share card `src/app/opengraph-image.png` (1200x630) from the built site, so run `pnpm build` first. Commit the output and do not edit it by hand.
- `pnpm images` rebuilds the web-ready images in `public/` and `src/content/images.json` from the raw captures in `.context/asset/`. Commit the outputs; the raw files never leave `.context/`.

## Stack
Next.js 16 (App Router) as a static export, React 19, TypeScript, Tailwind 4, Playwright with axe. three and react-three-fiber drive the 3D stage. Motion is not installed (animation is CSS). Hosted on Vercel: `main` deploys to production and every PR gets a preview. The site's address is `siteUrl` in `src/content/site.ts` (used for the share tags); change it there if a custom domain is added.
- Next 16 is newer than most training data. Read the matching guide in `node_modules/next/dist/docs/` before writing Next code (see `AGENTS.md`).
- Static export means no Server Actions, cookies, rewrites, redirects, headers, ISR or the default image optimiser. `cacheComponents` is deliberately off.

## Design
- Apple design principles: clarity, deference, depth. Say things with type, layout and motion, not tables or walls of text. One idea per screen.
- System font stack first (`-apple-system` / SF Pro, then Inter). Light and dark both designed, following the system with a manual toggle.
- 3D must carry content: a scroll-driven device stage (laptop, iPhone, Android phone) showing real projects. No decorative 3D.
- The page works before WebGL loads. Lazy-load the 3D scene, honour `prefers-reduced-motion`, and show a still image when WebGL is unavailable.
- Keyboard accessible, WCAG AA contrast.
- Palette is Paper and Cobalt, kept restrained: paper and ink surfaces, blue only for links, focus and selection, primary buttons in ink. Colour must not dominate or make it feel like a template; it comes from the work (each project scene gets a soft glow in its own colour, under 8% on paper: David tried 12% and set it back). Use the tokens in `src/app/globals.css`, never hard-coded colours.
- Texture is a faint CSS dot grid (`.dots`) behind five sections, hidden in high-contrast modes; a test measures text contrast over it. Profile links are icons (`ProfileLink`) with visually hidden names. Small text links get a 44px invisible tap area on touch screens (`hit`).
- Do not copy React Bits Pro code into this repo: its licence bars open-source repositories, and this one is public.

## Content
- The résumé PDF is the source of truth, not the old site (the old site's GPA 3.64 / WAM 81 is outdated; current is 3.70 / 82.1).
- Lead with an engineer who ships and leads. Primary action is downloading the résumé PDF.
- Public on the page: email, LinkedIn, GitHub, GPA/WAM, Agencia Change as capstone client, Student Ambassador role. Never on the page: phone number, city, retail roles, student ID. The PDF may carry the phone number, city and retail roles; David is fine with that.
- Check every screenshot before use: some show a student ID, phone numbers, UAT environment labels, junk test text or real names (picks and exclusions are in `.context/decisions.md`). Agencia Change's product owner approved showing the product with mock data only; never show real client data.
- Prefer numbers to adjectives (about 30,000 records, 100% precision on a 100-record audit). Keep dates current: available from December 2026, capstone Aug 2026 to present.

## Conventions
- Branches are `<type>/<slug>` (`feat/`, `fix/`, `chore/`, `docs/`), for example `chore/agent-setup`. Commit subjects are imperative sentences, no prefix.
- Work goes through a PR to `development`, the integration branch. David opens the `development` to `main` PR himself and that is what ships. Never push to `main` or `development`. The `claude-review` workflow reviews non-draft PRs.
- `claude-ci-triage` only fires when a workflow named exactly `CI` fails. `.github/workflows/ci.yml` is that workflow (lint, typecheck, build, Playwright); keep the name. Pin actions by commit SHA with a version comment, like the existing workflows.
- Layout: `src/app/` holds routes and `globals.css` (colour and font tokens, type scale, CSS device frames, motion), `src/components/` the page sections and UI (`stage/` is the lazy-loaded 3D scene and its procedural devices), `src/content/` site facts (`site.ts`) and the generated image manifest, `scripts/` the image and share-card scripts, `tests/e2e/` the Playwright specs, `public/` static files, `.impeccable/critique/ignore.md` design choices to leave alone (committed; the rest of `.impeccable/` and the `.claude/skills/impeccable/` pack are local). Record new top-level folders here.
- The 3D stage (`WorkShowcase` + `stage/`) is an enhancement: it loads only on screens at least 768px wide with WebGL 2, motion allowed and no data saver, and swaps in while the section is off screen. Everything else keeps the flat layout, which must always tell the whole story. Playwright runs with reduced motion by default (flat layout); `stage.spec.ts` turns motion on.
- Motion is CSS first: entrances use scroll-driven `animation-timeline: view()` and only run when `prefers-reduced-motion` allows. Do not put an animation on an element whose opacity or transform another rule also sets (the animation wins). Under reduced motion transitions are switched off outright (`transition-property: none`), not shortened: a 0.01ms transition left WebKit with stale inherited text colours after a theme change.

## Do not change
- `.github/`, `.claude/` and this file are CODEOWNERS-protected (David reviews). Edit only when asked.
- `.context/` is local memory and never committed. The old site under `.context/previous-portfolio/` is reference only.
- The binding brand commitments in `PRODUCT.md` (change them only when David says so) and `src/app/opengraph-image.png` by hand (run `pnpm og`).
- The résumé PDF content (`public/David_Dai_Resume.pdf`, the file the download buttons serve). Generated output (`.next/`, `out/`) and `pnpm-lock.yaml` edits by hand.
