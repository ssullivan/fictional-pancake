/* Learn Expressions and Equations (Grade 6 Unit 6): code more than one chapter uses. Loaded by every chapter page in learn/. */
/* a number as written, up to 2 decimal places, with commas (figures.js labels use it too) */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* "true" in green or "false" in red, for an equation's verdict */
const verdict = (isTrue) => (isTrue ? '<span class="ok">true</span>' : '<span class="no">false</span>');
