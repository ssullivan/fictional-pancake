/* Cargo Port (Grade 5 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Boxes, unit cubes, and the icons' cubes come from shared/shapes.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
const KIDS = ["Mai", "Diego", "Lin", "Han", "Priya", "Kiran", "Elena", "Jada", "Noah", "Clare", "Andre", "Tyler"];
/* units of length for labelled boxes: the label, the word, and what each box in that unit is, one and more (realistic sizes) */
const UNITS = [
  { u: "cm", word: "centimeters", thing: "gift box", things: "gift boxes" },
  { u: "in", word: "inches", thing: "shoebox", things: "shoeboxes" },
  { u: "ft", word: "feet", thing: "crate", things: "crates" },
  { u: "m", word: "meters", thing: "storage container", things: "storage containers" },
];
/* the volume unit for a length unit: "cubic cm" */
const cubic = (u) => `cubic ${u}`;
/* the sum of a list of numbers */
const sum = (list) => list.reduce((a, b) => a + b, 0);
/* a list of numbers written as a sum: "3 + 2 + 1" */
const plus = (list) => list.join(" + ");

/* ---------- Cube Yard: volume as unit cubes (Lessons 1–2) ---------- */
/* Columns of cubes, 1 or 2 rows deep and 2 to 4 across, each 1 to 4 tall. A back column is never shorter than the one in front
   of it, so the top of every column shows. heights[z][x], row 0 in front. */
function columnHeights() {
  const rows = R(1, 2),
    cols = R(2, 4),
    front = range(cols).map(() => R(1, 3));
  return rows === 1 ? [front] : [front, front.map((tall) => Math.min(4, tall + R(0, 1)))];
}
/* a picture of columns of cubes, the back row cyan once a hint is shown */
const columnsFig = (heights, show) =>
  prismFig(
    heights.length === 2 && show
      ? [...columnsOf([[], heights[1]], "b"), ...columnsOf([heights[0]])]
      : columnsOf(heights),
    {
      label: `Columns of unit cubes. ${heights.map((row, z) => `${z ? "Back" : "Front"} row: ${row.join(", ")} tall`).join(". ")}.`,
    },
  );
/* a box l by h by w full of cubes; once a hint is shown, its layers bottom up in turns of gold and cyan */
const fullBoxFig = (l, h, w, show) =>
  prismFig(show ? layersOf(l, h, w, h).slice(1) : [prismBox(l, h, w, { grid: true })], {
    label: `A box of unit cubes, ${l} long, ${w} wide, and ${h} tall`,
  });
function genCount() {
  const variant = R(0, 3);
  if (variant === 0) {
    /* count the cubes in columns, row by row */
    let heights, answer;
    do {
      heights = columnHeights();
      answer = sum(heights.flat());
    } while (answer < 4);
    const rowSums = heights.map(sum),
      columns = heights.flat().length;
    return {
      kind: "num",
      unit: "cubic units",
      answer,
      facts: { t: "columns", heights },
      prompt:
        "This figure is built from unit cubes. Every cube sits on the table or on another cube. What is its volume?",
      fig: (show) => columnsFig(heights, show),
      misc: miscOf(answer, [
        ...(heights.length === 2
          ? [
              [
                rowSums[0],
                `That counts only the front row. There’s a row behind it too: ${plus(heights[1])} more cubes.`,
              ],
            ]
          : []),
        [columns, "That counts the tops of the columns. Count every cube in each column, all the way down."],
      ]).filter(([wrong]) => wrong !== answer),
      hint:
        heights.length === 2
          ? "Count the front row, column by column. Then count the back row the same way, and add."
          : "Count the cubes in each column, then add.",
      explain:
        heights.length === 2
          ? `Front row: ${plus(heights[0])} = ${rowSums[0]}. Back row: ${plus(heights[1])} = ${rowSums[1]}. ${rowSums[0]} + ${rowSums[1]} = ${answer} cubic units.`
          : `${plus(heights[0])} = ${answer} cubic units.`,
    };
  }
  if (variant === 1) {
    /* a box full of cubes, some hidden: count by layers */
    const l = R(2, 5),
      h = R(2, 4),
      w = R(2, 3),
      answer = l * h * w,
      layer = l * w,
      seen = answer - (l - 1) * (h - 1) * (w - 1);
    return {
      kind: "num",
      unit: "cubic units",
      answer,
      facts: { t: "box", l, h, w },
      prompt: "This box is packed full of unit cubes. What is its volume?",
      fig: (show) => fullBoxFig(l, h, w, show),
      misc: miscOf(answer, [
        [seen, `That counts only the cubes you can see. ${answer - seen} more are hidden inside and at the back.`],
        [layer, `That’s one layer: ${l} × ${w} = ${layer}. The box has ${h} layers.`],
        [l + h + w, "That adds the edges. Count the cubes: how many in one layer, and how many layers?"],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Count the bottom layer: ${l} cubes across and ${w} back. How many layers are there?`,
      explain: `Each layer has ${l} × ${w} = ${layer} cubes. ${h} layers: ${layer} × ${h} = ${answer} cubic units.`,
    };
  }
  if (variant === 2) {
    /* a box with some layers packed: how many more cubes fill it */
    const l = R(2, 5),
      w = R(2, 3),
      h = R(3, 4),
      packed = R(1, h - 1),
      layer = l * w,
      answer = layer * (h - packed);
    return {
      kind: "num",
      unit: "cubes",
      answer,
      facts: { t: "more", l, h, w, packed },
      prompt: `A box ${h} layers tall has some unit cubes packed in it. How many more cubes will fill the box?`,
      fig: () =>
        prismFig(layersOf(l, h, w, packed), {
          label: `A box ${h} cubes tall with ${packed} layers of ${layer} cubes in it`,
        }),
      misc: miscOf(answer, [
        [layer * h, `That’s how many fill the whole box. ${layer * packed} cubes are in it already.`],
        [layer * packed, "That’s how many are in the box already. How many more fit on top?"],
        [layer, `That’s one layer. ${h - packed} layers are still empty.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Each layer has ${l} × ${w} cubes. How many of the ${h} layers are still empty?`,
      explain: `Each layer has ${l} × ${w} = ${layer} cubes. ${h} − ${packed} = ${h - packed} layers are empty: ${layer} × ${h - packed} = ${answer} more cubes.`,
    };
  }
  /* which figure has a given volume: three figures with different volumes */
  let figs;
  do {
    figs = range(3).map(() => columnHeights());
  } while (new Set(figs.map((heights) => sum(heights.flat()))).size < 3);
  const volumes = figs.map((heights) => sum(heights.flat())),
    target = volumes[0],
    labels = figs.map((heights) => columnsFig(heights, false));
  return {
    ...mcOf(
      figs.map((heights, i) => [
        labels[i],
        i === 0 ? null : `That figure has ${volumes[i]} cubes, so its volume is ${volumes[i]} cubic units.`,
      ]),
    ),
    facts: { t: "whichFig", target, figs: figs.map((heights, i) => ({ heights, label: labels[i] })) },
    prompt: `Every cube sits on the table or on another cube. Which figure has a volume of ${target} cubic units?`,
    hint: "Count the cubes in each figure, column by column. Don’t forget the back row.",
    explain: `The right figure has ${plus(figs[0].flat())} = ${target} unit cubes. The others have ${volumes[1]} and ${volumes[2]}.`,
  };
}

/* ---------- Loading Dock: volume by layers (Lessons 3–4) ---------- */
/* the ways a box can be split into layers: the words for one layer and the edges it uses */
const LAYER_WAYS = {
  up: { words: "from bottom to top", across: "l", by: "w", count: "h" },
  back: { words: "from front to back", across: "l", by: "h", count: "w" },
  side: { words: "from left to right", across: "w", by: "h", count: "l" },
};
function genLayers() {
  const variant = R(0, 3),
    l = R(2, 6),
    h = R(2, 5),
    w = R(2, 4),
    edges = { l, h, w },
    answer = l * h * w;
  if (variant === 0) {
    /* one layer is in: how many cubes fill the whole box */
    const layer = l * w;
    return {
      kind: "num",
      unit: "cubes",
      answer,
      facts: { t: "box", l, h, w },
      prompt: `One layer of unit cubes covers the bottom of this box. The box holds ${h} layers. How many cubes fill the box?`,
      fig: (show) =>
        prismFig(layersOf(l, h, w, show ? h : 1), {
          label: `A box ${h} cubes tall with its bottom layer of ${layer} cubes`,
        }),
      misc: miscOf(answer, [
        [layer, `That’s one layer. The box holds ${h} of them.`],
        [layer + h, `That adds the layers. ${h} layers of ${layer} is ${h} × ${layer}.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Count the cubes in the bottom layer: ${l} across and ${w} back. Then think: ${h} layers like that.`,
      explain: `One layer is ${l} × ${w} = ${layer} cubes. ${h} layers: ${layer} × ${h} = ${answer} cubes.`,
    };
  }
  /* layers the other ways too: front to back, or left to right */
  const dir = pick(["up", "back", "side"]),
    way = LAYER_WAYS[dir],
    perLayer = edges[way.across] * edges[way.by],
    layers = edges[way.count],
    figure = (show) =>
      prismFig(show ? layersOf(l, h, w, layers, { dir }).slice(1) : [prismBox(l, h, w, { grid: true })], {
        label: `A box of unit cubes, ${l} long, ${w} wide, and ${h} tall`,
      });
  if (variant === 1) {
    /* how many cubes are in one layer */
    const front = l * h;
    return {
      kind: "num",
      unit: "cubes",
      answer: perLayer,
      facts: { t: "perLayer", l, h, w, dir },
      prompt: `This box is packed with unit cubes. Think of it in layers ${way.words}. How many cubes are in each layer?`,
      fig: figure,
      misc: miscOf(perLayer, [
        [
          edges[way.across] + edges[way.by],
          `That adds. A layer is ${edges[way.across]} rows of ${edges[way.by]}: multiply.`,
        ],
        ...(dir !== "back" ? [[front, `That counts the front of the box. Layers ${way.words} look different.`]] : []),
        [answer, "That’s every cube in the box. How many are in just one layer?"],
      ]).filter(([wrong]) => wrong !== perLayer),
      hint: `One layer ${way.words} is ${edges[way.across]} cubes by ${edges[way.by]} cubes.`,
      explain: `Each layer ${way.words} is ${edges[way.across]} × ${edges[way.by]} = ${perLayer} cubes.`,
    };
  }
  if (variant === 2) {
    /* the layers are given: find the volume */
    return {
      kind: "num",
      unit: "cubic units",
      answer,
      facts: { t: "layers", perLayer, layers },
      prompt: `A box is packed in layers ${way.words}. Each layer has ${perLayer} unit cubes, and there are ${layers} layers. What is the volume of the box?`,
      fig: figure,
      misc: miscOf(answer, [
        [perLayer + layers, `That adds. ${layers} layers of ${perLayer}: multiply.`],
        [perLayer, `That’s one layer. There are ${layers}.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `${layers} layers, each with ${perLayer} cubes.`,
      explain: `${perLayer} × ${layers} = ${answer} cubic units.`,
    };
  }
  /* which expression counts the cubes, by layers */
  return {
    ...mcOf([
      [`${perLayer} × ${layers}`, null],
      [`${perLayer} + ${layers}`, `That adds. There are ${layers} layers of ${perLayer} cubes: multiply.`],
      [`${l} + ${h} + ${w}`, "That adds the edges. Count the cubes in a layer, then multiply by the number of layers."],
    ]),
    facts: { t: "layerExpr", l, h, w, perLayer, layers },
    prompt: `Think of this box of unit cubes in layers ${way.words}. Which expression gives its volume?`,
    fig: figure,
    hint: `How many cubes are in one layer ${way.words}? How many layers are there?`,
    explain: `Each layer ${way.words} has ${edges[way.across]} × ${edges[way.by]} = ${perLayer} cubes, and there are ${layers} layers: ${perLayer} × ${layers} = ${answer}.`,
  };
}

/* ---------- Measuring Shed: length × width × height, base × height, and cubic units (Lessons 5–7) ---------- */
/* edges l, w, h for a labelled box: l 2–10, w 2–6, h 2–8, with a base of at most 40 square units and a volume of at most 400 */
function boxEdges() {
  let l, w, h;
  do {
    l = R(2, 10);
    w = R(2, 6);
    h = R(2, 8);
  } while (l * w > 40 || l * w * h > 400 || l === w);
  return [l, w, h];
}
/* a box with its edges labelled in unit u */
const labelledFig = (l, h, w, u, thing) =>
  prismFig([prismBox(l, h, w, { lab: { l: `${l} ${u}`, h: `${h} ${u}`, w: `${w} ${u}` } })], {
    label: `A ${thing} ${l} ${u} long, ${w} ${u} wide, and ${h} ${u} tall`,
  });
/* things to measure and the best unit for their volume */
const VOLUME_THINGS = [
  ["a juice box", "small"],
  ["a jewelry box", "small"],
  ["a pencil case", "small"],
  ["a cereal box", "small"],
  ["a classroom", "big"],
  ["a moving truck", "big"],
  ["a swimming pool", "big"],
  ["a school bus", "big"],
];
function genEdges() {
  const variant = R(0, 3),
    { u, word, thing } = pick(UNITS),
    [l, w, h] = boxEdges(),
    answer = l * w * h,
    base = l * w;
  if (variant === 0) {
    /* the volume of a box from its edge lengths */
    return {
      kind: "num",
      unit: cubic(u),
      answer,
      facts: { t: "box", l, h, w, u },
      prompt: `What is the volume of this ${thing}?`,
      fig: () => labelledFig(l, h, w, u, thing),
      misc: miscOf(answer, [
        [l + w + h, `That adds the edges. Volume is length × width × height: ${l} × ${w} × ${h}.`],
        [base, `That’s the area of the base, ${l} × ${w}. Multiply by the height, ${h}, too.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Multiply length × width × height. ${l} × ${w} is the bottom layer of cubes.`,
      explain: `${l} × ${w} = ${base} cubes in a layer, and ${h} layers: ${base} × ${h} = ${answer} ${cubic(u)}.`,
    };
  }
  if (variant === 1) {
    /* base area × height */
    return {
      kind: "num",
      unit: cubic(u),
      answer,
      facts: { t: "baseHeight", base, h, u },
      prompt: `The base of a ${thing} has an area of ${base} square ${word}. The ${thing} is ${h} ${word} tall. What is its volume?`,
      misc: miscOf(answer, [
        [base + h, `That adds. The base is one layer of ${base} cubes, and there are ${h} layers: multiply.`],
        [base, `That’s the base. It’s one layer; the ${thing} is ${h} layers tall.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `The base holds one layer of ${base} cubes. How many layers tall is it?`,
      explain: `Volume = base × height: ${base} × ${h} = ${answer} ${cubic(u)}.`,
    };
  }
  if (variant === 2) {
    /* which unit to measure something's volume in */
    const [what, size] = pick(VOLUME_THINGS),
      right = size === "small" ? "cubic centimeters" : "cubic meters",
      other = size === "small" ? "cubic meters" : "cubic centimeters",
      area = size === "small" ? "square centimeters" : "square meters";
    return {
      ...mcOf([
        [right, null],
        [
          other,
          size === "small"
            ? `A cubic meter is about as big as a washing machine. ${what[0].toUpperCase() + what.slice(1)} is much smaller.`
            : `A cubic centimeter is about as big as a sugar cube. You’d need millions to fill ${what}.`,
        ],
        [area, "Square units measure area, the space on a flat surface. Volume needs cubic units."],
      ]),
      facts: { t: "unit", what, size },
      prompt: `Which unit would you use to measure the volume of ${what}?`,
      hint: "Volume is measured in cubes. Is a centimeter cube or a meter cube a better size?",
      explain: `${what[0].toUpperCase() + what.slice(1)} is ${size === "small" ? "small" : "big"}, so measure it in ${right}: ${size === "small" ? "cubes about as big as a sugar cube" : "cubes about as big as a washing machine"}.`,
    };
  }
  /* which expression gives the volume */
  return {
    ...mcOf([
      [`(${l} × ${w}) × ${h}`, null],
      [`(${l} + ${w}) × ${h}`, `That adds the length and width. The base is ${l} × ${w}.`],
      [`${l} × ${w} + ${h}`, `That adds the height. There are ${h} layers of ${l} × ${w}: multiply.`],
    ]),
    facts: { t: "expr", l, h, w },
    prompt: `Which expression gives the volume of this ${thing}?`,
    fig: () => labelledFig(l, h, w, u, thing),
    hint: "The base is length × width. Multiply it by the height.",
    explain: `Base: ${l} × ${w} = ${base} square ${word}. Times the height: ${base} × ${h} = ${answer} ${cubic(u)}.`,
  };
}

/* ---------- Stacking Yard: figures made of two prisms (Lessons 8–10) ---------- */
/* Two boxes w deep, side by side (a tall box on the left, a lower one on the right) or stacked (a shorter box on the left of the
   top of a long one). Returns {boxes, parts: [[l, h, w], [l, h, w]], outer: [l, h, w]} with every edge a student needs labelled. */
function twoPrisms(u, stacked) {
  const w = R(2, 4);
  if (stacked) {
    const longL = R(4, 6),
      lowH = R(1, 3),
      topL = R(2, longL - 2),
      topH = R(2, 3);
    return {
      boxes: [
        prismBox(longL, lowH, w, { lab: { l: `${longL} ${u}`, w: `${w} ${u}`, hr: `${lowH} ${u}` } }),
        prismBox(topL, topH, w, { at: [0, lowH, 0], cls: "b", lab: { lt: `${topL} ${u}`, h: `${topH} ${u}` } }),
      ],
      parts: [
        [longL, lowH, w],
        [topL, topH, w],
      ],
      outer: [longL, lowH + topH, w],
    };
  }
  const leftL = R(2, 4),
    leftH = R(3, 6),
    rightL = R(2, 5),
    rightH = R(1, leftH - 1);
  return {
    boxes: [
      prismBox(leftL, leftH, w, { lab: { l: `${leftL} ${u}`, h: `${leftH} ${u}` } }),
      prismBox(rightL, rightH, w, {
        at: [leftL, 0, 0],
        cls: "b",
        lab: { l: `${rightL} ${u}`, w: `${w} ${u}`, hr: `${rightH} ${u}` },
      }),
    ],
    parts: [
      [leftL, leftH, w],
      [rightL, rightH, w],
    ],
    outer: [leftL + rightL, leftH, w],
  };
}
/* l × h × w written in the order length × width × height */
const volText = ([l, h, w]) => `${l} × ${w} × ${h}`;
const vol = ([l, h, w]) => l * h * w;
function genCombo() {
  const variant = R(0, 2),
    { u, word } = pick(UNITS.slice(0, 3)),
    stacked = R(0, 1) === 1,
    { boxes, parts, outer } = twoPrisms(u, stacked),
    [first, second] = parts.map(vol),
    answer = first + second;
  const figure = () =>
    prismFig(boxes, {
      label: `A figure made of two boxes: ${parts.map(([l, h, w]) => `${l} by ${w} by ${h} ${word}`).join(" and ")}`,
    });
  if (variant <= 1) {
    /* the volume of the whole figure */
    return {
      kind: "num",
      unit: cubic(u),
      answer,
      facts: { t: "combo", parts, outer, u },
      prompt: `This figure is made of two boxes, gold and blue. What is its volume?`,
      fig: figure,
      misc: miscOf(answer, [
        [vol(outer), `That fills in the empty corner too. Find each box’s volume, then add.`],
        [first, "That’s only the gold box. Add the blue box’s volume."],
        [second, "That’s only the blue box. Add the gold box’s volume."],
      ]).filter(([wrong]) => wrong !== answer),
      hint: "Find the volume of the gold box and of the blue box, then add them.",
      explain: `Gold: ${volText(parts[0])} = ${first}. Blue: ${volText(parts[1])} = ${second}. ${first} + ${second} = ${answer} ${cubic(u)}.`,
    };
  }
  /* which expression gives the figure's volume */
  return {
    ...mcOf([
      [`(${volText(parts[0])}) + (${volText(parts[1])})`, null],
      [`${volText(outer)}`, "That’s a box around the whole figure. It counts the empty corner too."],
      [
        `(${volText(parts[0])}) × (${volText(parts[1])})`,
        "That multiplies the two volumes. Put the two boxes together: add.",
      ],
    ]),
    facts: { t: "comboExpr", parts, outer },
    prompt: "This figure is made of two boxes, gold and blue. Which expression gives its volume?",
    fig: figure,
    hint: "Find each box’s volume. How do you put them together?",
    explain: `Gold: ${volText(parts[0])} = ${first}. Blue: ${volText(parts[1])} = ${second}. Add: ${first} + ${second} = ${answer} ${cubic(u)}.`,
  };
}

/* ---------- Harbor Office: problems about volume (Lesson 11) ---------- */
function genSolve() {
  const variant = R(0, 3),
    { u, word, thing, things } = pick(UNITS),
    name = pick(KIDS);
  if (variant === 0) {
    /* a missing edge from the volume and the base */
    let l, w, h;
    /* a base that minus the volume leaves the height would make that mistake right */
    do [l, w, h] = boxEdges();
    while (l * w * h - l * w === h);
    const volume = l * w * h,
      base = l * w;
    return {
      kind: "num",
      unit: word,
      answer: h,
      facts: { t: "height", volume, l, w },
      prompt: `A ${thing} has a volume of ${volume} ${cubic(u)}. Its base is ${l} ${u} by ${w} ${u}. How tall is it?`,
      misc: miscOf(h, [
        [
          volume - base,
          `That subtracts the base. The base is one layer of ${base} cubes: how many layers make ${volume}?`,
        ],
        ...(volume % l === 0 && volume / l !== h
          ? [[volume / l, `That divides by the length only. Divide by the whole base, ${l} × ${w} = ${base}.`]]
          : []),
        [base, "That’s the area of the base. Divide the volume by it to find the height."],
      ]).filter(([wrong]) => wrong !== h),
      hint: `The base holds ${l} × ${w} = ${base} cubes in a layer. How many layers make ${volume}?`,
      explain: `${base} × ? = ${volume}. ${volume} ÷ ${base} = ${h}, so it’s ${h} ${word} tall.`,
    };
  }
  if (variant === 1) {
    /* how much more one box holds than another */
    let first, second;
    do {
      first = boxEdges();
      second = boxEdges();
    } while (vol(first) === vol(second) || Math.abs(vol(first) - vol(second)) > 200);
    const [big, small] = vol(first) > vol(second) ? [first, second] : [second, first],
      answer = vol(big) - vol(small),
      sizes = [first, second].map(([l, w, h]) => `${l} ${u} by ${w} ${u} by ${h} ${u}`);
    return {
      kind: "num",
      unit: cubic(u),
      answer,
      facts: { t: "compare", first, second },
      prompt: `${name} has two ${things}: one is ${sizes[0]}, and the other is ${sizes[1]}. How much more does the bigger one hold?`,
      misc: miscOf(answer, [
        [vol(big) + vol(small), "That adds the volumes. How much more: subtract."],
        [vol(big), "That’s the bigger one’s volume. Subtract the smaller one’s."],
      ]).filter(([wrong]) => wrong !== answer),
      hint: "Find each volume: length × width × height. Then subtract.",
      explain: `${big.join(" × ")} = ${vol(big)}. ${small.join(" × ")} = ${vol(small)}. ${vol(big)} − ${vol(small)} = ${answer} ${cubic(u)}.`,
    };
  }
  if (variant === 2) {
    /* the volume of several boxes the same size */
    let l, w, h, count;
    do {
      [l, w, h] = boxEdges();
      count = R(2, 5);
    } while (l * w * h > 100 || l * w * h * count > 400);
    const one = l * w * h,
      answer = one * count;
    return {
      kind: "num",
      unit: cubic(u),
      answer,
      facts: { t: "several", l, w, h, count },
      prompt: `${name} stacks ${count} ${things} on the dock. Each is ${l} ${u} long, ${w} ${u} wide, and ${h} ${u} tall. What is their total volume?`,
      misc: miscOf(answer, [
        [one, `That’s one ${thing}. There are ${count}.`],
        [one + count, `That adds ${count}. ${count} ${things} of ${one} ${cubic(u)} each: multiply.`],
      ]).filter(([wrong]) => wrong !== answer),
      hint: `Find the volume of one ${thing}, then think about ${count} of them.`,
      explain: `One: ${l} × ${w} × ${h} = ${one} ${cubic(u)}. ${count} of them: ${one} × ${count} = ${answer} ${cubic(u)}.`,
    };
  }
  /* the area of the base from the volume and the height */
  let l, w, h;
  /* a volume that minus the height leaves the base would make that mistake right */
  do [l, w, h] = boxEdges();
  while (l * w * h - h === l * w);
  const volume = l * w * h,
    base = l * w;
  return {
    kind: "num",
    unit: `square ${u}`,
    answer: base,
    facts: { t: "base", volume, h },
    prompt: `A ${thing} has a volume of ${volume} ${cubic(u)} and is ${h} ${u} tall. What is the area of its base?`,
    misc: miscOf(base, [
      [volume - h, `That subtracts the height. The ${thing} is ${h} layers of the base: divide.`],
      [volume * h, "That multiplies. Volume = base × height, so the base is the volume ÷ the height."],
    ]).filter(([wrong]) => wrong !== base),
    hint: `${h} layers, each the size of the base, make ${volume}. What’s one layer?`,
    explain: `base × ${h} = ${volume}. ${volume} ÷ ${h} = ${base} square ${word}.`,
  };
}

/* ---------- Full Load: the final round ---------- */
const genBoss = () => pick([genCount, genLayers, genEdges, genCombo, genSolve])();

const ZONES = [
  {
    id: "count",
    name: "Cube Yard",
    lessons: "Lessons 1–2",
    blurb: "Count the unit cubes in a figure, even the ones you can’t see.",
    gen: genCount,
  },
  {
    id: "layers",
    name: "Loading Dock",
    lessons: "Lessons 3–4",
    blurb: "Count a box’s cubes by layers: bottom to top, front to back, or side to side.",
    gen: genLayers,
  },
  {
    id: "edges",
    name: "Measuring Shed",
    lessons: "Lessons 5–7",
    blurb: "Multiply length × width × height, or base × height, in cubic units.",
    gen: genEdges,
  },
  {
    id: "combo",
    name: "Stacking Yard",
    lessons: "Lessons 8–10",
    blurb: "Find the volume of a figure made of two boxes.",
    gen: genCombo,
  },
  {
    id: "solve",
    name: "Harbor Office",
    lessons: "Lesson 11",
    blurb: "Solve problems: missing edges, bigger boxes, and many boxes at once.",
    gen: genSolve,
  },
  {
    id: "boss",
    name: "Full Load",
    lessons: "All lessons",
    blurb: "Load the cargo ship! Every right answer stacks a container on deck.",
    gen: genBoss,
  },
];

/* the cargo ship with `loaded` of its 10 containers on deck, in two rows of 5 (the boss icon loads all of them) */
const ship = (loaded) =>
  '<path d="M4,40H60L52,56H12Z" fill="#c9584b" stroke="#0a2340" stroke-width="1.5"/><path d="M46,40V30H54V40" fill="#e8eef6" stroke="#0a2340" stroke-width="1.5"/>' +
  range(10)
    .map(
      (i) =>
        `<rect x="${7 + (i % 5) * 7.5}" y="${i < 5 ? 33 : 26}" width="7" height="7" fill="${i < loaded ? ["#ffc93c", "#7fe3ff", "#5fe0a8"][i % 3] : "rgba(10,35,64,.5)"}" stroke="#0a2340" stroke-width="1"/>`,
    )
    .join("") +
  '<path d="M2,58Q10,54 18,58T34,58T50,58T62,58" fill="none" stroke="#7fe3ff" stroke-width="2"/>';
const ICON = {
  count: iconCube(10, 56, 16) + iconCube(26, 56, 16) + iconCube(10, 40, 16) + iconCube(42, 56, 16),
  layers:
    iconCube(8, 58, 14, "#7fe3ff") +
    iconCube(22, 58, 14, "#7fe3ff") +
    iconCube(36, 58, 14, "#7fe3ff") +
    iconCube(8, 44, 14) +
    iconCube(22, 44, 14) +
    iconCube(36, 44, 14),
  edges:
    iconCube(14, 50, 28) +
    '<g fill="#f3f6fb" font-size="9" font-weight="700" text-anchor="middle" font-family="monospace"><text x="28" y="61">4</text><text x="8" y="38">3</text><text x="56" y="50">2</text></g>',
  combo: iconCube(8, 56, 16) + iconCube(8, 40, 16) + iconCube(24, 56, 16, "#7fe3ff") + iconCube(40, 56, 16, "#7fe3ff"),
  solve:
    '<rect x="10" y="8" width="44" height="50" rx="4" fill="#e8eef6" stroke="#0a2340" stroke-width="1.5"/><path d="M18,20H46M18,30H46M18,40H38" stroke="#3d5a80" stroke-width="3"/><text x="40" y="54" fill="#c9584b" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">? ft</text>',
  boss: ship(10),
};
