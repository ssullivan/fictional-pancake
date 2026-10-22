/* The pictures and number formats that Grade 7 Unit 1's game (Model Makers) and its Learn pages both use. Styles are in
   figs.css. Needs util.js (range) and figures.js (svgWrap); pages load pictures.css for the label styles.

   fmt(n)                                   a number as written: commas, up to 2 decimal places
   SHAPE_LIB                                polygons on a grid with whole-number corners, in grid squares (y counts down)
   scalePts(pts, fx, fy)                    the corners stretched fx across and fy down ([n, d] fractions; fy = fx for a scaled
                                            copy)
   sideLens(pts)                            each side's length when it runs along the grid, or null for a slanted side
   angleAt(pts, i)                          the angle at corner i, in degrees
   areaOf(pts)                              the area inside the corners, in grid squares
   turnPts(pts, quarters)                   the corners turned a quarter turn clockwise, quarters times
   sameShape(a, b)                          whether b is a scaled copy of a, turned or flipped or not
   arrange(rows, gap)                       shapes placed left to right in rows, one row under another, gap squares apart
   gridFig(shapes, {…})                     polygons on a square grid, with names, side lengths, corner letters, angles, and
                                            tiles inside (svg)
   scaleText(drawn, real)                   a scale as written: "1 cm to 5 km"
   scaleBar(each, unit, {n, drawUnit})      a scale bar: n segments, each 1 drawUnit long, numbered 0, each, 2 × each, … (svg)
   routeFig(legs, {each, unit, names})      a route on a map, each leg drawn to scale and labeled with its length on the map,
                                            with a scale bar (svg) */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

/* Polygons for scaled copies, each with whole-number corners in grid squares (x across, y down), going around in order.
   name: what the problems call it; asym: it has no turn or mirror that fits it onto itself, so every corner of a copy matches
   just one corner of the original. Sides along the grid get their lengths; slanted sides don't. Every corner is a multiple of
   2, so a copy scaled by 1/2 or 3/2 still lands on the grid. */
const SHAPE_LIB = [
  {
    name: "L-shape",
    pts: [
      [0, 0],
      [2, 0],
      [2, 2],
      [4, 2],
      [4, 4],
      [0, 4],
    ],
  },
  {
    name: "L-shape",
    asym: true,
    pts: [
      [0, 0],
      [2, 0],
      [2, 2],
      [6, 2],
      [6, 4],
      [0, 4],
    ],
  },
  {
    name: "right triangle",
    asym: true,
    pts: [
      [0, 0],
      [0, 4],
      [2, 4],
    ],
  },
  {
    name: "right triangle",
    asym: true,
    pts: [
      [0, 0],
      [0, 2],
      [4, 2],
    ],
  },
  {
    name: "trapezoid",
    asym: true,
    pts: [
      [0, 0],
      [2, 0],
      [4, 2],
      [0, 2],
    ],
  },
  {
    name: "T-shape",
    pts: [
      [0, 0],
      [6, 0],
      [6, 2],
      [4, 2],
      [4, 4],
      [2, 4],
      [2, 2],
      [0, 2],
    ],
  },
  {
    name: "parallelogram",
    pts: [
      [2, 0],
      [6, 0],
      [4, 2],
      [0, 2],
    ],
  },
  {
    name: "house shape",
    pts: [
      [0, 2],
      [2, 0],
      [4, 2],
      [4, 4],
      [0, 4],
    ],
  },
  {
    name: "step shape",
    pts: [
      [0, 0],
      [2, 0],
      [2, 2],
      [4, 2],
      [4, 4],
      [6, 4],
      [6, 6],
      [0, 6],
    ],
  },
];

/* the corners stretched fx across and fy down, where fx and fy are fractions [n, d] */
const scalePts = (pts, fx, fy = fx) => pts.map(([x, y]) => [(x * fx[0]) / fx[1], (y * fy[0]) / fy[1]]);
/* each side's length when it runs along the grid (side i goes from corner i to corner i + 1), or null when it's slanted */
const sideLens = (pts) =>
  pts.map(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    return x1 === x2 || y1 === y2 ? Math.abs(x2 - x1) + Math.abs(y2 - y1) : null;
  });
/* the angle inside the polygon at corner i, in degrees: the turn between the sides to the corners before and after it,
   taken the long way round at a corner that points in (the polygon's direction, from the shoelace sum, tells which) */
function angleAt(pts, i) {
  const count = pts.length,
    [x, y] = pts[i],
    [px, py] = pts[(i + count - 1) % count],
    [nx, ny] = pts[(i + 1) % count],
    toPrev = Math.atan2(py - y, px - x),
    toNext = Math.atan2(ny - y, nx - x);
  let turn = ((toPrev - toNext) * 180) / Math.PI;
  turn = ((turn % 360) + 360) % 360;
  return shoelace(pts) > 0 ? turn : 360 - turn;
}
/* the shoelace sum: twice the area, positive when the corners go clockwise on screen (y counts down) */
const shoelace = (pts) =>
  pts.reduce((sum, [x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    return sum + (x1 * y2 - x2 * y1);
  }, 0);
/* the area inside the corners, in grid squares */
const areaOf = (pts) => Math.abs(shoelace(pts)) / 2;
/* the corners turned a quarter turn clockwise on screen, quarters times, kept at the top left of the grid */
function turnPts(pts, quarters = 1) {
  let turned = pts;
  range(quarters % 4).forEach(() => {
    const tallest = Math.max(...turned.map((p) => p[1]));
    turned = turned.map(([x, y]) => [tallest - y, x]);
  });
  return turned;
}
/* Whether polygon b is a scaled copy of polygon a, turned or flipped or not: going around both from some corner, in either
   direction, every side of b is the same multiple of the matching side of a, and every angle is the same. */
function sameShape(a, b) {
  if (a.length !== b.length) return false;
  const count = a.length,
    sidesOf = (pts) => pts.map(([x1, y1], i) => Math.hypot(pts[(i + 1) % count][0] - x1, pts[(i + 1) % count][1] - y1)),
    anglesOf = (pts) => pts.map((_, i) => angleAt(pts, i)),
    sidesA = sidesOf(a),
    anglesA = anglesOf(a),
    close = (u, v) => Math.abs(u - v) < 1e-6;
  /* b's corners in the other direction, so a mirror image matches too */
  return [b, b.slice().reverse()].some((pts) => {
    const sidesB = sidesOf(pts),
      anglesB = anglesOf(pts);
    return range(count).some((shift) => {
      const factor = sidesB[shift] / sidesA[0];
      return range(count).every(
        (i) =>
          close(sidesB[(i + shift) % count], sidesA[i] * factor) && close(anglesB[(i + shift) % count], anglesA[i]),
      );
    });
  });
}
/* the smallest and largest x and y of the corners */
const boundsOf = (pts) => ({
  minX: Math.min(...pts.map((p) => p[0])),
  maxX: Math.max(...pts.map((p) => p[0])),
  minY: Math.min(...pts.map((p) => p[1])),
  maxY: Math.max(...pts.map((p) => p[1])),
});
/* Shapes placed left to right in rows, gap squares apart, each row under the one before (with room for the shapes' names).
   rows: [[shape, …], …], each shape {pts, …}; returns the same shapes with `at`, where its top left corner goes. */
function arrange(rows, gap = 3) {
  let top = 0;
  return rows.flatMap((row) => {
    let left = 0;
    const tallest = Math.max(...row.map((s) => boundsOf(s.pts).maxY - boundsOf(s.pts).minY));
    const placed = row.map((s) => {
      const b = boundsOf(s.pts),
        at = [left - b.minX, top - b.minY];
      left += b.maxX - b.minX + gap;
      return { ...s, at };
    });
    top += tallest + gap;
    return placed;
  });
}
/* is the point (x, y) inside the polygon? (count the sides a ray to the right crosses: odd means inside) */
function inside(pts, x, y) {
  let crossings = 0;
  pts.forEach(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    if (y1 > y !== y2 > y && x < x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)) crossings++;
  });
  return crossings % 2 === 1;
}

/* Polygons on a square grid, cell pixels a square.
   shapes: [{pts, at, cls, name, sides, verts, angles, hi, tiles, id}]: pts are the corners in grid squares, moved to `at`
   (from arrange); cls 'a' gold, 'b' cyan, 'c' pink, 'd' green, 'ghost' a dashed outline; name is written above it; sides:
   a label for each side (null for none; true labels every side along the grid with its length); verts: a letter for each
   corner; angles: {corner index: text} written inside that corner; hi: the sides to draw thick (indexes); tiles: k cuts a
   rectangle or a triangle into k × k smaller copies of itself, dashed; id: tap it (a .cand with that data-id).
   grid: false draws no grid. unit: written after side lengths. label: what a screen reader says. */
function gridFig(shapes, { cell = 22, grid = true, unit = "", label = "Shapes on a grid" } = {}) {
  /* every corner where it's drawn, and the grid squares around them all: room for labels on each side, and names on top */
  const placed = shapes.map((s) => ({ ...s, at: s.at || [0, 0] }));
  const where = (s) => s.pts.map(([x, y]) => [x + s.at[0], y + s.at[1]]);
  const all = placed.flatMap(where),
    b = boundsOf(all),
    named = placed.some((s) => s.name),
    /* how far a name sticks out past either side of its shape, in grid squares (about 10 pixels a letter) */
    nameOver = Math.max(
      0,
      ...placed
        .filter((s) => s.name)
        .map((s) => {
          const sb = boundsOf(where(s));
          return (s.name.length * 10) / cell / 2 - (sb.maxX - sb.minX) / 2 - 1;
        }),
    ),
    left = b.minX - 1.5 - nameOver,
    top = b.minY - (named ? 2.8 : 1.5),
    cols = b.maxX - left + 1.5 + nameOver,
    rows = b.maxY - top + 1.5,
    width = cols * cell,
    height = rows * cell,
    xOf = (x) => (x - left) * cell,
    yOf = (y) => (y - top) * cell;
  let markup = "";
  if (grid) {
    for (let i = Math.ceil(left); i <= left + cols; i++)
      markup += `<line class="sg" x1="${xOf(i)}" y1="0" x2="${xOf(i)}" y2="${height}"/>`;
    for (let j = Math.ceil(top); j <= top + rows; j++)
      markup += `<line class="sg" x1="0" y1="${yOf(j)}" x2="${width}" y2="${yOf(j)}"/>`;
  }
  placed.forEach((s) => {
    const pts = where(s),
      count = pts.length,
      points = pts.map(([x, y]) => `${xOf(x)},${yOf(y)}`).join(" "),
      tap = s.id !== undefined ? ` class="cand" data-id="${s.id}"` : "";
    markup += `<g${tap}><polygon class="shp ${s.cls || "a"}" points="${points}"/>`;
    /* tiles: lines parallel to the sides at every 1/k of the way, cutting a rectangle or triangle into k × k copies */
    if (s.tiles > 1) {
      const k = s.tiles,
        sb = boundsOf(pts);
      if (count === 4)
        range(k - 1).forEach((i) => {
          const x = sb.minX + ((sb.maxX - sb.minX) * (i + 1)) / k,
            y = sb.minY + ((sb.maxY - sb.minY) * (i + 1)) / k;
          markup += `<line class="tile" x1="${xOf(x)}" y1="${yOf(sb.minY)}" x2="${xOf(x)}" y2="${yOf(sb.maxY)}"/>`;
          markup += `<line class="tile" x1="${xOf(sb.minX)}" y1="${yOf(y)}" x2="${xOf(sb.maxX)}" y2="${yOf(y)}"/>`;
        });
      else if (count === 3)
        /* from each corner, the lines parallel to the far side, cutting the other two sides at the same fraction */
        range(3).forEach((c) => {
          const [ax, ay] = pts[c],
            [bx, by] = pts[(c + 1) % 3],
            [cx, cy] = pts[(c + 2) % 3];
          range(k - 1).forEach((i) => {
            const t = (i + 1) / k;
            markup += `<line class="tile" x1="${xOf(ax + (bx - ax) * t)}" y1="${yOf(ay + (by - ay) * t)}" x2="${xOf(ax + (cx - ax) * t)}" y2="${yOf(ay + (cy - ay) * t)}"/>`;
          });
        });
    }
    (s.hi || []).forEach((i) => {
      const [x1, y1] = pts[i],
        [x2, y2] = pts[(i + 1) % count];
      markup += `<line class="shp-hi" x1="${xOf(x1)}" y1="${yOf(y1)}" x2="${xOf(x2)}" y2="${yOf(y2)}"/>`;
    });
    markup += "</g>";
    /* side labels sit just outside the middle of each side: the normal that doesn't point into the shape */
    const lens = sideLens(s.pts),
      labels = s.sides === true ? lens.map((v) => (v === null ? null : fmt(v) + (unit ? " " + unit : ""))) : s.sides;
    (labels || []).forEach((text, i) => {
      if (text === null || text === undefined) return;
      const [x1, y1] = pts[i],
        [x2, y2] = pts[(i + 1) % count],
        len = Math.hypot(x2 - x1, y2 - y1),
        midX = (x1 + x2) / 2,
        midY = (y1 + y2) / 2;
      let nx = (y2 - y1) / len,
        ny = -(x2 - x1) / len;
      if (inside(pts, midX + nx * 0.1, midY + ny * 0.1)) [nx, ny] = [-nx, -ny];
      /* labels across from a side stand off farther than labels above or below it */
      const off = Math.abs(nx) > 0.5 ? 0.5 + String(text).length * 0.17 : 0.55;
      markup += `<text class="lbl s side${(s.hi || []).includes(i) ? " gd" : ""}" x="${xOf(midX + nx * off)}" y="${yOf(midY + ny * off)}">${text}</text>`;
    });
    /* corner letters sit outside the corner, and angles inside it, along the line that splits the corner in half */
    const bisector = (i) => {
      const [x, y] = pts[i],
        [px, py] = pts[(i + count - 1) % count],
        [nx, ny] = pts[(i + 1) % count],
        toPrev = Math.hypot(px - x, py - y),
        toNext = Math.hypot(nx - x, ny - y);
      let dx = (px - x) / toPrev + (nx - x) / toNext,
        dy = (py - y) / toPrev + (ny - y) / toNext;
      const len = Math.hypot(dx, dy) || 1;
      [dx, dy] = [dx / len, dy / len];
      /* (dx, dy) points into the corner: flip it when that's outside the shape (a corner that points in) */
      return inside(pts, x + dx * 0.1, y + dy * 0.1) ? [dx, dy] : [-dx, -dy];
    };
    (s.verts || []).forEach((letter, i) => {
      const [dx, dy] = bisector(i),
        [x, y] = pts[i];
      markup += `<text class="lbl s vx" x="${xOf(x - dx * 0.55)}" y="${yOf(y - dy * 0.55)}">${letter}</text>`;
    });
    /* an angle's text goes farther in at a sharp corner, so it clears both sides */
    Object.entries(s.angles || {}).forEach(([i, text]) => {
      const [dx, dy] = bisector(+i),
        [x, y] = pts[+i],
        away = 0.75 / Math.sin((angleAt(pts, +i) * Math.PI) / 360);
      markup += `<text class="lbl s cy" x="${xOf(x + dx * away)}" y="${yOf(y + dy * away)}">${text}</text>`;
    });
    if (s.name) {
      const sb = boundsOf(pts);
      markup += `<text class="lbl nm" x="${xOf((sb.minX + sb.maxX) / 2)}" y="${yOf(sb.minY - 1.9)}">${s.name}</text>`;
    }
  });
  return svgWrap(width, height, markup, label);
}

/* a scale as written: "1 cm to 5 km". drawn and real are [amount, unit] */
const scaleText = ([drawAmt, drawUnit], [realAmt, realUnit]) =>
  `${fmt(drawAmt)} ${drawUnit} to ${fmt(realAmt)} ${realUnit}`;

/* A scale bar: n segments, each 1 drawUnit long on the drawing, numbered 0, each, 2 × each, … in unit (svg). segW: pixels a
   segment. */
function scaleBar(each, unit, { n = 4, drawUnit = "cm", segW = 50, label } = {}) {
  const left = 20,
    barY = 30,
    barH = 10;
  let markup = `<text class="lbl s dm st" x="${left}" y="12">1 ${drawUnit} to ${fmt(each)} ${unit}</text>`;
  range(n).forEach((i) => {
    markup += `<rect class="sbar${i % 2 ? " alt" : ""}" x="${left + i * segW}" y="${barY}" width="${segW}" height="${barH}"/>`;
  });
  range(n + 1).forEach((i) => {
    markup += `<text class="lbl s" x="${left + i * segW}" y="${barY + barH + 14}">${fmt(i * each)}</text>`;
  });
  markup += `<text class="lbl s st" x="${left + n * segW + 16}" y="${barY + barH + 14}">${unit}</text>`;
  return svgWrap(
    left + n * segW + 60,
    barY + barH + 26,
    markup,
    label || `A scale bar: 1 ${drawUnit} to ${each} ${unit}`,
  );
}

/* A route on a map: legs [{len, dir}] each len cm long on the map, heading dir degrees (0 east, 90 north), drawn to scale
   (cmPx pixels a centimeter) from the first place to the last. names: the places at the ends of the legs (one more than the
   legs), written under them. each, unit: the map's scale (1 cm to each unit), drawn as a scale bar under the route. show:
   write each leg's real length under its length on the map. ask: the leg (index) whose length isn't written, marked "?" instead. */
function routeFig(legs, { names, each, unit, show = false, ask = -1, cmPx = 28, label } = {}) {
  /* the places, in map pixels with y down, starting at (0, 0) */
  const places = [[0, 0]];
  legs.forEach(({ len, dir }) => {
    const [x, y] = places[places.length - 1],
      a = (dir * Math.PI) / 180;
    places.push([x + len * cmPx * Math.cos(a), y - len * cmPx * Math.sin(a)]);
  });
  /* fit the route in its picture, with room for labels, the first and last names beside their towns (about 8.5 pixels a
     letter), and the scale bar under it */
  const pad = 46,
    nameW = (i) => (names && names[i] ? names[i].length * 8.5 + 14 : 0),
    xs = places.map((p) => p[0]),
    ys = places.map((p) => p[1]),
    shiftX = Math.max(pad, nameW(0)) - Math.min(...xs),
    shiftY = pad - Math.min(...ys),
    barTop = Math.max(...ys) + shiftY + 44,
    segCount = 3,
    width = Math.max(Math.max(...xs) + shiftX + Math.max(pad, nameW(legs.length)), segCount * cmPx + 90),
    height = barTop + 46;
  const at = ([x, y]) => [x + shiftX, y + shiftY];
  let markup = `<rect class="mapbg" x="2" y="2" width="${width - 4}" height="${height - 4}" rx="10"/>`;
  legs.forEach((leg, i) => {
    const [x1, y1] = at(places[i]),
      [x2, y2] = at(places[i + 1]),
      len = Math.hypot(x2 - x1, y2 - y1),
      /* the label goes above the road (the normal that points up), and the real length under it with the hint */
      nx = (y2 - y1) / len,
      ny = -(x2 - x1) / len,
      flip = ny > 0 ? -1 : 1,
      labelX = (x1 + x2) / 2 + nx * 18 * flip,
      labelY = (y1 + y2) / 2 + ny * 18 * flip - (show ? 16 : 0);
    markup += `<line class="road" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    markup += `<text class="lbl s${i === ask ? " gd" : ""}" x="${labelX}" y="${labelY}">${i === ask ? "?" : `${fmt(leg.len)} cm`}</text>`;
    if (show) markup += `<text class="lbl s cy" x="${labelX}" y="${labelY + 16}">${fmt(leg.len * each)} ${unit}</text>`;
  });
  /* the first town's name to its left, the last one's to its right, and the others under them */
  places.forEach((p, i) => {
    const [x, y] = at(p),
      first = i === 0,
      last = i === legs.length;
    markup += `<circle class="town" cx="${x}" cy="${y}" r="6"/>`;
    if (names && names[i])
      markup += first
        ? `<text class="lbl s dm en" x="${x - 12}" y="${y}">${names[i]}</text>`
        : last
          ? `<text class="lbl s dm st" x="${x + 12}" y="${y}">${names[i]}</text>`
          : `<text class="lbl s dm" x="${x}" y="${y + 20}">${names[i]}</text>`;
  });
  /* the scale bar: segCount centimeters, numbered in real units */
  const barLeft = 20;
  range(segCount).forEach((i) => {
    markup += `<rect class="sbar${i % 2 ? " alt" : ""}" x="${barLeft + i * cmPx}" y="${barTop}" width="${cmPx}" height="8"/>`;
  });
  range(segCount + 1).forEach((i) => {
    markup += `<text class="lbl s" x="${barLeft + i * cmPx}" y="${barTop + 20}">${fmt(i * each)}</text>`;
  });
  markup += `<text class="lbl s st" x="${barLeft + segCount * cmPx + 14}" y="${barTop + 20}">${unit}</text>`;
  return svgWrap(width, height, markup, label || `A map with a scale of 1 cm to ${each} ${unit}`);
}
