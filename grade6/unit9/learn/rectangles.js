/* Learn Putting It All Together (Grade 6 Unit 9), chapter 2: Rectangle madness. Its widgets and steps; loaded by
   rectangles.html. */
/* the rectangles to cut, from IM's lesson */
const RECTS = [
  [16, 5],
  [21, 6],
  [28, 12],
  [9, 4],
];
/* the squares in words: "3 of side 5 and 5 of side 1" */
const sizesText = (cuts) => cuts.map((c) => `${c.count} of side ${c.side}`).join(" and ");
/* Cut the largest square from a rectangle, one at a time or all at once. start: which rectangle to begin with. */
function wCut(el, start = 0) {
  const q = Q(el);
  let [w, h] = RECTS[start],
    shown = 0;
  el.innerHTML =
    seg(
      "Rectangle",
      RECTS.map(([a, b], i) => [i, `${a} by ${b}`]),
    ) +
    `<div class="wrow"><button type="button" class="ghost-btn" data-cut>Cut a square</button><button type="button" class="ghost-btn" data-all>Cut them all</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const squares = squaresOf(w, h),
      done = shown === squares.length,
      rest = shown ? squares[shown - 1].rest : { w, h };
    press(
      el,
      RECTS.findIndex(([a, b]) => a === w && b === h),
    );
    q("cut").disabled = done;
    q("all").disabled = done;
    q("f").innerHTML = cutFig(w, h, { shown });
    if (!shown)
      q("r").innerHTML =
        `The largest square that fits in a ${w}-by-${h} rectangle is <b>${h} by ${h}</b>: its side is the short side.`;
    else if (!done)
      q("r").innerHTML =
        `Squares so far: ${squares
          .slice(0, shown)
          .map((s) => s.side)
          .join(", ")}. ` +
        `What’s left: <b>${rest.w} by ${rest.h}</b>, so the next square is ${Math.min(rest.w, rest.h)} by ${Math.min(rest.w, rest.h)}.`;
    else {
      const cuts = squareCuts(w, h);
      q("r").innerHTML =
        `<span class="ok">All squares:</span> ${sizesText(cuts)}, <b>${squares.length}</b> squares in all. ` +
        `The last square, ${cuts[cuts.length - 1].side} by ${cuts[cuts.length - 1].side}, fits exactly.`;
    }
  };
  onPick(el, (id) => {
    [w, h] = RECTS[+id];
    shown = 0;
    draw();
  });
  q("cut").addEventListener("click", () => {
    shown++;
    draw();
  });
  q("all").addEventListener("click", () => {
    shown = squaresOf(w, h).length;
    draw();
  });
  q("reset").addEventListener("click", () => {
    shown = 0;
    draw();
  });
  draw();
}

/* Choose the sides: the smallest square is the greatest common factor of the two sides. */
function wFactor(el) {
  const q = Q(el),
    values = { long: 16, short: 6 };
  el.innerHTML =
    `<div class="wrow">${stepper("long", "Long side")}${stepper("short", "Short side")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const limits = { long: [2, 30], short: [1, 15] };
  const draw = () => {
    /* the short side stays shorter than the long side */
    values.short = Math.min(values.short, values.long - 1);
    const { long, short } = values,
      cuts = squareCuts(long, short),
      smallest = cuts[cuts.length - 1].side,
      whole = Math.floor(long / short),
      leftOver = long % short;
    q("long").textContent = long;
    q("short").textContent = short;
    q("f").innerHTML = cutFig(long, short);
    q("e").textContent = `GCF(${long}, ${short}) = ${smallest}`;
    q("r").innerHTML =
      `The smallest square is <b>${smallest} by ${smallest}</b>. ${smallest} is the <b>greatest common factor</b> of ${long} and ${short}: ` +
      (smallest === 1 ? "they have no common factor but 1." : `it fits exactly into both, and no bigger number does.`) +
      `<br><span class="dimline">The first cuts are a mixed number too: ${long}/${short} = ${whole}${leftOver ? ` ${leftOver}/${short}` : ""}, ${whole} square${whole === 1 ? "" : "s"}${leftOver ? ` and a ${leftOver}-by-${short} strip` : ""}.</span>`;
  };
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "The largest square",
    widget: (el) => wCut(el, 0),
    body: "<p>The largest square you can cut from a rectangle has the rectangle’s <b>short side</b>. Cut as many of those as fit, and what’s left is a smaller rectangle.</p><p>Cut the squares one at a time.</p>",
    check: {
      kind: "num",
      q: "Cut as many 6-by-6 squares as you can from a 20-by-6 rectangle. The rest is a rectangle 6 units wide. How long is it?",
      answer: 2,
      unit: "units",
      misc: [
        [14, "That’s after just one square. Keep cutting 6-by-6 squares while they fit."],
        [3, "3 is how many squares fit. How much of the 20 is left after them?"],
        [6, "6 is the short side, which doesn’t change. The long side is what gets cut."],
      ],
      explain: "3 squares of side 6 use 3 × 6 = 18 units of the 20, leaving a 6-by-2 rectangle.",
    },
  },
  {
    title: "Keep cutting",
    widget: (el) => wCut(el, 1),
    body: "<p>Now do the same to the rectangle that’s left: cut the largest square from it, and keep going until there’s no rectangle left, only squares. The squares get smaller each time the short side changes.</p><p>Cut a rectangle all the way.</p>",
    check: {
      kind: "num",
      q: "Cut a 21-by-6 rectangle into squares, cutting the largest square you can each time. How many squares are there in all?",
      answer: 5,
      unit: "squares",
      misc: [
        [3, "That’s just the 6-by-6 squares. Keep cutting the 3-by-6 rectangle that’s left."],
        [14, "That’s how many 3-by-3 squares would cover it. Each cut takes the largest square that fits."],
        [2, "That’s how many sizes of square there are. Count every square."],
      ],
      explain: "3 squares of side 6 leave a 3-by-6 rectangle, which cuts into 2 squares of side 3: 3 + 2 = 5 squares.",
    },
  },
  {
    title: "The last square is the greatest common factor",
    widget: wFactor,
    body: "<p>The last square fits exactly, so its side fits a whole number of times into every side before it, all the way back to the two sides you started with. That makes it a common factor of both, and it’s the <b>greatest</b> one.</p><p>Change the sides.</p>",
    check: {
      kind: "num",
      q: "What is the greatest common factor of 28 and 12? Cut a 28-by-12 rectangle into squares to find it.",
      answer: 4,
      misc: [
        [12, "12 is the first, largest square. Keep cutting until the squares fit exactly."],
        [2, "2 is a common factor, but not the greatest. The last square is 4 by 4."],
        [1, "1 is always a common factor, but cut the largest square each time."],
      ],
      explain: "2 squares of side 12 leave a 4-by-12 rectangle, which cuts into 3 squares of side 4. So the GCF is 4.",
    },
  },
];
