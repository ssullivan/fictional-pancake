/* Fraction Bakery (Grade 4 Unit 2): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Fraction strips and number lines come from shared/fractions.js; fr, mixed, PART, and partName from shared/pictures.js;
   DEN, sign, cmpWhy, and the other comparison helpers from figs.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks.
   Fractions are [numerator, denominator]. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* two different students */
const twoKids = () => shuffle(KIDS).slice(0, 2);
/* the plural name of 1/d's parts: "eighths" */
const parts = (d) => PART[d][1];
/* Named mistakes for a typed fraction, leaving out any whose value is so close to the answer that the engine would count
   it right (it accepts answers within 0.011, and 1/11 is within that of 1/12) */
const apart = (answer, list) =>
  miscOf(
    answer,
    list.filter(([value]) => value > 0 && Math.abs(value - answer) > 0.02),
  );
/* the three ways to finish "a ? b": a < b, a = b, a > b, as an mc problem. wrong(s): the message for a wrong sign s */
function signChoices(a, b, wrong) {
  const right = sign(a, b);
  return mcOf(["<", "=", ">"].map((s) => [`${frA(a)} ${SYM[s]} ${frA(b)}`, s === right ? null : wrong(s)]));
}
/* rectangular things to bake, cut into equal pieces: [the whole thing, a short name for it] */
const BAKES = [
  ["pan of cornbread", "pan"],
  ["sheet cake", "cake"],
  ["loaf of banana bread", "loaf"],
  ["tray of brownies", "tray"],
  ["pan of lasagna", "pan"],
  ["tray of lemon bars", "tray"],
];
/* the same, two at a time: [two of them, one] */
const PANS = [
  ["pans of cornbread", "pan"],
  ["sheet cakes", "cake"],
  ["trays of brownies", "tray"],
  ["pans of lasagna", "pan"],
];

/* ---------- Cutting Board: parts of a whole, and comparing with the same denominator or numerator (Lessons 1–4) ---------- */
function genParts() {
  const variant = R(0, 4),
    name = pick(KIDS),
    [bake, short] = pick(BAKES);
  if (variant === 0) {
    /* name the shaded fraction of one whole */
    const d = pick(DEN),
      k = R(1, d - 1);
    return {
      kind: "num",
      frac: true,
      unit: `of the ${short}`,
      answer: k / d,
      prompt: `A ${bake} is cut into ${d} equal pieces. ${name} frosts the shaded pieces. What fraction of the ${short} is frosted?`,
      fig: () => strips([{ d, k }], { label: `A strip cut into ${d} equal parts, ${k} shaded` }),
      misc: apart(k / d, [
        [(d - k) / d, `That’s the part that isn’t frosted. Count the shaded pieces.`],
        [
          d / k,
          `The numerator and denominator are switched. The denominator is how many equal pieces make the whole: ${d}.`,
        ],
        [k / (d - k), `The denominator counts all ${d} pieces, not only the ones that aren’t frosted.`],
      ]),
      hint: `Count all the equal pieces for the denominator. Count the shaded pieces for the numerator.`,
      explain: `The ${short} has ${d} equal pieces, so each piece is ${fr(1, d)}. ${partName(d, k)} ${k === 1 ? "is" : "are"} frosted: ${fr(k, d)}.`,
    };
  }
  if (variant === 1) {
    /* more than 1 whole: two pans, pieces eaten from both */
    const d = pick([2, 3, 4, 5, 6, 8]),
      k = R(d + 1, 2 * d - 1),
      [pans, pan] = pick(PANS);
    return {
      kind: "num",
      frac: true,
      unit: `${pan}s`,
      answer: k / d,
      prompt: `${name} bakes 2 ${pans}, each cut into ${d} equal pieces. The class eats the shaded pieces. How many ${pan}s did the class eat? Write a fraction.`,
      fig: () => strips([{ d, k }], { wholes: 2, label: `2 wholes cut into ${d} equal parts each, ${k} parts shaded` }),
      misc: apart(k / d, [
        [
          k / (2 * d),
          `That uses all ${2 * d} pieces as the whole. Each ${pan} is 1 whole cut into ${d} pieces, so the denominator is ${d}.`,
        ],
        [(k - d) / d, `That’s only the second ${pan}. The first one was eaten too: ${fr(d, d)}.`],
      ]),
      hint: `Each ${pan} is 1 whole, so each piece is ${fr(1, d)}. Count the shaded pieces in both.`,
      explain: `Each piece is ${fr(1, d)} of a ${pan}. ${k} pieces are eaten: ${fr(k, d)} = ${mixed(k, d)} ${pan}s.`,
    };
  }
  if (variant === 2) {
    /* the same denominator: more parts of the same size is more */
    const d = pick(DEN.slice(2)),
      [a, b] = shuffle(range(d - 1).map((i) => i + 1)).slice(0, 2),
      [first, second] = twoKids();
    return {
      ...signChoices([a, d], [b, d], (s) =>
        s === "="
          ? `${partName(d, a)} and ${partName(d, b)} are different amounts, so they aren’t equal.`
          : `Both are ${parts(d)}, so the parts are the same size. ${Math.max(a, b)} parts are more than ${Math.min(a, b)}.`,
      ),
      prompt: `${first} uses ${fr(a, d)} of a bag of flour. ${second} uses ${fr(b, d)} of a bag the same size. Which is true?`,
      fig: (show) =>
        strips([
          { d, k: show ? a : 0, lab: [a, d] },
          { d, k: show ? b : 0, cls: "b", lab: [b, d] },
        ]),
      hint: `Both are cut into ${parts(d)}, the same size of part. Which has more of those parts?`,
      explain: cmpWhy([a, d], [b, d]).why,
    };
  }
  if (variant === 3) {
    /* the same numerator: the bigger denominator makes smaller parts */
    const [d1, d2] = shuffle(DEN.slice(0, 7)).slice(0, 2),
      a = R(1, Math.min(d1, d2) - 1),
      [first, second] = twoKids(),
      [smallParts, bigParts] = d1 > d2 ? [d1, d2] : [d2, d1];
    return {
      ...signChoices([a, d1], [a, d2], (s) =>
        s === "="
          ? `Both are ${a} part${a > 1 ? "s" : ""}, but the parts aren’t the same size, so the amounts aren’t equal.`
          : `Both are ${a} part${a > 1 ? "s" : ""}, but ${parts(smallParts)} are smaller than ${parts(bigParts)}. Cutting the whole into more parts makes each part smaller.`,
      ),
      prompt: `${first} eats ${fr(a, d1)} of a ${bake}. ${second} eats ${fr(a, d2)} of another ${bake} the same size. Which is true?`,
      fig: (show) =>
        strips([
          { d: d1, k: show ? a : 0, lab: [a, d1] },
          { d: d2, k: show ? a : 0, cls: "b", lab: [a, d2] },
        ]),
      hint: `Both have ${a} part${a > 1 ? "s" : ""}. Which parts are bigger: ${parts(d1)} or ${parts(d2)}?`,
      explain: cmpWhy([a, d1], [a, d2]).why,
    };
  }
  /* parts cut again: each of d pieces cut into split smaller pieces */
  const d = pick([2, 3, 4, 5, 6]),
    split = pick([2, 3].filter((s) => DEN.includes(d * s))),
    small = d * split;
  return {
    kind: "num",
    frac: true,
    unit: `of the ${short}`,
    answer: 1 / small,
    prompt: `${name} cuts a ${bake} into ${d} equal pieces, then cuts each piece into ${split} equal smaller pieces. What fraction of the ${short} is one small piece?`,
    fig: (show) =>
      show
        ? strips([{ d: small, k: 1 }], { label: `A strip cut into ${small} equal parts, 1 shaded` })
        : strips([{ d, k: 1 }], { label: `A strip cut into ${d} equal parts, 1 shaded` }),
    misc: apart(1 / small, [
      [
        1 / (d + split),
        `You added ${d} + ${split}. Each of the ${d} pieces is cut into ${split}, so there are ${d} × ${split} small pieces.`,
      ],
      [1 / d, `That’s one of the first pieces. Each of those was cut into ${split}.`],
      [1 / split, `That’s what 1 small piece is of one of the ${d} pieces. What fraction is it of the whole ${short}?`],
    ]),
    hint: `Picture ${d === 2 ? "both" : `all ${d}`} pieces cut into ${split}. How many small pieces are there in all?`,
    explain: `${d} × ${split} = ${small} small pieces, all the same size. One is ${fr(1, small)} of the ${short}.`,
  };
}

/* ---------- Measuring Tape: fractions on number lines, and benchmarks (Lessons 5–6) ---------- */
/* a fraction on a number line to 1 or 2: [k, d, wholes], never a whole number */
function linePoint() {
  const wholes = Math.random() < 0.5 ? 1 : 2,
    d = pick(wholes === 1 ? DEN : [2, 3, 4, 5, 6]);
  let k;
  do k = R(1, wholes * d - 1);
  while (k % d === 0);
  return [k, d, wholes];
}
function genLines() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* tap a fraction on the line; every other tick names what it is */
    const [k, d, wholes] = linePoint(),
      why = {};
    range(wholes * d + 1).forEach((t) => {
      if (t === k) return;
      why[t] =
        `That’s ${t % d ? fr(t, d) : t / d}.` +
        (Math.abs(t - k) === 1 ? ` Count jumps of ${fr(1, d)} from 0: ${fr(k, d)} is ${k} jumps.` : "");
    });
    return {
      kind: "tap",
      answer: String(k),
      why,
      prompt: `Tap ${fr(k, d)} on the number line.`,
      fig: (show) => fracLine([{ d, tap: "cand", hops: show ? k : 0 }], { wholes }),
      hint: `Each whole is cut into ${d} equal parts, so each jump is ${fr(1, d)}. Count ${k} jumps from 0.`,
      explain: `${fr(k, d)} is ${k} jumps of ${fr(1, d)} from 0.`,
    };
  }
  if (variant === 1) {
    /* name the fraction at a point */
    const [k, d, wholes] = linePoint();
    return {
      kind: "num",
      frac: true,
      unit: "",
      answer: k / d,
      prompt: `What fraction is at the point on the number line?`,
      fig: (show) => fracLine([{ d, pts: [{ k }], hops: show ? k : 0 }], { wholes }),
      misc: apart(k / d, [
        [(k + 1) / d, `That counts the tick marks, with 0 as the first. Count the jumps from 0 instead.`],
        [k / (d + 1), `There are ${d + 1} tick marks from 0 to 1, but ${d} equal parts. The denominator is ${d}.`],
        ...(k > d ? [[(k - d) / d, `That’s how far the point is past 1. Count from 0.`]] : []),
      ]),
      hint: `Count the equal parts from 0 to 1 for the denominator. Then count the jumps from 0 to the point.`,
      explain: `From 0 to 1 is cut into ${d} equal parts, so each jump is ${fr(1, d)}. The point is ${k} jumps from 0: ${fr(k, d)}.`,
    };
  }
  if (variant === 2) {
    /* closest to 0, 1/2, or 1, in a denominator that halves evenly, with one clear winner */
    let d, k, away;
    do {
      d = pick([4, 6, 8, 10, 12]);
      k = R(1, d - 1);
      /* how many parts of 1/d it is from 0, from 1/2, and from 1 */
      away = [k, Math.abs(k - d / 2), d - k];
    } while (away.filter((v) => v === Math.min(...away)).length > 1);
    const marks = ["0", fr(1, 2), "1"],
      best = away.indexOf(Math.min(...away)),
      list = marks.map((label, i) => [
        label,
        i === best
          ? null
          : `${fr(k, d)} is ${partName(d, away[i])} from ${label}, but only ${partName(d, away[best])} from ${marks[best]}.`,
      ]);
    return {
      ...mcOf(list),
      prompt: `Is ${fr(k, d)} closest to 0, ${fr(1, 2)}, or 1?`,
      fig: (show) =>
        fracLine([{ d, pts: show ? [{ k }] : [] }], {
          marks: [{ v: 0.5, t: [1, 2] }],
          label: `Number line from 0 to 1 in ${parts(d)}, with 1/2 marked`,
        }),
      hint: `${fr(1, 2)} is ${fr(d / 2, d)}. How many ${parts(d)} is ${fr(k, d)} from 0, from ${fr(1, 2)}, and from 1?`,
      explain: `${fr(1, 2)} is ${fr(d / 2, d)}. ${fr(k, d)} is ${partName(d, away[0])} from 0, ${partName(d, away[1])} from ${fr(1, 2)}, and ${partName(d, away[2])} from 1. It’s closest to ${marks[best]}.`,
    };
  }
  /* between which two whole numbers */
  const d = pick(DEN),
    whole = R(0, 3),
    k = whole * d + R(1, d - 1),
    pair = (lo) => `${lo} and ${lo + 1}`,
    other = whole > 0 ? whole - 1 : whole + 2;
  return {
    ...mcOf([
      [pair(whole), null],
      [pair(whole + 1), `${fr(k, d)} is less than ${whole + 1}, which is ${fr((whole + 1) * d, d)}.`],
      [
        pair(other),
        other < whole
          ? `${fr(k, d)} is more than ${whole}, which is ${fr(whole * d, d)}.`
          : `${fr(k, d)} is less than ${whole + 1}, which is ${fr((whole + 1) * d, d)}.`,
      ],
    ]),
    prompt: `${fr(k, d)} is between which two whole numbers?`,
    fig: (show) =>
      fracLine([{ d: 1 }], {
        wholes: 4,
        marks: show ? [{ v: k / d, t: [k, d] }] : [],
        label: `Number line from 0 to 4` + (show ? `, with ${k}/${d} marked` : ""),
      }),
    hint: `How many ${parts(d)} make 1 whole? Count by ${d}s: ${whole > 0 ? `${whole * d} ${parts(d)} is ${whole}, ` : ""}${(whole + 1) * d} ${parts(d)} is ${whole + 1}.`,
    explain: `${whole} is ${fr(whole * d, d)} and ${whole + 1} is ${fr((whole + 1) * d, d)}. ${fr(k, d)} is between them.`,
  };
}

/* ---------- Twin Trays: equivalent fractions on strips and number lines (Lessons 7–9) ---------- */
/* a fraction a/b and a split n, so that b × n is a denominator the unit uses: [a, b, n] (a/b less than 1 unless over: up to 2) */
function splitPair(over = false) {
  const b = pick([2, 3, 4, 5, 6]),
    n = pick([2, 3, 4, 5, 6].filter((v) => DEN.includes(b * v)));
  let a;
  do a = R(1, (over ? 2 : 1) * b - 1);
  while (a % b === 0);
  return [a, b, n];
}
/* the named mistakes for a/b = ?/c (c = b × n): keeping the numerator, or adding what was added to the denominator */
const sameTopMisc = (a, b, n) => {
  const c = b * n;
  return miscOf(a * n, [
    [a, `That keeps the same numerator, but ${parts(c)} are smaller than ${parts(b)}, so it takes more of them.`],
    [
      a + c - b,
      `You added ${c - b} to the numerator because ${c - b} was added to the denominator. Each ${PART[b][0]} is split into ${n} ${parts(c)}, so multiply: ${a} × ${n}.`,
    ],
  ]);
};
function genEquiv() {
  const variant = R(0, 3),
    name = pick(KIDS),
    [bake] = pick(BAKES);
  if (variant === 0 || variant === 1) {
    /* a/b = ?/c with strips (two trays) or with two number lines */
    const onLines = variant === 1,
      [a, b, n] = splitPair(onLines),
      c = b * n,
      wholes = Math.ceil(a / b);
    return {
      kind: "num",
      unit: parts(c),
      answer: a * n,
      prompt: onLines
        ? `The point on the top line is at ${fr(a, b)}. The bottom line is marked in ${parts(c)}. ${fr(a, b)} = ${fr("?", c)}`
        : `${name} has two same-size trays of brownies. One is cut into ${parts(b)}, and ${fr(a, b)} of it is frosted. The other is cut into ${parts(c)}. How many ${parts(c)} must be frosted to match? ${fr(a, b)} = ${fr("?", c)}`,
      fig: (show) =>
        onLines
          ? fracLine(
              [
                { d: b, pts: [{ k: a }] },
                { d: c, pts: show ? [{ k: a * n, cls: "b" }] : [] },
              ],
              { wholes, marks: show ? [{ v: a / b, t: [a, b] }] : [] },
            )
          : strips([
              { d: b, k: a, lab: [a, b] },
              { d: c, k: show ? a * n : 0, cls: "b", lab: [show ? a * n : "?", c] },
            ]),
      misc: sameTopMisc(a, b, n),
      hint: `Each ${PART[b][0]} is the same as ${n} ${parts(c)}. Line up the ${onLines ? "lines" : "strips"}.`,
      explain: `Each ${PART[b][0]} is ${n} ${parts(c)}, so ${partName(b, a)} is ${a} × ${n} = ${a * n} ${parts(c)}. ${fr(a, b)} = ${fr(a * n, c)}.`,
    };
  }
  if (variant === 2) {
    /* which fraction is equivalent: the right one, or adding the same number to both, or changing only one number */
    const [a, b, n] = splitPair(),
      c = b * n;
    const wrongs = shuffle([
      [
        fr(a + c - b, c),
        `That adds ${c - b} to the numerator and the denominator. Adding changes the amount. Multiplying both by the same number doesn’t.`,
      ],
      [
        fr(a, c),
        `Only the denominator changed. ${cap(parts(c))} are smaller than ${parts(b)}, so ${a} of them is less.`,
      ],
      [fr(a * n, b), `Only the numerator was multiplied. That’s ${n} times as much.`],
    ]).slice(0, 2);
    return {
      ...mcOf([[fr(a * n, c), null], ...wrongs]),
      prompt: `Which fraction is equivalent to ${fr(a, b)}?`,
      fig: (show) =>
        strips([{ d: b, k: a, lab: [a, b] }, ...(show ? [{ d: c, k: a * n, cls: "b", lab: [a * n, c] }] : [])]),
      hint: `Split each ${PART[b][0]} into ${n} equal parts. How many parts are there now, and how many are shaded?`,
      explain: `${fr(a, b)} = ${fr(`${a} × ${n}`, `${b} × ${n}`)} = ${fr(a * n, c)}. Each part is split into ${n}, so there are ${n} times as many parts and ${n} times as many shaded.`,
    };
  }
  /* the same amount or not: two people eat from same-size pans */
  const [a, b, n] = splitPair(),
    c = b * n,
    same = Math.random() < 0.5,
    other = same ? a * n : a * n + pick([-1, 1]),
    [first, second] = twoKids(),
    compared = sign([a, b], [other, c]);
  const why = (claim) =>
    claim === "="
      ? `${fr(a, b)} is ${fr(a * n, c)}, not ${fr(other, c)}, so they don’t eat the same amount.`
      : compared === "="
        ? `Split each ${PART[b][0]} into ${n}: ${fr(a, b)} = ${fr(a * n, c)}. That’s the same as ${fr(other, c)}.`
        : `Split each ${PART[b][0]} into ${n}: ${fr(a, b)} = ${fr(a * n, c)}, which is ${compared === "<" ? "less" : "more"} than ${fr(other, c)}.`;
  return {
    ...mcOf([
      [first, compared === ">" ? null : why(">")],
      [second, compared === "<" ? null : why("<")],
      ["They eat the same amount", compared === "=" ? null : why("=")],
    ]),
    prompt: `${first} eats ${fr(a, b)} of a ${bake}. ${second} eats ${fr(other, c)} of another ${bake} the same size. Who eats more?`,
    fig: (show) =>
      strips([
        { d: b, k: show ? a : 0, lab: [a, b] },
        { d: c, k: show ? other : 0, cls: "b", lab: [other, c] },
      ]),
    hint: `Write ${fr(a, b)} in ${parts(c)}: split each ${PART[b][0]} into ${n}.`,
    explain: cmpWhy([a, b], [other, c]).why,
  };
}

/* ---------- Slice & Stack: multiply or divide the numerator and denominator (Lessons 10–11) ---------- */
function genScale() {
  const variant = R(0, 3),
    [a, b, n] = splitPair(),
    c = b * n,
    big = a * n;
  /* the strips: a/b, and the same amount in c-ths, its shaded parts in groups of n */
  const fig = (show, small = true) =>
    strips([
      ...(small || show ? [{ d: b, k: a, lab: [a, b] }] : []),
      ...(!small || show ? [{ d: c, k: big, cls: "b", grp: show ? n : 0, lab: [big, c] }] : []),
    ]);
  const times = `${fr(a, b)} = ${fr(`${a} × ${n}`, `${b} × ${n}`)} = ${fr(big, c)}`,
    divide = `${fr(big, c)} = ${fr(`${big} ÷ ${n}`, `${c} ÷ ${n}`)} = ${fr(a, b)}`;
  if (variant === 0) {
    /* the number both were multiplied by */
    return {
      kind: "num",
      unit: "",
      answer: n,
      prompt: `${fr(a, b)} = ${fr(big, c)}. What number were the numerator and denominator both multiplied by?`,
      fig: (show) => fig(show),
      misc: apart(n, [
        [c - b, `That’s how much bigger the denominator got. Think: ${b} × ? = ${c}.`],
        [big - a, `That’s how much bigger the numerator got. Think: ${a} × ? = ${big}.`],
      ]),
      hint: `${b} times what number is ${c}? Check that ${a} times the same number is ${big}.`,
      explain: `${times}. Each part was split into ${n}.`,
    };
  }
  if (variant === 1) {
    /* multiply to find a missing denominator */
    return {
      kind: "num",
      unit: "",
      answer: c,
      prompt: `${fr(a, b)} = ${fr(big, "?")}. What is the missing denominator?`,
      fig: (show) => fig(show),
      misc: apart(c, [
        [
          b + big - a,
          `You added ${big - a} because the numerator went up by ${big - a}. The numerator was multiplied by ${n}, so multiply the denominator by ${n} too.`,
        ],
        [b, `The numerator changed, so the denominator must change the same way: ${a} × ${n} = ${big}.`],
      ]),
      hint: `What was ${a} multiplied by to get ${big}? Multiply ${b} by the same number.`,
      explain: `${a} × ${n} = ${big}, so the denominator is ${b} × ${n} = ${c}. ${times}.`,
    };
  }
  if (variant === 2) {
    /* divide to find a missing numerator: group the parts */
    return {
      kind: "num",
      unit: "",
      answer: a,
      prompt: `Group the parts to write ${fr(big, c)} with a smaller denominator. ${fr(big, c)} = ${fr("?", b)}`,
      fig: (show) => fig(show, false),
      misc: apart(a, [
        [big, `That keeps the numerator, but ${parts(b)} are bigger than ${parts(c)}, so it takes fewer of them.`],
        [
          big - (c - b),
          `You subtracted ${c - b} because the denominator went down by ${c - b}. Divide instead: ${c} ÷ ${n} = ${b}, so divide ${big} by ${n} too.`,
        ],
      ]),
      hint: `${c} ÷ ? = ${b}. Make groups of that many ${parts(c)}. How many groups are shaded?`,
      explain: `Groups of ${n}: ${divide}.`,
    };
  }
  /* divide to find a missing denominator */
  return {
    kind: "num",
    unit: "",
    answer: b,
    prompt: `${fr(big, c)} = ${fr(a, "?")}. What is the missing denominator?`,
    fig: (show) => fig(show, false),
    misc: apart(b, [
      [
        c - (big - a),
        `You subtracted ${big - a} because the numerator went down by ${big - a}. The numerator was divided by ${n}, so divide the denominator by ${n} too.`,
      ],
      [c, `The numerator changed, so the denominator must change the same way: ${big} ÷ ${n} = ${a}.`],
    ]),
    hint: `What was ${big} divided by to get ${a}? Divide ${c} by the same number.`,
    explain: `${big} ÷ ${n} = ${a}, so the denominator is ${c} ÷ ${n} = ${b}. ${divide}.`,
  };
}

/* ---------- Taste Test: compare and order fractions (Lessons 12–16) ---------- */
/* Can the unit compare a and b without going past twelfths? Yes when their common denominator is 12 or less; otherwise
   only when cmpWhy compares them another way: the same numerator, 1/2 between them, or both one part short of 1. */
function comparable(a, b) {
  if (lcm(a[1], b[1]) <= 12) return true;
  const s = sign(a, b);
  if (s === "=") return false;
  const [smaller, bigger] = s === "<" ? [a, b] : [b, a],
    halfBetween = sign(smaller, [1, 2]) !== ">" && sign(bigger, [1, 2]) !== "<",
    oneShort = smaller[1] - smaller[0] === 1 && bigger[1] - bigger[0] === 1;
  return a[0] === b[0] || halfBetween || oneShort;
}
/* two fractions under 1 with different denominators that the unit can compare; unequal: never the same amount */
function comparePair(unequal = false) {
  let a, b;
  do {
    const [d1, d2] = shuffle(DEN).slice(0, 2);
    a = [R(1, d1 - 1), d1];
    b = [R(1, d2 - 1), d2];
  } while (!comparable(a, b) || (unequal && sign(a, b) === "="));
  return [a, b];
}
/* what a student who compares a and b by the size of the numbers alone would say, as a message for that wrong sign */
const signMisc = (a, b) => (s) => {
  const compared = cmpWhy(a, b);
  if (s === "=") return `They aren’t the same amount. ${compared.how}: ${compared.why}`;
  if (compared.how === "Same numerator")
    return `A bigger denominator means smaller parts, not a bigger fraction. ${compared.why}`;
  return `Compare the amounts, not the numbers by themselves. ${compared.how}: ${compared.why}`;
};
function genCompare() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* which comparison is true */
    const [a, b] = comparePair();
    return {
      ...signChoices(a, b, signMisc(a, b)),
      prompt: `Which is true?`,
      fig: (show) =>
        strips([
          { d: a[1], k: show ? a[0] : 0, lab: a },
          { d: b[1], k: show ? b[0] : 0, cls: "b", lab: b },
        ]),
      hint: `Is one of them more than ${fr(1, 2)} and the other less? If not, write both with the same denominator.`,
      explain: cmpWhy(a, b).why,
    };
  }
  if (variant === 1) {
    /* which class eats more from same-size pans */
    const [a, b] = comparePair(true),
      [first, second] = twoKids(),
      [bake] = pick(BAKES),
      compared = cmpWhy(a, b);
    return {
      ...mcOf([
        [`${first}’s class`, compared.s === ">" ? null : `${compared.how}: ${compared.why}`],
        [`${second}’s class`, compared.s === "<" ? null : `${compared.how}: ${compared.why}`],
      ]),
      prompt: `${first}’s class eats ${frA(a)} of a ${bake}. ${second}’s class eats ${frA(b)} of a ${bake} the same size. Which class eats more?`,
      fig: (show) =>
        strips([
          { d: a[1], k: show ? a[0] : 0, lab: a },
          { d: b[1], k: show ? b[0] : 0, cls: "b", lab: b },
        ]),
      hint: `Compare ${frA(a)} and ${frA(b)}: think about ${fr(1, 2)}, or write both with the same denominator.`,
      explain: compared.why,
    };
  }
  if (variant === 2) {
    /* order three fractions from least to greatest; all three write in c-ths */
    const c = pick([6, 8, 10, 12]),
      dens = DEN.filter((d) => c % d === 0 && d > 1);
    let fracs;
    do {
      fracs = range(3).map(() => {
        const d = pick(dens);
        return [R(1, d - 1), d];
      });
    } while (
      new Set(fracs.map(([n, d]) => (n * c) / d)).size < 3 ||
      new Set(fracs.map(([, d]) => d)).size < 2 ||
      new Set(fracs.map(([n]) => n)).size < 3
    );
    const inC = ([n, d]) => (n * c) / d,
      label = (list) => list.map(frA).join(", "),
      least = fracs.slice().sort((x, y) => inC(x) - inC(y)),
      byNumerator = fracs.slice().sort((x, y) => x[0] - y[0] || x[1] - y[1]),
      byDenominator = fracs.slice().sort((x, y) => x[1] - y[1] || x[0] - y[0]),
      most = least.slice().reverse();
    const wrongs = [
      [byNumerator, `That orders the numerators only. The parts are different sizes, so compare the amounts.`],
      [byDenominator, `That orders the denominators only. Write all three in ${parts(c)} to compare.`],
      [most, `That’s from greatest to least. Start with the least.`],
    ].filter(
      ([list], i, all) => label(list) !== label(least) && all.findIndex(([l]) => label(l) === label(list)) === i,
    );
    return {
      ...mcOf([[label(least), null], ...wrongs.slice(0, 2).map(([list, msg]) => [label(list), msg])], { stack: true }),
      prompt: `Put ${label(fracs)} in order from least to greatest.`,
      fig: (show) => strips(fracs.map(([n, d], i) => ({ d, k: show ? n : 0, lab: [n, d], cls: ["", "b", "g"][i] }))),
      hint: `Write each one in ${parts(c)}.`,
      explain: `In ${parts(c)}: ${fracs.map((f) => (f[1] === c ? frA(f) : `${frA(f)} = ${fr(inC(f), c)}`)).join(", ")}. From least to greatest: ${label(least)}.`,
    };
  }
  /* the one more (or less) than 1/2 */
  const more = Math.random() < 0.5;
  let fracs;
  do {
    fracs = shuffle(DEN.slice(1))
      .slice(0, 3)
      .map((d) => [R(1, d - 1), d]);
  } while (
    fracs.filter((f) => sign(f, [1, 2]) === (more ? ">" : "<")).length !== 1 ||
    !(sign(fracs[0], [1, 2]) === (more ? ">" : "<"))
  );
  return {
    ...mcOf(fracs.map((f, i) => [frA(f), i === 0 ? null : `${halfWhy(f)}.`])),
    prompt: `Which fraction is ${more ? "more" : "less"} than ${fr(1, 2)}?`,
    fig: (show) =>
      fracLine(
        fracs.map(([n, d]) => ({ d, pts: show ? [{ k: n }] : [] })),
        { marks: [{ v: 0.5, t: [1, 2] }], label: "Number lines from 0 to 1 with 1/2 marked" },
      ),
    hint: `${fr(1, 2)} is half the parts. Is the numerator more or less than half the denominator?`,
    explain: `${halfWhy(fracs[0])}. The others are ${more ? "not more" : "not less"} than ${fr(1, 2)}.`,
  };
}

/* ---------- The Big Bake-Off: the final round ---------- */
const genBoss = () => pick([genParts, genLines, genEquiv, genScale, genCompare, genCompare])();

const ZONES = [
  {
    id: "parts",
    name: "Cutting Board",
    lessons: "Lessons 1–4",
    blurb: "Name the frosted part, go past 1 whole, and compare with the same denominator or numerator.",
    gen: genParts,
  },
  {
    id: "lines",
    name: "Measuring Tape",
    lessons: "Lessons 5–6",
    blurb: "Find fractions on number lines, and tell whether they’re closest to 0, 1/2, or 1.",
    gen: genLines,
  },
  {
    id: "equiv",
    name: "Twin Trays",
    lessons: "Lessons 7–9",
    blurb: "Find the same amount in smaller parts, on strips and on number lines.",
    gen: genEquiv,
  },
  {
    id: "scale",
    name: "Slice & Stack",
    lessons: "Lessons 10–11",
    blurb: "Multiply or divide the top and bottom by the same number.",
    gen: genScale,
  },
  {
    id: "compare",
    name: "Taste Test",
    lessons: "Lessons 12–16",
    blurb: "Compare fractions with 1/2 or a common denominator, and put them in order.",
    gen: genCompare,
  },
  {
    id: "boss",
    name: "The Big Bake-Off",
    lessons: "All lessons",
    blurb: "Light the cake! Every right answer lights one of its 10 candles.",
    gen: genBoss,
  },
];

/* the Bake-Off cake: 10 candles, `lit` of them burning (the boss icon lights all of them) */
const cake = (lit) =>
  range(10)
    .map((i) => {
      const x = 9 + i * 5.1;
      return (
        `<rect x="${x - 1.5}" y="18" width="3" height="12" fill="#7fe3ff"/>` +
        (i < lit ? `<path d="M${x},10Q${x + 3},15 ${x},17Q${x - 3},15 ${x},10Z" fill="#ffc93c"/>` : "")
      );
    })
    .join("") +
  '<rect x="4" y="30" width="56" height="12" rx="3" fill="#ff9ec7" stroke="#0a2340" stroke-width="1.5"/><rect x="4" y="42" width="56" height="16" rx="3" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><path d="M4,36q7,5 14,0t14,0t14,0t14,0" fill="none" stroke="#f3f6fb" stroke-width="2"/>';
const ICON = {
  parts:
    '<rect x="4" y="38" width="56" height="16" rx="3" fill="#c98a4b" stroke="#0a2340" stroke-width="1.5"/><g stroke="#0a2340" stroke-width="1.5"><rect x="8" y="16" width="12" height="18" fill="#ffc93c"/><rect x="20" y="16" width="12" height="18" fill="#ffc93c"/><rect x="32" y="16" width="12" height="18" fill="#ffc93c"/><rect x="44" y="16" width="12" height="18" fill="rgba(243,246,251,.25)"/></g>',
  lines:
    '<rect x="4" y="22" width="56" height="20" rx="3" fill="#ffc93c" stroke="#0a2340" stroke-width="1.5"/><path d="M10,22V34M18,22V30M26,22V30M34,22V34M42,22V30M50,22V30M58,22V34" stroke="#0a2340" stroke-width="1.5"/><circle cx="42" cy="50" r="5" fill="#7fe3ff"/><path d="M42,44V40" stroke="#7fe3ff" stroke-width="2"/>',
  equiv:
    '<g stroke="#0a2340" stroke-width="1.5"><rect x="6" y="12" width="26" height="16" fill="#ffc93c"/><rect x="32" y="12" width="26" height="16" fill="rgba(243,246,251,.25)"/><rect x="6" y="36" width="13" height="16" fill="#7fe3ff"/><rect x="19" y="36" width="13" height="16" fill="#7fe3ff"/><rect x="32" y="36" width="13" height="16" fill="rgba(243,246,251,.25)"/><rect x="45" y="36" width="13" height="16" fill="rgba(243,246,251,.25)"/></g>',
  scale:
    '<text x="32" y="26" fill="#ffc93c" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">×3</text><text x="32" y="52" fill="#7fe3ff" font-size="15" font-weight="700" text-anchor="middle" font-family="monospace">÷3</text><path d="M12,32H52" stroke="#f3f6fb" stroke-width="2"/>',
  compare:
    '<path d="M32,10V54M14,54H50" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,22H26M38,18H56" stroke="#f3f6fb" stroke-width="2"/><path d="M8,22L4,36H30L26,22M38,18L34,32H60L56,18" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2"/><path d="M14,10L50,6" stroke="#f3f6fb" stroke-width="2.5"/>',
  boss: cake(10),
};
