/* Camp Fraction: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Typed answers can be fractions (5/12 is
   0.416667), so dp and nz are loose; check() holds every fraction to the unit's denominators, checks every equation the game
   states, and recomputes every answer from the prompt. */
const LOOSE = { dp: 6, nz: 7, max: 100 };
const DEN = [2, 3, 4, 5, 6, 8, 10, 12, 100];
// The value of an expression like "3 × 2/5", "1/4 + 2/4", "2 1/4", or "7": × before + and −, mixed numbers as one term
const TERM = String.raw`(?:\d+ \d+\/\d+|\d+\/\d+|\d+)`;
const EXPR = String.raw`${TERM}(?: [+−×] ${TERM})*`;
function evaluate(expr) {
  const term = (t) => {
    const mixed = t.match(/^(\d+) (\d+)\/(\d+)$/),
      fraction = t.match(/^(\d+)\/(\d+)$/);
    return mixed ? +mixed[1] + mixed[2] / mixed[3] : fraction ? fraction[1] / fraction[2] : +t;
  };
  /* split into terms added or subtracted; each is a product of factors */
  return expr
    .split(/ (?=[+−] )/)
    .map((part) => {
      const negative = part.startsWith("− "),
        product = part
          .replace(/^[+−] /, "")
          .split(" × ")
          .map(term)
          .reduce((x, y) => x * y, 1);
      return negative ? -product : product;
    })
    .reduce((x, y) => x + y, 0);
}
// The text without its markup. A stacked fraction whose top or bottom is a calculation (2 × 3 over 5) is written as its value.
const plain = (html) =>
  String(html)
    .replace(
      /<span class="fr"><span>([^<]*)<\/span><span class="sr">\/<\/span><span>([^<]*)<\/span><\/span>/g,
      (whole, top, bottom) => `${/ /.test(top) ? evaluate(top) : top}/${/ /.test(bottom) ? evaluate(bottom) : bottom}`,
    )
    .replace(/<[^>]*>/g, "");
const near = (x, y) => Math.abs(x - y) < 1e-9;
module.exports = {
  limits: { unit: LOOSE, any: LOOSE, add: LOOSE, subtract: LOOSE, plot: LOOSE, tenths: LOOSE, boss: LOOSE },
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
    // every equation it states is true, all along a chain like 9/4 = 2 1/4 (not part of one with a ? in it)
    for (const [chain] of told.matchAll(new RegExp(String.raw`(?<![\d/×+−?] ?)${EXPR}(?: = ${EXPR})+(?![\d/])`, "g"))) {
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
    if ((match = prompt.match(/fills a 1\/(\d+)-cup scoop with \w+ (\d+) times\. Which expression/)))
      onlyRight((label) => label === `${match[2]} × 1/${match[1]}`, `${match[2]} scoops of 1/${match[1]}`);
    if ((match = prompt.match(new RegExp(String.raw`^Which expression has the same value as (${EXPR})\?`))))
      onlyRight((label) => near(evaluate(label), evaluate(match[1])), `worth ${match[1]}`);
    if ((match = prompt.match(/^Which (?:sum|fraction) is equal to (\d+\/\d+)\?/)))
      onlyRight((label) => near(evaluate(label), evaluate(match[1])), `equal to ${match[1]}`);
    if (/is the most common\?/.test(prompt) && p.facts) {
      const { counts, d } = p.facts,
        most = Object.keys(counts).find((v) => counts[v] === Math.max(...Object.values(counts)));
      onlyRight((label) => near(evaluate(label.replace(/ inch(es)?$/, "")) * d, +most), "the most common");
    }
    // typed answers, worked out again from the prompt: want(value, what) when the answer should be value
    const want = (value, what) => {
      if (!near(p.answer, value)) bad.push(`${what}: ${p.answer} should be ${value}`);
    };
    if (p.kind === "num") {
      if ((match = prompt.match(/1\/(\d+)-cup scoop for the \w+\. \w+ fills it (\d+) times/)))
        want(match[2] / match[1], "scoops");
      if ((match = prompt.match(/needs (\d+) cups of \w+\. \w+ has only a 1\/(\d+)-cup scoop/)))
        want(match[1] * match[2], "scoops to fill");
      if ((match = prompt.match(/(\d+)\/(\d+) (?:cup|liter|mile|meter)s?\b.*?(\d+) (?:bags|bottles|times|tents)\b/)))
        want((match[3] * match[1]) / match[2], "equal groups");
      if ((match = prompt.match(/^\? × (\d+)\/(\d+) = (\d+)\/\2\./))) want(match[3] / match[1], "missing factor");
      if ((match = prompt.match(/hikes (\d+)\/(\d+) miles? to [\w ]+, then (\d+)\/\2 miles? more/)))
        want((+match[1] + +match[3]) / match[2], "hike");
      if (
        (match = prompt.match(
          new RegExp(String.raw`is (${TERM}) miles\. The trail from there to [\w ]+ is (${TERM}) miles`),
        ))
      )
        want(evaluate(match[1]) + evaluate(match[2]), "two trails");
      if ((match = prompt.match(/has (\d+)\/(\d+) liters? in it\. \w+ drinks (\d+)\/\2 liter/))) {
        want((match[1] - match[3]) / match[2], "water left");
        if (+match[1] > +match[2]) bad.push("a water bottle holds more than 1 liter");
      }
      if (
        (match = prompt.match(new RegExp(String.raw`trip is (${TERM}) miles?\. The canoes have gone (\d+\/\d+) mile`)))
      )
        want(evaluate(match[1]) - evaluate(match[2]), "canoe trip left");
      if ((match = prompt.match(new RegExp(String.raw`^(\d+\/\d+) \+ \? = (${TERM})\.`))))
        want(evaluate(match[2]) - evaluate(match[1]), "missing addend");
      if ((match = prompt.match(/is (\d+)\/(\d+) inch tall\. \w+’s is (\d+)\/\2 inch tall/))) {
        want((match[1] - match[3]) / match[2], "how much taller");
        if (+match[1] <= +match[3]) bad.push("the taller plant is not taller");
      }
      if ((match = prompt.match(/^(\d+)\/10 = \?\/100/))) want(10 * match[1], "tenths as hundredths");
      if ((match = prompt.match(/^(\d+)\/10 \+ (\d+)\/100 = \?\/100/)))
        want(10 * match[1] + +match[2], "tenths + hundredths");
      if ((match = prompt.match(/with (\d+) dimes? and (\d+) penn/)))
        want((10 * match[1] + +match[2]) / 100, "dimes and pennies");
      // line plots, from the counts they carry: the spread, the total at one value, and how many are past a value
      if (p.facts && p.facts.counts) {
        const { counts, d } = p.facts,
          values = Object.keys(counts).map(Number),
          length = (text) => evaluate(text) * d;
        if (/How much (?:longer is the longest|more snow fell on the snowiest)/.test(prompt))
          want((Math.max(...values) - Math.min(...values)) / d, "longest − shortest");
        if ((match = prompt.match(new RegExp(String.raw`(?:that are|On \d+ days,) (${TERM}) inch`))))
          want((counts[length(match[1])] * length(match[1])) / d, "total at one value");
        if ((match = prompt.match(new RegExp(String.raw`(?:longer than|more than) (${TERM}) inch`))))
          want(
            values.filter((v) => v > length(match[1])).reduce((n, v) => n + counts[v], 0),
            "how many are longer",
          );
      }
      if (p.unit === "cups" || p.unit === "cup") if (p.answer > 4) bad.push(`${p.answer} cups is a lot for one recipe`);
    }
    return bad;
  },
};
