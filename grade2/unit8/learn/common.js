/* Learn Equal Groups (Grade 2 Unit 8): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');
/* a counter at x, y (cls 'a' gold, 'b' blue, plus 'moved' for a white ring), and a dashed ring around one with no partner */
const ctr=(x,y,cls='a',r=14)=>`<g class="ctr ${cls}"><circle cx="${x}" cy="${y}" r="${r}"/></g>`;
const ring=(x,y,r=14)=>`<circle class="extra" cx="${x}" cy="${y}" r="${r+6}"/>`;
/* n counters in pairs, one above the other, each pair outlined. mark: ring the one with no partner (odd n). */
function pairsFig(n,{mark=true,label}={}){
  const k=Math.floor(n/2),odd=n%2,x=i=>32+i*44+Math.floor(i/5)*12;
  let o=range(k).map(i=>`<rect class="pairbox" x="${x(i)-20}" y="4" width="40" height="84" rx="20"/>`+ctr(x(i),26)+ctr(x(i),66)).join('');
  if(odd)o+=ctr(x(k),26,mark?'b':'a')+(mark?ring(x(k),26):'');
  return svgWrap(x(k+odd-1)+32,92,o,label||`${n} counters: ${pl(k,'pair')}`+(odd?' and 1 with no partner':', none left over'));
}
/* An array of r rows and c columns of counters.
   band: 'r' outlines the rows (gold) or 'c' the columns (blue), the first k of them (all if k < 0), writing how many are in each,
     or the running total when sum.  hi: [row, column] of a tapped counter; its row and column are outlined.
   tap: every counter can be tapped (data-i = row × c + column). */
const G=46,AP=10;
function arr(r,c,{band=null,k=-1,sum=false,hi=null,tap=false,label}={}){
  const cx=j=>AP+G/2+j*G,cy=i=>AP+G/2+i*G,rowB=(i,cls='')=>`<rect class="band ${cls}" x="${AP+3}" y="${AP+i*G+3}" width="${c*G-6}" height="${G-6}" rx="${(G-6)/2}"/>`,
    colB=(j,cls='b')=>`<rect class="band ${cls}" x="${AP+j*G+3}" y="${AP+3}" width="${G-6}" height="${r*G-6}" rx="${(G-6)/2}"/>`;
  let o='';
  if(band==='r')range(k<0?r:k).forEach(i=>{o+=rowB(i)+`<text class="lbl gd" x="${AP+c*G+22}" y="${cy(i)}">${sum?c*(i+1):c}</text>`;});
  if(band==='c')range(k<0?c:k).forEach(j=>{o+=colB(j)+`<text class="lbl cy" x="${cx(j)}" y="${AP+r*G+14}">${sum?r*(j+1):r}</text>`;});
  if(hi)o+=rowB(hi[0])+colB(hi[1]);
  range(r*c).forEach(n=>{
    const i=Math.floor(n/c),j=n%c,sel=hi&&hi[0]===i&&hi[1]===j;
    o+=tap?`<g data-i="${n}">${ctr(cx(j),cy(i),sel?'a moved':'a',16)}<rect class="hit" x="${AP+j*G}" y="${AP+i*G}" width="${G}" height="${G}" rx="8"/></g>`:ctr(cx(j),cy(i),'a',16);
  });
  return svgWrap(2*AP+c*G+(band==='r'?44:0),2*AP+r*G+(band==='c'?26:0),o,label||`An array: ${pl(r,'row')} with ${c} in each row`);
}
