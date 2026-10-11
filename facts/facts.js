/* Math facts: the facts in each set, the choices for a fact, how to work it out, and which fact to practice next. Used by
   facts/practice.html and by tools/facts.mjs. Needs util.js (R, pick, shuffle, range, gcd); the pictures in factHelp need
   pictures.js (cellsOf), blocks.js (tenFrames), multiply.js (arrayFig), shapes.js (splitFig), and fractions.js (strips,
   hundredGrid).

   FACT_OPS                          the operations: their sign, name, and sets (addition and subtraction) or tables
                                     (multiplication and division)
   factKey(fact), factAnswer(fact), factText(fact)   "7×8", 56, and "7 × 8"
   factsIn(op, pick)                 every fact in a set ('10' or '20'), or in a list of tables: [{op, a, b}]
                                     (a division fact is a ÷ b: 56 ÷ 7 is {a: 56, b: 7}; a fraction to simplify is a/b:
                                     6/8 is {a: 6, b: 8}, and its answer is text, "3/4")
   A fact can hide a number instead of its answer (fact.ask 'a' or 'b': 7 + ? = 15 hides b). askable(fact, ask) says
   whether that has one answer (0 × ? = 0 doesn't); factPrompt(fact) is "7 + ? = 15", factValue(fact) the number asked
   for (8), and factFull(fact) the whole fact, "7 + 8 = 15". The functions below follow ask.
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
  /* simplifying fractions less than 1 (improper fractions are for later) */
  simp: {
    sign: "/",
    name: "Simplifying Fractions",
    sets: [
      ["12", "Denominators up to 12"],
      ["24", "Denominators up to 24"],
      ["100", "Hundredths"],
    ],
  },
};
/* a fraction a/b in simplest form, [numerator, denominator]: both divided by their greatest common factor */
const simplest = (a, b) => [a / gcd(a, b), b / gcd(a, b)];
/* a fact's key: "7+8", "15−7", "7×8" (a multiplication fact and its turnaround share one key, smaller factor first) */
const factKey = ({ op, a, b }) =>
  op === "mult" ? `${Math.min(a, b)}×${Math.max(a, b)}` : `${a}${FACT_OPS[op].sign}${b}`;
/* the answer: a number, or for a fraction to simplify its simplest form as text ("3/4") */
const factAnswer = ({ op, a, b }) =>
  op === "add" ? a + b : op === "sub" ? a - b : op === "mult" ? a * b : op === "div" ? a / b : simplest(a, b).join("/");
const factText = ({ op, a, b }) => (op === "simp" ? `${a}/${b}` : `${a} ${FACT_OPS[op].sign} ${b}`);
/* can the fact hide a (or b) and still have one answer? Not 0 × ? = 0, ? × 0 = 0, or 0 ÷ ? = 0 */
/* A fraction to simplify hides a number of its simplest form instead (6/8 = ?/4), so only one that simplifies can. */
const askable = ({ op, a, b }, ask) =>
  !ask ||
  !(
    (op === "mult" && (a === 0 || b === 0)) ||
    (op === "div" && a === 0 && ask === "b") ||
    (op === "simp" && gcd(a, b) === 1)
  );
/* the number a fact asks for: its answer, or the number it hides */
const factValue = (fact) => {
  const { op, a, b, ask } = fact;
  if (op === "simp" && ask) return simplest(a, b)[ask === "a" ? 0 : 1];
  return ask === "a" ? a : ask === "b" ? b : factAnswer(fact);
};
/* the fact as asked: "7 + 8 = ?", "7 + ? = 15", "? + 8 = 15", "6/8 = ?", "6/8 = ?/4" */
const factPrompt = (fact) => {
  const { op, a, b, ask } = fact,
    sign = FACT_OPS[op].sign;
  if (op === "simp") {
    const [n, d] = simplest(a, b);
    return `${a}/${b} = ${!ask ? "?" : ask === "a" ? `?/${d}` : `${n}/?`}`;
  }
  return ask
    ? `${ask === "a" ? "?" : a} ${sign} ${ask === "b" ? "?" : b} = ${factAnswer(fact)}`
    : `${a} ${sign} ${b} = ?`;
};
/* the whole fact: "7 + 8 = 15", "6/8 = 3/4", or "5/8 is already simplest" */
const factFull = (fact) =>
  fact.op === "simp" && gcd(fact.a, fact.b) === 1
    ? `${factText(fact)} is already simplest`
    : `${factText(fact)} = ${factAnswer(fact)}`;
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
  if (op === "simp") {
    /* every fraction less than 1 that simplifies, and about 1 in 6 already in simplest form, spread evenly */
    const denominators = choice === "100" ? [100] : range(+choice - 1).map((i) => i + 2),
      simplifies = [],
      already = [];
    denominators.forEach((b) =>
      range(b - 1).forEach((i) => (gcd(i + 1, b) > 1 ? simplifies : already).push({ op, a: i + 1, b })),
    );
    const keep = Math.round(simplifies.length / 5);
    return [...simplifies, ...range(keep).map((i) => already[Math.floor((i * already.length) / keep)])];
  }
  return facts;
}

/* ---------- choices ---------- */
/* Four answers to pick from: the right one and 3 named mistakes, all different whole numbers, in a random order. Mistakes
   that land on the right answer, or below 0, are left out, and numbers near the answer fill any gap. */
function factChoices(fact) {
  if (fact.op === "simp") return simpChoices(fact);
  const { op, a, b, ask } = fact,
    answer = factValue(fact),
    near = pick([1, -1]),
    mistakes = ask ? missingMistakes(fact, near) : [];
  if (ask) {
    /* nothing more: the missing-number mistakes are in, and numbers near the answer fill any gap */
  } else if (op === "add")
    mistakes.push(
      [answer + near, "Count on carefully from the bigger number."],
      [Math.abs(a - b), `That’s ${Math.max(a, b)} − ${Math.min(a, b)}. This one is plus.`],
      [answer - near, "Count on carefully from the bigger number."],
      [answer + 2 * near, "Count on carefully from the bigger number."],
      [a * b, `That’s ${a} × ${b}. This one is plus.`],
      [answer + 10 * (answer >= 10 ? -1 : 1), "Look at the tens: is it more or less than 10?"],
    );
  else if (op === "sub")
    mistakes.push(
      [answer + near, "Count back carefully, or think addition."],
      [a + b, `That’s ${a} + ${b}. This one is minus.`],
      [b, `${b} is the number taken away. What’s left?`],
      [answer - near, "Count back carefully, or think addition."],
      [answer + 2 * near, "Count back carefully, or think addition."],
    );
  else if (op === "mult") {
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
  } else if (op === "div")
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

/* Named mistakes for a fact with a hidden number: giving the number shown after =, the wrong operation, or a number one
   off (shown worked out, so the student sees why it doesn't fit). */
function missingMistakes(fact, near) {
  const { op, a, b, ask } = fact,
    total = factAnswer(fact),
    value = factValue(fact),
    /* the fact with the hidden number one off: what it would give */
    offBy = (n) => (ask === "a" ? { ...fact, a: value + n } : { ...fact, b: value + n }),
    worked = (n) => `${factText(offBy(n))} = ${factAnswer(offBy(n))}, not ${total}.`,
    shown = ask === "a" ? b : a;
  if (op === "add")
    return [
      [total, `${total} is the total. What do you add to ${shown} to make it?`],
      [total + shown, `That adds ${shown}. Think ${total} − ${shown}.`],
      [value + near, worked(near)],
      [value - near, worked(-near)],
    ];
  if (op === "sub")
    return ask === "b"
      ? [
          [total, `${total} is what’s left. How many were taken away?`],
          [a + total, `That adds. Think ${a} − ${total}.`],
          [value + near, worked(near)],
          [value - near, worked(-near)],
        ]
      : [
          [total, `${total} is what’s left. How many were there to start?`],
          [Math.abs(total - b), `That takes away. Add back what was taken: ${total} + ${b}.`],
          [value + near, worked(near)],
          [value - near, worked(-near)],
        ];
  if (op === "mult")
    return [
      [total, `${total} is the product. What times ${shown} makes it?`],
      [total - shown, `That subtracts. Think ${total} ÷ ${shown}.`],
      [value + near, worked(near)],
      [value - near, worked(-near)],
    ];
  /* division */
  return ask === "a"
    ? [
        [total, `${total} is the answer. What was divided by ${b}?`],
        [b + total, `That adds. Multiply: ${b} × ${total}.`],
        [b * (total + near), `${b * (total + near)} ÷ ${b} = ${total + near}, not ${total}.`],
        [b * (total - near), `${b * (total - near)} ÷ ${b} = ${total - near}, not ${total}.`],
      ]
    : [
        [total, `${total} is the answer. What do you divide ${a} by to get it?`],
        [a - total, `That subtracts. Think ${total} × ? = ${a}.`],
        /* never ÷ 0 */
        ...[near, -near].filter((n) => value + n > 0).map((n) => [value + n, `${a} ÷ ${value + n} isn’t ${total}.`]),
      ];
}

/* ---------- how to work it out ---------- */
/* A strategy for the fact, in words, and a picture of it: ten-frames to make ten or take away, an array, or a rectangle
   broken into two easier facts. */
function factHelp(fact) {
  if (fact.op === "simp") return simpHelp(fact);
  if (fact.ask) return { text: missingHelp(fact), fig: factHelp({ ...fact, ask: null }).fig };
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
  if (fact.op === "simp") return simpHint(fact);
  if (fact.ask) return missingHint(fact);
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

/* how to find a hidden number: with the related fact (subtract to find an addend, divide to find a factor) */
function missingHelp(fact) {
  const { op, a, b, ask } = fact,
    total = factAnswer(fact),
    whole = factFull(fact);
  if (op === "add")
    return ask === "b"
      ? `${a} + ? = ${total}: think ${total} − ${a} = ${b}. ${whole}.`
      : `? + ${b} = ${total}: think ${total} − ${b} = ${a}. ${whole}.`;
  if (op === "sub")
    return ask === "b"
      ? `${a} − ? = ${total}: think ${total} + ? = ${a}. ${total} + ${b} = ${a}, so ${whole}.`
      : `? − ${b} = ${total}: add back what was taken away. ${total} + ${b} = ${a}, so ${whole}.`;
  if (op === "mult")
    return ask === "b"
      ? `${a} × ? = ${total}: think ${total} ÷ ${a} = ${b}. ${whole}.`
      : `? × ${b} = ${total}: think ${total} ÷ ${b} = ${a}. ${whole}.`;
  return ask === "a"
    ? `? ÷ ${b} = ${total}: multiply. ${b} × ${total} = ${a}, so ${whole}.`
    : `${a} ÷ ? = ${total}: think ${total} × ? = ${a}. ${total} × ${b} = ${a}, so ${whole}.`;
}
/* the same, as a hint that doesn't give the hidden number away */
function missingHint(fact) {
  const { op, a, b, ask } = fact,
    total = factAnswer(fact);
  if (op === "add") return `Think ${total} − ${ask === "b" ? a : b}.`;
  if (op === "sub")
    return ask === "b"
      ? total === 0
        ? `What can you take away from ${a} to leave nothing?`
        : `What do you add to ${total} to make ${a}?`
      : `Add back what was taken away: ${total} + ${b}.`;
  if (op === "mult") return `${ask === "b" ? a : b} times what is ${total}?`;
  return ask === "a"
    ? `Multiply: ${b} × ${total}.`
    : total === 1
      ? "A number divided by itself is 1."
      : `${total} times what is ${a}?`;
}

/* ---------- simplifying fractions ---------- */
/* Four choices for a fraction to simplify: its simplest form and 3 named mistakes (dividing by a common factor that isn't
   the greatest, dividing only the top or the bottom, taking the same number from both, flipping it, or multiplying when
   it's already simplest). With a hidden number (6/8 = ?/4), the choices are numbers: the one before simplifying, one from
   taking away instead of dividing, and ones a little off. Choices are text ("3/4") or numbers, all different. */
function simpChoices(fact) {
  const { a, b, ask } = fact,
    g = gcd(a, b),
    [n, d] = simplest(a, b),
    value = factValue(fact),
    near = pick([1, -1]);
  let mistakes;
  if (ask === "a")
    mistakes = [
      [a, `${a} is the top before simplifying. ${b} ÷ ${g} = ${d}, so divide ${a} by ${g} too.`],
      [a - (b - d), `That takes the same amount from the top as from the bottom. Divide instead: ${a} ÷ ${g}.`],
      [n + near, `${n + near}/${d} isn’t equal to ${a}/${b}.`],
      [n - near, `${n - near}/${d} isn’t equal to ${a}/${b}.`],
    ];
  else if (ask === "b")
    mistakes = [
      [b, `${b} is the bottom before simplifying. ${a} ÷ ${g} = ${n}, so divide ${b} by ${g} too.`],
      [b - (a - n), `That takes the same amount from the bottom as from the top. Divide instead: ${b} ÷ ${g}.`],
      [d + near, `${n}/${d + near} isn’t equal to ${a}/${b}.`],
      [d - near, `${n}/${d - near} isn’t equal to ${a}/${b}.`],
    ];
  else if (g === 1)
    mistakes = [
      [`${2 * a}/${2 * b}`, `That’s equal to ${a}/${b}, but not simpler: both were multiplied by 2.`],
      ...(a > 1
        ? [[`${a - 1}/${b - 1}`, `Taking 1 from the top and bottom changes the size. ${a}/${b} is already simplest.`]]
        : []),
      [`${b}/${a}`, "That’s flipped: the top and bottom changed places."],
      [`${a + 1}/${b}`, `That’s not equal to ${a}/${b}. Only 1 divides both ${a} and ${b}.`],
    ];
  else {
    /* a common factor smaller than the greatest: the smallest number above 1 that divides both */
    const smaller = range(g - 2)
      .map((i) => i + 2)
      .find((f) => g % f === 0);
    mistakes = [
      ...(smaller
        ? [
            [
              `${a / smaller}/${b / smaller}`,
              `That’s equal, but not simplest: ${a / smaller} and ${b / smaller} can both still be divided by ${g / smaller}.`,
            ],
          ]
        : []),
      [`${n}/${b}`, `Divide the bottom by ${g} too.`],
      [`${a}/${d}`, `Divide the top by ${g} too.`],
      ...(a - g >= 1
        ? [
            [
              `${a - g}/${b - g}`,
              "Taking the same number from the top and bottom changes the size. Divide both instead.",
            ],
          ]
        : []),
      ...(n > 1 ? [[`${d}/${n}`, "That’s flipped: the top and bottom changed places."]] : []),
    ];
  }
  const picked = [];
  mistakes.forEach(([choice, why]) => {
    /* whole numbers above 0, or fractions with a top and bottom above 0; different from the answer and each other */
    const ok = typeof choice === "number" ? choice > 0 : choice.split("/").every((part) => +part > 0);
    if (picked.length < 3 && ok && choice !== value && !picked.some((p) => p.value === choice))
      picked.push({ value: choice, why });
  });
  /* fill any gap: numbers near the answer, or fractions with the answer's bottom and a different top */
  for (let step = 1; picked.length < 3; step++)
    [step, -step].forEach((offset) => {
      const choice = ask ? value + offset : `${n + offset}/${d}`,
        ok = ask ? choice > 0 : n + offset > 0;
      if (picked.length < 3 && ok && choice !== value && !picked.some((p) => p.value === choice))
        picked.push({ value: choice, why: `That isn’t equal to ${a}/${b}.` });
    });
  return shuffle([{ value, why: null }, ...picked]);
}
/* how to simplify: divide the top and bottom by their greatest common factor, with strips (or a hundred grid) showing
   the same amount */
function simpHelp(fact) {
  const { a, b, ask } = fact,
    g = gcd(a, b),
    [n, d] = simplest(a, b),
    fig =
      b === 100
        ? hundredGrid(cellsOf([a, "a"]), { label: `A hundred grid with ${a} squares shaded` })
        : strips([{ d: b, k: a, lab: [a, b] }, ...(g > 1 ? [{ d, k: n, cls: "b", lab: [n, d] }] : [])], {
            label: `Fraction strips: ${a}/${b}${g > 1 ? ` and ${n}/${d}, the same length` : ""}`,
          });
  if (g === 1)
    return { text: `${a} and ${b} have no common factor except 1, so ${a}/${b} is already in simplest form.`, fig };
  if (ask === "a")
    return {
      text: `${b} ÷ ${g} = ${d}, so divide the top by ${g} too: ${a} ÷ ${g} = ${n}. ${a}/${b} = ${n}/${d}.`,
      fig,
    };
  if (ask === "b")
    return {
      text: `${a} ÷ ${g} = ${n}, so divide the bottom by ${g} too: ${b} ÷ ${g} = ${d}. ${a}/${b} = ${n}/${d}.`,
      fig,
    };
  return {
    text: `The greatest number that divides both ${a} and ${b} is ${g}. ${a} ÷ ${g} = ${n} and ${b} ÷ ${g} = ${d}, so ${a}/${b} = ${n}/${d}.`,
    fig,
  };
}
/* the same, as a hint that doesn't give the answer away (or say whether it simplifies) */
function simpHint(fact) {
  const { a, b, ask } = fact,
    [n, d] = simplest(a, b);
  if (ask === "a") return `What did you divide ${b} by to get ${d}? Divide ${a} by the same number.`;
  if (ask === "b") return `What did you divide ${a} by to get ${n}? Divide ${b} by the same number.`;
  return `What’s the biggest number that divides both ${a} and ${b}?`;
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
