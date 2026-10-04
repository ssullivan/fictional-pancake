/* Learn Extending Operations to Fractions (Grade 4 Unit 3): code used by more than one chapter. Loaded by the chapter pages in learn/, after
   ../figs.js (frMix, which the game uses too) and chapters.js. */
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
