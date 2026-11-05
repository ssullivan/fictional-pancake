// Math facts (facts/): the main page links to it, the hub links to each operation, and Quick Pick plays with real clicks and
// taps: right answers move on by themselves, a wrong one shows the answer and brings the fact back soon, the hint helps,
// tables and sets are saved, the fact map opens a fact to practice, and Stop shows a summary. Factors are found by tapping
// or typing each one, then Done, and prime or composite by picking the word. No page scrolls sideways.
const { test, expect } = require("./fixtures");

// a fact as the page writes it, solved: "7 + 8 = ?", "7 + ? = 15", or "? + 8 = 15" → {a, sign, b, value: the number asked for}
function solve(text) {
  // a fraction to simplify: "6/8 = ?" asks for "3/4"; "6/8 = ?/4" asks for 3, and "6/8 = 3/?" for 4
  const fraction = text.match(/^(\d+)\/(\d+) = (\?|\d+)\/?(\?|\d+)?$/);
  if (fraction) {
    const [, a, b, top, bottom] = fraction,
      g = gcd(+a, +b),
      [n, d] = [a / g, b / g];
    return { a: +a, sign: "/", b: +b, value: top === "?" && !bottom ? `${n}/${d}` : top === "?" ? n : d };
  }
  const [, left, sign, right, result] = text.match(/(\d+|\?) ([+−×÷]) (\d+|\?) = (\d+|\?)/),
    apply = (x, y) => (sign === "+" ? x + y : sign === "−" ? x - y : sign === "×" ? x * y : x / y);
  if (result === "?") return { a: +left, sign, b: +right, value: apply(+left, +right) };
  const total = +result;
  if (left === "?") {
    const a = { "+": total - right, "−": total + +right, "×": total / right, "÷": total * right }[sign];
    return { a, sign, b: +right, value: a };
  }
  const b = { "+": total - left, "−": left - total, "×": total / left, "÷": left / total }[sign];
  return { a: +left, sign, b, value: b };
}
// the greatest common factor
const gcd = (x, y) => (y ? gcd(y, x % y) : x);
// the number to tap for a fact as the page writes it
const answerOf = (text) => solve(text).value;
// the fact, the same either way round: "8 × 7" and "7 × 8" are one fact, and a hidden number doesn't change it
const factOf = (text) => {
  const { a, sign, b } = solve(text);
  return sign === "×" ? `${Math.min(a, b)}×${Math.max(a, b)}` : `${a}${sign}${b}`;
};
// a fresh start on a page, with no saved progress
async function fresh(page, path) {
  await page.goto("facts/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("about:blank");
  await page.goto(path);
}
const noSideways = (page) =>
  expect(page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).resolves.toBe(true);

test("the main page and the hub link to every operation", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: /Math Facts/ }).click();
  await expect(page.locator("h1")).toHaveText("Math Facts");
  for (const [name, hash] of [
    ["Addition", "add"],
    ["Subtraction", "sub"],
    ["Multiplication", "mult"],
    ["Division", "div"],
    ["Simplifying Fractions", "simp"],
    ["Factors", "fac"],
  ])
    await expect(page.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", `practice.html#${hash}`);
  await noSideways(page);
});

for (const op of ["add", "sub", "mult", "div", "simp"]) {
  test(`Quick Pick ${op}: 30 right answers in a row`, async ({ page, hasTouch }) => {
    const press = (loc) => (hasTouch ? loc.tap() : loc.click());
    await fresh(page, `facts/practice.html#${op}`);
    await press(page.getByRole("button", { name: "Start" }));
    let last = null;
    for (let i = 0; i < 30; i++) {
      // wait for a new fact (a right answer moves on by itself)
      await expect(page.locator("#fact")).not.toHaveText(last || "", { timeout: 5000 });
      await expect(page.locator(".choice:not(:disabled)")).toHaveCount(4);
      const text = await page.locator("#fact").textContent(),
        values = await page.locator(".choice").allTextContents();
      expect(new Set(values).size, `${text}: ${values}`).toBe(4);
      expect(
        values.filter((v) => v === String(answerOf(text))),
        `${text}: ${values}`,
      ).toHaveLength(1);
      if (factOf(text) === (last && factOf(last))) throw new Error(`${text} twice in a row`);
      await press(page.locator(".choice", { hasText: new RegExp(`^${answerOf(text)}$`) }));
      // "= 15", "= 3/4", or "is already simplest" for a fraction that doesn't simplify
      await expect(page.locator(".fb.good")).toContainText(
        `${text.startsWith(`${answerOf(text)} =`) ? "is already simplest" : `= ${answerOf(text)}`}`,
      );
      last = text;
    }
    await expect(page.locator("#right")).toHaveText("30");
    await expect(page.locator("#streak")).toContainText("30");
    await noSideways(page);
  });
}

test("a wrong answer shows the answer and how, and the fact comes back within 5", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#mult");
  await press(page.getByRole("button", { name: "Start" }));
  const text = await page.locator("#fact").textContent(),
    answer = answerOf(text);
  await press(
    page
      .locator(".choice")
      .filter({ hasNotText: new RegExp(`^${answer}$`) })
      .first(),
  );
  await expect(page.locator(".fb.bad h4")).toContainText(`= ${answer}`);
  await expect(page.locator(".choice.yes")).toHaveText(String(answer));
  await expect(page.locator("#streak")).toContainText("0");
  let back = false;
  for (let i = 0; i < 5 && !back; i++) {
    const before = await page.locator("#fact").textContent();
    if (await page.locator("#nextBtn").count()) await press(page.locator("#nextBtn"));
    await expect(page.locator("#fact")).not.toHaveText(before, { timeout: 5000 });
    const now = await page.locator("#fact").textContent();
    back = factOf(now) === factOf(text);
    await press(page.locator(".choice", { hasText: new RegExp(`^${answerOf(now)}$`) }));
    if (!back) await expect(page.locator(".fb.good")).toBeVisible();
  }
  expect(back, `${text} came back`).toBe(true);
  // Stop: the summary lists it to work on
  await press(page.getByRole("button", { name: "← Stop" }));
  await expect(page.locator("#summary")).toBeVisible();
  await expect(page.locator(".worklist")).toContainText(`= ${answer}`);
  await press(page.getByRole("button", { name: "Keep going" }));
  await expect(page.locator("#play")).toBeVisible();
});

test("the hint shows how without the answer", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#add");
  await press(page.getByRole("button", { name: "Start" }));
  await press(page.getByRole("button", { name: "Show me how" }));
  await expect(page.locator("#hint")).toBeVisible();
  await expect(page.getByRole("button", { name: "Show me how" })).toBeDisabled();
  await noSideways(page);
});

test("tables and sets are saved, and Start needs at least one table", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#mult");
  await expect(page.getByRole("button", { name: "Times 7" })).toHaveAttribute("aria-pressed", "false");
  await press(page.getByRole("button", { name: "Clear" }));
  await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
  await expect(page.locator("#known")).toHaveText("Pick at least one table.");
  await press(page.getByRole("button", { name: "Times 7" }));
  await press(page.getByRole("button", { name: "Times 12" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 25 facts.");
  await page.reload();
  await expect(page.getByRole("button", { name: "Times 12" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Times 2" })).toHaveAttribute("aria-pressed", "false");
  await press(page.getByRole("button", { name: "All tables" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 91 facts.");
  // addition: the set is saved too
  await page.goto("about:blank");
  await page.goto("facts/practice.html#add");
  await press(page.getByRole("button", { name: "Sums within 10" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 66 facts.");
  await page.reload();
  await expect(page.getByRole("button", { name: "Sums within 10" })).toHaveAttribute("aria-pressed", "true");
  await noSideways(page);
});

test("the fact map shows a fact, practices it, and colors what's known", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#mult");
  await expect(page.locator(".fm")).toHaveCount(169);
  await press(page.locator('.fm[data-a="7"][data-b="8"]'));
  await expect(page.locator("#mapInfo")).toContainText("7 × 8 = 56");
  await expect(page.locator("#mapInfo")).toContainText("Not tried yet");
  await press(page.getByRole("button", { name: "Practice this fact" }));
  // it's dealt first, and about one in three after; answer it right 3 times
  for (let done = 0, i = 0; done < 3 && i < 12; i++) {
    const text = await page.locator("#fact").textContent();
    if (factOf(text) === "7×8") done++;
    await press(page.locator(".choice", { hasText: new RegExp(`^${answerOf(text)}$`) }));
    await expect(page.locator("#fact")).not.toHaveText(text, { timeout: 5000 });
  }
  await press(page.getByRole("button", { name: "← Stop" }));
  await press(page.getByRole("button", { name: "Change facts" }));
  // 7 × 8 and 8 × 7 are one fact, both known
  await expect(page.locator('.fm[data-a="7"][data-b="8"]')).toHaveClass(/known/);
  await expect(page.locator('.fm[data-a="8"][data-b="7"]')).toHaveClass(/known/);
  await noSideways(page);
});

test("division: tables from 1 to 12, and a map of every fact", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#div");
  await expect(page.locator("h1")).toContainText("Division");
  await expect(page.getByRole("button", { name: "Divided by 0" })).toHaveCount(0);
  await press(page.getByRole("button", { name: "Clear" }));
  await press(page.getByRole("button", { name: "Divided by 7" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 13 facts.");
  await expect(page.locator(".fm")).toHaveCount(156);
  await expect(page.locator(".fm:not(.out)")).toHaveCount(13);
  await press(page.locator('.fm[data-a="56"][data-b="7"]'));
  await expect(page.locator("#mapInfo")).toContainText("56 ÷ 7 = 8");
  await expect(page.locator("#mapInfo")).toContainText("Think multiplication: 7 × ? = 56.");
  await noSideways(page);
});

for (const op of ["add", "sub", "mult", "div", "simp"])
  test(`missing numbers ${op}: 15 facts, each hiding a number`, async ({ page, hasTouch }) => {
    const press = (loc) => (hasTouch ? loc.tap() : loc.click());
    await fresh(page, `facts/practice.html#${op}`);
    await press(page.locator("#show [data-m='missing']"));
    await expect(page.locator("#show [data-m='missing']")).toHaveAttribute("aria-pressed", "true");
    await press(page.getByRole("button", { name: "Start" }));
    let last = "";
    for (let i = 0; i < 15; i++) {
      await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
      const text = await page.locator("#fact").textContent(),
        { a, sign, b, value } = solve(text);
      // a hidden number, unless the fact can't hide one (times 0, or a fraction already simplest)
      if (!(sign === "×" && (a === 0 || b === 0)) && !(sign === "÷" && a === 0) && !(sign === "/" && gcd(a, b) === 1))
        expect(text).not.toMatch(/= \?$/);
      await press(page.locator(".choice", { hasText: new RegExp(`^${value}$`) }));
      // the worked answer: a fraction already simplest is said to be, rather than written as an equation
      await expect(page.locator(".fb.good")).toContainText(
        sign !== "/" ? `${a} ${sign} ${b} = ` : gcd(a, b) === 1 ? `${a}/${b} is already simplest` : `${a}/${b} = `,
      );
      last = text;
    }
    await noSideways(page);
  });

test("Type it: the number pad, delete, a wrong answer, and a real keyboard", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  // tap each digit of n on the pad
  const padType = async (n) => {
    for (const digit of String(n)) await press(page.locator(`.pad [data-key="${digit}"]`));
  };
  await fresh(page, "facts/practice.html#mult");
  await press(page.locator("#input [data-m='type']"));
  await press(page.getByRole("button", { name: "Start" }));
  await expect(page.locator(".pad button")).toHaveCount(12);
  await expect(page.locator(".choice")).toHaveCount(0);
  // Go with nothing typed does nothing; delete takes a digit off
  await press(page.getByRole("button", { name: "Go" }));
  await expect(page.locator("#feedback")).toBeEmpty();
  await padType(98);
  await press(page.getByRole("button", { name: "Delete" }));
  await expect(page.locator("#typed")).toHaveText("9");
  await press(page.getByRole("button", { name: "Delete" }));
  await expect(page.locator("#typed")).toHaveText("?");
  // 10 right on the pad
  let last = "";
  for (let i = 0; i < 10; i++) {
    await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
    const text = await page.locator("#fact").textContent();
    await padType(answerOf(text));
    await expect(page.locator("#typed")).toHaveText(String(answerOf(text)));
    await press(page.getByRole("button", { name: "Go" }));
    await expect(page.locator("#typed")).toHaveClass(/yes/);
    last = text;
  }
  await expect(page.locator("#right")).toHaveText("10");
  // a wrong answer says what was typed, and the keys stop working until Next
  await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
  const text = await page.locator("#fact").textContent(),
    wrong = answerOf(text) + 1;
  await padType(wrong);
  await press(page.getByRole("button", { name: "Go" }));
  await expect(page.locator("#typed")).toHaveClass(/no/);
  await expect(page.locator(".fb.bad")).toContainText(`You typed ${wrong}.`);
  await expect(page.getByRole("button", { name: "Go" })).toBeDisabled();
  await press(page.getByRole("button", { name: "Next fact →" }));
  // a real keyboard (on a desktop): digits, Backspace, and Enter
  if (!hasTouch)
    for (let i = 0; i < 5; i++) {
      const now = await page.locator("#fact").textContent();
      // an extra digit to delete, when the answer leaves room for one (3 digits at most, and a 0 is replaced, not added to)
      const extra = answerOf(now) > 0 && answerOf(now) < 100;
      await page.keyboard.type(`${answerOf(now)}${extra ? 7 : ""}`);
      if (extra) await page.keyboard.press("Backspace");
      await page.keyboard.press("Enter");
      await expect(page.locator("#typed")).toHaveClass(/yes/);
      await expect(page.locator("#fact")).not.toHaveText(now, { timeout: 5000 });
    }
  // the choice is saved
  await page.reload();
  await expect(page.locator("#input [data-m='type']")).toHaveAttribute("aria-pressed", "true");
  await noSideways(page);
});

test("a 1-minute sprint: the clock, best scores for each set, and practicing what was missed", async ({
  page,
  hasTouch,
}) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  // answer the fact on screen: right, or one more than right; then let the next one come
  const answerIt = async (right) => {
    const text = await page.locator("#fact").textContent(),
      value = answerOf(text) + (right ? 0 : 1);
    await press(page.locator(".choice", { hasText: new RegExp(`^${value}$`) }));
    await page.clock.runFor(right ? 300 : 1000);
    return text;
  };
  await page.clock.install();
  await fresh(page, "facts/practice.html#add");
  await expect(page.locator("#sprintBest")).toHaveText("How many can you get right in 1 minute? Try a sprint.");
  await press(page.getByRole("button", { name: "1-minute sprint" }));
  await expect(page.locator("#sprintTime")).toHaveText("60 seconds");
  await expect(page.getByRole("button", { name: "Show me how" })).toBeHidden();
  for (let i = 0; i < 5; i++) await answerIt(true);
  const missed = await answerIt(false);
  await page.clock.runFor(30000);
  await expect(page.locator("#sprintTime")).not.toHaveText("60 seconds");
  await page.clock.runFor(30000);
  await expect(page.locator("#summary")).toBeVisible();
  await expect(page.locator("#sumRight")).toHaveText("5 right in 1 minute");
  await expect(page.locator("#sumMsg")).toHaveText("Your first sprint best for these facts!");
  await expect(page.locator(".worklist")).toContainText(String(answerOf(missed)));
  // practice just the missed fact
  await press(page.getByRole("button", { name: "Practice these" }));
  await expect(page.locator("#sprintBar")).toBeHidden();
  expect(factOf(await page.locator("#fact").textContent())).toBe(factOf(missed));
  await press(page.getByRole("button", { name: "← Stop" }));
  await press(page.getByRole("button", { name: "Change facts" }));
  await expect(page.locator("#sprintBest")).toHaveText("Sprint best for these facts: 5 right in 1 minute.");
  // a worse sprint doesn't change the best
  await press(page.getByRole("button", { name: "1-minute sprint" }));
  await answerIt(true);
  await page.clock.runFor(60000);
  await expect(page.locator("#sumMsg")).toHaveText("Your best for these facts is 5.");
  // a sprint stopped early doesn't count
  await press(page.getByRole("button", { name: "Sprint again" }));
  for (let i = 0; i < 7; i++) await answerIt(true);
  await press(page.getByRole("button", { name: "← Stop" }));
  await expect(page.locator("#sumMsg")).toContainText("doesn’t count toward your best");
  // each set has its own best, kept after a reload
  await press(page.getByRole("button", { name: "Change facts" }));
  await press(page.getByRole("button", { name: "Sums within 10" }));
  await expect(page.locator("#sprintBest")).toHaveText("How many can you get right in 1 minute? Try a sprint.");
  await press(page.getByRole("button", { name: "Sums within 20" }));
  await page.reload();
  await expect(page.locator("#sprintBest")).toHaveText("Sprint best for these facts: 5 right in 1 minute.");
  await noSideways(page);
});

test("simplifying fractions: sets, the map, a fraction already simplest, and typing a fraction", async ({
  page,
  hasTouch,
}) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#simp");
  await expect(page.locator("h1")).toHaveText("Simplifying fractions");
  // the sets and their maps: a triangle of fractions less than 1, or hundredths 1 to 99
  await expect(page.locator("#known")).toHaveText("You know 0 of these 25 facts.");
  await expect(page.locator(".fm")).toHaveCount(66);
  await press(page.getByRole("button", { name: "Denominators up to 24" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 116 facts.");
  await expect(page.locator(".fm")).toHaveCount(276);
  await press(page.getByRole("button", { name: "Hundredths" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 71 facts.");
  await expect(page.locator(".fm")).toHaveCount(99);
  await press(page.locator('.fm[data-a="75"][data-b="100"]'));
  await expect(page.locator("#mapInfo")).toContainText("75/100 = 3/4");
  await expect(page.locator("#mapInfo")).toContainText("The greatest number that divides both 75 and 100 is 25.");
  await press(page.getByRole("button", { name: "Denominators up to 12" }));
  // a fraction already in simplest form says so
  await press(page.locator('.fm[data-a="5"][data-b="8"]'));
  await expect(page.locator("#mapInfo")).toContainText("5/8 is already simplest");
  // type a fraction: a number, /, a number, Go; an equal one that isn't simplest is wrong, and says so
  await press(page.locator("#input [data-m='type']"));
  await press(page.getByRole("button", { name: "Start" }));
  const padType = async (text) => {
    for (const key of text) await press(page.locator(`.pad [data-key="${key}"]`));
  };
  let last = "";
  for (let i = 0; i < 8; i++) {
    await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
    const text = await page.locator("#fact").textContent(),
      { a, b, value } = solve(text);
    // the first one: Go does nothing without a bottom number; then try it unsimplified (when it simplifies)
    if (i === 0) {
      await padType(String(a));
      await press(page.getByRole("button", { name: "Go" }));
      await expect(page.locator("#feedback")).toBeEmpty();
      await press(page.getByRole("button", { name: "Fraction bar" }));
      await padType(String(b));
      await expect(page.locator("#typed")).toHaveText(`${a}/${b}`);
      await press(page.getByRole("button", { name: "Go" }));
      if (value === `${a}/${b}`) await expect(page.locator(".fb.good")).toContainText("is already simplest");
      else {
        await expect(page.locator(".fb.bad")).toContainText("but not simplest: divide again");
        await press(page.getByRole("button", { name: "Next fact →" }));
      }
    } else {
      await padType(value.replace("/", "/"));
      await press(page.getByRole("button", { name: "Go" }));
      await expect(page.locator("#typed")).toHaveClass(/yes/);
    }
    last = text;
  }
  await noSideways(page);
});

// the factors of n, smallest first
const factorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
// the number a factor fact is about: "Factors of 24" or "24: prime or composite?" → 24
const numberOf = (text) => +text.match(/\d+/)[0];

test("factors: sets, the map, and finding every factor by tapping", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#fac");
  await expect(page.locator("h1")).toHaveText("Factors and primes");
  await expect(page.locator("#known")).toHaveText("You know 0 of these 23 facts.");
  await expect(page.locator(".fm")).toHaveCount(23);
  await press(page.getByRole("button", { name: "Up to 100" }));
  await expect(page.locator("#known")).toHaveText("You know 0 of these 99 facts.");
  await expect(page.locator(".fm")).toHaveCount(99);
  await press(page.locator('.fm[data-a="36"]'));
  await expect(page.locator("#mapInfo")).toContainText("Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36 (composite)");
  await expect(page.locator("#mapInfo")).toContainText("Stop at 7: 7 × 7 = 49 is more than 36");
  await press(page.getByRole("button", { name: "Up to 24" }));
  await press(page.getByRole("button", { name: "Start" }));
  // Done with nothing tried does nothing
  await press(page.getByRole("button", { name: "Done" }));
  await expect(page.locator("#feedback")).toBeEmpty();
  let last = "";
  for (let i = 0; i < 10; i++) {
    await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
    const text = await page.locator("#fact").textContent(),
      n = numberOf(text);
    expect(text).toBe(`Factors of ${n}`);
    await expect(page.locator(".fgrid button")).toHaveCount(n);
    await expect(page.locator("#pairs")).toHaveText("No factors yet");
    // tap the smaller factor of each pair: its partner fills in
    for (const d of factorsOf(n).filter((d) => d * d <= n)) await press(page.locator(`.fgrid [data-n="${d}"]`));
    await expect(page.locator(".fgrid button.yes")).toHaveCount(factorsOf(n).length);
    await expect(page.locator("#pairs")).toContainText(`1 × ${n}`);
    // a partner tapped again is already on the list
    await press(page.locator(`.fgrid [data-n="${n}"]`));
    await expect(page.locator("#tryNote")).toHaveText(`${n} is already on your list.`);
    await press(page.getByRole("button", { name: "Done" }));
    await expect(page.locator(".fb.good")).toContainText(`Factors of ${n}: ${factorsOf(n).join(", ")}`);
    last = text;
  }
  await expect(page.locator("#right")).toHaveText("10");
  await noSideways(page);
});

test("factors: a wrong tap says why, Done too early shows what's missing, and the fact comes back", async ({
  page,
  hasTouch,
}) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  // answer the factor fact on screen right: the smaller factor of each pair, then Done
  const findAll = async () => {
    const n = numberOf(await page.locator("#fact").textContent());
    for (const d of factorsOf(n).filter((d) => d * d <= n)) await press(page.locator(`.fgrid [data-n="${d}"]`));
    await press(page.getByRole("button", { name: "Done" }));
    await expect(page.locator(".fb.good")).toBeVisible();
  };
  await fresh(page, "facts/practice.html#fac");
  await press(page.getByRole("button", { name: "Up to 100" }));
  await press(page.locator('.fm[data-a="96"]'));
  await press(page.getByRole("button", { name: "Practice this fact" }));
  await expect(page.locator("#fact")).toHaveText("Factors of 96");
  await expect(page.locator(".fgrid button")).toHaveCount(96);
  await noSideways(page);
  // the hint says how without the factors (or a rainbow)
  await press(page.getByRole("button", { name: "Show me how" }));
  await expect(page.locator("#hint")).toContainText("Stop once a number times itself is more than 96.");
  await expect(page.locator("#hint svg")).toHaveCount(0);
  // a number that isn't a factor says why, once
  await press(page.locator('.fgrid [data-n="5"]'));
  await expect(page.locator("#tryNote")).toHaveText("5 × 19 = 95 and 5 × 20 = 100: no number times 5 makes 96.");
  await expect(page.locator("#tryNote")).toHaveClass(/bad/);
  await expect(page.locator('.fgrid [data-n="5"]')).toHaveClass(/no/);
  await press(page.locator('.fgrid [data-n="5"]'));
  await expect(page.locator("#tryNote")).toHaveText("You already tried 5.");
  // Done after only 1 × 96: what's still to find, and what isn't a factor
  await press(page.locator('.fgrid [data-n="1"]'));
  await expect(page.locator("#pairs")).toHaveText("1 × 96");
  await press(page.getByRole("button", { name: "Done" }));
  await expect(page.locator(".fb.bad")).toContainText("Still to find: 2, 3, 4, 6, 8, 12, 16, 24, 32, 48.");
  await expect(page.locator(".fb.bad")).toContainText("Not factors of 96: 5.");
  await expect(page.locator(".fb.bad svg")).toBeVisible();
  await expect(page.locator(".fgrid .miss")).toHaveCount(10);
  await expect(page.locator(".fgrid button:not(:disabled)")).toHaveCount(0);
  await expect(page.locator("#streak")).toContainText("0");
  // it comes back (it's the fact being practiced, too), and is right this time
  await press(page.getByRole("button", { name: "Next fact →" }));
  let back = false;
  for (let i = 0; i < 5 && !back; i++) {
    const text = await page.locator("#fact").textContent();
    back = text === "Factors of 96";
    await findAll();
    await expect(page.locator("#fact")).not.toHaveText(text, { timeout: 5000 });
  }
  expect(back, "Factors of 96 came back").toBe(true);
  await press(page.getByRole("button", { name: "← Stop" }));
  await expect(page.locator(".worklist")).toContainText("Factors of 96: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96");
});

test("factors: prime or composite, and typing each factor", async ({ page, hasTouch }) => {
  const press = (loc) => (hasTouch ? loc.tap() : loc.click());
  await fresh(page, "facts/practice.html#fac");
  await press(page.getByRole("button", { name: "Up to 50" }));
  await press(page.locator("#show [data-m='missing']"));
  await press(page.getByRole("button", { name: "Start" }));
  let last = "";
  for (let i = 0; i < 10; i++) {
    await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
    const text = await page.locator("#fact").textContent(),
      n = numberOf(text),
      prime = factorsOf(n).length === 2;
    expect(text).toBe(`${n}: prime or composite?`);
    await expect(page.locator(".choice")).toHaveText(["Prime", "Composite"]);
    // the first one wrong: the reason, then Next
    const pickWord = i === 0 ? !prime : prime;
    await press(page.getByRole("button", { name: pickWord ? "Prime" : "Composite", exact: true }));
    if (i === 0) {
      await expect(page.locator(".fb.bad")).toContainText(prime ? "so it isn’t composite" : "so it isn’t prime");
      await press(page.getByRole("button", { name: "Next fact →" }));
    } else await expect(page.locator(".fb.good")).toContainText(`(${prime ? "prime" : "composite"})`);
    last = text;
  }
  // typing: prime or composite still shows the two words
  await press(page.getByRole("button", { name: "← Stop" }));
  await press(page.getByRole("button", { name: "Change facts" }));
  await press(page.locator("#input [data-m='type']"));
  await press(page.getByRole("button", { name: "Start" }));
  await expect(page.locator(".choice")).toHaveCount(2);
  await expect(page.locator(".pad")).toHaveCount(0);
  // finding factors by typing: each one, then Add; Done at the end
  await press(page.getByRole("button", { name: "← Stop" }));
  await press(page.getByRole("button", { name: "Change facts" }));
  await press(page.locator("#show [data-m='plain']"));
  await press(page.getByRole("button", { name: "Start" }));
  const padType = async (n) => {
    for (const digit of String(n)) await press(page.locator(`.pad [data-key="${digit}"]`));
  };
  last = "";
  for (let i = 0; i < 6; i++) {
    await expect(page.locator("#fact")).not.toHaveText(last, { timeout: 5000 });
    const text = await page.locator("#fact").textContent(),
      n = numberOf(text);
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
    // the first one: 0 and a number past n aren't factors (so it's missed)
    if (i === 0) {
      await padType(0);
      await press(page.getByRole("button", { name: "Add" }));
      await expect(page.locator("#tryNote")).toContainText("0 isn’t a factor");
      await padType(n + 1);
      await press(page.getByRole("button", { name: "Add" }));
      await expect(page.locator("#tryNote")).toHaveText(`${n + 1} is more than ${n}, so it can’t be a factor of ${n}.`);
      await expect(page.locator("#typed")).toHaveText("?");
    }
    // the smaller factor of each pair, on the pad (on a desktop after the first, a real keyboard)
    for (const d of factorsOf(n).filter((d) => d * d <= n))
      if (hasTouch || i === 0) {
        await padType(d);
        await press(page.getByRole("button", { name: "Add" }));
      } else {
        await page.keyboard.type(String(d));
        await page.keyboard.press("Enter");
      }
    await expect(page.locator("#pairs span")).toHaveCount(factorsOf(n).filter((d) => d * d <= n).length);
    await press(page.getByRole("button", { name: "Done" }));
    if (i === 0) {
      await expect(page.locator(".fb.bad")).toContainText(`Not factors of ${n}: 0, ${n + 1}.`);
      await expect(page.locator(".fb.bad")).not.toContainText("You typed");
      await press(page.getByRole("button", { name: "Next fact →" }));
    } else await expect(page.locator(".fb.good")).toContainText(`Factors of ${n}: ${factorsOf(n).join(", ")}`);
    last = text;
  }
  await expect(page.locator("#right")).toHaveText("5");
  await noSideways(page);
});
