/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 5: Subtraction algorithms. Its widgets and
   steps; loaded by subtract-algorithms.html. */
/* Subtract by place in expanded form, regrouping first when a place is too small. */
const wExpandedSub = expandedWidget(
  [
    [462, 237],
    [528, 163],
    [503, 278],
  ],
  "−",
);
/* The standard algorithm, one column at a time. */
const wAlgSub = algWidget(
  [
    [462, 237],
    [523, 167],
    [503, 278],
  ],
  "−",
);
const STEPS = [
  {
    title: "Regroup, then subtract by place",
    widget: wExpandedSub,
    body: "<p>Write the numbers in expanded form. Before you subtract, check each place: is there enough to take away? In 462 − 237, 2 ones can’t give 7. So <b>regroup</b>: take 1 ten from 60, and it becomes 10 more ones. 462 is also 400 + 50 + 12. Now every place can take away.</p><p>Pick a problem and work it one step at a time.</p>",
    check: {
      kind: "mc",
      q: "To find 352 − 128 by place, how can you write 352 so you can take away each place of 128?",
      choices: [
        { id: "a", label: "300 + 50 + 2" },
        { id: "b", label: "200 + 150 + 2" },
        { id: "c", label: "300 + 40 + 12" },
      ],
      answer: "c",
      why: {
        a: "That’s 352, but 2 ones can’t give 8 ones. Regroup a ten first.",
        b: "That’s 352 too, but the ones still can’t give 8. Regroup a ten as 10 ones.",
      },
      explain:
        "Take 1 ten from 50: 50 becomes 40, and 2 becomes 12. 300 + 40 + 12 is still 352, and now 352 − 128 = 224.",
    },
  },
  {
    title: "The standard algorithm",
    widget: wAlgSub,
    body: "<p>The <b>standard algorithm</b> subtracts one place at a time, starting with the ones. When the top digit is too small, regroup 1 from the place to its left: cross it out, write 1 less above it, and the digit you’re working on gets 10 more. With no tens to take, regroup a hundred first.</p><p>Pick a problem. Work it one column at a time.</p>",
    check: {
      kind: "num",
      q: "The trail around the cove is 604 meters long. Jada has walked 258 meters. How many meters are left to walk?",
      answer: 346,
      unit: "meters",
      misc: [
        [454, "In each place you took the smaller digit from the bigger one. Regroup when the top digit is smaller."],
        [446, "604 has no tens, so 1 hundred was regrouped: 6 hundreds became 5."],
      ],
      explain:
        "604 has no tens, so regroup 1 hundred: 5 hundreds, 10 tens. Then regroup 1 ten: 9 tens, 14 ones. Ones: 14 − 8 = 6. Tens: 9 − 5 = 4. Hundreds: 5 − 2 = 3. That’s 346 meters.",
    },
  },
];
