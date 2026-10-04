/* Learn Rational Numbers (Grade 6 Unit 7), chapter 9: Common factors and multiples. Its widgets and steps; loaded by
   factors.html. */
/* a list of numbers as chips, the ones in `common` green (found) and the greatest or least of them outlined (cur) */
const chipList = (nums, common, best) =>
  nums
    .map((n) => `<span class="chip${common.includes(n) ? " found" : ""}${n === best ? " cur" : ""}">${n}</span>`)
    .join("");
/* two kinds of things to split into identical kits */
const KIT_PAIRS = [
  { id: "a", first: 12, second: 18, names: ["apples", "oranges"], kits: "fruit bags" },
  { id: "b", first: 16, second: 24, names: ["pencils", "erasers"], kits: "school kits" },
  { id: "c", first: 15, second: 20, names: ["granola bars", "water bottles"], kits: "hiking packs" },
];
/* Pick two amounts and try numbers of kits: a number of kits works when it goes into both amounts evenly. */
function wKits(el) {
  const q = Q(el),
    values = { k: 4 };
  let pairId = "a",
    tried = new Set();
  el.innerHTML =
    seg(
      "Things",
      KIT_PAIRS.map((p) => [p.id, `${p.first} and ${p.second}`]),
    ) +
    `<div class="wrow">${stepper("k", "Kits")}</div>` +
    `<p class="eq sm" data-e></p><div class="chips" data-c></div><p class="readout" data-r></p><p class="readout" data-l></p>`;
  const draw = () => {
    const { first, second, names, kits } = KIT_PAIRS.find((p) => p.id === pairId),
      k = values.k,
      fitsFirst = first % k === 0,
      fitsSecond = second % k === 0,
      common = factors(first).filter((d) => second % d === 0),
      greatest = common[common.length - 1],
      /* "1 fruit bag works", "4 fruit bags work" */
      kitWords = k === 1 ? `${kits.slice(0, -1)} works` : `${kits} work`,
      kitWordsNot = k === 1 ? `${kits.slice(0, -1)} doesn’t work` : `${kits} don’t work`;
    tried.add(k);
    press(el, pairId);
    q("k").textContent = k;
    /* each amount split k ways: an even split, or how many are left over */
    const split = (n) => (n % k ? `${n} ÷ ${k} = ${Math.floor(n / k)} R ${n % k}` : `${n} ÷ ${k} = ${n / k}`);
    q("e").innerHTML = `${split(first)}<br>${split(second)}`;
    q("c").innerHTML = [...tried]
      .sort((a, b) => a - b)
      .map((n) => `<span class="chip${common.includes(n) ? " found" : ""}">${n} kits</span>`)
      .join("");
    q("r").innerHTML =
      fitsFirst && fitsSecond
        ? `<span class="ok">${k} ${kitWords}</span>: each gets ${first / k} ${names[0]} and ${second / k} ${names[1]}, with nothing left over. ${k} is a <b>common factor</b> of ${first} and ${second}.` +
          (k === greatest ? ` It’s the <b>greatest common factor</b>: no more ${kits} can be made.` : "")
        : `<span class="no">${k} ${kitWordsNot}</span>: ${[fitsFirst ? "" : `${first} ${names[0]}`, fitsSecond ? "" : `${second} ${names[1]}`].filter(Boolean).join(" and ")} can’t be split ${k} ways evenly.`;
    q("l").innerHTML =
      `Factors of ${first}: ${chipList(factors(first), common, greatest)}<br>` +
      `Factors of ${second}: ${chipList(factors(second), common, greatest)}`;
  };
  onPick(el, (id) => {
    pairId = id;
    tried = new Set();
    draw();
  });
  steppers(el, values, { k: [1, 12] }, draw);
  draw();
}

/* pairs of numbers to count by */
const HOP_PAIRS = [
  { id: "a", first: 4, second: 6 },
  { id: "b", first: 6, second: 8 },
  { id: "c", first: 3, second: 5 },
];
/* Pick two numbers and how far to count: hops of each, with the numbers both land on (the common multiples). */
function wMultiples(el) {
  const q = Q(el),
    ends = valuesFrom(12, 60, 6),
    values = { n: ends.indexOf(24) };
  let pairId = "a";
  el.innerHTML =
    seg(
      "Count by",
      HOP_PAIRS.map((p) => [p.id, `${p.first}s and ${p.second}s`]),
    ) +
    `<div class="wrow">${stepper("n", "Count up to")}</div>` +
    `<div class="fig" data-f></div><div class="fig" data-g></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { first, second } = HOP_PAIRS.find((p) => p.id === pairId),
      end = ends[values.n],
      least = lcm(first, second),
      common = valuesFrom(1, end).filter((v) => v % first === 0 && v % second === 0),
      reached = least <= end;
    press(el, pairId);
    q("n").textContent = end;
    q("f").innerHTML = hopLine(first, end, Math.floor(end / first), {
      mark: reached ? least : null,
      label: `Hops of ${first} up to ${end}`,
    });
    q("g").innerHTML = hopLine(second, end, Math.floor(end / second), {
      cls: "b",
      mark: reached ? least : null,
      label: `Hops of ${second} up to ${end}`,
    });
    q("r").innerHTML = reached
      ? `Both counts land on <b>${common.join(", ")}</b>: the common multiples up to ${end}. The first one, <b>${least}</b>, is the <b>least common multiple</b> of ${first} and ${second}.`
      : `Up to ${end}, the hops of ${first} and of ${second} never land on the same number. Count farther.`;
  };
  onPick(el, (id) => {
    pairId = id;
    draw();
  });
  steppers(el, values, { n: [0, ends.length - 1] }, draw);
  draw();
}

/* stories that need a greatest common factor (gcf) or a least common multiple */
const STORIES = [
  {
    id: "kits",
    label: "Kits",
    story:
      "24 pencils and 36 erasers go into identical kits, with nothing left over. What’s the greatest number of kits?",
    first: 24,
    second: 36,
    gcf: true,
    why: "The kits split each amount into equal groups, so the number of kits goes into both: a common factor.",
  },
  {
    id: "hotdogs",
    label: "Hot dogs",
    story:
      "Hot dogs come in packs of 10 and buns in packs of 8. What’s the fewest hot dogs to buy so each one gets a bun?",
    first: 10,
    second: 8,
    gcf: false,
    why: "Buying whole packs, the count of hot dogs is a multiple of 10 and the count of buns a multiple of 8: a common multiple.",
  },
  {
    id: "shuttle",
    label: "Shuttles",
    story:
      "One shuttle leaves every 12 minutes and another every 18 minutes. They just left together. When do they next leave together?",
    first: 12,
    second: 18,
    gcf: false,
    why: "The first shuttle leaves at multiples of 12 minutes and the second at multiples of 18: the times they share are common multiples.",
  },
  {
    id: "beads",
    label: "Bracelets",
    story:
      "18 red beads and 30 blue beads make identical bracelets, using every bead. What’s the greatest number of bracelets?",
    first: 18,
    second: 30,
    gcf: true,
    why: "The bracelets split each color into equal groups, so the number of bracelets goes into both: a common factor.",
  },
];
/* Pick a story: does it need a common factor or a common multiple? Solve it to see the lists. */
function wWhich(el) {
  const q = Q(el);
  let storyId = "kits",
    solved = false;
  el.innerHTML =
    seg(
      "Story",
      STORIES.map((s) => [s.id, s.label]),
    ) +
    `<p class="readout" data-s></p><div class="wrow"><button type="button" class="ghost-btn" data-solve></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { story, first, second, gcf: needsFactor, why } = STORIES.find((s) => s.id === storyId),
      answer = needsFactor ? gcd(first, second) : lcm(first, second),
      upTo = (n) => valuesFrom(1, lcm(first, second) / n).map((i) => i * n);
    press(el, storyId);
    q("s").textContent = story;
    q("solve").textContent = solved ? "Hide the answer" : "Solve it";
    q("r").innerHTML = solved
      ? `${why}<br>` +
        (needsFactor
          ? `Factors of ${first}: ${chipList(factors(first), factors(second), answer)}<br>Factors of ${second}: ${chipList(factors(second), factors(first), answer)}<br>The <b>greatest common factor</b> is <b>${answer}</b>.`
          : `Multiples of ${first}: ${chipList(upTo(first), upTo(second), answer)}<br>Multiples of ${second}: ${chipList(upTo(second), upTo(first), answer)}<br>The <b>least common multiple</b> is <b>${answer}</b>.`)
      : "Splitting into equal groups, or lining up and coming out even? Decide, then solve it.";
  };
  onPick(el, (id) => {
    storyId = id;
    solved = false;
    draw();
  });
  q("solve").addEventListener("click", () => {
    solved = !solved;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Common factors",
    widget: wKits,
    body: "<p>A <b>factor</b> of a number goes into it evenly. A <b>common factor</b> of two numbers goes into both. Splitting two amounts into identical kits with nothing left over needs a common factor, and the most kits uses the <b>greatest common factor</b>.</p><p>Pick two amounts and try numbers of kits.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "What is the greatest common factor of 16 and 24?",
      answer: 8,
      misc: [
        [4, "4 is a common factor, but not the greatest: 8 goes into 16 and 24 too."],
        [2, "2 is a common factor, but not the greatest: 8 goes into 16 and 24 too."],
        [48, "48 is the least common multiple. A factor of 16 can’t be more than 16."],
        [384, "That multiplies them. A common factor goes into both numbers, so it’s at most 16."],
      ],
      explain:
        "Factors of 16: 1, 2, 4, 8, 16. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. The greatest one in both lists is 8.",
    },
  },
  {
    title: "Common multiples",
    widget: wMultiples,
    body: "<p>The <b>multiples</b> of a number are what you land on counting by it: 4, 8, 12, … A <b>common multiple</b> of two numbers is on both lists, and the first one is the <b>least common multiple</b>.</p><p>Pick two numbers and count farther.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "What is the least common multiple of 6 and 8?",
      answer: 24,
      misc: [
        [48, "48 is a common multiple, but not the least: 24 is on both lists first."],
        [2, "2 is the greatest common factor. A multiple of 8 is at least 8."],
        [14, "That adds them. 14 isn’t a multiple of 6 or of 8."],
      ],
      explain: "Multiples of 6: 6, 12, 18, 24. Multiples of 8: 8, 16, 24. The first one on both lists is 24.",
    },
  },
  {
    title: "Which one fits the story?",
    widget: wWhich,
    body: "<p>Stories about splitting into identical groups need a <b>common factor</b>. Stories about packs that have to come out even, or schedules that line up, need a <b>common multiple</b>.</p><p>Pick a story, decide, and solve it.</p>",
    check: {
      kind: "mc",
      q: "Hot dogs come in packs of 10 and buns in packs of 8. To find the fewest hot dogs to buy with exactly one bun each, what do you need?",
      stack: true,
      choices: [
        { id: "a", label: "the least common multiple of 10 and 8" },
        { id: "b", label: "the greatest common factor of 10 and 8" },
        { id: "c", label: "10 × 8" },
      ],
      answer: "a",
      why: {
        b: "The greatest common factor, 2, splits things into equal groups. Here the number of hot dogs has to be a multiple of 10 and of 8.",
        c: "80 works, but it isn’t the fewest. The least common multiple, 40, is.",
      },
      explain:
        "The number of hot dogs must be a multiple of 10 (packs of hot dogs) and of 8 (packs of buns). The least common multiple is 40.",
    },
  },
];
