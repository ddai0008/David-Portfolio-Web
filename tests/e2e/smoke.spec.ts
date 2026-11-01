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

// Both colour schemes are checked, since contrast depends on which tokens apply.
for (const colorScheme of ["light", "dark"] as const) {
  test(`has no accessibility violations (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(violations).toEqual([]);
  });
}
