/* Dragon Duel (Grade 2 Unit 5): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Base-ten diagrams, number names, and place-value charts come from shared/blocks.js, number lines from shared/numlines.js,
   and mcOf and miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant), each with a comment
   saying what it asks. A number's digits are hundreds, tens, and ones. */
const place = ["hundreds", "tens", "ones"];
/* n and the place word for it: "1 hundred", "3 tens" (word is the plural) */
const say = (n, word) => `${n} ${n === 1 ? word.replace(/s$/, "") : word}`;
/* "3 hundreds, 4 tens, 1 one" */
const htoSay = (hundreds, tens, ones) => `${say(hundreds, "hundreds")}, ${say(tens, "tens")}, ${say(ones, "ones")}`;
/* a three-digit number; zero: its tens or ones digit is 0 */
function num3(zero = Math.random() < 0.35) {
  const hundreds = R(1, 9);
  let tens = R(1, 9),
    ones = R(1, 9);
  if (zero) {
    if (Math.random() < 0.5) tens = 0;
    else ones = 0;
  }
  return hundreds * 100 + tens * 10 + ones;
}

/* blocks drawn bigger than the Learn page's: twice as wide, up to 560 pixels */
const zoom = (svg) => svg.replace(/max-width:([\d.]+)px/, (match, width) => `max-width:${Math.min(2 * width, 560)}px`);
const bigBlocks = (...args) => zoom(htoFig(...args));

/* `tens` tens in groups of 10 (3 groups to a row); show: outline each full group, which makes a hundred */
function tenGroups(tens, show) {
  /* each group of 10 sticks is groupW by groupH */
  const groupW = 10 * (BT + 4) + 4,
    groupH = FW + 10;
  let markup = "";
  range(Math.ceil(tens / 10)).forEach((group) => {
    const sticks = Math.min(10, tens - group * 10),
      x = 8 + (group % 3) * (groupW + 14),
      y = 8 + Math.floor(group / 3) * (groupH + 12);
    range(sticks).forEach((i) => {
      markup += stick(x + 4 + i * (BT + 4), y + 5);
    });
    if (show && sticks === 10)
      markup += `<rect class="grp10" x="${x}" y="${y}" width="${groupW}" height="${groupH}" rx="6"/>`;
  });
  const cols = Math.min(3, Math.ceil(tens / 10)),
    rows = Math.ceil(tens / 30);
  return zoom(
    svgWrap(16 + cols * groupW + (cols - 1) * 14, 16 + rows * groupH + (rows - 1) * 12, markup, `${tens} tens`),
  );
}

/* ---------- Tower of Tens: make a hundred (Lessons 1–2) ---------- */
function genHundred() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* how many more tens make a hundred; the hint draws the missing tens dashed */
    const tens = pick([3, 4, 6, 7, 8, 9]);
    return {
      kind: "num",
      unit: "more tens",
      answer: 10 - tens,
      prompt: `Here are ${tens} tens. How many more tens make a hundred?`,
      fig: (show) =>
        show
          ? zoom(
              svgWrap(
                10 * (BT + 4) + 24,
                FW + 16,
                range(10)
                  .map((i) => stick(8 + i * (BT + 4) + Math.floor(i / 5) * 5, 8, i < tens ? "" : "ghost"))
                  .join(""),
                `${tens} tens and ${10 - tens} more to make a hundred`,
              ),
            )
          : bigBlocks(0, tens, 0, {}, `${tens} tens`),
      misc: miscOf(10 - tens, [
        [tens, `That’s how many tens there are now. How many more make 10 tens?`],
        [(10 - tens) * 10, `That’s ${(10 - tens) * 10} ones. How many tens is that?`],
        [10, "10 tens is the whole hundred. Some are already here."],
      ]),
      hint: `A hundred is 10 tens. The dashed sticks are the missing tens. Count on from ${tens} to 10.`,
      explain: `${tens} tens and ${10 - tens} more tens make 10 tens. 10 tens is a hundred.`,
    };
  }
  if (variant === 1) {
    /* how many hundreds a number of tens makes */
    const hundreds = R(2, 9),
      tens = hundreds * 10;
    return {
      kind: "num",
      unit: "hundreds",
      answer: hundreds,
      prompt: `How many hundreds can you make with ${tens} tens?`,
      fig: (show) => tenGroups(tens, show),
      misc: miscOf(hundreds, [
        [tens, "That’s the number of tens. Every 10 tens make 1 hundred."],
        [tens * 10, `${tens * 10} is the number. How many hundreds is that?`],
      ]),
      hint: "Circle groups of 10 tens. Each group is a hundred.",
      explain: `Every 10 tens make a hundred. ${tens} tens make ${hundreds} hundreds: ${hundreds * 100}.`,
    };
  }
  if (variant === 2) {
    /* how many tens are in some hundreds */
    const hundreds = R(2, 9);
    return {
      kind: "num",
      unit: "tens",
      answer: hundreds * 10,
      prompt: `How many tens are in ${hundreds * 100}?`,
      fig: () => bigBlocks(hundreds, 0, 0, {}, `${hundreds} hundreds`),
      misc: miscOf(hundreds * 10, [
        [hundreds, `${hundreds} is how many hundreds. Each hundred is 10 tens.`],
        [hundreds * 100, `${hundreds * 100} is the number. How many tens is that?`],
      ]),
      hint: "Each hundred is 10 tens. Count by tens for each hundred: 10, 20, …",
      explain: `${hundreds} hundreds is ${hundreds} groups of 10 tens: ${hundreds * 10} tens.`,
    };
  }
  /* what number some tens make (not a whole number of hundreds); extra: the tens left after the hundreds */
  let tens = R(11, 39);
  if (tens % 10 === 0) tens++;
  const hundreds = Math.floor(tens / 10),
    extra = tens % 10;
  return {
    kind: "num",
    unit: "",
    answer: tens * 10,
    prompt: `What number do ${tens} tens make?`,
    fig: (show) => tenGroups(tens, show),
    misc: miscOf(tens * 10, [
      [tens, `That’s the number of tens. Each ten is worth 10.`],
      [hundreds * 100 + extra, `${extra} tens is ${extra * 10}, not ${extra}.`],
    ]),
    hint: `Make hundreds: ${tens} tens is ${say(hundreds, "hundreds")} and ${say(extra, "tens")}.`,
    explain: `${tens} tens is ${say(hundreds, "hundreds")} and ${say(extra, "tens")}: ${hundreds * 100} + ${extra * 10} = ${tens * 10}.`,
  };
}

/* ---------- Block Forge: three-digit numbers (Lessons 3–4) ---------- */
function genBuild() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* what number the blocks show */
    const n = num3(),
      [hundreds, tens, ones] = digits(n);
    return {
      kind: "num",
      unit: "",
      answer: n,
      prompt: "What number do the blocks show?",
      fig: () => bigBlocks(hundreds, tens, ones, { cls: { t: "b", o: "c" } }, htoSay(hundreds, tens, ones)),
      misc: miscOf(n, [
        ...(tens !== ones
          ? [[hundreds * 100 + ones * 10 + tens, "Tens come before ones. Count the sticks for the tens digit."]]
          : []),
        ...(!tens || !ones
          ? [
              [
                Number(`${hundreds}${tens || ""}${ones || ""}`),
                `${!tens ? "There are no tens" : "There are no ones"}, so that place gets a 0.`,
              ],
            ]
          : []),
        [hundreds + tens + ones, "Each big square is 100 and each stick is 10. Don’t just count the pieces."],
      ]),
      hint: "Big squares are hundreds. Sticks are tens. Small squares are ones.",
      explain: `${htoSay(hundreds, tens, ones)} is ${n}.`,
    };
  }
  if (variant === 1) {
    /* which number goes with its name; the wrong ones swap the tens and ones, or write the hundreds out in full (400 + 13 as 40013) */
    const n = Math.random() < 0.6 ? num3(true) : R(1, 9) * 100 + R(11, 19),
      [hundreds, tens, ones] = digits(n),
      rest = n % 100;
    const swapped = hundreds * 100 + ones * 10 + tens,
      writtenOut = Number(`${hundreds}00${rest}`);
    return {
      ...mcOf([
        [String(n), null],
        [
          String(swapped === n ? n + 100 * (hundreds < 9 ? 1 : -1) : swapped),
          swapped === n
            ? "Look at the hundreds."
            : rest > 10 && rest < 20
              ? `${numWords(swapped)} is not the same as ${numWords(n)}. Look at the tens.`
              : `That’s ${numWords(swapped)}. Check which digit is tens and which is ones.`,
        ],
        [
          writtenOut.toLocaleString("en-US"),
          `${numWords(hundreds * 100)} is ${hundreds * 100}. The number only needs three digits: ${hundreds} hundreds, ${tens} tens, ${ones} ones.`,
        ],
      ]),
      prompt: `Which number is <b>${numWords(n)}</b>?`,
      fig: () => bigBlocks(hundreds, tens, ones, { cls: { t: "b", o: "c" } }, "Base-ten blocks"),
      hint: `Say it in parts: ${numWords(hundreds * 100)}, then ${numWords(rest)}.`,
      explain: `${numWords(n)} is ${htoSay(hundreds, tens, ones)}: ${n}.`,
    };
  }
  if (variant === 2) {
    /* which blocks show the number: the wrong ones swap places or are off by a ten or a hundred (two different ones) */
    let n = num3(false);
    const [hundreds, tens, ones] = digits(n);
    const others = [
      [hundreds * 100 + ones * 10 + tens, "Look at the sticks. They show the tens."],
      [ones * 100 + tens * 10 + hundreds, "Look at the big squares. They show the hundreds."],
      [tens < 9 ? n + 10 : n - 10, "Count the sticks. Each one is a ten."],
      [hundreds < 9 ? n + 100 : n - 100, "Count the big squares. Each one is a hundred."],
    ];
    const wrongs = others.filter(([v], i) => v !== n && others.findIndex(([w]) => w === v) === i).slice(0, 2);
    /* the blocks for v, labelled Picture A, B, or C */
    const blocksOf = (v, letter) => {
      const [a, b, c] = digits(v);
      return htoFig(a, b, c, { cls: { t: "b", o: "c" } }, `Picture ${letter}`);
    };
    const problem = mcOf([[n, null], ...wrongs]);
    problem.choices.forEach((choice, i) => {
      choice.label = blocksOf(+choice.label, "ABC"[i]);
    });
    return {
      ...problem,
      prompt: `Which blocks show <b>${n}</b>?`,
      hint: `${n} is ${htoSay(hundreds, tens, ones)}.`,
      explain: `${n} is ${htoSay(hundreds, tens, ones)}.`,
    };
  }
  /* what a digit means, by its place */
  const n = num3(false),
    at = R(0, 2),
    digit = digits(n)[at];
  return {
    ...mcOf(
      place.map((word, j) => [
        `${say(digit, word)} (${digit * [100, 10, 1][j]})`,
        j === at ? null : `The ${digit} is in the ${place[at]} place, not the ${word} place.`,
      ]),
    ),
    prompt: `In <b>${n}</b>, what does the <b>${digit}</b> mean?`,
    stack: true,
    fig: () => pvChart([["", n]], at),
    hint: "The first digit is hundreds, then tens, then ones.",
    explain: `In ${n}, the ${digit} is in the ${place[at]} place, so it means ${say(digit, place[at])}: ${digit * [100, 10, 1][at]}.`,
  };
}

/* ---------- Spell Scrolls: expanded form (Lessons 5–6) ---------- */
function genExpand() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* what number the expanded form makes */
    const n = num3(),
      [hundreds, tens, ones] = digits(n),
      parts = [hundreds * 100, tens * 10, ones].filter((v) => v);
    return {
      kind: "num",
      unit: "",
      answer: n,
      prompt: `What number is <b>${parts.join(" + ")}</b>?`,
      fig: () => bigBlocks(hundreds, tens, ones, { cls: { t: "b", o: "c" } }, htoSay(hundreds, tens, ones)),
      misc: miscOf(n, [
        [Number(parts.join("")), "Each part goes in its own place. The number has only three digits."],
        [hundreds + tens + ones, `The ${hundreds} is ${hundreds * 100}. Don’t just add the digits.`],
        ...(tens !== ones ? [[hundreds * 100 + ones * 10 + tens, "Tens come before ones."]] : []),
        ...(!tens || !ones
          ? [[Number(`${hundreds}${tens || ""}${ones || ""}`), "A place with nothing in it still needs a 0."]]
          : []),
      ]),
      hint: `${hundreds * 100} is ${say(hundreds, "hundreds")}, ${tens * 10} is ${say(tens, "tens")}, and ${ones} is ${say(ones, "ones")}.`,
      explain: `${parts.join(" + ")} is ${htoSay(hundreds, tens, ones)}: ${n}.`,
    };
  }
  if (variant === 1) {
    /* the missing part of the expanded form: the hundreds (at 0) or the tens (at 1) */
    const n = num3(false),
      [hundreds, tens, ones] = digits(n),
      at = R(0, 1),
      part = [hundreds * 100, tens * 10][at];
    const eq = at
      ? `${n} = ${hundreds * 100} + <span class="q">?</span> + ${ones}`
      : `${n} = <span class="q">?</span> + ${tens * 10} + ${ones}`;
    return {
      kind: "num",
      unit: "",
      answer: part,
      prompt: `What goes in the box? <span class="eqn">${eq}</span>`,
      fig: () => bigBlocks(hundreds, tens, ones, { cls: { t: "b", o: "c" } }, htoSay(hundreds, tens, ones)),
      misc: miscOf(part, [
        [[hundreds, tens][at], `The ${[hundreds, tens][at]} is in the ${place[at]} place, so it’s worth ${part}.`],
        [[tens * 10, hundreds * 100][at], "Check which part is missing."],
      ]),
      hint: `What is the ${[hundreds, tens][at]} in ${n} worth?`,
      explain: `${n} = ${hundreds * 100} + ${tens * 10} + ${ones}. The missing part is ${part}.`,
    };
  }
  /* another way to make the number: break a hundred into 10 tens, or a ten into 10 ones (breakTen) */
  const n = R(2, 9) * 100 + R(1, 8) * 10 + R(1, 8),
    [hundreds, tens, ones] = digits(n),
    breakTen = Math.random() < 0.4;
  const right = breakTen ? [hundreds, tens - 1, ones + 10] : [hundreds - 1, tens + 10, ones],
    wrong = breakTen
      ? [
          [[hundreds, tens, ones + 10], `${ones + 10} ones is ${ones + 10}. That makes ${n + 10}, not ${n}.`],
          [[hundreds - 1, tens, ones + 10], `That’s missing a hundred: ${n - 90}.`],
        ]
      : [
          [
            [hundreds, tens + 10, ones],
            `${tens + 10} tens is ${(tens + 10) * 10}. ${hundreds * 100} + ${(tens + 10) * 10} + ${ones} is ${n + 100}, not ${n}.`,
          ],
          tens === ones
            ? [[hundreds - 1, tens, ones], `That’s missing a hundred: ${n - 100}.`]
            : [[hundreds, ones, tens], `That’s ${hundreds * 100 + ones * 10 + tens}. The tens and ones got switched.`],
        ];
  return {
    ...mcOf([[htoSay(...right), null], ...wrong.map(([placeDigits, why]) => [htoSay(...placeDigits), why])]),
    stack: true,
    prompt: `Which is another way to make <b>${n}</b>?`,
    fig: (show) =>
      bigBlocks(
        ...(show ? right : [hundreds, tens, ones]),
        { cls: { t: "b", o: "c" }, tr: show && !breakTen ? 10 : 0 },
        show ? htoSay(...right) : htoSay(hundreds, tens, ones),
      ),
    hint: breakTen
      ? "Break a ten into 10 ones. The number stays the same."
      : "Break a hundred into 10 tens. The number stays the same.",
    explain: breakTen
      ? `Break a ten: ${htoSay(...right)}. ${hundreds * 100} + ${(tens - 1) * 10} + ${ones + 10} = ${n}.`
      : `Break a hundred: ${htoSay(...right)}. ${(hundreds - 1) * 100} + ${(tens + 10) * 10} + ${ones} = ${n}.`,
  };
}

/* ---------- Number Bridge: the number line to 1,000 (Lessons 8–9) ---------- */
/* a number line from lo with a tick every `by`, 10 ticks long, numbered at lo, the middle, and the end; options go to numLine */
const bridge = (lo, by, options = {}) =>
  numLine(lo, lo + 10 * by, { u: 52 / by, step: by, big: 5 * by, ls: "", end: true, ...options });
function genLine() {
  /* a line counting by hundreds from 0 (byHundreds) or by tens from a hundred; v is `ticks` ticks past lo */
  const variant = R(0, 2),
    byHundreds = Math.random() < 0.35,
    by = byHundreds ? 100 : 10,
    lo = byHundreds ? 0 : R(1, 9) * 100,
    ticks = pick([1, 2, 3, 4, 6, 7, 8, 9]),
    v = lo + ticks * by,
    mid = lo + 5 * by;
  /* counting to v: by the ticks from lo, and on from the middle when v is past it */
  const count =
    `Count by ${by}s from ${lo}: ${range(Math.min(ticks, 5))
      .map((i) => lo + (i + 1) * by)
      .join(", ")}${ticks > 5 ? ", …" : "."}` + (ticks > 5 ? ` Or count on from ${mid}.` : "");
  if (variant === 0) {
    /* tap where v goes */
    const why = Object.fromEntries(
      range(11)
        .map((i) => lo + i * by)
        .filter((w) => w !== v)
        .map((w) => [String(w), `That tick is ${w}. ${w < v ? "Go farther right." : "Go back to the left."}`]),
    );
    return {
      kind: "tap",
      answer: String(v),
      why,
      prompt: `Tap where <b>${v}</b> goes on the number line.`,
      fig: (show, done) =>
        bridge(lo, by, {
          tap: "cand",
          pts: done ? [{ v, cls: "b", t: v }] : [],
          label: `A number line from ${lo} to ${lo + 10 * by} with a tick every ${by}`,
        }),
      hint: `The ticks count by ${by}s. ` + count,
      explain: `${v} is ${ticks} ticks past ${lo}. ` + count,
    };
  }
  if (variant === 1) {
    /* what number the dot is at */
    return {
      kind: "num",
      unit: "",
      answer: v,
      prompt: `The ticks count by ${by}s. What number is the dot at?`,
      fig: () =>
        bridge(lo, by, {
          pts: [{ v, cls: "b", t: "?" }],
          label: `A number line from ${lo} to ${lo + 10 * by} with a tick every ${by}, and a dot`,
        }),
      misc: miscOf(v, [
        [lo + ticks * (byHundreds ? 10 : 1), `Each space is ${by} here, not ${byHundreds ? 10 : 1}.`],
        [lo + (ticks + 1) * by, "Count the spaces, not the tick marks."],
        [lo + (ticks - 1) * by, "Count every space up to the dot."],
      ]),
      hint: count,
      explain: `The dot is ${ticks} spaces past ${lo}. ` + count,
    };
  }
  /* between which hundreds? (nearer: the closer one; tenBelow: the ten below n, for a wrong choice) */
  const n = num3(),
    hundredBelow = Math.floor(n / 100) * 100,
    hundredAbove = hundredBelow + 100,
    nearer = n - hundredBelow <= 50 ? hundredBelow : hundredAbove,
    tenBelow = Math.floor(n / 10) * 10;
  return {
    ...mcOf([
      [`${hundredBelow} and ${hundredAbove}`, null],
      [
        `${hundredBelow - 100} and ${hundredBelow}`,
        `${n} has ${say(hundredBelow / 100, "hundreds")}, so it comes after ${hundredBelow}.`,
      ],
      [`${tenBelow} and ${tenBelow + 10}`, `Those are tens. Find the hundreds ${n} is between.`],
    ]),
    prompt: `Between which two hundreds is <b>${n}</b>?`,
    fig: (show) =>
      numLine(Math.max(0, hundredBelow - 100), Math.min(1000, hundredAbove + 100), {
        u: 0.9,
        step: 100,
        big: 100,
        ls: "",
        end: true,
        pts: show ? [{ v: n, cls: "b", t: n }] : [],
        label: "A number line counting by hundreds",
      }),
    hint: `${n} has ${say(hundredBelow / 100, "hundreds")}. What comes after ${hundredBelow}?`,
    explain: `${n} is more than ${hundredBelow} and less than ${hundredAbove}, so it’s between ${hundredBelow} and ${hundredAbove}. It’s closer to ${nearer}.`,
  };
}

/* ---------- Knight’s Challenge: compare and order (Lessons 10–12) ---------- */
/* two different three-digit numbers that are easy to mix up: the tens and ones swapped, a different ones or tens digit,
   or a hundreds digit one away (in either order) */
function pair() {
  const n = num3(false),
    [hundreds, tens, ones] = digits(n),
    how = R(0, 3);
  let other =
    how === 0
      ? hundreds * 100 + ones * 10 + tens
      : how === 1
        ? hundreds * 100 + tens * 10 + ((ones + R(1, 8)) % 10)
        : how === 2
          ? hundreds * 100 + ((tens + R(1, 8)) % 10) * 10 + ones
          : ((hundreds + R(0, 1) * 2 - 1 + 9) % 9 || 9) * 100 + R(0, 9) * 10 + R(0, 9);
  if (other === n) other = n < 990 ? n + 10 : n - 10;
  return Math.random() < 0.5 ? [n, other] : [other, n];
}
/* the first place (0 hundreds, 1 tens, 2 ones) where a and b have different digits */
const firstDiff = (a, b) => {
  const digitsA = digits(a),
    digitsB = digits(b);
  return digitsA.findIndex((d, i) => d !== digitsB[i]);
};
function genCompare() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* which comparison is true; sometimes (equal) the left side is the number's expanded form, so they're the same */
    const equal = Math.random() < 0.15,
      [a, b] = pair(),
      [x, y] = equal ? [a, a] : [a, b],
      [hundreds, tens, ones] = digits(x),
      at = firstDiff(x, y);
    const left = equal ? `${hundreds * 100} + ${tens * 10} + ${ones}` : String(x),
      rel = x > y ? ">" : x < y ? "<" : "=";
    const words = { ">": "is greater than", "<": "is less than", "=": "is equal to" };
    return {
      ...mcOf(
        [">", "<", "="].map((sign) => [
          `${left} ${sign} ${y}`,
          sign === rel
            ? null
            : sign === "="
              ? "The numbers are different. Look at each place."
              : equal
                ? `${left} is ${x}, the same number.`
                : `Look at the ${place[at]}: ${digits(x)[at]} ${place[at]} is ${x > y ? "more" : "less"} than ${digits(y)[at]} ${place[at]}. The open side faces the bigger number.`,
        ]),
      ),
      prompt: "Which is true?",
      fig: () =>
        pvChart([
          ["", x],
          ["", y],
        ]),
      hint: equal
        ? `Add the parts: ${left} = ?`
        : "Start with the hundreds. If they’re the same, look at the tens, then the ones.",
      explain: equal
        ? `${left} = ${x}, so the two are equal.`
        : `${x} ${words[rel]} ${y}: ` +
          (at ? `same ${at === 1 ? "hundreds" : "hundreds and tens"}, and ` : "") +
          `${digits(x)[at]} ${place[at]} ${x > y ? ">" : "<"} ${digits(y)[at]} ${place[at]}.`,
    };
  }
  /* three numbers, two of them easy to mix up, and the same numbers in order */
  const [a, b] = pair();
  let c = num3();
  while (c === a || c === b) c = num3();
  const numbers = [a, b, c],
    sorted = [...numbers].sort((p, q) => p - q);
  if (variant === 1) {
    /* which is greatest, or least */
    const greatest = Math.random() < 0.5,
      answer = greatest ? sorted[2] : sorted[0],
      word = greatest ? "greatest" : "least";
    return {
      ...mcOf(
        numbers.map((v) => [
          String(v),
          v === answer
            ? null
            : `Compare ${v} and ${answer} place by place, starting with hundreds. ${answer} is ${greatest ? "greater" : "less"}.`,
        ]),
      ),
      prompt: `Which number is <b>${word}</b>?`,
      fig: () => pvChart(numbers.map((v) => ["", v])),
      hint: "Look at the hundreds first. The most hundreds is greatest, and the fewest is least.",
      explain: `In order: ${sorted.join(" < ")}. The ${word} is ${answer}.`,
    };
  }
  /* which list goes from least to greatest: the wrong ones swap the first two, or go backward */
  const swapped = [sorted[1], sorted[0], sorted[2]],
    backward = [...sorted].reverse();
  return {
    ...mcOf([
      [sorted.join(", "), null],
      [swapped.join(", "), `Compare ${sorted[0]} and ${sorted[1]}: ${sorted[0]} is less, so it comes first.`],
      [backward.join(", "), "That goes from greatest to least. Start with the smallest."],
    ]),
    prompt: "Which list goes from <b>least to greatest</b>?",
    stack: true,
    fig: () => pvChart(numbers.map((v) => ["", v])),
    hint: "Find the least number first. Then the next. Compare hundreds, then tens, then ones.",
    explain: `${sorted[0]} < ${sorted[1]} < ${sorted[2]}, so the list is ${sorted.join(", ")}.`,
  };
}

/* ---------- The Dragon’s Lair: everything ---------- */
const genBoss = () => pick([genHundred, genBuild, genExpand, genLine, genCompare])();

const ZONES = [
  {
    id: "hundred",
    name: "Tower of Tens",
    lessons: "Lessons 1–2",
    blurb: "Stack 10 tens to make a hundred, and count how many hundreds you can make.",
    gen: genHundred,
  },
  {
    id: "build",
    name: "Block Forge",
    lessons: "Lessons 3–4",
    blurb: "Read numbers from hundreds, tens, and ones, and match number names to numbers.",
    gen: genBuild,
  },
  {
    id: "expand",
    name: "Spell Scrolls",
    lessons: "Lessons 5–6",
    blurb: "Put 300 + 40 + 2 together, and find another way to make the same number.",
    gen: genExpand,
  },
  {
    id: "line",
    name: "Number Bridge",
    lessons: "Lessons 8–9",
    blurb: "Find numbers on number lines that count by tens and hundreds.",
    gen: genLine,
  },
  {
    id: "compare",
    name: "Knight’s Challenge",
    lessons: "Lessons 10–12",
    blurb: "Compare with >, <, and =, and put numbers in order.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "The Dragon’s Lair",
    lessons: "All lessons",
    blurb: "Face the dragon! Every right answer knocks off one of its 10 hearts.",
    gen: genBoss,
  },
];

/* the dragon, facing right: tail, wing, back spikes, neck, body, legs with claws, horned head, and a puff of fire (also the boss icon) */
const DRAGON =
  '<path d="M22,44C10,44 3,49 4,55C5,60 11,61 15,58L19,62L20,54L14,55C10,55 9,51 13,49C16,47 20,48 22,49Z" fill="#3fbf88" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M26,37L9,5Q17,8 19,15Q23,6 28,4Q30,12 34,15Q37,10 42,10L37,35Z" fill="#2f9e70" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M31,35L10,6M32,34L28,5M34,34L41,11" stroke="#0a2340" stroke-width="1.2" stroke-linecap="round"/><path d="M17,37L19,31L22,35L25,29L28,34L31,28L33,34" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M36,38Q40,31 41,23L49,24Q47,34 42,44Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="28" cy="43" rx="15" ry="9.5" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5"/><path d="M17,47Q28,55 40,47Q29,51 17,47Z" fill="#c9f5de"/><path d="M19,49L17,59H24L25,51M33,50L33,59H40L39,48" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M17,59l1.5,2.5l1.5,-2.5l1.5,2.5l1.5,-2.5M33,59l1.5,2.5l1.5,-2.5l1.5,2.5l1.5,-2.5" fill="none" stroke="#f3f6fb" stroke-width="1.2"/><path d="M39,23L37,19L41,21M40,29L37,27L41,27" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/><path d="M43,13Q41,5 36,3Q41,8 41,14Z" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M47,12Q47,5 43,1Q46,6 45,12Z" fill="#ffc93c" stroke="#0a2340" stroke-width="1.2" stroke-linejoin="round"/><path d="M40,18Q42,11 50,11L58,15Q61,17 60,20L56,22L51,26Q43,27 40,21Z" fill="#5fe0a8" stroke="#0a2340" stroke-width="1.5" stroke-linejoin="round"/><path d="M51,21L59,19.5" stroke="#0a2340" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="47.5" cy="16" rx="2.6" ry="2.2" fill="#ffc93c" stroke="#0a2340" stroke-width="1"/><ellipse cx="47.8" cy="16" rx=".8" ry="1.8" fill="#0a2340"/><circle cx="57" cy="16" r=".9" fill="#0a2340"/><path d="M59,21Q67,20 64,28Q63,25 60,26Q64,29 61,33Q58,28 57,23Z" fill="#ff9a86" stroke="#ff6b4a" stroke-width=".8" stroke-linejoin="round"/><path d="M59,22Q63,23 62,26Q60.5,24.5 58.5,24Z" fill="#ffc93c"/>';
const ICON = {
  hundred:
    '<g stroke="#0a2340" stroke-width="1.5">' +
    range(5)
      .map((i) => `<rect x="${14 + i * 8}" y="8" width="7" height="48" fill="#7fe3ff"/>`)
      .join("") +
    '</g><path d="M10,4H56" stroke="#ffc93c" stroke-width="3"/>',
  build:
    '<rect x="6" y="14" width="30" height="30" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M12,14v30M18,14v30M24,14v30M30,14v30M6,20h30M6,26h30M6,32h30M6,38h30" stroke="rgba(10,35,64,.4)"/><rect x="40" y="14" width="6" height="30" fill="#7fe3ff" stroke="#0a2340"/><rect x="50" y="38" width="6" height="6" fill="#5fe0a8" stroke="#0a2340"/>',
  expand:
    '<rect x="10" y="10" width="44" height="44" rx="6" fill="#f2d0a0" stroke="#d9a066" stroke-width="2"/><g font-family="monospace" font-weight="700" font-size="11" fill="#0a2340" text-anchor="middle"><text x="32" y="26">300+40</text><text x="32" y="42">+2</text></g>',
  line: '<path d="M4,38H60" stroke="#f3f6fb" stroke-width="3"/><path d="M8,30v16M22,32v12M36,32v12M50,32v12" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,40Q32,62 58,40" fill="none" stroke="#d9a066" stroke-width="3"/><circle cx="36" cy="38" r="5" fill="#7fe3ff"/>',
  compare:
    '<path d="M14,50L50,14M50,50L14,14" stroke="#cfd8e3" stroke-width="5" stroke-linecap="round"/><path d="M10,54l8-8M54,54l-8-8" stroke="#d9a066" stroke-width="6" stroke-linecap="round"/><text x="32" y="38" fill="#ffc93c" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">&gt;</text>',
  boss: DRAGON,
};
