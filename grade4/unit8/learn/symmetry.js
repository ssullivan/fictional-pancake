/* Learn Properties of Two-dimensional Shapes (Grade 4 Unit 8), chapter 3: Lines of symmetry. Its widgets and steps; loaded by symmetry.html. */
/* shapes to fold, in SHAPES */
const FOLD = ["isoscelesAcute", "rectangle", "parallelogram", "kite", "square"];
/* the ways to fold: through the middle up and down, across, or corner to corner */
const FOLDS = [
  ["up", "Up and down"],
  ["across", "Across"],
  ["corner", "Corner to corner"],
];
/* Pick a shape and a fold: the dashed outline shows where the shape lands when folded. */
function wFold(el) {
  const q = Q(el);
  let id = "rectangle",
    way = "up";
  el.innerHTML =
    `<div data-top>${seg(
      "Shape",
      FOLD.map((s) => [s, SHAPES[s].name[0].toUpperCase() + SHAPES[s].name.slice(1)]),
    )}</div><div data-bot>${seg("Fold", FOLDS)}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pts = SHAPES[id].pts,
      [a, b] = foldLine(pts, way),
      folded = pts.map((p) => reflect(p, a, b)),
      matches = isSymmetryLine(pts, a, b);
    press(q("top"), id);
    press(q("bot"), way);
    q("f").innerHTML = shapeFig(id, {
      ticks: false,
      rights: false,
      lines: [[...a, ...b].map((v) => +v.toFixed(1))],
      ghost: folded,
      label: `${cap(aName(id))} with a fold line, and its outline folded over`,
    });
    q("r").innerHTML = matches
      ? `<span class="ok">The halves match.</span> Folded on this line, the shape lands right on itself: it’s a <b>line of symmetry</b>.`
      : `The dashed outline shows where the shape lands when folded. It doesn’t land on itself, so this <b>isn’t</b> a line of symmetry.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") id = hit[1];
    else way = hit[1];
    draw();
  });
  draw();
}
/* shapes to count lines of symmetry on, in SHAPES */
const COUNT = [
  "equilateral",
  "square",
  "rectangle",
  "rhombus",
  "isoscelesAcute",
  "kite",
  "parallelogram",
  "rightScalene",
];
/* Pick a shape: all of its lines of symmetry. */
function wCount(el) {
  const q = Q(el);
  let id = "square";
  el.innerHTML =
    seg(
      "Shape",
      COUNT.map((s) => [s, SHAPES[s].name[0].toUpperCase() + SHAPES[s].name.slice(1)]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const lines = SHAPES[id].sym.length;
    press(el, id);
    q("f").innerHTML = shapeFig(id, { sym: true });
    q("r").innerHTML = lines
      ? `${cap(aName(id))} has <b>${lines} line${lines > 1 ? "s" : ""} of symmetry</b>.`
      : `${cap(aName(id))} has <b>no lines of symmetry</b>: no fold makes the halves match.`;
  };
  onPick(el, (m) => {
    id = m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Fold to test",
    widget: wFold,
    body: "<p>A <b>line of symmetry</b> cuts a shape into two halves that match exactly: fold on the line, and one half lands right on the other.</p><p>Pick a shape and a way to fold it.</p>",
    check: {
      kind: "mc",
      q: "Is the dashed line a line of symmetry of this rectangle?",
      fig: shapeFig("rectangle", {
        ticks: false,
        rights: false,
        lines: [[10, 40, 190, 150]],
        label: "A rectangle with a dashed line from corner to corner",
      }),
      choices: [
        { id: "a", label: "Yes" },
        { id: "b", label: "No" },
      ],
      answer: "b",
      why: { a: "Fold a rectangle corner to corner and the halves don’t line up: the corners land off the shape." },
      explain:
        "Folding a rectangle that isn’t a square from corner to corner doesn’t make the halves match, so it isn’t a line of symmetry.",
    },
  },
  {
    title: "Count the lines of symmetry",
    widget: wCount,
    body: "<p>Some shapes have more than one line of symmetry, and some have none. Look for every fold that makes the halves match: up and down, across, and corner to corner.</p><p>Pick a shape.</p>",
    check: {
      kind: "num",
      q: "How many lines of symmetry does a square have?",
      answer: 4,
      unit: "lines",
      misc: [
        [2, "Up and down and across work. The corner-to-corner lines work too."],
        [1, "A square has more than one. Try folding it across and corner to corner."],
      ],
      explain: "Up and down, across, and both corner-to-corner lines: 4 lines of symmetry.",
    },
  },
];
