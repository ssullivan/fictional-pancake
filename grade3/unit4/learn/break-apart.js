/* Learn Relating Multiplication to Division (Grade 3 Unit 4), chapter 5: Break apart rectangles. Its widgets and steps;
   loaded by break-apart.html. */
/* facts to break apart: [rows, cols] */
const CUT_FACTS = [
  [6, 7],
  [7, 8],
  [8, 6],
];
/* Move the cut across a gridded rectangle: the two parts' products always add up to the whole. */
function wCut(el) {
  /* values.cut: how many columns are in the first part */
  const q = Q(el),
    values = { cut: 5 };
  let factIndex = 0;
  const limits = { cut: [1, CUT_FACTS[0][1] - 1] };
  el.innerHTML =
    seg(
      "Fact",
      CUT_FACTS.map(([rows, cols], i) => [i, `${rows} × ${cols}`]),
    ) +
    `<div class="wrow">${stepper("cut", "Cut after")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [rows, cols] = CUT_FACTS[factIndex],
      cut = values.cut,
      rest = cols - cut;
    press(el, factIndex);
    q("cut").textContent = cut;
    q("f").innerHTML = splitFig(rows, cols, cut, { products: true });
    q("e").textContent = `${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ${rest}`;
    q("r").innerHTML =
      `${rows} × ${cut} = ${rows * cut} and ${rows} × ${rest} = ${rows * rest}. ${rows * cut} + ${rows * rest} = ${rows * cols}.` +
      `<br><span class="ok">So ${rows} × ${cols} = <b>${rows * cols}</b>.</span>` +
      (cut === 5 ? ` Facts with 5 are friendly, so a cut after 5 is a good one.` : "");
  };
  steppers(el, values, limits, draw);
  onPick(el, (id) => {
    factIndex = +id;
    limits.cut = [1, CUT_FACTS[factIndex][1] - 1];
    values.cut = 5;
    draw();
  });
  draw();
}
/* facts to break apart without a grid: [a, b] */
const HARD_FACTS = [
  [8, 7],
  [9, 6],
  [7, 9],
];
/* Break either factor of a hard fact into 5 and the rest, on a rectangle with no grid. */
function wNoGrid(el) {
  /* broken: which factor is broken apart, 0 for the first and 1 for the second */
  const q = Q(el);
  let factIndex = 0,
    broken = 1;
  el.innerHTML = `<div data-top></div><div data-bot></div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = HARD_FACTS[factIndex],
      [kept, split] = broken ? [a, b] : [b, a],
      rest = split - 5;
    q("top").innerHTML = seg(
      "Fact",
      HARD_FACTS.map(([x, y], i) => [i, `${x} × ${y}`]),
    );
    q("bot").innerHTML = seg("Break apart", [
      [0, `Break the ${a}`],
      [1, `Break the ${b}`],
    ]);
    press(q("top"), factIndex);
    press(q("bot"), broken);
    q("f").innerHTML = splitFig(kept, split, 5, { grid: false, products: true });
    q("e").textContent = `${kept} × ${split} = ${kept} × 5 + ${kept} × ${rest}`;
    q("r").innerHTML =
      `${split} is 5 + ${rest}. ${kept} × 5 = ${kept * 5} and ${kept} × ${rest} = ${kept * rest}.` +
      `<br><span class="ok">${kept * 5} + ${kept * rest} = <b>${a * b}</b>, so ${a} × ${b} = ${a * b}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") factIndex = +id;
    else broken = +id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  rect: splitFig(7, 8, 5),
  noGrid: splitFig(9, 7, 5, { grid: false, ask: "right" }),
};
const STEPS = [
  {
    title: "Cut a rectangle in two",
    widget: wCut,
    body: "<p>A hard fact can be broken into two easier ones. Cut a 6 × 7 rectangle after 5 columns: it’s a 6 × 5 part and a 6 × 2 part. Add their areas to get 6 × 7.</p><p>Pick a fact and move the cut. The total never changes.</p>",
    check: {
      kind: "num",
      q: "The rectangle is cut into two parts. What is the area of the whole rectangle?",
      fig: F.rect,
      answer: 56,
      unit: "square units",
      misc: [
        [35, "That’s only the gold part, 7 × 5. Add the blue part, 7 × 3."],
        [38, "The blue part is 7 × 3, not 3."],
      ],
      explain: "7 × 5 = 35 and 7 × 3 = 21. 35 + 21 = 56 square units, so 7 × 8 = 56.",
    },
  },
  {
    title: "Rectangles without a grid",
    widget: wNoGrid,
    body: "<p>You don’t need the squares. Draw a rectangle, write its sides, and cut one side into two parts. 8 × 7 is 8 × 5 and 8 × 2: 40 + 16 = 56.</p><p>Pick a fact, then pick which factor to break apart. Either one works.</p>",
    check: {
      kind: "num",
      q: "What number is missing? 9 × 7 = 9 × 5 + 9 × ?",
      fig: F.noGrid,
      answer: 2,
      misc: [
        [7, "7 is the whole side. The second part is what’s left after 5."],
        [18, "That’s the second part’s area. What is its side?"],
      ],
      explain: "7 = 5 + 2, so 9 × 7 = 9 × 5 + 9 × 2 = 45 + 18 = 63.",
    },
  },
];
