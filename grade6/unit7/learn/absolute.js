/* Learn Rational Numbers (Grade 6 Unit 7), chapter 4: Absolute value. Its widgets and steps; loaded by absolute.html. */
/* Move a number: a bracket from 0 shows its distance from 0, its absolute value. */
function wDistance(el) {
  const q = Q(el),
    list = valuesFrom(-10, 10),
    values = { a: list.indexOf(-7) };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "Number")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const a = list[values.a],
      far = Math.abs(a);
    q("a").textContent = fmt(a);
    q("f").innerHTML = signedLine(-11, 11, {
      pts: [{ v: a, t: fmt(a) }],
      spans: a ? [{ a: Math.min(0, a), b: Math.max(0, a), t: `${fmt(far)} from 0` }] : [],
      label: `Number line: ${fmt(a)} is ${fmt(far)} from 0`,
    });
    q("e").textContent = `${abs(a)} = ${fmt(far)}`;
    q("r").innerHTML = a
      ? `${fmt(a)} is ${fmt(far)} unit${far === 1 ? "" : "s"} from 0, so its <b>absolute value</b> is ${fmt(far)}.` +
        (a < 0
          ? `<br><span class="dimline">Absolute value is a distance, so it’s never negative, even for a negative number.</span>`
          : "")
      : "0 is 0 units from 0, so |0| = 0.";
  };
  steppers(el, values, { a: [0, list.length - 1] }, draw);
  draw();
}

/* Pick a distance from 0: the two numbers that far away (or just 0). */
function wSameDistance(el) {
  const q = Q(el),
    values = { d: 5 };
  el.innerHTML =
    `<div class="wrow">${stepper("d", "Distance from 0")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const d = values.d;
    q("d").textContent = d;
    q("f").innerHTML = signedLine(-10, 10, {
      pts: d
        ? [
            { v: -d, cls: "b", t: fmt(-d) },
            { v: d, t: fmt(d) },
          ]
        : [{ v: 0, t: "0" }],
      spans: d
        ? [
            { a: -d, b: 0, t: fmt(d) },
            { a: 0, b: d, t: fmt(d) },
          ]
        : [],
      label: d ? `Number line: ${fmt(-d)} and ${fmt(d)} are both ${d} from 0` : "Number line with a point at 0",
    });
    q("e").textContent = d ? `${abs(d)} = ${d} and ${abs(-d)} = ${d}` : "|0| = 0";
    q("r").innerHTML = d
      ? `Two numbers are ${d} from 0: <b>${fmt(d)} and ${fmt(-d)}</b>. They’re opposites, and they have the same absolute value.`
      : "Only one number is 0 from 0: 0 itself.";
  };
  steppers(el, values, { d: [0, 9] }, draw);
  draw();
}

/* Move two bank balances below zero: the lesser balance is the bigger debt, because it's farther from 0. */
function wLessFarther(el) {
  const q = Q(el),
    list = valuesFrom(-60, 0, 5),
    values = { a: list.indexOf(-30), j: list.indexOf(-10) };
  el.innerHTML =
    `<div class="wrow">${stepper("a", "Andre’s balance")}${stepper("j", "Jada’s balance")}</div>` +
    `<div class="fig" data-f></div><p class="eq sm" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const andre = list[values.a],
      jada = list[values.j],
      same = andre === jada,
      [moreDebt, lessDebt] = andre < jada ? ["Andre", "Jada"] : ["Jada", "Andre"];
    q("a").textContent = money(andre);
    q("j").textContent = money(jada);
    q("f").innerHTML = signedLine(-70, 10, {
      step: 5,
      every: 10,
      pts: same
        ? [{ v: andre, t: "both" }]
        : [
            { v: andre, t: "Andre" },
            { v: jada, cls: "b", t: "Jada" },
          ],
      /* a bracket from each balance up to 0 (none for $0), the bigger debt's a level higher */
      spans: [
        { a: andre, b: 0, t: money(-andre), lv: andre < jada ? 1 : 0 },
        ...(same ? [] : [{ a: jada, b: 0, t: money(-jada), lv: andre < jada ? 0 : 1 }]),
      ].filter((span) => span.a !== 0),
      label: `Number line with balances of ${money(andre)} and ${money(jada)}`,
    });
    q("e").textContent = same
      ? `${fmt(andre)} = ${fmt(jada)}`
      : `${compareText(andre, jada)}, but ${abs(andre)} ${Math.abs(andre) > Math.abs(jada) ? ">" : "<"} ${abs(jada)}`;
    q("r").innerHTML = same
      ? andre
        ? `Both balances are ${money(andre)}: they owe the same, ${money(-andre)}.`
        : "Both balances are $0: nobody owes anything."
      : `${moreDebt}’s balance is less (farther left), but it’s farther from 0, so <b>${moreDebt} owes more</b>: ${money(-Math.min(andre, jada))} compared with ${money(-Math.max(andre, jada))} for ${lessDebt}.` +
        `<br><span class="dimline">The size of a debt is the absolute value of the balance.</span>`;
  };
  steppers(el, values, { a: [0, list.length - 1], j: [0, list.length - 1] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Distance from zero",
    widget: wDistance,
    body: "<p>The <b>absolute value</b> of a number is its distance from 0. It’s written with bars: |−7| = 7, because −7 is 7 units from 0. A distance is never negative.</p><p>Move the number and watch the bracket.</p>",
    check: {
      kind: "num",
      neg: true,
      q: "What is |−9|?",
      answer: 9,
      misc: [[-9, "Absolute value is a distance from 0, so it’s never negative. −9 is 9 units from 0."]],
      explain: "−9 is 9 units from 0, so |−9| = 9.",
    },
  },
  {
    title: "Two numbers, one distance",
    widget: wSameDistance,
    body: "<p>A number and its opposite are the same distance from 0, so they have the same absolute value: |5| = 5 and |−5| = 5.</p><p>Change the distance from 0.</p>",
    check: {
      kind: "mc",
      q: "Which numbers have an absolute value of 4?",
      choices: [
        { id: "a", label: "4 and −4" },
        { id: "b", label: "only 4" },
        { id: "c", label: "only −4" },
      ],
      answer: "a",
      why: {
        b: "−4 is also 4 units from 0, on the other side. So |−4| = 4 too.",
        c: "4 is also 4 units from 0, so |4| = 4 too.",
      },
      explain: "4 and −4 are both 4 units from 0: |4| = 4 and |−4| = 4.",
    },
  },
  {
    title: "Less, but farther",
    widget: wLessFarther,
    body: "<p>Comparing numbers and comparing their distances from 0 are different questions. −30 is <b>less</b> than −10, but it’s <b>farther</b> from 0. A balance of −$30 is a bigger debt than −$10.</p><p>Change the two balances.</p>",
    check: {
      kind: "mc",
      q: "Lin’s bank balance is −$40 and Noah’s is −$25. Who owes more?",
      choices: [
        { id: "a", label: "Lin" },
        { id: "b", label: "Noah" },
        { id: "c", label: "They owe the same" },
      ],
      answer: "a",
      why: {
        b: "−25 is greater than −40, but Noah owes only $25. Lin’s balance is farther below 0: Lin owes $40.",
        c: "|−40| = 40 and |−25| = 25: different amounts.",
      },
      explain: "|−40| = 40 and |−25| = 25, so Lin owes more: $40.",
    },
  },
];
