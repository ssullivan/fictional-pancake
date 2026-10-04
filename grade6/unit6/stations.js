/* Balance Lab (Grade 6 Unit 6): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (hangers, area diagrams, graphs, and the letter helpers). Every problem carries facts for checks.js: its type (t)
   and the numbers its real-world checks need. Each generator deals one of a few kinds of problem (type), each with a comment
   saying what it asks. A letter for a number is written with withVars or mathVar, so it shows in italics. */
const WHO = ["Lin", "Andre", "Priya", "Diego", "Jada", "Noah", "Mai", "Kiran", "Elena", "Han", "Clare", "Tyler"];
/* a number as written, up to 3 decimal places, with commas */
const fmt = (n) => (Math.round(n * 1000) / 1000).toLocaleString("en-US", { maximumFractionDigits: 3 });
/* n rounded to 4 decimal places, to clear floating-point dust */
const r4 = (n) => Math.round(n * 1e4) / 1e4;
/* c times a letter as written: 3x, or just x when c is 1 */
const times = (c, letter) => (c === 1 ? letter : `${c}${letter}`);
/* a num problem: its named mistakes leave out any that aren't positive or land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}

/* ---------- Station 1: tape diagrams and equations (Lessons 1–2) ---------- */
function genTape() {
  const type = pick(["match", "match", "box", "box", "solution"]);
  if (type === "match") {
    /* which equation matches a tape: p equal pieces of x make q, or a piece x and a piece p make q */
    const isTimes = Math.random() < 0.5;
    if (isTimes) {
      const p = R(2, 5),
        x = R(2, 9),
        q = p * x;
      const right = pick([
        `${p}x = ${q}`,
        `${q} = ${p}x`,
        `${q} ÷ ${p} = x`,
        `${range(p)
          .map(() => "x")
          .join(" + ")} = ${q}`,
      ]);
      return mcP(
        [
          [withVars(right), null],
          [
            withVars(`x + ${p} = ${q}`),
            `That’s one piece x and one piece ${p}. This tape has ${p} equal pieces, each x.`,
          ],
          [
            withVars(`x = ${q} · ${p}`),
            `The whole tape is ${q}: the ${p} pieces of x make ${q}, so x is less than ${q}.`,
          ],
        ],
        {
          prompt: "Which equation matches this tape?",
          fig: () =>
            partWhole(
              range(p).map(() => ({ n: 1, show: "x" })),
              String(q),
              `Tape diagram: ${p} equal pieces, each x, make ${q}`,
            ),
          hint: `Count the pieces. ${p} equal pieces, each x, make the whole tape, ${q}.`,
          explain: withVars(`${p} pieces of x make ${q}: ${p}x = ${q}, so x = ${x}. Check: ${p} · ${x} = ${q} ✓`),
          facts: { t: type, nums: [p, q] },
        },
      );
    }
    const p = R(2, 9),
      x = R(2, 12),
      q = x + p;
    const right = pick([`x + ${p} = ${q}`, `${p} + x = ${q}`, `${q} = x + ${p}`, `${q} − ${p} = x`]);
    return mcP(
      [
        [withVars(right), null],
        [withVars(`${p}x = ${q}`), `${p}x means ${p} pieces, each x. This tape has one piece x and one piece ${p}.`],
        [
          withVars(`x = ${q} + ${p}`),
          `x is a part of the tape, so it’s less than the whole, ${q}: ${q} − ${p}, not ${q} + ${p}.`,
        ],
      ],
      {
        prompt: "Which equation matches this tape?",
        fig: () =>
          partWhole(
            [
              { n: x, show: "x" },
              { n: p, show: String(p) },
            ],
            String(q),
            `Tape diagram: x and ${p} make ${q}`,
          ),
        hint: `The tape has a piece x and a piece ${p}, and together they make ${q}.`,
        explain: withVars(`x and ${p} make ${q}: x + ${p} = ${q}, so x = ${x}. Check: ${x} + ${p} = ${q} ✓`),
        facts: { t: type, nums: [p, q] },
      },
    );
  }
  if (type === "box") {
    /* the number in the box that makes both sides the same amount: a + b = □ + c, or a · b = □ · c */
    if (Math.random() < 0.65) {
      const a = R(3, 12),
        b = R(2, 9),
        c = R(2, a + b - 1),
        answer = a + b - c;
      const equation = pick([`${a} + ${b} = □ + ${c}`, `□ + ${c} = ${a} + ${b}`, `${a} + ${b} = ${c} + □`]);
      return numP({
        prompt: `What number goes in the box to make this true?<br><b>${equation}</b>`,
        answer,
        hint: `The equal sign says both sides are the same amount. ${a} + ${b} = ${a + b}, so what plus ${c} makes ${a + b}?`,
        misc: [
          [
            a + b,
            `${a} + ${b} is ${a + b}, but the other side is □ + ${c}, not just □. What plus ${c} makes ${a + b}?`,
          ],
          [
            a + b + c,
            `That adds every number. The equal sign isn’t “the answer comes next”: it says both sides are the same amount.`,
          ],
        ],
        explain: `${a} + ${b} = ${a + b}, and ${answer} + ${c} = ${a + b} too, so the box is ${answer}.`,
        facts: { t: type },
      });
    }
    /* a · b = □ · c, where c goes into a · b and isn't a or b */
    let a, b, c;
    do {
      a = R(2, 9);
      b = R(2, 9);
      c = pick([2, 3, 4, 6]);
    } while ((a * b) % c || c === a || c === b || (a * b) / c === a * b - c);
    const answer = (a * b) / c;
    return numP({
      prompt: `What number goes in the box to make this true?<br><b>${a} · ${b} = □ · ${c}</b>`,
      answer,
      hint: `Both sides must be the same amount. ${a} · ${b} = ${a * b}, so what times ${c} makes ${a * b}?`,
      misc: [
        [a * b, `${a} · ${b} is ${a * b}, but the other side is □ · ${c}. What times ${c} makes ${a * b}?`],
        [a * b * c, `That multiplies every number. The equal sign says both sides are the same amount.`],
      ],
      explain: `${a} · ${b} = ${a * b}, and ${answer} · ${c} = ${a * b} too, so the box is ${answer}.`,
      facts: { t: type },
    });
  }
  /* which value is a solution: x + p = q, q = x + p, or p·x = q, tested by putting each value in */
  const form = pick(["plus", "right", "times"]);
  let p, x, q, text, value, work, wrongs;
  if (form === "times") {
    p = R(2, 6);
    x = R(2, 9);
    q = p * x;
    text = `${p}x = ${q}`;
    value = (v) => p * v;
    work = (v) => `${p} · ${v}`;
    wrongs = [q - p, q + p, q];
  } else {
    p = R(2, 9);
    x = R(2, 12);
    q = x + p;
    text = form === "plus" ? `x + ${p} = ${q}` : `${q} = x + ${p}`;
    value = (v) => v + p;
    work = (v) => `${v} + ${p}`;
    wrongs = [q + p, q, ...(q % p ? [] : [q / p])];
  }
  const shown = [...new Set(wrongs)].filter((v) => v > 0 && v !== x && value(v) !== q).slice(0, 3);
  return mcP(
    [
      [String(x), null],
      ...shown.map((v) => [
        String(v),
        withVars(`Put ${v} in for x: ${work(v)} = ${value(v)}, not ${q}. So ${v} makes it false.`),
      ]),
    ],
    {
      prompt: `Which value of ${mathVar("x")} is a solution to ${withVars(text)}?`,
      hint: `A solution makes the equation true. Put each value in for x and see which one makes both sides ${q}.`,
      explain: withVars(`Put ${x} in for x: ${work(x)} = ${q}, so the equation is true. ${x} is the solution.`),
      facts: { t: type, nums: [p, q] },
    },
  );
}

/* ---------- Station 2: hangers and solving equations (Lessons 3–5) ---------- */
function genHang() {
  const type = pick(["hanger", "hanger", "decimal", "decimal", "fraction", "bar"]);
  if (type === "hanger") {
    /* a balanced hanger: a circle and p squares balance q squares, or n circles balance m squares; what does a circle weigh? */
    if (Math.random() < 0.5) {
      const p = R(1, 4),
        x = R(1, 6),
        q = x + p;
      return numP({
        prompt: `This hanger is balanced. How much does one circle weigh, in unit squares?`,
        answer: x,
        unit: "squares",
        fig: (show) =>
          show
            ? hanger(
                ["x"],
                range(x).map(() => 1),
              )
            : hanger(
                ["x", ...range(p).map(() => 1)],
                range(q).map(() => 1),
              ),
        hint: `Take ${p} square${p === 1 ? "" : "s"} off each side. It stays balanced, and the circle is alone.`,
        misc: [
          [q + p, `That adds. To get the circle alone, take ${p} square${p === 1 ? "" : "s"} off each side.`],
          [q, `The circle shares its side with ${p} square${p === 1 ? "" : "s"}, so it weighs less than ${q}.`],
        ],
        explain: withVars(`x + ${p} = ${q}. Take ${p} off each side: x = ${x}. Check: ${x} + ${p} = ${q} ✓`),
        facts: { t: type, balance: [x + p, q] },
      });
    }
    let n, x, m;
    do {
      n = R(2, 4);
      x = R(2, 5);
      m = n * x;
    } while (m > 15 || m - n === x);
    return numP({
      prompt: `This hanger is balanced. How much does one circle weigh, in unit squares?`,
      answer: x,
      unit: "squares",
      fig: (show) =>
        show
          ? hanger(
              ["x"],
              range(x).map(() => 1),
            )
          : hanger(
              range(n).map(() => "x"),
              range(m).map(() => 1),
            ),
      hint: `Split each side into ${n} equal groups. One circle balances one group of squares.`,
      misc: [
        [
          m - n,
          `That takes ${n} squares away, but the left side is ${n} circles, not a circle and ${n} squares. Divide each side by ${n}.`,
        ],
        [m * n, `That multiplies. ${m} squares are shared equally among ${n} circles: divide each side by ${n}.`],
      ],
      explain: withVars(`${n}x = ${m}. Divide each side by ${n}: x = ${x}. Check: ${n} · ${x} = ${m} ✓`),
      facts: { t: type, balance: [n * x, m] },
    });
  }
  if (type === "decimal") {
    /* solve x + p = q or p·x = q with decimals */
    if (Math.random() < 0.5) {
      const p = pick([0.5, 1.5, 2.5, 0.25, 0.75, 1.25, 3.5, 4.5]),
        x = pick([0.5, 1, 1.5, 2, 2.5, 3, 4.5, 5, 6.5, 7, 8.5]),
        q = r4(x + p);
      return numP({
        prompt: `Solve: <b>${withVars(`x + ${fmt(p)} = ${fmt(q)}`)}</b>`,
        answer: x,
        hint: `Subtract ${fmt(p)} from each side, so x is alone.`,
        misc: [[r4(q + p), `That adds ${fmt(p)}. Subtracting undoes adding: subtract ${fmt(p)} from each side.`]],
        explain: withVars(
          `Subtract ${fmt(p)} from each side: x = ${fmt(q)} − ${fmt(p)} = ${fmt(x)}. Check: ${fmt(x)} + ${fmt(p)} = ${fmt(q)} ✓`,
        ),
        facts: { t: type, dec: [p, q, x] },
      });
    }
    const p = R(2, 5),
      x = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 1.6, 2.5, 3.5]),
      q = r4(p * x);
    return numP({
      prompt: `Solve: <b>${withVars(`${p}x = ${fmt(q)}`)}</b>`,
      answer: x,
      hint: `${p}x means ${p} times x. Divide each side by ${p}.`,
      misc: [
        [r4(q - p), `That subtracts ${p}. ${p}x means ${p} times x, so divide each side by ${p}.`],
        [r4(q * p), `That multiplies by ${p}. To undo times ${p}, divide each side by ${p}.`],
      ],
      explain: withVars(
        `Divide each side by ${p}: x = ${fmt(q)} ÷ ${p} = ${fmt(x)}. Check: ${p} · ${fmt(x)} = ${fmt(q)} ✓`,
      ),
      facts: { t: type, dec: [q, x] },
    });
  }
  if (type === "fraction") {
    /* solve x + a = b with fractions */
    let a, x, b;
    do {
      a = pick([frac(1, 2), frac(1, 4), frac(3, 4), frac(1, 3), frac(2, 3), frac(3, 2)]);
      x = frac(R(1, 11), pick([2, 3, 4, 6]));
      b = fAdd(x, a);
    } while (lcm(a[1], x[1]) > 12 || fVal(b) > 6 || isWhole(x));
    return numP({
      frac: true,
      prompt: `Solve: <b>${mathVar("x")} + ${fx(a)} = ${fx(b)}</b>`,
      answer: fVal(x),
      hint: `Subtract ${fx(a)} from each side.`,
      misc: [[fVal(fAdd(b, a)), `That adds ${fx(a)}. Subtracting undoes adding: subtract ${fx(a)} from each side.`]],
      explain: `Subtract ${fx(a)} from each side: ${mathVar("x")} = ${fx(b)} − ${fx(a)} = ${fx(x)}. Check: ${fx(x)} + ${fx(a)} = ${fx(b)} ✓`,
      facts: { t: type, f: [a, b, x] },
    });
  }
  /* p·x = q where q ÷ p isn't whole: x = q/p, which is q ÷ p */
  let p, q;
  do {
    p = pick([2, 3, 4, 5, 6, 8]);
    q = R(1, 12);
  } while (q % p === 0);
  const x = frac(q, p);
  return numP({
    frac: true,
    prompt: `Solve: <b>${withVars(`${p}x = ${q}`)}</b>`,
    answer: fVal(x),
    fig: (show) =>
      partWhole(
        range(p).map(() => ({ n: 1, show: show ? ftx(x) : "x" })),
        String(q),
        `Tape diagram: ${q} cut into ${p} equal parts`,
      ),
    hint: `${p} equal pieces make ${q}, so each piece is ${q} ÷ ${p}. A fraction bar means divide.`,
    misc: [
      [
        p / q,
        `That’s ${p} ÷ ${q}, the other way around. ${p}x = ${q} means ${p} equal parts make ${q}: x = ${q} ÷ ${p}.`,
      ],
      [p * q, `That multiplies. To undo times ${p}, divide each side by ${p}.`],
      [q - p, `That subtracts ${p}. ${p}x means ${p} times x, so divide each side by ${p}.`],
    ],
    explain: `${mathVar("x")} = ${q} ÷ ${p} = ${fr(q, p)}${x[0] > x[1] ? ` = ${fx(x)}` : ""}. Check: ${p} · ${fr(q, p)} = ${q} ✓`,
    facts: { t: type, f: [x] },
  });
}

/* ---------- Station 3: stories, expressions, and percents (Lessons 4, 6–7) ---------- */
/* letters for numbers in expressions (never a or i, which read as words) */
const LETTERS = ["n", "t", "m", "k", "p", "w", "y"];
/* phrases in words: what they mean, and two wrong expressions with why each is wrong (L the letter, c the number) */
const PHRASES = [
  (L, c) => [
    `${c} more than ${L}`,
    `${L} + ${c}`,
    [`${c}${L}`, `That’s ${c} times ${L}. “More than” means add.`],
    [`${L} − ${c}`, `That subtracts. “${c} more than ${L}” adds ${c} to ${L}.`],
  ],
  (L, c) => [
    `${c} less than ${L}`,
    `${L} − ${c}`,
    [
      `${c} − ${L}`,
      `${c} − ${L} starts at ${c} and takes ${L} away. “${c} less than ${L}” starts at ${L} and takes ${c} away.`,
    ],
    [`${L} + ${c}`, `“Less than” means subtract.`],
  ],
  (L, c) => [
    `${c} times ${L}`,
    `${c}${L}`,
    [`${L} + ${c}`, `That adds. “Times” means multiply.`],
    [`${L} ÷ ${c}`, `That divides. “Times” means multiply.`],
  ],
  (L, c) => [
    `${L} divided by ${c}`,
    `${L} ÷ ${c}`,
    [`${c} ÷ ${L}`, `That divides ${c} by ${L}. “${L} divided by ${c}” starts with ${L}.`],
    [`${c}${L}`, `That multiplies. “Divided by” means divide.`],
  ],
  (L, c) => [
    `${L} subtracted from ${c * 10}`,
    `${c * 10} − ${L}`,
    [`${L} − ${c * 10}`, `That starts at ${L}. “Subtracted from ${c * 10}” starts at ${c * 10} and takes ${L} away.`],
    [`${c * 10} + ${L}`, `“Subtracted” means take away.`],
  ],
];
/* stories with a letter for a number: the story and what the letter stands for, the right equation, wrong ones with why */
const STORIES = [
  () => {
    const packs = R(3, 8),
      each = R(4, 12),
      total = packs * each;
    return {
      story: `${packs} packs of pens hold ${total} pens in all, the same number in each. Let m be the number of pens in one pack.`,
      right: `${packs}m = ${total}`,
      wrong: [
        [
          `m + ${packs} = ${total}`,
          `That says one pack and ${packs} more pens make ${total}. There are ${packs} packs, each with m pens.`,
        ],
        [`${total} · ${packs} = m`, `${total} is all the pens: it’s the total. ${packs} groups of m make ${total}.`],
        [
          `${packs}p = ${total}m`,
          `That uses letters as labels (p for packs, m for pens). A letter stands for a number: how many pens are in one pack.`,
        ],
      ],
      solve: `m = ${total} ÷ ${packs} = ${each}. Check: ${packs} · ${each} = ${total} ✓`,
      facts: { count: [packs, each, total] },
    };
  },
  () => {
    const before = R(8, 30),
      more = R(4, 15),
      total = before + more;
    return {
      story: `After ${more} more people got on a bus, there were ${total} people on it. Let p be the number of people on the bus before.`,
      right: `p + ${more} = ${total}`,
      wrong: [
        [`${more}p = ${total}`, `That multiplies. ${more} more people got on, so ${more} is added to p.`],
        [`p = ${total} + ${more}`, `p is the number before more got on, so it’s less than ${total}.`],
        [`p − ${more} = ${total}`, `People got on, so the number went up: add ${more} to p.`],
      ],
      solve: `p = ${total} − ${more} = ${before}. Check: ${before} + ${more} = ${total} ✓`,
      facts: { count: [before, more, total] },
    };
  },
  () => {
    const price = pick([4.5, 6, 7.5, 8, 12.5, 9]),
      count = R(2, 6),
      total = r4(price * count),
      who = pick(WHO);
    return {
      story: `${who} paid $${total.toFixed(2)} for ${count} movie tickets that each cost the same. Let t be the cost of one ticket, in dollars.`,
      right: `${count}t = ${total.toFixed(2)}`,
      wrong: [
        [
          `t + ${count} = ${total.toFixed(2)}`,
          `That adds ${count} dollars. There are ${count} tickets, each costing t: ${count} times t.`,
        ],
        [
          `${total.toFixed(2)} · ${count} = t`,
          `$${total.toFixed(2)} is the total for all ${count} tickets, so one ticket costs less.`,
        ],
      ],
      solve: `t = ${total.toFixed(2)} ÷ ${count} = ${price.toFixed(2)}. Check: ${count} · ${price.toFixed(2)} = ${total.toFixed(2)} ✓`,
      facts: { money: [price, total], count: [count] },
    };
  },
];
/* percent contexts: the part is a percent of an unknown whole */
const PCT_STORIES = [
  (part, pct) => `${part} seats in a theater are filled. That’s ${pct}% of the seats. How many seats are there?`,
  (part, pct) =>
    `${pick(WHO)} has read ${part} pages of a book. That’s ${pct}% of the book. How many pages does the book have?`,
  (part, pct) =>
    `A tank has ${part} liters of water in it. That’s ${pct}% of what it holds when full. How many liters does a full tank hold?`,
];
const PCT_UNITS = ["seats", "pages", "liters"];
function genWrite() {
  const type = pick(["phrase", "phrase", "story", "story", "value", "pct", "pct"]);
  if (type === "phrase") {
    /* words to an expression */
    const L = pick(LETTERS),
      c = R(2, 12),
      [words, right, ...wrong] = pick(PHRASES)(L, c);
    return mcP([[withVars(right), null], ...wrong.map(([label, why]) => [withVars(label), withVars(why)])], {
      prompt: `Which expression means “${withVars(words)}”?`,
      hint: "Read it in order. “Less than” and “subtracted from” turn the order around.",
      explain: withVars(`“${words}” is ${right}.`),
      facts: { t: type },
    });
  }
  if (type === "story") {
    /* a story to an equation, with the letter defined as a number */
    const s = pick(STORIES)();
    return mcP([[withVars(s.right), null], ...s.wrong.map(([label, why]) => [withVars(label), withVars(why)])], {
      prompt: `${withVars(s.story)} Which equation fits?`,
      hint: "Say what is equal in the story: what the parts make, or what the groups make.",
      explain: withVars(`${s.right}, so ${s.solve}`),
      facts: { t: type, ...s.facts },
    });
  }
  if (type === "value") {
    /* the value of a + b·x or b·x − a for a value of x */
    const b = R(2, 9),
      c = R(2, 9),
      L = pick(LETTERS);
    if (Math.random() < 0.6) {
      const a = R(2, 15),
        answer = a + b * c;
      return numP({
        prompt: `What is ${withVars(`${a} + ${b}${L}`)} when ${withVars(`${L} = ${c}`)}?`,
        answer,
        hint: withVars(`${b}${L} means ${b} times ${L}. Multiply first, then add.`),
        misc: [
          [
            a + Number(`${b}${c}`),
            withVars(`${b}${L} means ${b} times ${L}, not the digits ${b} and ${c} side by side.`),
          ],
          [(a + b) * c, `That adds ${a} + ${b} first. Multiply first: ${b} · ${c} = ${b * c}, then add ${a}.`],
          [a + b + c, withVars(`That adds all three. ${b}${L} means ${b} times ${L}.`)],
        ],
        explain: withVars(`${b}${L} = ${b} · ${c} = ${b * c}, so ${a} + ${b}${L} = ${a} + ${b * c} = ${answer}.`),
        facts: { t: type },
      });
    }
    const a = R(1, b * c - 1),
      answer = b * c - a;
    return numP({
      prompt: `What is ${withVars(`${b}${L} − ${a}`)} when ${withVars(`${L} = ${c}`)}?`,
      answer,
      hint: withVars(`${b}${L} means ${b} times ${L}. Multiply first, then subtract.`),
      misc: [
        [
          Number(`${b}${c}`) - a,
          withVars(`${b}${L} means ${b} times ${L}, not the digits ${b} and ${c} side by side.`),
        ],
        [b * c + a, `That adds ${a}. The expression takes ${a} away.`],
      ],
      explain: withVars(`${b}${L} = ${b} · ${c} = ${b * c}, so ${b}${L} − ${a} = ${b * c} − ${a} = ${answer}.`),
      facts: { t: type },
    });
  }
  /* a percent of an unknown whole: 0.3x = 18, so x = 18 ÷ 0.3 */
  let pct, whole, part;
  do {
    pct = pick([10, 20, 25, 30, 40, 50, 60, 75, 80]);
    whole = 20 * R(2, 20);
    part = (pct * whole) / 100;
  } while (!Number.isInteger(part));
  const storyIndex = R(0, PCT_STORIES.length - 1),
    decimal = pct / 100;
  return numP({
    prompt: PCT_STORIES[storyIndex](part, pct),
    unit: PCT_UNITS[storyIndex],
    answer: whole,
    hint: withVars(`The whole is unknown: call it x. ${pct}% of x is ${fmt(decimal)}x, so ${fmt(decimal)}x = ${part}.`),
    misc: [
      [
        r4(part * decimal),
        `That’s ${pct}% of ${part}. But ${part} is the part, and the whole is unknown: ${fmt(decimal)}x = ${part}.`,
      ],
      [r4(part / pct), `That divides by ${pct}. ${pct}% is ${fmt(decimal)}, so divide by ${fmt(decimal)}.`],
      [part + pct, `That adds ${pct}, but ${pct}% isn’t ${pct} ${PCT_UNITS[storyIndex]}.`],
    ],
    explain: withVars(
      `${fmt(decimal)}x = ${part}, so x = ${part} ÷ ${fmt(decimal)} = ${whole}. Check: ${pct}% of ${whole} is ${part} ✓`,
    ),
    facts: { t: type, pct: [part, whole], count: [part, whole] },
  });
}

/* ---------- Station 4: equal and equivalent (Lesson 8) ---------- */
/* pairs of expressions that are equivalent: as written, and their value for x */
const SAME_PAIRS = [
  () => {
    const a = R(2, 6),
      b = R(2, 6);
    return [`${a}x + ${b}x`, `${a + b}x`, (x) => (a + b) * x, (x) => (a + b) * x];
  },
  () => {
    const b = R(2, 12);
    return [`x + ${b}`, `${b} + x`, (x) => x + b, (x) => x + b];
  },
  () => {
    const a = R(2, 6),
      b = R(1, 6);
    return [`${a}(x + ${b})`, `${a}x + ${a * b}`, (x) => a * (x + b), (x) => a * x + a * b];
  },
  () => {
    const n = R(2, 4);
    return [
      range(n)
        .map(() => "x")
        .join(" + "),
      `${n}x`,
      (x) => n * x,
      (x) => n * x,
    ];
  },
];
function genEquiv() {
  const type = pick(["combine", "combine", "same", "same", "differ", "meet"]);
  if (type === "combine") {
    /* ax + bx or ax − bx as one term */
    const a = R(3, 9),
      add = Math.random() < 0.5,
      b = R(1, add ? 6 : a - 2),
      result = add ? a + b : a - b,
      other = add ? a - b : a + b,
      expr = `${a}x ${add ? "+" : "−"} ${times(b, "x")}`;
    return mcP(
      [
        [withVars(`${result}x`), null],
        [
          String(result),
          withVars(`${expr} is ${result} x’s, not just ${result}. Try x = 2: ${result * 2}, not ${result}.`),
        ],
        [
          withVars(times(other, "x")),
          add ? "That subtracts. The expression adds the x’s." : "That adds. The expression takes x’s away.",
        ],
      ],
      {
        prompt: `Which expression is equivalent to ${withVars(expr)}?`,
        hint: withVars(`${a} x’s ${add ? "and" : "take away"} ${b} x’s.`),
        explain: withVars(
          `${a} x’s ${add ? "and" : "take away"} ${b} x’s ${add ? "make" : "leaves"} ${result} x’s: ${expr} = ${result}x. Check with x = 2: ${add ? a * 2 + b * 2 : a * 2 - b * 2} = ${result * 2} ✓`,
        ),
        facts: { t: type, coef: [a, b] },
      },
    );
  }
  if (type === "same") {
    /* a pair that is equivalent: equal for every value */
    const [left, right, leftValue] = pick(SAME_PAIRS)(),
      try3 = leftValue(3);
    return mcP(
      [
        ["Yes: they’re equal for every value of x", null],
        [withVars(`No: they’re different at x = 2`), withVars(`Try it: at x = 2, both are ${leftValue(2)}.`)],
        [withVars(`Only when x = 1`), withVars(`They’re equal for other values too: at x = 3, both are ${try3}.`)],
      ],
      {
        prompt: `Are ${withVars(left)} and ${withVars(right)} equivalent?`,
        stack: true,
        hint: "Try a few values of x in both. Then think about why they would always match.",
        explain: withVars(
          `${left} and ${right} are equal for every value of x (at x = 3, both are ${try3}), so they’re equivalent.`,
        ),
        facts: { t: type },
      },
    );
  }
  if (type === "differ") {
    /* a·x and x + b, equal only at x = m: not equivalent */
    const a = R(2, 5),
      m = R(1, 4),
      b = (a - 1) * m,
      k = m + 1;
    return mcP(
      [
        [withVars(`No: at x = ${k} they’re ${a * k} and ${k + b}`), null],
        [
          withVars(`Yes: both are ${a * m} when x = ${m}`),
          withVars(
            `Equal at one value isn’t enough. Equivalent means equal for every value, and at x = ${k} they’re ${a * k} and ${k + b}.`,
          ),
        ],
        [
          withVars(`Yes: both have x in them`),
          withVars(`Having the same letter doesn’t make them equal. At x = ${k} they’re ${a * k} and ${k + b}.`),
        ],
      ],
      {
        prompt: `Are ${withVars(`${a}x`)} and ${withVars(`x + ${b}`)} equivalent?`,
        stack: true,
        hint: "Try a few values of x in both. One value where they differ is enough.",
        explain: withVars(
          `At x = ${k}, ${a}x is ${a * k} but x + ${b} is ${k + b}, so they aren’t equivalent (they’re equal only at x = ${m}).`,
        ),
        facts: { t: type },
      },
    );
  }
  /* the one value where a·x and x + b are equal */
  let a, m, b;
  do {
    a = R(2, 5);
    m = R(2, 6);
    b = (a - 1) * m;
  } while (a * m > 60 || b === m || b / a === m);
  return numP({
    prompt: `For what value of ${mathVar("x")} are ${withVars(`${a}x`)} and ${withVars(`x + ${b}`)} equal?`,
    answer: m,
    hint: `Try values of x in both until they match. Start small.`,
    misc: [[b, withVars(`Try it: at x = ${b}, ${a}x is ${a * b} but x + ${b} is ${2 * b}.`)]],
    explain: withVars(
      `At x = ${m}: ${a} · ${m} = ${a * m}, and ${m} + ${b} = ${a * m} ✓. At any other value they differ, so they aren’t equivalent.`,
    ),
    facts: { t: type, coef: [a] },
  });
}

/* ---------- Station 5: the distributive property (Lessons 9–11) ---------- */
function genSplit() {
  const type = pick(["expand", "expand", "factor", "factor", "missing", "number"]);
  if (type === "expand") {
    /* a(x + b) or a(x − b) written without parentheses */
    const a = R(2, 9),
      b = R(1, 9),
      add = Math.random() < 0.6,
      sign = add ? "+" : "−",
      other = add ? "−" : "+";
    return mcP(
      [
        [withVars(`${a}x ${sign} ${a * b}`), null],
        [
          withVars(`${a}x ${sign} ${b}`),
          withVars(`The ${a} multiplies both parts: ${a} · x and ${a} · ${b} = ${a * b}.`),
        ],
        [withVars(`x ${sign} ${a * b}`), withVars(`The ${a} multiplies x too: ${a} groups of x is ${a}x.`)],
        [
          withVars(`${a}x ${other} ${a * b}`),
          add
            ? `The ${b} is added, so ${a} · ${b} is added too.`
            : `The ${b} is taken away, so ${a} · ${b} is taken away too.`,
        ],
      ],
      {
        prompt: `Which is equivalent to ${withVars(`${a}(x ${sign} ${b})`)}?`,
        fig: (show) =>
          areaSplit(
            String(a),
            add
              ? [
                  { w: 6, top: "x", area: show ? `${a}x` : "" },
                  { w: Math.min(b, 5), top: String(b), area: show ? String(a * b) : "" },
                ]
              : [
                  { w: 6, top: `x − ${b}`, area: "" },
                  { w: Math.min(b, 4), top: String(b), area: show ? String(a * b) : "", cut: true },
                ],
            { whole: add ? `x + ${b}` : "x" },
          ),
        hint: withVars(`The ${a} multiplies each part inside the parentheses: ${a} · x and ${a} · ${b}.`),
        explain: withVars(`${a}(x ${sign} ${b}) = ${a} · x ${sign} ${a} · ${b} = ${a}x ${sign} ${a * b}.`),
        facts: { t: type, coef: [a, b] },
      },
    );
  }
  if (type === "factor") {
    /* g·c x + g·k written with the greatest common factor g taken out */
    let g, c, k;
    do {
      g = R(2, 6);
      c = R(1, 5);
      k = R(1, 7);
    } while (gcd(c, k) !== 1 || g * c > 30 || g * k > 42);
    const C = g * c,
      K = g * k,
      smaller = range(g).filter((f) => f > 1 && f < g && g % f === 0)[0];
    const list = [
      [withVars(`${g}(${times(c, "x")} + ${k})`), null],
      [
        withVars(`${g}(${times(c, "x")} + ${K})`),
        withVars(
          `The ${g} has to come out of both parts: ${K} ÷ ${g} = ${k}. Check: ${g} · ${K} = ${g * K}, not ${K}.`,
        ),
      ],
    ];
    if (smaller)
      list.push([
        withVars(`${smaller}(${times(C / smaller, "x")} + ${K / smaller})`),
        `That’s equivalent, but ${C / smaller} and ${K / smaller} still have a common factor. The greatest common factor is ${g}.`,
      ]);
    list.push([withVars(`${C}(x + ${K})`), withVars(`Check: ${C}(x + ${K}) = ${C}x + ${C * K}, not ${C}x + ${K}.`)]);
    return mcP(list, {
      prompt: `Which is equivalent to ${withVars(`${C}x + ${K}`)}, written with the greatest common factor?`,
      hint: `Find the biggest number that goes into both ${C} and ${K}.`,
      explain: withVars(
        `${g} is the greatest common factor of ${C} and ${K}: ${C}x + ${K} = ${g}(${times(c, "x")} + ${k}). Check: ${g} · ${times(c, "x")} + ${g} · ${k} = ${C}x + ${K} ✓`,
      ),
      facts: { t: type, factor: [C, K, g] },
    });
  }
  if (type === "missing") {
    /* the missing number in a(x + ?) = ax + ab, or ?(x + b) = ax + ab */
    const a = R(2, 9),
      b = R(2, 9);
    if (Math.random() < 0.5)
      return numP({
        prompt: `What number goes in the box?<br><b>${withVars(`${a}(x + □) = ${a}x + ${a * b}`)}</b>`,
        answer: b,
        fig: (show) =>
          areaSplit(String(a), [
            { w: 6, top: "x", area: `${a}x` },
            { w: 4, top: show ? String(b) : "?", area: String(a * b) },
          ]),
        hint: `The ${a} times the box makes ${a * b}.`,
        misc: [
          [a * b, `${a * b} is ${a} times the box. What times ${a} makes ${a * b}?`],
          [a * b - a, `That subtracts ${a}. The box times ${a} makes ${a * b}: divide.`],
        ],
        explain: withVars(`${a} · ${b} = ${a * b}, so ${a}(x + ${b}) = ${a}x + ${a * b}.`),
        facts: { t: type, coef: [a, b] },
      });
    return numP({
      prompt: `What number goes in the box?<br><b>${withVars(`□(x + ${b}) = ${a}x + ${a * b}`)}</b>`,
      answer: a,
      fig: (show) =>
        areaSplit(show ? String(a) : "?", [
          { w: 6, top: "x", area: `${a}x` },
          { w: 4, top: String(b), area: String(a * b) },
        ]),
      hint: withVars(`The box times x makes ${a}x.`),
      misc: [
        [a * b, `${a * b} is the box times ${b}. What times ${b} makes ${a * b}?`],
        [a * b - b, `That subtracts ${b}. The box times ${b} makes ${a * b}: divide.`],
      ],
      explain: withVars(`${a} · x = ${a}x and ${a} · ${b} = ${a * b}, so the box is ${a}.`),
      facts: { t: type, coef: [a, b] },
    });
  }
  /* a times a two-digit number, split into tens and ones: the missing part */
  const a = R(3, 9),
    tens = 10 * R(2, 9),
    ones = R(2, 9),
    whole = tens + ones;
  return numP({
    prompt: `What number goes in the box?<br><b>${a} · ${whole} = ${a} · ${tens} + ${a} · □</b>`,
    answer: ones,
    fig: (show) =>
      areaSplit(
        String(a),
        [
          { w: tens, top: String(tens), area: String(a * tens) },
          { w: Math.max(ones, 8), top: show ? String(ones) : "?", area: show ? String(a * ones) : "" },
        ],
        { whole: String(whole) },
      ),
    hint: `${whole} is split into ${tens} and another part. What’s the other part?`,
    misc: [[a * ones, `That’s ${a} · ${ones}. The box is the part of ${whole} that gets multiplied by ${a}.`]],
    explain: `${whole} = ${tens} + ${ones}, so ${a} · ${whole} = ${a} · ${tens} + ${a} · ${ones} = ${a * tens} + ${a * ones} = ${a * whole}.`,
    facts: { t: type, coef: [a] },
  });
}

/* ---------- Station 6: exponents (Lessons 12–15) ---------- */
/* bases and the biggest exponent for each, so a power is at most 1,000 (10,000 for 10) */
const POWERS = [
  [2, 9],
  [3, 6],
  [4, 4],
  [5, 4],
  [6, 3],
  [7, 3],
  [8, 3],
  [9, 3],
  [10, 4],
];
/* fraction and decimal bases: [base as html, its value, exponent] */
const SMALL_POWERS = [
  [fr(1, 2), frac(1, 2), 2],
  [fr(1, 2), frac(1, 2), 3],
  [fr(1, 2), frac(1, 2), 4],
  [fr(1, 3), frac(1, 3), 2],
  [fr(2, 3), frac(2, 3), 2],
  [fr(1, 4), frac(1, 4), 2],
  [fr(3, 4), frac(3, 4), 2],
  [fr(2, 5), frac(2, 5), 2],
  [fr(1, 10), frac(1, 10), 2],
  ["0.5", frac(1, 2), 2],
  ["0.3", frac(3, 10), 2],
  ["1.5", frac(3, 2), 2],
];
function genPower() {
  const type = pick(["eval", "eval", "order", "order", "letter", "solve", "small"]);
  if (type === "eval") {
    /* a whole number to a power */
    const [b, maxE] = pick(POWERS),
      e = R(2, maxE),
      answer = b ** e;
    return numP({
      prompt: `What is ${power(b, e)}?`,
      answer,
      hint: `${power(b, e)} means ${e} ${b}s multiplied: ${range(e)
        .map(() => b)
        .join(" · ")}.`,
      misc: [
        [b * e, `That’s ${b} · ${e}. The exponent says how many ${b}s to multiply.`],
        [b + e, `That’s ${b} + ${e}. ${power(b, e)} means ${b} multiplied by itself ${e} times.`],
        [e ** b, `That’s ${power(e, b)}. In ${power(b, e)}, ${b} is multiplied and ${e} says how many times.`],
        [b ** (e - 1), `That’s one ${b} short: ${power(b, e)} has ${e} of them.`],
      ],
      explain: `${power(b, e)} = ${range(e)
        .map(() => b)
        .join(" · ")} = ${fmt(answer)}.`,
      facts: { t: type, pow: [b, e] },
    });
  }
  if (type === "order") {
    /* the exponent first: a + b^e, a · b^e, or (a + b)^2 */
    const form = pick(["plus", "times", "group"]);
    if (form === "plus") {
      const b = R(2, 5),
        e = b === 2 ? R(2, 5) : R(2, 3),
        a = R(1, 20),
        answer = a + b ** e;
      return numP({
        prompt: `What is ${a} + ${power(b, e)}?`,
        answer,
        hint: `The exponent belongs to the ${b} only, and it comes before adding.`,
        misc: [
          [
            (a + b) ** e,
            `That adds first. The exponent belongs to the ${b} only: ${power(b, e)} = ${b ** e}, then add ${a}.`,
          ],
          [a + b * e, `${power(b, e)} isn’t ${b} · ${e}. It’s ${b ** e}.`],
        ],
        explain: `The exponent first: ${power(b, e)} = ${b ** e}. Then ${a} + ${b ** e} = ${answer}.`,
        facts: { t: type, pow: [b, e] },
      });
    }
    if (form === "times") {
      const a = R(2, 5),
        b = R(2, 5),
        e = R(2, 3),
        answer = a * b ** e;
      return numP({
        prompt: `What is ${a} · ${power(b, e)}?`,
        answer,
        hint: `The exponent belongs to the ${b} only, and it comes before multiplying.`,
        misc: [
          [
            (a * b) ** e,
            `That multiplies first. The exponent belongs to the ${b} only: ${power(b, e)} = ${b ** e}, then times ${a}.`,
          ],
          [a * b * e, `${power(b, e)} isn’t ${b} · ${e}. It’s ${b ** e}.`],
        ],
        explain: `The exponent first: ${power(b, e)} = ${b ** e}. Then ${a} · ${b ** e} = ${answer}.`,
        facts: { t: type, pow: [b, e] },
      });
    }
    const a = R(1, 6),
      b = R(2, 6),
      answer = (a + b) ** 2;
    return numP({
      prompt: `What is (${a} + ${b})<sup>2</sup>?`,
      answer,
      hint: `Parentheses first: ${a} + ${b} = ${a + b}. Then square it.`,
      misc: [
        [a * a + b * b, `That squares each number. Parentheses come first: (${a + b})<sup>2</sup>.`],
        [a + b * b, `The parentheses mean all of ${a} + ${b} is squared, not just the ${b}.`],
        [(a + b) * 2, `That doubles ${a + b}. Squaring means ${a + b} · ${a + b}.`],
      ],
      explain: `Parentheses first: ${a} + ${b} = ${a + b}. Then ${power(a + b, 2)} = ${a + b} · ${a + b} = ${answer}.`,
      facts: { t: type, pow: [a + b, 2] },
    });
  }
  if (type === "letter") {
    /* c·x² for a value of x, or a cube's surface area 6s² */
    if (Math.random() < 0.5) {
      const c = R(2, 9),
        x = R(2, 5),
        answer = c * x * x;
      return numP({
        prompt: `What is ${c}${mathVar("x")}<sup>2</sup> when ${mathVar("x")} = ${x}?`,
        answer,
        hint: `The exponent belongs to x only: ${c} · ${x} · ${x}.`,
        misc: [
          [(c * x) ** 2, `That squares ${c} · ${x}. The exponent belongs to x only: ${c} · ${power(x, 2)}.`],
          [c * x * 2, `${power(x, 2)} is ${x} · ${x}, not ${x} · 2.`],
        ],
        explain: `${power(x, 2)} = ${x * x}, so ${c}${mathVar("x")}<sup>2</sup> = ${c} · ${x * x} = ${answer}.`,
        facts: { t: type, pow: [x, 2] },
      });
    }
    const s = R(2, 6),
      answer = 6 * s * s;
    return numP({
      prompt: `A cube has edges ${s} cm long. Its surface area is 6${mathVar("s")}<sup>2</sup>, where ${mathVar("s")} is the length of an edge. What is its surface area?`,
      unit: "square cm",
      answer,
      hint: `6 faces, each ${s} · ${s} square cm.`,
      misc: [
        [(6 * s) ** 2, `That squares 6 · ${s}. The exponent belongs to s only: 6 · ${power(s, 2)}.`],
        [s * s, `That’s one face. A cube has 6 of them.`],
        [6 * s * 2, `${power(s, 2)} is ${s} · ${s}, not ${s} · 2.`],
      ],
      explain: `${power(s, 2)} = ${s * s}, so 6${mathVar("s")}<sup>2</sup> = 6 · ${s * s} = ${answer} square cm.`,
      facts: { t: type, pow: [s, 2] },
    });
  }
  if (type === "solve") {
    /* the exponent in b^x = N, or the base in x² = N */
    if (Math.random() < 0.6) {
      const [b, maxE] = pick(POWERS),
        e = R(2, maxE),
        N = b ** e;
      return numP({
        prompt: `What value of ${mathVar("x")} makes ${power(b, mathVar("x"))} = ${fmt(N)} true?`,
        answer: e,
        hint: `How many ${b}s multiply to make ${fmt(N)}? Divide by ${b} until you get to 1, or try values.`,
        misc: [
          [N / b, `That’s ${fmt(N)} ÷ ${b}. x is the exponent: how many ${b}s multiply to make ${fmt(N)}?`],
          [N - b, `That subtracts. ${power(b, mathVar("x"))} means ${b} multiplied by itself x times.`],
        ],
        explain: `${range(e)
          .map(() => b)
          .join(" · ")} = ${fmt(N)}, so ${power(b, e)} = ${fmt(N)} and ${mathVar("x")} = ${e}.`,
        facts: { t: type, pow: [b, e] },
      });
    }
    const root = R(2, 12),
      N = root * root;
    return numP({
      prompt: `What value of ${mathVar("x")} makes ${mathVar("x")}<sup>2</sup> = ${N} true?`,
      answer: root,
      hint: `Which number times itself makes ${N}?`,
      misc: [[N / 2, `That’s ${N} ÷ 2. x<sup>2</sup> means x · x, not x · 2.`]],
      explain: `${root} · ${root} = ${N}, so ${mathVar("x")} = ${root}.`,
      facts: { t: type, pow: [root, 2] },
    });
  }
  /* a fraction or decimal to a power: each time, a part of a part */
  const [baseHtml, base, e] = pick(SMALL_POWERS),
    answer = fVal(base) ** e,
    isDecimal = !baseHtml.includes("<");
  return numP({
    frac: !isDecimal,
    prompt: `What is (${baseHtml})<sup>${e}</sup>?`,
    answer: r4(answer),
    hint: `Multiply ${baseHtml} by itself ${e} times.`,
    misc: [
      [r4(fVal(base) * e), `That’s ${baseHtml} · ${e}. The exponent means multiply ${baseHtml} by itself.`],
      [r4(fVal(base) / e), `That divides by ${e}. The exponent means multiply ${baseHtml} by itself ${e} times.`],
    ],
    explain: `(${baseHtml})<sup>${e}</sup> = ${range(e)
      .map(() => baseHtml)
      .join(" · ")} = ${isDecimal ? fmt(r4(answer)) : fr(base[0] ** e, base[1] ** e)}.`,
    facts: { t: type, f: [frac(base[0] ** e, base[1] ** e)] },
  });
}

/* ---------- Station 7: two related quantities (Lessons 16–18) ---------- */
/* situations where one amount is a rate times the other: the story, the letters, what they count (xOne: one of x), and the rates */
const RATE_STORIES = [
  {
    story: (k) => `A pool fills with ${k} gallons of water each minute.`,
    x: "m",
    y: "g",
    xName: "minutes",
    xOne: "minute",
    yName: "gallons",
    ks: [3, 4, 5, 6, 8, 10],
  },
  {
    story: (k) => `A hiker walks ${k} miles each hour.`,
    x: "t",
    y: "d",
    xName: "hours",
    xOne: "hour",
    yName: "miles",
    ks: [2, 3, 4],
  },
  {
    story: (k) => `A babysitter earns $${k} for each hour.`,
    x: "h",
    y: "e",
    xName: "hours",
    xOne: "hour",
    yName: "dollars",
    ks: [6, 8, 9, 10, 12, 15],
  },
  {
    story: (k) => `Each box holds ${k} crayons.`,
    x: "b",
    y: "c",
    xName: "boxes",
    xOne: "box",
    yName: "crayons",
    ks: [8, 12, 16, 24],
  },
];
function genGraph() {
  const type = pick(["table", "table", "rule", "rule", "tap", "tap", "meaning"]);
  const s = pick(RATE_STORIES),
    k = pick(s.ks),
    X = mathVar(s.x),
    Y = mathVar(s.y);
  if (type === "table") {
    /* a missing value in a table that follows y = kx */
    const xs = shuffle(range(9).map((i) => i + 1))
        .slice(0, 4)
        .sort((a, b) => a - b),
      missing = R(1, 3),
      askY = Math.random() < 0.6,
      rows = xs.map((x) => [x, k * x]),
      answer = askY ? rows[missing][1] : rows[missing][0],
      firstDiff = rows[0][1] - rows[0][0];
    return numP({
      prompt: `${s.story(k)} The table shows ${s.yName} (${Y}) for some numbers of ${s.xName} (${X}). What is the missing number?`,
      answer,
      fig: () =>
        valueTable([`${s.xName} (${X})`, `${s.yName} (${Y})`], rows, {
          q: [missing, askY ? 1 : 0],
          label: `Table of ${s.yName} and ${s.xName}, one number missing`,
        }),
      hint: `Every row follows the same rule: ${s.yName} = ${k} · ${s.xName}.`,
      misc: askY
        ? [
            [
              rows[missing][0] + firstDiff,
              `That adds ${firstDiff}, which only fits the first row. Each ${s.yName} number is ${k} times its ${s.xName} number.`,
            ],
            [rows[missing][0], `That’s the ${s.xName} number. The missing one is ${k} times it.`],
          ]
        : [
            [rows[missing][1] * k, `That multiplies. The ${s.xName} number is the ${s.yName} number divided by ${k}.`],
            [
              rows[missing][1] - k,
              `That subtracts ${k}. The ${s.yName} number is ${k} times the ${s.xName} number, so divide by ${k}.`,
            ],
          ],
      explain: withVars(
        `${s.y} = ${k}${s.x}: ${askY ? `${k} · ${rows[missing][0]} = ${answer}` : `${rows[missing][1]} ÷ ${k} = ${answer}`}.`,
      ),
      facts: { t: type, rate: [k] },
    });
  }
  if (type === "rule") {
    /* which equation fits a table: y = kx, or (for ages) y = x + c */
    if (Math.random() < 0.6) {
      const xs = shuffle(range(8).map((i) => i + 2))
          .slice(0, 3)
          .sort((a, b) => a - b),
        rows = xs.map((x) => [x, k * x]),
        firstDiff = rows[0][1] - rows[0][0];
      return mcP(
        [
          [withVars(`${s.y} = ${k}${s.x}`), null],
          [
            withVars(`${s.y} = ${s.x} + ${firstDiff}`),
            withVars(
              `That fits the first row (${rows[0][0]} + ${firstDiff} = ${rows[0][1]}), but not the next: ${rows[1][0]} + ${firstDiff} isn’t ${rows[1][1]}. It has to fit every row.`,
            ),
          ],
          [
            withVars(`${s.x} = ${k}${s.y}`),
            withVars(`That swaps them: each ${s.y} is ${k} times its ${s.x}, not the other way around.`),
          ],
        ],
        {
          prompt: `${s.story(k)} Which equation fits the table?`,
          fig: () =>
            valueTable([`${s.xName} (${X})`, `${s.yName} (${Y})`], rows, {
              label: `Table of ${s.yName} and ${s.xName}`,
            }),
          hint: `Look at each row: what do you do to the first number to get the second?`,
          explain: withVars(
            `Every ${s.yName} number is ${k} times its ${s.xName} number: ${rows.map(([x, y]) => `${k} · ${x} = ${y}`).join(", ")}. So ${s.y} = ${k}${s.x}.`,
          ),
          facts: { t: type, rate: [k] },
        },
      );
    }
    const gap = R(2, 9),
      older = pick(WHO),
      younger = pick(WHO.filter((w) => w !== older)),
      xs = [1, 4, 7].map((v) => v + R(0, 2)),
      rows = xs.map((x) => [x, x + gap]);
    return mcP(
      [
        [withVars(`o = y + ${gap}`), null],
        [
          withVars(`o = ${gap}y`),
          withVars(`That makes ${older} ${gap} times as old. Check a row: ${gap} · ${rows[0][0]} isn’t ${rows[0][1]}.`),
        ],
        [
          withVars(`y = o + ${gap}`),
          withVars(`That makes ${younger} the older one. ${older} is older, so add ${gap} to y.`),
        ],
      ],
      {
        prompt: withVars(
          `${older} is ${gap} years older than ${younger}. Let y be ${younger}’s age and o be ${older}’s age, in years. Which equation fits the table?`,
        ),
        fig: () =>
          valueTable([`${younger}’s age (${mathVar("y")})`, `${older}’s age (${mathVar("o")})`], rows, {
            label: "Table of ages",
          }),
        hint: "Each year, both get one year older. What stays the same?",
        explain: withVars(
          `${older} is always ${gap} years older: o = y + ${gap}. Check: ${rows[0][0]} + ${gap} = ${rows[0][1]} ✓`,
        ),
        facts: { t: type, age: [rows[2][1]] },
      },
    );
  }
  if (type === "tap") {
    /* tap the point on a graph of y = kx that shows a given amount */
    const points = range(5).map((i) => ({ x: i + 1, y: k * (i + 1), id: `p${i + 1}` })),
      target = pick(points),
      byY = Math.random() < 0.5,
      why = {};
    points.forEach((p) => {
      if (p !== target) why[p.id] = `That point is (${p.x}, ${p.y}): ${p.x} ${s.xName} and ${p.y} ${s.yName}.`;
    });
    return {
      kind: "tap",
      prompt: `${s.story(k)} Tap the point on the graph that shows ${byY ? `${target.y} ${s.yName}` : `${target.x} ${s.xName}`}.`,
      answer: target.id,
      why,
      fig: () =>
        graphQ1(points, {
          xMax: 6,
          yMax: k * 6,
          yStep: k,
          xLabel: `${s.xName} (${s.x})`,
          yLabel: `${s.yName} (${s.y})`,
          tap: true,
        }),
      hint: byY
        ? `Find ${target.y} on the ${s.yName} axis (up the side), then go across to a point.`
        : `Find ${target.x} on the ${s.xName} axis (along the bottom), then go up to a point.`,
      explain: `The point (${target.x}, ${target.y}) means ${target.x} ${s.xName} and ${target.y} ${s.yName}. Check: ${k} · ${target.x} = ${target.y} ✓`,
      facts: { t: type, rate: [k] },
    };
  }
  /* what a point on the graph means */
  const x = R(2, 6),
    y = k * x;
  return mcP(
    [
      [`${x} ${s.xName}, ${y} ${s.yName}`, null],
      [
        `${y} ${s.xName}, ${x} ${s.yName}`,
        `The first number goes across (${s.xName}) and the second goes up (${s.yName}). (${x}, ${y}) is ${x} ${s.xName}.`,
      ],
      [
        `${x} ${s.yName} each ${s.xOne}`,
        `The rate is ${k} ${s.yName} each ${s.xOne} (${s.y} = ${k}${s.x}). The point is one pair: ${x} ${s.xName} and ${y} ${s.yName}.`,
      ],
    ],
    {
      prompt: `${s.story(k)} So ${withVars(`${s.y} = ${k}${s.x}`)}, where ${X} is the number of ${s.xName} and ${Y} the number of ${s.yName}. What does the point (${x}, ${y}) on its graph mean?`,
      stack: true,
      hint: "The first number in a point goes across, and the second goes up.",
      explain: withVars(`(${x}, ${y}) means ${s.x} = ${x} and ${s.y} = ${y}. Check: ${k} · ${x} = ${y} ✓`),
      facts: { t: type, rate: [k] },
    },
  );
}

const ICON = {
  tape: '<rect x="4" y="24" width="18" height="18" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="22" y="24" width="18" height="18" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="40" y="24" width="18" height="18" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2"/><path d="M5,18v-5H57v5" fill="none" stroke="#f3f6fb" stroke-width="2"/>',
  hang: '<line x1="32" y1="4" x2="32" y2="16" stroke="#a9c4e4" stroke-width="2"/><line x1="8" y1="16" x2="56" y2="16" stroke="#f3f6fb" stroke-width="4" stroke-linecap="round"/><line x1="12" y1="16" x2="12" y2="26" stroke="#a9c4e4" stroke-width="2"/><line x1="52" y1="16" x2="52" y2="26" stroke="#a9c4e4" stroke-width="2"/><circle cx="12" cy="36" r="9" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="2"/><rect x="45" y="27" width="14" height="14" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><rect x="45" y="43" width="14" height="14" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/>',
  write:
    '<rect x="10" y="8" width="44" height="50" rx="4" fill="rgba(9,32,61,.6)" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="40" fill="#ffc93c" font-size="17" font-weight="700" text-anchor="middle" font-family="monospace">4<tspan fill="#7fe3ff" font-style="italic">n</tspan></text>',
  equiv:
    '<text x="32" y="28" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">2x+3x</text><text x="32" y="52" fill="#7fe3ff" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">5x</text><text x="32" y="40" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">=</text>',
  split:
    '<rect x="6" y="18" width="34" height="30" fill="rgba(255,201,60,.35)" stroke="#f3f6fb" stroke-width="2.5"/><rect x="40" y="18" width="18" height="30" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2.5"/><text x="23" y="14" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace" font-style="italic">x</text><text x="49" y="14" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">4</text>',
  power:
    '<polygon points="10,26 34,26 34,50 10,50" fill="rgba(255,201,60,.4)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="10,26 20,16 44,16 34,26" fill="rgba(255,201,60,.6)" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="34,26 44,16 44,40 34,50" fill="rgba(255,201,60,.25)" stroke="#f3f6fb" stroke-width="2.5"/><text x="54" y="20" fill="#7fe3ff" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">3</text>',
  graph:
    '<path d="M8,6 V56 H58" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><line x1="8" y1="56" x2="52" y2="12" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/><circle cx="19" cy="45" r="4" fill="#ffc93c"/><circle cx="30" cy="34" r="4" fill="#ffc93c"/><circle cx="41" cy="23" r="4" fill="#ffc93c"/>',
  boss: '<line x1="32" y1="6" x2="32" y2="18" stroke="#a9c4e4" stroke-width="2"/><line x1="6" y1="18" x2="58" y2="18" stroke="#ffc93c" stroke-width="5" stroke-linecap="round"/><path d="M10,18 L4,40 H22 Z M54,18 L48,40 H60 Z" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2"/><text x="32" y="56" fill="#f3f6fb" font-size="13" font-weight="700" text-anchor="middle" font-family="monospace">=</text>',
};

const ZONES = [
  {
    id: "tape",
    name: "Tape Match",
    lessons: "Lessons 1–2",
    blurb: "Match equations to tape diagrams, make both sides of an equation equal, and test solutions.",
    gen: genTape,
  },
  {
    id: "hang",
    name: "Hanger Lab",
    lessons: "Lessons 3–5",
    blurb: "Balance hangers, and solve equations with decimals and fractions by doing the same to each side.",
    gen: genHang,
  },
  {
    id: "write",
    name: "Story Lab",
    lessons: "Lessons 4, 6–7",
    blurb: "Turn words and stories into expressions and equations, find values, and solve percent problems.",
    gen: genWrite,
  },
  {
    id: "equiv",
    name: "Twin Test",
    lessons: "Lesson 8",
    blurb: "Equivalent, or only equal for one value? Combine x’s, and find where two expressions meet.",
    gen: genEquiv,
  },
  {
    id: "split",
    name: "Area Split",
    lessons: "Lessons 9–11",
    blurb: "Expand with the distributive property, take out the greatest common factor, and fill in the missing part.",
    gen: genSplit,
  },
  {
    id: "power",
    name: "Power Up",
    lessons: "Lessons 12–15",
    blurb: "Powers of whole numbers and fractions, exponents first, and the exponent that makes an equation true.",
    gen: genPower,
  },
  {
    id: "graph",
    name: "Data Lab",
    lessons: "Lessons 16–18",
    blurb: "Fill in tables, pick the equation that fits, and read points on graphs.",
    gen: genGraph,
  },
  {
    id: "boss",
    name: "Grand Balance",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genTape, genHang, genWrite, genEquiv, genSplit, genPower, genGraph])(),
  },
];
