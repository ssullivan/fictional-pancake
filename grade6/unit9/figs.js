/* The counting and pictures that Grade 6 Unit 9's game (Town Hall) and its Learn pages both use. Styles are in figs.css.
   Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label styles and figures.css for tables.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   squaresOf(w, h)                          the squares that cut up a w by h rectangle, the largest possible each time:
                                            [{x, y, side, rest}] from the top left, where rest is the rectangle left after it
   squareCuts(w, h)                         the same squares grouped by size: [{side, count}], largest first; the last side is
                                            the greatest common factor of w and h
   cutFig(w, h, {…})                        the rectangle with its first squares cut off and labeled (svg)
   majorityOf(total)                        the fewest votes that are more than half
   countVotes(groups, still)                each choice's votes when every group votes for its first choice still in
   pluralityOf, runoffOf, pointsOf (groups, choices)   who wins by most first choices, by a runoff, and by instant runoff
                                            (points for each place); the winner is null on a tie
   winnerBy(groups, choices, method)        the winner by 'plurality', 'runoff', or 'points'
   ballotTable(groups, names, {…})          each group's choices in order, one column per group (html)
   infoTable(heads, rows, label)            a small table: a heading row, then a row for each item (html)
   classFig(n, k, {…})                      n people in rows, k of them gold, or k of every group (svg)
   nestBars(levels, {…})                    bars inside bars: a whole, then a part of it, then a part of that (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

/* ---------- squares in a rectangle (Lesson 3) ---------- */
/* Cut the largest square off the end of the rectangle, then do the same to the rectangle that's left, until nothing is left.
   Each square's side is the shorter side of the rectangle it was cut from. */
function squaresOf(w, h) {
  const squares = [];
  let x = 0,
    y = 0,
    width = w,
    height = h;
  while (width > 0 && height > 0) {
    const side = Math.min(width, height),
      square = { x, y, side };
    /* a wide rectangle loses a square from its left end, a tall one from its top */
    if (width >= height) {
      x += side;
      width -= side;
    } else {
      y += side;
      height -= side;
    }
    square.rest = { x, y, w: width, h: height };
    squares.push(square);
  }
  return squares;
}
/* the squares grouped by size, in the order they were cut */
function squareCuts(w, h) {
  const sizes = [];
  squaresOf(w, h).forEach(({ side }) => {
    const last = sizes[sizes.length - 1];
    if (last && last.side === side) last.count++;
    else sizes.push({ side, count: 1 });
  });
  return sizes;
}
/* A w by h rectangle with its sides labeled and its first `shown` squares cut off, each labeled with its side when there's
   room. The rectangle still left is dashed. maxW, maxH: the most room the picture takes; label: what a screen reader says. */
function cutFig(w, h, { shown = Infinity, maxW = 440, maxH = 220, label } = {}) {
  const squares = squaresOf(w, h).slice(0, shown),
    scale = Math.min(maxW / w, maxH / h),
    left = 34,
    top = 30,
    sizes = [...new Set(squaresOf(w, h).map((s) => s.side))];
  /* the outline, with the width above it and the height to its left */
  let markup =
    `<rect class="cut-out" x="${left}" y="${top}" width="${w * scale}" height="${h * scale}"/>` +
    `<text class="lbl" x="${left + (w * scale) / 2}" y="${top - 14}">${w}</text>` +
    `<text class="lbl en" x="${left - 8}" y="${top + (h * scale) / 2}">${h}</text>`;
  /* each square cut so far, shaded by its size, with its side written inside when it's at least 24 pixels across */
  squares.forEach(({ x, y, side }) => {
    const px = side * scale,
      shade = sizes.indexOf(side) % 4;
    markup += `<rect class="cut-sq c${shade}" x="${left + x * scale}" y="${top + y * scale}" width="${px}" height="${px}"/>`;
    if (px >= 24)
      markup += `<text class="lbl${px < 40 ? " s" : ""}" x="${left + (x + side / 2) * scale}" y="${top + (y + side / 2) * scale}">${side}</text>`;
  });
  /* the rectangle still left after the last square shown */
  const rest = squares.length ? squares[squares.length - 1].rest : { x: 0, y: 0, w, h };
  if (squares.length && rest.w > 0 && rest.h > 0)
    markup += `<rect class="cut-rest" x="${left + rest.x * scale}" y="${top + rest.y * scale}" width="${rest.w * scale}" height="${rest.h * scale}"/>`;
  return svgWrap(
    left + w * scale + 10,
    top + h * scale + 10,
    markup,
    label || `A ${w} by ${h} rectangle, ${squares.length} squares cut`,
  );
}

/* ---------- counting votes (Lessons 4–6) ---------- */
/* A group is {n, rank, name?}: n voters who all rank the choices the same way, first choice first (rank: ['B', 'A', 'C']).
   Choices are ids; the page names them. */
/* more than half: half of an even number, plus 1; half of an odd number, rounded up */
const majorityOf = (total) => Math.floor(total / 2) + 1;
const votersIn = (groups) => groups.reduce((s, g) => s + g.n, 0);
/* {choice: votes} when every group votes for its highest-ranked choice that's still in */
function countVotes(groups, still) {
  const counts = Object.fromEntries(still.map((c) => [c, 0]));
  groups.forEach((g) => (counts[g.rank.find((c) => still.includes(c))] += g.n));
  return counts;
}
/* the one choice with the most (or, with least, the fewest), or null when two share it */
function onlyBest(counts, least = false) {
  const values = Object.values(counts),
    best = least ? Math.min(...values) : Math.max(...values),
    winners = Object.keys(counts).filter((c) => counts[c] === best);
  return winners.length === 1 ? winners[0] : null;
}
/* Plurality: the most first choices wins, majority or not. */
function pluralityOf(groups, choices) {
  const counts = countVotes(groups, choices);
  return { counts, winner: onlyBest(counts) };
}
/* Runoff: if no choice has a majority, leave out the one with the fewest votes and vote again, each group voting for its
   highest choice still in. rounds: [{still, counts, out}], out being the choice left out after that round. */
function runoffOf(groups, choices) {
  const need = majorityOf(votersIn(groups)),
    rounds = [];
  let still = choices.slice();
  for (;;) {
    const counts = countVotes(groups, still),
      leader = onlyBest(counts);
    if (leader && counts[leader] >= need) {
      rounds.push({ still, counts, out: null });
      return { rounds, winner: leader };
    }
    const out = onlyBest(counts, true);
    rounds.push({ still, counts, out });
    /* a tie for last place (or a tie between the last two) has no fair way out */
    if (!out || still.length === 2) return { rounds, winner: null };
    still = still.filter((c) => c !== out);
  }
}
/* Instant runoff, IM's way: each voter gives points for every place, 0 for last, 1 for next to last, and so on up; the most
   points wins. */
function pointsOf(groups, choices) {
  const counts = Object.fromEntries(choices.map((c) => [c, 0]));
  groups.forEach((g) => g.rank.forEach((c, place) => (counts[c] += g.n * (choices.length - 1 - place))));
  return { counts, winner: onlyBest(counts) };
}
const METHODS = { plurality: pluralityOf, runoff: runoffOf, points: pointsOf };
const winnerBy = (groups, choices, method) => METHODS[method](groups, choices).winner;
/* The ballots as a table: a row for each group (how many voters, and its name if it has one) and a column for each place,
   1st choice first. out: choices left out, crossed off; mark: draw each group's vote (its highest choice still in) in gold. */
function ballotTable(groups, names, { out = [], mark = false } = {}) {
  const places = ["1st", "2nd", "3rd", "4th"].slice(0, groups[0].rank.length),
    rows = groups.map((g) => {
      const vote = g.rank.find((c) => !out.includes(c)),
        cells = g.rank.map((choice) => {
          const cls = out.includes(choice) ? "out" : mark && choice === vote ? "vote" : "";
          return `<td class="${cls}">${names[choice]}</td>`;
        });
      return `<tr><th>${g.name ? `${g.name}<br>` : ""}${g.n}</th>${cells.join("")}</tr>`;
    });
  return (
    `<div class="bt-wrap"><table class="rt bt" aria-label="Ranked ballots">` +
    `<thead><tr><th>voters</th>${places.map((place) => `<th>${place}</th>`).join("")}</tr></thead>` +
    `<tbody>${rows.join("")}</tbody></table></div>`
  );
}

/* a small table: a heading row, then one row per item (each a list of cells); label: what a screen reader says (html) */
const infoTable = (heads, rows, label) =>
  `<div class="bt-wrap"><table class="rt it" aria-label="${label}"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead>` +
  `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- people (Lesson 2) and parts of parts (Lesson 4) ---------- */
/* n people as dots in rows of perRow, the first k gold (the rest dim). group: set the dots in groups of that many, with a gap
   between groups (rows hold as many whole groups as fit in perRow); eachGroup: the first k of every group are gold, not just
   the first k. label: what a screen reader says. */
function classFig(n, k, { perRow = 10, group = 1, eachGroup = false, label } = {}) {
  const cell = 26,
    pad = 4,
    gap = group > 1 ? 10 : 0,
    groupsPerRow = Math.max(1, Math.floor(perRow / group)),
    rowLength = groupsPerRow * group,
    rows = Math.ceil(n / rowLength),
    /* a dot's x: its place in the row, plus a gap before each group */
    dotX = (place) => pad + cell * place + gap * Math.floor(place / group) + cell / 2;
  const markup = range(n)
    .map((i) => {
      const gold = eachGroup ? i % group < k : i < k,
        cy = pad + cell * Math.floor(i / rowLength) + cell / 2;
      return `<circle class="pp${gold ? " on" : ""}" cx="${dotX(i % rowLength)}" cy="${cy}" r="${cell / 2 - 3}"/>`;
    })
    .join("");
  const width = pad * 2 + cell * Math.min(n, rowLength) + gap * (Math.ceil(Math.min(n, rowLength) / group) - 1);
  return svgWrap(width, pad * 2 + cell * rows, markup, label || `${k} of ${n} people`);
}
/* Bars inside bars, one under another: levels [{name, part, note?}] where part is the fraction of the bar above it (1 for
   the whole). Each bar starts at the left, is that part of the one above, and shows its percent of the whole at its end, or
   its note instead when it has one ('' for nothing, '?' for the one to find). label: what a screen reader says. */
function nestBars(levels, { label } = {}) {
  const barW = 400,
    left = 8,
    rowH = 56,
    barH = 24;
  let whole = 1,
    markup = "";
  levels.forEach(({ name, part, note }, i) => {
    whole *= part;
    const y = 22 + i * rowH,
      width = Math.max(2, barW * whole),
      end = note === undefined ? `${fmt(whole * 100)}%` : note;
    markup +=
      `<text class="lbl s st dm" x="${left}" y="${y - 10}">${name}</text>` +
      `<rect class="nest n${i % 4}" x="${left}" y="${y}" width="${width}" height="${barH}"/>`;
    if (end) markup += `<text class="lbl s st gd" x="${left + width + 8}" y="${y + barH / 2}">${end}</text>`;
  });
  return svgWrap(barW + 90, 22 + levels.length * rowH - 20, markup, label || "Bars inside bars");
}
