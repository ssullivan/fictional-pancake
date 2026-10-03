/* Learn Equal Groups (Grade 2 Unit 8): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* n and the word for it: "1 pair", "3 pairs" */
const pl=(n,word)=>`${n} ${word}${n===1?'':'s'}`;
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');
/* a dashed ring around a counter (ctr, in shared/multiply.js) with no partner */
const ring=(x,y,r=14)=>`<circle class="extra" cx="${x}" cy="${y}" r="${r+6}"/>`;
/* n counters in pairs, one above the other, each pair outlined. mark: ring the one with no partner (odd n). */
function pairsFig(n,{mark=true,label}={}){
  /* pairX(i): where pair i is, with a little more room after every 5 pairs */
  const pairs=Math.floor(n/2),odd=n%2,pairX=i=>32+i*44+Math.floor(i/5)*12;
  let markup=range(pairs).map(i=>`<rect class="pairbox" x="${pairX(i)-20}" y="4" width="40" height="84" rx="20"/>`+ctr(pairX(i),26)+ctr(pairX(i),66)).join('');
  if(odd)markup+=ctr(pairX(pairs),26,mark?'b':'a')+(mark?ring(pairX(pairs),26):'');
  return svgWrap(pairX(pairs+odd-1)+32,92,markup,label||`${n} counters: ${pl(pairs,'pair')}`+(odd?' and 1 with no partner':', none left over'));
}
/* arrays of counters (arrayFig) are in shared/multiply.js */
