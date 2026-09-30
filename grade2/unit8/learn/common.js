/* Learn Equal Groups (Grade 2 Unit 8): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');
/* a dashed ring around a counter (ctr, in shared/k5.js) with no partner */
const ring=(x,y,r=14)=>`<circle class="extra" cx="${x}" cy="${y}" r="${r+6}"/>`;
/* n counters in pairs, one above the other, each pair outlined. mark: ring the one with no partner (odd n). */
function pairsFig(n,{mark=true,label}={}){
  const k=Math.floor(n/2),odd=n%2,x=i=>32+i*44+Math.floor(i/5)*12;
  let o=range(k).map(i=>`<rect class="pairbox" x="${x(i)-20}" y="4" width="40" height="84" rx="20"/>`+ctr(x(i),26)+ctr(x(i),66)).join('');
  if(odd)o+=ctr(x(k),26,mark?'b':'a')+(mark?ring(x(k),26):'');
  return svgWrap(x(k+odd-1)+32,92,o,label||`${n} counters: ${pl(k,'pair')}`+(odd?' and 1 with no partner':', none left over'));
}
/* arrays of counters (arrayFig) are in shared/k5.js */
