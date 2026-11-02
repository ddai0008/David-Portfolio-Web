# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Graduate-program recruiters and hiring managers screening applicants for graduate roles in software engineering, with solution delivery and business analysis as secondary fits. They skim for about ten seconds first (role, degree, work rights, availability, one or two proof points), then read deeper if it holds up. They arrive from an application, a résumé or a LinkedIn profile, on a laptop or a phone.

A second, smaller audience is engineers and hiring managers who read the projects in depth.

## Product Purpose
A résumé and portfolio site for David Dai, a Monash IT and Business student graduating in 2026 and available from December 2026. It replaces a plain-HTML site. Success is a recruiter reaching the résumé PDF (the primary action) or his email within a minute, convinced he is a graduate who ships real work and leads people.

## Positioning
An engineer who ships and leads. The claim a neighbouring graduate could not truthfully copy: he is the Team Lead and the client's only point of contact on a six-person industry capstone (two developers, two cyber security, two business analysts) while also building it, and he has a business-analyst internship with measured results behind it.

## Operating Context
A single scrolling page, a static export hosted on Vercel, linked from the résumé PDF and applications. The résumé PDF is the source of truth for every fact; the page never contradicts it. A scroll-driven 3D device stage shows the projects on wide screens; everyone else gets a flat layout that tells the whole story. Work goes through pull requests into a `development` branch, and David promotes it to `main`.

## Capabilities and Constraints
- Static export: no server code, cookies, redirects or headers. The page works before WebGL loads, and the 3D stage is an enhancement only.
- Public on the page: email, LinkedIn, GitHub, GPA and WAM, Agencia Change as the capstone client, the Student Ambassador role.
- Never on the page: phone number, city, retail roles, student ID. (The résumé PDF may carry some of these; David is fine with that.)
- Prefer numbers to adjectives. Dates and results stay current: GPA and WAM are updated after final results, availability from December 2026, capstone August 2026 to present.
- Claims must be ones he can back up: ProBudget is "live" with a public demo account, not a product with real users; the matching audit is stated as 100 of 100 sampled matches correct.
- Undecided: whether to offer a second, role-specific résumé; whether NutriTrack should show on an iPhone shape rather than an Android one; analytics; a looping capture of two people co-editing a form; a retaken portrait; a social-share image; the cut-over from the old Netlify site.

## Brand Commitments
Binding, confirmed by David. Critique and polish refine inside these and do not redesign.
- **Palette: Paper and Cobalt, kept restrained.** Paper and ink surfaces. Blue only for links, focus and selection. Primary buttons are ink. Colour comes from the work: each project shows a soft glow in its own colour and the page tints stay light (under about 8% on paper). Colour must not dominate or make the site feel like a template. Light and dark are both designed, following the system with a manual toggle.
- **Type: system font stack first** (`-apple-system` / SF Pro), then Inter. Apple design principles: clarity, deference, depth. Say things with type, layout and motion rather than tables or walls of text; one idea per screen.
- **3D carries content.** A scroll-driven stage of real devices (laptop, iPhone, Android phone) showing real projects. No decorative 3D. Reduced motion, small screens, data saver and missing WebGL all get the flat layout.
- **Voice:** outcome-first, first person, short. The wordmark is typographic: "David Dai".
- **Client data:** Agencia Change's product owner approved showing the product with mock data only. Never show real client data.

## Evidence on Hand
- The résumé PDF at `public/David_Dai_Resume.pdf`.
- Mock-data screenshots of the capstone product, and screens for ProBudget (live at pro-budget.vercel.app, with a public demo account on its sign-in page), MyMichlin (a Figma design prototype) and NutriTrack.
- Source repositories for MyMichlin and NutriTrack are public; ProBudget's is private.
- Measured results from the St Vincent de Paul internship: about 30,000 donor records de-duplicated with a reusable Power Query pipeline, 100 of 100 sampled matches correct, 1 to 2 hours of manual reporting retired per round.
- Absent, and not to be invented: testimonials, real user counts for ProBudget, real client data, a custom domain.

## Product Principles
1. **The first ten seconds decide.** Role, degree, work rights and availability sit on the first screen; the résumé download is always one click away.
2. **Proof over adjectives.** Every claim is a number, a screen or a link.
3. **Everything works flat.** The 3D stage and the motion are enhancements; the page tells the whole story without them.
4. **Credibility is the aesthetic.** Craft shows in precision and restraint, and in details that reward a closer look.
5. **Only what he can stand behind.** No claim, figure or screen that overstates.

## Accessibility & Inclusion
WCAG AA contrast, keyboard access, visible focus, and `prefers-reduced-motion` honoured throughout. The page is checked with axe in light and dark, including the manual theme override and an open detail sheet. Links that open a new tab say so to assistive technology.
