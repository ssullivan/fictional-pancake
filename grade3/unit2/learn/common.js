/* Learn Area and Multiplication (Grade 3 Unit 2): code used by more than one chapter. Loaded by the chapter pages in learn/,
   after ../figs.js (cellsFig, tilingFig, lFig, rulerRect) and chapters.js. Rectangles with their side lengths (rectFig) and
   rectangles cut in two (splitFig) are in shared/shapes.js. */
/* n and the word for it: "1 row", "3 rows" (plural: the word for more than one) */
const pl = (n, word, plural = word + "s") => `${n} ${n === 1 ? word : plural}`;
/* counting by n, k times: "3, 6, 9, 12" */
const countBy = (n, k) =>
  range(k)
    .map((i) => n * (i + 1))
    .join(", ");
/* a button that shows or hides something: its label says what pressing it will do */
const toggleLabel = (shown, what) => (shown ? `Hide the ${what}` : `Show the ${what}`);
