/* Fraction Bakery: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Typed answers can be fractions (5/12 is
   0.416667), so dp and nz are loose; check() holds every fraction to the unit's denominators and recomputes every answer. */
const LOOSE = { dp: 6, nz: 7, max: 48 };
const DEN = [2, 3, 4, 5, 6, 8, 10, 12];
// the text without its markup, with < and > written out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// the value of "3/4"
const value = (text) => {
  const [n, d] = text.split("/").map(Number);
  return n / d;
};
// is "a/b s c/d" true? Cross-multiplying compares them without dividing
const holds = (n1, d1, s, n2, d2) => Math.sign(n1 * d2 - n2 * d1) === { "<": -1, "=": 0, ">": 1 }[s];
module.exports = {
  limits: { parts: LOOSE, lines: LOOSE, equiv: LOOSE, scale: LOOSE, compare: LOOSE, boss: LOOSE },
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
    // every fraction shown uses the unit's denominators
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/\b\d+\/(\d+)\b/g))
      if (!DEN.includes(+d)) bad.push(`${text}: ${d} is not one of the unit's denominators`);
    // every comparison it states is true, and every product and quotient (not the ones written inside a fraction, like
    // 2 × 3 over 5 × 3, which read as "2 × 3/5 × 3" here)
    for (const [text, n1, d1, s, n2, d2] of told.matchAll(/\b(\d+)\/(\d+) ([<=>]) (?=(\d+)\/(\d+)\b)/g))
      if (!holds(+n1, +d1, s, +n2, +d2)) bad.push(`says ${text}${n2}/${d2}`);
    for (const [text, a, b, c] of told.matchAll(/(?<!\/)\b(\d+) × (\d+) = (\d+)\b(?!\/)/g))
      if (a * b !== +c) bad.push(`${text} is wrong`);
    for (const [text, a, b, c] of told.matchAll(/(?<!\/)\b(\d+) ÷ (\d+) = (\d+)\b(?!\/)/g))
      if (a / b !== +c) bad.push(`${text} is wrong`);
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${label} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    let match;
    if (/^Which is true\?/.test(prompt))
      onlyRight((label) => {
        const [, n1, d1, s, n2, d2] = label.match(/(\d+)\/(\d+) ([<=>]) (\d+)\/(\d+)/);
        return holds(+n1, +d1, s, +n2, +d2);
      }, "true");
    if ((match = prompt.match(/^(\d+)\/(\d+) is between which two whole numbers/)))
      onlyRight((label) => {
        const [lo, hi] = label.split(" and ").map(Number);
        return hi === lo + 1 && lo < match[1] / match[2] && match[1] / match[2] < hi;
      }, `around ${match[1]}/${match[2]}`);
    if ((match = prompt.match(/^Is (\d+)\/(\d+) closest to 0, 1\/2, or 1\?/))) {
      const v = match[1] / match[2],
        away = { 0: v, "1/2": Math.abs(v - 0.5), 1: 1 - v };
      onlyRight((label) => away[label] < Math.min(...Object.values(away).filter((a) => a !== away[label])), "closest");
    }
    if ((match = prompt.match(/^Which fraction is equivalent to (\d+\/\d+)\?/)))
      onlyRight((label) => value(label) === value(match[1]), `equivalent to ${match[1]}`);
    if ((match = prompt.match(/^Which fraction is (more|less) than 1\/2\?/)))
      onlyRight((label) => (match[1] === "more" ? value(label) > 0.5 : value(label) < 0.5), `${match[1]} than 1/2`);
    if (/in order from least to greatest/.test(prompt))
      onlyRight((label) => {
        const values = label.split(", ").map(value);
        return values.every((v, i) => i === 0 || values[i - 1] < v);
      }, "least to greatest");
    if (
      /(Who|Which class) eats more\?/.test(prompt) &&
      (match = prompt.match(/^(\w+)(’s class)? eats (\d+\/\d+) of .*\. (\w+)(?:’s class)? eats (\d+\/\d+) of /))
    ) {
      const [, first, cls = "", a, second, b] = match,
        winner = value(a) > value(b) ? first + cls : value(a) < value(b) ? second + cls : "They eat the same amount";
      onlyRight((label) => label === winner, "who eats more");
    }
    // a tap lands on the tick it names, and a point is named by where it is (facts.at)
    if (p.kind === "tap" && (match = prompt.match(/^Tap (\d+)\/\d+ on the number line/)) && p.answer !== match[1])
      bad.push(`tap ${p.answer} for ${match[0]}`);
    if (p.facts && p.facts.at && p.answer !== p.facts.at[0] / p.facts.at[1])
      bad.push(`the point is not at ${p.answer}`);
    // typed answers: ? in an equivalent fraction, and the number both parts were multiplied by
    if (p.kind === "num") {
      if ((match = prompt.match(/(\d+)\/(\d+) = \?\/(\d+)/)) && p.answer !== (match[1] * match[3]) / match[2])
        bad.push(`${match[0]} is not ${p.answer}`);
      if ((match = prompt.match(/(\d+)\/(\d+) = (\d+)\/\?/)) && p.answer !== (match[2] * match[3]) / match[1])
        bad.push(`${match[0]} is not ${p.answer}`);
      if (
        (match = prompt.match(/^(\d+)\/(\d+) = (\d+)\/(\d+)\. What number/)) &&
        !(match[3] / match[1] === p.answer && match[4] / match[2] === p.answer)
      )
        bad.push(`${match[0]} is not × ${p.answer}`);
      if (/What fraction of the \w+ is/.test(prompt) && !(p.answer > 0 && p.answer < 1))
        bad.push(`${p.answer} of the whole`);
      if (/How many \w+ did the class eat/.test(prompt) && !(p.answer > 1 && p.answer < 2))
        bad.push(`ate ${p.answer} of 2 pans`);
    }
    // nobody eats or uses more than the whole pan or bag
    for (const [text, n, d] of prompt.matchAll(/\b(\d+)\/(\d+) of (?:a|the|another|it)\b/g))
      if (+n >= +d) bad.push(`${text}: all of it or more`);
    return bad;
  },
};
