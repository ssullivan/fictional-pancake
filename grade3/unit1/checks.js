/* Orchard Market: limits and real-world checks for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most
   nonzero digits, max = largest value, for the answer and every number in the prompt. Everything stays within 100. */
const LIMITS = { dp: 0, nz: 2, max: 100 };
// the text without its markup
const plain = (html) => String(html).replace(/<[^>]*>/g, "");
// things with a fixed count, and the most that fit in one group of the others
const FIXED = { spiders: 8, cars: 4, tricycles: 3, hands: 5, cows: 4, ants: 6 };
const MOST = { apples: 10, oranges: 10, peaches: 10, flowers: 10, strawberries: 10, "juice boxes": 8 };
// arrays that only come in some sizes
const SIZES = { muffins: ["2 × 6", "3 × 4", "4 × 6"], eggs: ["2 × 6"] };
module.exports = {
  limits: { pics: LIMITS, bars: LIMITS, groups: LIMITS, equations: LIMITS, arrays: LIMITS, flip: LIMITS, boss: LIMITS },
  // what's wrong with problem p in the real world (an empty list when nothing is)
  check(p) {
    const bad = [],
      prompt = plain(p.prompt),
      labels = (p.choices || []).map((c) => c.label);
    const right = p.kind === "mc" ? labels[p.choices.findIndex((c) => c.id === p.answer)] : null;
    // what the game tells a student: the prompt, hint, worked answer, the message for each mistake, and the right choice
    const told = [
      p.prompt,
      p.hint,
      p.explain,
      ...(p.misc || []).map((m) => m[1]),
      ...Object.entries(p.why || {})
        .filter(([id]) => id !== String(p.answer))
        .map(([, m]) => m),
      right,
    ]
      .map(plain)
      .join(" ");
    // every product it states is right, and factors stay within 10 (a wrong choice can show a total as a factor, like 24 × 3 = ?)
    for (const [text, a, b, c] of told.matchAll(/\b(\d+) × (\d+) = (\d+)\b(?! ×)/g))
      if (a * b !== +c) bad.push(`${text} is wrong`);
    for (const [text, a, b, c] of told.matchAll(/(?<!× )\b(\d+) = (\d+) × (\d+)\b/g))
      if (b * c !== +a) bad.push(`${text} is wrong`);
    for (const [text, a, b] of told.matchAll(/\b(\d+) × (\d+)\b/g))
      if (+a > 10 || +b > 10 || a * b > 100) bad.push(`${text} is past 10 × 10`);
    // an equation with an unknown is true with the answer in it
    let match;
    if (p.kind === "num" && (match = prompt.match(/(\d+|\?) × (\d+|\?) = (\d+|\?)$/))) {
      const [a, b, c] = match.slice(1).map((v) => (v === "?" ? p.answer : +v));
      if (a * b !== c) bad.push(`${match[0]} is not true with ${p.answer}`);
    }
    // graphs use a scale of 2, 5, or 10
    for (const [text, scale] of prompt.matchAll(/Each picture shows (\d+)/g))
      if (![2, 5, 10].includes(+scale)) bad.push(`${text}: not a scale of 2, 5, or 10`);
    // things with a fixed count have it, and groups aren't overfull
    for (const [text, , what, n] of prompt.matchAll(/(\d+) (spiders|cars|tricycles|hands|cows|ants) with (\d+)/g))
      if (FIXED[what] !== +n) bad.push(`${text}: ${what} don't have ${n}`);
    for (const [text, n, what] of prompt.matchAll(
      /(\d+) (apples|oranges|peaches|flowers|strawberries|juice boxes) (?:in|on) each/g,
    ))
      if (+n > MOST[what]) bad.push(`${text}: too many in one`);
    if (
      (match = prompt.match(/has (\d+) rows, with (\d+) (muffins|eggs) in each row/)) &&
      !SIZES[match[3]].includes(`${match[1]} × ${match[2]}`)
    )
      bad.push(`no pan or carton is ${match[1]} × ${match[2]}`);
    // mc answers: exactly the right choice fits. onlyRight(fits, what): fits(label) holds for the right choice and no other;
    // what says what fitting means
    const onlyRight = (fits, what) =>
      labels.forEach((label, i) => {
        if (fits(label) !== (p.choices[i].id === p.answer))
          bad.push(`${plain(label).slice(0, 40)} ${fits(label) ? "is" : "is not"} ${what}`);
      });
    if (/Which scale is best/.test(prompt)) {
      const counts = [...prompt.split(":")[1].matchAll(/(\d+)/g)].map((x) => +x[1]),
        best = [10, 5, 2].find((scale) => counts.every((x) => x % scale === 0));
      onlyRight((label) => +label.match(/\d+/)[0] === best, `the best scale for ${counts}`);
    }
    if ((match = prompt.match(/^There are (\d+) \w+ with (\d+) .* Which expression matches\?/)))
      onlyRight((label) => label === `${match[1]} × ${match[2]}`, `${match[1]} groups of ${match[2]}`);
    if ((match = prompt.match(/^There are (\d+) \w+ with (\d+) .* Which diagram matches\?/)))
      onlyRight(
        (label) => label.includes(`aria-label="Tape diagram: ${match[1]} equal parts of ${match[2]}"`),
        `${match[1]} groups of ${match[2]}`,
      );
    if (/Which expression matches this array\?/.test(prompt)) {
      const [, rows, cols] = plain(right).match(/(\d+) × (\d+)/) || [];
      if (!p.fig(false).includes(`An array: ${rows} rows with ${cols} in each row`))
        bad.push(`${plain(right)} doesn't match the array`);
      onlyRight((label) => /^\d+ × \d+$/.test(label), "the array’s expression");
    }
    if ((match = prompt.match(/Which array shows (\d+) × (\d+)/)))
      onlyRight(
        (label) => label.includes(`An array: ${match[1]} rows with ${match[2]} in each row`),
        `${match[1]} rows of ${match[2]}`,
      );
    if ((match = prompt.match(/This array has (\d+) rows of (\d+)\. Which array is the same one turned/)))
      onlyRight(
        (label) => label.includes(`An array: ${match[2]} rows with ${match[1]} in each row`),
        "the array turned",
      );
    if ((match = prompt.match(/knows (\d+) × (\d+) = (\d+)\. Which equation is also true\?/)))
      onlyRight((label) => {
        const [, a, b, c] = label.match(/(\d+) × (\d+) = (\d+)/);
        return a * b === +c && a === match[2] && b === match[1];
      }, "the turnaround");
    if (/Which equation matches\?/.test(prompt))
      onlyRight((label) => {
        // the right equation for the story: groups × in each = total, with the unknown where the story's question is
        const unknown = /How many (?:\w+ )*go (?:in|on) each/.test(prompt)
          ? "n"
          : /How many \w+ does \w+ fill/.test(prompt)
            ? "g"
            : "p";
        return unknown === "p"
          ? /^\d+ × \d+ = \?$/.test(label)
          : unknown === "n"
            ? /^\d+ × \? = \d+$/.test(label)
            : /^\? × \d+ = \d+$/.test(label);
      }, "the equation for the story");
    return bad;
  },
};
