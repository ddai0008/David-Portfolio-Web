import { readFile, stat } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { person, siteUrl } from "../../src/content/site";

// What a link preview shows. The tags come from metadata in layout.tsx and the image from
// src/app/opengraph-image.png (rendered by `pnpm og`).
test.describe("share card", () => {
  test("has the tags a link preview reads, with absolute addresses", async ({ page }) => {
    await page.goto("/");
    const meta = (selector: string) => page.locator(selector).getAttribute("content");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteUrl);
    expect(await meta('meta[property="og:title"]')).toMatch(/David Dai/);
    expect(await meta('meta[property="og:description"]')).toMatch(/software engineer/i);
    expect(await meta('meta[property="og:url"]')).toBe(siteUrl);
    expect(await meta('meta[property="og:type"]')).toBe("website");
    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");

    const image = await meta('meta[property="og:image"]');
    expect(image, "og:image").toMatch(new RegExp(`^${siteUrl}/opengraph-image\\.png`));
    expect(await meta('meta[property="og:image:width"]')).toBe("1200");
    expect(await meta('meta[property="og:image:height"]')).toBe("630");
    expect(await meta('meta[name="twitter:image"]')).toBe(image);
    // The picture is described for anyone who cannot see it, and the description is one line.
    const alt = await meta('meta[property="og:image:alt"]');
    expect(alt).toMatch(/David Dai/);
    expect(alt).not.toMatch(/\n/);
  });

  test("serves the image the tags point at", async ({ page, request }) => {
    await page.goto("/");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    // The tag holds the production address; the same path is served here.
    const url = new URL(image!);
    const response = await request.get(url.pathname + url.search);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("is 1200 by 630 and light enough for a chat app to fetch", async () => {
    const file = "src/app/opengraph-image.png";
    const bytes = await readFile(file);
    // A PNG stores its width and height in the header, at byte 16 and 20.
    expect(bytes.subarray(1, 4).toString()).toBe("PNG");
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
    expect((await stat(file)).size).toBeLessThan(400 * 1024);
  });
});

test.describe("404 page", () => {
  test("answers 404 for an unknown address and leads back", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.getByRole("heading", { level: 1, name: /isn’t here/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to the portfolio" })).toHaveAttribute("href", "/");
    await expect(page.getByRole("link", { name: "Download résumé" })).toHaveAttribute(
      "href",
      person.resume,
    );
    // A page that is not there should not be indexed.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    // The skip link at the top of every page needs something to land on.
    await expect(page.locator("#main")).toHaveCount(1);
  });

  test("the way back works", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.getByRole("link", { name: "Back to the portfolio" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "David Dai" })).toBeVisible();
  });
});

// LinkedIn and GitHub are marks, not words. Each is still a link with a name for a screen reader.
test.describe("profile icons", () => {
  const places = [
    ["the first screen", "#top"],
    ["the contact section", "#contact"],
    ["the footer", "footer"],
  ] as const;

  for (const [where, area] of places) {
    test(`are icons, with names, in ${where}`, async ({ page }) => {
      await page.goto("/");
      for (const [name, href] of [
        ["LinkedIn", person.linkedin],
        ["GitHub", person.github],
      ] as const) {
        const link = page.locator(area).getByRole("link", { name: new RegExp(`^${name}`) });
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAccessibleName(`${name} (opens in a new tab)`);
        await expect(link.locator("svg")).toHaveCount(1);
        // Only the mark shows: the link is no wider than a button, so no word sits beside it.
        const box = await link.boundingBox();
        expect(box!.width, `${name} in ${where}`).toBeLessThanOrEqual(48);
      }
    });
  }

  test("are 44px round buttons in the contact section", async ({ page }) => {
    await page.goto("/");
    for (const name of ["LinkedIn", "GitHub"]) {
      const box = await page
        .locator("#contact")
        .getByRole("link", { name: new RegExp(`^${name}`) })
        .boundingBox();
      expect(Math.round(box!.width), name).toBe(44);
      expect(Math.round(box!.height), name).toBe(44);
    }
  });
});

// What a file preview, a browser tab and a recruiter's file manager read from the résumé PDF. They come
// from the document's properties (the Info dictionary and the XMP packet), not from the pages, and
// LibreOffice resets them to its defaults on every export. A PDF cannot carry a share image: that needs a
// web page with og: tags, which is what the site's own card is.
//
// The properties were written as an incremental update, so the file still holds the old title earlier on.
// A reader takes the last revision, and so do these helpers.
function literal(buffer: Buffer, open: number) {
  // A PDF string is "(...)" with backslash escapes and balanced inner brackets.
  const bytes: number[] = [];
  let depth = 1;
  for (let i = open + 1; i < buffer.length; i++) {
    const byte = buffer[i];
    if (byte === 0x5c) {
      const next = buffer[++i];
      const octal = String.fromCharCode(next).match(/[0-7]/);
      if (octal) {
        let digits = String.fromCharCode(next);
        while (digits.length < 3 && /[0-7]/.test(String.fromCharCode(buffer[i + 1]))) digits += String.fromCharCode(buffer[++i]);
        bytes.push(parseInt(digits, 8) & 0xff);
      } else if (next === 0x6e) bytes.push(10);
      else if (next === 0x72) bytes.push(13);
      else if (next === 0x74) bytes.push(9);
      else if (next !== 0x0a && next !== 0x0d) bytes.push(next);
      continue;
    }
    if (byte === 0x28) depth++;
    if (byte === 0x29 && --depth === 0) break;
    bytes.push(byte);
  }
  const raw = Buffer.from(bytes);
  // UTF-16 with a byte-order mark, or PDFDocEncoding: Latin-1 with a few marks in 0x80 to 0x90.
  if (raw[0] === 0xfe && raw[1] === 0xff) {
    return Buffer.from(raw.subarray(2)).swap16().toString("utf16le");
  }
  const marks: Record<number, string> = { 0x80: "•", 0x83: "…", 0x84: "—", 0x85: "–", 0x8d: "“", 0x8e: "”", 0x8f: "‘", 0x90: "’" };
  return [...raw].map((byte) => marks[byte] ?? String.fromCharCode(byte)).join("");
}

async function readPdfProperties() {
  const buffer = await readFile("public/David_Dai_Resume.pdf");
  const text = buffer.toString("latin1"); // one character per byte, so a text index is a buffer index
  const infoNumber = [...text.matchAll(/\/Info\s+(\d+)\s+0\s+R/g)].at(-1)?.[1];
  expect(infoNumber, "the PDF names an Info dictionary").toBeTruthy();
  const start = text.lastIndexOf(`${infoNumber} 0 obj`);
  const info = text.slice(start, text.indexOf("endobj", start));
  const field = (key: string) => {
    const at = info.search(new RegExp(`/${key}\\s*\\(`));
    if (at < 0) return undefined;
    return literal(buffer, start + info.indexOf("(", at));
  };
  // The XMP packet is UTF-8, so it is decoded from its bytes, not from the one-character-per-byte text.
  const packet = [...text.matchAll(/<\?xpacket begin[\s\S]*?<\?xpacket end[^>]*\?>/g)].at(-1);
  const xmp = packet ? buffer.subarray(packet.index, packet.index! + packet[0].length).toString("utf8") : "";
  const unescape = (value: string) =>
    value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const alt = (tag: string) =>
    unescape(xmp.match(new RegExp(`<dc:${tag}>[\\s\\S]*?<rdf:li[^>]*>([\\s\\S]*?)</rdf:li>`))?.[1] ?? "");
  const lang = [...text.matchAll(/\/Lang\s*\(/g)].at(-1);
  return {
    info: { title: field("Title"), author: field("Author"), subject: field("Subject"), keywords: field("Keywords") },
    xmp: {
      title: alt("title"),
      description: alt("description"),
      keywords: unescape(xmp.match(/<pdf:Keywords>([\s\S]*?)<\/pdf:Keywords>/)?.[1] ?? ""),
      subjects: [...(xmp.match(/<dc:subject>[\s\S]*?<\/dc:subject>/)?.[0].matchAll(/<rdf:li>([\s\S]*?)<\/rdf:li>/g) ?? [])].map(
        (match) => unescape(match[1]),
      ),
    },
    language: lang ? literal(buffer, lang.index! + lang[0].length - 1) : undefined,
  };
}

test.describe("résumé PDF properties", () => {
  test("has a title that names him and the document, with the accent, short enough not to be cut", async () => {
    const { info, xmp } = await readPdfProperties();
    for (const title of [info.title, xmp.title]) {
      expect(title).toMatch(/^David Dai — /);
      // "Resume" without its accents was what the export said before.
      expect(title).toMatch(/Résumé/);
      expect(title!.length).toBeLessThanOrEqual(70);
    }
    expect(info.author).toBe("David Dai");
  });

  test("has a description that reads as a sentence, not as the page's header line", async () => {
    const { info, xmp } = await readPdfProperties();
    for (const description of [info.subject!, xmp.description]) {
      // A link preview shows about this much: enough to say something, not so much it is cut mid-word.
      expect(description.length).toBeGreaterThanOrEqual(80);
      expect(description.length).toBeLessThanOrEqual(180);
      // The export had "Graduate  —  Software Engineering | Data & Analytics | Solution Delivery".
      expect(description).not.toMatch(/ {2}/);
      expect(description).not.toMatch(/\|/);
      expect(description).toMatch(/\.$/);
      // Dates stay current: when the start date moves, this fails until the description follows.
      expect(description).toMatch(/available from December 2026/i);
      expect(description).toMatch(/Monash/);
    }
  });

  test("says the same thing in the Info dictionary and in the XMP packet", async () => {
    const { info, xmp } = await readPdfProperties();
    expect(info.title).toBe(xmp.title);
    expect(info.subject).toBe(xmp.description);
    expect(info.keywords).toBe(xmp.keywords);
  });

  test("lists keywords, and is marked as Australian English", async () => {
    const { info, xmp, language } = await readPdfProperties();
    const keywords = info.keywords!.split(", ");
    expect(keywords.length).toBeGreaterThanOrEqual(5);
    expect(xmp.subjects).toEqual(keywords);
    expect(language).toBe("en-AU");
  });

  test("keeps the phone number, the city and the retail roles out of every property", async () => {
    const { info, xmp } = await readPdfProperties();
    // The PDF's pages may carry some of these, which David is fine with; its properties, which a preview
    // and a search index copy around, do not. Generic patterns, so this public file never spells them out.
    const everything = [...Object.values(info), ...Object.values(xmp).flat()].join("\n");
    for (const pattern of [/\b0[2-478](?:[\s-]?\d){8}\b/, /\+?61[\s-]?\d{9}\b/, /\b\d{8}\b/, /Melbourne|Vodafone|McDonald/i]) {
      expect(everything).not.toMatch(pattern);
    }
  });
});
