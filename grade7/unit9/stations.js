/* Grand Opening (Grade 7 Unit 9): the problem generators, station list, and icons. Loaded by index.html and by
   tools/fuzz.mjs, after figs.js (floor plans and trundle wheels) and shared/fracmath.js (recipe amounts as fractions [n, d]).
   Money is to the cent, so index.html and checks.js pass a tighter near. Every problem carries facts for checks.js: its type
   (t) and the numbers its checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying
   what it asks. */
/* a num problem: its named mistakes leave out any that land on the answer (to the cent), and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.005);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
const val = ([n, d]) => n / d;
/* an amount rounded to the cent */
const cents = (n) => Math.round(n * 100) / 100;

/* ---------- Station 1: planning recipes (Lesson 1) ---------- */
/* ingredients for a recipe that serves 4: [name, amount as [n, d], unit] */
const INGREDIENTS = [
  ["rice", [3, 4], "cup"],
  ["olive oil", [1, 3], "cup"],
  ["flour", [3, 2], "cups"],
  ["sugar", [2, 3], "cup"],
  ["butter", [1, 2], "cup"],
  ["broth", [5, 2], "cups"],
];
function genRecipe() {
  const type = pick(["scale", "scale", "servings"]);
  if (type === "scale") {
    /* an ingredient for more or fewer servings: multiply by new servings ÷ 4 */
    const [name, amount, unit] = pick(INGREDIENTS),
      servings = pick([2, 6, 8, 12, 16, 20]),
      factor = frac(servings, 4),
      answer = fMul(amount, factor);
    return numP({
      prompt: `A recipe that serves 4 uses ${fim(amount)} ${unit} of ${name}. How many cups of ${name} for <b>${servings}</b> servings?`,
      answer: val(answer),
      frac: true,
      unit: "cups",
      hint: `${servings} servings is ${fim(factor)} times the recipe. Multiply ${fim(amount)} by ${fim(factor)}.`,
      misc: [
        [val(amount) + servings - 4, `That adds ${servings - 4}. Scale the recipe: multiply by ${fim(factor)}.`],
        [val(amount) * servings, `That’s ${fim(amount)} for each serving, but it’s for 4 servings.`],
        ...(val(factor) !== 1
          ? [
              [
                val(amount) / val(factor),
                `That divides. ${servings > 4 ? "More" : "Fewer"} servings need ${servings > 4 ? "more" : "less"}.`,
              ],
            ]
          : []),
      ],
      explain: `${servings} ÷ 4 = ${fim(factor)}, and ${fim(amount)} × ${fim(factor)} = ${fim(answer)} cups.`,
      facts: { t: type, amount, servings },
    });
  }
  /* how many servings an amount makes */
  const perBatch = pick([2, 3, 4]),
    makes = pick([12, 18, 24]),
    batches = pick([2, 3, 4, 5]),
    have = perBatch * batches,
    food = pick([
      ["cups of flour", "muffins"],
      ["cans of beans", "bowls of chili"],
      ["pounds of pasta", "plates of pasta"],
    ]);
  return numP({
    prompt: `${perBatch} ${food[0]} make ${makes} ${food[1]}. How many ${food[1]} can the kitchen make with ${have} ${food[0]}?`,
    answer: makes * batches,
    unit: food[1],
    hint: `${have} ÷ ${perBatch} = ${batches} batches, each making ${makes}.`,
    misc: [
      [makes + have - perBatch, "That adds. Scale up: multiply."],
      [makes * have, `Each batch uses ${perBatch} ${food[0]}, not 1.`],
    ],
    explain: `${have} ÷ ${perBatch} = ${batches} batches, and ${batches} × ${makes} = ${makes * batches} ${food[1]}.`,
    facts: { t: type, perBatch, makes, have },
  });
}

/* ---------- Station 2: the costs of running a restaurant (Lessons 2 and 3) ---------- */
const DISHES = ["veggie burger", "taco plate", "pasta bowl", "salad", "soup and bread"];
function genCosts() {
  const type = pick(["markup", "markup", "serving", "profit"]);
  if (type === "markup") {
    /* the menu price: the food cost marked up a percent */
    const cost = pick([2, 3, 4, 5, 6]),
      up = pick([50, 100, 150, 200]),
      answer = cents(cost * (1 + up / 100)),
      dish = pick(DISHES);
    return numP({
      prompt: `The food for a ${dish} costs ${money(cost)}. The restaurant marks it up <b>${up}%</b>. What is the menu price?`,
      answer,
      unit: "dollars",
      hint: `${up}% of ${money(cost)} is ${money((cost * up) / 100)}. Add it to the cost.`,
      misc: [
        [cents((cost * up) / 100), "That’s the markup. Add it to the cost."],
        [cost + up, `That adds ${up} dollars. ${up}% of ${money(cost)} is ${money((cost * up) / 100)}.`],
      ],
      explain: `${money(cost)} + ${up}% of ${money(cost)} = ${money(cost)} + ${money((cost * up) / 100)} = ${money(answer)}.`,
      facts: { t: type, cost, up },
    });
  }
  if (type === "serving") {
    /* the cost of one serving from a bulk price */
    const [price, servings] = pick([
      [24, 60],
      [18, 40],
      [12, 48],
      [30, 75],
      [20, 80],
    ]);
    const what = pick(["a bag of rice", "a wheel of cheese", "a case of tomatoes"]);
    return numP({
      prompt: `${what[0].toUpperCase() + what.slice(1)} costs ${money(price)} and makes ${servings} servings. What does one serving cost?`,
      answer: cents(price / servings),
      unit: "dollars",
      hint: `Share the ${money(price)} among the ${servings} servings: ${price} ÷ ${servings}.`,
      misc: [
        [cents(servings / price), "That divides the wrong way: servings per dollar."],
        [price * servings, "Divide the cost among the servings."],
      ],
      explain: `${money(price)} ÷ ${servings} = ${money(price / servings)} a serving.`,
      facts: { t: type, price, servings },
    });
  }
  /* a night's profit: what came in minus what it cost */
  const meals = pick([40, 50, 60, 80]),
    price = pick([10, 12, 14, 15]),
    costs = pick([300, 350, 400, 450]),
    answer = meals * price - costs;
  if (answer <= 0) return genCosts();
  return numP({
    prompt: `On opening night, the restaurant sells ${meals} meals at ${money(price)} each. The night’s costs are ${money(costs)}. What is the profit?`,
    answer,
    unit: "dollars",
    hint: `Money in: ${meals} × ${money(price)}. Profit is the money in minus the costs.`,
    misc: [
      [meals * price, "That’s the money in. Take away the costs."],
      [meals * price + costs, "Costs are paid out: subtract them."],
    ],
    explain: `${meals} × ${money(price)} = ${money(meals * price)}, and ${money(meals * price)} − ${money(costs)} = ${money(answer)}.`,
    facts: { t: type, meals, price, costs },
  });
}

/* ---------- Station 3: the floor plan (Lesson 4) ---------- */
function genPlan() {
  const type = pick(["length", "area", "area", "tables"]);
  const each = pick([1, 2]),
    w = R(5, 10),
    h = R(4, 7),
    realW = w * each,
    realH = h * each;
  if (type === "length") {
    /* a real length from the plan */
    return numP({
      prompt: `The floor plan uses the scale <b>1 cm to ${each} m</b>. The dining room is ${w} cm long on the plan. How long is the real dining room?`,
      answer: realW,
      unit: "m",
      fig: () => roomFig(w, h, { label: `The dining room, ${w} cm by ${h} cm on the plan` }),
      hint: `Each centimeter on the plan stands for ${each} m.`,
      misc: [[w + each, `Multiply by ${each}, don’t add.`]],
      explain: `${w} × ${each} = ${realW} m.`,
      facts: { t: type, w, h, each },
    });
  }
  if (type === "area") {
    /* the real floor area: scale both sides, then multiply */
    return numP({
      prompt: `The floor plan uses the scale <b>1 cm to ${each} m</b>. The dining room is ${w} cm by ${h} cm on the plan. What is its real floor <b>area</b>?`,
      answer: realW * realH,
      unit: "square meters",
      fig: () => roomFig(w, h, { label: `The dining room, ${w} cm by ${h} cm on the plan` }),
      hint: `Find the real sides first: ${w} × ${each} m and ${h} × ${each} m. Then multiply them.`,
      misc: [
        ...(each > 1 ? [[w * h, "That’s the area on the plan. Scale each side to meters first."]] : []),
        ...(each > 1
          ? [[w * h * each, `Both sides are scaled by ${each}, so the area is scaled by ${each} × ${each}.`]]
          : []),
        [2 * (realW + realH), "That’s the distance around. Area multiplies the sides."],
      ],
      explain: `The room is ${realW} m by ${realH} m, so ${realW} × ${realH} = ${realW * realH} square meters.`,
      facts: { t: type, w, h, each },
    });
  }
  /* how many tables fit: each needs some floor space */
  const space = pick([4, 5, 6]),
    room = space * R(8, 16);
  return numP({
    prompt: `Each table with its chairs needs ${space} square meters of floor. The dining room has ${room} square meters. How many tables fit?`,
    answer: room / space,
    unit: "tables",
    fig: () => roomFig(8, 5, { tables: 4, unit: null, label: "A dining room with a few of its tables" }),
    hint: `How many groups of ${space} square meters are in ${room}?`,
    misc: [[room * space, `Divide the floor among the tables: ${room} ÷ ${space}.`]],
    explain: `${room} ÷ ${space} = ${room / space} tables.`,
    facts: { t: type, room, space },
  });
}

/* ---------- Station 4: how crowded? (Lesson 5) ---------- */
/* neighborhoods: [name, people, area in square km] */
function genCrowded() {
  const type = pick(["density", "density", "compare"]);
  if (type === "density") {
    /* people per square kilometer */
    const area = pick([2, 3, 4, 5]),
      per = pick([1500, 2000, 2500, 3000, 4000, 5000]),
      people = per * area;
    return numP({
      prompt: `${people.toLocaleString("en-US")} people live in a neighborhood of ${area} square kilometers. How many people is that per square kilometer?`,
      answer: per,
      unit: "people per sq km",
      hint: `Share the people among the square kilometers: ${people.toLocaleString("en-US")} ÷ ${area}.`,
      misc: [
        [people * area, "Divide the people among the square kilometers."],
        [area / people, "That divides the wrong way."],
      ],
      explain: `${people.toLocaleString("en-US")} ÷ ${area} = ${per.toLocaleString("en-US")} people per square kilometer.`,
      facts: { t: type, people, area },
    });
  }
  /* which of two neighborhoods is more crowded: compare people per square km, not people */
  const areaA = pick([2, 4, 5]),
    areaB = pick([3, 6, 8]),
    perA = pick([2000, 3000, 4000]),
    perB = pick([1500, 2500, 3500]),
    popA = perA * areaA,
    popB = perB * areaB;
  if (perA === perB || popA > popB === perA > perB) return genCrowded();
  const more = perA > perB ? "Maple Hill" : "River Park";
  return mcP(
    [
      [
        "Maple Hill",
        more === "Maple Hill"
          ? null
          : `Maple Hill has ${perA.toLocaleString("en-US")} people per square km, fewer than River Park’s ${perB.toLocaleString("en-US")}.`,
      ],
      [
        "River Park",
        more === "River Park"
          ? null
          : `River Park has ${perB.toLocaleString("en-US")} people per square km, fewer than Maple Hill’s ${perA.toLocaleString("en-US")}.`,
      ],
    ],
    {
      prompt: `Maple Hill has ${popA.toLocaleString("en-US")} people on ${areaA} square km. River Park has ${popB.toLocaleString("en-US")} people on ${areaB} square km. Which is more <b>crowded</b>?`,
      hint: "More people doesn’t mean more crowded. Compare people per square kilometer.",
      explain: `Maple Hill: ${perA.toLocaleString("en-US")} per square km. River Park: ${perB.toLocaleString("en-US")}. ${more} is more crowded.`,
      facts: { t: type, popA, areaA, popB, areaB },
    },
  );
}

/* ---------- Station 5: measuring a course (Lessons 7 to 12) ---------- */
function genMeasure() {
  const type = pick(["trundle", "trundle", "percentError", "loops"]);
  if (type === "trundle") {
    /* a trundle wheel's circumference times its clicks */
    const circ = pick([1, 1.5]),
      clicks = pick([120, 200, 250, 300, 400]),
      answer = circ * clicks;
    return numP({
      prompt: `A trundle wheel is ${fmt(circ)} m around and clicks once each turn. Walking a path, it clicks ${clicks} times. How long is the path?`,
      answer,
      unit: "m",
      fig: () => wheelFig(`${fmt(circ)} m`, clicks),
      hint: `Each click is one turn, which rolls the wheel its circumference, ${fmt(circ)} m.`,
      misc: [
        [clicks, `That’s the clicks. Each one is ${fmt(circ)} m.`],
        ...(circ !== 1 ? [[clicks / circ, "Multiply the clicks by the distance of each turn."]] : []),
      ],
      explain: `${clicks} × ${fmt(circ)} = ${fmt(answer)} m.`,
      facts: { t: type, circ, clicks },
    });
  }
  if (type === "percentError") {
    /* how far off a measured course is, as a percent of the real length */
    const actual = pick([5, 2, 4, 10]),
      offPct = pick([1, 2, 4, 5]),
      off = (actual * offPct) / 100,
      measured = actual + (Math.random() < 0.5 ? off : -off);
    return numP({
      prompt: `A course is really ${fmt(actual)} km long, but it was measured as ${fmt(measured)} km. What is the percent error?`,
      answer: offPct,
      unit: "%",
      hint: `The error is ${fmt(off)} km. What percent of the real ${fmt(actual)} km is that?`,
      misc: [
        [off, "That’s the error in km. Write it as a percent of the real length."],
        [cents((100 * off) / measured), "Compare the error to the real length, not the measurement."],
      ],
      explain: `${fmt(off)} ÷ ${fmt(actual)} = ${fmt(offPct / 100)}: a ${offPct}% error.`,
      facts: { t: type, actual, measured },
    });
  }
  /* an equation for the rest of a course: done + loops × each = total */
  const each = pick([0.4, 0.5, 0.8]),
    loops = R(2, 6),
    total = 5,
    done = cents(total - loops * each);
  /* what's already marked is a real stretch of the route, not almost none of it or almost all */
  if (done < 0.4 || done > 3.2) return genMeasure();
  return numP({
    prompt: `A 5K route (5 km) is being planned. ${fmt(done)} km is marked so far, and each loop around the park adds ${fmt(each)} km. How many loops finish the 5 km?`,
    answer: loops,
    unit: "loops",
    hint: `${fmt(done)} + ${fmt(each)}x = ${fmt(total)}. Take off the ${fmt(done)} km, then divide by ${fmt(each)}.`,
    misc: [
      [cents(total / each), `Take off the ${fmt(done)} km already marked first.`],
      [cents(total - done), "That’s the distance left in km. Divide by the length of a loop."],
    ],
    explain: `${fmt(total)} − ${fmt(done)} = ${fmt(total - done)} km, and ${fmt(total - done)} ÷ ${fmt(each)} = ${loops} loops.`,
    facts: { t: type, done, each, total },
  });
}

const ZONES = [
  {
    id: "recipe",
    name: "Recipe Scaler",
    lessons: "Lesson 1",
    blurb: "Scale a recipe for more or fewer servings, with fractions of a cup.",
    gen: genRecipe,
  },
  {
    id: "costs",
    name: "Menu Prices",
    lessons: "Lessons 2–3",
    blurb: "Mark up food costs, find the cost of a serving, and work out a night’s profit.",
    gen: genCosts,
  },
  {
    id: "plan",
    name: "Floor Plan",
    lessons: "Lesson 4",
    blurb: "Read the scale drawing of the dining room, find its area, and fit the tables.",
    gen: genPlan,
  },
  {
    id: "crowded",
    name: "How Crowded?",
    lessons: "Lesson 5",
    blurb: "Find people per square kilometer, and compare neighborhoods fairly.",
    gen: genCrowded,
  },
  {
    id: "measure",
    name: "Course Measure",
    lessons: "Lessons 7–12",
    blurb: "Measure a fun-run course with a trundle wheel, find percent error, and solve for the loops.",
    gen: genMeasure,
  },
  {
    id: "boss",
    name: "Opening Night",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genRecipe, genCosts, genPlan, genCrowded, genMeasure])(),
  },
];

const ICON = {
  recipe:
    '<path d="M12,30 h40 v6 a20,20 0 0 1 -40,0 z" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5"/><path d="M22,22 q4,-8 0,-14 M32,22 q4,-8 0,-14 M42,22 q4,-8 0,-14" fill="none" stroke="#f3f6fb" stroke-width="2.5"/>',
  costs:
    '<rect x="12" y="8" width="40" height="48" rx="4" fill="rgba(243,246,251,.1)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M20,22 H44 M20,32 H44 M20,42 H36" stroke="#7fe3ff" stroke-width="2.5"/><text x="46" y="52" fill="#ffc93c" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">$</text>',
  plan: '<rect x="8" y="12" width="48" height="40" fill="rgba(255,201,60,.15)" stroke="#ffc93c" stroke-width="2.5"/><g fill="rgba(127,227,255,.5)" stroke="#7fe3ff" stroke-width="1.5"><circle cx="22" cy="26" r="5"/><circle cx="42" cy="26" r="5"/><circle cx="22" cy="40" r="5"/><circle cx="42" cy="40" r="5"/></g>',
  crowded:
    '<rect x="6" y="20" width="22" height="36" fill="rgba(127,227,255,.3)" stroke="#f3f6fb" stroke-width="2"/><rect x="34" y="8" width="24" height="48" fill="rgba(255,201,60,.4)" stroke="#f3f6fb" stroke-width="2"/><g fill="#0a2340"><rect x="10" y="26" width="5" height="5"/><rect x="19" y="26" width="5" height="5"/><rect x="38" y="14" width="5" height="5"/><rect x="48" y="14" width="5" height="5"/><rect x="38" y="24" width="5" height="5"/><rect x="48" y="24" width="5" height="5"/></g>',
  measure:
    '<circle cx="24" cy="40" r="16" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M24,40 L50,10" stroke="#f3f6fb" stroke-width="3" stroke-linecap="round"/><path d="M4,58 H60" stroke="#ffc93c" stroke-width="3"/>',
  boss: '<path d="M8,26 H56 L50,56 H14 Z" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><path d="M8,26 Q32,4 56,26" fill="rgba(255,138,196,.45)" stroke="#ff8ac4" stroke-width="2.5"/><text x="32" y="46" fill="#0a2340" font-size="11" font-weight="800" text-anchor="middle" font-family="monospace">OPEN</text>',
};
