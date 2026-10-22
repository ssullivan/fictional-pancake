/* Wheel Works (Grade 7 Unit 3): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs,
   after figs.js (circles, wheels, and pieces of circles). Answers with π in them are typed as the number in front of π (the
   12 in 12π), with "π cm" written after the box; decimals with π ≈ 3.14 are multiple choice. Every problem carries facts
   for checks.js: its type (t) and the numbers its checks need. Each generator deals one of a few kinds of problem (type),
   each with a comment saying what it asks. */
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
/* "about" a length or area worked out with π ≈ 3.14 */
const about = (c, unit) => `about ${fmt(c * 3.14)} ${unit}`;
/* square units as written: square cm */
const sq = (unit) => `square ${unit}`;

/* Round things and their sizes: the diameters (d) or radii (r) they come in, in unit. A circle from here is {what, r, d,
   unit}. */
const ROUND = [
  { what: "a dinner plate", d: [24, 26, 28], unit: "cm" },
  { what: "a pizza", d: [10, 12, 14, 16], unit: "inches" },
  { what: "a clock face", r: [10, 12, 15], unit: "cm" },
  { what: "a round table", d: [100, 120, 140], unit: "cm" },
  { what: "a trampoline", d: [3, 4, 5], unit: "m" },
  { what: "a circular garden", r: [2, 3, 4, 5, 6], unit: "m" },
  { what: "a Ferris wheel", d: [40, 50, 60], unit: "m" },
  { what: "a round pool", d: [4, 6, 8], unit: "m" },
  { what: "a drum", d: [30, 36, 40], unit: "cm" },
  { what: "a coin", d: [2, 3], unit: "cm" },
];
/* the unit's singular for "a 12-inch pizza" */
const ONE_UNIT = { inches: "inch", cm: "cm", m: "m" };
/* a round thing at one of its sizes. only(circle): which ones may be picked (by r and d) */
function roundThing(only = () => true) {
  const options = ROUND.flatMap((thing) =>
    thing.d
      ? thing.d.map((d) => ({ what: thing.what, d, r: d / 2, unit: thing.unit }))
      : thing.r.map((r) => ({ what: thing.what, r, d: 2 * r, unit: thing.unit })),
  ).filter(only);
  return pick(options);
}
/* a radius squares easily in your head: up to 12, or a multiple of 10 */
const easySquare = (r) => (Number.isInteger(r) && r <= 12) || r % 10 === 0;

/* ---------- Station 1: parts of a circle (Lesson 2) ---------- */
function genParts() {
  const type = pick(["dFromR", "rFromD", "which", "which"]);
  if (type === "dFromR" || type === "rFromD") {
    /* the diameter from the radius, or the radius from the diameter */
    const c = roundThing((t) => Number.isInteger(t.r)),
      toD = type === "dFromR";
    return numP({
      prompt: toD
        ? `${c.what[0].toUpperCase() + c.what.slice(1)} has a <b>radius</b> of ${fmt(c.r)} ${c.unit}. What is its <b>diameter</b>?`
        : `${c.what[0].toUpperCase() + c.what.slice(1)} is ${fmt(c.d)} ${c.unit} across: that’s its <b>diameter</b>. What is its <b>radius</b>?`,
      answer: toD ? c.d : c.r,
      unit: c.unit,
      fig: (show) =>
        circleFig({
          segs: ["radius", "diameter"],
          labels: show
            ? { radius: `${fmt(c.r)} ${c.unit}`, diameter: `${fmt(c.d)} ${c.unit}` }
            : toD
              ? { radius: `${fmt(c.r)} ${c.unit}`, diameter: "?" }
              : { radius: "?", diameter: `${fmt(c.d)} ${c.unit}` },
          hi: toD ? "diameter" : "radius",
          label: `A circle with its radius and diameter`,
        }),
      hint: "A diameter goes all the way across, through the center: it’s two radii long.",
      misc: toD
        ? [
            [c.r / 2, "That halves the radius. The diameter is longer: it’s two radii."],
            [c.r, "That’s the radius. The diameter is twice as long."],
          ]
        : [
            [c.d * 2, "That doubles the diameter. The radius is half of it."],
            [c.d, "That’s the diameter. The radius goes from the center to the edge: half as long."],
          ],
      explain: toD
        ? `The diameter is two radii: 2 × ${fmt(c.r)} = ${fmt(c.d)} ${c.unit}.`
        : `The radius is half the diameter: ${fmt(c.d)} ÷ 2 = ${fmt(c.r)} ${c.unit}.`,
      facts: { t: type, r: c.r, d: c.d },
    });
  }
  /* which lettered segment is a radius or a diameter: A to B is a radius, C to D a diameter, E to F misses the center */
  const asked = pick(["radius", "diameter"]),
    names = { radius: "AB", diameter: "CD", chord: "EF" };
  const why = {
    radius: "AB goes from the center, A, to the edge: it’s a radius.",
    diameter: "CD goes all the way across, through the center: it’s a diameter.",
    chord: "EF goes across the circle but misses the center, so it’s neither a radius nor a diameter.",
  };
  return mcP(
    ["radius", "diameter", "chord"].map((s) => [`Segment ${names[s]}`, s === asked ? null : why[s]]),
    {
      prompt: `Point A is the center of the circle. Which segment is a <b>${asked}</b>?`,
      fig: () =>
        circleFig({ segs: ["radius", "diameter", "chord"], letters: true, label: "A circle with three segments" }),
      hint:
        asked === "radius"
          ? "A radius goes from the center to the edge."
          : "A diameter goes from edge to edge through the center.",
      explain: why[asked],
      facts: { t: "which", asked, name: names[asked] },
    },
  );
}

/* ---------- Station 2: circumference (Lessons 3 and 4) ---------- */
function genCircum() {
  const type = pick(["fromD", "fromR", "back", "approx"]);
  const c = roundThing();
  const What = c.what[0].toUpperCase() + c.what.slice(1);
  if (type === "fromD" || type === "fromR") {
    /* C = πd, or C = 2πr, in terms of π */
    const fromD = type === "fromD",
      answer = c.d;
    return numP({
      prompt: fromD
        ? `${What} has a diameter of ${fmt(c.d)} ${c.unit}. What is its <b>circumference</b>, in terms of π?`
        : `${What} has a radius of ${fmt(c.r)} ${c.unit}. What is its <b>circumference</b>, in terms of π?`,
      answer,
      unit: `π ${c.unit}`,
      fig: (show) =>
        circleFig({
          segs: [fromD ? "diameter" : "radius", "arc"],
          labels: fromD
            ? { diameter: `${fmt(c.d)} ${c.unit}`, ...(show ? { arc: `C = π × ${fmt(c.d)}` } : {}) }
            : { radius: `${fmt(c.r)} ${c.unit}`, ...(show ? { arc: `C = 2 × π × ${fmt(c.r)}` } : {}) },
          label: `A circle with its ${fromD ? "diameter" : "radius"} labeled`,
        }),
      hint: fromD
        ? "The circumference is π times the diameter: C = πd."
        : "The diameter is 2 radii, so the circumference is C = 2πr.",
      misc: fromD
        ? [
            [c.r, "That’s π times the radius. C = πd uses the whole diameter."],
            [2 * c.d, "That’s 2π times the diameter. 2πr and πd are the same thing: use one of them."],
            [c.r * c.r, "That’s the area’s π r². The circumference is the distance around: π times the diameter."],
          ]
        : [
            [c.r, "That’s π times the radius, only halfway round. C = 2πr."],
            [c.r * c.r, "That’s the area’s πr². The circumference is 2πr."],
            [4 * c.r, "That doubles the diameter. C = 2πr, which is π times the diameter."],
          ],
      explain: fromD
        ? `C = π × ${fmt(c.d)} = ${piText(c.d, c.unit)}.`
        : `C = 2 × π × ${fmt(c.r)} = ${piText(c.d, c.unit)}.`,
      facts: { t: type, r: c.r, d: c.d },
    });
  }
  if (type === "back") {
    /* the diameter (or radius) from the circumference */
    const wantR = Math.random() < 0.4;
    return numP({
      prompt: `The circumference of ${c.what} is ${piText(c.d, c.unit)}. What is its <b>${wantR ? "radius" : "diameter"}</b>?`,
      answer: wantR ? c.r : c.d,
      unit: c.unit,
      hint: `C = πd, so the diameter is the number π is multiplied by.${wantR ? " Then halve it for the radius." : ""}`,
      misc: wantR
        ? [
            [c.d, "That’s the diameter. The radius is half of it."],
            [c.d * 2, "C = πd, so d is the number in front of π. The radius is half of that."],
          ]
        : [
            [c.r, "That’s the radius. C = πd, so the diameter is the number in front of π."],
            [c.d * 2, "That doubles it. C = πd: the diameter is the number in front of π."],
          ],
      explain: `C = π × ${fmt(c.d)}, so the diameter is ${fmt(c.d)} ${c.unit}${wantR ? ` and the radius is ${fmt(c.r)} ${c.unit}` : ""}.`,
      facts: { t: type, r: c.r, d: c.d, wantR },
    });
  }
  /* about how long the circumference is, with π ≈ 3.14 */
  return mcP(
    [
      [about(c.d, c.unit), null],
      [about(c.r, c.unit), "That’s 3.14 times the radius. The circumference is π times the whole diameter."],
      [about(c.r * c.r, c.unit), "That’s 3.14 × r × r, the area. The circumference is π times the diameter."],
    ],
    {
      prompt: `${What} has a diameter of ${fmt(c.d)} ${c.unit}. About how long is its circumference? Use 3.14 for π.`,
      hint: "C = πd. Multiply the diameter by 3.14.",
      explain: `C = πd ≈ 3.14 × ${fmt(c.d)} = ${fmt(c.d * 3.14)} ${c.unit}.`,
      facts: { t: "circApprox", r: c.r, d: c.d, unit: c.unit },
    },
  );
}

/* ---------- Station 3: wheels (Lesson 5) ---------- */
/* wheels: what they're on, and their diameters in cm */
const WHEELS = [
  { what: "bike", d: [60, 70] },
  { what: "scooter", d: [20, 25] },
  { what: "wheelchair", d: [50, 60] },
  { what: "skateboard", d: [5, 6] },
  { what: "wagon", d: [20, 30] },
];
function genWheels() {
  const type = pick(["distance", "distance", "turns", "times", "approx"]);
  const wheel = pick(WHEELS),
    d = pick(wheel.d);
  if (type === "distance") {
    /* how far a wheel rolls in some turns, in terms of π */
    const turns = pick([5, 10, 20, 100]),
      answer = turns * d;
    return numP({
      prompt: `A ${wheel.what} wheel has a diameter of ${d} cm. How far does the ${wheel.what} go when the wheel turns <b>${turns} times</b>? Give the answer in terms of π.`,
      answer,
      unit: "π cm",
      fig: (show) => rollFig(turns, { d, show }),
      hint: `Each turn rolls the wheel one circumference along the ground: π × ${d} cm.`,
      misc: [
        [d, `That’s one turn. The wheel turns ${turns} times.`],
        [(turns * d) / 2, "That uses the radius. Each turn rolls one circumference: π times the diameter."],
        [turns + d, "Each turn adds a whole circumference: multiply."],
      ],
      explain: `One turn rolls ${piText(d, "cm")}, so ${turns} turns roll ${turns} × ${d}π = ${piText(answer, "cm")}.`,
      facts: { t: type, d, turns },
    });
  }
  if (type === "turns") {
    /* how many turns for a distance, from the circumference */
    const circ = pick([2, 1.5, 3, 4]),
      turns = pick([10, 20, 30, 40, 50, 100]),
      far = circ * turns;
    return numP({
      prompt: `The circumference of a tractor wheel is ${fmt(circ)} m. How many times does the wheel turn as the tractor drives ${fmt(far)} m?`,
      answer: turns,
      unit: "turns",
      hint: `Each turn moves the tractor one circumference, ${fmt(circ)} m. How many ${fmt(circ)}s are in ${fmt(far)}?`,
      misc: [
        [far * circ, `That multiplies. Divide the distance by the ${fmt(circ)} m of each turn.`],
        [far, "That’s the distance. Each turn covers a whole circumference."],
      ],
      explain: `${fmt(far)} ÷ ${fmt(circ)} = ${turns} turns.`,
      facts: { t: type, circ, far },
    });
  }
  if (type === "times") {
    /* circumference is proportional to diameter: a wheel twice as wide goes twice as far each turn */
    const [small, big] = pick([
      [20, 60],
      [30, 60],
      [25, 75],
      [20, 80],
      [15, 45],
    ]);
    return numP({
      prompt: `Wheel A is ${big} cm across and wheel B is ${small} cm across. In one turn, wheel A rolls how many times as far as wheel B?`,
      answer: big / small,
      unit: "times as far",
      hint: "Each rolls its circumference, π times its diameter. Compare the diameters.",
      misc: [
        [big - small, "That’s how much wider it is. Compare by dividing the diameters."],
        [(big / small) ** 2, "That’s how the areas compare. Distance around grows with the diameter, not its square."],
      ],
      explain: `Wheel A rolls ${big}π and wheel B ${small}π: ${big} ÷ ${small} = ${big / small} times as far.`,
      facts: { t: type, small, big },
    });
  }
  /* about how far in 100 turns, with π ≈ 3.14 */
  const turns = 100;
  return mcP(
    [
      [about(turns * d, "cm"), null],
      [about((turns * d) / 2, "cm"), "That uses the radius. Each turn rolls π times the diameter."],
      [about(d, "cm"), "That’s just one turn. The wheel turns 100 times."],
    ],
    {
      prompt: `A ${wheel.what} wheel ${d} cm across turns ${turns} times. About how far does it roll? Use 3.14 for π.`,
      hint: `One turn rolls about 3.14 × ${d} cm.`,
      explain: `One turn rolls about 3.14 × ${d} = ${fmt(3.14 * d)} cm, and 100 turns roll about ${fmt(314 * d)} cm.`,
      facts: { t: "rollApprox", d, turns },
    },
  );
}

/* ---------- Station 4: area of a circle (Lessons 7 and 8) ---------- */
function genArea() {
  const type = pick(["fromR", "fromD", "fromC", "approx", "compare"]);
  if (type === "compare") {
    /* doubling or tripling the diameter: the area grows by the factor times itself */
    const [small, big] = pick([
      [8, 16],
      [6, 12],
      [4, 12],
      [5, 10],
      [6, 18],
    ]);
    const factor = big / small;
    return numP({
      prompt: `A large pizza is ${big} inches across and a small one is ${small} inches across. The large pizza has how many times as much <b>area</b>?`,
      answer: factor * factor,
      unit: "times as much",
      hint: `The radius is ${factor} times as long, and A = πr² multiplies the radius by itself.`,
      misc: [
        [factor, `That’s how the diameters compare. The area grows by ${factor} × ${factor}.`],
        [big - small, "Compare by dividing, and remember the area squares the radius."],
      ],
      explain: `The areas are ${piText((big / 2) ** 2)} and ${piText((small / 2) ** 2)}: ${(big / 2) ** 2} ÷ ${(small / 2) ** 2} = ${factor * factor} times as much.`,
      facts: { t: "pizzas", small, big },
    });
  }
  const c = roundThing((t) => easySquare(t.r));
  const What = c.what[0].toUpperCase() + c.what.slice(1);
  const answer = c.r * c.r;
  if (type === "fromR" || type === "fromD" || type === "fromC") {
    /* A = πr², from the radius, the diameter, or the circumference */
    const given =
      type === "fromR"
        ? `a radius of ${fmt(c.r)} ${c.unit}`
        : type === "fromD"
          ? `a diameter of ${fmt(c.d)} ${c.unit}`
          : `a circumference of ${piText(c.d, c.unit)}`;
    return numP({
      prompt: `${What} has ${given}. What is its <b>area</b>, in terms of π?`,
      answer,
      unit: `π ${sq(c.unit)}`,
      fig: (show) =>
        show
          ? wedgeFig(16, { label: `${c.what}, cut into wedges and laid out` })
          : circleFig({
              segs: [type === "fromR" ? "radius" : "diameter"],
              labels:
                type === "fromR"
                  ? { radius: `${fmt(c.r)} ${c.unit}` }
                  : type === "fromD"
                    ? { diameter: `${fmt(c.d)} ${c.unit}` }
                    : {},
              label: `A circle with ${given}`,
            }),
      hint:
        type === "fromR"
          ? `A = πr²: π times the radius times the radius. The wedges make a shape πr long and r tall.`
          : type === "fromD"
            ? `Find the radius first: half of ${fmt(c.d)}. Then A = πr².`
            : `C = πd, so the diameter is ${fmt(c.d)} and the radius is half of it. Then A = πr².`,
      misc: [
        [c.d * c.d, "That squares the diameter. A = πr² uses the radius: half the diameter."],
        [c.d, "That’s the circumference, πd. Area is πr²."],
        [2 * c.r, "That’s 2r, the circumference’s number. Area multiplies the radius by itself."],
        ...(type === "fromC" ? [[c.d * c.r, "Find the radius from the circumference, then square it."]] : []),
      ],
      explain: `The radius is ${fmt(c.r)} ${c.unit}, so A = π × ${fmt(c.r)} × ${fmt(c.r)} = ${piText(answer, sq(c.unit))}.`,
      facts: { t: "area", from: type, r: c.r, d: c.d },
    });
  }
  /* about how much area, with π ≈ 3.14 */
  return mcP(
    [
      [about(answer, sq(c.unit)), null],
      [about(c.d, sq(c.unit)), "That’s 3.14 × d, the circumference. Area is 3.14 × r × r."],
      [about(c.d * c.d, sq(c.unit)), "That squares the diameter. Use the radius: half of it."],
    ],
    {
      prompt: `${What} has a radius of ${fmt(c.r)} ${c.unit}. About how much area does it cover? Use 3.14 for π.`,
      hint: "A = πr². Multiply 3.14 by the radius twice.",
      explain: `A = πr² ≈ 3.14 × ${fmt(c.r)} × ${fmt(c.r)} = ${fmt(3.14 * answer)} ${sq(c.unit)}.`,
      facts: { t: "areaApprox", r: c.r, d: c.d, unit: c.unit },
    },
  );
}

/* ---------- Station 5: half and quarter circles (Lesson 9) ---------- */
function genPieces() {
  const type = pick(["halfArea", "quarterArea", "arc", "perimeter"]);
  const kind = type === "quarterArea" ? "quarter" : type === "halfArea" ? "half" : pick(["half", "quarter"]),
    parts = kind === "half" ? 2 : 4,
    r = pick(kind === "half" ? [2, 4, 6, 8, 10] : [2, 4, 6, 8, 10, 12]),
    unit = pick(["cm", "m", "inches"]),
    shape = kind === "half" ? "half circle" : "quarter circle";
  if (type === "halfArea" || type === "quarterArea") {
    /* the area of a piece: the whole circle's πr², shared */
    const answer = (r * r) / parts;
    return numP({
      prompt: `A window is a ${shape} with a radius of ${r} ${unit}. What is its <b>area</b>, in terms of π?`,
      answer,
      unit: `π ${sq(unit)}`,
      fig: () => pieceFig(kind, r, { unit, label: `A ${shape} of radius ${r} ${unit}` }),
      hint: `The whole circle’s area is π × ${r} × ${r}. The window is ${kind === "half" ? "half" : "a quarter"} of it.`,
      misc: [
        [r * r, `That’s the whole circle. The window is only ${kind === "half" ? "half" : "a quarter"} of it.`],
        [(2 * r) / parts, "That’s part of the circumference. Area uses r × r."],
        [r / parts, `Square the radius first: ${r} × ${r}, then share it.`],
      ],
      explain: `The whole circle is ${piText(r * r)}, and ${kind === "half" ? "half" : "a quarter"} of it is ${piText(answer, sq(unit))}.`,
      facts: { t: type, r, parts },
    });
  }
  if (type === "arc") {
    /* the length of the curved edge: the whole circumference, shared */
    const answer = (2 * r) / parts;
    return numP({
      prompt: `How long is the <b>curved edge</b> of a ${shape} with a radius of ${r} ${unit}, in terms of π?`,
      answer,
      unit: `π ${unit}`,
      fig: (show) => pieceFig(kind, r, { unit, show, label: `A ${shape} of radius ${r} ${unit}` }),
      hint: `The whole circle’s circumference is 2 × π × ${r}. The curved edge is ${kind === "half" ? "half" : "a quarter"} of it.`,
      misc: [
        [2 * r, `That’s the whole circumference. The edge is ${kind === "half" ? "half" : "a quarter"} of it.`],
        [(r * r) / parts, "That’s the area of the piece. The edge is part of the circumference, 2πr."],
      ],
      explain: `The whole circumference is ${piText(2 * r)}, and ${kind === "half" ? "half" : "a quarter"} of it is ${piText(answer, unit)}.`,
      facts: { t: type, r, parts },
    });
  }
  /* the distance all the way around a piece: the curved edge plus the straight sides */
  const arc = (2 * r) / parts,
    straight = 2 * r;
  return mcP(
    [
      [`${piText(arc)} + ${straight} ${unit}`, null],
      [`${piText(arc, unit)}`, `That’s just the curved edge. Add the straight side${kind === "half" ? "" : "s"} too.`],
      [
        `${piText(2 * r)} + ${straight} ${unit}`,
        `${piText(2 * r)} is the whole circle’s circumference. The curved edge is only ${kind === "half" ? "half" : "a quarter"} of it.`,
      ],
    ],
    {
      prompt: `A garden bed is a ${shape} with a radius of ${r} ${unit}. How much edging goes <b>all the way around</b> it?`,
      fig: () => pieceFig(kind, r, { unit, label: `A ${shape} of radius ${r} ${unit}` }),
      hint: `Around the outside is the curved edge (part of 2πr) and the straight ${kind === "half" ? "side, a diameter" : "sides, two radii"}.`,
      explain: `The curved edge is ${piText(arc)} and the straight ${kind === "half" ? "side is" : "sides are"} ${straight} ${unit}, so ${piText(arc)} + ${straight} ${unit}.`,
      facts: { t: type, r, parts },
    },
  );
}

/* ---------- Station 6: circumference or area? (Lesson 10) ---------- */
/* jobs around a circle: [what's measured, circumference or area] */
const JOBS = [
  ["the fence around a circular garden", "C"],
  ["the ribbon that goes around a round cake", "C"],
  ["the trim along the edge of a round tablecloth", "C"],
  ["how far a wheel rolls in one turn", "C"],
  ["the lights strung around a round pool", "C"],
  ["the grass seed to cover a circular garden", "A"],
  ["the paint for the top of a round table", "A"],
  ["the cloth for a round tablecloth", "A"],
  ["the cheese to cover a pizza", "A"],
  ["the floor a round rug covers", "A"],
];
function genWhich() {
  const type = pick(["kind", "kind", "solve"]);
  const [job, kind] = pick(JOBS);
  if (type === "kind") {
    /* which measurement a job needs */
    return mcP(
      [
        ["Circumference", kind === "C" ? null : "That covers the whole inside of the circle: area."],
        ["Area", kind === "A" ? null : "That only goes around the edge: circumference."],
      ],
      {
        prompt: `To find ${job}, do you need the circle’s circumference or its area?`,
        stack: true,
        hint: "Circumference is the distance around the edge. Area is the space inside.",
        explain:
          kind === "C"
            ? `${job[0].toUpperCase() + job.slice(1)} goes around the edge: circumference.`
            : `${job[0].toUpperCase() + job.slice(1)} covers the inside: area.`,
        facts: { t: type, kind },
      },
    );
  }
  /* work it out: the right one of 2πr and πr² */
  const r = pick([2, 3, 4, 5, 6, 8, 10]),
    answer = kind === "C" ? 2 * r : r * r;
  return numP({
    prompt: `The circle has a radius of ${r} feet. How much is ${job}, in terms of π?`,
    answer,
    unit: kind === "C" ? "π feet" : "π square feet",
    hint: kind === "C" ? "It goes around the edge: C = 2πr." : "It covers the inside: A = πr².",
    misc:
      kind === "C"
        ? [
            [r * r, "That’s the area. This goes around the edge: 2πr."],
            [r, "That’s only halfway round. C = 2πr."],
          ]
        : [
            [2 * r, "That’s the circumference. This covers the inside: πr²."],
            [4 * r * r, "That squares the diameter. Use the radius: π × r × r."],
          ],
    explain:
      kind === "C"
        ? `Around the edge: 2 × π × ${r} = ${piText(answer, "feet")}.`
        : `The inside: π × ${r} × ${r} = ${piText(answer, "square feet")}.`,
    facts: { t: type, kind, r },
  });
}

const ZONES = [
  {
    id: "parts",
    name: "Circle Parts",
    lessons: "Lesson 2",
    blurb: "Tell a radius from a diameter, and find one from the other.",
    gen: genParts,
  },
  {
    id: "circum",
    name: "Around the Rim",
    lessons: "Lessons 3–4",
    blurb: "Find the circumference in terms of π, go back to the diameter, and estimate with 3.14.",
    gen: genCircum,
  },
  {
    id: "wheels",
    name: "Wheel Shop",
    lessons: "Lesson 5",
    blurb: "One turn rolls one circumference: how far, how many turns, and how much farther a bigger wheel goes.",
    gen: genWheels,
  },
  {
    id: "area",
    name: "Pizza Area",
    lessons: "Lessons 7–8",
    blurb: "Find the area with πr², from the radius, the diameter, or the circumference, and compare pizzas.",
    gen: genArea,
  },
  {
    id: "pieces",
    name: "Slices",
    lessons: "Lesson 9",
    blurb: "Find the area and edges of half circles and quarter circles.",
    gen: genPieces,
  },
  {
    id: "which",
    name: "Rim or Inside?",
    lessons: "Lesson 10",
    blurb: "Decide whether a job needs the circumference or the area, then work it out.",
    gen: genWhich,
  },
  {
    id: "boss",
    name: "Grand Prix",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genParts, genCircum, genWheels, genArea, genPieces, genWhich])(),
  },
];

const ICON = {
  parts:
    '<circle cx="32" cy="32" r="24" fill="rgba(127,227,255,.15)" stroke="#7fe3ff" stroke-width="3"/><path d="M15,49 L49,15" stroke="#ffc93c" stroke-width="3.5"/><path d="M32,32 L56,32" stroke="#f3f6fb" stroke-width="3"/><circle cx="32" cy="32" r="3.5" fill="#f3f6fb"/>',
  circum:
    '<circle cx="32" cy="32" r="22" fill="none" stroke="#ffc93c" stroke-width="5" stroke-dasharray="100 40"/><text x="32" y="38" fill="#f3f6fb" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">π</text>',
  wheels:
    '<circle cx="22" cy="34" r="14" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M22,34 L22,20" stroke="#f3f6fb" stroke-width="2.5"/><path d="M4,50 H60" stroke="#ffc93c" stroke-width="3.5"/><path d="M40,50 v-6 M58,50 v-6" stroke="#ffc93c" stroke-width="3"/>',
  area: '<circle cx="32" cy="32" r="24" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="3"/><circle cx="24" cy="26" r="4" fill="#ff8ac4"/><circle cx="40" cy="30" r="4" fill="#ff8ac4"/><circle cx="30" cy="42" r="4" fill="#ff8ac4"/>',
  pieces:
    '<path d="M8,46 A24,24 0 0 1 56,46 Z" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="46" r="3" fill="#f3f6fb"/>',
  which:
    '<circle cx="32" cy="32" r="22" fill="rgba(127,227,255,.25)" stroke="#ffc93c" stroke-width="5"/><text x="32" y="38" fill="#f3f6fb" font-size="16" font-weight="800" text-anchor="middle" font-family="monospace">?</text>',
  boss: '<path d="M10,48 h44" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="20" cy="40" r="8" fill="none" stroke="#7fe3ff" stroke-width="3"/><circle cx="46" cy="40" r="8" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M14,32 h30 l6,-10 h-26 z" fill="rgba(255,201,60,.55)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/>',
};
