/* Number lines that Grade 2 Unit 4's game and its Learn pages both use. Needs util.js, figures.js (svgWrap), and numlines.js
   (numLine), and pictures.css and numlines.css for the styles.

   line(lo, hi, options)             a number line with every number labelled when there's room, else every 5 or 10 (svg)
   sgn(n)                            a signed jump as written: "+3", "−10"
   hopsFrom(start, steps)            jumps from start by each of steps, labelled +n or −n, for numLine's hops
   around(a, b)                      the tens around a and b, so a line has room for both */
/* a number line from lo to hi with every number shown when there's room, else every 5 or 10; options go to numLine */
const line = (lo, hi, options = {}) =>
  numLine(lo, hi, {
    u: Math.min(34, 560 / (hi - lo)),
    ls: "",
    end: true,
    lab: (v) => hi - lo <= 12 || v % (hi - lo <= 30 ? 5 : 10) === 0,
    ...options,
  });
/* a signed jump as written: "+3", "−10" */
const sgn = (n) => (n > 0 ? `+${n}` : `−${-n}`);
/* jumps from start by each of steps (signed), labelled +n or −n: hopsFrom(34, [10, 10, 3]) */
function hopsFrom(start, steps) {
  let at = start;
  return steps.map((n) => {
    const hop = { a: at, b: at + n, t: sgn(n) };
    at += n;
    return hop;
  });
}
/* the tens around a and b: [lo, hi] so the line has room for both */
const around = (a, b) => [Math.floor(Math.min(a, b) / 10) * 10, Math.ceil((Math.max(a, b) + 1) / 10) * 10];
