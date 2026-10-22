/* Learn Place Value Patterns and Decimal Operations (Grade 5 Unit 5), chapter 1: Thousandths. Its widgets and steps; loaded
   by thousandths.html. */
/* Add thousandths to 0.32 one at a time (a stepper): 10 of them fill the next hundredth. */
function wZoom(el) {
  const q = Q(el),
    values = { thousandths: 5 },
    limits = { thousandths: [0, 10] };
  el.innerHTML = `<div class="wrow">${stepper("thousandths", "Thousandths")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const extra = values.thousandths,
      k = 320 + extra;
    q("thousandths").textContent = extra;
    q("f").innerHTML = thousandthsFig(k);
    q("r").innerHTML =
      extra === 10
        ? `10 thousandths fill a whole hundredth: <b>0.32 + 0.010 = 0.33</b>.`
        : `0.32 and ${extra} ${extra === 1 ? "thousandth" : "thousandths"} more: <b>${dec(k)}</b>. Each thousandth is one tenth of a hundredth.`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* Build a decimal from its tenths, hundredths, and thousandths (steppers): see it in a chart, in words, and in expanded form. */
function wBuild(el) {
  const q = Q(el),
    values = { ones: 0, tenths: 3, hundredths: 2, thousandths: 5 },
    limits = { ones: [0, 9], tenths: [0, 9], hundredths: [0, 9], thousandths: [0, 9] };
  el.innerHTML =
    `<div class="wrow">${stepper("ones", "Ones")}${stepper("tenths", "Tenths")}${stepper("hundredths", "Hundredths")}${stepper("thousandths", "Thousandths")}</div>` +
    `<div data-c></div><p class="readout" data-r></p>`;
  const draw = () => {
    const digits = [values.tenths, values.hundredths, values.thousandths],
      k = values.ones * 1000 + digits[0] * 100 + digits[1] * 10 + digits[2],
      parts = [
        ...(values.ones ? [String(values.ones)] : []),
        ...digits.map((d, i) => (d ? dec(d * 10 ** (2 - i)) : null)).filter(Boolean),
      ];
    ["ones", "tenths", "hundredths", "thousandths"].forEach((key) => (q(key).textContent = values[key]));
    q("c").innerHTML = pvChart([["", k / 1000]], -1, { places: [0, -1, -2, -3] });
    q("r").innerHTML = k
      ? `<b>${dec(k)}</b>, in words ${decWords(k)}. Expanded: ${parts.join(" + ")}${parts.length > 1 ? ` = ${dec(k)}` : ""}. As a fraction, the part after the point is ${fr(k % 1000, 1000)}.`
      : "That’s 0. Add some tenths, hundredths, or thousandths.";
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "One thousandth",
    widget: wZoom,
    body: "<p>Cut a hundredth into 10 equal slivers: each is <b>one thousandth</b>, 0.001. It’s 1 of 1,000 equal parts of a whole. Thousandths take the third place after the decimal point.</p><p>Add thousandths to 0.32.</p>",
    check: {
      kind: "num",
      q: "Write 7/1000 as a decimal.",
      answer: 0.007,
      unit: "",
      tol: 0.0005,
      misc: [
        [0.07, "That’s 7 hundredths. 7/1000 is thousandths: 3 digits after the point."],
        [7, "That’s a whole number. Thousandths go after the decimal point."],
      ],
      explain: "7/1000 = 0.007: 7 thousandths, with zeros in the tenths and hundredths places.",
    },
  },
  {
    title: "Read and write thousandths",
    widget: wBuild,
    body: "<p>Each place after the decimal point is one tenth of the place before it: tenths, hundredths, thousandths. Read a decimal by its last place: 0.325 is three hundred twenty-five thousandths. A 0 holds an empty place.</p><p>Build a decimal one place at a time.</p>",
    check: {
      kind: "num",
      q: "Write four and thirty-six thousandths as a decimal.",
      answer: 4.036,
      unit: "",
      tol: 0.0005,
      misc: [
        [
          4.36,
          "That’s four and thirty-six hundredths. Thousandths need 3 digits after the point: write a 0 in the tenths.",
        ],
        [36, "That’s a whole number. The 36 thousandths go after the decimal point."],
      ],
      explain: "Thirty-six thousandths is 0.036, so four and thirty-six thousandths is 4.036.",
    },
  },
];
