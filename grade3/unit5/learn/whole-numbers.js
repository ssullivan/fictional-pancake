/* Learn Fractions as Numbers (Grade 3 Unit 5), chapter 4: Fractions and whole numbers. Its widgets and steps; loaded by
   whole-numbers.html. */
/* Jump by 1/d along a number line from 0 to 3: every d jumps land on a whole number. */
function wWholeLine(el) {
  const q = Q(el),
    values = { k: 2 },
    limits = { k: [0, 6] };
  let d = 2;
  el.innerHTML =
    seg(
      "Parts",
      [2, 3, 4, 6].map((x) => [x, cap(partsOf(x))]),
    ) + `<div class="wrow">${stepper("k", "Jumps")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = values.k,
      whole = k % d === 0;
    press(el, d);
    q("k").textContent = k;
    q("f").innerHTML = fracLine([{ d, hops: k, pts: k ? [{ k }] : [] }], { wholes: 3 });
    q("r").innerHTML = !k
      ? "No jumps yet: you’re at 0."
      : `${pl(k, "jump")} of ${fr(1, d)}: <b>${fr(k, d)}</b>.` +
        (whole ? `<br><span class="ok">${fr(k, d)} = ${k / d}. Every ${d} ${partsOf(d)} make 1 whole.</span>` : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.k = [0, 3 * d];
    values.k = d;
    draw();
  });
  draw();
}
/* Shade parts across two wholes: past d parts, the fraction is more than 1. */
function wMoreThanOne(el) {
  const q = Q(el),
    values = { k: 5 },
    limits = { k: [1, 8] };
  let d = 4;
  el.innerHTML =
    seg(
      "Parts",
      [2, 3, 4, 6].map((x) => [x, cap(partsOf(x))]),
    ) + `<div class="wrow">${stepper("k", "Parts")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = values.k;
    press(el, d);
    q("k").textContent = k;
    q("f").innerHTML = strips([{ d, k }], { wholes: 2, empty: true });
    q("r").innerHTML =
      `<b>${fr(k, d)}</b>: ${pl(k, "part")} of ${fr(1, d)}.` +
      (k < d
        ? " Less than 1 whole."
        : k === d
          ? ` ${fr(d, d)} = 1 whole.`
          : k === 2 * d
            ? ` ${fr(k, d)} = 2: two whole strips.`
            : ` That’s 1 whole strip and ${pl(k - d, PART[d][0], partsOf(d))} more: more than 1.`);
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    d = +id;
    limits.k = [1, 2 * d];
    values.k = d + 1;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  twelveFourths: fracLine([{ d: 4, pts: [{ k: 12 }] }], { wholes: 3 }),
  thirds: fracLine([{ d: 3 }], { wholes: 3 }),
};
const STEPS = [
  {
    title: "Fractions that are whole numbers",
    widget: wWholeLine,
    body: "<p>Jump by 1/2 from 0: 2 jumps land on 1, and 4 jumps land on 2. So 2/2 = 1 and 4/2 = 2. Some fractions are whole numbers.</p><p>Pick the parts, then make more jumps.</p>",
    check: {
      kind: "num",
      q: "12/4 is a whole number. Which one?",
      fig: F.twelveFourths,
      answer: 3,
      misc: [
        [12, "12 is how many fourths. 4 of them make 1 whole."],
        [4, "4 is how many parts make 1 whole. How many wholes do 12 parts make?"],
      ],
      explain: "4/4 = 1, so 12 fourths make 3 wholes: 12/4 = 3.",
    },
  },
  {
    title: "More than 1 whole",
    widget: wMoreThanOne,
    body: "<p>A fraction can be more than 1. 5/4 is 5 fourths: 4 of them fill 1 whole, and there’s 1 more. On the number line, 5/4 is past 1.</p><p>Pick the parts, then shade more than one whole.</p>",
    check: {
      kind: "mc",
      q: "Which fraction is equal to 2?",
      fig: F.thirds,
      choices: [
        { id: "a", label: fr(6, 3) },
        { id: "b", label: fr(2, 3) },
        { id: "c", label: fr(3, 6) },
      ],
      answer: "a",
      why: {
        b: "That’s 2 thirds, less than 1 whole.",
        c: "That’s 3 of 6 parts, less than 1.",
      },
      explain: "Each whole is 3 thirds, so 2 wholes are 6 thirds: 6/3 = 2.",
    },
  },
];
