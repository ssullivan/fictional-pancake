/* Learn Putting It All Together (Grade 5 Unit 8), chapter 4: Decimals and fraction products. Its widgets and steps; loaded by
   decimals-fractions.html. */
/* decimal problems: [button, what the readout says] */
const DECIMAL_OPS = [
  ["2.45 + 1.3", "Line up the decimal points: 1.3 is 1.30. 2.45 + 1.30 = <b>3.75</b>."],
  ["6.4 − 2.35", "6.4 is 6.40. Trade a tenth for 10 hundredths, then subtract: 6.40 − 2.35 = <b>4.05</b>."],
  ["0.7 × 0.6", "7 × 6 = 42, and tenths × tenths make hundredths: 0.7 × 0.6 = <b>0.42</b>."],
  ["2.4 ÷ 0.3", "2.4 is 24 tenths and 0.3 is 3 tenths. 24 ÷ 3 = 8: 2.4 ÷ 0.3 = <b>8</b>."],
];
/* Pick a decimal problem and see how it's worked. */
function wDecimals(el) {
  const q = Q(el);
  let opIndex = 0;
  el.innerHTML =
    seg(
      "Problem",
      DECIMAL_OPS.map(([button], i) => [i, button]),
    ) + `<p class="readout" data-r></p>`;
  const draw = () => {
    press(el, opIndex);
    q("r").innerHTML = DECIMAL_OPS[opIndex][1];
  };
  onPick(el, (m) => {
    opIndex = +m;
    draw();
  });
  draw();
}
/* fraction products: [a, b, c, d] for a/b × c/d */
const PRODUCTS = [
  [2, 3, 3, 4],
  [1, 2, 4, 5],
  [5, 6, 2, 3],
];
/* Pick a product of fractions and see it on a square: the tops multiply and the bottoms multiply. */
function wProducts(el) {
  const q = Q(el);
  let productIndex = 0;
  el.innerHTML =
    seg(
      "Product",
      PRODUCTS.map(([a, b, c, d], i) => [i, `${a}/${b} × ${c}/${d}`]),
    ) + `<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw = () => {
    const [a, b, c, d] = PRODUCTS[productIndex],
      common = gcd(a * c, b * d);
    press(el, productIndex);
    q("f").innerHTML = areaFig([a, b], [c, d], { under: true, label: `${a}/${b} of ${c}/${d} of a square` });
    q("r").innerHTML =
      `The square is cut into ${b} × ${d} = ${b * d} pieces, and ${a} × ${c} = ${a * c} are gold: <b>${fr(a, b)} × ${fr(c, d)} = ${fr(a * c, b * d)}${common > 1 ? ` = ${fr((a * c) / common, (b * d) / common)}` : ""}</b>.`;
  };
  onPick(el, (m) => {
    productIndex = +m;
    draw();
  });
  draw();
}
const STEPS = [
  {
    title: "Decimals, all four ways",
    widget: wDecimals,
    body: "<p>Adding and subtracting decimals: line up the decimal points. Multiplying: use the whole-number fact, then think about the place (tenths × tenths make hundredths). Dividing: think in tenths or hundredths.</p><p>Pick a problem.</p>",
    check: {
      kind: "num",
      q: "What is 0.8 × 0.4?",
      answer: 0.32,
      unit: "",
      tol: 0.005,
      misc: [
        [3.2, "That’s 32 tenths. Tenths × tenths make hundredths."],
        [0.032, "That’s 32 thousandths. Tenths × tenths make hundredths."],
      ],
      explain: "8 × 4 = 32, and tenths × tenths are hundredths: 0.8 × 0.4 = 0.32.",
    },
  },
  {
    title: "Multiply fractions",
    widget: wProducts,
    body: "<p>To multiply fractions, take a fraction of a fraction on a square: the square is cut into (bottom × bottom) pieces, and (top × top) of them are gold. So <b>a/b × c/d = (a × c)/(b × d)</b>.</p><p>Pick a product.</p>",
    check: {
      kind: "num",
      frac: true,
      q: "What is 3/5 × 2/3?",
      answer: 6 / 15,
      unit: "",
      misc: [
        [5 / 8, "That adds the tops and the bottoms. Multiply them."],
        [2 / 3, "That’s all of 2/3. Take 3/5 of it."],
      ],
      explain: "3/5 × 2/3 = (3 × 2)/(5 × 3) = 6/15 = 2/5.",
    },
  },
];
