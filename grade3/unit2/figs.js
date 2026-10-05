/* Pictures that Grade 3 Unit 2's game and its Learn pages both use. Styles are in figs.css. Needs util.js, figures.js (svgWrap),
   and pictures.css (the .lbl text styles).

   CELL                                    pixels on a side of one unit square, when there's room
   cellsFig(shapes, {size, letters, on, tap, label})   shapes made of unit squares, side by side and lettered (svg)
   tilesLaid(rows, cols, how), tilingFig(rows, cols, {how, k, label})   square tiles laid on a rectangle, fairly or not (svg)
   splitFig(rows, cols, cut, {grid, sides, products, ask, label})   a rectangle cut into two parts in two colors (svg)
   lCells(wide, tall, cutWide, cutTall), lFig(wide, tall, cutWide, cutTall, {…})   an L-shaped figure: a rectangle with a corner
                                           cut away, with its side lengths and a cut into two rectangles (svg)
   rulerRect(length, width, unit, {read})  a rectangle with a ruler along its top and left sides (svg)
   Rectangles with their side lengths (rectFig) are in shared/shapes.js. */
const CELL = 30;

/* ---------- shapes made of unit squares ---------- */
/* The outline of a shape made of unit squares: every edge of a square that no other square in the shape shares (a path's d).
   cells: [col, row] squares; size: pixels on a side; x0, y0: where column 0, row 0 starts. */
function cellEdges(cells, size, x0, y0) {
  const has = (col, row) => cells.some(([c, r]) => c === col && r === row),
    left = (col) => x0 + col * size,
    top = (row) => y0 + row * size;
  let d = "";
  cells.forEach(([c, r]) => {
    if (!has(c, r - 1)) d += `M${left(c)},${top(r)}H${left(c + 1)}`;
    if (!has(c, r + 1)) d += `M${left(c)},${top(r + 1)}H${left(c + 1)}`;
    if (!has(c - 1, r)) d += `M${left(c)},${top(r)}V${top(r + 1)}`;
    if (!has(c + 1, r)) d += `M${left(c + 1)},${top(r)}V${top(r + 1)}`;
  });
  return d;
}
/* One or more shapes made of unit squares, side by side, each with its letter under it when there's more than one.
   shapes: lists of [col, row] squares. size: pixels on a side of a square (CELL, or smaller to fit 560 wide).
   on: for each shape, the indexes of its squares covered with tiles so far (the rest are dashed, empty squares); leave it out to
   tile them all. tap: 'cell' makes each square a tap target (data-i="shape.square"); 'cand' makes each shape a tap answer for
   engine.js (.cand, data-id = its letter). */
function cellsFig(shapes, { size, letters = shapes.length > 1, on = null, tap = "", label } = {}) {
  /* each shape's width and height in squares; gap: squares between shapes */
  const spans = shapes.map((cells) => [
      Math.max(...cells.map(([c]) => c)) + 1,
      Math.max(...cells.map(([, r]) => r)) + 1,
    ]),
    gap = 1.5,
    totalW = spans.reduce((sum, [w]) => sum + w, 0) + gap * (shapes.length - 1),
    tallest = Math.max(...spans.map(([, h]) => h));
  size = size || Math.min(CELL, 560 / totalW, 300 / tallest);
  const pad = 6,
    letterH = letters ? 30 : 0;
  let markup = "",
    x0 = pad;
  shapes.forEach((cells, s) => {
    const letter = "ABCD"[s],
      [w, h] = spans[s],
      covered = on ? on[s] || [] : null;
    let squares = "";
    cells.forEach(([c, r], i) => {
      const tiled = !covered || covered.includes(i),
        target = tap === "cell" ? ` data-i="${s}.${i}"` : "";
      squares += `<rect class="${tiled ? "atile" : "acell"}"${target} x="${x0 + c * size}" y="${pad + r * size}" width="${size}" height="${size}"/>`;
    });
    squares += `<path class="aout" d="${cellEdges(cells, size, x0, pad)}"/>`;
    if (letters)
      squares += `<text class="lbl" x="${x0 + (w * size) / 2}" y="${pad + tallest * size + 18}">${letter}</text>`;
    markup +=
      tap === "cand"
        ? `<g class="cand ashape" data-id="${letter}" tabindex="0" role="button" aria-label="Shape ${letter}"><rect class="hit" x="${x0 - 4}" y="${pad - 4}" width="${w * size + 8}" height="${tallest * size + letterH + 4}" rx="8"/>${squares}</g>`
        : squares;
    x0 += (w + gap) * size;
  });
  return svgWrap(
    x0 - gap * size + pad,
    pad * 2 + tallest * size + letterH,
    markup,
    label ||
      shapes
        .map((cells, s) => `${letters ? `Shape ${"ABCD"[s]}: ` : "A shape made of "}${cells.length} squares`)
        .join(". "),
  );
}

/* ---------- tiles on a rectangle ---------- */
/* The square tiles laid on a rectangle `cols` squares long and `rows` tall, as [x, y, side] in squares. how:
   'fair'     every square, with no gaps or overlaps
   'gaps'     tiles spaced out, with gaps between them
   'overlap'  more tiles squeezed into each row, so they overlap (the first and last still reach the ends)
   'mixed'    one big tile 2 squares on a side in the top left corner, and small tiles everywhere else
   'edges'    only the top row and the left column (the rest is for the student to picture)
   'row'      only the top row
   'col'      only the left column
   k: for 'fair', how many rows are tiled so far (from the top). */
function tilesLaid(rows, cols, how = "fair", k = rows) {
  const all = [];
  range(rows).forEach((r) => range(cols).forEach((c) => all.push([c, r, 1])));
  if (how === "fair") return all.filter(([, r]) => r < k);
  if (how === "edges") return all.filter(([c, r]) => r === 0 || c === 0);
  if (how === "row") return all.filter(([, r]) => r === 0);
  if (how === "col") return all.filter(([c]) => c === 0);
  if (how === "mixed") return [[0, 0, 2], ...all.filter(([c, r]) => c > 1 || r > 1)];
  /* gaps: a tile every 1.5 squares both ways. overlap: each row has a third more tiles than squares, spread evenly from end
     to end, and the rows are where they belong */
  if (how === "gaps") {
    const spots = (n) => range(Math.floor((n - 1) / 1.5) + 1).map((i) => i * 1.5);
    return spots(rows).flatMap((y) => spots(cols).map((x) => [x, y, 1]));
  }
  const perRow = cols + Math.ceil(cols / 3);
  return range(rows).flatMap((y) => range(perRow).map((i) => [(i * (cols - 1)) / (perRow - 1), y, 1]));
}
/* A rectangle `cols` squares long and `rows` tall with square tiles laid on it (see tilesLaid for how and k). Rows with no tiles
   get a tick at each square on the left side, so the rows can still be counted when only the top row is tiled. */
function tilingFig(rows, cols, { how = "fair", k = rows, label } = {}) {
  const size = Math.min(CELL, 400 / cols, 280 / rows),
    left = how === "row" ? 22 : 6,
    top = 6,
    laid = tilesLaid(rows, cols, how, k);
  let markup = `<rect class="arect" x="${left}" y="${top}" width="${cols * size}" height="${rows * size}"/>`;
  laid.forEach(([x, y, side]) => {
    markup += `<rect class="atile${side > 1 ? " big" : ""}" x="${left + x * size}" y="${top + y * size}" width="${side * size}" height="${side * size}"/>`;
  });
  if (how === "row")
    range(rows + 1).forEach((r) => {
      markup += `<line class="atick" x1="${left - 10}" y1="${top + r * size}" x2="${left}" y2="${top + r * size}"/>`;
    });
  const what = {
    fair:
      k < rows
        ? `with ${k} of its rows tiled so far`
        : `covered with ${laid.length} square tiles, with no gaps or overlaps`,
    gaps: `with ${laid.length} square tiles and gaps between them`,
    overlap: `with ${laid.length} square tiles that overlap`,
    mixed: `with 1 big square tile and ${laid.length - 1} small ones`,
    edges: "with tiles along its top row and left side",
    row: "with tiles along its top row, and a mark at each square on its left side",
    col: "with tiles along its left side",
  }[how];
  return svgWrap(
    left + cols * size + 6,
    top + rows * size + 6,
    markup,
    label || `A rectangle ${cols} squares long and ${rows} squares tall, ${what}`,
  );
}

/* ---------- a rectangle cut in two ---------- */
/* A rectangle `rows` squares tall and `cols` long, cut into two parts: `cut` columns on the left (gold) and the rest on the
   right (blue); a cut of 0 or cols leaves it whole, in gold. grid: draw the unit squares. sides: write the side lengths (rows on the left, each part's width on top).
   products: write each part's multiplication inside it. ask: 'left' or 'right' writes ? for that part's width. */
function splitFig(rows, cols, cut, { grid = true, sides = true, products = false, ask = null, label } = {}) {
  const size = Math.min(CELL + 4, 400 / cols, 260 / rows),
    left = sides ? 40 : 6,
    top = sides ? 34 : 6,
    whole = cut <= 0 || cut >= cols,
    widths = whole ? [cols] : [cut, cols - cut],
    partX = [left, left + cut * size];
  let markup = "";
  widths.forEach((w, i) => {
    markup += `<rect class="apart${i ? " b" : ""}" x="${partX[i]}" y="${top}" width="${w * size}" height="${rows * size}"/>`;
  });
  if (grid) {
    range(cols - 1).forEach((c) => {
      const x = left + (c + 1) * size;
      if (whole || c + 1 !== cut)
        markup += `<line class="agrid" x1="${x}" y1="${top}" x2="${x}" y2="${top + rows * size}"/>`;
    });
    range(rows - 1).forEach((r) => {
      const y = top + (r + 1) * size;
      markup += `<line class="agrid" x1="${left}" y1="${y}" x2="${left + cols * size}" y2="${y}"/>`;
    });
  }
  if (!whole)
    markup += `<line class="acut" x1="${partX[1]}" y1="${top - 4}" x2="${partX[1]}" y2="${top + rows * size + 4}"/>`;
  if (sides) {
    markup += `<text class="lbl en" x="${left - 10}" y="${top + (rows * size) / 2}">${rows}</text>`;
    widths.forEach((w, i) => {
      const asked = ask === (i ? "right" : "left");
      markup += `<text class="lbl${asked ? " cy" : ""}" x="${partX[i] + (w * size) / 2}" y="${top - 16}">${asked ? "?" : w}</text>`;
    });
  }
  if (products)
    widths.forEach((w, i) => {
      markup += `<text class="lbl s aprod" x="${partX[i] + (w * size) / 2}" y="${top + (rows * size) / 2}">${rows} × ${w}</text>`;
    });
  return svgWrap(
    left + cols * size + 8,
    top + rows * size + 8,
    markup,
    label ||
      (whole
        ? `A rectangle ${rows} squares tall and ${cols} long`
        : `A rectangle ${rows} squares tall and ${cols} long, cut into ${rows} by ${ask === "left" ? "?" : cut} and ${rows} by ${ask === "right" ? "?" : cols - cut}`),
  );
}

/* ---------- L-shaped figures ---------- */
/* The squares of an L-shaped figure, as [col, row]: a rectangle `wide` × `tall` with its top right corner cut away,
   `cutWide` × `cutTall`. */
const lCells = (wide, tall, cutWide, cutTall) =>
  range(tall).flatMap((r) =>
    range(wide)
      .filter((c) => !(r < cutTall && c >= wide - cutWide))
      .map((c) => [c, r]),
  );
/* An L-shaped figure: a rectangle `wide` × `tall` with a corner cut away, `cutWide` × `cutTall`.
   corner: which corner is cut away ('tr' top right, 'tl', 'br', 'bl'). The sides are numbered as they are for 'tr', from the
   top left going clockwise: 0 top, 1 the cut's up-down side, 2 the cut's across side, 3 right, 4 bottom, 5 left; another corner
   is the same figure flipped, so its sides keep their numbers.
   sides: the text for each side (null for none; '?' is written in cyan). grid: draw the unit squares.
   cut: 'down' splits it with an up-down line from the inside corner, 'across' with a line across; the two rectangles get
   two colors. */
function lFig(wide, tall, cutWide, cutTall, { corner = "tr", sides = [], grid = false, cut = null, size, label } = {}) {
  size = size || Math.min(CELL, 300 / wide, 240 / tall);
  const pad = 44,
    flipX = corner[1] === "l",
    flipY = corner[0] === "b",
    inner = wide - cutWide;
  /* a point in squares (for the 'tr' figure) to pixels, flipped for the other corners */
  const px = (x) => pad + (flipX ? wide - x : x) * size,
    py = (y) => pad + (flipY ? tall - y : y) * size;
  /* a rectangle in squares (for 'tr') as markup, flipped */
  const box = (x, y, w, h, cls) =>
    `<rect class="${cls}" x="${Math.min(px(x), px(x + w))}" y="${Math.min(py(y), py(y + h))}" width="${w * size}" height="${h * size}"/>`;
  const corners = [
    [0, 0],
    [inner, 0],
    [inner, cutTall],
    [wide, cutTall],
    [wide, tall],
    [0, tall],
  ];
  let markup = "";
  /* the two rectangles in two colors when it's cut, or the whole figure in one */
  if (cut === "down")
    markup += box(0, 0, inner, tall, "apart") + box(inner, cutTall, cutWide, tall - cutTall, "apart b");
  else if (cut === "across")
    markup += box(0, 0, inner, cutTall, "apart") + box(0, cutTall, wide, tall - cutTall, "apart b");
  else markup += `<polygon class="awhole" points="${corners.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}"/>`;
  if (grid) lCells(wide, tall, cutWide, cutTall).forEach(([c, r]) => (markup += box(c, r, 1, 1, "agridsq")));
  markup += `<polygon class="aoutline" points="${corners.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}"/>`;
  if (cut === "down")
    markup += `<line class="acut" x1="${px(inner)}" y1="${py(cutTall)}" x2="${px(inner)}" y2="${py(tall)}"/>`;
  if (cut === "across")
    markup += `<line class="acut" x1="${px(0)}" y1="${py(cutTall)}" x2="${px(inner)}" y2="${py(cutTall)}"/>`;
  /* each side's text, just outside the middle of the side: across sides above or below, up-down sides to the left or right */
  const isInside = (x, y) => x > 0 && x < wide && y > 0 && y < tall && !(x > inner && y < cutTall);
  corners.forEach(([x1, y1], i) => {
    const text = sides[i];
    if (text === null || text === undefined) return;
    const [x2, y2] = corners[(i + 1) % 6],
      midX = (x1 + x2) / 2,
      midY = (y1 + y2) / 2,
      across = y1 === y2,
      /* step a little off the side and see which way is outside */
      out = across ? (isInside(midX, midY + 0.1) ? -1 : 1) : isInside(midX + 0.1, midY) ? -1 : 1,
      screenOut = out * (across ? (flipY ? -1 : 1) : flipX ? -1 : 1),
      cls = `lbl${text === "?" ? " cy" : ""}${across ? "" : screenOut < 0 ? " en" : " st"}`;
    markup += across
      ? `<text class="${cls}" x="${px(midX)}" y="${py(midY) + screenOut * 16}">${text}</text>`
      : `<text class="${cls}" x="${px(midX) + screenOut * 8}" y="${py(midY)}">${text}</text>`;
  });
  return svgWrap(
    pad * 2 + wide * size,
    pad * 2 + tall * size,
    markup,
    label ||
      `An L-shaped figure. Its sides, going around: ${corners.map((_, i) => sides[i] ?? "not marked").join(", ")}`,
  );
}

/* ---------- measuring with a ruler ---------- */
/* A rectangle `length` units long and `width` tall with no squares in it, and a ruler along its top and its left side, each
   starting at the corner. unit: 'cm' or 'in' (inch rulers get a short tick at each half inch).
   read: [top, side], true for each side that's been measured (marked along its ruler in cyan, with the reading circled). */
function rulerRect(length, width, unit, { read = [false, false] } = {}) {
  const size = Math.min(34, 340 / (length + 1.5), 260 / (width + 1.5)),
    past = 1.5,
    rulerW = 26,
    left = 16 + rulerW + 6,
    top = 16 + rulerW + 6;
  let markup = `<rect class="awhole aoutline" x="${left}" y="${top}" width="${length * size}" height="${width * size}"/>`;
  /* the rulers run `past` units beyond the rectangle; ticks hang from the edge next to the rectangle, numbered at each whole unit */
  markup += `<rect class="arul" x="${left}" y="${top - rulerW - 4}" width="${(length + past) * size}" height="${rulerW}" rx="3"/>`;
  markup += `<rect class="arul" x="${left - rulerW - 4}" y="${top}" width="${rulerW}" height="${(width + past) * size}" rx="3"/>`;
  const halves = unit === "in" ? 2 : 1;
  range((length + 1) * halves + 1).forEach((i) => {
    const x = left + (i * size) / halves,
      whole = i % halves === 0,
      tick = whole ? 9 : 5;
    markup += `<line class="arult" x1="${x}" y1="${top - 4}" x2="${x}" y2="${top - 4 - tick}"/>`;
    if (whole && i) markup += `<text class="lbl s arunum" x="${x}" y="${top - 4 - 17}">${i / halves}</text>`;
  });
  range((width + 1) * halves + 1).forEach((i) => {
    const y = top + (i * size) / halves,
      whole = i % halves === 0,
      tick = whole ? 9 : 5;
    markup += `<line class="arult" x1="${left - 4}" y1="${y}" x2="${left - 4 - tick}" y2="${y}"/>`;
    if (whole && i) markup += `<text class="lbl s arunum" x="${left - 4 - 19}" y="${y}">${i / halves}</text>`;
  });
  markup += `<text class="lbl s dm" x="${left + (length + 0.5) * size}" y="${top + 14}">${unit}</text>`;
  /* a measured side: a cyan line along the ruler's edge from 0 to the reading, and a ring around the reading's number */
  if (read[0])
    markup +=
      `<line class="aread" x1="${left}" y1="${top - 3}" x2="${left + length * size}" y2="${top - 3}"/>` +
      `<circle class="aring" cx="${left + length * size}" cy="${top - 4 - 17}" r="9"/>`;
  if (read[1])
    markup +=
      `<line class="aread" x1="${left - 3}" y1="${top}" x2="${left - 3}" y2="${top + width * size}"/>` +
      `<circle class="aring" cx="${left - 4 - 19}" cy="${top + width * size}" r="9"/>`;
  return svgWrap(
    left + (length + past) * size + 8,
    top + (width + past) * size + 8,
    markup,
    `A rectangle with a ${unit === "cm" ? "centimeter" : "inch"} ruler along its top and its left side: it is ${length} ${unit} long and ${width} ${unit} wide`,
  );
}
