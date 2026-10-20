/* Frog Hop: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its number lines: it reads where each dot, hop, and tap target sits against the numbers under the
   line, so a dot drawn in the wrong place or a hop labelled the wrong way is caught. */
const LIMITS = { dp: 0, nz: 2, max: 99 };
// the text without its markup, with < and > written out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// the value of a sum or difference written out, like "45 + 10 + 10 + 2"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
// a number line read back: value(x) turns a place across the picture into a number, from the numbers under the line
function readLine(svg) {
  const axis = svg.match(/<line class="axis" x1="[\d.]+" y1="([\d.]+)"/),
    belowY = axis ? +axis[1] + 22 : NaN,
    // the numbers under the line: tick numbers, and numbers written under dots (which hide the tick numbers near them)
    marks = [...svg.matchAll(/<text class="lbl[^"]*" x="([\d.]+)" y="([\d.]+)">(\d+)<\/text>/g)]
      .filter((m) => Math.abs(+m[2] - belowY) < 0.5)
      .map((m) => [+m[1], +m[3]])
      .sort((m1, m2) => m1[0] - m2[0]);
  if (marks.length < 2) return null;
  const [[x0, v0], [x1, v1]] = marks,
    value = (x) => Math.round(v0 + ((x - x0) * (v1 - v0)) / (x1 - x0));
  return {
    value,
    // each dot's number, and the word written under it (a letter, a number, or ?)
    dots: [...svg.matchAll(/<circle class="pt[^"]*" cx="([\d.]+)"/g)].map((m) => value(+m[1])),
    dotWords: Object.fromEntries(
      [...svg.matchAll(/<text class="lbl[^"]* (?:cy|gd)" x="([\d.]+)" y="([\d.]+)">([^<]*)<\/text>/g)]
        .filter((m) => Math.abs(+m[2] - belowY) < 0.5)
        .map((m) => [m[3], value(+m[1])]),
    ),
    // each hop: where it starts and the jump written on it (+4 or −10 as a number, or the plain number on an unsigned hop)
    hops: [...svg.matchAll(/<path class="hop[^"]*" d="M([\d.]+),/g)].map((m) => value(+m[1])),
    hopWords: [...svg.matchAll(/<text class="lbl[^"]*" x="[\d.]+" y="([\d.]+)">([+−]?\d+|\?)<\/text>/g)]
      .filter((m) => +m[1] < belowY - 30)
      .map((m) => m[2]),
  };
}
// a signed jump as written ("+4", "−10") as a number
const signed = (word) => (word[0] === "−" ? -1 : 1) * +word.replace(/^[+−]/, "");

module.exports = {
  limits: { line: LIMITS, compare: LIMITS, jumps: LIMITS, tens: LIMITS, stories: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => (c.label.startsWith("<svg") ? "" : plain(c.label))),
      fig = p.fig ? p.fig(false, false) : "",
      shown = p.fig ? p.fig(true, true) : "",
      drawn = fig ? readLine(fig) : null,
      hinted = shown ? readLine(shown) : null;
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      // the right choice (a wrong choice like 47 = 74 is false on purpose)
      ...labels.filter((label, i) => p.choices[i].id === p.answer),
    ]
      .map(plain)
      .join(" ");
    // every equation it states is true, and every number is within 100
    for (const [chain] of told.matchAll(/(?<![\d?] [+−] )\b\d+(?: [+−] \d+)*(?: = \d+(?: [+−] \d+)*)+/g)) {
      const values = chain.split(" = ").map(evaluate);
      if (values.some((v) => v !== values[0])) bad.push(`${chain} is wrong`);
    }
    for (const [n] of [prompt, ...labels].join(" ").matchAll(/\d+/g)) if (+n > 99) bad.push(`${n} is past 100`);
    if (/\b(he|she|his|her|him|hers)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    if (!facts.t) bad.push("no facts to check the answer with");
    if (p.fig && !drawn && facts.t !== "made") bad.push("can't read the number line");
    const onlyRight = (fits, what) =>
      p.choices.forEach((choice, i) => {
        const ok = fits(choice.label.startsWith("<svg") ? choice.label : plain(choice.label));
        if (ok !== (choice.id === p.answer)) bad.push(`choice ${i + 1} ${ok ? "is" : "is not"} ${what}`);
      });
    const answerIs = (value, what) => {
      if (p.answer !== value) bad.push(`answer ${p.answer} should be ${value} (${what})`);
    };
    (p.choices || []).forEach((choice, i) => {
      if (choice.label.startsWith("<svg") && !choice.label.includes(`aria-label="Picture ${"ABC"[i]}"`))
        bad.push(`picture choice ${i + 1} isn't labeled Picture ${"ABC"[i]}`);
    });
    // the dots drawn are at these numbers
    const dotsAre = (line, values, what) => {
      if (line && line.dots.join() !== values.join()) bad.push(`${what}: dots at ${line.dots}, not ${values}`);
    };

    if (facts.t === "dot") {
      dotsAre(drawn, [facts.v], "the dot");
      answerIs(drawn && drawn.dots[0], "where the dot is");
      if (drawn && drawn.dotWords["?"] !== facts.v) bad.push("the ? isn't under the dot");
    }
    if (facts.t === "tapAt") {
      // the tap target for the answer sits over the tick for that number
      const target = fig.match(
        new RegExp(`<rect class="cand hit" data-id="${facts.v}"[^>]* x="([\\d.]+)" y="[\\d.]+" width="([\\d.]+)"`),
      );
      answerIs(String(facts.v), "the number asked for");
      if (!target || !drawn || drawn.value(+target[1] + +target[2] / 2) !== facts.v)
        bad.push(`the target for ${facts.v} isn't at ${facts.v}`);
    }
    if (facts.t === "made") {
      // the right number line has equal spaces and numbers that go up by 1
      onlyRight((svg) => {
        const marks = [...svg.matchAll(/<text class="lbl" x="([\d.]+)" y="[\d.]+">(\d+)<\/text>/g)].map((m) => [
            +m[1],
            +m[2],
          ]),
          gaps = marks.slice(1).map(([x], i) => x - marks[i][0]),
          steps = marks.slice(1).map(([, v], i) => v - marks[i][1]);
        return gaps.every((g) => g === gaps[0]) && steps.every((s) => s === 1);
      }, "made the right way");
    }
    if (facts.t === "compare") {
      const { a, b } = facts;
      dotsAre(drawn, [a, b], "the numbers to compare");
      onlyRight((label) => {
        const [, x, sign, y] = label.match(/(\d+) ([<>=]) (\d+)/);
        return sign === ">" ? +x > +y : sign === "<" ? +x < +y : +x === +y;
      }, "true");
    }
    if (facts.t === "estimate") {
      const { v } = facts,
        guesses = labels.map((label) => +label.match(/\d+/)[0]),
        closest = guesses.reduce((best, g) => (Math.abs(g - v) < Math.abs(best - v) ? g : best));
      dotsAre(drawn, [v], "the dot");
      onlyRight((label) => +label.match(/\d+/)[0] === closest, `the closest estimate to ${v}`);
      if (guesses.some((g) => g !== closest && Math.abs(g - v) < 20)) bad.push(`two estimates are close to ${v}`);
    }
    if (facts.t === "whichDot") {
      const { target, order } = facts;
      dotsAre(drawn, order, "the lettered dots");
      onlyRight((label) => drawn && drawn.dotWords[label.replace("Dot ", "")] === target, `the dot at ${target}`);
    }
    if (facts.t === "hop") {
      const { start, move } = facts;
      answerIs(start + move, `${start} ${move > 0 ? "+" : "−"} ${Math.abs(move)}`);
      if (!prompt.includes(`hops ${Math.abs(move)} to the ${move > 0 ? "right" : "left"}`))
        bad.push("the prompt hops the wrong way");
      dotsAre(drawn, [start], "the start");
      if (hinted && (hinted.hops[0] !== start || signed(hinted.hopWords[0]) !== move))
        bad.push("the hint's hop is wrong");
    }
    if (facts.t === "jumpEq") {
      const { start, move } = facts;
      if (drawn && (drawn.hops[0] !== start || drawn.dots.join() !== `${start},${start + move}`))
        bad.push("the jump is drawn wrong");
      onlyRight((label) => {
        const [, x, sign, y, z] = label.match(/(\d+) ([+−]) (\d+) = (\d+)/);
        return +x === start && +y === Math.abs(move) && (sign === "+") === move > 0 && +z === start + move;
      }, "the equation for the jump");
    }
    if (facts.t === "difference") {
      const { small, big } = facts;
      answerIs(big - small, `${big} − ${small}`);
      dotsAre(drawn, [small, big], "the two numbers");
      if (Math.floor(small / 10) === Math.floor(big / 10)) bad.push("the numbers don't cross a ten");
      if (hinted && sum(hinted.hopWords.map(signed)) !== big - small) bad.push("the hint's hops don't add up");
    }
    if (facts.t === "tensOnes" || facts.t === "toTen") {
      const { a, op } = facts,
        b = facts.t === "tensOnes" ? facts.b : facts.n,
        adding = op === "+",
        answer = adding ? a + b : a - b;
      answerIs(answer, `${a} ${op} ${b}`);
      if (answer < 1 || answer > 99) bad.push(`${a} ${op} ${b} is not within 100`);
      const crosses = Math.floor(a / 10) !== Math.floor(answer / 10) && answer % 10 !== 0;
      if (facts.t === "tensOnes" && (adding ? (a % 10) + (b % 10) > 9 : a % 10 < b % 10))
        bad.push(`${a} ${op} ${b} needs a new or broken ten`);
      if (facts.t === "toTen" && !crosses) bad.push(`${a} ${op} ${b} doesn't cross a ten`);
      // the hint's hops start at a and add up to the jump; jumping to a ten stops at the ten first
      if (hinted) {
        const moves = hinted.hopWords.map(signed);
        if (hinted.hops[0] !== a || sum(moves) !== (adding ? b : -b))
          bad.push(`the hint's hops ${moves} don't make ${a} ${op} ${b}`);
        if (facts.t === "toTen" && (a + moves[0]) % 10 !== 0) bad.push("the first hop doesn't land on a ten");
        if (facts.t === "tensOnes" && moves.slice(0, -1).some((m) => Math.abs(m) !== 10))
          bad.push("the hint doesn't jump by tens first");
      }
    }
    if (facts.t === "missing") {
      const [left, right] = facts.equation.replace("?", p.answer).split(" = ").map(evaluate);
      if (left !== right) bad.push(`${facts.equation} with ${p.answer} is not true`);
      const [a, b] = facts.equation.match(/\d+/g).map(Number);
      dotsAre(drawn, [a, b], "the start and end");
    }
    if (facts.t === "story" || facts.t === "storyLine") {
      const { a, n, adding } = facts,
        // the story's words: more come (gets, buys) or some go (gives away, plants, loses)
        more = /\b(gets|buys)\b/.test(prompt),
        fewer = /\b(gives away|plants|loses)\b/.test(prompt);
      if (more === fewer || more !== adding) bad.push("the story's words don't match its jump");
      if (facts.t === "story") {
        answerIs(adding ? a + n : a - n, `${a} ${adding ? "+" : "−"} ${n}`);
        dotsAre(drawn, [a], "the start");
      } else
        onlyRight((svg) => {
          const shownLine = readLine(svg);
          return !!shownLine && shownLine.hops[0] === a && signed(shownLine.hopWords[0]) === (adding ? n : -n);
        }, "the number line for the story");
    }
    return bad;
  },
};
