/* Skate Park Builders: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. check() works every angle, area,
   volume, and surface area out again from the measures each problem carries, tests every set of sides with the triangle
   rule, and checks each slice against its own table of cross sections. */
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* the label of the choice that's the answer, as plain text */
const answerLabel = (p) =>
  p.choices
    .find((c) => c.id === p.answer)
    .label.replace(/<[^>]*>/g, "")
    .trim();
/* two sides of a triangle must always add up to more than the third */
const makesTriangle = (a, b, c) => a + b > c && a + c > b && b + c > a;
/* the shape each slice makes, worked out separately from stations.js */
const SECTIONS = {
  "a cube|parallel to one face": "Square",
  "a box (rectangular prism)|parallel to its base": "Rectangle",
  "a triangular prism|parallel to its triangle bases": "Triangle",
  "a triangular prism|straight down, parallel to a side face": "Rectangle",
  "a square pyramid|parallel to its base": "Square",
  "a square pyramid|straight down through its top": "Triangle",
  "a hexagonal prism|parallel to its bases": "Hexagon",
  "a pentagonal pyramid|parallel to its base": "Pentagon",
  "a cylinder|parallel to its base": "Circle",
  "a cylinder|straight down through its middle": "Rectangle",
  "a cone|straight down through its tip": "Triangle",
  "a sphere|anywhere through it": "Circle",
};
module.exports = {
  limits: {
    angles: { dp: 0, nz: 3, max: 180 },
    equations: { dp: 0, nz: 3, max: 180 },
    triangles: { dp: 0, nz: 3, max: 180 },
    slices: { dp: 0, nz: 1, max: 1 },
    volume: { dp: 0, nz: 3, max: 600 },
    surface: { dp: 0, nz: 3, max: 600 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    // angle pairs
    if (facts.t === "comp") wrongAnswer(90 - facts.a);
    if (facts.t === "supp") wrongAnswer(180 - facts.a);
    if (facts.t === "vertical") wrongAnswer(facts.across ? facts.a : 180 - facts.a);
    if (facts.a !== undefined && ["comp", "supp", "vertical"].includes(facts.t) && (facts.a % 5 || facts.a <= 0))
      bad.push(`an angle of ${facts.a}`);
    // angle equations: solve again and check both angles are real angles
    if (facts.t === "pair") {
      const xv = (facts.total - facts.b - facts.d) / (facts.a + facts.c),
        first = facts.a * xv + facts.b,
        second = facts.c * xv + facts.d;
      if (!Number.isInteger(xv)) bad.push("x isn't whole");
      if (first < 15 || second < 15) bad.push(`angles of ${first} and ${second}`);
      wrongAnswer(facts.askAngle ? first : xv);
    }
    if (facts.t === "three") {
      const xv = (180 - facts.known) / (facts.a + facts.c);
      if (!Number.isInteger(xv)) bad.push("x isn't whole");
      wrongAnswer(xv);
    }
    // triangles: the answer is the set the question asks for, and every other set isn't
    if (facts.t === "which")
      facts.sets.forEach((set) => {
        const isAnswer = set.join(", ") === answerLabel(p);
        if ((makesTriangle(...set) === facts.findYes) !== isAnswer)
          bad.push(`${set.join(", ")} is the wrong way round`);
      });
    if (facts.t === "unique") {
      const want = { angles: "Many, all different sizes", sides: "Exactly one", none: "None" }[facts.kind];
      if (answerLabel(p) !== want) bad.push(`the answer isn't "${want}"`);
      if (facts.kind === "angles" && facts.angles.reduce((s, v) => s + v, 0) !== 180)
        bad.push("angles that don't make 180°");
      if (facts.kind === "sides" && !makesTriangle(...facts.sides)) bad.push("sides that don't make a triangle");
      if (facts.kind === "none" && makesTriangle(...facts.sides)) bad.push("sides that do make a triangle");
    }
    // slices
    if (facts.t === "slice") {
      const want = SECTIONS[`${facts.solid}|${facts.how}`];
      if (answerLabel(p) !== want) bad.push(`slicing ${facts.solid} ${facts.how} makes a ${want}`);
    }
    // volume: base area × height
    if (facts.t === "base") wrongAnswer(facts.area * facts.h);
    if (facts.t === "ramp") wrongAnswer(((facts.base[0] * facts.base[1]) / 2) * facts.length);
    if (facts.t === "lshape") {
      wrongAnswer((facts.w * facts.tall - facts.cutW * facts.cutH) * facts.h);
      if (facts.cutW >= facts.w || facts.cutH >= facts.tall) bad.push("a corner cut bigger than the base");
    }
    if (facts.t === "trapezoid") wrongAnswer((((facts.top + facts.bottom) * facts.tall) / 2) * facts.h);
    // surface area: the faces added up
    if (facts.t === "box") wrongAnswer(2 * (facts.l * facts.w + facts.l * facts.h + facts.w * facts.h));
    if (facts.t === "rampSA") {
      const [a, b, c] = facts.sides;
      if (a * a + b * b !== c * c) bad.push("not a right triangle");
      wrongAnswer(a * b + (a + b + c) * facts.length);
    }
    if (facts.t === "job" && answerLabel(p) !== (facts.need === "SA" ? "Surface area" : "Volume"))
      bad.push("the wrong measure");
    return bad;
  },
};
