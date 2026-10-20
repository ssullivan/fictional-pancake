/* Learn Putting It All Together (Grade 2 Unit 9), chapter 3: Numbers to 1,000. Its widgets and steps; loaded by numbers.html. */
/* "1 hundred", "3 tens": n of a place (its name plural) */
const placeCount = (n, word) => `${n} ${n === 1 ? word.slice(0, -1) : word}`;
/* numbers to build */
const TARGETS = [352, 407, 260];
/* Pick a number, then build it with hundreds, tens, and ones (a stepper for each) in as many ways as you can. */
function wBuild(el) {
  const q = Q(el),
    values = { h: 0, t: 0, o: 0 };
  let targetIndex = 0;
  el.innerHTML =
    seg(
      "Number",
      TARGETS.map((n, i) => [i, `Make ${n}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("h", "Hundreds")}${stepper("t", "Tens")}${stepper("o", "Ones")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { h, t, o } = values,
      target = TARGETS[targetIndex],
      value = 100 * h + 10 * t + o;
    press(el, targetIndex);
    ["h", "t", "o"].forEach((k) => (q(k).textContent = values[k]));
    q("f").innerHTML = htoFig(
      h,
      t,
      o,
      { cls: { t: "b", o: "c" } },
      `${placeCount(h, "hundreds")}, ${placeCount(t, "tens")}, ${placeCount(o, "ones")}`,
    );
    q("r").innerHTML =
      `<b>${100 * h} + ${10 * t} + ${o} = ${value}</b><br>` +
      (value === target
        ? `<span class="ok">You made ${target}!</span> <span class="dimline">${
            t < 10 && o < 10
              ? "Now try another way: trade a hundred for 10 tens, or a ten for 10 ones."
              : "That’s another way to make it."
          }</span>`
        : `<span class="dimline">${value < target ? `You need ${target - value} more to make ${target}.` : `That’s ${value - target} too many.`}</span>`);
  };
  steppers(el, values, { h: [0, 9], t: [0, 20], o: [0, 20] }, draw);
  onPick(el, (m) => {
    targetIndex = +m;
    values.h = values.t = values.o = 0;
    draw();
  });
  draw();
}
/* numbers, and expressions to try for each, as [first, sign, second]: all but the last name the number */
const EXPRESSIONS = [
  [
    500,
    [
      [400, "+", 100],
      [250, "+", 250],
      [600, "−", 100],
      [510, "+", 10],
    ],
  ],
  [
    340,
    [
      [300, "+", 40],
      [200, "+", 140],
      [350, "−", 10],
      [400, "−", 40],
    ],
  ],
];
/* Pick a number, then tap an expression to see it as a jump on the number line. */
function wExpr(el) {
  /* exprIndex: the expression tapped (-1 for none) */
  const q = Q(el);
  let numberIndex = 0,
    exprIndex = -1;
  el.innerHTML =
    seg(
      "Number",
      EXPRESSIONS.map(([n], i) => [i, `${n}`]),
    ) + `<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, list] = EXPRESSIONS[numberIndex];
    press(el, numberIndex);
    q("c").innerHTML = list
      .map(
        ([a, sign, b], i) =>
          `<button type="button" class="chip" data-e="${i}" aria-pressed="${i === exprIndex}">${a} ${sign} ${b}</button>`,
      )
      .join("");
    /* the expression as a hop from its first number to where it lands */
    const picked = list[exprIndex],
      lands = picked ? picked[0] + (picked[1] === "+" ? picked[2] : -picked[2]) : null;
    q("f").innerHTML = numLine(0, 1000, {
      u: 0.5,
      step: 100,
      big: 500,
      lab: (v) => v % 500 === 0,
      ls: "",
      pad: 22,
      hops: picked ? [{ a: picked[0], b: lands, t: `${picked[1]}${picked[2]}` }] : [],
      pts: [{ v: n, cls: "b", t: n }],
      label: `A number line from 0 to 1,000 with ${n} marked`,
    });
    q("r").innerHTML = picked
      ? `<b>${picked[0]} ${picked[1]} ${picked[2]} = ${lands}</b><br>` +
        (lands === n
          ? `<span class="ok">It lands on ${n}. That’s another name for ${n}.</span>`
          : `<span class="dimline">It lands on ${lands}, not ${n}.</span>`)
      : `Every expression here starts at a number and jumps. Tap one. Does it land on ${n}?`;
  };
  onPick(el, (m) => {
    numberIndex = +m;
    exprIndex = -1;
    draw();
  });
  q("c").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-e]");
    if (chip) {
      exprIndex = +chip.dataset.e;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  n465: numBlocks(465),
};
const STEPS = [
  {
    title: "Build a number many ways",
    widget: wBuild,
    body: "<p>10 ones make a ten, and 10 tens make a hundred. So the same number can be built many ways: <b>352</b> is 3 hundreds, 5 tens, 2 ones, and it’s also 2 hundreds, 15 tens, 2 ones.</p><p>Pick a number. Build it with the steppers, then find another way.</p>",
    check: {
      kind: "mc",
      q: "Which one also makes <b>465</b>?",
      fig: F.n465,
      stack: true,
      choices: [
        { id: "a", label: "3 hundreds, 16 tens, 5 ones" },
        { id: "b", label: "4 hundreds, 16 tens, 5 ones" },
        { id: "c", label: "3 hundreds, 6 tens, 15 ones" },
      ],
      answer: "a",
      why: {
        b: "That’s 400 + 160 + 5 = 565. Trading a hundred for 10 tens leaves 3 hundreds.",
        c: "That’s 300 + 60 + 15 = 375. A hundred became 10 tens, so there are 16 tens.",
      },
      explain: "300 + 160 + 5 = 465. One hundred was traded for 10 tens: 6 tens + 10 tens = 16 tens.",
    },
  },
  {
    title: "Expressions for a number",
    widget: wExpr,
    body: "<p>An <b>expression</b> like 250 + 250 is another way to name a number. 250 + 250 and 600 − 100 both name 500.</p><p>Pick a number, then tap each expression. Which ones land on it?</p>",
    check: {
      kind: "mc",
      q: "Which expression equals <b>600</b>?",
      choices: [
        { id: "a", label: "550 + 50" },
        { id: "b", label: "500 + 10" },
        { id: "c", label: "700 − 10" },
      ],
      answer: "a",
      why: {
        b: "500 + 10 = 510. To get to 600 from 500, add 100.",
        c: "700 − 10 = 690. To get to 600 from 700, take away 100.",
      },
      explain: "550 + 50 = 600: 50 more gets from 550 to the next hundred.",
    },
  },
];
