/* Learn Unit Rates and Percentages (Grade 6 Unit 3): code more than one chapter uses. Loaded by the chapter pages in learn/, after chapters.js.
   Double number lines (dnl), coins, percent tapes (pctTape), and percent number lines (pctLine) are in shared/figures.js. */
const fmt=n=>(Math.round(n*100)/100).toLocaleString('en-US');
/* $6, $2.50 */
const money=n=>'$'+(Math.round(n*100)%100?n.toFixed(2):Math.round(n).toLocaleString('en-US'));
/* "1 cup" or "3 cups", from [one, many] */
const nOf=(n,w)=>`${fmt(n)} ${w[n===1?0:1]}`;
/* A percent double number line for the Learn pages: amounts on top, percents below, a tick every 10% (0% and 100% labeled),
   and the part (x, P%) highlighted. The game's pctLine highlights 10% instead, as a hint. */
function pctPoint(W,P,x){
  const top=Math.max(100,Math.ceil(P/10)*10),ticks=[];
  for(let p=0;p<=top;p+=10)if(Math.abs(p-P)>1e-9)ticks.push({t:W*p/100,b:p,st:p===0||p===100?1:0,sb:p===0||p===100?1:0});
  ticks.push({t:x,b:P,st:2,sb:2});
  return dnl('amount','percent',ticks.sort((a,b)=>a.t-b.t),{fb:v=>fmt(v)+'%'})(true);
}
