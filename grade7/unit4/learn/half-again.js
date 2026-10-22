/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4), chapter 2: Half as much again. Its widgets and
   steps; loaded by half-again.html. */
/* a fraction [n, d] as a number */
const val = ([n, d]) => n / d;
/* fractions to grow or shrink by */
const PARTS = [
  [1, 2],
  [1, 3],
  [1, 4],
  [3, 4],
];
/* A tape for `start` cut into d equal parts, and a second tape grown (or shrunk) by k of those parts (svg). */
function growTape(start, [k, d], grow) {
  const partW = 300 / d,
    left = 70,
    tapeH = 30,
    after = grow ? d + k : d - k;
  let markup = `<text class="lbl s dm en" x="${left - 10}" y="${22 + tapeH / 2}">before</text><text class="lbl s dm en" x="${left - 10}" y="${84 + tapeH / 2}">after</text>`;
  range(d).forEach((i) => {
    markup += `<rect class="tape b" x="${left + i * partW}" y="22" width="${partW}" height="${tapeH}"/>`;
  });
  range(after).forEach((i) => {
    markup += `<rect class="tape${i >= d ? "" : " b"}" x="${left + i * partW}" y="84" width="${partW}" height="${tapeH}"/>`;
  });
  if (!grow)
    range(k).forEach((i) => {
      markup += `<rect class="tape gone" x="${left + (after + i) * partW}" y="84" width="${partW}" height="${tapeH}"/>`;
    });
  markup += `<text class="lbl s" x="${left + 300 + 30}" y="${22 + tapeH / 2}">${fmt(start)}</text>`;
  markup += `<text class="lbl s gd" x="${left + Math.max(d, after) * partW + 30}" y="${84 + tapeH / 2}">${fmt((start * after) / d)}</text>`;
  return svgWrap(
    left + 300 + partW * k + 70,
    130,
    markup,
    `A tape of ${start} cut in ${d} parts, and one ${after} parts long`,
  );
}
/* Pick a fraction and grow or shrink 12 by it: the new tape is 1 + or 1 − the fraction times as long. */
function wGrow(el) {
  const q = Q(el),
    start = 12;
  let partIndex = 0,
    grow = true;
  el.innerHTML = `<div data-top>${seg(
    "Fraction",
    PARTS.map((p, i) => [i, ftx(p)]),
  )}</div><div data-bot>${seg("Change", [
    ["grow", "Grow"],
    ["shrink", "Shrink"],
  ])}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const part = PARTS[partIndex],
      factor = grow ? fAdd([1, 1], part) : fSub([1, 1], part),
      change = (start * part[0]) / part[1];
    press(q("top"), partIndex);
    press(q("bot"), grow ? "grow" : "shrink");
    q("f").innerHTML = growTape(start, part, grow);
    q("r").innerHTML =
      `${fim(part)} of ${start} is ${fmt(change)}. ${grow ? "Grown" : "Shrunk"}: ${start} ${grow ? "+" : "−"} ${fmt(change)} = <b>${fmt(start * val(factor))}</b>. ` +
      `That’s the same as ${start} × ${fim(factor)}, since 1 ${grow ? "+" : "−"} ${fim(part)} = ${fim(factor)}.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") partIndex = +id;
    if (row === "bot") grow = id === "grow";
    if (row) draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Growing by a fraction",
    widget: wGrow,
    body: "<p>“Half as much again” means the start plus half of it: 12 grows to 12 + 6 = 18. That’s multiplying by 1 + 1/2 = 3/2. Shrinking by a fraction multiplies by 1 minus it.</p><p>Pick a fraction, then grow or shrink.</p>",
    check: {
      kind: "num",
      q: "A puppy weighed 18 pounds. It grew by a third of that. How much does it weigh now?",
      answer: 24,
      unit: "pounds",
      misc: [
        [6, "That’s only the growth. Add it to 18."],
        [12, "That shrinks it. It grew: add a third of 18."],
        [54, "That multiplies by 3. Growing by a third multiplies by 4/3."],
      ],
      explain: "A third of 18 is 6, and 18 + 6 = 24 pounds. That’s 18 × 4/3.",
    },
  },
];
