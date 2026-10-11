/* Quick Pick (facts/practice.html): pick which facts to practice, then answer them for as long as you like, picking one of
   four answers or typing it. The operation comes from the link: practice.html#add, #sub, #mult, #div, or #simp (simplifying
   fractions). Facts, choices, help, and which fact comes next are in facts.js; this file draws the screens and saves progress
   on this device. */
const SAVE_KEY = "facts-save";
/* the operation: 'add', 'sub', 'mult', 'div', or 'simp' */
const op = Object.keys(FACT_OPS).includes(location.hash.slice(1)) ? location.hash.slice(1) : "add";
/* does this operation practice tables (multiplication and division), not sets? */
const byTables = !!FACT_OPS[op].tables;
/* Saved progress for every operation: {add: {set, memory, best, …}, sub, mult: {tables, memory, best, …}, div, simp} */
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
/* the best 1-minute sprint for each set: {setKey: right answers} */
mine.sprint = mine.sprint || {};
/* how long a sprint lasts, in milliseconds */
const SPRINT_MS = 60000;
/* which set is picked, as a key for the sprint bests: "set 20", "tables 2,3,4,5" */
const setKey = () => (byTables ? `tables ${mine.tables.join(",")}` : `set ${mine.set}`);
mine.best = mine.best || 0;
if (byTables) mine.tables = mine.tables || [2, 3, 4, 5];
else mine.set = mine.set || (op === "simp" ? "12" : "20");
/* an example of each way to show a fact, for the "Show facts as" buttons */
const SHOW_EXAMPLES = {
  add: ["7 + 8 = ?", "7 + ? = 15"],
  sub: ["15 − 8 = ?", "15 − ? = 7"],
  mult: ["6 × 7 = ?", "6 × ? = 42"],
  div: ["42 ÷ 6 = ?", "42 ÷ ? = 7"],
  simp: ["6/8 = ?", "6/8 = ?/4"],
};
/* text with every fraction in it ("6/8", "?/4") written stacked; other text is unchanged */
const stack = (text) => String(text).replace(/(\d+|\?)\/(\d+|\?)/g, (match, top, bottom) => fr(top, bottom));
/* the facts picked to practice */
const chosenFacts = () => factsIn(op, byTables ? mine.tables : mine.set);
/* the fact tapped on the map (null before any tap) */
let mapPick = null;

/* ---------- the setup screen ---------- */
function drawSetup() {
  const opInfo = FACT_OPS[op];
  document.title = `${opInfo.name} · Quick Pick · Math Facts`;
  $("opTitle").innerHTML = op === "simp" ? "Simplifying <span>fractions</span>" : `${opInfo.name} <span>facts</span>`;
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
    ["plain", stack(plainExample)],
    ["missing", stack(missingExample)],
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
  $("sprintBtn").disabled = !facts.length;
  const sprintBest = mine.sprint[setKey()];
  $("sprintBest").textContent = !facts.length
    ? ""
    : sprintBest
      ? `Sprint best for these facts: ${sprintBest} right in 1 minute.`
      : "How many can you get right in 1 minute? Try a sprint.";
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
/* The map's layout: the numbers down its left side (rows) and along its top (cols), the fact in the square for row number
   r and column number c (null where there's none), what each square says, and its size.
   Addition: a down the side, b along the top. Subtraction: the number taken away, and the answer. Multiplication: 0 to 12
   both ways. Division: the number divided by (1 to 12), and the answer. Simplifying: the denominator down the side and the
   numerator along the top, a triangle, since the top is smaller; hundredths: tens down the side and ones along the top. */
function mapLayout() {
  if (op === "simp" && mine.set === "100")
    return {
      rows: range(10).map((i) => i * 10),
      cols: range(10),
      factAt: (r, c) => (r + c ? { op, a: r + c, b: 100 } : null),
      text: (fact) => fact.a,
      corner: "/100",
      cellSize: 30,
    };
  if (op === "simp") {
    const most = +mine.set;
    return {
      rows: range(most - 1).map((i) => i + 2),
      cols: range(most - 1).map((i) => i + 1),
      factAt: (r, c) => (c < r ? { op, a: c, b: r } : null),
      text: () => "",
      corner: "/",
      cellSize: most > 12 ? 15 : 28,
    };
  }
  const sides = {
    add: [range(11), range(11)],
    sub: [range(11), range(11)],
    mult: [range(13), range(13)],
    div: [range(12).map((i) => i + 1), range(13)],
  }[op];
  return {
    rows: sides[0],
    cols: sides[1],
    factAt: (r, c) =>
      op === "sub" ? { op, a: r + c, b: r } : op === "div" ? { op, a: r * c, b: r } : { op, a: r, b: c },
    /* subtraction and division show the number they start from; the others their answer */
    text: (fact) => (op === "sub" || op === "div" ? fact.a : factAnswer(fact)),
    corner: FACT_OPS[op].sign,
    cellSize: byTables ? 28 : 32,
  };
}
/* The fact map (svg): each square colored by how well its fact is known, dim when it isn't in the facts picked, and
   outlined when tapped. The top row and left column are the numbers. */
function factMap() {
  const { rows, cols, factAt, text, corner, cellSize } = mapLayout(),
    inSet = new Set(chosenFacts().map(factKey)),
    /* small squares get small numbers */
    textCls = cellSize < 20 ? "lbl xs" : "lbl s",
    cellX = (col) => 2 + (col + 1) * cellSize,
    cellY = (row) => 2 + (row + 1) * cellSize;
  /* a square at row, col with its text (row and col −1 are the headers) */
  const square = (row, col, cls, words, attrs = "") =>
    `<g class="${cls}"${attrs}><rect x="${cellX(col)}" y="${cellY(row)}" width="${cellSize}" height="${cellSize}"/><text class="${textCls}" x="${cellX(col) + cellSize / 2}" y="${cellY(row) + cellSize / 2}">${words}</text></g>`;
  let markup = square(-1, -1, "fh", corner);
  cols.forEach((c, col) => (markup += square(-1, col, "fh", c)));
  rows.forEach((r, row) => (markup += square(row, -1, "fh", r)));
  let squares = 0;
  rows.forEach((r, row) =>
    cols.forEach((c, col) => {
      const fact = factAt(r, c);
      if (!fact) return;
      squares++;
      const key = factKey(fact),
        status = factStatus(mine.memory, key),
        picked = mapPick && factKey(mapPick) === key && mapPick.a === fact.a && mapPick.b === fact.b;
      markup += square(
        row,
        col,
        `fm ${status}${inSet.has(key) ? "" : " out"}${picked ? " cur" : ""}`,
        text(fact),
        ` data-a="${fact.a}" data-b="${fact.b}" role="button" tabindex="0" aria-label="${factText(fact)}, ${status}"`,
      );
    }),
  );
  return svgWrap(
    (cols.length + 1) * cellSize + 4,
    (rows.length + 1) * cellSize + 4,
    markup,
    `Fact map: ${squares} ${FACT_OPS[op].name.toLowerCase()} facts, colored by how well each is known`,
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
    `<div class="fb info"><p><b>${stack(factFull(mapPick))}</b> · ${STATUS_WORD[status]}` +
    (m ? ` (right ${m.r}, missed ${m.w})` : "") +
    `</p><p>${stack(factHelp(mapPick).text)}</p><button type="button" class="btn" id="practiceOne">Practice this fact</button></div>`;
  $("practiceOne").onclick = () => startPlay({ focus: factKey(mapPick) });
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
/* Start playing. focus: a fact from the map to practice more often; only: just these facts (the ones missed in a sprint);
   sprint: a 1-minute sprint, with no hints, that ends by itself. */
function startPlay({ focus = null, only = null, sprint = false } = {}) {
  let facts = only || chosenFacts();
  /* a fact from the map that isn't in the picked set joins it */
  if (focus && !facts.some((f) => factKey(f) === focus)) facts = [...facts, mapPick];
  play = {
    picker: makePicker(facts, mine.memory, focus),
    options: { focus, only, sprint },
    right: 0,
    tried: 0,
    streak: 0,
    best: 0,
    missed: new Map(),
  };
  $("setup").hidden = true;
  $("summary").hidden = true;
  $("play").hidden = false;
  $("playTitle").textContent = `${FACT_OPS[op].name} · ${sprint ? "1-minute sprint" : "Quick Pick"}`;
  $("hintBtn").hidden = sprint;
  $("sprintBar").hidden = !sprint;
  if (sprint) {
    play.endsAt = Date.now() + SPRINT_MS;
    play.ticker = setInterval(tickSprint, 200);
    tickSprint();
  }
  nextFact();
}
/* a sprint's clock: the bar and seconds left, and the end of the sprint when they run out */
function tickSprint() {
  const left = Math.max(0, play.endsAt - Date.now());
  $("sprintFill").style.width = `${(left / SPRINT_MS) * 100}%`;
  $("sprintTime").textContent = `${Math.ceil(left / 1000)} seconds`;
  if (!left) finish(true);
}
/* The number pad for typing an answer: 1 to 9, then delete, 0, and Go. fraction: a / key after 0, to go from the top
   number to the bottom one, with Go on a row of its own. */
const padHtml = (fraction) =>
  `<div class="typed" id="typed" aria-live="polite">?</div><div class="pad">` +
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-key="${n}">${n}</button>`).join("") +
  `<button type="button" data-key="del" aria-label="Delete">⌫</button><button type="button" data-key="0">0</button>` +
  (fraction
    ? `<button type="button" data-key="/" aria-label="Fraction bar">/</button><button type="button" class="go wide" data-key="go">Go</button>`
    : `<button type="button" class="go" data-key="go">Go</button>`) +
  `</div>`;
/* does the fact on screen want a fraction typed (a fraction to simplify, with no number hidden)? */
const wantsFraction = () => play.fact.op === "simp" && !play.fact.ask;
/* deal the next fact, and its four answers or the number pad */
function nextFact() {
  if (play.over) return;
  const dealt = play.picker.next(),
    /* hide a number instead of the answer when the setup says to, and the fact still has one answer */
    hide = mine.show === "missing" || (mine.show === "mix" && R(0, 1)) ? pick(["a", "b"]) : null,
    fact = { ...dealt, ask: askable(dealt, hide) ? hide : null };
  play.fact = fact;
  play.done = false;
  play.hinted = false;
  play.typed = "";
  play.choices = mine.input === "type" ? [] : factChoices(fact);
  $("fact").innerHTML = stack(factPrompt(fact));
  $("factNote").textContent = op === "simp" && !fact.ask ? "Write it in simplest form." : "";
  $("choices").className = mine.input === "type" ? "typing" : "choices fchoices";
  $("choices").innerHTML =
    mine.input === "type"
      ? padHtml(wantsFraction())
      : play.choices
          .map((c) => `<button type="button" class="choice" data-v="${c.value}">${stack(c.value)}</button>`)
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
/* Check an answer, picked or typed (as text, "56" or "3/4"): right goes on by itself; wrong shows the answer, why the pick
   was wrong, and how to work it out, with a Next button. */
function answer(value) {
  if (play.done) return;
  const fact = play.fact,
    right = String(factValue(fact)),
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
      if (b.dataset.v === right) b.classList.add("yes");
      else if (b.dataset.v === value) b.classList.add("no");
      b.disabled = true;
    });
  /* why a wrong answer is wrong: the picked choice's reason, or for a typed fraction equal to the right one, that it
     isn't simplest */
  const picked = play.choices.find((c) => String(c.value) === value),
    [top, bottom] = value.split("/").map(Number),
    equalButNot = wantsFraction() && bottom && top * fact.b === bottom * fact.a,
    why = picked
      ? picked.why
      : equalButNot
        ? `${value} is equal to ${factText(fact)}, but not simplest: divide again.`
        : "";
  drawCounts();
  const help = factHelp(fact);
  if (ok) {
    $("feedback").innerHTML = `<div class="fb good"><h4>Yes! ${stack(factFull(fact))}</h4></div>`;
    play.timer = setTimeout(nextFact, play.options.sprint ? 300 : 700);
  } else if (play.options.sprint) {
    /* a sprint keeps going: the right answer for a second, then the next fact */
    $("feedback").innerHTML = `<div class="fb bad"><h4>${stack(factFull(fact))}</h4></div>`;
    play.timer = setTimeout(nextFact, 1000);
  } else {
    $("feedback").innerHTML =
      `<div class="fb bad"><h4>${stack(factFull(fact))}</h4>` +
      (mine.input === "type" ? `<p>You typed ${stack(value)}.</p>` : "") +
      (why ? `<p>${stack(why)}</p>` : "") +
      `<p>${stack(help.text)}</p>` +
      (help.fig ? `<div class="fig">${help.fig}</div>` : "") +
      `<p>It’ll come back soon.</p><button type="button" class="btn" id="nextBtn">Next fact →</button></div>`;
    $("nextBtn").onclick = nextFact;
    $("nextBtn").focus();
  }
}
$("choices").addEventListener("click", (e) => {
  const b = e.target.closest(".choice"),
    key = e.target.closest("[data-key]");
  if (b && !b.disabled) answer(b.dataset.v);
  if (key && !key.disabled) typeKey(key.dataset.key);
});
/* A key on the number pad (or keyboard): a digit (at most 3 in a number), 'del', '/' to go from the top of a fraction to
   the bottom, or 'go' to check what's typed. A 0 on its own is replaced by the next digit. */
function typeKey(key) {
  if (!play || play.done || mine.input !== "type") return;
  const fraction = wantsFraction(),
    [top, bottom] = play.typed.split("/");
  if (key === "go") {
    /* a fraction needs both numbers */
    if (fraction ? top && bottom : play.typed) answer(fraction ? `${+top}/${+bottom}` : String(+play.typed));
    return;
  }
  if (key === "del") play.typed = play.typed.slice(0, -1);
  else if (key === "/") {
    if (fraction && top && bottom === undefined) play.typed += "/";
  } else {
    /* the number being typed: the bottom once / is in, otherwise the top */
    const current = bottom !== undefined ? bottom : top || "";
    if (current.length < 3) play.typed = current === "0" ? play.typed.slice(0, -1) + key : play.typed + key;
  }
  const [nowTop, nowBottom] = play.typed.split("/");
  $("typed").innerHTML = !play.typed ? "?" : nowBottom !== undefined ? fr(nowTop, nowBottom || "?") : play.typed;
}
/* a keyboard types too: digits, Backspace, and Enter (only while a fact is waiting for its answer) */
document.addEventListener("keydown", (e) => {
  if ($("play").hidden || !play || play.done || mine.input !== "type") return;
  if (/^[0-9/]$/.test(e.key)) typeKey(e.key);
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
  $("hint").innerHTML = `<p>${stack(factHint(play.fact))}</p>` + (help.fig ? `<div class="fig">${help.fig}</div>` : "");
  $("hint").hidden = false;
};
/* The end of playing: a summary of this time. finished: a sprint ran its full minute (only then can it be a new best). */
function finish(finished = false) {
  const { sprint } = play.options;
  play.over = true;
  clearTimeout(play.timer);
  clearInterval(play.ticker);
  $("play").hidden = true;
  $("summary").hidden = false;
  $("sumTitle").textContent = `${FACT_OPS[op].name} · ${sprint ? "1-minute sprint" : "Quick Pick"}`;
  if (sprint) {
    const best = mine.sprint[setKey()] || 0,
      newBest = finished && !play.options.only && play.right > best;
    if (newBest) mine.sprint[setKey()] = play.right;
    persist();
    $("sumRight").textContent = `${play.right} right in 1 minute`;
    $("sumMsg").textContent = !finished
      ? "You stopped before the minute was up, so this sprint doesn’t count toward your best."
      : newBest
        ? best
          ? `A new best for these facts! Your last best was ${best}.`
          : "Your first sprint best for these facts!"
        : `Your best for these facts is ${best}.`;
  } else {
    $("sumRight").textContent = play.tried ? `${play.right} of ${play.tried} right` : "See you next time";
    $("sumMsg").textContent = play.tried
      ? `Best streak this time: ${play.best}. Best ever: ${mine.best}.`
      : "You stopped before the first fact.";
  }
  const work = [...play.missed.values()];
  $("sumWork").innerHTML = work.length
    ? `<p class="fnote">Facts to work on:</p><p class="worklist">${work.map((f) => `<span>${stack(factFull(f))}</span>`).join("")}</p>`
    : "";
  $("again").textContent = sprint ? "Sprint again" : "Keep going";
  $("practiceMissed").hidden = !work.length;
  play.work = work.map(({ op: factOp, a, b }) => ({ op: factOp, a, b }));
}
$("stop").onclick = () => finish(false);
$("practiceMissed").onclick = () => startPlay({ only: play.work });
$("again").onclick = () => startPlay(play.options);
$("change").onclick = () => {
  $("summary").hidden = true;
  $("setup").hidden = false;
  drawSetup();
};
$("start").onclick = () => startPlay();
$("sprintBtn").onclick = () => startPlay({ sprint: true });
/* a link to another operation (practice.html#mult) redraws the page for it */
window.addEventListener("hashchange", () => location.reload());
drawSetup();
