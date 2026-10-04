/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 2: Decimals on number lines. Its widgets and steps; loaded by decimal-lines.html. */
/* the whole line in tenths, or zoomed in to hundredths between two tenths */
const VIEWS = [
  { name: "0 to 1", lo: 0, hi: 100, step: 10 },
  { name: "0.3 to 0.4", lo: 30, hi: 40, step: 1 },
  { name: "0.6 to 0.7", lo: 60, hi: 70, step: 1 },
];
/* Tap a tick on a decimal number line to name it. */
function wLine(el) {
  /* k: the tick tapped, in hundredths (null before one is) */
  const q = Q(el);
  let viewIndex = 0,
    k = null;
  el.innerHTML =
    seg(
      "Number line",
      VIEWS.map((view, i) => [i, view.name]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const view = VIEWS[viewIndex];
    press(el, viewIndex);
    q("f").innerHTML = decLine(view.lo, view.hi, view.step, {
      tap: true,
      pts: k === null ? [] : [{ v: k, t: dS(k) }],
      label:
        `Number line from ${dS(view.lo)} to ${dS(view.hi)}, a tick every ${view.step === 10 ? "tenth" : "hundredth"}` +
        (k === null ? "" : `, with a point at ${dS(k)}`),
    });
    const tenths = Math.floor(k / 10),
      hundredths = k % 10;
    q("r").innerHTML =
      k === null
        ? `Each tick is ${view.step === 10 ? `1 tenth: 0.1` : `1 hundredth: 0.01`}. Tap a tick mark.`
        : k % 100 === 0
          ? `<b>${dS(k)}</b>: ${k ? "1 whole, or 10 tenths." : "zero."}`
          : `<b>${dS(k)}</b>: ${tenths} ${PART[10][tenths === 1 ? 0 : 1]}${hundredths ? ` and ${hundredths} ${PART[100][hundredths === 1 ? 0 : 1]}` : ""}, or ${fr(k, 100)}.` +
            (hundredths ? "" : ` <span class="dimline">That’s also ${(k / 100).toFixed(2)}.</span>`);
  };
  el.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-m]");
    if (viewBtn) {
      viewIndex = +viewBtn.dataset.m;
      k = null;
      draw();
      return;
    }
    const tick = e.target.closest("[data-v]");
    if (tick) {
      k = +tick.dataset.v;
      draw();
    }
  });
  draw();
}
/* a number for wSign: v hundredths, written t */
const vt = (v, t) => ({ v, t });
/* Pick <, =, or > for decimals and fractions, then see both in hundredths on two grids. */
const wCmp = wSign(
  [
    [vt(60, "0.6"), vt(58, "0.58")],
    [vt(40, "0.4"), vt(40, "0.40")],
    [vt(70, "0.7"), vt(75, fr(3, 4))],
    [vt(9, "0.09"), vt(10, "0.1")],
  ],
  {
    show: (a, b) =>
      `<div class="picrow">${hundredGrid(cellsOf([a.v, "a"]), { label: `${a.v} hundredths` })}${hundredGrid(cellsOf([b.v, "b"]), { label: `${b.v} hundredths` })}</div>`,
    why: (a, b) =>
      `Write both in hundredths: ${a.t} is ${a.v} hundredths and ${b.t} is ${b.v} hundredths.` +
      (a.v === b.v ? " They are the same amount." : ` ${Math.max(a.v, b.v)} is more than ${Math.min(a.v, b.v)}.`),
  },
);
/* the quick checks' figures */
const F = {
  rope: decLine(20, 30, 1, {
    pts: [{ v: 27 }],
    label: "Number line from 0.2 to 0.3 with a tick every hundredth, and a point at the seventh tick after 0.2",
  }),
};
const STEPS = [
  {
    title: "Decimals on a number line",
    widget: wLine,
    body: "<p>Cut the space from 0 to 1 into 10 equal parts and each tick is 1 tenth: 0.1, 0.2, 0.3, and so on. Cut the space between two tenths into 10 more parts and each tick is 1 hundredth: 0.31, 0.32, 0.33.</p><p>Pick a number line. Tap a tick to name it.</p>",
    check: {
      kind: "mc",
      q: "Lin cut a piece of ribbon. The dot shows how long it is, in meters. How long is the piece?",
      fig: F.rope,
      choices: [
        { id: "a", label: "0.7 meter" },
        { id: "b", label: "0.28 meter" },
        { id: "c", label: "0.27 meter" },
      ],
      answer: "c",
      why: {
        a: "0.7 is 7 tenths, far past 0.3. The dot is between 0.2 and 0.3, 7 hundredths past 0.2.",
        b: "You counted the tick marks, starting with the one at 0.2. Count the jumps from 0.2 instead.",
      },
      explain: "The line goes from 0.2 to 0.3, a tick every hundredth. The dot is 7 hundredths past 0.2: 0.27 meter.",
    },
  },
  {
    title: "Compare and order",
    widget: wCmp,
    body:
      "<p>To compare decimals, write them both in hundredths. 0.6 is 60 hundredths, so it’s more than 0.58, even though 58 looks bigger than 6. Fractions work the same way: " +
      fr(3, 4) +
      " is " +
      fr(75, 100) +
      ", or 0.75.</p><p>Pick two numbers. Which sign makes it true?</p>",
    check: {
      kind: "mc",
      stack: true,
      q: "It rained 0.3 inch on Monday, 0.25 inch on Tuesday, 0.07 inch on Wednesday, and 0.4 inch on Thursday. Which list goes from least to greatest?",
      choices: [
        { id: "a", label: "0.3, 0.4, 0.07, 0.25" },
        { id: "b", label: "0.4, 0.3, 0.25, 0.07" },
        { id: "c", label: "0.07, 0.25, 0.3, 0.4" },
      ],
      answer: "c",
      why: {
        a: "You compared the digits after the point like whole numbers: 3, 4, 7, 25. In hundredths they are 30, 40, 7, and 25.",
        b: "That goes from greatest to least. Turn it around.",
      },
      explain:
        "In hundredths: 0.07 is 7, 0.25 is 25, 0.3 is 30, and 0.4 is 40. From least to greatest: 0.07, 0.25, 0.3, 0.4.",
    },
  },
];
