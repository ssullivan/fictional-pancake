/* Learn Scale Drawings (Grade 7 Unit 1): code more than one chapter uses. Loaded by every chapter page in learn/, after
   ../figs.js. */
/* scale factors to choose from, as fractions [n, d] */
const HALF = [1, 2],
  ONE = [1, 1],
  THREE_HALVES = [3, 2],
  TWO = [2, 1],
  THREE = [3, 1];
/* a scale factor as a number, and as plain text for a button: 3/2 */
const val = (f) => f[0] / f[1];
const facText = ([n, d]) => (d === 1 ? `${n}` : `${n}/${d}`);
/* An original shape and its copy side by side on a grid, each with its side lengths. orig and copy are corners; options go to
   each shape (gridFig's: sides, verts, angles, hi, tiles), with origOpts for the original and copyOpts for the copy. */
const pairFig = (
  orig,
  copy,
  { origOpts = {}, copyOpts = {}, cell = 22, label = "An original shape and a copy" } = {},
) =>
  gridFig(
    arrange([
      [
        { pts: orig, cls: "a", name: "Original", sides: true, ...origOpts },
        { pts: copy, cls: "b", name: "Copy", sides: true, ...copyOpts },
      ],
    ]),
    { cell, label },
  );
/* the lengths of the sides along the grid, in order, leaving out slanted ones */
const gridSides = (pts) => sideLens(pts).filter((v) => v !== null);
