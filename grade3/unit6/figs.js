/* Pictures and words that Grade 3 Unit 6's game and its Learn pages both use. Styles are in figs.css. Needs util.js,
   figures.js (svgWrap), pictures.js (fr, frT), measure.js (hm), and numlines.js (numLine).

   inches(fourths), inchesText(fourths)   a length in fourths of an inch, as a whole number and a fraction: "4 1/2" (html with a
                                     stacked fraction, and plain text); halves are written as halves
   inchRuler(length, {obj, tap, label})   a ruler `length` inches long, marked in halves and fourths, with an object on it (svg)
   dialFig(max, step, value, unit)   a scale with a dial from 0 to max, numbered every step, its needle at value (svg)
   beakerFig(max, level, {label})    a container marked in liters from 0 to max, filled to level (svg)
   clockTime(t), timeLine(from, to, {hops, pts, label})   minutes after midnight as a time ("3:05"), and a number line of
                                     times every 5 minutes, labelled every 15, with jumps and points (svg) */

/* ---------- lengths in halves and fourths of an inch ---------- */
/* fourths of an inch as [whole inches, the fraction left over, its denominator]: 18 → [4, 1, 2] (halves stay halves) */
function inchParts(fourths) {
  const whole = Math.floor(fourths / 4),
    rest = fourths % 4;
  return rest === 2 ? [whole, 1, 2] : [whole, rest, 4];
}
/* "4 1/2" with the fraction stacked (html); a whole number of inches is just the number */
const inches = (fourths) => {
  const [whole, rest, d] = inchParts(fourths);
  return !rest ? `${whole}` : whole ? `${whole} ${fr(rest, d)}` : fr(rest, d);
};
/* the same as plain text: "4 1/2" */
const inchesText = (fourths) => {
  const [whole, rest, d] = inchParts(fourths);
  return !rest ? `${whole}` : whole ? `${whole} ${rest}/${d}` : `${rest}/${d}`;
};
/* A ruler `length` whole inches long: a tall mark at each inch (numbered), a middle one at each half, and short ones at the
   fourths. obj: {len, cls} a bar `len` fourths of an inch long lying on it from 0 ('b' blue; gold by default).
   tap: 'cand' makes every fourth-inch mark a tap answer for engine.js (.cand, data-id = how many fourths from 0). */
function inchRuler(length, { obj = null, tap = null, label } = {}) {
  /* inchW: pixels per inch; the ruler is rulerY down, below room for the object */
  const inchW = 56,
    left = 24,
    rulerY = obj ? 50 : 10,
    rulerH = 54,
    xOf = (fourths) => left + (fourths * inchW) / 4;
  let markup = "";
  if (obj)
    markup +=
      `<rect class="mbar${obj.cls ? " " + obj.cls : ""}" x="${xOf(0)}" y="12" width="${xOf(obj.len) - xOf(0)}" height="26" rx="6"/>` +
      `<path class="guide" d="M${xOf(obj.len)},40V${rulerY}"/>`;
  markup += `<rect class="mrul" x="${left - 14}" y="${rulerY}" width="${length * inchW + 28}" height="${rulerH}" rx="4"/>`;
  range(length * 4 + 1).forEach((k) => {
    /* marks hang from the top edge: inches longest, then halves, then fourths */
    const markH = k % 4 === 0 ? 24 : k % 2 === 0 ? 16 : 10,
      x = xOf(k);
    markup += `<line class="mtick" x1="${x}" y1="${rulerY}" x2="${x}" y2="${rulerY + markH}"/>`;
    if (k % 4 === 0) markup += `<text class="lbl s mnum" x="${x}" y="${rulerY + 38}">${k / 4}</text>`;
    if (tap === "cand")
      markup += `<rect class="cand hit" data-id="${k}" tabindex="0" role="button" aria-label="Mark ${k + 1}" x="${x - inchW / 8}" y="${rulerY - 6}" width="${inchW / 4}" height="${rulerH + 6}"/>`;
  });
  return svgWrap(
    left * 2 + length * inchW,
    rulerY + rulerH + 6,
    markup,
    label ||
      `A ruler ${length} inches long, marked in halves and fourths` +
        (obj ? `, with a bar ${inchesText(obj.len)} inches long on it from 0` : ""),
  );
}

/* ---------- weight and liquid volume ---------- */
/* A scale with a half-round dial from 0 to max, a mark every step / 2 and a number every step, and its needle at value.
   unit: written under the dial ("grams", "kilograms"). */
function dialFig(max, step, value, unit) {
  const cx = 160,
    cy = 150,
    r = 120,
    /* the point at v on the dial, dist from the middle: 0 at the left, max at the right, over the top */
    at = (v, dist) => {
      const a = Math.PI - (v / max) * Math.PI;
      return [+(cx + dist * Math.cos(a)).toFixed(1), +(cy - dist * Math.sin(a)).toFixed(1)];
    };
  /* the face is a half circle with a strip under it, so the 0 and the top number sit inside it */
  let markup = `<path class="dial" d="M${cx - r - 14},${cy + 18}V${cy}A${r + 14},${r + 14} 0 0 1 ${cx + r + 14},${cy}V${cy + 18}Z"/>`;
  range((2 * max) / step + 1).forEach((i) => {
    const v = (i * step) / 2,
      numbered = i % 2 === 0,
      [x1, y1] = at(v, r),
      [x2, y2] = at(v, r - (numbered ? 16 : 9));
    /* the numbers at the two ends go a little higher, clear of the strip's edge */
    markup += `<line class="dtick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    if (numbered) {
      const [tx, ty] = at(v, r - 32);
      markup += `<text class="lbl s dnum" x="${tx}" y="${ty - (v === 0 || v === max ? 8 : 0)}">${v}</text>`;
    }
  });
  const [nx, ny] = at(value, r - 10);
  markup +=
    `<line class="needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"/><circle class="clk-c" cx="${cx}" cy="${cy}" r="7"/>` +
    `<text class="lbl s" x="${cx}" y="${cy + 34}">${unit}</text>`;
  return svgWrap(2 * cx, cy + 46, markup, `A scale from 0 to ${max} ${unit}, its needle at ${value} ${unit}`);
}
/* A container marked in liters from 0 to max (a mark every liter), filled with water up to level liters. */
function beakerFig(max, level, { label } = {}) {
  /* literH: pixels per liter, so the container is about 220 tall */
  const literH = Math.min(44, 220 / max),
    left = 70,
    top = 16,
    width = 110,
    bottom = top + max * literH;
  let markup =
    `<rect class="water" x="${left}" y="${bottom - level * literH}" width="${width}" height="${level * literH}"/>` +
    `<path class="beaker" d="M${left},${top - 8}V${bottom}H${left + width}V${top - 8}"/>`;
  range(max + 1).forEach((l) => {
    const y = bottom - l * literH;
    markup +=
      `<line class="btick" x1="${left}" y1="${y}" x2="${left + 18}" y2="${y}"/>` +
      `<text class="lbl s en" x="${left - 8}" y="${y}">${l}</text>`;
  });
  markup += `<text class="lbl s st" x="${left + width + 10}" y="${top + 4}">liters</text>`;
  return svgWrap(
    left + width + 70,
    bottom + 10,
    markup,
    label || `A container marked in liters up to ${max}, with ${level} liters of water`,
  );
}

/* ---------- time ---------- */
/* minutes after midnight as a clock time, from 1:00 to 12:59: 545 → "9:05" */
const clockTime = (t) => hm(((Math.floor(t / 60) + 11) % 12) + 1, t % 60);
/* A number line of times from `from` to `to` (minutes after midnight, multiples of 5): a tick every 5 minutes, taller and
   labelled every 15 (but not right beside a point's time). hops: [{a, b, t}] jumps labelled t; pts: [{v, t}] points with their time under them. */
const timeLine = (from, to, { hops = [], pts = [], label } = {}) =>
  numLine(from, to, {
    u: Math.min(8, 440 / (to - from)),
    step: 5,
    big: 15,
    /* quarter hours get their time, except within 10 minutes of a point's time, which would crowd it */
    lab: (v) => v % 15 === 0 && pts.every((p) => p.t == null || Math.abs(p.v - v) >= 10),
    fmt: clockTime,
    pad: 26,
    hops,
    pts,
    label: label || `A number line of times from ${clockTime(from)} to ${clockTime(to)}`,
  });
