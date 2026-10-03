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
