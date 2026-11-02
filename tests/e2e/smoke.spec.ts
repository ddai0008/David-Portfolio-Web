import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page renders without console errors", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(message.text());
  });

  await page.goto("/");

  await expect(page).toHaveTitle(/David Dai/);
  await expect(page.getByRole("heading", { level: 1, name: "David Dai" })).toBeVisible();
  expect(problems).toEqual([]);
});

// Contrast depends on which token set applies, so check the system schemes and the manual
// data-theme override (which wins over the system) in both directions. Motion is off so that
// scroll-driven entrances cannot leave text half transparent while it is scanned.
const themes = [
  { name: "light", colorScheme: "light", dataTheme: undefined },
  { name: "dark", colorScheme: "dark", dataTheme: undefined },
  { name: "light override on a dark system", colorScheme: "dark", dataTheme: "light" },
  { name: "dark override on a light system", colorScheme: "light", dataTheme: "dark" },
] as const;

test.describe("accessibility", () => {
  test.use({ reducedMotion: "reduce" });

  for (const { name, colorScheme, dataTheme } of themes) {
    test(`has no violations (${name})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/");
      if (dataTheme) {
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme;
        }, dataTheme);
      }

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      expect(violations).toEqual([]);
    });
  }

  test("has no violations with a detail sheet open", async ({ page }) => {
    await page.goto("/");
    await page.locator("#probudget").getByRole("button", { name: "Details" }).click();
    await expect(page.getByRole("dialog", { name: "ProBudget" })).toBeVisible();

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(violations).toEqual([]);
  });

  test("has no violations with the phone menu open", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "the menu is for phones");
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation", { name: "Site menu" })).toBeVisible();

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(violations).toEqual([]);
  });
});
