/* Learn Rational Number Arithmetic (Grade 7 Unit 5), chapter 3: Multiplying signed numbers. Its widgets and steps; loaded
   by multiplying.html. */
/* Pick a direction and a time: a boat at 3 m per second is at velocity × time, east positive and the future positive. */
function wMotion(el) {
  const q = Q(el),
    speed = 3;
  let east = true,
    future = true;
  el.innerHTML = `<div data-top>${seg("Heading", [
    ["east", "Heading east (+3)"],
    ["west", "Heading west (−3)"],
  ])}</div><div data-bot>${seg("Time", [
    ["future", "4 seconds from now (+4)"],
    ["past", "4 seconds ago (−4)"],
  ])}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const velocity = east ? speed : -speed,
      time = future ? 4 : -4,
      position = velocity * time;
    press(q("top"), east ? "east" : "west");
    press(q("bot"), future ? "future" : "past");
    q("f").innerHTML = signedLine(-16, 16, {
      every: 4,
      moves: [{ a: 0, b: position, t: `${par(velocity)} × ${par(time)}`, cls: "b" }],
      pts: [
        { v: 0, t: "now", cls: "b" },
        { v: position, t: fmt(position), lv: 1 },
      ],
    });
    q("r").innerHTML =
      `${par(velocity)} × ${par(time)} = <b>${fmt(position)}</b>: ${Math.abs(position)} m ${position > 0 ? "east" : "west"} of here. ` +
      (future
        ? `In the future, the boat is on the side it’s heading toward.`
        : `In the past, it was on the side it’s coming <i>from</i>${!east ? ": a negative times a negative is positive" : ""}.`);
  };
  el.addEventListener("click", (e) => {
    const [row, id] = segHit(e, ["top", "bot"]) || [];
    if (row === "top") east = id === "east";
    if (row === "bot") future = id === "future";
    if (row) draw();
  });
  draw();
}

/* Change two factors: the product's size is the product of the sizes, and its sign comes from counting negatives. */
function wSigns(el) {
  const q = Q(el),
    values = { a: -4, b: -3 };
  el.innerHTML = `<div class="wrow">${stepper("a", "First")}${stepper("b", "Second")}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw = () => {
    const { a, b } = values,
      product = a * b,
      negatives = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0);
    q("a").textContent = fmt(a);
    q("b").textContent = fmt(b);
    q("e").textContent = `${par(a)} × ${par(b)} = ${fmt(product)}`;
    q("r").innerHTML =
      product === 0
        ? "Anything times 0 is 0."
        : negatives === 2
          ? `Two negatives: the product is <b>positive</b>.`
          : negatives === 1
            ? `One negative: the product is <b>negative</b>.`
            : `No negatives: the product is <b>positive</b>.`;
  };
  steppers(el, values, { a: [-9, 9], b: [-9, 9] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Speed, direction, and time",
    widget: wMotion,
    body: "<p>A boat’s position is its velocity times the time. East is positive and west negative; the future is positive and the past negative. A boat heading west was <b>east</b> of here 4 seconds ago, so (−3) × (−4) = +12.</p><p>Pick a heading and a time.</p>",
    check: {
      kind: "num",
      q: "A crab walks west at 4 m per second. East is positive. Where was it 3 seconds ago, compared to where it is now?",
      answer: 12,
      neg: true,
      unit: "m",
      misc: [
        [-12, "It’s walking west, so 3 seconds ago it was east of here: positive."],
        [-7, "Velocity times time: (−4) × (−3)."],
      ],
      explain: "(−4) × (−3) = 12: it was 12 m east of here.",
    },
  },
  {
    title: "The sign of a product",
    widget: wSigns,
    body: "<p>Multiply the sizes, then find the sign: a positive times a negative is <b>negative</b>, and a negative times a negative is <b>positive</b>.</p><p>Change the factors.</p>",
    check: {
      kind: "num",
      q: "What is (−6) × (−7)?",
      answer: 42,
      neg: true,
      misc: [
        [-42, "A negative times a negative is positive."],
        [-13, "That adds. Multiply."],
      ],
      explain: "6 × 7 = 42, and two negatives make a positive: 42.",
    },
  },
];
