// Renders the 1200x630 share card, src/app/opengraph-image.png, that link previews show on LinkedIn,
// Slack, iMessage and the like. Next finds the file by its name and adds the og:image tags.
//
// The card is composed from the built site rather than drawn separately, so it uses the real
// type, tokens, colour pools, dot grid, laptop frame and ProBudget screenshot, and the name and
// tagline are read from the hero: change the hero and re-run this, and the card follows. It is laid
// out on its own page with the site's stylesheets and no script, so React never touches it.
//
//   pnpm build && pnpm og
//
// The output is committed, so CI and Vercel never run this.
import { createServer } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "out");
const target = path.join(root, "src", "app", "opengraph-image.png");
const alt = path.join(root, "src", "app", "opengraph-image.alt.txt");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// A tiny static server for out/. The export uses absolute /_next/ paths, so it cannot be opened
// from file://.
let cardHtml = "";
const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, "http://x").pathname);
    if (pathname === "/__card") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(cardHtml);
      return;
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.join(site, pathname);
    if (!file.startsWith(site)) throw new Error("outside out/");
    await stat(file);
    response.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((done) => server.listen(0, done));
const base = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "load" });

  // Read what the card needs from the hero, as strings, so nothing here edits the React-managed page.
  const hero = await page.evaluate(() => {
    const root = document.querySelector("#top");
    const outer = (selector) => {
      const node = root.querySelector(selector);
      if (!node) throw new Error(`The hero no longer has ${selector}; update scripts/og-card.mjs.`);
      return node.outerHTML;
    };
    return {
      htmlClass: document.documentElement.className,
      sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.getAttribute("href")),
      // The Inter file next/font preloads. The site loads it with font-display: optional, which uses
      // the fallback for good if the file is not ready at first paint, so the card declares it again
      // with display: block and the card can never be set in the fallback.
      interFile: document.querySelector('link[rel="preload"][as="font"]')?.getAttribute("href"),
      eyebrow: outer(".eyebrow"),
      name: outer("h1"),
      tagline: outer("h1 + p"),
      laptop: root.querySelector(".laptop-frame").parentElement.outerHTML,
      nameText: root.querySelector("h1").textContent.replace(/\s+/g, " ").trim(),
      taglineText: root.querySelector("h1 + p").textContent.replace(/\s+/g, " ").trim(),
    };
  });

  // The same classes the page uses: .dots is the dot grid, .aurora the colour pools. The card sets
  // its own pool strength, a little over the page's, because a preview is seen very small.
  const pools = [
    ["agencia", "68%", "18%", "52%"],
    ["probudget", "60%", "58%", "50%"],
    ["mymichlin", "96%", "62%", "42%"],
    ["nutritrack", "30%", "100%", "40%"],
  ]
    .map(([hue, x, y, size]) => `<span style="--hue:var(--hue-${hue});--x:${x};--y:${y};--size:${size}"></span>`)
    .join("");
  if (!hero.interFile) throw new Error("The page no longer preloads its Inter file; update scripts/og-card.mjs.");
  const styled = (html, style) => html.replace(/^<(\w+)/, `<$1 style="${style}"`);
  cardHtml = `<!doctype html>
<html lang="en" data-theme="light" class="${hero.htmlClass}">
<head>
<meta charset="utf-8">
${hero.sheets.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n")}
<style>@font-face{font-family:"CardInter";src:url(${hero.interFile}) format("woff2");font-weight:100 900;font-display:block}</style>
</head>
<body style="margin:0">
<div class="dots" style="position:relative;isolation:isolate;overflow:hidden;width:1200px;height:630px;background:var(--paper);color:var(--ink);font-family:CardInter,sans-serif;--aurora-strength:11%;--dots-at:78% 56%;--dots-w:62%;--dots-h:80%;--dots-in:1;--dots-out:0.25">
  <div class="aurora" aria-hidden="true">${pools}</div>
  <div style="position:absolute;left:72px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center">
    ${styled(hero.eyebrow, "display:flex;align-items:center;gap:12px;font-size:17px")}
    ${styled(hero.name, "margin-top:30px;font-size:118px;line-height:.95")}
    ${styled(hero.tagline, "margin-top:30px;font-size:40px;line-height:1.14;max-width:520px")}
  </div>
  <div style="position:absolute;right:-34px;bottom:70px;width:560px">${hero.laptop}</div>
</div>
</body>
</html>`;

  await page.goto(`${base}__card`, { waitUntil: "load" });
  await page.evaluate(async () => {
    const faces = await Promise.all([document.fonts.load('700 40px CardInter'), document.fonts.load('600 40px CardInter')]);
    if (faces.some((loaded) => loaded.length === 0)) throw new Error("Inter did not load, so the card would be set in a fallback font.");
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
  });
  const words = { name: hero.nameText, tagline: hero.taglineText };

  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
  // sharp drops metadata, and a high compression level keeps the gradients under a few hundred KB.
  const out = await sharp(png).png({ compressionLevel: 9, effort: 10 }).toBuffer();
  await writeFile(target, out);
  await writeFile(
    alt,
    `${words.name}, ${words.tagline.replace(/\s*—\s*/g, " ").replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase())}, beside a laptop showing the ProBudget app.`,
  );
  console.log(`wrote ${path.relative(root, target)} (${Math.round(out.length / 1024)} KB) for "${words.name}"`);
} finally {
  await browser.close();
  server.close();
}
