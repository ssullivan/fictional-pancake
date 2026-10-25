/* Learn Linear Equations, Inequalities, and Systems (Algebra 1 Unit 2): helpers every chapter uses. Loaded by every chapter
   page in learn/, after chapters.js. */
/* a number as written: at most two decimal places, with commas, and a true minus sign */
const fmt = (n) => {
  const text = Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n < 0 ? `−${text}` : text;
};
/* dollars: whole dollars as $12, others to the cent as $13.50 */
const money = (n) =>
  "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2 }));
/* a table of data: a header row (heads), then a row for each list of cells in rows (html) */
const dataTable = (heads, rows) =>
  `<table class="dtab"><thead><tr>${heads.map((head) => `<th>${head}</th>`).join("")}</tr></thead>` +
  `<tbody>${rows.map((cells) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
