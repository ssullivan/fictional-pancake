/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2), chapter 5: Split and solve. Its widgets and
   steps; loaded by split.html. */
/* products of a whole number and a mixed number: [n, whole, a, b] for n × whole a/b */
const PRODUCTS = [
  [4, 2, 1, 3],
  [3, 1, 3, 4],
  [2, 3, 1, 2],
  [5, 1, 2, 5],
];
/* Pick a product n × w a/b and see it split into (n × w) + (n × a/b) on an area diagram. */
function wSplit(el) {
  const q = Q(el);
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      PRODUCTS.map(([n, whole, a, b], i) => [i, `${n} × ${whole} ${a}/${b}`]),
    ) + `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [n, whole, a, b] = PRODUCTS[productIndex],
      top = whole * b + a;
    press(el, productIndex);
    q("f").innerHTML = areaFig([top, b], [n, 1], { split: "w", label: `A rectangle ${whole} ${a}/${b} by ${n}` });
    q("e").innerHTML = `${n} × ${mixed(top, b)} = (${n} × ${whole}) + (${n} × ${fr(a, b)})`;
    q("r").innerHTML =
      `Gold: ${n} × ${whole} = ${n * whole}. Blue: ${n} × ${fr(a, b)} = ${fr(n * a, b)}. ` +
      `Add: <b>${n * whole} + ${fr(n * a, b)} = ${mixed(n * top, b)}</b>.`;
  };
  onPick(el, (m) => {
    productIndex = +m;
    draw();
  });
  draw();
}
/* area stories: [button, the story, length [n, d], width [n, d], the unit] */
const AREA_STORIES = [
  ["Garden path", "A garden path is 6 meters long and 3/4 meter wide.", [6, 1], [3, 4], "square meters"],
  ["Patio", "A patio is 3 meters long and 2 1/2 meters wide.", [3, 1], [5, 2], "square meters"],
  ["Quilt", "A quilt is 2 yards long and 1 2/3 yards wide.", [2, 1], [5, 3], "square yards"],
];
/* Pick an area story and see it worked on an area diagram. */
function wStory(el) {
  const q = Q(el);
  let storyIndex = 0;
  el.innerHTML =
    seg(
      "Story",
      AREA_STORIES.map(([button], i) => [i, button]),
    ) + `<p class="story" data-s></p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [, story, [n], [top, b], unit] = AREA_STORIES[storyIndex],
      whole = Math.floor(top / b),
      a = top % b,
      area = mixed(n * top, b);
    press(el, storyIndex);
    q("s").innerHTML = `${story} What is its area?`;
    q("f").innerHTML = areaFig([n, 1], [top, b], { split: "h", label: `A rectangle ${n} by ${top}/${b}` });
    q("r").innerHTML = whole
      ? `Split the width into ${whole} + ${fr(a, b)}. ${n} × ${whole} = ${n * whole}, and ${n} × ${fr(a, b)} = ${fr(n * a, b)}. <b>${n * whole} + ${fr(n * a, b)} = ${area} ${unit}</b>.`
      : `Length × width: <b>${n} × ${fr(top, b)} = ${fr(n * top, b)} = ${area} ${unit}</b>.`;
  };
  onPick(el, (m) => {
    storyIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Split a mixed number to multiply",
    widget: wSplit,
    body: "<p>To multiply a whole number by a mixed number, split the mixed number into its whole part and its fraction part. Multiply each part, then add. The area diagram shows the two parts as two rectangles.</p><p>Pick a product.</p>",
    check: {
      kind: "mc",
      q: "Which expression has the same value as 5 × 2 1/2?",
      answer: "a",
      choices: [
        { id: "a", label: "(5 × 2) + (5 × 1/2)" },
        { id: "b", label: "(5 × 2) + 1/2" },
        { id: "c", label: "5 × 2 × 1/2" },
      ],
      why: {
        b: "That multiplies only the 2 by 5. The 1/2 gets multiplied by 5 too.",
        c: "That multiplies by 1/2. 2 1/2 is 2 + 1/2: multiply each part, then add.",
      },
      explain: "5 × 2 1/2 = (5 × 2) + (5 × 1/2) = 10 + 5/2 = 12 1/2.",
    },
  },
  {
    title: "Area stories",
    widget: wStory,
    body: "<p>A story about a path, a patio, or a quilt is an area problem: multiply the length by the width. When a side is a mixed number, split it.</p><p>Pick a story.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A garden path is 5 meters long and 2/3 meter wide. What is its area?",
      answer: 10 / 3,
      unit: "square meters",
      misc: [
        [5 + 2 / 3, "That adds the sides. Area is length × width: 5 × 2/3."],
        [2 / 15, "That divides by 5. Each meter of path has 2/3 square meter: multiply."],
      ],
      explain: "5 × 2/3 = 10/3 = 3 1/3 square meters.",
    },
  },
];
