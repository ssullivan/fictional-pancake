/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5), chapter 4: Pounds, ounces, and time. Its widgets and steps; loaded by pounds-time.html. */
/* parts of a pound or an hour to add on: [id, button, the fraction as [n, d] (null for none)] */
const PARTS = [
  ["0", "Whole ones", null],
  ["1/4", "and 1/4", [1, 4]],
  ["1/2", "and 1/2", [1, 2]],
  ["3/4", "and 3/4", [3, 4]],
];
/* "3 1/2" (html), or just "3" with no part; part is [n, d] or null */
const withPart = (whole, part) => (part ? `${whole ? whole + " " : ""}${fr(...part)}` : `${whole}`);
/* Pick a number of pounds (a stepper) and a part of a pound: a table of pounds and ounces, and the ounces in all. */
function wPounds(el) {
  /* the stepper's value: lb, the whole pounds */
  const q = Q(el),
    values = { lb: 3 },
    limits = { lb: [0, 6] };
  let partIndex = 0;
  el.innerHTML =
    seg(
      "Part of a pound",
      PARTS.map(([id, name], i) => [i, name]),
    ) +
    `<div class="wrow">${stepper("lb", "Pounds")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const lb = values.lb,
      part = PARTS[partIndex][2],
      partOz = part ? (16 * part[0]) / part[1] : 0,
      ounces = 16 * lb + partOz;
    press(el, partIndex);
    q("lb").textContent = lb;
    q("f").innerHTML = convTable(
      ["pounds", "ounces"],
      [...range(Math.max(lb, 1)).map((i) => [i + 1, 16 * (i + 1)]), ...(part ? [[fr(...part), partOz]] : [])],
      { hi: lb - 1 },
    );
    q("e").innerHTML =
      lb && part
        ? `${lb} × 16 + ${partOz} = ${ounces}`
        : part
          ? `${fr(...part)} × 16 = ${partOz}`
          : `${lb} × 16 = ${ounces}`;
    q("r").innerHTML =
      !lb && !part
        ? "0 pounds is 0 ounces. Add some pounds."
        : `1 pound is 16 ounces${part ? `, and ${fr(...part)} pound is ${fr(...part)} of 16: ${partOz} ounces` : ""}. So ${withPart(lb, part)} pound${lb > 1 || (lb === 1 && part) ? "s" : ""} ${lb > 1 || (lb === 1 && part) ? "are" : "is"} <b>${ounces} ounces</b>.`;
  };
  steppers(el, values, limits, draw);
  onPick(el, (m) => {
    partIndex = +m;
    draw();
  });
  draw();
}
/* pairs of time units: [id, button, the big unit (one, many), the small unit (one, many)]; 60 of each make the next */
const TIMES = [
  ["h", "Hours to minutes", ["hour", "hours"], ["minute", "minutes"]],
  ["min", "Minutes to seconds", ["minute", "minutes"], ["second", "seconds"]],
];
/* Pick hours or minutes, how many (a stepper), and a part of one: the clock shades the part, and the total is worked out. */
function wTime(el) {
  /* the stepper's value: whole, how many whole hours (or minutes) */
  const q = Q(el),
    values = { whole: 1 },
    limits = { whole: [0, 4] };
  let pairIndex = 0,
    partIndex = 2;
  el.innerHTML =
    `<div data-top>${seg(
      "Units",
      TIMES.map(([, name], i) => [i, name]),
    )}</div><div data-bot>${seg(
      "Part",
      PARTS.map(([, name], i) => [i, name]),
    )}</div>` +
    `<div class="wrow">${stepper("whole", "Whole ones")}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, , big, small] = TIMES[pairIndex],
      whole = values.whole,
      part = PARTS[partIndex][2],
      partSmall = part ? (60 * part[0]) / part[1] : 0,
      total = 60 * whole + partSmall,
      many = whole > 1 || (whole === 1 && part);
    press(q("top"), pairIndex);
    press(q("bot"), partIndex);
    q("whole").textContent = whole;
    q("f").innerHTML = clockFig(12, partSmall, {
      r: 80,
      shade: part ? [0, partSmall] : null,
      fives: true,
      label: part
        ? `A clock face with ${partSmall} of its 60 ${pairIndex ? "seconds" : "minutes"} shaded`
        : "A clock face showing 12:00",
    });
    q("e").innerHTML =
      whole && part
        ? `${whole} × 60 + ${partSmall} = ${total}`
        : part
          ? `${fr(...part)} × 60 = ${partSmall}`
          : `${whole} × 60 = ${total}`;
    q("r").innerHTML =
      !whole && !part
        ? `0 ${big[1]} is 0 ${small[1]}. Add some ${big[1]}.`
        : `1 ${big[0]} is 60 ${small[1]}${part ? `, and ${fr(...part)} ${big[0]} is ${fr(...part)} of 60: ${partSmall} ${small[1]} (the shaded part of the clock)` : ""}. So ${withPart(whole, part)} ${many ? big[1] : big[0]} ${many ? "are" : "is"} <b>${total} ${small[1]}</b>.`;
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") pairIndex = +hit[1];
    else partIndex = +hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Pounds and ounces",
    widget: wPounds,
    body: "<p>1 pound is 16 ounces. To change pounds into ounces, multiply by 16. Half a pound is half of 16 ounces, and a fourth of a pound is a fourth of 16.</p><p>Change the pounds and pick a part of a pound.</p>",
    check: {
      kind: "num",
      q: "A puppy weighs 3 pounds. How many ounces is that?",
      answer: 48,
      unit: "ounces",
      misc: [
        [30, "A pound is 16 ounces, not 10: 3 × 16."],
        [19, "That adds 3 + 16. Each of the 3 pounds is 16 ounces: 3 × 16."],
      ],
      explain: "1 pound is 16 ounces, so 3 pounds is 3 × 16 = 48 ounces.",
    },
  },
  {
    title: "Hours, minutes, and seconds",
    widget: wTime,
    body: "<p>1 hour is 60 minutes, and 1 minute is 60 seconds. A part of an hour is that part of 60 minutes: half an hour is 30 minutes, and a fourth of an hour is 15 minutes.</p><p>Pick the units, how many whole ones, and a part.</p>",
    check: {
      kind: "num",
      q: "A movie is 1 1/2 hours long. How many minutes is that?",
      answer: 90,
      unit: "minutes",
      misc: [
        [110, "That reads 1 1/2 hours as 1 hour and 50 minutes. Half an hour is half of 60 minutes: 30."],
        [75, "That’s 1 1/4 hours. Half an hour is 30 minutes, not 15."],
      ],
      explain: "1 hour is 60 minutes and 1/2 hour is 30 minutes: 60 + 30 = 90 minutes.",
    },
  },
];
