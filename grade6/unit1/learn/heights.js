/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 4: Finding the height. Its widgets and steps; loaded by heights.html.
   IM Lessons 5 and 10 name the mistakes students make with heights, and each step takes one on: using the slanted side,
   expecting the height inside the shape, expecting the base at the bottom, one height for every side, and a height that
   starts at the wrong corner or stops short of the base line. */

/* ---------- the geometry of a height ---------- */
/* points are [x, y]: the arrow from b to a, the dot product (0 when two arrows are square to each other), and the cross
   product (0 when they point along the same line; its sign says which side of the line a point is on) */
const minus = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot2 = (u, v) => u[0] * v[0] + u[1] * v[1];
const cross2 = (u, v) => u[0] * v[1] - u[1] * v[0];
const samePt = (a, b) => a[0] === b[0] && a[1] === b[1];
/* a length to one decimal place, without a trailing .0 */
const len1 = (n) => String(Math.round(n * 10) / 10);

/* The parts of a shape that a height needs. shape: {pts: corners, base: the base side runs from corner pts[base] to the next
   one, par?: true for a parallelogram or trapezoid, whose height goes between the base and the side across from it}.
   Returns {B0, B1: the base's ends, top: the corner across from the base (a triangle) or the first corner of the side across
   from it, up(p): how far p is from the base line, plus on the shape's side, along(p): where p's foot is along the base
   (0 at B0, 1 at B1), height, sides: each side's two ends}. */
function heightParts(shape) {
  const { pts } = shape,
    n = pts.length,
    B0 = pts[shape.base],
    B1 = pts[(shape.base + 1) % n],
    top = pts[(shape.base + 2) % n],
    dir = minus(B1, B0),
    baseLen = Math.hypot(...dir),
    side = Math.sign(cross2(dir, minus(top, B0)));
  const up = (p) => (side * cross2(dir, minus(p, B0))) / baseLen,
    along = (p) => dot2(minus(p, B0), dir) / baseLen ** 2;
  return { B0, B1, top, dir, up, along, height: up(top), sides: pts.map((p, i) => [p, pts[(i + 1) % n]]) };
}

/* Is the segment from a to b (grid points, in either order) a height for the shape's base, and if not, what's wrong with it?
   Returns {code, outside, isSide, len}. code is 'right' or the mistake: 'base' (it runs along the base line), 'past' (it
   crosses the base line), 'short' (square to the base from the top, but it stops before the base line), 'float' (it doesn't
   touch the base line), 'away' (it goes from the base line away from the shape), 'side' (a slanted side of the shape),
   'lean' (from the top to the base line, but not square to it), 'high' (square to the base, but past the top), 'low' (square,
   but short of the top), 'corner' (square from a corner of a triangle's base, short of the top), 'off' (square and as tall
   as the triangle, but not through its top corner), or 'stray' (neither square to the base nor to the top). outside: a right
   height lands on the base line extended (or, between parallel sides, off the side across). isSide: it's one of the
   shape's sides. len: the shape's height. */
function judgeHeight(shape, a, b) {
  const { B0, B1, top, dir, up, along, height, sides } = heightParts(shape),
    upA = up(a),
    upB = up(b),
    len = height;
  const isSide = sides.some(([p, q]) => (samePt(p, a) && samePt(q, b)) || (samePt(p, b) && samePt(q, a)));
  if (upA === 0 && upB === 0) return { code: "base", isSide, len };
  /* the end nearer the base line is the foot, the other the tip */
  const [foot, tip] = Math.abs(upA) <= Math.abs(upB) ? [a, b] : [b, a],
    square = dot2(dir, minus(tip, foot)) === 0,
    reachesTop = shape.par ? up(tip) === height : samePt(tip, top);
  if (up(foot) !== 0) {
    if (Math.sign(upA) !== Math.sign(upB)) return { code: "past", isSide, len };
    return { code: square && reachesTop ? "short" : "float", isSide, len };
  }
  if (up(tip) < 0) return { code: "away", isSide, len };
  if (square && reachesTop) {
    /* between parallel sides, the height is outside when either end is off its side */
    const topSide = shape.par ? sides[(shape.base + 2) % shape.pts.length] : null,
      offTop = topSide && (along(tip) - along(topSide[0])) * (along(tip) - along(topSide[1])) > 0,
      offBase = along(foot) < 0 || along(foot) > 1;
    return { code: "right", outside: offBase || !!offTop, isSide, len };
  }
  if (!square && isSide) return { code: "side", isSide, len };
  if (!square) return { code: reachesTop ? "lean" : "stray", isSide, len };
  if (up(tip) > height) return { code: "high", isSide, len };
  if (up(tip) < height) {
    const fromCorner = !shape.par && (samePt(foot, B0) || samePt(foot, B1));
    return { code: fromCorner ? "corner" : "low", isSide, len };
  }
  return { code: "off", isSide, len };
}

/* ---------- drawing helpers ---------- */
/* a right-angle mark at foot, its sides along the unit arrows along and up (grid units) */
function rtMark(P, foot, along, up) {
  const size = 0.35,
    corner = (s, t) => `${P.X(foot[0] + s * along[0] + t * up[0])},${P.Y(foot[1] + s * along[1] + t * up[1])}`;
  return `<polyline class="rt" points="${corner(size, 0)} ${corner(size, size)} ${corner(0, size)}"/>`;
}
/* the line through p and q, drawn across the box xmin..xmax by ymin..ymax (dotted: class ext) */
function lineAcross(P, box, p, q, cls = "ext") {
  const d = minus(q, p);
  let tMin = -Infinity,
    tMax = Infinity;
  /* where the line enters and leaves the box, one pair of edges at a time */
  [
    [0, box.xmin, box.xmax],
    [1, box.ymin, box.ymax],
  ].forEach(([k, lo, hi]) => {
    if (d[k] === 0) return;
    const t0 = (lo - p[k]) / d[k],
      t1 = (hi - p[k]) / d[k];
    tMin = Math.max(tMin, Math.min(t0, t1));
    tMax = Math.min(tMax, Math.max(t0, t1));
  });
  const at = (t) => [p[0] + t * d[0], p[1] + t * d[1]];
  return P.line(at(tMin), at(tMax), cls);
}
/* a shape's height, drawn: the dashed segment from tip to foot and its right-angle mark, opening toward the base's middle */
function heightLine(P, parts, tip, foot) {
  const unit = Math.hypot(...parts.dir),
    toMiddle = parts.along(foot) < 0.5 ? 1 : -1,
    along = [(toMiddle * parts.dir[0]) / unit, (toMiddle * parts.dir[1]) / unit],
    rise = minus(tip, foot),
    rise1 = Math.hypot(...rise),
    up = [rise[0] / rise1, rise[1] / rise1];
  return P.line(tip, foot, "hgt") + rtMark(P, foot, along, up);
}

/* ---------- step 1: square to the base ---------- */
/* Slide the corner of a sheet of paper along a triangle's base: when its edge touches the top corner, the height appears.
   SETS: [base, the top corner's x, height]; the last is a right triangle, whose height is its left side. */
function wPaper(el) {
  const q = Q(el),
    SETS = [
      [7, 2, 4],
      [6, 4, 5],
      [8, 6, 3],
      [5, 0, 4],
    ],
    paperW = 2;
  let setIndex = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the paper <input type="range" min="0" step="0.5" data-s></label><button type="button" class="ghost-btn" data-n>New triangle</button></div><p class="readout" data-r aria-live="polite"></p>`;
  /* the slider runs along this triangle's base and starts at its right end */
  const reset = () => {
    const base = SETS[setIndex][0];
    q("s").max = base;
    q("s").value = base;
  };
  const draw = () => {
    const [base, topX, h] = SETS[setIndex],
      x = +q("s").value,
      touches = x === topX,
      P = plane({ xmax: base + paperW, ymax: h + 1, u: 38 });
    /* the paper sits on the base line, its corner at x and its left edge straight up */
    let markup =
      P.grid() +
      P.poly(
        [
          [0, 0],
          [base, 0],
          [topX, h],
        ],
        "sh-a",
      ) +
      P.text(base / 2, 0, `${base}`, "lbl", 0, 16) +
      `<rect class="paper" x="${P.X(x)}" y="${P.Y(h + 1)}" width="${paperW * P.u}" height="${(h + 1) * P.u}"/>` +
      P.line([x, 0], [x, h + 1], "paper-edge") +
      P.rt(x, 0);
    if (touches) markup += P.line([topX, h], [topX, 0], "hgt") + P.text(topX, h / 2, `${h}`, "lbl en", -8);
    markup += `<circle class="pt" cx="${P.X(topX)}" cy="${P.Y(h)}" r="4"/>`;
    q("f").innerHTML = P.svg(markup, `A triangle with base ${base}, and the corner of a sheet of paper on its base`);
    const rightTriangle = topX === 0 || topX === base;
    q("r").innerHTML = touches
      ? `<span class="ok">The paper’s edge touches the top corner. That’s the height: square to the base, <b>${h}</b> units tall.</span>` +
        (rightTriangle ? "<br>Here the height runs along a side: this is a right triangle." : "")
      : `The paper’s edge misses the top corner. Slide it to the ${x > topX ? "left" : "right"}.`;
  };
  q("s").addEventListener("input", draw);
  q("n").onclick = () => {
    setIndex = (setIndex + 1) % SETS.length;
    reset();
    draw();
  };
  reset();
  draw();
}

/* ---------- steps 2, 3, and 5: draw the height ---------- */
/* what the readout says about a drawn segment, by judgeHeight's code: [for a triangle, between parallel sides] */
const DRAW_SAYS = {
  base: [
    "That runs along the base line. A height goes up from the base, square to it.",
    "That runs along the base line. A height goes across from the base, square to it.",
  ],
  past: ["That goes past the base line. A height stops where it meets the base line."],
  short: [
    "It stops before the base line. A height goes all the way down to the base line, or to the dotted line that extends it.",
    "It stops before the base line. A height goes all the way from one parallel side to the other.",
  ],
  float: [
    "A height has one end on the base line and the other at the top corner.",
    "A height has one end on the base line and the other on the side across from it.",
  ],
  away: ["That goes the wrong way from the base line. A height goes toward the shape."],
  side: ["That’s a side of the shape. It’s slanted, so it isn’t square to the base."],
  lean: [
    "That’s not square to the base: it leans. Line up the corner of a sheet of paper with the base line, and draw along its other edge.",
  ],
  stray: [
    "A height goes from the top corner to the base line, square to the base.",
    "A height goes from the side across from the base to the base line, square to both.",
  ],
  high: [
    "It goes higher than the top corner. The height ends at the top corner.",
    "It goes past the side across from the base. A height ends on that side, or on the line that extends it.",
  ],
  low: [
    "It’s square to the base, but it doesn’t reach the top corner.",
    "It’s square to the base, but it stops before the side across from it.",
  ],
  corner: ["That starts at a corner of the base. The height starts at the top corner, the one across from the base."],
  off: ["That’s as tall as the triangle, but it doesn’t touch the top corner. Draw the height from the top corner."],
};
/* Draw a height on grid paper: tap (or click) a grid point, then another, and the segment is judged. The arrow keys move a
   ring around the grid, and Enter or Space puts a point there. shapes: [{pts, base, par?, xmin?, xmax, ymin?, ymax}] (see
   heightParts; the rest is the grid). opts: ext: draw the base line extended (and, with par, the line across from it);
   many: keep every right height drawn and count them (between parallel sides, they're all the same length). */
function wDraw(el, shapes, opts = {}) {
  const q = Q(el);
  /* first: the segment's first end, once tapped; drawn: the segments judged so far, {a, b, result}; cursor: the keyboard's
     spot, ringed while keyboard is on (from an arrow key until the grid loses focus, so a tap never redraws under a finger) */
  let shapeIndex = 0,
    first = null,
    drawn = [],
    cursor = null,
    keyboard = false;
  el.innerHTML = `<div class="fig hdraw" data-f tabindex="0" aria-label="Grid. Tap two points to draw a segment, or move with the arrow keys and press Enter at each end."></div><div class="wrow"><button type="button" class="ghost-btn" data-show>Show me</button><button type="button" class="ghost-btn" data-n>New shape</button></div><p class="readout" data-r aria-live="polite"></p>`;
  const shape = () => shapes[shapeIndex],
    box = () => ({ xmin: 0, ymin: 0, ...shape() }),
    gridPlane = () => {
      const { xmin, xmax, ymin, ymax } = box();
      return plane({ xmin, xmax, ymin, ymax, u: Math.min(40, 400 / (xmax - xmin)) });
    };
  const center = () => {
    const { xmin, xmax, ymin, ymax } = box();
    return [Math.round((xmin + xmax) / 2), Math.round((ymin + ymax) / 2)];
  };
  /* the words for this shape: index 1 between parallel sides, when there are words for it */
  const says = (code) => DRAW_SAYS[code][shape().par ? DRAW_SAYS[code].length - 1 : 0];
  let message = "";
  const prompt = () =>
    shape().par
      ? "Tap a point on the side across from the base, then the point where the height meets the base line."
      : "Tap the top corner, then the point where the height meets the base line.";
  const draw = () => {
    const P = gridPlane(),
      b = box(),
      parts = heightParts(shape()),
      { pts, par } = shape(),
      fig = q("f");
    let markup = P.grid();
    if (opts.ext) {
      markup += lineAcross(P, b, parts.B0, parts.B1);
      if (par) markup += lineAcross(P, b, parts.top, pts[(shape().base + 3) % pts.length]);
    }
    /* the shape, its base drawn heavy, and the word "base" just outside it (normal is square to the base; flipped to
       point away from the shape) */
    const middle = [(parts.B0[0] + parts.B1[0]) / 2, (parts.B0[1] + parts.B1[1]) / 2],
      unit = Math.hypot(...parts.dir),
      normal = [parts.dir[1] / unit, -parts.dir[0] / unit],
      away = parts.up([middle[0] + normal[0], middle[1] + normal[1]]) > 0 ? -1 : 1,
      labelGap = 0.45;
    markup +=
      P.poly(pts, "sh-a") +
      P.line(parts.B0, parts.B1, "edge") +
      P.text(middle[0] + away * labelGap * normal[0], middle[1] + away * labelGap * normal[1], "base", "lbl s");
    /* the segments drawn so far: right ones as heights, a wrong one in red */
    for (const seg of drawn) {
      if (seg.result.code === "right") {
        const [foot, tip] = parts.up(seg.a) === 0 ? [seg.a, seg.b] : [seg.b, seg.a];
        markup += heightLine(P, parts, tip, foot);
      } else markup += P.line(seg.a, seg.b, "hbad");
    }
    /* every grid point is a dot to tap; the first end of a segment is ringed, and so is the keyboard's spot */
    for (let x = b.xmin; x <= b.xmax; x++)
      for (let y = b.ymin; y <= b.ymax; y++)
        markup += `<circle class="gpt" data-pt="${x},${y}" cx="${P.X(x)}" cy="${P.Y(y)}" r="2.5"/>`;
    if (first) markup += `<circle class="pick" cx="${P.X(first[0])}" cy="${P.Y(first[1])}" r="7"/>`;
    if (keyboard) markup += `<circle class="cursor" cx="${P.X(cursor[0])}" cy="${P.Y(cursor[1])}" r="11"/>`;
    fig.innerHTML = P.svg(markup, `A ${par ? "four-sided shape" : "triangle"} on grid paper, with its base marked`);
    q("r").innerHTML = message || prompt();
  };
  /* what the readout says once a segment is drawn */
  const verdict = (result) => {
    if (result.code !== "right") return `<span class="no">${says(result.code)}</span>`;
    const len = len1(result.len);
    if (shape().par) {
      const count = drawn.filter((seg) => seg.result.code === "right").length;
      return (
        `<span class="ok">That’s a height: square to the base, from one parallel side to the other. It’s <b>${len}</b> units.</span>` +
        (result.outside ? "<br>That one’s outside the shape, and it still counts." : "") +
        (opts.many
          ? `<br>Heights drawn: <b>${count}</b>, ${count > 1 ? `every one ${len} units long` : "so far"}. Draw another one somewhere else.`
          : "")
      );
    }
    return (
      `<span class="ok">That’s the height: from the top corner, square to the base. It’s <b>${len}</b> units.</span>` +
      (result.outside ? "<br>It lands outside the triangle, on the base line extended." : "") +
      (result.isSide ? "<br>Here the height is also a side of the triangle: it’s a right triangle." : "")
    );
  };
  /* keep a judged segment, unless the same one is already drawn (so a height drawn twice counts once) */
  const addSegment = (a, b, result) => {
    const already = drawn.some(
      (seg) => (samePt(seg.a, a) && samePt(seg.b, b)) || (samePt(seg.a, b) && samePt(seg.b, a)),
    );
    if (!already) drawn.push({ a, b, result });
  };
  /* put a point at p: the first end of a segment, or the second, which judges it (the same point again takes the first back) */
  const place = (p) => {
    if (!first) {
      first = p;
      /* a new segment clears the last wrong one, and with many off, the last right one too */
      drawn = opts.many ? drawn.filter((seg) => seg.result.code === "right") : [];
      message = "Now tap the other end.";
    } else if (samePt(first, p)) {
      first = null;
      message = "";
    } else {
      const result = judgeHeight(shape(), first, p);
      addSegment(first, p, result);
      first = null;
      message = verdict(result);
    }
    draw();
  };
  /* the grid point nearest a click or tap (the svg keeps its shape, so one scale fits both ways) */
  const nearestPoint = (e) => {
    const svg = q("f").querySelector("svg"),
      rect = svg.getBoundingClientRect(),
      P = gridPlane(),
      b = box(),
      scale = P.W / rect.width,
      gx = ((e.clientX - rect.left) * scale - P.X(b.xmin)) / P.u + b.xmin,
      gy = b.ymax - ((e.clientY - rect.top) * scale - P.Y(b.ymax)) / P.u;
    return [Math.max(b.xmin, Math.min(b.xmax, Math.round(gx))), Math.max(b.ymin, Math.min(b.ymax, Math.round(gy)))];
  };
  /* a click or tap anywhere on the picture puts a point at the nearest grid point */
  const fig = q("f");
  fig.addEventListener("click", (e) => {
    const svg = fig.querySelector("svg"),
      rect = svg.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
    keyboard = false;
    cursor = nearestPoint(e);
    place(cursor);
  });
  fig.addEventListener("blur", () => {
    if (!keyboard) return;
    keyboard = false;
    draw();
  });
  fig.addEventListener("keydown", (e) => {
    const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
    if (!move && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    /* the first key shows the ring where it last was (the middle of the grid to start) without moving it */
    const b = box(),
      showing = keyboard && cursor;
    cursor = cursor || center();
    keyboard = true;
    if (move && showing)
      cursor = [
        Math.max(b.xmin, Math.min(b.xmax, cursor[0] + move[0])),
        Math.max(b.ymin, Math.min(b.ymax, cursor[1] + move[1])),
      ];
    if (move || !showing) draw();
    else place(cursor);
  });
  /* Show me draws a right height: from the top corner, or across the middle of the side across from the base */
  q("show").onclick = () => {
    const parts = heightParts(shape());
    let tip = parts.top;
    if (shape().par) {
      const { pts } = shape(),
        other = pts[(shape().base + 3) % pts.length];
      tip = [Math.round((tip[0] + other[0]) / 2), Math.round((tip[1] + other[1]) / 2)];
    }
    /* the foot: the tip moved straight down to the base line (the bases here run along grid lines) */
    const t = parts.along(tip),
      foot = [parts.B0[0] + t * parts.dir[0], parts.B0[1] + t * parts.dir[1]];
    first = null;
    drawn = opts.many ? drawn.filter((seg) => seg.result.code === "right") : [];
    const result = judgeHeight(shape(), tip, foot);
    addSegment(tip, foot, result);
    message = verdict(result);
    draw();
  };
  q("n").onclick = () => {
    shapeIndex = (shapeIndex + 1) % shapes.length;
    first = null;
    drawn = [];
    message = "";
    cursor = keyboard ? center() : null;
    draw();
  };
  draw();
}
/* the shapes to draw on: inside heights (step 2), heights that land outside (step 3), and parallel sides (step 5) */
const INSIDE = [
  {
    pts: [
      [0, 0],
      [7, 0],
      [2, 5],
    ],
    base: 0,
    xmax: 8,
    ymax: 6,
  },
  {
    pts: [
      [0, 0],
      [6, 0],
      [4, 4],
    ],
    base: 0,
    xmax: 7,
    ymax: 5,
  },
  {
    pts: [
      [0, 0],
      [6, 0],
      [0, 4],
    ],
    base: 0,
    xmax: 7,
    ymax: 5,
  },
];
const OUTSIDE = [
  {
    pts: [
      [0, 0],
      [3, 0],
      [6, 4],
    ],
    base: 0,
    xmax: 7,
    ymax: 5,
  },
  {
    pts: [
      [4, 0],
      [8, 0],
      [0, 5],
    ],
    base: 0,
    xmax: 9,
    ymax: 6,
  },
  {
    pts: [
      [0, 0],
      [2, 0],
      [5, 3],
    ],
    base: 0,
    xmax: 6,
    ymax: 4,
  },
];
const PARALLEL = [
  {
    pts: [
      [0, 0],
      [4, 0],
      [6, 4],
      [2, 4],
    ],
    base: 0,
    par: true,
    xmin: -1,
    xmax: 8,
    ymax: 5,
  },
  {
    pts: [
      [1, 0],
      [8, 0],
      [6, 3],
      [3, 3],
    ],
    base: 0,
    par: true,
    xmax: 9,
    ymax: 4,
  },
  {
    pts: [
      [1, 1],
      [1, 5],
      [5, 7],
      [5, 3],
    ],
    base: 0,
    par: true,
    xmax: 6,
    ymax: 8,
  },
];

/* ---------- step 4: any side can be the base ---------- */
/* where the height to side i of triangle pts meets that side's line, as a fraction of the way along the side (0 at its first
   end, 1 at its second; below 0 or above 1 is outside the side) */
function footAlong(pts, i) {
  const p = pts[i],
    d = minus(pts[(i + 1) % 3], p);
  return dot2(minus(pts[(i + 2) % 3], p), d) / dot2(d, d);
}
/* the point where the height to side i of triangle pts meets that side's line */
function footOf(pts, i) {
  const p = pts[i],
    d = minus(pts[(i + 1) % 3], p),
    t = footAlong(pts, i);
  return [p[0] + t * d[0], p[1] + t * d[1]];
}
/* Tap a side of a triangle (or its button) to make it the base: the triangle turns until that side is flat, and its height
   appears. TRIS: corners on a grid; side a runs from the first corner to the second, b from the second to the third, c from
   the third back to the first. */
function wTurn(el) {
  const q = Q(el),
    TRIS = [
      {
        name: "a pointed triangle",
        pts: [
          [0, 0],
          [6, 0],
          [3, 4],
        ],
      },
      {
        name: "a wide triangle",
        pts: [
          [0, 0],
          [8, 0],
          [4, 3],
        ],
      },
      {
        name: "a right triangle",
        pts: [
          [0, 0],
          [8, 0],
          [0, 6],
        ],
      },
    ],
    LETTERS = ["a", "b", "c"],
    turnMs = 450;
  let triIndex = 0,
    baseSide = 0,
    angle = 0,
    tried = new Set([0]),
    frame = null;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${seg(
    "Which side is the base",
    LETTERS.map((letter, i) => [i, `Base ${letter}`]),
  )}<button type="button" class="ghost-btn" data-n>New triangle</button></div><p class="readout" data-r aria-live="polite"></p>`;
  const tri = () => TRIS[triIndex].pts,
    sideLen = (i) => Math.hypot(...minus(tri()[(i + 1) % 3], tri()[i])),
    twiceArea = () => Math.abs(cross2(minus(tri()[1], tri()[0]), minus(tri()[2], tri()[0])));
  /* the middle of the triangle (the average of its corners), which it turns about */
  const middle = () => [0, 1].map((k) => tri().reduce((sum, p) => sum + p[k], 0) / 3);
  /* the turn that lays side i flat along the bottom, with the third corner above it */
  const flatAngle = (i) => {
    const d = minus(tri()[(i + 1) % 3], tri()[i]),
      above = cross2(d, minus(tri()[(i + 2) % 3], tri()[i])) > 0;
    return above ? -Math.atan2(d[1], d[0]) : -Math.atan2(-d[1], -d[0]);
  };
  /* a corner turned by the angle about the middle */
  const turned = (p, by) => {
    const [mx, my] = middle(),
      dx = p[0] - mx,
      dy = p[1] - my;
    return [mx + dx * Math.cos(by) - dy * Math.sin(by), my + dx * Math.sin(by) + dy * Math.cos(by)];
  };
  /* the smallest and largest x and y of some points */
  const boundsOf = (points) =>
    [0, 1].map((k) => [Math.min(...points.map((p) => p[k])), Math.max(...points.map((p) => p[k]))]);
  /* the picture's size, in grid units: as wide and as tall as the triangle gets at any turn (tried every 5°), plus room for
     the side labels. (A height's foot is straight below the top corner, so it never sticks out past the corners.) */
  const frameSize = () => {
    const labelRoomX = 1.5,
      labelRoomY = 0.9;
    let width = 0,
      height = 0;
    for (let degrees = 0; degrees < 180; degrees += 5) {
      const [[x0, x1], [y0, y1]] = boundsOf(tri().map((p) => turned(p, (degrees * Math.PI) / 180)));
      width = Math.max(width, x1 - x0);
      height = Math.max(height, y1 - y0);
    }
    return [width + 2 * labelRoomX, height + 2 * labelRoomY];
  };
  const draw = () => {
    /* the turned triangle sits in the middle of the picture */
    const corners = tri().map((p) => turned(p, angle)),
      [[x0, x1], [y0, y1]] = boundsOf(corners),
      [frameW, frameH] = frameSize(),
      cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      P = plane({
        xmin: cx - frameW / 2,
        xmax: cx + frameW / 2,
        ymin: cy - frameH / 2,
        ymax: cy + frameH / 2,
        u: Math.min(34, 380 / frameW),
      }),
      flat = Math.abs(angle - flatAngle(baseSide)) < 1e-9;
    let markup = P.poly(corners, "sh-a");
    /* where the height meets the base line: before the base (t < 0), past it (t > 1), or at one of its ends (a right
       angle, so the height is a side); turned corners aren't whole numbers, so compare with a little slack */
    const slack = 1e-9,
      t = footAlong(tri(), baseSide),
      outside = t < -slack || t > 1 + slack,
      atEnd = Math.abs(t) < slack || Math.abs(t - 1) < slack,
      height = len1(twiceArea() / sideLen(baseSide));
    /* when the height lands outside, the side between it and the base has its label inside the triangle, clear of the height */
    const besideHeight = !flat || !outside ? -1 : t > 1 ? (baseSide + 1) % 3 : (baseSide + 2) % 3;
    /* how far a side's label sits from it: farther from a steep side, since the label is wider than it is tall */
    const labelGap = (out) => 0.45 + 0.8 * Math.abs(out[0]);
    /* each side: a wide clear line to tap, the side itself (heavy when it’s the base), and its letter and length (outside it, but for besideHeight) */
    corners.forEach((p, i) => {
      const q2 = corners[(i + 1) % 3],
        third = corners[(i + 2) % 3],
        mid = [(p[0] + q2[0]) / 2, (p[1] + q2[1]) / 2],
        d = minus(q2, p),
        unit = Math.hypot(...d),
        awaySign = (cross2(d, minus(third, p)) > 0 ? -1 : 1) * (i === besideHeight ? -1 : 1),
        out = [(-d[1] / unit) * awaySign, (d[0] / unit) * awaySign];
      markup +=
        (i === baseSide ? P.line(p, q2, "edge") : "") +
        `<line class="hitline" data-i="${i}" x1="${P.X(p[0])}" y1="${P.Y(p[1])}" x2="${P.X(q2[0])}" y2="${P.Y(q2[1])}"/>` +
        P.text(
          mid[0] + labelGap(out) * out[0],
          mid[1] + labelGap(out) * out[1],
          `${LETTERS[i]} = ${len1(sideLen(i))}`,
          `lbl s${i === baseSide ? "" : " cy"}`,
        );
    });
    /* once the base is flat, its height from the third corner, with the base line extended when the foot is outside */
    if (flat) {
      const parts = heightParts({ pts: corners, base: baseSide }),
        tip = corners[(baseSide + 2) % 3],
        foot = [parts.B0[0] + t * parts.dir[0], parts.B0[1] + t * parts.dir[1]];
      if (t < -slack) markup += P.line(foot, parts.B0, "ext");
      if (t > 1 + slack) markup += P.line(parts.B1, foot, "ext");
      markup +=
        heightLine(P, parts, tip, foot) +
        /* the height's length goes three-quarters of the way up, on the side away from the triangle, clear of the side labels */
        P.text(
          foot[0] + 0.75 * (tip[0] - foot[0]),
          foot[1] + 0.75 * (tip[1] - foot[1]),
          height,
          t > 0.5 ? "lbl st" : "lbl en",
          t > 0.5 ? 8 : -8,
        );
    }
    q("f").innerHTML = P.svg(
      markup,
      `${TRIS[triIndex].name} with sides a, b, and c, turned so side ${LETTERS[baseSide]} is the base`,
    );
    press(el, baseSide);
    const base = len1(sideLen(baseSide)),
      area = len1(twiceArea() / 2),
      where = outside ? " It lands outside the triangle." : atEnd ? " It’s a side of the triangle." : "";
    q("r").innerHTML =
      `Base <b>${LETTERS[baseSide]}</b> = ${base} · Height = ${height}.${where}<br>Area = ½ × ${base} × ${height} = <b>${area}</b> square units` +
      (tried.size === 3
        ? `<br><span class="ok">Every side gives ${area}: each base has its own height, and the area comes out the same.</span>`
        : `<br><span class="dimline">Tap another side to make it the base.</span>`);
  };
  /* turn to lay side i flat: a short animation the shortest way round (none for reduced motion) */
  const turnTo = (i) => {
    baseSide = i;
    tried.add(i);
    const from = angle,
      target = flatAngle(i);
    let delta = ((((target - from + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    if (frame) cancelAnimationFrame(frame);
    if (reduceMotion || Math.abs(delta) < 1e-9) {
      angle = target;
      return draw();
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / turnMs),
        eased = progress * progress * (3 - 2 * progress);
      angle = progress === 1 ? target : from + delta * eased;
      draw();
      frame = progress === 1 ? null : requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  onPick(el, (id) => turnTo(+id));
  q("f").addEventListener("click", (e) => {
    const side = e.target.closest("[data-i]");
    if (side) turnTo(+side.dataset.i);
  });
  q("n").onclick = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = null;
    triIndex = (triIndex + 1) % TRIS.length;
    baseSide = 0;
    tried = new Set([0]);
    angle = flatAngle(0);
    draw();
  };
  angle = flatAngle(0);
  draw();
  return () => frame && cancelAnimationFrame(frame);
}
/* ---------- the quick checks' figures ---------- */
const F = {};
{
  /* A leans 1 unit off square, B is the height, C is square to the base but misses the top corner */
  const P = plane({ xmax: 8, ymax: 5, u: 40 });
  F.almost = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [8, 0],
          [3, 5],
        ],
        "sh-a",
      ) +
      P.line([3, 5], [2, 0], "seg-b") +
      P.line([3, 5], [3, 0], "seg-c") +
      P.line([5, 0], [5, 3], "seg-b") +
      P.text(2.2, 1.6, "A", "lbl en", -8) +
      P.text(3, 1.6, "B", "lbl st", 8) +
      P.text(5, 1.5, "C", "lbl st", 8) +
      P.text(4, 0, "base", "lbl s", 0, 16),
    "A triangle with three segments labeled A, B, and C",
  );
}
{
  /* a height drawn from the top corner that stops 1 unit above the base */
  const P = plane({ xmax: 8, ymax: 5, u: 40 });
  F.stops = P.svg(
    P.grid() +
      P.poly(
        [
          [0, 0],
          [7, 0],
          [5, 4],
        ],
        "sh-a",
      ) +
      P.line([0, 0], [7, 0], "edge") +
      P.line([5, 4], [5, 1], "seg-a") +
      P.text(3.5, 0, "base", "lbl s", 0, 16),
    "A triangle with a segment drawn down from the top corner that ends 1 unit above the base",
  );
}
{
  /* the top corner is 6 over and 4 up: the height lands outside, on the base line extended */
  const P = plane({ xmax: 7, ymax: 5, u: 40 });
  F.outside = P.svg(
    P.grid() +
      P.line([3, 0], [7, 0], "ext") +
      P.poly(
        [
          [0, 0],
          [3, 0],
          [6, 4],
        ],
        "sh-a",
      ) +
      P.text(1.5, 0, "3", "lbl", 0, 16) +
      P.text(4.5, 2, "5", "lbl s cy st", 12) +
      P.text(2.6, 2.3, "7.2", "lbl s cy en", -8),
    "A leaning triangle with base 3, a slanted side of 5, and a slanted side of 7.2",
  );
}
{
  /* a pointed triangle; P is the height for the bottom side a, Q for the right side b, R for the left side c */
  const A = [0, 0],
    B = [8, 0],
    C = [3, 5],
    P = plane({ xmin: -0.5, xmax: 8.5, ymin: -0.8, ymax: 5.6, u: 40 }),
    footA = [3, 0],
    footB = [4, 4],
    footC = footOf([C, A, B], 0);
  const parts = (pts, base) => heightParts({ pts, base });
  F.whichBase = P.svg(
    P.poly([A, B, C], "sh-a") +
      heightLine(P, parts([A, B, C], 0), C, footA) +
      heightLine(P, parts([B, C, A], 0), A, footB) +
      heightLine(P, parts([C, A, B], 0), B, footC) +
      P.text(4, 0, "a", "lbl cy", 0, 16) +
      P.text(5.5, 2.5, "b", "lbl cy", 12, -6) +
      P.text(1.5, 2.5, "c", "lbl cy", -14) +
      P.text(3, 0.9, "P", "lbl st", 6) +
      P.text(1.4, 1.4, "Q", "lbl", 8, 10) +
      P.text(6.6, 0.84, "R", "lbl", 0, 14),
    "A triangle with sides a, b, and c, and three heights labeled P, Q, and R",
  );
}
{
  /* a trapezoid: A is square to the parallel sides outside it, B inside it */
  const P = plane({ xmin: -1, xmax: 9, ymax: 3, u: 38 });
  F.twoHeights = P.svg(
    P.grid() +
      P.line([-1, 0], [9, 0], "ext") +
      P.line([-1, 3], [9, 3], "ext") +
      P.poly(
        [
          [0, 0],
          [6, 0],
          [5, 3],
          [2, 3],
        ],
        "sh-a",
      ) +
      P.line([8, 3], [8, 0], "seg-a") +
      P.rt(8, 0, -1) +
      P.line([3, 3], [3, 0], "seg-a") +
      P.rt(3, 0) +
      P.text(8, 1.5, "A", "lbl st", 8) +
      P.text(3, 1.5, "B", "lbl st", 8),
    "A trapezoid with its parallel sides extended, and two segments, A outside it and B inside it",
  );
}

const STEPS = [
  {
    title: "Square to the base",
    widget: wPaper,
    body: "<p>The <b>height</b> is how far the top corner is from the base, measured <b>square to the base</b>: at a right angle, like the corner of a sheet of paper.</p><p>Set the paper’s corner on the base line and slide it until its edge touches the top corner. The edge shows you the height.</p>",
    check: {
      kind: "mc",
      fig: F.almost,
      q: "Which segment is the <b>height</b> for this base?",
      choices: [
        { id: "A", label: "A" },
        { id: "B", label: "B" },
        { id: "C", label: "C" },
      ],
      answer: "B",
      why: {
        A: "A is close, but it leans: it meets the base 1 unit to the side of the top corner. A paper’s corner wouldn’t fit.",
        C: "C is square to the base, but it doesn’t go to the top corner. The height goes from the top corner, the one across from the base.",
      },
      explain: "B goes from the top corner straight down to the base, square to it. It’s 5 units tall.",
    },
  },
  {
    title: "Draw it yourself",
    widget: (el) => wDraw(el, INSIDE),
    body: "<p>Now draw the height. Tap the <b>top corner</b>, the one across from the base. Then tap the point on the base where the height meets it, square to the base.</p><p>Draw it wrong on purpose, too, and see what goes wrong.</p>",
    check: {
      kind: "mc",
      stack: true,
      fig: F.stops,
      q: "Kiran drew this height for the base. What went wrong?",
      choices: [
        { id: "lean", label: "It isn’t square to the base" },
        { id: "short", label: "It stops before the base line" },
        { id: "corner", label: "It starts at the wrong corner" },
        { id: "none", label: "Nothing: it’s right" },
      ],
      answer: "short",
      why: {
        lean: "It is square to the base: it goes straight down. Look at where it ends.",
        corner: "It starts at the top corner, the one across from the base. That’s right. Look at where it ends.",
        none: "Look at the bottom end: it stops 1 unit above the base.",
      },
      explain:
        "It starts at the top corner and goes straight down, but stops 1 unit short. A height goes all the way to the base line: here it’s 4 units, not 3.",
    },
  },
  {
    title: "When it lands outside",
    widget: (el) => wDraw(el, OUTSIDE, { ext: true }),
    body: "<p>When the top corner leans past the end of the base, the height lands <b>outside</b> the triangle.</p><p>Extend the base with a dotted line. The height goes from the top corner down to that line, still square to it.</p>",
    check: {
      kind: "num",
      unit: "units",
      answer: 4,
      fig: F.outside,
      q: "How tall is this triangle, for the base of 3? Count the grid squares.",
      misc: [
        [5, "5 is the slanted side. The height goes straight down from the top corner to the dotted line."],
        [7.2, "7.2 is the other slanted side. The height is square to the base."],
        [3, "3 is the base. The height is how far up the top corner is from the base line."],
        [6, "6 is how far over the top corner is. The height is how far up it is from the base line."],
      ],
      explain:
        "The top corner is 4 squares above the dotted base line, so the height is 4 units, outside the triangle.",
    },
  },
  {
    title: "Any side can be the base",
    widget: wTurn,
    body: "<p>The base doesn’t have to be the bottom side. <b>Any side can be the base</b>, and each one has its own height: square to that side, from the corner across from it.</p><p>Tap a side to make it the base. The triangle turns so that side is flat, and its height appears.</p>",
    check: {
      kind: "mc",
      fig: F.whichBase,
      q: "Which height goes with side <b>c</b>?",
      choices: [
        { id: "P", label: "P" },
        { id: "Q", label: "Q" },
        { id: "R", label: "R" },
      ],
      answer: "R",
      why: {
        P: "P is square to side a, the bottom side, so it goes with a. Side c doesn’t have to be at the bottom.",
        Q: "Q is square to side b. Find the height that meets side c at a right angle.",
      },
      explain:
        "R comes from the corner across from side c and meets c at a right angle (see the little square). Turn the page until c is flat, and R points straight up.",
    },
  },
  {
    title: "Parallelograms and trapezoids",
    widget: (el) => wDraw(el, PARALLEL, { ext: true, many: true }),
    body: "<p>A parallelogram or a trapezoid has two <b>parallel sides</b>. Its height is the distance between them, square to both.</p><p>So you can draw the height anywhere from one parallel side to the other, even outside the shape on the dotted lines. Draw a few: they’re all the same length.</p>",
    check: {
      kind: "mc",
      stack: true,
      fig: F.twoHeights,
      q: "Which segments are heights of this trapezoid, for its parallel sides?",
      choices: [
        { id: "A", label: "Only A" },
        { id: "B", label: "Only B" },
        { id: "both", label: "Both A and B" },
        { id: "neither", label: "Neither" },
      ],
      answer: "both",
      why: {
        A: "B is a height too: it’s square to both parallel sides and goes from one to the other.",
        B: "A is outside the trapezoid, but it’s square to the two parallel sides (extended) and goes from one to the other, so it’s a height too.",
        neither: "Both are square to the parallel sides and go from one to the other. That’s what a height is.",
      },
      explain:
        "A height of a trapezoid is any segment square to its parallel sides, from one to the other. A and B are both 3 units: inside or outside, it’s the same height.",
    },
  },
];
