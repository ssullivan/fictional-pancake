/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 7: Area and addition. Its widgets and steps; loaded by area-and-addition.html. */
/* "6 × 7 = 6 × 5 + 6 × 2 = 30 + 12 = 42": a rectangle rows × cols cut after `cut` columns, worked out */
const splitSum = (rows, cols, cut) =>
  `${rows} × ${cols} = ${rows} × ${cut} + ${rows} × ${cols - cut} = ${rows * cut} + ${rows * (cols - cut)} = ${rows * cols}`;
/* rectangles to cut, as [rows, cols] */
const CUT_RECTS = [
  [6, 7],
  [4, 8],
  [7, 9],
];
/* Pick a rectangle, then slide where it's cut: the two parts always add up to the whole. */
function wCut(el) {
  const q = Q(el);
  let rectIndex = 0,
    cut = 5;
  el.innerHTML =
    seg(
      "Rectangle",
      CUT_RECTS.map(([rows, cols], i) => [i, `${rows} × ${cols}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><label class="slider">Cut after <input type="range" min="1" step="1" data-s><b data-sv></b></label></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [rows, cols] = CUT_RECTS[rectIndex];
    press(el, rectIndex);
    q("s").max = cols - 1;
    q("s").value = cut;
    q("sv").textContent = cut;
    q("f").innerHTML = splitFig(rows, cols, cut, { products: true });
    q("o").innerHTML =
      `The gold part is ${rows} × ${cut} and the blue part is ${rows} × ${cols - cut}.` +
      `<br><span class="ok">${splitSum(rows, cols, cut)}</span>`;
  };
  q("s").addEventListener("input", () => {
    cut = +q("s").value;
    draw();
  });
  onPick(el, (id) => {
    rectIndex = +id;
    cut = Math.min(cut, CUT_RECTS[rectIndex][1] - 1);
    draw();
  });
  draw();
}
/* harder facts, as [rows, cols], to cut into easier ones */
const HARD_FACTS = [
  [7, 8],
  [6, 9],
  [8, 6],
];
/* where a side `cols` long can be cut: after 5, after 2, and in half when it's even (each once) */
const cutsOf = (cols) => [...new Set([5, 2, ...(cols % 2 ? [] : [cols / 2])])];
/* Pick a hard fact, then a way to cut it into two facts you know. */
function wFacts(el) {
  /* cut: where the rectangle is cut, or null before one is picked */
  const q = Q(el);
  let factIndex = 0,
    cut = null;
  el.innerHTML = `<div data-top>${seg(
    "Fact",
    HARD_FACTS.map(([rows, cols], i) => [i, `${rows} × ${cols}`]),
  )}</div><div data-bot></div><div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const [rows, cols] = HARD_FACTS[factIndex];
    press(q("top"), factIndex);
    q("bot").innerHTML = seg(
      "Cut",
      cutsOf(cols).map((c) => [c, `${c} + ${cols - c}`]),
    );
    press(q("bot"), cut);
    q("f").innerHTML = splitFig(rows, cols, cut || 0, { products: !!cut });
    q("o").innerHTML = !cut
      ? `Don’t know ${rows} × ${cols}? Cut the ${cols} into two numbers.`
      : `<span class="ok">${splitSum(rows, cols, cut)}</span><br><span class="dimline">${cut === 5 ? "Facts with 5 are easy to count by 5s." : cut === 2 ? "Facts with 2 are doubles." : "Both parts are the same fact, so find it once and double it."}</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") {
      factIndex = +id;
      cut = null;
    }
    if (row === "bot") cut = +id;
    if (row) draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  ask: splitFig(4, 9, 5, { ask: "right" }),
  which: splitFig(6, 8, 5, { grid: false }),
};
const STEPS = [
  {
    title: "Cut a rectangle in two",
    widget: wCut,
    body: "<p>Cut a rectangle into two smaller rectangles, and its area is the two parts added together. A rectangle 6 by 7 cut after 5 is <b>6 × 5 + 6 × 2</b>.</p><p>Pick a rectangle and slide the cut.</p>",
    check: {
      kind: "num",
      q: "4 × 9 = 4 × 5 + 4 × ?",
      fig: F.ask,
      answer: 4,
      misc: [
        [9, "9 is the whole side. The blue part is only part of it."],
        [5, "That’s the gold part. What’s left for the blue part?"],
        [16, "That’s the blue part’s area. The ? is how wide it is."],
      ],
      explain: "5 + 4 = 9, so 4 × 9 = 4 × 5 + 4 × 4. That’s 20 + 16 = 36.",
    },
  },
  {
    title: "Use facts you know",
    widget: wFacts,
    body: "<p>Cutting helps with a fact you don’t know yet. 7 × 8 is hard, but 7 × 5 and 7 × 3 are easier: 35 + 21 = 56.</p><p>Pick a fact, then pick a way to cut it.</p>",
    check: {
      kind: "mc",
      q: "Which expression gives the area of the whole rectangle?",
      fig: F.which,
      choices: [
        { id: "a", label: "6 × 5 + 3" },
        { id: "b", label: "6 × 8 + 6 × 3" },
        { id: "c", label: "6 × 5 + 6 × 3" },
      ],
      answer: "c",
      why: {
        a: "The blue part is 6 rows of 3, not just 3.",
        b: "6 × 8 is already the whole rectangle. Adding 6 × 3 counts the blue part twice.",
      },
      explain: "The gold part is 6 × 5 = 30 and the blue part is 6 × 3 = 18. 30 + 18 = 48 square units.",
    },
  },
];
