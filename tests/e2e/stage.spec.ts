import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import sharp from "sharp";
import { NAV_OFFSET } from "../../src/components/stage/progress";

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

// Clicking a link scrolls smoothly, so the active project flips well before the page stops. Wait
// until the anchor sits under the bar (NAV_OFFSET, which matches scroll-padding-top) before
// measuring anything else.
async function landedOn(page: Page, id: string) {
  await expect
    .poll(() =>
      page.evaluate(
        (target) => Math.round(document.getElementById(target)?.getBoundingClientRect().top ?? NaN),
        id,
      ),
    )
    .toBe(NAV_OFFSET);
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

  await test.step("a device is actually drawn on it", async () => {
    // The glow behind the stage is a smooth gradient; a drawn device adds hard edges and a lit
    // screen, which shows up as a large spread in pixel values over the device's half of the page.
    await expect
      .poll(
        async () => {
          const shot = await page.screenshot({ clip: { x: 720, y: 150, width: 640, height: 600 } });
          const { channels } = await sharp(shot).stats();
          return channels[0].stdev;
        },
        { timeout: 30_000 },
      )
      .toBeGreaterThan(25);
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
    // The panel eases into place for half a second. Under load the click's "stable" check can pass
    // between dropped frames and land on a button that has moved, so wait for it to finish.
    const panel = page.locator('#work article[data-active="true"]');
    await expect(panel).toHaveCSS("transform", "none");
    await panel.getByRole("button", { name: "Details" }).click();
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

  await test.step("the progress links jump between projects", async () => {
    await jumpTo(page, "probudget");
    const projects = page.getByRole("navigation", { name: "Projects" });
    await projects.getByRole("link", { name: "NutriTrack" }).click();
    await landedOn(page, "nutritrack");
    await expect(activeTitle(page)).toHaveText("NutriTrack");
    await expect(projects.getByRole("link", { name: "NutriTrack" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    await projects.getByRole("link", { name: "ProBudget" }).click();
    await landedOn(page, "probudget");
    await expect(activeTitle(page)).toHaveText("ProBudget");
  });

  await test.step("lets go at the end of the track instead of covering the next section", async () => {
    const measure = () =>
      page.evaluate(() => {
        const stage = document.querySelector("#work .sticky");
        const track = stage?.parentElement;
        const next = document.getElementById("education");
        if (!stage || !track || !next) throw new Error("stage layout not found");
        return {
          trackBottom: track.getBoundingClientRect().bottom,
          stageTop: stage.getBoundingClientRect().top,
          stageBottom: stage.getBoundingClientRect().bottom,
          nextTop: next.getBoundingClientRect().top,
          height: window.innerHeight,
        };
      });
    const scrollBy = (top: number) =>
      page.evaluate((dy) => window.scrollBy({ top: dy, behavior: "instant" }), top);

    // With the track's bottom edge level with the window's bottom, the last scene is still on
    // stage and the stage fills the window exactly.
    const start = await measure();
    await scrollBy(start.trackBottom - start.height);
    const end = await measure();
    expect(end.stageTop).toBeCloseTo(0, 0);
    expect(end.stageBottom).toBeCloseTo(end.height, 0);
    await expect(activeTitle(page)).toHaveText("NutriTrack");

    // Scrolling on carries the stage away with the track. It must never be drawn over the
    // section that follows it.
    for (const distance of [200, 400, 400, 400]) {
      await scrollBy(distance);
      const after = await measure();
      expect(after.stageBottom).toBeCloseTo(after.trackBottom, 0);
      expect(after.stageBottom).toBeLessThanOrEqual(after.nextTop + 1);
    }
  });

  expect(problems).toEqual([]);
});

test("never prints two projects' words over each other while the stage swaps", async ({ page }) => {
  test.setTimeout(120_000);
  await waitForStage(page);
  await jumpTo(page, "probudget");
  await expect(activeTitle(page)).toHaveText("ProBudget");

  // The three text panels share one spot, so two of them partly visible at once would overprint.
  // First the rule that prevents it, read from the styles so it does not depend on frame timing:
  // a panel that is leaving finishes fading before the one arriving begins.
  const { leaving, arriving } = await page.evaluate(() => {
    const ms = (value: string) => parseFloat(value) * (value.includes("ms") ? 1 : 1000);
    const timing = (panel: Element | undefined) => {
      const style = getComputedStyle(panel!);
      return { duration: ms(style.transitionDuration), delay: ms(style.transitionDelay) };
    };
    const panels = [...document.querySelectorAll("#work .stage-panel")];
    return {
      leaving: timing(panels.find((panel) => panel.getAttribute("data-active") === "false")),
      arriving: timing(panels.find((panel) => panel.getAttribute("data-active") === "true")),
    };
  });
  expect(leaving.delay + leaving.duration, "the leaving panel is gone before the next appears").toBeLessThanOrEqual(
    arriving.delay,
  );

  // Then the behaviour: sample every few milliseconds while the stage moves through the other two
  // projects. A busy machine can make the sampling too sparse to catch an overlap, which is why the
  // rule above is checked on its own.
  const mostVisible = await page.evaluate(
    (ids) =>
      new Promise<number>((resolve) => {
        const panels = [...document.querySelectorAll<HTMLElement>("#work .stage-panel")];
        let most = 0;
        const sample = () => {
          const visible = panels.filter((panel) => Number(getComputedStyle(panel).opacity) > 0.1);
          most = Math.max(most, visible.length);
        };
        const timer = setInterval(sample, 8);
        let step = 0;
        const next = () => {
          if (step === ids.length) {
            setTimeout(() => {
              clearInterval(timer);
              sample();
              resolve(most);
            }, 900);
            return;
          }
          document.getElementById(ids[step++])?.scrollIntoView({ behavior: "instant" });
          setTimeout(next, 900);
        };
        next();
      }),
    ["mymichlin", "nutritrack"],
  );
  // At least one proves the sampling saw the active panel; more than one is the overprint.
  expect(mostVisible).toBe(1);
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
