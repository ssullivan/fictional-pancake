/* Learn Measuring Length (Grade 2 Unit 3), chapter 3: Inches and feet. Its widgets and steps; loaded by inches-and-feet.html. */
/* `count` foot rulers end to end from x, y (8 pixels per inch), with the inches so far under each join, or "12 in" under each one (each) */
const footRow = (x, y, count, each) =>
  range(count)
    .map((i) => {
      const left = x + i * 96;
      return (
        `<rect class="rul" x="${left}" y="${y}" width="96" height="30" rx="2"/>` +
        range(11)
          .map(
            (j) =>
              `<line class="tick" x1="${left + (j + 1) * 8}" y1="${y}" x2="${left + (j + 1) * 8}" y2="${y + (j === 5 ? 14 : 8)}"/>`,
          )
          .join("") +
        (each
          ? `<text class="lbl s" x="${left + 48}" y="${y + 46}">12 in</text>`
          : `<text class="lbl cy" x="${left + 96}" y="${y + 46}">${12 * (i + 1)}</text>`)
      );
    })
    .join("");
/* a thing ft feet long with `count` foot rulers under it, room for most of them */
const feetFig = (kind, ft, count, most = ft, each = false) =>
  svgWrap(
    40 + most * 96,
    110,
    thing(kind, 20, 10, ft * 96) + footRow(20, 52, count, each),
    `A ${NAME[kind]} with ${count} foot rulers under it`,
  );
/* objects measured both ways: [kind, inches, centimeters] */
const INCH = [
  ["crayon", 4, 10],
  ["eraser", 2, 5],
  ["marker", 5, 13],
];
/* The same object on an inch ruler and a centimeter ruler. */
function wInch(el) {
  const q = Q(el);
  let objectIndex = 0;
  el.innerHTML =
    seg(
      "Object",
      INCH.map(([kind], i) => [i, NAME[kind]]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [kind, inches, cm] = INCH[objectIndex];
    press(el, objectIndex);
    q("f").innerHTML =
      ruler(6, { unit: "in", u: 48, obj: { kind, at: 0, len: inches } }) +
      ruler(16, { unit: "cm", u: 19, obj: { kind, at: 0, len: cm } });
    q("r").innerHTML =
      `Inch ruler: <b>${inches} inches</b>. Centimeter ruler: about <b>${cm} cm</b>.<br><span class="dimline">Same ${NAME[kind]}! An inch is longer than a centimeter, so it takes fewer inches.</span>`;
  };
  el.addEventListener("click", (e) => {
    const objectBtn = e.target.closest("[data-m]");
    if (objectBtn) {
      objectIndex = +objectBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* things measured in feet: [kind, feet] */
const FEET = [
  ["box", 1],
  ["rug", 3],
  ["bench", 4],
];
/* Lay foot rulers under a thing (a stepper, up to one past its end) and count the inches. */
function wFeet(el) {
  /* the stepper's value: k foot rulers */
  const q = Q(el),
    values = { k: 0 };
  let thingIndex = 0;
  el.innerHTML =
    seg(
      "Thing",
      FEET.map(([kind], i) => [i, NAME[kind]]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("k", "Foot rulers")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [kind, ft] = FEET[thingIndex],
      rulers = values.k,
      sum = range(rulers)
        .map(() => 12)
        .join(" + ");
    press(el, thingIndex);
    q("k").textContent = rulers;
    q("f").innerHTML = feetFig(kind, ft, rulers, ft + 1);
    q("r").innerHTML =
      rulers === ft
        ? `<span class="ok">The ${NAME[kind]} is <b>${ft} ${ft > 1 ? "feet" : "foot"}</b> long. That’s ${ft > 1 ? sum + " = " : ""}<b>${12 * ft} inches</b>.</span>`
        : !rulers
          ? `A foot ruler is 12 inches long. Lay foot rulers under the ${NAME[kind]}.`
          : `<b>${rulers} ${rulers > 1 ? "feet" : "foot"}</b>: ${rulers > 1 ? sum + " = " : ""}${12 * rulers} inches<br><span class="dimline">${rulers > ft ? "That goes past the end. Take one away." : "Not to the end yet."}</span>`;
  };
  const limits = { k: [0, FEET[0][1] + 1] };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const thingBtn = e.target.closest("[data-m]");
    if (thingBtn) {
      thingIndex = +thingBtn.dataset.m;
      values.k = 0;
      limits.k[1] = FEET[thingIndex][1] + 1;
      draw();
    }
  });
  draw();
}
/* objects on a torn tape: [kind, inches] */
const TORN = [
  ["crayon", 4],
  ["marker", 5],
  ["glue", 3],
];
/* An object on a torn tape that starts at 4: a stepper slides it, and its length is still the spaces it covers. */
function wTorn(el) {
  /* the stepper's value: at, where the object starts */
  const q = Q(el),
    values = { at: 6 };
  let objectIndex = 0;
  el.innerHTML =
    seg(
      "Object",
      TORN.map(([kind], i) => [i, NAME[kind]]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("at", "Start at")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [kind, len] = TORN[objectIndex],
      start = values.at,
      end = start + len;
    press(el, objectIndex);
    q("at").textContent = start;
    q("f").innerHTML = ruler(10, {
      unit: "in",
      u: 40,
      start: 4,
      torn: true,
      obj: { kind, at: start, len },
      span: true,
      count: true,
    });
    q("r").innerHTML =
      `It starts at <b>${start}</b> and ends at <b>${end}</b>.<br><span class="ok">Count the spaces: ${range(len)
        .map((i) => i + 1)
        .join(", ")}. That’s <b>${len} inches</b>. Or subtract: ${end} − ${start} = ${len}.</span>`;
  };
  steppers(el, values, { at: [4, 9] }, draw);
  el.addEventListener("click", (e) => {
    const objectBtn = e.target.closest("[data-m]");
    if (objectBtn) {
      objectIndex = +objectBtn.dataset.m;
      values.at = 6;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  crayon4: ruler(6, { unit: "in", u: 48, obj: { kind: "crayon", at: 0, len: 4 } }),
  poster: feetFig("poster", 2, 2, 2, true),
  torn: ruler(10, { unit: "in", u: 40, start: 4, torn: true, obj: { kind: "pencil", at: 5, len: 6 } }),
};
const STEPS = [
  {
    title: "What is an inch?",
    widget: wInch,
    body: "<p>An <b>inch</b> is another unit of length. An inch is longer than a centimeter.</p><p>Pick a thing. Measure it in inches and in centimeters.</p>",
    check: {
      kind: "mc",
      q: "A crayon is 4 inches long. About how many centimeters long is it?",
      fig: F.crayon4,
      choices: [
        { id: "a", label: "about 2 cm" },
        { id: "b", label: "about 4 cm" },
        { id: "c", label: "about 10 cm" },
      ],
      answer: "c",
      why: {
        a: "A centimeter is smaller than an inch, so it takes more centimeters, not fewer.",
        b: "Inches and centimeters are different sizes. A centimeter is smaller, so it takes more of them.",
      },
      explain:
        "A centimeter is smaller than an inch, so the number of centimeters is bigger. The crayon is about 10 cm long.",
    },
  },
  {
    title: "Feet and inches",
    widget: wFeet,
    body: "<p>A <b>foot</b> is 12 inches long. Use feet for bigger things, like a rug.</p><p>Pick a thing, then lay foot rulers under it.</p>",
    check: {
      kind: "num",
      unit: "inches",
      answer: 24,
      fig: F.poster,
      q: "A poster is 2 feet long. How many inches long is it?",
      misc: [
        [2, "That’s in feet. Each foot is 12 inches."],
        [14, "2 feet is 12 inches and 12 more inches, not 12 + 2."],
        [12, "That’s 1 foot. The poster is 2 feet long."],
      ],
      explain: "Each foot is 12 inches. 12 + 12 = 24, so the poster is 24 inches long.",
    },
  },
  {
    title: "Measure with a torn tape",
    widget: wTorn,
    body: "<p>This tape is torn, so it doesn’t start at 0. You can still measure! Count the spaces, or subtract the start from the end.</p><p>Pick a thing, then slide it along the tape.</p>",
    check: {
      kind: "num",
      unit: "inches",
      answer: 6,
      fig: F.torn,
      q: "The tape is torn. How long is the pencil?",
      misc: [
        [11, "11 is where the pencil ends. The tape doesn’t start at 0."],
        [5, "5 is where the pencil starts. Count the spaces from 5 to 11."],
        [16, "You added. Subtract: 11 − 5."],
      ],
      explain: "The pencil starts at 5 and ends at 11. 11 − 5 = 6, so it’s 6 inches long.",
    },
  },
];
