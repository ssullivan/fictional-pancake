/* Learn Rational Numbers (Grade 6 Unit 7), chapter 5: Inequalities. Its widgets and steps; loaded by inequalities.html. */
/* whether v makes x (sign) b true */
const solves = (v, sign, b) => ({ "<": v < b, ">": v > b, "≤": v <= b, "≥": v >= b })[sign];
/* what each symbol says, and whether its boundary is a solution (a filled circle) */
const SYMBOLS = {
  "<": { says: "less than", closed: false },
  ">": { says: "greater than", closed: false },
  "≤": { says: "less than or equal to", closed: true },
  "≥": { says: "greater than or equal to", closed: true },
};
/* the ray for x (sign) b: toward greater numbers for > and ≥, an open circle for < and > */
const rayOf = (sign, b) => ({ v: b, dir: sign === ">" || sign === "≥" ? 1 : -1, open: !SYMBOLS[sign].closed });

/* Pick a symbol and move the boundary: the graph of every solution. */
function wGraph(el) {
  const q = Q(el),
    list = valuesFrom(-5, 5),
    values = { b: list.indexOf(2) };
  let sign = ">";
  el.innerHTML =
    seg(
      "Symbol",
      Object.keys(SYMBOLS).map((s) => [s, s]),
    ) +
    `<div class="wrow">${stepper("b", "Boundary")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const b = list[values.b],
      { says, closed } = SYMBOLS[sign],
      up = sign === ">" || sign === "≥";
    press(el, sign);
    q("b").textContent = fmt(b);
    q("f").innerHTML = signedLine(-7, 7, { ray: rayOf(sign, b), label: `Graph of x ${sign} ${fmt(b)}` });
    q("e").innerHTML = ineqText("x", sign, b);
    q("r").innerHTML = withVars(
      `x ${sign} ${fmt(b)}: every number ${says} ${fmt(b)}, so the ray goes ${up ? "right" : "left"}. ` +
        (closed
          ? `${fmt(b)} itself is a solution, so its circle is <b>filled in</b>.`
          : `${fmt(b)} itself is not a solution, so its circle is <b>open</b>.`) +
        `<br><span class="dimline">For example, ${[up ? b + 1 : b - 1, up ? b + 2.5 : b - 2.5].map(fmt).join(" and ")} are solutions${closed ? `, and so is ${fmt(b)}` : ""}.</span>`,
    );
  };
  onPick(el, (id) => {
    sign = id;
    draw();
  });
  steppers(el, values, { b: [0, list.length - 1] }, draw);
  draw();
}

/* inequalities to test values in */
const TESTS = [
  { id: "a", sign: "<", b: -2 },
  { id: "b", sign: "≥", b: 1.5 },
  { id: "c", sign: "≤", b: -3 },
];
/* Pick an inequality and try values of x: each one tried is listed, green when it's a solution. */
function wTest(el) {
  const q = Q(el),
    list = valuesFrom(-5, 5, 0.5),
    values = { v: list.indexOf(0) };
  let testId = "a",
    tried = new Set();
  el.innerHTML =
    seg(
      "Inequality",
      TESTS.map((t) => [t.id, ineqText("x", t.sign, t.b)]),
    ) +
    `<div class="wrow">${stepper("v", "Try x =")}</div>` +
    `<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { sign, b } = TESTS.find((t) => t.id === testId),
      v = list[values.v],
      ok = solves(v, sign, b);
    tried.add(v);
    press(el, testId);
    q("v").textContent = fmt(v);
    q("f").innerHTML = signedLine(-6, 6, {
      step: 0.5,
      ray: rayOf(sign, b),
      pts: [{ v, cls: ok ? "g" : "r", t: fmt(v), lv: 1 }],
      label: `Graph of x ${sign} ${fmt(b)}, with ${fmt(v)} marked`,
    });
    q("c").innerHTML = list
      .filter((w) => tried.has(w))
      .map((w) => `<span class="chip${solves(w, sign, b) ? " found" : ""}">${mathVar("x")} = ${fmt(w)}</span>`)
      .join("");
    const where = v < b ? "to the left of" : v > b ? "to the right of" : "the same as";
    q("r").innerHTML = withVars(
      `Is ${fmt(v)} ${sign} ${fmt(b)}? ` +
        (v === b
          ? ok
            ? `<span class="ok">Yes</span>: ${sign} includes ${fmt(b)} itself, so ${fmt(v)} is a solution.`
            : `<span class="no">No</span>: ${fmt(b)} isn’t ${SYMBOLS[sign].says} itself, so the boundary isn’t a solution of ${sign}.`
          : ok
            ? `<span class="ok">Yes</span>: ${fmt(v)} is ${where} ${fmt(b)}, so ${fmt(v)} is a solution. It’s on the ray.`
            : `<span class="no">No</span>: ${fmt(v)} is ${where} ${fmt(b)}, so it isn’t ${SYMBOLS[sign].says} ${fmt(b)}. Not a solution.`),
    );
  };
  onPick(el, (id) => {
    testId = id;
    tried = new Set();
    draw();
  });
  steppers(el, values, { v: [0, list.length - 1] }, draw);
  draw();
}

/* rules from the world: the inequality, the number line to show it on, and whether only whole numbers make sense (dots) */
const RULES = [
  {
    id: "ride",
    label: "Roller coaster",
    story: "Riders must be at least 48 inches tall.",
    letter: "h",
    stands: "a rider’s height in inches",
    sign: "≥",
    b: 48,
    line: [40, 56],
    why: "“At least 48” means 48 or more, so 48 is included.",
  },
  {
    id: "lift",
    label: "Elevator",
    story: "The elevator holds no more than 12 people.",
    letter: "p",
    stands: "the number of people in it",
    sign: "≤",
    b: 12,
    line: [-1, 15],
    whole: true,
    why: "“No more than 12” means 12 or fewer, so 12 is included.",
  },
  {
    id: "freezer",
    label: "Freezer",
    story: "A freezer has to stay at −18 °C or colder.",
    letter: "t",
    stands: "its temperature in °C",
    sign: "≤",
    b: -18,
    line: [-26, -10],
    why: "“−18 or colder” includes −18, and colder means less.",
  },
  {
    id: "bag",
    label: "Sleeping bag",
    story: "A sleeping bag keeps you warm only above −10 °C.",
    letter: "t",
    stands: "the temperature in °C",
    sign: ">",
    b: -10,
    line: [-18, -2],
    why: "“Above −10” leaves −10 out, and above means greater.",
  },
];
/* Pick a rule from the world: its inequality and graph, with dots instead of a ray when only whole numbers make sense. */
function wRules(el) {
  const q = Q(el);
  let ruleId = "ride";
  el.innerHTML =
    seg(
      "Rule",
      RULES.map((r) => [r.id, r.label]),
    ) +
    `<p class="readout" data-s></p><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const rule = RULES.find((r) => r.id === ruleId),
      [lo, hi] = rule.line,
      /* whole numbers from 0 that make it true, for a count of people */
      dots = rule.whole ? valuesFrom(0, hi).filter((v) => solves(v, rule.sign, rule.b)) : [];
    press(el, ruleId);
    q("s").innerHTML = `${rule.story} Let ${mathVar(rule.letter)} be ${rule.stands}.`;
    q("f").innerHTML = signedLine(lo, hi, {
      ray: rule.whole ? null : rayOf(rule.sign, rule.b),
      pts: dots.map((v) => ({ v, cls: "b" })),
      label: rule.whole
        ? `Dots at the whole numbers from 0 to ${rule.b}`
        : `Graph of ${rule.letter} ${rule.sign} ${fmt(rule.b)}`,
    });
    q("e").innerHTML = ineqText(rule.letter, rule.sign, rule.b);
    q("r").innerHTML =
      rule.why +
      (rule.whole
        ? ` A number of people is a whole number, so the solutions are the dots 0, 1, 2, … , ${rule.b}, not every point on a ray.`
        : ` Any number on the ray works, like ${fmt(rule.sign === "≥" || rule.sign === ">" ? rule.b + 2.5 : rule.b - 2.5)}.`);
  };
  onPick(el, (id) => {
    ruleId = id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Graphing inequalities",
    widget: wGraph,
    body: withVars(
      "<p>An <b>inequality</b> like x &gt; 2 says x is greater than 2. It has many solutions: every number greater than 2. Its graph is a ray. An <b>open circle</b> leaves the boundary out (&lt; and &gt;); a <b>filled circle</b> includes it (≤ and ≥).</p><p>Pick a symbol and move the boundary.</p>",
    ),
    check: {
      kind: "mc",
      q: "Which inequality matches the graph?",
      fig: signedLine(-7, 7, {
        ray: { v: -1, dir: 1, open: false },
        label: "Graph: a filled circle at −1 and a ray to the right",
      }),
      choices: [
        { id: "a", label: ineqText("x", "≥", -1) },
        { id: "b", label: ineqText("x", ">", -1) },
        { id: "c", label: ineqText("x", "≤", -1) },
      ],
      answer: "a",
      why: {
        b: "The circle at −1 is filled in, so −1 is a solution. x > −1 would leave −1 out (an open circle).",
        c: "The ray points right, toward the numbers greater than −1.",
      },
      explain:
        "The ray goes right from −1 and the circle is filled in: x ≥ −1, every number greater than or equal to −1.",
    },
  },
  {
    title: "Testing solutions",
    widget: wTest,
    body: withVars(
      "<p>A value is a <b>solution</b> to an inequality when it makes the inequality true. Test it, or look for it on the graph: solutions are on the ray. The boundary counts only for ≤ and ≥.</p><p>Pick an inequality and try values of x.</p>",
    ),
    check: {
      kind: "mc",
      q: `Which value of ${mathVar("x")} is a solution to ${ineqText("x", "≤", -3)}?`,
      choices: [
        { id: "a", label: "−3" },
        { id: "b", label: "−2" },
        { id: "c", label: "3" },
      ],
      answer: "a",
      why: {
        b: "−2 is to the right of −3, so it’s greater than −3. −2 ≤ −3 is false.",
        c: "3 is greater than −3, so 3 ≤ −3 is false.",
      },
      explain: "−3 ≤ −3 is true, because ≤ includes −3 itself. So −3 is a solution.",
    },
  },
  {
    title: "Inequalities in stories",
    widget: wRules,
    body: "<p>Rules like “at least,” “no more than,” and “above” are inequalities. Decide whether the number itself is allowed, then which way the allowed values go. Some stories only make sense for whole numbers.</p><p>Pick a rule.</p>",
    check: {
      kind: "mc",
      q: `To ride the go-karts, you must be at least 52 inches tall. Let ${mathVar("h")} be your height in inches. Which inequality says who can ride?`,
      choices: [
        { id: "a", label: ineqText("h", "≥", 52) },
        { id: "b", label: ineqText("h", ">", 52) },
        { id: "c", label: ineqText("h", "≤", 52) },
      ],
      answer: "a",
      why: {
        b: "Someone exactly 52 inches tall can ride: “at least 52” includes 52. h > 52 leaves 52 out.",
        c: "That says 52 inches or shorter. “At least” means 52 or taller.",
      },
      explain: "“At least 52” means 52 or more: h ≥ 52.",
    },
  },
];
