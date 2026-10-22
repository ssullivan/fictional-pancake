/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 4: Unlike denominators. Its widgets and steps; loaded
   by unlike.html. */
/* n/d in lowest terms, as a mixed number when it's more than 1 (html) */
const nice = (n, d) => {
  const g = gcd(n, d);
  return mixed(n / g, d / g);
};
/* fractions to add: [n, d] */
const FIRST = [
  [1, 2],
  [2, 3],
  [3, 4],
];
const SECOND = [
  [1, 3],
  [1, 4],
  [1, 6],
  [3, 8],
];
/* Pick two fractions (two rows): cut both into a common denominator in strips, then add. */
function wCommon(el) {
  const q = Q(el);
  let firstIndex = 0,
    secondIndex = 0;
  el.innerHTML = `<div data-top>${seg(
    "First",
    FIRST.map(([n, d], i) => [i, `${n}/${d}`]),
  )}</div><div data-bot>${seg(
    "Second",
    SECOND.map(([n, d], i) => [i, `+ ${n}/${d}`]),
  )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = FIRST[firstIndex],
      [c, d] = SECOND[secondIndex],
      common = lcm(b, d),
      [up, over] = [a * (common / b), c * (common / d)];
    press(q("top"), firstIndex);
    press(q("bot"), secondIndex);
    q("f").innerHTML = strips(
      [
        { d: common, k: up, lab: [a, b] },
        { d: common, k: over, lab: [c, d], cls: "b" },
      ],
      { wholes: 1, label: `${a}/${b} and ${c}/${d} cut into ${common}ths` },
    );
    q("r").innerHTML =
      `Both strips cut into ${common}ths: ${fr(a, b)} = ${fr(up, common)} and ${fr(c, d)} = ${fr(over, common)}. ` +
      `Now the parts are the same size: <b>${fr(up, common)} + ${fr(over, common)} = ${fr(up + over, common)}${gcd(up + over, common) > 1 || up + over > common ? ` = ${nice(up + over, common)}` : ""}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") firstIndex = +hit[1];
    else secondIndex = +hit[1];
    draw();
  });
  draw();
}
/* mixed numbers to subtract: [whole, a, b, whole, c, d] for w a/b − w c/d */
const DIFFERENCES = [
  [3, 1, 4, 1, 1, 2],
  [4, 1, 3, 2, 5, 6],
  [5, 0, 8, 2, 3, 8],
];
/* Pick a difference of mixed numbers: write both fractions in a common denominator, and trade a whole when the first is too small. */
function wTrade(el) {
  const q = Q(el);
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      DIFFERENCES.map(([w1, a, b, w2, c, d], i) => [i, `${a ? `${w1} ${a}/${b}` : w1} − ${w2} ${c}/${d}`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = () => {
    const [w1, a, b, w2, c, d] = DIFFERENCES[problemIndex],
      common = lcm(b, d),
      [up, over] = [a * (common / b), c * (common / d)],
      first = a ? mixed(w1 * b + a, b) : `${w1}`,
      answerTop = (w1 - w2) * common + up - over;
    press(el, problemIndex);
    /* a whole number trades 1 for common/common; a mixed number first writes its fraction in the common denominator */
    const traded = a
      ? `In ${common}ths: ${first} = ${w1} ${fr(up, common)} and ${mixed(w2 * d + c, d)} = ${w2} ${fr(over, common)}. ` +
        `${fr(up, common)} is less than ${fr(over, common)}, so trade 1 whole for ${fr(common, common)}: ${w1} ${fr(up, common)} = ${w1 - 1} ${fr(up + common, common)}. `
      : `There’s no fraction to subtract from, so trade 1 whole for ${fr(common, common)}: ${w1} = ${w1 - 1} ${fr(common, common)}. `;
    q("r").innerHTML =
      traded +
      `${w1 - 1} − ${w2} = ${w1 - 1 - w2} and ${fr(up + common, common)} − ${fr(over, common)} = ${fr(up + common - over, common)}: <b>${nice(answerTop, common)}</b>.`;
  };
  onPick(el, (m) => {
    problemIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Find a common denominator",
    widget: wCommon,
    body: "<p>You can add halves and thirds only when the parts are the same size. Cut both into sixths: 1/2 = 3/6 and 1/3 = 2/6, so <b>1/2 + 1/3 = 5/6</b>. A common denominator is a multiple of both denominators.</p><p>Pick two fractions to add.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A trail mix recipe uses 1/2 cup of nuts and 1/3 cup of raisins. How many cups is that in all?",
      answer: 5 / 6,
      unit: "cup",
      misc: [
        [2 / 5, "That adds the tops and the bottoms. Write both in sixths first."],
        [2 / 6, "That changes the bottoms to 6 but not the tops. 1/2 = 3/6 and 1/3 = 2/6."],
      ],
      explain: "1/2 = 3/6 and 1/3 = 2/6. 3/6 + 2/6 = 5/6 cup.",
    },
  },
  {
    title: "Subtract mixed numbers",
    widget: wTrade,
    body: "<p>To subtract mixed numbers, write the fractions with a common denominator. If the first fraction is too small to subtract from, trade 1 whole for a fraction like 6/6, then subtract the wholes and the fractions.</p><p>Pick a problem.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "The trail is 4 1/3 miles. The hikers have gone 1 1/2 miles. How far is left?",
      answer: 17 / 6,
      unit: "miles",
      misc: [
        [
          19 / 6,
          "That subtracts 1/3 from 1/2 the wrong way around. 2/6 is less than 3/6: trade 1 whole for 6/6 first.",
        ],
        [3, "That subtracts the whole numbers and stops. Subtract the fractions too."],
      ],
      explain: "4 1/3 − 1 1/2 = 4 2/6 − 1 3/6 = 3 8/6 − 1 3/6 = 2 5/6 miles.",
    },
  },
];
