/* Shape Gallery: limits and checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits, max =
   largest value, for the answer and every number in the prompt. check() works every answer out again from the facts each
   problem carries. For shapes it measures the corners itself: which sides are parallel (their directions cross to 0), which
   corners are right angles (their sides' directions multiply to 0), and which folds are lines of symmetry (every corner lands
   on a corner), so a mistake in SHAPES is caught too. Picture choices are told apart by their corners. */
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
// figs.js and what it needs, loaded the way the page loads them
const ROOT = join(__dirname, "../..");
const ctx = vm.createContext({});
for (const file of ["shared/util.js", "shared/figures.js", "grade4/unit8/figs.js"])
  vm.runInContext(readFileSync(join(ROOT, file), "utf8"), ctx);
const { SHAPES, foldLine, isSymmetryLine } = vm.runInContext("({SHAPES, foldLine, isSymmetryLine})", ctx);
const LENGTHS = { dp: 0, nz: 2, max: 60 };
const plain = (html) =>
  String(html)
    .replace(/<svg[^]*?<\/svg>/g, "(picture)")
    .replace(/<[^>]*>/g, "");
// a side's direction from corner i to the next
const side = (pts, i) => {
  const [ax, ay] = pts[i],
    [bx, by] = pts[(i + 1) % pts.length];
  return [bx - ax, by - ay];
};
// how many pairs of sides are parallel: their directions' cross product is 0 (allowing for rounding)
const parallelPairs = (pts) => {
  let pairs = 0;
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const [ax, ay] = side(pts, i),
        [bx, by] = side(pts, j);
      if (Math.abs(ax * by - ay * bx) < 1e-6 * Math.hypot(ax, ay) * Math.hypot(bx, by)) pairs++;
    }
  return pairs;
};
// how many corners are right angles: the sides meeting there have a dot product of 0
const rightAngles = (pts) =>
  pts.filter((_, i) => {
    const [ax, ay] = side(pts, i),
      [bx, by] = side(pts, (i + pts.length - 1) % pts.length);
    return Math.abs(ax * bx + ay * by) < 1e-6 * Math.hypot(ax, ay) * Math.hypot(bx, by);
  }).length;
// which shape a picture is, by its polygon's corners
const shapeOf = (svg) => {
  const points = (String(svg).match(/class="shp" points="([^"]+)"/) || [])[1];
  return Object.keys(SHAPES).find((id) => SHAPES[id].pts.map(([x, y]) => `${x},${y}`).join(" ") === points);
};
// a picture's dashed line, [[x1, y1], [x2, y2]]
const dashedLine = (svg) => {
  const [, x1, y1, x2, y2] = String(svg)
    .match(/class="ssym" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/)
    .map(Number);
  return [
    [x1, y1],
    [x2, y2],
  ];
};
// side lengths, for telling triangles apart: equal when they're within 1%
const lengths = (pts) => pts.map((_, i) => Math.hypot(...side(pts, i)));
const sidesKind = (pts) => {
  const [a, b, c] = lengths(pts),
    same = (x, y) => Math.abs(x - y) < 0.01 * Math.max(x, y),
    equalPairs = [same(a, b), same(b, c), same(a, c)].filter(Boolean).length;
  return equalPairs === 3 ? "equilateral" : equalPairs ? "isosceles" : "scalene";
};
// the biggest angle: right when a corner's sides are perpendicular, obtuse when they point apart more than that
const anglesKind = (pts) => {
  const dots = pts.map((_, i) => {
    const [ax, ay] = side(pts, i),
      [bx, by] = side(pts, (i + pts.length - 1) % pts.length);
    return -(ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by));
  });
  return dots.some((d) => Math.abs(d) < 1e-6) ? "right" : dots.some((d) => d < 0) ? "obtuse" : "acute";
};
const symmetryLines = (id) =>
  SHAPES[id].sym.filter(([x1, y1, x2, y2]) => isSymmetryLine(SHAPES[id].pts, [x1, y1], [x2, y2])).length;
module.exports = {
  limits: { triangles: LENGTHS, quads: LENGTHS, symmetry: LENGTHS, lengths: LENGTHS, boss: LENGTHS },
  // what's wrong with problem p (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      labels = (p.choices || []).map((c) => c.label),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const want = (v, what) => {
      if (p.answer !== v) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`choice ${i} is wrongly ${fits(label) ? "" : "not "}${what}`);
      });
    switch (f.t) {
      case "sides":
        if (right.toLowerCase() !== sidesKind(SHAPES[f.id].pts)) bad.push(`${f.id} is not ${right}`);
        if (sidesKind(SHAPES[f.id].pts) !== SHAPES[f.id].sides)
          bad.push(`SHAPES says ${f.id} is ${SHAPES[f.id].sides}`);
        if (f.id === "equilateral" && labels.includes("Isosceles"))
          bad.push("an equilateral triangle is isosceles too");
        break;
      case "angles":
        if (right.toLowerCase() !== anglesKind(SHAPES[f.id].pts)) bad.push(`${f.id} is not ${right}`);
        break;
      case "pickTriangle":
        onlyRight((svg) => {
          const pts = SHAPES[shapeOf(svg)].pts,
            kind = sidesKind(pts);
          return (
            f.property === kind ||
            f.property === anglesKind(pts) ||
            (f.property === "isosceles" && kind === "equilateral")
          );
        }, f.property);
        break;
      case "parallel":
        want(parallelPairs(SHAPES[f.id].pts), `parallel pairs of ${f.id}`);
        break;
      case "rights":
        want(rightAngles(SHAPES[f.id].pts), `right angles of ${f.id}`);
        break;
      case "pickQuad":
        onlyRight((svg) => {
          const id = shapeOf(svg),
            pts = SHAPES[id].pts,
            l = lengths(pts);
          return {
            parallel2: parallelPairs(pts) === 2,
            parallel1: parallelPairs(pts) === 1,
            parallel0: parallelPairs(pts) === 0,
            rights4: rightAngles(pts) === 4,
            equal4: l.every((v) => Math.abs(v - l[0]) < 0.01 * l[0]),
          }[f.fact];
        }, f.fact);
        break;
      case "count":
        want(symmetryLines(f.id), `lines of symmetry of ${f.id}`);
        if (symmetryLines(f.id) !== SHAPES[f.id].sym.length)
          bad.push(`a line in SHAPES.${f.id}.sym isn't a line of symmetry`);
        break;
      case "isLine": {
        const [a, b] = foldLine(SHAPES[f.id].pts, f.way);
        if ((right === "Yes") !== isSymmetryLine(SHAPES[f.id].pts, a, b))
          bad.push(`${f.way} fold of ${f.id} is not ${right}`);
        break;
      }
      case "pickLine":
        onlyRight((svg) => isSymmetryLine(SHAPES[f.id].pts, ...dashedLine(svg)), "a line of symmetry");
        break;
      case "perimeter":
        want(f.count * f.side, "perimeter");
        break;
      case "side":
        want(f.perimeter / f.count, "side");
        break;
      case "rectangle":
        want(f.perimeter / 2 - f.len, "rectangle width");
        if (p.answer >= f.len) bad.push("wider than long");
        break;
      case "lShape": {
        // top + inner across = bottom, and inner up-down + right = left
        const [top, innerUp, innerAcross, rightSide, bottom, left] = f.sides;
        if (top + innerAcross !== bottom || innerUp + rightSide !== left) bad.push("the L-shape's sides don't fit");
        want(f.sides[f.ask], "L-shape side");
        break;
      }
      default:
        bad.push("no facts for checks.js");
    }
    // every sum, difference, product, and quotient it states is true
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1])].map(plain).join(" ");
    for (const [text, a, op, b, c] of told.matchAll(/(?<![\d+−×÷] ?)\b(\d+) ([+−×÷]) (\d+) = (\d+)\b(?! [+−×÷])/g)) {
      const result = op === "+" ? +a + +b : op === "−" ? a - b : op === "×" ? a * b : a / b;
      if (result !== +c) bad.push(`says ${text}`);
    }
    return bad;
  },
};
