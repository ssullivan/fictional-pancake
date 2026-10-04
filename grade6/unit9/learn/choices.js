/* Learn Putting It All Together (Grade 6 Unit 9), chapter 5: More than two choices. Its widgets and steps; loaded by
   choices.html. */
/* IM's lunch vote: four clubs, each voting the same way, ranking four menus */
const MENUS = ["A", "B", "C", "D"];
const MENU_NAMES = { A: "Meat", B: "Veggie", C: "Mix", D: "Snack" };
const CLUBS = [
  { name: "Barbecue", n: 21, rank: ["A", "B", "C", "D"] },
  { name: "Garden", n: 13, rank: ["B", "D", "C", "A"] },
  { name: "Sports", n: 7, rank: ["D", "C", "B", "A"] },
  { name: "Film", n: 9, rank: ["C", "D", "B", "A"] },
];
const VOTERS = CLUBS.reduce((s, c) => s + c.n, 0),
  NEED = majorityOf(VOTERS);
/* A bar for each choice still in, as long as its votes (or points), longest first in gold; need: a dashed line at the votes
   that make a majority. */
function voteBars(counts, { need = null, unit = "votes" } = {}) {
  const ids = Object.keys(counts),
    most = Math.max(...Object.values(counts), need || 0),
    barMax = 300,
    left = 76,
    rowH = 34,
    top = 10,
    lead = Math.max(...Object.values(counts));
  let markup = ids
    .map((id, i) => {
      const y = top + i * rowH,
        width = (barMax * counts[id]) / most;
      return (
        `<text class="lbl s en" x="${left - 8}" y="${y + 12}">${MENU_NAMES[id]}</text>` +
        `<rect class="vbar${counts[id] === lead ? " lead" : ""}" x="${left}" y="${y}" width="${Math.max(width, 1)}" height="24"/>` +
        `<text class="lbl s st" x="${left + width + 6}" y="${y + 12}">${counts[id]}</text>`
      );
    })
    .join("");
  const bottom = top + ids.length * rowH;
  if (need) {
    const x = left + (barMax * need) / most;
    markup +=
      `<line class="need" x1="${x}" y1="${top - 6}" x2="${x}" y2="${bottom - 6}"/>` +
      `<text class="lbl s cy" x="${x}" y="${bottom + 8}">majority: ${need}</text>`;
  }
  return svgWrap(left + barMax + 60, bottom + (need ? 20 : 0), markup, `First-choice ${unit}`);
}
/* the menus, each with its votes, in words */
const listCounts = (counts) =>
  Object.entries(counts)
    .map(([id, v]) => `${MENU_NAMES[id]} ${v}`)
    .join(", ");

/* Count the clubs' first choices one club at a time: the plurality winner. */
function wPlurality(el) {
  const q = Q(el);
  let counted = 0;
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-next>Count the next club</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `${ballotTable(CLUBS, MENU_NAMES)}<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const counts = countVotes(CLUBS.slice(0, counted), MENUS);
    q("next").disabled = counted === CLUBS.length;
    q("f").innerHTML = voteBars(counts, { need: NEED });
    if (!counted)
      q("r").innerHTML = `${VOTERS} people ranked the four lunch menus. Count each club’s <b>first</b> choice.`;
    else if (counted < CLUBS.length)
      q("r").innerHTML =
        `The ${CLUBS[counted - 1].name} Club’s ${CLUBS[counted - 1].n} votes go to ${MENU_NAMES[CLUBS[counted - 1].rank[0]]}. So far: ${listCounts(counts)}.`;
    else
      q("r").innerHTML =
        `All counted: ${listCounts(counts)}. <b>Meat</b> has the most first choices, so it wins by <b>plurality</b>. ` +
        `But 21 of ${VOTERS} isn’t a majority: that takes ${NEED}. Most people (29) ranked Meat <i>last</i>.`;
  };
  q("next").addEventListener("click", () => {
    counted++;
    draw();
  });
  q("reset").addEventListener("click", () => {
    counted = 0;
    draw();
  });
  draw();
}

/* Run the runoff one round at a time: leave out last place, and its voters move to their next choice still in. */
function wRunoff(el) {
  const q = Q(el),
    { rounds } = runoffOf(CLUBS, MENUS);
  let round = 0;
  el.innerHTML =
    `<div class="wrow"><button type="button" class="ghost-btn" data-out>Leave out last place</button><button type="button" class="ghost-btn" data-reset>Start over</button></div>` +
    `<div data-t></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { still, counts, out } = rounds[round],
      gone = MENUS.filter((m) => !still.includes(m));
    q("out").disabled = !out;
    q("t").innerHTML = ballotTable(CLUBS, MENU_NAMES, { out: gone, mark: true });
    q("f").innerHTML = voteBars(counts, { need: NEED });
    const said = `Round ${round + 1}: ${listCounts(counts)}.`;
    q("r").innerHTML = out
      ? `${said} No menu has a majority (${NEED} of ${VOTERS}), so leave out the one with the fewest votes: <b>${MENU_NAMES[out]}</b>.`
      : `${said} <span class="ok">${MENU_NAMES[onlyBest(counts)]} has a majority and wins the runoff.</span> That’s not Meat, the plurality winner: once Snack and Veggie were left out, their voters chose Mix over Meat.`;
  };
  q("out").addEventListener("click", () => {
    round++;
    draw();
  });
  q("reset").addEventListener("click", () => {
    round = 0;
    draw();
  });
  draw();
}

/* Pick a menu to see its instant runoff points: 3 for each 1st choice, 2 for a 2nd, 1 for a 3rd, 0 for last. */
function wPoints(el) {
  const q = Q(el),
    { counts } = pointsOf(CLUBS, MENUS);
  let menu = "A";
  el.innerHTML =
    seg(
      "Menu",
      MENUS.map((m) => [m, MENU_NAMES[m]]),
    ) + `<div data-t></div><div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    /* each club's voters times the points for where they ranked this menu */
    const terms = CLUBS.map((c) => `${c.n} × ${MENUS.length - 1 - c.rank.indexOf(menu)}`);
    press(el, menu);
    q("t").innerHTML = ballotTable(CLUBS, MENU_NAMES);
    q("f").innerHTML = voteBars(counts, { unit: "points" });
    q("e").textContent = `${terms.join(" + ")} = ${counts[menu]}`;
    q("r").innerHTML =
      `${MENU_NAMES[menu]} gets <b>${counts[menu]}</b> points. Points: ${listCounts(counts)}. ` +
      `<b>Veggie</b> wins by instant runoff: it’s high on almost everyone’s list. Three rules, three winners: plurality picks Meat, the runoff Mix, and instant runoff Veggie.`;
  };
  onPick(el, (id) => {
    menu = id;
    draw();
  });
  draw();
}

/* the quick checks' election: 20 students rank a class trip */
const TRIP = [
  { n: 8, rank: ["zoo", "museum", "beach"] },
  { n: 7, rank: ["museum", "beach", "zoo"] },
  { n: 5, rank: ["beach", "museum", "zoo"] },
];
const TRIP_NAMES = { zoo: "zoo", museum: "museum", beach: "beach" };
const tripTable = ballotTable(TRIP, TRIP_NAMES);

const STEPS = [
  {
    title: "Plurality",
    widget: wPlurality,
    body: "<p>With more than two choices, voters can <b>rank</b> them: 1st, 2nd, 3rd, and last. The simplest rule, <b>plurality</b>, counts only first choices: the most wins, even if it’s less than half.</p><p>Count the clubs.</p>",
    check: {
      kind: "mc",
      q: "20 students ranked three choices for a class trip. Who wins by plurality?",
      fig: tripTable,
      answer: "a",
      choices: [
        { id: "a", label: "zoo" },
        { id: "b", label: "museum" },
        { id: "c", label: "beach" },
      ],
      why: {
        b: "The museum is high on many lists, but plurality counts only first choices: zoo 8, museum 7, beach 5.",
        c: "First choices: zoo 8, museum 7, beach 5. The beach has the fewest.",
      },
      explain:
        "First choices: zoo 8, museum 7, beach 5. The zoo has the most, so it wins by plurality (with less than half).",
    },
  },
  {
    title: "Runoff",
    widget: wRunoff,
    body: `<p>In a <b>runoff</b>, if no choice has a majority (more than half), leave out the one with the fewest votes and vote again. Everyone votes for their highest choice that’s still in. Repeat until one choice has a majority.</p><p>Run the runoff. Each club’s vote is in gold.</p>`,
    check: {
      kind: "mc",
      q: "The same 20 students vote by runoff. Who wins?",
      fig: tripTable,
      answer: "b",
      choices: [
        { id: "a", label: "zoo" },
        { id: "b", label: "museum" },
        { id: "c", label: "beach" },
      ],
      why: {
        a: "The zoo wins by plurality, but 8 of 20 isn’t a majority. Leave out the beach: its 5 voters choose the museum next.",
        c: "The beach has the fewest first choices, 5, so it’s left out first.",
      },
      explain:
        "No one has 11 of 20, so leave out the beach (5). Its voters choose the museum next: museum 12, zoo 8. The museum wins.",
    },
  },
  {
    title: "Instant runoff",
    widget: wPoints,
    body: "<p>IM’s <b>instant runoff</b> uses everyone’s whole list at once: each voter gives points for every place, 0 for last, 1 for next to last, and so on up. The most points wins. With four choices, a 1st choice gets 3 points.</p><p>Pick a menu to see its points.</p>",
    check: {
      kind: "mc",
      q: "Five friends pick a weekend plan. Clare, Han, and Mai rank cooking 1st, hiking 2nd, bowling 3rd. Tyler and Noah rank hiking 1st, bowling 2nd, cooking 3rd. With 2 points for a 1st choice, 1 for a 2nd, and 0 for a 3rd, who wins?",
      answer: "b",
      choices: [
        { id: "a", label: "cooking" },
        { id: "b", label: "hiking" },
        { id: "c", label: "bowling" },
      ],
      why: {
        a: "Cooking has the most 1st choices, even a majority, but count points: cooking 3 × 2 = 6, hiking 3 × 1 + 2 × 2 = 7.",
        c: "Bowling gets only 2 × 1 = 2 points.",
      },
      explain:
        "Cooking: 3 × 2 = 6. Hiking: 3 × 1 + 2 × 2 = 7. Bowling: 2 × 1 = 2. Hiking wins, though cooking was 1st for a majority.",
    },
  },
];
