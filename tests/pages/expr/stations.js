/* Test page for typed math (tests/math.spec.js): the problem generators, station list, and icons of a small game whose answers are
   expressions and equations, typed in a MathBox (shared/mathbox.js) and judged by shared/expr.js. Not linked from the site.
   Loaded by index.html and by tools/fuzz.mjs. Every problem carries facts for checks.js: the numbers it was made from. */

/* a whole number from a to b that isn't 0 */
const nonzero = (a, b) => {
  const n = R(a, b);
  return n === 0 ? nonzero(a, b) : n;
};
/* an expr problem: named mistakes that come out equal to the answer, or repeat an earlier one, are left out */
function exprP(p) {
  const misc = (p.misc || []).filter(
    ([text], i, all) => !Expr.same(text, p.answer, p.vars) && all.findIndex(([other]) => other === text) === i,
  );
  return { kind: "expr", ...p, misc };
}

/* ---------- Station 1: multiply out a(x + b) or (x + a)(x + b) ---------- */
function genExpand() {
  /* a number times a sum: a(x + b) is ax + ab */
  if (Math.random() < 0.5) {
    const a = R(2, 6),
      b = nonzero(-7, 7);
    return exprP({
      prompt: `Multiply out ${math(Expr.tex(`${a}(x+${b})`))}.`,
      answer: `${a}x+${a * b}`,
      vars: ["x"],
      form: Expr.form.expanded,
      misc: [
        [`${a}x+${b}`, `Multiply ${a} by both terms in the parentheses, the ${b < 0 ? "−" : ""}${Math.abs(b)} too.`],
      ],
      hint: `${math(`${a}`)} multiplies ${math("x")} and multiplies ${math(`${b}`)}.`,
      explain: `${math(`${a} \\cdot x + ${a} \\cdot ${b < 0 ? `(${b})` : b} = ${Expr.tex(`${a}x+${a * b}`)}`)}`,
      facts: { a, b },
    });
  }
  /* two sums: (x + a)(x + b) is x² + (a + b)x + ab */
  const a = nonzero(-6, 6),
    b = nonzero(-6, 6);
  return exprP({
    prompt: `Multiply out ${math(Expr.tex(`(x+${a})(x+${b})`))}.`,
    answer: `x^2+${a + b}x+${a * b}`,
    vars: ["x"],
    form: Expr.form.expanded,
    misc: [
      [`x^2+${a * b}`, "Each term multiplies each term: there are two x terms in the middle."],
      [`x^2+${a + b}x+${a + b}`, `The number at the end is ${a} times ${b}.`],
    ],
    hint: `Multiply each term of ${math(Expr.tex(`x+${a}`))} by each term of ${math(Expr.tex(`x+${b}`))}: four products.`,
    explain: math(`${Expr.tex(`x^2+${a}x+${b}x+${a * b}`)} = ${Expr.tex(`x^2+${a + b}x+${a * b}`)}`),
    facts: { a, b, two: true },
  });
}

/* ---------- Station 2: factor x² + bx + c ---------- */
function genFactor() {
  /* r and s are the numbers in (x + r)(x + s); r + s isn't 0, so the sign mistake (x − r)(x − s) is a different expression */
  let r, s;
  do {
    r = nonzero(-6, 6);
    s = nonzero(-6, 6);
  } while (r + s === 0);
  const trinomial = `x^2+${r + s}x+${r * s}`;
  return exprP({
    prompt: `Factor ${math(Expr.tex(trinomial))}.`,
    answer: `(x+${r})(x+${s})`,
    vars: ["x"],
    form: Expr.form.factored,
    misc: [[`(x+${-r})(x+${-s})`, `Those multiply to ${r * s}, but add to ${-(r + s)}: check the signs.`]],
    hint: `Find two numbers that multiply to ${math(`${r * s}`)} and add to ${math(`${r + s}`)}.`,
    explain: `${math(`${r} \\cdot ${s < 0 ? `(${s})` : s} = ${r * s}`)} and ${math(`${r} + ${s < 0 ? `(${s})` : s} = ${r + s}`)}, so it’s ${math(Expr.tex(`(x+${r})(x+${s})`))}.`,
    facts: { r, s },
  });
}

/* ---------- Station 3: the equation of a line from its slope and y-intercept ---------- */
function genLine() {
  /* m and b differ, so the swapped equation y = bx + m is a different line */
  let m, b;
  do {
    m = nonzero(-5, 5);
    b = nonzero(-6, 6);
  } while (m === b);
  const answer = `y=${m}x+${b}`;
  return exprP({
    prompt: `A line has slope ${math(`${m}`)} and crosses the ${math("y")}-axis at ${math(`(0, ${b})`)}. Write its equation in the form ${math("y = mx + b")}.`,
    answer,
    vars: ["x", "y"],
    keys: ["x", "y", "=", "(", ")", "/"],
    placeholder: "like y = 2x + 1",
    form: Expr.form.slopeIntercept,
    misc: [[`y=${b}x+${m}`, "The slope multiplies x, and the y-intercept is added on."]],
    hint: `The slope is the number times ${math("x")}; the ${math("y")}-intercept is the number added.`,
    explain: `${math(`m = ${m}`)} and ${math(`b = ${b}`)}: ${math(Expr.tex(answer))}.`,
    facts: { m, b },
  });
}

const ZONES = [
  {
    id: "expand",
    name: "Multiply Out",
    lessons: "Test",
    blurb: `Multiply out ${math("a(x + b)")} and ${math("(x + a)(x + b)")}.`,
    gen: genExpand,
  },
  { id: "factor", name: "Factor", lessons: "Test", blurb: `Factor ${math("x^2 + bx + c")}.`, gen: genFactor },
  {
    id: "line",
    name: "Line Up",
    lessons: "Test",
    blurb: `Write ${math("y = mx + b")} from a slope and a ${math("y")}-intercept.`,
    gen: genLine,
  },
  {
    id: "boss",
    name: "All Together",
    lessons: "Test",
    blurb: "A mix of all three.",
    gen: () => pick([genExpand, genFactor, genLine])(),
  },
];

const ICON = {
  expand:
    '<text x="32" y="40" fill="#ffc93c" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">a(x+b)</text>',
  factor:
    '<text x="32" y="40" fill="#7fe3ff" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">(x+r)(x+s)</text>',
  line: '<path d="M8,52 L56,12" stroke="#ffc93c" stroke-width="4"/><path d="M8,32 H56 M32,8 V56" stroke="#f3f6fb" stroke-width="2"/>',
  boss: '<polygon points="32,6 40,24 60,26 45,39 50,58 32,48 14,58 19,39 4,26 24,24" fill="#ffc93c"/>',
};
