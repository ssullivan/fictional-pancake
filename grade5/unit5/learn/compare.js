/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 2: Compare and order. Its widgets and steps;
   loaded by compare.html. */
/* pairs to compare, in thousandths */
const PAIRS = [
  [500, 480],
  [307, 370],
  [1250, 1205],
  [600, 600],
];
/* Pick a pair: compare it place by place in a chart, from the left, until a place differs. */
function wCompare(el) {
  const q = Q(el);
  let pairIndex = 0;
  el.innerHTML =
    seg(
      "Pair",
      PAIRS.map(([a, b], i) => [i, i === 3 ? "0.6 and 0.600" : `${dec(a)} and ${dec(b)}`]),
    ) + `<div data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = PAIRS[pairIndex],
      names = ["ones", "tenths", "hundredths", "thousandths"],
      /* the first place, from the left, where the digits differ */
      digitOf = (k, i) => Math.floor(k / 10 ** (3 - i)) % 10,
      place = [0, 1, 2, 3].find((i) => digitOf(a, i) !== digitOf(b, i)),
      shownB = pairIndex === 3 ? "0.600" : dec(b);
    press(el, pairIndex);
    q("c").innerHTML = pvChart(
      [
        ["", a / 1000],
        ["", b / 1000],
      ],
      place === undefined ? -1 : place,
      { places: [0, -1, -2, -3] },
    );
    q("r").innerHTML =
      place === undefined
        ? `Every place is the same: <b>${dec(a)} = ${shownB}</b>. Zeros at the end don’t change a decimal.`
        : `The ${names.slice(0, place).join(" and ") || "places before"} match. In the ${names[place]}, ${digitOf(a, place)} ${digitOf(a, place) > digitOf(b, place) ? ">" : "<"} ${digitOf(b, place)}, so <b>${dec(a)} ${a > b ? "&gt;" : "&lt;"} ${dec(b)}</b>.`;
  };
  onPick(el, (m) => {
    pairIndex = +m;
    draw();
  });
  draw();
}
/* number lines to zoom in on 0.257: [button, lo, hi, step] in thousandths */
const ZOOMS = [
  ["0 to 1", 0, 1000, 100],
  ["0.2 to 0.3", 200, 300, 10],
  ["0.25 to 0.26", 250, 260, 1],
];
/* Zoom in on a number line, from tenths to hundredths to thousandths, to find 0.257. */
function wZoomLine(el) {
  const q = Q(el);
  let zoomIndex = 0;
  el.innerHTML =
    seg(
      "Number line",
      ZOOMS.map(([button], i) => [i, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, lo, hi, step] = ZOOMS[zoomIndex];
    press(el, zoomIndex);
    q("f").innerHTML = thouLine(lo, hi, step, { pts: [{ v: 257, t: "0.257" }], lab: () => true, ls: "s" });
    q("r").innerHTML = [
      "From 0 to 1 in tenths, 0.257 is between 0.2 and 0.3. Zoom in on that tenth.",
      "From 0.2 to 0.3 in hundredths, 0.257 is between 0.25 and 0.26. Zoom in again.",
      "From 0.25 to 0.26 in thousandths, 0.257 is 7 ticks past 0.25. Each tick is 0.001.",
    ][zoomIndex];
  };
  onPick(el, (m) => {
    zoomIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Compare place by place",
    widget: wCompare,
    body: "<p>To compare decimals, line up the decimal points and compare from the left. The first place where the digits differ decides. More digits doesn’t mean bigger: 0.5 is more than 0.48, since 5 tenths is more than 4 tenths.</p><p>Pick a pair.</p>",
    check: {
      kind: "mc",
      q: "Which is greater, 0.6 or 0.58?",
      answer: "a",
      choices: [
        { id: "a", label: "0.6" },
        { id: "b", label: "0.58" },
        { id: "c", label: "They’re equal" },
      ],
      why: {
        b: "0.58 has more digits, but compare the tenths: 6 tenths is more than 5 tenths.",
        c: "0.6 is 0.60, and 60 hundredths isn’t 58 hundredths.",
      },
      explain: "In the tenths, 6 > 5, so 0.6 > 0.58.",
    },
  },
  {
    title: "Zoom in on a number line",
    widget: wZoomLine,
    body: "<p>Between any two tenths are hundredths, and between any two hundredths are thousandths. Zoom in on a number line to see exactly where a decimal is, and which numbers it’s between.</p><p>Zoom in on 0.257.</p>",
    check: {
      kind: "mc",
      q: "Order from least to greatest: 0.25, 0.205, 0.3.",
      answer: "c",
      choices: [
        { id: "a", label: "0.3, 0.25, 0.205" },
        { id: "b", label: "0.25, 0.205, 0.3" },
        { id: "c", label: "0.205, 0.25, 0.3" },
      ],
      why: {
        a: "That’s greatest to least. Start with the least.",
        b: "0.205 is less than 0.25: in the hundredths, 0 < 5.",
      },
      explain: "0.205 < 0.25 < 0.3: compare the tenths, then the hundredths.",
    },
  },
];
