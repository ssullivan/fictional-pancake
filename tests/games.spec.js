// Every station of every game, played to the end with real typing, clicks, and taps, answering each problem right,
// with no problem dealt twice in the round.
const { test, expect } = require("./fixtures");
const { globSync, readFileSync } = require("node:fs");
const { dirname } = require("node:path");

const games = globSync("grade*/unit*/stations.js", { cwd: `${__dirname}/..` })
  .map(dirname)
  .sort();
for (const game of games) {
  // each station in ZONES is {id: "...", name: "...", ...}; a game with none found means this pattern broke, so fail
  const zones = [
    ...readFileSync(`${__dirname}/../${game}/stations.js`, "utf8").matchAll(/\{\s*id:\s*["'](\w+)["'],\s*name:/g),
  ].map((m) => m[1]);
  if (!zones.length) throw new Error(`${game}/stations.js: found no stations in ZONES`);
  for (const zone of zones) {
    test(`play ${game} #${zone}`, async ({ page, tap, hasTouch }) => {
      const press = (loc) => (hasTouch ? loc.tap() : loc.click());
      // a link to game/#zone starts that zone when the page loads (after clearing saved stars, from a blank page, so it really loads)
      await page.goto(`${game}/`);
      await page.evaluate(() => localStorage.clear());
      await page.goto("about:blank");
      await page.goto(`${game}/#${zone}`);
      await expect(page.locator("#play")).toBeVisible();
      const n = zone === "boss" ? 10 : 8,
        seen = new Set();
      for (let i = 0; i < n; i++) {
        const p = await page.evaluate(() => {
          const p = Game.state.p;
          return { kind: p.kind, answer: p.answer, key: problemKey(p) };
        });
        expect(seen.has(p.key), `problem ${i + 1} repeats an earlier one: ${p.key.slice(0, 120)}`).toBe(false);
        seen.add(p.key);
        if (p.kind === "num") {
          await page.locator("#inp").fill(String(p.answer));
          await page.locator("#inp").press("Enter");
        } else if (p.kind === "pair") {
          await page.locator("#inp").fill(String(p.answer[0]));
          await page.locator("#inp2").fill(String(p.answer[1]));
          await page.locator("#inp2").press("Enter");
        } else if (p.kind === "mc") await press(page.locator(`#answer .choice[data-c="${p.answer}"]`));
        else {
          // a tap target can be a thin line (its bounding box 0 wide): tap the middle of it, where a finger would
          const cand = page.locator(`#fig .cand[data-id="${p.answer}"]`);
          await cand.scrollIntoViewIfNeeded();
          const r = await cand.evaluate((e) => {
            const b = e.getBoundingClientRect();
            return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
          });
          await tap(r.x, r.y);
        }
        await expect(page.locator("#feedback .fb.good"), `problem ${i + 1} (${p.kind}) marked right`).toBeVisible();
        await press(page.locator("#nextBtn"));
        if (i + 1 < n) await expect(page.locator("#qnum")).toHaveText(`Problem ${i + 2} of ${n}`);
      }
      await expect(page.locator("#dmsg")).toContainText(`You scored ${n * 10} of ${n * 10} points`);
    });
  }
}

// Negative answers (Grade 6 Unit 7 on): the box opens the full keyboard (phone number pads have no minus key), a true minus sign
// (−) counts, and a point's swapped coordinates name that mistake. Math.random is seeded so the same problems come up each run.
test("signed answers: a minus key, a true minus sign, and a point's swapped coordinates", async ({
  page,
  hasTouch,
}) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await page.addInitScript(() => {
    let seed = 7;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
  // move on (Game.advance) until the station deals a problem that passes test(p)
  const dealUntil = (test) =>
    page.evaluate((src) => {
      const wanted = new Function("p", `return ${src}`);
      for (let i = 0; i < 7 && !wanted(Game.state.p); i++) Game.advance();
      return wanted(Game.state.p) ? Game.state.p.answer : null;
    }, test);
  await page.goto("grade6/unit7/#line");
  const answer = await dealUntil('p.kind === "num" && p.answer < 0');
  expect(answer, "the station deals a negative answer").not.toBeNull();
  await expect(page.locator("#inp")).toHaveAttribute("inputmode", "text");
  await page.locator("#inp").fill(`−${-answer}`);
  await page.locator("#inp").press("Enter");
  await expect(page.locator("#feedback .fb.good")).toBeVisible();

  await page.goto("about:blank");
  await page.goto("grade6/unit7/#plane");
  const point = await dealUntil('p.kind === "pair" && p.point && p.answer[0] !== p.answer[1]');
  expect(point, "the station deals a point").not.toBeNull();
  await expect(page.locator("#inp2")).toHaveAttribute("aria-label", "y-coordinate");
  await page.locator("#inp").fill(String(point[1]));
  await page.locator("#inp2").fill(String(point[0]));
  await press(page.locator("#checkBtn"));
  await expect(page.locator("#feedback")).toContainText("swapped");
  await page.locator("#inp").fill(String(point[0]).replace("-", "−"));
  await page.locator("#inp2").fill(String(point[1]).replace("-", "−"));
  await press(page.locator("#checkBtn"));
  await expect(page.locator("#feedback .fb.good")).toBeVisible();
});
