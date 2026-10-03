// Every item in every unit's learn/CHECKLIST.md, as a test: open the item's step, then run its script (the part in
// backticks). The commands are listed in tools/checklists.mjs.
const { test, expect } = require("./fixtures");
const { globSync, readFileSync } = require("node:fs");
const { dirname } = require("node:path");

const ROOT = `${__dirname}/..`;
const pattern = (t) => {
  const m = t.match(/^\/(.*)\/$/);
  return m ? new RegExp(m[1]) : t;
};

for (const file of globSync("grade*/unit*/learn/CHECKLIST.md", { cwd: ROOT }).sort()) {
  const unit = dirname(dirname(file));
  let chapter = null,
    step = null;
  for (const line of readFileSync(`${ROOT}/${file}`, "utf8").split("\n")) {
    let m;
    if ((m = line.match(/^## Chapter \d+: .* · `learn\/([\w-]+)\.html`/))) chapter = m[1];
    else if ((m = line.match(/^### Step (\d+):/))) step = +m[1];
    else if ((m = line.match(/^- \[[ x]\] (.*): `([^`]+)`$/))) {
      const [, what, script] = m,
        at = `${unit}/learn/${chapter}.html#s${step}`,
        n0 = step;
      test(`${unit} ${chapter} step ${step}: ${what}`, async ({ page, tap, hasTouch }) => {
        const press = (loc) => (hasTouch ? loc.tap() : loc.click());
        await page.goto(at);
        await expect(page.locator("#snum")).toHaveText(new RegExp(`^Step ${n0} of`));
        const w = page.locator("#widget");
        // a button or link by its accessible name: in the widget if it's there, or anywhere on the page
        const button = async (name) => {
          const inW = w.getByRole("button", { name, exact: true });
          return (await inW.count())
            ? inW.first()
            : page
                .getByRole("button", { name, exact: true })
                .or(page.getByRole("link", { name, exact: true }))
                .first();
        };
        for (const cmd of script.split(/;\s+/)) {
          const [, verb, rest] = cmd.match(/^(\w+)\s+(.*)$/) || [];
          const [arg, times] = (rest.match(/^(.*?)\s+×(\d+)$/) || [null, rest, "1"]).slice(1);
          const n = +times;
          if (verb === "click") for (let i = 0; i < n; i++) await press(await button(arg));
          else if (verb === "tap")
            for (let i = 0; i < n; i++) {
              const r = await w
                .locator(arg)
                .first()
                .evaluate((e) => {
                  e.scrollIntoView({ block: "center" });
                  const b = e.getBoundingClientRect();
                  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
                });
              await tap(r.x, r.y);
            }
          else if (verb === "slide") {
            const [name, v] = arg.split(/\s+=\s+/);
            await w.getByRole("slider", { name }).fill(v);
          } else if (verb === "see") await expect(w, cmd).toContainText(pattern(arg));
          else if (verb === "nosee") await expect(w, cmd).not.toContainText(pattern(arg));
          else if (verb === "pressed") await expect(await button(arg), cmd).toHaveAttribute("aria-pressed", "true");
          else if (verb === "enabled") await expect(await button(arg), cmd).toBeEnabled();
          else if (verb === "disabled") await expect(await button(arg), cmd).toBeDisabled();
          else if (verb === "count") {
            const [sel, k] = arg.split(/\s+=\s+/);
            await expect(w.locator(sel), cmd).toHaveCount(+k);
          } else if (verb === "read") await expect(page.locator("#sbody"), cmd).toContainText(pattern(arg));
          else if (verb === "answer") {
            const input = page.locator("#cin");
            if (await input.count()) {
              await input.fill(arg);
              await input.press("Enter");
            } else await press(page.locator(`#check .choice[data-c="${arg}"]`));
          } else if (verb === "feedback")
            await expect(page.locator("#check [data-fb]"), cmd).toContainText(pattern(arg));
          else if (verb === "spec") {
            const [, f, title] = arg.match(/^(\S+):\s+(.*)$/);
            expect(readFileSync(`${__dirname}/${f}`, "utf8"), cmd).toContain(title);
          } else throw new Error(`unknown checklist command: ${cmd}`);
        }
      });
    }
  }
}
