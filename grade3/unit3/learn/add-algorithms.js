/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 3: Addition algorithms. Its widgets and
   steps; loaded by add-algorithms.html. */
/* Add by place in expanded form: hundreds, tens, ones, then the parts. */
const wExpandedAdd = expandedWidget(
  [
    [245, 132],
    [358, 167],
    [476, 238],
  ],
  "+",
);
/* The standard algorithm, one column at a time. */
const wAlgAdd = algWidget(
  [
    [358, 167],
    [245, 132],
    [476, 238],
  ],
  "+",
);
/* the quick checks' figures */
const F = {
  parts256: expandedFig(256, 378, "+", { shown: 3 }),
};
const STEPS = [
  {
    title: "Add by place",
    widget: wExpandedAdd,
    body: "<p>Write both numbers in <b>expanded form</b>, with the hundreds, tens, and ones lined up. Add each place: hundreds with hundreds, tens with tens, ones with ones. Then add the parts. A place can add up to more than 9: 50 + 60 is 110.</p><p>Pick a problem and work it one step at a time.</p>",
    check: {
      kind: "num",
      q: "Each place of 256 + 378 is added. What is 256 + 378?",
      fig: F.parts256,
      answer: 634,
      misc: [
        [524, "50 + 70 is 120, not 20, and 6 + 8 is 14. Add all of each part: 500 + 120 + 14."],
        [624, "6 + 8 is 14, not 4. Add all of the ones part: 620 + 14."],
      ],
      explain: "500 + 120 + 14: 500 + 120 = 620, and 620 + 14 = 634.",
    },
  },
  {
    title: "The standard algorithm",
    widget: wAlgAdd,
    body: "<p>The <b>standard algorithm</b> adds one place at a time too, but it starts with the ones. When a place adds up to 10 or more, 10 of them make 1 of the next place: write the 1 above the next column, and add it in there.</p><p>Pick a problem. Work it one column at a time.</p>",
    check: {
      kind: "num",
      q: "The ferry carried 186 people in the morning and 247 people in the afternoon. How many people did it carry in all?",
      answer: 433,
      unit: "people",
      misc: [
        [323, "6 + 7 = 13 makes a new ten, and the tens make a new hundred. Write each 1 above the next column."],
        [61, "You subtracted. Both trips together means add."],
      ],
      explain:
        "Ones: 6 + 7 = 13: write 3, and put 1 above the tens. Tens: 1 + 8 + 4 = 13: write 3, and put 1 above the hundreds. Hundreds: 1 + 1 + 2 = 4. That’s 433 people.",
    },
  },
];
