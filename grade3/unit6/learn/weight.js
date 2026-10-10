/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 3: Grams and kilograms. Its widgets and
   steps; loaded by weight.html. */
/* Put 100-gram blocks on a scale one at a time: 10 of them weigh 1,000 grams, 1 kilogram. */
function wBlocks(el) {
  const q = Q(el),
    values = { blocks: 3 };
  el.innerHTML = `<div class="wrow">${stepper("blocks", "100-gram blocks")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const grams = values.blocks * 100;
    q("blocks").textContent = values.blocks;
    q("f").innerHTML = dialFig(1000, 100, grams, "grams");
    q("r").innerHTML =
      `${pl(values.blocks, "block")} of 100 grams: the needle points to <b>${grams.toLocaleString("en-US")} grams</b>.` +
      (grams === 1000 ? `<br><span class="ok">1,000 grams is 1 kilogram.</span>` : "");
  };
  steppers(el, values, { blocks: [0, 10] }, draw);
  draw();
}
/* things to weigh, about how much each weighs, and whether that's grams or kilograms */
const WEIGH_THINGS = [
  ["A paper clip", "about 1 gram", "g"],
  ["An apple", "about 200 grams", "g"],
  ["A bag of flour", "about 2 kilograms", "kg"],
  ["A bike", "about 15 kilograms", "kg"],
];
/* Pick a thing, then the unit you'd weigh it in. */
function wGramsOrKilograms(el) {
  /* unit: the unit picked (null until one is) */
  const q = Q(el);
  let thingIndex = 0,
    unit = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Thing",
      WEIGH_THINGS.map(([thing], i) => [i, thing]),
    )}</div>` +
    `<div data-bot>${seg("Unit", [
      ["g", "Grams"],
      ["kg", "Kilograms"],
    ])}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [thing, about, right] = WEIGH_THINGS[thingIndex];
    press(q("top"), thingIndex);
    press(q("bot"), unit);
    q("r").innerHTML =
      unit === null
        ? `Would you weigh ${thing.toLowerCase()} in grams or kilograms?`
        : unit === right
          ? `<span class="ok">Yes: ${thing.toLowerCase()} weighs ${about}.</span>`
          : `<span class="no">${thing} weighs ${about}. ${right === "g" ? "A kilogram is much more than that." : "That would be thousands of grams."}</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      thingIndex = +id;
      unit = null;
    } else unit = id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  scale: dialFig(1000, 100, 650, "grams"),
};
const STEPS = [
  {
    title: "Read a scale",
    widget: wBlocks,
    body: "<p><b>Grams</b> and <b>kilograms</b> measure weight. A paper clip weighs about 1 gram. 1,000 grams make 1 kilogram, about the weight of a big water bottle. A scale’s needle points to the weight.</p><p>Put blocks of 100 grams on the scale.</p>",
    check: {
      kind: "num",
      q: "What does the scale show?",
      fig: F.scale,
      answer: 650,
      unit: "grams",
      misc: [
        [700, "The small mark is halfway between 600 and 700: 650."],
        [600, "The needle is past 600. The small mark is halfway to 700."],
      ],
      explain: "The needle points to the small mark halfway between 600 and 700: 650 grams.",
    },
  },
  {
    title: "Grams or kilograms?",
    widget: wGramsOrKilograms,
    body: "<p>Use grams for light things, like a grape or an apple. Use kilograms for heavy things, like a bag of flour or a dog.</p><p>Pick a thing, then the unit you’d weigh it in.</p>",
    check: {
      kind: "mc",
      q: "About how much does a bag of flour weigh?",
      choices: [
        { id: "a", label: "2 kilograms" },
        { id: "b", label: "2 grams" },
        { id: "c", label: "200 kilograms" },
      ],
      answer: "a",
      why: {
        b: "2 grams is about 2 paper clips. A bag of flour is much heavier.",
        c: "200 kilograms is heavier than a person. A bag of flour is about 2 kilograms.",
      },
      explain: "A bag of flour weighs about 2 kilograms.",
    },
  },
];
