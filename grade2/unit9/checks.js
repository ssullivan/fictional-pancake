/* Field Trip: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its pictures: the counters, the lengths written on each path (and where the paths end), the Xs on
   a line plot, the blocks, and the tapes. Problems that ask for a number need at most one new or broken ten or hundred, unless
   one number is just under a hundred (jump to the hundred and back) or the numbers are close (count on). */
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum or difference written out, like "398 + 245" or "15 − 8"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
const digitsOf = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
// the lengths written on a map's paths, for the gold (a) or blue (b) path
const legsOn = (svg, cls) =>
  [...svg.matchAll(new RegExp(`<text class="lbl s leg ${cls}"[^>]*>(\\d+) cm</text>`, "g"))].map((m) => +m[1]);
// where each path on a map ends, as "x,y"
const pathEnds = (svg) =>
  [...svg.matchAll(/<polyline class="route [ab]" points="([^"]+)"/g)].map((m) => m[1].split(" ").pop());
// a line plot's Xs, as how many there are at each length (the Xs sit above the numbers under the line)
function plotCounts(svg) {
  const numbers = [...svg.matchAll(/<text class="lbl(?: cy)?" x="([\d.]+)" y="[\d.]+">(\d+)<\/text>/g)].map((m) => [
      +m[1],
      +m[2],
    ]),
    counts = {};
  for (const [, x] of svg.matchAll(/<text class="xm[^"]*" x="([\d.]+)"/g)) {
    const at = numbers.find(([nx]) => Math.abs(nx - +x) < 1);
    counts[at ? at[1] : "lost"] = (counts[at ? at[1] : "lost"] || 0) + 1;
  }
  return counts;
}
// the number base-ten blocks show: 100 for a big square, 10 for a stick, 1 for a small cube
const blockValue = (svg) =>
  100 * countOf(svg, /class="flat /g) + 10 * countOf(svg, /class="rod /g) + countOf(svg, /class="unit1 /g);
// how many trades a + b or a − b needs (new or broken tens and hundreds)
function trades(a, op, b) {
  const [, tensA, onesA] = digitsOf(a),
    [, tensB, onesB] = digitsOf(b);
  if (op === "+") {
    const ten = onesA + onesB >= 10;
    return (ten ? 1 : 0) + (tensA + tensB + (ten ? 1 : 0) >= 10 ? 1 : 0);
  }
  const ten = onesA < onesB;
  return (ten ? 1 : 0) + (tensA - (ten ? 1 : 0) < tensB ? 1 : 0);
}
// what kind a story is, from its words
const kindOf = (story) =>
  /found \d+ more/.test(story)
    ? "Add to"
    : /gave \d+/.test(story)
      ? "Take from"
      : /put them all in one box/.test(story)
        ? "Put together"
        : /fewer \w+ than/.test(story)
          ? "Compare"
          : "?";
// a choice like "3 hundreds, 16 tens, 5 ones" as a number
const valueOfPlaces = (text) => {
  const [h, t, o] = ["hundred", "ten", "one"].map((word) => +(text.match(new RegExp(`(\\d+) ${word}`)) || [0, 0])[1]);
  return 100 * h + 10 * t + o;
};

module.exports = {
  limits: {
    facts: { dp: 0, nz: 2, max: 20 },
    map: { dp: 0, nz: 2, max: 99 },
    numbers: { dp: 0, nz: 3, max: 999 },
    addsub: { dp: 0, nz: 3, max: 999 },
    stories: { dp: 0, nz: 2, max: 99 },
    boss: { dp: 0, nz: 3, max: 999 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label)),
      fig = p.fig ? p.fig(false, false) : "",
      shown = p.fig ? p.fig(true, true) : "";
    // what the game tells a student (a wrong choice may be false on purpose, so only the right one counts)
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      ...labels.filter((label, i) => p.choices[i].id === p.answer),
    ]
      .map(plain)
      .join(" ");
    for (const [chain] of told.matchAll(/(?<![\d?] [+−] )\b\d+(?: [+−] \d+)*(?: = \d+(?: [+−] \d+)*)+/g)) {
      const values = chain.split(" = ").map(evaluate);
      if (values.some((v) => v !== values[0])) bad.push(`${chain} is wrong`);
    }
    for (const [n] of [prompt, ...labels].join(" ").matchAll(/\d+/g)) if (+n > 999) bad.push(`${n} is past 1,000`);
    if (/\b(he|she|his|her|him|hers)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    if (!facts.t) bad.push("no facts to check the answer with");
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    const answerIs = (value, what) => {
      if (p.answer !== value) bad.push(`answer ${p.answer} should be ${value} (${what})`);
    };

    // ---------- facts within 20 ----------
    if (facts.t === "add") {
      const { a, b } = facts;
      answerIs(a + b, `${a} + ${b}`);
      if (a + b > 20) bad.push(`${a} + ${b} is past 20`);
      if (countOf(fig, /class="ctr a/g) !== a || countOf(fig, /class="ctr b/g) !== b)
        bad.push("the counters don't show the fact");
    }
    if (facts.t === "missing") {
      const [left, right] = facts.equation.replace("?", p.answer).split(" = ").map(evaluate);
      if (left !== right) bad.push(`${facts.equation} with ${p.answer} is not true`);
      if (Math.max(...facts.equation.match(/\d+/g).map(Number)) > 20) bad.push(`${facts.equation} is past 20`);
    }
    if (facts.t === "family") {
      const { a, b } = facts,
        family = [a, b, a + b].sort((x, y) => x - y).join();
      onlyRight((label) => {
        const [left, right] = label.split(" = ");
        return (
          evaluate(left) === +right &&
          label
            .match(/\d+/g)
            .map(Number)
            .sort((x, y) => x - y)
            .join() === family
        );
      }, `in the family of ${a} + ${b}`);
    }

    // ---------- the map ----------
    if (facts.t === "path") {
      const lengths = legsOn(fig, "a");
      answerIs(sum(lengths), "the lengths on the path");
      if (lengths.join() !== facts.legs.map(([, n]) => n).join()) bad.push(`the path shows ${lengths}`);
      if (lengths.some((n) => n < 3 || n > 12)) bad.push(`a part is ${lengths} cm`);
    }
    if (facts.t === "shorter") {
      const gold = legsOn(fig, "a"),
        blue = legsOn(fig, "b"),
        ends = pathEnds(fig);
      answerIs(sum(blue) - sum(gold), "blue − gold");
      if (ends.length !== 2 || ends[0] !== ends[1]) bad.push("the two paths don't end at the same place");
      if (sum(blue) <= sum(gold)) bad.push("the gold path isn't shorter");
    }
    if (facts.t === "plotCount" || facts.t === "plotMost") {
      const counts = plotCounts(fig),
        values = Object.values(counts);
      if (Object.keys({ ...counts, ...facts.counts }).some((k) => (counts[k] || 0) !== (facts.counts[k] || 0)))
        bad.push(`the plot shows ${JSON.stringify(counts)}`);
      if (counts.lost) bad.push("an X isn't above a number");
      if (facts.t === "plotCount") answerIs(counts[facts.v], `the Xs above ${facts.v}`);
      else {
        const most = Math.max(...values);
        if (values.filter((n) => n === most).length !== 1) bad.push("two lengths tie for the most");
        onlyRight((label) => counts[+label.match(/\d+/)[0]] === most, "the most common length");
      }
    }

    // ---------- numbers to 1,000 ----------
    if (facts.t === "blocks") {
      const { hundreds, tens, ones } = facts;
      answerIs(100 * hundreds + 10 * tens + ones, "the blocks");
      if (blockValue(fig) !== p.answer) bad.push(`the blocks show ${blockValue(fig)}`);
      if (tens < 10 && ones < 10) bad.push("nothing to trade");
    }
    if (facts.t === "alsoMakes") {
      onlyRight((label) => valueOfPlaces(label) === facts.n, `the same as ${facts.n}`);
      if (blockValue(fig) !== facts.n) bad.push(`the blocks show ${blockValue(fig)}`);
    }
    if (facts.t === "expression") onlyRight((label) => evaluate(label) === facts.n, `an expression for ${facts.n}`);

    // ---------- adding and subtracting ----------
    if (facts.t === "op") {
      const { a, op, b } = facts,
        answer = op === "+" ? a + b : a - b,
        // a number just under a hundred is added by jumping to the hundred and back, and close numbers are subtracted by
        // counting on, so neither trades
        nearHundred = op === "+" && (100 - (a % 100) <= 2 || 100 - (b % 100) <= 2),
        closeNumbers = op === "−" && a - b <= 20;
      answerIs(answer, `${a} ${op} ${b}`);
      if (answer < 1 || answer > 999) bad.push(`${a} ${op} ${b} is not within 1,000`);
      if (trades(a, op, b) > 1 && !nearHundred && !closeNumbers) bad.push(`${a} ${op} ${b} needs two trades`);
      if (/tickets/.test(prompt) && /left\?/.test(prompt) !== (op === "−"))
        bad.push(`the story's words don't match ${op}`);
    }

    // ---------- story problems ----------
    if (facts.t === "kind") {
      const story = prompt.replace(/^What kind of story is this\? /, "");
      if (kindOf(story) !== facts.kind) bad.push(`the story reads as ${kindOf(story)}, not ${facts.kind}`);
      onlyRight((label) => label === kindOf(story), "the kind of story");
    }
    if (facts.t === "question")
      onlyRight(
        (label) => (facts.subtract ? /^How many more/.test(label) : /in all\?$/.test(label)),
        facts.subtract ? "a question to subtract" : "a question to add",
      );
    if (facts.t === "tape") {
      const { kind, whole, known } = facts,
        onTape = [...fig.matchAll(/<text class="lbl[^"]*"[^>]*>(\d+|\?)<\/text>/g)].map((m) => m[1]);
      answerIs(whole - known, `${whole} − ${known}`);
      if (!prompt.includes(String(whole)) || !prompt.includes(String(known)))
        bad.push("the story doesn't give both numbers");
      if (
        onTape.filter((t) => t === "?").length !== 1 ||
        !onTape.includes(String(whole)) ||
        !onTape.includes(String(known))
      )
        bad.push(`the tapes show ${onTape}`);
      if (kind === "smaller" && !/fewer \w+ than/.test(prompt)) bad.push("the compare story doesn't say fewer");
    }
    return bad;
  },
};
