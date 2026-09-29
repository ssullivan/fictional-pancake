/* Learn Introducing Ratios (Grade 6 Unit 2): code more than one chapter uses. Loaded by the chapter pages in learn/, after chapters.js.
   Double number lines (dnl), ratio tables (tableFig), rows of shapes, recipe batches, paint colors, and tape diagrams are in shared/figures.js. */
const fmt=n=>(Math.round(n*100)/100).toLocaleString('en-US');
/* $6, $2.50 */
const money=n=>'$'+(Math.round(n*100)%100?n.toFixed(2):Math.round(n));
/* "1 cup" or "3 cups", from [one, many] */
const nOf=(n,w)=>`${fmt(n)} ${w[n===1?0:1]}`;
