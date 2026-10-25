// Learn widgets moved by dragging a flat (SVG) shape: with a mouse on a desktop, a finger on a phone, and the keyboard.
const { test, expect } = require("./fixtures");

// drag from (x, y) by (dx, dy) in small moves, like a hand would; a phone gets real touch events
async function drag(page, hasTouch, x, y, dx, dy) {
  if (!hasTouch) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 10 });
    await page.mouse.up();
    return;
  }
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, px, py) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: px, y: py }] });
  await touch("touchStart", x, y);
  for (let i = 1; i <= 10; i++) await touch("touchMove", x + (dx * i) / 10, y + (dy * i) / 10);
  await touch("touchEnd");
}

test("Polygons: drag the hole anywhere in the triangle, and the shaded area stays the same", async ({
  page,
  hasTouch,
}) => {
  await page.goto("grade6/unit1/learn/polygons.html#s3");
  const readout = page.locator(".readout").first(),
    hole = () => page.locator("[data-hole] .hole").boundingBox();
  await expect(readout).toContainText("Base: 5 + 2 + 5 = 12.");
  const a = await hole(),
    unit = a.width / 2,
    y0 = await page.evaluate(() => scrollY);
  // one square up and one to the right
  await drag(page, hasTouch, a.x + a.width / 2, a.y + a.height / 2, unit, -unit);
  const b = await hole();
  expect(Math.abs(b.x - a.x - unit), "moved one square right").toBeLessThan(unit / 4);
  expect(Math.abs(a.y - b.y - unit), "moved one square up").toBeLessThan(unit / 4);
  await expect(readout).toContainText("The hole moved, but the shaded area is still 32.");
  await expect(readout).toContainText("Shaded: 36 − 4 = 32 square units.");
  expect(await page.evaluate(() => scrollY), "the page scrolled while dragging").toBe(y0);
  // dragged far past the right side, it stops at the last spot inside, back on the base
  await drag(page, hasTouch, b.x + b.width / 2, b.y + b.height / 2, 8 * unit, 3 * unit);
  await expect(page.getByRole("button", { name: "Move the hole right" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Move the hole down" })).toBeDisabled();
  await expect(readout).toContainText("Shaded: 36 − 4 = 32 square units.");
  // a drag that starts off the hole doesn't move it
  const c = await hole();
  await drag(page, hasTouch, c.x - 3 * unit, c.y + c.height / 2, -2 * unit, 0);
  expect(Math.abs((await hole()).x - c.x), "a drag off the hole left it alone").toBeLessThan(unit / 4);
});

test("Polygons: the hole moves with the arrow keys and keeps focus", async ({ page }) => {
  await page.goto("grade6/unit1/learn/polygons.html#s3");
  const readout = page.locator(".readout").first();
  await page.locator("[data-hole]").focus();
  const a = await page.locator("[data-hole] .hole").boundingBox();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowUp");
  const b = await page.locator("[data-hole] .hole").boundingBox();
  expect(b.x).toBeLessThan(a.x);
  expect(b.y).toBeLessThan(a.y);
  await expect(page.locator("[data-hole]")).toBeFocused();
  await expect(readout).toContainText("The hole moved, but the shaded area is still 32.");
  // up as far as it goes: the arrow key does nothing more
  for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("button", { name: "Move the hole up" })).toBeDisabled();
});

test("Finding the height: draw a height by tapping near grid points", async ({ page, hasTouch }) => {
  await page.goto("grade6/unit1/learn/heights.html#s2");
  const readout = page.locator(".readout").first(),
    point = (xy) => page.locator(`[data-pt="${xy}"]`).boundingBox(),
    y0 = await page.evaluate(() => scrollY);
  // a tap a little off a grid point still lands on it: each point's target is a whole grid square
  const press = async (xy, dx, dy) => {
    const b = await point(xy),
      x = b.x + b.width / 2 + dx,
      y = b.y + b.height / 2 + dy;
    if (hasTouch) await page.touchscreen.tap(x, y);
    else await page.mouse.click(x, y);
  };
  const square = (await point("1,0")).x - (await point("0,0")).x;
  await press("2,5", square / 3, -square / 3);
  await expect(readout).toContainText("Now tap the other end.");
  await press("2,0", -square / 3, square / 4);
  await expect(readout).toContainText("That’s the height: from the top corner, square to the base. It’s 5 units.");
  await expect(page.locator("#widget .hgt")).toHaveCount(1);
  // a wrong one replaces it and says what went wrong
  await press("2,5", 0, 0);
  await press("0,0", square / 4, 0);
  await expect(readout).toContainText("That’s a side of the shape.");
  await expect(page.locator("#widget .hbad")).toHaveCount(1);
  await expect(page.locator("#widget .hgt")).toHaveCount(0);
  expect(await page.evaluate(() => scrollY), "the page scrolled while tapping").toBe(y0);
});

test("Finding the height: draw a height with the arrow keys and Enter", async ({ page }) => {
  await page.goto("grade6/unit1/learn/heights.html#s3");
  const readout = page.locator(".readout").first(),
    grid = page.locator("#widget [data-f]");
  await grid.focus();
  // the first key shows the ring in the middle of the grid, (4, 3) on a 7 × 5 grid (rounded up), without moving it
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#widget .cursor")).toHaveCount(1);
  for (const key of ["ArrowRight", "ArrowRight", "ArrowUp"]) await page.keyboard.press(key);
  await page.keyboard.press("Enter");
  await expect(readout).toContainText("Now tap the other end.");
  // down past the bottom of the grid: the ring stops at the base line
  for (let i = 0; i < 7; i++) await page.keyboard.press("ArrowDown");
  await page.keyboard.press(" ");
  await expect(readout).toContainText("It lands outside the triangle, on the base line extended.");
  await expect(grid).toBeFocused();
  // the ring goes away when the grid loses focus
  await page.getByRole("button", { name: "Show me" }).focus();
  await expect(page.locator("#widget .cursor")).toHaveCount(0);
});
