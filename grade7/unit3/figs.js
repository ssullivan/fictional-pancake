/* The pictures and number formats that Grade 7 Unit 3's game (Wheel Works) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label styles.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   piText(c, unit)                          c times π as written: 12π cm, π cm, (1/2)π (html)
   circleFig({…})                           a circle with its center, a radius, a diameter, and other segments, labeled (svg)
   rollFig(turns, {…})                      a wheel rolled along the ground: the track it leaves, one circumference a turn (svg)
   wedgeFig(n, {…})                         a circle cut into n wedges, and the wedges laid head to tail like a parallelogram
                                            (svg)
   pieceFig(kind, r, {…})                   half or a quarter of a circle, with its radius and its straight sides (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* c times π as written: 12π cm, π cm when c is 1 */
const piText = (c, unit = "") => `${c === 1 ? "" : fmt(c)}π${unit ? " " + unit : ""}`;

/* A circle of radius r (in its own units), drawn size pixels across, centered in the picture.
   segs: what to draw from the center or across it: 'radius' (to the right), 'diameter' (across, up and to the left),
   'chord' (a line across that misses the center), 'arc' (part of the edge, thick). Labels for them: {radius, diameter,
   chord, arc} (text). center: draw and letter the center. letters: write A, B, C, … at the ends of the segments, for a
   question about which is which. hi: a segment to draw in gold. label: what a screen reader says. */
function circleFig({
  size = 200,
  segs = ["radius"],
  labels = {},
  center = true,
  letters = false,
  hi = null,
  label,
} = {}) {
  const pad = 40,
    radius = size / 2,
    cx = pad + radius,
    cy = pad + radius,
    width = size + 2 * pad,
    /* a point on the edge at angle a (degrees, counterclockwise from the right) */
    at = (a) => [cx + radius * Math.cos((a * Math.PI) / 180), cy - radius * Math.sin((a * Math.PI) / 180)];
  /* each segment's ends: radius to 0°, diameter from 140° to 320°, chord from 200° to 290° (missing the center) */
  const ENDS = {
    radius: [[cx, cy], at(20)],
    diameter: [at(130), at(310)],
    chord: [at(215), at(285)],
  };
  let markup = `<circle class="cir" cx="${cx}" cy="${cy}" r="${radius}"/>`;
  if (segs.includes("arc")) {
    const [x1, y1] = at(60),
      [x2, y2] = at(110);
    markup += `<path class="arc${hi === "arc" ? " hi" : ""}" d="M${x1},${y1} A${radius},${radius} 0 0 0 ${x2},${y2}"/>`;
  }
  /* letters A, B, C, … go on the ends of the segments in order, the center counted once */
  const used = new Map();
  let next = 0;
  const letterAt = ([x, y]) => {
    const key = `${Math.round(x)},${Math.round(y)}`;
    if (!used.has(key)) used.set(key, String.fromCharCode(65 + next++));
    return used.get(key);
  };
  segs
    .filter((s) => ENDS[s])
    .forEach((s) => {
      const [[x1, y1], [x2, y2]] = ENDS[s];
      markup += `<line class="seg${hi === s ? " hi" : ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      if (labels[s]) {
        /* the label sits beside the segment, off to one side: at its middle, or a quarter of the way along a diameter so
           it stays clear of the center */
        const along = s === "diameter" ? 0.25 : 0.5,
          mx = x1 + (x2 - x1) * along,
          my = y1 + (y2 - y1) * along,
          len = Math.hypot(x2 - x1, y2 - y1),
          nx = (y2 - y1) / len,
          ny = -(x2 - x1) / len,
          side = ny > 0 ? -1 : 1,
          /* a longer label stands farther off, so its ends clear a slanted segment (about 3 pixels a letter) */
          off = 12 + String(labels[s]).length * 3;
        markup += `<text class="lbl s${hi === s ? " gd" : ""}" x="${mx + nx * off * side}" y="${my + ny * off * side}">${labels[s]}</text>`;
      }
      if (letters)
        [
          [x1, y1],
          [x2, y2],
        ].forEach(([x, y]) => {
          const dx = x - cx,
            dy = y - cy,
            away = Math.hypot(dx, dy) || 1,
            /* letters stand off the edge, outward; the center's goes below it */
            [lx, ly] = away < 2 ? [x - 12, y + 16] : [x + (dx / away) * 18, y + (dy / away) * 18];
          markup += `<text class="lbl s vx" x="${lx}" y="${ly}">${letterAt([x, y])}</text>`;
        });
    });
  if (labels.arc) {
    const [x, y] = at(85);
    markup += `<text class="lbl s${hi === "arc" ? " gd" : ""}" x="${x}" y="${y - 16}">${labels.arc}</text>`;
  }
  if (center) markup += `<circle class="ctr" cx="${cx}" cy="${cy}" r="4"/>`;
  return svgWrap(width, width, markup, label || "A circle");
}

/* A wheel of diameter d rolled `turns` turns along the ground, left to right: the track behind it is marked at every
   circumference. turnsShown: how many turns the picture draws (3 by default, so it fits a phone); the rest are dots. unit: for the
   labels. show: label each turn's length (in terms of π). */
function rollFig(turns, { d, unit = "cm", turnsShown = Math.min(turns, 3), show = false, label } = {}) {
  const wheelPx = 36,
    circPx = Math.PI * wheelPx,
    left = 16,
    groundY = wheelPx + 30,
    more = turns > turnsShown,
    trackEnd = left + turnsShown * circPx + (more ? 40 : 0),
    width = trackEnd + wheelPx + 30;
  let markup = `<line class="ground" x1="0" y1="${groundY}" x2="${width}" y2="${groundY}"/>`;
  markup += `<line class="track" x1="${left}" y1="${groundY}" x2="${trackEnd}" y2="${groundY}"/>`;
  range(turnsShown + 1).forEach((i) => {
    const x = left + i * circPx;
    markup += `<line class="tick" x1="${x}" y1="${groundY - 6}" x2="${x}" y2="${groundY + 6}"/>`;
    if (show && i < turnsShown)
      markup += `<text class="lbl s cy" x="${x + circPx / 2}" y="${groundY + 18}">${piText(d, unit)}</text>`;
  });
  if (more) markup += `<text class="lbl" x="${left + turnsShown * circPx + 20}" y="${groundY - 10}">…</text>`;
  /* the wheel at the end of its trip, with a spoke to show it turning */
  const wx = trackEnd + wheelPx / 2,
    wy = groundY - wheelPx / 2;
  markup += `<circle class="cir" cx="${wx}" cy="${wy}" r="${wheelPx / 2}"/><line class="seg" x1="${wx}" y1="${wy}" x2="${wx}" y2="${wy - wheelPx / 2}"/><circle class="ctr" cx="${wx}" cy="${wy}" r="3"/>`;
  markup += `<text class="lbl s" x="${wx}" y="${wy - wheelPx / 2 - 12}">d = ${fmt(d)} ${unit}</text>`;
  markup += `<text class="lbl s dm st" x="${left}" y="${groundY + (show ? 36 : 20)}">${fmt(turns)} turn${turns === 1 ? "" : "s"}</text>`;
  return svgWrap(
    width,
    groundY + (show ? 46 : 30),
    markup,
    label || `A wheel ${d} ${unit} across after ${turns} turns`,
  );
}

/* A circle cut into n wedges (n even), and below it the same wedges laid point up and point down, side by side, which makes
   a shape close to a parallelogram: half the circumference long and the radius tall. show: label those two lengths. */
function wedgeFig(n, { show = true, label } = {}) {
  const radius = 70,
    halfLen = Math.PI * radius,
    width = Math.max(2 * radius + 40, halfLen + 80),
    cx = width / 2,
    cy = radius + 16,
    rowTop = 2 * radius + 60,
    step = (2 * Math.PI) / n,
    /* each wedge's arc is about this wide when it's laid flat */
    base = halfLen / (n / 2),
    left = (width - halfLen - base / 2) / 2;
  let markup = "";
  /* the circle in wedges, every other one shaded */
  range(n).forEach((i) => {
    const a1 = i * step,
      a2 = (i + 1) * step;
    markup += `<path class="wedge${i % 2 ? " alt" : ""}" d="M${cx},${cy} L${cx + radius * Math.cos(a1)},${cy - radius * Math.sin(a1)} A${radius},${radius} 0 0 0 ${cx + radius * Math.cos(a2)},${cy - radius * Math.sin(a2)} Z"/>`;
  });
  /* the wedges laid out: point down (shaded) and point up (unshaded), each a thin triangle with a curved base */
  range(n).forEach((i) => {
    const up = i % 2 === 1,
      x = left + (i * base) / 2,
      bulge = base * 0.12;
    markup += up
      ? `<path class="wedge" d="M${x + base / 2},${rowTop} L${x},${rowTop + radius} Q${x + base / 2},${rowTop + radius + bulge} ${x + base},${rowTop + radius} Z"/>`
      : `<path class="wedge alt" d="M${x},${rowTop} Q${x + base / 2},${rowTop - bulge} ${x + base},${rowTop} L${x + base / 2},${rowTop + radius} Z"/>`;
  });
  if (show) {
    markup += `<text class="lbl s cy" x="${left + halfLen / 2}" y="${rowTop + radius + 22}">half the circumference: πr</text>`;
    markup += `<text class="lbl s cy st" x="${left + halfLen + base / 2 + 8}" y="${rowTop + radius / 2}">r</text>`;
  }
  return svgWrap(
    width,
    rowTop + radius + (show ? 34 : 14),
    markup,
    label || `A circle cut into ${n} wedges, laid out like a parallelogram`,
  );
}

/* Half ('half') or a quarter ('quarter') of a circle of radius r, its straight sides labeled with r (and the diameter for a
   half), drawn size pixels for the radius. show: label the curved edge with its length in terms of π. */
function pieceFig(kind, r, { unit = "cm", size = 110, show = false, label } = {}) {
  /* a quarter's left side is labeled to its left, so it starts farther in */
  const pad = 34,
    half = kind === "half",
    leftPad = half ? pad : pad + 70,
    width = (half ? 2 * size : size) + leftPad + pad + 40,
    height = size + 2 * pad,
    cx = leftPad + (half ? size : 0),
    cy = pad + size;
  /* the curved edge: a half goes from the left end over the top to the right; a quarter from the top round to the right */
  const path = half
    ? `M${cx - size},${cy} A${size},${size} 0 0 1 ${cx + size},${cy} Z`
    : `M${cx},${cy} L${cx},${cy - size} A${size},${size} 0 0 1 ${cx + size},${cy} Z`;
  let markup = `<path class="piece" d="${path}"/><circle class="ctr" cx="${cx}" cy="${cy}" r="3"/>`;
  markup += half
    ? `<text class="lbl s" x="${cx}" y="${cy + 18}">${fmt(2 * r)} ${unit}</text>`
    : `<text class="lbl s" x="${cx + size / 2}" y="${cy + 18}">${fmt(r)} ${unit}</text><text class="lbl s en" x="${cx - 8}" y="${cy - size / 2}">${fmt(r)} ${unit}</text>`;
  if (show) {
    const arcLen = half ? r : r / 2;
    /* a half's curved edge is labeled over its top, and a quarter's outside its middle, up and to the right */
    markup += half
      ? `<text class="lbl s cy" x="${cx}" y="${cy - size - 12}">${piText(arcLen, unit)}</text>`
      : `<text class="lbl s cy st" x="${cx + size * 0.71 + 8}" y="${cy - size * 0.71 - 10}">${piText(arcLen, unit)}</text>`;
  }
  return svgWrap(
    width,
    height + 10,
    markup,
    label || `${half ? "Half" : "A quarter"} of a circle of radius ${r} ${unit}`,
  );
}
