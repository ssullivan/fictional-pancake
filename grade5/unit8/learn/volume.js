/* Learn Putting It All Together (Grade 5 Unit 8), chapter 2: Volume again. Its widgets and steps; loaded by volume.html. */
/* Size a wagon bed with steppers (length, width, depth in feet): its volume is length × width × depth. */
function wWagon(el) {
  const q = Q(el),
    values = { length: 6, width: 3, depth: 2 },
    limits = { length: [2, 9], width: [2, 5], depth: [1, 3] };
  el.innerHTML =
    `<div class="wrow">${stepper("length", "Length")}${stepper("width", "Width")}${stepper("depth", "Depth")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { length, width, depth } = values;
    ["length", "width", "depth"].forEach((k) => (q(k).textContent = values[k]));
    q("f").innerHTML = prismFig(
      [prismBox(length, depth, width, { grid: true, lab: { l: `${length} ft`, h: `${depth} ft`, w: `${width} ft` } })],
      { label: `A wagon bed ${length} by ${width} by ${depth} feet` },
    );
    q("r").innerHTML =
      `${length} × ${width} = ${length * width} cubic feet in a layer, and ${depth} ${depth === 1 ? "layer" : "layers"}: <b>${length} × ${width} × ${depth} = ${length * width * depth} cubic feet</b>.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* giant wagons to estimate: [button, length, width, depth] in feet */
const WAGONS = [
  ["Wagon A", 27, 13, 2],
  ["Wagon B", 34, 18, 3],
  ["Wagon C", 22, 11, 4],
];
/* Pick a giant wagon: round its length and width to tens to estimate its volume, then compare with the exact volume. */
function wEstimate(el) {
  const q = Q(el);
  let wagonIndex = 0;
  el.innerHTML =
    seg(
      "Wagon",
      WAGONS.map(([button], i) => [i, button]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [, length, width, depth] = WAGONS[wagonIndex],
      roundL = Math.round(length / 10) * 10,
      roundW = Math.round(width / 10) * 10,
      estimate = roundL * roundW * depth,
      exact = length * width * depth;
    press(el, wagonIndex);
    q("e").innerHTML = `${length} ft × ${width} ft × ${depth} ft`;
    q("r").innerHTML =
      `Round to ${roundL} × ${roundW} × ${depth}: <b>about ${commas(estimate)} cubic feet</b>. Exactly, it’s ${length} × ${width} × ${depth} = ${commas(exact)}, ${exact > estimate ? "a bit more" : "a bit less"}.`;
  };
  onPick(el, (m) => {
    wagonIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Fill the wagon",
    widget: wWagon,
    body: "<p>A wagon bed is a box, so its volume is length × width × depth: how many cubic feet fit in one layer, times how many layers.</p><p>Change the wagon bed.</p>",
    check: {
      kind: "num",
      q: "A wagon bed is 8 feet long, 4 feet wide, and 2 feet deep. How many cubic feet of hay fill it?",
      answer: 64,
      unit: "cubic feet",
      misc: [
        [14, "That adds the edges. Multiply length × width × depth."],
        [32, "That’s one layer, 8 × 4. The bed is 2 layers deep."],
      ],
      explain: "8 × 4 = 32 cubic feet in a layer, and 2 layers: 32 × 2 = 64 cubic feet.",
    },
  },
  {
    title: "Estimate a giant wagon",
    widget: wEstimate,
    body: "<p>For a really big wagon, an estimate is often enough: round the edges to friendly numbers, then multiply. The world’s largest wagon is about 27 feet long and 13 feet wide.</p><p>Pick a giant wagon.</p>",
    check: {
      kind: "mc",
      q: "A giant wagon is 29 feet long, 12 feet wide, and 3 feet deep. About how much does it hold?",
      answer: "b",
      choices: [
        { id: "a", label: "about 44 cubic feet" },
        { id: "b", label: "about 900 cubic feet" },
        { id: "c", label: "about 9,000 cubic feet" },
      ],
      why: {
        a: "That adds the edges. Volume multiplies them.",
        c: "That’s 10 times too much. 30 × 10 × 3 = 900.",
      },
      explain: "Round to 30 × 10 × 3 = 900 cubic feet. (Exactly, it’s 1,044.)",
    },
  },
];
