/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 4: The standard algorithm to multiply. Its widgets and steps; loaded by standard.html. */
/* products to work in columns: [a, b] */
const COLUMNS = [
  [347, 6],
  [1205, 4],
  [2618, 3],
];
/* the place a column's carry goes to, by column: "tens" for column 0 */
const NEXT_PLACE = ["tens", "hundreds", "thousands", "ten-thousands"];
/* Pick a product and work it one column at a time (a stepper). */
function wColumns(el) {
  /* the stepper's value: done, how many columns are worked */
  const q = Q(el),
    values = { done: 0 },
    limits = { done: [0, 3] };
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      COLUMNS.map(([a, b], i) => [i, `${commas(a)} × ${b}`]),
    ) +
    `<div class="wrow">${stepper("done", "Columns")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = COLUMNS[productIndex],
      steps = mulSteps(a, b),
      done = values.done;
    press(el, productIndex);
    q("done").textContent = done;
    q("f").innerHTML = mulFig(a, b, done);
    if (done === 0) q("r").innerHTML = `Start with the ones: ${steps[0].top} × ${b}. Tap + to work each column.`;
    else {
      const step = steps[done - 1],
        last = done === steps.length,
        work = `${step.top} × ${b}${step.cin ? ` + ${step.cin} carried = ${step.top * b} + ${step.cin}` : ""} = ${step.val}`;
      q("r").innerHTML = last
        ? `${work}. It’s the last column, so write all of ${step.val}. <b>${commas(a)} × ${b} = ${commas(a * b)}</b>.`
        : step.carry
          ? `${work}. Write ${step.digit} and carry ${step.carry} to the ${NEXT_PLACE[step.i]} column.`
          : `${work}. Write ${step.digit}. Nothing to carry.`;
    }
  };
  /* a new product: the stepper goes up to its number of columns */
  const chooseProduct = (i) => {
    productIndex = i;
    limits.done[1] = String(COLUMNS[i][0]).length;
    values.done = 0;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    chooseProduct(+m);
    draw();
  });
  chooseProduct(productIndex);
  draw();
}
/* stories to solve three ways: [story, a, b, what's counted] */
const STORIES = [
  ["A school orders 6 boxes of 144 pencils.", 144, 6, "pencils"],
  ["A train has 8 cars with 112 seats in each.", 112, 8, "seats"],
  ["A farm packs 9 crates of 125 apples.", 125, 9, "apples"],
];
/* the three ways to multiply */
const WAYS = [
  ["area", "Area diagram"],
  ["partial", "Partial products"],
  ["standard", "Standard algorithm"],
];
/* Pick a story and a way to solve it: every way gets the same product. */
function wWays(el) {
  const q = Q(el);
  let storyIndex = 0,
    way = "area";
  el.innerHTML =
    `<div data-top>${seg(
      "Story",
      STORIES.map(([, a, b], i) => [i, `${b} × ${a}`]),
    )}</div><div data-bot>${seg("Way", WAYS)}</div>` +
    `<p class="readout" data-s></p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [story, a, b, what] = STORIES[storyIndex];
    press(q("top"), storyIndex);
    press(q("bot"), way);
    q("s").innerHTML = `${story} How many ${what} is that?`;
    q("f").innerHTML =
      way === "area" ? areaModel(a, b) : way === "partial" ? partialFig(a, b) : mulFig(a, b, String(a).length);
    q("r").innerHTML =
      {
        area: "The area diagram shows each place as a piece.",
        partial: "Partial products write each piece’s product, then add.",
        standard: "The standard algorithm adds the pieces as it goes, by carrying.",
      }[way] + ` Every way gives <b>${commas(a * b)} ${what}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") storyIndex = +hit[1];
    else way = hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Multiply column by column",
    widget: wColumns,
    body: "<p>The <b>standard algorithm</b> multiplies one place at a time, starting with the ones. When a column makes 10 or more, write the ones digit and carry the rest to the next column, where it’s added after multiplying.</p><p>Pick a product, then work it one column at a time.</p>",
    check: {
      kind: "num",
      q: "A theater has 3 sections with 245 seats in each. How many seats is that?",
      answer: 735,
      unit: "seats",
      misc: [
        [
          625,
          "That leaves out the carries. 3 × 5 = 15: write 5 and carry 1 ten. 3 × 4 tens = 12 tens, plus the 1 carried is 13.",
        ],
        [248, "That adds 3. Multiply: 3 × 245."],
      ],
      explain: "3 × 5 = 15: write 5, carry 1. 3 × 4 + 1 = 13: write 3, carry 1. 3 × 2 + 1 = 7. So 3 × 245 = 735 seats.",
    },
  },
  {
    title: "Choose a way",
    widget: wWays,
    body: "<p>An area diagram, partial products, and the standard algorithm all split a number into its places. Use the way that makes sense to you, and check with another.</p><p>Pick a story and a way to solve it.</p>",
    check: {
      kind: "num",
      q: "A theater has 24 rows with 18 seats in each row. How many seats is that?",
      answer: 432,
      unit: "seats",
      misc: [
        [232, "That’s only 20 × 10 and 4 × 8. Find all 4 partial products: 200, 160, 40, and 32."],
        [42, "That adds 24 + 18. Multiply: 24 × 18."],
      ],
      explain: "20 × 10 = 200, 20 × 8 = 160, 4 × 10 = 40, and 4 × 8 = 32. 200 + 160 + 40 + 32 = 432 seats.",
    },
  },
];
