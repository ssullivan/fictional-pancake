/* Food Truck Rally: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again
   from the facts each problem carries: the constant k, the table's rows, the graph's points, and which choice is right. */
const val = ([n, d]) => n / d;
const close = (a, b) => Math.abs(a - b) < 1e-9;
/* text without its tags, with a true minus sign and spaces made plain */
const plain = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
/* the label of the choice that's the answer */
const answerLabel = (p) => plain(p.choices.find((c) => c.id === p.answer).label);
/* a number as written in a label: 2.5, 2/3, or 12 */
const readNum = (text) => (text.includes("/") ? text.split("/")[0] / text.split("/")[1] : +text);
/* whether rows {x, y} are proportional: every y divided by its x is the same */
const proportional = (rows) => rows.every((r) => close(r.y * rows[0].x, rows[0].y * r.x));
/* the most a y may be in a story (360 miles in 6 hours) */
const MOST = 400;
module.exports = {
  limits: {
    // the constant going the other way can be a fraction like 1/60, typed as one
    table: { dp: 6, nz: 7, max: MOST },
    equation: { dp: 2, nz: 3, max: MOST },
    which: { dp: 2, nz: 2, max: 60 },
    graph: { dp: 2, nz: 3, max: MOST },
    compare: { dp: 6, nz: 7, max: 60 },
    four: { dp: 2, nz: 3, max: MOST },
  },
  // what's wrong with problem p (an empty list when nothing is), from the facts it carries
  check(p) {
    const bad = [],
      facts = p.facts || {};
    if (!facts.t) return ["no facts for checks.js"];
    const k = facts.k ? val(facts.k) : null;
    const wrongAnswer = (want) => {
      if (p.kind === "num" && !close(p.answer, want)) bad.push(`answer ${p.answer}, but it works out to ${want}`);
    };
    const wrongChoice = (want) => {
      if (answerLabel(p) !== want) bad.push(`the answer is "${answerLabel(p)}", not "${want}"`);
    };
    // tables: every row is y = kx, in increasing order, and the answer is worked out again
    if (facts.rows && k !== null) {
      facts.rows.forEach((r) => {
        if (!close(r.y, r.x * k)) bad.push(`row ${r.x}, ${r.y} isn't ${k} times`);
      });
      if (facts.rows.some((r, i) => i && r.x <= facts.rows[i - 1].x)) bad.push("rows out of order");
    }
    if (facts.t === "k") wrongAnswer(facts.rows ? facts.rows[0].y / facts.rows[0].x : facts.y / facts.x);
    if (facts.t === "fill") wrongAnswer(facts.askY ? facts.rows[2].x * k : facts.rows[2].y / k);
    if (facts.t === "flip") wrongAnswer(1 / k);
    if (["k", "flip"].includes(facts.t) && p.kind === "num" && !Number.isInteger(p.answer * 100) && !p.frac)
      bad.push("a fraction answer without the fraction keyboard");
    // equations, written as y = kx in the story's letters
    if (facts.vars) {
      const [xl, yl] = facts.vars,
        m = answerLabel(p).match(/^(\w) = ([\d./]+)(\w)$/);
      if (!m) bad.push(`the answer "${answerLabel(p)}" isn't an equation like y = kx`);
      else if (facts.t === "other") {
        if (m[1] !== xl || m[3] !== yl || !close(readNum(m[2]), 1 / k))
          bad.push(`"${answerLabel(p)}" doesn't give ${xl}`);
      } else if (m[1] !== yl || m[3] !== xl || !close(readNum(m[2]), k))
        bad.push(`"${answerLabel(p)}" isn't ${yl} = ${k}${xl}`);
      if (facts.y !== undefined && !close(facts.y, facts.x * k)) bad.push("the point isn't on the line");
    }
    if (facts.t === "use") {
      if (!close(facts.y, facts.x * k)) bad.push("x and y don't match k");
      wrongAnswer(facts.forward ? facts.x * k : facts.y / k);
    }
    // proportional or not: the rows, the story's rule, or the points decide, and the answer agrees
    if (facts.t === "table") {
      if (proportional(facts.rows) !== facts.proportional) bad.push("the table's rows don't match proportional");
      wrongChoice(facts.proportional ? "Proportional" : "Not proportional");
    }
    if (facts.t === "story") {
      if (facts.rule && close(facts.rule[1], 2 * facts.rule[0])) bad.push("a story that isn't proportional doubles");
      wrongChoice(facts.proportional ? "Proportional" : "Not proportional");
    }
    if (facts.t === "equation") {
      const m = answerLabel(p).match(/^y = (\d+)x$/);
      if (!m || +m[1] !== facts.constant) bad.push(`"${answerLabel(p)}" isn't y = ${facts.constant}x`);
    }
    if (facts.t === "isProp") {
      const onLine = facts.points.every((pt) => close(pt.y * facts.points[0].x, facts.points[0].y * pt.x));
      if (onLine !== facts.proportional) bad.push("the points don't match proportional");
      wrongChoice(facts.proportional ? "Proportional" : "Not proportional");
    }
    // graphs: a point and its meaning
    if (facts.t === "meaning") {
      if (!close(facts.py, facts.px * k)) bad.push("the point isn't on the line");
      const label = answerLabel(p);
      if (!label.startsWith(`${facts.px} `) || !label.includes(String(facts.py)))
        bad.push(`"${label}" isn't the point`);
    }
    if (facts.t === "read") {
      wrongAnswer(facts.x * k);
      if (facts.x * k > MOST) bad.push("off the graph");
    }
    // comparing trucks: the answer is the one that charges more (or less)
    if (facts.kA !== undefined) {
      const more = facts.kA > facts.kB ? facts.nameA : facts.nameB;
      const less = facts.kA > facts.kB ? facts.nameB : facts.nameA;
      if (facts.kA === facts.kB) bad.push("two trucks with the same price");
      wrongChoice(facts.askMore ? more : less);
    }
    // four representations: a point on the graph of y = kx
    if (facts.t === "point") {
      const m = answerLabel(p).match(/^\(([\d.]+), ([\d.]+)\)$/);
      if (!m || !close(+m[2], +m[1] * k)) bad.push(`"${answerLabel(p)}" isn't on y = ${k}x`);
    }
    return bad;
  },
};
