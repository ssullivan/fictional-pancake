/* Math facts: the facts in each set, the choices for a fact, how to work it out, and which fact to practice next. Used by
   facts/practice.html and by tools/facts.mjs. Needs util.js (R, pick, shuffle, range); the pictures in factHelp need
   pictures.js (cellsOf), blocks.js (tenFrames), multiply.js (arrayFig), and shapes.js (splitFig).

   FACT_OPS                          the operations: their sign, name, and sets (addition and subtraction) or tables
                                     (multiplication and division)
   factKey(fact), factAnswer(fact), factText(fact)   "7×8", 56, and "7 × 8"
   factsIn(op, pick)                 every fact in a set ('10' or '20'), or in a list of tables: [{op, a, b}]
                                     (a division fact is a ÷ b: 56 ÷ 7 is {a: 56, b: 7})
   factChoices(fact)                 4 different answers to pick from, one right: [{value, why}] (why is null for the right one)
   factHelp(fact)                    how to work it out: {text, fig} (fig is svg markup, or '')
   factHint(fact)                    the same strategy as a hint, without the answer
   factStatus(memory, key)           'new', 'missed', 'learning', or 'known' from what was saved about the fact
   makePicker(facts, memory, focus)  deals facts: missed ones come back soon, known ones less often; {next(), record(fact, ok, hinted)}
   Memory, saved per operation: {key: {r: times right, w: times wrong, run: right in a row, last: 'r' or 'w'}}. */
const FACT_OPS = {
  add: {
    sign: "+",
    name: "Addition",
    sets: [
      ["10", "Sums within 10"],
      ["20", "Sums within 20"],
    ],
  },
  sub: {
    sign: "−",
    name: "Subtraction",
    sets: [
      ["10", "From 10 or less"],
      ["20", "From 20 or less"],
    ],
  },
  mult: { sign: "×", name: "Multiplication", tables: range(13) },
  /* dividing by 1 to 12: no dividing by 0 */
  div: { sign: "÷", name: "Division", tables: range(12).map((i) => i + 1) },
};
/* a fact's key: "7+8", "15−7", "7×8" (a multiplication fact and its turnaround share one key, smaller factor first) */
const factKey = ({ op, a, b }) =>
  op === "mult" ? `${Math.min(a, b)}×${Math.max(a, b)}` : `${a}${FACT_OPS[op].sign}${b}`;
const factAnswer = ({ op, a, b }) => (op === "add" ? a + b : op === "sub" ? a - b : op === "mult" ? a * b : a / b);
const factText = ({ op, a, b }) => `${a} ${FACT_OPS[op].sign} ${b}`;
/* Every fact in a set. Addition: within 10, both numbers adding to 10 or less; within 20, any two numbers 0 to 10.
   Subtraction: the same facts turned around (from 10 or less; from 20 or less, taking away 0 to 10 and leaving 0 to 10).
   Multiplication: each table t in the list times 0 to 12, each fact once (3 × 7 and 7 × 3 are one fact).
   Division: the same facts turned around, divided by each table t: 0 ÷ t to (12 × t) ÷ t. */
function factsIn(op, choice) {
  const facts = [];
  if (op === "add")
    range(11).forEach((a) =>
      range(11).forEach((b) => {
        if (choice === "20" || a + b <= 10) facts.push({ op, a, b });
      }),
    );
  if (op === "sub")
    range(11).forEach((b) =>
      range(11).forEach((difference) => {
        if (choice === "20" || b + difference <= 10) facts.push({ op, a: b + difference, b });
      }),
    );
  if (op === "mult") {
    const keys = new Set();
    choice.forEach((t) =>
      range(13).forEach((n) => {
        const fact = { op, a: t, b: n };
        if (!keys.has(factKey(fact))) {
          keys.add(factKey(fact));
          facts.push(fact);
        }
      }),
    );
  }
  if (op === "div") choice.forEach((t) => range(13).forEach((n) => facts.push({ op, a: t * n, b: t })));
  return facts;
}

/* ---------- choices ---------- */
/* Four answers to pick from: the right one and 3 named mistakes, all different whole numbers, in a random order. Mistakes
   that land on the right answer, or below 0, are left out, and numbers near the answer fill any gap. */
function factChoices(fact) {
  const { op, a, b } = fact,
    answer = factAnswer(fact),
    near = pick([1, -1]),
    mistakes = [];
  if (op === "add")
    mistakes.push(
      [answer + near, "Count on carefully from the bigger number."],
      [Math.abs(a - b), `That’s ${Math.max(a, b)} − ${Math.min(a, b)}. This one is plus.`],
      [answer - near, "Count on carefully from the bigger number."],
      [answer + 2 * near, "Count on carefully from the bigger number."],
      [a * b, `That’s ${a} × ${b}. This one is plus.`],
      [answer + 10 * (answer >= 10 ? -1 : 1), "Look at the tens: is it more or less than 10?"],
    );
  if (op === "sub")
    mistakes.push(
      [answer + near, "Count back carefully, or think addition."],
      [a + b, `That’s ${a} + ${b}. This one is minus.`],
      [b, `${b} is the number taken away. What’s left?`],
      [answer - near, "Count back carefully, or think addition."],
      [answer + 2 * near, "Count back carefully, or think addition."],
    );
  if (op === "mult") {
    /* a neighbor fact: one group more or fewer, of either factor */
    const neighbors = shuffle([
      [(a + 1) * b, `That’s ${a + 1} × ${b}, one group too many.`],
      [(a - 1) * b, `That’s ${a - 1} × ${b}, one group too few.`],
      [a * (b + 1), `That’s ${a} × ${b + 1}, one group too many.`],
      [a * (b - 1), `That’s ${a} × ${b - 1}, one group too few.`],
    ]);
    mistakes.push(
      ...(a === 0 || b === 0 ? [[Math.max(a, b), "Any number times 0 is 0: no groups, or groups of nothing."]] : []),
      ...(a === 1 || b === 1 ? [[a + b, `That’s ${a} + ${b}. Times 1 is the number itself.`]] : []),
      neighbors[0],
      [a + b, `That’s ${a} + ${b}. This one is times.`],
      ...neighbors.slice(1),
      [answer + near, "Skip-count carefully."],
    );
  }
  if (op === "div")
    mistakes.push(
      ...(answer === 0 ? [[b, `0 shared into ${b} groups leaves 0 in each.`]] : []),
      [answer + near, `${b} × ${answer + near} = ${b * (answer + near)}, not ${a}.`],
      [b, `${b} is the number you divide by. ${b} times what is ${a}?`],
      [a - b, `That’s ${a} − ${b}. This one is divide.`],
      [answer - near, `${b} × ${answer - near} = ${b * (answer - near)}, not ${a}.`],
      [a + b, `That’s ${a} + ${b}. This one is divide.`],
    );
  const picked = [];
  mistakes.forEach(([value, why]) => {
    if (picked.length < 3 && value >= 0 && value !== answer && !picked.some((p) => p.value === value))
      picked.push({ value, why });
  });
  /* fill any gap with numbers near the answer */
  for (let step = 1; picked.length < 3; step++)
    [answer + step, answer - step].forEach((value) => {
      if (picked.length < 3 && value >= 0 && !picked.some((p) => p.value === value))
        picked.push({ value, why: "Check it again with the picture." });
    });
  return shuffle([{ value: answer, why: null }, ...picked]);
}

/* ---------- how to work it out ---------- */
/* A strategy for the fact, in words, and a picture of it: ten-frames to make ten or take away, an array, or a rectangle
   broken into two easier facts. */
function factHelp(fact) {
  const { op, a, b } = fact,
    answer = factAnswer(fact);
  if (op === "add") {
    const big = Math.max(a, b),
      small = Math.min(a, b),
      frames = answer > 10 ? 2 : 1,
      fig = tenFrames(cellsOf([a, "a"], [b, "b"]), { frames, label: `Ten-frames: ${a} and ${b} more` });
    if (small === 0) return { text: `Adding 0 doesn’t change a number: ${a} + ${b} = ${answer}.`, fig };
    if (a === b) return { text: `It’s a double: ${a} + ${a} = ${answer}.`, fig };
    if (big - small === 1)
      return {
        text: `It’s a near double: ${small} + ${small} = ${2 * small}, and 1 more is ${answer}.`,
        fig,
      };
    if (big === 10) return { text: `10 and ${small} more is 1 ten and ${small} ones: ${answer}.`, fig };
    if (answer > 10)
      return {
        text: `Make a ten: ${big} + ${10 - big} = 10, and ${small - (10 - big)} more is ${answer}.`,
        fig,
      };
    if (answer === 10) return { text: `${a} and ${b} make 10. They’re a pair that makes ten.`, fig };
    return {
      text: `Count on from ${big}: ${range(small)
        .map((i) => big + i + 1)
        .join(", ")}. ${a} + ${b} = ${answer}.`,
      fig,
    };
  }
  if (op === "sub") {
    /* a, with the last b taken away (crossed out) */
    const fig = tenFrames(cellsOf([a, "a"]), {
      frames: a > 10 ? 2 : 1,
      out: new Set(range(b).map((i) => a - 1 - i)),
      label: `Ten-frames: ${a}, with ${b} crossed out`,
    });
    if (b === 0) return { text: `Taking away 0 leaves the same number: ${a} − 0 = ${a}.`, fig };
    if (answer === 0) return { text: `A number take away itself leaves 0: ${a} − ${b} = 0.`, fig };
    if (a > 10 && b > a - 10)
      return {
        text: `Think addition: ${b} + ? = ${a}. ${b} + ${10 - b} = 10, and ${a - 10} more is ${a}. ${10 - b} + ${a - 10} = ${answer}, so ${a} − ${b} = ${answer}.`,
        fig,
      };
    return { text: `Think addition: ${b} + ${answer} = ${a}, so ${a} − ${b} = ${answer}.`, fig };
  }
  if (op === "div") {
    /* a split into b equal rows: an array when it's small enough to count, or a rectangle with 10 broken off */
    const fig =
      answer >= 1 && answer <= 10 && b <= 10
        ? arrayFig(b, answer, { label: `An array: ${a} in ${b} equal rows of ${answer}` })
        : answer > 10
          ? splitFig(b, answer, 10, { grid: false, products: true })
          : "";
    if (a === 0) return { text: `0 shared into ${b} groups leaves 0 in each: 0 ÷ ${b} = 0.`, fig };
    if (b === 1) return { text: `Dividing by 1 leaves the number: ${a} ÷ 1 = ${a}.`, fig };
    if (a === b) return { text: `A number divided by itself is 1: ${a} ÷ ${b} = 1.`, fig };
    return { text: `Think multiplication: ${b} × ? = ${a}. ${b} × ${answer} = ${a}, so ${a} ÷ ${b} = ${answer}.`, fig };
  }
  /* multiplication: n is the other factor of a table with a rule; a picture when the array is small enough to count */
  const array = a >= 1 && b >= 1 && a <= 10 && b <= 10 ? arrayFig(a, b) : "",
    has = (t) => a === t || b === t,
    other = (t) => (a === t ? b : a);
  if (has(0)) return { text: `Any number times 0 is 0: ${a} × ${b} = 0.`, fig: "" };
  if (has(1)) return { text: `Times 1 is the number itself: ${a} × ${b} = ${answer}.`, fig: array };
  if (has(2)) {
    const n = other(2);
    return { text: `Times 2 is a double: ${n} + ${n} = ${answer}.`, fig: array };
  }
  if (has(10)) {
    const n = other(10);
    return { text: `Times 10: ${n} tens is ${answer}.`, fig: array };
  }
  if (has(5)) {
    const n = other(5);
    return { text: `Times 5 is half of times 10: ${n} × 10 = ${n * 10}, and half of that is ${answer}.`, fig: array };
  }
  if (has(9)) {
    const n = other(9);
    return {
      text: `Times 9 is times 10, one group less: ${n} × 10 = ${n * 10}, and ${n * 10} − ${n} = ${answer}.`,
      fig: array,
    };
  }
  if (has(11)) {
    const n = other(11);
    return {
      text: `Times 11 is times 10 and one more group: ${n} × 10 + ${n} = ${n * 10} + ${n} = ${answer}.`,
      fig: "",
    };
  }
  if (has(12)) {
    const n = other(12);
    return {
      text: `Break 12 into 10 and 2: ${n} × 10 + ${n} × 2 = ${n * 10} + ${n * 2} = ${answer}.`,
      fig: splitFig(n, 12, 10, { grid: n <= 6, products: true }),
    };
  }
  if (has(4)) {
    const n = other(4);
    return {
      text: `Times 4 is double, then double again: ${n} × 2 = ${n * 2}, and ${n * 2} + ${n * 2} = ${answer}.`,
      fig: array,
    };
  }
  /* 3, 6, 7, and 8 times each other: break the bigger factor into 5 and the rest */
  const big = Math.max(a, b),
    small = Math.min(a, b);
  return {
    text: `Break ${big} into 5 and ${big - 5}: ${small} × 5 + ${small} × ${big - 5} = ${small * 5} + ${small * (big - 5)} = ${answer}.`,
    fig: splitFig(small, big, 5, { products: true }),
  };
}

/* The strategy factHelp uses, said as a hint that doesn't give the answer away. */
function factHint(fact) {
  const { op, a, b } = fact,
    answer = factAnswer(fact);
  if (op === "add") {
    const big = Math.max(a, b),
      small = Math.min(a, b);
    if (small === 0) return "Adding 0 doesn’t change a number.";
    if (a === b) return `It’s a double: ${a} + ${a}.`;
    if (big - small === 1) return `Think of the double ${small} + ${small}, then 1 more.`;
    if (big === 10) return `10 and ${small} more is 1 ten and ${small} ones.`;
    if (answer > 10) return `Make a ten: ${big} + ${10 - big} = 10. Then add the rest of the ${small}.`;
    return `Count on from ${big}.`;
  }
  if (op === "sub") {
    if (b === 0) return "Taking away 0 leaves the same number.";
    if (answer === 0) return "A number take away itself leaves nothing.";
    if (a > 10 && b > a - 10) return `Think addition: ${b} + ? = ${a}. Jump from ${b} to 10 first.`;
    return `Think addition: ${b} + ? = ${a}.`;
  }
  if (op === "div") {
    if (a === 0) return "0 shared into any number of groups leaves 0 in each.";
    if (b === 1) return "Dividing by 1 leaves the number.";
    if (a === b) return "A number divided by itself is 1.";
    return `Think multiplication: ${b} × ? = ${a}.`;
  }
  const has = (t) => a === t || b === t,
    other = (t) => (a === t ? b : a),
    big = Math.max(a, b),
    small = Math.min(a, b);
  if (has(0)) return "Any number times 0 is 0.";
  if (has(1)) return "Times 1 is the number itself.";
  if (has(2)) return `Times 2 is a double: ${other(2)} + ${other(2)}.`;
  if (has(10)) return `Times 10: ${other(10)} tens.`;
  if (has(5)) return `Times 5 is half of times 10: half of ${other(5)} × 10.`;
  if (has(9)) return `Times 9: find ${other(9)} × 10, then take away one ${other(9)}.`;
  if (has(11)) return `Times 11: find ${other(11)} × 10, then add one more ${other(11)}.`;
  if (has(12)) return `Break 12 into 10 and 2: ${other(12)} × 10 + ${other(12)} × 2.`;
  if (has(4)) return `Times 4: double ${other(4)}, then double again.`;
  return `Break ${big} into 5 and ${big - 5}: ${small} × 5 + ${small} × ${big - 5}.`;
}

/* ---------- which fact next ---------- */
/* how well a fact is known: never seen, missed last time, still learning, or right 3 times in a row */
function factStatus(memory, key) {
  const m = memory[key];
  return !m ? "new" : m.last === "w" ? "missed" : m.run >= 3 ? "known" : "learning";
}
/* how often each kind of fact comes up, compared with the others */
const WEIGHT = { new: 3, missed: 5, learning: 4, known: 1 };
/* Deals facts from a set, forever. A missed fact (or one answered with a hint) comes back 3 to 5 facts later, and again until
   it's been right twice in a row; known facts come up less often; the same fact never comes twice in a row. focus: a key to
   practice more often (about one fact in three). memory is changed as answers are recorded. */
function makePicker(facts, memory, focus = null) {
  /* dealt: how many facts so far; due: facts to bring back, with when; shaky: facts missed or hinted this time, until
     they're right twice in a row */
  let dealt = 0,
    lastKey = null;
  const due = [],
    shaky = new Set(),
    focusFact = focus && facts.find((f) => factKey(f) === focus);
  /* a fact from the set with each one's chance set by WEIGHT, never the last one when there's another */
  function weighted() {
    /* not the last fact, and not one waiting to come back on its own schedule (unless nothing else is left) */
    const waiting = new Set(due.map((d) => factKey(d.fact))),
      fresh = facts.filter((f) => factKey(f) !== lastKey && !waiting.has(factKey(f))),
      pool = fresh.length ? fresh : facts.length > 1 ? facts.filter((f) => factKey(f) !== lastKey) : facts,
      weights = pool.map((f) => WEIGHT[factStatus(memory, factKey(f))]),
      total = weights.reduce((x, y) => x + y, 0);
    let spin = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      spin -= weights[i];
      if (spin < 0) return pool[i];
    }
    return pool[pool.length - 1];
  }
  return {
    next() {
      dealt++;
      const ready = due.findIndex((d) => d.at <= dealt && factKey(d.fact) !== lastKey);
      let fact;
      if (ready >= 0) fact = due.splice(ready, 1)[0].fact;
      else if (focusFact && dealt % 3 === 1 && factKey(focusFact) !== lastKey) fact = focusFact;
      else fact = weighted();
      /* multiplication shows the factors in either order */
      if (fact.op === "mult" && R(0, 1)) fact = { ...fact, a: fact.b, b: fact.a };
      lastKey = factKey(fact);
      return fact;
    },
    /* ok: answered right; hinted: the hint was used, so a right answer doesn't count toward knowing it */
    record(fact, ok, hinted = false) {
      const key = factKey(fact),
        m = (memory[key] = memory[key] || { r: 0, w: 0, run: 0, last: "r" });
      if (ok) {
        m.r++;
        m.run = hinted ? 0 : m.run + 1;
        m.last = "r";
      } else {
        m.w++;
        m.run = 0;
        m.last = "w";
      }
      /* a missed or hinted fact comes back soon, until it's right twice in a row */
      if (!ok || hinted) shaky.add(key);
      if (m.run >= 2) shaky.delete(key);
      if (shaky.has(key) && !due.some((d) => factKey(d.fact) === key)) due.push({ fact, at: dealt + R(3, 5) });
    },
  };
}
