/* Sprite Studio: limits and real-world checks for tools/fuzz.mjs. Answers may be negative (points on the coordinate plane), so
   signed is set. Per station: dp = most decimal places, nz = most nonzero digits, max = largest value, for the answer and every
   number in the prompt. check() works every image out again with its own moves (written here, apart from figs.js): the shape
   each picture or choice shows, the point each answer names, and every angle from the facts each problem carries. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* the label of the choice that's the answer, as plain text */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
/* one move done to a point [x, y]: a slide by (dx, dy), a turn by a multiple of 90° counterclockwise around a center (by
   turning the arrow from the center a quarter turn at a time), or a mirror over a vertical or horizontal line */
function apply([x, y], move) {
  if (move.kind === "translate") return [x + move.dx, y + move.dy];
  if (move.kind === "reflect") return move.line.x !== undefined ? [2 * move.line.x - x, y] : [x, 2 * move.line.y - y];
  const [cx, cy] = move.center;
  let [dx, dy] = [x - cx, y - cy];
  const quarters = (((move.turn / 90) % 4) + 4) % 4;
  for (let i = 0; i < quarters; i++) [dx, dy] = [-dy, dx];
  return [cx + dx, cy + dy];
}
/* every corner after the moves, one after another */
const applyAll = (pts, moves) => pts.map((p) => moves.reduce((point, move) => apply(point, move), p));
const samePoints = (a, b) => a.length === b.length && a.every(([x, y], i) => close(x, b[i][0]) && close(y, b[i][1]));
/* Is polygon b congruent to polygon a? Going around both from some corner, in either direction, every side and every angle
   matches. Sides are compared squared and angles by the dot and cross products of the sides at each corner (the cross
   product's size, so a mirror image still matches), so whole-number corners compare exactly. */
function congruent(a, b) {
  if (a.length !== b.length) return false;
  const count = a.length,
    shape = (pts) =>
      pts.map(([x, y], i) => {
        const [px, py] = pts[(i + count - 1) % count],
          [nx, ny] = pts[(i + 1) % count],
          [ux, uy, vx, vy] = [px - x, py - y, nx - x, ny - y];
        return [ux * ux + uy * uy, ux * vx + uy * vy, Math.abs(ux * vy - uy * vx)];
      }),
    first = shape(a);
  return [b, b.slice().reverse()].some((pts) => {
    const second = shape(pts);
    return first.some((_, shift) =>
      first.every((corner, i) => corner.every((v, k) => close(v, second[(i + shift) % count][k]))),
    );
  });
}
/* the shapes the game moves have no turn or mirror that fits them onto themselves: none of the seven other ways to turn or
   flip a square grid takes the shape onto itself, wherever it's slid */
function symmetric(pts) {
  const ways = [
      ([x, y]) => [-y, x],
      ([x, y]) => [-x, -y],
      ([x, y]) => [y, -x],
      ([x, y]) => [-x, y],
      ([x, y]) => [x, -y],
      ([x, y]) => [y, x],
      ([x, y]) => [-y, -x],
    ],
    /* the corners as a set, slid so the smallest x and y are 0 */
    key = (list) => {
      const minX = Math.min(...list.map((p) => p[0])),
        minY = Math.min(...list.map((p) => p[1]));
      return list
        .map(([x, y]) => `${x - minX},${y - minY}`)
        .sort()
        .join(" ");
    };
  return ways.some((way) => key(pts.map(way)) === key(pts));
}
/* a move as a coordinate rule, worked out here: (x, y) \to (x + 3, y - 2) */
function ruleOf(move) {
  const plus = (letter, by) => (by === 0 ? letter : `${letter} ${by > 0 ? "+" : "-"} ${Math.abs(by)}`);
  let image;
  if (move.kind === "translate") image = [plus("x", move.dx), plus("y", move.dy)];
  else if (move.kind === "reflect") image = move.line.x === 0 ? ["-x", "y"] : ["x", "-y"];
  else image = { 90: ["-y", "x"], [-90]: ["y", "-x"], 180: ["-x", "-y"] }[move.turn];
  return `(x, y) \\to (${image[0]}, ${image[1]})`;
}
/* what each kind of move is called */
const NAMES = { translate: "Translation", rotate: "Rotation", reflect: "Reflection" };
/* what a line becomes after each move in the No Stretching station */
const LINE_IMAGES = {
  halfOff: "A line parallel to ℓ",
  halfOn: "Line ℓ itself",
  quarter: "A line that crosses ℓ at a right angle",
  slideAcross: "A line parallel to ℓ",
  slideAlong: "Line ℓ itself",
};
/* whether shapes with the same measure must be congruent, worked out separately from stations.js */
const MUST_MATCH = {
  "two quadrilaterals that each have four sides 5 cm long": false,
  "two rectangles that each have an area of 12 square cm": false,
  "two rectangles that each have a perimeter of 20 cm": false,
  "two triangles that each have sides of 3, 4, and 5 cm": true,
  "two circles that each have a radius of 4 cm": true,
  "two squares that each have sides 6 cm long": true,
  "two rectangles that are each 3 cm by 8 cm": true,
  "two triangles that each have angles of 40°, 60°, and 80°": false,
};
/* the measure of transversalFig's angle i (see figs.js), worked out here from the rays around each crossing: going
   counterclockwise from pointing right, the parallel line goes right (0°), the crossing line up (deg), the parallel line left
   (180°), and the crossing line down (180° + deg); angle i % 4 is the gap between one ray and the next */
function transversalAngle(deg, i) {
  const rays = [0, deg, 180, 180 + deg, 360],
    spot = i % 4;
  return rays[spot + 1] - rays[spot];
}
/* the corner names the game uses */
const LETTERS = ["A", "B", "C", "D", "E", "F"];

module.exports = {
  signed: true,
  limits: {
    moves: { dp: 0, nz: 1, max: 1 },
    grid: { dp: 0, nz: 2, max: 180 },
    coords: { dp: 0, nz: 2, max: 180 },
    describe: { dp: 0, nz: 1, max: 1 },
    keep: { dp: 0, nz: 3, max: 180 },
    congruent: { dp: 0, nz: 2, max: 80 },
    parallel: { dp: 0, nz: 3, max: 180 },
    triangle: { dp: 0, nz: 3, max: 180 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    const onGrid = (pts, lo, hi) => {
      if (
        !pts.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y) && x >= lo && x <= hi && y >= lo && y <= hi)
      )
        bad.push(`corners off the grid: ${JSON.stringify(pts)}`);
    };
    // naming the move: the image is the original moved, the shape has no symmetry, and the answer names the move
    if (facts.t === "name") {
      if (!samePoints(applyAll(facts.orig, [facts.move]), facts.image)) bad.push("the image isn't the original moved");
      if (symmetric(facts.orig)) bad.push("a shape with a symmetry, so more than one move fits");
      if (answerLabel(p) !== NAMES[facts.move.kind]) bad.push(`the answer should be ${NAMES[facts.move.kind]}`);
      onGrid([...facts.orig, ...facts.image], 0, 11);
    }
    if (facts.t === "needs") {
      const want = { translate: "distance", rotate: "center", reflect: "line" }[facts.kind];
      if (!answerLabel(p).toLowerCase().includes(want)) bad.push(`a ${facts.kind} needs a ${want}`);
    }
    // grid moves: the tapped picture is the original moved, and no other picture is
    if (facts.t === "grid") {
      const want = applyAll(facts.orig, [facts.move]);
      if (symmetric(facts.orig)) bad.push("a shape with a symmetry");
      Object.entries(facts.panels).forEach(([id, pts]) => {
        if (samePoints(pts, want) !== (id === p.answer)) bad.push(`picture ${id} is the wrong way round`);
        if (samePoints(pts, facts.orig)) bad.push(`picture ${id} didn't move`);
        onGrid(pts, 0, 10);
      });
      onGrid(facts.orig, 0, 10);
    }
    // coordinate moves: the point lands where the moves take it (or, going back, started where they take it from)
    if (facts.t === "one" || facts.t === "two" || facts.t === "back") {
      if (!samePoints(applyAll(facts.orig, facts.moves), facts.image)) bad.push("the image isn't the original moved");
      const start = facts.orig[facts.corner],
        end = facts.image[facts.corner],
        want = facts.t === "back" ? start : applyAll([start], facts.moves)[0];
      if (facts.t === "back" && !samePoints(applyAll([start], facts.moves), [facts.from]))
        bad.push("the image corner is wrong");
      if (!samePoints([p.answer], [want])) bad.push(`answer ${p.answer}, but it works out to ${want}`);
      if (facts.t !== "back" && !samePoints([facts.from], [start])) bad.push("the corner in the prompt is wrong");
      if (facts.t === "back" && !samePoints([end], [facts.from])) bad.push("the image corner doesn't match");
      onGrid([...facts.orig, ...facts.image], -6, 6);
    }
    // describing a move: the answer's moves take the shape to its image, and no other choice's do
    if (["move", "rule", "twoMoves"].includes(facts.t)) {
      /* each choice's moves, found by its label: only the answer's land on the image */
      p.choices.forEach((choice) => {
        const option = facts.options.find(([label]) => label === choice.label);
        if (!option) return bad.push(`no moves for the choice ${choice.label}`);
        const moves = option[1],
          lands = samePoints(applyAll(facts.orig, moves), facts.image);
        if (lands !== (choice.id === p.answer))
          bad.push(`${choice.label} ${lands ? "also lands on the image" : "misses the image"}`);
        if (facts.rule && choice.label !== `\\(${ruleOf(moves[0])}\\)`)
          bad.push(`${choice.label} isn't the rule for its move`);
      });
      if (symmetric(facts.orig)) bad.push("a shape with a symmetry");
    }
    // what rigid moves keep
    if (facts.t === "side") wrongAnswer(facts.side);
    if (facts.t === "angle") {
      wrongAnswer(facts.askB ? facts.b : facts.a);
      if (facts.a + facts.b >= 180) bad.push("angles that don't make a triangle");
    }
    if (facts.t === "line" && answerLabel(p) !== LINE_IMAGES[facts.id])
      bad.push(`the image of the line is ${LINE_IMAGES[facts.id]}`);
    if (facts.t === "compose") {
      const want = facts.about === "long" ? "A rectangle" : "A parallelogram that isn’t a rectangle";
      if (answerLabel(p) !== want) bad.push(`the shape is ${want}`);
      if (facts.across === facts.up) bad.push("equal legs make a square");
    }
    if (facts.t === "area") wrongAnswer(2 * ((facts.across * facts.up) / 2));
    if (
      facts.t === "stays" &&
      !["The side lengths", "The angle measures", "The area", "The perimeter"].includes(answerLabel(p))
    )
      bad.push("the answer changes with the move");
    // congruence
    if (facts.t === "yesno") {
      const same = congruent(facts.orig, facts.other);
      if (answerLabel(p) !== (same ? "Yes" : "No"))
        bad.push(`congruent is ${same}, but the answer is ${answerLabel(p)}`);
      if (same !== (facts.how === "moved")) bad.push(`a ${facts.how} shape that is${same ? "" : "n't"} congruent`);
      onGrid([...facts.orig, ...facts.other], 0, 12);
    }
    if (facts.t === "match") {
      const want = facts.askAngle
        ? `Angle ${facts.second[facts.side]}`
        : `Side ${facts.second[facts.side]}${facts.second[(facts.side + 1) % facts.second.length]}`;
      if (answerLabel(p) !== want) bad.push(`the match is ${want}`);
      if (facts.first.join("") !== LETTERS.slice(0, facts.first.length).join(""))
        bad.push("the first polygon's corners");
    }
    if (facts.t === "length") wrongAnswer(facts.lengths[facts.side]);
    if (facts.t === "same") {
      const must = MUST_MATCH[facts.what];
      if (must === undefined) bad.push(`no rule for ${facts.what}`);
      else if (answerLabel(p) !== (must ? "Yes" : "No, not always")) bad.push(`"${facts.what}" must match: ${must}`);
    }
    // parallel lines: every angle from which way it opens
    if (facts.t === "find") {
      wrongAnswer(transversalAngle(facts.deg, facts.j));
      if (facts.deg % 5 || facts.deg < 35 || facts.deg > 145 || facts.deg === 90)
        bad.push(`a crossing at ${facts.deg}°`);
    }
    if (facts.t === "pairName") {
      const { i, j } = facts,
        sameCrossing = Math.floor(i / 4) === Math.floor(j / 4),
        want = sameCrossing
          ? "Vertical angles"
          : Math.abs(i - j) === 4
            ? "Corresponding angles"
            : "Alternate interior angles";
      if (answerLabel(p) !== want) bad.push(`angles ${i} and ${j} are ${want}`);
      if (!close(transversalAngle(facts.deg, i), transversalAngle(facts.deg, j))) bad.push("the pair isn't equal");
    }
    if (facts.t === "angleX") {
      const want = transversalAngle(facts.deg, facts.j),
        xValue = (want - facts.constant) / facts.coefficient;
      wrongAnswer(xValue);
      if (!Number.isInteger(xValue) || xValue <= 0) bad.push(`x is ${xValue}`);
    }
    // triangles: three angles that add to 180°, each a real angle, and the asked one
    if (facts.angles) {
      const [a, b, c] = facts.angles;
      if (!close(a + b + c, 180)) bad.push(`angles ${facts.angles} don't add to 180`);
      if (facts.angles.some((v) => v < 10)) bad.push(`an angle under 10°: ${facts.angles}`);
      if (facts.t === "third" || facts.t === "right") wrongAnswer(facts.angles[facts.ask]);
      if (facts.t === "right" && !facts.angles.includes(90)) bad.push("no right angle");
      if (facts.t === "isosceles") {
        if (a !== b) bad.push("the base angles aren't equal");
        if (!(close(p.answer, a) || close(p.answer, c))) bad.push("the answer isn't one of its angles");
      }
      if (facts.t === "parallel") wrongAnswer(facts.ask === "C" ? c : facts.ask === "left" ? a : b);
      if (facts.t === "triX") wrongAnswer(a);
    }
    return bad;
  },
};
