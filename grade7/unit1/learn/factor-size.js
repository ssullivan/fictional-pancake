/* Learn Scale Drawings (Grade 7 Unit 1), chapter 3: The size of the scale factor. Its widgets and steps; loaded by
   factor-size.html. */
/* a 4-by-2 rectangle to copy */
const RECT = [
  [0, 0],
  [4, 0],
  [4, 2],
  [0, 2],
];
/* the slider's scale factors, in quarters from 1/4 to 3 */
const QUARTERS_MAX = 12;
/* Slide the scale factor from 1/4 to 3: below 1 the copy is smaller, at 1 the same size, above 1 bigger. */
function wSize(el) {
  const q = Q(el);
  el.innerHTML =
    `<div class="wrow"><label class="slider">Scale factor <input type="range" min="1" max="${QUARTERS_MAX}" value="6" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const quarters = +q("s").value,
      f = frac(quarters, 4),
      k = val(f),
      copy = scalePts(RECT, f);
    q("sv").innerHTML = fim(f);
    q("f").innerHTML = gridFig(
      arrange([
        [
          { pts: RECT, cls: "a", name: "Original", sides: true },
          { pts: copy, cls: "b", name: "Copy", sides: true },
        ],
      ]),
      { cell: 18, label: `A 4 by 2 rectangle and its copy with scale factor ${ftx(f)}` },
    );
    q("r").innerHTML =
      k > 1
        ? `${fim(f)} is <b>greater than 1</b>, so the copy is <b>bigger</b>: ${fmt(k)} times as long.`
        : k < 1
          ? `${fim(f)} is <b>less than 1</b>, so the copy is <b>smaller</b>: only ${fmt(k)} of the original’s length.`
          : `A scale factor of <b>1</b> makes a copy the <b>same size</b>: every length stays the same.`;
  };
  q("s").addEventListener("input", draw);
  draw();
}

/* Pick two scale factors: a copy of a copy is a copy of the original, scaled by the two factors multiplied. */
function wTwice(el) {
  const q = Q(el),
    factors = [HALF, TWO, THREE, [1, 3]],
    shape = SHAPE_LIB.find((s) => s.name === "right triangle").pts.map(([x, y]) => [x / 2, y / 2]);
  let first = 1,
    second = 0;
  el.innerHTML =
    `<div data-top>${seg(
      "First scale factor",
      factors.map((f, i) => [i, `A → B × ${ftx(f)}`]),
    )}</div>` +
    `<div data-bot>${seg(
      "Second scale factor",
      factors.map((f, i) => [i, `B → C × ${ftx(f)}`]),
    )}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const f1 = factors[first],
      f2 = factors[second],
      both = fMul(f1, f2),
      b = scalePts(shape, f1),
      c = scalePts(b, f2);
    press(q("top"), first);
    press(q("bot"), second);
    q("f").innerHTML = gridFig(
      arrange([
        [
          { pts: shape, cls: "a", name: "A", sides: true },
          { pts: b, cls: "b", name: "B", sides: true },
          { pts: c, cls: "c", name: "C", sides: true },
        ],
      ]),
      { cell: 18, label: `Triangle A, its copy B, and B's copy C` },
    );
    q("r").innerHTML =
      `${fim(f1)} × ${fim(f2)} = <b>${fim(both)}</b>, so C is a scaled copy of A with scale factor ${fim(both)}. ` +
      (val(both) === 1
        ? "The second factor undid the first: C is the same size as A."
        : `C is ${val(both) > 1 ? "bigger" : "smaller"} than A.`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") first = +id;
    if (row === "bot") second = +id;
    if (row) draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Bigger, smaller, or the same",
    widget: wSize,
    body: "<p>The size of the scale factor tells you the size of the copy. A scale factor <b>greater than 1</b> makes it bigger, <b>less than 1</b> makes it smaller, and exactly <b>1</b> makes an identical copy.</p><p>Slide the scale factor.</p>",
    check: {
      kind: "mc",
      q: "Which scale factor makes a copy that’s smaller than the original?",
      choices: [
        { id: "a", label: "3/2" },
        { id: "b", label: "1" },
        { id: "c", label: "2/3" },
      ],
      answer: "c",
      why: {
        a: "3/2 is more than 1, so it makes the copy bigger.",
        b: "A scale factor of 1 keeps the copy the same size.",
      },
      explain: "2/3 is less than 1, so every length in the copy is only 2/3 as long.",
    },
  },
  {
    title: "Copies of copies",
    widget: wTwice,
    body: "<p>A scaled copy of a scaled copy is a scaled copy of the original. Its scale factor is the two factors <b>multiplied</b>. Scaling by 2 and then by 1/2 gets you back where you started.</p><p>Pick both scale factors.</p>",
    check: {
      kind: "num",
      q: "Andre scales a drawing by a factor of 2, then scales the copy by a factor of 3. What single scale factor takes the original drawing to the last copy?",
      answer: 6,
      misc: [
        [5, "That adds the factors. Each one multiplies the lengths: 2 × 3."],
        [3, "That’s just the second step. The first one already doubled every length."],
      ],
      explain: "The first copy is 2 times as long, and the second is 3 times that: 2 × 3 = 6.",
    },
  },
];
