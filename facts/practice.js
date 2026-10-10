/* Quick Pick (facts/practice.html): pick which facts to practice, then answer them for as long as you like, tapping one of
   four answers. The operation comes from the link: practice.html#add, #sub, #mult, or #div. Facts, choices, help, and which fact
   comes next are in facts.js; this file draws the screens and saves progress on this device. */
const SAVE_KEY = "facts-save";
/* the operation: 'add', 'sub', 'mult', or 'div' */
const op = ["add", "sub", "mult", "div"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "add";
/* does this operation practice tables (multiplication and division), not sets? */
const byTables = !!FACT_OPS[op].tables;
/* Saved progress for every operation: {add: {set, memory, best}, sub: {…}, mult: {tables, memory, best}, div: {…}} */
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
/* how facts are shown: 'plain' (7 + 8 = ?), 'missing' (7 + ? = 15), or 'mix' */
mine.show = mine.show || "plain";
/* how answers are given: 'pick' one of four, or 'type' it on the number pad (or a keyboard) */
mine.input = mine.input || "pick";
mine.best = mine.best || 0;
if (byTables) mine.tables = mine.tables || [2, 3, 4, 5];
else mine.set = mine.set || "20";
/* an example of each way to show a fact, for the "Show facts as" buttons */
const SHOW_EXAMPLES = {
  add: ["7 + 8 = ?", "7 + ? = 15"],
  sub: ["15 − 8 = ?", "15 − ? = 7"],
  mult: ["6 × 7 = ?", "6 × ? = 42"],
  div: ["42 ÷ 6 = ?", "42 ÷ ? = 7"],
};
/* the facts picked to practice */
const chosenFacts = () => factsIn(op, byTables ? mine.tables : mine.set);
/* the fact tapped on the map (null before any tap) */
let mapPick = null;

/* ---------- the setup screen ---------- */
function drawSetup() {
  const opInfo = FACT_OPS[op];
  document.title = `${opInfo.name} · Quick Pick · Math Facts`;
  $("opTitle").innerHTML = `${opInfo.name} <span>facts</span>`;
  /* addition and subtraction pick a set; multiplication and division tick the tables */
  const tableWord = op === "mult" ? "Times" : "Divided by";
  $("sets").innerHTML = byTables
    ? `<div class="seg tables" role="group" aria-label="${op === "mult" ? "Times tables" : "Dividing by"}">${opInfo.tables
        .map((t) => `<button type="button" data-t="${t}" aria-label="${tableWord} ${t}">${opInfo.sign} ${t}</button>`)
        .join(
          "",
        )}</div><div class="row"><button type="button" class="link-btn" id="allTables">All tables</button><button type="button" class="link-btn" id="noTables">Clear</button></div>`
    : seg("Facts", opInfo.sets);
  if (byTables) {
    $("sets")
      .querySelectorAll("[data-t]")
      .forEach((b) => b.setAttribute("aria-pressed", mine.tables.includes(+b.dataset.t)));
    $("allTables").onclick = () => setTables(opInfo.tables);
    $("noTables").onclick = () => setTables([]);
  } else press($("sets"), mine.set);
  const [plainExample, missingExample] = SHOW_EXAMPLES[op];
  $("show").innerHTML = seg("Show facts as", [
    ["plain", plainExample],
    ["missing", missingExample],
    ["mix", "Mix them"],
  ]);
  press($("show"), mine.show);
  $("input").innerHTML = seg("Answer by", [
    ["pick", "Picking from 4"],
    ["type", "Typing it"],
  ]);
  press($("input"), mine.input);
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

$("show").addEventListener("click", (e) => {
  const choice = e.target.closest("[data-m]");
  if (!choice) return;
  mine.show = choice.dataset.m;
  persist();
  drawSetup();
});
$("input").addEventListener("click", (e) => {
  const choice = e.target.closest("[data-m]");
  if (!choice) return;
  mine.input = choice.dataset.m;
  persist();
  drawSetup();
});

/* ---------- the fact map ---------- */
/* The map's rows and columns: the numbers along its left side and top. Addition: a down the side, b along the top.
   Subtraction: the number taken away, and the answer. Multiplication: 0 to 12 both ways. Division: the number divided by
   (1 to 12), and the answer. */
const MAP_SIDES = {
  add: [range(11), range(11)],
  sub: [range(11), range(11)],
  mult: [range(13), range(13)],
  div: [range(12).map((i) => i + 1), range(13)],
};
/* the fact in the map's square for row number r and column number c */
const squareFact = (r, c) =>
  op === "sub" ? { op, a: r + c, b: r } : op === "div" ? { op, a: r * c, b: r } : { op, a: r, b: c };
/* every square of the map: [row, col, fact], where row and col count from 0 */
function mapFacts() {
  const [rowNums, colNums] = MAP_SIDES[op];
  return rowNums.flatMap((r, row) => colNums.map((c, col) => [row, col, squareFact(r, c)]));
}
/* The fact map (svg): each square colored by how well its fact is known, dim when it isn't in the facts picked, and
   outlined when tapped. The top row and left column are the numbers. */
function factMap() {
  const [rowNums, colNums] = MAP_SIDES[op],
    cellSize = byTables ? 28 : 32,
    inSet = new Set(chosenFacts().map(factKey)),
    corner = FACT_OPS[op].sign,
    cellX = (col) => 2 + (col + 1) * cellSize,
    cellY = (row) => 2 + (row + 1) * cellSize;
  /* a square at row, col with its text (row and col −1 are the headers) */
  const square = (row, col, cls, text, attrs = "") =>
    `<g class="${cls}"${attrs}><rect x="${cellX(col)}" y="${cellY(row)}" width="${cellSize}" height="${cellSize}"/><text class="lbl s" x="${cellX(col) + cellSize / 2}" y="${cellY(row) + cellSize / 2}">${text}</text></g>`;
  let markup = square(-1, -1, "fh", corner);
  colNums.forEach((c, col) => (markup += square(-1, col, "fh", c)));
  rowNums.forEach((r, row) => (markup += square(row, -1, "fh", r)));
  mapFacts().forEach(([row, col, fact]) => {
    const key = factKey(fact),
      status = factStatus(mine.memory, key),
      picked = mapPick && factKey(mapPick) === key && mapPick.a === fact.a && mapPick.b === fact.b;
    markup += square(
      row,
      col,
      `fm ${status}${inSet.has(key) ? "" : " out"}${picked ? " cur" : ""}`,
      /* subtraction and division show the number they start from; the others their answer */
      op === "sub" || op === "div" ? fact.a : factAnswer(fact),
      ` data-a="${fact.a}" data-b="${fact.b}" role="button" tabindex="0" aria-label="${factText(fact)}, ${status}"`,
    );
  });
  return svgWrap(
    (colNums.length + 1) * cellSize + 4,
    (rowNums.length + 1) * cellSize + 4,
    markup,
    `Fact map: ${rowNums.length} by ${colNums.length} ${FACT_OPS[op].name.toLowerCase()} facts, colored by how well each is known`,
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
    `<div class="fb info"><p><b>${factFull(mapPick)}</b> · ${STATUS_WORD[status]}` +
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
/* the number pad for typing an answer: 1 to 9, then delete, 0, and Go */
const PAD =
  `<div class="typed" id="typed" aria-live="polite">?</div><div class="pad">` +
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-key="${n}">${n}</button>`).join("") +
  `<button type="button" data-key="del" aria-label="Delete">⌫</button><button type="button" data-key="0">0</button><button type="button" class="go" data-key="go">Go</button></div>`;
/* deal the next fact, and its four answers or the number pad */
function nextFact() {
  const dealt = play.picker.next(),
    /* hide a number instead of the answer when the setup says to, and the fact still has one answer */
    hide = mine.show === "missing" || (mine.show === "mix" && R(0, 1)) ? pick(["a", "b"]) : null,
    fact = { ...dealt, ask: askable(dealt, hide) ? hide : null };
  play.fact = fact;
  play.done = false;
  play.hinted = false;
  play.typed = "";
  $("fact").textContent = factPrompt(fact);
  $("choices").className = mine.input === "type" ? "typing" : "choices fchoices";
  $("choices").innerHTML =
    mine.input === "type"
      ? PAD
      : factChoices(fact)
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
    right = factValue(fact),
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
  /* typed: the answer box turns green or red; picked: the right choice turns green, a wrong pick red */
  if (mine.input === "type") {
    $("typed").classList.add(ok ? "yes" : "no");
    $("choices")
      .querySelectorAll("[data-key]")
      .forEach((b) => (b.disabled = true));
  }
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
    $("feedback").innerHTML = `<div class="fb good"><h4>Yes! ${factFull(fact)}</h4></div>`;
    play.timer = setTimeout(nextFact, 700);
  } else {
    $("feedback").innerHTML =
      `<div class="fb bad"><h4>${factFull(fact)}</h4>` +
      (mine.input === "type" ? `<p>You typed ${value}.</p>` : "") +
      `<p>${help.text}</p>` +
      (help.fig ? `<div class="fig">${help.fig}</div>` : "") +
      `<p>It’ll come back soon.</p><button type="button" class="btn" id="nextBtn">Next fact →</button></div>`;
    $("nextBtn").onclick = nextFact;
    $("nextBtn").focus();
  }
}
$("choices").addEventListener("click", (e) => {
  const b = e.target.closest(".choice"),
    key = e.target.closest("[data-key]");
  if (b && !b.disabled) answer(+b.dataset.v);
  if (key && !key.disabled) typeKey(key.dataset.key);
});
/* a key on the number pad (or keyboard): a digit (at most 3), 'del', or 'go' to check a typed answer */
function typeKey(key) {
  if (!play || play.done || mine.input !== "type") return;
  if (key === "go") {
    if (play.typed) answer(+play.typed);
    return;
  }
  if (key === "del") play.typed = play.typed.slice(0, -1);
  else if (play.typed.length < 3) play.typed = play.typed === "0" ? key : play.typed + key;
  $("typed").textContent = play.typed || "?";
}
/* a keyboard types too: digits, Backspace, and Enter (only while a fact is waiting for its answer) */
document.addEventListener("keydown", (e) => {
  if ($("play").hidden || !play || play.done || mine.input !== "type") return;
  if (/^[0-9]$/.test(e.key)) typeKey(e.key);
  else if (e.key === "Backspace") typeKey("del");
  else if (e.key === "Enter") {
    e.preventDefault();
    typeKey("go");
  } else return;
  e.preventDefault();
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
    ? `<p class="fnote">Facts to work on:</p><p class="worklist">${work.map((f) => `<span>${factFull(f)}</span>`).join("")}</p>`
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
