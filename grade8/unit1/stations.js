/* Sprite Studio (Grade 8 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (moves, grids and coordinate planes, parallel lines, triangles), shared/angles.js, and shared/tex.js. Every
   problem carries facts for checks.js: its type (t) and what its checks need (the corners, the moves, the angles). Each
   generator deals one of a few kinds of problem (type), each with a comment saying what it asks. Numbers are written with
   fmt, so negatives get a true minus sign. */

/* a num problem: answers may be negative in this game (the full keyboard), and its named mistakes leave out any that land on
   the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", neg: true, ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a point problem: the answer is [x, y], typed as ( x , y ); its named mistakes leave out any that are the answer, or repeat */
function pointP(p) {
  const [x, y] = p.answer,
    pmisc = (p.pmisc || []).filter(
      ([[u, v]], i, list) => !(u === x && v === y) && list.findIndex(([[a, b]]) => a === u && b === v) === i,
    );
  return { kind: "pair", point: true, neg: true, labels: ["x", "y"], ...p, pmisc };
}
/* a whole number from a to b that isn't 0 */
const nonzero = (a, b) => {
  const n = R(a, b);
  return n === 0 ? nonzero(a, b) : n;
};
/* what each kind of move is called */
const KIND = { translate: "translation", rotate: "rotation", reflect: "reflection" };
/* a polygon's name from how many corners it has */
const POLY = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon" };
/* text with its first letter a capital */
const capital = (text) => text[0].toUpperCase() + text.slice(1);
/* a move as written in the middle of a sentence: "translated 3 units right", "reflected over the x-axis" */
const movedText = (move, names) =>
  moveText(move, names).replace(
    /^\w+/,
    (verb) => ({ Translate: "translated", Rotate: "rotated", Reflect: "reflected" })[verb],
  );
/* a move as written after a colon: "translate 3 units right" */
const lowerText = (move, names) => moveText(move, names).replace(/^\w/, (letter) => letter.toLowerCase());
/* corner names for a shape with n corners, before (A, B, C) and after a move (A′, B′, C′) */
const namesOf = (n, times = 0) => LETTERS.slice(0, n).map((letter) => (times ? prime(letter, times) : letter));

/* the corners slid so the bottom left of the box around them is at (x, y) */
function placeAt(pts, [x, y]) {
  const b = boundsOf(pts);
  return pts.map(([u, v]) => [u - b.minX + x, v - b.minY + y]);
}
/* whether every point lies in the view [xMin, xMax, yMin, yMax] */
const fits = (pts, [xMin, xMax, yMin, yMax]) => pts.every(([x, y]) => x >= xMin && x <= xMax && y >= yMin && y <= yMax);
/* whether the boxes around two shapes stay at least a square apart, so their corner names don't crowd */
function apart(a, b) {
  const p = boundsOf(a),
    q = boundsOf(b);
  return p.maxX + 1 <= q.minX || q.maxX + 1 <= p.minX || p.maxY + 1 <= q.minY || q.maxY + 1 <= p.minY;
}
/* a sprite turned and flipped at random, so originals face every way; returns {name, pts} with its corners from (0, 0) up */
function dealSprite(names = null) {
  const sprite = pick(names ? SPRITES.filter((s) => names.includes(s.name)) : SPRITES);
  const turn = pick([0, 90, -90, 180]);
  let pts = turn ? movePts(sprite.pts, { kind: "rotate", center: [0, 0], turn }) : sprite.pts;
  if (Math.random() < 0.5) pts = movePts(pts, { kind: "reflect", line: { x: 0 } });
  /* a flip reverses the order around: put it back so the corners still go counterclockwise from A */
  if (shoelaceSign(pts) < 0) pts = [pts[0], ...pts.slice(1).reverse()];
  return { name: sprite.name, pts: placeAt(pts, [0, 0]) };
}
/* +1 when the corners go counterclockwise (y up), −1 when clockwise: the sign of the shoelace sum, twice the area */
const shoelaceSign = (pts) =>
  Math.sign(
    pts.reduce((sum, [x1, y1], i) => sum + x1 * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * y1, 0),
  );
/* A move of the given kind that keeps a shape near where it is: a translation of up to 6 each way (at least 3 in all), a
   rotation around a point within 2 of the shape, or a reflection over a line just beside it or through it. */
function dealMove(kind, pts) {
  const b = boundsOf(pts);
  if (kind === "translate") {
    const dx = R(-6, 6),
      dy = R(-6, 6);
    return Math.abs(dx) + Math.abs(dy) < 3 ? dealMove(kind, pts) : { kind, dx, dy };
  }
  if (kind === "rotate")
    return { kind, center: [R(b.minX - 2, b.maxX + 2), R(b.minY - 2, b.maxY + 2)], turn: pick([90, -90, 180]) };
  return Math.random() < 0.5
    ? { kind, line: { x: pick([R(b.minX - 2, b.minX), R(b.maxX, b.maxX + 2)]) } }
    : { kind, line: { y: pick([R(b.minY - 2, b.minY), R(b.maxY, b.maxY + 2)]) } };
}
/* the pieces of a picture that show a move: a translation's arrow from the first corner, a rotation's center and curved arrow,
   or a reflection's line */
function moveMarks(move, pts, { centerName = "P", lineName = "ℓ" } = {}) {
  if (move.kind === "translate") return { arrows: [{ from: pts[0], to: movePt(pts[0], move) }] };
  if (move.kind === "rotate")
    return {
      points: [{ at: move.center, text: centerName }],
      segs: [
        { from: move.center, to: pts[0] },
        { from: move.center, to: movePt(pts[0], move), cls: "b" },
      ],
    };
  return { lines: [{ line: move.line, text: lineName }] };
}
/* two lists of picture pieces put together */
const withMarks = (opts, marks) => {
  const joined = { ...opts };
  Object.entries(marks).forEach(([key, list]) => (joined[key] = [...(opts[key] || []), ...list]));
  return joined;
};

/* ---------- Station 1: translations, rotations, and reflections (Lessons 1–2) ---------- */
/* the grid the shapes move on */
const NAME_VIEW = [0, 11, 0, 8];
/* why each wrong name is wrong, for each move: WHY_NAME[the move][the name picked] */
const WHY_NAME = {
  translate: {
    rotate: "Nothing turned: every side of the image points the same way as before. It slid.",
    reflect:
      "It isn’t flipped: A′, B′, C′ go around the same way as A, B, C, and every side points the same way. It slid.",
  },
  rotate: {
    translate: "The image is turned: its sides point new ways. A translation slides without turning.",
    reflect:
      "Go around A, B, C, then A′, B′, C′: they go around the same way, so it wasn’t flipped. A turn keeps that order.",
  },
  reflect: {
    translate: "The image is a mirror image: A′, B′, C′ go around the other way. A translation only slides.",
    rotate:
      "A′, B′, C′ go around the opposite way from A, B, C, so it was flipped. A rotation keeps them going the same way.",
  },
};
/* what each move needs to be described, as IM puts it */
const NEEDS = {
  translate: "A distance and a direction",
  rotate: "A center, an angle, and a direction (clockwise or counterclockwise)",
  reflect: "A line to reflect over",
};
function genMoves() {
  const type = pick(["name", "name", "name", "needs"]);
  if (type === "needs") {
    /* what instructions for a move must say */
    const kind = pick(Object.keys(KIND)),
      action = { translate: "slide", rotate: "turn", reflect: "flip" }[kind];
    return mcP(
      Object.keys(KIND).map((other) => [
        NEEDS[other],
        other === kind ? null : `That describes a ${KIND[other]}. A ${action} is a ${KIND[kind]}.`,
      ]),
      {
        prompt: `A designer wants to <b>${action}</b> a sprite: a ${KIND[kind]}. What must the instructions give?`,
        hint: "Think about what you’d have to tell someone so they make exactly the same move.",
        explain: `A ${KIND[kind]} needs ${NEEDS[kind][0].toLowerCase() + NEEDS[kind].slice(1)}.`,
        stack: true,
        facts: { t: type, kind },
      },
    );
  }
  /* which move takes a shape to its image: both on a grid, apart from each other */
  const sprite = dealSprite(),
    kind = pick(Object.keys(KIND));
  let orig, move, image;
  do {
    orig = placeAt(sprite.pts, [R(0, 8), R(0, 6)]);
    move = dealMove(kind, orig);
    image = movePts(orig, move);
  } while (!fits(orig, NAME_VIEW) || !fits(image, NAME_VIEW) || !apart(orig, image));
  const count = orig.length,
    plain = { translate: "slid", rotate: "turned", reflect: "flipped (a mirror image)" }[kind];
  return mcP(
    Object.keys(KIND).map((other) => [capital(KIND[other]), other === kind ? null : WHY_NAME[kind][other]]),
    {
      prompt: `The gold ${sprite.name} moved to the blue one. Which move was it?`,
      fig: (show, done) =>
        planeFig({
          view: NAME_VIEW,
          ...withMarks(
            {
              shapes: [
                { pts: orig, cls: "a", verts: namesOf(count) },
                { pts: image, cls: "b", verts: namesOf(count, 1) },
              ],
            },
            done ? moveMarks(move, orig) : {},
          ),
          label: `A ${sprite.name} and its image`,
        }),
      hint: "Follow A, B, C around, then A′, B′, C′. The other way around means it flipped. The same way around: did it turn, or just slide?",
      explain: `The ${sprite.name} ${plain}: ${lowerText(move, { centerName: "the point P", lineName: "line ℓ" })}. It’s a <b>${KIND[kind]}</b>.`,
      facts: { t: type, kind, move, orig, image },
    },
  );
}

/* ---------- Station 2: moves on a grid (Lessons 3–4) ---------- */
/* the grid each picture shows */
const PANEL_VIEW = [0, 10, 0, 10];
/* Which of four pictures shows the image after a move: the right one and three mistakes (WRONG_MOVES), each picture with the
   original, the image, and the center or line. */
function genGrid() {
  const sprite = dealSprite(),
    kind = pick(Object.keys(KIND)),
    tags = ["A", "B", "C", "D"];
  for (let attempt = 0; attempt < 200; attempt++) {
    const orig = sprite.pts,
      b = boundsOf(orig);
    let move, wrongs;
    if (kind === "translate") {
      /* across and up-and-down both move, by different amounts, so a swap is a different picture */
      const dx = nonzero(-4, 4),
        dy = nonzero(-4, 4);
      if (Math.abs(dx) === Math.abs(dy)) continue;
      move = { kind, dx, dy };
      wrongs = [
        [{ kind, dx: dy, dy: dx }, "That swaps the moves: the across number and the up-and-down number traded places."],
        [{ kind, dx: -dx, dy }, `Check left and right: it should go ${Math.abs(dx)} ${dx > 0 ? "right" : "left"}.`],
        [{ kind, dx, dy: -dy }, `Check up and down: it should go ${Math.abs(dy)} ${dy > 0 ? "up" : "down"}.`],
      ];
    } else if (kind === "rotate") {
      /* the center is a corner of the shape, or a point just beside it */
      const center = Math.random() < 0.5 ? pick(orig) : [R(b.minX - 1, b.maxX + 1), R(b.minY - 1, b.maxY + 1)],
        turn = pick([90, -90, 180]),
        flipped = { kind: "reflect", line: Math.random() < 0.5 ? { x: center[0] } : { y: center[1] } };
      move = { kind, center, turn };
      wrongs =
        turn === 180
          ? [
              [
                { kind, center, turn: 90 },
                "That’s a quarter turn, 90°. A half turn is 180°: the shape ends up upside down.",
              ],
              [
                { kind, center, turn: -90 },
                "That’s a quarter turn, 90°. A half turn is 180°: the shape ends up upside down.",
              ],
              [
                flipped,
                "That’s a flip over a line through P. A rotation turns: the corners keep going around the same way.",
              ],
            ]
          : [
              [
                { kind, center, turn: -turn },
                `That turns the other way. ${turn > 0 ? "Counterclockwise" : "Clockwise"} is the way the hands of a clock ${turn > 0 ? "don’t go" : "go"}.`,
              ],
              [{ kind, center, turn: 180 }, "That’s a half turn, 180°. A quarter turn is 90°."],
              [
                flipped,
                "That’s a flip over a line through P. A rotation turns: the corners keep going around the same way.",
              ],
            ];
    } else {
      /* a line beside the shape or through it; the image slid across without flipping, one past the line, and turned */
      const upright = Math.random() < 0.5,
        at = upright ? pick([b.minX - 1, b.minX, b.maxX, b.maxX + 1]) : pick([b.minY - 1, b.minY, b.maxY, b.maxY + 1]),
        line = upright ? { x: at } : { y: at },
        mirrored = boundsOf(movePts(orig, { kind, line })),
        slid = upright
          ? { kind: "translate", dx: mirrored.minX - b.minX, dy: 0 }
          : { kind: "translate", dx: 0, dy: mirrored.minY - b.minY },
        farther = upright ? { x: at + (b.minX >= at ? -1 : 1) } : { y: at + (b.minY >= at ? -1 : 1) },
        /* the point on the line nearest the middle of the shape, for a half turn */
        center = upright ? [at, Math.round((b.minY + b.maxY) / 2)] : [Math.round((b.minX + b.maxX) / 2), at];
      move = { kind, line };
      wrongs = [
        [slid, "That slid across ℓ without flipping. A reflection makes a mirror image."],
        [
          { kind, line: farther },
          "Check the distances: each corner lands just as far from ℓ as it started, on the other side.",
        ],
        [{ kind: "rotate", center, turn: 180 }, "That’s turned upside down, a half turn. A reflection flips over ℓ."],
      ];
    }
    const right = movePts(orig, move),
      panels = [
        { pts: right, why: null },
        ...wrongs.map(([wrongMove, why]) => ({ pts: movePts(orig, wrongMove), why })),
      ];
    /* every picture different, none of them the original, and the original, the images, and the center or line together
       fitting the grid with a square to spare */
    const distinct = panels.every(
      (p, i) => !samePts(p.pts, orig) && panels.findIndex((q) => samePts(q.pts, p.pts)) === i,
    );
    if (!distinct) continue;
    const marks = moveMarks(move, orig),
      markPts = [
        ...(marks.points || []).map((p) => p.at),
        ...(marks.lines || []).map(({ line }) => ("x" in line ? [line.x, b.minY] : [b.minX, line.y])),
      ],
      all = boundsOf([...orig, ...panels.flatMap((p) => p.pts), ...markPts]);
    if (all.maxX - all.minX > 8 || all.maxY - all.minY > 8) continue;
    /* slide everything to the middle of the grid */
    const shift = {
        kind: "translate",
        dx: Math.floor((10 - (all.maxX - all.minX)) / 2) - all.minX,
        dy: Math.floor((10 - (all.maxY - all.minY)) / 2) - all.minY,
      },
      origAt = movePts(orig, shift),
      moveAt =
        move.kind === "rotate"
          ? { ...move, center: movePt(move.center, shift) }
          : move.kind === "reflect"
            ? { ...move, line: "x" in move.line ? { x: move.line.x + shift.dx } : { y: move.line.y + shift.dy } }
            : move,
      order = shuffle(range(4)),
      ids = ["a", "b", "c", "d"],
      placed = order.map((which, i) => ({
        ...panels[which],
        pts: movePts(panels[which].pts, shift),
        id: ids[i],
        tag: tags[i],
      })),
      answerPanel = placed.find((p) => p.why === null),
      why = {};
    placed.forEach((p) => {
      if (p.why) why[p.id] = p.why;
    });
    const named = moveText(moveAt, { centerName: "P", lineName: "line ℓ" }),
      /* each picture shows the center or the line, but not the segment to the image's corner, which would give it away */
      { points = [], lines = [] } = moveMarks(moveAt, origAt),
      shownMarks = { points, lines };
    return {
      kind: "tap",
      answer: answerPanel.id,
      prompt: `Which picture shows the ${sprite.name} after this move: <b>${named}</b>?`,
      fig: () =>
        panelsFig(
          placed.map((p) => ({
            id: p.id,
            tag: p.tag,
            ...withMarks(
              {
                shapes: [
                  { pts: origAt, cls: "a" },
                  { pts: p.pts, cls: "b" },
                ],
              },
              kind === "translate" ? {} : shownMarks,
            ),
          })),
          { view: PANEL_VIEW, label: `Four pictures of the ${sprite.name} and an image` },
        ),
      /* the hint for this kind of move (each one a function, so only this one is written) */
      hint: {
        translate: () =>
          `Move one corner first: count ${Math.abs(move.dx)} squares ${move.dx > 0 ? "right" : "left"} and ${Math.abs(move.dy)} ${move.dy > 0 ? "up" : "down"}. Every corner moves the same way.`,
        rotate: () =>
          `Turn the segment from P to one corner ${turnText(move.turn)}; it stays the same length. The rest of the shape turns with it.`,
        reflect: () =>
          "Count how far each corner is from ℓ. Its image is just as far on the other side, like in a mirror.",
      }[kind](),
      explain: `Picture ${answerPanel.tag}: ${lowerText(moveAt, { centerName: "P", lineName: "line ℓ" })} takes the gold ${sprite.name} to the blue one.`,
      why,
      facts: {
        t: "grid",
        orig: origAt,
        move: moveAt,
        panels: Object.fromEntries(placed.map((p) => [p.id, p.pts])),
      },
    };
  }
  return genGrid();
}

/* ---------- Station 3: moves on the coordinate plane (Lesson 5) ---------- */
/* the coordinate plane the shapes sit on */
const COORD_VIEW = [-7, 7, -7, 7];
/* a move for the coordinate plane: a translation, a reflection over an axis (or a line x = k or y = k), or a rotation
   around the origin */
function dealCoordMove() {
  const kind = pick(["translate", "reflect", "reflect", "rotate", "rotate"]);
  if (kind === "translate") return { kind, dx: nonzero(-6, 6), dy: nonzero(-6, 6) };
  if (kind === "reflect")
    return Math.random() < 0.75
      ? { kind, line: pick([{ x: 0 }, { y: 0 }]) }
      : { kind, line: pick([{ x: nonzero(-3, 3) }, { y: nonzero(-3, 3) }]) };
  return { kind, center: [0, 0], turn: pick([90, -90, 180]) };
}
/* Mistakes for where a point (x, y) lands: [[point, message], …] for each kind of move */
function coordMistakes([x, y], move) {
  if (move.kind === "translate") {
    const { dx, dy } = move;
    return [
      [[x + dy, y + dx], "The across move changes x, and the up-and-down move changes y."],
      [[x - dx, y + dy], dx > 0 ? "Moving right adds to x." : "Moving left subtracts from x."],
      [[x + dx, y - dy], dy > 0 ? "Moving up adds to y." : "Moving down subtracts from y."],
    ];
  }
  if (move.kind === "reflect") {
    if ("x" in move.line && move.line.x === 0)
      return [
        [[x, -y], "That’s over the x-axis. Over the y-axis, y stays the same and x changes sign."],
        [[-x, -y], "Only one coordinate changes sign. Over the y-axis it’s x."],
      ];
    if ("y" in move.line && move.line.y === 0)
      return [
        [[-x, y], "That’s over the y-axis. Over the x-axis, x stays the same and y changes sign."],
        [[-x, -y], "Only one coordinate changes sign. Over the x-axis it’s y."],
      ];
    const k = "x" in move.line ? move.line.x : move.line.y;
    return "x" in move.line
      ? [
          [
            [-x, y],
            `That’s over the y-axis. Count how far the point is from the line x = ${fmt(k)}, then go as far past it.`,
          ],
          [[x, 2 * k - y], "That flips up and down. A line x = k stands straight up, so it flips left and right."],
        ]
      : [
          [
            [x, -y],
            `That’s over the x-axis. Count how far the point is from the line y = ${fmt(k)}, then go as far past it.`,
          ],
          [[2 * k - x, y], "That flips left and right. A line y = k lies flat, so it flips up and down."],
        ];
  }
  const halfTurn = [[-x, -y], "That’s a half turn, 180°: both signs change."];
  if (move.turn === 90)
    return [
      [[y, -x], "That’s clockwise. Counterclockwise takes (x, y) to (−y, x)."],
      halfTurn,
      [[y, x], "Swapping isn’t enough: a quarter turn counterclockwise takes (x, y) to (−y, x)."],
    ];
  if (move.turn === -90)
    return [
      [[-y, x], "That’s counterclockwise. Clockwise takes (x, y) to (y, −x)."],
      halfTurn,
      [[y, x], "Swapping isn’t enough: a quarter turn clockwise takes (x, y) to (y, −x)."],
    ];
  return [
    [[-x, y], "That’s a reflection over the y-axis. A half turn changes both signs."],
    [[x, -y], "That’s a reflection over the x-axis. A half turn changes both signs."],
    [[-y, x], "That’s a quarter turn. A half turn takes (x, y) to (−x, −y)."],
  ];
}
function genCoords() {
  const type = pick(["one", "one", "one", "two", "back"]);
  const sprite = dealSprite(["right triangle", "triangle", "trapezoid"]),
    count = sprite.pts.length,
    shape = `${capital(POLY[count])} ${namesOf(count).join("")}`;
  for (let attempt = 0; attempt < 200; attempt++) {
    const orig = placeAt(sprite.pts, [R(-6, 3), R(-6, 3)]),
      moves = type === "two" ? [dealCoordMove(), dealCoordMove()] : [dealCoordMove()],
      image = moveAll(orig, moves),
      corner = R(0, count - 1);
    if (!fits(orig, [-6, 6, -6, 6]) || !fits(image, [-6, 6, -6, 6]) || samePts(orig, image)) continue;
    const [x, y] = orig[corner],
      letter = LETTERS[corner],
      lines = moves
        .filter((m) => m.kind === "reflect" && !(m.line.x === 0 || m.line.y === 0))
        .map((m) => ({ line: m.line, text: "x" in m.line ? `x = ${fmt(m.line.x)}` : `y = ${fmt(m.line.y)}` }));
    if (x === 0 || y === 0) continue;
    if (type === "back") {
      /* the image is drawn: where was the corner before the move? Undo it */
      const [move] = moves,
        [u, v] = image[corner],
        undo =
          move.kind === "translate"
            ? { kind: "translate", dx: -move.dx, dy: -move.dy }
            : move.kind === "rotate"
              ? { ...move, turn: move.turn === 180 ? 180 : -move.turn }
              : move;
      const doneTwice = movePt([u, v], move);
      return pointP({
        prompt: `${shape} was ${movedText(move)}. The image ${namesOf(count, 1).join("")} is shown. Where was ${letter}?`,
        answer: [x, y],
        fig: (show, done) =>
          planeFig({
            view: COORD_VIEW,
            axes: true,
            cell: 22,
            lines,
            shapes: [
              ...(done ? [{ pts: orig, cls: "a", verts: namesOf(count) }] : []),
              { pts: image, cls: "b", verts: namesOf(count, 1) },
            ],
            label: `${shape}’s image on a coordinate plane`,
          }),
        hint: `Undo the move: ${lowerText(undo)} takes ${prime(letter)} ${ptText([u, v])} back to ${letter}.`,
        pmisc: [
          [doneTwice, "That moved it again. To go back, undo the move."],
          ...coordMistakes([u, v], move).map(([p]) => [p, "Undo the move: go back the way it came."]),
        ],
        explain: `${prime(letter)} is at ${ptText([u, v])}. Undoing the move puts ${letter} at <b>${ptText([x, y])}</b>.`,
        facts: { t: "back", from: [u, v], moves, orig, image, corner },
      });
    }
    const [ax, ay] = image[corner],
      rule = moves.length === 1 && !lines.length ? ` The rule is ${math(ruleTex(moves[0]))}.` : "",
      moveWords = moves.length === 1 ? movedText(moves[0]) : `${movedText(moves[0])}, then ${movedText(moves[1])}`,
      after = moves.length === 1 ? prime(letter) : prime(letter, 2),
      /* the point after just the first move, and after the moves the other way round */
      firstOnly = movePt([x, y], moves[0]),
      swapped = moveAll([[x, y]], moves.slice().reverse())[0];
    const pmisc =
      moves.length === 1
        ? coordMistakes([x, y], moves[0])
        : [
            [swapped, "That does the moves in the other order. Do the first move first."],
            [firstOnly, "That’s only the first move. Do the second one from there."],
            ...coordMistakes(firstOnly, moves[1]).map(([p, why]) => [p, `After the first move: ${why}`]),
          ];
    return pointP({
      prompt: `${shape} is ${moveWords}. Where does ${after} land?`,
      answer: [ax, ay],
      fig: (show, done) =>
        planeFig({
          view: COORD_VIEW,
          axes: true,
          cell: 22,
          lines,
          shapes: [
            { pts: orig, cls: "a", verts: namesOf(count) },
            ...(done ? [{ pts: image, cls: "b", verts: namesOf(count, moves.length) }] : []),
          ],
          label: `${shape} on a coordinate plane`,
        }),
      hint:
        moves.length === 1
          ? `${letter} is at ${ptText([x, y])}. ${moveText(moves[0])}.${rule}`
          : `${letter} is at ${ptText([x, y])}. Do the moves in order: the first one takes it to ${ptText(firstOnly)}.`,
      pmisc,
      explain: `${letter} ${ptText([x, y])} lands at ${after} <b>${ptText([ax, ay])}</b>.${rule}`,
      facts: { t: moves.length === 1 ? "one" : "two", from: [x, y], moves, orig, image, corner },
    });
  }
  return genCoords();
}

/* ---------- Station 4: describing a move (Lesson 6) ---------- */
/* Moves a student might mix up with this one: the other direction, the other axis, a swap, a half turn. Each is a list of
   moves done one after another. */
function lookalikes(move, orig) {
  if (move.kind === "translate") {
    const { dx, dy } = move;
    return [
      [{ kind: "translate", dx: dy, dy: dx }],
      [{ kind: "translate", dx: -dx, dy: -dy }],
      [{ kind: "translate", dx: -dx, dy }],
      [{ kind: "translate", dx, dy: -dy }],
      [{ kind: "rotate", center: [0, 0], turn: 180 }],
    ];
  }
  if (move.kind === "reflect") {
    const b = boundsOf(orig),
      image = boundsOf(movePts(orig, move)),
      /* the slide that puts the shape where its mirror image is, without flipping it */
      slide = { kind: "translate", dx: image.minX - b.minX, dy: image.minY - b.minY },
      other = "x" in move.line ? { y: move.line.x } : { x: move.line.y };
    return [
      [{ kind: "reflect", line: other }],
      [{ kind: "rotate", center: [0, 0], turn: 180 }],
      [slide],
      [{ kind: "rotate", center: [0, 0], turn: 90 }],
    ];
  }
  const others = [90, -90, 180].filter((turn) => turn !== move.turn);
  return [
    ...others.map((turn) => [{ kind: "rotate", center: [0, 0], turn }]),
    [{ kind: "reflect", line: { x: 0 } }],
    [{ kind: "reflect", line: { y: 0 } }],
  ];
}
/* what a list of moves does, as written: "Reflect over the x-axis, then translate 3 units right" */
const movesText = (moves) => moves.map((m, i) => (i ? lowerText(m) : moveText(m))).join(", then ");
function genDescribe() {
  const type = pick(["move", "move", "rule", "twoMoves"]);
  const sprite = dealSprite(),
    count = sprite.pts.length,
    shape = `${POLY[count]} ${namesOf(count).join("")}`;
  for (let attempt = 0; attempt < 200; attempt++) {
    const orig = placeAt(sprite.pts, [R(-6, 3), R(-6, 3)]);
    /* a single move about the origin or over an axis (so it has a rule), or two moves in a row */
    let moves;
    if (type === "twoMoves") {
      const flip = { kind: "reflect", line: pick([{ x: 0 }, { y: 0 }]) },
        slide = { kind: "translate", dx: nonzero(-5, 5), dy: nonzero(-5, 5) };
      moves = Math.random() < 0.5 ? [flip, slide] : [slide, flip];
    } else {
      const move = dealCoordMove();
      if (move.kind === "reflect" && !(move.line.x === 0 || move.line.y === 0)) continue;
      moves = [move];
    }
    const image = moveAll(orig, moves);
    if (!fits(orig, [-6, 6, -6, 6]) || !fits(image, [-6, 6, -6, 6]) || !apart(orig, image)) continue;
    /* the wrong choices: lookalikes that land somewhere else, three of them */
    let wrongs;
    if (type === "twoMoves") {
      const [first, second] = moves,
        tweak = (m) =>
          m.kind === "translate"
            ? pick([
                { ...m, dx: -m.dx },
                { ...m, dy: -m.dy },
              ])
            : { kind: "reflect", line: "x" in m.line ? { y: 0 } : { x: 0 } };
      wrongs = [
        [second, first],
        [tweak(first), second],
        [first, tweak(second)],
        [tweak(first), tweak(second)],
      ];
    } else wrongs = lookalikes(moves[0], orig);
    const label = (list) => (type === "rule" ? math(ruleTex(list[0])) : movesText(list));
    wrongs = shuffle(wrongs)
      .filter((list) => !samePts(moveAll(orig, list), image))
      .filter((list, i, all) => all.findIndex((other) => label(other) === label(list)) === i)
      .slice(0, 3);
    if (wrongs.length < 3) continue;
    const firstCorner = orig[0],
      landed = image[0],
      after = moves.length === 1 ? prime("A") : prime("A", 2),
      /* a wrong choice named by the first corner it sends somewhere else */
      why = (list) => {
        const wrongImage = moveAll(orig, list),
          corner = wrongImage.findIndex(([u, v], i) => u !== image[i][0] || v !== image[i][1]),
          letter = LETTERS[corner],
          landedThere = moves.length === 1 ? prime(letter) : prime(letter, 2);
        return `That would take ${letter} ${ptText(orig[corner])} to ${ptText(wrongImage[corner])}, but ${landedThere} is at ${ptText(image[corner])}.`;
      };
    const prompt =
      type === "rule"
        ? `Which rule takes ${shape} to the blue image?`
        : type === "twoMoves"
          ? `Which two moves, in order, take ${shape} to ${namesOf(count, 2).join("")}?`
          : `Which move takes ${shape} to ${namesOf(count, 1).join("")}?`;
    return mcP([[label(moves), null], ...wrongs.map((list) => [label(list), why(list)])], {
      prompt,
      fig: () =>
        planeFig({
          view: COORD_VIEW,
          axes: true,
          cell: 22,
          shapes: [
            { pts: orig, cls: "a", verts: namesOf(count) },
            { pts: image, cls: "b", verts: namesOf(count, moves.length) },
          ],
          label: `A ${POLY[count]} and its image on a coordinate plane`,
        }),
      hint:
        type === "twoMoves"
          ? "First: are A, B, C and their images going around opposite ways? Then one of the moves is a flip. Then check where A lands."
          : `Start with A ${ptText(firstCorner)} and ${after} ${ptText(landed)}. Which move takes one to the other, and the other corners too?`,
      explain: `${label(moves)} takes A ${ptText(firstCorner)} to ${after} ${ptText(landed)}, and every other corner to its image.`,
      stack: true,
      facts: {
        t: type,
        orig,
        image,
        options: [moves, ...wrongs].map((list) => [label(list), list]),
        rule: type === "rule",
      },
    });
  }
  return genDescribe();
}

/* ---------- Station 5: what rigid moves keep (Lessons 7–10) ---------- */
/* a triangle's corners from its angles at A and B (AB is `side` long along the bottom), y up */
function triangleFrom(a, b, side) {
  const rad = (d) => (d * Math.PI) / 180,
    sideAC = (side * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [
    [0, 0],
    [side, 0],
    [sideAC * Math.cos(rad(a)), sideAC * Math.sin(rad(a))],
  ];
}
/* what a line becomes after a move: KEPT_LINE[case] is [the question's move, the answer] */
const LINE_CASES = [
  { id: "halfOff", says: "rotated 180° around a point P that isn’t on ℓ", answer: "A line parallel to ℓ" },
  { id: "halfOn", says: "rotated 180° around a point P on ℓ", answer: "Line ℓ itself" },
  { id: "quarter", says: "rotated 90° around a point P on ℓ", answer: "A line that crosses ℓ at a right angle" },
  { id: "slideAcross", says: "translated in a direction that crosses ℓ", answer: "A line parallel to ℓ" },
  { id: "slideAlong", says: "translated along ℓ itself", answer: "Line ℓ itself" },
];
/* why each wrong answer about a line's image is wrong */
const LINE_WHY = {
  "A line parallel to ℓ": "A parallel line never meets ℓ. Picture where two points of ℓ land.",
  "Line ℓ itself": "Picture where two points of ℓ land: do they stay on ℓ?",
  "A line that crosses ℓ at a right angle": "A quarter turn would do that. Picture where two points of ℓ land.",
};
function genKeep() {
  const type = pick(["side", "angle", "angle", "line", "compose", "area", "stays"]);
  if (type === "side" || type === "angle") {
    /* a triangle's side or angle after a rigid move: the same as the part it matches */
    const a = R(6, 16) * 5,
      b = R(6, 16) * 5,
      side = R(4, 12),
      kind = pick(Object.keys(KIND));
    if (a + b > 130 || a === b) return genKeep();
    /* the triangle with AB 4 long, and its image off to the right (the boxes around them apart) */
    const tri = triangleFrom(a, b, 4),
      moves = {
        translate: { kind, dx: 6, dy: R(-1, 1) },
        rotate: { kind, center: [6, 1], turn: pick([90, 180, -90]) },
        reflect: { kind, line: { x: 5 } },
      },
      move = moves[kind],
      image = movePts(tri, move);
    if (boundsOf(tri).maxY > 4.5 || !apart(tri, image)) return genKeep();
    const askB = Math.random() < 0.5,
      angleText = { 0: `${a}°`, 1: `${b}°` },
      askText = type === "side" ? `How long is A′B′?` : `What is angle ${askB ? "B′" : "A′"}?`;
    return numP({
      prompt: `Triangle ABC was ${{ translate: "translated", rotate: "rotated", reflect: "reflected" }[kind]} to A′B′C′. AB is ${side} cm, angle A is ${a}°, and angle B is ${b}°. ${askText}`,
      answer: type === "side" ? side : askB ? b : a,
      unit: type === "side" ? "cm" : "°",
      fig: () =>
        planeFig({
          grid: false,
          cell: 24,
          shapes: [
            { pts: tri, cls: "a", verts: namesOf(3), sides: [`${side} cm`], angles: angleText },
            {
              pts: image,
              cls: "b",
              verts: namesOf(3, 1),
              sides: type === "side" ? ["?"] : [],
              angles: type === "angle" ? { [askB ? 1 : 0]: "?" } : {},
            },
          ],
          label: "Triangle ABC and its image A′B′C′",
        }),
      hint: `Rigid moves don’t stretch or bend: every side and angle of the image is the same as the part it matches. ${type === "side" ? "A′B′ matches AB." : `Angle ${askB ? "B′ matches B" : "A′ matches A"}.`}`,
      misc:
        type === "side"
          ? []
          : [
              [askB ? a : b, `That’s angle ${askB ? "A′" : "B′"}. Angle ${askB ? "B′ matches B" : "A′ matches A"}.`],
              [180 - a - b, "That’s angle C′. Match the letters: the prime marks the image of the same corner."],
              [
                180 - (askB ? b : a),
                "Angles don’t turn into their supplements: a rigid move keeps every angle the same.",
              ],
            ],
      explain:
        type === "side"
          ? `A rigid move keeps lengths: A′B′ = AB = ${side} cm.`
          : `A rigid move keeps angles: angle ${askB ? `B′ = angle B = ${b}°` : `A′ = angle A = ${a}°`}.`,
      facts: { t: type, a, b, side, askB, move },
    });
  }
  if (type === "line") {
    /* the image of a line after a rotation or translation: parallel, the same line, or a crossing one */
    const lineCase = pick(LINE_CASES),
      answers = ["A line parallel to ℓ", "Line ℓ itself", "A line that crosses ℓ at a right angle"];
    return mcP(
      answers.map((label) => [label, label === lineCase.answer ? null : LINE_WHY[label]]),
      {
        prompt: `Line ℓ is ${lineCase.says}. What is its image?`,
        hint: "Pick two points on ℓ and move them. The image is the line through where they land.",
        explain: {
          halfOff:
            "A half turn around a point off the line turns it to face the opposite way, on the other side of P: a parallel line.",
          halfOn: "A half turn around a point on ℓ swaps the two directions along ℓ, so the image is ℓ itself.",
          quarter: "A quarter turn around a point on ℓ turns ℓ 90°: the image crosses ℓ at a right angle at P.",
          slideAcross: "A translation moves every point the same way, so the image never meets ℓ: a parallel line.",
          slideAlong: "Every point slides along ℓ and stays on it, so the image is ℓ itself.",
        }[lineCase.id],
        stack: true,
        facts: { t: type, id: lineCase.id },
      },
    );
  }
  /* a right triangle turned 180° around the midpoint of a side: together they make a rectangle (the long side) or a
     parallelogram (a leg), with twice the triangle's area */
  const across = R(2, 8),
    up = R(2, 8),
    about = pick(["long", "long", "across", "up"]);
  if (across === up) return genKeep();
  const tri = [
      [0, 0],
      [across, 0],
      [0, up],
    ],
    mid = about === "long" ? [across / 2, up / 2] : about === "across" ? [across / 2, 0] : [0, up / 2],
    turned = movePts(tri, { kind: "rotate", center: mid, turn: 180 }),
    sideName = about === "long" ? "longest side" : `side of ${about === "across" ? across : up}`,
    shapeName = about === "long" ? "A rectangle" : "A parallelogram that isn’t a rectangle";
  /* the view holds the image too, so the picture keeps its size when the image appears */
  const composeView = viewFor({ shapes: [{ pts: tri }, { pts: turned }] }),
    fig = (show, done) =>
      planeFig({
        view: composeView,
        cell: 30,
        shapes: [{ pts: tri, cls: "a" }, ...(type === "area" || done ? [{ pts: turned, cls: "b" }] : [])],
        /* M's name goes outside the triangle: past the long side, under the bottom leg, or left of the upright one */
        points: [{ at: mid, text: "M", dir: { long: 45, across: 270, up: 180 }[about] }],
        label: `A right triangle with legs ${across} and ${up}`,
      });
  if (type === "compose")
    return mcP(
      [
        [
          "A rectangle",
          about === "long" ? null : "The corners at M’s side aren’t right angles here: the slanted side stays slanted.",
        ],
        [
          "A parallelogram that isn’t a rectangle",
          about === "long"
            ? "The two right angles end up in opposite corners, and the other corners make right angles too."
            : null,
        ],
        [
          "A bigger triangle",
          "The image doesn’t line up with the triangle’s sides: its corners stick out to make four corners.",
        ],
      ],
      {
        prompt: `A right triangle with legs ${across} and ${up} is rotated 180° around M, the middle of its ${sideName}. What shape do the triangle and its image make together?`,
        fig,
        hint: "A half turn makes each side of the image parallel to the side it came from. Picture the triangle upside down, sharing that side.",
        explain: `Turned around the middle of its ${sideName}, the triangle and its image share that side and make <b>${shapeName.toLowerCase()}</b>.`,
        stack: true,
        facts: { t: type, across, up, about },
      },
    );
  if (type === "area")
    return numP({
      prompt: `A right triangle with legs ${across} and ${up} is rotated 180° around M, the middle of its ${sideName}. What is the area of the shape the two triangles make?`,
      answer: across * up,
      unit: "square units",
      fig,
      hint: "The image is a copy of the triangle, so the shape is two of them. One triangle’s area is half its legs multiplied.",
      misc: [
        [(across * up) / 2, "That’s one triangle. The image is a second, just as big."],
        [2 * across * up, "That counts each triangle as a whole rectangle. A triangle is half of legs × legs."],
        [across + up, "Area multiplies: each triangle is ½ × legs × legs."],
      ],
      explain: `Each triangle is ½ × ${across} × ${up} = ${fmt((across * up) / 2)}, so the two make ${across * up} square units.`,
      facts: { t: type, across, up, about },
    });
  /* what a rigid move keeps the same, and what it can change */
  const kind = pick(Object.keys(KIND)),
    kept = pick(["The side lengths", "The angle measures", "The area", "The perimeter"]),
    changes = [
      "Where it is on the grid",
      "The coordinates of its corners",
      ...(kind === "translate" ? [] : ["Which way it faces"]),
    ];
  return mcP(
    [
      [kept, null],
      ...shuffle(changes)
        .slice(0, 2)
        .map((label) => [
          label,
          `A ${KIND[kind]} can change that. It only keeps what doesn’t depend on where the shape is.`,
        ]),
    ],
    {
      prompt: `A sprite gets a ${KIND[kind]}. Which of these is sure to stay the same?`,
      hint: "Rigid moves don’t bend or stretch: anything you could measure with a ruler or a protractor stays the same.",
      explain: `${kept} stay${kept === "The area" || kept === "The perimeter" ? "s" : ""} the same: a ${KIND[kind]} moves the shape without stretching it.`,
      facts: { t: type, kind, kept },
    },
  );
}

/* ---------- Station 6: congruence (Lessons 11–13) ---------- */
/* what two shapes have in common, and whether that makes them congruent: [what, answer, why] */
const SAME_CASES = [
  [
    "two quadrilaterals that each have four sides 5 cm long",
    "No",
    "A square and a leaning rhombus both have four 5 cm sides.",
  ],
  [
    "two rectangles that each have an area of 12 square cm",
    "No",
    "A 3 by 4 rectangle and a 2 by 6 rectangle both have area 12.",
  ],
  [
    "two rectangles that each have a perimeter of 20 cm",
    "No",
    "A 4 by 6 rectangle and a 3 by 7 rectangle both have perimeter 20.",
  ],
  ["two triangles that each have sides of 3, 4, and 5 cm", "Yes", "Three sides that meet make just one triangle."],
  [
    "two circles that each have a radius of 4 cm",
    "Yes",
    "A translation slides one circle onto the other: same radius, same circle.",
  ],
  [
    "two squares that each have sides 6 cm long",
    "Yes",
    "Every angle is 90°, so a translation and a turn fit one onto the other.",
  ],
  [
    "two rectangles that are each 3 cm by 8 cm",
    "Yes",
    "Turn one so its long sides match the other’s, and slide it on.",
  ],
  [
    "two triangles that each have angles of 40°, 60°, and 80°",
    "No",
    "Same angles can come in different sizes: one can be a scaled copy.",
  ],
];
function genCongruent() {
  const type = pick(["yesno", "yesno", "yesno", "match", "length", "same"]);
  if (type === "same") {
    /* do two shapes that share a measure have to be congruent? */
    const [what, answer, reason] = pick(SAME_CASES);
    return mcP(
      [
        ["Yes", answer === "Yes" ? null : `Not always. ${reason}`],
        ["No, not always", answer === "No" ? null : `They must be. ${reason}`],
      ],
      {
        prompt: `Must ${what} be congruent?`,
        hint: "Congruent means a rigid move fits one exactly onto the other. Can you draw two that fit the description but don’t match?",
        explain: `${answer === "Yes" ? "Yes" : "No, not always"}. ${reason}`,
        facts: { t: type, what, answer },
      },
    );
  }
  if (type === "match" || type === "length") {
    /* corresponding parts of congruent polygons, named in order */
    const count = R(3, 5),
      first = namesOf(count),
      /* the second polygon's letters share none with the first's */
      second = pick(count === 3 ? ["DEF", "PQR", "JKL"] : ["PQRST", "JKLMN", "VWXYZ"])
        .slice(0, count)
        .split("");
    const side = R(0, count - 1),
      next = (side + 1) % count,
      sideName = (names, i) => names[i] + names[(i + 1) % count],
      poly = POLY[count],
      /* the two polygons drawn side by side, the second turned a quarter turn, with their corners named */
      shapePts = SPRITES.find((sprite) => sprite.pts.length === count).pts,
      turnedPts = placeAt(movePts(shapePts, { kind: "rotate", center: [0, 0], turn: pick([90, -90, 180]) }), [
        boundsOf(shapePts).maxX + 2,
        0,
      ]),
      fig = () =>
        planeFig({
          grid: false,
          cell: 34,
          shapes: [
            { pts: shapePts, cls: "a", verts: first },
            { pts: turnedPts, cls: "b", verts: second },
          ],
          label: `${capital(poly)} ${first.join("")} and the congruent ${poly} ${second.join("")}, turned`,
        });
    if (type === "match") {
      const askAngle = Math.random() < 0.4;
      const label = (i) => (askAngle ? `Angle ${second[i]}` : `Side ${sideName(second, i)}`);
      return mcP(
        /* the matching part and three others */
        [side, ...shuffle(range(count).filter((i) => i !== side)).slice(0, 3)].map((i) => [
          label(i),
          i === side ? null : `Match the letters in order: ${first.map((l, j) => `${l} ↔ ${second[j]}`).join(", ")}.`,
        ]),
        {
          prompt: `${capital(poly)} ${first.join("")} is congruent to ${poly} ${second.join("")}, with the corners in that order. Which ${askAngle ? "angle" : "side"} matches ${askAngle ? `angle ${first[side]}` : `side ${sideName(first, side)}`}?`,
          fig,
          hint: `The order says which corners match: ${first[0]} matches ${second[0]}, ${first[1]} matches ${second[1]}, and so on.`,
          explain: `${askAngle ? `Angle ${first[side]}` : sideName(first, side)} matches ${askAngle ? `angle ${second[side]}` : sideName(second, side)}: ${first[side]} ↔ ${second[side]}${askAngle ? "" : ` and ${first[next]} ↔ ${second[next]}`}.`,
          facts: { t: type, first, second, side, askAngle },
        },
      );
    }
    const lengths = shuffle(range(9).map((i) => i + 3)).slice(0, count),
      other = (side + 1) % count;
    return numP({
      prompt: `${capital(poly)} ${first.join("")} is congruent to ${poly} ${second.join("")}, with the corners in that order. ${sideName(first, side)} is ${lengths[side]} cm and ${sideName(first, other)} is ${lengths[other]} cm. How long is ${sideName(second, side)}?`,
      answer: lengths[side],
      unit: "cm",
      fig,
      hint: `${sideName(second, side)} goes from ${second[side]} to ${second[next]}. Which side of ${first.join("")} has the matching letters?`,
      misc: [[lengths[other], `That’s ${sideName(second, other)}, which matches ${sideName(first, other)}.`]],
      explain: `${sideName(second, side)} matches ${sideName(first, side)}, and congruent polygons have matching sides the same length: ${lengths[side]} cm.`,
      facts: { t: type, lengths, side, count },
    });
  }
  /* is the blue shape congruent to the gold one? Moved (yes), or scaled, stretched, or with a corner pulled (no) */
  const sprite = dealSprite(),
    how = pick(["moved", "moved", "moved", "scaled", "stretched", "pulled"]),
    view = [0, 12, 0, 8];
  for (let attempt = 0; attempt < 200; attempt++) {
    const orig = placeAt(sprite.pts, [R(0, 4), R(0, 4)]);
    let other, reason;
    if (how === "moved") {
      const moves = [dealMove(pick(Object.keys(KIND)), orig), dealMove(pick(Object.keys(KIND)), orig)].slice(
        0,
        R(1, 2),
      );
      other = moveAll(orig, moves);
      reason = `${capital(moves.map((m) => `a ${KIND[m.kind]}`).join(" and then "))} ${moves.length > 1 ? "fit" : "fits"} the gold one exactly onto the blue one.`;
    } else if (how === "scaled") {
      other = orig.map(([x, y]) => [2 * x, 2 * y]);
      reason = "Every side of the blue one is twice as long. Rigid moves don’t stretch, so no move fits them together.";
    } else if (how === "stretched") {
      const wide = Math.random() < 0.5;
      other = orig.map(([x, y]) => (wide ? [2 * x, y] : [x, 2 * y]));
      reason = `The blue one is stretched ${wide ? "wider" : "taller"}: some sides are longer and the angles are different.`;
    } else {
      /* one corner of a triangle pulled one square along the grid */
      if (orig.length !== 3) return genCongruent();
      const corner = R(0, 2),
        [dx, dy] = pick([
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]);
      other = orig.map(([x, y], i) => (i === corner ? [x + dx, y + dy] : [x, y]));
      reason = "One corner is pulled a square out of place, so two of its sides have different lengths.";
    }
    /* turn the blue one so it doesn't sit the same way, then put it to the right of the gold one */
    if (how !== "moved") other = movePts(other, { kind: "rotate", center: [0, 0], turn: pick([90, -90, 180]) });
    const ob = boundsOf(orig),
      placed = how === "moved" ? other : placeAt(other, [ob.maxX + R(1, 3), R(0, 2)]);
    /* a pulled corner mustn't leave the triangle flat, or happen to make one with the same sides */
    const sameSides = sideSquares(orig).join() === sideSquares(placed).join();
    if (!fits(placed, view) || !apart(orig, placed) || shoelaceSign(placed) === 0) continue;
    if (how !== "moved" && sameSides) continue;
    const congruent = how === "moved";
    return mcP(
      [
        ["Yes", congruent ? null : reason],
        ["No", congruent ? `They are: ${reason}` : null],
      ],
      {
        prompt: `Is the blue ${sprite.name} congruent to the gold one?`,
        fig: () =>
          planeFig({
            view,
            cell: 22,
            shapes: [
              { pts: orig, cls: "a" },
              { pts: placed, cls: "b" },
            ],
            label: `A gold ${sprite.name} and a blue shape on a grid`,
          }),
        hint: "Congruent means some rigid moves (slides, turns, flips) fit one exactly onto the other. Compare side lengths along the grid.",
        explain: `${congruent ? "Yes" : "No"}. ${reason}`,
        facts: { t: "yesno", orig, other: placed, how },
      },
    );
  }
  return genCongruent();
}

/* the squares of a polygon's side lengths, smallest first (whole numbers for corners on the grid) */
const sideSquares = (pts) =>
  pts
    .map(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      return (x2 - x1) ** 2 + (y2 - y1) ** 2;
    })
    .sort((u, v) => u - v);

/* ---------- Station 7: angles where a line crosses parallel lines (Lesson 14) ---------- */
/* how two of transversalFig's eight angles are related: their name, and why they're equal or add to 180° */
function anglePair(i, j) {
  const sameCrossing = Math.floor(i / 4) === Math.floor(j / 4),
    [lo, hi] = [Math.min(i, j), Math.max(i, j)];
  if (sameCrossing && (i - j) % 2 !== 0)
    return { name: "on a straight line", why: "Together they make a straight line, 180°." };
  if (sameCrossing)
    return { name: "vertical angles", why: "They’re vertical angles, across from each other, so they’re equal." };
  if (hi - lo === 4)
    return {
      name: "corresponding angles",
      why: "They’re corresponding angles: sliding one crossing onto the other (a translation) fits them together, so they’re equal.",
    };
  if ((lo === 2 && hi === 4) || (lo === 3 && hi === 5))
    return {
      name: "alternate interior angles",
      why: "They’re alternate interior angles: a half turn around the point halfway between the crossings swaps them, so they’re equal.",
    };
  return {
    name: "",
    why:
      (i - j) % 2 === 0
        ? "Go through an angle at the other crossing: each step keeps the measure, so they’re equal."
        : "Go through an angle at the other crossing: one step is a straight line, so they add to 180°.",
  };
}
function genParallel() {
  const type = pick(["find", "find", "find", "pairName", "angleX"]);
  /* the crossing line's angle: 35° to 145° in fives, but not 90° (then every angle is 90°) */
  const deg = pick(
      range(23)
        .map((i) => 35 + i * 5)
        .filter((d) => d !== 90),
    ),
    measure = (i) => (i % 2 === 0 ? deg : 180 - deg);
  if (type === "pairName") {
    /* name the pair: vertical, corresponding, or alternate interior */
    const pairs = [
        [0, 2],
        [1, 3],
        [4, 6],
        [5, 7],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
        [2, 4],
        [3, 5],
      ],
      [i, j] = shuffle(pick(pairs).slice()),
      { name } = anglePair(i, j),
      texts = [];
    texts[i] = "1";
    texts[j] = "2";
    return mcP(
      ["vertical angles", "corresponding angles", "alternate interior angles"].map((label) => [
        capital(label),
        label === name
          ? null
          : {
              "vertical angles": "Vertical angles are across from each other at the same crossing.",
              "corresponding angles":
                "Corresponding angles sit in the same spot at the two crossings, like a copy slid along.",
              "alternate interior angles":
                "Alternate interior angles are between the parallel lines, on opposite sides of the crossing line.",
            }[label],
      ]),
      {
        prompt: "Lines ℓ and m are parallel. What are angles 1 and 2 called?",
        fig: () =>
          transversalFig(deg, {
            texts,
            hi: [i, j],
            label: "Parallel lines crossed by a line, with angles 1 and 2 marked",
          }),
        hint: "Same crossing or different ones? Between the parallel lines or outside them? Same side of the crossing line or opposite sides?",
        explain: `They’re <b>${name}</b>, so they’re equal: both ${measure(i)}° here.`,
        facts: { t: type, deg, i, j },
      },
    );
  }
  if (type === "angleX") {
    /* an angle written with x matches (or adds to 180° with) an angle you know: solve for x */
    const [i, j] = shuffle(
        pick([
          [2, 4],
          [3, 5],
          [0, 4],
          [1, 5],
          [0, 2],
          [2, 5],
          [3, 4],
        ]).slice(),
      ),
      equal = (i - j) % 2 === 0,
      known = measure(i),
      unknown = measure(j),
      coefficient = R(2, 5),
      constant = unknown - coefficient * R(5, Math.floor(unknown / coefficient));
    const xValue = (unknown - constant) / coefficient;
    if (!Number.isInteger(xValue) || constant < 0 || constant % 5) return genParallel();
    const texts = [];
    texts[i] = `${known}°`;
    texts[j] = "?";
    const expression = constant ? `${coefficient}x + ${constant}` : `${coefficient}x`;
    return numP({
      prompt: `Lines ℓ and m are parallel. The angle marked ? is ${math(`(${expression})^\\circ`)}. What is ${math("x")}?`,
      answer: xValue,
      fig: () => transversalFig(deg, { texts, label: `Parallel lines crossed by a line, one angle ${known}°` }),
      hint: `${anglePair(i, j).why} Write an equation and solve it.`,
      misc: [
        [unknown, `That’s the angle itself. Solve ${expression} = ${unknown} for x.`],
        [
          (180 - known - constant) / coefficient,
          `These two aren’t ${equal ? "a straight line" : "equal"}: ${anglePair(i, j).why}`,
        ],
        [(known + constant) / coefficient, "Subtract the number added to the x term; don’t add it."],
      ].filter(([v]) => Number.isInteger(v) && v > 0),
      explain: `${math(`${expression} = ${unknown}`)}, so ${math(`${coefficient}x = ${unknown - constant}`)} and ${math(`x = ${xValue}`)}.`,
      facts: { t: type, deg, i, j, coefficient, constant },
    });
  }
  /* one angle is given: find the one marked ? */
  let i, j;
  do {
    i = R(0, 7);
    j = R(0, 7);
  } while (i === j);
  const texts = [];
  texts[i] = `${measure(i)}°`;
  texts[j] = "?";
  const { why } = anglePair(i, j),
    equal = (i - j) % 2 === 0;
  return numP({
    prompt: "Lines ℓ and m are parallel. What is the angle marked ?",
    answer: measure(j),
    unit: "°",
    fig: () => transversalFig(deg, { texts, label: `Parallel lines crossed by a line, one angle ${measure(i)}°` }),
    hint: why,
    misc: [
      [
        equal ? 180 - measure(i) : measure(i),
        equal ? "These two are equal, not a straight line." : "These two aren’t equal: together they make 180°.",
      ],
      [90 - measure(i), "They aren’t complementary: nothing here makes a right angle."],
    ].filter(([v]) => v > 0),
    explain: `${why} ${equal ? `The ? is ${measure(i)}°.` : `180 − ${measure(i)} = ${measure(j)}°.`}`,
    facts: { t: "find", deg, i, j },
  });
}

/* ---------- Station 8: the angles in a triangle (Lessons 15–16) ---------- */
function genTriangle() {
  const type = pick(["third", "third", "right", "isosceles", "parallel", "triX"]);
  if (type === "triX") {
    /* the angles are written with x: x, a multiple of x or x plus a number, and another; they add to 180° */
    const xValue = R(4, 12) * 5,
      second = pick([2 * xValue, 3 * xValue, xValue + R(1, 6) * 5, xValue - R(1, 4) * 5]),
      third = 180 - xValue - second;
    if (second <= 10 || third <= 10 || second === xValue) return genTriangle();
    const asText = (v) =>
        v % xValue === 0 ? `${v / xValue}x` : v > xValue ? `x + ${v - xValue}` : `x - ${xValue - v}`,
      secondText = asText(second);
    /* the third angle as a number, so the equation has one letter: x + (second) + third = 180 */
    return numP({
      prompt: `A triangle’s angles are ${math("x^\\circ")}, ${math(`(${secondText})^\\circ`)}, and ${third}°. What is ${math("x")}?`,
      answer: xValue,
      unit: "",
      fig: () =>
        triangleFig(xValue, second, {
          texts: ["x", secondText.replace("-", "−"), `${third}°`],
          label: "A triangle with angles written with x",
        }),
      hint: `The three angles add up to 180°: ${math(`x + (${secondText}) + ${third} = 180`)}.`,
      misc: [
        [second, `That’s the second angle, ${secondText}. Solve for x.`],
        [(180 - third) / 2, "Collect the x’s and the plain numbers separately, then divide by how many x’s there are."],
        [180 - third, `That’s the first two angles together. Solve for x.`],
      ].filter(([v]) => Number.isInteger(v) && v > 0),
      explain: `${math(`x + (${secondText}) + ${third} = 180`)} gives ${math(`x = ${xValue}`)}.`,
      facts: { t: type, angles: [xValue, second, third] },
    });
  }
  if (type === "parallel") {
    /* a line through C parallel to AB: its angles with CA and CB match A and B (alternate interior), and the three at C make
       a straight line */
    const a = R(7, 15) * 5,
      b = R(7, 15) * 5,
      ask = pick(["C", "left", "right"]);
    if (a + b > 150) return genTriangle();
    const answer = ask === "C" ? 180 - a - b : ask === "left" ? a : b;
    return numP({
      prompt:
        ask === "C"
          ? `The blue line through C is parallel to AB. Its angles with CA and CB are ${a}° and ${b}°. What is angle C?`
          : `The blue line through C is parallel to AB. Angle A is ${a}° and angle B is ${b}°. What is the angle marked ? at C?`,
      answer,
      unit: "°",
      fig: () =>
        triangleFig(a, b, {
          parallel: true,
          texts: ask === "C" ? ["", "", "?"] : [`${a}°`, `${b}°`, ""],
          outside: ask === "C" ? [`${a}°`, `${b}°`] : ask === "left" ? ["?", ""] : ["", "?"],
        }),
      hint:
        ask === "C"
          ? "The three angles at C, along the blue line, make a straight line: 180°."
          : "The angle at C and the angle in the triangle across from it are alternate interior angles: AB and the blue line are parallel.",
      misc:
        ask === "C"
          ? [
              [a + b, "That’s the two outside angles together. All three at C make a straight line: 180°."],
              [180 - a, "There are three angles along the line at C: take both outside ones away."],
            ]
          : [
              [180 - answer, "These are alternate interior angles, so they’re equal, not a straight line."],
              [
                ask === "left" ? b : a,
                `Match the angle on the same side: the ? is across from ${ask === "left" ? "A" : "B"}.`,
              ],
            ],
      explain:
        ask === "C"
          ? `The angles at C make a straight line: 180 − ${a} − ${b} = ${answer}°. That’s why a triangle’s angles add to 180°.`
          : `Alternate interior angles are equal: the ? matches angle ${ask === "left" ? "A" : "B"}, ${answer}°.`,
      facts: { t: type, angles: [a, b, 180 - a - b], ask },
    });
  }
  if (type === "isosceles") {
    /* two equal angles at A and B: from the top angle, or from one of the equal ones */
    const top = R(2, 14) * 10,
      base = (180 - top) / 2,
      fromTop = Math.random() < 0.5;
    return numP({
      prompt: fromTop
        ? `Triangle ABC has equal angles at A and B. Angle C is ${top}°. What is angle A?`
        : `Triangle ABC has equal angles at A and B. Angle A is ${base}°. What is angle C?`,
      answer: fromTop ? base : top,
      unit: "°",
      fig: () => triangleFig(base, base, { texts: fromTop ? ["?", "", `${top}°`] : [`${base}°`, "", "?"] }),
      hint: fromTop
        ? "Take angle C from 180°. What’s left is split equally between A and B."
        : "Angle B is the same as angle A. All three add to 180°.",
      misc: fromTop
        ? [
            [180 - top, "That’s A and B together. They’re equal, so split it in half."],
            [top, "The equal angles are A and B, not C."],
          ]
        : [
            [180 - base, "Angle B is the same as A: take both away from 180°."],
            [base, "C isn’t one of the equal angles. A and B are."],
          ],
      explain: fromTop
        ? `180 − ${top} = ${180 - top}, and ${180 - top} ÷ 2 = ${base}°.`
        : `180 − ${base} − ${base} = ${top}°.`,
      facts: { t: type, angles: [base, base, top] },
    });
  }
  /* two angles given (one of them a right angle, for "right"): find the third */
  const a = type === "right" ? 90 : R(4, 22) * 5,
    b = R(4, 18) * 5;
  if (a + b > 160) return genTriangle();
  const c = 180 - a - b,
    /* which corner is unknown: put the right angle at A or B, and the ? anywhere else */
    ask = type === "right" ? pick([1, 2]) : R(0, 2),
    angles = [a, b, c],
    given = angles.filter((_, i) => i !== ask),
    names = ["A", "B", "C"],
    givenNames = names.filter((_, i) => i !== ask),
    texts = angles.map((v, i) => (i === ask ? "?" : `${v}°`));
  return numP({
    prompt: `In triangle ABC, angle ${givenNames[0]} is ${given[0]}° and angle ${givenNames[1]} is ${given[1]}°. What is angle ${names[ask]}?`,
    answer: angles[ask],
    unit: "°",
    fig: () => triangleFig(a, b, { texts }),
    hint: "A triangle’s three angles always add up to 180°.",
    misc: [
      [given[0] + given[1], "That adds the two angles you know. The third is what’s left of 180°."],
      [360 - given[0] - given[1], "A triangle’s angles add to 180°, not 360°."],
      [180 - given[0], "Take both known angles away from 180°."],
    ].filter(([v]) => v > 0),
    explain: `180 − ${given[0]} − ${given[1]} = ${angles[ask]}°.`,
    facts: { t: type, angles, ask },
  });
}

const ZONES = [
  {
    id: "moves",
    name: "Name the Move",
    lessons: "Lessons 1–2",
    blurb: "Tell translations, rotations, and reflections apart, and what each one needs.",
    gen: genMoves,
  },
  {
    id: "grid",
    name: "Grid Moves",
    lessons: "Lessons 3–4",
    blurb: "Pick the picture that shows a sprite slid, turned around a point, or flipped over a line.",
    gen: genGrid,
  },
  {
    id: "coords",
    name: "Coordinate Moves",
    lessons: "Lesson 5",
    blurb: "Find where a corner lands after a move on the coordinate plane, or where it started.",
    gen: genCoords,
  },
  {
    id: "describe",
    name: "Describe It",
    lessons: "Lesson 6",
    blurb: "Name the move, the rule, or the two moves in a row that take a shape to its image.",
    gen: genDescribe,
  },
  {
    id: "keep",
    name: "No Stretching",
    lessons: "Lessons 7–10",
    blurb: "Rigid moves keep lengths, angles, and area. Turn lines and triangles, and build shapes from copies.",
    gen: genKeep,
  },
  {
    id: "congruent",
    name: "Congruence Check",
    lessons: "Lessons 11–13",
    blurb: "Decide whether two shapes are congruent, and match up their sides and angles.",
    gen: genCongruent,
  },
  {
    id: "parallel",
    name: "Parallel Lines",
    lessons: "Lesson 14",
    blurb: "Find angles where a line crosses two parallel lines: vertical, corresponding, and alternate interior.",
    gen: genParallel,
  },
  {
    id: "triangle",
    name: "Triangle Angles",
    lessons: "Lessons 15–16",
    blurb: "A triangle’s angles add to 180°. Find missing angles and see why with a parallel line.",
    gen: genTriangle,
  },
  {
    id: "boss",
    name: "Launch Day",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station before the game ships. Aim for 3 stars.",
    gen: () => pick([genMoves, genGrid, genCoords, genDescribe, genKeep, genCongruent, genParallel, genTriangle])(),
  },
];

const ICON = {
  moves:
    '<polygon points="8,50 26,50 8,36" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><polygon points="38,50 56,50 56,36" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5" stroke-linejoin="round"/><path d="M32,12 V56" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="4 4"/>',
  grid: '<path d="M8,8 H56 M8,24 H56 M8,40 H56 M8,56 H56 M8,8 V56 M24,8 V56 M40,8 V56 M56,8 V56" stroke="rgba(170,205,255,.35)" stroke-width="1.5"/><polygon points="8,56 24,56 8,40" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="40,24 56,24 40,8" fill="rgba(127,227,255,.4)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M16,46 L44,18" stroke="#f3f6fb" stroke-width="2.5"/>',
  coords:
    '<path d="M32,6 V58 M6,32 H58" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="20" r="5" fill="#ffc93c"/><circle cx="20" cy="44" r="5" fill="#7fe3ff"/><path d="M40,24 L25,39" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="3 3"/>',
  describe:
    '<polygon points="8,40 24,40 8,24" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="40,56 56,56 56,40" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="44" y="24" fill="#f3f6fb" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
  keep: '<polygon points="6,50 30,50 6,22" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="58,14 34,14 58,42" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="18" y="60" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">5</text><text x="46" y="10" fill="#f3f6fb" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">5</text>',
  congruent:
    '<polygon points="6,44 26,44 26,24 14,18" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="38,44 58,44 58,24 46,18" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="58" fill="#5fe0a8" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">≅</text>',
  parallel:
    '<path d="M4,22 H60 M4,44 H60" stroke="#f3f6fb" stroke-width="3"/><path d="M18,60 L46,6" stroke="#7fe3ff" stroke-width="3"/><path d="M44,22 A8,8 0 0 0 41,15" fill="none" stroke="#ffc93c" stroke-width="2.5"/><path d="M33,44 A8,8 0 0 0 30,37" fill="none" stroke="#ffc93c" stroke-width="2.5"/>',
  triangle:
    '<polygon points="6,54 58,54 22,12" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><text x="32" y="44" fill="#f3f6fb" font-size="13" font-weight="800" text-anchor="middle" font-family="monospace">180</text>',
  boss: '<rect x="10" y="10" width="44" height="34" rx="5" fill="rgba(127,227,255,.15)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M24,52 H40 M32,44 V52" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="20,36 32,18 44,36" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5"/>',
};
