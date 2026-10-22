/* The number formats that Grade 7 Unit 5's game (Deep Dive) and its Learn pages both use. Number lines are signedLine and
   vLine from shared/signed.js, which use fmt from here.

   fmt(n)                                   a number as written: a true minus sign (−), commas, up to 2 decimal places
   money(n)                                 dollars as written: −$40, $12.50
   par(n)                                   a number as it goes after an operation sign: negatives in parentheses, (−3)
   withSign(n)                              a change as written, with its sign: +5, −3 */

/* a number as written: a true minus sign (−), commas, and up to 2 decimal places (signed.js labels use it too) */
const fmt = (n) => {
  const rounded = Math.round(n * 100) / 100;
  return (rounded < 0 ? "−" : "") + Math.abs(rounded).toLocaleString("en-US", { maximumFractionDigits: 2 });
};
/* dollars as written: −$40, $12.50 (cents only when there are some) */
const money = (n) => {
  const cents = Math.round(Math.abs(n) * 100) % 100;
  return (
    (n < 0 ? "−" : "") +
    "$" +
    Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
  );
};
/* a number after an operation sign: 5 − (−3), not 5 − −3 */
const par = (n) => (n < 0 ? `(${fmt(n)})` : fmt(n));
/* a change with its sign: +5 or −3 */
const withSign = (n) => (n > 0 ? "+" : "") + fmt(n);
