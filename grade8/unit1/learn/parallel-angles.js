/* Learn Rigid Transformations and Congruence (Grade 8 Unit 1), chapter 7: Angles and parallel lines. Its widgets and steps;
   loaded by parallel-angles.html. transversalFig numbers the eight angles 0 to 3 at the top crossing and 4 to 7 at the
   bottom one; the even ones match the crossing line's angle and the odd ones make 180° with it. */
/* the measure of angle i where the crossing line is at deg */
const measureAt = (deg, i) => (i % 2 === 0 ? deg : 180 - deg);

/* A slider turns the crossing line: all eight angles come in just two sizes, which add to 180°. */
function wAll(el) {
  const q = Q(el);
  el.innerHTML =
    `<div class="wrow"><label class="slider">Crossing angle <input type="range" min="7" max="29" value="12" data-s><b data-sv></b></label></div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const deg = 5 * +q("s").value,
      texts = range(8).map((i) => `${measureAt(deg, i)}°`);
    q("sv").textContent = `${deg}°`;
    q("f").innerHTML = transversalFig(deg, {
      texts,
      label: `Parallel lines crossed by a line at ${deg}°, all eight angles marked`,
    });
    q("r").innerHTML =
      deg === 90
        ? "The crossing line is at a right angle to both parallel lines: <b>all eight angles are 90°</b>."
        : `Four of the angles are <b>${deg}°</b> and four are <b>${180 - deg}°</b>, and ${deg} + ${180 - deg} = 180. Sliding the top crossing down the crossing line (a translation) lands it right on the bottom one, so the two crossings match.`;
  };
  q("s").addEventListener("input", draw);
  draw();
}

/* pairs of angles to compare: [id, button, the two angles, what they're called and why] */
const PAIRS = [
  [
    "vertical",
    "Vertical",
    [1, 3],
    "<b>vertical angles</b>: across from each other at one crossing. A half turn around the crossing point swaps them, so they’re equal.",
  ],
  [
    "corresponding",
    "Corresponding",
    [0, 4],
    "<b>corresponding angles</b>: in the same spot at the two crossings. Sliding the top crossing down onto the bottom one (a translation) fits them together, so they’re equal.",
  ],
  [
    "alternate",
    "Alternate interior",
    [2, 4],
    "<b>alternate interior angles</b>: between the parallel lines, on opposite sides of the crossing line. A half turn around the point halfway between the crossings swaps them (and swaps ℓ and m), so they’re equal.",
  ],
  ["straight", "Side by side", [2, 3], "side by side on one straight line, so together they make <b>180°</b>."],
];
/* Pick a pair: angles 1 and 2 light up, with what they're called and the move that shows how they're related. */
function wPairs(el) {
  const q = Q(el),
    deg = 60;
  el.innerHTML =
    seg(
      "Pair",
      PAIRS.map(([id, button]) => [id, button]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (id) => {
    const [, button, [first, second], says] = PAIRS.find((pair) => pair[0] === id),
      texts = [];
    texts[first] = "1";
    texts[second] = "2";
    press(el, id);
    q("f").innerHTML = transversalFig(deg, {
      texts,
      hi: [first, second],
      label: `Parallel lines crossed by a line, angles 1 and 2 marked: ${button.toLowerCase()}`,
    });
    q("r").innerHTML =
      `Angles 1 and 2 are ${says} Here angle 1 is ${measureAt(deg, first)}° and angle 2 is ${measureAt(deg, second)}°.`;
  };
  onPick(el, draw);
  draw("vertical");
}

const STEPS = [
  {
    title: "Two sizes of angle",
    widget: wAll,
    body: "<p>When a line crosses two <b>parallel</b> lines (lines that never meet), it makes eight angles, four at each crossing. They come in just two sizes, and the two sizes add up to 180°. So knowing one angle tells you all eight.</p><p>Turn the crossing line.</p>",
    check: {
      kind: "num",
      q: "A line crosses two parallel lines. One of the eight angles is 70°. The others are either 70° or what other size?",
      answer: 110,
      unit: "°",
      misc: [
        [70, "That’s the size you know. The other size makes a straight line with it."],
        [20, "The two sizes aren’t complementary: they make a straight line, 180°."],
      ],
      explain: "The two sizes add to 180°: 180 − 70 = 110°.",
    },
  },
  {
    title: "Pairs of angles",
    widget: wPairs,
    body: "<p>Rigid moves show which angles are equal. A half turn swaps <b>vertical angles</b>. A translation along the crossing line matches <b>corresponding angles</b>. A half turn around the point halfway between the crossings swaps <b>alternate interior angles</b>, the ones between the parallel lines on opposite sides of the crossing line.</p><p>Pick a pair.</p>",
    check: {
      kind: "num",
      q: "A line crosses two parallel lines. One angle between the parallel lines is 65°. What is its alternate interior angle?",
      answer: 65,
      unit: "°",
      misc: [
        [115, "Alternate interior angles are equal, not a straight line together."],
        [25, "They aren’t complementary: alternate interior angles are equal."],
      ],
      explain: "Alternate interior angles are equal: 65°.",
    },
  },
];
