/* Tile Town: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Side lengths go up to 10 and areas stay within 100. */
const LIMITS = { dp: 0, nz: 2, max: 100 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the aria-label of every picture in some markup, joined
const labelsIn = (html) => [...String(html).matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]).join(" | ");
// the value of an expression of products added together: "6 × 5 + 6 × 2" is 42
const value = (expr) =>
  expr
    .split(" + ")
    .map((term) => term.split(" × ").reduce((product, factor) => product * +factor, 1))
    .reduce((sum, term) => sum + term, 0);
// the shortest and longest side that makes sense for each thing, in each unit it's measured in
const SIZES = {
  "a postage stamp": { cm: [2, 4] },
  "a sticky note": { cm: [7, 8], in: [3, 3] },
  "an index card": { in: [3, 6] },
  "a photo": { in: [4, 7] },
  "a playing card": { cm: [6, 9], in: [2, 3] },
  "a coaster": { cm: [9, 10], in: [4, 4] },
  "a book cover": { in: [5, 10] },
  "a rug": { ft: [2, 9], m: [2, 3] },
  "a bedroom floor": { ft: [7, 10], m: [3, 4] },
  "a garden": { ft: [4, 9], m: [2, 5] },
  "a garden bed": { ft: [2, 8], m: [2, 5] },
  "a classroom floor": { m: [6, 10] },
  "a bulletin board": { ft: [2, 6] },
  "a patio": { m: [3, 8] },
  "a quilt": { ft: [4, 8] },
  "a pool": { m: [4, 10] },
  "a basketball court": { m: [] },
  "a playground": { m: [] },
};
// small things are measured in square centimeters or inches; big ones in square feet or meters
const SMALL_UNITS = ["square centimeters", "square inches"],
  BIG_UNITS = ["square feet", "square meters"];
const isSmall = (thing) => Object.keys(SIZES[thing]).some((unit) => unit === "cm" || unit === "in");
// what 1 square unit is about the size of
const BENCH = {
  centimeter: "the tip of your finger",
  inch: "a postage stamp",
  foot: "a floor tile",
  meter: "a small table top",
};
// the smaller of two square units
const SMALLER = { centimeters: "inches", feet: "meters" };

module.exports = {
  limits: { cover: LIMITS, build: LIMITS, units: LIMITS, plots: LIMITS, split: LIMITS, floors: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      labels = (p.choices || []).map((c) => c.label),
      fig = p.fig ? labelsIn(p.fig(false)) : "";
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
    // every product, sum, and difference it states is right, and factors stay within 10
    for (const [text, a, b, c] of told.matchAll(/\b(\d+) × (\d+) = (\d+)\b(?! ×)/g))
      if (a * b !== +c) bad.push(`${text} is wrong`);
    for (const [text, a, b] of told.matchAll(/\b(\d+) × (\d+)\b/g))
      if (+a > 10 || +b > 10 || a * b > 100) bad.push(`${text} is past 10 × 10`);
    for (const [text, terms, total] of told.matchAll(/(?<![×−] )\b((?:\d+ \+ )+\d+) = (\d+)\b(?! ×)/g))
      if (value(terms) !== +total) bad.push(`${text} is wrong`);
    for (const [text, a, b, c] of told.matchAll(/(?<!× )\b(\d+) − (\d+) = (\d+)\b/g))
      if (a - b !== +c) bad.push(`${text} is wrong`);
    // a × b = a × c + a × d (with ? standing for the answer) is true, and splits b into c + d
    for (const [text, a, b, a2, c, a3, d] of told.matchAll(/\b(\d+) × (\d+) = (\d+) × (\d+) \+ (\d+) × (\d+|\?)/g)) {
      const rest = d === "?" ? p.answer : +d;
      if (a !== a2 || a !== a3 || +b !== +c + rest) bad.push(`${text} is not true with ${p.answer}`);
    }
    // the answer worked out again from the numbers the problem was made from, and those numbers are the picture's
    let match;
    if (facts.t === "cells") {
      if (p.answer !== facts.cells.length) bad.push(`the shape has ${facts.cells.length} squares, not ${p.answer}`);
      if (!fig.includes(`made of ${facts.cells.length} squares`)) bad.push("the picture isn't the shape counted");
    }
    if (facts.t === "most") {
      const most = Math.max(...facts.sizes);
      if (facts.sizes.filter((n) => n === most).length > 1) bad.push("two shapes tie for the biggest");
      if ("ABC"[facts.sizes.indexOf(most)] !== p.answer) bad.push(`shape ${p.answer} isn't the biggest`);
      facts.sizes.forEach((n, i) => {
        if (!fig.includes(`Shape ${"ABC"[i]}: ${n} squares`)) bad.push(`shape ${"ABC"[i]} isn't ${n} squares`);
      });
    }
    if (facts.t === "rect") {
      if (p.answer !== facts.rows * facts.cols) bad.push(`${facts.rows} rows of ${facts.cols} isn't ${p.answer}`);
      if (!fig.includes(`A rectangle ${facts.cols} squares long and ${facts.rows} squares tall`))
        bad.push("the picture isn't the rectangle");
    }
    if (facts.t === "side") {
      if (p.answer * facts.rows !== +prompt.match(/area of (\d+)/)[1])
        bad.push(`${facts.rows} × ${p.answer} isn't the area`);
      if (!prompt.includes(`It has ${facts.rows} rows`)) bad.push("the prompt has other rows");
    }
    if (facts.t === "plot" || facts.t === "missing" || (facts.t === "rect" && facts.thing)) {
      // a thing's sides are a size it comes in, in a unit it's measured in
      const sides = facts.t === "rect" ? [facts.rows, facts.cols] : [facts.length, facts.width],
        range = (SIZES[facts.thing] || {})[facts.unit];
      if (!range) bad.push(`${facts.thing} isn't measured in ${facts.unit}`);
      else if (sides.some((side) => side < range[0] || side > range[1]))
        bad.push(`${facts.thing} isn't ${sides.join(" by ")} ${facts.unit}`);
    }
    if (facts.t === "plot") {
      if (p.answer !== facts.length * facts.width) bad.push(`${facts.length} × ${facts.width} isn't ${p.answer}`);
      if (!fig.includes(`A rectangle ${facts.length} by ${facts.width} ${facts.unit}`))
        bad.push("the picture isn't the plot");
    }
    if (facts.t === "missing") {
      const [, area, width] = prompt.match(/area of (\d+) .* It is (\d+) /);
      if (p.answer * width !== +area) bad.push(`${width} × ${p.answer} isn't ${area}`);
      if (!fig.includes(`A rectangle ? by ${width} ${facts.unit}`)) bad.push("the picture isn't the plot");
    }
    if (facts.t === "ruler") {
      if (p.answer !== facts.length * facts.width) bad.push(`${facts.length} × ${facts.width} isn't ${p.answer}`);
      if (!new RegExp(`it is ${facts.length} \\w+ long and ${facts.width} \\w+ wide`).test(fig))
        bad.push("the rulers don't measure those sides");
    }
    if (facts.t === "split") {
      const { rows, cols, cut } = facts,
        rest = cols - cut;
      if (!fig.includes(`A rectangle ${rows} squares tall and ${cols} long, cut into ${rows} by`))
        bad.push("the picture isn't the rectangle");
      if (cut < 2 || rest < 2) bad.push("a part is too thin");
      const answer = / × \?$/.test(prompt) ? rest : rows * cols;
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
    }
    if (facts.t === "L" || facts.t === "Lside") {
      const { wide, tall, cutWide, cutTall } = facts,
        area = wide * tall - cutWide * cutTall,
        sides = [wide - cutWide, cutTall, cutWide, tall - cutTall, wide, tall],
        shown = sides.map((side, i) => (i === facts.ask ? "?" : side)).join(", ");
      if (cutWide >= wide || cutTall >= tall) bad.push("the corner cut away is bigger than the figure");
      if (
        !fig.includes(`Its sides, going around: ${shown}`) &&
        !fig.includes(`Its sides, going around: ${sides.join(", ")}`)
      )
        bad.push(`the picture's sides aren't ${shown}`);
      if (facts.t === "Lside" && p.answer !== sides[facts.ask]) bad.push(`side ${facts.ask} is ${sides[facts.ask]}`);
      if (p.kind === "num" && /What is its area/.test(prompt) && p.answer !== area) bad.push(`the area is ${area}`);
      if (p.kind === "mc") onlyRight((label) => value(label) === area, `the area, ${area}`);
    }
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other;
    // what says what fitting means
    function onlyRight(fits, what) {
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${plain(label).slice(0, 50)} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    }
    if (/Which way works\?/.test(prompt))
      onlyRight((label) => /no gaps or overlaps/.test(labelsIn(label)), "tiles with no gaps or overlaps");
    if (/Which expression gives the area of this rectangle/.test(prompt)) {
      const [, cols, rows] = fig.match(/A rectangle (\d+) squares long and (\d+) squares tall/);
      onlyRight((label) => label === `${rows} × ${cols}` || label === `${cols} × ${rows}`, `${rows} rows of ${cols}`);
    }
    if ((match = prompt.match(/^Which rectangle has an area of (\d+) square units/)))
      onlyRight((label) => {
        const [, cols, rows] = labelsIn(label).match(/A rectangle (\d+) squares long and (\d+) squares tall/);
        return cols * rows === +match[1];
      }, `an area of ${match[1]}`);
    if ((match = prompt.match(/^Tap the rectangle with an area of (\d+) × (\d+)/))) {
      const tapped = fig.match(new RegExp(`Shape ${p.answer}: (\\d+) rows of (\\d+) squares`));
      if (!tapped || tapped[1] !== match[1] || tapped[2] !== match[2])
        bad.push(`shape ${p.answer} isn't ${match[1]} rows of ${match[2]}`);
    }
    if ((match = prompt.match(/^Which unit makes the most sense for the area of (an? [\w ]+)\?/))) {
      const fitting = isSmall(match[1]) ? SMALL_UNITS : BIG_UNITS;
      onlyRight((label) => fitting.includes(label), `a unit for ${match[1]}`);
    }
    if (
      (match = prompt.match(/^(\w+) covers .* with square (\w+)\. (\w+) covers .* with square (\w+)\. Who needs more/))
    ) {
      const [, nameA, unitA, nameB, unitB] = match,
        more = SMALLER[unitA] === unitB ? nameA : SMALLER[unitB] === unitA ? nameB : null;
      if (!more) bad.push(`${unitA} and ${unitB} aren't a small and a big unit of the same kind`);
      onlyRight((label) => label === more, "the one with the smaller squares");
    }
    if ((match = prompt.match(/^Which is about the size of 1 square (\w+)\?/)))
      onlyRight((label) => label.toLowerCase() === BENCH[match[1]], `about 1 square ${match[1]}`);
    if (
      (match = prompt.match(
        /^(\w+)’s (.+) is (\d+) \w+ by (\d+) \w+\. (\w+)’s is (\d+) \w+ by (\d+) \w+\. Which has the bigger area/,
      ))
    ) {
      const [, nameA, , a1, a2, nameB, b1, b2] = match,
        areaA = a1 * a2,
        areaB = b1 * b2,
        bigger = areaA === areaB ? "They’re the same" : areaA > areaB ? nameA : nameB;
      onlyRight((label) => label.startsWith(bigger), "the bigger one");
    }
    if (/^Which expression gives the area of the whole rectangle/.test(prompt)) {
      const [, rows, cols] = fig.match(/A rectangle (\d+) squares tall and (\d+) long/);
      onlyRight(
        (label) => value(label) === rows * cols && / \+ /.test(label) && / × .* × /.test(label),
        "both parts' areas",
      );
    }
    return bad;
  },
};
