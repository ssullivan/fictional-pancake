/* Toy Workshop: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Facts stay within 10 × 10; larger products
   are a one-digit number times a multiple of ten (up to 9 × 90), or within 100. */
const FACTS = { dp: 0, nz: 2, max: 100 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of an expression with +, −, ×, and ÷, where × and ÷ go first, left to right: "40 ÷ 4 + 16 ÷ 4" is 14
function evaluate(expression) {
  const terms = expression.split(/ ([+−]) /),
    /* a term's ×s and ÷s, left to right */
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
// how many in each group make sense for each story (the stories in stations.js have the same), and things with a fixed count
const EACH = {
  cars: [2, 10],
  marbles: [5, 10],
  wheels: [4, 4],
  stickers: [2, 10],
  bears: [2, 8],
  blocks: [3, 10],
  crayons: [4, 10],
};
// the sizes that packs of each thing come in
const PACK_SIZES = {
  crayons: [10, 20, 30],
  stickers: [10, 20, 30, 40],
  marbles: [20, 30, 40, 50],
  beads: [50, 60, 70, 80, 90],
  blocks: [20, 30, 40, 50, 60],
  "yo-yos": [12, 15, 16],
  markers: [12, 18, 24],
  "toy cars": [12, 15, 20, 25],
  balls: [11, 13, 14, 15],
};
const inRange = (n, [lo, hi]) => n >= lo && n <= hi;

module.exports = {
  limits: {
    groups: FACTS,
    unknown: FACTS,
    table: FACTS,
    rectangles: FACTS,
    multiply: { dp: 0, nz: 3, max: 810 },
    divide: FACTS,
    boss: { dp: 0, nz: 3, max: 810 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      labels = (p.choices || []).map((c) => plain(c.label)),
      figs = (p.choices || []).map((c) => c.label),
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
    // every equation it states is true, with a number or an expression on each side, and every product is a fact within
    // 10 × 10, a one-digit number times a multiple of ten, or a product within 100
    const expression = String.raw`\d+(?: [+−×÷] \d+)*`;
    for (const [text, left, rightSide] of told.matchAll(
      new RegExp(String.raw`(?<![\d+−×÷] )\b(${expression}) = (${expression})\b(?! [+−×÷])`, "g"),
    ))
      if (evaluate(left) !== evaluate(rightSide)) bad.push(`${text} is wrong`);
    for (const [text, a, b] of told.matchAll(/\b(\d+) × (\d+)\b/g)) {
      const [small, big] = [+a, +b].sort((x, y) => x - y);
      if (small > 10 || (big > 10 && small * big > 100 && !(small <= 9 && big % 10 === 0 && big <= 90)))
        bad.push(`${text} is too big a product`);
    }
    for (const [text, n, d] of told.matchAll(/\b(\d+) ÷ (\d+)\b/g)) if (n % d) bad.push(`${text} has a remainder`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label, i) holds for the right choice and no other;
    // what says what fitting means
    function onlyRight(fits, what) {
      labels.forEach((label, i) => {
        if (fits(label, i) !== (p.choices[i].id === p.answer))
          bad.push(`${label.slice(0, 50)} ${fits(label, i) ? "is" : "is not"} ${what}`);
      });
    }
    // the answer worked out again from the numbers the problem was made from, and those numbers are the picture's
    const { total, each, groups } = facts;
    if (["byGroups", "byEach", "meaning", "expression", "drawing"].includes(facts.t)) {
      if (!EACH[facts.id]) bad.push(`no story ${facts.id}`);
      if (!prompt.includes(String(total))) bad.push("the story isn't these numbers");
    }
    if (facts.t === "byGroups" || facts.t === "byEach") {
      if (groups * each !== total) bad.push(`${groups} groups of ${each} isn't ${total}`);
      if (!inRange(each, EACH[facts.id] || [0, 0]) || !inRange(groups, [2, 10]))
        bad.push(`${groups} groups of ${each} doesn't make sense for ${facts.id}`);
      const answer = facts.t === "byGroups" ? total / each : total / groups;
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (!prompt.includes(String(facts.t === "byGroups" ? each : groups))) bad.push("the story doesn't give the size");
      if (!shown.includes(`${groups} groups with ${each} in each`)) bad.push("the hint isn't the groups");
      if (!fig.includes(`${total} not in a group`)) bad.push("the picture isn't the total");
    }
    if (facts.t === "meaning") {
      const { n } = facts;
      if (total % n) bad.push(`${total} ÷ ${n} has a remainder`);
      if (!prompt.includes(`${total} ÷ ${n}`)) bad.push("the prompt isn't the expression");
      onlyRight((label) => {
        const shared = label.match(/^(\d+) .* shared equally into (\d+) \w+$/),
          inGroupsOf = label.match(/^(\d+) .* put into \w+ of (\d+)$/),
          division = shared || inGroupsOf;
        return !!division && +division[1] === total && +division[2] === n;
      }, `a meaning of ${total} ÷ ${n}`);
    }
    if (facts.t === "expression") {
      const { known, byGroups } = facts,
        answer = total / known;
      if (total % known) bad.push(`${total} ÷ ${known} has a remainder`);
      if (!inRange(byGroups ? known : answer, EACH[facts.id] || [0, 0])) bad.push("the group size doesn't make sense");
      onlyRight((label) => label === `${total} ÷ ${known}`, "the story's expression");
    }
    if (facts.t === "drawing") {
      if (!inRange(each, EACH[facts.id] || [0, 0])) bad.push("the group size doesn't make sense");
      onlyRight((label, i) => {
        const [, g, n] = figs[i].match(/aria-label="(\d+) groups with (\d+) in each"/) || [];
        return +g * +n === total && +n === each;
      }, `${total} in groups of ${each}`);
    }
    if (facts.t === "unknown") {
      const filled = facts.equation.replace("?", p.answer).split(" = ");
      if (evaluate(filled[0]) !== +filled[1]) bad.push(`${facts.equation} isn't true with ${p.answer}`);
      if (!prompt.includes(facts.equation)) bad.push("the prompt isn't the equation");
      const [, end, hops, size] = shown.match(/Number line from 0 to (\d+) with (\d+) hops of (\d+)/) || [];
      if (+end !== facts.product || +hops !== p.answer || hops * size !== facts.product)
        bad.push("the hops don't land on the product");
    }
    if (facts.t === "known") {
      const { a, b } = facts;
      if (p.answer !== (a * b) / a) bad.push(`${a * b} ÷ ${a} isn't ${p.answer}`);
      if (!fig.includes(`${a} rows with ${b} in each row`)) bad.push("the array isn't the fact");
    }
    if (facts.t === "family") {
      const { x, y } = facts;
      if (!prompt.includes(`${x} × ${y} = ${x * y}`)) bad.push("the prompt isn't the fact");
      onlyRight((label) => {
        const [lhs, value] = label.split(" = ");
        return evaluate(lhs) === +value && [x, y].includes(+value) && lhs.startsWith(`${x * y} ÷`);
      }, `a true division with ${x} × ${y}`);
    }
    if (facts.t === "dividend") {
      const { a, b } = facts;
      if (p.answer / a !== b) bad.push(`${p.answer} ÷ ${a} isn't ${b}`);
      if (!shown.includes(`${a} groups with ${b} in each`)) bad.push("the hint isn't the groups");
    }
    if (facts.t === "turn") {
      const { row, col } = facts;
      if (p.answer !== `${col}-${row}` || row === col) bad.push(`the turnaround of ${row} × ${col} is ${col}-${row}`);
      if (!fig.includes(`data-id="${p.answer}"`)) bad.push("no square to tap");
      if (!fig.includes(`data-id="${row}-${col}" tabindex`) || !/class="cand hc a" data-id="(\d+)-(\d+)"/.test(fig))
        bad.push("the gold square isn't lit");
      const [, goldRow, goldCol] = fig.match(/class="cand hc a" data-id="(\d+)-(\d+)"/) || [];
      if (+goldRow !== row || +goldCol !== col) bad.push(`the gold square is ${goldRow} × ${goldCol}`);
    }
    if (facts.t === "row") {
      const { n, missing } = facts;
      if (p.answer !== n * missing) bad.push(`${n} × ${missing} is ${n * missing}`);
      const products = (fig.match(/The row of \d+s: ([^"]*)"/) || [])[1].split(", ");
      products.forEach((product, i) => {
        if (product !== (i + 1 === missing ? "?" : String(n * (i + 1))))
          bad.push(`the row's ${i + 1}th square is wrong`);
      });
    }
    if (facts.t === "parity")
      onlyRight((label) => (evaluate(label) % 2 === 1) === facts.odd, facts.odd ? "odd" : "even");
    if (facts.t === "double") {
      const { small, factor } = facts;
      if (p.answer !== 2 * small * factor) bad.push(`${2 * small} × ${factor} is ${2 * small * factor}`);
      // a square's text is at its middle: 34 pixels a square, after a 2-pixel edge
      const textAt = (row, col) => `x="${2 + col * 34 + 17}" y="${2 + row * 34 + 17}">`;
      if (!fig.includes(textAt(small, factor) + small * factor + "<")) bad.push("the known product isn't in the table");
      if (!fig.includes(textAt(2 * small, factor) + "<") || !shown.includes(textAt(2 * small, factor) + p.answer + "<"))
        bad.push("the table gives the answer away, or the hint doesn't show it");
    }
    if (["area", "missing", "which", "fact"].includes(facts.t)) {
      const { rows } = facts,
        cut = facts.cut,
        rest = facts.rest ?? facts.cols - facts.cut,
        [, figRows, figCols, figCut, figRest] =
          shown.match(/A rectangle (\d+) squares tall and (\d+) long, cut into \d+ by (\d+) and \d+ by (\d+)/) || [];
      if (+figRows !== rows || +figCols !== cut + rest || +figCut !== cut || +figRest !== rest)
        bad.push("the picture isn't the rectangle");
      if (rows * (cut + rest) > 100 || rows > 10 || cut + rest > 10) bad.push("the rectangle is past 10 × 10");
      if (facts.t === "area" || facts.t === "fact")
        if (p.answer !== rows * (cut + rest)) bad.push(`the area is ${rows * (cut + rest)}`);
      if (facts.t === "missing" && p.answer !== rest) bad.push(`the missing side is ${rest}`);
      if (facts.t === "which")
        onlyRight((label) => evaluate(label) === rows * (cut + rest) && /×.*×/.test(label), "the area");
    }
    if (facts.t === "tens") {
      const { groups: tensGroups, tens } = facts;
      if (p.answer !== tensGroups * tens * 10) bad.push(`${tensGroups} × ${tens * 10} is ${tensGroups * tens * 10}`);
      if (
        !fig.includes(`${tensGroups} groups of ${tens} tens`) ||
        (fig.match(/class="rod/g) || []).length !== tensGroups * tens
      )
        bad.push("the blocks aren't the groups of tens");
    }
    if (facts.t === "tenPacks" || facts.t === "teenPacks") {
      const { thing, packs, size } = facts;
      if (!(PACK_SIZES[thing] || []).includes(size)) bad.push(`${thing} don't come in ${size}s`);
      if (p.answer !== packs * size) bad.push(`${packs} × ${size} is ${packs * size}`);
      const rods = (fig.match(/class="rod/g) || []).length,
        ones = (fig.match(/class="unit1/g) || []).length;
      if (rods * 10 + ones !== packs * size) bad.push("the blocks aren't the packs");
    }
    if (facts.t === "teen") {
      const { big, small } = facts;
      if (p.answer !== big * small) bad.push(`${small} × ${big} is ${big * small}`);
      if (!fig.includes(`Area diagram for ${big} × ${small}`)) bad.push("the diagram isn't the problem");
    }
    if (facts.t === "twoTimes") {
      const { packs, size, change, gave } = facts,
        answer = gave ? packs * size - change : packs * size + change;
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (answer < 10) bad.push("too few left");
      if (![packs, size, change].every((n) => prompt.includes(String(n)))) bad.push("the story isn't these numbers");
    }
    if (facts.t === "share" || facts.t === "whichSplit" || facts.t === "split" || facts.t === "bigStory") {
      const { n, divisor } = facts,
        quotient = n / divisor;
      if (!Number.isInteger(quotient) || quotient < 11 || quotient > 25 || n > 99)
        bad.push(`${n} ÷ ${divisor} isn't friendly`);
      if (facts.t === "whichSplit") onlyRight((label) => evaluate(label) === quotient, `${n} ÷ ${divisor}`);
      else if (p.answer !== quotient) bad.push(`${n} ÷ ${divisor} is ${quotient}`);
      if (facts.t === "share" && !shown.includes(`${n} shared into ${divisor} equal groups of ${quotient}`))
        bad.push("the blocks aren't shared");
      if (facts.t === "split" && (facts.parts[0] + facts.parts[1] !== n || facts.parts.some((part) => part % divisor)))
        bad.push(`${facts.parts.join(" and ")} don't split ${n} into parts to divide by ${divisor}`);
      if (facts.t === "bigStory" && facts.byGroups && divisor < 3) bad.push(`${divisor} in each bag or bin is too few`);
      if (
        facts.t === "bigStory" &&
        !shown.includes(
          `${divisor} tall with an area of ${n}, cut into ${divisor} × 10 and ${divisor} × ${quotient - 10}`,
        )
      )
        bad.push("the picture isn't the problem");
    }
    if (facts.t === "twoDivide") {
      const { packs, size, shops } = facts,
        answer = (packs * size) / shops;
      if (p.answer !== answer) bad.push(`the answer should be ${answer}`);
      if (![packs, size, shops].every((n) => prompt.includes(String(n)))) bad.push("the story isn't these numbers");
    }
    return bad;
  },
};
