// What every test shares: outside files (three.js, fonts) come from tools/.cache, the cache tools/snap.mjs keeps, so runs
// don't depend on the CDN; a page that throws fails the test; and tap(x, y) is a finger on a phone and a mouse click on a desktop.
const base = require("@playwright/test");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const CACHE = path.join(__dirname, "../tools/.cache");
exports.test = base.test.extend({
  page: async ({ page }, use) => {
    await page.route(/^https:\/\//, async (route) => {
      const url = route.request().url(),
        file = path.join(CACHE, createHash("sha1").update(url).digest("hex"));
      if (fs.existsSync(file)) {
        const { headers, body } = JSON.parse(fs.readFileSync(file, "utf8"));
        return route.fulfill({
          status: 200,
          headers: Object.fromEntries(headers.map((h) => [h.name, h.value])),
          body: Buffer.from(body, "base64"),
        });
      }
      /* not cached yet (as on CI): fetch it. A test can end before the file arrives, which closes its page and throws the
         response away; nothing is waiting for the file then, so that isn't an error */
      let res, body;
      try {
        res = await route.fetch();
        body = await res.body();
      } catch (e) {
        if (page.isClosed()) return;
        throw e;
      }
      if (res.status() === 200) {
        const headers = Object.entries(res.headers())
          .filter(([n]) => /^(content-type|access-control-allow-origin)$/i.test(n))
          .map(([name, value]) => ({ name, value }));
        fs.mkdirSync(CACHE, { recursive: true });
        fs.writeFileSync(file, JSON.stringify({ headers, body: body.toString("base64") }));
      }
      return route.fulfill({ status: res.status(), headers: res.headers(), body }).catch((e) => {
        if (!page.isClosed()) throw e;
      });
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await use(page);
    base.expect(errors, "errors thrown on the page").toEqual([]);
  },
  tap: async ({ page, hasTouch }, use) =>
    use((x, y) => (hasTouch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y))),
});
exports.expect = base.expect;
