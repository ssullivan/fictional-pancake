/* Learn Putting It All Together (Grade 2 Unit 9), chapter 1: Sums and differences within 20. Its widgets and steps; loaded by fluency.html. */
/* a yellow cubes on top and b blue cubes under them; fade: dim the yellow ('a') or blue ('b') ones that are taken away */
const cubeRows = (a, b, fade = "", label = `${a} yellow cubes over ${b} blue cubes`) =>
  svgWrap(
    Math.max(a, b) * CUBE + 8,
    2 * CUBE + 12,
    cubes(4, 4, a, "a" + (fade === "a" ? " off" : "")) + cubes(4, CUBE + 8, b, "b" + (fade === "b" ? " off" : "")),
    label,
  );
/* facts to add two ways, [a, b] */
const SUMS = [
  [8, 7],
  [6, 7],
  [9, 5],
];
/* Pick a fact, then make a ten or use a double to add it. */
function wWays(el) {
  /* way: how it's being added ('' not yet, 'ten', or 'double') */
  const q = Q(el);
  let factIndex = 0,
    way = "";
  el.innerHTML =
    seg(
      "Fact",
      SUMS.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-ten>Make a ten</button><button type="button" class="btn" data-dbl>Use a double</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* need: what the first number needs to make 10; small, big: the two numbers in order, for the double */
    const [a, b] = SUMS[factIndex],
      total = a + b,
      need = 10 - a,
      small = Math.min(a, b),
      big = Math.max(a, b);
    press(el, factIndex);
    q("f").innerHTML =
      way === "double"
        ? cubeRows(a, b)
        : tenFrames(
            way === "ten"
              ? cellsOf([a, "a"], [need, "b moved"], [b - need, "b"])
              : [...cellsOf([a, "a"], [10 - a, ""]), ...cellsOf([b, "b"])],
            { label: `${a} yellow and ${b} blue counters` },
          );
    q("r").innerHTML =
      way === "ten"
        ? `${a} needs ${need} more to make 10. Move ${need} blue up.<br><b>${a} + ${b} = 10 + ${total - 10} = ${total}</b>`
        : way === "double"
          ? `${small} + ${small} = ${2 * small} is a double. ${big} is ${big - small} more than ${small}.<br><b>${a} + ${b} = ${2 * small} + ${big - small} = ${total}</b>`
          : `<b>${a} + ${b} = ?</b><br><span class="dimline">Make a ten, or use a double you know.</span>`;
  };
  onPick(el, (m) => {
    factIndex = +m;
    way = "";
    draw();
  });
  q("ten").onclick = () => {
    way = "ten";
    draw();
  };
  q("dbl").onclick = () => {
    way = "double";
    draw();
  };
  draw();
}
/* differences to find by counting on, [total, part] */
const DIFFS = [
  [14, 6],
  [13, 8],
  [16, 9],
];
/* Pick a difference, then count on from the part (a stepper adds blue counters) until you reach the total. */
function wThink(el) {
  const q = Q(el),
    values = { k: 0 };
  let factIndex = 0;
  el.innerHTML =
    seg(
      "Fact",
      DIFFS.map(([total, part], i) => [i, `${total} − ${part}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("k", "Count on")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const [total, part] = DIFFS[factIndex],
      { k } = values;
    press(el, factIndex);
    q("k").textContent = k;
    q("f").innerHTML = tenFrames(cellsOf([part, "a"], [k, "b"]), { label: `${part} yellow and ${k} blue counters` });
    q("r").innerHTML =
      part + k === total
        ? `<span class="ok"><b>${part} + ${k} = ${total}</b>, so <b>${total} − ${part} = ${k}</b>.</span>`
        : part + k < total
          ? `<b>${part} + ${k} = ${part + k}</b><br><span class="dimline">Count on from ${part} until you get to ${total}.</span>`
          : `<b>${part} + ${k} = ${part + k}</b><br><span class="dimline">That’s more than ${total}. Take some back.</span>`;
  };
  /* up to 11 more: with the biggest part, 9, that fills both frames */
  steppers(el, values, { k: [0, 11] }, draw);
  onPick(el, (m) => {
    factIndex = +m;
    values.k = 0;
    draw();
  });
  draw();
}
/* fact families to flip through, [a, b] */
const FAMILIES = [
  [7, 9],
  [8, 6],
  [5, 8],
];
/* Pick a fact card, then flip it to see the other facts in its family. */
function wFlip(el) {
  /* side: which of the family's 4 facts shows */
  const q = Q(el);
  let familyIndex = 0,
    side = 0;
  el.innerHTML =
    seg(
      "Card",
      FAMILIES.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-flip>Flip the card</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* each fact, and which color it takes away ('' for the adding facts) */
    const [a, b] = FAMILIES[familyIndex],
      total = a + b,
      facts = [
        [`${a} + ${b} = ${total}`, ""],
        [`${b} + ${a} = ${total}`, ""],
        [`${total} − ${b} = ${a}`, "b"],
        [`${total} − ${a} = ${b}`, "a"],
      ],
      [fact, fade] = facts[side];
    press(el, familyIndex);
    q("f").innerHTML = cubeRows(a, b, fade);
    q("r").innerHTML = `Side ${side + 1} of 4: <b>${fact}</b><br><span class="dimline">${
      fade
        ? `Start with all ${total} and take away the ${fade === "a" ? "yellow" : "blue"} ones.`
        : "Put the yellow and blue together."
    } Every fact uses ${a}, ${b}, and ${total}.</span>`;
  };
  onPick(el, (m) => {
    familyIndex = +m;
    side = 0;
    draw();
  });
  q("flip").onclick = () => {
    side = (side + 1) % 4;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  add96: tenFrames([...cellsOf([9, "a"], [1, ""]), ...cellsOf([6, "b"])], { label: "9 yellow and 6 blue counters" }),
  count8: tenFrames(cellsOf([8, "a"]), { label: "8 yellow counters" }),
};
const STEPS = [
  {
    title: "Make a ten or use a double",
    widget: wWays,
    body: "<p>You know lots of ways to add. <b>Make a ten</b>: move some over to fill a ten. <b>Use a double</b>: start with a double you know, then add a little more.</p><p>Pick a fact, then try both ways.</p>",
    check: {
      kind: "num",
      answer: 15,
      fig: F.add96,
      q: "What is <b>9 + 6</b>?",
      misc: [
        [3, "You subtracted. 9 + 6 puts them together."],
        [14, "Move 1 to make a ten: 9 + 1 = 10. 6 − 1 = 5 are left, so 10 + 5."],
        [16, "Move just 1 to make a ten: 10, and 5 more."],
      ],
      explain: "9 needs 1 more to make 10. 6 is 1 and 5, so 9 + 6 = 10 + 5 = 15.",
    },
  },
  {
    title: "Think addition to subtract",
    widget: wThink,
    body: "<p>To find <b>14 − 6</b>, think: 6 + ? = 14. Count on from 6 until you get to 14.</p><p>Pick a fact. Tap <b>+</b> to count on.</p>",
    check: {
      kind: "num",
      answer: 7,
      fig: F.count8,
      q: "What is <b>15 − 8</b>? Think: 8 + ? = 15.",
      misc: [
        [23, "You added. Think: what do you add to 8 to make 15?"],
        [8, "8 is the number you take away. What goes with 8 to make 15?"],
        [6, "8 + 6 = 14. Count on 1 more to get to 15."],
      ],
      explain: "8 + 2 = 10, and 10 + 5 = 15. 2 + 5 = 7, so 8 + 7 = 15 and 15 − 8 = 7.",
    },
  },
  {
    title: "Flip a fact",
    widget: wFlip,
    body: "<p>Every fact has a family. 7 + 9 = 16 also tells you 9 + 7 = 16, 16 − 9 = 7, and 16 − 7 = 9.</p><p>Pick a card and flip it to see each fact in its family.</p>",
    check: {
      kind: "mc",
      q: "You know <b>7 + 8 = 15</b>. Which subtraction fact do you know too?",
      choices: [
        { id: "a", label: "15 − 8 = 7" },
        { id: "b", label: "15 − 7 = 9" },
        { id: "c", label: "8 − 7 = 1" },
      ],
      answer: "a",
      why: {
        b: "15 − 7 is 8, not 9. The facts in the family use 7, 8, and 15.",
        c: "That’s true, but it doesn’t use 15. The facts in the family use 7, 8, and 15.",
      },
      explain: "7 + 8 = 15 goes with 15 − 8 = 7 and 15 − 7 = 8. They all use 7, 8, and 15.",
    },
  },
];
