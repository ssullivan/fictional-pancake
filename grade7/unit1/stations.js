/* Model Makers (Grade 7 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (shapes on a grid, scale bars, and maps) and fracmath.js (scale factors as fractions [n, d]). Every problem
   carries facts for checks.js: its type (t) and the numbers its checks need. Each generator deals one of a few kinds of
   problem (type), each with a comment saying what it asks. */
/* a num problem: its named mistakes leave out any that land on the answer, and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.02);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* an mc problem whose choices keep their order (Copy A, Copy B, Copy C), from [[label, why it's wrong, or null], …] */
function mcInOrder(list, p) {
  const ids = ["a", "b", "c", "d"],
    why = {};
  list.forEach(([, msg], i) => {
    if (msg !== null) why[ids[i]] = msg;
  });
  return {
    kind: "mc",
    choices: list.map(([label], i) => ({ id: ids[i], label })),
    answer: ids[list.findIndex(([, msg]) => msg === null)],
    why,
    ...p,
  };
}
/* a scale factor as a number, and as written: a whole number or a fraction, stacked (html), kept on one line with the
   punctuation after it */
const val = (f) => f[0] / f[1];
const fac = (f, after = "") => (after ? `<span class="nw">${fim(f)}${after}</span>` : fim(f));
/* the most grid squares a copy may be across or down (and for the three copies side by side in Copy or Not?) */
const WIDEST = 12,
  WIDEST_OF_THREE = 8;
const widthOf = (pts) => Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
const heightOf = (pts) => Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]));
const fits = (pts, most = WIDEST) => widthOf(pts) <= most && heightOf(pts) <= most;
/* do all the corners land on the grid? */
const onGrid = (pts) => pts.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y));

/* An original shape and the scale factors it can take: a shape from SHAPE_LIB, or the same shape at half size (so its sides
   can be 1 or 3; only shapes with up to 4 corners, so short sides don't crowd their labels). A factor must keep every corner on the grid and the copy at most WIDEST squares across.
   only(shape): which shapes may be picked. */
function original(only = () => true, most = WIDEST, halves = true) {
  const shape = pick(SHAPE_LIB.filter(only)),
    half = halves && shape.pts.length <= 4 && Math.random() < 0.4,
    pts = half ? scalePts(shape.pts, [1, 2]) : shape.pts,
    factors = [
      [1, 2],
      [3, 2],
      [2, 1],
      [3, 1],
      [5, 2],
    ].filter((f) => onGrid(scalePts(pts, f)) && fits(scalePts(pts, f), most));
  return { ...shape, pts, factors };
}

/* ---------- Station 1: scaled copy or not? (Lesson 1) ---------- */
/* Copies that aren't scaled copies: stretched one way more than the other. Leaves out a stretch that happens to be a scaled
   copy anyway (a 4-by-2 triangle stretched 2 across and 1/2 down is the same triangle turned) and any that don't fit. */
function stretches(pts, f, most) {
  const options = [
    [f, [1, 1]],
    [[1, 1], f],
    [f, fMul(f, [2, 1])],
    [fMul(f, [2, 1]), f],
    [f, fMul(f, [1, 2])],
    [fMul(f, [1, 2]), f],
  ];
  return options
    .map(([fx2, fy2]) => ({ fx: fx2, fy: fy2, pts: scalePts(pts, fx2, fy2) }))
    .filter((s) => onGrid(s.pts) && fits(s.pts, most) && !sameShape(pts, s.pts));
}
/* how a stretched copy changed, in words */
const stretchWords = (s) =>
  `its widths were multiplied by ${fac(s.fx)} but its heights by ${fac(s.fy, ".")} A scaled copy multiplies every length by the same number`;
function genCopies() {
  const type = pick(["which", "which", "which", "yesno"]),
    most = type === "which" ? WIDEST_OF_THREE : WIDEST;
  const shape = original((s) => s.name !== "parallelogram", most),
    f = pick(shape.factors),
    copy = scalePts(shape.pts, f),
    fakes = shuffle(stretches(shape.pts, f, most));
  if (type === "which" && fakes.length >= 2) {
    /* three copies, lettered: one scaled, two stretched */
    const letters = ["A", "B", "C"],
      copies = shuffle([{ pts: copy, ok: true }, ...fakes.slice(0, 2)]),
      okIndex = copies.findIndex((c) => c.ok);
    const fig = (show) =>
      gridFig(
        arrange([
          [
            { pts: shape.pts, cls: "a", name: "Original", sides: show },
            { pts: copies[0].pts, cls: "b", name: "A", sides: show },
          ],
          copies.slice(1).map((c, i) => ({ pts: c.pts, cls: "b", name: letters[i + 1], sides: show })),
        ]),
        { cell: 20, label: `An original ${shape.name} and three copies, A, B, and C` },
      );
    return mcInOrder(
      copies.map((c, i) => [
        `Copy ${letters[i]}`,
        c.ok ? null : `Copy ${letters[i]} is stretched: ${stretchWords(c)}.`,
      ]),
      {
        prompt: `Which copy is a <b>scaled copy</b> of the original ${shape.name}?`,
        fig,
        hint: "Compare each copy’s width and height to the original’s. A scaled copy multiplies them both by the same number.",
        explain: `Copy ${letters[okIndex]} multiplies every length by ${fac(f, ",")} so it has the same shape. The others are stretched more one way than the other.`,
        facts: { t: "which", pts: shape.pts, copies: copies.map((c) => c.pts), ok: okIndex },
      },
    );
  }
  /* one copy: is it scaled? */
  const scaled = Math.random() < 0.5 || !fakes.length,
    shown = scaled ? { pts: copy, fx: f, fy: f } : fakes[0];
  return mcP(
    [
      ["Yes, it’s a scaled copy", scaled ? null : `No: ${stretchWords(shown)}.`],
      [
        "No, it isn’t",
        scaled
          ? `It is: every length was multiplied by ${fac(f, ",")} so it has the same shape, just bigger or smaller.`
          : null,
      ],
    ],
    {
      prompt: `Is the copy a <b>scaled copy</b> of the original ${shape.name}?`,
      fig: (show) =>
        gridFig(
          arrange([
            [
              { pts: shape.pts, cls: "a", name: "Original", sides: true },
              { pts: shown.pts, cls: "b", name: "Copy", sides: true },
            ],
          ]),
          { cell: 20, label: `An original ${shape.name} and a copy` },
        ),
      hint: "Divide each length in the copy by the matching length in the original. Do you always get the same number?",
      explain: scaled
        ? `Every length in the copy is ${fac(f)} times the original’s, so it’s a scaled copy.`
        : `The widths were multiplied by ${fac(shown.fx)} and the heights by ${fac(shown.fy, ".")} They aren’t the same, so it isn’t a scaled copy.`,
      facts: { t: "yesno", pts: shape.pts, copies: [shown.pts], ok: scaled ? 0 : -1 },
    },
  );
}

/* ---------- Station 2: scale factors and matching parts (Lessons 2 and 5) ---------- */
/* the letters for an original's corners and a copy's */
const ORIG_LETTERS = "ABCDEFGH",
  COPY_LETTERS = "PQRSTUVW";
/* side i of a polygon lettered `letters`, named by its two corners: AB */
const sideName = (letters, i, count) => letters[i] + letters[(i + 1) % count];
function genFactor() {
  const type = pick(["factor", "factor", "match", "size"]);
  if (type === "factor") {
    /* the scale factor from two matching sides */
    const shape = original(),
      f = pick(shape.factors),
      copy = scalePts(shape.pts, f),
      lens = sideLens(shape.pts),
      side = pick(lens.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)),
      a = lens[side],
      b = sideLens(copy)[side],
      answer = val(f);
    const only = (len, i) => (i === side ? fmt(len) : null);
    return numP({
      prompt: `The copy is a scaled copy of the original. What is the <b>scale factor</b> from the original to the copy?`,
      answer,
      frac: true,
      fig: () =>
        gridFig(
          arrange([
            [
              { pts: shape.pts, cls: "a", name: "Original", sides: lens.map(only), hi: [side] },
              { pts: copy, cls: "b", name: "Copy", sides: sideLens(copy).map(only), hi: [side] },
            ],
          ]),
          { cell: 20, label: `An original ${shape.name} with a side of ${a} and its copy with the matching side ${b}` },
        ),
      hint: `The scale factor is the number you multiply by: ${fmt(a)} × ? = ${fmt(b)}. Divide ${fmt(b)} by ${fmt(a)}.`,
      misc: [
        [a / b, `That takes the copy back to the original. Go from the original to the copy: ${fmt(b)} ÷ ${fmt(a)}.`],
        [
          Math.abs(b - a),
          `That’s how much longer or shorter the side got. A scale factor multiplies: ${fmt(a)} × ? = ${fmt(b)}.`,
        ],
        [b, `That’s the copy’s side. The scale factor is what ${fmt(a)} is multiplied by to get it.`],
      ],
      explain: `${fmt(a)} × ${fac(f)} = ${fmt(b)}, so the scale factor is ${fac(f, ".")}`,
      facts: { t: "factor", a, b, f },
    });
  }
  if (type === "match") {
    /* which side of a turned copy matches a side of the original */
    const shape = original((s) => s.asym),
      f = pick(shape.factors.filter((g) => g[0] > g[1])),
      quarters = R(1, 3),
      copy = turnPts(scalePts(shape.pts, f), quarters),
      count = shape.pts.length,
      side = R(0, count - 1),
      orig = ORIG_LETTERS.slice(0, count),
      letters = COPY_LETTERS.slice(0, count),
      asked = sideName(orig, side, count),
      before = (side + count - 1) % count,
      after = (side + 1) % count;
    return mcP(
      [
        [`Side ${sideName(letters, side, count)}`, null],
        [
          `Side ${sideName(letters, before, count)}`,
          `${sideName(letters, before, count)} matches ${sideName(orig, before, count)}. Find the corners that match ${orig[side]} and ${orig[(side + 1) % count]}.`,
        ],
        [
          `Side ${sideName(letters, after, count)}`,
          `${sideName(letters, after, count)} matches ${sideName(orig, after, count)}. Find the corners that match ${orig[side]} and ${orig[(side + 1) % count]}.`,
        ],
      ],
      {
        prompt: `The copy is a scaled copy of the original, turned. Which side of the copy <b>corresponds</b> to side ${asked}?`,
        fig: (show) =>
          gridFig(
            arrange([
              [
                { pts: shape.pts, cls: "a", name: "Original", verts: [...orig], sides: true, hi: [side] },
                {
                  pts: copy,
                  cls: "b",
                  name: "Copy",
                  verts: [...letters],
                  sides: true,
                  hi: show ? [side] : [],
                },
              ],
            ]),
            { cell: 20, label: `An original ${shape.name} lettered ${orig} and a turned copy lettered ${letters}` },
          ),
        hint: `Turn the copy in your head until it looks like the original. Corresponding sides are ${fac(f)} times as long.`,
        explain: `Corner ${orig[side]} matches ${letters[side]} and ${orig[(side + 1) % count]} matches ${letters[(side + 1) % count]}, so ${asked} corresponds to ${sideName(letters, side, count)}.`,
        facts: { t: "match", count, side, f, orig: shape.pts, copy },
      },
    );
  }
  /* bigger, smaller, or the same size, from the scale factor */
  const f = pick([
      [1, 2],
      [1, 3],
      [3, 4],
      [2, 3],
      [3, 2],
      [5, 4],
      [2, 1],
      [3, 1],
      [4, 3],
      [1, 1],
    ]),
    thing = pick(["a drawing of a bike", "a map of a park", "a photo of a dog", "a drawing of a sailboat"]),
    size = f[0] > f[1] ? "bigger" : f[0] < f[1] ? "smaller" : "same";
  const why = {
    bigger: "A scale factor greater than 1 makes the copy bigger.",
    smaller: "A scale factor less than 1 makes the copy smaller.",
    same: "A scale factor of 1 keeps every length the same.",
  };
  return mcP(
    [
      ["Bigger than the original", size === "bigger" ? null : why[size]],
      ["Smaller than the original", size === "smaller" ? null : why[size]],
      ["The same size", size === "same" ? null : why[size]],
    ],
    {
      prompt: `Mai makes a scaled copy of ${thing} with a scale factor of <b>${fac(f)}</b>. How does the copy compare to the original?`,
      hint: "Is the scale factor greater than 1, less than 1, or exactly 1?",
      explain: `${fac(f)} is ${size === "same" ? "1" : size === "bigger" ? "greater than 1" : "less than 1"}. ${why[size]}`,
      facts: { t: "size", f, size },
    },
  );
}

/* ---------- Station 3: missing lengths and angles in copies (Lessons 3 and 4) ---------- */
function genMissing() {
  const type = pick(["side", "side", "back", "angle", "reverse"]);
  if (type === "side") {
    /* a missing side of the copy, from one matching pair of sides */
    const shape = original(),
      f = pick(shape.factors),
      copy = scalePts(shape.pts, f),
      lens = sideLens(shape.pts),
      copyLens = sideLens(copy),
      sides = shuffle(lens.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)),
      given = sides[0],
      asked = sides.find((i) => lens[i] !== lens[given]);
    if (asked === undefined) return genMissing();
    const a = lens[given],
      b = copyLens[given],
      c = lens[asked],
      answer = copyLens[asked];
    return numP({
      prompt: `The copy is a scaled copy of the original. How long is the side marked <b>?</b>`,
      answer,
      unit: "units",
      fig: (show) =>
        gridFig(
          arrange([
            [
              {
                pts: shape.pts,
                cls: "a",
                name: "Original",
                sides: lens.map((v, i) => (i === given || i === asked ? fmt(v) : null)),
                hi: show ? [asked] : [],
              },
              {
                pts: copy,
                cls: "b",
                name: "Copy",
                sides: copyLens.map((v, i) => (i === given ? fmt(v) : i === asked ? "?" : null)),
                hi: show ? [asked] : [],
              },
            ],
          ]),
          { cell: 20, label: `An original ${shape.name} and its scaled copy with one side unknown` },
        ),
      hint: `First find the scale factor: ${fmt(a)} × ? = ${fmt(b)}. Then multiply the original’s side, ${fmt(c)}, by it.`,
      misc: [
        [
          c + (b - a),
          `You added ${fmt(b - a)}, like the first pair of sides. A scaled copy multiplies every length by the same number.`,
        ],
        [c, `That’s the original’s side. Multiply it by the scale factor, ${fac(f, ".")}`],
        [(c * a) / b, `You divided by the scale factor. The copy’s sides are ${fac(f)} times the original’s.`],
      ],
      explain: `The scale factor is ${fmt(b)} ÷ ${fmt(a)} = ${fac(f, ",")} so the side is ${fmt(c)} × ${fac(f)} = ${fmt(answer)} units.`,
      facts: { t: "side", a, b, c, answer },
    });
  }
  if (type === "back") {
    /* the original's side from the copy's and the scale factor */
    const f = pick([
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [1, 2],
        [3, 2],
      ]),
      orig = pick([2, 4, 6, 8, 10, 12].filter((v) => Number.isInteger((v * f[0]) / f[1]) && (v * f[0]) / f[1] <= 30)),
      copyLen = (orig * f[0]) / f[1],
      thing = pick(["triangle", "rectangle", "pentagon", "quadrilateral"]);
    return numP({
      prompt: `A ${thing} is a scaled copy of another ${thing}, with a scale factor of <b>${fac(f)}</b>. One side of the copy is ${fmt(copyLen)} cm. How long is the matching side of the <b>original</b>?`,
      answer: orig,
      unit: "cm",
      hint: `original × ${fac(f)} = ${fmt(copyLen)}. To go back, divide by ${fac(f, ".")}`,
      misc: [
        [
          copyLen * val(f),
          `That’s the copy’s side times the scale factor again. Go back: divide ${fmt(copyLen)} by ${fac(f, ".")}`,
        ],
        [copyLen, `That’s the copy’s side. The original’s side times ${fac(f)} makes ${fmt(copyLen)}.`],
      ],
      explain: `original × ${fac(f)} = ${fmt(copyLen)}, so the original side is ${fmt(copyLen)} ÷ ${fac(f)} = ${fmt(orig)} cm.`,
      facts: { t: "back", f, copy: copyLen, answer: orig },
    });
  }
  if (type === "angle") {
    /* an angle in a scaled copy is the same as in the original */
    const shape = original(
        (s) => s.pts.some((_, i) => [45, 135].includes(Math.round(angleAt(s.pts, i)))),
        WIDEST,
        false,
      ),
      f = pick(shape.factors.filter((g) => g[0] !== g[1])),
      copy = scalePts(shape.pts, f),
      count = shape.pts.length,
      corner = pick(range(count).filter((i) => [45, 135].includes(Math.round(angleAt(shape.pts, i))))),
      answer = Math.round(angleAt(shape.pts, corner)),
      orig = ORIG_LETTERS.slice(0, count),
      letters = COPY_LETTERS.slice(0, count);
    return numP({
      prompt: `The copy is a scaled copy of the original with a scale factor of ${fac(f, ".")} The angle at corner ${orig[corner]} is ${answer}°. What is the angle at corner <b>${letters[corner]}</b>?`,
      answer,
      unit: "°",
      fig: () =>
        gridFig(
          arrange([
            [
              {
                pts: shape.pts,
                cls: "a",
                name: "Original",
                verts: [...orig],
                angles: { [corner]: `${answer}°` },
              },
              { pts: copy, cls: "b", name: "Copy", verts: [...letters], angles: { [corner]: "?" } },
            ],
          ]),
          { cell: 20, label: `An original ${shape.name} with a ${answer}° angle and its scaled copy` },
        ),
      hint: "A scaled copy multiplies the lengths. Does it change how wide the corners open?",
      misc: [
        [
          answer * val(f),
          `You multiplied the angle by the scale factor. Only lengths are multiplied; angles stay the same.`,
        ],
        [180 - answer, `That’s the angle that would make a straight line with it. Corresponding angles are equal.`],
      ],
      explain: `Corresponding angles in a scaled copy are equal, so the angle at ${letters[corner]} is ${answer}°, the same as at ${orig[corner]}.`,
      facts: { t: "angle", answer, orig: answer },
    });
  }
  /* the scale factor that takes the copy back to the original */
  const f = pick([
      [2, 1],
      [3, 1],
      [4, 1],
      [1, 2],
      [1, 3],
      [3, 2],
      [2, 3],
      [5, 2],
      [3, 4],
    ]),
    back = fInv(f);
  return numP({
    prompt: `Polygon B is a scaled copy of polygon A with a scale factor of <b>${fac(f)}</b>. What scale factor takes polygon B back to polygon A?`,
    answer: val(back),
    frac: true,
    hint: `A side of A times ${fac(f)} is the matching side of B. What do you multiply ${fac(f)} by to get 1?`,
    misc: [[val(f), `That takes A to B. Going back undoes it: multiply by the reciprocal of ${fac(f, ".")}`]],
    explain: `${fac(f)} × ${fac(back)} = 1, so a scale factor of ${fac(back)} takes B back to A.`,
    facts: { t: "reverse", f, answer: back },
  });
}

/* ---------- Station 4: scaling and area (Lesson 6) ---------- */
/* shapes the hint can cut into k × k smaller copies: rectangles and triangles */
const RECTS = [
  [2, 1],
  [3, 2],
  [4, 1],
  [3, 1],
  [4, 3],
  [5, 2],
  [2, 2],
];
/* a rectangle or a triangle from the library, with its area */
function tileShape() {
  if (Math.random() < 0.6) {
    const [w, h] = pick(RECTS);
    return {
      name: "rectangle",
      pts: [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ],
    };
  }
  const tri = pick(SHAPE_LIB.filter((s) => s.pts.length === 3));
  return { name: "right triangle", pts: tri.pts };
}
function genArea() {
  const type = pick(["copy", "copy", "times", "factor"]);
  if (type === "copy") {
    /* the area of a copy, from the original's area and the scale factor */
    const shape = tileShape(),
      area = areaOf(shape.pts),
      choices = [
        [2, 1],
        [3, 1],
        [1, 2],
        [4, 1],
      ].filter((f) => onGrid(scalePts(shape.pts, f)) && fits(scalePts(shape.pts, f))),
      f = pick(choices),
      k = val(f),
      answer = area * k * k,
      copy = scalePts(shape.pts, f),
      /* the hint cuts the bigger shape into smaller copies of the other */
      [small, big] = k > 1 ? [shape.pts, copy] : [copy, shape.pts],
      tiles = k > 1 ? f[0] : f[1];
    return numP({
      prompt: `The original ${shape.name} has an area of ${fmt(area)} square units. Lin makes a scaled copy with a scale factor of <b>${fac(f)}</b>. What is the <b>area</b> of the copy?`,
      answer,
      unit: "square units",
      fig: (show) =>
        gridFig(
          arrange([
            [
              { pts: shape.pts, cls: "a", name: "Original", sides: true, tiles: show && k < 1 ? tiles : 0 },
              { pts: copy, cls: "b", name: "Copy", sides: show, tiles: show && k > 1 ? tiles : 0 },
            ],
          ]),
          { cell: 20, label: `An original ${shape.name} of area ${area} and its scaled copy` },
        ),
      hint: `The copy is ${fac(f)} times as long and ${fac(f)} times as wide, so its area is ${fac(f)} × ${fac(f)} times as large. The dashed lines cut the ${k > 1 ? "copy" : "original"} into copies of the ${k > 1 ? "original" : "copy"}.`,
      misc: [
        [
          area * k,
          `That multiplies the area by ${fac(f)} once. Both the length and the width were scaled: multiply by ${fac(f)} twice.`,
        ],
        [area + k, `Area isn’t scaled by adding. Multiply by the scale factor times itself.`],
        [area * 2 * k, `Multiply by ${fac(f)} × ${fac(f, ",")} not ${fac(f)} × 2.`],
      ],
      explain: `${fac(f)} × ${fac(f)} = ${fmt(k * k)}, so the area is ${fmt(area)} × ${fmt(k * k)} = ${fmt(answer)} square units.`,
      facts: { t: "copy", area, f, answer, pts: shape.pts },
    });
  }
  if (type === "times") {
    /* how many times as large the area is */
    const k = pick([2, 3, 4, 5, 10]),
      thing = pick(["a photo", "a rug design", "a map", "a garden plan"]);
    return numP({
      prompt: `${thing[0].toUpperCase() + thing.slice(1)} is scaled with a scale factor of <b>${k}</b>. The scaled copy’s area is how many times the original’s area?`,
      answer: k * k,
      unit: "times as large",
      hint: `Every length is ${k} times as long. Picture a 1-by-1 square: its copy is ${k} by ${k}.`,
      misc: [
        [k, `${k} times is for lengths. Area grows in two directions: ${k} × ${k}.`],
        [2 * k, `That’s ${k} + ${k}. The area is ${k} times as long <i>and</i> ${k} times as wide: ${k} × ${k}.`],
      ],
      explain: `A 1-by-1 square becomes ${k} by ${k}, which is ${k * k} squares, so the area is ${k} × ${k} = ${k * k} times as large.`,
      facts: { t: "times", k, answer: k * k },
    });
  }
  /* the scale factor from the two areas */
  const k = pick([2, 3, 4, 5]),
    area = pick([2, 3, 4, 5, 6, 8, 10, 12]),
    big = area * k * k;
  return numP({
    prompt: `A rectangle has an area of ${area} square inches. A scaled copy of it has an area of ${big} square inches. What is the <b>scale factor</b>?`,
    answer: k,
    hint: `The area grows by the scale factor times itself. ${big} ÷ ${area} = ${k * k}: what number times itself is ${k * k}?`,
    misc: [
      [k * k, `${k * k} is how many times as large the area is. The scale factor times itself makes ${k * k}.`],
      [big - area, `That’s how much more area. Divide the areas, then find the number that times itself makes it.`],
    ],
    explain: `${big} ÷ ${area} = ${k * k}, and ${k} × ${k} = ${k * k}, so the scale factor is ${k}.`,
    facts: { t: "factor", area, big, answer: k },
  });
}

/* ---------- Station 5: scale drawings and maps (Lessons 7 and 8) ---------- */
/* map scales: 1 cm to `each` km, with places to travel between */
const MAP_SCALES = [2, 5, 10, 20, 25, 50];
const PLACES = [
  ["Pine Lake", "Elm Falls", "Fort Ridge", "Bay Town"],
  ["Mill Creek", "Rock Hill", "Sandy Cove", "Oak Grove"],
  ["the campground", "the lookout", "the waterfall", "the ranger station"],
];
/* a route with `count` legs, each a whole or half number of cm on the map, heading east, a little north, or a little
   south, never the same way twice in a row (so each leg shows) */
function route(count) {
  const dirs = [pick([0, 30, -30])];
  while (dirs.length < count) dirs.push(pick([0, 30, -30].filter((d) => d !== dirs[dirs.length - 1])));
  return dirs.map((dir) => ({ len: pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5]), dir }));
}
/* buildings on floor plans: 1 cm to `each` m, and the rooms' real sizes in m */
const PLANS = [
  { what: "a classroom", each: [1, 2], sizes: [8, 10, 12] },
  { what: "a basketball court", each: [2, 4], sizes: [24, 28] },
  { what: "a swimming pool", each: [2, 5], sizes: [20, 25, 50] },
  { what: "a garden", each: [1, 2, 3], sizes: [6, 9, 12] },
];
function genMap() {
  const type = pick(["toReal", "toReal", "toMap", "total", "speed", "plan"]);
  if (type === "toReal" || type === "total") {
    /* a real distance from the map: one leg, or a whole route */
    const each = pick(MAP_SCALES),
      legs = route(type === "total" ? R(2, 3) : 1),
      names = pick(PLACES).slice(0, legs.length + 1),
      mapLen = legs.reduce((s, l) => s + l.len, 0),
      answer = mapLen * each;
    /* real distances are whole kilometers, at most 600 */
    if (answer > 600 || !Number.isInteger(answer)) return genMap();
    const one = type === "toReal";
    /* a single road is long enough for the names at its ends */
    if (one && mapLen < 3) return genMap();
    return numP({
      prompt: one
        ? `On the map, the road from ${names[0]} to ${names[1]} is ${fmt(mapLen)} cm long. The scale is <b>1 cm to ${each} km</b>. How long is the real road?`
        : `On the map, follow the roads from ${names[0]} to ${names[legs.length]}. The scale is <b>1 cm to ${each} km</b>. How far is the trip?`,
      answer,
      unit: "km",
      fig: (show) => routeFig(legs, { names, each, unit: "km", show }),
      hint: one
        ? `Each centimeter on the map stands for ${each} km. ${fmt(mapLen)} cm stand for ${fmt(mapLen)} × ${each} km.`
        : `Add the lengths on the map, then multiply: each centimeter stands for ${each} km.`,
      misc: [
        [mapLen, `That’s the length on the map in cm. Each centimeter stands for ${each} km.`],
        [mapLen / each, `You divided. Real distances are longer: multiply by ${each}.`],
        ...(one ? [] : [[legs[0].len * each, `That’s only the first road. Add up every road on the trip.`]]),
        [mapLen + each, `Each centimeter stands for ${each} km: multiply, don’t add.`],
      ],
      explain: `${one ? "" : `The roads add up to ${legs.map((l) => fmt(l.len)).join(" + ")} = ${fmt(mapLen)} cm. `}${fmt(mapLen)} × ${each} = ${fmt(answer)} km.`,
      facts: { t: type, each, map: mapLen, answer, legs: legs.map((l) => l.len) },
    });
  }
  if (type === "toMap") {
    /* how long a real distance is on the map */
    const each = pick(MAP_SCALES),
      mapLen = pick([1.5, 2, 3, 4, 5, 6, 7, 8, 2.5, 3.5]),
      real = mapLen * each;
    if (real > 400 || !Number.isInteger(real)) return genMap();
    return numP({
      prompt: `The map’s scale is <b>1 cm to ${each} km</b>. Two towns are ${fmt(real)} km apart. How far apart are they <b>on the map</b>?`,
      answer: mapLen,
      unit: "cm",
      fig: () => scaleBar(each, "km"),
      hint: `Each centimeter stands for ${each} km. How many groups of ${each} km are in ${fmt(real)} km?`,
      misc: [
        [real * each, `You multiplied. The map is smaller than the real distance: divide by ${each}.`],
        [real, `That’s the real distance in km. On the map, each ${each} km is just 1 cm.`],
      ],
      explain: `${fmt(real)} ÷ ${each} = ${fmt(mapLen)}, so the towns are ${fmt(mapLen)} cm apart on the map.`,
      facts: { t: type, each, map: mapLen, real, answer: mapLen },
    });
  }
  if (type === "speed") {
    /* average speed on a trip measured on the map */
    const each = pick([10, 20, 25]),
      hours = pick([2, 3, 4]),
      speed = pick([40, 50, 60, 75, 80].filter((s) => Number.isInteger((s * hours * 2) / each))),
      mapLen = (speed * hours) / each,
      legs = [{ len: mapLen, dir: 0 }],
      names = pick(PLACES).slice(0, 2);
    if (mapLen > 12 || speed === undefined) return genMap();
    const real = speed * hours;
    return numP({
      prompt: `A family drives from ${names[0]} to ${names[1]} in <b>${hours} hours</b>. On the map the road is ${fmt(mapLen)} cm, and the scale is 1 cm to ${each} km. What was their average <b>speed</b>?`,
      answer: speed,
      unit: "km per hour",
      fig: () => routeFig(legs, { names, each, unit: "km", cmPx: 24 }),
      hint: `First find the real distance: ${fmt(mapLen)} × ${each} km. Then divide by the ${hours} hours.`,
      misc: [
        [real, `That’s how far they drove. Speed is the distance for each hour: divide by ${hours}.`],
        [mapLen / hours, `That uses the map’s centimeters. Find the real distance in km first.`],
        [real * hours, `Divide the distance by the time, not multiply.`],
      ],
      explain: `The road is ${fmt(mapLen)} × ${each} = ${real} km, and ${real} ÷ ${hours} = ${speed} km per hour.`,
      facts: { t: type, each, map: mapLen, hours, real, answer: speed },
    });
  }
  /* a floor plan: the drawing's length from the real one, or the other way */
  const plan = pick(PLANS),
    each = pick(plan.each),
    real = pick(plan.sizes.filter((s) => s % each === 0 || (2 * s) % each === 0)),
    drawn = real / each;
  if (real === undefined || drawn > 15) return genMap();
  const toReal = Math.random() < 0.5;
  return numP({
    prompt: toReal
      ? `A scale drawing of ${plan.what} uses the scale <b>1 cm to ${each} m</b>. On the drawing, it’s ${fmt(drawn)} cm long. How long is it really?`
      : `${plan.what[0].toUpperCase() + plan.what.slice(1)} is ${real} m long. How long is it on a scale drawing with the scale <b>1 cm to ${each} m</b>?`,
    answer: toReal ? real : drawn,
    unit: toReal ? "m" : "cm",
    fig: () => scaleBar(each, "m"),
    hint: `Each centimeter on the drawing stands for ${each} m.`,
    misc: toReal
      ? [
          [drawn / each, `You divided. Real lengths are longer: multiply by ${each}.`],
          [drawn + each, `Multiply by ${each}, don’t add.`],
        ]
      : [
          [real * each, `You multiplied. The drawing is smaller: divide by ${each}.`],
          [real - each, `Divide by ${each}, don’t subtract.`],
        ],
    explain: toReal
      ? `${fmt(drawn)} × ${each} = ${real}, so it’s ${real} m long.`
      : `${real} ÷ ${each} = ${fmt(drawn)}, so it’s ${fmt(drawn)} cm on the drawing.`,
    facts: { t: "plan", each, map: drawn, real, toReal, what: plan.what },
  });
}

/* ---------- Station 6: changing the scale (Lessons 9 and 10) ---------- */
/* things to draw, how long they really are (m), and scales that fit them on paper (1 cm to `each` m) */
const DRAWN = [
  { what: "a soccer field", real: 100, scales: [5, 10, 20, 25] },
  { what: "a tennis court", real: 24, scales: [1, 2, 3, 4, 6] },
  { what: "a bus", real: 12, scales: [1, 2, 3, 4] },
  { what: "a house", real: 20, scales: [1, 2, 4, 5] },
  { what: "a park", real: 300, scales: [20, 25, 50, 100] },
];
function genRescale() {
  const type = pick(["redraw", "redraw", "times", "largest"]);
  const thing = pick(DRAWN);
  if (type === "redraw") {
    /* the same thing drawn again at a new scale */
    const [from, to] = shuffle(thing.scales.filter((s) => thing.real % s === 0)).slice(0, 2),
      before = thing.real / from,
      after = thing.real / to;
    if (to === undefined || before > 30) return genRescale();
    return numP({
      prompt: `A scale drawing of ${thing.what} uses <b>1 cm to ${from} m</b>, and the ${thing.what.split(" ").pop()} is ${fmt(before)} cm long on it. Elena redraws it with the scale <b>1 cm to ${to} m</b>. How long is it on the new drawing?`,
      answer: after,
      unit: "cm",
      hint: `Find the real length first: ${fmt(before)} × ${from} m. Then each centimeter of the new drawing stands for ${to} m.`,
      misc: [
        [
          (before * to) / from,
          `That’s the wrong way. A centimeter stands for ${to > from ? "more" : "fewer"} meters now, so the drawing is ${to > from ? "shorter" : "longer"}.`,
        ],
        [before, `The drawing changes with the scale. Find the real length, then divide by ${to}.`],
        [thing.real, `That’s the real length in meters. Divide by ${to} for the new drawing.`],
      ],
      explain: `It’s really ${fmt(before)} × ${from} = ${thing.real} m long, and ${thing.real} ÷ ${to} = ${fmt(after)} cm at the new scale.`,
      facts: { t: type, real: thing.real, from, to, before, answer: after },
    });
  }
  if (type === "times") {
    /* how many times as long one drawing is as another of the same thing */
    const pairs = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 4],
        [2, 6],
        [5, 10],
        [5, 20],
        [10, 20],
        [10, 50],
        [25, 50],
        [20, 100],
      ],
      [small, big] = pick(pairs),
      answer = big / small;
    return numP({
      prompt: `Drawing A of ${thing.what} uses the scale 1 cm to ${small} m. Drawing B of the same ${thing.what.split(" ").pop()} uses 1 cm to ${big} m. Drawing A is how many times as long as drawing B?`,
      answer,
      unit: "times as long",
      hint: `In drawing A, each centimeter stands for ${small} m. How many centimeters does drawing A need for the ${big} m that drawing B fits in 1 cm?`,
      misc: [
        [small / big, `Drawing A uses fewer meters for each centimeter, so it’s the longer drawing.`],
        [big - small, `Compare by dividing: ${big} ÷ ${small}.`],
      ],
      explain: `Drawing B’s 1 cm stands for ${big} m. Drawing A needs ${big} ÷ ${small} = ${answer} cm for that, so drawing A is ${answer} times as long.`,
      facts: { t: "howLong", small, big, answer },
    });
  }
  /* which scale makes the largest (or smallest) drawing */
  const scales = shuffle(thing.scales).slice(0, 3),
    largest = Math.random() < 0.5,
    best = largest ? Math.min(...scales) : Math.max(...scales);
  return mcP(
    scales.map((s) => [
      `1 cm to ${s} m`,
      s === best
        ? null
        : largest
          ? `At 1 cm to ${s} m, each centimeter stands for more meters than at 1 cm to ${best} m, so the drawing is smaller.`
          : `At 1 cm to ${s} m, each centimeter stands for fewer meters than at 1 cm to ${best} m, so the drawing is bigger.`,
    ]),
    {
      prompt: `Which scale makes the <b>${largest ? "largest" : "smallest"}</b> drawing of ${thing.what}?`,
      hint: "The fewer meters each centimeter stands for, the more centimeters the drawing needs.",
      explain: `At 1 cm to ${best} m, each centimeter stands for the ${largest ? "fewest" : "most"} meters, so the drawing is the ${largest ? "largest" : "smallest"}.`,
      facts: { t: type, scales, best, largest },
    },
  );
}

/* ---------- Station 7: scales without units (Lessons 11 and 12) ---------- */
/* scales with units, and the same scale without units: 1 cm to 1 m is 1 to 100 */
const UNIT_SCALES = [
  { drawn: "1 cm", real: "1 m", ratio: 100 },
  { drawn: "1 cm", real: "2 m", ratio: 200 },
  { drawn: "1 cm", real: "5 m", ratio: 500 },
  { drawn: "1 cm", real: "10 m", ratio: 1000 },
  { drawn: "1 mm", real: "1 m", ratio: 1000 },
  { drawn: "1 mm", real: "10 cm", ratio: 100 },
  { drawn: "1 in", real: "1 ft", ratio: 12 },
  { drawn: "1 in", real: "2 ft", ratio: 24 },
  { drawn: "1 in", real: "1 yd", ratio: 36 },
  { drawn: "1 cm", real: "1 km", ratio: 100000 },
];
/* models of real things, the scale (1 to `ratio`), and real lengths in cm that come out to whole cm on the model */
const MODELS = [
  { what: "a model car", ratio: 24, reals: [360, 480] },
  { what: "a model car", ratio: 20, reals: [400, 500] },
  { what: "a model train engine", ratio: 50, reals: [1500, 2000] },
  { what: "a model sailboat", ratio: 50, reals: [750, 1000, 1250] },
  { what: "a model airplane", ratio: 100, reals: [3500, 4000, 6000] },
  { what: "a dollhouse", ratio: 12, reals: [720, 960] },
  { what: "a model bridge", ratio: 1000, reals: [40000, 50000] },
  { what: "a model of a whale", ratio: 40, reals: [1200, 1600] },
];
function genRatio() {
  const type = pick(["write", "write", "model", "real", "same"]);
  if (type === "write") {
    /* a scale with units written without them */
    const scale = pick(UNIT_SCALES),
      realNum = parseInt(scale.real),
      realUnit = scale.real.split(" ")[1];
    return numP({
      prompt: `Write the scale <b>${scale.drawn} to ${scale.real}</b> without units, as “1 to ?”.`,
      answer: scale.ratio,
      hint: `Write both lengths in the same unit (${scale.drawn.split(" ")[1]}), then compare.`,
      misc: [
        [
          realNum,
          `${scale.drawn.split(" ")[1]} and ${realUnit} aren’t the same size. Change ${scale.real} to ${scale.drawn.split(" ")[1]} first.`,
        ],
        ...(scale.drawn.endsWith("in")
          ? []
          : [[scale.ratio / 10, `Check the conversion: how many ${scale.drawn.split(" ")[1]} are in ${scale.real}?`]]),
      ],
      explain: `${scale.real} = ${fmt(scale.ratio)} ${scale.drawn.split(" ")[1]}, so ${scale.drawn} to ${scale.real} is 1 to ${fmt(scale.ratio)}.`,
      facts: { t: type, ...scale, answer: scale.ratio },
    });
  }
  if (type === "model" || type === "real") {
    /* a model's length from the real thing's, or the real thing's from the model */
    const { what, ratio, reals } = pick(MODELS),
      model = { what, ratio, real: pick(reals) },
      size = model.real / model.ratio,
      toModel = type === "model",
      inMeters = !toModel && Math.random() < 0.5;
    const answer = toModel ? size : inMeters ? model.real / 100 : model.real;
    return numP({
      prompt: toModel
        ? `${model.what[0].toUpperCase() + model.what.slice(1)} is built at a scale of <b>1 to ${fmt(model.ratio)}</b>. The real one is ${fmt(model.real / 100)} m long. How long is the model, in <b>cm</b>?`
        : `${model.what[0].toUpperCase() + model.what.slice(1)} is built at a scale of <b>1 to ${fmt(model.ratio)}</b>. The model is ${fmt(size)} cm long. How long is the real one, in <b>${inMeters ? "meters" : "cm"}</b>?`,
      answer,
      unit: toModel ? "cm" : inMeters ? "m" : "cm",
      hint: toModel
        ? `1 to ${fmt(model.ratio)} means the real one is ${fmt(model.ratio)} times as long. Change ${fmt(model.real / 100)} m to cm, then divide by ${fmt(model.ratio)}.`
        : `1 to ${fmt(model.ratio)} means every length on the real one is ${fmt(model.ratio)} times the model’s.${inMeters ? " Then change cm to meters." : ""}`,
      misc: toModel
        ? [
            [
              model.real / 100 / model.ratio,
              `That’s in meters. Change ${fmt(model.real / 100)} m to ${fmt(model.real)} cm first.`,
            ],
            [model.real, `That’s the real length in cm. The model is ${fmt(model.ratio)} times smaller.`],
          ]
        : inMeters
          ? [
              [model.real, `That’s in cm. There are 100 cm in a meter.`],
              [size / model.ratio, `You divided. The real one is bigger: multiply by ${fmt(model.ratio)}.`],
            ]
          : [
              [model.real / 100, `That’s in meters. The question asks for cm.`],
              [size / model.ratio, `You divided. The real one is bigger: multiply by ${fmt(model.ratio)}.`],
            ],
      explain: toModel
        ? `${fmt(model.real / 100)} m = ${fmt(model.real)} cm, and ${fmt(model.real)} ÷ ${fmt(model.ratio)} = ${fmt(size)} cm.`
        : `${fmt(size)} × ${fmt(model.ratio)} = ${fmt(model.real)} cm${inMeters ? ` = ${fmt(model.real / 100)} m` : ""}.`,
      facts: { t: type, ratio: model.ratio, size, real: model.real, answer, inMeters, what: model.what },
    });
  }
  /* which scale with units is the same as a scale without them */
  const scale = pick(UNIT_SCALES.filter((s) => s.ratio <= 1000)),
    realNum = parseInt(scale.real),
    realUnit = scale.real.split(" ")[1],
    drawnUnit = scale.drawn.split(" ")[1],
    wrongUnit = { m: "cm", cm: "mm", ft: "in", yd: "ft" }[realUnit] || "mm";
  return mcP(
    [
      [`${scale.drawn} to ${scale.real}`, null],
      [
        `${scale.drawn} to ${fmt(scale.ratio)} ${realUnit}`,
        `${fmt(scale.ratio)} ${realUnit} is much more than ${fmt(scale.ratio)} ${drawnUnit}. 1 to ${fmt(scale.ratio)} uses the same unit on both sides.`,
      ],
      [
        `${scale.drawn} to ${realNum} ${wrongUnit}`,
        `${realNum} ${wrongUnit} isn’t ${fmt(scale.ratio)} ${drawnUnit}. Write both lengths in ${drawnUnit} to compare.`,
      ],
    ],
    {
      prompt: `Which scale is the same as <b>1 to ${fmt(scale.ratio)}</b>?`,
      stack: true,
      hint: `1 to ${fmt(scale.ratio)} means 1 of any unit stands for ${fmt(scale.ratio)} of the same unit. Change each choice to ${drawnUnit}.`,
      explain: `${scale.real} = ${fmt(scale.ratio)} ${drawnUnit}, so ${scale.drawn} to ${scale.real} is 1 to ${fmt(scale.ratio)}.`,
      facts: { t: type, ...scale },
    },
  );
}

const ZONES = [
  {
    id: "copies",
    name: "Copy or Not?",
    lessons: "Lesson 1",
    blurb: "Spot the scaled copy: every length multiplied by the same number, not stretched one way.",
    gen: genCopies,
  },
  {
    id: "factor",
    name: "Scale Factor",
    lessons: "Lessons 2 and 5",
    blurb: "Find the scale factor, match corresponding sides of a turned copy, and tell bigger from smaller.",
    gen: genFactor,
  },
  {
    id: "missing",
    name: "Copy Shop",
    lessons: "Lessons 3 and 4",
    blurb: "Find missing sides and angles in scaled copies, and the scale factor that goes back.",
    gen: genMissing,
  },
  {
    id: "area",
    name: "Area Scaler",
    lessons: "Lesson 6",
    blurb: "Scale the lengths by a factor and the area by the factor times itself.",
    gen: genArea,
  },
  {
    id: "map",
    name: "Map Room",
    lessons: "Lessons 7 and 8",
    blurb: "Use a scale to turn map and plan lengths into real distances, and back, and find a trip’s speed.",
    gen: genMap,
  },
  {
    id: "rescale",
    name: "Blueprint Desk",
    lessons: "Lessons 9 and 10",
    blurb: "Redraw at a new scale, and pick the scale that makes a bigger or smaller drawing.",
    gen: genRescale,
  },
  {
    id: "ratio",
    name: "Scale Ratios",
    lessons: "Lessons 11 and 12",
    blurb: "Write scales without units, like 1 to 100, and size models with them.",
    gen: genRatio,
  },
  {
    id: "boss",
    name: "Model Expo",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genCopies, genFactor, genMissing, genArea, genMap, genRescale, genRatio])(),
  },
];

const ICON = {
  copies:
    '<polygon points="8,46 20,46 20,34 8,34" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="28,56 56,56 56,28 28,28" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><path d="M40,14 l5,6 9,-12" fill="none" stroke="#5fe0a8" stroke-width="3.5"/>',
  factor:
    '<polygon points="6,54 6,38 14,54" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="24,54 24,14 44,54" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><text x="52" y="22" fill="#ffc93c" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">×2</text>',
  missing:
    '<polygon points="6,50 22,50 22,38 6,38" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="28,56 58,56 58,32 28,32" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="34" y="8" width="20" height="18" rx="4" fill="#ffc93c"/><text x="44" y="22" fill="#1a1300" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
  area: '<rect x="14" y="14" width="36" height="36" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="14" y="14" width="18" height="18" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2"/><path d="M32,14 V50 M14,32 H50" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 3"/>',
  map: '<rect x="6" y="8" width="52" height="40" rx="5" fill="rgba(95,224,168,.15)" stroke="#f3f6fb" stroke-width="2"/><path d="M14,40 L28,22 L48,30" fill="none" stroke="#ffc93c" stroke-width="3.5" stroke-linecap="round"/><circle cx="14" cy="40" r="3.5" fill="#f3f6fb"/><circle cx="48" cy="30" r="3.5" fill="#f3f6fb"/><rect x="8" y="52" width="16" height="5" fill="#f3f6fb"/><rect x="24" y="52" width="16" height="5" fill="none" stroke="#f3f6fb" stroke-width="1.5"/>',
  rescale:
    '<rect x="6" y="10" width="34" height="24" fill="rgba(127,227,255,.25)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="34" y="38" width="22" height="16" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5"/><path d="M42,16 Q56,20 50,32" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><path d="M45,30 l5,3 2,-6" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  ratio:
    '<text x="32" y="38" fill="#ffc93c" font-size="17" font-weight="800" text-anchor="middle" font-family="monospace">1:100</text><path d="M8,48 H56" stroke="#f3f6fb" stroke-width="2.5"/><path d="M8,44 V52 M56,44 V52" stroke="#f3f6fb" stroke-width="2.5"/>',
  boss: '<polygon points="32,6 40,24 58,24 44,36 50,56 32,44 14,56 20,36 6,24 24,24" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/>',
};
