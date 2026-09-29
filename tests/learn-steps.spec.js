// Every step of every Learn chapter page, with the edge cases a student can run into:
// - the page loads with no errors and doesn't scroll sideways;
// - every button in the widget works when pressed (twice over), − n + steppers stop at their limits, sliders go end to end,
//   and tapping things in its picture throws nothing;
// - Next stays locked until the quick check is answered, and stays open after a reload (progress is saved);
// - the quick check: an empty or letters-only answer asks for a number, every named mistake shows its message, two misses
//   show the worked answer, and the answer counts with its unit and spaces around it ("30 faces").
const {test, expect} = require('./fixtures');
const {globSync} = require('node:fs');

const ROOT = `${__dirname}/..`;
const pages = globSync('grade*/unit*/learn/*.html', {cwd: ROOT}).sort();
const plain = s => String(s).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

for (const url of pages) {
  test(`every step of ${url}`, async ({page, tap, hasTouch}) => {
    test.setTimeout(300000);
    const press = loc => hasTouch ? loc.tap() : loc.click();
    await page.goto(`${url}#s1`);
    await page.evaluate(() => localStorage.clear());
    const steps = await page.evaluate(() => STEPS.map(s => ({widget: !!s.widget, check: s.check && {
      kind: s.check.kind, answer: s.check.answer, unit: s.check.unit || '', explain: s.check.explain,
      misc: s.check.misc || [], choices: (s.check.choices || []).map(c => c.id), why: s.check.why || {}}})));
    const fb = page.locator('#check [data-fb]'), next = page.locator('#next');

    for (const [i, st] of steps.entries()) {
      const at = async () => {
        await page.goto('about:blank');
        await page.goto(`${url}#s${i + 1}`);
        await expect(page.locator('#snum')).toHaveText(new RegExp(`^Step ${i + 1} of`));
      };
      const step = `step ${i + 1}`;
      await at();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${step}: no sideways scrolling`).toBe(true);
      if (st.check) await expect(next, `${step}: Next is locked until the quick check is answered`).toBeDisabled();

      if (st.widget) {
        const w = page.locator('#widget');
        // − n + steppers: + until the number stops changing, then once more (it must stay put); the same for −
        for (const d of ['1', '-1']) {
          const btns = w.locator(`button[data-d="${d}"]`);
          for (let k = 0; k < await btns.count(); k++) {
            const b = btns.nth(k), value = b.locator('xpath=../b');
            let v = await value.textContent();
            for (let n = 0; n < 60; n++) { await press(b); const now = await value.textContent(); if (now === v) break; v = now; }
            await press(b);
            await expect(value, `${step}: a stepper stops at its limit`).toHaveText(v);
          }
        }
        // every other button, twice over
        for (let pass = 0; pass < 2; pass++) {
          const btns = w.locator('button:not([data-d])');
          for (let k = 0; k < await btns.count(); k++) {
            const b = btns.nth(k);
            if (await b.isVisible() && await b.isEnabled()) await press(b);
          }
        }
        // sliders from end to end
        const ranges = w.locator('input[type="range"]');
        for (let k = 0; k < await ranges.count(); k++) {
          const r = ranges.nth(k);
          if (!await r.isEnabled()) continue;
          for (const end of ['min', 'max']) await r.fill(await r.getAttribute(end));
        }
        // a few things in the picture that can be tapped
        const spots = w.locator('svg [data-v], svg [data-i], svg [data-t], svg [data-id]');
        for (let k = 0; k < Math.min(8, await spots.count()); k++) {
          const s = spots.nth(k);
          if (!await s.isVisible()) continue;
          const r = await s.evaluate(e => { e.scrollIntoView({block: 'center'}); const b = e.getBoundingClientRect(); return {x: b.x + b.width / 2, y: b.y + b.height / 2}; });
          await tap(r.x, r.y);
        }
      }

      const c = st.check;
      if (!c) { await expect(next).toBeEnabled(); continue; }
      if (c.kind === 'num') {
        const input = page.locator('#cin');
        const answer = async v => { await input.fill(v); await input.press('Enter'); };
        for (const v of ['', 'abc']) {
          await answer(v);
          await expect(fb, `${step}: "${v}" asks for a number`).toContainText('Type a number first.');
        }
        for (const [v, msg] of c.misc) {
          await at();
          await answer(String(v));
          await expect(fb, `${step}: typing ${v} names the mistake`).toContainText(plain(msg));
          await expect(fb).toContainText('Try once more');
        }
        await at();
        await answer(String(c.answer + 997));
        await answer(String(c.answer + 997));
        await expect(fb, `${step}: two misses show the worked answer`).toContainText('Here’s how it works');
        await expect(fb).toContainText(plain(c.explain));
        await expect(next, `${step}: Next opens after the check`).toBeEnabled();
        await page.evaluate(() => localStorage.clear());
        await at();
        await answer(` ${c.answer} ${c.unit} `);
        await expect(fb, `${step}: the answer counts with its unit and spaces`).toContainText('Nice!');
      } else {
        for (const id of c.choices.filter(x => x !== c.answer)) {
          await at();
          await press(page.locator(`#check .choice[data-c="${id}"]`));
          await expect(fb, `${step}: choice ${id} names the mistake`).toContainText(plain(c.why[id]));
        }
        await page.evaluate(() => localStorage.clear());
        await at();
        await press(page.locator(`#check .choice[data-c="${c.answer}"]`));
        await expect(fb, `${step}: the right choice`).toContainText('Nice!');
      }
      await expect(next).toBeEnabled();
      await at();
      await expect(next, `${step}: after a reload, the step is still done`).toBeEnabled();
    }
  });
}
