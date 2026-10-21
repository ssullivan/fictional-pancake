/* Learn Multiplying and Dividing Fractions (Grade 5 Unit 3), chapter 1: A piece of a part. Its widgets and steps; loaded by
   piece.html. */
/* the unit fractions to pick from: denominators */
const PIECE_DEN = [2, 3, 4, 5];
/* Pick 1/b of a square (the light strip), then 1/a of that strip (two rows of buttons): the dark piece is 1/(a × b). */
function wPiece(el) {
  const q = Q(el);
  let strip = 3,
    part = 2;
  el.innerHTML =
    `<div data-top>${seg(
      "Strip",
      PIECE_DEN.map((d) => [d, `Strip 1/${d}`]),
    )}</div><div data-bot>${seg(
      "Part of the strip",
      PIECE_DEN.map((d) => [d, `Take 1/${d}`]),
    )}</div>` + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    press(q("top"), strip);
    press(q("bot"), part);
    q("f").innerHTML = areaFig([1, part], [1, strip], { under: true, label: `1/${part} of 1/${strip} of a square` });
    q("r").innerHTML =
      `The light strip is ${fr(1, strip)} of the square. Cut it into ${part} equal pieces and take 1. ` +
      `Pieces that size cut the whole square into ${part} × ${strip} = ${part * strip}: <b>${fr(1, part)} × ${fr(1, strip)} = ${fr(1, part * strip)}</b>.`;
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") strip = +hit[1];
    else part = +hit[1];
    draw();
  });
  draw();
}
/* Step the two denominators of 1/a × 1/b and see the rule: multiply the bottoms. */
function wRule(el) {
  const q = Q(el),
    values = { first: 2, second: 4 },
    limits = { first: [2, 6], second: [2, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("first", "First bottom")}${stepper("second", "Second bottom")}</div>` +
    `<p class="eq" data-e></p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { first, second } = values;
    q("first").textContent = first;
    q("second").textContent = second;
    q("e").innerHTML = `${fr(1, first)} × ${fr(1, second)} = ${fr(1, first * second)}`;
    q("f").innerHTML = areaFig([1, first], [1, second], {
      under: true,
      label: `1/${first} of 1/${second} of a square`,
    });
    q("r").innerHTML =
      `${first} columns × ${second} rows = ${first * second} equal pieces, and 1 of them is dark. Taking a part of a part makes a smaller piece.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Take a piece of one part",
    widget: wPiece,
    body: "<p>To find 1/2 of 1/3, shade 1/3 of a square as a strip, then cut the strip in half. The dark piece is one of 6 equal pieces that fill the square: <b>1/2 × 1/3 = 1/6</b>. “1/2 of” means 1/2 ×.</p><p>Pick a strip, then a part of it.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What is 1/2 × 1/4?",
      fig: areaFig([1, 2], [1, 4], { under: true, label: "1/2 of 1/4 of a square" }),
      answer: 1 / 8,
      unit: "",
      misc: [
        [1 / 6, "That adds the denominators. The square is cut into 2 × 4 = 8 pieces."],
        [3 / 4, "That adds 1/2 and 1/4. Taking 1/2 of 1/4 makes a smaller piece: multiply."],
      ],
      explain: "Half of the 1/4 strip is 1 of 2 × 4 = 8 equal pieces: 1/2 × 1/4 = 1/8.",
    },
  },
  {
    title: "Multiply the bottoms",
    widget: wRule,
    body: "<p>For any two unit fractions, the square is cut into as many pieces as the two denominators multiply to, and one is dark: <b>1/a × 1/b = 1/(a × b)</b>. A story about part of a part is this kind of problem.</p><p>Change the two denominators.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "1/3 of a garden is for vegetables. 1/4 of the vegetable part is carrots. What fraction of the whole garden is carrots?",
      answer: 1 / 12,
      unit: "of the garden",
      misc: [
        [1 / 7, "That adds the denominators. 1/4 of 1/3 is 1/4 × 1/3: multiply them."],
        [1 / 4, "That’s 1/4 of the whole garden. The carrots are 1/4 of just the vegetable part."],
      ],
      explain: "1/4 of 1/3 is 1/4 × 1/3 = 1/12 of the garden.",
    },
  },
];
