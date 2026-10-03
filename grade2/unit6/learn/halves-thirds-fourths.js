/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 2: Halves, thirds, and fourths. Its widgets and steps; loaded by halves-thirds-fourths.html. */
/* pattern blocks, and how many of each fill a hexagon */
const FILL = [
  ["triangle", 6],
  ["rhombus", 3],
  ["trapezoid", 2],
];
/* Fill a hexagon with pattern blocks (a stepper adds them). */
function wBlocks(el) {
  const q = Q(el),
    values = { n: 1 };
  let blockIndex = 0;
  el.innerHTML =
    seg(
      "Blocks",
      FILL.map(([block], i) => [i, block[0].toUpperCase() + block.slice(1) + (block === "rhombus" ? "es" : "s")]),
    ) + `<div class="fig" data-f></div><div class="wrow">${stepper("n", "Blocks")}</div><p class="readout" data-r></p>`;
  /* the stepper goes up to what fills the hexagon */
  const limits = { n: [1, 6] };
  const draw = () => {
    const [block, fill] = FILL[blockIndex],
      count = values.n,
      plural = block === "rhombus" ? "rhombuses" : block + "s";
    press(el, blockIndex);
    q("n").textContent = count;
    q("f").innerHTML = pbFig("hexagon", block, { show: count, s: 90 });
    q("r").innerHTML =
      count === fill
        ? `<span class="ok"><b>${fill} ${plural}</b> make a hexagon!</span><br><span class="dimline">Try another kind of block.</span>`
        : `<b>${count} ${count > 1 ? plural : block}</b>. Tap + to fill the hexagon.`;
  };
  steppers(el, values, limits, draw);
  el.addEventListener("click", (e) => {
    const blockBtn = e.target.closest("[data-m]");
    if (blockBtn) {
      blockIndex = +blockBtn.dataset.m;
      values.n = 1;
      limits.n[1] = FILL[blockIndex][1];
      draw();
    }
  });
  draw();
}
/* Cut a circle or rectangle into halves, thirds, or fourths, and tap parts to color them in. */
function wShare(el) {
  /* parts: how many equal parts; colored: the parts tapped */
  const q = Q(el);
  let shape = "circle",
    parts = 2,
    colored = [];
  el.innerHTML =
    seg("Shape", [
      ["circle", "Circle"],
      ["rect", "Rectangle"],
    ]) + `<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, shape);
    q("c").innerHTML = [2, 3, 4]
      .map(
        (n) =>
          `<button type="button" class="chip" data-e="${n}" aria-pressed="${n === parts}">${PART[n][1][0].toUpperCase() + PART[n][1].slice(1)}</button>`,
      )
      .join("");
    q("f").innerHTML = shareFig(shape, parts, "v", { shade: colored, tap: true, s: 170 });
    const count = colored.length,
      shapeName = shape === "rect" ? "rectangle" : "circle";
    q("r").innerHTML =
      `${parts} equal parts. Each part is <b>1 ${PART[parts][0]}</b> of the ${shapeName}.<br>` +
      (!count
        ? '<span class="dimline">Tap a part to color it in.</span>'
        : count === parts
          ? `<span class="ok"><b>${partName(parts, parts)}</b> make the whole ${shapeName}!</span>`
          : `<span class="ok"><b>${partName(parts, count)}</b> colored in.</span>`);
  };
  el.addEventListener("click", (e) => {
    const shapeBtn = e.target.closest("[data-m]");
    if (shapeBtn) {
      shape = shapeBtn.dataset.m;
      colored = [];
      draw();
      return;
    }
    const partsBtn = e.target.closest("[data-e]");
    if (partsBtn) {
      parts = +partsBtn.dataset.e;
      colored = [];
      draw();
      return;
    }
    const part = e.target.closest("[data-i]");
    if (part) {
      const i = +part.dataset.i;
      colored = colored.includes(i) ? colored.filter((j) => j !== i) : [...colored, i];
      draw();
    }
  });
  draw();
}
/* ways to cut a square into 4 pieces, and their button labels */
const CUTS = [
  ["grid", "Squares"],
  ["v", "Strips"],
  ["diag", "Triangles"],
  ["uneq", "Uneven"],
];
/* Fourths cut different ways are still fourths; uneven pieces aren't. */
function wSameSize(el) {
  const q = Q(el);
  let cut = "grid";
  el.innerHTML = seg("Cut", CUTS) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(el, cut);
    q("f").innerHTML = shareFig("square", 4, cut, { shade: [0, 2], s: 180 });
    q("r").innerHTML =
      cut === "uneq"
        ? '<span class="no">4 pieces, but they are not the same size.</span> These are <b>not</b> fourths.<br><span class="dimline">Fourths have to be equal.</span>'
        : `4 equal pieces: each one is <b>1 fourth</b> of the square.<br><span class="dimline">Try the other cuts. The pieces look different, but each is still 1 fourth of the same square.</span>`;
  };
  el.addEventListener("click", (e) => {
    const cutBtn = e.target.closest("[data-m]");
    if (cutBtn) {
      cut = cutBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* Cut a granola bar into equal pieces (a stepper), then eat them one at a time. */
function wWhole(el) {
  /* eaten: how many pieces are eaten (back to 0 when the pieces change) */
  const q = Q(el),
    values = { n: 2 };
  let eaten = 0;
  el.innerHTML = `<p class="story">Cut a granola bar into equal pieces. Then eat them one at a time!</p><div class="fig" data-f></div><div class="wrow">${stepper("n", "Pieces")}<button type="button" class="btn" data-go>Eat a piece</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const pieces = values.n;
    q("n").textContent = pieces;
    q("go").disabled = eaten >= pieces;
    q("f").innerHTML = shareFig("rect", pieces, "v", {
      shade: range(eaten),
      s: 120,
      label: `A granola bar cut into ${pieces} equal pieces, ${eaten} eaten`,
    });
    q("r").innerHTML =
      (eaten === pieces
        ? `<span class="ok">You ate the whole thing! <b>${partName(pieces, pieces)}</b> make 1 whole bar.</span>`
        : `Each piece is <b>1 ${PART[pieces][0]}</b>.${eaten ? ` You ate <b>${partName(pieces, eaten)}</b>.` : ""}`) +
      `<br><span class="dimline">More pieces means smaller pieces. 1 fourth is less than 1 third, and 1 third is less than 1 half.</span>`;
  };
  steppers(el, values, { n: [2, 4] }, () => {
    eaten = 0;
    draw();
  });
  q("go").onclick = () => {
    eaten++;
    draw();
  };
  draw();
}
const STEPS = [
  {
    title: "Build with blocks",
    widget: wBlocks,
    body: "<p>Small shapes can fill a bigger shape. Pattern blocks can make a <b>hexagon</b> in different ways.</p><p>Pick a block. Fill the hexagon.</p>",
    check: {
      kind: "num",
      unit: "triangles",
      answer: 3,
      fig: pbFig("trapezoid", "triangle", { show: 0, s: 90 }),
      q: "How many triangles make this trapezoid?",
      misc: [
        [6, "6 triangles make a whole hexagon. The trapezoid is half a hexagon."],
        [2, "2 triangles make a rhombus. The trapezoid is bigger."],
        [1, "That one triangle only fills part of it. How many fill it all?"],
      ],
      explain: "3 triangles fill the trapezoid. 2 trapezoids make a hexagon, and 6 triangles do too.",
    },
  },
  {
    title: "Equal parts",
    widget: wShare,
    body: "<p>Cut a shape into 2 <b>equal</b> parts: each is a <b>half</b>. 3 equal parts: each is a <b>third</b>. 4 equal parts: each is a <b>fourth</b>, or a quarter.</p><p>Pick a shape and how many parts. Tap parts to color them.</p>",
    check: {
      kind: "mc",
      q: "What part of the circle is shaded?",
      fig: shareFig("circle", 3, "v", { shade: [0], s: 140 }),
      choices: [
        { id: "a", label: "1 half" },
        { id: "b", label: "1 fourth" },
        { id: "c", label: "1 third" },
      ],
      answer: "c",
      why: {
        a: "Count all the parts. There are 3 equal parts, not 2.",
        b: "A fourth is 1 of 4 equal parts. Count the parts.",
      },
      explain: "The circle has 3 equal parts. 1 of them is shaded: 1 third.",
    },
  },
  {
    title: "Same size, different shape",
    widget: wSameSize,
    body: "<p>There are lots of ways to cut a square into fourths. The pieces can look different, but they must be the <b>same size</b>.</p><p>Try each cut.</p>",
    check: {
      kind: "mc",
      q: "Which picture shows fourths?",
      choices: [
        { id: "a", label: shareFig("square", 4, "uneq", { s: 90, label: "Picture A" }) },
        { id: "b", label: shareFig("square", 4, "diag", { s: 90, label: "Picture B" }) },
        { id: "c", label: shareFig("square", 3, "v", { s: 90, label: "Picture C" }) },
      ],
      answer: "b",
      why: {
        a: "That one has 4 pieces, but they are not the same size.",
        c: "That one has 3 equal pieces. Those are thirds.",
      },
      explain: "The square cut corner to corner has 4 equal pieces, so each one is a fourth.",
    },
  },
  {
    title: "The whole thing",
    widget: wWhole,
    body: "<p>2 halves make a whole. 3 thirds make a whole. 4 fourths make a whole.</p><p>The more pieces you cut, the <b>smaller</b> each piece is.</p>",
    check: {
      kind: "mc",
      q: "Two pizzas are the same size. One is cut into halves. The other is cut into fourths. Which piece is bigger?",
      fig: shareRow(
        "circle",
        [
          { n: 2, shade: [0] },
          { n: 4, shade: [0] },
        ],
        { label: "Pizza" },
      ),
      choices: [
        { id: "a", label: "1 half" },
        { id: "b", label: "1 fourth" },
        { id: "c", label: "They’re the same" },
      ],
      answer: "a",
      why: {
        b: "The pizza cut into fourths has more pieces, so each piece is smaller.",
        c: "Look at the shaded pieces. Cutting into more pieces makes each piece smaller.",
      },
      explain: "Halves are bigger than fourths. Fewer pieces means bigger pieces.",
    },
  },
];
