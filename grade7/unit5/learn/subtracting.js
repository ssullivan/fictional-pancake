/* Learn Rational Number Arithmetic (Grade 7 Unit 5), chapter 2: Subtracting signed numbers. Its widgets and steps; loaded
   by subtracting.html. */
/* subtractions to look at: [a, b] for a − b */
const DIFFS = [
  [5, 2],
  [2, 5],
  [3, -4],
  [-6, -2],
];
/* Pick a subtraction: a − b asks what to add to b to get to a, a jump from b to a. */
function wWhat(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "Subtraction",
      DIFFS.map(([a, b], i) => [i, `${fmt(a)} − ${par(b)}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [a, b] = DIFFS[index],
      answer = a - b;
    press(el, index);
    q("f").innerHTML = signedLine(-8, 8, {
      moves: [{ a: b, b: a, t: withSign(answer), cls: "b" }],
      pts: [
        { v: b, t: fmt(b), cls: "b" },
        { v: a, t: fmt(a) },
      ],
    });
    q("r").innerHTML =
      `${fmt(a)} − ${par(b)} asks: ${fmt(b)} + ? = ${fmt(a)}. From ${fmt(b)} to ${fmt(a)} is ${Math.abs(answer)} to the ${answer > 0 ? "right" : "left"}, ` +
      `so ${fmt(a)} − ${par(b)} = <b>${fmt(answer)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Change a and b: a − b is always a + the opposite of b. */
function wOpposite(el) {
  const q = Q(el),
    values = { a: 4, b: -6 };
  el.innerHTML = `<div class="wrow">${stepper("a", "First")}${stepper("b", "Subtract")}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values;
    q("a").textContent = fmt(a);
    q("b").textContent = fmt(b);
    q("e").textContent = `${fmt(a)} − ${par(b)} = ${fmt(a)} + ${par(-b)} = ${fmt(a - b)}`;
    q("r").innerHTML =
      b < 0
        ? `Subtracting a negative is adding a positive: taking away ${par(b)} moves <b>right</b>.`
        : b > 0
          ? `Subtracting ${fmt(b)} is adding ${par(-b)}: it moves <b>left</b>.`
          : "Subtracting 0 changes nothing.";
  };
  steppers(el, values, { a: [-9, 9], b: [-9, 9] }, draw);
  draw();
}

const STEPS = [
  {
    title: "What do you add?",
    widget: wWhat,
    body: "<p>A subtraction like 5 − 2 asks: what do you add to 2 to get 5? On the number line, it’s the jump from the number being subtracted to the first number. A jump to the right is positive, and to the left is negative.</p><p>Pick a subtraction.</p>",
    check: {
      kind: "num",
      q: "What is 2 − (−5)?",
      answer: 7,
      neg: true,
      misc: [
        [-3, "That adds −5. Subtracting −5 asks what you add to −5 to get 2: that’s 7."],
        [3, "From −5 to 2 is 5 to get to 0 and 2 more."],
        [-7, "Check the direction: from −5 to 2 is to the right."],
      ],
      explain: "−5 + 7 = 2, so 2 − (−5) = 7.",
    },
  },
  {
    title: "Adding the opposite",
    widget: wOpposite,
    body: "<p>Every subtraction can be written as an addition: subtracting a number is the same as adding its <b>opposite</b>. So 4 − (−6) = 4 + 6 = 10.</p><p>Change the numbers.</p>",
    check: {
      kind: "mc",
      q: "Which sum has the same value as −3 − 8?",
      choices: [
        { id: "a", label: "−3 + 8" },
        { id: "b", label: "−3 + (−8)" },
        { id: "c", label: "3 + (−8)" },
      ],
      answer: "b",
      why: {
        a: "That keeps 8 as it was. Subtracting 8 adds its opposite, −8.",
        c: "Only the number being subtracted changes to its opposite. −3 stays the same.",
      },
      explain: "Subtracting 8 is adding −8: −3 − 8 = −3 + (−8) = −11.",
    },
  },
];
