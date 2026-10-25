// Every unit's printable study guide ({grade*,alg1}/unit*/study.html): it opens from the unit's card on the grade (or
// course) page, it's a plain white page (not the site's navy grid), every diagram is drawn, and nothing scrolls sideways.
// Printed (shared/study-print.css), it drops the links and printing tips, shows the test's name line, starts each part, the
// test, and the key on new pages, and leaves room to work above each answer line.
const { test, expect } = require("./fixtures");
const { globSync } = require("node:fs");

const guides = globSync("{grade*,alg1}/unit*/study.html", { cwd: `${__dirname}/..` }).sort();
for (const guide of guides) {
  test(`study guide ${guide}`, async ({ page }) => {
    // the grade page links to it
    const grade = guide.split("/")[0];
    await page.goto(`${grade}/index.html`);
    await page.locator(`a.study[href="${guide.slice(grade.length + 1)}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${guide}$`));
    expect(
      await page.evaluate(() => [
        getComputedStyle(document.body).backgroundColor,
        getComputedStyle(document.body).backgroundImage,
      ]),
    ).toEqual(["rgb(255, 255, 255)", "none"]);

    // every placeholder has its diagram, each with a label for screen readers
    const placeholders = page.locator("[data-fig]");
    expect(await placeholders.count()).toBeGreaterThan(0);
    for (const el of await placeholders.all())
      await expect(el.locator('svg[role="img"][aria-label]').first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".name-line")).toBeHidden();

    // printed: white paper, no links back or to Learn chapters and no printing tips, a name line on the test, every part and the
    // practice test and answer key each on a new page, and space above every answer line
    const answerGap = () =>
      page.evaluate(() =>
        Math.min(
          ...[...document.querySelectorAll(".answer-line")].map((el) => parseFloat(getComputedStyle(el).marginTop)),
        ),
      );
    const onScreenGap = await answerGap();
    await page.emulateMedia({ media: "print" });
    const printed = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      hidden: [...document.querySelectorAll(".back, .howto, .ch")].every(
        (el) => getComputedStyle(el).display === "none",
      ),
      breaks: [...document.querySelectorAll(".topic, .test, .answers")].map((el) => getComputedStyle(el).breakBefore),
    }));
    expect(printed.background).toBe("rgb(255, 255, 255)");
    expect(printed.hidden).toBe(true);
    expect(printed.breaks.length).toBeGreaterThan(2);
    expect(new Set(printed.breaks)).toEqual(new Set(["page"]));
    await expect(page.locator(".name-line")).toBeVisible();
    expect(await answerGap()).toBeGreaterThan(onScreenGap);
  });
}
