/* Learn Measuring Length, Time, Liquid Volume, and Weight (Grade 3 Unit 6): code used by more than one chapter. Loaded by
   the chapter pages in learn/, after ../figs.js (inches, inchesText, inchRuler, dialFig, beakerFig, clockTime, timeLine)
   and chapters.js. */
/* n and the word for it: "1 liter", "3 liters" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* where a length in fourths of an inch ends, in words: "halfway from 3 to 4", "3 fourths of the way from 2 to 3", "at 4" */
function whereItEnds(fourths) {
  const whole = Math.floor(fourths / 4),
    rest = fourths % 4;
  if (!rest) return `at ${whole}`;
  return `${rest === 2 ? "halfway" : `${pl(rest, "fourth")} of the way`} from ${whole} to ${whole + 1}`;
}
