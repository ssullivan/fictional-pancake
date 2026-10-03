/* Multiplication, factors, and multiples for K–5 pages: hops of n on a number line, tiles in rows, number charts, counters
   in arrays and equal groups. Styles are in multiply.css. Needs util.js and figures.js (svgWrap).

   factors(n), pairsOf(n), isPrime(n)   the factors of n, its factor pairs [a, b] with a ≤ b, and whether it is prime
   hopLine(n, max, k, {mark, cls, nums})   a number line with k hops of n from 0 (svg)
   tiles(rows, n), allRects(n)       n tiles in equal rows (any left over in red), and every rectangle n tiles make (svg)
   chart(max, cls, {lo, tap})        a number chart, 10 to a row, with each square colored by cls(v) (svg)
   ctr(x, y, cls), arrayFig(r, c, {band, …}), ARRAY   a counter (markup), and an array of counters in rows and columns (svg)
   groupsFig(g, n)                   g equal groups of n counters, each group in a circle (svg) */
const factors=n=>range(n).map(i=>i+1).filter(d=>n%d===0);
/* factor pairs [a, b] with a ≤ b */
const pairsOf=n=>factors(n).filter(a=>a*a<=n).map(a=>[a,n/a]);
const isPrime=n=>factors(n).length===2;
/* A number line from 0 to max with k hops of n from 0 (the multiples of n). mark: a number to point at (cyan).
   cls: 'r' or 'b' draws the hops red or blue instead of gold. nums: how many multiples after 0 get their number (default all). */
function hopLine(n,max,k,{mark=null,cls='',nums=Infinity,label}={}){
  const W=600,X=20,u=(W-2*X)/max,Y=70,x=v=>X+v*u,h=Math.min(48,n*u*.55);
  let o=`<line class="axis" x1="${X}" y1="${Y}" x2="${x(max)}" y2="${Y}"/>`;
  if(u>=5)range(max+1).forEach(v=>{if(v%n)o+=`<line class="tick mn" x1="${x(v)}" y1="${Y-5}" x2="${x(v)}" y2="${Y+5}"/>`;});
  range(Math.floor(max/n)+1).forEach(i=>{
    const v=i*n;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-9}" x2="${x(v)}" y2="${Y+9}"/>`+(i>nums?'':`<text class="lbl s${v===mark?' cy':i&&i<=k?'':' dm'}" x="${x(v)}" y="${Y+24}">${v}</text>`);
  });
  range(k).forEach(i=>{
    const a=x(i*n),b=x((i+1)*n);
    o+=`<path class="hop ${cls}" d="M${a},${Y-3} Q${(a+b)/2},${Y-3-2*h} ${b},${Y-3}"/><circle class="land ${cls}" cx="${b}" cy="${Y}" r="5"/>`;
  });
  if(mark!==null){
    o+=`<polygon class="mark" points="${x(mark)},${Y+34} ${x(mark)-7},${Y+46} ${x(mark)+7},${Y+46}"/>`;
    if(mark%n)o+=`<text class="lbl s cy" x="${x(mark)}" y="${Y+60}">${mark}</text>`;
  }
  return svgWrap(W,Y+(mark!==null?70:34),o,label||`Number line from 0 to ${max} with ${k} hops of ${n}`+(mark!==null?`, pointing at ${mark}`:''));
}
/* n tiles in `rows` equal rows; tiles that don't fit a full column are left over (red) */
function tiles(rows,n,label){
  const cols=Math.floor(n/rows),left=n-rows*cols,g=left?8:0,s=Math.min(28,(540-g)/(cols+(left?1:0)),280/rows);
  let o='';
  range(rows).forEach(r=>range(cols).forEach(c=>{o+=`<rect class="ftile" x="${4+c*s}" y="${4+r*s}" width="${s}" height="${s}"/>`;}));
  range(left).forEach(r=>{o+=`<rect class="ftile left" x="${4+cols*s+g}" y="${4+r*s}" width="${s}" height="${s}"/>`;});
  return svgWrap(8+cols*s+(left?g+s:0),8+rows*s,o,label||(left?`${n} tiles in ${rows} rows of ${cols}, with ${left} left over`:`${n} tiles in ${rows} rows of ${cols}`));
}
/* every rectangle n tiles make, side by side, each labelled rows × columns */
function allRects(n){
  const P=pairsOf(n),G=26,s=Math.min(18,(560-G*(P.length-1))/P.reduce((t,[,b])=>t+b,0)),H=P[P.length-1][0]*s;
  let o='',x=4;
  P.forEach(([a,b])=>{
    range(a).forEach(r=>range(b).forEach(c=>{o+=`<rect class="ftile" x="${x+c*s}" y="${4+r*s}" width="${s}" height="${s}"/>`;}));
    o+=`<text class="lbl s" x="${x+b*s/2}" y="${H+24}">${a} × ${b}</text>`;
    x+=b*s+G;
  });
  return svgWrap(Math.max(x-G+4,80),H+40,o,`Rectangles made of ${n} tiles: `+P.map(([a,b])=>`${a} by ${b}`).join(', '));
}
/* A chart of lo to max, 10 in a row. cls(v): classes for that number's square ('a' gold, 'b' blue, 'ab' green, 'one' gray, 'cur' outlined).
   tap: squares can be tapped (data-v); tap 'cand' makes each square a tap answer for engine.js instead (.cand, data-id = the number). */
function chart(max,cls,{lo=1,tap=false,label}={}){
  const C=44;let o='';
  range(max-lo+1).forEach(i=>{
    const v=lo+i,x=2+i%10*C,y=2+Math.floor(i/10)*C;
    o+=`<g class="${tap==='cand'?`cand hc ${cls(v)||''}" data-id="${v}" tabindex="0" role="button" aria-label="${v}"`:`hc ${cls(v)||''}"${tap?` data-v="${v}"`:''}`}><rect x="${x}" y="${y}" width="${C}" height="${C}"/><text class="lbl s" x="${x+C/2}" y="${y+C/2}">${v}</text></g>`;
  });
  return svgWrap(10*C+4,Math.ceil((max-lo+1)/10)*C+4,o,label||`Numbers ${lo} to ${max}`);
}
/* a counter at x, y (cls 'a' gold, 'b' blue, plus 'moved' for a white ring) */
const ctr=(x,y,cls='a',r=14)=>`<g class="ctr ${cls}"><circle cx="${x}" cy="${y}" r="${r}"/></g>`;
/* An array of r rows and c columns of counters, ARRAY.g apart with ARRAY.pad around them.
   band: 'r' outlines the rows (gold) or 'c' the columns (blue), the first k of them (all if k < 0), writing how many are in each,
     or the running total when sum.  hi: [row, column] of a tapped counter; its row and column are outlined.
   tap: every counter can be tapped (data-i = row × c + column). */
const ARRAY={g:46,pad:10};
function arrayFig(r,c,{band=null,k=-1,sum=false,hi=null,tap=false,label}={}){
  const G=ARRAY.g,AP=ARRAY.pad,cx=j=>AP+G/2+j*G,cy=i=>AP+G/2+i*G,rowB=(i,cls='')=>`<rect class="band ${cls}" x="${AP+3}" y="${AP+i*G+3}" width="${c*G-6}" height="${G-6}" rx="${(G-6)/2}"/>`,
    colB=(j,cls='b')=>`<rect class="band ${cls}" x="${AP+j*G+3}" y="${AP+3}" width="${G-6}" height="${r*G-6}" rx="${(G-6)/2}"/>`;
  let o='';
  if(band==='r')range(k<0?r:k).forEach(i=>{o+=rowB(i)+`<text class="lbl gd" x="${AP+c*G+22}" y="${cy(i)}">${sum?c*(i+1):c}</text>`;});
  if(band==='c')range(k<0?c:k).forEach(j=>{o+=colB(j)+`<text class="lbl cy" x="${cx(j)}" y="${AP+r*G+14}">${sum?r*(j+1):r}</text>`;});
  if(hi)o+=rowB(hi[0])+colB(hi[1]);
  range(r*c).forEach(n=>{
    const i=Math.floor(n/c),j=n%c,sel=hi&&hi[0]===i&&hi[1]===j;
    o+=tap?`<g data-i="${n}">${ctr(cx(j),cy(i),sel?'a moved':'a',16)}<rect class="hit" x="${AP+j*G}" y="${AP+i*G}" width="${G}" height="${G}" rx="8"/></g>`:ctr(cx(j),cy(i),'a',16);
  });
  return svgWrap(2*AP+c*G+(band==='r'?44:0),2*AP+r*G+(band==='c'?26:0),o,label||`An array: ${r} row${r===1?'':'s'} with ${c} in each row`);
}
/* g equal groups of n (up to 10 of each): a circle for each group, with n counters in it */
function groupsFig(g,n,{label}={}){
  const C=104,R=44,D=19,per=g<=5?g:Math.ceil(g/2),rows=n<=4?1:n<=8?2:3,left=[];
  let m=n;range(rows).forEach(i=>{const k=Math.ceil(m/(rows-i));left.push(k);m-=k;});
  let o='';
  range(g).forEach(k=>{
    const cx=C/2+k%per*C,cy=C/2+Math.floor(k/per)*C;
    o+=`<circle class="plate" cx="${cx}" cy="${cy}" r="${R}"/>`;
    left.forEach((cnt,i)=>range(cnt).forEach(j=>{o+=ctr(cx+(j-(cnt-1)/2)*D,cy+(i-(rows-1)/2)*D,'a',8);}));
  });
  return svgWrap(per*C,Math.ceil(g/per)*C,o,label||`${g} group${g===1?'':'s'} with ${n} in each`);
}
