/* Market Day: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its pictures (the blocks and what's crossed out, the jumps, the tapes), holds every problem to
   numbers within 100 with at most one new or broken ten, and checks that each choice is right or wrong for the right reason. */
const LIMITS = { dp: 0, nz: 2, max: 99 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum or difference written out, like "40 + 3" or "63 − 18"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
// how many times a pattern shows up in some markup
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
// the number base-ten blocks show (10 for each rod and 1 for each small cube), and how much of it is crossed out
const blockValue = (svg) => 10 * countOf(svg, /class="rod /g) + countOf(svg, /class="unit1 /g);
const crossedOut = (svg) => 10 * countOf(svg, /class="rod [^"]*gone/g) + countOf(svg, /class="unit1 [^"]*gone/g);
// the words written in a picture, in order
const textsIn = (svg) => [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
// an open number line's jumps (+3 or −10, as numbers) and the numbers in its circles
const jumpMoves = (svg) =>
  textsIn(svg)
    .filter((t) => /^[+−]\d+$/.test(t))
    .map((t) => (t[0] === "−" ? -1 : 1) * +t.slice(1));
const jumpStops = (svg) =>
  textsIn(svg)
    .filter((t) => /^\d+$/.test(t))
    .map(Number);
// does a + b make a new ten, and does a − b break one?
const newTen = (a, b) => (a % 10) + (b % 10) >= 10;
const breaksTen = (a, b) => a % 10 < b % 10;

module.exports = {
  limits: { compare: LIMITS, takeaway: LIMITS, break: LIMITS, within: LIMITS, stories: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      // choices that are words (not pictures)
      labels = (p.choices || []).map((c) => (c.label.startsWith("<svg") ? "" : plain(c.label))),
      fig = p.fig ? p.fig(false, false) : "",
      shown = p.fig ? p.fig(true, true) : "";
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and every word choice
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
    // every equation it states is true (a ? is never part of one), and every number is within 100
    for (const [chain] of told.matchAll(/(?<![\d?] [+−] )\b\d+(?: [+−] \d+)*(?: = \d+(?: [+−] \d+)*)+/g)) {
      const values = chain.split(" = ").map(evaluate);
      if (values.some((v) => v !== values[0])) bad.push(`${chain} is wrong`);
    }
    for (const [n] of [prompt, ...labels].join(" ").matchAll(/\d+/g)) if (+n > 99) bad.push(`${n} is past 100`);
    if (/\b(he|she|his|her|him|hers)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    if (!facts.t) bad.push("no facts to check the answer with");
    // mc answers: exactly the right choice fits
    const onlyRight = (fits, what) =>
      p.choices.forEach((choice, i) => {
        const ok = fits(choice.label, i);
        if (ok !== (choice.id === p.answer)) bad.push(`choice ${i + 1} ${ok ? "is" : "is not"} ${what}`);
      });
    const answerIs = (value, what) => {
      if (p.answer !== value) bad.push(`answer ${p.answer} should be ${value} (${what})`);
    };
    // picture choices are labeled Picture A, B, C for the read-aloud
    (p.choices || []).forEach((choice, i) => {
      if (choice.label.startsWith("<svg") && !choice.label.includes(`aria-label="Picture ${"ABC"[i]}"`))
        bad.push(`picture choice ${i + 1} isn't labeled Picture ${"ABC"[i]}`);
    });

    if (facts.t === "more") {
      const { big, small, kid, other } = facts;
      answerIs(big - small, `${big} − ${small}`);
      if (breaksTen(big, small)) bad.push(`${big} − ${small} breaks a ten`);
      if (!prompt.includes(`${kid} picks ${big} `) || !prompt.includes(`${other} picks ${small} `))
        bad.push("the story doesn't give each amount to the right student");
      if (!new RegExp(`How many more \\w+ does ${kid} pick than ${other}\\?`).test(prompt))
        bad.push("the question doesn't ask how many more the bigger amount is");
      const onTapes = textsIn(fig).filter((t) => /^\d+$/.test(t));
      if (onTapes.join() !== `${big},${small}`) bad.push(`the tapes show ${onTapes}`);
    }
    if (facts.t === "missing") {
      const [left, right] = facts.equation.replace("?", p.answer).split(" = ").map(evaluate);
      if (left !== right) bad.push(`${facts.equation} with ${p.answer} is not true`);
      const [a, b] = facts.equation.match(/\d+/g).map(Number);
      if (facts.equation.includes("+") && newTen(a, p.answer))
        bad.push(`${facts.equation} needs a new ten in Lessons 1–3`);
      if (facts.equation.includes("−")) {
        if (!breaksTen(a, b)) bad.push(`${facts.equation} doesn't break a ten`);
        if (blockValue(fig) !== a || crossedOut(shown) !== b) bad.push("the blocks don't show the subtraction");
      }
    }
    if (facts.t === "story") {
      const { op, a, b } = facts,
        adding = op === "+";
      answerIs(adding ? a + b : a - b, `${a} ${op} ${b}`);
      if (adding && a + b > 99) bad.push(`${a} + ${b} is past 100`);
      if (!adding && a - b < 1) bad.push(`${a} − ${b} is not more than 0`);
      // the story's words say which way it goes: more come in, or some go out
      const goesOut = /buys?|puts \d+ \w+ in a bowl|are left/.test(prompt),
        comesIn = /more|in all|another/.test(prompt);
      if (adding ? goesOut || !comesIn : !goesOut || comesIn) bad.push(`the story's words don't match ${op}`);
      if (adding) {
        if (blockValue(fig) !== a + b) bad.push(`the blocks show ${blockValue(fig)}, not ${a} + ${b}`);
      } else {
        if (blockValue(fig) !== a) bad.push(`the blocks show ${blockValue(fig)}, not ${a}`);
        if (blockValue(shown) !== a || crossedOut(shown) !== b)
          bad.push(`the hint shows ${blockValue(shown)} with ${crossedOut(shown)} crossed out`);
        if (breaksTen(a, b) !== countOf(shown, /class="unit1 tr/g) > 0)
          bad.push("the hint breaks a ten when it shouldn't");
      }
    }
    if (facts.t === "jumpsFor") {
      // the right jumps start at a, take away exactly b, and stop at a ten on the way
      const { a, b } = facts;
      if (!breaksTen(a, b)) bad.push(`${a} − ${b} has enough ones`);
      onlyRight((svg) => {
        const moves = jumpMoves(svg),
          stops = jumpStops(svg);
        return stops[0] === a && sum(moves) === -b && stops.some((stop) => stop % 10 === 0);
      }, `jumps for ${a} − ${b}`);
    }
    if (facts.t === "countUp") {
      const { a, b, moves } = facts,
        stops = jumpStops(fig);
      answerIs(a - b, `${a} − ${b}`);
      if (sum(jumpMoves(fig)) !== a - b || stops[0] !== b || stops[stops.length - 1] !== a)
        bad.push(`the jumps go from ${stops[0]} to ${stops[stops.length - 1]} by ${moves}`);
    }
    if (facts.t === "showsN") onlyRight((svg) => blockValue(svg) === facts.n, `blocks for ${facts.n}`);
    if (facts.t === "breakOnes") {
      const { n } = facts;
      answerIs((n % 10) + 10, `${n} with a ten broken`);
      if (blockValue(shown) !== n || countOf(shown, /class="rod /g) !== Math.floor(n / 10) - 1)
        bad.push("the hint doesn't show a ten broken");
    }
    if (facts.t === "needs") {
      const { breakIt } = facts;
      onlyRight(
        (label) => {
          const [, x, sign, y] = plain(label).match(/(\d+) ([+−]) (\d+)/);
          return breakIt ? sign === "−" && breaksTen(+x, +y) : sign === "+" && newTen(+x, +y);
        },
        breakIt ? "a subtraction that breaks a ten" : "an addition that makes a new ten",
      );
      labels.forEach((label) => {
        if (evaluate(label) < 1 || evaluate(label) > 99) bad.push(`${label} is not within 100`);
      });
    }
    if (facts.t === "diagram") {
      // the whole (on top) is the total, and the parts are the part the story gives and a ?
      const { part, total } = facts;
      onlyRight((svg) => {
        const [top, ...parts] = textsIn(svg);
        return top === String(total) && parts.includes(String(part)) && parts.includes("?");
      }, `the diagram for ${part} and some making ${total}`);
    }
    if (facts.t === "startUnknown") {
      const { more, now } = facts;
      answerIs(now - more, `${now} − ${more}`);
      if (!prompt.includes("had some") || !prompt.includes(`${more} more`) || !prompt.includes(`has ${now} `))
        bad.push("the story doesn't give the change and the end");
    }
    if (facts.t === "equation") {
      // the right equation is true when ? is the amount that came or went
      const { adding, a, after } = facts,
        change = Math.abs(after - a);
      if (adding !== after > a) bad.push("the story's amounts go the wrong way");
      onlyRight((label) => {
        const [left, right] = plain(label).replace("?", change).split(" = ").map(evaluate);
        return left === right;
      }, "the equation for the story");
    }
    if (facts.t === "twoStep") {
      const { start, more, gone } = facts;
      answerIs(start + more - gone, `${start} + ${more} − ${gone}`);
      if (start + more > 99) bad.push(`${start} + ${more} is past 100`);
    }
    return bad;
  },
};
