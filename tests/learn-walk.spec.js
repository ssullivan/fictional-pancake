// Every Learn page, the way a student goes through it: open the first chapter from the unit's page, answer each quick check
// (wrong, then right), press Next to the end of every chapter, and come back to a unit page that shows every step done.
const { test, expect } = require("./fixtures");
const { globSync } = require("node:fs");

const units = globSync("grade*/unit*/learn.html", { cwd: `${__dirname}/..` }).sort();
for (const unit of units) {
  test(`walk ${unit}`, async ({ page }) => {
    test.setTimeout(240000);
    await page.goto(unit);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const total = +(await page.locator("#htot").textContent());
    await page.locator("#chapters .zone").first().click();
    for (;;) {
      await expect(page.locator("#snum")).toBeVisible();
      if (/complete/.test(await page.locator("#snum").textContent())) {
        const next = page.locator("#next");
        if (/Back to chapters/.test(await next.textContent())) {
          await next.click();
          break;
        }
        await next.click(); // Next: the next chapter's page
        await expect(page.locator("#snum")).toHaveText(/^Step 1 of/);
        continue;
      }
      const c = await page.evaluate(() => {
        const s = STEPS[+(location.hash.match(/\d+/) || [1])[0] - 1];
        return s.check
          ? {
              kind: s.check.kind,
              answer: s.check.answer,
              wrong: s.check.kind === "mc" ? s.check.choices.find((x) => x.id !== s.check.answer).id : null,
            }
          : null;
      });
      if (c && c.kind === "num") {
        await page.locator("#cin").fill(String(c.answer + 1000));
        await page.locator("#cin").press("Enter");
        await expect(page.locator("#check .fb.bad")).toBeVisible();
        await page.locator("#cin").fill(String(c.answer));
        await page.locator("#cin").press("Enter");
      } else if (c) {
        await page.locator(`#check .choice[data-c="${c.wrong}"]`).click();
        if (await page.locator('#check .choice[data-c="' + c.answer + '"]').isEnabled())
          await page.locator(`#check .choice[data-c="${c.answer}"]`).click();
      }
      await expect(page.locator("#next")).toBeEnabled();
      // wait for the next step (or the end of the chapter) to be drawn before reading it
      const was = await page.locator("#snum").textContent();
      await page.locator("#next").click();
      await expect(page.locator("#snum")).not.toHaveText(was);
    }
    await expect(page).toHaveURL(/learn\.html$/);
    await expect(page.locator("#hdone")).toHaveText(String(total));
  });
}
