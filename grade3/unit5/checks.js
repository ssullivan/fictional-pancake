/* Fraction Farm: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero
   digits, max = largest value, for the answer and every number in the prompt. Typed answers can be fractions (1/3 is
   0.333333), so dp and nz are loose; check() holds every fraction to the unit's denominators and works every answer out again. */
const LOOSE = { dp: 6, nz: 7, max: 24 };
const DENS = [2, 3, 4, 6, 8];
const PARTS = { 2: "halves", 3: "thirds", 4: "fourths", 6: "sixths", 8: "eighths" };
// the text without its markup, with < and > written out
const plain = (html) =>
  String(html)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
// the value of "3/4", or of a whole number
const value = (text) => {
  const [n, d = 1] = text.split("/").map(Number);
  return n / d;
};
// is "a/b s c/d" true? Cross-multiplying compares them without dividing
const holds = (n1, d1, s, n2, d2) => Math.sign(n1 * d2 - n2 * d1) === { "<": -1, "=": 0, ">": 1 }[s];
// where fracLine puts v (in wholes) on a line from 0 to `wholes`: 26 pixels in from each end of 480
const lineX = (v, wholes = 1) => 26 + (v * 428) / wholes;
// the dots fracLine draws in a picture, as their x positions
const dotsIn = (svg) => [...String(svg).matchAll(/<circle class="pt[^"]*" cx="([\d.]+)"/g)].map((m) => +m[1]);
const near = (x, y) => Math.abs(x - y) < 0.01;

module.exports = {
  limits: { parts: LOOSE, build: LOOSE, line: LOOSE, wholes: LOOSE, equivalent: LOOSE, compare: LOOSE, boss: LOOSE },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      facts = p.facts || {},
      raw = (p.choices || []).map((c) => c.label),
      labels = raw.map(plain),
      fig = p.fig ? p.fig(false) : "",
      shown = p.fig ? p.fig(true) : "";
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
    // every fraction shown uses the unit's denominators, and every comparison or equation it states is true
    for (const [text, d] of [told, ...labels].join(" ").matchAll(/(?:\b\d+|\?)\/(\d+)\b/g))
      if (!DENS.includes(+d)) bad.push(`${text}: ${d} is not one of the unit's denominators`);
    for (const [text, n1, d1, s, n2, d2] of told.matchAll(/\b(\d+)\/(\d+) ([<=>]) (?=(\d+)\/(\d+)\b)/g))
      if (!holds(+n1, +d1, s, +n2, +d2)) bad.push(`says ${text}${n2}/${d2}`);
    for (const [text, n, d, whole] of told.matchAll(/\b(\d+)\/(\d+) = (\d+)\b(?!\/)/g))
      if (n / d !== +whole) bad.push(`${text} is wrong`);
    for (const [text, whole, n, d] of told.matchAll(/(?<!\/)\b(\d+) = (\d+)\/(\d+)\b/g))
      if (n / d !== +whole) bad.push(`${text} is wrong`);
    if (/\b(he|she|his|her|him)\b/i.test(told)) bad.push("a student gets a gendered pronoun");
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label, i) holds for the right choice and no other
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label, i) !== (p.choices[i].id === p.answer))
          bad.push(`${(label || raw[i]).slice(0, 60)} ${fits(label, i) ? "is" : "is not"} ${what}`);
      });
    // the aria-label of choice i's picture
    const pictureOf = (i) => (raw[i].match(/aria-label="([^"]*)"/) || [])[1] || "";
    // the answer worked out again from the fractions the problem was made from, and those are the picture's
    const { k, d } = facts;
    if (facts.t === "slice") {
      if (p.answer !== 1 / d) bad.push(`1 slice is 1/${d}`);
      if (!fig.includes(`cut into ${d} equal parts, 1 shaded`)) bad.push("the picture isn't the slices");
    }
    if (facts.t === "equal")
      onlyRight((label, i) => pictureOf(i).includes(`cut into ${d} equal parts`), `cut into ${PARTS[d]}`);
    if (facts.t === "name") {
      if (!fig.includes(`cut into ${d} equal parts`)) bad.push("the picture isn't the parts");
      onlyRight((label) => label.toLowerCase() === PARTS[d], `the name of ${d} equal parts`);
    }
    if (facts.t === "unitCompare") {
      const { d1, d2, first, second } = facts,
        bigger = d1 < d2 ? first : second;
      if (d1 === d2) bad.push("the slices are the same");
      if (!prompt.includes(`${first} gets 1/${d1}`) || !prompt.includes(`${second} gets 1/${d2}`))
        bad.push("the prompt isn't the slices");
      onlyRight((label) => label === bigger, "the bigger slice");
    }
    if (facts.t === "shaded" || facts.t === "days" || facts.t === "point" || facts.t === "trail") {
      if (p.answer !== k / d || !(k > 0 && k < d)) bad.push(`the answer should be ${k}/${d}, less than 1`);
      if (facts.t === "shaded" && !fig.includes(`cut into ${d} equal parts, ${k} shaded`))
        bad.push("the strip isn't it");
      if (facts.t === "days" && !shown.includes(`cut into ${d} equal parts, ${k} shaded`))
        bad.push("the hint isn't it");
      if ((facts.t === "point" || facts.t === "trail") && !near(dotsIn(fig)[0], lineX(k / d)))
        bad.push(`the point isn't at ${k}/${d}`);
      if (facts.t === "days" && !prompt.includes(`after ${k} days`)) bad.push("the story isn't the days");
      if (facts.t === "trail" && !prompt.includes(`to sign ${k}.`)) bad.push("the story isn't the sign");
    }
    if (facts.t === "count" || facts.t === "jumps")
      if (p.answer !== k || !(k > 0 && k < d)) bad.push(`it takes ${k} parts of 1/${d}`);
    if (facts.t === "picture")
      onlyRight((label, i) => pictureOf(i).includes(`cut into ${d} equal parts, ${k} shaded`), `${k}/${d} shaded`);
    if (facts.t === "tap" || facts.t === "tapPast") {
      const [lo, hi] = facts.t === "tap" ? [0, d] : [d, 2 * d];
      if (p.answer !== String(k) || !(k > lo && k < hi)) bad.push(`tap ${k}/${d}`);
      if (!fig.includes(`data-id="${k}"`)) bad.push("no tick to tap");
      if (!prompt.includes(`Tap ${k}/${d}`)) bad.push("the prompt isn't the fraction");
    }
    if (facts.t === "past") {
      if (p.answer !== k / d || !(k > d && k < 2 * d)) bad.push(`the answer should be ${k}/${d}, between 1 and 2`);
      if (!near(dotsIn(fig)[0], lineX(k / d, 2))) bad.push(`the point isn't at ${k}/${d}`);
    }
    if (facts.t === "toWhole") {
      const { n } = facts;
      if (p.answer !== n / d || n % d) bad.push(`${n}/${d} is ${n / d}`);
      if (!near(dotsIn(fig)[0], lineX(n / d, 3))) bad.push(`the point isn't at ${n}/${d}`);
    }
    if (facts.t === "isWhole") onlyRight((label) => value(label) === facts.whole, `equal to ${facts.whole}`);
    if (facts.t === "missingTop" || facts.t === "tapEquiv") {
      const { a, b, c } = facts,
        answer = (a * c) / b;
      if (!Number.isInteger(answer)) bad.push(`${a}/${b} isn't a whole number of ${PARTS[c]}`);
      if (String(p.answer) !== String(answer)) bad.push(`${a}/${b} = ${answer}/${c}`);
      if (facts.t === "missingTop" && !prompt.includes(`${a}/${b} = ?/${c}`)) bad.push("the prompt isn't the equation");
      if (facts.t === "tapEquiv" && !near(dotsIn(fig)[0], lineX(a / b))) bad.push(`the point isn't at ${a}/${b}`);
    }
    if (facts.t === "whichEquiv")
      onlyRight((label) => value(label) === facts.a / facts.b, `equivalent to ${facts.a}/${facts.b}`);
    if (facts.t === "wholeAs") {
      if (p.answer !== facts.whole * d) bad.push(`${facts.whole} = ${facts.whole * d}/${d}`);
      if (!near(dotsIn(fig)[0], lineX(facts.whole, 3))) bad.push(`the point isn't at ${facts.whole}`);
    }
    if (facts.t === "sign") {
      const [[n1, d1], [n2, d2]] = [facts.a, facts.b];
      if (!(n1 > 0 && n1 <= d1 && n2 > 0 && n2 <= d2)) bad.push("a fraction is 0 or more than 1 whole");
      if (!prompt.includes(`${n1}/${d1}`) || !prompt.includes(`${n2}/${d2}`))
        bad.push("the prompt isn't the fractions");
      onlyRight((label) => {
        const [, a1, b1, s, a2, b2] = label.match(/(\d+)\/(\d+) ([<=>]) (\d+)\/(\d+)/);
        return holds(+a1, +b1, s, +a2, +b2);
      }, "true");
    }
    if (facts.t === "farther") {
      const { one, two, first, second } = facts,
        s = Math.sign(one[0] * two[1] - two[0] * one[1]);
      if (s === 0) bad.push("they ran the same distance");
      onlyRight((label) => label === (s > 0 ? first : second), "who runs farther");
      const dots = dotsIn(fig);
      if (!near(dots[0], lineX(one[0] / one[1])) || !near(dots[1], lineX(two[0] / two[1])))
        bad.push("the points aren't the runs");
    }
    // nobody eats, plants, or picks more than the whole
    for (const [text, n, dd] of prompt.matchAll(/\b(\d+)\/(\d+) of (?:a|an|the|another)\b/g))
      if (+n > +dd) bad.push(`${text}: more than all of it`);
    return bad;
  },
};
