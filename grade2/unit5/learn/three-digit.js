/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 2: Three-digit numbers. Its widgets and steps; loaded by three-digit.html. */
/* Build a number from hundreds, tens, and ones (a stepper for each), and see its name. */
function wBuild(el) {
  /* the steppers' values: h hundreds, t tens, o ones */
  const q = Q(el),
    values = { h: 2, t: 3, o: 5 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("h", "Hundreds")}${stepper("t", "Tens")}${stepper("o", "Ones")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const { h: hundreds, t: tens, o: ones } = values,
      n = hundreds * 100 + tens * 10 + ones;
    ["h", "t", "o"].forEach((key) => {
      q(key).textContent = values[key];
    });
    q("f").innerHTML = numBlocks(n);
    q("r").innerHTML =
      `${hundreds} hundred${hundreds === 1 ? "" : "s"}, ${tens} ten${tens === 1 ? "" : "s"}, ${ones} one${ones === 1 ? "" : "s"}<br><span class="ok"><b>${n}</b>: ${numWords(n)}</span>` +
      (hundreds && (!tens || !ones)
        ? `<br><span class="dimline">${!tens && !ones ? "No tens and no ones: write 0 in both places." : !tens ? "No tens: write 0 in the tens place." : "No ones: write 0 in the ones place."}</span>`
        : "");
  };
  steppers(el, values, { h: [1, 9], t: [0, 9], o: [0, 9] }, draw);
  draw();
}
const NAMES = [406, 460, 517, 830];
/* A number's name, place-value chart, and blocks. */
function wNames(el) {
  const q = Q(el);
  let numberIndex = 0;
  el.innerHTML =
    seg(
      "Number",
      NAMES.map((n, i) => [i, n]),
    ) + `<p class="eq" data-w></p><div data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = NAMES[numberIndex],
      [hundreds, tens, ones] = digits(n);
    press(el, numberIndex);
    q("w").textContent = numWords(n);
    q("c").innerHTML = pvChart([["", n]]);
    q("f").innerHTML = numBlocks(n);
    q("r").innerHTML =
      `<b>${numWords(n)}</b> is ${hundreds} hundreds, ${tens} tens, and ${ones} ones: <b>${n}</b>.` +
      (!tens || !ones
        ? `<br><span class="dimline">There are no ${!tens ? "tens" : "ones"}, so that place gets a 0.</span>`
        : "");
  };
  el.addEventListener("click", (e) => {
    const numberBtn = e.target.closest("[data-m]");
    if (numberBtn) {
      numberIndex = +numberBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* the quick checks' figures */
const F = {
  n205: htoFig(2, 0, 5, { cls: { t: "b", o: "c" } }, "2 hundreds and 5 ones"),
};
const STEPS = [
  {
    title: "Hundreds, tens, and ones",
    widget: wBuild,
    body: "<p>A three-digit number tells how many <b>hundreds</b>, <b>tens</b>, and <b>ones</b>. In 235, the 2 means 2 hundreds.</p><p>Change the blocks and watch the number.</p>",
    check: {
      kind: "num",
      answer: 205,
      fig: F.n205,
      q: "What number do the blocks show?",
      misc: [
        [25, "The big squares are hundreds. 2 hundreds is 200."],
        [250, "There are no tens, so the tens place is 0."],
        [7, "Each big square is 100, and each small square is 1."],
      ],
      explain: "2 hundreds, 0 tens, and 5 ones is 205.",
    },
  },
  {
    title: "Number names",
    widget: wNames,
    body: "<p>We say a number the way we write it: hundreds first, then the rest. <b>517</b> is “five hundred seventeen”.</p><p>Pick a number to see its name and its places.</p>",
    check: {
      kind: "mc",
      q: "Which number is four hundred six?",
      choices: [
        { id: "a", label: "460" },
        { id: "b", label: "406" },
        { id: "c", label: "4,006" },
      ],
      answer: "b",
      why: {
        a: "460 is four hundred sixty. Six is ones, not tens.",
        c: "Four hundred is 400. It only needs three digits: 4 hundreds, 0 tens, 6 ones.",
      },
      explain: "Four hundred six is 4 hundreds, 0 tens, and 6 ones: 406.",
    },
  },
];
