/* Counting and place value for K–5 pages: ten-frames, connecting cubes, base-ten blocks (tens and ones, and small ones with
   hundreds), place-value charts, number words, and the standard algorithm to add or subtract. Styles are in blocks.css.
   Needs util.js, figures.js (svgWrap), and pictures.js.

   tenFrames(cells, {frames, out, tap, label})
   CUBE, cubes(x, y, n, cls)         a row of connecting cubes (markup), CUBE pixels each
   BLOCK, rod(x, y, cls), one(x, y, cls)   one ten, one one (markup), BLOCK pixels a cube
   blocks(x, y, tens, ones, cls, {traded, outT, outO})   tens and ones; returns [markup, width]
   addBlocks(a, b, joined)           a + b in blocks, apart or tens with tens and ones with ones (svg)
   tensOnesAdd(pairs)                widget: pick a + b, then join tens and ones
   BT, flat, stick, cube1, hto(x, y, h, t, o, {cls, tr}), htoFig(h, t, o, opt, label)   small base-ten diagrams with hundreds;
                                     numBlocks(n) draws n
   digits(n), numWords(n)            [hundreds, tens, ones] of n, and its name up to 999,999 ("four hundred six")
   pvChart(rows, hi, {places, tap}), PLACE, digitAt(n, e), commas(n)   a place-value chart (html table), hundredths to hundred-thousands; "305,020"
   algSteps(a, b, op), algFig(a, b, op, done)   the standard algorithm to add or subtract, column by column (svg)
   mulSteps(a, b), mulFig(a, b, done)   the standard algorithm to multiply by a one-digit number, column by column (svg)
   divideFig(n, groups, {split})     n in base-ten blocks, shared into equal groups with any left over (svg)
   quotientFig(n, divisor, chunks, shown)   n ÷ divisor by partial quotients: chunks taken away one at a time (svg) */
/* Ten-frames, 2 rows of 5 each. cells: a class for each filled cell in order ('a' gold, 'b' blue, null empty).
   out: set of crossed-out cells. tap: empty cells can be tapped (data-i). */
const CELL = 44;
function tenFrames(cells, { frames = 2, out = new Set(), tap = false, label = "Ten-frames" } = {}) {
  const frameGap = 18,
    width = frames * 5 * CELL + (frames - 1) * frameGap + 4,
    height = 2 * CELL + 4;
  let markup = "";
  range(frames * 10).forEach((i) => {
    /* cell i is in frame i ÷ 10, on row 0 or 1 of it, in column i % 5 */
    const frame = Math.floor(i / 10),
      row = Math.floor((i % 10) / 5),
      col = i % 5;
    const x = 2 + frame * (5 * CELL + frameGap) + col * CELL,
      y = 2 + row * CELL,
      cls = cells[i];
    markup += `<rect class="cell" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
    if (cls) {
      /* a counter, with a red X through it when it's taken away */
      const gone = out.has(i),
        near = 11,
        far = CELL - 11;
      const cross = gone
        ? `<path d="M${x + near},${y + near}L${x + far},${y + far}M${x + far},${y + near}L${x + near},${y + far}"/>`
        : "";
      markup += `<g class="ctr ${cls}${gone ? " gone" : ""}" data-i="${i}"><circle cx="${x + CELL / 2}" cy="${y + CELL / 2}" r="${CELL / 2 - 6}"/>${cross}</g>`;
    } else if (tap) markup += `<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
  });
  return svgWrap(width, height, markup, label);
}
/* a row of connecting cubes starting at x, y */
const CUBE = 32;
const cubes = (x, y, n, cls) =>
  range(n)
    .map(
      (i) => `<rect class="cube ${cls}" x="${x + i * CUBE}" y="${y}" width="${CUBE - 2}" height="${CUBE - 2}" rx="3"/>`,
    )
    .join("");
/* base-ten blocks: tens are rods of 10, ones are single cubes, BLOCK pixels each */
const BLOCK = 16;
/* a rod: a tall rectangle with lines marking its 10 cubes */
const rod = (x, y, cls = "") =>
  `<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK * 10}"/>${range(9)
    .map((i) => `<line x1="${x}" y1="${y + BLOCK * (i + 1)}" x2="${x + BLOCK}" y2="${y + BLOCK * (i + 1)}"/>`)
    .join("")}</g>`;
const one = (x, y, cls = "") => `<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${BLOCK}" height="${BLOCK}"/>`;
/* Tens and ones as blocks from x, ones in columns of 5; returns [markup, width].
   traded: the last `traded` ones came from a broken ten (drawn in green). outT, outO: the last tens and ones are crossed out. */
function blocks(x, y, tens, ones, cls = "", { traded = 0, outT = 0, outO = 0 } = {}) {
  let markup = "";
  /* tens: rods side by side, 6 pixels apart */
  range(tens).forEach((i) => {
    const gone = i >= tens - outT,
      rodX = x + i * (BLOCK + 6);
    markup += rod(rodX, y, cls + (gone ? " gone" : "")) + (gone ? xOut(rodX, y, BLOCK, BLOCK * 10) : "");
  });
  /* ones: after the tens, in columns of 5 that fill from the bottom up */
  const onesX = x + tens * (BLOCK + 6) + (tens ? 6 : 0);
  range(ones).forEach((i) => {
    const gone = i >= ones - outO,
      oneX = onesX + Math.floor(i / 5) * (BLOCK + 4),
      oneY = y + BLOCK * 10 - BLOCK - (i % 5) * (BLOCK + 4);
    markup +=
      one(oneX, oneY, (i >= ones - traded ? "tr" : cls) + (gone ? " gone" : "")) +
      (gone ? xOut(oneX, oneY, BLOCK, BLOCK) : "");
  });
  return [markup, onesX + Math.ceil(ones / 5) * (BLOCK + 4) - x];
}

/* a + b in base-ten blocks: side by side, or (joined) tens with tens and ones with ones, where 10 ones make a new ten (outlined).
   Returns the svg. */
function addBlocks(a, b, joined) {
  const tensA = Math.floor(a / 10),
    onesA = a % 10,
    tensB = Math.floor(b / 10),
    onesB = b % 10,
    top = 10;
  let markup, width;
  if (!joined) {
    /* a's blocks, a + in a 34-pixel gap, then b's blocks */
    const [aMarkup, aWidth] = blocks(6, top, tensA, onesA, "a"),
      [bMarkup, bWidth] = blocks(6 + aWidth + 34, top, tensB, onesB, "b");
    markup = aMarkup + `<text class="lbl big" x="${6 + aWidth + 17}" y="${top + BLOCK * 5}">+</text>` + bMarkup;
    width = 6 + aWidth + 34 + bWidth + 6;
  } else {
    /* all the tens first (a's, then b's), then all the ones */
    const onesSum = onesA + onesB,
      [aTens, aTensWidth] = blocks(6, top, tensA, 0, "a"),
      [bTens, bTensWidth] = blocks(6 + aTensWidth, top, tensB, 0, "b");
    let x = 6 + aTensWidth + bTensWidth;
    markup = aTens + bTens;
    /* 10 ones or more make a new ten; the ones left over are drawn in b's color */
    const makesTen = onesSum >= 10;
    if (makesTen) {
      markup += rod(x, top, "new");
      x += BLOCK + 6;
    }
    const aOnesLeft = makesTen ? 0 : onesA,
      bOnesLeft = makesTen ? onesSum - 10 : onesB;
    const [aOnes, aOnesWidth] = blocks(x + 10, top, 0, aOnesLeft, "a"),
      [bOnes, bOnesWidth] = blocks(x + 10 + aOnesWidth + (aOnesLeft ? 4 : 0), top, 0, bOnesLeft, "b");
    markup += aOnes + bOnes;
    width = x + 10 + aOnesWidth + bOnesWidth + 10;
  }
  return svgWrap(
    Math.max(width, 160),
    BLOCK * 10 + 24,
    markup,
    joined ? "Tens together and ones together" : `${a} and ${b} in base-ten blocks`,
  );
}
/* Widget: pick a + b from pairs, then put tens with tens and ones with ones. */
const tensOnesAdd = (pairs) => (el) => {
  const q = Q(el);
  let chosen = 0,
    joined = false;
  el.innerHTML =
    seg(
      "Numbers",
      pairs.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = pairs[chosen],
      tensA = Math.floor(a / 10),
      tensB = Math.floor(b / 10),
      tensSum = tensA + tensB,
      onesSum = (a % 10) + (b % 10);
    press(el, chosen);
    q("f").innerHTML = addBlocks(a, b, joined);
    q("go").textContent = joined ? "Split them again" : "Put tens with tens and ones with ones";
    q("r").innerHTML = joined
      ? `Tens: <b>${tensA * 10} + ${tensB * 10} = ${tensSum * 10}</b>. Ones: <b>${a % 10} + ${b % 10} = ${onesSum}</b>.` +
        (onesSum >= 10
          ? `<br><span class="dimline">${onesSum} ones is 1 ten and ${onesSum - 10} ones, so make a new ten.</span>`
          : "") +
        `<br><span class="ok"><b>${a} + ${b} = ${a + b}</b></span>`
      : `<b>${a} + ${b}</b><br><span class="dimline">Tall rods are tens. Small squares are ones.</span>`;
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-m]");
    if (b) {
      chosen = +b.dataset.m;
      joined = false;
      draw();
    }
  });
  q("go").onclick = () => {
    joined = !joined;
    draw();
  };
  draw();
};
/* Base-ten diagrams small enough for hundreds: a hundred is a 10 × 10 square, a ten a stick of 10, a one a small square
   (BT pixels each; FW is the width of a hundred). */
const BT = 7,
  FW = 10 * BT;
/* the lines between the cubes of a block cols cubes wide and rows cubes tall */
const btGrid = (x, y, cols, rows) =>
  range(cols - 1)
    .map((i) => `<line x1="${x + (i + 1) * BT}" y1="${y}" x2="${x + (i + 1) * BT}" y2="${y + rows * BT}"/>`)
    .join("") +
  range(rows - 1)
    .map((i) => `<line x1="${x}" y1="${y + (i + 1) * BT}" x2="${x + cols * BT}" y2="${y + (i + 1) * BT}"/>`)
    .join("");
const flat = (x, y, cls = "") =>
  `<g class="flat ${cls}"><rect x="${x}" y="${y}" width="${FW}" height="${FW}"/>${btGrid(x, y, 10, 10)}</g>`;
const stick = (x, y, cls = "") =>
  `<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${BT}" height="${FW}"/>${btGrid(x, y, 1, 10)}</g>`;
const cube1 = (x, y, cls = "") => `<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${BT}" height="${BT}"/>`;
/* h hundreds (rows of 5), t tens (a gap after every 5), and o ones (columns of 5) from x, y.
   cls: {h, t, o} classes for each place; tr: the last tr tens came from a broken hundred. Returns [markup, width, height]. */
function hto(x, y, h, t, o, { cls = {}, tr = 0 } = {}) {
  /* cursorX is where the next place starts */
  let markup = "",
    cursorX = x;
  range(h).forEach((i) => {
    markup += flat(x + (i % 5) * (FW + 8), y + Math.floor(i / 5) * (FW + 8), cls.h || "");
  });
  if (h) cursorX += Math.min(h, 5) * (FW + 8) + 6;
  range(t).forEach((i) => {
    markup += stick(cursorX + i * (BT + 4) + Math.floor(i / 5) * 5, y, (i >= t - tr ? "tr" : "") + " " + (cls.t || ""));
  });
  if (t) cursorX += t * (BT + 4) + Math.floor((t - 1) / 5) * 5 + 10;
  /* ones fill each column of 5 from the bottom up */
  range(o).forEach((i) => {
    markup += cube1(cursorX + Math.floor(i / 5) * (BT + 5), y + FW - BT - (i % 5) * (BT + 5), cls.o || "");
  });
  if (o) cursorX += Math.ceil(o / 5) * (BT + 5);
  return [markup, cursorX - x, Math.max(FW, Math.ceil(h / 5) * (FW + 8) - 8)];
}
const htoFig = (h, t, o, opt = {}, label) => {
  const [markup, width, height] = hto(8, 8, h, t, o, opt);
  return svgWrap(Math.max(width + 16, 120), height + 16, markup, label || `${h} hundreds, ${t} tens, and ${o} ones`);
};
/* [hundreds, tens, ones] digits of n */
const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
/* n in blocks: hundreds gold, tens blue, ones green */
const numBlocks = (n, label) => {
  const [h, t, o] = digits(n);
  return htoFig(h, t, o, { cls: { t: "b", o: "c" } }, label || `${n} in base-ten blocks`);
};
/* the name of a whole number up to 999,999: numWords(406) is "four hundred six", numWords(35020) "thirty-five thousand twenty" */
const numWords = (() => {
  const ONES = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ],
    TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  /* the name of a number below 1000 */
  const under1000 = (n) => {
    const hundreds = Math.floor(n / 100),
      rest = n % 100,
      restWords = rest < 20 ? ONES[rest] : TENS[Math.floor(rest / 10)] + (rest % 10 ? "-" + ONES[rest % 10] : "");
    return hundreds ? `${ONES[hundreds]} hundred${rest ? " " + restWords : ""}` : restWords;
  };
  return (n) =>
    n < 1000 ? under1000(n) : `${under1000(Math.floor(n / 1000))} thousand${n % 1000 ? " " + under1000(n % 1000) : ""}`;
})();
/* A place-value chart: rows [[label, n]]; hi: the column to outline in every row (0 is the first: hundreds by default).
   places: the columns, as powers of 10 (5 hundred-thousands … 0 ones, -1 tenths, -2 hundredths); default hundreds, tens, ones.
   Charts past hundreds group the columns into thousands and ones, headed H, T, O, and leave zeros before a number blank.
   tap: each digit is a button (data-row = its row, data-e = its place). */
const PLACE = {
  5: "Hundred-thousands",
  4: "Ten-thousands",
  3: "Thousands",
  2: "Hundreds",
  1: "Tens",
  0: "Ones",
  "-1": "Tenths",
  "-2": "Hundredths",
};
/* the digit of n in the 10^e place (e = -1 for tenths); n is rounded to hundredths first so 0.3 isn't read as 0.29999… */
const digitAt = (n, e) => Math.floor(Math.round(n * 100) / 10 ** (e + 2)) % 10;
function pvChart(rows, hi = -1, { places = [2, 1, 0], tap = false } = {}) {
  const big = places[0] > 2,
    thousandsCols = places.filter((e) => e > 2).length;
  /* column colors repeat every three places: p0 hundreds, p1 tens, p2 ones (and again for the thousands) */
  const colorOf = (e) => `p${(((2 - e) % 3) + 3) % 3}`,
    letterOf = (e) => "OTH"[((e % 3) + 3) % 3];
  /* a big chart has two header rows: Thousands | Ones, then H T O H T O; pb draws the line between the two groups */
  const head = big
    ? `<tr><th></th><th class="per" colspan="${thousandsCols}">Thousands</th><th class="per pb" colspan="${places.length - thousandsCols}">Ones</th></tr>` +
      `<tr><th></th>${places.map((e) => `<th class="${e === 2 ? "pb" : ""}" title="${PLACE[e]}">${letterOf(e)}</th>`).join("")}</tr>`
    : `<tr><th></th>${places.map((e) => `<th>${PLACE[e]}</th>`).join("")}</tr>`;
  const cell = (n, r, e, i) => {
    /* in a big chart, the zeros in front of a number are left blank */
    const digit = big && e > 0 && n < 10 ** e ? "" : digitAt(n, e);
    /* dp: the decimal point after the ones, when there are tenths */
    const cls = `${colorOf(e)}${i === hi ? " hi" : ""}${big && e === 2 ? " pb" : ""}${e === 0 && places.includes(-1) ? " dp" : ""}`;
    const content =
      tap && digit !== ""
        ? `<button type="button" class="pvb" data-row="${r}" data-e="${e}" aria-label="${digit}, ${PLACE[e].toLowerCase()} place">${digit}</button>`
        : digit;
    return `<td class="${cls}">${content}</td>`;
  };
  const body = rows
    .map(([label, n], r) => `<tr><th>${label}</th>${places.map((e, i) => cell(n, r, e, i)).join("")}</tr>`)
    .join("");
  return `<table class="pv${big ? " big" : ""}">${head}${body}</table>`;
}
/* 305020 → "305,020" */
const commas = (n) => n.toLocaleString("en-US");
/* ---------- the standard algorithm ---------- */
/* a + b or a − b (a ≥ b), one column at a time from the ones (column 0). Each step: {i, top, bot, cin, val, digit, carry, from, marks}:
   top and bot are the column's digits (top after any regrouping), cin the 1 carried in, val what the column makes (top + bot + cin,
   or top − bot), digit what's written under it (the last column of a sum writes all of val), carry 1 when a sum makes a new ten.
   For −: from is the column a ten was taken from when top was too small (null if none), and marks are the digits rewritten above
   the top number, [{i, v}], zeros in between becoming 9; blank: a zero in front of the difference, not written. */
function algSteps(a, b, op) {
  /* digits from the ones up: topDigits[0] is a's ones digit. top is rewritten as tens are taken (−) */
  const topDigits = [...String(a)].reverse().map(Number),
    botDigits = [...String(b)].reverse().map(Number),
    columns = Math.max(topDigits.length, botDigits.length),
    top = topDigits.slice(),
    steps = [];
  let carry = 0;
  for (let i = 0; i < columns; i++) {
    const bot = botDigits[i] || 0;
    if (op === "+") {
      const t = top[i] || 0,
        val = t + bot + carry,
        last = i === columns - 1;
      steps.push({
        i,
        top: t,
        bot,
        cin: carry,
        val,
        digit: last ? val : val % 10,
        carry: !last && val >= 10 ? 1 : 0,
        from: null,
        marks: [],
      });
      carry = val >= 10 ? 1 : 0;
      continue;
    }
    /* −: when the top digit is too small, take a ten from the nearest nonzero digit to the left; zeros passed over become 9 */
    let from = null;
    const marks = [];
    if (top[i] < bot) {
      let j = i + 1;
      while (top[j] === 0) j++;
      from = j;
      top[j]--;
      marks.push({ i: j, v: top[j] });
      for (let k = j - 1; k > i; k--) {
        top[k] = 9;
        marks.push({ i: k, v: 9 });
      }
      top[i] += 10;
      marks.push({ i, v: top[i] });
    }
    steps.push({ i, top: top[i], bot, cin: 0, val: top[i] - bot, digit: top[i] - bot, carry: 0, from, marks });
  }
  /* zeros in front of a difference aren't written */
  if (op === "−")
    steps.forEach((step) => {
      if (step.i >= String(a - b).length) step.blank = true;
    });
  return steps;
}
/* The algorithm drawn in columns, with the first `done` columns worked: carried 1s (+) or rewritten digits (−) above, and the
   answer's digits below. The next column to work is outlined. A comma sits between the thousands and the hundreds. */
function algFig(a, b, op, done = 0, label) {
  const steps = algSteps(a, b, op),
    digitsWide = Math.max(String(a).length, String(b).length),
    /* one more column when the sum is longer than either number */
    cols = digitsWide + (op === "+" && String(a + b).length > digitsWide ? 1 : 0),
    colW = 30,
    commaGap = 12,
    left = 40,
    rowY = { mk: 22, a: 56, b: 96, r: 150 },
    /* the center of column i (0 is the ones); with a comma, the hundreds and below shift right to make room for it */
    colX = (i) => left + (cols - 1 - i) * colW + (cols > 3 && i < 3 ? commaGap : 0) + colW / 2,
    topChars = [...String(a)].reverse(),
    botChars = [...String(b)].reverse();
  let markup = "";
  if (done < steps.length) {
    const i = steps[done].i;
    markup += `<rect class="acur" x="${colX(i) - colW / 2 + 1}" y="4" width="${colW - 2}" height="${rowY.r + 18}" rx="6"/>`;
  }
  /* a row of digits (ones first), with a comma after the thousands when there are more than 3 */
  const row = (ds, y, cls = "") =>
    ds.map((d, i) => `<text class="adg${cls}" x="${colX(i)}" y="${y}">${d}</text>`).join("") +
    (ds.length > 3 ? `<text class="adg${cls}" x="${colX(3) + colW / 2 + commaGap / 2}" y="${y + 6}">,</text>` : "");
  /* what's written above each column so far: a carried 1, or the latest rewritten digit (the original is crossed out) */
  const above = {};
  steps.slice(0, done).forEach((step) => {
    step.marks.forEach((m) => {
      above[m.i] = m.v;
    });
    if (step.carry) above[step.i + 1] = 1;
  });
  markup +=
    row(topChars, rowY.a) +
    row(botChars, rowY.b) +
    `<text class="adg" x="${left - 18}" y="${rowY.b}">${op}</text><line class="aline" x1="${left - 30}" y1="${rowY.b + 22}" x2="${colX(0) + colW / 2 + 4}" y2="${rowY.b + 22}"/>`;
  Object.entries(above).forEach(([i, v]) => {
    i = +i;
    markup +=
      op === "+"
        ? `<text class="amk" x="${colX(i)}" y="${rowY.mk}">1</text>`
        : `<line class="axd" x1="${colX(i) - 10}" y1="${rowY.a + 10}" x2="${colX(i) + 10}" y2="${rowY.a - 12}"/><text class="amk" x="${colX(i)}" y="${rowY.mk}">${v}</text>`;
  });
  /* the answer's digits so far, by column (the last column of a sum may write two) */
  const answerDigits = [];
  steps.slice(0, done).forEach((step) => {
    if (step.blank) return;
    [...String(step.digit)].reverse().forEach((d, k) => {
      answerDigits[step.i + k] = d;
    });
  });
  markup +=
    answerDigits
      .map((d, i) => (d == null ? "" : `<text class="adg ares" x="${colX(i)}" y="${rowY.r}">${d}</text>`))
      .join("") +
    (answerDigits.length > 3 && answerDigits[3] != null
      ? `<text class="adg ares" x="${colX(3) + colW / 2 + commaGap / 2}" y="${rowY.r + 6}">,</text>`
      : "");
  return svgWrap(
    left + cols * colW + (cols > 3 ? commaGap : 0) + 12,
    rowY.r + 26,
    markup,
    label ||
      `${commas(a)} ${op === "+" ? "plus" : "minus"} ${commas(b)} in columns` +
        (done ? `, ${done} column${done > 1 ? "s" : ""} worked` : ""),
  );
}
/* ---------- multiplying and dividing ---------- */
/* a × b (b one digit), one column at a time from the ones (column 0). Each step: {i, top, cin, val, digit, carry}: top is a's
   digit, cin what was carried in, val = top × b + cin, digit what's written under the column (the last column writes all
   of val), and carry what's carried to the next column (written above it). */
function mulSteps(a, b) {
  const topDigits = [...String(a)].reverse().map(Number),
    steps = [];
  let carry = 0;
  topDigits.forEach((top, i) => {
    const val = top * b + carry,
      last = i === topDigits.length - 1;
    steps.push({ i, top, cin: carry, val, digit: last ? val : val % 10, carry: last ? 0 : Math.floor(val / 10) });
    carry = last ? 0 : Math.floor(val / 10);
  });
  return steps;
}
/* a × b in columns, the first `done` columns worked (their digits written and carries above the next column), and the next
   column outlined. Same look as algFig. */
function mulFig(a, b, done = 0, label) {
  const steps = mulSteps(a, b),
    cols = String(a * b).length,
    colW = 30,
    commaGap = 12,
    left = 40,
    rowY = { mk: 22, a: 56, b: 96, r: 150 },
    /* the center of column i (0 is the ones); with a comma, the hundreds and below shift right to make room for it */
    colX = (i) => left + (cols - 1 - i) * colW + (cols > 3 && i < 3 ? commaGap : 0) + colW / 2;
  /* a row of digits (ones first), with a comma after the thousands when there are more than 3 */
  const row = (ds, y, cls = "") =>
    ds.map((d, i) => (d == null ? "" : `<text class="adg${cls}" x="${colX(i)}" y="${y}">${d}</text>`)).join("") +
    (ds.length > 3 && ds[3] != null
      ? `<text class="adg${cls}" x="${colX(3) + colW / 2 + commaGap / 2}" y="${y + 6}">,</text>`
      : "");
  let markup = "";
  if (done < steps.length)
    markup += `<rect class="acur" x="${colX(steps[done].i) - colW / 2 + 1}" y="4" width="${colW - 2}" height="${rowY.r + 18}" rx="6"/>`;
  markup +=
    row([...String(a)].reverse(), rowY.a) +
    `<text class="adg" x="${colX(0)}" y="${rowY.b}">${b}</text>` +
    `<text class="adg" x="${left - 18}" y="${rowY.b}">×</text><line class="aline" x1="${left - 30}" y1="${rowY.b + 22}" x2="${colX(0) + colW / 2 + 4}" y2="${rowY.b + 22}"/>`;
  /* the carries so far, above the column they go to, and the product's digits so far (the last column may write two) */
  const answerDigits = [];
  steps.slice(0, done).forEach((step) => {
    if (step.carry) markup += `<text class="amk" x="${colX(step.i + 1)}" y="${rowY.mk}">${step.carry}</text>`;
    [...String(step.digit)].reverse().forEach((d, k) => {
      answerDigits[step.i + k] = d;
    });
  });
  markup += row(answerDigits, rowY.r, " ares");
  return svgWrap(
    left + cols * colW + (cols > 3 ? commaGap : 0) + 12,
    rowY.r + 26,
    markup,
    label || `${commas(a)} times ${b} in columns` + (done ? `, ${done} column${done > 1 ? "s" : ""} worked` : ""),
  );
}
/* n (up to 999) in base-ten blocks shared into `groups` equal groups, each in a dashed box, with any ones left over in a box of
   their own. split: false draws n in one pile, before sharing. Hundreds gold, tens blue, ones green, as in numBlocks. */
function divideFig(n, groups, { split = true, label } = {}) {
  if (!split) return numBlocks(n, label || `${n} in base-ten blocks, before sharing`);
  const each = Math.floor(n / groups),
    left = n % groups,
    [h, t, o] = digits(each),
    cls = { t: "b", o: "c" },
    [groupMarkup, blockW, blockH] = hto(0, 0, h, t, o, { cls }),
    pad = 10,
    cellW = Math.max(blockW, 30) + 2 * pad,
    cellH = blockH + 2 * pad,
    gap = 12,
    perRow = Math.min(groups + (left ? 1 : 0), 3),
    cellX = (k) => 4 + (k % perRow) * (cellW + gap),
    cellY = (k) => 4 + Math.floor(k / perRow) * (cellH + gap);
  let markup = "";
  range(groups).forEach((k) => {
    markup +=
      `<rect class="dgrp" x="${cellX(k)}" y="${cellY(k)}" width="${cellW}" height="${cellH}" rx="10"/>` +
      `<g transform="translate(${cellX(k) + pad},${cellY(k) + pad})">${groupMarkup}</g>`;
  });
  if (left) {
    const [leftMarkup] = hto(0, 0, 0, 0, left, { cls }),
      k = groups;
    markup +=
      `<rect class="dgrp left" x="${cellX(k)}" y="${cellY(k)}" width="${cellW}" height="${cellH}" rx="10"/>` +
      `<g transform="translate(${cellX(k) + pad},${cellY(k) + pad})">${leftMarkup}</g>`;
  }
  const cells = groups + (left ? 1 : 0);
  return svgWrap(
    8 + perRow * (cellW + gap) - gap,
    8 + Math.ceil(cells / perRow) * (cellH + gap) - gap,
    markup,
    label || `${n} shared into ${groups} equal groups of ${each}` + (left ? `, with ${left} left over` : ""),
  );
}
/* n ÷ divisor by partial quotients: the divisor and n under the division bar, then for each of the first `shown` chunks, chunk ×
   divisor taken away (the chunk written at the right) and what's left. Once every chunk is shown, the chunks' sum is the
   quotient, with any remainder. chunks: the partial quotients, like [100, 40, 2]. */
function quotientFig(n, divisor, chunks, shown = Infinity, label) {
  const numX = 170,
    lineH = 32,
    rowY = (k) => 34 + k * lineH,
    done = shown >= chunks.length,
    total = chunks.reduce((x, y) => x + y, 0),
    rest = n - total * divisor;
  /* the quotient written out at the end, and how wide it is (a label's character is about 11 pixels) */
  const sumText = `${chunks.map(commas).join(" + ")} = ${commas(total)}${rest ? ` R ${rest}` : ""}`,
    rightW = Math.max(130, 11 * (done ? sumText.length : 0));
  let markup =
    `<text class="lbl en" x="${numX - 70}" y="${rowY(0)}">${divisor}</text>` +
    `<path class="pbar" d="M${numX - 64},${rowY(0) + 14}Q${numX - 54},${rowY(0)} ${numX - 64},${rowY(0) - 14}H${numX + 6}"/>` +
    `<text class="lbl en" x="${numX}" y="${rowY(0)}">${commas(n)}</text>`;
  let left = n,
    line = 1;
  chunks.slice(0, shown).forEach((chunk) => {
    left -= chunk * divisor;
    markup +=
      `<text class="lbl en" x="${numX}" y="${rowY(line)}">− ${commas(chunk * divisor)}</text>` +
      `<text class="lbl st cy" x="${numX + 24}" y="${rowY(line)}">${commas(chunk)} × ${divisor}</text>` +
      `<line class="aline" x1="${numX - 70}" y1="${rowY(line) + 15}" x2="${numX + 4}" y2="${rowY(line) + 15}"/>` +
      `<text class="lbl en" x="${numX}" y="${rowY(line + 1)}">${commas(left)}</text>`;
    line += 2;
  });
  if (done) markup += `<text class="lbl st gd" x="${numX + 24}" y="${rowY(line - 1)}">${sumText}</text>`;
  return svgWrap(
    numX + 24 + rightW,
    rowY(line - 1) + 22,
    markup,
    label ||
      `${commas(n)} divided by ${divisor} with partial quotients` +
        (done ? `: ${chunks.map(commas).join(" + ")} = ${commas(total)}${rest ? `, remainder ${rest}` : ""}` : ""),
  );
}
