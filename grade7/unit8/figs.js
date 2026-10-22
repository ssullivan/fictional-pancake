/* The pictures and number formats that Grade 7 Unit 8's game (Carnival of Chance) and its Learn pages both use. Styles are
   in figs.css. Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label styles. Dot plots and
   means come from shared/stats.js, which uses fmt from here.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   COLORS                                   the colors things come in, each with its class for the pictures
   spinnerFig(parts, {label})               a spinner cut into equal sections, colored (svg)
   bagFig(counts, {label})                  a bag of marbles, so many of each color (svg)
   outcomeGrid(hi, {label})                 the 36 outcomes of rolling two number cubes, with some cells marked (svg)
   treeFig(first, second, {hi, label})      a tree diagram: each first outcome branching into each second one (svg)
   likelyLine(p, {label})                   a line from impossible (0) to certain (1), with a dot at p (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* colors: their names and the classes that fill them */
const COLORS = {
  red: "c-red",
  blue: "c-blue",
  green: "c-green",
  yellow: "c-yellow",
  purple: "c-purple",
};

/* A spinner: parts is a list of colors, one for each equal section, going around clockwise from the top; a pointer in the
   middle. */
function spinnerFig(parts, { label } = {}) {
  const size = 200,
    radius = 86,
    cx = size / 2,
    cy = size / 2,
    count = parts.length,
    /* the point on the edge at a fraction t of the way around, clockwise from the top */
    edge = (t) => [cx + radius * Math.sin(2 * Math.PI * t), cy - radius * Math.cos(2 * Math.PI * t)];
  let markup = "";
  parts.forEach((color, i) => {
    const [x1, y1] = edge(i / count),
      [x2, y2] = edge((i + 1) / count);
    markup +=
      count === 1
        ? `<circle class="sp ${COLORS[color]}" cx="${cx}" cy="${cy}" r="${radius}"/>`
        : `<path class="sp ${COLORS[color]}" d="M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 0 1 ${x2},${y2} Z"/>`;
  });
  /* the pointer, pointing up and to the right */
  markup += `<line class="sp-arrow" x1="${cx}" y1="${cy}" x2="${cx + 36}" y2="${cy - 48}"/><circle class="sp-pin" cx="${cx}" cy="${cy}" r="7"/>`;
  return svgWrap(size, size, markup, label || `A spinner with ${count} equal sections: ${parts.join(", ")}`);
}

/* A bag of marbles: counts is {color: how many}, marbles in rows inside a bag. */
function bagFig(counts, { label } = {}) {
  const marbles = Object.entries(counts).flatMap(([color, n]) => Array(n).fill(color)),
    perRow = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(marbles.length * 2)))),
    rows = Math.ceil(marbles.length / perRow),
    gap = 26,
    left = 30,
    top = 40,
    width = perRow * gap + 2 * left,
    height = rows * gap + top + 26;
  let markup = `<path class="bag" d="M${left - 12},${top - 14} Q${width / 2},${top - 30} ${width - left + 12},${top - 14} L${width - left + 18},${height - 12} Q${width / 2},${height + 4} ${left - 18},${height - 12} Z"/>`;
  marbles.forEach((color, i) => {
    const col = i % perRow,
      row = Math.floor(i / perRow);
    markup += `<circle class="marble ${COLORS[color]}" cx="${left + gap / 2 + col * gap}" cy="${top + gap / 2 + row * gap}" r="10"/>`;
  });
  return svgWrap(
    width,
    height + 8,
    markup,
    label ||
      `A bag with ${Object.entries(counts)
        .map(([color, n]) => `${n} ${color}`)
        .join(", ")} marbles`,
  );
}

/* The 36 outcomes of rolling two number cubes in a 6 by 6 table: the first cube down the side, the second across the top.
   hi(a, b): whether the outcome (a, b) is marked. */
function outcomeGrid(hi = () => false, { label = "The 36 outcomes of rolling two number cubes" } = {}) {
  const cell = 34,
    left = 44,
    top = 44;
  let markup = `<text class="lbl s dm" x="${left + 3 * cell}" y="14">second cube</text><text class="lbl s dm" x="14" y="${top + 3 * cell}" transform="rotate(-90 14 ${top + 3 * cell})">first cube</text>`;
  range(6).forEach((i) => {
    markup += `<text class="lbl s" x="${left + i * cell + cell / 2}" y="${top - 12}">${i + 1}</text>`;
    markup += `<text class="lbl s" x="${left - 12}" y="${top + i * cell + cell / 2}">${i + 1}</text>`;
  });
  range(6).forEach((row) =>
    range(6).forEach((col) => {
      const a = row + 1,
        b = col + 1,
        on = hi(a, b);
      markup += `<rect class="oc${on ? " on" : ""}" x="${left + col * cell}" y="${top + row * cell}" width="${cell}" height="${cell}"/>`;
      markup += `<text class="lbl s${on ? "" : " dm"}" x="${left + col * cell + cell / 2}" y="${top + row * cell + cell / 2}">${a + b}</text>`;
    }),
  );
  return svgWrap(left + 6 * cell + 10, top + 6 * cell + 10, markup, label);
}

/* A tree diagram: first is the list of first outcomes, second the list of second ones; every first one branches into every
   second one. hi(f, s): whether that path is marked (gold). The outcomes are listed at the right. */
function treeFig(first, second, { hi = () => false, label } = {}) {
  const leafGap = 30,
    leaves = first.length * second.length,
    height = leaves * leafGap + 20,
    rootX = 20,
    midX = 130,
    leafX = 250,
    rootY = height / 2;
  let markup = `<circle class="tr-node" cx="${rootX}" cy="${rootY}" r="5"/>`;
  first.forEach((f, i) => {
    const groupTop = 10 + i * second.length * leafGap,
      fy = groupTop + (second.length * leafGap) / 2,
      onFirst = second.some((s) => hi(f, s));
    markup += `<line class="tr-br${onFirst ? " on" : ""}" x1="${rootX}" y1="${rootY}" x2="${midX}" y2="${fy}"/>`;
    markup += `<text class="lbl s" x="${midX}" y="${fy - 14}">${f}</text>`;
    second.forEach((s, j) => {
      const sy = groupTop + j * leafGap + leafGap / 2,
        on = hi(f, s);
      markup += `<line class="tr-br${on ? " on" : ""}" x1="${midX}" y1="${fy}" x2="${leafX}" y2="${sy}"/>`;
      markup += `<text class="lbl s st${on ? " gd" : ""}" x="${leafX + 8}" y="${sy}">${s}</text>`;
      markup += `<text class="lbl s dm st" x="${leafX + 70}" y="${sy}">${f}, ${s}</text>`;
    });
  });
  return svgWrap(
    leafX + 170,
    height,
    markup,
    label || `A tree diagram: ${first.length} × ${second.length} = ${leaves} outcomes`,
  );
}

/* A line from 0 (impossible) to 1 (certain), with "equally likely" in the middle, and a dot at probability p. */
function likelyLine(p, { label } = {}) {
  const left = 40,
    lineW = 320,
    y = 40,
    xOf = (v) => left + v * lineW;
  let markup = `<line class="axis" x1="${left}" y1="${y}" x2="${left + lineW}" y2="${y}"/>`;
  [
    [0, "impossible"],
    [0.5, "equally likely"],
    [1, "certain"],
  ].forEach(([v, words]) => {
    markup += `<line class="tick" x1="${xOf(v)}" y1="${y - 8}" x2="${xOf(v)}" y2="${y + 8}"/><text class="lbl s" x="${xOf(v)}" y="${y + 24}">${fmt(v)}</text><text class="lbl s dm" x="${xOf(v)}" y="${y + 44}">${words}</text>`;
  });
  /* "unlikely" and "likely" go a row lower, so they don't run into the words beside them */
  markup += `<text class="lbl s dm" x="${xOf(0.25)}" y="${y + 64}">unlikely</text><text class="lbl s dm" x="${xOf(0.75)}" y="${y + 64}">likely</text>`;
  if (p !== null) markup += `<circle class="pt" cx="${xOf(p)}" cy="${y}" r="9"/>`;
  return svgWrap(left + lineW + 40, y + 76, markup, label || `A probability line with a dot at ${fmt(p)}`);
}
