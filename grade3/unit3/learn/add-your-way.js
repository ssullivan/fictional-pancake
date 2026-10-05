/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 2: Add your way. Its widgets and steps;
   loaded by add-your-way.html. */
/* Add on an open number line: jump the hundreds, then the tens, then the ones. */
const wJumpAdd = jumpWidget(
  [
    { label: "245 + 132", start: 245, moves: [100, 30, 2] },
    { label: "358 + 167", start: 358, moves: [100, 60, 7] },
    { label: "476 + 238", start: 476, moves: [200, 30, 8] },
  ],
  "land",
);
/* sums to make friendly: [a, b], where a is a little less than a hundred */
const FRIENDLY = [
  [398, 245],
  [197, 366],
  [499, 128],
];
/* Move a little from one addend to the other: the sum stays the same, and a friendly hundred is easy to add to. */
function wFriendly(el) {
  /* values.shift: how much has moved from b to a (not m, which the problem buttons use: data-m) */
  const q = Q(el),
    values = { shift: 0 };
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      FRIENDLY.map(([a, b], i) => [i, `${a} + ${b}`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow">${stepper("shift", "Move to the first number")}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b] = FRIENDLY[problemIndex],
      moved = values.shift,
      sum = a + b,
      friendly = (a + moved) % 100 === 0;
    press(el, problemIndex);
    q("shift").textContent = moved;
    q("f").innerHTML = jumps(a, moved ? [moved, b - moved] : [b]);
    q("e").innerHTML = `${a + moved} + ${b - moved} = ${sum}`;
    q("r").innerHTML =
      (moved
        ? `${a} gets ${moved} more and ${b} gets ${moved} less, so the sum doesn’t change.`
        : `Move a little from ${b} to ${a}. The sum stays ${sum}.`) +
      (friendly
        ? `<br><span class="ok">${a + moved} is a friendly number! ${a + moved} + ${b - moved} is easy: <b>${sum}</b>.</span>`
        : "");
  };
  steppers(el, values, { shift: [0, 5] }, draw);
  onPick(el, (id) => {
    problemIndex = +id;
    values.shift = 0;
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  jumps268: jumps(268, [100, 30, 4], 3, true),
};
const STEPS = [
  {
    title: "Jump on a number line",
    widget: wJumpAdd,
    body: "<p>To add on an <b>open number line</b>, start at one number and jump the other one in parts: the hundreds, then the tens, then the ones. The jumps don’t have to be drawn to scale.</p><p>Pick a problem and make the jumps.</p>",
    check: {
      kind: "num",
      q: "Elena found 268 + 134 with these jumps. Where does Elena land?",
      fig: F.jumps268,
      answer: 402,
      misc: [
        [398, "That’s after the jumps of 100 and 30. Jump 4 more."],
        [392, "398 + 4 goes past 400: 399, 400, 401, 402."],
      ],
      explain: "268 + 100 = 368, then 368 + 30 = 398, then 398 + 4 = 402. So 268 + 134 = 402.",
    },
  },
  {
    title: "Make a friendly number",
    widget: wFriendly,
    body: "<p>398 is just 2 less than 400. Move 2 from 245 to 398: 398 + 245 is the same as 400 + 243, and that’s easy to add. The sum doesn’t change, because what one number gets, the other gives.</p><p>Pick a problem and move a little to the first number.</p>",
    check: {
      kind: "mc",
      q: "Which has the same sum as 299 + 436?",
      choices: [
        { id: "a", label: "300 + 436" },
        { id: "b", label: "300 + 437" },
        { id: "c", label: "300 + 435" },
      ],
      answer: "c",
      why: {
        a: "299 got 1 more, but 436 didn’t give 1 away. That sum is 1 too big.",
        b: "Both numbers got 1 more. That sum is 2 too big.",
      },
      explain: "Move 1 from 436 to 299: 300 + 435 = 735, the same as 299 + 436.",
    },
  },
];
