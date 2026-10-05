/* Treasure Cove: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Every number stays within 1,000. */
const LIMITS = { dp: 0, nz: 3, max: 1000 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the aria-label of every picture in some markup, joined
const labelsIn = (html) => [...String(html).matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]).join(" | ");
// n rounded to the nearest multiple of unit, halfway up
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
// the value of an expression with +, −, and ×, where × goes first: "4 × 10 + 245" is 285
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    product = (term) => term.split(" × ").reduce((value, factor) => value * +factor, 1);
  let value = product(terms[0]);
  for (let i = 1; i < terms.length; i += 2) value += (terms[i] === "+" ? 1 : -1) * product(terms[i + 1]);
  return value;
}
// the moves of an open number line (jumps) from its label: "Jumps from 245: plus 100, minus 30" → {start, moves, landing}
function jumpsIn(fig) {
  const match = fig.match(/Jumps from (\d+): ([^|]*?)(?:, landing on (\d+|a question mark))?(?: \||$)/);
  if (!match) return null;
  const moves = match[2]
    .split(", ")
    .filter(Boolean)
    .map((move) => (move.startsWith("plus") ? 1 : -1) * +move.split(" ")[1]);
  return { start: +match[1], moves, landing: match[3] };
}
// the numbers that make sense in each story: [lowest, highest] for its first number (a) and its second (b)
const ADD_RANGES = {
  ferry: { a: [100, 500], b: [100, 450] },
  shells: { a: [100, 600], b: [20, 300] },
  postcards: { a: [100, 500], b: [100, 400] },
  miles: { a: [100, 400], b: [100, 400] },
  coins: { a: [100, 700], b: [50, 250] },
};
const SUB_RANGES = {
  sold: { a: [200, 900], b: [100, 800] },
  room: { a: [300, 900], b: [100, 800] },
  trail: { a: [300, 900], b: [100, 800] },
  compare: { a: [200, 900], b: [100, 800] },
  "got-on": { a: [200, 900], b: [100, 800] },
  spent: { a: [200, 900], b: [100, 800] },
};
// each two-step story's answer from its numbers, and the numbers that make sense for it
const TWO_STEPS = {
  sold: {
    answer: ([a, b, c]) => a - b - c,
    ranges: [
      [300, 900],
      [50, 300],
      [50, 300],
    ],
  },
  goal: {
    answer: ([goal, a, b]) => goal - a - b,
    ranges: [
      [400, 900],
      [100, 400],
      [60, 300],
    ],
  },
  crates: {
    answer: ([groups, each, extra]) => groups * each + extra,
    ranges: [
      [3, 9],
      [4, 10],
      [100, 600],
    ],
  },
  more: {
    answer: ([a, more]) => a + a + more,
    ranges: [
      [100, 400],
      [20, 150],
    ],
  },
  fewer: {
    answer: ([a, fewer]) => a + a - fewer,
    ranges: [
      [150, 450],
      [20, 120],
    ],
  },
};
const inRange = (n, [lo, hi]) => n >= lo && n <= hi;

module.exports = {
  limits: {
    place: LIMITS,
    add: LIMITS,
    subtract: LIMITS,
    round: LIMITS,
    estimate: LIMITS,
    twostep: LIMITS,
    boss: LIMITS,
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      labels = (p.choices || []).map((c) => plain(c.label)),
      fig = p.fig ? labelsIn(p.fig(false)) : "",
      shown = p.fig ? labelsIn(p.fig(true)) : "";
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
    // every sum, difference, and product it states is right, and so is every rounding and halfway point
    for (const [text, expression, total] of told.matchAll(/(?<![\d+−×] )\b(\d+(?: [+−×] \d+)+) = (\d+)\b(?! [+−×])/g))
      if (evaluate(expression) !== +total) bad.push(`${text} is wrong`);
    for (const [text, n, place, rounded] of told.matchAll(/\b(\d+) rounded to the nearest (ten|hundred) is (\d+)/g))
      if (roundTo(+n, place === "ten" ? 10 : 100) !== +rounded) bad.push(`${text} is wrong`);
    for (const [text, low, high, halfway] of told.matchAll(/between (\d+) and (\d+)\. Halfway is (\d+)/g))
      if (+low + +high !== 2 * halfway || ![10, 100].includes(high - low)) bad.push(`${text} is wrong`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other;
    // what says what fitting means
    function onlyRight(fits, what) {
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label.slice(0, 50)} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    }
    // the answer worked out again from the numbers the problem was made from, and those numbers are the picture's
    const { a, b } = facts;
    if (facts.t === "blocks") {
      const { hundreds, tens, ones } = facts;
      if (p.answer !== hundreds * 100 + tens * 10 + ones) bad.push(`the blocks show ${hundreds}${tens}${ones}`);
      if (!fig.includes(`${hundreds} hundreds, ${tens} tens, and ${ones} ones`))
        bad.push("the picture isn't the blocks");
    }
    if (facts.t === "expanded") {
      const places = facts.parts.map((part) => String(part).length);
      if (facts.parts.some((part) => !/^[1-9]0*$/.test(String(part))) || new Set(places).size !== places.length)
        bad.push(`${facts.parts.join(" + ")} isn't one number in expanded form`);
      if (p.answer !== facts.parts.reduce((sum, part) => sum + part, 0))
        bad.push(`${facts.parts.join(" + ")} isn't ${p.answer}`);
      if (!prompt.includes(facts.parts.join(" + "))) bad.push("the prompt isn't the expanded form");
    }
    if (facts.t === "trade") {
      if (!prompt.includes(`make ${facts.n}?`)) bad.push("the prompt isn't the number");
      onlyRight((label) => {
        const [, h, t, o] = label.match(/(\d+) hundreds?, (\d+) tens?, (\d+) ones?/) || [];
        return h * 100 + t * 10 + +o === facts.n;
      }, `another way to make ${facts.n}`);
    }
    if (facts.t === "tapline") {
      const { lo, target } = facts;
      if (+p.answer !== target || !prompt.includes(`where ${target} goes`)) bad.push(`the answer isn't ${target}`);
      if (!fig.includes(`Number line from ${lo} to ${lo + 100}, a tick every 10`))
        bad.push("the picture isn't the line");
      if ((target - lo) % 10 || target <= lo || target >= lo + 100) bad.push(`${target} isn't a tick between the ends`);
      if (!p.fig(false).includes(`data-id="${target}"`)) bad.push(`no tick for ${target}`);
    }
    if (facts.t === "story") {
      const ranges = (facts.op === "+" ? ADD_RANGES : SUB_RANGES)[facts.id],
        answer = facts.op === "+" ? a + b : a - b;
      if (p.answer !== answer) bad.push(`${a} ${facts.op} ${b} isn't ${p.answer}`);
      if (!ranges) bad.push(`no story ${facts.id}`);
      else if (!inRange(a, ranges.a) || !inRange(b, ranges.b))
        bad.push(`${a} and ${b} don't make sense in the ${facts.id} story`);
      if (facts.op === "−" && answer < 20) bad.push("less than 20 left");
      if (!prompt.includes(String(a)) || !prompt.includes(String(b))) bad.push("the story isn't these numbers");
      if (!fig.includes(`${a} ${facts.op === "+" ? "plus" : "minus"} ${b} in columns`))
        bad.push("the picture isn't the problem");
    }
    if (facts.t === "jumps" || facts.t === "takeAway") {
      const line = jumpsIn(shown),
        answer = facts.t === "jumps" ? a + b : a - b;
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (!line || line.start !== a || line.moves.reduce((sum, move) => sum + move, 0) !== answer - a)
        bad.push(`the jumps don't go from ${a} to ${answer}`);
    }
    if (facts.t === "countUp") {
      const line = jumpsIn(fig);
      if (p.answer !== a - b) bad.push(`${a} − ${b} isn't ${p.answer}`);
      if (
        !line ||
        line.start !== b ||
        +line.landing !== a ||
        line.moves.reduce((sum, move) => sum + move, 0) !== p.answer
      )
        bad.push(`the jumps don't go from ${b} to ${a}`);
    }
    if (facts.t === "expandedSum") {
      const [, places] = shown.match(/added by place: ([\d, ]+)/) || [];
      if (p.answer !== a + b) bad.push(`${a} + ${b} isn't ${p.answer}`);
      if (!places || places.split(", ").reduce((sum, part) => sum + +part, 0) !== a + b)
        bad.push("the places don't add up");
    }
    if (facts.t === "friendly") onlyRight((label) => evaluate(label) === a + b, `the same sum as ${a} + ${b}`);
    if (facts.t === "zeros") {
      if (p.answer !== a - b) bad.push(`${a} − ${b} isn't ${p.answer}`);
      if (Math.floor(a / 10) % 10 !== 0) bad.push(`${a} has tens`);
    }
    if (facts.t === "rewrite") {
      const bPlaces = [Math.floor(b / 100) * 100, (Math.floor(b / 10) % 10) * 10, b % 10];
      onlyRight((label) => {
        const parts = label.split(" + ").map(Number);
        return (
          parts.length === 3 &&
          parts[0] % 100 === 0 &&
          parts[1] % 10 === 0 &&
          parts.reduce((sum, part) => sum + part, 0) === a &&
          parts.every((part, i) => part >= bPlaces[i])
        );
      }, `${a} written so each place can take away ${b}`);
    }
    if (facts.t === "round") {
      if (p.answer !== roundTo(facts.n, facts.unit)) bad.push(`${facts.n} rounds to ${roundTo(facts.n, facts.unit)}`);
      if (!fig.includes(`a point at ${facts.n}`)) bad.push("the point isn't the number");
    }
    if (facts.t === "roundsTo")
      onlyRight((label) => roundTo(+label, facts.unit) === facts.target, `a number that rounds to ${facts.target}`);
    if (facts.t === "edge") {
      const { target, unit } = facts,
        rounding = [];
      for (let n = target - unit; n <= target + unit; n++) if (roundTo(n, unit) === target) rounding.push(n);
      const answer = facts.smallest ? rounding[0] : rounding[rounding.length - 1];
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
    }
    if (facts.t === "estimate") {
      const { op, unit } = facts,
        estimate = op === "+" ? roundTo(a, unit) + roundTo(b, unit) : roundTo(a, unit) - roundTo(b, unit),
        exact = op === "+" ? a + b : a - b;
      if (p.answer !== estimate) bad.push(`the estimate is ${estimate}`);
      if (estimate === exact) bad.push("the estimate is the exact answer");
      if (!prompt.includes(`${a} ${op} ${b}`)) bad.push("the prompt isn't the problem");
    }
    if (facts.t === "sense") {
      const { op, claim } = facts,
        exact = op === "+" ? a + b : a - b,
        estimate = op === "+" ? roundTo(a, 100) + roundTo(b, 100) : roundTo(a, 100) - roundTo(b, 100);
      if (claim === exact ? Math.abs(claim - estimate) > 60 : Math.abs(claim - estimate) < 100)
        bad.push(`${claim} vs the estimate ${estimate} doesn't tell right from wrong`);
      onlyRight((label) => label.startsWith("Yes") === (claim === exact), "whether it makes sense");
      if (!prompt.includes(`${a} ${op} ${b} is ${claim}`)) bad.push("the prompt isn't the claim");
    }
    if (facts.t === "two") {
      const story = TWO_STEPS[facts.id],
        answer = story ? story.answer(facts.nums) : NaN;
      if (!story) bad.push(`no story ${facts.id}`);
      else if (facts.nums.some((n, i) => !inRange(n, story.ranges[i])))
        bad.push(`${facts.nums.join(", ")} don't make sense in the ${facts.id} story`);
      if (!(answer >= 30)) bad.push(`the answer ${answer} is too small`);
      if (facts.nums.some((n) => !prompt.includes(String(n)))) bad.push("the story isn't these numbers");
      if (p.kind === "num" && p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (p.kind === "mc")
        onlyRight((label) => {
          const [expression, letter] = label.split(" = ");
          return /^[a-z]$/.test(letter) && evaluate(expression) === answer;
        }, `an equation for ${answer}`);
    }
    return bad;
  },
};
