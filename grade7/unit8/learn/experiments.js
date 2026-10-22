/* Learn Probability and Sampling (Grade 7 Unit 8), chapter 2: Experiments. Its widgets and steps; loaded by
   experiments.html. */
/* Spin a spinner that's 1/4 red, 10 spins at a time: the fraction that land on red gets close to 1/4. The spins come from a
   seeded random maker, so they're the same every time the page opens. */
function wSpin(el) {
  const q = Q(el),
    parts = ["red", "blue", "blue", "blue"];
  let random = seeded(7),
    spins = 0,
    reds = 0;
  el.innerHTML = `<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-more>Spin 10 times</button><button type="button" class="ghost-btn" data-lots>Spin 100 times</button><button type="button" class="ghost-btn" data-reset>Start over</button></div><p class="readout" data-r></p>`;
  const spin = (count) => {
    range(count).forEach(() => {
      if (random() < 0.25) reds++;
      spins++;
    });
    draw();
  };
  const draw = () => {
    q("f").innerHTML = spinnerFig(parts);
    q("r").innerHTML = spins
      ? `${reds} red out of ${spins} spins: ${fmt(reds / spins)} of them. ` +
        (spins >= 100
          ? "With many spins, that’s close to the probability, 1/4 = 0.25."
          : "Spin more: the fraction settles down near 0.25.")
      : "No spins yet. The spinner is 1/4 red.";
  };
  q("more").addEventListener("click", () => spin(10));
  q("lots").addEventListener("click", () => spin(100));
  q("reset").addEventListener("click", () => {
    random = seeded(7);
    spins = 0;
    reds = 0;
    draw();
  });
  draw();
}

/* Change the number of spins: expect about 1/4 of them to land on red. */
function wExpect(el) {
  const q = Q(el),
    values = { tens: 4 };
  el.innerHTML = `<div class="wrow">${stepper("tens", "Spins (tens)")}</div><p class="readout" data-r></p>`;
  const draw = () => {
    const spins = values.tens * 10;
    q("tens").textContent = spins;
    q("r").innerHTML =
      `In ${spins} spins, expect about 1/4 × ${spins} = <b>${fmt(spins / 4)}</b> red. ` +
      `It won’t be exactly that every time, but it should be close.`;
  };
  steppers(el, values, { tens: [1, 20] }, draw);
  draw();
}

const STEPS = [
  {
    title: "Repeating an experiment",
    widget: wSpin,
    body: "<p>You can estimate a probability by repeating an experiment many times: the fraction of times the outcome happens is its <b>relative frequency</b>. A few tries can be far off, but many tries get close to the probability.</p><p>Spin the spinner.</p>",
    check: {
      kind: "num",
      q: "A coin was flipped 50 times and landed heads 28 times. What fraction of the flips were heads?",
      answer: 0.56,
      frac: true,
      misc: [
        [28, "That’s how many. Divide by the 50 flips."],
        [0.5, "That’s the probability. The question asks what happened: 28 of 50."],
      ],
      explain: "28 out of 50 is 28/50 = 0.56, close to 1/2.",
    },
  },
  {
    title: "What to expect",
    widget: wExpect,
    body: "<p>If you know a probability, you can predict about how many times something will happen: multiply the probability by the number of tries.</p><p>Change the spins.</p>",
    check: {
      kind: "num",
      q: "You roll a number cube 60 times. About how many times do you expect to roll a 4?",
      answer: 10,
      unit: "times",
      misc: [
        [15, "That’s 1/4 of 60. A number cube has 6 sides: 1/6."],
        [6, "That’s the number of sides. Find 1/6 of 60."],
      ],
      explain: "The probability of a 4 is 1/6, and 1/6 of 60 is 10.",
    },
  },
];
