/* Numbers and pictures that Grade 5 Unit 5's game and its Learn pages both use: decimals to thousandths. Numbers are kept as
   whole numbers of thousandths (k), so they add and compare exactly. Styles are in figs.css. Needs util.js (range),
   figures.js (svgWrap), blocks.js (numWords), numlines.js (numLine), and fractions.js (strips).

   dec(k)                            k thousandths written as a decimal, as short as it goes: 325 → "0.325", 1250 → "1.25"
   placesOf(k), decWords(k)          how many places after the point k needs (320 → 2), and k in words ("four and thirty-six thousandths")
   thousandthsFig(k)                 a hundred grid with k thousandths shaded, and the next hundredth blown up into 10 thousandths (svg)
   thouLine(lo, hi, step, options)   a number line from lo to hi thousandths with a tick every `step` (svg); options go to numLine
   roundFig(k, unit)                 k between the multiples of unit (1000, 100, or 10 thousandths) below and above it (svg)
   tenthsFig(k, grp, label)          k tenths in strips of 10, in groups of grp (svg) */

/* k thousandths as a decimal, as short as it goes */
const dec = (k) => String(+(k / 1000).toFixed(3));
/* how many places after the point k thousandths needs: 300 → 1, 320 → 2, 325 → 3 */
const placesOf = (k) => (k % 10 ? 3 : k % 100 ? 2 : k % 1000 ? 1 : 0);
/* k thousandths in words, read to its last place: 2,047 → "two and forty-seven thousandths" */
function decWords(k) {
  const whole = Math.floor(k / 1000),
    places = placesOf(k),
    part = (k % 1000) / 10 ** (3 - places),
    name = ["", "tenths", "hundredths", "thousandths"][places];
  if (!places) return numWords(whole);
  return `${whole ? `${numWords(whole)} and ` : ""}${numWords(part)} ${part === 1 ? name.slice(0, -1) : name}`;
}

/* A hundred grid (1 whole) with k thousandths shaded: whole hundredths gold, and beside it the next hundredth blown up into 10
   thin thousandths, the leftover ones cyan, with dashed lines from the small square to the big one. */
function thousandthsFig(k, { label } = {}) {
  /* the grid: 10 columns (tenths) of 10 squares (hundredths), each cell pixels; the blow-up is zoom pixels on a side */
  const cell = 22,
    margin = 6,
    gap = 54,
    zoom = 10 * cell,
    full = Math.floor(k / 10),
    extra = k % 10,
    zoomX = margin + 10 * cell + gap;
  let markup = "";
  range(100).forEach((i) => {
    const x = margin + Math.floor(i / 10) * cell,
      y = margin + (i % 10) * cell;
    markup += `<rect class="hg${i < full ? " a" : i === full && extra ? " zm" : ""}" x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
  });
  markup +=
    range(9)
      .map(
        (i) =>
          `<line class="hgt" x1="${margin + (i + 1) * cell}" y1="${margin}" x2="${margin + (i + 1) * cell}" y2="${margin + 10 * cell}"/>`,
      )
      .join("") + `<rect class="hgw" x="${margin}" y="${margin}" width="${10 * cell}" height="${10 * cell}"/>`;
  /* the blow-up of the next hundredth (the one after the shaded ones), cut into 10 thousandths */
  if (full < 100) {
    const smallX = margin + Math.floor(full / 10) * cell,
      smallY = margin + (full % 10) * cell;
    markup +=
      `<line class="zl" x1="${smallX + cell}" y1="${smallY}" x2="${zoomX}" y2="${margin}"/>` +
      `<line class="zl" x1="${smallX + cell}" y1="${smallY + cell}" x2="${zoomX}" y2="${margin + zoom}"/>`;
    range(10).forEach((j) => {
      markup += `<rect class="hg${j < extra ? " b" : ""}" x="${zoomX + j * (zoom / 10)}" y="${margin}" width="${zoom / 10}" height="${zoom}"/>`;
    });
    markup += `<rect class="hgw" x="${zoomX}" y="${margin}" width="${zoom}" height="${zoom}"/>`;
  }
  return svgWrap(
    zoomX + zoom + margin,
    zoom + 2 * margin,
    markup,
    label || `${dec(k)}: ${full} hundredths shaded and ${extra} thousandths in the blown-up square`,
  );
}

/* a number line in thousandths from lo to hi, a tick every `step`, about 380 pixels long; every tenth tick is tall and numbered */
const thouLine = (lo, hi, step, options = {}) =>
  numLine(lo, hi, {
    u: 380 / (hi - lo),
    step,
    big: step * 10,
    pad: 30,
    fmt: dec,
    ...options,
  });

/* k on a number line from the multiple of unit below it to the one above (unit 1000 for wholes, 100 for tenths, 10 for
   hundredths), in 10 ticks, with the halfway point numbered */
function roundFig(k, unit, { label } = {}) {
  const below = Math.floor(k / unit) * unit,
    tick = unit / 10;
  return numLine(0, 10, {
    u: 36,
    step: 1,
    big: 5,
    pad: 40,
    fmt: (v) => dec(below + v * tick),
    pts: [{ v: (k - below) / tick, t: dec(k) }],
    label:
      label ||
      `Number line from ${dec(below)} to ${dec(below + unit)}, with ${dec(below + unit / 2)} halfway and a point at ${dec(k)}`,
  });
}

/* k tenths shaded in strips of 10 (one strip a whole), in groups of grp so equal groups show */
const tenthsFig = (k, grp, label) =>
  strips([{ d: 10, k, grp, parts: false }], {
    wholes: Math.max(1, Math.ceil(k / 10)),
    label: label || `${k} tenths in groups of ${grp}`,
  });
