import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// The 3D stage only runs on wide screens with motion allowed and WebGL 2, so these specs use a
// desktop viewport and switch motion back on. WebGL is software-rendered in CI, which is slow,
// so the heavy checks share a page load and get a generous timeout.
test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "the stage is for wide screens");
});

async function waitForStage(page: Page) {
  await page.goto("/");
  // Scrolling towards the section is what starts loading the 3D code; the swap itself waits
  // until the section is off screen again.
  await page.locator("#impact").scrollIntoViewIfNeeded();
  await expect(page.locator("#work canvas")).toBeAttached({ timeout: 45_000 });
}

async function jumpTo(page: Page, id: string) {
  await page.evaluate((target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
  }, id);
}

// Only the panel's own title, not the heading inside its detail sheet.
const activeTitle = (page: Page) =>
  page.locator('#work article[data-active="true"] h3[id$="-title"]');

test("does not load the 3D scene on first paint", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("pins a 3D stage that follows the scroll", async ({ page }) => {
  test.setTimeout(120_000);
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(message.text());
  });

  await waitForStage(page);

  await test.step("the canvas covers the pinned stage", async () => {
    await jumpTo(page, "probudget");
    await expect(activeTitle(page)).toHaveText("ProBudget");
    const box = await page.locator("#work canvas").boundingBox();
    expect(box?.width).toBeGreaterThan(1000);
    expect(box?.height).toBeGreaterThan(600);
  });

  await test.step("the project in front follows the scroll", async () => {
    for (const [id, title] of [
      ["mymichlin", "MyMichlin"],
      ["nutritrack", "NutriTrack"],
      ["probudget", "ProBudget"],
    ] as const) {
      await jumpTo(page, id);
      await expect(activeTitle(page)).toHaveText(title);
    }
  });

  await test.step("detail sheets still open from the stage", async () => {
    await jumpTo(page, "mymichlin");
    await expect(activeTitle(page)).toHaveText("MyMichlin");
    await page
      .locator('#work article[data-active="true"]')
      .getByRole("button", { name: "Details" })
      .click();
    const sheet = page.getByRole("dialog", { name: "MyMichlin" });
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  await test.step("tabbing into a hidden project brings it on stage", async () => {
    await jumpTo(page, "probudget");
    await expect(activeTitle(page)).toHaveText("ProBudget");
    await page
      .locator('#work article[aria-labelledby="nutritrack-title"]')
      .getByRole("link", { name: /Source on GitHub/ })
      .focus();
    await expect(activeTitle(page)).toHaveText("NutriTrack");
  });

  expect(problems).toEqual([]);
});

test("has no accessibility violations on the stage", async ({ page }) => {
  test.setTimeout(120_000);
  await waitForStage(page);
  await jumpTo(page, "probudget");
  await expect(activeTitle(page)).toHaveText("ProBudget");
  // Let the panel cross-fade finish before scanning for contrast.
  await page.waitForTimeout(900);

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(violations).toEqual([]);
});

test("stays on the flat layout without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  await expect(page.locator("#work canvas")).toHaveCount(0);
  await expect(page.locator("article#probudget")).toBeVisible();
});
