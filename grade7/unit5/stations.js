/* Deep Dive (Grade 7 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (number formats) and shared/signed.js (number lines). Answers can be negative, so every typed problem sets
   neg (the full keyboard, with a minus sign). Every problem carries facts for checks.js: its type (t) and the numbers its
   checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying what it asks. */
/* a num problem that may be negative: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", neg: true, ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a whole number from a to b that isn't 0 */
const nonzero = (a, b) => {
  const n = R(a, b);
  return n === 0 ? nonzero(a, b) : n;
};
/* a number line from lo to hi that fits every value given, in steps of 5 */
const lineFor = (...values) => [
  Math.min(-5, Math.floor(Math.min(...values) / 5) * 5),
  Math.max(5, Math.ceil(Math.max(...values) / 5) * 5),
];

/* ---------- Station 1: changing temperatures and elevations (Lessons 1 to 3) ---------- */
/* places for temperatures, and for elevations (meters) */
const COLD_PLACES = ["Anchorage", "Fairbanks", "Minneapolis", "a ski hill", "the Arctic station"];
function genTemps() {
  const type = pick(["after", "after", "change", "elevation"]);
  if (type === "after" || type === "change") {
    /* a temperature and a change: the new temperature, or the change between two */
    const start = R(-12, 10),
      change = nonzero(-12, 12),
      end = start + change,
      place = pick(COLD_PLACES),
      [lo, hi] = lineFor(start, end);
    if (Math.abs(end) > 20) return genTemps();
    const after = type === "after";
    return numP({
      prompt: after
        ? `At ${place}, it was ${fmt(start)}°F at noon. By evening the temperature had <b>${change > 0 ? "risen" : "dropped"} ${Math.abs(change)}°</b>. What was the evening temperature?`
        : `At ${place}, it was ${fmt(start)}°F at noon and ${fmt(end)}°F in the evening. What was the <b>change</b> in temperature? (A drop is negative.)`,
      answer: after ? end : change,
      unit: after ? "°F" : "degrees",
      fig: (show) =>
        vLine(lo, hi, {
          kind: "temp",
          unit: "°",
          value: show ? end : start,
          pts: show
            ? [
                { v: start, t: "noon", cls: "b" },
                { v: end, t: "evening" },
              ]
            : [{ v: start, t: "noon", cls: "b" }],
        }),
      hint: after
        ? `Start at ${fmt(start)} and go ${change > 0 ? "up" : "down"} ${Math.abs(change)}: ${fmt(start)} + ${par(change)}.`
        : `How far, and which way, from ${fmt(start)} to ${fmt(end)}? Going down is negative.`,
      misc: after
        ? [
            [
              start - change,
              `That goes the wrong way. The temperature ${change > 0 ? "rose" : "dropped"}: ${fmt(start)} + ${par(change)}.`,
            ],
            [-end, "Check the sign: is the evening above or below zero?"],
            [Math.abs(start) + Math.abs(change), "Watch where 0 is. Count on the thermometer past zero."],
          ]
        : [
            [
              -change,
              `The temperature went ${change > 0 ? "up" : "down"}, so the change is ${change > 0 ? "positive" : "negative"}.`,
            ],
            [end + start, `That adds the temperatures. The change is evening − noon: ${fmt(end)} − ${par(start)}.`],
          ],
      explain: after
        ? `${fmt(start)} + ${par(change)} = ${fmt(end)}°F.`
        : `${fmt(end)} − ${par(start)} = ${fmt(change)}: the temperature ${change > 0 ? "rose" : "dropped"} ${Math.abs(change)}°.`,
      facts: { t: type, start, change, end },
    });
  }
  /* elevations: a bird above the sea and a fish below, the distance between them */
  const high = R(2, 12) * 10,
    low = -R(2, 15) * 10,
    answer = high - low;
  return numP({
    prompt: `A pelican flies ${high} m above sea level. A fish swims at ${fmt(low)} m. How far is the pelican <b>above</b> the fish?`,
    answer,
    unit: "m",
    fig: (show) =>
      vLine(Math.floor(low / 50) * 50 - 50, Math.ceil(high / 50) * 50 + 50, {
        kind: "sea",
        every: 50,
        step: 10,
        unit: " m",
        pts: [
          { v: high, t: show ? `pelican, ${high} m` : "pelican" },
          { v: low, t: show ? `fish, ${fmt(low)} m` : "fish", cls: "b" },
        ],
      }),
    hint: `The pelican is ${high} m above sea level, and the fish is ${-low} m below it. Add the two distances, or work out ${high} − ${par(low)}.`,
    misc: [
      [
        high + low,
        `That’s ${high} − ${-low}. The fish is below sea level, so the distances add: ${high} − ${par(low)}.`,
      ],
      [-answer, "A distance above is positive."],
    ],
    explain: `${high} − ${par(low)} = ${high} + ${-low} = ${answer} m.`,
    facts: { t: type, high, low },
  });
}

/* ---------- Station 2: adding signed numbers (Lessons 3 and 4) ---------- */
function genAdd() {
  const type = pick(["sum", "sum", "debt", "missing"]);
  if (type === "sum") {
    /* a sum of two signed numbers, on a number line with jumps */
    const a = nonzero(-12, 12),
      b = nonzero(-12, 12),
      sum = a + b;
    if (a > 0 && b > 0) return genAdd();
    const [lo, hi] = lineFor(0, a, sum);
    return numP({
      prompt: `What is ${fmt(a)} + ${par(b)}?`,
      answer: sum,
      fig: (show) =>
        signedLine(lo, hi, {
          moves: show
            ? [
                { a: 0, b: a, t: fmt(a) },
                { a, b: sum, t: withSign(b), lv: 1, cls: "b" },
              ]
            : [],
          pts: show ? [{ v: sum, t: fmt(sum) }] : [],
          label: `A number line from ${lo} to ${hi}`,
        }),
      hint: `Start at ${fmt(a)}. Adding ${par(b)} moves ${Math.abs(b)} to the ${b > 0 ? "right" : "left"}.`,
      misc: [
        [a - b, `That subtracts. Adding ${par(b)} moves ${b > 0 ? "right" : "left"} ${Math.abs(b)}.`],
        [-sum, "Check the sign: which number is farther from 0?"],
        [
          Math.abs(a) + Math.abs(b),
          "The signs are different, so the numbers cancel out partway: subtract their distances from 0.",
        ],
      ],
      explain: `Start at ${fmt(a)} and move ${Math.abs(b)} ${b > 0 ? "right" : "left"}: ${fmt(a)} + ${par(b)} = ${fmt(sum)}.`,
      facts: { t: type, a, b },
    });
  }
  if (type === "debt") {
    /* a bank balance after a deposit or a charge */
    const balance = R(-8, 8) * 5,
      move = nonzero(-10, 10) * 5,
      after = balance + move,
      who = pick(["Elena", "Diego", "Priya", "Kiran", "Noah"]);
    if (after === 0 || (balance >= 0 && after >= 0)) return genAdd();
    return numP({
      prompt: `${who}’s account balance is ${money(balance)}${balance < 0 ? " (owing money)" : ""}. Then ${move > 0 ? `${who} deposits ${money(move)}` : `a ${money(-move)} charge comes in`}. What is the new balance?`,
      answer: after,
      unit: "dollars",
      fig: (show) =>
        vLine(lineFor(balance, after)[0], lineFor(balance, after)[1], {
          kind: "money",
          every: 10,
          step: 5,
          pts: show
            ? [
                { v: balance, t: "before", cls: "b" },
                { v: after, t: "after" },
              ]
            : [{ v: balance, t: "before", cls: "b" }],
        }),
      hint: `${move > 0 ? "A deposit adds" : "A charge takes away"} ${money(Math.abs(move))}: ${fmt(balance)} + ${par(move)}.`,
      misc: [
        [balance - move, `${move > 0 ? "A deposit raises" : "A charge lowers"} the balance.`],
        [-after, "Check the sign: is the account above or below zero now?"],
      ],
      explain: `${fmt(balance)} + ${par(move)} = ${fmt(after)}, so the balance is ${money(after)}.`,
      facts: { t: type, a: balance, b: move },
    });
  }
  /* the missing addend: what to add to get from one number to another */
  const a = nonzero(-10, 10),
    sum = nonzero(-10, 10),
    b = sum - a;
  if (b === 0) return genAdd();
  const [lo, hi] = lineFor(0, a, sum);
  return numP({
    prompt: `${fmt(a)} + <b>?</b> = ${fmt(sum)}. What number goes in place of the ?`,
    answer: b,
    fig: (show) =>
      signedLine(lo, hi, {
        moves: show ? [{ a, b: sum, t: withSign(b), cls: "b" }] : [],
        pts: [
          { v: a, t: fmt(a), cls: "b" },
          { v: sum, t: fmt(sum) },
        ],
      }),
    hint: `How far and which way from ${fmt(a)} to ${fmt(sum)}? Right is positive and left is negative.`,
    misc: [
      [-b, `Check the direction: from ${fmt(a)} to ${fmt(sum)} is to the ${b > 0 ? "right" : "left"}.`],
      [sum + a, `That adds ${fmt(a)} again. Find the jump from ${fmt(a)} to ${fmt(sum)}.`],
    ],
    explain: `From ${fmt(a)} to ${fmt(sum)} is ${Math.abs(b)} to the ${b > 0 ? "right" : "left"}, so ${fmt(a)} + ${par(b)} = ${fmt(sum)}.`,
    facts: { t: type, a, b },
  });
}

/* ---------- Station 3: subtracting signed numbers (Lessons 5 to 7) ---------- */
function genSubtract() {
  const type = pick(["diff", "diff", "opposite", "depth"]);
  if (type === "diff" || type === "opposite") {
    /* a − b: adding the opposite, or what to add to b to get a */
    const a = nonzero(-12, 12),
      b = nonzero(-12, 12),
      answer = a - b;
    if (b > 0 && a > 0 && a > b) return genSubtract();
    if (type === "opposite") {
      return mcP(
        [
          [`${fmt(a)} + ${par(-b)}`, null],
          [
            `${fmt(a)} + ${par(b)}`,
            `That keeps ${par(b)} as it was. Subtracting ${par(b)} adds its opposite, ${par(-b)}.`,
          ],
          [
            `${fmt(-a)} + ${par(-b)}`,
            `Only the number being subtracted changes to its opposite. ${fmt(a)} stays the same.`,
          ],
        ],
        {
          prompt: `Which sum has the same value as <b>${fmt(a)} − ${par(b)}</b>?`,
          hint: "Subtracting a number is the same as adding its opposite.",
          explain: `Subtracting ${par(b)} is adding ${par(-b)}: ${fmt(a)} − ${par(b)} = ${fmt(a)} + ${par(-b)} = ${fmt(answer)}.`,
          facts: { t: type, a, b },
        },
      );
    }
    const [lo, hi] = lineFor(0, a, b);
    return numP({
      prompt: `What is ${fmt(a)} − ${par(b)}?`,
      answer,
      fig: (show) =>
        signedLine(lo, hi, {
          moves: show ? [{ a: b, b: a, t: withSign(answer), cls: "b" }] : [],
          pts: [
            { v: a, t: fmt(a) },
            { v: b, t: fmt(b), cls: "b", lv: Math.abs(a - b) < 2 ? 1 : 0 },
          ],
        }),
      hint: `${fmt(a)} − ${par(b)} asks: what do you add to ${fmt(b)} to get ${fmt(a)}? Or add the opposite: ${fmt(a)} + ${par(-b)}.`,
      misc: [
        [a + b, `That adds ${par(b)}. Subtracting ${par(b)} adds its opposite, ${par(-b)}.`],
        [-answer, `That’s ${fmt(b)} − ${par(a)}, the other way round.`],
        [Math.abs(a) - Math.abs(b), "Watch the signs: subtracting a negative moves right."],
      ],
      explain: `${fmt(a)} − ${par(b)} = ${fmt(a)} + ${par(-b)} = ${fmt(answer)}. Check: ${fmt(b)} + ${par(answer)} = ${fmt(a)}.`,
      facts: { t: type, a, b },
    });
  }
  /* the difference between two depths or heights */
  const diver = -R(3, 18) * 5,
    other = pick([-R(1, 3) * 5, R(1, 4) * 5]),
    answer = other - diver;
  if (other === diver) return genSubtract();
  const thing = other > 0 ? "lighthouse window" : "submarine";
  return numP({
    prompt: `A diver is at ${fmt(diver)} m. A ${thing} is at ${fmt(other)} m. What is ${fmt(other)} − ${par(diver)}, the ${thing}’s height <b>compared to the diver</b>?`,
    answer,
    unit: "m",
    fig: (show) =>
      vLine(lineFor(diver, other)[0], lineFor(diver, other)[1], {
        kind: "sea",
        every: 10,
        step: 5,
        unit: " m",
        pts: [
          { v: diver, t: "diver", cls: "b" },
          { v: other, t: show ? `${withSign(answer)} m` : thing },
        ],
      }),
    hint: `How far and which way from the diver at ${fmt(diver)} to ${fmt(other)}? Up is positive.`,
    misc: [
      [other + diver, `That adds the depths. Subtract: ${fmt(other)} − ${par(diver)}.`],
      [-answer, `That’s the diver compared to the ${thing}. Start at the diver.`],
    ],
    explain: `${fmt(other)} − ${par(diver)} = ${fmt(answer)}: the ${thing} is ${Math.abs(answer)} m ${answer > 0 ? "above" : "below"} the diver.`,
    facts: { t: type, a: other, b: diver },
  });
}

/* ---------- Station 4: multiplying signed numbers (Lessons 8 to 10) ---------- */
function genMultiply() {
  const type = pick(["product", "product", "motion", "sign"]);
  if (type === "motion") {
    /* position = velocity × time: east and the future are positive, west and the past are negative */
    const speed = nonzero(-9, 9),
      time = nonzero(-6, 6),
      answer = speed * time,
      who = pick(["A turtle", "A boat", "A robot", "A crab"]);
    return numP({
      prompt: `${who} moves along a straight line at ${Math.abs(speed)} m per second to the <b>${speed > 0 ? "east" : "west"}</b>. East is positive, and now is time 0. Where was it (or will it be) <b>${Math.abs(time)} seconds ${time > 0 ? "from now" : "ago"}</b>?`,
      answer,
      unit: "m",
      hint: `Velocity × time: ${par(speed)} × ${par(time)}. ${time < 0 ? "In the past, it was on the other side from where it’s heading." : "In the future, it’s on the side it’s heading."}`,
      misc: [
        [
          -answer,
          `Check the side: it moves ${speed > 0 ? "east" : "west"}, and ${time > 0 ? "after" : "before"} now it’s on the ${answer > 0 ? "east (positive)" : "west (negative)"} side.`,
        ],
        [speed + time, "Distance is speed times time: multiply."],
      ],
      explain: `${par(speed)} × ${par(time)} = ${fmt(answer)}: ${Math.abs(answer)} m ${answer > 0 ? "east" : "west"} of the start.`,
      facts: { t: type, a: speed, b: time },
    });
  }
  if (type === "sign") {
    /* the sign of a product of several numbers: count the negatives */
    const count = R(3, 5),
      factors = range(count).map(() => nonzero(-9, 9)),
      negatives = factors.filter((f) => f < 0).length,
      positive = negatives % 2 === 0;
    return mcP(
      [
        [
          "Positive",
          positive
            ? null
            : `There ${negatives === 1 ? "is 1 negative factor" : `are ${negatives} negative factors`}: an odd number, so the product is negative.`,
        ],
        [
          "Negative",
          positive
            ? `There ${negatives === 1 ? "is 1 negative" : `are ${negatives} negatives`}: they pair up and cancel, so the product is positive.`
            : null,
        ],
      ],
      {
        prompt: `Is the product <b>${factors.map(par).join(" × ")}</b> positive or negative?`,
        hint: "Each pair of negative factors makes a positive. Count the negatives.",
        explain: `${negatives} negative factor${negatives === 1 ? "" : "s"}: ${positive ? "an even number, so positive" : "an odd number, so negative"}.`,
        facts: { t: type, factors },
      },
    );
  }
  /* a product of two signed numbers */
  const a = nonzero(-12, 12),
    b = nonzero(-10, 10),
    answer = a * b;
  if (a > 0 && b > 0) return genMultiply();
  return numP({
    prompt: `What is ${par(a)} × ${par(b)}?`,
    answer,
    hint: `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(answer)}. ${a < 0 === b < 0 ? "Both factors are negative" : "One factor is negative"}: is the product positive or negative?`,
    misc: [
      [
        -answer,
        `Check the sign: ${a < 0 === b < 0 ? "a negative times a negative is positive" : "a positive times a negative is negative"}.`,
      ],
      [a + b, "That adds. Multiply."],
    ],
    explain: `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(answer)}, and ${a < 0 === b < 0 ? "two negatives make a positive" : "one negative makes it negative"}: ${fmt(answer)}.`,
    facts: { t: type, a, b },
  });
}

/* ---------- Station 5: dividing signed numbers and negative rates (Lessons 11 and 12) ---------- */
function genDivide() {
  const type = pick(["quotient", "quotient", "rate", "change"]);
  if (type === "quotient") {
    /* a quotient of signed numbers, from a multiplication fact */
    const b = nonzero(-10, 10),
      answer = nonzero(-10, 10),
      a = answer * b;
    if (a > 0 && b > 0) return genDivide();
    return numP({
      prompt: `What is ${fmt(a)} ÷ ${par(b)}?`,
      answer,
      hint: `What times ${par(b)} makes ${fmt(a)}? ${par(b)} × ? = ${fmt(a)}.`,
      misc: [
        [-answer, `Check: ${par(b)} × ${par(-answer)} = ${fmt(-a)}, not ${fmt(a)}.`],
        [a * b, "That multiplies. Divide."],
      ],
      explain: `${par(b)} × ${par(answer)} = ${fmt(a)}, so ${fmt(a)} ÷ ${par(b)} = ${fmt(answer)}.`,
      facts: { t: type, a, b },
    });
  }
  if (type === "rate") {
    /* a negative rate: how much a temperature or water level changes in some hours */
    const rate = -R(1, 6),
      hours = R(2, 8),
      start = R(0, 10) * 2,
      answer = start + rate * hours,
      what = pick(["temperature", "water level"]);
    if (Math.abs(answer) > 30) return genDivide();
    const unit = what === "temperature" ? "°F" : "cm";
    return numP({
      prompt: `The ${what} is ${fmt(start)} ${unit} and changes at <b>${fmt(rate)} ${unit} per hour</b>. What will it be in ${hours} hours?`,
      answer,
      unit,
      hint: `In ${hours} hours it changes by ${par(rate)} × ${hours}. Add that to ${fmt(start)}.`,
      misc: [
        [start - rate * hours, `A rate of ${fmt(rate)} per hour goes down, not up.`],
        [rate * hours, `That’s the change. Add it to the starting ${fmt(start)}.`],
      ],
      explain: `${par(rate)} × ${hours} = ${fmt(rate * hours)}, and ${fmt(start)} + ${par(rate * hours)} = ${fmt(answer)} ${unit}.`,
      facts: { t: type, start, rate, hours },
    });
  }
  /* the rate from a change over some time: change ÷ time */
  const rate = nonzero(-6, 6),
    hours = R(2, 6),
    change = rate * hours,
    what = pick(["A balloon’s height", "A pool’s water level", "A plane’s height"]),
    unit = what.startsWith("A pool") ? "cm" : "m";
  return numP({
    prompt: `${what} ${change > 0 ? "rose" : "fell"} ${Math.abs(change)} ${unit} in ${hours} minutes, at a steady rate. What was the rate of change, in ${unit} per minute? (Falling is negative.)`,
    answer: rate,
    unit: `${unit} per minute`,
    hint: `Rate = change ÷ time: ${fmt(change)} ÷ ${hours}.`,
    misc: [
      [-rate, `It ${change > 0 ? "rose" : "fell"}, so the rate is ${change > 0 ? "positive" : "negative"}.`],
      [change, "That’s the change. Divide by the minutes for the rate."],
    ],
    explain: `${fmt(change)} ÷ ${hours} = ${fmt(rate)} ${unit} per minute.`,
    facts: { t: "rateOf", change, hours },
  });
}

/* ---------- Station 6: expressions and equations (Lessons 13 to 16) ---------- */
function genEquations() {
  const type = pick(["evaluate", "addEq", "mulEq", "mulEq"]);
  const x = mathVar("x");
  if (type === "evaluate") {
    /* the value of an expression with a negative number in it */
    const a = nonzero(-6, 6),
      b = nonzero(-9, 9),
      v = nonzero(-6, 6),
      answer = a * v + b;
    return numP({
      prompt: `What is the value of ${a === 1 ? "" : a === -1 ? "−" : fmt(a)}${x} ${b < 0 ? "−" : "+"} ${Math.abs(b)} when ${x} = ${fmt(v)}?`,
      answer,
      hint: `Put ${par(v)} in for ${x}: ${par(a)} × ${par(v)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}. Multiply first.`,
      misc: [
        [-a * v + b, `Check the sign of ${par(a)} × ${par(v)}.`],
        [a * (v + b), "Multiply first, then add."],
      ],
      explain: `${par(a)} × ${par(v)} = ${fmt(a * v)}, and ${fmt(a * v)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${fmt(answer)}.`,
      facts: { t: type, a, b, v },
    });
  }
  if (type === "addEq") {
    /* x + b = c: subtract b from both sides */
    const b = nonzero(-12, 12),
      answer = nonzero(-12, 12),
      c = answer + b;
    return numP({
      prompt: `Solve: ${x} + ${par(b)} = ${fmt(c)}`,
      answer,
      hint: `Undo adding ${par(b)}: add its opposite, ${par(-b)}, to both sides.`,
      misc: [
        [c + b, `That adds ${par(b)} again. Undo it: ${fmt(c)} − ${par(b)}.`],
        [-answer, `Check: ${par(-answer)} + ${par(b)} = ${fmt(-answer + b)}, not ${fmt(c)}.`],
      ],
      explain: `${x} = ${fmt(c)} − ${par(b)} = ${fmt(answer)}. Check: ${par(answer)} + ${par(b)} = ${fmt(c)}.`,
      facts: { t: type, b, c },
    });
  }
  /* a·x = c: divide both sides by a */
  const a = nonzero(-9, 9),
    answer = nonzero(-10, 10),
    c = a * answer;
  if (a === 1) return genEquations();
  return numP({
    prompt: `Solve: ${a === -1 ? "−" : fmt(a)}${x} = ${fmt(c)}`,
    answer,
    hint: `${x} is multiplied by ${par(a)}. Divide both sides by ${par(a)}.`,
    misc: [
      [-answer, `Check: ${par(a)} × ${par(-answer)} = ${fmt(-c)}, not ${fmt(c)}.`],
      [c - a, "Undo multiplying by dividing, not subtracting."],
      [c * a, "That multiplies. Divide both sides."],
    ],
    explain: `${x} = ${fmt(c)} ÷ ${par(a)} = ${fmt(answer)}. Check: ${par(a)} × ${par(answer)} = ${fmt(c)}.`,
    facts: { t: type, a, c },
  });
}

const ZONES = [
  {
    id: "temps",
    name: "Thermocline",
    lessons: "Lessons 1–3",
    blurb: "Follow temperatures above and below zero, and find how far a pelican is above a fish.",
    gen: genTemps,
  },
  {
    id: "add",
    name: "Current Jumps",
    lessons: "Lessons 3–4",
    blurb: "Add signed numbers with jumps on a number line, and track an account that owes money.",
    gen: genAdd,
  },
  {
    id: "subtract",
    name: "Depth Gauge",
    lessons: "Lessons 5–7",
    blurb: "Subtract by adding the opposite, and compare depths and heights.",
    gen: genSubtract,
  },
  {
    id: "multiply",
    name: "Sonar Sweep",
    lessons: "Lessons 8–10",
    blurb: "Multiply signed numbers, find where a moving boat was or will be, and count the negatives.",
    gen: genMultiply,
  },
  {
    id: "divide",
    name: "Pressure Drop",
    lessons: "Lessons 11–12",
    blurb: "Divide signed numbers, and use negative rates of change.",
    gen: genDivide,
  },
  {
    id: "equations",
    name: "Signal Decoder",
    lessons: "Lessons 13–16",
    blurb: "Evaluate expressions with negatives, and solve equations like x + 7 = −3 and −4x = 20.",
    gen: genEquations,
  },
  {
    id: "boss",
    name: "The Abyss",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genTemps, genAdd, genSubtract, genMultiply, genDivide, genEquations])(),
  },
];

const ICON = {
  temps:
    '<rect x="26" y="6" width="12" height="40" rx="6" fill="rgba(243,246,251,.1)" stroke="#f3f6fb" stroke-width="2.5"/><rect x="29" y="26" width="6" height="22" fill="#6fb8ff"/><circle cx="32" cy="50" r="9" fill="#6fb8ff" stroke="#f3f6fb" stroke-width="2.5"/>',
  add: '<path d="M4,46 H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,40 v12" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32 H50" stroke="#ffc93c" stroke-width="3.5"/><polygon points="56,32 48,27 48,37" fill="#ffc93c"/><path d="M50,20 H18" stroke="#7fe3ff" stroke-width="3.5"/><polygon points="12,20 20,15 20,25" fill="#7fe3ff"/>',
  subtract:
    '<rect x="4" y="30" width="56" height="30" fill="rgba(64,140,255,.3)"/><path d="M4,30 H60" stroke="#7fe3ff" stroke-width="2"/><circle cx="20" cy="48" r="5" fill="#ffc93c"/><path d="M44,12 v30" stroke="#f3f6fb" stroke-width="2.5"/><path d="M40,16 l4,-6 4,6 M40,38 l4,6 4,-6" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  multiply:
    '<text x="32" y="40" fill="#ffc93c" font-size="18" font-weight="800" text-anchor="middle" font-family="monospace">−×−</text>',
  divide:
    '<path d="M8,14 L28,30 L42,24 L58,50" fill="none" stroke="#7fe3ff" stroke-width="3.5" stroke-linejoin="round"/><polygon points="58,50 50,46 56,40" fill="#7fe3ff"/>',
  equations:
    '<text x="32" y="38" fill="#ffc93c" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">−4x=8</text>',
  boss: '<rect x="4" y="4" width="56" height="56" rx="6" fill="rgba(9,32,61,.9)" stroke="#7fe3ff" stroke-width="2"/><circle cx="32" cy="36" r="10" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M32,8 v14" stroke="#f3f6fb" stroke-width="2.5"/>',
};
