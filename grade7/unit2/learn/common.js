/* Learn Introducing Proportional Relationships (Grade 7 Unit 2): code more than one chapter uses. Loaded by every chapter
   page in learn/. */
/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* dollars as written: $3 or $2.50 */
const money = (n) => "$" + (Number.isInteger(n) ? fmt(n) : n.toFixed(2));
/* a letter for a number, in italics */
const mv = (letter) => mathVar(letter);
/* A graph of y = kx for x from 0 to xMax, with gridlines that fit: the line, and points [{x, y, t, cls}] on it.
   heads: [across, up] labels. */
function lineGraph(k, points, { xMax = 6, heads = ["x", "y"], label } = {}) {
  const yTop = Math.max(k * xMax, ...points.map((p) => p.y)),
    yStep = [0.5, 1, 2, 5, 10, 20, 50].find((s) => yTop / s <= 10),
    yMax = Math.ceil(yTop / yStep) * yStep;
  return coordPlane(points, {
    xMax,
    yMax,
    yStep,
    xLabel: heads[0],
    yLabel: heads[1],
    line: [k, 0],
    label: label || `The graph of y = ${fmt(k)}x`,
  });
}
