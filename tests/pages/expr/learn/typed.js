/* Test page for typed math, chapter 1: Typed answers. Two steps whose quick checks are typed in a MathBox: a factoring (with a
   form and a named mistake) and an equation solved for y. Loaded by typed.html. */
const STEPS = [
  {
    title: "Factoring",
    body: `<p>Two numbers that multiply to ${math("6")} and add to ${math("5")} factor ${math("x^2 + 5x + 6")}.</p>`,
    check: {
      kind: "expr",
      q: `Factor ${math("x^2 + 5x + 6")}.`,
      answer: "(x+2)(x+3)",
      vars: ["x"],
      form: Expr.form.factored,
      misc: [["(x+1)(x+6)", "Those multiply to 6 but add to 7."]],
      explain: `${math("2 \\cdot 3 = 6")} and ${math("2 + 3 = 5")}: ${math("(x + 2)(x + 3)")}.`,
    },
  },
  {
    title: "Solving for y",
    body: `<p>Get ${math("y")} by itself: do the same to both sides.</p>`,
    check: {
      kind: "expr",
      q: `Solve ${math("2x + y = 7")} for ${math("y")}.`,
      answer: "y=7-2x",
      vars: ["x", "y"],
      keys: ["x", "y", "=", "(", ")"],
      form: Expr.form.solvedFor("y"),
      misc: [["y=7+2x", "Subtract 2x from both sides: 7 − 2x."]],
      explain: `Subtract ${math("2x")} from both sides: ${math("y = 7 - 2x")}.`,
    },
  },
];
