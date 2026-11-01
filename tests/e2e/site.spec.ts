import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// Things CLAUDE.md says must never be on the page: phone numbers, the city, retail roles and a
// student ID. The patterns are generic on purpose, so this public repo never spells the real
// values out: an Australian mobile or landline, a 61-prefixed number, and any bare 8-digit ID.
const neverOnThePage = [
  /\b0[2-478](?:[\s-]?\d){8}\b/,
  /\+?61[\s-]?\d{9}\b/,
  /\b\d{8}\b/,
  /Melbourne|Vodafone|McDonald/i,
];

test("keeps private details off the page", async ({ page }) => {
  await page.goto("/");
  const html = await page.content();
  for (const pattern of neverOnThePage) expect(html).not.toMatch(pattern);
});

test("says what David is, with the facts that matter", async ({ page }) => {
  await page.goto("/");
  const body = page.locator("body");
  await expect(body).toContainText("Available from December 2026");
  await expect(body).toContainText("3.70");
  await expect(body).toContainText("82.1");
  await expect(body).toContainText("Agencia Change");
  await expect(body).toContainText("Student Ambassador");
});

test("offers the résumé download and the contact links", async ({ page }) => {
  await page.goto("/");
  for (const link of await page.getByRole("link", { name: /résumé/i }).all()) {
    await expect(link).toHaveAttribute("href", "/David_Dai_Resume.pdf");
    await expect(link).toHaveAttribute("download", "");
  }
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:daviddaicareer@gmail.com",
  );
  await expect(page.locator("#contact").getByRole("link", { name: /^LinkedIn/ })).toHaveAttribute(
    "href",
    /linkedin\.com\/in\/david-dai-974ab5313/,
  );
  await expect(page.locator("#contact").getByRole("link", { name: /^GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/ddai0008",
  );
});

test("copies the email address", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "daviddaicareer@gmail.com",
  );
});

test("says so when the browser refuses to copy", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
      configurable: true,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("button", { name: "Couldn’t copy" })).toBeVisible();
});

test("has its own icon rather than the framework default", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('link[rel~="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThanOrEqual(3);
  for (const href of hrefs) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});

test("serves the résumé as a PDF", async ({ request }) => {
  const response = await request.get("/David_Dai_Resume.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("opens external links safely", async ({ page }) => {
  await page.goto("/");
  for (const link of await page.locator('a[target="_blank"]').all()) {
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("in-page links point at sections that exist", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    expect(await page.locator(href).count(), href).toBe(1);
  }
});

async function expectNoSidewaysOverflow(page: Page) {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  // <main> clips decorative overhang (glows, tilted art), so a wide line of text would be cut off
  // rather than scroll. Look for text that runs past the right edge directly.
  const clipped = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const found: string[] = [];
    for (const element of document.querySelectorAll(
      "main :is(h1, h2, h3, h4, p, li, a, button, dt, dd)",
    )) {
      if (element.closest("[aria-hidden='true'], dialog")) continue;
      const box = element.getBoundingClientRect();
      if (box.width > 0 && box.right > width + 1) {
        found.push(`${element.tagName}: ${element.textContent?.trim().slice(0, 40)}`);
      }
    }
    return found;
  });
  expect(clipped).toEqual([]);
}

test("does not scroll sideways or clip text off the edge", async ({ page }) => {
  await expectNoSidewaysOverflow(page);
});

// Skills items never break across lines, so the narrowest phones are where they could overflow.
test("still fits a 320px phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await expectNoSidewaysOverflow(page);
});

test("loads every image", async ({ page }) => {
  await page.goto("/");
  // Images inside the closed detail sheets are not rendered, so they never load; every other
  // image is lazy below the fold, so bring each into view first.
  const images = page.locator("img:not(dialog img)");
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await expect
    .poll(() =>
      images.evaluateAll(
        (nodes) =>
          nodes.filter((node) => {
            const image = node as HTMLImageElement;
            return !image.complete || image.naturalWidth === 0;
          }).length,
      ),
    )
    .toBe(0);
});

test("content is fully visible with reduced motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const dimmed = await page.locator(".reveal").evaluateAll((nodes) =>
    nodes.filter((node) => getComputedStyle(node).opacity !== "1").length,
  );
  expect(dimmed).toBe(0);
  await context.close();
});

test.describe("theme", () => {
  test("toggle switches the theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Dark mode" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    // The saved choice is applied before first paint on the next visit.
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(0, 0, 0)");

    // The browser toolbar colour follows the manual choice, not just the system scheme.
    const toolbar = await page
      .locator('meta[name="theme-color"]')
      .evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content")));
    // The stylesheet is minified, so black may be written #000 or #000000.
    expect(toolbar).toHaveLength(2);
    for (const colour of toolbar) expect(colour).toMatch(/^#0{3}(0{3})?$/);
  });

  test("follows the system until a choice is made", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    await expect(page.getByRole("button", { name: "Dark mode" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("detail sheets", () => {
  test("open from the project, close with Escape and return focus", async ({ page }) => {
    await page.goto("/");
    const opener = page.locator("#mymichlin").getByRole("button", { name: "Details" });
    await opener.click();

    const sheet = page.getByRole("dialog", { name: "MyMichlin" });
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText("95%");

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("close from the button", async ({ page }) => {
    await page.goto("/");
    await page.locator("#nutritrack").getByRole("button", { name: "Details" }).click();
    const sheet = page.getByRole("dialog", { name: "NutriTrack" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("button", { name: /Close/ }).click();
    await expect(sheet).toBeHidden();
  });

  test("the capstone sheet carries the sample-data note", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Capstone details" }).click();
    const sheet = page.getByRole("dialog", { name: "Agencia Change" });
    await expect(sheet).toContainText("sample data only");
  });
});

test.describe("navigation", () => {
  test("section links are in the bar on wide screens", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "the bar collapses to the name and résumé");
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Sections" });
    for (const label of ["Leadership", "Work", "About", "Contact"]) {
      await expect(bar.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("marks the section being read", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "the bar collapses to the name and résumé");
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Sections" });
    const jump = (id: string) =>
      page.evaluate(
        (target) => document.getElementById(target)?.scrollIntoView({ behavior: "instant" }),
        id,
      );

    await jump("about");
    await expect(bar.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await expect(bar.locator("[aria-current]")).toHaveCount(1);

    // Skills is not in the bar, so nothing claims to be current there.
    await jump("skills");
    await expect(bar.locator("[aria-current]")).toHaveCount(0);
  });

  test("skip link jumps to the content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});
