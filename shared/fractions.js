/* Fractions and decimals for K–5 pages: fraction strips, fraction number lines, hundred grids, and rectangles with fraction
   sides on a grid of unit squares (Grade 5). Fractions written stacked
   (fr, frT) and part names (PART) are in pictures.js. Styles are in fractions.css. Needs util.js, figures.js (svgWrap), and pictures.js.

   strips(rows, {wholes, W})         fraction strips: wholes cut into d equal parts, k of them shaded, in groups or taken away (svg)
   fracLine(rows, {wholes, …})       number lines from 0 marked in fractions, one under another, with points and tappable ticks (svg)
   hundredGrid(cells)                1 whole as 10 tenths of 10 hundredths, with squares shaded (svg)
   compareFr(a, b), SIGN_HTML        how fraction a ([n, d]) compares to b ('<', '=', or '>'), and those signs as html
   mixT(x, y, [n, d], cls)           n/d in a picture as a whole number, a fraction, or a mixed number, centered on x, y (markup)
   areaFig(w, h, {split, under, labels, dec})   a rectangle w by h (fractions) shaded on a grid of unit squares cut into parts (svg) */
/* Fraction strips, one row under another, every whole the same width so rows line up.
   rows: [{d, k, cls, lab, parts, grp, out}]: each whole cut into d equal parts and the first k shaded (cls 'b' blue, 'g' green; gold by default);
   k more than d draws more wholes. lab: [n, d] written to the left of the row. parts: false leaves 1/d out of the parts.
   grp: the shaded parts in groups of grp (or of each size in a list, like [2, 3]), every other group blue. out: the last `out` shaded parts are taken away (crossed out).
   wholes: how many wholes each row has room for (default: as many as the rows need), so the strips keep their size as k grows.
   stack: a row's wholes go one under another, each as wide as the picture, instead of side by side.
   empty: draw all `wholes` wholes in every row, the ones not reached yet unshaded. */
function strips(rows, { wholes = 0, stack = false, empty = false, W = 560, label } = {}) {
  /* wholesIn(r): how many wholes row r needs for k parts (at least 1); every row gets room for maxWholes */
  const wholesIn = (r) => Math.max(1, Math.ceil(r.k / r.d)),
    maxWholes = Math.max(wholes, ...rows.map(wholesIn)),
    labelW = rows.some((r) => r.lab) ? 54 : 4,
    wholeGap = maxWholes > 1 && !stack ? 14 : 0,
    /* the width of one whole: all of it when stacked, or a share of it side by side */
    wholeW = stack ? W - labelW - 4 : (W - labelW - 4 - wholeGap * (maxWholes - 1)) / maxWholes,
    stripH = 50,
    rowGap = 12,
    stripsPerRow = stack ? maxWholes : 1;
  let markup = "";
  rows.forEach((r, ri) => {
    const rowTop = 4 + ri * stripsPerRow * (stripH + rowGap),
      partW = wholeW / r.d,
      /* with a list of group sizes, where each group ends ([2, 3] ends at 2 and 5) */
      groupEnds = Array.isArray(r.grp) ? r.grp.map((g, i) => r.grp.slice(0, i + 1).reduce((a, b) => a + b)) : null,
      /* part j is blue when it's in an odd-numbered group (the 2nd, 4th, …) */
      blue = (j) => r.grp && (groupEnds ? groupEnds.findIndex((e) => j < e) : Math.floor(j / r.grp)) % 2 === 1;
    if (r.lab) markup += frT(labelW / 2 - 2, rowTop + stripH / 2, ...r.lab);
    range(empty ? maxWholes : wholesIn(r)).forEach((w) =>
      range(r.d).forEach((i) => {
        /* part i of whole w is part j of the row; the first k are shaded, and the last `out` of those are taken away */
        const x = labelW + (stack ? 0 : w * (wholeW + wholeGap)) + i * partW,
          y = rowTop + (stack ? w * (stripH + rowGap) : 0),
          j = w * r.d + i,
          shaded = j < r.k,
          gone = shaded && j >= r.k - (r.out || 0);
        markup += `<rect class="fs${shaded ? " on " + (blue(j) ? "b" : r.cls || "") : ""}${gone ? " gone" : ""}" x="${x}" y="${y}" width="${partW}" height="${stripH}"/>`;
        /* write 1/d in a part when it's wide enough to fit */
        if (r.parts !== false && partW >= 30)
          markup += frT(x + partW / 2, y + stripH / 2, 1, r.d, shaded && !gone ? "dk" : "");
        if (gone) markup += xOut(x + partW / 2 - 8, y + stripH / 2 - 8, 16, 16);
      }),
    );
  });
  return svgWrap(
    W,
    8 + rows.length * stripsPerRow * (stripH + rowGap) - rowGap,
    markup,
    label || "Fraction strips: " + rows.map((r) => `${r.k} ${PART[r.d][r.k === 1 ? 0 : 1]}`).join(", "),
  );
}
/* Number lines from 0 to `wholes`, one under another, lined up. rows: [{d, pts, hops, tap, labs}]: a tick every 1/d (tall at whole
   numbers, which get their number); labs: every tick gets its fraction; pts: [{k, cls}] dots at k/d ('b' blue, 'g' green);
   hops: that many jumps of 1/d from 0, or [[from, to, cls], …]: jumps of 1/d from from/d to to/d ('q' blue);
   tap: each tick can be tapped (data-v = its k, data-r = the row); tap 'cand' makes each tick a tap answer for engine.js instead
   (.cand, data-id = its k; use it on a picture with one row).
   marks: [{v, t}] a dashed line through every row at v (in wholes), with t ([n, d] or text) above it. */
function fracLine(rows, { wholes = 1, W = 480, marks = [], label } = {}) {
  /* room above the first line: for marks' labels, or the first row's hops; rows with fractions under every tick are taller */
  const left = 26,
    wholeW = (W - 2 * left) / wholes,
    topRoom = marks.length ? 44 : rows[0].hops && rows[0].hops.length !== 0 ? 34 : 18,
    rowH = rows.some((r) => r.labs) ? 84 : 64,
    /* xOf(v): where v (in wholes) is; lineY(i): the height of row i's line */
    xOf = (v) => left + v * wholeW,
    lineY = (i) => topRoom + 18 + i * rowH;
  let markup = "";
  marks.forEach(({ v, t }) => {
    markup +=
      `<line class="guide" x1="${xOf(v)}" y1="${topRoom - 4}" x2="${xOf(v)}" y2="${lineY(rows.length - 1) + 14}"/>` +
      (Array.isArray(t)
        ? frT(xOf(v), topRoom - 22, ...t, "cy")
        : `<text class="lbl s cy" x="${xOf(v)}" y="${topRoom - 16}">${t}</text>`);
  });
  rows.forEach((r, ri) => {
    const y = lineY(ri),
      ticks = r.d * wholes;
    markup += `<line class="axis" x1="${xOf(0) - 6}" y1="${y}" x2="${xOf(wholes) + 6}" y2="${y}"/>`;
    range(ticks + 1).forEach((k) => {
      const whole = k % r.d === 0,
        tickX = xOf(k / r.d);
      markup += `<line class="tick" x1="${tickX}" y1="${y - (whole ? 11 : 7)}" x2="${tickX}" y2="${y + (whole ? 11 : 7)}"/>`;
      if (r.labs && k) markup += frT(tickX, y + 32, k, r.d);
      else if (whole) markup += `<text class="lbl" x="${tickX}" y="${y + 26}">${k / r.d}</text>`;
    });
    /* hops as [[from, to, cls], …]; a number n means n hops from 0 */
    const hopRuns = Array.isArray(r.hops) ? r.hops : [[0, r.hops || 0, ""]];
    hopRuns.forEach(([from, to, cls = ""]) =>
      range(to - from).forEach((i) => {
        /* one jump of 1/d, an arc as high as 0.8 of its width (up to 40) */
        const xa = xOf((from + i) / r.d),
          xb = xOf((from + i + 1) / r.d);
        markup += `<path class="hop${cls ? " " + cls : ""}" d="M${xa},${y - 3}Q${(xa + xb) / 2},${y - 3 - Math.min(40, (xb - xa) * 0.8)} ${xb},${y - 3}"/>`;
      }),
    );
    (r.pts || []).forEach(({ k, cls = "" }) => {
      markup += `<circle class="pt ${cls}" cx="${xOf(k / r.d)}" cy="${y}" r="8"/>`;
    });
    /* tap targets: a box around each tick, 1/d wide */
    if (r.tap)
      range(ticks + 1).forEach((k) => {
        const boxW = wholeW / r.d,
          box = `x="${xOf(k / r.d) - boxW / 2}" y="${y - 24}" width="${boxW}" height="48"`;
        markup +=
          r.tap === "cand"
            ? `<rect class="cand hit" data-id="${k}" tabindex="0" role="button" aria-label="Tick mark ${k + 1}" ${box}/>`
            : `<rect class="hit" data-r="${ri}" data-v="${k}" ${box}/>`;
      });
  });
  return svgWrap(
    W,
    lineY(rows.length - 1) + rowH - 26,
    markup,
    label || `Number line${rows.length > 1 ? "s" : ""} from 0 to ${wholes}`,
  );
}
/* A hundred grid: 1 whole cut into 10 columns (tenths) of 10 squares (hundredths). cells: a class for each square filled, column by
   column from the top left ('a' gold, 'b' blue), like cellsOf([30, 'a'], [25, 'b']). */
function hundredGrid(cells, { label } = {}) {
  const cellSize = 26,
    margin = 4;
  let markup = "";
  /* square i is in column i ÷ 10, row i % 10 */
  range(100).forEach((i) => {
    const cls = cells[i];
    markup += `<rect class="hg${cls ? " " + cls : ""}" x="${margin + Math.floor(i / 10) * cellSize}" y="${margin + (i % 10) * cellSize}" width="${cellSize}" height="${cellSize}"/>`;
  });
  /* heavier lines between the tenths, then the outline of the whole */
  markup +=
    range(9)
      .map(
        (i) =>
          `<line class="hgt" x1="${margin + (i + 1) * cellSize}" y1="${margin}" x2="${margin + (i + 1) * cellSize}" y2="${margin + 10 * cellSize}"/>`,
      )
      .join("") + `<rect class="hgw" x="${margin}" y="${margin}" width="${10 * cellSize}" height="${10 * cellSize}"/>`;
  return svgWrap(
    10 * cellSize + 2 * margin,
    10 * cellSize + 2 * margin,
    markup,
    label || `A hundred grid with ${cells.filter(Boolean).length} of 100 squares shaded`,
  );
}
/* how fraction a compares to b: '<', '>', or '='. Cross-multiplying puts both over the same denominator. */
const compareFr = ([n1, d1], [n2, d2]) => (n1 * d2 < n2 * d1 ? "<" : n1 * d2 > n2 * d1 ? ">" : "=");
/* <, >, and = as html */
const SIGN_HTML = { "<": "&lt;", ">": "&gt;", "=": "=" };

/* n/d in a picture: the whole number, then the fraction stacked beside it; about 10 px a digit */
function mixT(x, y, [n, d], cls = "") {
  const whole = Math.floor(n / d),
    rest = n % d,
    wholeText = whole || !rest ? String(whole) : "",
    /* fracW: the stacked fraction's width; the whole thing is totalW wide, centered on x */
    fracW = rest ? 10 + 9 * Math.max(String(rest).length, String(d).length) : 0,
    totalW = wholeText.length * 10 + (wholeText && rest ? 4 : 0) + fracW,
    left = x - totalW / 2;
  return (
    (wholeText ? `<text class="lbl ${cls}" x="${left + wholeText.length * 5}" y="${y}">${wholeText}</text>` : "") +
    (rest ? frT(left + totalW - fracW / 2, y, rest, d, cls) : "")
  );
}

/* A rectangle w by h ([n, d] each; a whole number k is [k, 1]) on a grid of unit squares: each square is cut into w's
   denominator columns and h's denominator rows, and the rectangle is shaded from the bottom left corner. split 'w': the
   whole-number part of the width gold and the rest cyan (split 'h' does the same up the height). under: first shade a strip
   h tall all the way across the grid in light cyan, so the rectangle shows as w of that strip (1/2 of 1/3). labels: w under
   the rectangle and h to its left (each part under its own color when split). dec: write the labels as decimals (0.3), for
   tenths and hundredths. */
function areaFig([wn, wd], [hn, hd], { split = null, under = false, labels = true, dec = false, label } = {}) {
  /* the grid is cols by rows unit squares, each `size` pixels; xOf and yOf turn lengths into screen points (y from the bottom) */
  const cols = Math.max(1, Math.ceil(wn / wd)),
    rows = Math.max(1, Math.ceil(hn / hd)),
    /* a single unit square can be bigger, since its parts are small */
    size = Math.min(cols * rows === 1 ? 160 : 110, 360 / cols, 230 / rows),
    left = labels ? 70 : 6,
    top = 8,
    bottom = labels ? 46 : 6,
    xOf = (v) => left + v * size,
    yOf = (v) => top + (rows - v) * size,
    w = wn / wd,
    h = hn / hd;
  /* shaded pieces: [x from, x to, y from, y to, class] */
  const wholeW = Math.floor(w),
    wholeH = Math.floor(h),
    pieces =
      split === "w" && wholeW && w > wholeW
        ? [
            [0, wholeW, 0, h, "on"],
            [wholeW, w, 0, h, "on b"],
          ]
        : split === "h" && wholeH && h > wholeH
          ? [
              [0, w, 0, wholeH, "on"],
              [0, w, wholeH, h, "on b"],
            ]
          : [[0, w, 0, h, "on"]];
  let markup = `<rect class="ag" x="${xOf(0)}" y="${yOf(rows)}" width="${cols * size}" height="${rows * size}"/>`;
  if (under) markup += `<rect class="ag lt" x="${xOf(0)}" y="${yOf(h)}" width="${cols * size}" height="${h * size}"/>`;
  for (const [x1, x2, y1, y2, cls] of pieces)
    markup += `<rect class="ag ${cls}" x="${xOf(x1)}" y="${yOf(y2)}" width="${(x2 - x1) * size}" height="${(y2 - y1) * size}"/>`;
  /* thin lines for the parts, bold ones around each unit square */
  for (let i = 1; i < cols * wd; i++)
    if (i % wd)
      markup += `<line class="agl" x1="${xOf(i / wd)}" y1="${yOf(0)}" x2="${xOf(i / wd)}" y2="${yOf(rows)}"/>`;
  for (let j = 1; j < rows * hd; j++)
    if (j % hd)
      markup += `<line class="agl" x1="${xOf(0)}" y1="${yOf(j / hd)}" x2="${xOf(cols)}" y2="${yOf(j / hd)}"/>`;
  for (let i = 0; i <= cols; i++)
    markup += `<line class="agu" x1="${xOf(i)}" y1="${yOf(0)}" x2="${xOf(i)}" y2="${yOf(rows)}"/>`;
  for (let j = 0; j <= rows; j++)
    markup += `<line class="agu" x1="${xOf(0)}" y1="${yOf(j)}" x2="${xOf(cols)}" y2="${yOf(j)}"/>`;
  markup += `<rect class="agr" x="${xOf(0)}" y="${yOf(h)}" width="${w * size}" height="${h * size}"/>`;
  if (labels) {
    /* the width under the rectangle (each part under its own color when the width is split), the height to its left */
    const widths =
      pieces.length === 2 && split === "w"
        ? [
            [0, wholeW, [wholeW, 1]],
            [wholeW, w, [wn - wholeW * wd, wd]],
          ]
        : [[0, w, [wn, wd]]];
    /* a length as a fraction or mixed number, or as a decimal */
    const lengthT = (x, y, [n, d]) =>
      dec ? `<text class="lbl" x="${x}" y="${y}">${+(n / d).toFixed(3)}</text>` : mixT(x, y, [n, d]);
    for (const [from, to, length] of widths) markup += lengthT((xOf(from) + xOf(to)) / 2, yOf(0) + 24, length);
    const heights =
      pieces.length === 2 && split === "h"
        ? [
            [0, wholeH, [wholeH, 1]],
            [wholeH, h, [hn - wholeH * hd, hd]],
          ]
        : [[0, h, [hn, hd]]];
    for (const [from, to, length] of heights) markup += lengthT(left - 30, (yOf(from) + yOf(to)) / 2, length);
  }
  return svgWrap(
    Math.ceil(left + cols * size + (labels ? 40 : 6)),
    Math.ceil(top + rows * size + bottom),
    markup,
    label || `A rectangle ${wn}/${wd} by ${hn}/${hd} on a grid of unit squares`,
  );
}
