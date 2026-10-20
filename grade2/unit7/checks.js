/* Robot Factory: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its pictures (the blocks on the mat and what's crossed out, the jumps), holds each problem that
   asks for a number to at most one new or broken ten or hundred, and checks that each choice is right or wrong for the right
   reason. */
const LIMITS = { dp: 0, nz: 3, max: 999 };
// what each choice says is needed, for "what do you need to make" and "what do you need to break"
const SAYS = {
  "a new ten and a new hundred": "both",
  "only a new ten": "ten",
  "only a new hundred": "hundred",
  "nothing new": "none",
  "a ten and a hundred": "both",
  "only a ten": "ten",
  "only a hundred": "hundred",
  nothing: "none",
};
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum or difference written out, like "356 + 200 + 10 + 3"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
const digitsOf = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
// the number base-ten blocks show (100 for a big square, 10 for a stick, 1 for a small cube), and how much is crossed out
const blockValue = (svg) =>
  100 * countOf(svg, /class="flat /g) + 10 * countOf(svg, /class="rod /g) + countOf(svg, /class="unit1 /g);
const crossedOut = (svg) =>
  100 * countOf(svg, /class="flat [^"]*gone/g) +
  10 * countOf(svg, /class="rod [^"]*gone/g) +
  countOf(svg, /class="unit1 [^"]*gone/g);
// the most blocks of one kind in a row of the mat is 9 once the trades are made
const tooMany = (svg) => [/class="flat /g, /class="rod /g, /class="unit1 /g].some((kind) => countOf(svg, kind) > 9);
// what a + b makes, and what a − b breaks (the same tests the generators use, worked out again)
const makes = (a, b) => {
  const [, tensA, onesA] = digitsOf(a),
    [, tensB, onesB] = digitsOf(b),
    ten = onesA + onesB >= 10;
  return { ten, hundred: tensA + tensB + (ten ? 1 : 0) >= 10 };
};
const breaks = (a, b) => {
  const [, tensA, onesA] = digitsOf(a),
    [, tensB, onesB] = digitsOf(b),
    ten = onesA < onesB;
  return { ten, hundred: tensA - (ten ? 1 : 0) < tensB };
};
const kindOf = (m) => (m.ten && m.hundred ? "both" : m.ten ? "ten" : m.hundred ? "hundred" : "none");
// an open number line's circles (numbers, or ? for the one to find) and its jumps (+200, −1)
const jumpStops = (svg) =>
  [...svg.matchAll(/<circle class="jn[^"]*"[^>]*\/><text class="lbl[^"]*"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
const jumpMoves = (svg) =>
  [...svg.matchAll(/<text class="lbl cy"[^>]*>([+−]\d+)<\/text>/g)].map(
    (m) => (m[1][0] === "−" ? -1 : 1) * +m[1].slice(1),
  );

module.exports = {
  limits: { count: LIMITS, place: LIMITS, newten: LIMITS, add: LIMITS, subtract: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label)),
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
    // every equation it states is true, and every number is within 1,000
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

    if (facts.t === "jumpOn") {
      const { start, moves } = facts,
        land = start + sum(moves);
      answerIs(land, `${start} + ${moves.join(" + ")}`);
      if (digitsOf(start).some((d, i) => d + digitsOf(sum(moves))[i] > 9))
        bad.push("the jumps make a new ten or hundred");
      if (jumpStops(fig)[0] !== String(start) || jumpStops(fig).pop() !== "?")
        bad.push("the jumps don't start at the start and end at ?");
      if (jumpMoves(fig).join() !== moves.join()) bad.push(`the jumps are ${jumpMoves(fig)}, not ${moves}`);
      if (jumpStops(shown).pop() !== String(land)) bad.push("the hint lands somewhere else");
    }
    if (facts.t === "tenMore") {
      const { n, change } = facts,
        answer = n + change,
        changed = digitsOf(n).filter((d, i) => d !== digitsOf(answer)[i]).length;
      answerIs(answer, `${n} ${change > 0 ? "+" : "−"} ${Math.abs(change)}`);
      if (changed !== 1 || answer < 100) bad.push(`${n} to ${answer} changes ${changed} digits`);
      if (blockValue(fig) !== n) bad.push(`the blocks show ${blockValue(fig)}, not ${n}`);
    }
    if (facts.t === "countOn") {
      const { small, big } = facts;
      answerIs(big - small, `${big} − ${small}`);
      if (Math.floor(small / 100) === Math.floor(big / 100) || big % 100 === 0)
        bad.push("the numbers don't cross a hundred");
      if (big - small > 20) bad.push(`${small} and ${big} are too far apart to count on`);
    }
    if (facts.t === "story") {
      const { op, a, b } = facts,
        adding = op === "+",
        // a story that puts things together asks how many "is that"; one that takes away asks what's left, empty, or not
        joins = /is that\?$/.test(prompt),
        takes = /left\?|empty\?|don’t/.test(prompt);
      answerIs(adding ? a + b : a - b, `${a} ${op} ${b}`);
      if (joins === takes || joins !== adding) bad.push(`the story's words don't match ${op}`);
      if (!prompt.includes(String(a)) || !prompt.includes(String(b))) bad.push("the story doesn't give both numbers");
      const trades = adding ? makes(a, b) : breaks(a, b);
      if (trades.ten && trades.hundred) bad.push(`${a} ${op} ${b} needs two trades`);
      if (adding) {
        if (blockValue(fig) !== a + b) bad.push(`the blocks show ${blockValue(fig)}, not ${a} + ${b}`);
        if (blockValue(shown) !== a + b || tooMany(shown)) bad.push("the hint's blocks aren't traded up");
      } else {
        if (blockValue(fig) !== a) bad.push(`the blocks show ${blockValue(fig)}, not ${a}`);
        if (blockValue(shown) !== a || crossedOut(shown) !== b)
          bad.push(`the hint shows ${blockValue(shown)} with ${crossedOut(shown)} crossed out`);
      }
    }
    if (facts.t === "rightWay") {
      // a right way takes away from a, one step after another, and takes away b in all
      const { a, b } = facts;
      onlyRight((label) => {
        const steps = [...label.matchAll(/(\d+) ([+−]) (\d+) = (\d+)/g)].map((m) => [+m[1], m[2], +m[3], +m[4]]);
        return (
          steps[0][0] === a &&
          steps.every(([x, sign], i) => sign === "−" && (i === 0 || x === steps[i - 1][3])) &&
          sum(steps.map((s) => s[2])) === b
        );
      }, `a way to find ${a} − ${b}`);
    }
    if (facts.t === "tradeUp") {
      const { hundreds, tens, ones } = facts;
      answerIs(100 * hundreds + 10 * tens + ones, "the blocks");
      if (blockValue(fig) !== p.answer) bad.push(`the blocks show ${blockValue(fig)}`);
      if (tens < 10 && ones < 10) bad.push("there's nothing to trade");
    }
    if (facts.t === "makesBoth")
      onlyRight((label) => {
        const [x, y] = label.match(/\d+/g).map(Number);
        return kindOf(makes(x, y)) === "both" && x + y <= 999;
      }, "a sum with a new ten and a new hundred");
    if (facts.t === "addWay") {
      const { near, b } = facts;
      answerIs(near + b, `${near} + ${b}`);
      if (100 - (near % 100) > 2) bad.push(`${near} isn't close to a hundred`);
      if (jumpStops(shown).pop() !== String(near + b)) bad.push("the hint's jumps land somewhere else");
    }
    if (facts.t === "whatNeeds") {
      const { a, b, op } = facts,
        need = kindOf(op === "+" ? makes(a, b) : breaks(a, b));
      onlyRight((label) => SAYS[label] === need, `what ${a} ${op} ${b} needs`);
      if (op === "−" && a - b < 100) bad.push(`${a} − ${b} is less than 100`);
    }
    if (facts.t === "whichBreaks")
      onlyRight(
        (label) => {
          const [x, y] = label.match(/\d+/g).map(Number);
          return facts.hundred ? breaks(x, y).hundred : breaks(x, y).ten;
        },
        facts.hundred ? "a subtraction that breaks a hundred" : "a subtraction that breaks a ten",
      );
    return bad;
  },
};
