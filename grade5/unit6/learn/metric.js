/* Learn More Decimal and Fraction Operations (Grade 5 Unit 6), chapter 2: Metric conversions. Its widgets and steps; loaded by
   metric.html. */
/* metric units, big to small: [button, big, small, how many small in one big, amounts in the big unit, amounts in the small] */
const PAIRS = [
  ["km and m", "kilometers", "meters", 1000, [1, 2.5, 0.4], [3000, 1500, 250]],
  ["m and cm", "meters", "centimeters", 100, [1, 1.75, 0.6], [400, 125, 80]],
  ["L and mL", "liters", "milliliters", 1000, [1, 2.5, 0.75], [2000, 1250, 500]],
  ["kg and g", "kilograms", "grams", 1000, [1, 3.2, 0.5], [6000, 2500, 750]],
];
/* a number as written: commas in whole numbers, decimals as short as they go */
const written = (v) => (Number.isInteger(v) ? commas(v) : String(+v.toFixed(3)));
/* an amount with its unit: "1 kilometer", "2.5 kilometers" */
const withUnit = (v, plural) => `${written(v)} ${v === 1 ? plural.slice(0, -1) : plural}`;
/* A widget for converting (toSmall: big units to small, or small to big): pick the units and an amount (two rows). */
const convert = (toSmall) =>
  function (el) {
    const q = Q(el);
    let pairIndex = 0,
      amountIndex = 1;
    el.innerHTML = `<div data-top>${seg(
      "Units",
      PAIRS.map(([button], i) => [i, button]),
    )}</div><div data-bot></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
    const draw = () => {
      const [, big, small, per, bigAmounts, smallAmounts] = PAIRS[pairIndex],
        amount = (toSmall ? bigAmounts : smallAmounts)[amountIndex],
        result = toSmall ? Math.round(amount * per) : amount / per,
        zeros = String(per).length - 1;
      q("bot").innerHTML = seg(
        "Amount",
        (toSmall ? bigAmounts : smallAmounts).map((v, i) => [i, withUnit(v, toSmall ? big : small)]),
      );
      press(q("top"), pairIndex);
      press(q("bot"), amountIndex);
      q("e").innerHTML = `${withUnit(amount, toSmall ? big : small)} = ${withUnit(result, toSmall ? small : big)}`;
      q("r").innerHTML =
        `1 ${big.slice(0, -1)} = ${commas(per)} ${small}. ` +
        (toSmall
          ? `The smaller unit takes more of them, so multiply: <b>${written(amount)} × ${commas(per)} = ${written(result)}</b>. Each digit moves ${zeros} places left.`
          : `The bigger unit takes fewer of them, so divide: <b>${written(amount)} ÷ ${commas(per)} = ${written(result)}</b>. Each digit moves ${zeros} places right.`);
    };
    el.addEventListener("click", (e) => {
      const hit = segHit(e, ["top", "bot"]);
      if (!hit) return;
      if (hit[0] === "top") pairIndex = +hit[1];
      else amountIndex = +hit[1];
      draw();
    });
    draw();
  };
const wToSmall = convert(true),
  wToBig = convert(false);
const STEPS = [
  {
    title: "Big units to small: multiply",
    widget: wToSmall,
    body: "<p>Metric units go by powers of 10: 1 kilometer = 1,000 meters, 1 meter = 100 centimeters, 1 liter = 1,000 milliliters. To change to a <b>smaller</b> unit, you need more of them: <b>multiply</b> by the power of 10.</p><p>Pick the units and an amount.</p>",
    check: {
      kind: "num",
      q: "A trail is 3.4 kilometers long. How many meters is that?",
      answer: 3400,
      unit: "meters",
      misc: [
        [340, "That multiplies by 100. 1 kilometer is 1,000 meters."],
        [0.0034, "That divides. Meters are smaller, so there are more of them: multiply."],
      ],
      explain: "3.4 × 1,000 = 3,400 meters.",
    },
  },
  {
    title: "Small units to big: divide",
    widget: wToBig,
    body: "<p>To change to a <b>bigger</b> unit, you need fewer of them: <b>divide</b> by the power of 10. Some problems take two steps: find the total in the small unit, then change it.</p><p>Pick the units and an amount.</p>",
    check: {
      kind: "num",
      q: "Each canteen holds 750 milliliters. How many liters do 4 canteens hold?",
      answer: 3,
      unit: "liters",
      misc: [
        [3000, "That’s the milliliters: 750 × 4 = 3,000. Divide by 1,000 for liters."],
        [0.75, "That’s one canteen in liters. There are 4 canteens."],
      ],
      explain: "750 × 4 = 3,000 milliliters. 3,000 ÷ 1,000 = 3 liters.",
    },
  },
];
