/* Multiplication, factors, and multiples for K–5 pages: hops of n on a number line, tiles in rows, number charts, counters
   in arrays and equal groups. Styles are in multiply.css. Needs util.js and figures.js (svgWrap).

   factors(n), pairsOf(n), isPrime(n)   the factors of n, its factor pairs [a, b] with a ≤ b, and whether it is prime
   hopLine(n, max, k, {mark, cls, nums})   a number line with k hops of n from 0 (svg)
   tiles(rows, n), allRects(n)       n tiles in equal rows (any left over in red), and every rectangle n tiles make (svg)
   chart(max, cls, {lo, tap})        a number chart, 10 to a row, with each square colored by cls(v) (svg)
   ctr(x, y, cls), arrayFig(r, c, {band, …}), ARRAY   a counter (markup), and an array of counters in rows and columns (svg)
   groupsFig(g, n)                   g equal groups of n counters, each group in a circle (svg) */
/* the factors of n, smallest first */
const factors=n=>range(n).map(i=>i+1).filter(d=>n%d===0);
/* factor pairs [a, b] with a ≤ b */
const pairsOf=n=>factors(n).filter(a=>a*a<=n).map(a=>[a,n/a]);
const isPrime=n=>factors(n).length===2;
/* A number line from 0 to max with k hops of n from 0 (the multiples of n). mark: a number to point at (cyan).
   cls: 'r' or 'b' draws the hops red or blue instead of gold. nums: how many multiples after 0 get their number (default all). */
function hopLine(n,max,k,{mark=null,cls='',nums=Infinity,label}={}){
  /* unitW: pixels per 1; hopH: how high a hop's curve reaches (a control point twice as high), up to 48 */
  const width=600,left=20,unitW=(width-2*left)/max,lineY=70,xOf=v=>left+v*unitW,hopH=Math.min(48,n*unitW*.55);
  let markup=`<line class="axis" x1="${left}" y1="${lineY}" x2="${xOf(max)}" y2="${lineY}"/>`;
  /* small ticks at every whole number that isn't a multiple, when there's room for them */
  if(unitW>=5)range(max+1).forEach(v=>{if(v%n)markup+=`<line class="tick mn" x1="${xOf(v)}" y1="${lineY-5}" x2="${xOf(v)}" y2="${lineY+5}"/>`;});
  /* tall ticks at the multiples; their numbers are dim (dm) until a hop reaches them */
  range(Math.floor(max/n)+1).forEach(i=>{
    const v=i*n;
    markup+=`<line class="tick" x1="${xOf(v)}" y1="${lineY-9}" x2="${xOf(v)}" y2="${lineY+9}"/>`
      +(i>nums?'':`<text class="lbl s${v===mark?' cy':i&&i<=k?'':' dm'}" x="${xOf(v)}" y="${lineY+24}">${v}</text>`);
  });
  range(k).forEach(i=>{
    const xa=xOf(i*n),xb=xOf((i+1)*n);
    markup+=`<path class="hop ${cls}" d="M${xa},${lineY-3} Q${(xa+xb)/2},${lineY-3-2*hopH} ${xb},${lineY-3}"/><circle class="land ${cls}" cx="${xb}" cy="${lineY}" r="5"/>`;
  });
  if(mark!==null){
    /* an arrow under the line pointing up at mark, with its number under that when it isn't a multiple (which has one already) */
    markup+=`<polygon class="mark" points="${xOf(mark)},${lineY+34} ${xOf(mark)-7},${lineY+46} ${xOf(mark)+7},${lineY+46}"/>`;
    if(mark%n)markup+=`<text class="lbl s cy" x="${xOf(mark)}" y="${lineY+60}">${mark}</text>`;
  }
  return svgWrap(width,lineY+(mark!==null?70:34),markup,label||`Number line from 0 to ${max} with ${k} hops of ${n}`+(mark!==null?`, pointing at ${mark}`:''));
}
/* n tiles in `rows` equal rows; tiles that don't fit a full column are left over (red) */
function tiles(rows,n,label){
  /* the leftovers go in a column of their own, gap pixels to the right; tiles shrink to fit 540 wide and 280 tall (28 at most) */
  const cols=Math.floor(n/rows),leftover=n-rows*cols,gap=leftover?8:0,size=Math.min(28,(540-gap)/(cols+(leftover?1:0)),280/rows);
  let markup='';
  range(rows).forEach(r=>range(cols).forEach(c=>{markup+=`<rect class="ftile" x="${4+c*size}" y="${4+r*size}" width="${size}" height="${size}"/>`;}));
  range(leftover).forEach(r=>{markup+=`<rect class="ftile left" x="${4+cols*size+gap}" y="${4+r*size}" width="${size}" height="${size}"/>`;});
  return svgWrap(8+cols*size+(leftover?gap+size:0),8+rows*size,markup,label||(leftover?`${n} tiles in ${rows} rows of ${cols}, with ${leftover} left over`:`${n} tiles in ${rows} rows of ${cols}`));
}
/* every rectangle n tiles make, side by side, each labelled rows × columns */
function allRects(n){
  /* one tile size for all of them, so they fit 560 wide (18 at most); the tallest rectangle (the last pair) sets the height */
  const pairs=pairsOf(n),gap=26,size=Math.min(18,(560-gap*(pairs.length-1))/pairs.reduce((t,[,b])=>t+b,0)),tallest=pairs[pairs.length-1][0]*size;
  let markup='',x=4;
  pairs.forEach(([a,b])=>{
    range(a).forEach(r=>range(b).forEach(c=>{markup+=`<rect class="ftile" x="${x+c*size}" y="${4+r*size}" width="${size}" height="${size}"/>`;}));
    markup+=`<text class="lbl s" x="${x+b*size/2}" y="${tallest+24}">${a} × ${b}</text>`;
    x+=b*size+gap;
  });
  return svgWrap(Math.max(x-gap+4,80),tallest+40,markup,`Rectangles made of ${n} tiles: `+pairs.map(([a,b])=>`${a} by ${b}`).join(', '));
}
/* A chart of lo to max, 10 in a row. cls(v): classes for that number's square ('a' gold, 'b' blue, 'ab' green, 'one' gray, 'cur' outlined).
   tap: squares can be tapped (data-v); tap 'cand' makes each square a tap answer for engine.js instead (.cand, data-id = the number). */
function chart(max,cls,{lo=1,tap=false,label}={}){
  const cellSize=44;let markup='';
  range(max-lo+1).forEach(i=>{
    const v=lo+i,x=2+i%10*cellSize,y=2+Math.floor(i/10)*cellSize;
    const attrs=tap==='cand'?`class="cand hc ${cls(v)||''}" data-id="${v}" tabindex="0" role="button" aria-label="${v}"`:`class="hc ${cls(v)||''}"${tap?` data-v="${v}"`:''}`;
    markup+=`<g ${attrs}><rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/><text class="lbl s" x="${x+cellSize/2}" y="${y+cellSize/2}">${v}</text></g>`;
  });
  return svgWrap(10*cellSize+4,Math.ceil((max-lo+1)/10)*cellSize+4,markup,label||`Numbers ${lo} to ${max}`);
}
/* a counter at x, y (cls 'a' gold, 'b' blue, plus 'moved' for a white ring) */
const ctr=(x,y,cls='a',r=14)=>`<g class="ctr ${cls}"><circle cx="${x}" cy="${y}" r="${r}"/></g>`;
/* An array of r rows and c columns of counters, ARRAY.g apart with ARRAY.pad around them.
   band: 'r' outlines the rows (gold) or 'c' the columns (blue), the first k of them (all if k < 0), writing how many are in each,
     or the running total when sum.  hi: [row, column] of a tapped counter; its row and column are outlined.
   tap: every counter can be tapped (data-i = row × c + column). */
const ARRAY={g:46,pad:10};
function arrayFig(r,c,{band=null,k=-1,sum=false,hi=null,tap=false,label}={}){
  const spacing=ARRAY.g,pad=ARRAY.pad,colX=j=>pad+spacing/2+j*spacing,rowY=i=>pad+spacing/2+i*spacing,
    /* a rounded band around row i, or column j */
    rowBand=(i,cls='')=>`<rect class="band ${cls}" x="${pad+3}" y="${pad+i*spacing+3}" width="${c*spacing-6}" height="${spacing-6}" rx="${(spacing-6)/2}"/>`,
    colBand=(j,cls='b')=>`<rect class="band ${cls}" x="${pad+j*spacing+3}" y="${pad+3}" width="${spacing-6}" height="${r*spacing-6}" rx="${(spacing-6)/2}"/>`;
  let markup='';
  /* row bands are counted at the right end of each row, column bands under each column */
  if(band==='r')range(k<0?r:k).forEach(i=>{markup+=rowBand(i)+`<text class="lbl gd" x="${pad+c*spacing+22}" y="${rowY(i)}">${sum?c*(i+1):c}</text>`;});
  if(band==='c')range(k<0?c:k).forEach(j=>{markup+=colBand(j)+`<text class="lbl cy" x="${colX(j)}" y="${pad+r*spacing+14}">${sum?r*(j+1):r}</text>`;});
  if(hi)markup+=rowBand(hi[0])+colBand(hi[1]);
  range(r*c).forEach(n=>{
    /* counter n is in row n ÷ c, column n % c */
    const i=Math.floor(n/c),j=n%c,picked=hi&&hi[0]===i&&hi[1]===j;
    markup+=tap
      ?`<g data-i="${n}">${ctr(colX(j),rowY(i),picked?'a moved':'a',16)}<rect class="hit" x="${pad+j*spacing}" y="${pad+i*spacing}" width="${spacing}" height="${spacing}" rx="8"/></g>`
      :ctr(colX(j),rowY(i),'a',16);
  });
  return svgWrap(2*pad+c*spacing+(band==='r'?44:0),2*pad+r*spacing+(band==='c'?26:0),markup,label||`An array: ${r} row${r===1?'':'s'} with ${c} in each row`);
}
/* g equal groups of n (up to 10 of each): a circle for each group, with n counters in it */
function groupsFig(g,n,{label}={}){
  /* each group gets a cellSize square; up to 5 groups go in one row, more in two rows */
  const cellSize=104,plateR=44,spacing=19,perRow=g<=5?g:Math.ceil(g/2),rows=n<=4?1:n<=8?2:3,perLine=[];
  /* the counters in a group split into `rows` lines as evenly as they go, the longer lines first (5 is 3 then 2) */
  let toPlace=n;range(rows).forEach(i=>{const k=Math.ceil(toPlace/(rows-i));perLine.push(k);toPlace-=k;});
  let markup='';
  range(g).forEach(k=>{
    const cx=cellSize/2+k%perRow*cellSize,cy=cellSize/2+Math.floor(k/perRow)*cellSize;
    markup+=`<circle class="plate" cx="${cx}" cy="${cy}" r="${plateR}"/>`;
    /* each line of counters centered in the circle */
    perLine.forEach((count,i)=>range(count).forEach(j=>{markup+=ctr(cx+(j-(count-1)/2)*spacing,cy+(i-(rows-1)/2)*spacing,'a',8);}));
  });
  return svgWrap(perRow*cellSize,Math.ceil(g/perRow)*cellSize,markup,label||`${g} group${g===1?'':'s'} with ${n} in each`);
}
