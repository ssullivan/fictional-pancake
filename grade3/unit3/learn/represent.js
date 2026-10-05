/* Learn Wrapping Up Addition and Subtraction within 1,000 (Grade 3 Unit 3), chapter 1: Numbers in different ways. Its widgets
   and steps; loaded by represent.html. */
/* base-ten blocks colored by place: hundreds gold, tens blue, ones green */
const blocksOf = (hundreds, tens, ones, label) => htoFig(hundreds, tens, ones, { cls: { t: "b", o: "c" } }, label);
/* Steppers for hundreds, tens, and ones: the blocks, the number, its expanded form and name, and where it is from 0 to 1,000. */
function wBuild(el) {
  /* the steppers' values: h hundreds, t tens, o ones */
  const q = Q(el),
    values = { h: 3, t: 4, o: 6 };
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow">${stepper("h", "Hundreds")}${stepper("t", "Tens")}${stepper("o", "Ones")}</div><div class="fig" data-l></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { h: hundreds, t: tens, o: ones } = values,
      n = hundreds * 100 + tens * 10 + ones;
    q("h").textContent = hundreds;
    q("t").textContent = tens;
    q("o").textContent = ones;
    q("f").innerHTML = blocksOf(hundreds, tens, ones);
    q("l").innerHTML = numLine(0, 1000, {
      u: 0.38,
      step: 100,
      big: 500,
      lab: () => true,
      fmt: commas,
      pad: 22,
      pts: [{ v: n, t: n }],
      label: `Number line from 0 to 1,000 with a point at ${n}`,
    });
    q("r").innerHTML =
      `${pl(hundreds, "hundred")}, ${pl(tens, "ten")}, and ${pl(ones, "one")} make <b>${n}</b>.` +
      `<br>Expanded form: ${expanded(n)}.<br>In words: ${numWords(n)}.`;
  };
  steppers(el, values, { h: [0, 9], t: [0, 9], o: [0, 9] }, draw);
  draw();
}
/* the numbers to trade */
const TRADE_NUMBERS = [325, 504, 640];
/* Trade 1 hundred for 10 tens, or 1 ten for 10 ones, and see that the number stays the same. */
function wTrade(el) {
  /* hundreds, tens, ones: the blocks as they are after any trades */
  const q = Q(el);
  let numberIndex = 0,
    [hundreds, tens, ones] = digits(TRADE_NUMBERS[0]);
  el.innerHTML =
    seg(
      "Number",
      TRADE_NUMBERS.map((n, i) => [i, String(n)]),
    ) +
    `<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-th>Trade a hundred for 10 tens</button><button type="button" class="btn" data-tt>Trade a ten for 10 ones</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw = () => {
    const n = TRADE_NUMBERS[numberIndex];
    press(el, numberIndex);
    /* one trade a place: 10 or more tens (or ones) means that place has had its trade */
    q("th").disabled = hundreds === 0 || tens >= 10;
    q("tt").disabled = tens === 0 || ones >= 10;
    q("f").innerHTML = blocksOf(hundreds, tens, ones);
    q("r").innerHTML =
      `${pl(hundreds, "hundred")}, ${pl(tens, "ten")}, and ${pl(ones, "one")}: ` +
      `${hundreds * 100} + ${tens * 10} + ${ones} = ${n}.` +
      (tens >= 10 || ones >= 10
        ? `<br><span class="ok">Different blocks, the same number: still <b>${n}</b>.</span>`
        : '<br><span class="dimline">Make a trade. Does the number change?</span>');
  };
  q("th").onclick = () => {
    if (hundreds === 0 || tens >= 10) return;
    hundreds--;
    tens += 10;
    draw();
  };
  q("tt").onclick = () => {
    if (tens === 0 || ones >= 10) return;
    tens--;
    ones += 10;
    draw();
  };
  q("clr").onclick = () => {
    [hundreds, tens, ones] = digits(TRADE_NUMBERS[numberIndex]);
    draw();
  };
  onPick(el, (id) => {
    numberIndex = +id;
    [hundreds, tens, ones] = digits(TRADE_NUMBERS[numberIndex]);
    draw();
  });
  draw();
}
/* the quick checks' figures */
const F = {
  blocks407: blocksOf(4, 0, 7),
};
const STEPS = [
  {
    title: "Hundreds, tens, and ones",
    widget: wBuild,
    body: "<p>A big square is a <b>hundred</b>, a stick is a <b>ten</b>, and a small square is a <b>one</b>. 3 hundreds, 4 tens, and 6 ones make 346. In <b>expanded form</b>, that’s 300 + 40 + 6: what each digit is worth, added up.</p><p>Change the hundreds, tens, and ones. Watch the number move on the number line.</p>",
    check: {
      kind: "num",
      q: "What number do the blocks show?",
      fig: F.blocks407,
      answer: 407,
      misc: [
        [47, "There are no tens, so write a 0 in the tens place: 4 hundreds, 0 tens, 7 ones."],
        [470, "The small squares are ones, not tens: 4 hundreds, 0 tens, 7 ones."],
      ],
      explain: "4 hundreds, 0 tens, and 7 ones: 400 + 7 = 407.",
    },
  },
  {
    title: "Trade to make the same number",
    widget: wTrade,
    body: "<p>1 hundred is the same as 10 tens, and 1 ten is the same as 10 ones. So 325 is 3 hundreds, 2 tens, and 5 ones, and it’s also 2 hundreds, 12 tens, and 5 ones. Trading changes the blocks, not the number.</p><p>Pick a number and make a trade.</p>",
    check: {
      kind: "mc",
      q: "Which is another way to make 436?",
      choices: [
        { id: "a", label: "4 hundreds, 13 tens, 6 ones" },
        { id: "b", label: "3 hundreds, 13 tens, 6 ones" },
        { id: "c", label: "3 hundreds, 3 tens, 6 ones" },
      ],
      answer: "b",
      stack: true,
      why: {
        a: "That has 10 more tens but still 4 hundreds. It’s 536.",
        c: "That takes away a hundred but doesn’t add its 10 tens. It’s 336.",
      },
      explain: "Trade 1 of the 4 hundreds for 10 tens: 3 hundreds, 13 tens, and 6 ones. 300 + 130 + 6 = 436.",
    },
  },
];
