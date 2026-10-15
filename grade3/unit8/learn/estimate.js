/* Learn Putting It All Together (Grade 3 Unit 8), chapter 1: Estimate fractions. Its widgets and steps; loaded by
   estimate.html. */
/* how many equal parts the strip or the line can be cut into (0: not cut) */
const CUTS = [0, 2, 3, 4, 6, 8];
/* where a cut lands: [the parts up to `k/d`, whether it's right on a line], for a cut into `cut` parts */
const cutAt = (k, d, cut) => [(k * cut) / d, (k * cut) % d === 0];
/* "between 1/4 and 2/4", or "less than 1/4" when it's before the first line */
const between = (parts, cut) =>
  parts < 1 ? `less than ${fr(1, cut)}` : `between ${fr(Math.floor(parts), cut)} and ${fr(Math.ceil(parts), cut)}`;
/* the strips to estimate (IM Lesson 1 shades 5/8 and 1/3): [button, k, d] */
const STRIPS = [
  ["Strip A", 5, 8],
  ["Strip B", 1, 3],
  ["Strip C", 3, 4],
];
/* Estimate how much of a strip is shaded, then cut it into equal parts (a row of buttons) to see if the shading ends on a line. */
function wStrip(el) {
  const q = Q(el);
  let stripIndex = 0,
    cut = 0;
  el.innerHTML =
    `<div data-top>${seg(
      "Strip",
      STRIPS.map(([button], i) => [i, button]),
    )}</div>` +
    `<div data-bot>${seg(
      "Cut into",
      CUTS.map((c) => [c, c ? `${c} parts` : "No lines"]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, k, d] = STRIPS[stripIndex],
      [parts, onLine] = cutAt(k, d, cut);
    press(q("top"), stripIndex);
    press(q("bot"), cut);
    q("f").innerHTML = guessStrip(k, d, { cut });
    q("r").innerHTML = !cut
      ? "About how much is shaded? Make a guess, then cut the strip into equal parts to check."
      : onLine
        ? `<span class="ok">The shading ends right on a line: ${parts} of ${cut} equal parts. It’s ${fr(parts, cut)} of the strip.</span>`
        : `The shading ends between two lines: ${between(parts, cut)}. Try cutting it into other parts.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") stripIndex = +id;
    if (row === "bot") cut = +id;
    if (row) draw();
  });
  draw();
}
/* the points to estimate, on a line from 0 to 2 (IM Lesson 1 puts one at 4/3): [button, k, d] */
const POINTS = [
  ["Point A", 4, 3],
  ["Point B", 3, 4],
  ["Point C", 3, 2],
];
/* Estimate where a point is on a line marked only at whole numbers, then cut each whole into equal parts (a row of buttons). */
function wPoint(el) {
  const q = Q(el);
  let pointIndex = 0,
    cut = 0;
  el.innerHTML =
    `<div data-top>${seg(
      "Point",
      POINTS.map(([button], i) => [i, button]),
    )}</div>` +
    `<div data-bot>${seg(
      "Cut each whole into",
      CUTS.filter((c) => c < 8).map((c) => [c, c ? `${c} parts` : "No ticks"]),
    )}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, k, d] = POINTS[pointIndex],
      [parts, onTick] = cutAt(k, d, cut);
    press(q("top"), pointIndex);
    press(q("bot"), cut);
    q("f").innerHTML = guessLine(k, d, 2, { cut });
    q("r").innerHTML = !cut
      ? `Is the point before 1 or after 1? About what number is it? Guess, then cut each whole into equal parts.`
      : onTick
        ? `<span class="ok">The point is right on a tick: ${parts} jumps of ${fr(1, cut)} from 0. It’s ${fr(parts, cut)}.</span>`
        : `The point is between two ticks: ${between(parts, cut)}. Try cutting the wholes into other parts.`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") pointIndex = +id;
    if (row === "bot") cut = +id;
    if (row) draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  strip: guessStrip(2, 3, { label: "A strip with part of it shaded" }),
  point: guessLine(4, 3, 2, { label: "A number line from 0 to 2 with a point between 1 and 2" }),
};
const STEPS = [
  {
    title: "Estimate, then check",
    widget: wStrip,
    body: "<p>An <b>estimate</b> is a guess that’s about right. To estimate how much of a strip is shaded, ask: is it more or less than half? Then picture the strip cut into equal parts.</p><p>To check, cut the strip into equal parts. When the shading ends right on a line, you can count the parts.</p>",
    check: {
      kind: "mc",
      q: "About what fraction of this strip is shaded?",
      fig: F.strip,
      answer: "b",
      choices: [
        { id: "a", label: fr(1, 3) },
        { id: "b", label: fr(2, 3) },
        { id: "c", label: fr(7, 8) },
      ],
      why: {
        a: "That’s too little: more than half the strip is shaded.",
        c: "That’s too much: about a third of the strip is empty, not an eighth.",
      },
      explain: "Cut into thirds, the shading covers 2 of the 3 parts: about 2/3.",
    },
  },
  {
    title: "Estimate on a number line",
    widget: wPoint,
    body: "<p>A point on a number line can be estimated too. First ask: is it before 1 or after 1? Then picture each whole cut into equal parts.</p><p>Cut the wholes into equal parts to check. When the point is right on a tick, count the jumps from 0.</p>",
    check: {
      kind: "mc",
      q: "About what number is at the point?",
      fig: F.point,
      answer: "b",
      choices: [
        { id: "a", label: fr(2, 3) },
        { id: "b", label: fr(4, 3) },
        { id: "c", label: fr(7, 4) },
      ],
      why: {
        a: "That’s less than 1, but the point is past 1.",
        c: "That’s too big: the point is closer to 1 than to 2.",
      },
      explain: "The point is a bit past 1. With each whole cut into thirds, it’s 4 jumps of 1/3 from 0: 4/3.",
    },
  },
];
