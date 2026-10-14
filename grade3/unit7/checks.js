/* Playground Planners: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Side lengths are whole numbers, and
   areas stay under 100. The shapes' facts (right angles, equal sides, perimeters) are worked out again here from their corners,
   with this file's own geometry, not figs.js's. */
const LIMITS = { dp: 0, nz: 2, max: 100 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of an expression with +, −, ×, and ÷, where × and ÷ go first, left to right: "3 × 4 − 5" is 7
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    // a term's ×s and ÷s, left to right
    product = (term) => {
      const parts = term.split(/ ([×÷]) /);
      let value = +parts[0];
      for (let i = 1; i < parts.length; i += 2)
        value = parts[i] === "×" ? value * +parts[i + 1] : value / +parts[i + 1];
      return value;
    };
  let value = product(terms[0]);
  for (let i = 1; i < terms.length; i += 2) value += (terms[i] === "+" ? 1 : -1) * product(terms[i + 1]);
  return value;
}

// ---------- shapes, from their corners ----------
// each side's length, to the nearest thousandth
const sides = (pts) =>
  pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    return Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) * 1000) / 1000;
  });
const equalSides = (pts) => sides(pts).every((len) => len === sides(pts)[0]);
// twice the signed area: its sign says which way the corners go round
const signedArea = (pts) =>
  pts.reduce((sum, p, i) => sum + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0);
// how many corners are right angles: the sides there are perpendicular, and the corner points out (turns the way the shape goes)
const rightAngles = (pts) =>
  pts.filter((p, i) => {
    const before = pts[(i + pts.length - 1) % pts.length],
      after = pts[(i + 1) % pts.length],
      [ax, ay] = [before[0] - p[0], before[1] - p[1]],
      [bx, by] = [after[0] - p[0], after[1] - p[1]],
      turn = (p[0] - before[0]) * (after[1] - p[1]) - (p[1] - before[1]) * (after[0] - p[0]);
    return Math.abs(ax * bx + ay * by) < 1e-9 && turn * signedArea(pts) > 0;
  }).length;
// what kind of quadrilateral it is
const kindOf = (pts) => {
  const equal = equalSides(pts),
    rect = rightAngles(pts) === 4;
  return pts.length !== 4 ? "not" : equal && rect ? "square" : equal ? "rhombus" : rect ? "rectangle" : "other";
};
// is a quadrilateral a (kind)? A square is a rhombus and a rectangle too
const isA = (pts, kind) =>
  kind === "other" ? kindOf(pts) === "other" : kindOf(pts) === kind || (kindOf(pts) === "square" && kind !== "square");

// ---------- shapes of unit squares ----------
// the perimeter: every side of a square that no other square in the shape shares
const gridPerimeter = (cells) => {
  const has = (c, r) => cells.some(([x, y]) => x === c && y === r);
  return cells.reduce(
    (sum, [c, r]) => sum + [has(c, r - 1), has(c + 1, r), has(c, r + 1), has(c - 1, r)].filter((x) => !x).length,
    0,
  );
};
// are the squares all joined side to side?
const joined = (cells) => {
  const seen = new Set(["0"]),
    queue = [0];
  while (queue.length) {
    const [c, r] = cells[queue.shift()];
    cells.forEach(([x, y], j) => {
      if (!seen.has(String(j)) && Math.abs(x - c) + Math.abs(y - r) === 1) {
        seen.add(String(j));
        queue.push(j);
      }
    });
  }
  return seen.size === cells.length;
};

// statements about quadrilaterals, and whether they're true
const TRUE_FALSE = {
  "Every square is a rectangle.": true,
  "Every square is a rhombus.": true,
  "Every rectangle is a square.": false,
  "Every rhombus is a square.": false,
  "Every rhombus is a quadrilateral.": true,
  "Every quadrilateral is a rectangle.": false,
  "A rectangle always has 4 right angles.": true,
  "A rhombus always has 4 right angles.": false,
  "All 4 sides of a rhombus are the same length.": true,
  "All 4 sides of a rectangle are always the same length.": false,
};
// situations, and what they need
const NEEDS = {
  fence: "Perimeter",
  carpet: "Area",
  ribbon: "Perimeter",
  paints: "Area",
  border: "Perimeter",
  grass: "Area",
  walks: "Perimeter",
  paper: "Area",
  tiles: "Area",
  lights: "Perimeter",
};

module.exports = {
  limits: {
    shapes: LIMITS,
    quads: LIMITS,
    grid: LIMITS,
    fence: LIMITS,
    sandbox: LIMITS,
    design: LIMITS,
    boss: LIMITS,
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      labels = (p.choices || []).map((c) => plain(c.label)),
      fig = p.fig ? p.fig(false) : "",
      shown = p.fig ? p.fig(true) : "";
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and the right choice
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      right,
    ]
      .map(plain)
      .join(" ");
    // every equation it states is true
    for (const [text, left, total] of told.matchAll(/(?<![\d+−×÷] )\b(\d+(?: [+−×÷] \d+)+) = (\d+)\b(?! [+−×÷])/g))
      if (evaluate(left) !== +total) bad.push(`${text} is wrong`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    // tap answers: exactly the right shape fits, and the picture has a shape to tap for each one
    const onlyTap = (count, fits, what) => {
      for (let i = 0; i < count; i++) {
        if (fits(i) !== (String(i) === p.answer)) bad.push(`shape ${i + 1} ${fits(i) ? "is" : "is not"} ${what}`);
        if (!fig.includes(`data-id="${i}"`)) bad.push(`shape ${i + 1} can't be tapped`);
      }
    };
    // how many polygons and other shapes the picture draws
    const drawn = (fig.match(/<polygon class="shp/g) || []).length + (fig.match(/<path class="shp/g) || []).length;

    if (facts.t === "rights") {
      if (p.answer !== rightAngles(facts.pts) || !(p.answer > 0))
        bad.push(`it has ${rightAngles(facts.pts)} right angles`);
      if (fig.includes('class="sqc"')) bad.push("the picture gives the right angles away");
      if ((shown.match(/class="sqc"/g) || []).length !== p.answer) bad.push("the hint doesn't mark the right angles");
    }
    if (facts.t === "tapRights") {
      const { shapes, ask } = facts,
        fits = (i) =>
          ask === "triangle"
            ? shapes[i].length === 3 && rightAngles(shapes[i]) > 0
            : shapes[i].length === 4 && rightAngles(shapes[i]) === (ask === "none" ? 0 : 2);
      onlyTap(3, fits, `the ${ask} shape`);
      if (drawn !== 3) bad.push("the picture isn't 3 shapes");
    }
    if (facts.t === "tapQuad") {
      const isQuad = (item) => Array.isArray(item) && item.length === 4;
      onlyTap(3, (i) => isQuad(facts.items[i]) === facts.findQuad, facts.findQuad ? "a quadrilateral" : "not one");
      if (drawn !== 3) bad.push("the picture isn't 3 shapes");
    }
    if (facts.t === "tapEqual") {
      onlyTap(3, (i) => equalSides(facts.shapes[i]), "equal-sided");
      // every side's length is written on it
      facts.shapes.forEach((pts) =>
        sides(pts).forEach((len) => {
          if (!fig.includes(`>${len}<`)) bad.push(`a side of ${len} isn't written`);
        }),
      );
    }
    if (facts.t === "common") {
      const STATEMENTS = {
        "They all have a right angle.": (pts) => rightAngles(pts) > 0,
        "They all have 4 sides.": (pts) => pts.length === 4,
        "All their sides are the same length.": equalSides,
      };
      onlyRight((label) => facts.shapes.every((pts) => STATEMENTS[label](pts)), "true of all three");
      if (right !== facts.says) bad.push("the answer isn't the statement");
    }
    if (facts.t === "quadKind") {
      const CHOICE = {
        "A rhombus, not a rectangle": "rhombus",
        "A rectangle, not a rhombus": "rectangle",
        "Both: it’s a square": "square",
        Neither: "other",
      };
      onlyRight((label) => CHOICE[label] === kindOf(facts.pts), `what the shape is (${kindOf(facts.pts)})`);
      if ((fig.match(/class="sqc"/g) || []).length !== rightAngles(facts.pts))
        bad.push("the right angles aren't marked");
    }
    if (facts.t === "tapKind") {
      onlyTap(3, (i) => isA(facts.shapes[i], facts.target), `a ${facts.target}`);
      if (facts.shapes.some((pts) => pts.length !== 4)) bad.push("a shape isn't a quadrilateral");
    }
    if (facts.t === "trueFalse") {
      const truth = TRUE_FALSE[facts.statement];
      if (truth === undefined) bad.push(`no truth for ${facts.statement}`);
      onlyRight((label) => label === (truth ? "True" : "False"), "right");
    }
    if (facts.t === "whyNot") {
      const { pts, notA } = facts,
        // each reason, and whether it's why the shape isn't a notA
        REASON = {
          "It doesn’t have 4 right angles.": rightAngles(pts) !== 4,
          "Its sides aren’t all the same length.": notA === "square" && !equalSides(pts),
          "It doesn’t have 4 sides.": pts.length !== 4,
        };
      if (isA(pts, notA)) bad.push(`it is a ${notA}`);
      onlyRight((label) => REASON[label], `why it isn't a ${notA}`);
    }
    if (facts.t === "gridPerimeter") {
      if (p.answer !== gridPerimeter(facts.cells)) bad.push(`the perimeter is ${gridPerimeter(facts.cells)}`);
      if (!joined(facts.cells)) bad.push("the squares aren't joined");
      if ((fig.match(/class="gcell"/g) || []).length !== facts.cells.length) bad.push("the picture isn't the shape");
      if ((shown.match(/class="gwalk"/g) || []).length !== p.answer)
        bad.push("the hint doesn't count every unit length");
    }
    if (facts.t === "tapPerimeter") {
      onlyTap(3, (i) => gridPerimeter(facts.shapes[i]) === facts.perimeter, `a perimeter of ${facts.perimeter}`);
      if (!prompt.includes(`perimeter of ${facts.perimeter} units`)) bad.push("the prompt isn't the perimeter");
      if (facts.shapes.some((cells) => !joined(cells))) bad.push("a shape's squares aren't joined");
    }
    if (facts.t === "compareGrid") {
      const [a, b] = facts.shapes,
        [same, other] =
          facts.same === "area"
            ? [
                [a.length, b.length],
                [gridPerimeter(a), gridPerimeter(b)],
              ]
            : [
                [gridPerimeter(a), gridPerimeter(b)],
                [a.length, b.length],
              ];
      if (same[0] !== same[1]) bad.push(`the shapes don't have the same ${facts.same}`);
      const answer = other[0] > other[1] ? "Shape A" : other[0] < other[1] ? "Shape B" : "same";
      onlyRight((label) => (answer === "same" ? label.endsWith("the same") : label === answer), "the answer");
      if ((fig.match(/class="gcell"/g) || []).length !== a.length + b.length) bad.push("the picture isn't the shapes");
    }
    if (facts.t === "addSides") {
      const total = facts.lengths.reduce((sum, len) => sum + len, 0),
        // the drawing's sides, scaled up to the lengths written on them
        times = facts.lengths[0] / sides(facts.pts)[0];
      if (p.answer !== total) bad.push(`the perimeter is ${total}`);
      if (sides(facts.pts).some((len, i) => Math.abs(len * times - facts.lengths[i]) > 1e-6))
        bad.push("the lengths aren't to scale");
      facts.lengths.forEach((len) => {
        if (!fig.includes(`>${len}<`)) bad.push(`a side of ${len} isn't written`);
      });
    }
    if (facts.t === "rectPerimeter") {
      const { length, width, square } = facts;
      if (p.answer !== 2 * (length + width)) bad.push(`the perimeter is ${2 * (length + width)}`);
      if (square && length !== width) bad.push("the square's sides aren't the same");
      if (!square && length === width) bad.push("the rectangle is a square");
      // the side lengths written on the picture: a square's one number, or a rectangle's with their units
      if (!new RegExp(`>${length}[ <]`).test(fig)) bad.push("the picture isn't the length");
      if (!square && !new RegExp(`>${width}[ <]`).test(fig)) bad.push("the picture isn't the width");
    }
    if (facts.t === "missingSide") {
      const { lengths, ask, perimeter } = facts;
      if (perimeter !== lengths.reduce((sum, len) => sum + len, 0)) bad.push("the perimeter isn't the sides");
      if (p.answer !== lengths[ask]) bad.push(`the side is ${lengths[ask]}`);
      if ((fig.match(/>\?</g) || []).length !== 1) bad.push("one side should be marked ?");
      if (!prompt.includes(`${perimeter} `)) bad.push("the prompt isn't the perimeter");
    }
    if (facts.t === "squareSide") {
      if (p.answer * 4 !== facts.perimeter) bad.push(`a side is ${facts.perimeter / 4}`);
      if (!prompt.includes(`perimeter of ${facts.perimeter} `)) bad.push("the prompt isn't the perimeter");
    }
    if (facts.t === "rectWidth") {
      const width = (facts.perimeter - 2 * facts.length) / 2;
      if (p.answer !== width || !(width > 0) || width >= facts.length) bad.push(`the width is ${width}`);
    }
    if (facts.t === "areaOrPerimeter") {
      const key = Object.keys(NEEDS).find((word) => facts.story.includes(word));
      if (!key || NEEDS[key] !== facts.right) bad.push(`"${facts.story}" needs the ${key && NEEDS[key]}`);
      onlyRight((label) => label === facts.right, "what it needs");
    }
    if (facts.t === "rectMeasure") {
      const { ask, length, width } = facts,
        answer = ask === "area" ? length * width : 2 * (length + width);
      if (p.answer !== answer) bad.push(`the ${ask} is ${answer}`);
      if (length * width === 2 * (length + width)) bad.push("its area and perimeter are the same number");
      if ((fig.match(/class="rgrid"/g) || []).length !== length + width - 2) bad.push("the grid isn't the rectangle");
    }
    if (facts.t === "samePerimeter" || facts.t === "sameArea") {
      const { rects, most } = facts,
        samePerimeter = facts.t === "samePerimeter",
        held = rects.map(([w, l]) => (samePerimeter ? 2 * (w + l) : w * l)),
        values = rects.map(([w, l]) => (samePerimeter ? w * l : 2 * (w + l))),
        best = values.indexOf(most ? Math.max(...values) : Math.min(...values));
      if (new Set(held).size !== 1) bad.push(`the rectangles' ${samePerimeter ? "perimeters" : "areas"} differ`);
      if (new Set(values).size !== values.length) bad.push("two rectangles tie");
      if (rects.some(([w, l]) => l > 12 || w > l)) bad.push("a rectangle is too long, or turned");
      onlyRight((label) => label === `Rectangle ${"ABC"[best]}`, "the answer");
      if (!prompt.includes(String(held[0]))) bad.push("the prompt isn't the measure they share");
    }
    if (facts.t === "lPerimeter" || facts.t === "lArea") {
      const { wide, tall, cutWide, cutTall, sides: lengths } = facts,
        area = wide * tall - cutWide * cutTall,
        perimeter = 2 * (wide + tall);
      if (lengths[0] + lengths[2] !== lengths[4] || lengths[1] + lengths[3] !== lengths[5])
        bad.push("the sides don't fit together");
      if (lengths.some((len) => !(len > 0))) bad.push("a side isn't there");
      if (area === perimeter) bad.push("its area and perimeter are the same number");
      if (facts.t === "lPerimeter") {
        if (p.answer !== perimeter) bad.push(`the perimeter is ${perimeter}`);
        if ((fig.match(/>\?</g) || []).length !== 2) bad.push("two sides should be marked ?");
        if (facts.hidden.filter((i) => i % 2 === 0).length !== 1) bad.push("the sides marked ? can't both be found");
      } else if (p.answer !== area) bad.push(`the area is ${area}`);
    }
    if (facts.t === "robot") {
      const { area, perimeter } = facts;
      onlyRight((label) => {
        const [w, l] = label.split(" by ").map(Number);
        return w * l === area && 2 * (w + l) === perimeter;
      }, `${area} square units with a perimeter of ${perimeter}`);
    }
    if (facts.t === "sandbox") {
      const width = (facts.perimeter - 2 * facts.length) / 2;
      if (p.answer !== facts.length * width || !(width > 0)) bad.push(`the area is ${facts.length * width}`);
    }
    return bad;
  },
};
