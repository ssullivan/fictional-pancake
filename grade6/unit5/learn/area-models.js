/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 3: Area diagrams and grids. Its widgets and steps; loaded by area-models.html. */
/* a 1 m by 1 m square in hundredths, with a w-tenths by h-tenths rectangle shaded from the bottom left */
function grid(w, h) {
  const cell = 24,
    left = 58,
    top = 28,
    side = 10 * cell;
  let markup = "";
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 10; j++)
      markup += `<rect class="${i < w && j >= 10 - h ? "shade" : "cell"}" x="${left + i * cell}" y="${top + j * cell}" width="${cell}" height="${cell}"/>`;
  markup += `<rect class="frame" x="${left}" y="${top}" width="${side}" height="${side}"/><rect class="frame" style="stroke:var(--gold)" x="${left}" y="${top + side - h * cell}" width="${w * cell}" height="${h * cell}"/>`;
  markup += `<text class="ftxt mid" x="${left + side / 2}" y="${top - 10}">1 m</text><text class="ftxt mid" x="${left + (w * cell) / 2}" y="${top + side + 22}">${fmt(w / 10)} m</text><text class="ftxt" text-anchor="end" x="${left - 8}" y="${top + side - (h * cell) / 2 + 5}">${fmt(h / 10)} m</text>`;
  return svgWrap(
    left + side + 20,
    top + side + 34,
    markup,
    `A 1 meter square in hundredths, with ${fmt(w / 10)} by ${fmt(h / 10)} meters shaded`,
  );
}
/* A rectangle in tenths of a meter (a stepper for each side) on a hundredths grid: tenths times tenths are hundredths. */
function wGrid(el) {
  const q = Q(el),
    values = { w: 6, h: 3 };
  el.innerHTML = `<div class="wrow">${stepper("w", "Width (tenths)")}${stepper("h", "Height (tenths)")}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const { w, h } = values;
    q("w").textContent = w;
    q("h").textContent = h;
    q("f").innerHTML = grid(w, h);
    q("r").innerHTML =
      `${fmt(w / 10)} m × ${fmt(h / 10)} m = ${w} × ${h} = <b>${w * h} hundredth${w * h === 1 ? "" : "s"}</b> of a square meter = <b>${fmt((w * h) / 100)} square meters</b>.` +
      (w * h === 100 ? `<br><span class="ok">The whole square: 1 square meter.</span>` : "");
  };
  steppers(el, values, { w: [1, 10], h: [1, 10] }, draw);
  draw();
}

/* buys: a price per pound and a weight */
const BUY = [
  { what: "grapes", price: 2.4, lb: 1.5 },
  { what: "cherries", price: 3.2, lb: 2.5 },
  { what: "apples", price: 1.8, lb: 3.5 },
];
/* A price times a weight, split into the whole pounds and the part of a pound, as an area diagram. */
function wParts(el) {
  const q = Q(el);
  let buyIndex = 0;
  el.innerHTML =
    seg(
      "Buy",
      BUY.map((buy, i) => [i, `${fmt(buy.lb)} lb of ${buy.what}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    /* wholePounds and partPound split the weight; wholeCost and partCost are their costs */
    const { what, price, lb } = BUY[buyIndex],
      wholePounds = Math.floor(lb),
      partPound = Math.round((lb - wholePounds) * 10) / 10,
      wholeCost = price * wholePounds,
      partCost = price * partPound;
    press(el, buyIndex);
    /* the rectangle is width wide, split in proportion to the two parts */
    const width = 380,
      left = 70,
      top = 34,
      height = 110,
      wholeW = (width * wholePounds) / lb,
      partW = width - wholeW;
    q("f").innerHTML = svgWrap(
      width + left + 20,
      top + height + 20,
      `<rect class="part-a" x="${left}" y="${top}" width="${wholeW}" height="${height}"/><rect class="part-b" x="${left + wholeW}" y="${top}" width="${partW}" height="${height}"/>` +
        `<text class="ftxt big mid" x="${left + wholeW / 2}" y="${top - 12}">${wholePounds}</text><text class="ftxt big mid" x="${left + wholeW + partW / 2}" y="${top - 12}">${fmt(partPound)}</text><text class="ftxt big mid" x="${left - 34}" y="${top + height / 2 + 7}">${money(price)}</text>` +
        `<text class="ftxt big mid rev" x="${left + wholeW / 2}" y="${top + height / 2 + 7}">${money(wholeCost)}</text><text class="ftxt big mid rev" x="${left + wholeW + partW / 2}" y="${top + height / 2 + 7}">${money(partCost)}</text>`,
      `${money(price)} times ${wholePounds} and ${fmt(partPound)} pounds, split into two rectangles`,
    );
    q("r").innerHTML =
      `${fmt(lb)} pounds is ${wholePounds} + ${fmt(partPound)}.<br>${money(price)} × ${wholePounds} = ${money(wholeCost)} and ${money(price)} × ${fmt(partPound)} = ${money(partCost)}.<br><b>${fmt(lb)} pounds of ${what} cost ${money(wholeCost + partCost)}.</b>`;
  };
  el.addEventListener("click", (e) => {
    const buyBtn = e.target.closest("[data-m]");
    if (buyBtn) {
      buyIndex = +buyBtn.dataset.m;
      draw();
    }
  });
  draw();
}

const STEPS = [
  {
    title: "Multiply on a hundredths grid",
    widget: wGrid,
    body: "<p>A 1 meter by 1 meter square split into 100 small squares shows hundredths. A rectangle 0.6 m by 0.3 m covers 6 × 3 = 18 small squares: 0.18 square meters.</p><p>Change the width and the height.</p>",
    check: {
      kind: "num",
      unit: "square meters",
      answer: 0.28,
      q: "A rectangle is 0.4 m wide and 0.7 m tall. What is its area?",
      misc: [
        [28, "4 × 7 = 28 small squares, and each is a hundredth of a square meter: 0.28."],
        [1.1, "That’s 0.4 + 0.7, the two sides added. Area multiplies them."],
        [0.028, "Tenths times tenths make hundredths, not thousandths: 28 hundredths."],
      ],
      explain: "0.4 × 0.7 = 4 × 7 hundredths = 28 hundredths = 0.28 square meters.",
    },
  },
  {
    title: "Split it into parts",
    widget: wParts,
    body: "<p>To multiply a price by a weight like 1.5 pounds, split the weight: 1 pound and 0.5 pound. Find each part and add. The two rectangles together are the whole product.</p><p>Pick something to buy.</p>",
    check: {
      kind: "num",
      unit: "dollars",
      answer: 3.6,
      q: "Grapes cost $2.40 a pound. How much do 1.5 pounds cost?",
      misc: [
        [36, "Put the decimal point back: 24 × 15 = 360, with 2 decimal places, is 3.60."],
        [3.9, "That’s $2.40 + 1.5. Multiply: 1 pound is $2.40 and half a pound is $1.20."],
        [2.4, "That’s just 1 pound. Add the half pound: $1.20."],
      ],
      explain: "1 pound is $2.40 and 0.5 pound is $1.20. $2.40 + $1.20 = $3.60.",
    },
  },
];
