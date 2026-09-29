/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* the denominators Grade 4 uses in this unit */
const cap=t=>t[0].toUpperCase()+t.slice(1);
const DEN=[2,3,4,5,6,8,10,12];
/* fractions are [numerator, denominator] */
const frA=([n,d])=>fr(n,d);
const SYM={'<':'&lt;','>':'&gt;','=':'='};
/* "a third", "an eighth" */
const aPart=d=>(PART[d][0][0]==='e'?'an ':'a ')+PART[d][0];
const sign=(a,b)=>{const x=a[0]*b[1],y=b[0]*a[1];return x<y?'<':x>y?'>':'=';};
/* how many equal pieces each 1/d can be split into, keeping the denominator in DEN (2, 3, …, up to the first that doesn't fit) */
const maxSplit=d=>{let n=1;while(DEN.includes(d*(n+1)))n++;return n;};
/* a fraction compared to 1/2: "5/8 is more than 1/2 (1/2 is 4/8)" */
function halfWhy([n,d]){
  const s=sign([n,d],[1,2]);
  if(s==='=')return `${fr(n,d)} is ${fr(1,2)}`;
  return `${fr(n,d)} is ${s==='<'?'less':'more'} than ${fr(1,2)}`+(d%2?` (${n} is ${s==='<'?'less':'more'} than half of ${d})`:` (${fr(1,2)} is ${fr(d/2,d)})`);
}
/* How a and b compare, the way the unit compares fractions: same denominator, same numerator, 1/2, 1, or a common denominator.
   Returns {s: '<', '=', or '>' (a s b), how: the way, why: html}. */
function cmpWhy(a,b){
  const s=sign(a,b),[na,da]=a,[nb,db]=b,[lo,hi]=s==='<'?[a,b]:[b,a],st=`<b>${frA(a)} ${SYM[s]} ${frA(b)}</b>`,D=lcm(da,db);
  const inD=([n,d])=>d===D?frA([n,d]):`${frA([n,d])} = ${fr(n*D/d,D)}`;
  if(s==='=')return {s,how:'Same amount',why:`${inD(a)} and ${inD(b)}, the same amount. ${st}.`};
  if(da===db)return {s,how:'Same denominator',why:`Both are ${PART[da][1]}, so the parts are the same size. ${hi[0]} parts are more than ${lo[0]}. ${st}.`};
  if(na===nb)return {s,how:'Same numerator',why:`Both are ${na} part${na>1?'s':''}. ${cap(aPart(lo[1]))} is smaller than ${aPart(hi[1])}, because the whole is cut into more parts. ${st}.`};
  if(sign(lo,[1,2])!=='>'&&sign(hi,[1,2])!=='<')return {s,how:`Compare to ${fr(1,2)}`,why:`${halfWhy(lo)}, and ${halfWhy(hi)}. ${st}.`};
  if(lo[1]-lo[0]===1&&hi[1]-hi[0]===1)return {s,how:'Compare to 1',why:`Each is 1 part away from 1 whole. ${frA(lo)} is ${fr(1,lo[1])} away and ${frA(hi)} is ${fr(1,hi[1])} away. ${cap(aPart(hi[1]))} is smaller, so ${frA(hi)} is closer to 1. ${st}.`};
  return {s,how:'Common denominator',why:`Write both in ${PART[D][1]}: ${inD(a)} and ${inD(b)}. ${st}.`};
}
/* which row of choice buttons a click was in, for widgets with two rows: <div data-top>${seg(…)}</div>; returns [row, id] or null */
const segHit=(e,rows)=>{const b=e.target.closest('[data-m]');if(!b)return null;const r=rows.find(k=>b.closest(`[data-${k}]`));return r?[r,b.dataset.m]:null;};
