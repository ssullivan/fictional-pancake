/* Fractions that Grade 4 Unit 2's game and its Learn pages both use: the unit's denominators, and comparing two fractions
   the ways the unit does. Needs pictures.js (fr, PART) and util.js (lcm). Fractions are [numerator, denominator].

   cap(text), DEN, frA([n, d]), SYM, aPart(d)   "Text", the denominators, n/d stacked (html), < > = as html, "an eighth"
   sign(a, b)                        how a compares to b: '<', '=', or '>'
   halfWhy(a), cmpWhy(a, b)          why a is more or less than 1/2, and how a and b compare and why ({s, how, why}) */
/* the text with its first letter capitalized */
const cap = (text) => text[0].toUpperCase() + text.slice(1);
/* the denominators Grade 4 uses in this unit */
const DEN = [2, 3, 4, 5, 6, 8, 10, 12];
/* a fraction [n, d] written stacked */
const frA = ([n, d]) => fr(n, d);
/* <, >, and = as html */
const SYM = { "<": "&lt;", ">": "&gt;", "=": "=" };
/* "a third", "an eighth" */
const aPart = (d) => (PART[d][0][0] === "e" ? "an " : "a ") + PART[d][0];
/* how fraction a compares to b: '<', '>', or '='. Cross-multiplying puts both over the same denominator. */
const sign = (a, b) => {
  const aScaled = a[0] * b[1],
    bScaled = b[0] * a[1];
  return aScaled < bScaled ? "<" : aScaled > bScaled ? ">" : "=";
};
/* a fraction compared to 1/2: "5/8 is more than 1/2 (1/2 is 4/8)" */
function halfWhy([n, d]) {
  const vsHalf = sign([n, d], [1, 2]);
  if (vsHalf === "=") return `${fr(n, d)} is ${fr(1, 2)}`;
  return (
    `${fr(n, d)} is ${vsHalf === "<" ? "less" : "more"} than ${fr(1, 2)}` +
    (d % 2 ? ` (${n} is ${vsHalf === "<" ? "less" : "more"} than half of ${d})` : ` (${fr(1, 2)} is ${fr(d / 2, d)})`)
  );
}
/* How a and b compare, the way the unit compares fractions: same denominator, same numerator, 1/2, 1, or a common denominator.
   Returns {s: '<', '=', or '>' (a s b), how: the way, why: html}. */
function cmpWhy(a, b) {
  /* smaller and bigger: the two in order; common: their common denominator */
  const s = sign(a, b),
    [na, da] = a,
    [nb, db] = b,
    [smaller, bigger] = s === "<" ? [a, b] : [b, a],
    statement = `<b>${frA(a)} ${SYM[s]} ${frA(b)}</b>`,
    common = lcm(da, db);
  /* a fraction, and the same amount in the common denominator when that's different */
  const inCommon = ([n, d]) => (d === common ? frA([n, d]) : `${frA([n, d])} = ${fr((n * common) / d, common)}`);
  if (s === "=")
    return { s, how: "Same amount", why: `${inCommon(a)} and ${inCommon(b)}, the same amount. ${statement}.` };
  if (da === db)
    return {
      s,
      how: "Same denominator",
      why: `Both are ${PART[da][1]}, so the parts are the same size. ${bigger[0]} parts are more than ${smaller[0]}. ${statement}.`,
    };
  if (na === nb)
    return {
      s,
      how: "Same numerator",
      why: `Both are ${na} part${na > 1 ? "s" : ""}. ${cap(aPart(smaller[1]))} is smaller than ${aPart(bigger[1])}, because the whole is cut into more parts. ${statement}.`,
    };
  /* one at or below 1/2 and the other at or above it */
  if (sign(smaller, [1, 2]) !== ">" && sign(bigger, [1, 2]) !== "<")
    return { s, how: `Compare to ${fr(1, 2)}`, why: `${halfWhy(smaller)}, and ${halfWhy(bigger)}. ${statement}.` };
  /* both one part short of 1 whole */
  if (smaller[1] - smaller[0] === 1 && bigger[1] - bigger[0] === 1)
    return {
      s,
      how: "Compare to 1",
      why: `Each is 1 part away from 1 whole. ${frA(smaller)} is ${fr(1, smaller[1])} away and ${frA(bigger)} is ${fr(1, bigger[1])} away. ${cap(aPart(bigger[1]))} is smaller, so ${frA(bigger)} is closer to 1. ${statement}.`,
    };
  return {
    s,
    how: "Common denominator",
    why: `Write both in ${PART[common][1]}: ${inCommon(a)} and ${inCommon(b)}. ${statement}.`,
  };
}
