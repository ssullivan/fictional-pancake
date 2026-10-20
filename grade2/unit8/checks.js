/* Sweet Shop: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts and from its pictures: it counts the counters, pairs, tiles, and pieces, finds an array's rows and columns
   from where its counters sit, and checks that cut pieces really are same-size squares. */
const LIMITS = { dp: 0, nz: 2, max: 25 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum written out, like "4 + 4 + 4"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
// the counters in a picture: how many, and how many different rows and columns they sit in
function counterGrid(svg) {
  const spots = [...svg.matchAll(/<g class="ctr [^"]*"><circle cx="([\d.]+)" cy="([\d.]+)"/g)].map((m) => [
      +m[1],
      +m[2],
    ]),
    rows = new Set(spots.map(([, y]) => y)).size,
    cols = new Set(spots.map(([x]) => x)).size;
  return { count: spots.length, rows, cols, isArray: spots.length > 0 && rows * cols === spots.length };
}
// the pieces of a cut rectangle, as [width, height]
const piecesIn = (svg) =>
  [...svg.matchAll(/<rect class="pc[^"]*" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/g)].map((m) => [
    +m[1],
    +m[2],
  ]);
// k equal addends of v ("4 + 4 + 4" is 3 of 4)
const addendsOf = (text) => {
  const terms = text.split(" + ").map(Number);
  return terms.every((v) => v === terms[0]) ? [terms.length, terms[0]] : null;
};

module.exports = {
  limits: { share: LIMITS, oddeven: LIMITS, arrays: LIMITS, addends: LIMITS, rects: LIMITS, boss: LIMITS },
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
    // n counters in a picture, and odd and even numbers within 20
    const countersAre = (svg, n, what) => {
      if (counterGrid(svg).count !== n) bad.push(`${what} has ${counterGrid(svg).count} counters, not ${n}`);
    };
    if (facts.n !== undefined && (facts.n < 1 || facts.n > 20)) bad.push(`${facts.n} is not within 20`);

    if (facts.t === "share") {
      answerIs(facts.n / 2, `${facts.n} shared by 2`);
      if (facts.n % 2) bad.push(`${facts.n} can't be shared fairly by 2`);
      countersAre(fig, facts.n, "the pile");
      countersAre(shown, facts.n, "the plates");
    }
    if (facts.t === "partners") {
      onlyRight((label) => (facts.n % 2 ? /No, 1 student/.test(label) : /Yes/.test(label)), `right about ${facts.n}`);
      countersAre(shown, facts.n, "the pairs");
      if (countOf(shown, /class="pairbox"/g) !== Math.floor(facts.n / 2)) bad.push("the pairs are drawn wrong");
    }
    if (facts.t === "fair")
      onlyRight((label) => {
        const each = label.match(/each get (\d+)/);
        return each ? 2 * +each[1] === facts.n : facts.n % 2 === 1;
      }, `right about sharing ${facts.n}`);
    if (facts.t === "whichEven")
      onlyRight((label) => +label % 2 === (facts.even ? 0 : 1) && +label <= 20, facts.even ? "even" : "odd");
    if (facts.t === "byTwos") onlyRight((label) => +label % 2 === 0, "said when counting by 2s");
    if (facts.t === "twoRows") {
      answerIs(facts.n / 2, `${facts.n} in 2 equal rows`);
      if (countOf(shown, /class="pairbox"/g) !== facts.n / 2) bad.push("the hint's rows are wrong");
    }
    if (facts.t === "doublePlus") {
      onlyRight((label) => {
        const [a, b, one] = label.split(" + ").map(Number);
        return a === b && one === 1 && a + b + one === facts.n;
      }, `${facts.n} as a double and 1 more`);
      countersAre(fig, facts.n, "the picture");
    }
    if (facts.t === "isArray") {
      const { r, c } = facts;
      onlyRight((svg) => {
        const grid = counterGrid(svg);
        return grid.isArray && grid.rows === r && grid.cols === c;
      }, "an array");
    }
    if (facts.t === "rowsCols") {
      const { r, c, ask } = facts,
        grid = counterGrid(fig);
      answerIs(
        { rows: grid.rows, columns: grid.cols, row: grid.cols, column: grid.rows }[ask],
        `the ${ask} in the array`,
      );
      if (!grid.isArray || grid.rows !== r || grid.cols !== c) bad.push(`the array isn't ${r} by ${c}`);
    }
    if (facts.t === "whichTray") {
      const { r, c } = facts;
      if (!prompt.includes(`${r} rows`) || !prompt.includes(`with ${c} `))
        bad.push("the prompt doesn't give the rows and columns");
      onlyRight((svg) => {
        const grid = counterGrid(svg);
        return grid.isArray && grid.rows === r && grid.cols === c;
      }, `${r} rows of ${c}`);
    }
    if (facts.t === "total") {
      const { r, c } = facts,
        grid = counterGrid(fig);
      answerIs(grid.count, "the counters in the array");
      answerIs(r * c, `${r} rows of ${c}`);
      if (!grid.isArray || grid.rows !== r || grid.cols !== c) bad.push(`the array isn't ${r} by ${c}`);
      if (!prompt.includes(`${c} `)) bad.push("the prompt doesn't say how many are in each row");
    }
    if (facts.t === "notMatch") {
      // an equation matches when it adds the rows (r of c) or the columns (c of r)
      const { r, c } = facts;
      onlyRight((label) => {
        const [k, v] = addendsOf(label.split(" = ")[0]) || [];
        return !((k === r && v === c) || (k === c && v === r));
      }, `an equation that doesn't match ${r} rows of ${c}`);
    }
    if (facts.t === "tiles") {
      answerIs(countOf(fig, /class="tile"/g), "the tiles");
      answerIs(facts.r * facts.c, `${facts.r} rows of ${facts.c}`);
    }
    if (facts.t === "sameSquares")
      onlyRight((svg) => {
        const sizes = piecesIn(svg);
        return sizes.every(([w, h]) => w === h && w === sizes[0][0]);
      }, "cut into same-size squares");
    if (facts.t === "pan") {
      answerIs(piecesIn(fig).length, "the pieces in the pan");
      answerIs(facts.r * facts.c, `${facts.r} rows of ${facts.c}`);
    }
    if ((facts.r && facts.r > 5) || (facts.c && facts.c > 5)) bad.push(`the array has more than 5 rows or columns`);
    return bad;
  },
};
