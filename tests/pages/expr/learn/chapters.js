/* Test page for typed math (tests/math.spec.js): one chapter whose quick checks are typed expressions and equations. Loaded by
   learn.html and learn/typed.html; shared/learn.js has the format. Not linked from the site. */
const ICON = {
  typed:
    '<text x="32" y="40" fill="#ffc93c" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">x²+5x</text>',
};
const UNIT = {
  saveKey: "test-expr-learn",
  game: "Typed Math",
  icons: ICON,
  chapters: [
    {
      id: "typed",
      icon: "typed",
      title: "Typed answers",
      game: { zone: "factor", name: "Factor" },
      lessons: "Test",
      blurb: `Factor ${math("x^2 + 5x + 6")}, then solve an equation for ${math("y")}.`,
      steps: 2,
    },
  ],
};
