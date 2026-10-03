/* Learn Introducing Multiplication (Grade 3 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js.
   Graphs (picGraph, barGraph) are in shared/graphs.js, and equal groups (groupsFig) and arrays (arrayFig) in shared/multiply.js. */
/* n and the word for it: "1 row", "3 rows" (plural: the word for more than one) */
const pl=(n,word,plural=word+'s')=>`${n} ${n===1?word:plural}`;
/* items joined with commas: "2, 4, 6" */
const list=items=>items.join(', ');
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');
/* counting by n, k times: "3, 6, 9, 12" */
const countBy=(n,k)=>list(range(k).map(i=>n*(i+1)));
