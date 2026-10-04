/* Learn Expressions and Equations (Grade 6 Unit 6), chapter 6: Meaning of exponents. Its widgets and steps; loaded by
   exponents.html. */
/* A sheet of paper unfolded after `folds` folds into `base` equal parts each time: alternately across and down, so the
   creases cut it into base^folds equal rectangles (cols across, rows down). */
function foldedPaper(base, folds) {
  const cols = base ** Math.ceil(folds / 2),
    rows = base ** Math.floor(folds / 2),
    paperW = 300,
    paperH = 200,
    left = 10,
    top = 10;
  let markup = `<rect class="paper" x="${left}" y="${top}" width="${paperW}" height="${paperH}"/>`;
  range(cols - 1).forEach((i) => {
    const x = left + ((i + 1) * paperW) / cols;
    markup += `<line class="crease" x1="${x}" y1="${top}" x2="${x}" y2="${top + paperH}"/>`;
  });
  range(rows - 1).forEach((j) => {
    const y = top + ((j + 1) * paperH) / rows;
    markup += `<line class="crease" x1="${left}" y1="${y}" x2="${left + paperW}" y2="${y}"/>`;
  });
  return svgWrap(
    paperW + 2 * left,
    paperH + 2 * top,
    markup,
    `A sheet unfolded after ${folds} folds: creases cut it into ${cols * rows} equal parts`,
  );
}
/* Fold paper in halves or thirds: each fold multiplies the layers by the same number, so the layers are base^folds. */
function wFold(el) {
  const q = Q(el),
    values = { k: 3 },
    limits = { k: [1, 7] };
  let base = 2;
  el.innerHTML =
    seg("Fold", [
      [2, "In half"],
      [3, "In thirds"],
    ]) +
    `<div class="wrow">${stepper("k", "Folds")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const k = values.k,
      layers = base ** k,
      factors = range(k)
        .map(() => base)
        .join(" · ");
    press(el, base);
    q("k").textContent = k;
    q("f").innerHTML = foldedPaper(base, k);
    q("e").innerHTML = `${factors} = ${power(base, k)} = ${layers}`;
    q("r").innerHTML =
      `${k} fold${k === 1 ? "" : "s"} ${base === 2 ? "in half" : "in thirds"}: each fold multiplies the layers by ${base}, so the paper has <b>${power(base, k)} = ${layers} layers</b>, and ${layers} parts when you unfold it.` +
      `<br><span class="dimline">In ${power(base, k)}, ${base} is the <b>base</b> and ${k} is the <b>exponent</b>: how many ${base}s are multiplied. ${power(base, k)} is ${layers}, not ${base} · ${k} = ${base * k}.${k !== base ? ` And ${power(k, base)} = ${k ** base} is different from ${power(base, k)}: switching the numbers changes the value.` : ""}</span>`;
  };
  onPick(el, (id) => {
    base = +id;
    limits.k = [1, base === 2 ? 7 : 4];
    values.k = Math.min(values.k, limits.k[1]);
    draw();
  });
  steppers(el, values, limits, draw);
  draw();
}

/* A square or a cube with a stepper for its side: its area is side², and its volume is side³. */
function wSquareCube(el) {
  const q = Q(el),
    values = { s: 3 };
  let shape = "square";
  el.innerHTML =
    seg("Shape", [
      ["square", "Square"],
      ["cube", "Cube"],
    ]) +
    `<div class="wrow">${stepper("s", "Side")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const s = values.s,
      side = frac(s);
    press(el, shape);
    q("s").textContent = `${s} cm`;
    if (shape === "square") {
      q("f").innerHTML = rectGrid(side, side, 1, {
        unit: "cm",
        label: `A square ${s} cm on a side, in square centimeters`,
      });
      q("e").innerHTML = `${s} · ${s} = ${power(s, 2)} = ${s * s}`;
      q("r").innerHTML =
        `A square ${s} cm on a side is covered by ${s} rows of ${s} squares: its area is <b>${power(s, 2)} = ${s * s} square cm</b>.` +
        `<br><span class="dimline">That’s why ${power(s, 2)} is read “${s} squared.”</span>`;
    } else {
      q("f").innerHTML = cubeBox(side, side, side, 1, {
        unit: "cm",
        label: `A cube ${s} cm on an edge, in cubic centimeters`,
      });
      q("e").innerHTML = `${s} · ${s} · ${s} = ${power(s, 3)} = ${s ** 3}`;
      q("r").innerHTML =
        `A cube ${s} cm on an edge is ${s} layers of ${s} · ${s} cubes: its volume is <b>${power(s, 3)} = ${s ** 3} cubic cm</b>.` +
        `<br><span class="dimline">That’s why ${power(s, 3)} is read “${s} cubed.”</span>`;
    }
  };
  onPick(el, (id) => {
    shape = id;
    draw();
  });
  steppers(el, values, { s: [1, 6] }, draw);
  draw();
}

/* A unit square cut into d^n equal parts (alternately across and down), one of them shaded: (1/d)^n of the square. */
function partOfPart(d, n) {
  const cols = d ** Math.ceil(n / 2),
    rows = d ** Math.floor(n / 2),
    size = 240,
    left = 10,
    top = 10;
  let markup = `<rect class="paper" x="${left}" y="${top}" width="${size}" height="${size}"/>`;
  markup += `<rect class="part-on" x="${left}" y="${top}" width="${size / cols}" height="${size / rows}"/>`;
  range(cols - 1).forEach((i) => {
    const x = left + ((i + 1) * size) / cols;
    markup += `<line class="crease" x1="${x}" y1="${top}" x2="${x}" y2="${top + size}"/>`;
  });
  range(rows - 1).forEach((j) => {
    const y = top + ((j + 1) * size) / rows;
    markup += `<line class="crease" x1="${left}" y1="${y}" x2="${left + size}" y2="${y}"/>`;
  });
  return svgWrap(size + 2 * left, size + 2 * top, markup, `A square cut into ${cols * rows} equal parts, one shaded`);
}
/* Pick a base, 1/2 or 1/3, and an exponent: each time you multiply, you take that part of what's left. */
function wPartOfPart(el) {
  const q = Q(el),
    values = { n: 3 },
    limits = { n: [1, 6] };
  let d = 2;
  el.innerHTML =
    seg("Base", [
      [2, fr(1, 2)],
      [3, fr(1, 3)],
    ]) +
    `<div class="wrow">${stepper("n", "Exponent")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const n = values.n,
      base = `(${fr(1, d)})`,
      factors = range(n)
        .map(() => fr(1, d))
        .join(" · ");
    press(el, d);
    q("n").textContent = n;
    q("f").innerHTML = partOfPart(d, n);
    q("e").innerHTML = `${power(base, n)} = ${factors} = ${fr(1, d ** n)}`;
    q("r").innerHTML =
      `${power(base, n)} means ${fr(1, d)} of ${fr(1, d)}${n > 2 ? " of …" : ""}, ${n} times: <b>${fr(1, d ** n)}</b> of the square.` +
      `<br><span class="dimline">Multiplying by a number less than 1 takes a part of what you have, so each time the result gets smaller. Not ${fr(n, d)}: that would be ${fr(1, d)} added ${n} times.</span>`;
  };
  onPick(el, (id) => {
    d = +id;
    limits.n = [1, d === 2 ? 6 : 4];
    values.n = Math.min(values.n, limits.n[1]);
    draw();
  });
  steppers(el, values, limits, draw);
  draw();
}

const STEPS = [
  {
    title: "Repeated multiplication",
    widget: wFold,
    body: `<p>An <b>exponent</b> says how many times a number is multiplied by itself: ${power(2, 3)} means 2 · 2 · 2. Folding paper shows it: every fold in half doubles the layers.</p><p>Fold the paper.</p>`,
    check: {
      kind: "num",
      q: `What is ${power(4, 3)}?`,
      answer: 64,
      misc: [
        [12, `That’s 4 · 3. The exponent says how many 4s to multiply: 4 · 4 · 4.`],
        [7, `That’s 4 + 3. ${power(4, 3)} means 4 · 4 · 4.`],
        [
          81,
          `That’s ${power(3, 4)} = 3 · 3 · 3 · 3. In ${power(4, 3)}, 4 is the number multiplied and 3 is how many of them.`,
        ],
        [16, `That’s ${power(4, 2)}, one 4 short. ${power(4, 3)} has three 4s: 4 · 4 · 4.`],
      ],
      explain: `${power(4, 3)} = 4 · 4 · 4 = 16 · 4 = 64.`,
    },
  },
  {
    title: "Squares and cubes",
    widget: wSquareCube,
    body: withVars(
      `<p>The area of a square with side s is s · s = s<sup>2</sup>, and the volume of a cube with edge s is s · s · s = s<sup>3</sup>. That’s where “squared” and “cubed” come from.</p><p>Pick a shape and change its side.</p>`,
    ),
    check: {
      kind: "num",
      q: "A cube is 5 inches on each edge. What is its volume?",
      unit: "cubic inches",
      answer: 125,
      misc: [
        [15, `That’s 5 · 3. The volume is 5 · 5 · 5 = ${power(5, 3)}.`],
        [25, `That’s ${power(5, 2)} = 5 · 5, the area of one face. The volume uses all three edges: 5 · 5 · 5.`],
        [150, `That’s the surface area: 6 faces of 25. The volume counts the cubes inside: 5 · 5 · 5.`],
      ],
      explain: `${power(5, 3)} = 5 · 5 · 5 = 25 · 5 = 125 cubic inches.`,
    },
  },
  {
    title: "A part of a part",
    widget: wPartOfPart,
    body: `<p>The base can be a fraction. (${fr(1, 2)})<sup>3</sup> means ${fr(1, 2)} · ${fr(1, 2)} · ${fr(1, 2)}: half of a half of a half. Each time, you take a part of what’s left, so it gets smaller.</p><p>Pick a base and change the exponent.</p>`,
    check: {
      kind: "num",
      frac: true,
      q: `What is (${fr(2, 3)})<sup>2</sup>?`,
      answer: 0.44,
      misc: [
        [1.33, `That’s 2 · ${fr(2, 3)}. The exponent means multiply ${fr(2, 3)} by itself: ${fr(2, 3)} · ${fr(2, 3)}.`],
        [0.22, `The numerator is multiplied by itself too: 2 · 2 = 4.`],
        [0.67, `That multiplies the denominator by 2. ${fr(2, 3)} · ${fr(2, 3)} = (2 · 2) out of (3 · 3).`],
      ],
      explain: `(${fr(2, 3)})<sup>2</sup> = ${fr(2, 3)} · ${fr(2, 3)} = ${fr(4, 9)}: two thirds of two thirds.`,
    },
  },
];
