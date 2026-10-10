/* Quick Pick (facts/practice.html): pick which facts to practice, then answer them for as long as you like, tapping one of
   four answers. The operation comes from the link: practice.html#add, #sub, or #mult. Facts, choices, help, and which fact
   comes next are in facts.js; this file draws the screens and saves progress on this device. */
const SAVE_KEY = "facts-save";
/* the operation: 'add', 'sub', or 'mult' */
const op = ["add", "sub", "mult"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "add";
/* Saved progress for every operation: {add: {set, memory, best}, sub: {…}, mult: {tables, memory, best}} */
let save = {};
try {
  save = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") || {};
} catch (e) {}
const mine = (save[op] = save[op] || {}),
  persist = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {}
  };
mine.memory = mine.memory || {};
mine.best = mine.best || 0;
if (op === "mult") mine.tables = mine.tables || [2, 3, 4, 5];
else mine.set = mine.set || "20";
/* the facts picked to practice */
const chosenFacts = () => factsIn(op, op === "mult" ? mine.tables : mine.set);
/* the fact tapped on the map (null before any tap) */
let mapPick = null;

/* ---------- the setup screen ---------- */
function drawSetup() {
  const opInfo = FACT_OPS[op];
  document.title = `${opInfo.name} · Quick Pick · Math Facts`;
  $("opTitle").innerHTML = `${opInfo.name} <span>facts</span>`;
  /* addition and subtraction pick a set; multiplication ticks the tables */
  $("sets").innerHTML =
    op === "mult"
      ? `<div class="seg tables" role="group" aria-label="Times tables">${opInfo.tables
          .map((t) => `<button type="button" data-t="${t}" aria-label="Times ${t}">× ${t}</button>`)
          .join(
            "",
          )}</div><div class="row"><button type="button" class="link-btn" id="allTables">All tables</button><button type="button" class="link-btn" id="noTables">Clear</button></div>`
      : seg("Facts", opInfo.sets);
  if (op === "mult") {
    $("sets")
      .querySelectorAll("[data-t]")
      .forEach((b) => b.setAttribute("aria-pressed", mine.tables.includes(+b.dataset.t)));
    $("allTables").onclick = () => setTables(opInfo.tables);
    $("noTables").onclick = () => setTables([]);
  } else press($("sets"), mine.set);
  const facts = chosenFacts(),
    known = facts.filter((f) => factStatus(mine.memory, factKey(f)) === "known").length;
  $("start").disabled = !facts.length;
  $("known").textContent = facts.length
    ? `You know ${known} of these ${facts.length} facts.`
    : "Pick at least one table.";
  drawMap();
}
/* the tables to practice, smallest first */
function setTables(tables) {
  mine.tables = [...tables].sort((x, y) => x - y);
  persist();
  drawSetup();
}
$("sets").addEventListener("click", (e) => {
  const table = e.target.closest("[data-t]"),
    set = e.target.closest("[data-m]");
  if (table) {
    const t = +table.dataset.t;
    setTables(mine.tables.includes(t) ? mine.tables.filter((x) => x !== t) : [...mine.tables, t]);
  } else if (set) {
    mine.set = set.dataset.m;
    persist();
    drawSetup();
  }
});

/* ---------- the fact map ---------- */
/* The map's squares: a table of every fact for the operation. Addition: rows a, columns b. Subtraction: rows the number
   taken away, columns the answer. Multiplication: rows and columns 0 to 12. Each is [row, col, fact]. */
function mapFacts() {
  const size = op === "mult" ? 13 : 11;
  return range(size).flatMap((row) =>
    range(size).map((col) => [row, col, op === "sub" ? { op, a: row + col, b: row } : { op, a: row, b: col }]),
  );
}
/* The fact map (svg): each square colored by how well its fact is known, dim when it isn't in the facts picked, and
   outlined when tapped. The top row and left column are the numbers. */
function factMap() {
  const size = op === "mult" ? 13 : 11,
    cellSize = op === "mult" ? 28 : 32,
    inSet = new Set(chosenFacts().map(factKey)),
    corner = { add: "+", sub: "−", mult: "×" }[op],
    cellX = (col) => 2 + (col + 1) * cellSize,
    cellY = (row) => 2 + (row + 1) * cellSize;
  /* a square at row, col with its text (row and col −1 are the headers) */
  const square = (row, col, cls, text, attrs = "") =>
    `<g class="${cls}"${attrs}><rect x="${cellX(col)}" y="${cellY(row)}" width="${cellSize}" height="${cellSize}"/><text class="lbl s" x="${cellX(col) + cellSize / 2}" y="${cellY(row) + cellSize / 2}">${text}</text></g>`;
  let markup = square(-1, -1, "fh", corner);
  range(size).forEach((i) => {
    markup += square(-1, i, "fh", i) + square(i, -1, "fh", i);
  });
  mapFacts().forEach(([row, col, fact]) => {
    const key = factKey(fact),
      status = factStatus(mine.memory, key),
      picked = mapPick && factKey(mapPick) === key && mapPick.a === fact.a && mapPick.b === fact.b;
    markup += square(
      row,
      col,
      `fm ${status}${inSet.has(key) ? "" : " out"}${picked ? " cur" : ""}`,
      op === "sub" ? fact.a : factAnswer(fact),
      ` data-a="${fact.a}" data-b="${fact.b}" role="button" tabindex="0" aria-label="${factText(fact)}, ${status}"`,
    );
  });
  return svgWrap(
    (size + 1) * cellSize + 4,
    (size + 1) * cellSize + 4,
    markup,
    `Fact map: ${size} by ${size} ${FACT_OPS[op].name.toLowerCase()} facts, colored by how well each is known`,
  );
}
/* the words for each color on the map */
const STATUS_WORD = { new: "Not tried yet", missed: "Missed last time", learning: "Learning", known: "Known" };
function drawMap() {
  $("map").innerHTML = factMap();
  $("legend").innerHTML = Object.entries(STATUS_WORD)
    .map(([status, word]) => `<span><i class="fm-chip ${status}"></i>${word}</span>`)
    .join("");
  if (!mapPick) {
    $("mapInfo").innerHTML = "";
    return;
  }
  const status = factStatus(mine.memory, factKey(mapPick)),
    m = mine.memory[factKey(mapPick)];
  $("mapInfo").innerHTML =
    `<div class="fb info"><p><b>${factText(mapPick)} = ${factAnswer(mapPick)}</b> · ${STATUS_WORD[status]}` +
    (m ? ` (right ${m.r}, missed ${m.w})` : "") +
    `</p><p>${factHelp(mapPick).text}</p><button type="button" class="btn" id="practiceOne">Practice this fact</button></div>`;
  $("practiceOne").onclick = () => startPlay(factKey(mapPick));
}
/* tap (or Enter on) a square to see its fact */
function pickSquare(e) {
  const square = e.target.closest("[data-a]");
  if (!square) return;
  mapPick = { op, a: +square.dataset.a, b: +square.dataset.b };
  drawMap();
}
$("map").addEventListener("click", pickSquare);
$("map").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    pickSquare(e);
  }
});

/* ---------- playing ---------- */
/* this time's play: the picker, the fact on screen, whether it's answered or hinted, and the counts */
let play = null;
/* Start playing the facts picked; focus: a fact to practice more often (from the map) */
function startPlay(focus = null) {
  let facts = chosenFacts();
  /* a fact from the map that isn't in the picked set joins it */
  if (focus && !facts.some((f) => factKey(f) === focus)) facts = [...facts, mapPick];
  play = { picker: makePicker(facts, mine.memory, focus), right: 0, tried: 0, streak: 0, best: 0, missed: new Map() };
  $("setup").hidden = true;
  $("summary").hidden = true;
  $("play").hidden = false;
  $("playTitle").textContent = `${FACT_OPS[op].name} · Quick Pick`;
  nextFact();
}
/* deal the next fact and its four answers */
function nextFact() {
  const fact = play.picker.next();
  play.fact = fact;
  play.done = false;
  play.hinted = false;
  $("fact").textContent = `${factText(fact)} = ?`;
  $("choices").innerHTML = factChoices(fact)
    .map((c) => `<button type="button" class="choice" data-v="${c.value}">${c.value}</button>`)
    .join("");
  $("hint").hidden = true;
  $("hintBtn").disabled = false;
  $("feedback").innerHTML = "";
  drawCounts();
}
function drawCounts() {
  $("right").textContent = play.right;
  $("best").textContent = Math.max(mine.best, play.best);
  $("streak").innerHTML = `Streak <b>${play.streak}</b>`;
  $("streak").classList.toggle("hot", play.streak >= 5);
}
/* check a tapped answer: right goes on by itself; wrong shows the answer and how to work it out, with a Next button */
function answer(value) {
  if (play.done) return;
  const fact = play.fact,
    right = factAnswer(fact),
    ok = value === right;
  play.done = true;
  play.tried++;
  play.picker.record(fact, ok, play.hinted);
  if (ok) {
    play.right++;
    play.streak++;
    play.best = Math.max(play.best, play.streak);
    if (play.best > mine.best) mine.best = play.best;
  } else {
    play.streak = 0;
    play.missed.set(factKey(fact), fact);
  }
  persist();
  $("choices")
    .querySelectorAll(".choice")
    .forEach((b) => {
      const v = +b.dataset.v;
      if (v === right) b.classList.add("yes");
      else if (v === value) b.classList.add("no");
      b.disabled = true;
    });
  drawCounts();
  const help = factHelp(fact);
  if (ok) {
    $("feedback").innerHTML = `<div class="fb good"><h4>Yes! ${factText(fact)} = ${right}</h4></div>`;
    play.timer = setTimeout(nextFact, 700);
  } else {
    $("feedback").innerHTML =
      `<div class="fb bad"><h4>${factText(fact)} = ${right}</h4><p>${help.text}</p>` +
      (help.fig ? `<div class="fig">${help.fig}</div>` : "") +
      `<p>It’ll come back soon.</p><button type="button" class="btn" id="nextBtn">Next fact →</button></div>`;
    $("nextBtn").onclick = nextFact;
    $("nextBtn").focus();
  }
}
$("choices").addEventListener("click", (e) => {
  const b = e.target.closest(".choice");
  if (b && !b.disabled) answer(+b.dataset.v);
});
$("hintBtn").onclick = () => {
  const help = factHelp(play.fact);
  play.hinted = true;
  $("hintBtn").disabled = true;
  $("hint").innerHTML = `<p>${factHint(play.fact)}</p>` + (help.fig ? `<div class="fig">${help.fig}</div>` : "");
  $("hint").hidden = false;
};
/* Stop: a summary of this time */
$("stop").onclick = () => {
  clearTimeout(play.timer);
  $("play").hidden = true;
  $("summary").hidden = false;
  $("sumTitle").textContent = `${FACT_OPS[op].name} · Quick Pick`;
  $("sumRight").textContent = play.tried ? `${play.right} of ${play.tried} right` : "See you next time";
  $("sumMsg").textContent = play.tried
    ? `Best streak this time: ${play.best}. Best ever: ${mine.best}.`
    : "You stopped before the first fact.";
  const work = [...play.missed.values()];
  $("sumWork").innerHTML = work.length
    ? `<p class="fnote">Facts to work on:</p><p class="worklist">${work.map((f) => `<span>${factText(f)} = ${factAnswer(f)}</span>`).join("")}</p>`
    : "";
};
$("again").onclick = () => startPlay();
$("change").onclick = () => {
  $("summary").hidden = true;
  $("setup").hidden = false;
  drawSetup();
};
$("start").onclick = () => startPlay();
/* a link to another operation (practice.html#mult) redraws the page for it */
window.addEventListener("hashchange", () => location.reload());
drawSetup();
