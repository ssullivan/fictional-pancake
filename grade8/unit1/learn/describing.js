/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 4: Describing moves. Its widgets and steps; loaded by
   describing.html, after common.js (ABC and cornerTable). */
/* the coordinate plane every picture is on */
const PLANE_VIEW = [-6, 6, -6, 6];
/* Puzzles: triangle ABC and its image after some moves (moves), and what to notice first in the picture (look). */
const PUZZLES = [
  {
    moves: [{ kind: "translate", dx: -6, dy: -5 }],
    look: "A′B′C′ goes around the same way as ABC, and every side points the same way: nothing turned or flipped, so it slid.",
  },
  {
    moves: [{ kind: "reflect", line: { x: 0 } }],
    look: "A′B′C′ goes around the opposite way from ABC: it’s a mirror image, so it flipped. Each corner is just as far from the y-axis, on the other side.",
  },
  {
    moves: [{ kind: "rotate", center: [0, 0], turn: 180 }],
    look: "A′B′C′ goes around the same way, but every side points the opposite way: it turned halfway around. A and A′ are straight across the origin.",
  },
  {
    moves: [
      { kind: "reflect", line: { y: 0 } },
      { kind: "translate", dx: -5, dy: 0 },
    ],
    look: "A″B″C″ is a mirror image, but no single line flips ABC onto it. Flip it over the x-axis first, then slide what you get.",
  },
];
/* Pick a puzzle: ABC and its image, with what to notice and the move (or moves) that does it. */
function wFind(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Puzzle",
      PUZZLES.map((_, i) => [i, `Puzzle ${i + 1}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const { moves, look } = PUZZLES[index],
      image = moveAll(ABC, moves),
      times = moves.length,
      /* after two moves, the shape after the first one, dashed */
      middle = times === 2 ? [{ pts: movePts(ABC, moves[0]), cls: "ghost" }] : [];
    press(el, index);
    q("f").innerHTML = planeFig({
      view: PLANE_VIEW,
      axes: true,
      cell: 22,
      shapes: [
        { pts: ABC, cls: "a", verts: ["A", "B", "C"] },
        ...middle,
        { pts: image, cls: "b", verts: LETTERS.slice(0, 3).map((letter) => prime(letter, times)) },
      ],
      label: `Triangle ABC and its image, puzzle ${index + 1}`,
    });
    q("r").innerHTML = typeset(
      `${look} A ${ptText(ABC[0])} lands at ${prime("A", times)} ${ptText(image[0])}. ` +
        `<b>${moves.map((move, i) => (i ? moveText(move).replace(/^\w/, (c) => c.toLowerCase()) : moveText(move))).join(", then ")}</b>.`,
    );
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* the triangle for the order step, and its two moves: a flip over the x-axis and a slide 5 right and 2 down */
const ORDER_TRI = [
    [-5, 2],
    [-2, 2],
    [-5, 4],
  ],
  FLIP = { kind: "reflect", line: { y: 0 } },
  SLIDE = { kind: "translate", dx: 5, dy: -2 };
/* Pick an order: flip then slide, or slide then flip. The triangle lands in two different places. */
function wOrder(el) {
  const q = Q(el);
  el.innerHTML =
    seg("Order", [
      ["flipFirst", "Reflect, then translate"],
      ["slideFirst", "Translate, then reflect"],
    ]) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (order) => {
    const moves = order === "flipFirst" ? [FLIP, SLIDE] : [SLIDE, FLIP],
      middle = movePts(ORDER_TRI, moves[0]),
      image = moveAll(ORDER_TRI, moves),
      other = moveAll(ORDER_TRI, moves.slice().reverse());
    press(el, order);
    q("f").innerHTML = planeFig({
      view: PLANE_VIEW,
      axes: true,
      cell: 22,
      shapes: [
        { pts: ORDER_TRI, cls: "a", verts: ["A", "B", "C"] },
        { pts: middle, cls: "ghost", verts: ["A′", "", ""] },
        { pts: image, cls: "b", verts: ["A″", "B″", "C″"] },
      ],
      label: `A triangle moved two ways in a row: ${order === "flipFirst" ? "reflected, then translated" : "translated, then reflected"}`,
    });
    q("r").innerHTML = typeset(
      `${moveText(moves[0])}: A ${ptText(ORDER_TRI[0])} goes to A′ ${ptText(middle[0])} (dashed). ` +
        `Then ${moveText(moves[1]).replace(/^\w/, (c) => c.toLowerCase())}: A″ lands at <b>${ptText(image[0])}</b>. ` +
        `The other order puts A″ at ${ptText(other[0])}: <b>the order matters</b>.`,
    );
  };
  onPick(el, draw);
  draw("flipFirst");
}

/* the quick check's picture: ABC and its image after a quarter turn clockwise around the origin */
const TURNED_ABC = movePts(ABC, { kind: "rotate", center: [0, 0], turn: -90 });

const STEPS = [
  {
    title: "Find the move",
    widget: wFind,
    body: "<p>To describe a move from a picture, compare the shape with its image. Go around the corners: if the image goes around the other way, there was a flip. If not, see whether the sides point new ways (a turn) or the same way (a slide). Then follow one corner to find the details. Some images take two moves in a row.</p><p>Try each puzzle.</p>",
    check: {
      kind: "mc",
      q: "Which move takes triangle ABC to A′B′C′?",
      fig: planeFig({
        view: PLANE_VIEW,
        axes: true,
        cell: 22,
        shapes: [
          { pts: ABC, cls: "a", verts: ["A", "B", "C"] },
          { pts: TURNED_ABC, cls: "b", verts: ["A′", "B′", "C′"] },
        ],
        label: "Triangle ABC and its image A′B′C′ on a coordinate plane",
      }),
      choices: [
        { id: "b", label: "Rotate 90° counterclockwise around the origin" },
        { id: "a", label: "Rotate 90° clockwise around the origin" },
        { id: "c", label: "Reflect over the x-axis" },
        { id: "d", label: "Translate 2 units down" },
      ],
      answer: "a",
      why: {
        b: "That would take B (4, 1) to (−1, 4), up and to the left. B′ is at (1, −4).",
        c: "A′B′C′ goes around the same way as ABC, so it wasn’t flipped. It turned.",
        d: "The sides of A′B′C′ point new ways, so it turned. A slide keeps them pointing the same way.",
      },
      explain: "B (4, 1) goes to B′ (1, −4): (x, y) → (y, −x), a quarter turn clockwise around the origin.",
      stack: true,
    },
  },
  {
    title: "Two moves in a row",
    widget: wOrder,
    body: "<p>A shape can get one move after another. The image after the first move is A′B′C′, and after the second it’s A″B″C″ (“A double prime”). Doing the same two moves in the other order can land somewhere else, so a description gives them in order.</p><p>Pick an order.</p>",
    check: {
      kind: "mc",
      q: "The point (2, 1) is translated 4 units up, then reflected over the x-axis. Where does it land?",
      choices: [
        { id: "b", label: "(2, 3)" },
        { id: "c", label: "(2, 5)" },
        { id: "a", label: "(2, −5)" },
        { id: "d", label: "(−2, 5)" },
      ],
      answer: "a",
      why: {
        b: "That reflects first, then translates. Do the moves in the order given: up 4 first.",
        c: "That’s only the translation. Then reflect over the x-axis: y changes sign.",
        d: "That reflects over the y-axis. Over the x-axis, y changes sign.",
      },
      explain: "Up 4: (2, 1) → (2, 5). Over the x-axis: (2, 5) → (2, −5).",
    },
  },
];
