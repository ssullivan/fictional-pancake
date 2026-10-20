/* Learn Putting It All Together (Grade 2 Unit 9), chapter 4: Add and subtract within 1,000. Its widgets and steps; loaded by add-subtract.html. */
/* Widget: pick a problem, then make its jumps on an open number line one at a time. PROBLEMS: [{label, start, moves, say}],
   where say is how the jumps work, shown once they're all made. */
const jumpW = (PROBLEMS) => (el) => {
  /* jumpsMade: how many of the problem's jumps are drawn */
  const q = Q(el);
  let problemIndex = 0,
    jumpsMade = 0;
  el.innerHTML =
    seg(
      "Problem",
      PROBLEMS.map((problem, i) => [i, problem.label]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const problem = PROBLEMS[problemIndex],
      done = jumpsMade === problem.moves.length,
      at = problem.moves.slice(0, jumpsMade).reduce((sum, move) => sum + move, problem.start);
    press(el, problemIndex);
    q("f").innerHTML = jumps(problem.start, problem.moves, jumpsMade);
    q("go").textContent = done ? "Start over" : "Next jump";
    q("r").innerHTML = done
      ? `<span class="ok">${problem.say}</span>`
      : jumpsMade
        ? `You’re at <b>${at}</b>. <span class="dimline">Keep jumping.</span>`
        : `<b>${problem.label} = ?</b><br><span class="dimline">Start at ${problem.start}.</span>`;
  };
  onPick(el, (m) => {
    problemIndex = +m;
    jumpsMade = 0;
    draw();
  });
  q("go").onclick = () => {
    jumpsMade = jumpsMade === PROBLEMS[problemIndex].moves.length ? 0 : jumpsMade + 1;
    draw();
  };
  draw();
};
/* sums, each done the easy way for its numbers */
const wAdd = jumpW([
  {
    label: "398 + 245",
    start: 245,
    moves: [400, -2],
    say: "398 is 2 less than 400. 245 + 400 = 645, and 645 − 2 = 643. So <b>398 + 245 = 643</b>.",
  },
  {
    label: "256 + 137",
    start: 256,
    moves: [100, 30, 7],
    say: "Add the hundreds, then the tens, then the ones: 356, 386, 393. So <b>256 + 137 = 393</b>.",
  },
  {
    label: "47 + 38",
    start: 47,
    moves: [3, 30, 5],
    say: "Jump 3 to get to 50, then 30 to 80, then 5 more: 3 + 30 + 5 = 38. So <b>47 + 38 = 85</b>.",
  },
]);
/* differences, each done the easy way for its numbers */
const wSub = jumpW([
  {
    label: "503 − 496",
    start: 496,
    moves: [4, 3],
    say: "The numbers are close, so count on from 496: 4 to 500, then 3 to 503. 4 + 3 = 7, so <b>503 − 496 = 7</b>.",
  },
  {
    label: "645 − 218",
    start: 645,
    moves: [-200, -10, -5, -3],
    say: "Take away 200, then 10. Then 5 to get to 430, and 3 more: 427. So <b>645 − 218 = 427</b>.",
  },
  {
    label: "82 − 47",
    start: 82,
    moves: [-40, -2, -5],
    say: "Take away 40: 42. Take away 2 to get to 40, then 5 more: 35. So <b>82 − 47 = 35</b>.",
  },
]);
/* the quick checks' figures */
const F = {
  add299: jumps(436, [300, -1], 2, true),
  close: numLine(590, 610, {
    u: 24,
    ls: "",
    end: true,
    pts: [
      { v: 597, t: 597 },
      { v: 602, cls: "b", t: 602 },
    ],
    label: "A number line with dots at 597 and 602",
  }),
};
const STEPS = [
  {
    title: "Pick a way to add",
    widget: wAdd,
    body: "<p>Look at the numbers before you add. A number close to a hundred, like 398, is easy: add 400, then take away 2. Other times, add by place: hundreds, tens, then ones.</p><p>Pick a problem and make its jumps.</p>",
    check: {
      kind: "num",
      answer: 735,
      fig: F.add299,
      q: "What is <b>299 + 436</b>? 299 is 1 less than 300.",
      misc: [
        [736, "Adding 300 is 1 too many, so take 1 away, don’t add it."],
        [635, "299 is close to 300, not 200. Add 300, then take away 1."],
      ],
      explain: "436 + 300 = 736. 299 is 1 less than 300, so take away 1: 735.",
    },
  },
  {
    title: "Pick a way to subtract",
    widget: wSub,
    body: "<p>When two numbers are close, <b>count on</b> from the smaller one. Otherwise, take away by place, and jump to a ten when there aren’t enough ones.</p><p>Pick a problem and make its jumps.</p>",
    check: {
      kind: "num",
      answer: 5,
      fig: F.close,
      q: "What is <b>602 − 597</b>?",
      misc: [
        [1199, "You added. The difference is how far apart the numbers are."],
        [3, "597 to 600 is 3. Keep going to 602."],
        [2, "600 to 602 is 2. Don’t forget 597 to 600."],
      ],
      explain: "Count on from 597: 3 to get to 600, then 2 more to 602. 3 + 2 = 5.",
    },
  },
];
