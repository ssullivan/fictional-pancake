/* Pictures that Grade 2 Unit 7's game and its Learn pages both use: a place-value mat of base-ten blocks, and the stages of
   adding on it. Needs util.js, figures.js (svgWrap), pictures.js (cellsOf, xOut), and blocks.js (flat, stick, cube1, FW, BT,
   digits), and pictures.css and blocks.css for the styles.

   PL, cnt(n, i), partsOf(n)         place names, "3 tens", and "1 hundred, 3 tens, and 2 ones"
   mat(rows, label, fit)             a place-value mat: a row of blocks for each number, in lined-up columns (svg)
   bl(n, cls, lab), apart(a, b)      n as one row of the mat, and a + b on the mat one row each
   addStages(a, b), stageFig(a, b, stages, stage)   a + b on the mat one stage at a time: apart, together, then each new ten
                                     or hundred (svg) */
const PL = ["hundreds", "tens", "ones"];
/* "1 ten", "3 tens": n of place i (0 hundreds, 1 tens, 2 ones) */
const cnt = (n, i) => `${n} ${n === 1 ? PL[i].slice(0, -1) : PL[i]}`;
/* A place-value mat: a row of blocks for each number, with hundreds, tens, and ones in lined-up columns.
   rows: [{lab, h, t, o}]; h, t, o give a class for each block (build them with cellsOf): 'a' gold, 'b' blue,
   'new' a new ten or hundred, 'tr' from a broken ten or hundred, plus ' gone' to cross it out.
   fit: {h, t, o} how many blocks each column needs room for, so the columns stay put as blocks come and go. */
function mat(rows, label, fit = {}) {
  /* most(k): the most blocks column k needs room for; labelW: room for the row labels */
  const most = (k) => Math.max(fit[k] || 0, ...rows.map((row) => row[k].length)),
    hundreds = most("h"),
    tens = most("t"),
    ones = most("o"),
    labelW = rows.some((row) => row.lab) ? 64 : 0;
  /* each column's width: hundreds 5 to a row, tens side by side in fives, ones in stacks of 5 */
  const colW = [
    Math.max(Math.min(hundreds, 5) * (FW + 8) - 8, 76),
    Math.max(tens * (BT + 4) + Math.floor((tens - 1) / 5) * 5 - 4, 50),
    Math.max(Math.ceil(ones / 5) * (BT + 5) - 5, 50),
  ];
  const colX = [10 + labelW, 34 + labelW + colW[0], 58 + labelW + colW[0] + colW[1]],
    gone = (cls) => cls.includes("gone");
  let y = 34,
    markup = "";
  rows.forEach((row) => {
    row.h.forEach((cls, i) => {
      const x = colX[0] + (i % 5) * (FW + 8),
        blockY = y + Math.floor(i / 5) * (FW + 8);
      markup += flat(x, blockY, cls) + (gone(cls) ? xOut(x, blockY, FW, FW) : "");
    });
    row.t.forEach((cls, i) => {
      const x = colX[1] + i * (BT + 4) + Math.floor(i / 5) * 5;
      markup += stick(x, y, cls) + (gone(cls) ? xOut(x, y, BT, FW) : "");
    });
    /* ones fill each column of 5 from the bottom up */
    row.o.forEach((cls, i) => {
      const x = colX[2] + Math.floor(i / 5) * (BT + 5),
        blockY = y + FW - BT - (i % 5) * (BT + 5);
      markup += cube1(x, blockY, cls) + (gone(cls) ? xOut(x, blockY, BT, BT) : "");
    });
    if (row.lab) markup += `<text class="lbl en" x="${labelW}" y="${y + FW / 2}">${row.lab}</text>`;
    y += Math.max(FW, Math.ceil(row.h.length / 5) * (FW + 8) - 8) + 20;
  });
  /* the column names, and lines between the columns */
  const head =
    PL.map((name, i) => `<text class="lbl s dm" x="${colX[i] + colW[i] / 2}" y="14">${name}</text>`).join("") +
    [1, 2].map((i) => `<path class="guide" d="M${colX[i] - 12},4V${y - 10}"/>`).join("");
  return svgWrap(colX[2] + colW[2] + 10, y - 6, head + markup, label);
}
/* n as one row of the mat, every block in class cls */
const bl = (n, cls = "a", lab) => {
  const [hundreds, tens, ones] = digits(n);
  return { lab, h: cellsOf([hundreds, cls]), t: cellsOf([tens, cls]), o: cellsOf([ones, cls]) };
};
/* a + b on the mat, one row each */
const apart = (a, b) => mat([bl(a, "a", a), bl(b, "b", `+ ${b}`)], `${a} and ${b} in base-ten blocks`);
/* "1 hundred, 3 tens, and 2 ones", leaving out places with 0 */
function partsOf(n) {
  const parts = digits(n)
    .map((d, i) => (d ? cnt(d, i) : ""))
    .filter(Boolean);
  return parts.length > 1
    ? parts.slice(0, -1).join(", ") + (parts.length > 2 ? "," : "") + " and " + parts[parts.length - 1]
    : parts[0];
}
/* The blocks for a + b, one stage at a time: apart, together, then a new ten and a new hundred when the ones or tens make 10.
   Each stage is {rows} (apart) or {h, t, o, made}: the blocks together, and 'ten' or 'hundred' when that stage made one. */
function addStages(a, b) {
  const [hundredsA, tensA, onesA] = digits(a),
    [hundredsB, tensB, onesB] = digits(b),
    stages = [{ rows: [bl(a, "a", a), bl(b, "b", `+ ${b}`)] }];
  let h = cellsOf([hundredsA, "a"], [hundredsB, "b"]),
    t = cellsOf([tensA, "a"], [tensB, "b"]),
    o = cellsOf([onesA, "a"], [onesB, "b"]);
  stages.push({ h, t, o });
  if (o.length >= 10) {
    o = o.slice(10);
    t = [...t, "new"];
    stages.push({ h, t, o, made: "ten" });
  }
  if (t.length >= 10) {
    t = t.slice(10);
    h = [...h, "new"];
    stages.push({ h, t, o, made: "hundred" });
  }
  return stages;
}
/* the mat for one stage of addStages (all its stages), with room in each column for every stage */
function stageFig(a, b, stages, stage) {
  const fit = {};
  ["h", "t", "o"].forEach((k) => {
    fit[k] = Math.max(...stages.slice(1).map((s) => s[k].length));
  });
  return stage.rows
    ? mat(stage.rows, `${a} and ${b} in base-ten blocks`, fit)
    : mat([stage], `${cnt(stage.h.length, 0)}, ${cnt(stage.t.length, 1)}, and ${cnt(stage.o.length, 2)}`, fit);
}
