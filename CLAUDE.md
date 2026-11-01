# David-Portfolio-Web

Notes for the development agent and for people. Keep this short and true: the agent reads it at the start of every run.

Résumé and portfolio site for David Dai, a graduating Monash IT & Business student applying for graduate roles. It replaces the plain-HTML site at daviddai-website.netlify.app. Status: 2D v1 page built (hero, capstone, impact numbers, three projects with detail sheets, education, skills, about, contact); the 3D stage is not started. Decisions, content and asset status live in `.context/` (local only, gitignored): read `.context/decisions.md` first.

## Commands
- Setup: Node 24 via nvm (non-interactive shells need `source ~/.nvm/nvm.sh`), `corepack enable` once for pnpm, then `pnpm install`.
- `pnpm dev` runs the dev server, `pnpm build` writes the static site to `out/`, `pnpm preview` serves `out/`.
- `pnpm lint` and `pnpm typecheck` (runs `next typegen` first).
- Test: `pnpm build && pnpm test:e2e` (Playwright smoke, axe accessibility in light and dark including the `data-theme` override and an open detail sheet, theme toggle, a guard that private details stay off the page; desktop and mobile). It serves `out/`, so build first. Once per machine: `pnpm exec playwright install chromium`.
- `pnpm images` rebuilds the web-ready images in `public/` and `src/content/images.json` from the raw captures in `.context/asset/`. Commit the outputs; the raw files never leave `.context/`.

## Stack
Next.js 16 (App Router) as a static export, React 19, TypeScript, Tailwind 4, Playwright with axe. three and react-three-fiber drive the 3D stage. Motion is not installed (animation is CSS). Hosted on Vercel (not connected yet).
- Next 16 is newer than most training data. Read the matching guide in `node_modules/next/dist/docs/` before writing Next code (see `AGENTS.md`).
- Static export means no Server Actions, cookies, rewrites, redirects, headers, ISR or the default image optimiser. `cacheComponents` is deliberately off.

## Design
- Apple design principles: clarity, deference, depth. Say things with type, layout and motion, not tables or walls of text. One idea per screen.
- System font stack first (`-apple-system` / SF Pro, then Inter). Light and dark both designed, following the system with a manual toggle.
- 3D must carry content: a scroll-driven device stage (laptop, iPhone, Android phone) showing real projects. No decorative 3D.
- The page works before WebGL loads. Lazy-load the 3D scene, honour `prefers-reduced-motion`, and show a still image when WebGL is unavailable.
- Keyboard accessible, WCAG AA contrast.
- Palette is Paper and Cobalt, kept restrained: paper and ink surfaces, blue only for links, focus and selection, primary buttons in ink. Colour must not dominate or make it feel like a template; it comes from the work (each project scene gets a soft glow in its own colour). Use the tokens in `src/app/globals.css`, never hard-coded colours.

## Content
- The résumé PDF is the source of truth, not the old site (the old site's GPA 3.64 / WAM 81 is outdated; current is 3.70 / 82.1).
- Lead with an engineer who ships and leads. Primary action is downloading the résumé PDF.
- Public on the page: email, LinkedIn, GitHub, GPA/WAM, Agencia Change as capstone client, Student Ambassador role. Never on the page: phone number, city, retail roles (PDF only), student ID.
- Check every screenshot before use: some show a student ID, phone numbers, UAT environment labels, junk test text or real names (picks and exclusions are in `.context/decisions.md`). Agencia Change's product owner approved showing the product with mock data only; never show real client data.
- Prefer numbers to adjectives (about 30,000 records, 100% precision on a 100-record audit). Keep dates current: available from December 2026, capstone Aug 2026 to present.

## Conventions
- Branches are `<type>/<slug>` (`feat/`, `fix/`, `chore/`, `docs/`), for example `chore/agent-setup`. Commit subjects are imperative sentences, no prefix.
- Work goes through a PR to `main`; do not push to `main`. The `claude-review` workflow reviews non-draft PRs.
- `claude-ci-triage` only fires when a workflow named exactly `CI` fails. `.github/workflows/ci.yml` is that workflow (lint, typecheck, build, Playwright); keep the name. Pin actions by commit SHA with a version comment, like the existing workflows.
- Layout: `src/app/` holds routes and `globals.css` (colour and font tokens, type scale, CSS device frames, motion), `src/components/` the page sections and UI (`stage/` is the lazy-loaded 3D scene and its procedural devices), `src/content/` site facts (`site.ts`) and the generated image manifest, `scripts/` the image script, `tests/e2e/` the Playwright specs, `public/` static files. Record new top-level folders here.
- The 3D stage (`WorkShowcase` + `stage/`) is an enhancement: it loads only on screens at least 768px wide with WebGL 2, motion allowed and no data saver, and swaps in while the section is off screen. Everything else keeps the flat layout, which must always tell the whole story. Playwright runs with reduced motion by default (flat layout); `stage.spec.ts` turns motion on.
- Motion is CSS first: entrances use scroll-driven `animation-timeline: view()` and only run when `prefers-reduced-motion` allows. Do not put an animation on an element whose opacity or transform another rule also sets (the animation wins).

## Do not change
- `.github/`, `.claude/` and this file are CODEOWNERS-protected (David reviews). Edit only when asked.
- `.context/` is local memory and never committed. The old site under `.context/previous-portfolio/` is reference only.
- The résumé PDF content. The PDF is not in the repo: the repo is public and the PDF prints the phone number and city, so David decides whether to commit it as `public/David_Dai_Resume.pdf` (the page already links there). Generated output (`.next/`, `out/`) and `pnpm-lock.yaml` edits by hand.
