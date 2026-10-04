/* Learn Multiplicative Comparison and Measurement (Grade 4 Unit 5), chapter 1: Times as many. Its widgets and steps; loaded by times-as-many.html. */
/* Pick how many Han has and how many times as many Lin has (steppers): Lin's tape is that many copies of Han's. */
function wTimes(el) {
  /* the steppers' values: han, how many Han has, and times, how many times as many Lin has */
  const q = Q(el),
    values = { han: 4, times: 3 },
    limits = { han: [1, 9], times: [1, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("han", "Han has")}${stepper("times", "Times as many")}</div>` +
    `<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { han, times } = values,
      lin = han * times;
    q("han").textContent = han;
    q("times").textContent = times;
    q("f").innerHTML = timesTape(
      [
        { label: "Han", times: 1, each: han, total: han },
        { label: "Lin", times, each: han, total: lin },
      ],
      { label: `Tape diagram: Han has ${han}, and Lin has ${times} boxes of ${han}` },
    );
    q("e").innerHTML = `${times} × ${han} = ${lin}`;
    q("r").innerHTML =
      times === 1
        ? `1 time as many is the same amount: Lin has ${han}, just like Han.`
        : `Lin has ${times} times as many as Han: ${times} groups of ${han}. <b>${lin} is ${times} times as many as ${han}.</b>`;
  };
  steppers(el, values, limits, draw);
  draw();
}
/* comparisons to work backward from: Han's amount, how many times as many Lin has, and what they have */
const FACTS = [
  { small: 5, times: 3, what: "books" },
  { small: 4, times: 6, what: "stickers" },
  { small: 7, times: 2, what: "shells" },
];
/* which number is unknown: Lin's amount, how many times as many, or Han's amount */
const UNKNOWNS = [
  ["big", "Lin’s amount"],
  ["times", "How many times"],
  ["small", "Han’s amount"],
];
/* Pick a comparison and which number is missing: see the story, the tape with its ?, and how to find it. */
function wUnknown(el) {
  const q = Q(el);
  let factIndex = 0,
    unknown = "big";
  el.innerHTML =
    `<div data-top>${seg(
      "Comparison",
      FACTS.map((fact, i) => [i, `${fact.times} × ${fact.small}`]),
    )}</div><div data-bot>${seg("Missing", UNKNOWNS)}</div>` +
    `<p class="readout" data-s></p><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { small, times, what } = FACTS[factIndex],
      big = small * times;
    press(q("top"), factIndex);
    press(q("bot"), unknown);
    const story = {
      big: `Han has ${small} ${what}. Lin has ${times} times as many. How many ${what} does Lin have?`,
      times: `Han has ${small} ${what}. Lin has ${big}. How many times as many ${what} does Lin have?`,
      small: `Lin has ${big} ${what}. That’s ${times} times as many as Han has. How many ${what} does Han have?`,
    }[unknown];
    q("s").innerHTML = story;
    q("f").innerHTML = timesTape(
      [
        { label: "Han", times: 1, each: unknown === "small" ? "?" : small, total: unknown === "small" ? "?" : small },
        unknown === "times"
          ? { label: "Lin", times: 1, span: times, each: big, total: `? × ${small}` }
          : { label: "Lin", times, each: unknown === "small" ? "?" : small, total: unknown === "big" ? "?" : big },
      ],
      { label: `Tape diagram for ${times} × ${small} = ${big}, with one number missing` },
    );
    q("e").innerHTML = {
      big: `? = ${times} × ${small}`,
      times: `${big} = ? × ${small}`,
      small: `${big} = ${times} × ?`,
    }[unknown];
    q("r").innerHTML = {
      big: `Multiply: ${times} × ${small} = <b>${big}</b>. Lin has ${big} ${what}.`,
      times: `How many ${small}s make ${big}? Divide: ${big} ÷ ${small} = <b>${times}</b>. Lin has ${times} times as many.`,
      small: `Lin’s ${big} is ${times} equal parts, each as big as Han’s. Divide: ${big} ÷ ${times} = <b>${small}</b>. Han has ${small} ${what}.`,
    }[unknown];
  };
  el.addEventListener("click", (e) => {
    const hit = segHit(e, ["top", "bot"]);
    if (!hit) return;
    if (hit[0] === "top") factIndex = +hit[1];
    else unknown = hit[1];
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Times as many",
    widget: wTimes,
    body: "<p>“Lin has 3 times as many as Han” means Lin has 3 groups the size of Han’s. In a tape diagram, Lin’s tape is 3 copies of Han’s tape, and 3 × Han’s amount is Lin’s.</p><p>Change how many Han has and how many times as many Lin has.</p>",
    check: {
      kind: "mc",
      q: "Andre has 6 shells. Clare has 4 times as many. How many shells does Clare have?",
      choices: [
        { id: "a", label: "10 shells" },
        { id: "b", label: "24 shells" },
        { id: "c", label: "4 shells" },
      ],
      answer: "b",
      why: {
        a: "That adds 4. 4 times as many means 4 groups of 6.",
        c: "Clare has 4 times as many, not 4 shells. That’s 4 groups of 6.",
      },
      explain: "4 times as many as 6 is 4 groups of 6: 4 × 6 = 24 shells.",
    },
  },
  {
    title: "Find the missing number",
    widget: wUnknown,
    body: "<p>A comparison like 15 = 3 × 5 has three numbers. Any of them can be the one you’re looking for. To find the bigger amount, multiply. To find how many times as many, or the smaller amount, divide.</p><p>Pick a comparison and which number is missing.</p>",
    check: {
      kind: "num",
      q: "A school bus is 12 meters long. A car is 4 meters long. How many times as long as the car is the bus?",
      answer: 3,
      unit: "times",
      misc: [
        [8, "That’s how much longer the bus is: 12 − 4. How many 4s make 12?"],
        [48, "That multiplies 12 × 4. How many 4s make 12?"],
      ],
      explain: "12 = ? × 4. 12 ÷ 4 = 3, so the bus is 3 times as long as the car.",
    },
  },
];
