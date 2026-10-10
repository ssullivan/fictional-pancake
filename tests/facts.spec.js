// Math facts (facts/): the main page links to it, the hub links to each operation, and Quick Pick plays with real clicks and
// taps: right answers move on by themselves, a wrong one shows the answer and brings the fact back soon, the hint helps,
// tables and sets are saved, the fact map opens a fact to practice, and Stop shows a summary. No page scrolls sideways.
const { test, expect } = require("./fixtures");

// the answer to a fact as the page writes it: "7 + 8 = ?" → 15
function answerOf(text) {
  const [, a, sign, b] = text.match(/(\d+) ([+−×]) (\d+)/);
  return sign === "+" ? +a + +b : sign === "−" ? a - b : a * b;
}
// the same fact either way round: "8 × 7" and "7 × 8" are one fact
const factOf = (text) => {
  const [, a, sign, b] = text.match(/(\d+) ([+−×]) (\d+)/);
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
  ])
    await expect(page.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", `practice.html#${hash}`);
  await noSideways(page);
});

for (const op of ["add", "sub", "mult"]) {
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
