/* SVG and table diagrams from class: double number lines, tables of equivalent ratios, rows of shapes, recipe batches,
   paint colors, tape diagrams, coins, and percent tapes and number lines. Styles are in figures.css.
   Figures are functions of `show` (true once a hint is used or the problem is done) that return markup.
   Labels use the page's own fmt(n) unless you pass a formatter. */
/* an svg w × h with body inside, as wide as w at most (narrower on a phone); label is what a screen reader says */
const svgWrap = (w, h, body, label = "Diagram") =>
  `<svg viewBox="0 0 ${w} ${h}" style="max-width:${w}px" role="img" aria-label="${label}">${body}</svg>`;
/* the gold "?" box that marks the unknown */
const qbox = (x, y, t = "?") =>
  `<g class="qb"><rect x="${x - 20}" y="${y - 15}" width="40" height="30" rx="7"/><text x="${x}" y="${y + 1}">${t}</text></g>`;

/* Double number line. ticks: [{t, b, st, sb, q}] where t/b are the top/bottom values,
   st/sb: 0 hidden · 1 shown · 2 shown with the hint, and q: 't' or 'b' puts the "?" on that line. */
function dnl(topL, botL, ticks, { ft = fmt, fb = fmt } = {}) {
  return (show) => {
    /* both lines run from x0 to x1 and on to their arrowheads; the last tick sits at x1, so ticks are placed by top value */
    const width = 620,
      x0 = 34,
      x1 = width - 60,
      max = ticks[ticks.length - 1].t,
      xOf = (v) => x0 + ((x1 - x0) * v) / max,
      topY = 62,
      botY = 136;
    let markup = `<text class="ftxt" x="4" y="18">${topL}</text><text class="ftxt" x="4" y="202">${botL}</text>`;
    [topY, botY].forEach(
      (y) =>
        (markup += `<line class="nl" x1="${x0 - 14}" y1="${y}" x2="${width - 30}" y2="${y}"/><polygon class="nl-arrow" points="${width - 18},${y} ${width - 32},${y - 7} ${width - 32},${y + 7}"/>`),
    );
    ticks.forEach((tick) => {
      /* values the hint reveals, and their ticks, are cyan (rev) */
      const x = xOf(tick.t),
        hintTop = tick.st === 2,
        hintBot = tick.sb === 2,
        tickCls = `tick${(hintTop || hintBot) && show ? " rev" : ""}`;
      markup += `<line class="${tickCls}" x1="${x}" y1="${topY - 9}" x2="${x}" y2="${topY + 9}"/><line class="${tickCls}" x1="${x}" y1="${botY - 9}" x2="${x}" y2="${botY + 9}"/>`;
      if (tick.q === "t") markup += qbox(x, topY - 28);
      else if (tick.st === 1 || (hintTop && show))
        markup += `<text class="ftxt big mid${hintTop ? " rev" : ""}" x="${x}" y="${topY - 20}">${ft(tick.t)}</text>`;
      if (tick.q === "b") markup += qbox(x, botY + 30);
      else if (tick.sb === 1 || (hintBot && show))
        markup += `<text class="ftxt big mid${hintBot ? " rev" : ""}" x="${x}" y="${botY + 36}">${fb(tick.b)}</text>`;
    });
    return svgWrap(width, 212, markup, "Double number line");
  };
}

/* Table of equivalent ratios. c: {hx, hy} column headings.
   rows: [{x, y, q, h, note}] where q: 'x' or 'y' marks the unknown, h: row appears only with the hint, note: hint text beside it. */
function tableFig(c, rows) {
  const cell = (row, which) => (row.q === which ? '<span class="q">?</span>' : fmt(row[which]));
  return (show) => {
    const body = rows
      .filter((r) => show || !r.h)
      .map(
        (r) =>
          `<tr class="${r.h ? "rev" : ""}"><td>${cell(r, "x")}</td><td>${cell(r, "y")}</td><td class="note">${show && r.note ? r.note : ""}</td></tr>`,
      )
      .join("");
    return `<table class="rt" aria-label="Table of equivalent ratios"><thead><tr><th>${c.hx}</th><th>${c.hy}</th><th></th></tr></thead><tbody>${body}</tbody></table>`;
  };
}

/* ---------- ratio diagrams (Grade 6 Unit 2) ---------- */
/* shapes to count in ratio diagrams, each with its names and d(x, y, size) that draws it in a size × size box from x, y */
const STAR = [
  [12, 2],
  [15, 9],
  [22.5, 9.3],
  [16.6, 14],
  [18.7, 21.5],
  [12, 17.2],
  [5.3, 21.5],
  [7.4, 14],
  [1.5, 9.3],
  [9, 9],
];
const MARKS = [
  {
    one: "circle",
    many: "circles",
    d: (x, y, s) => `<circle class="ic-a" cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2 - 2}"/>`,
  },
  {
    one: "square",
    many: "squares",
    d: (x, y, s) => `<rect class="ic-b" x="${x + 2}" y="${y + 2}" width="${s - 4}" height="${s - 4}" rx="3"/>`,
  },
  {
    one: "triangle",
    many: "triangles",
    d: (x, y, s) =>
      `<polygon class="ic-c" points="${x + s / 2},${y + 2} ${x + s - 2},${y + s - 2} ${x + 2},${y + s - 2}"/>`,
  },
  /* STAR's points are in a 24 × 24 box */
  {
    one: "star",
    many: "stars",
    d: (x, y, s) =>
      `<polygon class="ic-d" points="${STAR.map((p) => `${x + (p[0] * s) / 24},${y + (p[1] * s) / 24}`).join(" ")}"/>`,
  },
];
/* Two rows of shapes. With groups=k, each row is split into k equal groups boxed together. */
function rowsDiagram(rows, { groups = 0, s = 30, label = "Diagram of shapes" } = {}) {
  /* each shape takes `step` pixels (its size plus a gap); pad around the whole */
  const step = s + 6,
    pad = 10;
  let markup = "",
    width;
  if (groups) {
    /* every group box is as wide as the row with the most shapes per group needs */
    const perGroup = rows.map((r) => r.n / groups),
      groupW = Math.max(...perGroup) * step + 10;
    width = pad * 2 + groups * groupW + (groups - 1) * 14;
    for (let j = 0; j < groups; j++) {
      const groupX = pad + j * (groupW + 14);
      markup += `<rect class="grp" x="${groupX}" y="${pad - 4}" width="${groupW}" height="${rows.length * step + 8}" rx="8"/>`;
      rows.forEach((r, i) => {
        for (let q = 0; q < perGroup[i]; q++) markup += r.sh.d(groupX + 5 + q * step, pad + i * step, s);
      });
    }
  } else {
    width = pad * 2 + Math.max(...rows.map((r) => r.n)) * step;
    rows.forEach((r, i) => {
      for (let q = 0; q < r.n; q++) markup += r.sh.d(pad + q * step, pad + i * step, s);
    });
  }
  return svgWrap(width, pad * 2 + rows.length * step, markup, label);
}
/* n batches of a recipe with a of one thing and b of another (rec: {dish, x: [one, many], y: [one, many]}), drawn with shapes A and B */
function batchDiagram(a, b, n, rec, A = MARKS[0], B = MARKS[1]) {
  /* a row per batch: its name in labelW, then a shapes, a gap, and b shapes, each `step` apart */
  const size = 26,
    step = 32,
    labelW = 88,
    rowH = 40;
  let markup = "";
  const width = labelW + (a + b) * step + 30,
    height = n * rowH + 64;
  for (let i = 0; i < n; i++) {
    const y = 12 + i * rowH;
    markup += `<text class="ftxt${i ? " rev" : ""}" x="6" y="${y + 19}">Batch ${i + 1}</text>`;
    for (let q = 0; q < a; q++) markup += A.d(labelW + q * step, y, size);
    for (let q = 0; q < b; q++) markup += B.d(labelW + a * step + 18 + q * step, y, size);
  }
  /* the batches after the first are boxed together as the new ones */
  if (n > 1)
    markup += `<rect class="grp new" x="2" y="${12 + rowH - 6}" width="${width - 4}" height="${(n - 1) * rowH + 2}" rx="8"/>`;
  /* the key under the batches: what each shape stands for */
  const keyY = n * rowH + 30;
  markup += A.d(6, keyY - 4, 20) + `<text class="ftxt" x="32" y="${keyY + 11}">= 1 ${rec.x[0]}</text>`;
  markup += B.d(6, keyY + 20, 20) + `<text class="ftxt" x="32" y="${keyY + 35}">= 1 ${rec.y[0]}</text>`;
  return svgWrap(Math.max(width, 300), height + 22, markup, `${n} batches of ${rec.dish}`);
}
/* the color of a paint mix of bl parts blue and ye parts yellow: equivalent mixes get the same color.
   The share of yellow moves the hue from blue (225) toward yellow (55) and makes it lighter. */
const mixColor = (bl, ye) => {
  const yellowShare = ye / (bl + ye);
  return `hsl(${Math.round(225 - yellowShare * 170)} 72% ${Math.round(42 + yellowShare * 16)}%)`;
};
/* A tape diagram for a part-part-whole ratio a : b with k in each box (c: {A, B} names for the two parts). The options mark
   what's unknown (qa, qb, qt get a "?") and what's shown. Returns a figure: a function of show (the box values). */
function tapeFig(c, a, b, k, { qa, qb, qt, showA, showB, showT }) {
  return (show) => {
    /* two tapes of boxW boxes, at heights y1 and y2; rightX is where the longer one ends */
    const boxW = 46,
      x0 = 10,
      y1 = 34,
      y2 = 112,
      longest = Math.max(a, b),
      rightX = x0 + longest * boxW;
    let markup = "";
    /* a tape of `count` boxes at height y: its name above, k in each box (once shown), and its total or a "?" after it */
    const tape = (y, count, cls, name, total, ask) => {
      let s = `<text class="ftxt" x="${x0}" y="${y - 10}">${name}</text>`;
      for (let i = 0; i < count; i++) {
        s += `<rect class="tape ${cls}" x="${x0 + i * boxW}" y="${y}" width="${boxW}" height="38"/>`;
        if (show) s += `<text class="ftxt big mid rev" x="${x0 + i * boxW + boxW / 2}" y="${y + 26}">${k}</text>`;
      }
      const endX = x0 + count * boxW + 26;
      if (ask) s += qbox(endX + 8, y + 19);
      else if (total != null) s += `<text class="ftxt big" x="${endX - 10}" y="${y + 26}">${total}</text>`;
      return s;
    };
    markup += tape(y1, a, "", c.A, showA ? k * a : null, qa) + tape(y2, b, "b", c.B, showB ? k * b : null, qb);
    /* a curly brace past both tapes, pointing at the total */
    const braceX = rightX + 90;
    markup += `<path class="brace" d="M${braceX},${y1} q14,0 14,14 v${(y2 + 38 - y1) / 2 - 24} q0,10 10,10 q-10,0 -10,10 v${(y2 + 38 - y1) / 2 - 24} q0,14 -14,14"/>`;
    const midY = (y1 + y2 + 38) / 2;
    if (qt) markup += qbox(braceX + 52, midY);
    else if (showT) markup += `<text class="ftxt big" x="${braceX + 32}" y="${midY + 7}">${k * (a + b)}</text>`;
    markup += `<text class="ftxt" x="${braceX + 32}" y="${midY + 30}">total</text>`;
    return svgWrap(braceX + 110, 170, markup, "Tape diagram");
  };
}

/* ---------- percents (Grade 6 Unit 3) ---------- */
/* coins to count in cents (a percent of a dollar), drawn in a row by coinsFig(list) */
const COIN_SET = [
  { v: 25, r: 24, n: "quarter" },
  { v: 10, r: 18, n: "dime" },
  { v: 5, r: 21, n: "nickel" },
  { v: 1, r: 19, n: "penny", cu: 1 },
];
function coinsFig(list) {
  let x = 6,
    markup = "";
  list.forEach((c) => {
    markup += `<circle class="coin${c.cu ? " cu" : ""}" cx="${x + c.r}" cy="34" r="${c.r}"/><text class="coin-t" x="${x + c.r}" y="35">${c.v}¢</text>`;
    x += c.r * 2 + 8;
  });
  return () => svgWrap(x, 68, markup, "Coins");
}
/* A percent tape: the whole split into n equal boxes worth each, with m of them as the part, and a 0%–100% scale under it.
   W and part are the amounts; qW, qP put a "?" on the one to find. Returns a figure: a function of show (the box values). */
function pctTape(n, m, { W, part, qW, qP, each }) {
  return (show) => {
    const tapeW = 460,
      boxW = tapeW / n,
      x0 = 10;
    let markup = `<text class="ftxt" x="${x0}" y="18">whole</text>`;
    /* the whole: n boxes, each worth `each` (written once shown), then its amount or a "?" */
    for (let i = 0; i < n; i++) {
      markup += `<rect class="tape b" x="${x0 + i * boxW}" y="26" width="${boxW}" height="38"/>`;
      if (show) markup += `<text class="ftxt mid rev" x="${x0 + i * boxW + boxW / 2}" y="51">${fmt(each)}</text>`;
    }
    markup += qW ? qbox(x0 + tapeW + 34, 45) : `<text class="ftxt big" x="${x0 + tapeW + 12}" y="52">${fmt(W)}</text>`;
    /* the part: m of the same boxes under it */
    markup += `<text class="ftxt" x="${x0}" y="96">part</text>`;
    for (let i = 0; i < m; i++) {
      markup += `<rect class="tape" x="${x0 + i * boxW}" y="104" width="${boxW}" height="38"/>`;
      if (show) markup += `<text class="ftxt mid rev" x="${x0 + i * boxW + boxW / 2}" y="129">${fmt(each)}</text>`;
    }
    markup += qP
      ? qbox(x0 + m * boxW + 34, 123)
      : `<text class="ftxt big" x="${x0 + m * boxW + 12}" y="130">${fmt(part)}</text>`;
    /* the percent scale: a tick at every box edge */
    for (let i = 0; i <= n; i++)
      markup += `<line class="tick" x1="${x0 + i * boxW}" y1="150" x2="${x0 + i * boxW}" y2="160"/><text class="ftxt mid" x="${x0 + i * boxW}" y="178">${fmt((100 * i) / n)}%</text>`;
    markup += `<line class="nl" x1="${x0}" y1="155" x2="${x0 + tapeW}" y2="155"/>`;
    return svgWrap(tapeW + 80, 188, markup, "Percent tape diagram");
  };
}
/* A double number line for a percent problem: the amount on top and 0%–100% below. The whole W is 100%, and x is P%;
   askA, askP, askW put a "?" on the amount, the percent, or the whole. Returns a figure: a function of show. */
function pctLine(W, P, x, { askA, askP, askW }) {
  /* a tick every 10%, to 100% or past it to P */
  const top = Math.max(100, P),
    ticks = [];
  for (let p = 0; p <= top; p += 10) {
    if (p === P) continue;
    /* 10% is the hint's step (shown once there's a hint), unless P is within 10 of it */
    const tenHint = p === 10 && Math.abs(P - 10) >= 10;
    /* the top value shows at 0% and at 100% (the whole) unless the whole is asked; the bottom shows at 0% and 100% */
    const st = p === 100 && !askW ? 1 : tenHint ? 2 : p === 0 ? 1 : 0,
      sb = tenHint ? 2 : p === 0 || p === 100 ? 1 : 0;
    ticks.push({ t: (W * p) / 100, b: p, st, sb, q: p === 100 && askW ? "t" : null });
  }
  /* P%'s tick: its amount and percent, or a "?" on the one asked */
  ticks.push({ t: x, b: P, st: askA ? 0 : 1, sb: askP ? 0 : 1, q: askA ? "t" : askP ? "b" : null });
  ticks.sort((a, b) => a.t - b.t);
  return dnl("amount", "percent", ticks, { fb: (v) => fmt(v) + "%" });
}
