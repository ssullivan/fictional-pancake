/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 3: Round decimals. Its widgets and steps;
   loaded by round.html. */
/* numbers to round, in thousandths */
const TO_ROUND = [3476, 12851, 649];
/* places to round to: [id, button, the place's size in thousandths, decimals to write] */
const ROUND_PLACES = [
  ["whole", "Whole number", 1000, 0],
  ["tenth", "Tenth", 100, 1],
  ["hundredth", "Hundredth", 10, 2],
];
/* Pick a number and a place (two rows of buttons): see it between the two round numbers around it, and which is nearer. */
function wRound(el) {
  const q = Q(el);
  let numberIndex = 0,
    placeIndex = 1;
  el.innerHTML = `<div data-top>${seg(
    "Number",
    TO_ROUND.map((k, i) => [i, dec(k)]),
  )}</div><div data-bot>${seg(
    "Round to the nearest",
    ROUND_PLACES.map(([id, button], i) => [i, button]),
  )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const k = TO_ROUND[numberIndex],
      [, button, unit, decimals] = ROUND_PLACES[placeIndex],
      down = Math.floor(k / unit) * unit,
      up = down + unit,
      rounded = Math.floor(k / unit + 0.5) * unit,
      written = (v) => (v / 1000).toFixed(decimals);
    press(q("top"), numberIndex);
    press(q("bot"), placeIndex);
    q("f").innerHTML = roundFig(k, unit);
    q("r").innerHTML =
      `${dec(k)} is between ${written(down)} and ${written(up)}. Halfway is ${dec(down + unit / 2)}, and ${dec(k)} is ${rounded === up ? "past" : "before"} it, so it rounds to <b>${written(rounded)}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") numberIndex = +hit[1];
    else placeIndex = +hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Round on a number line",
    widget: wRound,
    body: "<p>To round, find the two round numbers the decimal is between, like the tenths 3.4 and 3.5. It rounds to whichever is nearer: look at the place just to the right. Halfway or more rounds up.</p><p>Pick a number and a place to round to.</p>",
    check: {
      kind: "num",
      q: "Round 6.248 to the nearest tenth.",
      answer: 6.2,
      unit: "",
      tol: 0.0005,
      misc: [
        [6.3, "6.248 is before the halfway point, 6.25, so it’s nearer 6.2."],
        [6.25, "That rounds to the nearest hundredth. This asks for the nearest tenth."],
      ],
      explain: "6.248 is between 6.2 and 6.3. Halfway is 6.25, and 6.248 is less, so it rounds to 6.2.",
    },
  },
];
