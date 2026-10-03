/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 8: Putting it together. Its widgets and steps; loaded by put-together.html. */
/* four situations with 3/4 and 1/2: multiply or divide? Each is a part of a group on the tape (tape: [part, group]) */
const H = frac(1, 2),
  T = frac(3, 4);
const SITS = [
  {
    id: "drank",
    label: "Water",
    say: `Andre had ${fr(3, 4)} liter of water and drank ${fr(1, 2)} of it. How much did Andre drink?`,
    op: "×",
    a: H,
    b: T,
    ans: fMul(H, T),
    why: `${fr(1, 2)} <i>of</i> ${fr(3, 4)} liter is a part of a known amount: multiply.`,
    tape: [fMul(H, T), T],
    unit: "liter",
  },
  {
    id: "walk",
    label: "Walk",
    say: `Han’s school is ${fr(3, 4)} km away. Han has walked ${fr(1, 2)} km. What fraction of the way is that?`,
    op: "÷",
    a: H,
    b: T,
    ans: fDiv(H, T),
    why: `What fraction of ${fr(3, 4)} is ${fr(1, 2)}? The whole trip is the group: divide ${fr(1, 2)} by ${fr(3, 4)}.`,
    tape: [H, T],
    unit: "",
  },
  {
    id: "goal",
    label: "Goal",
    say: `Priya’s goal was to collect ${fr(1, 2)} kg of trash. Priya collected ${fr(3, 4)} kg. How many times the goal is that?`,
    op: "÷",
    a: T,
    b: H,
    ans: fDiv(T, H),
    why: `How many ${fr(1, 2)}s are in ${fr(3, 4)}? The goal is the group: divide ${fr(3, 4)} by ${fr(1, 2)}.`,
    tape: [T, H],
    unit: "",
  },
  {
    id: "park",
    label: "Park",
    say: `A park is ${fr(1, 2)} square mile. A class cleaned ${fr(3, 4)} of it. How many square miles did they clean?`,
    op: "×",
    a: T,
    b: H,
    ans: fMul(T, H),
    why: `${fr(3, 4)} <i>of</i> ${fr(1, 2)} square mile is a part of a known amount: multiply.`,
    tape: [fMul(T, H), H],
    unit: "square mile",
  },
];
/* Pick a situation to see whether it multiplies or divides, and its tape. */
function wOps(el) {
  const q = Q(el);
  let situationId = "drank";
  el.innerHTML =
    seg(
      "Situation",
      SITS.map((situation) => [situation.id, situation.label]),
    ) +
    `<p class="readout" data-s></p><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const situation = SITS.find((x) => x.id === situationId),
      [part, group] = situation.tape;
    press(el, situationId);
    q("s").innerHTML = situation.say;
    q("f").innerHTML = groupTape(part, group, {
      label: `Tape diagram: ${ftx(part)} as a part of a group of ${ftx(group)}`,
    });
    q("e").innerHTML = `${fx(situation.a)} ${situation.op} ${fx(situation.b)} = ${fx(situation.ans)}`;
    q("r").innerHTML =
      `${situation.why} <b>${fx(situation.ans)}${situation.unit ? " " + situation.unit : ""}</b>.<br><span class="dimline">The same two numbers, but each question needs its own operation. Ask: what is the group, and what is unknown?</span>`;
  };
  onPick(el, (id) => {
    situationId = id;
    draw();
  });
  draw();
}

/* a batch takes FLOUR and BUTTER; what each friend has (f flour, b butter) */
const FLOUR = frac(3, 4),
  BUTTER = frac(1, 3);
const FRIENDS = [
  { who: "Mai", f: frac(2), b: frac(1, 4) },
  { who: "Kiran", f: frac(1), b: frac(1, 2) },
  { who: "Clare", f: frac(5, 4), b: frac(3, 4) },
  { who: "All three", f: frac(17, 4), b: frac(3, 2) },
];
/* How many batches: each ingredient allows some number, and the smaller number wins. */
function wBatches(el) {
  const q = Q(el);
  let friendIndex = 0;
  el.innerHTML =
    seg(
      "Who",
      FRIENDS.map((friend, i) => [i, friend.who]),
    ) +
    `<p class="tape-lab" data-lf></p><div class="fig" data-f></div><p class="tape-lab" data-lb></p><div class="fig" data-b></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* byFlour and byButter: the batches each allows; batches: whole batches of the smaller; short: what runs out */
    const friend = FRIENDS[friendIndex],
      byFlour = fDiv(friend.f, FLOUR),
      byButter = fDiv(friend.b, BUTTER),
      batches = Math.floor(Math.min(fVal(byFlour), fVal(byButter))),
      short = fVal(byFlour) < fVal(byButter) ? "flour" : "butter";
    press(el, friendIndex);
    q("lf").innerHTML = `Flour: ${fx(friend.f)} cup${fVal(friend.f) > 1 ? "s" : ""}, ${fx(FLOUR)} cup a batch`;
    q("f").innerHTML = groupTape(friend.f, FLOUR, {
      label: `Tape diagram: ${ftx(friend.f)} cups of flour in groups of 3/4 cup`,
    });
    q("lb").innerHTML = `Butter: ${fx(friend.b)} cup${fVal(friend.b) > 1 ? "s" : ""}, ${fx(BUTTER)} cup a batch`;
    q("b").innerHTML = groupTape(friend.b, BUTTER, {
      label: `Tape diagram: ${ftx(friend.b)} cups of butter in groups of 1/3 cup`,
    });
    q("r").innerHTML =
      `Flour is enough for ${fx(friend.f)} ÷ ${fx(FLOUR)} = <b>${fx(byFlour)}</b> batches. Butter is enough for ${fx(friend.b)} ÷ ${fx(BUTTER)} = <b>${fx(byButter)}</b> batches.<br>` +
      `<span class="ok">${friend.who === "All three" ? "Together they" : friend.who} can make <b>${batches} whole batch${batches === 1 ? "" : "es"}</b>: the ${short} runs out first.</span>`;
  };
  onPick(el, (id) => {
    friendIndex = +id;
    draw();
  });
  draw();
}

const STEPS = [
  {
    title: "Which operation?",
    widget: wOps,
    body:
      "<p>The same two fractions can need different operations. “" +
      fr(1, 2) +
      " of " +
      fr(3, 4) +
      "” is a part of a known amount: multiply. “What fraction of " +
      fr(3, 4) +
      " is " +
      fr(1, 2) +
      "?” and “how many " +
      fr(1, 2) +
      "s are in " +
      fr(3, 4) +
      "?” ask about groups: divide.</p><p>Pick a situation.</p>",
    check: {
      kind: "mc",
      q:
        "An orange has about " +
        fr(1, 4) +
        " cup of juice. How many oranges does it take to make 2 " +
        fr(1, 2) +
        " cups of juice? Which equation fits?",
      choices: [
        { id: "a", label: "2 " + fr(1, 2) + " ÷ " + fr(1, 4) + " = ?" },
        { id: "b", label: fr(1, 4) + " ÷ 2 " + fr(1, 2) + " = ?" },
        { id: "c", label: "2 " + fr(1, 2) + " × " + fr(1, 4) + " = ?" },
        { id: "d", label: "? × 2 " + fr(1, 2) + " = " + fr(1, 4) },
      ],
      answer: "a",
      why: {
        b:
          "That asks how many 2 " +
          fr(1, 2) +
          "s are in " +
          fr(1, 4) +
          ". Each orange is a group of " +
          fr(1, 4) +
          " cup, and the total is 2 " +
          fr(1, 2) +
          " cups.",
        c:
          "That’s " +
          fr(1, 4) +
          " of 2 " +
          fr(1, 2) +
          " cups. The question asks how many groups of " +
          fr(1, 4) +
          " make 2 " +
          fr(1, 2) +
          ".",
        d:
          "That says some number of 2 " +
          fr(1, 2) +
          "-cup groups make " +
          fr(1, 4) +
          " cup. The groups are " +
          fr(1, 4) +
          " cup each.",
      },
      explain:
        "? oranges × " +
        fr(1, 4) +
        " cup = 2 " +
        fr(1, 2) +
        " cups, so 2 " +
        fr(1, 2) +
        " ÷ " +
        fr(1, 4) +
        " = 10 oranges.",
    },
  },
  {
    title: "Two amounts, one answer",
    widget: wBatches,
    body:
      "<p>A cookie recipe uses " +
      fr(3, 4) +
      " cup of flour and " +
      fr(1, 3) +
      " cup of butter for each batch. Divide each amount you have by what a batch needs. You can only make as many whole batches as the scarcer ingredient allows.</p><p>Pick who is baking.</p>",
    check: {
      kind: "num",
      unit: "batches",
      answer: 3,
      q: "Using the same recipe, Han has 3 cups of flour and 1 cup of butter. How many whole batches can Han make?",
      misc: [
        [4, "That’s the flour: 3 ÷ " + fr(3, 4) + " = 4. The butter allows only 1 ÷ " + fr(1, 3) + " = 3."],
        [7, "That adds the batches for flour and butter. Each batch needs both, so the smaller number wins."],
        [2.25, "That’s 3 × " + fr(3, 4) + ". Divide the flour by what a batch needs."],
      ],
      explain:
        "Flour: 3 ÷ " +
        fr(3, 4) +
        " = 4 batches. Butter: 1 ÷ " +
        fr(1, 3) +
        " = 3 batches. The butter runs out first, so 3 batches.",
    },
  },
];
