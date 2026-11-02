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
