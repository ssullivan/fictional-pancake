/* Frog Hop (Grade 2 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Number lines come from shared/numlines.js (numLine) and this unit's figs.js (line, sgn, hopsFrom, around), and mcOf and
   miscOf from shared/util.js. Each generator deals one of a few kinds of problem (variant), each with a comment saying what
   it asks. Every problem carries `facts`, the numbers it was made from, so checks.js can work the answer out again. Numbers
   stay within 100, and each problem needs at most one new or broken ten. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* named mistakes, leaving out any that land on the answer for these numbers (the mistake doesn't show up then) */
const named = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value !== answer && value > 0),
  );
/* an equation with a gold box for the missing number, like 38 + ? = 60 */
const eqn = (text) => `<span class="eqn">${text.replace("?", '<span class="q">?</span>')}</span>`;
const tensOf = (n) => Math.floor(n / 10);
/* a number line with only the tens numbered, from the ten below lo to the ten above hi; options go to line() */
const tensLine = (lo, hi, options = {}) => {
  const [from, to] = around(lo, hi);
  return line(from, to, { lab: (v) => v % 10 === 0, ...options });
};
/* a two-digit number that doesn't end in 0 */
const twoDigit = (lo = 11, hi = 89) => {
  let n = R(lo, hi);
  if (n % 10 === 0) n++;
  return n;
};

/* ---------- Lily Pads: numbers on the number line (Lessons 1–3) ---------- */
/* A number line drawn the right way or not: numbers at xs (pixels across), with ticks. Used for picture choices. */
const madeLine = (numbers, xs, label) =>
  svgWrap(
    xs[xs.length - 1] + 40,
    62,
    `<line class="axis" x1="10" y1="22" x2="${xs[xs.length - 1] + 20}" y2="22"/>` +
      numbers
        .map(
          (n, i) =>
            `<line class="tick" x1="${xs[i]}" y1="14" x2="${xs[i]}" y2="30"/><text class="lbl" x="${xs[i]}" y="46">${n}</text>`,
        )
        .join(""),
    label,
  );
function genLine() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* what number is the dot at? Only the tens are numbered */
    const lo = R(0, 8) * 10,
      v = lo + pick([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]),
      tenBefore = tensOf(v) * 10,
      past = v - tenBefore;
    return {
      kind: "num",
      unit: "",
      answer: v,
      facts: { t: "dot", v },
      prompt: "What number is the dot at?",
      fig: (show) =>
        line(lo, lo + 20, {
          u: 26,
          lab: (tick) => tick % 10 === 0,
          pts: [{ v, cls: "b", t: show ? v : "?" }],
          label: `A number line from ${lo} to ${lo + 20} with a dot. Only the tens have numbers.`,
        }),
      misc: named(v, [
        [tenBefore + 10 - past, `That counts back from ${tenBefore + 10}. The dot is ${past} past ${tenBefore}.`],
        [v + 1, "Count the spaces from the ten, not the tick marks."],
        [past, `The dot is ${past} past ${tenBefore}, so it’s ${tenBefore} and ${past} more.`],
      ]),
      hint:
        past <= 5
          ? `Start at ${tenBefore} and count on by ones to the dot.`
          : `Start at ${tenBefore + 10} and count back by ones to the dot.`,
      explain:
        past <= 5
          ? `Count on from ${tenBefore}: ${range(past)
              .map((i) => tenBefore + i + 1)
              .join(", ")}. The dot is at ${v}.`
          : `Count back from ${tenBefore + 10}: ${range(10 - past)
              .map((i) => tenBefore + 9 - i)
              .join(", ")}. The dot is at ${v}.`,
    };
  }
  if (variant === 1) {
    /* tap where a number goes; only the tens are numbered */
    const lo = R(0, 8) * 10,
      v = lo + pick([2, 3, 4, 6, 7, 8, 12, 13, 14, 16, 17, 18]);
    const why = Object.fromEntries(
      range(21)
        .map((i) => lo + i)
        .filter((w) => w !== v)
        .map((w) => [String(w), `That tick is ${w}. ${w < v ? "Go farther right." : "Go back to the left."}`]),
    );
    return {
      kind: "tap",
      answer: String(v),
      why,
      facts: { t: "tapAt", v, lo },
      prompt: `Tap where <b>${v}</b> goes on the number line.`,
      fig: (show, done) =>
        line(lo, lo + 20, {
          u: 26,
          lab: (tick) => tick % 10 === 0,
          tap: "cand",
          pts: done ? [{ v, cls: "b", t: v }] : [],
          label: `A number line from ${lo} to ${lo + 20}. Only the tens have numbers.`,
        }),
      hint: `${v} is ${v % 10} past ${tensOf(v) * 10}. Find ${tensOf(v) * 10}, then count on.`,
      explain: `Find ${tensOf(v) * 10} and count on ${v % 10} ticks: ${v}.`,
    };
  }
  /* which number line is made the right way? Wrong ones have uneven spaces, or a number missing */
  const lo = R(0, 9) * 10,
    numbers = range(6).map((i) => lo + i),
    even = range(6).map((i) => 20 + i * 52),
    uneven = [20, 60, 132, 160, 236, 280],
    skipAt = R(1, 4),
    skipped = numbers.map((n, i) => (i >= skipAt ? n + 1 : n));
  const problem = mcOf([
    ["right", null],
    ["uneven", "The spaces aren’t the same size. Every space on a number line is the same length."],
    ["skip", `${lo + skipAt} is missing. The numbers go up by 1 each space.`],
  ]);
  problem.choices.forEach((choice, i) => {
    const letter = `Picture ${"ABC"[i]}`;
    choice.label =
      choice.label === "right"
        ? madeLine(numbers, even, letter)
        : choice.label === "uneven"
          ? madeLine(numbers, uneven, letter)
          : madeLine(skipped, even, letter);
  });
  return {
    ...problem,
    stack: true,
    facts: { t: "made", lo },
    prompt: "Which number line is made the right way?",
    hint: "Check the spaces: are they all the same? Check the numbers: do they go up by 1 each time?",
    explain: "On a number line, every space is the same length, and the numbers go up by 1 from each tick to the next.",
  };
}

/* ---------- Twin Rocks: compare and estimate (Lessons 4–5) ---------- */
function genCompare() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* which is true: a > b, a < b, or a = b? The two numbers are dots on a line */
    /* b is often a with its digits switched (38 and 83), which is easy to mix up */
    const a = twoDigit(),
      switched = (a % 10) * 10 + tensOf(a);
    let b = Math.random() < 0.4 ? switched : twoDigit();
    while (b === a) b = twoDigit();
    const sign = a > b ? ">" : "<",
      words = { ">": "is greater than", "<": "is less than", "=": "is equal to" };
    return {
      ...mcOf(
        [">", "<", "="].map((s) => [
          `${a} ${s} ${b}`,
          s === sign
            ? null
            : s === "="
              ? `${a} and ${b} are different dots.`
              : `${Math.max(a, b)} is farther right, so it’s greater. The open side faces the bigger number.`,
        ]),
      ),
      facts: { t: "compare", a, b },
      prompt: "Which is true?",
      fig: () =>
        tensLine(a, b, {
          pts: [
            { v: a, t: a },
            { v: b, cls: "b", t: b },
          ],
          label: `A number line with dots at ${a} and ${b}`,
        }),
      hint: "The number farther right on the line is greater.",
      explain: `${Math.max(a, b)} is farther right. ${a} ${words[sign]} ${b}: ${a} ${sign} ${b}.`,
    };
  }
  if (variant === 1) {
    /* estimate: about what number is the dot at, on a line with only 0, 50, and 100? */
    const near = pick([10, 20, 30, 40, 60, 70, 80, 90]),
      v = near + R(-2, 2),
      wrongs = shuffle([10, 20, 30, 40, 50, 60, 70, 80, 90].filter((g) => Math.abs(g - near) >= 30)).slice(0, 2);
    return {
      ...mcOf(
        [near, ...wrongs].map((g) => [
          `about ${g}`,
          g === near
            ? null
            : g > near
              ? `${g} would be farther right. Use 0, 50, and 100 to help.`
              : `${g} would be farther left. Use 0, 50, and 100 to help.`,
        ]),
      ),
      facts: { t: "estimate", v },
      prompt: "About what number is the dot at?",
      fig: (show) =>
        line(0, 100, {
          u: 5,
          step: show ? 10 : 50,
          big: show ? 10 : 50,
          lab: (tick) => tick % (show ? 10 : 50) === 0,
          pts: [{ v, cls: "b", t: show ? v : null }],
          label: show
            ? `A number line from 0 to 100 marked every 10, with a dot at ${v}`
            : "A number line with 0, 50, and 100, and a dot to estimate",
        }),
      hint: `Is the dot closer to 0, 50, or 100? Half of 50 is 25.`,
      explain: `The dot is at ${v}, so about ${near} is the best estimate.`,
    };
  }
  /* which lettered dot is at a number? */
  const lo = R(0, 8) * 10,
    spots = shuffle([2, 4, 6, 8, 12, 14, 16, 18].map((k) => lo + k)).slice(0, 3),
    target = spots[0],
    letters = ["A", "B", "C"],
    order = [...spots].sort((x, y) => x - y);
  return {
    ...mcOf(
      spots.map((v) => [
        `Dot ${letters[order.indexOf(v)]}`,
        v === target
          ? null
          : `Dot ${letters[order.indexOf(v)]} is at ${v}. ${v < target ? "Look farther right." : "Look farther left."}`,
      ]),
    ),
    facts: { t: "whichDot", target, order },
    prompt: `Which dot is at <b>${target}</b>?`,
    fig: () =>
      line(lo, lo + 20, {
        u: 26,
        lab: (tick) => tick % 10 === 0,
        pts: order.map((v, i) => ({ v, cls: i === 1 ? "b" : "", t: letters[i] })),
        label: `A number line from ${lo} to ${lo + 20} with dots A, B, and C`,
      }),
    hint: `${target} is ${target % 10} ${target % 10 === 1 ? "tick" : "ticks"} past ${tensOf(target) * 10}.`,
    explain: `Count ${target % 10} past ${tensOf(target) * 10}: Dot ${letters[order.indexOf(target)]} is at ${target}.`,
  };
}

/* ---------- Hop Along: jumps to add and subtract (Lessons 7–9) ---------- */
function genJumps() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* start somewhere and hop right (add) or left (subtract) a few; where do you land? */
    const right = Math.random() < 0.5,
      start = twoDigit(15, 85),
      hop = R(3, 9),
      land = right ? start + hop : start - hop;
    return {
      kind: "num",
      unit: "",
      answer: land,
      facts: { t: "hop", start, move: right ? hop : -hop },
      prompt: `The frog starts at ${start}. It hops ${hop} to the ${right ? "right" : "left"}. Where does it land?`,
      fig: (show) =>
        tensLine(start, land, {
          hops: show ? hopsFrom(start, [right ? hop : -hop]) : [],
          pts: [{ v: start, t: start }, ...(show ? [{ v: land, cls: "b", t: "?" }] : [])],
          label: `A number line with the frog at ${start}`,
        }),
      misc: named(land, [
        [
          right ? start - hop : start + hop,
          `${right ? "Right means add" : "Left means subtract"}. You went the other way.`,
        ],
        [right ? land - 1 : land + 1, "Count the hops after the start, not the start itself."],
      ]),
      hint: right ? `Hopping right adds. ${start} + ${hop} = ?` : `Hopping left subtracts. ${start} − ${hop} = ?`,
      explain: right ? `Right adds: ${start} + ${hop} = ${land}.` : `Left subtracts: ${start} − ${hop} = ${land}.`,
    };
  }
  if (variant === 1) {
    /* which equation matches the jump? (the wrong ones jump twice as far from the start, so it starts 20 from each end) */
    const right = Math.random() < 0.5,
      start = twoDigit(20, 79),
      hop = R(3, 9),
      land = right ? start + hop : start - hop,
      op = right ? "+" : "−",
      other = right ? "−" : "+";
    return {
      ...mcOf([
        [`${start} ${op} ${hop} = ${land}`, null],
        [
          `${start} ${other} ${hop} = ${right ? start - hop : start + hop}`,
          `The jump goes ${right ? "right, so it’s adding" : "left, so it’s subtracting"}.`,
        ],
        [`${land} ${op} ${hop} = ${right ? land + hop : land - hop}`, `The jump starts at ${start}, not ${land}.`],
      ]),
      stack: true,
      facts: { t: "jumpEq", start, move: right ? hop : -hop },
      prompt: "Which equation matches the jump?",
      fig: () =>
        tensLine(start, land, {
          lab: (v) => v % 10 === 0 || v === start || v === land,
          hops: [{ a: start, b: land, t: hop }],
          pts: [{ v: start }, { v: land, cls: "b" }],
          label: `A jump of ${hop} from ${start} to ${land}`,
        }),
      hint: "Where does the jump start? Which way does it go? Where does it land?",
      explain: `The jump starts at ${start}, goes ${hop} to the ${right ? "right" : "left"}, and lands on ${land}: ${start} ${op} ${hop} = ${land}.`,
    };
  }
  /* the difference between two numbers across a ten: jump to the ten, then on */
  const ten = R(2, 9) * 10,
    small = ten - R(1, 7),
    big = ten + R(1, 7),
    diff = big - small,
    toTen = ten - small,
    rest = big - ten;
  return {
    kind: "num",
    unit: "",
    answer: diff,
    facts: { t: "difference", small, big },
    prompt: `What is the difference between ${small} and ${big}?`,
    fig: (show) =>
      tensLine(small, big, {
        hops: show ? hopsFrom(small, [toTen, rest]) : [],
        pts: [
          { v: small, t: small },
          { v: big, cls: "b", t: big },
        ],
        label: `A number line with dots at ${small} and ${big}`,
      }),
    misc: named(diff, [
      [small + big, "You added. The difference is the space between them."],
      [toTen, `${small} to ${ten} is ${toTen}. Keep going to ${big}.`],
      [rest, `${ten} to ${big} is ${rest}. Don’t forget ${small} to ${ten}.`],
      [
        Math.abs((big % 10) - (small % 10)) + 10 * (tensOf(big) - tensOf(small)),
        `Jump ${small} to ${ten} (${toTen}), then ${ten} to ${big} (${rest}).`,
      ],
    ]),
    hint: `Jump from ${small} to ${ten}, then from ${ten} to ${big}. Add the jumps.`,
    explain: `${small} to ${ten} is ${toTen}. ${ten} to ${big} is ${rest}. ${toTen} + ${rest} = ${diff}.`,
  };
}

/* ---------- Ten Leap: jump by tens and ones (Lessons 10–11) ---------- */
function genTens() {
  const variant = R(0, 2);
  if (variant === 0 || variant === 1) {
    /* tens, then ones: a + b (variant 0) or a − b (variant 1), with no new or broken ten */
    const adding = variant === 0;
    let a, b;
    do {
      a = twoDigit(12, 88);
      b = R(1, 4) * 10 + R(1, 9);
    } while (adding ? a + b > 99 || (a % 10) + (b % 10) > 9 : a - b < 10 || a % 10 < b % 10);
    const steps = [...Array(tensOf(b)).fill(adding ? 10 : -10), adding ? b % 10 : -(b % 10)],
      answer = adding ? a + b : a - b,
      op = adding ? "+" : "−";
    return {
      kind: "num",
      unit: "",
      answer,
      facts: { t: "tensOnes", a, b, op },
      prompt: `Jump by tens, then ones. What is <b>${a} ${op} ${b}</b>?`,
      fig: (show) =>
        tensLine(a, answer, {
          hops: show ? hopsFrom(a, steps) : [],
          pts: [{ v: a, t: a }, ...(show ? [{ v: answer, cls: "b", t: "?" }] : [])],
          label: `A number line with a dot at ${a}`,
        }),
      misc: named(answer, [
        [
          adding ? a + tensOf(b) + (b % 10) : a - tensOf(b) - (b % 10),
          `The ${tensOf(b)} in ${b} is ${tensOf(b)} tens: jump ${tensOf(b)} tens.`,
        ],
        [adding ? a + tensOf(b) * 10 : a - tensOf(b) * 10, `That’s just the tens. Jump the ${b % 10} ones too.`],
        [adding ? a - b : a + b, adding ? "Adding jumps right." : "Subtracting jumps left."],
      ]),
      hint: `${b} is ${tensOf(b)} ten${tensOf(b) > 1 ? "s" : ""} and ${b % 10} ones. Jump ${steps
        .slice(0, -1)
        .map(sgn)
        .join(", ")}, then ${sgn(steps[steps.length - 1])}.`,
      explain: `${a} ${steps.map((step) => `${step > 0 ? "+" : "−"} ${Math.abs(step)}`).join(" ")} = ${answer}. So ${a} ${op} ${b} = ${answer}.`,
    };
  }
  /* jump to a ten: a + n or a − n with one-digit n that crosses a ten; split n at the ten */
  const adding = Math.random() < 0.5;
  let a, n;
  do {
    a = twoDigit(12, 88);
    n = R(3, 9);
  } while (adding ? (a % 10) + n <= 10 : a % 10 >= n);
  const toTen = adding ? 10 - (a % 10) : a % 10,
    rest = n - toTen,
    ten = adding ? a + toTen : a - toTen,
    answer = adding ? a + n : a - n,
    op = adding ? "+" : "−";
  return {
    kind: "num",
    unit: "",
    answer,
    facts: { t: "toTen", a, n, op },
    prompt: `Jump to a ten first. What is <b>${a} ${op} ${n}</b>?`,
    fig: (show) =>
      tensLine(a, answer, {
        hops: show ? hopsFrom(a, adding ? [toTen, rest] : [-toTen, -rest]) : [],
        pts: [{ v: a, t: a }, ...(show ? [{ v: answer, cls: "b", t: "?" }] : [])],
        label: `A number line with a dot at ${a}`,
      }),
    misc: named(answer, [
      [
        adding ? answer - 10 : answer + 10,
        adding ? `You crossed ${ten}. The tens go up by 1.` : `You crossed ${ten}. The tens go down by 1.`,
      ],
      [ten, `${ten} is the ten on the way. Jump ${rest} more.`],
    ]),
    hint: `${a} ${op} ${toTen} = ${ten}. ${n} is ${toTen} and ${rest}, so jump ${rest} more.`,
    explain: `${a} ${op} ${toTen} = ${ten}, then ${ten} ${op} ${rest} = ${answer}. So ${a} ${op} ${n} = ${answer}.`,
  };
}

/* ---------- Story Pond: unknowns and stories (Lessons 12–13) ---------- */
/* things a class counts */
const STORY = [
  { thing: "books", place: "The class library", more: "gets", less: "gives away" },
  { thing: "seeds", place: "The garden club", more: "buys", less: "plants" },
  { thing: "stickers", place: "The prize box", more: "gets", less: "gives away" },
  { thing: "markers", place: "The art bin", more: "gets", less: "loses" },
];
function genStories() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* the missing jump: a + ? = b, or a − ? = b */
    const adding = Math.random() < 0.6;
    let a, b;
    do {
      a = twoDigit(12, 85);
      b = adding ? a + R(5, 30) : a - R(5, 30);
    } while (b > 99 || b < 10);
    const jump = Math.abs(b - a),
      ten = adding ? Math.ceil(a / 10) * 10 : Math.floor(a / 10) * 10,
      first = Math.abs(ten - a),
      equation = adding ? `${a} + ? = ${b}` : `${a} − ? = ${b}`;
    return {
      kind: "num",
      unit: "",
      answer: jump,
      facts: { t: "missing", equation },
      prompt: `What is the missing number? ${eqn(equation)}`,
      fig: (show) =>
        tensLine(a, b, {
          hops: show ? [{ a, b, t: jump }] : [{ a, b, t: "?", q: true }],
          pts: [
            { v: a, t: a },
            { v: b, cls: "b", t: b },
          ],
          label: `A number line: from ${a} to ${b} is ?`,
        }),
      misc: named(jump, [
        [a + b, `That’s ${a} + ${b}. The ? is how far it is from ${a} to ${b}.`],
        ...(first && first !== jump ? [[first, `${a} to ${ten} is ${first}. Keep jumping to ${b}.`]] : []),
        [b, `${b} is where the jump lands. How far is the jump?`],
      ]),
      hint:
        first && first !== jump
          ? `Jump from ${a} to ${ten} first. Then on to ${b}.`
          : `Count the spaces from ${a} to ${b}.`,
      explain: `From ${a} to ${b} is ${jump}, so ${adding ? `${a} + ${jump} = ${b}` : `${a} − ${jump} = ${b}`}.`,
    };
  }
  /* a story: some, then more come or some go */
  const story = pick(STORY),
    adding = Math.random() < 0.5;
  let a, n;
  do {
    a = twoDigit(15, 85);
    n = R(4, 19);
  } while (adding ? a + n > 99 : a - n < 5);
  const answer = adding ? a + n : a - n;
  const text = `${story.place} has ${a} ${story.thing}. It ${adding ? story.more : story.less} ${n} ${story.thing}. How many ${story.thing} does it have now?`;
  if (variant === 1) {
    return {
      kind: "num",
      unit: story.thing,
      answer,
      facts: { t: "story", a, n, adding },
      prompt: text,
      fig: (show) =>
        tensLine(a, answer, {
          hops: show ? [{ a, b: answer, t: sgn(adding ? n : -n) }] : [],
          pts: [{ v: a, t: a }],
          label: `A number line with a dot at ${a}`,
        }),
      misc: named(answer, [
        [adding ? a - n : a + n, adding ? "More came, so jump right: add." : "Some went away, so jump left: subtract."],
        [
          adding ? answer - 10 : answer + 10,
          adding ? "Check the tens: you crossed a ten." : "Check the tens: you crossed a ten.",
        ],
      ]),
      hint: adding ? `More came, so jump right ${n}.` : `Some went away, so jump left ${n}.`,
      explain: `${a} ${adding ? "+" : "−"} ${n} = ${answer}. It has ${answer} ${story.thing} now.`,
    };
  }
  /* which number line shows the story? The wrong ones jump the other way, or start at the wrong number */
  const lines = {
    right: [a, adding ? n : -n],
    wrongWay: [a, adding ? -n : n],
    wrongStart: [n, adding ? a : -a],
  };
  if (!adding) lines.wrongStart = [answer, -n];
  const draw = ([start, move], letter) =>
    line(
      Math.floor(Math.min(start, start + move) / 10) * 10,
      Math.ceil((Math.max(start, start + move) + 1) / 10) * 10,
      {
        lab: (v) => v % 10 === 0 || v === start,
        hops: [{ a: start, b: start + move, t: sgn(move) }],
        pts: [{ v: start }],
        label: letter,
      },
    );
  const problem = mcOf([
    ["right", null],
    ["wrongWay", adding ? `It ${story.more} more, so jump right.` : `It ${story.less} some, so jump left.`],
    ["wrongStart", `It starts with ${a} ${story.thing}. Start the jump at ${a}.`],
  ]);
  /* a wrong picture that would leave 0 to 100 is dealt again */
  if (lines.wrongStart[0] + lines.wrongStart[1] > 99 || lines.wrongStart[0] + lines.wrongStart[1] < 1)
    return genStories();
  if (lines.wrongWay[0] + lines.wrongWay[1] > 99 || lines.wrongWay[0] + lines.wrongWay[1] < 1) return genStories();
  problem.choices.forEach((choice, i) => {
    choice.label = draw(lines[choice.label], `Picture ${"ABC"[i]}`);
  });
  return {
    ...problem,
    stack: true,
    facts: { t: "storyLine", a, n, adding },
    prompt: `${text} Which number line shows the story?`,
    hint: `Start at ${a}. ${adding ? "More means jump right." : "Fewer means jump left."}`,
    explain: `Start at ${a} and jump ${n} to the ${adding ? "right" : "left"}: ${a} ${adding ? "+" : "−"} ${n} = ${answer}.`,
  };
}

/* ---------- Across the Pond: everything ---------- */
const genBoss = () => pick([genLine, genCompare, genJumps, genTens, genStories])();

const ZONES = [
  {
    id: "line",
    name: "Lily Pads",
    lessons: "Lessons 1–3",
    blurb: "Find numbers at tick marks with no numbers, and spot a number line made the right way.",
    gen: genLine,
  },
  {
    id: "compare",
    name: "Twin Rocks",
    lessons: "Lessons 4–5",
    blurb: "Compare with >, <, and =, estimate where a dot is, and find the dot at a number.",
    gen: genCompare,
  },
  {
    id: "jumps",
    name: "Hop Along",
    lessons: "Lessons 7–9",
    blurb: "Hop right to add and left to subtract, match hops to equations, and find the difference.",
    gen: genJumps,
  },
  {
    id: "tens",
    name: "Ten Leap",
    lessons: "Lessons 10–11",
    blurb: "Leap by tens, then hop the ones, and hop to a ten to make it easy.",
    gen: genTens,
  },
  {
    id: "stories",
    name: "Story Pond",
    lessons: "Lessons 12–13",
    blurb: "Find the missing jump in an equation, and show stories on a number line.",
    gen: genStories,
  },
  {
    id: "boss",
    name: "Across the Pond",
    lessons: "All lessons",
    blurb: "Help the frog cross! Every right answer is one hop to the next of 10 lily pads.",
    gen: genBoss,
  },
];

/* the 10 lily pads across the pond, in two rows, and the bank the frog starts on */
const PADS = [
  [8, 50],
  [20, 54],
  [32, 50],
  [44, 54],
  [56, 48],
  [52, 34],
  [40, 30],
  [28, 34],
  [16, 30],
  [8, 18],
];
/* a frog at x, y */
const frog = (x, y) =>
  `<g><ellipse cx="${x}" cy="${y}" rx="5.5" ry="4.2" fill="#7fe37a" stroke="#0a2340" stroke-width="1"/><circle cx="${x - 2.5}" cy="${y - 4}" r="2" fill="#7fe37a" stroke="#0a2340" stroke-width=".8"/><circle cx="${x + 2.5}" cy="${y - 4}" r="2" fill="#7fe37a" stroke="#0a2340" stroke-width=".8"/><circle cx="${x - 2.5}" cy="${y - 4.2}" r=".8" fill="#0a2340"/><circle cx="${x + 2.5}" cy="${y - 4.2}" r=".8" fill="#0a2340"/></g>`;
/* the pond with the frog on pad `hopped` (on the bank at 0; also the boss icon, at 3) */
const pond = (hopped) =>
  '<rect x="0" y="10" width="64" height="54" rx="10" fill="rgba(111,168,255,.22)"/>' +
  PADS.map(
    ([x, y], i) =>
      `<path d="M${x},${y}m-6,0a6,4 0 1,0 12,0a6,4 0 1,0 -12,0" fill="${i < hopped ? "#3fbf88" : "#2f7a5a"}" stroke="#0a2340" stroke-width=".8"/>`,
  ).join("") +
  '<path d="M44,4H64V14H44Z" fill="#d9a066"/>' +
  (hopped ? frog(PADS[hopped - 1][0], PADS[hopped - 1][1] - 2) : frog(54, 8));
const ICON = {
  line:
    '<path d="M4,40H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M10,34v12M30,34v12M50,34v12" stroke="#f3f6fb" stroke-width="2.5"/><path d="M14,37v6M18,37v6M22,37v6M26,37v6M34,37v6M38,37v6M42,37v6M46,37v6" stroke="#f3f6fb" stroke-width="1.5"/>' +
    '<ellipse cx="38" cy="26" rx="9" ry="5" fill="#3fbf88" stroke="#0a2340"/><circle cx="38" cy="40" r="4" fill="#7fe3ff"/>',
  compare:
    '<ellipse cx="18" cy="40" rx="13" ry="10" fill="#a9c4e4" stroke="#0a2340" stroke-width="1.5"/><ellipse cx="46" cy="38" rx="15" ry="12" fill="#cfd8e3" stroke="#0a2340" stroke-width="1.5"/><text x="32" y="22" fill="#ffc93c" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">&lt;</text>',
  jumps:
    '<path d="M4,50H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M10,46Q22,22 34,46" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><path d="M34,46Q46,22 58,46" fill="none" stroke="#7fe3ff" stroke-width="2.5"/>' +
    frog(34, 18),
  tens: '<path d="M4,52H60" stroke="#f3f6fb" stroke-width="2.5"/><path d="M6,48Q18,14 30,48M30,48Q42,14 54,48" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M54,48Q57,40 60,48" fill="none" stroke="#7fe3ff" stroke-width="2"/><text x="18" y="26" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+10</text><text x="42" y="26" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+10</text>',
  stories:
    '<rect x="0" y="22" width="64" height="40" rx="12" fill="rgba(111,168,255,.3)"/><rect x="12" y="6" width="40" height="28" rx="3" fill="#f3f6fb" stroke="#0a2340" stroke-width="1.5"/><path d="M18,14H46M18,20H46M18,26H36" stroke="#a9c4e4" stroke-width="2"/><ellipse cx="22" cy="48" rx="9" ry="5" fill="#3fbf88" stroke="#0a2340"/><ellipse cx="44" cy="50" rx="9" ry="5" fill="#3fbf88" stroke="#0a2340"/>',
  boss: pond(3),
};
