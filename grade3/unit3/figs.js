/* Pictures and words that Grade 3 Unit 3's game and its Learn pages both use. Needs util.js (roundTo), figures.js (svgWrap),
   and blocks.js (digits); the digits are drawn with the standard algorithm's styles in shared/blocks.css.

   placeValues(n)                    what each digit of n is worth, hundreds first: 358 → [300, 50, 8]
   expanded(n)                       n in expanded form, leaving out zeros: 358 → "300 + 50 + 8", 407 → "400 + 7"
   regrouped(a, b)                   a's place values rewritten so each place can take away b's: 462, 237 → [400, 50, 12]
   expandedFig(a, b, op, {shown, rewrite, label})   adding or subtracting in expanded form, place by place (svg)
   nearestWord(unit)                 "the nearest ten" or "the nearest hundred"
   roundWhy(n, unit)                 how n rounds to the nearest unit, in words */
/* what each digit of n is worth, hundreds first: 358 → [300, 50, 8] */
const placeValues = (n) => digits(n).map((digit, i) => digit * 10 ** (2 - i));
/* n in expanded form, leaving out zeros (but writing 0 for 0) */
const expanded = (n) =>
  placeValues(n)
    .filter((value) => value)
    .join(" + ") || "0";
/* a's place values rewritten so each place has enough to take away b's: when a place is too small, 1 of the next place
   to the left becomes 10 more of it (a ten becomes 10 ones, a hundred becomes 10 tens). 462, 237 → [400, 50, 12];
   503, 278 → [400, 90, 13], where the hundred became 10 tens and one of those tens became 10 ones. */
function regrouped(a, b) {
  let [hundreds, tens, ones] = placeValues(a);
  const [, bTens, bOnes] = placeValues(b);
  if (ones < bOnes) {
    ones += 10;
    tens -= 10;
  }
  if (tens < bTens) {
    tens += 100;
    hundreds -= 100;
  }
  return [hundreds, tens, ones];
}
/* a + b or a − b in expanded form: a's place values over b's, a column for each place, and under the line what each place
   adds or takes away to. shown: how many places are worked, hundreds first (4: all three, then "= the answer"). For −,
   rewrite shows a's places regrouped (regrouped) above the ones crossed out; it's on whenever a place is worked. The next
   place to work is outlined. label: what the picture says to a screen reader (default: its numbers, which checks.js reads). */
function expandedFig(a, b, op, { shown = 0, rewrite = false, label } = {}) {
  const plus = op === "+",
    topValues = placeValues(a),
    botValues = placeValues(b),
    /* a's places as they're taken from: regrouped for −, once the rewrite shows */
    rewritten = !plus && (rewrite || shown > 0),
    topUsed = rewritten ? regrouped(a, b) : topValues,
    results = topUsed.map((value, i) => (plus ? value + botValues[i] : value - botValues[i])),
    answer = plus ? a + b : a - b;
  /* columns for the hundreds, tens, and ones (colX[0] is the hundreds), with + signs between them (plusX); the op sign
     sits at opX, and "= answer" at equalsX and answerX */
  const colX = [92, 182, 262],
    plusX = [137, 222],
    opX = 30,
    equalsX = 310,
    answerX = 362,
    colW = 74,
    rowY = { mk: 22, a: 58, b: 98, r: 154 },
    width = 400,
    height = rowY.r + 22;
  let markup = "";
  if (shown < 3)
    markup += `<rect class="acur" x="${colX[shown] - colW / 2}" y="4" width="${colW}" height="${rowY.r + 16}" rx="6"/>`;
  /* a row of place values with + between them; b leaves out its places in front of its first digit (67 is 60 + 7) */
  const row = (values, y, from = 0) =>
    values
      .map((value, i) =>
        i < from
          ? ""
          : `<text class="adg" x="${colX[i]}" y="${y}">${value}</text>` +
            (i < 2 ? `<text class="adg" x="${plusX[i]}" y="${y}">+</text>` : ""),
      )
      .join("");
  /* b's first place with a digit: 0 for hundreds, 1 for tens, 2 for ones */
  const botFrom = b >= 100 ? 0 : b >= 10 ? 1 : 2;
  markup +=
    row(topValues, rowY.a) +
    row(botValues, rowY.b, botFrom) +
    `<text class="adg" x="${opX}" y="${rowY.b}">${op}</text>` +
    `<line class="aline" x1="${opX - 16}" y1="${rowY.b + 24}" x2="${colX[2] + colW / 2}" y2="${rowY.b + 24}"/>`;
  /* the places that were regrouped: the old value crossed out, the new one above it */
  if (rewritten)
    topUsed.forEach((value, i) => {
      if (value === topValues[i]) return;
      markup +=
        `<line class="axd" x1="${colX[i] - 22}" y1="${rowY.a + 11}" x2="${colX[i] + 22}" y2="${rowY.a - 11}"/>` +
        `<text class="amk" x="${colX[i]}" y="${rowY.mk}">${value}</text>`;
    });
  /* what each worked place makes, then (at shown 4) the answer */
  const worked = Math.min(shown, 3);
  results.slice(0, worked).forEach((value, i) => {
    markup += `<text class="adg ares" x="${colX[i]}" y="${rowY.r}">${value}</text>`;
    if (i < worked - 1) markup += `<text class="adg ares" x="${plusX[i]}" y="${rowY.r}">+</text>`;
  });
  if (shown === 4)
    markup +=
      `<text class="adg ares" x="${equalsX}" y="${rowY.r}">=</text>` +
      `<text class="adg ares" x="${answerX}" y="${rowY.r}">${answer}</text>`;
  const said =
    `${a} ${plus ? "plus" : "minus"} ${b} in expanded form: ${expanded(a)} ${plus ? "plus" : "minus"} ${expanded(b)}` +
    (rewritten && topUsed.some((value, i) => value !== topValues[i])
      ? `, with ${a} rewritten as ${topUsed.join(" + ")}`
      : "") +
    (shown ? `, ${plus ? "added" : "subtracted"} by place: ${results.slice(0, worked).join(", ")}` : "") +
    (shown === 4 ? `, which is ${answer}` : "");
  return svgWrap(width, height, markup, label || said);
}
/* "the nearest ten" or "the nearest hundred" */
const nearestWord = (unit) => `the nearest ${unit === 10 ? "ten" : "hundred"}`;
/* how n rounds to the nearest unit (10 or 100), in words: the multiples it's between, the halfway point, and the closer one */
function roundWhy(n, unit) {
  const below = Math.floor(n / unit) * unit,
    halfway = below + unit / 2,
    rounded = roundTo(n, unit);
  if (n === below) return `${n} is already a multiple of ${unit}, so rounded to ${nearestWord(unit)} it stays ${n}.`;
  return (
    `${n} is between ${below} and ${below + unit}. Halfway is ${halfway}. ` +
    (n === halfway
      ? `${n} is exactly halfway, and then we round up to ${rounded}.`
      : `${n} is ${n < halfway ? "less" : "more"} than ${halfway}, so it’s closer to ${rounded}.`)
  );
}
