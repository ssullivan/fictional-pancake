/* Learn Measuring Length (Grade 2 Unit 3), chapter 2: Centimeters and meters. Its widgets and steps; loaded by cm-and-m.html. */
/* an object with a 10 cm strip under it, for estimating (24 pixels per cm, like the 20 cm ruler it's measured on) */
const estFig = (kind, len) =>
  svgWrap(
    Math.max(len, 10) * 24 + 110,
    90,
    thing(kind, 22, 12, len * 24) +
      `<rect class="ref" x="22" y="56" width="240" height="20" rx="3"/><text class="lbl st" x="274" y="66">10 cm</text>`,
    `A ${NAME[kind]} above a strip 10 centimeters long`,
  );
/* objects to estimate [kind, cm], and the estimates to choose from */
const EST = [
    ["eraser", 6],
    ["glue", 9],
    ["pencil", 17],
  ],
  GUESS = [5, 10, 20];
/* Estimate an object's length against a 10 cm strip, then measure it on a ruler. */
function wEstimate(el) {
  /* guessIndex: the estimate tapped (-1 for none); shown: it's been measured */
  const q = Q(el);
  let objectIndex = 0,
    guessIndex = -1,
    shown = false;
  el.innerHTML =
    seg(
      "Object",
      EST.map(([kind], i) => [i, NAME[kind]]),
    ) +
    `<div class="fig" data-f></div><div class="chips" data-c></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* best: the estimate closest to the real length */
    const [kind, len] = EST[objectIndex],
      best = GUESS.reduce((closest, g) => (Math.abs(g - len) < Math.abs(closest - len) ? g : closest));
    press(el, objectIndex);
    q("f").innerHTML = shown ? ruler(20, { u: 24, obj: { kind, at: 0, len } }) : estFig(kind, len);
    q("c").innerHTML = GUESS.map(
      (g, i) =>
        `<button type="button" class="chip" data-e="${i}" aria-pressed="${i === guessIndex}"${shown ? " disabled" : ""}>about ${g} cm</button>`,
    ).join("");
    q("go").disabled = guessIndex < 0;
    q("go").textContent = shown ? "Try another" : "Measure it";
    q("r").innerHTML =
      guessIndex < 0
        ? `About how long is the ${NAME[kind]}? Use the 10 cm strip to help. Tap an estimate.`
        : !shown
          ? `Your estimate: <b>about ${GUESS[guessIndex]} cm</b>. Now measure it.`
          : `It’s <b>${len} cm</b> long. You said about ${GUESS[guessIndex]} cm.<br>` +
            (GUESS[guessIndex] === best
              ? `<span class="ok">Great estimate!</span>`
              : `<span class="dimline">About ${best} cm is closer. An estimate doesn’t have to be exact.</span>`);
  };
  el.addEventListener("click", (e) => {
    const objectBtn = e.target.closest("[data-m]");
    if (objectBtn) {
      objectIndex = +objectBtn.dataset.m;
      guessIndex = -1;
      shown = false;
      draw();
      return;
    }
    const guessBtn = e.target.closest("[data-e]");
    if (guessBtn && !shown) {
      guessIndex = +guessBtn.dataset.e;
      draw();
    }
  });
  /* measure, or once measured, go on to the next object */
  q("go").onclick = () => {
    if (shown) {
      objectIndex = (objectIndex + 1) % EST.length;
      guessIndex = -1;
      shown = false;
    } else shown = true;
    draw();
  };
  draw();
}
/* things to measure: kind, length in cm, and the unit that fits (u) */
const MTH = [
  { k: "crayon", cm: 9, u: "cm" },
  { k: "book", cm: 25, u: "cm" },
  { k: "rope", cm: 200, u: "m" },
  { k: "rug", cm: 300, u: "m" },
];
/* Centimeters or meters? A thing above 3 meter sticks; tap the unit that fits it. */
function wMeters(el) {
  /* choice: 'cm' or 'm' (null before one is tapped) */
  const q = Q(el);
  let thingIndex = 0,
    choice = null;
  el.innerHTML =
    seg(
      "Thing",
      MTH.map((item, i) => [i, NAME[item.k]]),
    ) + `<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { k: kind, cm, u: unit } = MTH[thingIndex],
      name = NAME[kind],
      meters = cm / 100;
    press(el, thingIndex);
    /* 1.2 pixels per cm, so each meter stick is 120 wide */
    q("f").innerHTML = svgWrap(
      380,
      90,
      thing(kind, 10, 10, cm * 1.2) +
        range(3)
          .map(
            (i) =>
              `<rect class="mst ${i % 2 ? "b" : "a"}" x="${10 + i * 120}" y="50" width="120" height="26"/><text class="lbl s dk" x="${70 + i * 120}" y="63">1 meter</text>`,
          )
          .join(""),
      `A ${name} above 3 meter sticks`,
    );
    q("c").innerHTML = [
      ["cm", "Centimeters"],
      ["m", "Meters"],
    ]
      .map(
        ([id, text]) =>
          `<button type="button" class="chip" data-e="${id}" aria-pressed="${id === choice}">${text}</button>`,
      )
      .join("");
    q("r").innerHTML = !choice
      ? `Would you measure the ${name} in centimeters or meters?`
      : choice === unit
        ? unit === "cm"
          ? `<span class="ok">Yes! The ${name} is much shorter than a meter stick. It’s about <b>${cm} cm</b> long.</span>`
          : `<span class="ok">Yes! The ${name} is about ${meters} meter sticks long: <b>${meters} meters</b>.</span>`
        : unit === "cm"
          ? `<span class="dimline">The ${name} is much shorter than 1 meter stick. Try centimeters.</span>`
          : `<span class="dimline">That’s a lot of centimeters to count! The ${name} is about ${meters} meter sticks long. Try meters.</span>`;
  };
  el.addEventListener("click", (e) => {
    const thingBtn = e.target.closest("[data-m]");
    if (thingBtn) {
      thingIndex = +thingBtn.dataset.m;
      choice = null;
      draw();
      return;
    }
    const unitBtn = e.target.closest("[data-e]");
    if (unitBtn) {
      choice = unitBtn.dataset.e;
      draw();
    }
  });
  draw();
}
/* pairs of reptiles: [button label, length in cm, name] */
const REPS = [
  { a: ["Dragon", 55, "bearded dragon"], b: ["Gecko", 22, "leopard gecko"] },
  { a: ["Skink", 48, "blue-tongued skink"], b: ["Turtle", 15, "box turtle"] },
  { a: ["Dragon", 55, "bearded dragon"], b: ["Skink", 48, "blue-tongued skink"] },
];
/* How much longer? Two reptiles as tapes; a button shows the difference. */
function wReptiles(el) {
  const q = Q(el);
  let pairIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Reptiles",
      REPS.map(({ a, b }, i) => [i, `${a[0]} and ${b[0].toLowerCase()}`]),
    ) +
    `<div class="fig" data-t></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const {
        a: [labelA, a, nameA],
        b: [labelB, b, nameB],
      } = REPS[pairIndex],
      diff = a - b;
    press(el, pairIndex);
    q("t").innerHTML = tapes(
      [
        { label: labelA, n: a, show: a },
        { label: labelB, n: b, show: b },
      ],
      { diff: shown ? diff : "?" },
    );
    q("go").textContent = shown ? "Start over" : "How much longer?";
    q("r").innerHTML = shown
      ? `<b>${b} + ${diff} = ${a}</b>, or <b>${a} − ${b} = ${diff}</b>.<br><span class="ok">The ${nameA} is ${diff} cm longer.</span>`
      : `A ${nameA} is ${a} cm long. A ${nameB} is ${b} cm long.<br><span class="dimline">How much longer is the ${nameA}? That’s the dashed part.</span>`;
  };
  el.addEventListener("click", (e) => {
    const pairBtn = e.target.closest("[data-m]");
    if (pairBtn) {
      pairIndex = +pairBtn.dataset.m;
      shown = false;
      draw();
    }
  });
  q("go").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  marker: estFig("marker", 14),
  meter: svgWrap(
    260,
    40,
    `<rect class="mst a" x="10" y="8" width="240" height="26"/><text class="lbl s dk" x="130" y="21">1 meter = 100 centimeters</text>`,
    "A meter stick: 1 meter is 100 centimeters",
  ),
  snake: tapes(
    [
      { label: "Snake", n: 60, show: 60 },
      { label: "Gecko", n: 24, show: 24 },
    ],
    { diff: "?" },
  ),
};
const STEPS = [
  {
    title: "Estimate, then measure",
    widget: wEstimate,
    body: "<p>An <b>estimate</b> is a smart guess. Compare with something you know, like a 10 cm strip. Then measure to check.</p><p>Pick a thing and an estimate. Then measure it.</p>",
    check: {
      kind: "mc",
      q: "About how long is this marker?",
      fig: F.marker,
      choices: [
        { id: "a", label: "about 2 cm" },
        { id: "b", label: "about 14 cm" },
        { id: "c", label: "about 100 cm" },
      ],
      answer: "b",
      why: {
        a: "2 cm is about as long as a paper clip. The marker is longer than the 10 cm strip.",
        c: "100 cm is a whole meter stick! The marker is only a little longer than the 10 cm strip.",
      },
      explain: "The marker is a little longer than the 10 cm strip, so about 14 cm is a good estimate.",
    },
  },
  {
    title: "Meters",
    widget: wMeters,
    body: "<p>A meter stick is <b>1 meter</b> long. That’s <b>100 centimeters</b>. Use meters for long things and centimeters for short things.</p><p>Pick a thing. Would you use centimeters or meters?</p>",
    check: {
      kind: "mc",
      q: "Which one would you measure in meters?",
      fig: F.meter,
      choices: [
        { id: "a", label: "A crayon" },
        { id: "b", label: "The hallway" },
        { id: "c", label: "A shoe" },
      ],
      answer: "b",
      why: {
        a: "A crayon is much shorter than a meter stick. Use centimeters.",
        c: "A shoe is much shorter than a meter stick. Use centimeters.",
      },
      explain:
        "A hallway is many meter sticks long, so meters are a good unit. Crayons and shoes are short, so use centimeters.",
    },
  },
  {
    title: "Compare lengths",
    widget: wReptiles,
    body: "<p>To find <b>how much longer</b>, find the difference. You can count on from the shorter length or subtract.</p><p>Pick two reptiles, then find how much longer one is.</p>",
    check: {
      kind: "num",
      unit: "cm",
      answer: 36,
      fig: F.snake,
      q: "A garter snake is 60 cm long. A gecko is 24 cm long. How much longer is the snake than the gecko?",
      misc: [
        [84, "You added. “How much longer” asks for the difference, so subtract."],
        [60, "That’s how long the snake is. How much longer is it than the gecko?"],
        [44, "60 has 0 ones, so break a ten: 10 − 4 = 6 ones, and 5 − 2 = 3 tens."],
      ],
      explain: "60 − 24 = 36. Or count on: 24 + 6 = 30, and 30 + 30 = 60. 6 + 30 = 36 cm.",
    },
  },
];
