// Every station of every game, played to the end with real typing, clicks, and taps, answering each problem right.
const {test, expect} = require('./fixtures');
const {globSync, readFileSync} = require('node:fs');
const {dirname} = require('node:path');

const games = globSync('grade*/unit*/stations.js', {cwd: `${__dirname}/..`}).map(dirname).sort();
for (const game of games) {
  const zones = [...readFileSync(`${__dirname}/../${game}/stations.js`, 'utf8').matchAll(/\{id:'(\w+)',name:/g)].map(m => m[1]);
  for (const zone of zones) {
    test(`play ${game} #${zone}`, async ({page, tap, hasTouch}) => {
      const press = loc => hasTouch ? loc.tap() : loc.click();
      // a link to game/#zone starts that zone when the page loads (after clearing saved stars, from a blank page, so it really loads)
      await page.goto(`${game}/`);
      await page.evaluate(() => localStorage.clear());
      await page.goto('about:blank');
      await page.goto(`${game}/#${zone}`);
      await expect(page.locator('#play')).toBeVisible();
      const n = zone === 'boss' ? 10 : 8;
      for (let i = 0; i < n; i++) {
        const p = await page.evaluate(() => { const p = Game.state.p; return {kind: p.kind, answer: p.answer}; });
        if (p.kind === 'num') { await page.locator('#inp').fill(String(p.answer)); await page.locator('#inp').press('Enter'); }
        else if (p.kind === 'pair') { await page.locator('#inp').fill(String(p.answer[0])); await page.locator('#inp2').fill(String(p.answer[1])); await page.locator('#inp2').press('Enter'); }
        else if (p.kind === 'mc') await press(page.locator(`#answer .choice[data-c="${p.answer}"]`));
        else {
          // a tap target can be a thin line (its bounding box 0 wide): tap the middle of it, where a finger would
          const cand = page.locator(`#fig .cand[data-id="${p.answer}"]`);
          await cand.scrollIntoViewIfNeeded();
          const r = await cand.evaluate(e => { const b = e.getBoundingClientRect(); return {x: b.x + b.width / 2, y: b.y + b.height / 2}; });
          await tap(r.x, r.y);
        }
        await expect(page.locator('#feedback .fb.good'), `problem ${i + 1} (${p.kind}) marked right`).toBeVisible();
        await press(page.locator('#nextBtn'));
        if (i + 1 < n) await expect(page.locator('#qnum')).toHaveText(`Problem ${i + 2} of ${n}`);
      }
      await expect(page.locator('#dmsg')).toContainText(`You scored ${n * 10} of ${n * 10} points`);
    });
  }
}
