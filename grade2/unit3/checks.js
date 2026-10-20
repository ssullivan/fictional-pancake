/* Inchworm Trail: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its pictures: it reads a thing's length off the ruler under it (where its ends line up with the
   ruler's numbers), counts the cubes and foot rulers, and reads the Xs off each line plot. Lengths must be real-life ones. */
const LIMITS = { dp: 0, nz: 2, max: 99 };
// desk things in centimeters and inches, reptiles in centimeters, and things in feet: [shortest, longest]
const DESK = {
  eraser: { cm: [4, 6], in: [2, 2] },
  crayon: { cm: [8, 10], in: [3, 4] },
  glue: { cm: [8, 11], in: [3, 4] },
  marker: { cm: [12, 15], in: [5, 6] },
  pencil: { cm: [14, 19], in: [6, 7] },
  book: { cm: [25, 32] },
};
const REPTILES = {
  "leopard gecko": [18, 25],
  "green anole": [12, 20],
  "box turtle": [11, 18],
  "bearded dragon": [40, 55],
  "blue-tongued skink": [40, 55],
  "garter snake": [50, 70],
  "corn snake": [70, 99],
};
const FEET = { poster: [2, 3], rug: [3, 5], bench: [4, 5] };
// things to measure in meters
const LONG = ["the hallway", "a school bus", "the playground", "a swimming pool", "the classroom", "a soccer field"];
// what the class measured for a line plot: the unit and the lengths they come in
const PLOTS = {
  crayons: ["cm", 5, 10],
  pencils: ["inches", 3, 8],
  leaves: ["inches", 2, 7],
  shells: ["cm", 3, 8],
  feathers: ["inches", 4, 9],
};
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum or difference written out, like "16 + 9" or "32 − 8"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
const within = (n, [lo, hi]) => n >= lo && n <= hi;
// a ruler's numbers: where each one is written across the picture, as [x, number]
const rulerMarks = (svg) =>
  [...svg.matchAll(/<text class="lbl(?: s)?" x="([\d.]+)" y="[\d.]+">(\d+)<\/text>/g)].map((m) => [+m[1], +m[2]]);
// the length of the thing on a ruler: its ends (the dashed guides down to the ruler) read against the ruler's numbers
function lengthOnRuler(svg) {
  const guide = svg.match(/<path class="guide" d="M([\d.]+),40V[\d.]+M([\d.]+),40V/),
    marks = rulerMarks(svg);
  if (!guide || marks.length < 2) return NaN;
  const [[x0, v0], [x1, v1]] = marks,
    valueAt = (x) => v0 + ((x - x0) * (v1 - v0)) / (x1 - x0);
  return Math.round(valueAt(+guide[2]) - valueAt(+guide[1]));
}
// a line plot's Xs, as how many there are at each length (the Xs sit above the numbers under the line)
function plotCounts(svg) {
  const numbers = [...svg.matchAll(/<text class="lbl(?: cy)?" x="([\d.]+)" y="[\d.]+">(\d+)<\/text>/g)].map((m) => [
      +m[1],
      +m[2],
    ]),
    counts = {};
  for (const [, x] of svg.matchAll(/<text class="xm[^"]*" x="([\d.]+)"/g)) {
    const at = numbers.find(([nx]) => Math.abs(nx - +x) < 1);
    if (at) counts[at[1]] = (counts[at[1]] || 0) + 1;
    else counts.lost = (counts.lost || 0) + 1;
  }
  return counts;
}
// two sets of counts are the same (ignoring lengths with none)
const sameCounts = (a, b) => {
  const nonzero = (c) =>
    Object.entries(c)
      .filter(([, n]) => n)
      .map(([v, n]) => `${v}:${n}`)
      .sort()
      .join();
  return nonzero(a) === nonzero(b);
};

module.exports = {
  limits: { units: LIMITS, cm: LIMITS, inches: LIMITS, silk: LIMITS, plots: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => (c.label.startsWith("<svg") ? "" : plain(c.label))),
      fig = p.fig ? p.fig(false, false) : "",
      shown = p.fig ? p.fig(true, true) : "";
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      ...labels,
    ]
      .map(plain)
      .join(" ");
    // every equation it states is true
    for (const [chain] of told.matchAll(/(?<![\d?] [+−] )\b\d+(?: [+−] \d+)*(?: = \d+(?: [+−] \d+)*)+/g)) {
      const values = chain.split(" = ").map(evaluate);
      if (values.some((v) => v !== values[0])) bad.push(`${chain} is wrong`);
    }
    if (/\b(he|she|his|her|him|hers)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    if (!facts.t) bad.push("no facts to check the answer with");
    const onlyRight = (fits, what) =>
      p.choices.forEach((choice, i) => {
        const ok = fits(choice.label, plain(choice.label));
        if (ok !== (choice.id === p.answer)) bad.push(`choice ${i + 1} ${ok ? "is" : "is not"} ${what}`);
      });
    const answerIs = (value, what) => {
      if (p.answer !== value) bad.push(`answer ${p.answer} should be ${value} (${what})`);
    };
    (p.choices || []).forEach((choice, i) => {
      if (choice.label.startsWith("<svg") && !choice.label.includes(`aria-label="Picture ${"ABC"[i]}"`))
        bad.push(`picture choice ${i + 1} isn't labeled Picture ${"ABC"[i]}`);
    });
    // a desk thing is a real-life length for it
    const realDesk = (kind, len, unit) => {
      if (!DESK[kind] || !DESK[kind][unit] || !within(len, DESK[kind][unit])) bad.push(`a ${kind} ${len} ${unit} long`);
    };

    if (facts.t === "cubes") {
      realDesk(facts.kind, facts.len, "cm");
      answerIs(countOf(fig, /class="cube a"/g), "the cubes in the picture");
      answerIs(facts.len, "its length");
    }
    if (facts.t === "ruler") {
      realDesk(facts.kind, facts.len, facts.unit);
      answerIs(lengthOnRuler(fig), "the length read off the ruler");
      if (facts.at && rulerMarks(fig)[0][1] !== 0) bad.push("the ruler doesn't start at 0");
    }
    if (facts.t === "units") {
      // each unit's count covers the same length (cubes 1 cm, clips 3, erasers 5); fewer of the longer one
      const { cube, clip, eraser } = facts.counts;
      if (cube * 1 !== clip * 3 || clip * 3 !== eraser * 5) bad.push("the units don't cover the same length");
      if (countOf(shown, /class="cube a"/g) !== cube || countOf(shown, /class="clip"/g) !== clip)
        bad.push("the units drawn don't match");
      onlyRight((svg, text) => text === (facts.fewest ? "erasers" : "cubes"), facts.fewest ? "the fewest" : "the most");
    }
    if (facts.t === "estimate") {
      // the best estimate is the closest one, and the thing is a real length
      realDesk(facts.kind, facts.len, "cm");
      const guesses = labels.map((label) => +label.match(/\d+/)[0]),
        closest = guesses.reduce((best, g) => (Math.abs(g - facts.len) < Math.abs(best - facts.len) ? g : best));
      onlyRight((svg, text) => +text.match(/\d+/)[0] === closest, `the closest estimate to ${facts.len} cm`);
      if (lengthOnRuler(shown) !== facts.len) bad.push(`the hint's ruler shows ${lengthOnRuler(shown)}`);
    }
    if (facts.t === "meters")
      onlyRight((svg, text) => LONG.includes(text) === facts.meters, facts.meters ? "long" : "short");
    if (facts.t === "reptiles") {
      const { big, small, longer, shorter } = facts;
      answerIs(big - small, `${big} − ${small}`);
      if (!within(big, REPTILES[longer] || [0, 0])) bad.push(`a ${longer} ${big} cm long`);
      if (!within(small, REPTILES[shorter] || [0, 0])) bad.push(`a ${shorter} ${small} cm long`);
      if (big <= small) bad.push(`the ${longer} isn't longer`);
    }
    if (facts.t === "feet") {
      answerIs(12 * facts.ft, `${facts.ft} feet`);
      if (!within(facts.ft, FEET[facts.kind] || [0, 0])) bad.push(`a ${facts.kind} ${facts.ft} feet long`);
      if (countOf(fig, /class="rul"/g) !== facts.ft) bad.push("the picture has the wrong number of foot rulers");
    }
    if (facts.t === "torn") {
      realDesk(facts.kind, facts.len, "in");
      answerIs(lengthOnRuler(fig), "the length read off the torn tape");
      if (rulerMarks(fig)[0][1] !== facts.start || facts.start < 1) bad.push("the torn tape should start past 0");
    }
    if (facts.t === "inchToCm") {
      realDesk(facts.kind, facts.len, "in");
      onlyRight(
        (svg, text) => Math.abs(+text.match(/\d+/)[0] - facts.len * 2.54) < 1,
        `about ${facts.len} inches in cm`,
      );
    }
    if (facts.t === "silk") {
      const { op, a, b } = facts;
      answerIs(op === "+" ? a + b : a - b, `${a} ${op} ${b}`);
      if (op === "−" && !within(b, [6, 9])) bad.push(`a bracelet ${b} inches long`);
      if (op === "+" && (a + b > 50 || b < 5)) bad.push(`pieces ${a} and ${b} inches long`);
    }
    if (facts.t === "silkCompare") answerIs(facts.long - facts.short, `${facts.long} − ${facts.short}`);
    if (facts.t === "silkNeed") {
      answerIs(facts.necklace - facts.have, `${facts.necklace} − ${facts.have}`);
      if (!within(facts.necklace, [16, 24])) bad.push(`a necklace ${facts.necklace} inches long`);
    }
    if (facts.counts && facts.t.startsWith("plot")) {
      // the plot shows the counts, every length is a real one for the things, and the answer comes from the Xs
      const things = Object.keys(PLOTS).find((k) => prompt.includes(k)),
        [unit, lo, hi] = PLOTS[things] || [];
      if (!things) bad.push("no plot for these things");
      const counts = plotCounts(fig);
      if (!sameCounts(counts, facts.counts)) bad.push(`the plot shows ${JSON.stringify(counts)}`);
      const lengths = Object.keys(counts)
        .filter((v) => counts[v])
        .map(Number);
      if (lengths.some((v) => v < lo || v > hi)) bad.push(`${things} ${lengths} ${unit} long`);
      if (facts.t === "plotCount") answerIs(counts[facts.v], `the Xs above ${facts.v}`);
      if (facts.t === "plotRange") answerIs(Math.max(...lengths) - Math.min(...lengths), "longest − shortest");
      if (facts.t === "plotMost") {
        const most = Math.max(...Object.values(counts));
        if (Object.values(counts).filter((n) => n === most).length !== 1) bad.push("two lengths tie for the most");
        onlyRight((svg, text) => counts[+text.match(/\d+/)[0]] === most, "the length with the most");
      }
    }
    if (facts.t === "plotMatch") {
      // the right plot has one X for each measurement listed in the prompt
      const listed = {};
      for (const [n] of prompt.replace(/^.*? are /, "").matchAll(/\d+/g)) listed[n] = (listed[n] || 0) + 1;
      onlyRight((svg) => sameCounts(plotCounts(svg), listed), "the plot of the measurements");
    }
    return bad;
  },
};
