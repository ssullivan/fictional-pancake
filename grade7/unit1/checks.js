/* Model Makers: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries, and holds maps, plans, and models to realistic sizes. */
/* the most grid squares a shape may be across or down, the longest real road (km), and the longest drawing (cm) */
const WIDEST = 12,
  LONGEST_ROAD = 600,
  LONGEST_DRAWING = 30;
const val = ([n, d]) => n / d;
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* twice the area inside the corners (the shoelace sum), and the area */
const areaOf = (pts) =>
  Math.abs(
    pts.reduce((sum, [x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      return sum + (x1 * y2 - x2 * y1);
    }, 0),
  ) / 2;
/* each side's length, slanted or not */
const sides = (pts) =>
  pts.map(([x1, y1], i) => Math.hypot(pts[(i + 1) % pts.length][0] - x1, pts[(i + 1) % pts.length][1] - y1));
/* whether b's sides are all the same multiple of a's, going around from the same corner (a copy that isn't turned) */
const scaledInPlace = (a, b) => {
  const sa = sides(a),
    sb = sides(b);
  return sa.every((len, i) => close(sb[i] * sa[0], len * sb[0]));
};
/* how wide and tall the corners spread */
const spread = (pts, k) => Math.max(...pts.map((p) => p[k])) - Math.min(...pts.map((p) => p[k]));
/* realistic sizes for the things on floor plans and models (m) */
const REAL_SIZES = {
  "a classroom": [6, 15],
  "a basketball court": [20, 30],
  "a swimming pool": [10, 50],
  "a garden": [3, 20],
  "a model car": [3, 6],
  "a model train engine": [10, 25],
  "a model sailboat": [5, 20],
  "a model airplane": [20, 80],
  "a dollhouse": [6, 15],
  "a model bridge": [100, 2000],
  "a model of a whale": [10, 30],
};
module.exports = {
  limits: {
    copies: { dp: 0, nz: 2, max: 12 },
    factor: { dp: 1, nz: 2, max: 12 },
    // a scale factor going back can be a fraction like 1/3, typed as one
    missing: { dp: 6, nz: 7, max: 180 },
    area: { dp: 2, nz: 3, max: 400 },
    map: { dp: 1, nz: 3, max: 600 },
    rescale: { dp: 1, nz: 3, max: 300 },
    ratio: { dp: 1, nz: 3, max: 100000 },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {},
      answer = p.kind === "num" ? p.answer : null;
    if (!facts.t) return ["no facts for checks.js"];
    const wrongAnswer = (want) => {
      if (answer !== null && !close(answer, want)) bad.push(`answer ${answer}, but it works out to ${want}`);
    };
    // shapes stay on the grid and small enough to draw
    for (const pts of [facts.pts, ...(facts.copies || [])].filter(Boolean)) {
      if (!pts.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y))) bad.push("a corner off the grid");
      if (spread(pts, 0) > WIDEST || spread(pts, 1) > WIDEST) bad.push("a shape too big to draw");
    }
    // exactly the copy that's the answer is a scaled copy
    if (facts.copies) {
      facts.copies.forEach((c, i) => {
        const scaled = scaledInPlace(facts.pts, c);
        if (scaled !== (i === facts.ok)) bad.push(`copy ${i} ${scaled ? "is" : "isn't"} a scaled copy`);
      });
      if (facts.t === "which" && p.choices.find((c) => c.id === p.answer).label !== `Copy ${"ABC"[facts.ok]}`)
        bad.push("the answer isn't the scaled copy");
      if (facts.t === "yesno" && /^Yes/.test(p.choices.find((c) => c.id === p.answer).label) !== (facts.ok === 0))
        bad.push("yes or no is the wrong way round");
    }
    // the side that's the answer matches the asked side, and is the scale factor times as long
    if (facts.t === "match") {
      const letters = "PQRSTUVW",
        want = `Side ${letters[facts.side]}${letters[(facts.side + 1) % facts.count]}`;
      if (p.choices.find((c) => c.id === p.answer).label !== want) bad.push(`the answer isn't ${want}`);
      if (!close(sides(facts.copy)[facts.side], sides(facts.orig)[facts.side] * val(facts.f)))
        bad.push("the matching sides aren't in the scale factor");
    }
    // the numbers work out again
    if (facts.t === "factor" && facts.a) wrongAnswer(facts.b / facts.a);
    if (facts.t === "factor" && facts.a && !close(facts.a * val(facts.f), facts.b)) bad.push("the sides don't match f");
    if (facts.t === "side") wrongAnswer((facts.c * facts.b) / facts.a);
    if (facts.t === "back") wrongAnswer(facts.copy / val(facts.f));
    if (facts.t === "angle") {
      wrongAnswer(facts.orig);
      if (![45, 90, 135].includes(facts.orig)) bad.push(`an angle of ${facts.orig}°`);
    }
    if (facts.t === "reverse") {
      wrongAnswer(1 / val(facts.f));
      if (!p.frac) bad.push("a fraction answer without the fraction keyboard");
    }
    // lengths in copies are whole or half units
    if (["side", "back"].includes(facts.t) && !Number.isInteger(answer * 2)) bad.push(`a side of ${answer}`);
    if (facts.t === "size") {
      const want = val(facts.f) > 1 ? "Bigger" : val(facts.f) < 1 ? "Smaller" : "The same";
      if (!p.choices.find((c) => c.id === p.answer).label.startsWith(want)) bad.push("bigger or smaller is wrong");
    }
    if (facts.t === "copy") {
      wrongAnswer(areaOf(facts.pts) * val(facts.f) ** 2);
      if (!close(areaOf(facts.pts), facts.area)) bad.push("the area in the prompt is wrong");
    }
    if (facts.t === "times") wrongAnswer(facts.k * facts.k);
    if (facts.t === "factor" && facts.big) wrongAnswer(Math.sqrt(facts.big / facts.area));
    // maps: the legs add up, the real distances are realistic, and the answer is the scale times the map length
    if (
      facts.legs &&
      !close(
        facts.legs.reduce((s, l) => s + l, 0),
        facts.map,
      )
    )
      bad.push("the legs don't add up");
    if (["toReal", "total"].includes(facts.t)) wrongAnswer(facts.map * facts.each);
    if (facts.t === "toMap") wrongAnswer(facts.real / facts.each);
    if (facts.t === "speed") {
      wrongAnswer((facts.map * facts.each) / facts.hours);
      if (facts.answer < 30 || facts.answer > 90) bad.push(`driving ${facts.answer} km per hour`);
    }
    if (["toReal", "total", "toMap", "speed"].includes(facts.t)) {
      if (facts.map * facts.each > LONGEST_ROAD) bad.push(`a road ${facts.map * facts.each} km long`);
      if (facts.map > LONGEST_DRAWING / 2) bad.push(`${facts.map} cm on a map`);
      if (!Number.isInteger(facts.map * 2)) bad.push(`${facts.map} cm isn't a half centimeter`);
    }
    if (facts.t === "plan") {
      wrongAnswer(facts.toReal ? facts.map * facts.each : facts.real / facts.each);
      if (!close(facts.map * facts.each, facts.real)) bad.push("the plan doesn't match its scale");
      const [lo, hi] = REAL_SIZES[facts.what];
      if (facts.real < lo || facts.real > hi) bad.push(`${facts.what} ${facts.real} m long`);
    }
    // a new scale: the real length is the same on both drawings
    if (facts.t === "redraw") {
      if (!close(facts.before * facts.from, facts.real)) bad.push("the first drawing doesn't match its scale");
      wrongAnswer(facts.real / facts.to);
      if (facts.answer > LONGEST_DRAWING || facts.before > LONGEST_DRAWING) bad.push("a drawing too long for paper");
    }
    if (facts.t === "howLong") wrongAnswer(facts.big / facts.small);
    if (facts.t === "largest") {
      const want = facts.largest ? Math.min(...facts.scales) : Math.max(...facts.scales);
      if (p.choices.find((c) => c.id === p.answer).label !== `1 cm to ${want} m`)
        bad.push("the wrong scale is the answer");
    }
    // scales without units: the conversion is right, and models are realistic sizes
    if (facts.t === "write" || facts.t === "same") {
      const toBase = { mm: 0.1, cm: 1, m: 100, km: 100000, in: 1, ft: 12, yd: 36 };
      const [drawAmt, drawUnit] = facts.drawn.split(" "),
        [realAmt, realUnit] = facts.real.split(" ");
      if (!close((realAmt * toBase[realUnit]) / (drawAmt * toBase[drawUnit]), facts.ratio))
        bad.push("the scale is wrong");
      if (facts.t === "write") wrongAnswer(facts.ratio);
      // only the answer is the same scale: each choice is read back to 1 to its ratio
      if (facts.t === "same")
        p.choices.forEach((c) => {
          const [, a, u1, b, u2] = c.label.match(/^([\d.]+) (\w+) to ([\d,.]+) (\w+)$/),
            same = close((+b.replace(/,/g, "") * toBase[u2]) / (+a * toBase[u1]), facts.ratio);
          if (same !== (c.id === p.answer)) bad.push(`${c.label} ${same ? "is" : "isn't"} 1 to ${facts.ratio}`);
        });
    }
    if (facts.t === "model") wrongAnswer(facts.real / facts.ratio);
    if (facts.t === "real") wrongAnswer(facts.inMeters ? (facts.size * facts.ratio) / 100 : facts.size * facts.ratio);
    if (facts.t === "model" || facts.t === "real") {
      const [lo, hi] = REAL_SIZES[facts.what];
      if (facts.real / 100 < lo || facts.real / 100 > hi) bad.push(`${facts.what} ${facts.real / 100} m long`);
      if (facts.size < 5 || facts.size > 100 || !Number.isInteger(facts.size))
        bad.push(`a model ${facts.size} cm long`);
    }
    return bad;
  },
};
