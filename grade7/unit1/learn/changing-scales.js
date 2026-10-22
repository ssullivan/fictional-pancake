/* Learn Scale Drawings (Grade 7 Unit 1), chapter 6: Creating and changing scales. Its widgets and steps; loaded by
   changing-scales.html. */
/* a basketball court, 28 m by 15 m, to draw on a sheet of paper 20 cm by 12 cm */
const COURT = [28, 15],
  PAPER = [20, 12];
/* scales to try: how many m 1 cm stands for */
const COURT_SCALES = [1, 2, 4, 5];
/* Pick a scale for the court: the bigger the number of meters per centimeter, the smaller the drawing. Does it fit the paper? */
function wChoose(el) {
  const q = Q(el),
    cmPx = 16;
  el.innerHTML =
    seg(
      "Scale",
      COURT_SCALES.map((each, i) => [i, `1 cm to ${each} m`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const each = COURT_SCALES[index],
      [long, wide] = COURT.map((m) => m / each),
      fits = long <= PAPER[0] && wide <= PAPER[1],
      width = Math.max(PAPER[0], long) * cmPx + 24,
      height = Math.max(PAPER[1], wide) * cmPx + 24;
    press(el, index);
    /* the paper, then the court drawn from its top left corner */
    const markup =
      `<rect class="mapbg" x="10" y="10" width="${PAPER[0] * cmPx}" height="${PAPER[1] * cmPx}"/>` +
      `<rect class="shp ${fits ? "b" : "c"}" x="10" y="10" width="${long * cmPx}" height="${wide * cmPx}"/>` +
      `<text class="lbl dm en" x="${PAPER[0] * cmPx + 4}" y="${PAPER[1] * cmPx}">paper</text>` +
      `<text class="lbl" x="${10 + (long * cmPx) / 2}" y="${10 + (wide * cmPx) / 2}">${fmt(long)} by ${fmt(wide)} cm</text>`;
    q("f").innerHTML = svgWrap(
      width,
      height,
      markup,
      `A 28 m by 15 m court drawn at 1 cm to ${each} m on 20 cm by 12 cm paper`,
    );
    q("r").innerHTML =
      `At <b>1 cm to ${each} m</b>: 28 ÷ ${each} = ${fmt(long)} cm and 15 ÷ ${each} = ${fmt(wide)} cm. ` +
      (fits
        ? `<span class="ok">It fits on the 20 cm by 12 cm paper.</span>`
        : `<span class="no">Too big for the 20 cm by 12 cm paper.</span> Try a scale where each centimeter stands for more meters.`);
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick a new scale for a drawing made at 1 cm to 2 m: find the real length, then draw it again. */
function wRedraw(el) {
  const q = Q(el),
    from = 2,
    drawn = 12,
    real = drawn * from,
    scales = [1, 3, 4, 6],
    cmPx = 12;
  el.innerHTML =
    seg(
      "New scale",
      scales.map((each, i) => [i, `1 cm to ${each} m`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const to = scales[index],
      after = real / to,
      width = Math.max(drawn, after) * cmPx + 120;
    press(el, index);
    const bar = (y, len, cls, text) =>
      `<rect class="shp ${cls}" x="10" y="${y}" width="${len * cmPx}" height="22"/><text class="lbl st" x="${len * cmPx + 18}" y="${y + 11}">${text}</text>`;
    q("f").innerHTML = svgWrap(
      width,
      80,
      bar(8, drawn, "a", `${drawn} cm`) + bar(46, after, "b", `${fmt(after)} cm`),
      `A ${drawn} cm drawing at 1 cm to ${from} m, redrawn at 1 cm to ${to} m`,
    );
    q("r").innerHTML =
      `The old drawing: ${drawn} cm at 1 cm to ${from} m is ${drawn} × ${from} = <b>${real} m</b> really. ` +
      `The new one: ${real} ÷ ${to} = <b>${fmt(after)} cm</b>. ${to > from ? "More meters for each centimeter make a smaller drawing." : "Fewer meters for each centimeter make a bigger drawing."}`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Choosing a scale",
    widget: wChoose,
    body: "<p>When you make a scale drawing, you choose the scale. The more each centimeter stands for, the <b>smaller</b> the drawing. Pick a scale that makes the drawing as big as it can be while it still fits on the paper.</p><p>Try each scale.</p>",
    check: {
      kind: "mc",
      q: "Which scale makes the largest drawing of a soccer field?",
      choices: [
        { id: "a", label: "1 cm to 2 m" },
        { id: "b", label: "1 cm to 5 m" },
        { id: "c", label: "1 cm to 10 m" },
      ],
      answer: "a",
      why: {
        b: "Each centimeter stands for more meters than at 1 cm to 2 m, so the field needs fewer centimeters.",
        c: "That makes the smallest drawing: each centimeter stands for the most meters.",
      },
      explain: "At 1 cm to 2 m, each centimeter stands for the fewest meters, so the field needs the most centimeters.",
    },
  },
  {
    title: "Redrawing at a new scale",
    widget: wRedraw,
    body: "<p>To redraw a scale drawing at a new scale, find the real length from the old scale, then use the new scale to draw it again.</p><p>Pick a new scale.</p>",
    check: {
      kind: "num",
      q: "A drawing of a bridge uses the scale 1 cm to 3 m, and the bridge is 8 cm long on it. How long is the bridge on a new drawing with the scale 1 cm to 6 m?",
      answer: 4,
      unit: "cm",
      misc: [
        [16, "That’s the wrong way. Each centimeter stands for more meters now, so the drawing is shorter."],
        [24, "That’s the real bridge in meters. Divide by 6 for the new drawing."],
        [8, "The drawing changes with the scale. Find the real length, then divide by 6."],
      ],
      explain: "The bridge is really 8 × 3 = 24 m long, and 24 ÷ 6 = 4 cm on the new drawing.",
    },
  },
];
