/* Rocket Lab: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Decimals stay in tenths and hundredths, and
   whole numbers within 1,000,000 with few nonzero digits. check() works every answer out again from the prompt (or the facts
   a number line problem carries), checks every sum, difference, and product it states, and keeps the standard algorithm to at
   most one trade. */
const DECIMAL = { dp: 2, nz: 3, max: 100 };
// the text without its markup, with < and > written out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// a number as written: "45,302", "0.38", "3/4", or "$0.45"
const value = (text) => {
  const t = text.replace(/[$,]/g, "");
  if (t.includes("/")) {
    const [n, d] = t.split("/").map(Number);
    return n / d;
  }
  return +t;
};
const NUMBER = String.raw`\$?\d[\d,]*(?:\.\d+)?(?:\/\d+)?`,
  EXPR = String.raw`${NUMBER}(?: [+−×] ${NUMBER})*`;
// the value of an expression like "2 × 10,000" or "300 + 40 + 5": × before + and −
const evaluate = (expr) =>
  expr
    .split(/ (?=[+−] )/)
    .map((part) => {
      const product = part
        .replace(/^[+−] /, "")
        .split(" × ")
        .map(value)
        .reduce((x, y) => x * y, 1);
      return part.startsWith("− ") ? -product : product;
    })
    .reduce((x, y) => x + y, 0);
const near = (x, y) => Math.abs(x - y) < 1e-9;
// n rounded to the nearest unit, halfway up
const roundTo = (n, unit) => Math.floor(n / unit + 0.5) * unit;
// "forty thousand six hundred five" as a number
const WORDS = {
  ...Object.fromEntries(
    "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen"
      .split(" ")
      .map((w, i) => [w, i]),
  ),
  ...Object.fromEntries(
    "twenty thirty forty fifty sixty seventy eighty ninety".split(" ").map((w, i) => [w, 20 + 10 * i]),
  ),
};
function fromWords(text) {
  let total = 0,
    group = 0;
  for (const word of text.split(/[\s-]+/)) {
    if (word === "hundred") group *= 100;
    else if (word === "thousand") {
      total += group * 1000;
      group = 0;
    } else if (word in WORDS) group += WORDS[word];
    else return NaN;
  }
  return total + group;
}
// how many trades a − b takes, trading from the nearest nonzero place on the left (zeros in between become 9s, in the same trade)
function tradesToSubtract(a, b) {
  const top = [...String(a)].reverse().map(Number),
    bottom = [...String(b)].reverse().map(Number);
  let count = 0;
  for (let i = 0; i < top.length; i++) {
    if (top[i] >= (bottom[i] || 0)) continue;
    let j = i + 1;
    while (top[j] === 0) j++;
    top[j]--;
    for (let k = i + 1; k < j; k++) top[k] = 9;
    top[i] += 10;
    count++;
  }
  return count;
}
// how many columns of a + b make 10 or more
function carriesToAdd(a, b) {
  let count = 0,
    carry = 0;
  for (let e = 0; 10 ** e <= Math.max(a, b); e++) {
    carry = (Math.floor(a / 10 ** e) % 10) + (Math.floor(b / 10 ** e) % 10) + carry >= 10 ? 1 : 0;
    count += carry;
  }
  return count;
}
module.exports = {
  limits: {
    decimals: DECIMAL,
    lines: DECIMAL,
    place: { dp: 0, nz: 4, max: 999999 },
    times: { dp: 0, nz: 2, max: 1000000 },
    round: { dp: 0, nz: 4, max: 1000000 },
    algorithm: { dp: 0, nz: 5, max: 999999 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => plain(c.label));
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and the right choice
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((mistake) => mistake[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, message]) => message),
      right,
    ]
      .map(plain)
      .join(" ");
    // every equation it states is true, all along a chain like 3/4 = 75/100 = 0.75 (not part of one with a ? in it)
    for (const [chain] of told.matchAll(
      new RegExp(String.raw`(?<![\d\/.,?+−×] ?)${EXPR}(?: = ${EXPR})+(?![\d\/]|[.,]\d)`, "g"),
    )) {
      const sides = chain.split(" = ").map(evaluate);
      if (!sides.every((v) => near(v, sides[0]))) bad.push(`says ${chain}`);
    }
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    let match;
    if (/^Which is true\?/.test(prompt))
      onlyRight((label) => {
        const [, a, s, b] = label.match(new RegExp(String.raw`(${NUMBER}) ([<=>]) (${NUMBER})`)),
          diff = value(a) - value(b);
        return s === "=" ? near(diff, 0) : s === "<" ? diff < -1e-9 : diff > 1e-9;
      }, "true");
    if ((match = prompt.match(/^Which decimal is equal to ([\d.]+)\?/)))
      onlyRight((label) => near(value(label), value(match[1])), `equal to ${match[1]}`);
    if (/in order from least to greatest/.test(prompt))
      onlyRight((label) => {
        const values = label.split(label.includes("; ") ? "; " : ", ").map(value);
        return values.every((v, i) => i === 0 || values[i - 1] < v);
      }, "least to greatest");
    if ((match = prompt.match(/^Which number is 10 times as much as ([\d,]+)\?/)))
      onlyRight((label) => value(label) === 10 * value(match[1]), "10 times as much");
    if (
      (match = prompt.match(/^Which number rounds to ([\d,]+) when you round to the nearest (thousand|ten thousand)\?/))
    ) {
      const unit = match[2] === "thousand" ? 1000 : 10000;
      onlyRight((label) => roundTo(value(label), unit) === value(match[1]), `rounded to ${match[1]}`);
    }
    // typed answers, worked out again: want(v, what) when the answer should be v
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    if (p.kind === "num") {
      if ((match = prompt.match(/^Write (\d+)\/(10|100) as a decimal/))) want(match[1] / match[2], "as a decimal");
      if ((match = prompt.match(/^What is the value of the (\d) in ([\d,]+)\?/))) {
        const digits = match[2].replace(/,/g, "");
        if (digits.split(match[1]).length !== 2) bad.push(`${match[1]} appears more than once in ${match[2]}`);
        want(+match[1] * 10 ** (digits.length - 1 - digits.indexOf(match[1])), "value of a digit");
      }
      if ((match = prompt.match(/^Write ([\d,+ ]+) as one number/)))
        want(
          match[1]
            .split(" + ")
            .map(value)
            .reduce((x, y) => x + y),
          "expanded form",
        );
      if ((match = prompt.match(/reads “([a-z -]+)\.”/))) want(fromWords(match[1]), "number words");
      if ((match = prompt.match(/^What number is (\d+) (thousands|ten-thousands)\?/)))
        want(match[1] * (match[2] === "thousands" ? 1000 : 10000), "thousands");
      if (
        (match = prompt.match(
          /flies ([\d,]+) kilometers on its first test\. On the big launch it flies 10 times as far/,
        ))
      )
        want(10 * value(match[1]), "ten times as far");
      if ((match = prompt.match(/^How many times as much is ([\d,]+) as ([\d,]+)\?/)))
        want(value(match[1]) / value(match[2]), "times as much");
      if (
        (match = prompt.match(
          /climbs to ([\d,]+) meters\. Round that to the nearest (thousand|ten thousand|hundred thousand)\./,
        ))
      )
        want(
          roundTo(value(match[1]), { thousand: 1000, "ten thousand": 10000, "hundred thousand": 100000 }[match[2]]),
          "rounding",
        );
      if ((match = prompt.match(/with (\d+) dimes? and (\d+) penn/))) want((10 * match[1] + +match[2]) / 100, "coins");
      if ((match = prompt.match(/is (\d+) centimeters tall\. 100 centimeters make 1 meter/)))
        want(match[1] / 100, "meters");
      if (p.facts && p.facts.hundredths !== undefined) want(p.facts.hundredths / 100, "the shaded grid");
      if (p.facts && p.facts.at !== undefined)
        want(/What decimal/.test(prompt) ? p.facts.at / 100 : p.facts.at, "the point on the line");
      // the standard algorithm: the story's two numbers, added or subtracted, with at most one trade
      const numbers = [...prompt.matchAll(/\d[\d,]*/g)].map((m) => value(m[0]));
      if (/in all\?|in all$/.test(prompt) && numbers.length === 2) {
        want(numbers[0] + numbers[1], "sum");
        if (carriesToAdd(...numbers) > 1) bad.push(`${numbers.join(" + ")} carries more than once`);
      }
      if (/still have to go|are left\?|rest of the year/.test(prompt) && numbers.length === 2) {
        want(numbers[0] - numbers[1], "difference");
        if (tradesToSubtract(...numbers) > 1) bad.push(`${numbers.join(" − ")} trades more than once`);
      }
    }
    // a tap lands on the decimal it names
    if (
      p.kind === "tap" &&
      (match = prompt.match(/^Tap ([\d.]+) on the number line/)) &&
      +p.answer !== Math.round(match[1] * 100)
    )
      bad.push(`tap ${p.answer} for ${match[1]}`);
    return bad;
  },
};
