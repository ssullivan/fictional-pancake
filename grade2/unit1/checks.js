/* Bug Hunt: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   problem's facts, from its picture (the counters, blocks, picture rows, and bars), and for compare stories from the story's
   own sentences, so a story that says "fewer" the wrong way round is caught. */
// questions a graph of counts can't answer (Lesson 11)
const CANNOT = [
  "Which snack tastes the best?",
  "How many apples are in the store?",
  "What time is snack time?",
  "What are the dogs’ names?",
  "Which pet is the cutest?",
  "How old is the oldest cat?",
  "Which book was the longest?",
  "What is Mai’s favorite book?",
  "How many pages did Diego read?",
];
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// the value of a sum or difference written out, like "10 + 4" or "15 − 6"
const evaluate = (expression) =>
  expression
    .split(/ (?=[+−] )/)
    .reduce((total, term) => total + (term[0] === "−" ? -1 : 1) * +term.replace(/^[+−] /, ""), 0);
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
// how many times a pattern shows up in some markup
const countOf = (markup, pattern) => (markup.match(pattern) || []).length;
// the counters in a ten-frame picture: yellow (a), blue (b), and crossed out
const counters = (svg) => ({
  a: countOf(svg, /class="ctr a/g),
  b: countOf(svg, /class="ctr b/g),
  gone: countOf(svg, /class="ctr [^"]*gone/g),
});
// the number base-ten blocks show: 10 for each rod and 1 for each small cube (of one color, cls, if given)
const blockValue = (svg, cls = "") =>
  10 * countOf(svg, new RegExp(`class="rod ${cls}`, "g")) + countOf(svg, new RegExp(`class="unit1 ${cls}`, "g"));
// a picture graph's rows, as how many pictures each row has (each row's markup starts with its label)
const picRowsIn = (svg) =>
  svg
    .split('<text class="lbl en"')
    .slice(1)
    .map((row) => countOf(row, /class="sticky|class="p-sun"|class="p-cloud"|class="p-rain"/g));
// a bar graph's bars, left to right, as the numbers they show (24 pixels a line, 1 a line)
const barsIn = (svg) =>
  [...svg.matchAll(/<rect class="bar [^"]*" x="[\d.]+" y="[\d.]+" width="[\d.]+" height="([\d.]+)"/g)].map(
    (m) => +m[1] / 24,
  );
// the numbers written on a tape diagram, and how many question marks
const tapeNumbers = (svg) =>
  [...svg.matchAll(/<text class="lbl[^"]*"[^>]*>([^<]*)<\/text>/g)]
    .map((m) => m[1])
    .filter((t) => /^(\d+|\?)$/.test(t));
// a compare story worked out from its own sentences: who has how many, how they compare, and what it asks
function solveStory(story) {
  const amounts = {};
  for (const [, name, n] of story.matchAll(/(\w+) has (\d+) \w+\./g)) amounts[name] = +n;
  const relation = story.match(/(\w+) has (\d+) (more|fewer) \w+ than (\w+)\./);
  // fill in the one amount the relation gives (first − second is ±n)
  if (relation) {
    const [, first, n, word, second] = relation,
      gap = (word === "more" ? 1 : -1) * +n;
    if (amounts[first] === undefined && amounts[second] !== undefined) amounts[first] = amounts[second] + gap;
    else if (amounts[second] === undefined && amounts[first] !== undefined) amounts[second] = amounts[first] - gap;
  }
  const howMany = story.match(/How many \w+ does (\w+) have\?/),
    howMore = story.match(/How many (more|fewer) \w+ does (\w+) have than (\w+)\?/);
  if (howMore) {
    const [, word, first, second] = howMore;
    return (word === "more" ? 1 : -1) * (amounts[first] - amounts[second]);
  }
  return howMany ? amounts[howMany[1]] : NaN;
}

module.exports = {
  limits: {
    facts: { dp: 0, nz: 2, max: 20 },
    ten: { dp: 0, nz: 2, max: 50 },
    pics: { dp: 0, nz: 2, max: 30 },
    bars: { dp: 0, nz: 2, max: 20 },
    compare: { dp: 0, nz: 2, max: 99 },
    boss: { dp: 0, nz: 2, max: 99 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      facts = p.facts || {},
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label)),
      fig = p.fig ? p.fig(false, false) : "",
      shown = p.fig ? p.fig(true, true) : "";
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and every choice
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
    // every equation it states is true, all the way along a chain like 8 + 6 = 10 + 4 = 14
    for (const [chain] of told.matchAll(/(?<![\d?] [+−] )\b\d+(?: [+−] \d+)*(?: = \d+(?: [+−] \d+)*)+/g)) {
      const values = chain.split(" = ").map(evaluate);
      if (values.some((v) => v !== values[0])) bad.push(`${chain} is wrong`);
    }
    if (/\b(he|she|his|her|him|hers)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    if (!facts.t) bad.push("no facts to check the answer with");
    // mc answers: exactly the right choice fits
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    // a typed answer is what the facts give
    const answerIs = (value, what) => {
      if (p.answer !== value) bad.push(`answer ${p.answer} should be ${value} (${what})`);
    };

    // ---------- adding and subtracting within 20 ----------
    if (facts.t === "add") {
      const { a, b } = facts;
      answerIs(a + b, `${a} + ${b}`);
      if (a + b > 20) bad.push(`${a} + ${b} is past 20`);
      const shows = counters(fig);
      if (shows.a !== a || shows.b !== b) bad.push(`the ten-frames show ${shows.a} and ${shows.b}, not ${a} and ${b}`);
    }
    if (facts.t === "take") {
      const { start, gone } = facts;
      answerIs(start - gone, `${start} − ${gone}`);
      const before = counters(fig),
        after = counters(shown);
      if (before.a !== start || before.gone)
        bad.push(`the ten-frames start with ${before.a} (${before.gone} crossed out)`);
      if (after.gone !== gone) bad.push(`the hint crosses out ${after.gone}, not ${gone}`);
    }
    if (facts.t === "family") {
      // a fact in the family is a true equation with the same three numbers
      const { a, b } = facts,
        family = [a, b, a + b].sort((x, y) => x - y).join(),
        inFamily = (label) =>
          (label.match(/\d+/g) || [])
            .map(Number)
            .sort((x, y) => x - y)
            .join() === family;
      onlyRight(inFamily, `in the family of ${a} + ${b} = ${a + b}`);
      if (labels.some((label) => label === `${a} + ${b} = ${a + b}`))
        bad.push("a choice repeats the fact in the question");
      const shows = fig.match(/class="cube a"/g).length + "," + fig.match(/class="cube b"/g).length;
      if (shows !== `${a},${b}`) bad.push(`the cubes show ${shows}, not ${a},${b}`);
    }
    if (facts.t === "missing") {
      const filled = facts.equation.replace("?", p.answer),
        [left, rightSide] = filled.split(" = ").map(evaluate);
      if (left !== rightSide) bad.push(`${filled} is not true`);
      if (Math.max(...facts.equation.match(/\d+/g).map(Number)) > 20) bad.push(`${facts.equation} is past 20`);
    }

    // ---------- making a ten, doubles, and tens and ones ----------
    if (facts.t === "makeTen") {
      const { a, b } = facts;
      onlyRight(
        (label) => evaluate(label) === a + b && label.startsWith("10 + "),
        `the same as ${a} + ${b} with a ten`,
      );
      const before = counters(fig),
        after = counters(shown);
      if (before.a !== a || before.b !== b) bad.push(`the ten-frames show ${before.a} and ${before.b}`);
      if (after.a + after.b !== a + b || countOf(shown, /ctr b moved/g) !== 10 - a)
        bad.push("the hint doesn't move the counters to make a ten");
    }
    if (facts.t === "double") {
      const { first, second } = facts;
      answerIs(first + second, `${first} + ${second}`);
      if (Math.abs(first - second) !== 1) bad.push(`${first} + ${second} is not a double and one more`);
    }
    if (facts.t === "tensOnes") {
      const { a, b } = facts,
        newTen = (a % 10) + (b % 10) >= 10;
      answerIs(a + b, `${a} + ${b}`);
      if (a + b > 50) bad.push(`${a} + ${b} is past 50`);
      if (newTen && b >= 10) bad.push(`${a} + ${b} makes a new ten with two two-digit numbers`);
      if (blockValue(fig, "a") !== a || blockValue(fig, "b") !== b)
        bad.push(`the blocks show ${blockValue(fig, "a")} and ${blockValue(fig, "b")}`);
      if (blockValue(shown) !== a + b) bad.push(`the joined blocks show ${blockValue(shown)}`);
    }

    // ---------- graphs ----------
    if (facts.ns) {
      const { ns } = facts,
        graph = /Picture graph/.test(fig) ? picRowsIn(fig) : barsIn(fig);
      if (graph.join() !== ns.join()) bad.push(`the graph shows ${graph}, not ${ns}`);
      if (new Set(ns).size !== ns.length) bad.push(`two categories have the same count: ${ns}`);
      if (ns.some((n) => n < 1 || n > 10)) bad.push(`a count is not from 1 to 10: ${ns}`);
      if (/Weather/.test(fig) && sum(ns) > 31) bad.push(`${sum(ns)} days is more than a month`);
      if (facts.t === "count") answerIs(ns[facts.at], `the ${facts.labels[facts.at]} row`);
      if (facts.t === "which") {
        const extreme = facts.most ? Math.max(...ns) : Math.min(...ns);
        answerIs(String(ns.indexOf(extreme)), facts.most ? "the most" : "the fewest");
        ns.forEach((n, i) => {
          if (!fig.includes(`data-id="${i}"`)) bad.push(`${facts.labels[i]} can't be tapped`);
        });
      }
      if (facts.t === "all") {
        answerIs(sum(ns), "every row");
        if (sum(ns) > 20) bad.push(`${sum(ns)} in all is past 20`);
      }
      if (facts.t === "more") {
        answerIs(ns[facts.big] - ns[facts.small], `${facts.labels[facts.big]} − ${facts.labels[facts.small]}`);
        // "how many more" names the bigger one first
        const lower = prompt.toLowerCase(),
          at = (i) => lower.indexOf(facts.labels[i].toLowerCase());
        if (!/more/.test(lower) || at(facts.big) < 0 || at(facts.big) > at(facts.small))
          bad.push(
            `the question doesn't ask how many more ${facts.labels[facts.big]} than ${facts.labels[facts.small]}`,
          );
      }
      if (facts.t === "two")
        answerIs(ns[facts.x] + ns[facts.y], `${facts.labels[facts.x]} and ${facts.labels[facts.y]}`);
      if (facts.t === "ask") onlyRight((label) => !CANNOT.includes(label), "a question the graph can answer");
    }

    // ---------- compare stories ----------
    if (facts.t === "compare" || facts.t === "tapeMatch") {
      const { small, big, diff } = facts,
        story = facts.t === "compare" ? prompt : prompt.replace(/ Which tape diagram matches the story\?$/, "");
      if (big !== small + diff) bad.push(`${small} + ${diff} is not ${big}`);
      if (big > 99) bad.push(`${big} is past 100`);
      if ((small % 10) + (diff % 10) > 9) bad.push(`${small} and ${diff} need a new ten`);
      const solved = solveStory(story);
      if (facts.t === "compare") answerIs(solved, "the story worked out");
      if (!Number.isFinite(solved)) bad.push(`can't work out the story: ${story}`);
      // the numbers the story gives are the ones on the tapes, with a ? for the one it asks
      const given = (story.match(/\d+/g) || [])
          .map(Number)
          .sort((x, y) => x - y)
          .join(),
        onTapes = (svg) =>
          tapeNumbers(svg)
            .filter((t) => t !== "?")
            .map(Number)
            .sort((x, y) => x - y)
            .join();
      if (facts.t === "compare") {
        if (onTapes(fig) !== given) bad.push(`the tapes show ${onTapes(fig)}, the story gives ${given}`);
        if (tapeNumbers(fig).filter((t) => t === "?").length !== 1) bad.push("the tapes need one ?");
      } else {
        p.choices.forEach((choice, i) => {
          const fits = onTapes(choice.label) === given;
          if (fits !== (choice.id === p.answer))
            bad.push(`Picture ${"ABC"[i]} ${fits ? "matches" : "doesn't match"} the story`);
          if (!choice.label.includes(`aria-label="Picture ${"ABC"[i]}"`))
            bad.push(`choice ${i + 1} isn't labeled Picture ${"ABC"[i]}`);
        });
      }
    }
    return bad;
  },
};
