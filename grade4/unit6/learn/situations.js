/* Learn Multiplying and Dividing Multi-digit Numbers (Grade 4 Unit 6), chapter 5: Division situations. Its widgets and steps; loaded by situations.html. */
/* totals to put into groups */
const TOTALS = [12, 18, 24];
/* the two questions a division answers */
const ASKS = [
  ["each", "How many in each group?"],
  ["groups", "How many groups?"],
];
/* Pick a total, a question, and a number (a stepper): the groups it makes, and the division that finds the answer. */
function wGroups(el) {
  /* the stepper's value: n, how many groups (for "each") or how many in each group (for "groups") */
  const q = Q(el),
    values = { n: 3 },
    limits = { n: [2, 6] };
  let totalIndex = 2,
    ask = "each";
  el.innerHTML =
    `<div data-top>${seg(
      "Total",
      TOTALS.map((t, i) => [i, `${t} apples`]),
    )}</div><div data-bot>${seg("Question", ASKS)}</div>` +
    `<div class="wrow">${stepper("n", "Number")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const total = TOTALS[totalIndex],
      n = values.n,
      quotient = Math.floor(total / n),
      left = total % n;
    press(q("top"), totalIndex);
    press(q("bot"), ask);
    q("n").textContent = n;
    q("f").innerHTML = ask === "each" ? groupsFig(n, quotient) : groupsFig(quotient, n);
    q("e").innerHTML = `${total} ÷ ${n} = ${quotient}${left ? ` R ${left}` : ""}`;
    const story =
      ask === "each"
        ? `Share ${total} apples equally into ${n} bags: <b>${quotient} in each bag</b>.`
        : `Put ${total} apples into bags of ${n}: <b>${quotient} bags</b>.`;
    q("r").innerHTML =
      story +
      (left
        ? ` ${left} ${left === 1 ? "apple is" : "apples are"} left over, because ${n} × ${quotient} = ${n * quotient}.`
        : ` Check: ${ask === "each" ? `${n} × ${quotient}` : `${quotient} × ${n}`} = ${total}.`);
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") totalIndex = +hit[1];
    else ask = hit[1];
    draw();
  });
  draw();
}
/* areas of gardens, in square meters */
const AREAS = [84, 96, 120];
/* the widths that make a whole number of meters long, up to 12 */
const widthsOf = (area) =>
  range(11)
    .map((i) => i + 2)
    .filter((w) => area % w === 0);
/* Pick an area and a width: the length is the area divided by the width. */
function wSide(el) {
  const q = Q(el);
  let areaIndex = 0,
    width = 7;
  el.innerHTML =
    `<div data-top>${seg(
      "Area",
      AREAS.map((a, i) => [i, `${a} sq m`]),
    )}</div><div data-bot></div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const area = AREAS[areaIndex],
      length = area / width;
    press(q("top"), areaIndex);
    q("bot").innerHTML = seg(
      "Width",
      widthsOf(area).map((w) => [w, `${w} m wide`]),
    );
    press(q("bot"), width);
    q("f").innerHTML = rectFig(length, width, {
      unit: "m",
      ask: "length",
      label: `A rectangle ${width} m wide with an area of ${area} square meters`,
    });
    q("e").innerHTML = `${width} × ? = ${area}, so ? = ${area} ÷ ${width} = ${length}`;
    q("r").innerHTML =
      `The area is ${width} rows of squares, ${area} squares in all. Each row has ${area} ÷ ${width} squares, so the garden is <b>${length} meters long</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") {
      areaIndex = +hit[1];
      /* keep the width when it still divides the new area; otherwise take the nearest one that does */
      const widths = widthsOf(AREAS[areaIndex]);
      if (!widths.includes(width))
        width = widths.reduce((best, w) => (Math.abs(w - width) < Math.abs(best - width) ? w : best));
    } else width = +hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "How many groups, or how many in each?",
    widget: wGroups,
    body: "<p>Division answers two kinds of questions. Sharing 24 into 4 equal groups asks <b>how many in each group</b>. Making groups of 4 from 24 asks <b>how many groups</b>. Both are 24 ÷ 4.</p><p>Pick a total and a question, then change the number.</p>",
    check: {
      kind: "num",
      q: "A teacher has 96 crayons. They come in boxes of 8. How many boxes is that?",
      answer: 12,
      unit: "boxes",
      misc: [
        [88, "That subtracts 8 once. How many 8s make 96?"],
        [768, "That multiplies. How many boxes of 8 make 96? Divide."],
      ],
      explain: "96 ÷ 8 = 12, because 12 × 8 = 96. That’s 12 boxes.",
    },
  },
  {
    title: "A missing side from the area",
    widget: wSide,
    body: "<p>A rectangle’s area is its length times its width. When you know the area and one side, divide the area by that side to find the other.</p><p>Pick an area and a width.</p>",
    check: {
      kind: "num",
      q: "A garden has an area of 96 square meters. It is 8 meters wide. How long is it?",
      answer: 12,
      unit: "meters",
      misc: [
        [88, "That subtracts. The area is the length times the width: 8 × ? = 96."],
        [768, "That multiplies the area by the width. Divide instead: 96 ÷ 8."],
      ],
      explain: "8 × ? = 96. 96 ÷ 8 = 12, so the garden is 12 meters long.",
    },
  },
];
