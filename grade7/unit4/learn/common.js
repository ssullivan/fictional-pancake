/* Learn Proportional Relationships and Percentages (Grade 7 Unit 4): code more than one chapter uses. Loaded by every
   chapter page in learn/. */
/* a number as written: commas and up to 2 decimal places (shared/figures.js labels use it too) */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
/* dollars as written: $42 or $42.40 */
const money = (n) => {
  const cents = Math.round(n * 100);
  return "$" + (cents % 100 ? (cents / 100).toFixed(2) : fmt(cents / 100));
};
