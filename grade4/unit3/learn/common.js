/* Learn Extending Operations to Fractions (Grade 4 Unit 3): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* k parts of 1/d as a whole number, a fraction, or a mixed number: mixed(9, 4) is 2 1/4 */
const mixed=(k,d)=>{const w=Math.floor(k/d),r=k%d;return !r?`${w}`:w?`${w} ${fr(r,d)}`:fr(r,d);};
/* k/d, and its mixed number when it's 1 or more: "9/4 = 2 1/4" */
const frMix=(k,d)=>fr(k,d)+(k>=d?` = ${mixed(k,d)}`:'');
/* how k/d compares to 1 whole: "That’s more than 1 whole: 2 wholes and 1/4 more." */
function vsWhole(k,d){
  const w=Math.floor(k/d),r=k%d;
  return k<d?'That’s less than 1 whole.':k===d?'That’s exactly 1 whole.':`That’s more than 1: ${w} whole${w>1?'s':''}${r?` and ${fr(r,d)} more`:''}.`;
}
