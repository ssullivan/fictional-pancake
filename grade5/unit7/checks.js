/* Map Makers: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   points each problem carries, on its own (not with figs.js): every shape is on the grid, its parallel sides, right angles,
   side lengths, and names are found again, and every equation the game states is checked. */
const plain = (html) => String(html).replace(/<[^>]*>/g, " ");
const text = ([x, y]) => `(${x}, ${y})`;
// the sides of a polygon as vectors, and their lengths squared
const sides = (pts) => pts.map(([x, y], i) => [pts[(i + 1) % pts.length][0] - x, pts[(i + 1) % pts.length][1] - y]);
const sq = ([dx, dy]) => dx * dx + dy * dy;
// a quadrilateral's names: parallel opposite sides have a zero cross product, right angles a zero dot product
function names(pts) {
  const s = sides(pts),
    cross = ([a, b], [c, d]) => a * d - b * c,
    dot = ([a, b], [c, d]) => a * c + b * d,
    pairs = (cross(s[0], s[2]) === 0) + (cross(s[1], s[3]) === 0),
    rights = s.filter((side, i) => dot(s[(i + 3) % 4], side) === 0).length,
    equal = s.every((side) => sq(side) === sq(s[0]));
  const list = ["quadrilateral"];
  if (pairs >= 1) list.push("trapezoid");
  if (pairs === 2) list.push("parallelogram");
  if (rights === 4) list.push("rectangle");
  if (equal) list.push("rhombus");
  if (rights === 4 && equal) list.push("square");
  return { list, pairs, rights };
}
// a triangle's kind by its sides and by its biggest angle
function kind(pts) {
  const [a, b, c] = sides(pts)
    .map(sq)
    .sort((x, y) => x - y);
  return {
    sides: a === c ? "equilateral" : a === b || b === c ? "isosceles" : "scalene",
    angles: c === a + b ? "right" : c > a + b ? "obtuse" : "acute",
  };
}
// the expressions in a chain like "8 − 3 = 5" are all equal (a chain after an operator or "?" is skipped)
function wrongEquations(said) {
  const bad = [];
  for (const [chain] of said.matchAll(/(?<![×+−÷?\d]\s*)[\d(][\d\s()×+−÷]*(?:=\s*[\d(][\d\s()×+−÷]*)+/g)) {
    const values = chain.split("=").map((side) => {
      const js = side.trim().replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      if (!/^[\d\s()+\-*/]+$/.test(js) || /\d\s+\d/.test(js)) return NaN;
      try {
        return Function(`return (${js})`)();
      } catch {
        return NaN;
      }
    });
    if (values.some((v) => !Number.isFinite(v) || v !== values[0])) bad.push(`says ${chain.trim()}`);
  }
  return bad;
}
const LIMIT = { dp: 0, nz: 3, max: 100 };
// statements about quadrilaterals: which names always include which (a square is a rectangle, a rhombus, …)
const ALWAYS = {
  square: ["rectangle", "rhombus", "parallelogram", "trapezoid"],
  rectangle: ["parallelogram", "trapezoid"],
  rhombus: ["parallelogram", "trapezoid"],
  parallelogram: ["trapezoid"],
  trapezoid: [],
};
module.exports = {
  limits: { plot: LIMIT, quads: LIMIT, triangles: LIMIT, patterns: LIMIT, rect: LIMIT },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label).trim()),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const want = (v, what) => {
      if (p.answer !== v) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const rightIs = (label, what) => {
      if (right !== label) bad.push(`${right} is not ${what} (${label})`);
    };
    // every point is on the grid, 0 to 10 across and 0 to 8 up
    const onGrid = (pts) =>
      pts.forEach(([x, y]) => {
        if (x < 0 || x > 10 || y < 0 || y > 8 || !Number.isInteger(x) || !Number.isInteger(y))
          bad.push(`${text([x, y])} is off the grid`);
      });
    switch (f.t) {
      case "tapPoint": {
        onGrid(f.points.map((q) => [q.x, q.y]));
        const tapped = f.points.find((q) => q.id === p.answer);
        if (!tapped || tapped.x !== f.x || tapped.y !== f.y) bad.push(`point ${p.answer} isn't ${text([f.x, f.y])}`);
        if (!prompt.includes(text([f.x, f.y]))) bad.push("the prompt doesn't show the point");
        break;
      }
      case "coords":
        onGrid([[f.x, f.y]]);
        rightIs(text([f.x, f.y]), "the point's coordinates");
        break;
      case "distance": {
        onGrid([f.first, f.second]);
        if (f.first[0] !== f.second[0] && f.first[1] !== f.second[1]) bad.push("not on one grid line");
        want(Math.abs(f.first[0] - f.second[0]) + Math.abs(f.first[1] - f.second[1]), "distance");
        break;
      }
      case "statement": {
        const [, small, big] = right.match(/Every (\w+) is an? (\w+)/);
        if (!ALWAYS[small].includes(big)) bad.push(`${right} isn't always true`);
        labels
          .filter((label) => label !== right)
          .forEach((label) => {
            const [, s2, b2] = label.match(/Every (\w+) is an? (\w+)/);
            if (ALWAYS[s2].includes(b2)) bad.push(`${label} is true too`);
          });
        break;
      }
      case "best": {
        onGrid(f.pts);
        const { list } = names(f.pts);
        rightIs(list[list.length - 1], "the most specific name");
        break;
      }
      case "fits": {
        onGrid(f.pts);
        const { list } = names(f.pts);
        labels.forEach((label, i) => {
          if (list.includes(label) !== (p.choices[i].id === p.answer))
            bad.push(`${label} ${list.includes(label) ? "fits" : "doesn't fit"}`);
        });
        break;
      }
      case "rights":
      case "parallel": {
        onGrid(f.pts);
        const { rights, pairs } = names(f.pts);
        want(f.t === "rights" ? rights : pairs, f.t);
        break;
      }
      case "triAngles":
        onGrid(f.pts);
        rightIs(kind(f.pts).angles, "the triangle's angles");
        break;
      case "triName": {
        onGrid(f.pts);
        const k = kind(f.pts);
        if (k.sides === "equilateral") bad.push("an equilateral triangle on a grid");
        rightIs(`${k.angles} ${k.sides} triangle`, "the triangle's name");
        break;
      }
      case "triWords": {
        const known = f.lengths.filter((v) => v !== null);
        if (f.lengths[2] !== null) {
          const [a, b, c] = [...f.lengths].sort((x, y) => x - y);
          if (a + b <= c) bad.push("the sides don't make a triangle");
          const angles = c * c === a * a + b * b ? "right" : c * c > a * a + b * b ? "obtuse" : "acute";
          if (angles !== f.angles) bad.push(`sides ${f.lengths} make an ${angles} triangle`);
        }
        const sidesKind =
          new Set(known).size === 1 && known.length === 3
            ? "equilateral"
            : new Set(known).size < known.length
              ? "isosceles"
              : "scalene";
        if (sidesKind !== f.sides) bad.push(`sides ${f.lengths} are ${sidesKind}`);
        rightIs(
          f.sides === "equilateral" ? "equilateral triangle" : `${f.angles} ${f.sides} triangle`,
          "the triangle's name",
        );
        break;
      }
      case "nth":
        want((f.n - 1) * f.b, "nth number");
        break;
      case "relation":
        rightIs(`Each Rule B number is ${f.b / f.a} times the Rule A number`, "the relationship");
        break;
      case "nextPair":
        rightIs(text([4 * f.a, 4 * f.b]), "the next pair");
        break;
      case "corner": {
        const all = [...f.given, f.right],
          xs = new Set(all.map(([x]) => x)),
          ys = new Set(all.map(([, y]) => y));
        onGrid(all);
        if (xs.size !== 2 || ys.size !== 2 || new Set(all.map(text)).size !== 4)
          bad.push("the corners don't make a rectangle");
        rightIs(text(f.right), "the fourth corner");
        break;
      }
      case "perimeter":
      case "area": {
        onGrid(f.corners);
        const w = Math.abs(f.corners[1][0] - f.corners[0][0]),
          h = Math.abs(f.corners[2][1] - f.corners[1][1]);
        want(f.t === "area" ? w * h : 2 * (w + h), f.t);
        break;
      }
      default:
        bad.push("no facts for checks.js");
    }
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1]), ...Object.values(p.why || {})]
      .map(plain)
      .join(" | ");
    bad.push(...wrongEquations(told));
    return bad;
  },
};
