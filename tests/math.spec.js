// Typed math (shared/expr.js, shared/mathbox.js, shared/tex.js) on its test pages (tests/pages/expr): the math keys type at the
// cursor, the line under the box shows how an answer reads or what's wrong with it, an answer that can't be read or is equal but
// not in the asked form gets a note without using a try, a named mistake shows its message, equal answers written another way
// count, the problem's math is typeset (no raw \( left), and nothing scrolls sideways. The same in a Learn quick check.
const { test, expect } = require("./fixtures");

const GAME = "tests/pages/expr/";
/* start a station from a blank save */
async function start(page, zone) {
  await page.goto(GAME);
  await page.evaluate(() => localStorage.clear());
  await page.goto("about:blank");
  await page.goto(`${GAME}#${zone}`);
  await expect(page.locator("#play")).toBeVisible();
}
const state = (page) => page.evaluate(() => ({ tries: Game.state.tries, done: Game.state.done, p: Game.state.p }));
const noSidewaysScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

test("math keys type at the cursor, and the line under the box follows", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await start(page, "factor");
  const input = page.locator("#inp"),
    reading = page.locator(".mbox-read");
  // a key with the box empty and unfocused types at the end
  await press(page.locator('#answer [data-key="("]'));
  await expect(input).toHaveValue("(");
  // with the cursor at the start of "x+2)", ( goes there
  await input.fill("x+2)");
  await input.evaluate((el) => {
    el.focus();
    el.setSelectionRange(0, 0);
  });
  await press(page.locator('#answer [data-key="("]'));
  await expect(input).toHaveValue("(x+2)");
  await expect(reading).not.toHaveClass(/err/);
  await expect(reading.locator(".katex")).toBeVisible();
  // a selection is replaced
  await input.evaluate((el) => {
    el.focus();
    el.setSelectionRange(1, 2);
  });
  await press(page.locator('#answer [data-key="x"]'));
  await expect(input).toHaveValue("(x+2)");
  // something that can't be read says why
  await input.fill("(x+2");
  await expect(reading).toHaveClass(/err/);
  await expect(reading).toHaveText("There’s a ( with no ).");
  // emptied, the line is empty
  await input.fill("");
  await expect(reading).toHaveText("");
});

test("factoring: notes, a named mistake, then the answer written another way", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await start(page, "factor");
  const input = page.locator("#inp"),
    feedback = page.locator("#feedback");
  // the problem's math is typeset
  await expect(page.locator("#prompt .katex")).toBeVisible();
  await expect(page.locator("#prompt")).not.toContainText("\\(");
  const { p } = await state(page),
    { r, s } = p.facts;
  // can't be read: a note, and the try is kept
  await input.fill(`(x+${r}`);
  await input.press("Enter");
  await expect(feedback.locator(".fb.info")).toContainText("There’s a ( with no ).");
  expect((await state(page)).tries).toBe(0);
  // a letter the problem doesn't have
  await input.fill("(t+1)(t+2)");
  await input.press("Enter");
  await expect(feedback.locator(".fb.info")).toContainText("in this problem");
  expect((await state(page)).tries).toBe(0);
  // equal, but multiplied out: the form's note, and the try is kept
  await input.fill(`x^2 + ${r + s}x + ${r * s}`);
  await input.press("Enter");
  await expect(feedback.locator(".fb.info")).toContainText("not written the way the problem asks");
  await expect(feedback.locator(".fb.info .katex").first()).toBeVisible();
  expect((await state(page)).tries).toBe(0);
  // the sign mistake: its message, and one try used
  await input.fill(`(x+${-r})(x+${-s})`);
  await press(page.locator("#checkBtn"));
  await expect(feedback.locator(".fb.bad")).toContainText("check the signs");
  expect((await state(page)).tries).toBe(1);
  // right, with the factors the other way round, true minus signs, and a × sign: 5 points after the miss
  const factor = (n) => `(x ${n < 0 ? "−" : "+"} ${Math.abs(n)})`;
  await input.fill(`${factor(s)}×${factor(r)}`);
  await input.press("Enter");
  await expect(feedback.locator(".fb.good")).toContainText("+5");
  await expect(feedback.locator(".work .katex").first()).toBeVisible();
  // over: the box and keys are locked
  await expect(input).toHaveJSProperty("readOnly", true);
  await expect(page.locator('#answer [data-key="("]')).toBeDisabled();
  expect(await noSidewaysScroll(page)).toBe(true);
});

test("expanding: equal answers in other orders and spellings count", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await start(page, "expand");
  for (let i = 0; i < 4; i++) {
    const { p } = await state(page),
      { a, b, two } = p.facts;
    // the terms backwards, with * for times and ** or ² for a power
    const typed = two ? `${a * b} + ${a + b}*x + x²` : `${a * b} + ${a}*x`;
    await page.locator("#inp").fill(typed);
    await page.locator("#inp").press("Enter");
    await expect(page.locator("#feedback .fb.good"), `${typed} for ${p.answer}`).toBeVisible();
    await press(page.locator("#nextBtn"));
  }
});

test("a line's equation: rearranged is a note, y = mx + b is right", async ({ page }) => {
  await start(page, "line");
  const { p } = await state(page),
    { m, b } = p.facts,
    input = page.locator("#inp");
  // the problem's own keys
  await expect(page.locator('#answer [data-key="="]')).toBeVisible();
  // an expression where an equation is asked for
  await input.fill(`${m}x + ${b}`);
  await input.press("Enter");
  await expect(page.locator("#feedback .fb.info")).toContainText("Write an equation");
  // the same line, not solved for y
  await input.fill(`y − ${m}x = ${b}`);
  await input.press("Enter");
  await expect(page.locator("#feedback .fb.info")).toContainText("not written the way the problem asks");
  expect((await state(page)).tries).toBe(0);
  await input.fill(`y = ${b} + ${m}x`);
  await input.press("Enter");
  await expect(page.locator("#feedback .fb.good")).toContainText("+10");
});

test("a Learn quick check with typed answers", async ({ page }) => {
  await page.goto(`${GAME}learn/typed.html`);
  await page.evaluate(() => localStorage.clear());
  await page.goto("about:blank");
  await page.goto(`${GAME}learn/typed.html#s1`);
  const input = page.locator("#cin"),
    feedback = page.locator("[data-fb]");
  await expect(page.locator(".cq .katex")).toBeVisible();
  await expect(page.locator("#sbody .katex").first()).toBeVisible();
  // multiplied out: the form's note
  await input.fill("x^2+5x+6");
  await input.press("Enter");
  await expect(feedback.locator(".fb.info")).toContainText("not written the way the question asks");
  // the named mistake
  await input.fill("(x+1)(x+6)");
  await input.press("Enter");
  await expect(feedback.locator(".fb.bad")).toContainText("add to 7");
  await input.fill("(x+3)(x+2)");
  await input.press("Enter");
  await expect(feedback.locator(".fb.good")).toBeVisible();
  expect(await noSidewaysScroll(page)).toBe(true);
  // step 2: an equation solved for y
  await page.goto(`${GAME}learn/typed.html#s2`);
  await input.fill("2x + y = 7");
  await input.press("Enter");
  await expect(feedback.locator(".fb.info")).toContainText("by itself");
  await input.fill("y = −2x + 7");
  await input.press("Enter");
  await expect(feedback.locator(".fb.good")).toBeVisible();
});

test("the Learn page lists the chapter with its math typeset", async ({ page }) => {
  await page.goto(`${GAME}learn.html`);
  await expect(page.locator("#chapters .zone .katex").first()).toBeVisible();
  expect(await noSidewaysScroll(page)).toBe(true);
});
