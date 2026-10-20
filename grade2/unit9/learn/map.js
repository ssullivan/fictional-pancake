/* Learn Putting It All Together (Grade 2 Unit 9), chapter 2: Measure on a map. Its widgets and steps; loaded by map.html. */
/* trips to measure on the map */
const TRIPS = [
  {
    from: "Home",
    to: "School",
    legs: [
      ["r", 6],
      ["d", 5],
      ["r", 4],
    ],
  },
  {
    from: "Park",
    to: "Library",
    legs: [
      ["d", 4],
      ["r", 9],
      ["d", 3],
    ],
  },
  {
    from: "Zoo",
    to: "Pool",
    legs: [
      ["r", 8],
      ["u", 5],
      ["r", 7],
    ],
  },
];
/* Pick a trip, then add the lengths of its parts. */
function wPath(el) {
  /* added: the parts have been added up */
  const q = Q(el);
  let tripIndex = 0,
    added = false;
  el.innerHTML =
    seg(
      "Trip",
      TRIPS.map((trip, i) => [i, `${trip.from} to ${trip.to}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const trip = TRIPS[tripIndex];
    press(el, tripIndex);
    q("f").innerHTML = pathFig([trip], { label: `A path from ${trip.from} to ${trip.to}` });
    q("go").textContent = added ? "Hide the total" : "Add the parts";
    q("r").innerHTML = added
      ? `<span class="ok"><b>${legSum(trip.legs)} = ${legTotal(trip.legs)}</b>. The path is ${legTotal(trip.legs)} cm long.</span>`
      : `The path from ${trip.from} to ${trip.to} has ${trip.legs.length} parts.<br><span class="dimline">Add them to find how long it is.</span>`;
  };
  onPick(el, (m) => {
    tripIndex = +m;
    added = false;
    draw();
  });
  q("go").onclick = () => {
    added = !added;
    draw();
  };
  draw();
}
/* two ways from Home to the Park: gold goes across and down, blue goes down past the park, across, and back up */
const WAYS = [
  {
    from: "Home",
    to: "Park",
    cls: "a",
    name: "gold",
    legs: [
      ["r", 7],
      ["d", 6],
    ],
  },
  {
    from: "Home",
    to: "Park",
    cls: "b",
    name: "blue",
    legs: [
      ["d", 8],
      ["r", 7],
      ["u", 2],
    ],
  },
];
/* Measure each way to the park (pick one), then compare them. */
function wShorter(el) {
  /* picked: the way measured (-1 for none yet); compared: the two have been compared */
  const q = Q(el);
  let picked = -1,
    compared = false;
  el.innerHTML =
    seg(
      "Path",
      WAYS.map((way, i) => [i, `The ${way.name} path`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-cmp>Compare</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [gold, blue] = WAYS.map((way) => legTotal(way.legs));
    press(el, picked);
    q("f").innerHTML = pathFig(WAYS, { label: "Two paths from Home to the Park, gold and blue" });
    q("r").innerHTML = compared
      ? `<span class="ok">${blue} − ${gold} = ${blue - gold}. <b>The gold path is ${blue - gold} cm shorter.</b></span>`
      : picked < 0
        ? "Tap a path to measure it."
        : `The ${WAYS[picked].name} path: <b>${legSum(WAYS[picked].legs)} = ${legTotal(WAYS[picked].legs)} cm</b>`;
  };
  onPick(el, (m) => {
    picked = +m;
    compared = false;
    draw();
  });
  q("cmp").onclick = () => {
    compared = true;
    draw();
  };
  draw();
}
/* the lengths of 8 paths measured on the map, in centimeters */
const MEASURED = [14, 16, 13, 14, 15, 14, 16, 12];
/* Make a line plot of the paths: tap each length in turn (plotMaker, in shared/graphs.js). */
const wPlot = plotMaker(MEASURED, 12, 17, {
  story: "We measured 8 paths on the map, in centimeters.",
  one: "path",
  many: "paths",
  short: "cm",
  long: "cm",
});
/* the quick checks' figures */
const F = {
  library: pathFig(
    [
      {
        from: "Library",
        to: "Pool",
        legs: [
          ["d", 6],
          ["r", 9],
          ["u", 3],
        ],
      },
    ],
    { label: "A path from the Library to the Pool" },
  ),
  twoWays: pathFig(
    [
      {
        from: "Home",
        to: "Store",
        cls: "a",
        legs: [
          ["r", 5],
          ["d", 9],
        ],
      },
      {
        from: "Home",
        to: "Store",
        cls: "b",
        legs: [
          ["d", 11],
          ["r", 5],
          ["u", 2],
        ],
      },
    ],
    { label: "Two paths from Home to the Store, gold and blue" },
  ),
  plot: lineplot({ 12: 1, 13: 2, 14: 4, 15: 2, 16: 1 }, 12, 17, { unit: "cm" }),
};
const STEPS = [
  {
    title: "Add the parts of a path",
    widget: wPath,
    body: "<p>A path on a map can turn. Measure each straight part, then <b>add the parts</b> to find how long the whole path is.</p><p>Pick a trip, then add its parts.</p>",
    check: {
      kind: "num",
      unit: "cm",
      answer: 18,
      fig: F.library,
      q: "How long is the path from the Library to the Pool?",
      misc: [
        [15, "That leaves out the 3 cm part. Add every part."],
        [9, "That’s the longest part. Add all three parts."],
        [12, "That’s 6 + 9 − 3. Going up is still part of the path: add it."],
      ],
      explain: "6 + 9 + 3 = 18. The path is 18 cm long.",
    },
  },
  {
    title: "Which way is shorter?",
    widget: wShorter,
    body: "<p>Two paths can go to the same place. Measure both, then <b>subtract</b> to find how much shorter one is.</p><p>Measure each path, then compare.</p>",
    check: {
      kind: "num",
      unit: "cm",
      answer: 4,
      fig: F.twoWays,
      q: "How much shorter is the gold path than the blue path?",
      misc: [
        [32, "You added the paths. How much shorter is the difference: subtract."],
        [18, "That’s how long the blue path is: 11 + 5 + 2. Now subtract the gold path."],
        [14, "That’s how long the gold path is: 5 + 9. Now find the difference."],
      ],
      explain: "Gold: 5 + 9 = 14 cm. Blue: 11 + 5 + 2 = 18 cm. 18 − 14 = 4, so the gold path is 4 cm shorter.",
    },
  },
  {
    title: "Measure and plot",
    widget: wPlot,
    body: "<p>A <b>line plot</b> shows many measurements at once: one <b>X</b> for each path, above its length.</p><p>Tap each path’s length on the line to make the plot.</p>",
    check: {
      kind: "num",
      unit: "paths",
      answer: 4,
      fig: F.plot,
      q: "How many paths are 14 cm long?",
      misc: [
        [14, "14 is the length. Count the Xs above 14."],
        [10, "That’s every path. Count only the Xs above 14."],
        [2, "Those are the Xs above 13 or 15. Find 14."],
      ],
      explain: "There are 4 Xs above 14, so 4 paths are 14 cm long.",
    },
  },
];
