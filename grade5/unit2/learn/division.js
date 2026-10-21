/* Learn Fractions as Quotients and Fraction Multiplication (Grade 5 Unit 2), chapter 2: Division and fractions. Its widgets
   and steps; loaded by division.html. */
/* Put a ÷ b on a number line (steppers): a jumps of 1/b from 0, and its whole number and leftover. */
function wLine(el) {
  const q = Q(el),
    values = { top: 7, bottom: 4 },
    limits = { top: [1, 12], bottom: [2, 6] };
  el.innerHTML =
    `<div class="wrow">${stepper("top", "Divide")}${stepper("bottom", "By")}</div>` +
    `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { top, bottom } = values,
      whole = Math.floor(top / bottom),
      left = top % bottom;
    q("top").textContent = top;
    q("bottom").textContent = bottom;
    q("f").innerHTML = fracLine([{ d: bottom, pts: [{ k: top }], hops: top }], {
      wholes: whole + 1,
      label: `${top} jumps of 1/${bottom} on a number line`,
    });
    const value = !left ? `${whole}` : whole ? `${fr(top, bottom)} = ${mixed(top, bottom)}` : fr(top, bottom);
    q("r").innerHTML =
      `<b>${top} ÷ ${bottom} = ${value}</b>: ${top} ${top === 1 ? "jump" : "jumps"} of ${fr(1, bottom)} from 0. ` +
      (!left
        ? `${bottom} goes into ${top} exactly ${whole} times, with nothing left over.`
        : whole
          ? `${bottom} goes into ${top} ${whole} ${whole === 1 ? "time" : "times"} with ${left} left over, and the ${left} left over shared by ${bottom} is ${fr(left, bottom)} more.`
          : `${top} is less than ${bottom}, so each share is less than 1.`);
  };
  steppers(el, values, limits, draw);
  draw();
}
const STEPS = [
  {
    title: "Share what’s left over",
    widget: wLine,
    body: "<p>In a story where the leftover can be cut up, like rope or lemonade, don’t stop at a remainder: share the leftover too. 7 ÷ 4 is 1 with 3 left over, and 3 ÷ 4 = 3/4, so <b>7 ÷ 4 = 7/4 = 1 3/4</b>.</p><p>Change the numbers and find a ÷ b on the number line.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "A 7-meter rope is cut into 2 equal pieces. How long is each piece?",
      answer: 7 / 2,
      unit: "meters",
      misc: [
        [2 / 7, "That’s 2 ÷ 7. The rope, 7 meters, is split into 2 pieces: 7 ÷ 2."],
        [3, "That’s only the whole meters. Share the 1 meter left over too: 1/2 more."],
      ],
      explain: "7 ÷ 2 = 7/2 = 3 1/2 meters: 3 whole meters each, and the last meter cut in half.",
    },
  },
];
