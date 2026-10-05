// Every unit's printable study guide (grade*/unit*/study.html): it opens from the unit's card on the grade page, every
// diagram is drawn, nothing scrolls sideways, and printed it's dark ink on white with the test and the key on new pages.
const { test, expect } = require("./fixtures");
const { globSync } = require("node:fs");

const guides = globSync("grade*/unit*/study.html", { cwd: `${__dirname}/..` }).sort();
for (const guide of guides) {
  test(`study guide ${guide}`, async ({ page }) => {
    // the grade page links to it
    const grade = guide.split("/")[0];
    await page.goto(`${grade}/index.html`);
    await page.locator(`a.study[href="${guide.slice(grade.length + 1)}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${guide}$`));

    // every placeholder has its diagram, each with a label for screen readers
    const placeholders = page.locator("[data-fig]");
    expect(await placeholders.count()).toBeGreaterThan(0);
    for (const el of await placeholders.all())
      await expect(el.locator('svg[role="img"][aria-label]').first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    // printed: white paper, no back link, and the practice test and answer key each start a new page
    await page.emulateMedia({ media: "print" });
    const printed = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      back: getComputedStyle(document.querySelector(".back")).display,
      breaks: [...document.querySelectorAll(".test, .answers")].map((el) => getComputedStyle(el).breakBefore),
    }));
    expect(printed).toEqual({ background: "rgb(255, 255, 255)", back: "none", breaks: ["page", "page"] });
  });
}
