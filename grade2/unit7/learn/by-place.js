/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 2: Add and subtract by place. Its widgets and steps; loaded by by-place.html. */
/* Add by place with blocks (no new tens or hundreds). */
const wByPlaceAdd = addW([
  [342, 235],
  [416, 253],
  [530, 264],
]);
/* Subtract by place with blocks (nothing to break). */
const wByPlaceSub = subW([
  [578, 235],
  [694, 352],
  [865, 431],
]);
/* 785 − 342 three ways: by place, counting back, and counting on. */
const wSubWays = waysW("785 − 342", 443, [
  {
    label: "By place",
    fig: byPlace(["700 − 300 = <b>400</b>", "80 − 40 = <b>40</b>", "5 − 2 = <b>3</b>", "400 + 40 + 3 = <b>443</b>"]),
    say: "Take away the hundreds, the tens, and the ones. Then put the parts back together.",
  },
  {
    label: "Count back",
    fig: jumps(785, [-300, -40, -2]),
    say: "Start at 785. Jump back 3 hundreds, then 4 tens, then 2 ones. You land on 443.",
  },
  {
    label: "Count on",
    fig: jumps(342, [400, 40, 3]),
    say: "Start at 342 and count on to 785. The jumps are 400, 40, and 3: 400 + 40 + 3 = 443.",
  },
]);
/* the quick checks' figures */
const F = {
  books: apart(526, 243),
  seats: mat([bl(687)], "687 in base-ten blocks"),
};
const STEPS = [
  {
    title: "Hundreds with hundreds",
    widget: wByPlaceAdd,
    body: "<p>To add, put <b>hundreds with hundreds</b>, <b>tens with tens</b>, and <b>ones with ones</b>.</p><p>Pick a problem, then put the blocks together.</p>",
    check: {
      kind: "num",
      unit: "books",
      answer: 769,
      fig: F.books,
      q: "A library has 526 picture books and 243 chapter books. How many books is that?",
      misc: [
        [283, "You subtracted. Put the two kinds of books together, so add."],
        [7609, "7 hundreds, 6 tens, and 9 ones only needs three digits: one for each place."],
        [569, "Add the hundreds too: 5 hundreds + 2 hundreds = 7 hundreds."],
      ],
      explain: "Hundreds: 500 + 200 = 700. Tens: 20 + 40 = 60. Ones: 6 + 3 = 9. 526 + 243 = 769 books.",
    },
  },
  {
    title: "Take away by place",
    widget: wByPlaceSub,
    body: "<p>To subtract, take away the <b>ones</b>, the <b>tens</b>, and the <b>hundreds</b>.</p><p>Pick a problem, then take away each place.</p>",
    check: {
      kind: "num",
      unit: "seats",
      answer: 235,
      fig: F.seats,
      q: "A theater has 687 seats. People sit in 452 of them. How many seats are empty?",
      misc: [
        [1139, "You added. Some seats are full, so the empty ones are fewer than 687. Subtract."],
        [635, "You took away the tens and ones. Take away the 4 hundreds too."],
        [287, "You took away the 4 hundreds. Take away the 5 tens and 2 ones too."],
      ],
      explain: "Ones: 7 − 2 = 5. Tens: 8 − 5 = 3. Hundreds: 6 − 4 = 2. 687 − 452 = 235 empty seats.",
    },
  },
  {
    title: "Different ways",
    widget: wSubWays,
    body: "<p>There’s more than one way to subtract. You can take away by place, count back, or count on.</p><p>Tap each way for 785 − 342.</p>",
    check: {
      kind: "mc",
      stack: true,
      q: "Which one is a right way to find <b>563 − 241</b>?",
      choices: [
        { id: "a", label: "563 − 200 = 363, then 363 − 40 = 323, then 323 − 1 = 322" },
        { id: "b", label: "5 − 2 = 3, 6 − 4 = 2, 3 − 1 = 2, so it’s 3 + 2 + 2 = 7" },
        { id: "c", label: "563 − 200 = 363, then 363 − 4 = 359, then 359 − 1 = 358" },
      ],
      answer: "a",
      why: {
        b: "Each digit keeps its place. 3 hundreds, 2 tens, and 2 ones is 322, not 7.",
        c: "The 4 in 241 is 4 tens, so take away 40, not 4.",
      },
      explain: "Take away 2 hundreds, then 4 tens, then 1 one: 563 − 241 = 322.",
    },
  },
];
