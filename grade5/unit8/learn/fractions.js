/* Learn Putting It All Together (Grade 5 Unit 8), chapter 3: Fraction sums and differences. Its widgets and steps; loaded by
   fractions.html. */
/* n/d in lowest terms, as a mixed number when it's more than 1 (html) */
const nice = (n, d) => {
  const g = gcd(n, d);
  return mixed(n / g, d / g);
};
/* problems: [button, a, b, c, d, '+' or '−'] for a/b ± c/d */
const PROBLEMS = [
  ["2/3 + 1/4", 2, 3, 1, 4, "+"],
  ["5/6 + 3/4", 5, 6, 3, 4, "+"],
  ["7/8 − 1/2", 7, 8, 1, 2, "−"],
  ["4/5 − 1/3", 4, 5, 1, 3, "−"],
];
/* Pick a problem: both fractions cut into a common denominator in strips, then added or subtracted. */
function wSums(el) {
  const q = Q(el);
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      PROBLEMS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [button, a, b, c, d, op] = PROBLEMS[problemIndex],
      common = lcm(b, d),
      [up, over] = [a * (common / b), c * (common / d)],
      top = op === "+" ? up + over : up - over;
    press(el, problemIndex);
    q("f").innerHTML = strips(
      [
        { d: common, k: up, lab: [a, b] },
        { d: common, k: over, lab: [c, d], cls: "b" },
      ],
      { wholes: 1, label: `${a}/${b} and ${c}/${d} in ${common}ths` },
    );
    q("r").innerHTML =
      `${common} is a multiple of ${b} and of ${d}: ${fr(a, b)} = ${fr(up, common)} and ${fr(c, d)} = ${fr(over, common)}. <b>${fr(up, common)} ${op} ${fr(over, common)} = ${fr(top, common)}${gcd(top, common) > 1 || top > common ? ` = ${nice(top, common)}` : ""}</b>.`;
  };
  onPick(el, (m) => {
    problemIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "A common denominator",
    widget: wSums,
    body: "<p>To add or subtract fractions with different denominators, write them with a <b>common denominator</b>, a multiple of both. Then the parts are the same size, and you add or subtract the tops.</p><p>Pick a problem.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What is 3/4 − 1/6?",
      answer: 7 / 12,
      unit: "",
      misc: [
        [1, "That subtracts the tops (3 − 1) and the bottoms (6 − 4), making 2/2. Write both in twelfths first."],
        [2 / 12, "That changes the bottoms to 12 but not the tops. 3/4 = 9/12 and 1/6 = 2/12."],
      ],
      explain: "3/4 = 9/12 and 1/6 = 2/12. 9/12 − 2/12 = 7/12.",
    },
  },
];
