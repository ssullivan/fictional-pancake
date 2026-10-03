/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 2: Where the decimal point goes. Its widgets and steps; loaded by decimal-point.html. */
/* place names and denominators by decimal places */
const PLACE = ["ones", "tenths", "hundredths", "thousandths", "ten-thousandths"];
const DEN = ["1", "10", "100", "1,000", "10,000"];
/* a decimal as a whole number over 10, 100, …: 0.06 is 6 over 100 */
const asInt = (n) => Math.round(n * 10 ** places(n));

/* products to write as fractions */
const FRAC = [
  [0.3, 0.2],
  [0.4, 0.02],
  [1.5, 0.4],
  [0.06, 0.5],
];
/* Each factor as a fraction: tenths times tenths make hundredths. */
function wFraction(el) {
  const q = Q(el);
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Multiply",
      FRAC.map(([a, b], i) => [i, `${fmt(a)} × ${fmt(b)}`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = () => {
    /* placesA and placesB: the factors' decimal places; the product has both */
    const [a, b] = FRAC[problemIndex],
      placesA = places(a),
      placesB = places(b),
      productPlaces = placesA + placesB,
      wholeA = asInt(a),
      wholeB = asInt(b);
    press(el, problemIndex);
    q("r").innerHTML =
      `${fmt(a)} × ${fmt(b)} = ${wholeA}/${DEN[placesA]} × ${wholeB}/${DEN[placesB]} = <b>${wholeA * wholeB}/${DEN[productPlaces]}</b> = <b>${fmt(a * b)}</b><br><span class="dimline">${PLACE[placesA]} times ${PLACE[placesB]} make ${PLACE[productPlaces]}.</span>`;
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      draw();
    }
  });
  draw();
}

/* products to find by counting decimal places */
const COUNT = [
  [1.25, 0.4],
  [2.5, 0.12],
  [0.35, 0.2],
  [12, 0.05],
];
/* Multiply as whole numbers, then put back all the decimal places. */
function wPlaces(el) {
  const q = Q(el);
  let problemIndex = 0;
  el.innerHTML =
    seg(
      "Multiply",
      COUNT.map(([a, b], i) => [i, `${fmt(a)} × ${fmt(b)}`]),
    ) + `<p class="readout" data-r></p>`;
  const draw = () => {
    /* wholeProduct: the product without decimal points; full: the product written with all its places */
    const [a, b] = COUNT[problemIndex],
      placesA = places(a),
      placesB = places(b),
      productPlaces = placesA + placesB,
      wholeProduct = asInt(a) * asInt(b),
      product = wholeProduct / 10 ** productPlaces,
      full = product.toFixed(productPlaces);
    press(el, problemIndex);
    q("r").innerHTML =
      `Multiply without the decimal points: ${asInt(a)} × ${asInt(b)} = <b>${wholeProduct}</b>.<br>${fmt(a)} has ${pl2(placesA)} and ${fmt(b)} has ${pl2(placesB)}: ${pl2(productPlaces)} in all.<br>So ${fmt(a)} × ${fmt(b)} = <b>${full}</b>${full !== fmt(product) ? ` = <b>${fmt(product)}</b>` : ""}.`;
  };
  el.addEventListener("click", (e) => {
    const problemBtn = e.target.closest("[data-m]");
    if (problemBtn) {
      problemIndex = +problemBtn.dataset.m;
      draw();
    }
  });
  draw();
}
/* "1 decimal place", "3 decimal places" */
const pl2 = (n) => `${n} decimal place${n === 1 ? "" : "s"}`;

const STEPS = [
  {
    title: "Tenths times tenths",
    widget: wFraction,
    body: "<p>Write each decimal as a fraction. 0.3 × 0.2 is 3/10 × 2/10 = 6/100, which is 0.06. Tenths times tenths make <b>hundredths</b>, so the product is smaller than either number.</p><p>Pick a product.</p>",
    check: {
      kind: "num",
      unit: "",
      answer: 0.08,
      q: "What is 0.4 × 0.2?",
      misc: [
        [0.8, "Tenths times tenths make hundredths: 4 × 2 = 8 hundredths."],
        [8, "4 × 2 = 8, but these are tenths times tenths: 8 hundredths."],
        [0.6, "That’s 0.4 + 0.2. Multiply: 4/10 × 2/10."],
      ],
      explain: "0.4 × 0.2 = 4/10 × 2/10 = 8/100 = 0.08.",
    },
  },
  {
    title: "Count the decimal places",
    widget: wPlaces,
    body: "<p>A quick way: multiply as if there were no decimal points, then put back as many decimal places as the two numbers have together. Zeros at the end of the answer can go: 0.500 is 0.5.</p><p>Pick a product.</p>",
    check: {
      kind: "mc",
      q: "Which is 2.5 × 0.12?",
      choices: [
        { id: "a", label: "0.3" },
        { id: "b", label: "3" },
        { id: "c", label: "0.03" },
      ],
      answer: "a",
      why: {
        b: "25 × 12 = 300, and there are 3 decimal places to put back: 0.300.",
        c: "Count the places: 2.5 has 1 and 0.12 has 2, so 3 in all. 300 becomes 0.300, which is 0.3.",
      },
      explain: "25 × 12 = 300. 3 decimal places in all: 0.300 = 0.3.",
    },
  },
];
