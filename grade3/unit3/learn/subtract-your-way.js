/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 4: Subtract your way. Its widgets and
   steps; loaded by subtract-your-way.html. */
/* Take away on an open number line: jump back the hundreds, then the tens, then the ones. */
const wJumpBack = jumpWidget(
  [
    { label: "534 − 212", start: 534, moves: [-200, -10, -2] },
    { label: "645 − 328", start: 645, moves: [-300, -20, -8] },
    { label: "720 − 255", start: 720, moves: [-200, -50, -5] },
  ],
  "land",
);
/* Count up from the smaller number to the bigger one: the jumps add up to the difference. */
const wCountUp = jumpWidget(
  [
    { label: "512 − 398", start: 398, moves: [2, 100, 12] },
    { label: "703 − 597", start: 597, moves: [3, 100, 3] },
    { label: "625 − 280", start: 280, moves: [20, 300, 25] },
  ],
  "total",
);
/* the quick checks' figures */
const F = {
  back763: jumps(763, [-300, -40, -5], 3, true),
  up296: jumps(296, [4, 300, 25]),
};
const STEPS = [
  {
    title: "Jump back",
    widget: wJumpBack,
    body: "<p>One way to subtract is to <b>take away</b>. Start at the bigger number and jump back the smaller one in parts: the hundreds, then the tens, then the ones. Where you land is the difference.</p><p>Pick a problem and make the jumps.</p>",
    check: {
      kind: "num",
      q: "Han found 763 − 345 with these jumps. Where does Han land?",
      fig: F.back763,
      answer: 418,
      misc: [
        [423, "That’s after jumping back 300 and 40. Jump back 5 more."],
        [428, "The jumps go back: 423 − 5, not 423 + 5."],
      ],
      explain: "763 − 300 = 463, then 463 − 40 = 423, then 423 − 5 = 418. So 763 − 345 = 418.",
    },
  },
  {
    title: "Count up",
    widget: wCountUp,
    body: "<p>Another way is to <b>count up</b> from the smaller number to the bigger one. 512 − 398 asks how far it is from 398 to 512: jump 2 to 400, then 100 to 500, then 12 to 512. The jumps add up to the difference: 2 + 100 + 12 = 114. Counting up is quick when the numbers are close to a hundred.</p><p>Pick a problem and make the jumps.</p>",
    check: {
      kind: "num",
      q: "How far is it from 296 to 625? Add the jumps to find 625 − 296.",
      fig: F.up296,
      answer: 329,
      misc: [
        [325, "Add every jump, the first one of 4 too."],
        [625, "That’s where the jumps land. Add the jumps to find how far."],
      ],
      explain: "The jumps are 4 + 300 + 25 = 329. So 625 − 296 = 329.",
    },
  },
];
