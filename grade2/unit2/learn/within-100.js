/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2), chapter 4: Add and subtract within 100. Its widgets and steps; loaded by within-100.html. */
/* [a, b, op]: two that make or break a ten and two that don't */
const MIXED = [
  [36, 27, "+"],
  [36, 23, "+"],
  [64, 28, "−"],
  [64, 23, "−"],
];
/* Add or subtract with blocks: does adding make a new ten, or does subtracting need to break one? */
function wNewOrBreak(el) {
  const q = Q(el);
  let problemIndex = 0,
    shown = false;
  el.innerHTML =
    seg(
      "Problem",
      MIXED.map(([a, b, op], i) => [i, `${a} ${op} ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, op] = MIXED[problemIndex],
      adding = op === "+",
      onesA = a % 10,
      onesB = b % 10;
    press(el, problemIndex);
    if (adding) {
      q("f").innerHTML = addBlocks(a, b, shown);
      q("r").innerHTML = !shown
        ? `<b>${a} + ${b}</b><br><span class="dimline">Will the ones make a new ten?</span>`
        : onesA + onesB >= 10
          ? `Ones: ${onesA} + ${onesB} = ${onesA + onesB}. That’s <b>a new ten</b> and ${onesA + onesB - 10} ones.<br><span class="ok"><b>${a} + ${b} = ${a + b}</b></span>`
          : `Ones: ${onesA} + ${onesB} = ${onesA + onesB}. No new ten this time.<br><span class="ok"><b>${a} + ${b} = ${a + b}</b></span>`;
    } else {
      /* a ten is broken when there aren't enough ones */
      const brokeTen = shown && onesA < onesB,
        tensNow = tensOf(a) - (brokeTen ? 1 : 0),
        onesNow = onesA + (brokeTen ? 10 : 0);
      q("f").innerHTML = bpic(
        [{ t: tensNow, u: onesNow, opt: shown ? { traded: brokeTen ? 10 : 0, outT: tensOf(b), outO: onesB } : {} }],
        shown ? `${a} with ${b} crossed out` : `${a} in blocks`,
      );
      q("r").innerHTML = !shown
        ? `<b>${a} − ${b}</b><br><span class="dimline">Are there enough ones to take away ${onesB}?</span>`
        : onesA < onesB
          ? `Only ${onesA} ones, so <b>break a ten</b>: now there are ${onesNow} ones. Take away ${onesB}.<br><span class="ok"><b>${a} − ${b} = ${a - b}</b></span>`
          : `${onesA} ones is enough to take away ${onesB}. No ten to break.<br><span class="ok"><b>${a} − ${b} = ${a - b}</b></span>`;
    }
    q("go").textContent = shown ? "Start over" : adding ? "Put them together" : "Take it away";
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      shown = false;
      draw();
    }
  });
  q("go").onclick = () => {
    shown = !shown;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  mai: addBlocks(45, 38, false),
  b57: bpic([57], "57 in blocks: 5 tens and 7 ones"),
};
const STEPS = [
  {
    title: "Make a new ten",
    widget: tensOnesAdd([
      [45, 38],
      [27, 36],
      [34, 25],
    ]),
    body: "<p>When you add, put tens with tens and ones with ones. If there are 10 or more ones, they make a <b>new ten</b>.</p><p>Pick a problem, then put the blocks together.</p>",
    check: {
      kind: "num",
      unit: "stickers",
      answer: 83,
      fig: F.mai,
      q: "Mai has 45 stickers. Mai gets 38 more stickers. How many stickers does Mai have now?",
      misc: [
        [73, "You didn’t count the new ten. 5 + 8 = 13 ones is 1 ten and 3 ones."],
        [7, "You subtracted. Mai gets more, so add."],
        [713, "5 + 8 = 13 is 1 ten and 3 ones. Put the new ten with the other tens."],
      ],
      explain: "Tens: 40 + 30 = 70. Ones: 5 + 8 = 13, a new ten and 3 ones. 70 + 13 = 83 stickers.",
    },
  },
  {
    title: "New ten or break a ten?",
    widget: wNewOrBreak,
    body: "<p>Adding can make a <b>new ten</b>. Subtracting can need you to <b>break a ten</b>. Look at the ones to know.</p><p>Pick a problem, then show it with blocks.</p>",
    check: {
      kind: "mc",
      q: "Which one needs you to <b>break a ten</b>?",
      fig: F.b57,
      choices: [
        { id: "a", label: "57 − 24" },
        { id: "b", label: "57 − 29" },
        { id: "c", label: "57 + 29" },
      ],
      answer: "b",
      why: {
        a: "57 has 7 ones. That’s enough to take away 4 ones.",
        c: "That’s adding. 7 + 9 = 16 ones makes a new ten, but nothing breaks.",
      },
      explain: "57 has 7 ones, but 29 has 9 ones. Break a ten to get 17 ones: 57 − 29 = 28.",
    },
  },
];
