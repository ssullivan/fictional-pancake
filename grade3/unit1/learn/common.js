/* Learn Introducing Multiplication (Grade 3 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js.
   Graphs (picGraph, barGraph), equal groups (groupsFig), and arrays (arrayFig) are in shared/k5.js. */
const pl=(n,w,ws=w+'s')=>`${n} ${n===1?w:ws}`;
const list=a=>a.join(', ');
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');
/* counting by n, k times: "3, 6, 9, 12" */
const countBy=(n,k)=>list(range(k).map(i=>n*(i+1)));
