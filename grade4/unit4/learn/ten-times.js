/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 4: Ten times as much. Its widgets and steps; loaded by ten-times.html. */
/* the numbers to start from */
const STARTS = [3, 45, 207];
/* Multiply by 10 again and again (a stepper): every digit moves one place to the left. */
function wTimes(el) {
  /* the stepper's value: tm, how many times to multiply by 10, up to the hundred-thousands */
  const q = Q(el),
    values = { tm: 1 },
    limits = { tm: [0, 5] };
  let startIndex = 1;
  el.innerHTML =
    seg(
      "Start with",
      STARTS.map((v, i) => [i, v]),
    ) +
    `<div class="wrow">${stepper("tm", "Times 10")}</div><div data-c></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* topPlace: where the start's first digit is; firstDigit: that digit */
    const start = STARTS[startIndex],
      times = values.tm,
      product = start * 10 ** times,
      topPlace = String(start).length - 1,
      firstDigit = +String(start)[0];
    press(el, startIndex);
    q("tm").textContent = times;
    q("c").innerHTML = pvChart(
      range(times + 1).map((j) => [j ? "× 10" : "", start * 10 ** j]),
      -1,
      { places: WIDE },
    );
    q("e").innerHTML = times ? `${commas(start)}${" × 10".repeat(times)} = ${commas(product)}` : commas(start);
    q("r").innerHTML = !times
      ? `Start with ${commas(start)}. Multiply by 10.`
      : `Each × 10 moves every digit one place to the left, and a 0 fills the ones place. <b>${commas(product)}</b> is ${times === 1 ? "10" : times === 2 ? "100" : times === 3 ? "1,000" : times === 4 ? "10,000" : "100,000"} times ${commas(start)}.` +
        `<br><span class="dimline">The ${firstDigit} was ${firstDigit} ${PL[topPlace][firstDigit === 1 ? 0 : 1]}. Now it’s ${firstDigit} ${PL[topPlace + times][firstDigit === 1 ? 0 : 1]}.</span>`;
  };
  /* a new start: the stepper goes only as far as the hundred-thousands */
  const chooseStart = (i) => {
    startIndex = i;
    limits.tm[1] = 5 - (String(STARTS[startIndex]).length - 1);
    values.tm = Math.min(values.tm, limits.tm[1]);
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const startBtn = e.target.closest("[data-m]");
    if (startBtn) {
      chooseStart(+startBtn.dataset.m);
      draw();
    }
  });
  chooseStart(startIndex);
  draw();
}
/* number lines in thousands: from lo to hi, a tick every step, taller every big */
const BIG = [
  { name: "0 to 100,000", lo: 0, hi: 100, step: 10, big: 50 },
  { name: "70,000 to 80,000", lo: 70, hi: 80, step: 1, big: 5 },
  { name: "200,000 to 300,000", lo: 200, hi: 300, step: 10, big: 50 },
];
/* one of BIG's number lines, about 360 pixels long; options go to numLine */
const kLine = (line, options = {}) =>
  numLine(line.lo, line.hi, {
    u: 360 / ((line.hi - line.lo) / line.step) / line.step,
    pad: 36,
    step: line.step,
    big: line.big,
    fmt: (v) => commas(v * 1000),
    ...options,
  });
/* Tap a tick on a number line of large numbers to name it. */
function wBigLine(el) {
  /* k: the tick tapped, in thousands (null before one is) */
  const q = Q(el);
  let lineIndex = 0,
    k = null;
  el.innerHTML =
    seg(
      "Number line",
      BIG.map((line, i) => [i, line.name]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const line = BIG[lineIndex];
    press(el, lineIndex);
    q("f").innerHTML = kLine(line, {
      tap: true,
      pts: k === null ? [] : [{ v: k, t: commas(k * 1000) }],
      label:
        `Number line from ${commas(line.lo * 1000)} to ${commas(line.hi * 1000)}, a tick every ${commas(line.step * 1000)}` +
        (k === null ? "" : `, with a point at ${commas(k * 1000)}`),
    });
    q("r").innerHTML =
      k === null
        ? `The line goes from ${commas(line.lo * 1000)} to ${commas(line.hi * 1000)} in 10 equal jumps, so each tick is <b>${commas(line.step * 1000)}</b> more. Tap a tick mark.`
        : `<b>${commas(k * 1000)}</b>: ${(k - line.lo) / line.step} jump${(k - line.lo) / line.step === 1 ? "" : "s"} of ${commas(line.step * 1000)} from ${commas(line.lo * 1000)}.`;
  };
  el.addEventListener("click", (e) => {
    const lineBtn = e.target.closest("[data-m]");
    if (lineBtn) {
      lineIndex = +lineBtn.dataset.m;
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
/* the quick checks' figures */
const F = {
  line: kLine(BIG[2], {
    pts: [{ v: 240 }],
    label: "Number line from 200,000 to 300,000 with a tick every 10,000, and a point at the fourth tick after 200,000",
  }),
};
const STEPS = [
  {
    title: "Ten times as much",
    widget: wTimes,
    body: "<p>Each place is worth 10 times the place to its right. So when you multiply a number by 10, every digit moves one place to the left: 45 × 10 = 450, and 450 × 10 = 4,500.</p><p>Pick a number, then multiply by 10 again and again.</p>",
    check: {
      kind: "mc",
      q: "The school library has 4,500 books. The city library has 10 times as many. How many books does the city library have?",
      choices: [
        { id: "a", label: "4,510" },
        { id: "b", label: "45,000" },
        { id: "c", label: "450,000" },
      ],
      answer: "b",
      why: {
        a: "You added 10. 10 times as many means multiply by 10.",
        c: "That’s 100 times as many: the digits moved two places. 10 times moves them one place.",
      },
      explain: "4,500 × 10 = 45,000. The 4 thousands become 4 ten-thousands, and the 5 hundreds become 5 thousands.",
    },
  },
  {
    title: "Large numbers on a number line",
    widget: wBigLine,
    body: "<p>To read a number line, find how much each jump is worth. From 0 to 100,000 in 10 equal jumps, each jump is 10,000. From 70,000 to 80,000 in 10 jumps, each jump is 1,000.</p><p>Pick a number line. Tap a tick to name it.</p>",
    check: {
      kind: "mc",
      q: "What number is at the dot?",
      fig: F.line,
      choices: [
        { id: "a", label: "240,000" },
        { id: "b", label: "204,000" },
        { id: "c", label: "24,000" },
      ],
      answer: "a",
      why: {
        b: "Each jump here is 10,000, not 1,000. 4 jumps of 10,000 from 200,000 is 240,000.",
        c: "The line starts at 200,000, not 0. Start counting from 200,000.",
      },
      explain: "From 200,000 to 300,000 in 10 jumps, each jump is 10,000. The dot is 4 jumps past 200,000: 240,000.",
    },
  },
];
