/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 1: Make a hundred. Its widgets and steps; loaded by hundred.html. */
/* Add tens (a stepper) until 10 of them make a hundred. */
function wTenTens(el) {
  const q = Q(el),
    values = { t: 4 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("t", "Tens")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const tens = values.t;
    q("t").textContent = tens;
    q("f").innerHTML =
      tens === 10
        ? htoFig(1, 0, 0, { cls: { h: "new" } }, "10 tens make 1 hundred")
        : htoFig(0, tens, 0, {}, `${tens} tens`);
    q("r").innerHTML =
      tens === 10
        ? `<span class="ok"><b>10 tens make 1 hundred!</b> 10, 20, 30, … 100.</span><br><span class="dimline">A hundred is 10 tens put together.</span>`
        : `<b>${tens} ${tens === 1 ? "ten" : "tens"}</b> is <b>${tens * 10}</b>.<br><span class="dimline">${10 - tens} more ${10 - tens === 1 ? "ten" : "tens"} to make a hundred.</span>`;
  };
  steppers(el, values, { t: [0, 10] }, draw);
  draw();
}
const TENSETS = [12, 20, 27, 35, 40];
/* Pick a number of tens; a button makes hundreds from every 10 of them. */
function wMakeHundreds(el) {
  const q = Q(el);
  let setIndex = 0,
    made = false;
  el.innerHTML =
    seg(
      "Tens",
      TENSETS.map((tens, i) => [i, `${tens} tens`]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* extra: the tens left after making hundreds */
    const tens = TENSETS[setIndex],
      hundreds = Math.floor(tens / 10),
      extra = tens % 10;
    press(el, setIndex);
    q("f").innerHTML = made
      ? htoFig(hundreds, extra, 0, { cls: { h: "new" } }, `${hundreds} hundreds and ${extra} tens`)
      : htoFig(0, tens, 0, {}, `${tens} tens`);
    q("go").textContent = made ? "Break them apart" : "Make hundreds";
    q("r").innerHTML = made
      ? `${tens} tens is <b>${hundreds} ${hundreds === 1 ? "hundred" : "hundreds"}</b>${extra ? ` and <b>${extra} ${extra === 1 ? "ten" : "tens"}</b>` : ""}.<br><span class="ok"><b>${tens} tens = ${tens * 10}</b></span>`
      : `<b>${tens} tens</b>. Every 10 tens make a hundred.<br><span class="dimline">How many hundreds can you make?</span>`;
  };
  el.addEventListener("click", (e) => {
    const setBtn = e.target.closest("[data-m]");
    if (setBtn) {
      setIndex = +setBtn.dataset.m;
      made = false;
      draw();
    }
  });
  q("go").onclick = () => {
    made = !made;
    draw();
  };
  draw();
}
/* the quick checks' figures */
const F = {
  seven: htoFig(0, 7, 0, {}, "7 tens"),
  forty: htoFig(0, 40, 0, {}, "40 tens"),
};
const STEPS = [
  {
    title: "10 tens make a hundred",
    widget: wTenTens,
    body: "<p>A <b>ten</b> is 10 ones in a stick. Put <b>10 tens</b> together and you get a <b>hundred</b>.</p><p>Tap <b>+</b> to add tens until you have a hundred.</p>",
    check: {
      kind: "num",
      unit: "tens",
      answer: 3,
      fig: F.seven,
      q: "Here are 7 tens. How many more tens do you need to make a hundred?",
      misc: [
        [7, "That’s how many tens there are now. How many more to get to 10 tens?"],
        [30, "That’s 30 ones. How many tens is that?"],
        [10, "10 tens is the whole hundred. You already have 7."],
      ],
      explain: "7 tens and 3 more tens make 10 tens. 10 tens is a hundred.",
    },
  },
  {
    title: "Make hundreds",
    widget: wMakeHundreds,
    body: "<p>Every 10 tens make a hundred. 20 tens make 2 hundreds. 30 tens make 3 hundreds.</p><p>Pick some tens. Make as many hundreds as you can.</p>",
    check: {
      kind: "num",
      unit: "hundreds",
      answer: 4,
      fig: F.forty,
      q: "How many hundreds can you make with 40 tens?",
      misc: [
        [40, "That’s the number of tens. Every 10 tens make 1 hundred."],
        [400, "400 is the number. How many hundreds is that?"],
      ],
      explain: "10 tens make 1 hundred, so 40 tens make 4 hundreds. That’s 400.",
    },
  },
];
