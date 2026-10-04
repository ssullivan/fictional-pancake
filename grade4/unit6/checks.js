/* City Builders: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. check() works every answer out again from the
   facts each problem carries, checks that those numbers are the ones in the prompt, and checks every product, sum,
   difference, and quotient the game states. */
// the text without its markup, with numbers' commas taken out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/(\d),(?=\d{3})/g, "$1");
const near = (x, y) => Math.abs(x - y) < 1e-9;
// n split into its places, leaving out zeros, as shared/multiply.js does
const placeParts = (n) => [...String(n)].map((d, i, all) => +d * 10 ** (all.length - 1 - i)).filter((p) => p > 0);
module.exports = {
  limits: {
    patterns: { dp: 0, nz: 3, max: 400 },
    multiply: { dp: 0, nz: 4, max: 90000 },
    twodigit: { dp: 0, nz: 4, max: 1500 },
    standard: { dp: 0, nz: 4, max: 90000 },
    divide: { dp: 0, nz: 3, max: 2500 },
    remainder: { dp: 0, nz: 2, max: 99 },
    solve: { dp: 0, nz: 4, max: 6000 },
  },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      f = p.facts || {},
      prompt = plain(p.prompt),
      numbers = [...prompt.matchAll(/\d+/g)].map((m) => +m[0]),
      labels = (p.choices || []).map((c) => plain(c.label)),
      right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    const shows = (...values) =>
      values.forEach((v) => {
        if (!numbers.includes(v)) bad.push(`the prompt doesn't show ${v}`);
      });
    const want = (v, what) => {
      if (!near(p.answer, v)) bad.push(`${what}: ${p.answer} should be ${v}`);
    };
    // exactly the right choice fits
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    const inPattern = (v) => v >= f.start && (v - f.start) % f.add === 0;
    switch (f.t) {
      case "nth":
        shows(f.start, f.add, f.start + f.add);
        want(f.start + (f.n - 1) * f.add, "nth number");
        break;
      case "inPattern":
        shows(f.start, f.add);
        onlyRight((label) => inPattern(+label), "in the pattern");
        break;
      case "repeat":
        if (right !== f.pattern[(f.n - 1) % f.pattern.length]) bad.push(`flag ${f.n} is not ${right}`);
        break;
      case "parity":
        shows(f.start, f.add);
        if (right !== (f.add % 2 ? "Odd and even, taking turns" : f.start % 2 ? "All odd" : "All even"))
          bad.push(`${right} is wrong`);
        break;
      case "product":
        shows(f.a, f.b);
        want(f.a * f.b, "product");
        break;
      case "split":
        shows(f.a, f.b);
        if (
          right !==
          placeParts(f.a)
            .map((part) => `${f.b} × ${part}`)
            .join(" + ")
        )
          bad.push(`${right} doesn't split by place`);
        break;
      case "partials": {
        shows(f.a, f.b);
        const all = placeParts(f.b).flatMap((r) => placeParts(f.a).map((c) => r * c));
        if (right !== all.join(" + ")) bad.push(`${right} are not the partial products`);
        onlyRight((label) => label.split(" + ").reduce((x, y) => x + +y, 0) === f.a * f.b, `adding to ${f.a * f.b}`);
        break;
      }
      case "carry":
        shows(f.a, f.b);
        want(Math.floor(((f.a % 10) * f.b) / 10), "carry");
        break;
      case "quotient":
        shows(f.n, f.d);
        want(f.n / f.d, "quotient");
        if (f.n % f.d) bad.push("doesn't divide evenly");
        break;
      case "side":
        shows(f.area, f.width);
        want(f.area / f.width, "missing side");
        break;
      case "remainder": {
        shows(f.n, f.d);
        const q = Math.floor(f.n / f.d),
          r = f.n % f.d;
        if (!r) bad.push("no remainder");
        want({ up: q + 1, down: q, left: r }[f.use], `remainder (${f.use})`);
        break;
      }
      case "divmod":
        shows(f.n, f.d);
        if (right !== `${Math.floor(f.n / f.d)} R ${f.n % f.d}`) bad.push(`${right} is wrong`);
        break;
      case "twoStep":
        shows(f.a, f.b, f.minus);
        want(f.a * f.b - f.minus, "two steps");
        break;
      case "twoStepDivide":
        shows(f.a, f.b, f.d);
        want((f.a * f.b) / f.d, "two steps");
        break;
      case "reasonable": {
        shows(f.a, f.b, f.claim);
        const isRight = f.a * f.b === f.claim;
        if (
          right !==
          (isRight ? right && right.startsWith("Yes: it’s close") && right : right && right.startsWith("No:") && right)
        )
          bad.push(`${right} for ${f.a} × ${f.b} = ${f.claim}`);
        break;
      }
      default:
        bad.push("no facts for checks.js");
    }
    // every product, sum, difference, and quotient it states is true (not one with a remainder, like 21 ÷ 9 = 2 R 3)
    const told = [p.hint, p.explain, ...(p.misc || []).map((m) => m[1]), ...Object.values(p.why || {})]
      .map(plain)
      .join(" ");
    for (const [text, a, op, b, c] of told.matchAll(/(?<![\d+−×÷] ?)\b(\d+) ([+−×÷]) (\d+) = (\d+)\b(?! [+−×÷]| R)/g)) {
      const result = op === "+" ? +a + +b : op === "−" ? a - b : op === "×" ? a * b : a / b;
      if (result !== +c) bad.push(`says ${text}`);
    }
    return bad;
  },
};
