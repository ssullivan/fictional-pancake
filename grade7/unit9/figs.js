/* The pictures and number formats that Grade 7 Unit 9's game (Grand Opening) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label styles.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   money(n)                                 dollars as written: $12 or $4.50
   roomFig(w, h, {tables, unit, label})     a floor plan: a rectangle w by h (drawing units) with its sides labeled (unless
                                            unit is null), and some round tables inside (svg)
   wheelFig(circ, clicks, {label})          a trundle wheel: its circumference, and how many times it clicked (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* dollars as written: $12 or $4.50 */
const money = (n) => {
  const cents = Math.round(n * 100);
  return "$" + (cents % 100 ? (cents / 100).toFixed(2) : fmt(cents / 100));
};

/* A floor plan: a w by h rectangle (in the drawing's units, cmPx pixels each), its sides labeled with `unit`, and `tables`
   round tables spread over a grid inside. */
function roomFig(w, h, { tables = 0, unit = "cm", cmPx = 30, label } = {}) {
  const left = 40,
    top = 20,
    width = w * cmPx,
    height = h * cmPx,
    perRow = Math.max(1, Math.round(Math.sqrt((tables * w) / h))),
    rows = Math.ceil(tables / perRow);
  let markup = `<rect class="room" x="${left}" y="${top}" width="${width}" height="${height}"/>`;
  /* the sides' lengths, unless unit is null (a picture of the room, not to scale) */
  if (unit !== null)
    markup +=
      `<text class="lbl s" x="${left + width / 2}" y="${top + height + 18}">${fmt(w)} ${unit}</text>` +
      `<text class="lbl s en" x="${left - 8}" y="${top + height / 2}">${fmt(h)} ${unit}</text>`;
  range(tables).forEach((i) => {
    const col = i % perRow,
      row = Math.floor(i / perRow);
    markup += `<circle class="table" cx="${left + ((col + 0.5) * width) / perRow}" cy="${top + ((row + 0.5) * height) / rows}" r="${Math.min(12, (0.3 * width) / perRow)}"/>`;
  });
  return svgWrap(left + width + 20, top + height + 32, markup, label || `A floor plan ${w} by ${h} ${unit}`);
}

/* A trundle wheel: a wheel on a handle that clicks once a turn. circ is its circumference as written; clicks how many times
   it clicked. */
function wheelFig(circ, clicks, { label } = {}) {
  const cx = 70,
    cy = 80,
    radius = 50;
  const markup =
    `<line class="handle" x1="${cx}" y1="${cy}" x2="${cx + 80}" y2="${cy - 70}"/>` +
    `<circle class="wheel" cx="${cx}" cy="${cy}" r="${radius}"/><circle class="tr-pin" cx="${cx}" cy="${cy}" r="5"/>` +
    `<line class="ground" x1="0" y1="${cy + radius}" x2="300" y2="${cy + radius}"/>` +
    `<text class="lbl s st" x="${cx + radius + 16}" y="${cy + 10}">around: ${circ}</text>` +
    `<text class="lbl s st gd" x="${cx + radius + 16}" y="${cy + 34}">${fmt(clicks)} clicks</text>`;
  return svgWrap(300, cy + radius + 12, markup, label || `A trundle wheel ${circ} around, ${clicks} clicks`);
}
