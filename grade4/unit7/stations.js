/* Angle Arcade (Grade 4 Unit 7): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Points, lines, rays, segments, angles, and protractors come from shared/angles.js; clocks from shared/measure.js; angleKind
   and splitFig from figs.js; mcOf and miscOf from shared/util.js.
   Each generator deals one of a few kinds of problem (variant), each with a comment saying what it asks. Every problem also
   carries facts for checks.js: its kind (t) and the numbers it was made from, so the answer can be worked out again. */
/* pairs of letters to name figures with */
const LETTERS = [
  ["A", "B"],
  ["C", "D"],
  ["P", "Q"],
  ["M", "N"],
  ["R", "S"],
  ["X", "Y"],
];
const KIND_NAMES = { segment: "Segment", ray: "Ray", line: "Line" };

/* ---------- Shape Spotter: points, lines, rays, and segments (Lessons 1–2) ---------- */
function genFigures() {
  const variant = R(0, 2),
    names = pick(LETTERS),
    tilt = R(-4, 4) * 10;
  if (variant === 0) {
    /* pick the picture of a kind of figure */
    const kind = pick(["segment", "ray", "line"]),
      why = {
        segment: "That stops at both points: it’s a segment.",
        ray: "That starts at one point and goes on forever one way: it’s a ray.",
        line: "That goes on forever both ways: it’s a line.",
      };
    return {
      ...mcOf(["segment", "ray", "line"].map((k) => [geoFig(k, { names, tilt }), k === kind ? null : why[k]])),
      facts: { t: "pickKind", kind },
      prompt: `Which one is a ${kind}?`,
      hint: `Look at the ends: arrows mean it goes on forever. A ${kind} has ${kind === "segment" ? "no arrows" : kind === "ray" ? "an arrow at one end" : "arrows at both ends"}.`,
      explain: `A ${kind} ${kind === "segment" ? "stops at both endpoints" : kind === "ray" ? "has one endpoint and goes on forever in one direction" : "goes on forever in both directions"}.`,
    };
  }
  if (variant === 1) {
    /* name the figure drawn */
    const kind = pick(["segment", "ray", "line"]),
      [a, b] = names,
      label = (k) => `${KIND_NAMES[k]} ${a}${b}`;
    return {
      ...mcOf(
        ["segment", "ray", "line"].map((k) => [
          label(k),
          k === kind
            ? null
            : `A ${k} ${k === "segment" ? "stops at both ends" : k === "ray" ? "has an arrow at one end" : "has arrows at both ends"}. Look at the ends of this one.`,
        ]),
      ),
      facts: { t: "nameKind", kind },
      prompt: `What is this figure called?`,
      fig: () => geoFig(kind, { names, tilt }),
      hint: `Count the arrows: none, one, or two?`,
      explain: `It has ${kind === "segment" ? "no arrows: segment" : kind === "ray" ? `one arrow, starting at ${a}: ray` : "two arrows: line"} ${a}${b}.`,
    };
  }
  /* which point a ray starts at, from its name */
  const [a, b] = names,
    flipped = Math.random() < 0.5,
    [start, through] = flipped ? [b, a] : [a, b];
  return {
    ...mcOf([
      [`Point ${start}`, null],
      [
        `Point ${through}`,
        `Ray ${start}${through} goes through ${through}. Its name starts with its endpoint: ${start}.`,
      ],
      ["It has no endpoint", "A line has no endpoint. A ray has one, where it starts."],
    ]),
    facts: { t: "rayStart", start },
    prompt: `Ray ${start}${through} starts at which point?`,
    fig: (show) =>
      show
        ? geoFig("ray", { names: [start, through], tilt })
        : geoFig("line", { names: [start, through], tilt, label: `A line through ${start} and ${through}` }),
    hint: `A ray’s name starts with its endpoint.`,
    explain: `Ray ${start}${through} starts at ${start} and goes through ${through}, on forever past it.`,
  };
}

/* ---------- Light Beams: parallel and perpendicular lines (Lessons 3–4) ---------- */
function genLines() {
  const variant = R(0, 1),
    slant = pick([30, 40, 50, 60, 120, 135, 150]);
  if (variant === 0) {
    /* pick the pair that's parallel, or perpendicular */
    const want = pick(["parallel", "perpendicular"]),
      pairs = { parallel: 0, perpendicular: 90, crossing: slant },
      why = {
        parallel: "These lines never meet: they’re parallel.",
        perpendicular: "These lines meet at a right angle: they’re perpendicular.",
        crossing: `These lines cross, but at ${slant > 90 ? 180 - slant : slant}°, not a right angle.`,
      };
    return {
      ...mcOf(Object.entries(pairs).map(([kind, cross]) => [linesFig(cross), kind === want ? null : why[kind]])),
      facts: { t: "pickLines", want },
      prompt: `Which pair of lines is ${want}?`,
      hint:
        want === "parallel"
          ? `Parallel lines never meet.`
          : `Perpendicular lines meet at a right angle, like the corner of a page.`,
      explain:
        want === "parallel"
          ? `Parallel lines go the same way and never meet.`
          : `Perpendicular lines cross at a right angle, 90°.`,
    };
  }
  /* name how a pair of lines meets */
  const kind = pick(["parallel", "perpendicular", "crossing"]),
    cross = { parallel: 0, perpendicular: 90, crossing: slant }[kind],
    names = { parallel: "Parallel", perpendicular: "Perpendicular", crossing: "Crossing, but not perpendicular" };
  return {
    ...mcOf(
      Object.keys(names).map((k) => [
        names[k],
        k === kind
          ? null
          : k === "parallel"
            ? "These lines meet. Parallel lines never do."
            : k === "perpendicular"
              ? kind === "parallel"
                ? "These lines never meet, so they can’t meet at a right angle."
                : `They cross at ${cross > 90 ? 180 - cross : cross}°. Perpendicular takes exactly 90°.`
              : kind === "parallel"
                ? "These lines never cross."
                : "They cross at a right angle: there’s a name for that.",
      ]),
    ),
    facts: { t: "nameLines", kind },
    prompt: `How do these two lines meet?`,
    fig: () => linesFig(cross),
    hint: `Do they meet? If they do, is it at a right angle?`,
    explain: {
      parallel: "They never meet: parallel.",
      perpendicular: "They meet at a right angle: perpendicular.",
      crossing: `They cross at ${cross > 90 ? 180 - cross : cross}°: they intersect, but they aren’t perpendicular.`,
    }[kind],
  };
}

/* ---------- Clock Tower: angles as turns (Lessons 5–7) ---------- */
function genTurns() {
  const variant = R(0, 2);
  if (variant === 0) {
    /* how far the minute hand turns in some minutes */
    const minutes = 5 * R(1, 11),
      deg = 6 * minutes;
    return {
      kind: "num",
      unit: "degrees",
      answer: deg,
      facts: { t: "minutesToDegrees", minutes },
      prompt: `The minute hand turns for ${minutes} minutes. How many degrees does it turn?`,
      fig: (show) =>
        clockFig(12, minutes, {
          r: 80,
          shade: show ? [0, minutes] : null,
          label: `A clock showing ${minutes} minutes past`,
        }),
      misc: miscOf(deg, [
        [minutes, `That’s the minutes. Each minute turns the hand 6°.`],
        [10 * minutes, `That uses 10° a minute. A full turn is 360° in 60 minutes: 6° a minute.`],
      ]),
      hint: `A full turn is 360° in 60 minutes, so each minute is 6°.`,
      explain: `${minutes} × 6 = ${deg}°.`,
    };
  }
  if (variant === 1) {
    /* how many minutes a turn takes */
    const minutes = pick([10, 15, 20, 30, 40, 45, 50]),
      deg = 6 * minutes;
    return {
      kind: "num",
      unit: "minutes",
      answer: minutes,
      facts: { t: "degreesToMinutes", deg },
      prompt: `The minute hand turns ${deg}°. How many minutes went by?`,
      fig: (show) => clockFig(12, show ? minutes : 0, { r: 80, shade: show ? [0, minutes] : null, label: "A clock" }),
      misc: miscOf(minutes, [
        [deg, `That’s the degrees. Each minute is 6°: ${deg} ÷ 6.`],
        [deg / 10, `That uses 10° a minute. Each minute is 6°.`],
      ]).filter(([wrong]) => wrong !== minutes),
      hint: `Each minute turns the hand 6°. How many 6s make ${deg}?`,
      explain: `${deg} ÷ 6 = ${minutes} minutes.`,
    };
  }
  /* compare an angle with a right angle */
  const deg = pick([20, 30, 45, 60, 70, 80, 100, 110, 120, 135, 150, 160, 90]),
    answer = deg < 90 ? "Less than a right angle" : deg === 90 ? "A right angle" : "More than a right angle",
    turn = R(0, 5) * 15;
  return {
    ...mcOf(
      ["Less than a right angle", "A right angle", "More than a right angle"].map((label) => [
        label,
        label === answer
          ? null
          : deg === 90
            ? "It has the square mark: it’s exactly a right angle."
            : `Compare it with the corner of a page. It opens ${deg < 90 ? "less" : "more"} than that.`,
      ]),
    ),
    facts: { t: "vsRight", deg },
    prompt: `How does this angle compare with a right angle?`,
    fig: () => angleFig(deg, { turn, label: "An angle" }),
    hint: `A right angle is a quarter turn, like the corner of a page.`,
    explain: `This angle is ${deg}°: ${answer.toLowerCase()}.`,
  };
}

/* ---------- Protractor Panel: measure angles (Lessons 8–10) ---------- */
function genProtractor() {
  const deg = 5 * R(2, 34),
    base = Math.random() < 0.5 ? "right" : "left";
  return {
    kind: "num",
    unit: "degrees",
    answer: deg,
    facts: { t: "read", deg },
    prompt: `What does the angle measure? Its first ray points ${base}.`,
    fig: () => protractor(deg, { base, label: `A protractor with an angle whose first ray points ${base}` }),
    misc: miscOf(deg, [
      [
        180 - deg,
        `That’s the other scale. The first ray points ${base}: read the scale that starts at 0 on the ${base}.`,
      ],
    ]).filter(([wrong]) => wrong !== deg),
    hint: `The first ray points ${base}. Find the scale with 0 on the ${base}: the ${base === "right" ? "inner, white" : "outer, pink"} one.`,
    explain: `The ${base === "right" ? "inner" : "outer"} scale starts at 0 on the first ray. The blue ray crosses it at ${deg}°, so the angle is ${deg < 90 ? "acute" : deg === 90 ? "right" : "obtuse"}: ${deg}°.`,
  };
}

/* ---------- Angle Sorter: kinds of angles (Lessons 11–12) ---------- */
const KINDS = ["Acute", "Right", "Obtuse", "Straight"];
/* what each kind of angle is */
const KIND_RULE = {
  Acute: "Acute angles are less than 90°.",
  Right: "A right angle is exactly 90°.",
  Obtuse: "Obtuse angles are between 90° and 180°.",
  Straight: "A straight angle is exactly 180°.",
};
function genKinds() {
  const variant = R(0, 1),
    deg = pick([15, 25, 35, 45, 55, 65, 75, 85, 90, 95, 105, 115, 125, 135, 145, 155, 165, 175, 180]),
    kind = angleKind(deg)[0].toUpperCase() + angleKind(deg).slice(1),
    choices = shuffle(KINDS.filter((k) => k !== kind))
      .slice(0, 2)
      .concat(kind);
  return {
    ...mcOf(choices.map((k) => [k, k === kind ? null : `${KIND_RULE[k]} This one is ${deg}°.`])),
    facts: { t: "kind", deg },
    prompt:
      variant === 0
        ? `An angle measures ${deg}°. What kind of angle is it?`
        : `What kind of angle is this? It measures ${deg}°.`,
    fig:
      variant === 1
        ? () => angleFig(deg, { turn: R(0, 3) * 20, text: `${deg}°`, label: `An angle of ${deg} degrees` })
        : undefined,
    hint: `Compare ${deg}° with 90° and 180°.`,
    explain: `${deg}°: ${KIND_RULE[kind]}`,
  };
}

/* ---------- Missing Angle: unknown angles (Lessons 13–15) ---------- */
const WHOLE_NAMES = { 90: "a right angle", 180: "a straight angle", 360: "a full turn" };
function genUnknown() {
  const variant = R(0, 1),
    total = pick([90, 180, 180, 360]);
  if (variant === 0) {
    /* two angles that make a whole */
    const known = 5 * R(2, total / 5 - 2),
      missing = total - known;
    return {
      kind: "num",
      unit: "degrees",
      answer: missing,
      facts: { t: "unknown", total, known: [known] },
      prompt: `Two angles make ${WHOLE_NAMES[total]}. One is ${known}°. How big is the other?`,
      fig: () =>
        splitFig(
          [known, missing],
          [`${known}°`, "?"],
          `${WHOLE_NAMES[total]} split into ${known} degrees and an unknown angle`,
        ),
      misc: miscOf(missing, [
        ...Object.keys(WHOLE_NAMES)
          .map(Number)
          .filter((w) => w !== total && w > known)
          .map((w) => [
            w - known,
            `That subtracts from ${w}. ${WHOLE_NAMES[total][0].toUpperCase() + WHOLE_NAMES[total].slice(1)} is ${total}°.`,
          ]),
        [total + known, `That adds. Together they make ${total}°: subtract.`],
      ]).filter(([wrong]) => wrong !== missing),
      hint: `${WHOLE_NAMES[total][0].toUpperCase() + WHOLE_NAMES[total].slice(1)} is ${total}°. Subtract the angle you know.`,
      explain: `${total} − ${known} = ${missing}°.`,
    };
  }
  /* three angles that make a whole, two known */
  let a, b;
  do {
    a = 5 * R(2, total / 10);
    b = 5 * R(2, total / 10);
  } while (total - a - b < 10);
  const missing = total - a - b;
  return {
    kind: "num",
    unit: "degrees",
    answer: missing,
    facts: { t: "unknown", total, known: [a, b] },
    prompt: `Three angles make ${WHOLE_NAMES[total]}. Two of them are ${a}° and ${b}°. How big is the third?`,
    fig: () =>
      splitFig([a, b, missing], [`${a}°`, `${b}°`, "?"], `${WHOLE_NAMES[total]} split into three angles, one unknown`),
    misc: miscOf(missing, [
      [a + b, `That adds the two you know. Subtract that from ${total}.`],
      [total - a, `That takes away only ${a}°. Take away both: ${a} + ${b} = ${a + b}.`],
    ]).filter(([wrong]) => wrong !== missing),
    hint: `Add the angles you know, then subtract from ${total}°.`,
    explain: `${a} + ${b} = ${a + b}, and ${total} − ${a + b} = ${missing}°.`,
  };
}

/* ---------- High Score: the final round ---------- */
const genBoss = () => pick([genFigures, genLines, genTurns, genProtractor, genKinds, genUnknown])();

const ZONES = [
  {
    id: "figures",
    name: "Shape Spotter",
    lessons: "Lessons 1–2",
    blurb: "Spot lines, rays, and segments, and name them with letters.",
    gen: genFigures,
  },
  {
    id: "lines",
    name: "Light Beams",
    lessons: "Lessons 3–4",
    blurb: "Find parallel and perpendicular lines.",
    gen: genLines,
  },
  {
    id: "turns",
    name: "Clock Tower",
    lessons: "Lessons 5–7",
    blurb: "Turn a clock’s minute hand, and compare angles with a right angle.",
    gen: genTurns,
  },
  {
    id: "protractor",
    name: "Protractor Panel",
    lessons: "Lessons 8–10",
    blurb: "Read angles on the right scale of a protractor.",
    gen: genProtractor,
  },
  {
    id: "kinds",
    name: "Angle Sorter",
    lessons: "Lessons 11–12",
    blurb: "Sort angles into acute, right, obtuse, and straight.",
    gen: genKinds,
  },
  {
    id: "unknown",
    name: "Missing Angle",
    lessons: "Lessons 13–15",
    blurb: "Find an unknown angle in a right angle, a straight angle, or a full turn.",
    gen: genUnknown,
  },
  {
    id: "boss",
    name: "High Score",
    lessons: "All lessons",
    blurb: "Beat the high score! Every right answer lights one of 10 lights on the scoreboard.",
    gen: genBoss,
  },
];

/* the scoreboard: 10 lights in two rows, `lit` of them on (the boss icon lights all of them) */
const scoreboard = (lit) =>
  '<rect x="4" y="12" width="56" height="40" rx="5" fill="#2a1f4d" stroke="#ff8ac4" stroke-width="2"/>' +
  range(10)
    .map(
      (i) =>
        `<circle cx="${12 + (i % 5) * 10}" cy="${i < 5 ? 26 : 40}" r="3.5" fill="${i < lit ? "#ffc93c" : "rgba(255,255,255,.15)"}"/>`,
    )
    .join("") +
  '<path d="M20,52V60M44,52V60" stroke="#ff8ac4" stroke-width="2"/>';
const ICON = {
  figures:
    '<path d="M8,44L50,20" stroke="#f3f6fb" stroke-width="3"/><polygon points="58,15 46,18 51,26" fill="#f3f6fb"/><circle cx="8" cy="44" r="4" fill="#ffc93c"/><circle cx="32" cy="30" r="4" fill="#ffc93c"/>',
  lines:
    '<path d="M6,24H58M6,40H58" stroke="#7fe3ff" stroke-width="3"/><path d="M32,8V56" stroke="#ffc93c" stroke-width="3"/>',
  turns:
    '<circle cx="32" cy="32" r="24" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M32,32V12M32,32H50" stroke="#ffc93c" stroke-width="3" stroke-linecap="round"/><path d="M32,8A24,24 0 0,1 56,32L32,32Z" fill="rgba(127,227,255,.35)"/>',
  protractor:
    '<path d="M6,50A26,26 0 0,1 58,50Z" fill="rgba(170,205,255,.2)" stroke="#f3f6fb" stroke-width="2"/><path d="M32,50H58" stroke="#ffc93c" stroke-width="3"/><path d="M32,50L46,28" stroke="#7fe3ff" stroke-width="3"/>',
  kinds:
    '<path d="M6,52H26L18,34M34,52H58V30" fill="none" stroke="#ffc93c" stroke-width="3"/><rect x="52" y="46" width="6" height="6" fill="none" stroke="#7fe3ff" stroke-width="2"/>',
  unknown:
    '<path d="M32,50H58M32,50L46,22M32,50L10,30" stroke="#ffc93c" stroke-width="3"/><text x="32" y="16" fill="#7fe3ff" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">?°</text>',
  boss: scoreboard(10),
};
