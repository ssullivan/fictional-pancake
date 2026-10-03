/* Learn Extending Operations to Fractions (Grade 4 Unit 3): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* k/d, and its mixed number when it's 1 or more: "9/4 = 2 1/4" */
const frMix = (k, d) => fr(k, d) + (k >= d ? ` = ${mixed(k, d)}` : "");
/* how k/d compares to 1 whole: "That’s more than 1: 2 wholes and 1/4 more." */
function vsWhole(k, d) {
  const wholes = Math.floor(k / d),
    rest = k % d;
  return k < d
    ? "That’s less than 1 whole."
    : k === d
      ? "That’s exactly 1 whole."
      : `That’s more than 1: ${wholes} whole${wholes > 1 ? "s" : ""}${rest ? ` and ${fr(rest, d)} more` : ""}.`;
}
