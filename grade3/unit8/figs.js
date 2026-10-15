/* Pictures that Grade 3 Unit 8's game and its Learn pages both use. Needs figures.js (svgWrap) and pictures.js (frT).
   Styles are in figs.css.

   guessStrip(k, d, {cut, W, label})   a strip with k/d of it shaded and no lines to count, for estimating; cut: lines every
                                       1/cut (svg)
   stripStack(list, {tap, W})          strips like guessStrip, one under another, lettered A, B, C; tap: each is a tap answer (svg)
   guessLine(k, d, wholes, {cut, label})   a number line from 0 to `wholes` with a dot at k/d, ticked only at whole numbers;
                                       cut: a tick every 1/cut too (svg)
   HOUSES                              tiny houses: how wide and how long their floors are, in feet
   floorPlan(wide, rooms, {names, ask, inside, label})   a floor plan: rooms side by side, `wide` feet from front to back,
                                       with each room's length on top (svg) */
/* the parts of a strip guessStrip and stripStack draw: how tall it is, and how much room its letter gets */
const STRIP = { h: 50, letterW: 30 };
/* One strip at x, y, `width` long, with k/d of it shaded and lines every 1/cut (none when cut is 0) (markup). */
function stripAt(x, y, width, k, d, cut) {
  const shadedW = (width * k) / d;
  let markup =
    `<rect class="fs" x="${x}" y="${y}" width="${width}" height="${STRIP.h}"/>` +
    `<rect class="fs on" x="${x}" y="${y}" width="${shadedW}" height="${STRIP.h}"/>`;
  /* the cut lines are dashed, so they read as drawn on top, not as the strip's own parts */
  range(Math.max(0, cut - 1)).forEach((i) => {
    const lineX = x + (width * (i + 1)) / cut;
    markup += `<line class="gcut" x1="${lineX}" y1="${y - 4}" x2="${lineX}" y2="${y + STRIP.h + 4}"/>`;
  });
  return markup;
}
/* A strip with k/d of it shaded and no lines to count: a picture to estimate from. cut: draw lines every 1/cut. */
function guessStrip(k, d, { cut = 0, W = 480, label } = {}) {
  return svgWrap(
    W,
    STRIP.h + 12,
    stripAt(6, 6, W - 12, k, d, cut),
    label || `A strip with part of it shaded${cut ? `, cut into ${cut} equal parts` : ""}`,
  );
}
/* Strips one under another, lettered A, B, C: list [[k, d], …], each with k/d shaded. tap: each strip is a tap answer for
   engine.js (.cand, data-id = its index). cut: lines every 1/d on each strip (to check a guess). */
function stripStack(list, { tap = false, cut = false, W = 480 } = {}) {
  const rowH = STRIP.h + 16,
    stripW = W - STRIP.letterW - 10;
  let markup = "";
  list.forEach(([k, d], i) => {
    const y = 8 + i * rowH;
    markup +=
      `<text class="lbl" x="${STRIP.letterW / 2}" y="${y + STRIP.h / 2}">${"ABCD"[i]}</text>` +
      stripAt(STRIP.letterW, y, stripW, k, d, cut ? d : 0);
    if (tap)
      markup += `<rect class="cand hit" data-id="${i}" tabindex="0" role="button" aria-label="Strip ${"ABCD"[i]}" x="2" y="${y - 6}" width="${W - 4}" height="${STRIP.h + 12}" rx="8"/>`;
  });
  return svgWrap(W, 8 + list.length * rowH, markup, `${list.length} strips, each with part of it shaded`);
}
/* A number line from 0 to `wholes` with a dot at k/d, ticked only at the whole numbers: a picture to estimate from.
   cut: a short tick every 1/cut too. */
function guessLine(k, d, wholes, { cut = 0, W = 480, label } = {}) {
  /* the line runs from `left` to W − left; xOf(v): where v (in wholes) is */
  const left = 26,
    y = 30,
    wholeW = (W - 2 * left) / wholes,
    xOf = (v) => left + v * wholeW;
  let markup = `<line class="axis" x1="${xOf(0) - 6}" y1="${y}" x2="${xOf(wholes) + 6}" y2="${y}"/>`;
  range(wholes + 1).forEach((whole) => {
    markup +=
      `<line class="tick" x1="${xOf(whole)}" y1="${y - 11}" x2="${xOf(whole)}" y2="${y + 11}"/>` +
      `<text class="lbl" x="${xOf(whole)}" y="${y + 26}">${whole}</text>`;
  });
  /* the cut ticks between the whole numbers */
  if (cut)
    range(cut * wholes)
      .filter((i) => i % cut)
      .forEach((i) => {
        markup += `<line class="tick" x1="${xOf(i / cut)}" y1="${y - 7}" x2="${xOf(i / cut)}" y2="${y + 7}"/>`;
      });
  markup += `<circle class="pt" cx="${xOf(k / d)}" cy="${y}" r="8"/>`;
  return svgWrap(
    W,
    y + 42,
    markup,
    label || `A number line from 0 to ${wholes} with a point on it${cut ? `, cut into ${PART[cut][1]}` : ""}`,
  );
}

/* tiny houses (IM Lesson 4): the floor's width (front to back) and length, in feet; cabins have a loft upstairs too */
const HOUSES = {
  container: { name: "shipping container", wide: 8, long: 20 },
  bus: { name: "school bus", wide: 7, long: 14 },
  cabin: { name: "cabin", wide: 8, long: 10 },
};
/* A tiny house's floor plan: rooms side by side, `wide` feet from front to back. rooms: each room's length, left to right.
   names: each room's name, written inside it (7 letters at most, so it fits a room 4 feet long). ask: the index of a room
   whose length is written ?. inside: text under a room's name (like its area), or null. The width is written on the left. */
function floorPlan(wide, rooms, { names = [], ask = -1, inside = [], label } = {}) {
  /* a foot is up to 30 pixels, smaller to fit 420 long and 220 wide; the width's number takes `left`, the lengths `top` */
  const long = rooms.reduce((sum, len) => sum + len, 0),
    foot = Math.min(30, 420 / long, 220 / wide),
    left = 40,
    top = 34,
    h = wide * foot;
  let markup = "",
    x = left;
  rooms.forEach((len, i) => {
    const w = len * foot,
      midX = x + w / 2,
      midY = top + h / 2,
      asked = i === ask;
    markup +=
      `<rect class="apart${i % 2 ? " b" : ""}" x="${x}" y="${top}" width="${w}" height="${h}"/>` +
      `<text class="lbl${asked ? " cy" : ""}" x="${midX}" y="${top - 16}">${asked ? "?" : len}</text>`;
    if (names[i]) markup += `<text class="lbl s" x="${midX}" y="${inside[i] ? midY - 11 : midY}">${names[i]}</text>`;
    if (inside[i])
      markup += `<text class="lbl s cy" x="${midX}" y="${names[i] ? midY + 11 : midY}">${inside[i]}</text>`;
    /* a wall between this room and the next */
    if (i < rooms.length - 1) markup += `<line class="wall" x1="${x + w}" y1="${top}" x2="${x + w}" y2="${top + h}"/>`;
    x += w;
  });
  markup +=
    `<rect class="plan" x="${left}" y="${top}" width="${long * foot}" height="${h}"/>` +
    `<text class="lbl en" x="${left - 10}" y="${top + h / 2}">${wide}</text>`;
  return svgWrap(
    left + long * foot + 8,
    top + h + 8,
    markup,
    label ||
      `A floor plan ${wide} by ${long}${rooms.length > 1 ? `, with rooms ${rooms.map((len, i) => (i === ask ? "?" : len)).join(", ")} long` : ""}`,
  );
}
