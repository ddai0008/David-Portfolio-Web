import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { evidence, skillEvidence, skills } from "../../src/content/site";

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

test("tells a recruiter the role, work rights and availability up top", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero).toContainText("graduate software engineering role");
  await expect(hero).toContainText("Australian citizen");
  await expect(hero).toContainText("Available from December 2026");
});

test("puts the facts a recruiter scans for just under the hero", async ({ page }, testInfo) => {
  await page.goto("/");
  const strip = page.getByRole("region", { name: "At a glance" });
  for (const fact of ["3.70", "82.1", "6", "~30,000", "DP-900"]) {
    await expect(strip).toContainText(fact);
  }

  // On laptop-sized screens, short ones included, the strip begins before the first scroll.
  test.skip(testInfo.project.name === "mobile", "a phone's first screen is the hero alone");
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
  ]) {
    await page.setViewportSize({ width, height });
    const box = await strip.boundingBox();
    expect(box?.y ?? Infinity, `${width}x${height}`).toBeLessThan(height);
  }
});

test("says what each project did without opening a sheet", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("#probudget").getByText("The database is moving to Azure, where"),
  ).toBeVisible();
  await expect(
    page.locator("#mymichlin").getByText("Custom map annotations, built with async Swift."),
  ).toBeVisible();
  await expect(
    page.locator("#nutritrack").getByText("Material Design interface designed in Figma"),
  ).toBeVisible();
});

test("claims only what it can back up", async ({ page }) => {
  await page.goto("/");
  const body = page.locator("body");
  // ProBudget is live with a demo account, not a "production" product with real users.
  await expect(body).not.toContainText(/production finance/i);
  // A 100-record audit proves matches were correct, not recall, so it is stated as a count.
  await expect(page.locator("#impact")).toContainText("100 of 100");
  await expect(body).not.toContainText("100% precision");
  // The time-limited wording goes stale the week he graduates.
  await expect(body).not.toContainText(/graduating November 2026|final-year/i);
});

test("shows the matching flow in order", async ({ page }) => {
  await page.goto("/");
  const steps = page.getByRole("list", { name: "How the matching worked" }).getByRole("listitem");
  await expect(steps).toHaveCount(4);
  await expect(steps.nth(0)).toContainText("Collect");
  await expect(steps.nth(3)).toContainText("Review");
});

test("lays Education out across the row, not down the left", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "it stacks on a phone");
  await page.goto("/");
  const width = page.viewportSize()?.width ?? 0;
  const gpa = await page.locator("#education").getByText("3.70", { exact: true }).boundingBox();
  expect(gpa?.x ?? 0).toBeGreaterThan(width / 2);
});

test("every details button says which project it opens", async ({ page }) => {
  await page.goto("/");
  for (const name of [
    "Details on ProBudget",
    "Details on MyMichlin",
    "Details on NutriTrack",
    "Details on Agencia Change",
  ]) {
    await expect(page.getByRole("button", { name }), name).toHaveCount(1);
  }
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
  const dimmed = await page.locator(".reveal, .reveal-soft").evaluateAll((nodes) =>
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
    await page.getByRole("button", { name: "Details on Agencia Change" }).click();
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

  test("the section links collapse into a menu on a phone", async ({ page }, testInfo) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    const menu = page.getByRole("navigation", { name: "Site menu" });

    if (testInfo.project.name !== "mobile") {
      await expect(button).toBeHidden();
      return;
    }

    await expect(menu).toBeHidden();
    await button.click();
    await expect(menu).toBeVisible();

    // Escape closes it and puts focus back on the button.
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    // Choosing a section goes there and closes the menu rather than leaving it over the page.
    await button.click();
    await menu.getByRole("link", { name: "Work" }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#work$/);
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

test.describe("diagrams and colour", () => {
  test("shows the capstone team as a chart around David, with decorative lines", async ({ page }) => {
    await page.goto("/");
    const leadership = page.locator("#leadership");
    await expect(leadership).toContainText("Agencia Change");
    await expect(leadership).toContainText("Team Lead and client liaison");
    // The list is what assistive technology reads; the lines joining it up are only decoration.
    await expect(page.getByRole("list", { name: "Team make-up" }).getByRole("listitem")).toHaveCount(3);
    const lines = leadership.locator(".team-line");
    expect(await lines.count()).toBe(6);
    for (const line of await lines.all()) await expect(line).toHaveAttribute("aria-hidden", "true");
  });

  test("shows every diagram finished when motion is off", async ({ page }) => {
    await page.goto("/");
    const transforms = await page
      .locator(".team-line")
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).transform));
    expect(new Set(transforms)).toEqual(new Set(["none"]));

    // The merge step already shows its pairs merged, and the progress line is not drawn at all.
    const merged = await page
      .locator("#impact .g-merge")
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).transform));
    expect(merged).toHaveLength(8);
    for (const transform of merged) expect(transform).not.toBe("none");
    const progress = await page.evaluate(
      () => getComputedStyle(document.querySelector(".nav")!, "::before").content,
    );
    expect(progress).toMatch(/^(none|normal)$/);
  });

  test("keeps the colour washes within the agreed strength", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const strengths = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return ["--aurora-strength", "--wash-strength"].map((name) =>
        parseFloat(style.getPropertyValue(name)),
      );
    });
    // David's limit on paper. He tried 12% on 2026-11-02 and set it back to 8%.
    for (const strength of strengths) expect(strength).toBeLessThanOrEqual(8);
    // Decorative, so none of it is announced.
    for (const wash of await page.locator(".aurora, .wash").all()) {
      await expect(wash).toHaveAttribute("aria-hidden", "true");
    }
  });

  test.describe("with motion", () => {
    test.use({ reducedMotion: "no-preference" });

    // These are about the count-up and the progress line, not the 3D stage. Data saver keeps the
    // stage off, so its software-rendered WebGL cannot starve the animation frames under load.
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "connection", { value: { saveData: true } });
      });
    });

    test("the background motion can be paused, and stays paused", async ({ page }) => {
      await page.goto("/");
      // Every pool in the group, not just the first: a rule that covered only some would pass.
      const states = (scope: string) =>
        page.evaluate(
          (selector) =>
            [...new Set([...document.querySelectorAll(selector)].map((node) => getComputedStyle(node).animationPlayState))],
          scope,
        );
      const state = async () => {
        const seen = await states("#top .aurora > span");
        return seen.length === 1 ? seen[0] : seen.join("+");
      };
      expect(await state()).toBe("running");

      await page.getByRole("button", { name: "Pause background motion" }).click();
      expect(await states(".aurora > span")).toEqual(["paused"]);

      // Remembered, and applied before the first paint so it never starts and then stops.
      await page.reload();
      await expect(page.getByRole("button", { name: "Resume background motion" })).toBeVisible();
      expect(await states(".aurora > span")).toEqual(["paused"]);

      await page.getByRole("button", { name: "Resume background motion" }).click();
      // The button is in the footer, where the hero's pools are out of view and rest anyway.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await expect.poll(state).toBe("running");
    });

    test("the colour pools drift only while they are on screen", async ({ page }) => {
      await page.goto("/");
      const playing = (selector: string) =>
        page.evaluate(
          (sel) => getComputedStyle(document.querySelector(`${sel} .aurora > span`)!).animationPlayState,
          selector,
        );
      // At the top the hero's pools run; the contact's are a long way off, so they are paused.
      await expect.poll(() => playing("#top")).toBe("running");
      await expect.poll(() => playing("#contact")).toBe("paused");

      await page.locator("#about").scrollIntoViewIfNeeded();
      await expect.poll(() => playing("#top")).toBe("paused");

      await page.locator("#contact").scrollIntoViewIfNeeded();
      await expect.poll(() => playing("#contact")).toBe("running");
    });

    test("the availability dot pulses a few times and then rests", async ({ page }) => {
      await page.goto("/");
      const iterations = await page.evaluate(
        () => getComputedStyle(document.querySelector(".signal-dot")!).animationIterationCount,
      );
      expect(iterations).toBe("3");
    });

    test("counts the donor records up as they scroll into view", async ({ page }) => {
      await page.goto("/");
      const figure = page.locator("#impact dt").first();
      // Below the fold it waits at zero, while the spoken number is always the finished one.
      await expect(figure.locator("[aria-hidden='true']")).toHaveText("~0");
      await expect(figure.locator(".sr-only")).toHaveText("~30,000");
      await page.locator("#impact dl").scrollIntoViewIfNeeded();
      await expect(figure.locator("[aria-hidden='true']")).toHaveText("~30,000");
    });

    test("the progress line stays visible in high-contrast mode", async ({ page }) => {
      await page.emulateMedia({ forcedColors: "active" });
      await page.goto("/");
      await page.evaluate(() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
      );
      await expect
        .poll(() =>
          page.evaluate(() => {
            const line = getComputedStyle(document.querySelector(".nav")!, "::before");
            return line.backgroundColor !== getComputedStyle(document.body).backgroundColor;
          }),
        )
        .toBe(true);
    });

    test("draws a progress line in the project colours as the page scrolls", async ({ page }) => {
      await page.goto("/");
      const drawn = () =>
        page.evaluate(
          () =>
            new DOMMatrix(getComputedStyle(document.querySelector(".nav")!, "::before").transform).a,
        );
      await expect.poll(drawn).toBeLessThan(0.05);
      await page.evaluate(() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
      );
      await expect.poll(drawn).toBeGreaterThan(0.95);
    });
  });
});

test.describe("recruiter path", () => {
  test("puts LinkedIn and GitHub in the first screen and again in the footer", async ({ page }) => {
    await page.goto("/");
    for (const area of [page.locator("#top"), page.locator("footer")]) {
      await expect(area.getByRole("link", { name: /^LinkedIn/ })).toHaveAttribute(
        "href",
        /linkedin\.com\/in\/david-dai-974ab5313/,
      );
      await expect(area.getByRole("link", { name: /^GitHub/ })).toHaveAttribute(
        "href",
        "https://github.com/ddai0008",
      );
    }
  });

  test("says what the hero picture is and links it to the real thing", async ({ page }) => {
    await page.goto("/");
    const caption = page.locator("#top").getByRole("link", { name: /ProBudget, live/ });
    await expect(caption).toHaveAttribute("href", "https://pro-budget.vercel.app");
    await expect(caption).toHaveAttribute("target", "_blank");
  });

  test("the background-motion button is not offered when the system already reduces motion", async ({
    page,
  }) => {
    // The suite runs with reduced motion on, so there is nothing for it to pause.
    await page.goto("/");
    await expect(page.getByRole("button", { name: /background motion/ })).toBeHidden();
  });

  test("sets body copy so it does not end on a lone word", async ({ page }) => {
    await page.goto("/");
    const wrap = await page
      .locator("#about p")
      .first()
      .evaluate((node) => getComputedStyle(node).getPropertyValue("text-wrap"));
    expect(wrap).toContain("pretty");
  });
});

test.describe("skills and their evidence", () => {
  test("every skill with evidence is a listed skill, in a known place", () => {
    const all = skills.flatMap((group) => group.items as readonly string[]);
    // Each skill is listed once, so the highlighter's counts follow the evidence and nothing else.
    expect(new Set(all).size).toBe(all.length);
    const listed = new Set(all);
    const places = new Set<string>(evidence.map((place) => place.id));
    for (const [name, where] of Object.entries(skillEvidence)) {
      expect(listed.has(name), `${name} is not a listed skill`).toBe(true);
      for (const id of where) expect(places.has(id), `${name}: unknown place ${id}`).toBe(true);
    }
  });

  test("choosing a project underlines its skills and nothing else", async ({ page }) => {
    await page.goto("/");
    const underlined = () =>
      page
        .locator(".skill")
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => getComputedStyle(node).textDecorationLine.includes("underline"))
            .map((node) => node.getAttribute("data-p") ?? ""),
        );
    expect(await underlined()).toEqual([]);

    await page.locator("label.skill-pill", { hasText: "ProBudget" }).click();
    const expected = Object.values(skillEvidence).filter((where) => where.includes("probudget")).length;
    const chosen = await underlined();
    expect(chosen).toHaveLength(expected);
    for (const where of chosen) expect(where).toContain("probudget");

    await page.locator("label.skill-pill", { hasText: "None" }).click();
    expect(await underlined()).toEqual([]);
  });

  test("each project's pill underlines exactly the skills that name it", async ({ page }) => {
    await page.goto("/");
    for (const place of evidence) {
      await page.locator("label.skill-pill", { hasText: place.label }).click();
      const underlined = await page
        .locator(".skill")
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => getComputedStyle(node).textDecorationLine.includes("underline"))
            // The first text node is the skill itself; the rest is the dots and the spoken evidence.
            .map((node) => node.firstChild?.textContent?.trim() ?? ""),
        );
      const expected = Object.entries(skillEvidence)
        .filter(([, where]) => (where as readonly string[]).includes(place.id))
        .map(([name]) => name);
      // At least one, so a renamed or added project cannot end up with a pill that does nothing.
      expect(expected.length, `${place.label} has no skills`).toBeGreaterThan(0);
      expect(underlined.sort(), place.label).toEqual(expected.sort());
    }
  });

  test("Figma is shown under both app projects it was used for", () => {
    expect(skillEvidence.Figma).toEqual(["mymichlin", "nutritrack"]);
  });

  test("a skill's evidence is named for assistive technology", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".skill", { hasText: "TypeScript" })).toContainText("(ProBudget)");
    await expect(page.locator(".skill", { hasText: "Python" })).not.toContainText("(");
  });
});

test.describe("tap areas", () => {
  // The pause toggle in the footer only shows when motion is allowed, so both settings are covered.
  for (const [motion, count] of [
    ["reduce", 12],
    ["no-preference", 13],
  ] as const) {
    test(`a touch screen can hit each text link over at least 44px (motion: ${motion})`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== "mobile", "a mouse keeps the drawn size");
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/");
      const links = await page.locator(".hit:visible").all();
      // Nav name, two hero profile links, four selected-work links, the demo caption, the contact
      // email, three footer links, and with motion allowed the pause toggle.
      expect(links).toHaveLength(count);
      for (const link of links) {
        // Instant, not smooth: with motion allowed the page eases its scrolling, and measuring
        // while it moves would test a link that is still on its way.
        await link.evaluate(
          (node) =>
            new Promise<void>((done) => {
              node.scrollIntoView({ block: "center", behavior: "instant" });
              requestAnimationFrame(() => requestAnimationFrame(() => done()));
            }),
        );
        const area = await link.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const hits = (x: number, y: number) => {
            const found = document.elementFromPoint(x, y);
            return !!found && (found === node || node.contains(found));
          };
          const x = box.left + box.width / 2;
          const y = box.top + box.height / 2;
          let up = 0;
          while (up < 40 && hits(x, box.top - up - 1)) up++;
          let down = 0;
          while (down < 40 && hits(x, box.bottom + down)) down++;
          let left = 0;
          while (left < 40 && hits(box.left - left - 1, y)) left++;
          let right = 0;
          while (right < 40 && hits(box.right + right, y)) right++;
          // A neighbour's larger area must never cover this link's own text.
          const own = [
            [x, y],
            [box.left + 2, y],
            [box.right - 2, y],
            [x, box.top + 2],
            [x, box.bottom - 2],
          ].every(([px, py]) => hits(px, py));
          return {
            name: (node.textContent ?? "").trim().replace(/\s+/g, " "),
            width: box.width + left + right,
            height: box.height + up + down,
            own,
          };
        });
        expect(area.own, `${area.name} keeps its own taps`).toBe(true);
        expect(area.height, `${area.name} is hit over ${area.height}px tall`).toBeGreaterThanOrEqual(44);
        expect(area.width, `${area.name} is hit over ${area.width}px wide`).toBeGreaterThanOrEqual(44);
      }
    });
  }

  test("a mouse gets no extra hit area", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "a touch screen gets the larger areas");
    await page.goto("/");
    const content = await page
      .locator(".hit")
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node, "::after").content));
    expect(content.length).toBeGreaterThanOrEqual(12);
    for (const value of content) expect(value).toMatch(/^(none|normal)$/);
  });
});

test.describe("dot grid", () => {
  const sections = ["about", "education", "impact", "skills", "top"];

  test("sits behind five sections and is only paint", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator(".dots").evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(ids.sort()).toEqual(sections);
    for (const id of sections) {
      const grid = await page.locator(`#${id}`).evaluate((node) => {
        const style = getComputedStyle(node, "::before");
        return {
          content: style.content,
          events: style.pointerEvents,
          position: style.position,
          image: style.backgroundImage,
        };
      });
      expect(grid.content, id).toBe('""');
      // It must never take a tap or a click from the content over it.
      expect(grid.events, id).toBe("none");
      expect(grid.position, id).toBe("absolute");
      expect(grid.image, id).toContain("radial-gradient");
    }
  });

  // The grid sits behind text, so text must stay readable even when a glyph lands on the centre of
  // a dot. This measures every line of text in the five sections that has no background of its own
  // (the cards, buttons and pills cover the grid) against the mask's real value at its position,
  // using the same maths as the CSS gradient. The mask is highest nearest its centre in the hero and
  // farthest from it elsewhere, so each line is sampled at its corners and at the point closest to
  // that centre.
  for (const scheme of ["light", "dark"] as const) {
    test(`text stays readable over the grid (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      const sections = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement);
        const token = (name: string) => root.getPropertyValue(name).trim();
        // A minifier may shorten #000000 to #000.
        const hex = (value: string) => {
          let digits = value.replace("#", "");
          if (digits.length === 3) digits = [...digits].map((digit) => digit + digit).join("");
          return [0, 2, 4].map((at) => parseInt(digits.slice(at, at + 2), 16));
        };
        const numbers = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
        const luminance = (colour: number[]) => {
          const [r, g, b] = colour.map((value) => {
            const channel = value / 255;
            return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const contrast = (a: number[], b: number[]) => {
          const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
          return (high + 0.05) / (low + 0.05);
        };
        const strength = parseFloat(token("--dot-strength")) / 100;
        const ink = hex(token("--ink"));
        const paper = hex(token("--paper"));

        return [...document.querySelectorAll<HTMLElement>(".dots")].map((section) => {
          const box = section.getBoundingClientRect();
          const style = getComputedStyle(section);
          const prop = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
          const length = (value: string, size: number) =>
            value.endsWith("%") ? (parseFloat(value) / 100) * size : parseFloat(value);
          const [atX, atY] = prop("--dots-at", "50% 50%").split(/\s+/);
          const cx = length(atX, box.width);
          const cy = length(atY, box.height);
          const rx = length(prop("--dots-w", "90%"), box.width);
          const ry = length(prop("--dots-h", "75%"), box.height);
          const inner = parseFloat(prop("--dots-in", "0.35"));
          const outer = parseFloat(prop("--dots-out", "0.85"));
          const alphaAt = (x: number, y: number) =>
            inner + (outer - inner) * Math.min(1, Math.hypot((x - cx) / rx, (y - cy) / ry));
          const transparent = numbers(style.backgroundColor).length === 0 || style.backgroundColor.endsWith(", 0)");
          const surface = transparent ? paper : numbers(style.backgroundColor);

          let worst = { margin: Infinity, contrast: 0, need: 0, text: "" };
          let measured = 0;
          for (const el of section.querySelectorAll<HTMLElement>("*")) {
            if (el.closest("[aria-hidden='true'], .sr-only")) continue;
            if (![...el.childNodes].some((node) => node.nodeType === 3 && node.textContent?.trim())) continue;
            const computed = getComputedStyle(el);
            if (computed.display === "none" || computed.visibility === "hidden") continue;
            // Text on a card, button or pill sits on that fill, with the grid behind it.
            let covered = false;
            for (let node: HTMLElement | null = el; node && node !== section; node = node.parentElement) {
              const fill = getComputedStyle(node).backgroundColor;
              if (fill !== "transparent" && !fill.endsWith(", 0)")) covered = true;
            }
            if (covered) continue;
            // Only this element's own text: a nested element is measured on its own, and the
            // visually hidden text inside a link reports a wide rect that nobody can see.
            const lines: DOMRect[] = [];
            for (const node of el.childNodes) {
              if (node.nodeType !== 3 || !node.textContent?.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              lines.push(...range.getClientRects());
            }
            let alpha = 0;
            for (const line of lines) {
              if (!line.width) continue;
              const nearest = [
                Math.min(Math.max(cx + box.left, line.left), line.right),
                Math.min(Math.max(cy + box.top, line.top), line.bottom),
              ];
              for (const [x, y] of [
                [line.left, line.top],
                [line.right, line.top],
                [line.left, line.bottom],
                [line.right, line.bottom],
                nearest,
              ]) {
                alpha = Math.max(alpha, alphaAt(x - box.left, y - box.top));
              }
            }
            const dot = surface.map((value, i) => value + (ink[i] - value) * strength * alpha);
            const channels = computed.color.match(/[\d.]+/g)?.map(Number) ?? [];
            const opacity = channels.length > 3 ? channels[3] : 1;
            const text = channels.slice(0, 3).map((value, i) => value * opacity + dot[i] * (1 - opacity));
            const size = parseFloat(computed.fontSize);
            const large = size >= 24 || (size >= 18.66 && parseInt(computed.fontWeight) >= 700);
            const need = large ? 3 : 4.5;
            const ratio = contrast(text, dot);
            measured++;
            if (ratio - need < worst.margin) {
              worst = { margin: ratio - need, contrast: ratio, need, text: (el.textContent ?? "").trim().slice(0, 40) };
            }
          }
          return { id: section.id, measured, ...worst };
        });
      });
      expect(sections).toHaveLength(5);
      for (const section of sections) {
        // Every section has text on bare paper, so measuring none means the check found nothing.
        expect(section.measured, `${section.id}: no text was measured`).toBeGreaterThan(3);
        expect(
          section.contrast,
          `${section.id}: "${section.text}" is ${section.contrast.toFixed(2)}:1 on a dot, needs ${section.need}`,
        ).toBeGreaterThanOrEqual(section.need);
      }
    });
  }

  for (const [name, media] of [
    ["forced colours", { forcedColors: "active" }],
    ["more contrast", { contrast: "more" }],
  ] as const) {
    test(`is gone with ${name}`, async ({ page }) => {
      await page.emulateMedia(media);
      await page.goto("/");
      const displays = await page
        .locator(".dots")
        .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node, "::before").display));
      expect(displays).toHaveLength(5);
      for (const display of displays) expect(display).toBe("none");
    });
  }
});

test.describe("high-contrast mode", () => {
  test("keeps the capstone chart and the skills readable", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto("/");
    // Forced colours repaint every background, so anything drawn as a background fill would match the page.
    const seen = await page.evaluate(() => {
      const colour = (selector: string) => getComputedStyle(document.querySelector(selector)!);
      return {
        page: getComputedStyle(document.body).backgroundColor,
        line: colour(".team-line").backgroundColor,
        dot: colour(".team-dot").backgroundColor,
        hub: colour(".team-hub").borderTopWidth,
        // The one deliberate exception: project-colour dots identify a project, so they keep their
        // own colour. Forced colours would paint them the page colour, whatever the palette is.
        projectDot: colour(".skill-dot:not([data-plain])").backgroundColor,
        availabilityDot: colour(".signal-dot").backgroundColor,
        pills: [...document.querySelectorAll(".skill-pill")].map(
          (node) => getComputedStyle(node).backgroundColor,
        ),
        glyphDot: colour(".g-dot").fill,
        navLine: getComputedStyle(document.querySelector(".nav")!, "::after").backgroundColor,
        underlined: [...document.querySelectorAll(".skill")].filter((node) =>
          getComputedStyle(node).textDecorationLine.includes("underline"),
        ).length,
      };
    });
    expect(seen.line).not.toBe(seen.page);
    expect(seen.dot).not.toBe(seen.page);
    expect(seen.hub).toBe("1px");
    expect(seen.glyphDot).not.toBe(seen.page);
    expect(seen.navLine).not.toBe(seen.page);
    expect(seen.projectDot).not.toBe(seen.page);
    expect(seen.availabilityDot).not.toBe(seen.page);
    // "None" is chosen to begin with, so it alone must look different from the other pills.
    expect(seen.pills[0]).not.toBe(seen.pills[1]);
    expect(new Set(seen.pills.slice(1)).size).toBe(1);
    expect(seen.underlined).toBe(0);
  });
});
