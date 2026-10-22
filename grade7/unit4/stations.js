/* Mall Rush (Grade 7 Unit 4): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs.
   Percent double number lines are pctLine (shared/figures.js); fractions are [n, d] from shared/fracmath.js. Money answers
   are to the cent, so index.html and checks.js pass a tighter near. Every problem carries facts for checks.js: its type (t)
   and the numbers its checks need. Each generator deals one of a few kinds of problem (type), each with a comment saying what
   it asks. */
/* a num problem: its named mistakes leave out any that land on the answer (to the cent), and any repeats */
function numP(p) {
  const misc = (p.misc || []).filter(([v]) => Number.isFinite(v) && v > 0 && Math.abs(v - p.answer) >= 0.005);
  return { kind: "num", unit: "", ...p, misc: miscOf(p.answer, misc) };
}
/* an mc problem from [[label, why it's wrong, or null for the answer], …], leaving out wrong choices that repeat a label */
function mcP(list, p) {
  const kept = list.filter(([label], i) => list.findIndex(([other]) => other === label) === i);
  return { ...mcOf(kept, { stack: p.stack }), ...p };
}
/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* dollars as written: $42 or $42.40 */
const money = (n) => {
  const cents = Math.round(n * 100);
  return "$" + (cents % 100 ? (cents / 100).toFixed(2) : fmt(cents / 100));
};
/* an amount rounded to the cent, so sums of dollars stay exact */
const cents = (n) => Math.round(n * 100) / 100;
/* p percent of n, to the cent */
const pctOf = (p, n) => cents((p * n) / 100);
const val = ([n, d]) => n / d;
/* a fraction as written in a sentence, stacked (a whole number stays whole) */
const fw = (f) => fim(f);

/* ---------- Station 1: rates with fractions (Lessons 1 to 3, 5) ---------- */
/* times as fractions of an hour, and the whole-number or half rates that make friendly distances with them */
const TIMES = [
  [1, 4],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 4],
];
const RATES = [
  [2, 1],
  [3, 1],
  [4, 1],
  [3, 2],
  [5, 2],
];
/* things that go at a steady rate: [who, what they do, the amount's unit, the rate's words] */
const MOVERS = [
  ["Jada", "walks", "mile", "miles per hour"],
  ["Noah", "rows", "mile", "miles per hour"],
  ["Diego", "paints", "wall", "walls per hour"],
  ["A pump", "fills", "tank", "tanks per hour"],
];
/* prices per pound and weights in pounds whose products come out to the cent */
const PRICES = [
  [2.4, 2.5],
  [1.6, 1.5],
  [3.2, 2.5],
  [4.5, 2],
  [1.2, 3.5],
  [2.5, 1.5],
];
function genRates() {
  const type = pick(["unit", "unit", "use", "decimal"]);
  if (type === "unit" || type === "use") {
    const t = pick(TIMES),
      k = pick(RATES),
      amount = fMul(k, t),
      [who, does, unit, rateWords] = pick(MOVERS),
      plural = (f) => (val(f) <= 1 ? unit : unit + "s");
    if (type === "unit") {
      /* the unit rate: an amount in a fraction of an hour */
      return numP({
        prompt: `${who} ${does} ${fw(amount)} ${plural(amount)} in ${fw(t)} of an hour, at a steady rate. How many <b>${rateWords}</b> is that?`,
        answer: val(k),
        frac: true,
        unit: rateWords,
        hint: `Divide the amount by the time: ${fw(amount)} ÷ ${fw(t)}. Dividing by ${fw(t)} is multiplying by ${fw(fInv(t))}.`,
        misc: [
          [val(t) / val(amount), `That’s hours per ${unit}. Divide the ${unit}s by the hours.`],
          [val(amount) * val(t), "That multiplies. A rate per hour divides by the hours."],
        ],
        explain: `${fw(amount)} ÷ ${fw(t)} = ${fw(amount)} × ${fw(fInv(t))} = ${fw(k)} ${rateWords}.`,
        facts: { t: type, amount, time: t },
      });
    }
    /* use the rate: how much in a whole number of hours */
    const hours = pick([2, 3, 4, 6]),
      total = val(k) * hours;
    return numP({
      prompt: `${who} ${does} ${fw(amount)} ${plural(amount)} in ${fw(t)} of an hour, at a steady rate. How many ${unit}s in <b>${hours} hours</b>?`,
      answer: total,
      unit: `${unit}s`,
      hint: `First find the amount for 1 hour: ${fw(amount)} ÷ ${fw(t)}. Then multiply by ${hours}.`,
      misc: [
        [
          val(amount) * hours,
          `That’s ${fw(amount)} for each hour, but ${fw(amount)} takes only ${fw(t)} of an hour. Find the rate per hour first.`,
        ],
        [val(k), `That’s for 1 hour. Multiply by ${hours}.`],
      ],
      explain: `${fw(amount)} ÷ ${fw(t)} = ${fw(k)} ${rateWords}, and ${fw(k)} × ${hours} = ${fmt(total)} ${unit}s.`,
      facts: { t: type, amount, time: t, hours },
    });
  }
  /* prices with decimals: price per pound times pounds */
  const [price, pounds] = pick(PRICES),
    fruit = pick(["apples", "grapes", "cherries", "peaches", "almonds"]),
    total = cents(price * pounds);
  return numP({
    prompt: `${fruit[0].toUpperCase() + fruit.slice(1)} cost ${money(price)} per pound. How much do <b>${fmt(pounds)} pounds</b> cost?`,
    answer: total,
    unit: "dollars",
    hint: `Multiply the price for 1 pound by the pounds: ${fmt(price)} × ${fmt(pounds)}.`,
    misc: [
      [cents(price + pounds), "That adds. Each pound costs the same, so multiply."],
      [cents(price / pounds), "That divides. More pounds cost more: multiply."],
    ],
    explain: `${fmt(price)} × ${fmt(pounds)} = ${fmt(total)}, so they cost ${money(total)}.`,
    facts: { t: type, price, pounds },
  });
}

/* ---------- Station 2: half as much again (Lesson 4) ---------- */
/* fractions to grow or shrink by, as [n, d], and what they're called */
const PARTS = [
  [[1, 2], "half"],
  [[1, 3], "a third"],
  [[1, 4], "a quarter"],
  [[2, 3], "two thirds"],
  [[3, 4], "three quarters"],
];
/* things that shrink: [what, unit, sizes that suit them] */
const SHRINKERS = [
  ["A block of ice", "grams", [600, 900, 1200]],
  ["A candle", "cm", [12, 24, 36]],
  ["A bag of flour", "cups", [12, 24]],
  ["A pile of firewood", "logs", [24, 36, 48]],
];
/* things that grow: [what, unit, sizes that suit them] */
const GROWERS = [
  ["A puppy", "pounds", [12, 18, 24, 36]],
  ["A sunflower", "cm", [60, 90, 120]],
  ["A savings jar", "dollars", [24, 36, 48, 60]],
  ["A tomato plant", "inches", [12, 24, 36]],
];
function genAgain() {
  const type = pick(["grow", "grow", "shrink", "factor", "back"]);
  const [part, name] = pick(PARTS),
    [what, unit, sizes] = pick(type === "shrink" ? SHRINKERS : GROWERS),
    old = pick(sizes.filter((s) => s % part[1] === 0));
  if (type === "factor") {
    /* growing by a fraction is multiplying by 1 + it */
    const grow = Math.random() < 0.6,
      factor = grow ? fAdd([1, 1], part) : fSub([1, 1], part);
    return numP({
      prompt: `${grow ? "Growing" : "Shrinking"} by <b>${fw(part)}</b> is the same as multiplying by what number?`,
      answer: val(factor),
      frac: true,
      hint: `Start with all of it, 1. ${grow ? "Add" : "Take away"} ${fw(part)}.`,
      misc: [
        [
          val(part),
          `That’s just the ${grow ? "extra" : "part taken away"}. Keep the whole thing too: 1 ${grow ? "+" : "−"} ${fw(part)}.`,
        ],
        ...(grow ? [] : [[1 + val(part), "That grows. Shrinking takes the part away: 1 − " + ftx(part) + "."]]),
      ],
      explain: `1 ${grow ? "+" : "−"} ${fw(part)} = ${fw(factor)}, so ${grow ? "growing" : "shrinking"} by ${fw(part)} multiplies by ${fw(factor)}.`,
      facts: { t: type, part, grow },
    });
  }
  if (type === "back") {
    /* the size before it grew by a fraction */
    const now = cents(old * (1 + val(part)));
    return numP({
      prompt: `${what} grew by ${fw(part)} of its size. Now it’s ${fmt(now)} ${unit}. How big was it <b>before</b>?`,
      answer: old,
      unit,
      hint: `Before × ${fw(fAdd([1, 1], part))} = ${fmt(now)}. Divide ${fmt(now)} by ${fw(fAdd([1, 1], part))}.`,
      misc: [
        [
          cents(now * (1 - val(part))),
          `That takes ${fw(part)} of the new size away. The ${fw(part)} was of the old size: divide by ${fw(fAdd([1, 1], part))}.`,
        ],
        [cents(now * (1 + val(part))), "That grows it again. Go back: divide."],
      ],
      explain: `${fmt(now)} ÷ ${fw(fAdd([1, 1], part))} = ${fmt(old)} ${unit}. Check: ${fmt(old)} + ${fw(part)} of ${fmt(old)} = ${fmt(now)}.`,
      facts: { t: type, part, old, now },
    });
  }
  /* grow or shrink by a fraction */
  const grow = type === "grow",
    change = cents(old * val(part)),
    answer = grow ? old + change : old - change;
  return numP({
    prompt: grow
      ? `${what} was ${fmt(old)} ${unit}. It grew by <b>${name === "half" ? "half as much again" : name + " of that"}</b>. How big is it now?`
      : `${what} was ${fmt(old)} ${unit}. It shrank by <b>${name === "half" ? "half" : name}</b> of that. How big is it now?`,
    answer,
    unit,
    hint: `${fw(part)} of ${fmt(old)} is ${fmt(change)}. ${grow ? "Add it on" : "Take it away"}, or multiply by ${fw(grow ? fAdd([1, 1], part) : fSub([1, 1], part))}.`,
    misc: [
      [
        change,
        `That’s only the ${grow ? "growth" : "part that’s gone"}. ${grow ? "Add it to" : "Take it from"} ${fmt(old)}.`,
      ],
      ...(grow
        ? [[old - change, "That shrinks it. It grew: add."]]
        : [[old + change, "That grows it. It shrank: take away."]]),
    ],
    explain: `${fw(part)} × ${fmt(old)} = ${fmt(change)}, and ${fmt(old)} ${grow ? "+" : "−"} ${fmt(change)} = ${fmt(answer)} ${unit}.`,
    facts: { t: type, part, old },
  });
}

/* ---------- Station 3: percent increase and decrease (Lessons 6 to 9) ---------- */
/* things whose price or count changes: [what, the amounts they come in] */
const PRICED = [
  ["A pair of sneakers", [40, 60, 80, 120]],
  ["A video game", [20, 40, 60]],
  ["A bike", [150, 200, 300]],
  ["A movie ticket", [10, 12, 15, 20]],
  ["A backpack", [30, 40, 50]],
];
/* percents of change, and prices they make whole cents with */
const CHANGES = [5, 10, 15, 20, 25, 30, 40, 50];
function genChange() {
  const type = pick(["up", "down", "original", "equation", "small"]);
  const [what, prices] = pick(PRICED),
    old = pick(prices),
    p = pick(CHANGES);
  if (type === "up" || type === "down") {
    /* the new price after a percent increase or decrease */
    const up = type === "up",
      change = pctOf(p, old),
      answer = up ? cents(old + change) : cents(old - change),
      percent = up ? 100 + p : 100 - p;
    return numP({
      prompt: `${what} cost ${money(old)}. The price went <b>${up ? "up" : "down"} ${p}%</b>. What is the new price?`,
      answer,
      unit: "dollars",
      fig: (show) => pctLine(old, percent, answer, { askA: !show })(show),
      hint: `${p}% of ${money(old)} is ${money(change)}. ${up ? "Add it on" : "Take it off"}, or find ${percent}% of ${money(old)}.`,
      misc: [
        [change, `That’s the change. ${up ? "Add it to" : "Take it from"} ${money(old)}.`],
        [
          up ? cents(old + p) : cents(old - p),
          `That ${up ? "adds" : "takes away"} ${p} dollars. ${p}% is ${p} hundredths of the price: ${money(change)}.`,
        ],
        [
          up ? cents(old - change) : cents(old + change),
          `The price went ${up ? "up" : "down"}, so the new price is ${up ? "more" : "less"}.`,
        ],
      ],
      explain: `${p}% of ${money(old)} is ${money(change)}, so the new price is ${money(old)} ${up ? "+" : "−"} ${money(change)} = ${money(answer)}, which is ${percent}% of ${money(old)}.`,
      facts: { t: type, old, p },
    });
  }
  if (type === "original") {
    /* the price before a percent change: the new price is (100 ± p)% of it */
    const up = Math.random() < 0.5,
      percent = up ? 100 + p : 100 - p,
      now = pctOf(percent, old);
    return numP({
      prompt: `After a <b>${p}% ${up ? "increase" : "decrease"}</b>, ${what.toLowerCase()} costs ${money(now)}. What did it cost <b>before</b>?`,
      answer: old,
      unit: "dollars",
      fig: (show) => pctLine(old, percent, now, { askW: !show })(show),
      hint: `${money(now)} is ${percent}% of the old price. Find 1% (divide by ${percent}), then 100%.`,
      misc: [
        [
          up ? pctOf(100 - p, now) : pctOf(100 + p, now),
          `That takes ${p}% of the new price. The ${p}% was of the old price.`,
        ],
        [
          up ? cents(now - p) : cents(now + p),
          `That uses ${p} dollars. ${money(now)} is ${percent}% of the old price.`,
        ],
      ],
      explain: `${money(now)} is ${percent}% of the old price, so 1% is ${money(now)} ÷ ${percent} = ${money(old / 100)}, and 100% is ${money(old)}.`,
      facts: { t: type, old, p, up, now },
    });
  }
  if (type === "equation") {
    /* the equation for a percent change: multiply by 1 ± p/100 */
    const up = Math.random() < 0.5,
      factor = fmt(1 + ((up ? 1 : -1) * p) / 100),
      partFactor = fmt(p / 100);
    const n = mathVar("n"),
      x = mathVar("p");
    return mcP(
      [
        [`${n} = ${factor}${x}`, null],
        [
          `${n} = ${partFactor}${x}`,
          `That’s just the ${up ? "increase" : "decrease"}, ${p}% of the price. Keep the 100% too.`,
        ],
        [`${n} = ${x} ${up ? "+" : "−"} ${p}`, `That changes the price by ${p} dollars, not ${p}%.`],
      ],
      {
        prompt: `Every price in a store goes <b>${up ? "up" : "down"} ${p}%</b>. Which equation gives the new price ${n} from the old price ${x}?`,
        hint: `The new price is ${up ? 100 + p : 100 - p}% of the old one. Write that percent as a decimal.`,
        explain: `100% ${up ? "+" : "−"} ${p}% = ${up ? 100 + p : 100 - p}%, which is ${factor}: ${n} = ${factor}${x}.`,
        facts: { t: type, p, up, factor: +factor },
      },
    );
  }
  /* a percent smaller than 1 */
  const [small, amount] = pick([
    [0.5, 400],
    [0.5, 600],
    [0.1, 2000],
    [0.2, 500],
    [0.5, 1000],
  ]);
  const answer = cents((small * amount) / 100);
  return numP({
    prompt: `A bank charges a fee of <b>${small}%</b> on a transfer of ${money(amount)}. How much is the fee?`,
    answer,
    unit: "dollars",
    hint: `1% of ${money(amount)} is ${money(amount / 100)}. ${small}% is ${small === 0.5 ? "half" : small === 0.1 ? "a tenth" : "two tenths"} of that.`,
    misc: [
      [amount * small, `That’s ${small} times the whole amount. ${small}% is ${small} hundredths of it.`],
      [amount / 100, `That’s 1%. ${small}% is less than 1%.`],
    ],
    explain: `1% of ${money(amount)} is ${money(amount / 100)}, so ${small}% is ${small} × ${money(amount / 100)} = ${money(answer)}.`,
    facts: { t: type, small, amount },
  });
}

/* ---------- Station 4: tax and tip (Lesson 10) ---------- */
/* restaurant bills and store prices that make whole cents with these rates */
const TAX_RATES = [5, 6, 8, 10];
const TIP_RATES = [15, 18, 20];
function genTax() {
  const type = pick(["tax", "tip", "total", "rate"]);
  if (type === "tax" || type === "total") {
    /* sales tax, or the price with the tax */
    const price = pick([20, 30, 40, 50, 60, 80]),
      rate = pick(TAX_RATES),
      tax = pctOf(rate, price),
      item = pick(["a jacket", "a pair of jeans", "a board game", "headphones", "a lamp"]),
      withTax = type === "total";
    return numP({
      prompt: `The price of ${item} is ${money(price)}, and the sales tax is <b>${rate}%</b>. ${withTax ? "What do you pay in all, with tax?" : "How much is the tax?"}`,
      answer: withTax ? cents(price + tax) : tax,
      unit: "dollars",
      hint: `${rate}% of ${money(price)}: 1% is ${money(price / 100)}, so ${rate}% is ${rate} × ${money(price / 100)}.`,
      misc: withTax
        ? [
            [tax, `That’s the tax. Add it to the price.`],
            [cents(price + rate), `That adds ${rate} dollars. ${rate}% of ${money(price)} is ${money(tax)}.`],
          ]
        : [
            [cents(price + tax), "That’s the total. The question asks for the tax only."],
            [rate, `That’s ${rate} dollars. ${rate}% means ${rate} cents on every dollar.`],
          ],
      explain: `${rate}% of ${money(price)} is ${money(tax)}${withTax ? `, so you pay ${money(price)} + ${money(tax)} = ${money(price + tax)}` : ""}.`,
      facts: { t: type, price, rate },
    });
  }
  if (type === "tip") {
    /* a tip on a restaurant bill */
    const bill = pick([20, 30, 40, 50, 60]),
      rate = pick(TIP_RATES),
      tip = pctOf(rate, bill);
    return numP({
      prompt: `A family’s dinner costs ${money(bill)}. They leave a <b>${rate}% tip</b>. How much is the tip?`,
      answer: tip,
      unit: "dollars",
      hint: `10% of ${money(bill)} is ${money(bill / 10)}. ${rate === 20 ? "20% is twice that." : rate === 15 ? "Add half of it again for 5%." : "Find 1%, then multiply by 18."}`,
      misc: [
        [cents(bill + tip), "That’s the bill with the tip. The question asks for the tip only."],
        [cents(bill / 10), `That’s 10%. The tip is ${rate}%.`],
        [rate, `That’s ${rate} dollars. ${rate}% is ${rate} cents on every dollar.`],
      ],
      explain: `${rate}% of ${money(bill)} is ${rate} × ${money(bill / 100)} = ${money(tip)}.`,
      facts: { t: type, price: bill, rate },
    });
  }
  /* the tax rate from the price and the tax */
  const price = pick([20, 40, 50, 80, 100, 200]),
    rate = pick(TAX_RATES),
    tax = pctOf(rate, price);
  return numP({
    prompt: `The tax on a ${money(price)} purchase is ${money(tax)}. What is the <b>tax rate</b>?`,
    answer: rate,
    unit: "%",
    hint: `What percent of ${money(price)} is ${money(tax)}? Find 1% of ${money(price)} first: ${money(price / 100)}.`,
    misc: [
      [cents((100 * tax) / (price + tax)), "That compares the tax to the total with tax. Compare it to the price."],
      [tax, "That’s the tax in dollars. Write it as a percent of the price."],
    ],
    explain: `${money(tax)} ÷ ${money(price)} = ${fmt(rate / 100)}, which is ${rate}%.`,
    facts: { t: type, price, tax },
  });
}

/* ---------- Station 5: discounts, markups, commission, and interest (Lessons 11 and 12) ---------- */
function genDeals() {
  const type = pick(["discount", "markup", "commission", "interest", "percent"]);
  if (type === "discount" || type === "markup") {
    /* a sale price, or a store's price after marking up what it paid */
    const off = type === "discount",
      old = pick([20, 40, 60, 80, 120]),
      p = pick(off ? [10, 20, 25, 30, 40, 50] : [20, 25, 40, 50, 60]),
      change = pctOf(p, old),
      answer = off ? cents(old - change) : cents(old + change),
      item = pick(["a hoodie", "a skateboard", "a watch", "a soccer ball", "a speaker"]);
    return numP({
      prompt: off
        ? `${item[0].toUpperCase() + item.slice(1)} that costs ${money(old)} is <b>${p}% off</b>. What is the sale price?`
        : `A store pays ${money(old)} for ${item} and marks it up <b>${p}%</b>. What is the store’s price?`,
      answer,
      unit: "dollars",
      fig: (show) => pctLine(old, off ? 100 - p : 100 + p, answer, { askA: !show })(show),
      hint: `${p}% of ${money(old)} is ${money(change)}. ${off ? "Take it off" : "Add it on"}.`,
      misc: [
        [change, `That’s the ${off ? "discount" : "markup"}. ${off ? "Take it off" : "Add it to"} ${money(old)}.`],
        [
          off ? cents(old + change) : cents(old - change),
          off ? "A discount lowers the price." : "A markup raises the price.",
        ],
      ],
      explain: `${p}% of ${money(old)} is ${money(change)}, so ${money(old)} ${off ? "−" : "+"} ${money(change)} = ${money(answer)}.`,
      facts: { t: type, old, p },
    });
  }
  if (type === "commission" || type === "interest") {
    /* a salesperson's commission, or a year of interest on savings */
    const sale = type === "commission",
      amount = sale ? pick([200, 300, 400, 500, 800]) : pick([100, 200, 400, 500]),
      p = sale ? pick([5, 10, 15]) : pick([2, 3, 4, 5]),
      earned = pctOf(p, amount);
    return numP({
      prompt: sale
        ? `Noah sells ${money(amount)} worth of shoes and earns a <b>${p}% commission</b>. How much is the commission?`
        : `Clare puts ${money(amount)} in a savings account that pays <b>${p}% interest</b> a year. How much is in the account after 1 year?`,
      answer: sale ? earned : cents(amount + earned),
      unit: "dollars",
      hint: `1% of ${money(amount)} is ${money(amount / 100)}, so ${p}% is ${p} × ${money(amount / 100)}.${sale ? "" : " Add it to the savings."}`,
      misc: sale
        ? [
            [cents(amount - earned), `That’s what’s left for the store. The commission is the ${p}% part.`],
            [p, `That’s ${p} dollars. ${p}% of ${money(amount)} is ${p} hundredths of it.`],
          ]
        : [
            [earned, "That’s the interest. Add it to the savings."],
            [cents(amount + p), `That adds ${p} dollars. ${p}% of ${money(amount)} is ${money(earned)}.`],
          ],
      explain: `${p}% of ${money(amount)} is ${money(earned)}${sale ? "" : `, so the account has ${money(amount)} + ${money(earned)} = ${money(amount + earned)}`}.`,
      facts: { t: type, amount, p },
    });
  }
  /* the percent change from one price to another */
  const old = pick([20, 40, 50, 80]),
    p = pick([10, 20, 25, 50]),
    up = Math.random() < 0.5,
    now = up ? cents(old * (1 + p / 100)) : cents(old * (1 - p / 100)),
    diff = Math.abs(now - old);
  return numP({
    prompt: `The price of a game went from ${money(old)} to ${money(now)}. By what percent did it go <b>${up ? "up" : "down"}</b>?`,
    answer: p,
    unit: "%",
    hint: `It changed by ${money(diff)}. What percent of the old price, ${money(old)}, is that?`,
    misc: [
      [
        cents((100 * diff) / now),
        `That compares the change to the new price. Compare it to the old price, ${money(old)}.`,
      ],
      [diff, "That’s the change in dollars. Write it as a percent of the old price."],
    ],
    explain: `The change is ${money(diff)}, and ${money(diff)} ÷ ${money(old)} = ${fmt(p / 100)}: ${p}%.`,
    facts: { t: "pctChange", old, now, up },
  });
}

/* ---------- Station 6: measurement error (Lessons 13 to 15) ---------- */
/* things to measure: [what, unit, real sizes, how far off a measurement might be] */
const MEASURES = [
  ["a desk", "cm", [50, 60, 80, 100], [2, 4, 5]],
  ["a dog's weight", "pounds", [20, 40, 50], [1, 2, 4]],
  ["a bag of rice", "grams", [500, 1000, 2000], [10, 20, 25, 50]],
  ["a hallway", "m", [20, 25, 40, 50], [1, 2]],
];
function genError() {
  const type = pick(["error", "percent", "percent", "interval"]);
  const [what, unit, sizes, offs] = pick(MEASURES),
    actual = pick(sizes),
    off = pick(offs.filter((o) => ((100 * o) / actual) % 1 === 0 && o < actual / 4)),
    high = Math.random() < 0.5,
    measured = high ? actual + off : actual - off;
  if (off === undefined) return genError();
  if (type === "error" || type === "percent") {
    /* how far off a measurement is, as an amount or a percent of the real size */
    const asPercent = type === "percent",
      answer = asPercent ? (100 * off) / actual : off;
    return numP({
      prompt: asPercent
        ? `Someone measures ${what} as ${fmt(measured)} ${unit}, but it’s really ${fmt(actual)} ${unit}. What is the <b>percent error</b>?`
        : `Someone measures ${what} as ${fmt(measured)} ${unit}, but it’s really ${fmt(actual)} ${unit}. What is the <b>measurement error</b>?`,
      answer,
      unit: asPercent ? "%" : unit,
      hint: asPercent
        ? `The error is ${fmt(off)} ${unit}. What percent of the real size, ${fmt(actual)}, is that?`
        : "The error is how far the measurement is from the real size.",
      misc: asPercent
        ? [
            [
              cents((100 * off) / measured),
              `That compares the error to the measurement. Compare it to the real size, ${fmt(actual)}.`,
            ],
            [off, "That’s the error in units. Write it as a percent of the real size."],
          ]
        : [
            [measured, "That’s the measurement. The error is the difference."],
            [measured + actual, "Subtract to find how far off it is."],
          ],
      explain: asPercent
        ? `The error is ${fmt(off)} ${unit}, and ${fmt(off)} ÷ ${fmt(actual)} = ${fmt(answer / 100)}: ${fmt(answer)}%.`
        : `${fmt(Math.max(measured, actual))} − ${fmt(Math.min(measured, actual))} = ${fmt(off)} ${unit}.`,
      facts: { t: type, actual, measured },
    });
  }
  /* the least or most a size could be, give or take a percent */
  /* percents that keep the range to tenths */
  const p = pick([1, 2, 5, 10].filter((q) => ((q * actual) / 10) % 1 === 0)),
    spread = (p * actual) / 100,
    least = Math.random() < 0.5;
  return numP({
    prompt: `${what[0].toUpperCase() + what.slice(1)} is supposed to be ${fmt(actual)} ${unit}, give or take <b>${p}%</b>. What is the <b>${least ? "least" : "most"}</b> it could be?`,
    answer: least ? actual - spread : actual + spread,
    unit,
    hint: `${p}% of ${fmt(actual)} is ${fmt(spread)}. ${least ? "Take it away" : "Add it on"}.`,
    misc: [
      [spread, `That’s how much it can be off. ${least ? "Take it from" : "Add it to"} ${fmt(actual)}.`],
      [least ? actual - p : actual + p, `That uses ${p} ${unit}, not ${p}%.`],
      [least ? actual + spread : actual - spread, `That’s the ${least ? "most" : "least"} it could be.`],
    ],
    explain: `${p}% of ${fmt(actual)} is ${fmt(spread)}, so it could be from ${fmt(actual - spread)} to ${fmt(actual + spread)} ${unit}.`,
    facts: { t: type, actual, p, least },
  });
}

const ZONES = [
  {
    id: "rates",
    name: "Fraction Rates",
    lessons: "Lessons 1–3, 5",
    blurb: "Find a rate per hour from fractions of an hour, use it, and multiply prices with decimals.",
    gen: genRates,
  },
  {
    id: "again",
    name: "Half Again",
    lessons: "Lesson 4",
    blurb: "Grow or shrink by a fraction, multiply by 1 plus it, and work back to the start.",
    gen: genAgain,
  },
  {
    id: "change",
    name: "Price Tags",
    lessons: "Lessons 6–9",
    blurb: "Raise and lower prices by a percent, find the price before, and write the equation.",
    gen: genChange,
  },
  {
    id: "tax",
    name: "Checkout",
    lessons: "Lesson 10",
    blurb: "Add sales tax, leave a tip, and find the tax rate.",
    gen: genTax,
  },
  {
    id: "deals",
    name: "Sale Rack",
    lessons: "Lessons 11–12",
    blurb: "Discounts, markups, commission, interest, and the percent a price changed.",
    gen: genDeals,
  },
  {
    id: "error",
    name: "Measure Up",
    lessons: "Lessons 13–15",
    blurb: "Find measurement error and percent error, and the range a size could be in.",
    gen: genError,
  },
  {
    id: "boss",
    name: "Mall Madness",
    lessons: "Whole unit · 10 problems",
    blurb: "A mixed review from every station. Aim for 3 stars.",
    gen: () => pick([genRates, genAgain, genChange, genTax, genDeals, genError])(),
  },
];

const ICON = {
  rates:
    '<text x="32" y="30" fill="#ffc93c" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">3/4</text><path d="M14,36 H50" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="54" fill="#7fe3ff" font-size="15" font-weight="800" text-anchor="middle" font-family="monospace">1/4</text>',
  again:
    '<rect x="6" y="22" width="34" height="20" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2.5"/><rect x="40" y="22" width="17" height="20" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2.5"/><text x="48" y="16" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+½</text>',
  change:
    '<path d="M10,26 L30,8 H54 V44 H30 Z" fill="rgba(255,201,60,.4)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="26" r="3.5" fill="#0a2340"/><text x="42" y="31" fill="#f3f6fb" font-size="12" font-weight="800" text-anchor="middle" font-family="monospace">%</text><path d="M20,56 l8,-8 8,8" fill="none" stroke="#5fe0a8" stroke-width="3"/>',
  tax: '<rect x="12" y="6" width="40" height="52" rx="3" fill="rgba(243,246,251,.12)" stroke="#f3f6fb" stroke-width="2.5"/><path d="M18,18 H46 M18,28 H46 M18,38 H40" stroke="#7fe3ff" stroke-width="2.5"/><text x="32" y="53" fill="#ffc93c" font-size="10" font-weight="800" text-anchor="middle" font-family="monospace">+6%</text>',
  deals:
    '<path d="M8,30 L30,8 H56 V52 H30 Z" fill="rgba(255,138,196,.35)" stroke="#ff8ac4" stroke-width="2.5" stroke-linejoin="round"/><text x="40" y="36" fill="#f3f6fb" font-size="11" font-weight="800" text-anchor="middle" font-family="monospace">25%</text>',
  error:
    '<rect x="6" y="24" width="52" height="16" rx="2" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="2"/><path d="M14,24 v6 M22,24 v9 M30,24 v6 M38,24 v9 M46,24 v6" stroke="#0a2340" stroke-width="2"/><text x="32" y="56" fill="#f3f6fb" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">±2%</text>',
  boss: '<path d="M12,22 H52 L48,56 H16 Z" fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2.5" stroke-linejoin="round"/><path d="M24,22 V16 a8,8 0 0 1 16,0 V22" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="44" fill="#0a2340" font-size="14" font-weight="800" text-anchor="middle" font-family="monospace">%</text>',
};
