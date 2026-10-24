/* The typed-math test game: limits and real-world checks for tools/fuzz.mjs. Answers may be negative numbers inside an expression
   (signed). check() rebuilds each answer from the problem's facts and confirms, with shared/expr.js, that it's equal: a(x + b) and
   (x + a)(x + b) multiplied out, (x + r)(x + s) multiplied out to the trinomial in the prompt, and y = mx + b. */
const vm = require("node:vm");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

/* shared/expr.js (and util.js, which it needs) in a context of their own */
const context = vm.createContext({});
for (const file of ["shared/util.js", "shared/expr.js"])
  vm.runInContext(readFileSync(join(__dirname, "../../..", file), "utf8").replace(/^(const|let) /gm, "var "), context);
const { Expr } = context;

module.exports = {
  signed: true,
  limits: {
    expand: { dp: 0, nz: 2, max: 42 },
    factor: { dp: 0, nz: 2, max: 36 },
    line: { dp: 0, nz: 1, max: 6 },
  },
  check(p, zoneId) {
    const facts = p.facts,
      bad = [];
    const expected =
      facts.m !== undefined
        ? `y=${facts.m}x+${facts.b}`
        : facts.r !== undefined
          ? `(x+${facts.r})(x+${facts.s})`
          : facts.two
            ? `(x+${facts.a})(x+${facts.b})`
            : `${facts.a}(x+${facts.b})`;
    if (!Expr.same(p.answer, expected, p.vars)) bad.push(`answer ${p.answer} isn't ${expected}`);
    /* the trinomial in the prompt is (x + r)(x + s) multiplied out */
    if (facts.r !== undefined) {
      const shown = p.prompt.match(/\\\((.*)\\\)/)[1].replace(/\\[a-z]+|[{}]/g, "");
      if (!Expr.same(shown, expected, p.vars)) bad.push(`the prompt's ${shown} isn't ${expected}`);
    }
    return bad;
  },
};
