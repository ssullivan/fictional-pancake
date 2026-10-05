/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 6: Subtract strategically. Its widgets and
   steps; loaded by subtract-strategically.html. */
/* students' work to check: [name, a, b, their answer, what went wrong (null when it's right)] */
const WORK = [
  ["Kiran", 452, 268, 216, "Kiran took the smaller digit from the bigger one in each place, instead of regrouping."],
  [
    "Elena",
    503,
    278,
    325,
    "Elena regrouped 1 hundred but still took 2 hundreds from 5. There are only 4 hundreds left.",
  ],
  ["Noah", 641, 325, 316, null],
];
/* Check a student's subtraction by adding the answer back on, then see it worked the right way. */
function wCheck(el) {
  /* stage: 0 just the claim, 1 checked by adding, 2 the right way shown */
  const q = Q(el);
  let workIndex = 0,
    stage = 0;
  el.innerHTML =
    seg(
      "Student",
      WORK.map(([name], i) => [i, name]),
    ) +
    `<p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-add>Check by adding</button><button type="button" class="btn" data-show>Show the right way</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [name, a, b, claim, wrong] = WORK[workIndex],
      back = claim + b;
    press(el, workIndex);
    q("add").disabled = stage > 0;
    q("show").disabled = stage !== 1;
    q("e").innerHTML = `${name} says ${a} − ${b} is ${claim}.`;
    q("f").hidden = stage < 2;
    q("f").innerHTML = stage < 2 ? "" : algFig(a, b, "−", algSteps(a, b, "−").length);
    q("r").innerHTML =
      (stage === 0
        ? `Is ${name} right? The answer plus the number taken away should give back ${a}.`
        : `${claim} + ${b} = ${back}. ` +
          (back === a
            ? `<span class="ok">That’s ${a}, so ${name} is right.</span>`
            : `That’s not ${a}, so ${claim} can’t be right. ${wrong}`)) +
      (stage === 2 ? `<br><span class="ok">${a} − ${b} = <b>${a - b}</b>, and ${a - b} + ${b} = ${a}.</span>` : "");
  };
  q("add").onclick = () => {
    stage = 1;
    draw();
  };
  q("show").onclick = () => {
    stage = 2;
    draw();
  };
  onPick(el, (id) => {
    workIndex = +id;
    stage = 0;
    draw();
  });
  draw();
}
/* problems to pick a strategy for: [a, b, the best strategy's id, why it's best] */
const PICK = [
  [701, 698, "up", "The numbers are only 3 apart, so counting up takes two small jumps."],
  [745, 300, "back", "Taking away 300 is one jump back. Nothing else changes."],
  [523, 167, "alg", "These numbers aren’t close and don’t end in zeros, so the algorithm keeps the work neat."],
];
/* the strategies: [id, button label] */
const STRATEGIES = [
  ["up", "Count up"],
  ["back", "Jump back"],
  ["alg", "Algorithm"],
];
/* the jumps to count up from b to a: to the next hundred (when it's on the way), then hundreds, then the rest */
function upMoves(a, b) {
  const nextHundred = Math.ceil(b / 100) * 100,
    moves = [];
  let at = b;
  if (nextHundred > b && nextHundred <= a) {
    moves.push(nextHundred - b);
    at = nextHundred;
  }
  if (Math.floor(a / 100) * 100 > at) {
    moves.push(Math.floor(a / 100) * 100 - at);
    at = Math.floor(a / 100) * 100;
  }
  if (a > at) moves.push(a - at);
  return moves;
}
/* Pick a problem and a strategy: each strategy works it, and the readout says which is easiest for these numbers. */
function wStrategy(el) {
  const q = Q(el);
  let problemIndex = 0,
    strategy = "up";
  el.innerHTML = `<div data-top>${seg(
    "Problem",
    PICK.map(([a, b], i) => [i, `${a} − ${b}`]),
  )}</div><div data-bot>${seg("Strategy", STRATEGIES)}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, best, why] = PICK[problemIndex],
      backMoves = placeValues(b)
        .filter((value) => value)
        .map((value) => -value),
      upJumps = upMoves(a, b);
    press(q("top"), problemIndex);
    press(q("bot"), strategy);
    q("f").innerHTML =
      strategy === "up"
        ? jumps(b, upJumps)
        : strategy === "back"
          ? jumps(a, backMoves)
          : algFig(a, b, "−", algSteps(a, b, "−").length);
    const work =
      strategy === "up"
        ? `Count up from ${b} to ${a}: ${upJumps.join(" + ")} = ${a - b}. That’s ${pl(upJumps.length, "jump")}.`
        : strategy === "back"
          ? `Jump back from ${a}: ${backMoves.map((move) => jumpText(move)).join(", ")} lands on ${a - b}. That’s ${pl(backMoves.length, "jump")}.`
          : `The standard algorithm, one column at a time, gives ${a - b}.`;
    q("r").innerHTML =
      work +
      (strategy === best
        ? `<br><span class="ok">A good pick for ${a} − ${b}: ${why}</span>`
        : `<br><span class="dimline">It works, but try ${STRATEGIES.find(([id]) => id === best)[1].toLowerCase()} for these numbers.</span>`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (!row) return;
    if (row === "top") problemIndex = +id;
    else strategy = id;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Check with addition",
    widget: wCheck,
    body: "<p>Subtraction and addition undo each other. 452 − 268 = 184, so 184 + 268 gives back 452. Adding is a quick way to check a difference, and to spot a mistake, like taking the smaller digit from the bigger one in each place.</p><p>Pick a student. Check the work by adding.</p>",
    check: {
      kind: "num",
      q: "Lin says 623 − 147 is 524. Add to check Lin’s answer. Then find 623 − 147.",
      answer: 476,
      misc: [
        [524, "That’s Lin’s answer. 524 + 147 = 671, not 623, so it’s wrong. Regroup when the top digit is smaller."],
        [770, "You added. Find 623 − 147."],
      ],
      explain:
        "524 + 147 = 671, not 623, so Lin is wrong. Regroup: 623 is 5 hundreds, 11 tens, 13 ones. 623 − 147 = 476, and 476 + 147 = 623.",
    },
  },
  {
    title: "Pick a strategy",
    widget: wStrategy,
    body: "<p>Look at the numbers before you subtract. When they’re close together, <b>count up</b>. When the number taken away is a friendly hundred, <b>jump back</b>. When neither is true, the <b>standard algorithm</b> always works.</p><p>Pick a problem and try each strategy.</p>",
    check: {
      kind: "mc",
      q: "Which is the quickest way to find 802 − 797?",
      choices: [
        { id: "a", label: "Jump back 797 by place" },
        { id: "b", label: "Count up from 797" },
        { id: "c", label: "The standard algorithm" },
      ],
      answer: "b",
      why: {
        a: "That’s three big jumps back to find a small difference.",
        c: "It works, but it means regrouping across a zero. The numbers are only 5 apart.",
      },
      explain: "797 to 800 is 3, and 800 to 802 is 2. 3 + 2 = 5, so 802 − 797 = 5.",
    },
  },
];
