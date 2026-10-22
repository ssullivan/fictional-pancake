/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4), chapter 3: Percent increase and decrease. Its widgets
   and steps; loaded by percent-change.html. */
/* changes to a $40 price, in percent (negative for a decrease) */
const CHANGES = [20, 50, -25, -10];
/* Pick a change: the new price is (100 + the change)% of the old one. */
function wChange(el) {
  const q = Q(el),
    old = 40;
  el.innerHTML =
    seg(
      "Change",
      CHANGES.map((c, i) => [i, `${c > 0 ? "+" : "−"}${Math.abs(c)}%`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const c = CHANGES[index],
      percent = 100 + c,
      now = (old * percent) / 100;
    press(el, index);
    q("f").innerHTML = pctLine(old, percent, now, {})(true);
    q("r").innerHTML =
      `${Math.abs(c)}% of ${money(old)} is ${money((old * Math.abs(c)) / 100)}, so the new price is ` +
      `${money(old)} ${c > 0 ? "+" : "−"} ${money((old * Math.abs(c)) / 100)} = <b>${money(now)}</b>. ` +
      `That’s <b>${percent}%</b> of the old price.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* new prices after a change: [percent of the old price, the new price] */
const AFTER = [
  [120, 48],
  [75, 45],
  [150, 90],
];
/* Pick a new price: it's a percent of the old one, so find 1%, then 100%. */
function wOriginal(el) {
  const q = Q(el);
  el.innerHTML =
    seg(
      "After",
      AFTER.map(([percent, now], i) => [
        i,
        `${money(now)} after ${percent > 100 ? "+" : "−"}${Math.abs(percent - 100)}%`,
      ]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = (index) => {
    const [percent, now] = AFTER[index],
      old = (now * 100) / percent;
    press(el, index);
    q("f").innerHTML = pctLine(old, percent, now, {})(true);
    q("r").innerHTML =
      `${money(now)} is ${percent}% of the old price. 1% is ${money(now)} ÷ ${percent} = ${money(old / 100)}, ` +
      `so 100% is <b>${money(old)}</b>.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

/* Pick a change: the equation multiplies the old price p by 1 plus the change as a decimal. */
function wEquation(el) {
  const q = Q(el),
    changes = [20, 5, -30, 150];
  el.innerHTML =
    seg(
      "Change",
      changes.map((c, i) => [i, `${c > 0 ? "+" : "−"}${Math.abs(c)}%`]),
    ) + `<p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = (index) => {
    const c = changes[index],
      factor = 1 + c / 100;
    press(el, index);
    q("e").innerHTML = `${mathVar("n")} = ${fmt(factor)}${mathVar("p")}`;
    q("r").innerHTML =
      `100% ${c > 0 ? "+" : "−"} ${Math.abs(c)}% = ${100 + c}%, and ${100 + c}% is ${fmt(factor)}. ` +
      `So the new price ${mathVar("n")} is ${fmt(factor)} times the old price ${mathVar("p")}.`;
  };
  onPick(el, (id) => draw(+id));
  draw(0);
}

const STEPS = [
  {
    title: "Up and down by a percent",
    widget: wChange,
    body: "<p>A percent increase adds a percent of the old amount; a decrease takes it away. Either way, the new amount is a percent of the old one: up 20% makes 120%, and down 25% leaves 75%.</p><p>Pick a change.</p>",
    check: {
      kind: "num",
      q: "A $60 jacket’s price goes up 25%. What is the new price?",
      answer: 75,
      unit: "dollars",
      misc: [
        [15, "That’s the increase. Add it to $60."],
        [85, "That adds $25. 25% of $60 is $15."],
        [45, "That’s a 25% decrease. The price went up."],
      ],
      explain: "25% of $60 is $15, so the new price is $60 + $15 = $75: 125% of $60.",
    },
  },
  {
    title: "Back to 100%",
    widget: wOriginal,
    body: "<p>To find the amount before a change, remember the new amount is a percent of the old one, not 100%. Divide by that percent to find 1%, then multiply by 100.</p><p>Pick a new price.</p>",
    check: {
      kind: "num",
      q: "After a 25% discount, a game costs $60. What did it cost before the discount?",
      answer: 80,
      unit: "dollars",
      misc: [
        [75, "That adds 25% of $60. The 25% was of the old price, so $60 is 75% of it."],
        [85, "That adds $25. $60 is 75% of the old price."],
      ],
      explain: "$60 is 75% of the old price. 1% is $60 ÷ 75 = $0.80, so 100% is $80.",
    },
  },
  {
    title: "Percent change equations",
    widget: wEquation,
    body: `<p>A percent change is a proportional relationship: the new price ${mathVar("n")} is the old price ${mathVar("p")} times 1 plus (or minus) the percent as a decimal. Up 20% is ${mathVar("n")} = 1.2${mathVar("p")}.</p><p>Pick a change.</p>`,
    check: {
      kind: "mc",
      q: `Every price in a store goes down 15%. Which equation gives the new price ${mathVar("n")} from the old price ${mathVar("p")}?`,
      choices: [
        { id: "a", label: `${mathVar("n")} = 0.15${mathVar("p")}` },
        { id: "b", label: `${mathVar("n")} = 0.85${mathVar("p")}` },
        { id: "c", label: `${mathVar("n")} = ${mathVar("p")} − 15` },
      ],
      answer: "b",
      why: {
        a: "That’s just the 15% taken off. The new price is what’s left: 85%.",
        c: "That takes off $15, not 15%.",
      },
      explain: "100% − 15% = 85%, which is 0.85, so n = 0.85p.",
    },
  },
];
