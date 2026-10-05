/* Learn Area and Multiplication (Grade 3 Unit 2), chapter 8: Figures made of rectangles. Its widgets and steps; loaded by composite-figures.html. */
/* L-shaped figures: a rectangle wide × tall with a corner cutWide × cutTall cut away, and which corner */
const L_FIGS = [
  { wide: 8, tall: 6, cutWide: 3, cutTall: 2, corner: "tr" },
  { wide: 7, tall: 7, cutWide: 4, cutTall: 3, corner: "tl" },
  { wide: 9, tall: 5, cutWide: 5, cutTall: 2, corner: "br" },
];
/* a figure's sides, numbered as lFig numbers them (0 top, 1 and 2 the cut corner's sides, 3 right, 4 bottom, 5 left, for a top
   right corner), its inside corner's distance from the left (inner) and from the bottom (lower), and its area */
function lParts({ wide, tall, cutWide, cutTall }) {
  const inner = wide - cutWide,
    lower = tall - cutTall;
  return { inner, lower, sides: [inner, cutTall, cutWide, lower, wide, tall], area: wide * tall - cutWide * cutTall };
}
/* the figure drawn: sides as texts (one may be '?'), cut 'down', 'across', or null, and its unit squares when grid */
const drawL = (fig, sides, cut = null, grid = false) =>
  lFig(fig.wide, fig.tall, fig.cutWide, fig.cutTall, { corner: fig.corner, sides, cut, grid });
/* Pick a figure, then a way to cut it into two rectangles: both ways give the same area. */
function wCutL(el) {
  /* cut: 'down', 'across', or null before one is picked */
  const q = Q(el);
  let figIndex = 0,
    cut = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Figure",
      L_FIGS.map((fig, i) => [i, `Figure ${i + 1}`]),
    )}</div><div data-bot>${seg("Cut", [
      ["down", "Cut up and down"],
      ["across", "Cut across"],
    ])}</div>` + `<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const fig = L_FIGS[figIndex],
      { wide, tall, cutTall } = fig,
      { inner, lower, sides, area } = lParts(fig);
    /* the two rectangles each cut makes, as [width, height] */
    const parts = {
      down: [
        [inner, tall],
        [fig.cutWide, lower],
      ],
      across: [
        [inner, cutTall],
        [wide, lower],
      ],
    };
    press(q("top"), figIndex);
    press(q("bot"), cut);
    q("f").innerHTML = drawL(fig, sides, cut, true);
    if (!cut) {
      q("o").innerHTML = "Pick a way to cut it into two rectangles.";
      return;
    }
    const [[w1, h1], [w2, h2]] = parts[cut];
    q("o").innerHTML =
      `The gold rectangle is ${w1} × ${h1} = ${w1 * h1}. The blue one is ${w2} × ${h2} = ${w2 * h2}.` +
      `<br><span class="ok">${w1 * h1} + ${w2 * h2} = ${area} square units.</span>` +
      `<br><span class="dimline">Cut it the other way and the area is still ${area}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") {
      figIndex = +id;
      cut = null;
    }
    if (row === "bot") cut = id;
    if (row) draw();
  });
  draw();
}
/* how to find each side from the others: the whole side across from it, and the other part on its side (side 0 + side 2 =
   side 4, and side 1 + side 3 = side 5) */
const SIDE_PARTS = { 0: [4, 2], 2: [4, 0], 1: [5, 3], 3: [5, 1] };
/* Pick a figure and a side to hide, then see how to find it from the sides across from it. */
function wFindSide(el) {
  /* hidden: which side is marked ? (a number from SIDE_PARTS) */
  const q = Q(el);
  let figIndex = 0,
    hidden = 0;
  el.innerHTML =
    `<div data-top>${seg(
      "Figure",
      L_FIGS.map((fig, i) => [i, `Figure ${i + 1}`]),
    )}</div><div data-bot>${seg(
      "Hidden side",
      Object.keys(SIDE_PARTS).map((side, i) => [side, `Side ${"abcd"[i]}`]),
    )}</div>` + `<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw = () => {
    const fig = L_FIGS[figIndex],
      { sides, area } = lParts(fig),
      [whole, part] = SIDE_PARTS[hidden],
      way = hidden % 2 === 0 ? "across" : "up and down";
    press(q("top"), figIndex);
    press(q("bot"), hidden);
    q("f").innerHTML = drawL(
      fig,
      sides.map((side, i) => (i === hidden ? "?" : side)),
    );
    q("o").innerHTML =
      `Look at the sides that go ${way}. The whole side is ${sides[whole]}, and the ? side and the ${sides[part]} side make it together.` +
      `<br><span class="ok">? = ${sides[whole]} − ${sides[part]} = ${sides[hidden]}.</span>` +
      `<br><span class="dimline">Now cut the figure into rectangles: the area is ${area} square units.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") figIndex = +id;
    if (row === "bot") hidden = +id;
    if (row) draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  area: lFig(8, 6, 3, 2, { sides: [5, 2, 3, 4, 8, 6] }),
  side: lFig(9, 7, 4, 3, { corner: "bl", sides: ["?", 3, 4, 4, 9, 7] }),
};
const STEPS = [
  {
    title: "Cut it into rectangles",
    widget: wCutL,
    body: "<p>To find the area of a figure made of rectangles, cut it into rectangles that don’t overlap. Find each one’s area, then add them. There’s more than one way to cut it, and every way gives the same area.</p><p>Pick a figure and a way to cut it.</p>",
    check: {
      kind: "num",
      q: "What is the area of this figure?",
      fig: F.area,
      answer: 42,
      unit: "square units",
      misc: [
        [48, "That’s the whole big rectangle, 8 × 6, but a corner is cut away."],
        [30, "That’s only one part, 5 × 6. Add the other rectangle too."],
        [28, "That’s the distance around. Area is the squares inside."],
      ],
      explain: "Cut it up and down: 5 × 6 = 30 and 3 × 4 = 12. 30 + 12 = 42 square units.",
    },
  },
  {
    title: "Find the missing sides",
    widget: wFindSide,
    body: "<p>Sometimes a side isn’t marked. Use the sides across from it: the two short sides on one side of the figure add up to the long side across from them.</p><p>Pick a figure and a side to hide, then see how to find it.</p>",
    check: {
      kind: "num",
      q: "How long is the side marked ?",
      fig: F.side,
      answer: 5,
      unit: "units",
      misc: [
        [9, "That’s the whole side across from it. Take away the 4."],
        [13, "That adds. The ? side and the 4 side make 9 together."],
      ],
      explain: "The whole side across is 9, and the other part is 4. 9 − 4 = 5.",
    },
  },
];
