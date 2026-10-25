/* The Unit 4 study guide (study.html): its diagrams. Each <figure data-fig="name"> in the page gets the picture FIGURES[name]
   draws, with shared/study.js's Diagram and partsTape: laid out in units with y going up, and drawn as inline SVG with the
   classes styled in shared/study.css (sh and sh2 groups side by side, bx an empty piece, g grid lines, lb a label, …).
   Labels in pictures are plain text ("2 1/2"); the page's own text writes fractions stacked. Nothing else uses this file. */

/* a bracket over x0…x1 at height y, its ends turned down toward the tape, with words over its middle */
function bracketOver(d, x0, x1, y, words) {
  const nub = 0.15;
  return d
    .line([x0, y], [x1, y])
    .line([x0, y], [x0, y - nub])
    .line([x1, y], [x1, y - nub])
    .text([(x0 + x1) / 2, y], words, { dy: -6, cls: "lb sm" });
}

/* How many groups: a tape `wholes` long, cut into `pieces` equal pieces per whole, with the whole numbers under it. When
   `groups`, every `groupPieces` pieces make a group, shaded in turn and numbered over a bracket (a last, short group is
   marked "part"); otherwise the pieces are left empty for the reader to group. */
function groupsTape(wholes, pieces, groupPieces, label, { groups = true, scale = 22 } = {}) {
  /* each whole is wholeLength units long; the tape is 1 unit tall, with groups' brackets groupY above its foot */
  const wholeLength = 4,
    pieceWidth = wholeLength / pieces,
    total = wholes * pieces,
    groupY = 1.35,
    d = new Diagram(0, wholes * wholeLength, -0.7, 2.1, scale, { pad: 14, label });
  for (let i = 0; i < total; i++) {
    const group = Math.floor(i / groupPieces);
    d.box(i * pieceWidth, 0, pieceWidth, 1, !groups ? "bx" : group % 2 ? "sh2" : "sh");
  }
  /* each whole's edge runs a little past the tape, with its number under it */
  for (let w = 0; w <= wholes; w++)
    d.line([w * wholeLength, -0.15], [w * wholeLength, 1.15]).text([w * wholeLength, 0], String(w), {
      dy: 17,
      cls: "lb sm",
    });
  if (groups)
    for (let g = 0; g * groupPieces < total; g++) {
      const end = Math.min(total, (g + 1) * groupPieces);
      bracketOver(
        d,
        g * groupPieces * pieceWidth,
        end * pieceWidth,
        groupY,
        end - g * groupPieces < groupPieces ? "part" : g + 1,
      );
    }
  return d.svg();
}

/* A rectangle `width` by `height` units, shaded, on a grid of whole unit squares `cols` by `rows` (dashed lines cut each in
   half), with its sides labelled [widthWords, heightWords] */
function areaGrid(width, height, cols, rows, label, [widthWords, heightWords], { scale = 52 } = {}) {
  const d = new Diagram(0, cols, 0, rows, scale, { pad: 30, label, left: 30 }),
    inside = [width / 2, height / 2];
  d.box(0, 0, width, height);
  for (let x = 0.5; x < cols; x++) d.line([x, 0], [x, rows], "frame");
  for (let y = 0.5; y < rows; y++) d.line([0, y], [cols, y], "frame");
  d.grid(0, cols, 0, rows);
  /* the rectangle's outline goes over the grid */
  d.box(0, 0, width, height, "out");
  return d.side([0, 0], [width, 0], widthWords, inside).side([0, 0], [0, height], heightWords, inside).svg();
}

const FIGURES = {
  /* Part B: how many groups? */
  groups34: () =>
    groupsTape(3, 4, 3, "A tape 3 wholes long, cut into fourths, with every 3 fourths bracketed as a group: 4 groups"),
  fifths: () => groupsTape(2, 5, 2, "A tape 2 wholes long, cut into fifths", { groups: false, scale: 30 }),

  /* Part C: what fraction of a group? */
  milk: () =>
    partsTape(3, 2, "One batch, 3/4 cup of milk, cut into 3 fourths; 2 of them, 1/2 cup, are shaded", {
      marks: [
        [0, "0"],
        [2, "1/2 cup"],
        [3, "3/4 cup"],
      ],
      part: "what you have",
      whole: "1 batch",
    }),

  /* Part D: how much in each group? */
  pitcher: () =>
    partsTape(
      4,
      3,
      "A pitcher cut into fourths; 3 fourths hold 1 1/2 cups, 1/2 cup in each, so the pitcher holds 2 cups",
      {
        marks: [
          [0, "0"],
          [3, "3/4"],
          [4, "full"],
        ],
        each: "1/2",
        part: "1 1/2 cups",
        whole: "2 cups",
        hl: true,
      },
    ),
  tank: () =>
    partsTape(5, 2, "A tank cut into fifths; 2 fifths hold 10 liters", {
      marks: [
        [0, "0"],
        [2, "2/5"],
        [5, "full"],
      ],
      part: "10 liters",
      whole: "? liters",
    }),

  /* Part F: lengths and areas */
  rectangle: () =>
    areaGrid(2.5, 1.5, 3, 2, "A rectangle 2 1/2 units by 1 1/2 units on a grid of unit squares cut in halves", [
      "2 1/2",
      "1 1/2",
    ]),

  /* the practice test */
  test11: () =>
    groupsTape(2, 3, 2, "A tape 2 wholes long, cut into thirds, with every 2 thirds bracketed as a group: 3 groups", {
      scale: 30,
    }),
};

/* draw each diagram into its placeholder */
document.querySelectorAll("[data-fig]").forEach((el) => {
  el.insertAdjacentHTML("afterbegin", FIGURES[el.dataset.fig]());
});
