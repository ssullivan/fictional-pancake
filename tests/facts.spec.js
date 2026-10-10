// Math facts (facts/): the main page links to it, the hub links to each operation, and Quick Pick plays with real clicks and
// taps: right answers move on by themselves, a wrong one shows the answer and brings the fact back soon, the hint helps,
// tables and sets are saved, the fact map opens a fact to practice, and Stop shows a summary. No page scrolls sideways.
const { test, expect } = require("./fixtures");

// a fact as the page writes it, solved: "7 + 8 = ?", "7 + ? = 15", or "? + 8 = 15" → {a, sign, b, value: the number asked for}
function solve(text) {
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
  ])
    await expect(page.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", `practice.html#${hash}`);
  await noSideways(page);
});

for (const op of ["add", "sub", "mult", "div"]) {
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
        values.filter((v) => +v === answerOf(text)),
        `${text}: ${values}`,
      ).toHaveLength(1);
      if (factOf(text) === (last && factOf(last))) throw new Error(`${text} twice in a row`);
      await press(page.locator(".choice", { hasText: new RegExp(`^${answerOf(text)}$`) }));
      await expect(page.locator(".fb.good")).toContainText(`= ${answerOf(text)}`);
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

for (const op of ["add", "sub", "mult", "div"])
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
      // a hidden number, unless the fact can't hide one (times 0)
      if (!(sign === "×" && (a === 0 || b === 0)) && !(sign === "÷" && a === 0)) expect(text).not.toMatch(/= \?$/);
      await press(page.locator(".choice", { hasText: new RegExp(`^${value}$`) }));
      await expect(page.locator(".fb.good")).toContainText(`${a} ${sign} ${b} = `);
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
      // an extra digit to delete, when the answer leaves room for one (3 digits at most)
      const extra = answerOf(now) < 100;
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
