/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6), chapter 4: Liters. Its widgets and steps; loaded
   by liquid-volume.html. */
/* Pour water into an 8-liter container, a liter at a time. */
function wPour(el) {
  const q = Q(el),
    values = { liters: 3 };
  el.innerHTML = `<div class="wrow">${stepper("liters", "Liters poured")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const liters = values.liters;
    q("liters").textContent = liters;
    q("f").innerHTML = beakerFig(8, liters);
    q("r").innerHTML =
      liters === 0
        ? "The container is empty."
        : liters === 8
          ? `The water is at the top mark: <b>8 liters</b>. The container is full.`
          : `The water comes up to the ${liters} mark: <b>${pl(liters, "liter")}</b>.`;
  };
  steppers(el, values, { liters: [0, 8] }, draw);
  draw();
}
/* containers and about how much water each one holds: 'less', 'about', or 'more' than 1 liter */
const CONTAINERS = [
  ["A mug", "less"],
  ["A big water bottle", "about"],
  ["A bucket", "more"],
  ["A spoon", "less"],
];
/* Pick a container, then guess: less than, about, or more than 1 liter. */
function wEstimate(el) {
  const q = Q(el);
  let containerIndex = 0,
    guess = null;
  el.innerHTML =
    `<div data-top>${seg(
      "Container",
      CONTAINERS.map(([name], i) => [i, name]),
    )}</div>` +
    `<div data-bot>${seg("Holds", [
      ["less", "Less than 1 liter"],
      ["about", "About 1 liter"],
      ["more", "More than 1 liter"],
    ])}</div><p class="readout" data-r></p>`;
  const words = { less: "less than 1 liter", about: "about 1 liter", more: "more than 1 liter" };
  const draw = () => {
    const [name, right] = CONTAINERS[containerIndex];
    press(q("top"), containerIndex);
    press(q("bot"), guess);
    q("r").innerHTML =
      guess === null
        ? `How much water does ${name.toLowerCase()} hold?`
        : guess === right
          ? `<span class="ok">Yes: ${name.toLowerCase()} holds ${words[right]}.</span>`
          : `<span class="no">${name} holds ${words[right]}. A big water bottle holds about 1 liter.</span>`;
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") {
      containerIndex = +id;
      guess = null;
    } else guess = id;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  beaker: beakerFig(6, 4),
};
const STEPS = [
  {
    title: "Measure in liters",
    widget: wPour,
    body: "<p>A <b>liter</b> measures how much a container holds. A big water bottle holds about 1 liter. To read a container, find the top of the water and read the mark beside it.</p><p>Pour in water, a liter at a time.</p>",
    check: {
      kind: "num",
      q: "How many liters of water are in the container?",
      fig: F.beaker,
      answer: 4,
      unit: "liters",
      misc: [
        [6, "6 liters is the top mark. Read the mark at the top of the water."],
        [2, "That’s the empty part. Read the mark at the top of the water."],
      ],
      explain: "The water comes up to the 4 mark: 4 liters.",
    },
  },
  {
    title: "Estimate in liters",
    widget: wEstimate,
    body: "<p>Compare a container with a 1-liter water bottle. A mug holds less. A bucket holds more, about 10 liters.</p><p>Pick a container and guess how much it holds.</p>",
    check: {
      kind: "mc",
      q: "About how much water does a bathtub hold?",
      choices: [
        { id: "a", label: "About 200 liters" },
        { id: "b", label: "About 2 liters" },
        { id: "c", label: "Less than 1 liter" },
      ],
      answer: "a",
      why: {
        b: "2 liters is 2 water bottles. A bathtub holds much more.",
        c: "That’s less than a water bottle. A bathtub holds much more.",
      },
      explain: "A bathtub holds about 200 liters.",
    },
  },
];
