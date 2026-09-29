/* Pictures and controls for K–5 pages: ten-frames, cubes, base-ten blocks, tape diagrams, number lines, shapes, clocks, money,
   and factor pictures.
   Styles are in k5.css. Needs util.js and figures.js (svgWrap).

   range(n)                          [0, 1, …, n-1]
   cellsOf([n, cls], …)              a list of n cls, then the next group: the cells for tenFrames
   tenFrames(cells, {frames, out, tap, label})
   cubes(x, y, n, cls)               a row of connecting cubes (markup)
   rod(x, y, cls), one(x, y, cls)    one ten, one one (markup)
   blocks(x, y, tens, ones, cls, {traded, outT, outO})   tens and ones; returns [markup, width]
   addBlocks(a, b, joined)           a + b in blocks, apart or tens with tens and ones with ones (svg)
   tensOnesAdd(pairs)                widget: pick a + b, then join tens and ones
   tapes(rows, {diff})               tape diagram comparing two amounts
   partWhole(parts, total)           one tape split into parts, with the total above
   numLine(lo, hi, {…})              a number line with arrows, jumps, dots, and tappable ticks (svg)
   jumps(start, moves, shown, ask)   an open number line: counting on or back in jumps, not drawn to scale (svg)
   hto(x, y, h, t, o, {cls, tr}), htoFig(h, t, o, opt, label)   small base-ten diagrams with hundreds; numBlocks(n) draws n
   digits(n), numWords(n)            [hundreds, tens, ones] of n, and its name ("four hundred six")
   pvChart(rows, hi)                 a hundreds-tens-ones chart (html table)
   SHAPES[sides], SHAPE_NAME[sides], QUADS    flat shapes in a 100 × 100 box; shapeAt(pts, x, y, s, {…}) (markup), shapeFig(pts, {…}, label)
   picRow(n, w, h, draw, {letters, tap}), shapeRow(list, {…}), shareRow(shape, list, {…})   pictures side by side, lettered or to tap
   SOLIDS, solidFig(kind, {back})    cubes, boxes, pyramids, and prisms drawn at an angle, with the back edges dashed
   shareFig(shape, n, how, {shade}), PART, partName(n, k)   a circle or rectangle cut into halves, thirds, or fourths
   PB, pbFig(big, small, {show})     pattern blocks: a hexagon, trapezoid, or rhombus filled with smaller blocks
   clockFig(h, m, {shade, fives}), hm(h, m), dayBar(at)   a clock face, "3:05", and the day from midnight to midnight
   COINS, moneyFig(list, {vals}), centsOf(list), amt(c)   coins and dollar bills, their total, and "$2 and 35¢"
   factors(n), pairsOf(n), isPrime(n)   the factors of n, its factor pairs [a, b] with a ≤ b, and whether it is prime
   hopLine(n, max, k, {mark, cls, nums})   a number line with k hops of n from 0 (svg)
   tiles(rows, n), allRects(n)       n tiles in equal rows (any left over in red), and every rectangle n tiles make (svg)
   chart(max, cls, {lo, tap})        a number chart, 10 to a row, with each square colored by cls(v) (svg)
   lockers(open, {hi, sel})          the Locker Problem's 20 lockers, open or closed (svg)
   fr(n, d), frT(x, y, n, d, cls)    a fraction written stacked (html), and the same in a picture (markup)
   strips(rows, {wholes, W})         fraction strips: wholes cut into d equal parts, k of them shaded, in groups or taken away (svg)
   fracLine(rows, {wholes, …})       number lines from 0 marked in fractions, one under another, with points and tappable ticks (svg)
   lineplot(counts, lo, hi, {d, …})  a line plot: an X for each measurement, in whole numbers or fractions (svg)
   hundredGrid(cells)                1 whole as 10 tenths of 10 hundredths, with squares shaded (svg) */
const range=n=>[...Array(n).keys()];
const cellsOf=(...groups)=>groups.flatMap(([n,c])=>Array(n).fill(c));

/* Ten-frames, 2 rows of 5 each. cells: a class for each filled cell in order ('a' gold, 'b' blue, null empty).
   out: set of crossed-out cells. tap: empty cells can be tapped (data-i). */
const CELL=44;
function tenFrames(cells,{frames=2,out=new Set(),tap=false,label='Ten-frames'}={}){
  const G=18,W=frames*5*CELL+(frames-1)*G+4,H=2*CELL+4;let o='';
  range(frames*10).forEach(i=>{
    const x=2+Math.floor(i/10)*(5*CELL+G)+i%5*CELL,y=2+Math.floor(i%10/5)*CELL,c=cells[i];
    o+=`<rect class="cell" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
    if(c){
      const g=out.has(i);
      o+=`<g class="ctr ${c}${g?' gone':''}" data-i="${i}"><circle cx="${x+CELL/2}" cy="${y+CELL/2}" r="${CELL/2-6}"/>${g?`<path d="M${x+11},${y+11}L${x+CELL-11},${y+CELL-11}M${x+CELL-11},${y+11}L${x+11},${y+CELL-11}"/>`:''}</g>`;
    }else if(tap)o+=`<rect class="hit" data-i="${i}" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/>`;
  });
  return svgWrap(W,H,o,label);
}
/* a row of connecting cubes starting at x, y */
const CUBE=32;
const cubes=(x,y,n,cls)=>range(n).map(i=>`<rect class="cube ${cls}" x="${x+i*CUBE}" y="${y}" width="${CUBE-2}" height="${CUBE-2}" rx="3"/>`).join('');
/* base-ten blocks: tens are rods of 10, ones are single cubes */
const S=16;
const rod=(x,y,cls='')=>`<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${S}" height="${S*10}"/>${range(9).map(i=>`<line x1="${x}" y1="${y+S*(i+1)}" x2="${x+S}" y2="${y+S*(i+1)}"/>`).join('')}</g>`;
const one=(x,y,cls='')=>`<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${S}" height="${S}"/>`;
/* a red line through a block that was taken away */
const xOut=(x,y,w,h)=>`<path class="xout" d="M${x-3},${y+h+3}L${x+w+3},${y-3}"/>`;
/* Tens and ones as blocks from x, ones in columns of 5; returns [markup, width].
   traded: the last `traded` ones came from a broken ten (drawn in green). outT, outO: the last tens and ones are crossed out. */
function blocks(x,y,tens,ones,cls='',{traded=0,outT=0,outO=0}={}){
  let o='';
  range(tens).forEach(i=>{const g=i>=tens-outT,rx=x+i*(S+6);o+=rod(rx,y,cls+(g?' gone':''))+(g?xOut(rx,y,S,S*10):'');});
  const ox=x+tens*(S+6)+(tens?6:0);
  range(ones).forEach(i=>{
    const g=i>=ones-outO,ux=ox+Math.floor(i/5)*(S+4),uy=y+S*10-S-(i%5)*(S+4);
    o+=one(ux,uy,(i>=ones-traded?'tr':cls)+(g?' gone':''))+(g?xOut(ux,uy,S,S):'');
  });
  return [o,ox+Math.ceil(ones/5)*(S+4)-x];
}

/* a + b in base-ten blocks: side by side, or (joined) tens with tens and ones with ones, where 10 ones make a new ten (outlined).
   Returns the svg. */
function addBlocks(a,b,joined){
  let svg,w;
  if(!joined){
    const [m1,w1]=blocks(6,10,Math.floor(a/10),a%10,'a'),[m2,w2]=blocks(6+w1+34,10,Math.floor(b/10),b%10,'b');
    svg=m1+`<text class="lbl big" x="${6+w1+17}" y="${10+S*5}">+</text>`+m2;w=6+w1+34+w2+6;
  }else{
    const o=a%10+b%10,ta=Math.floor(a/10),tb=Math.floor(b/10),[mt1,wt1]=blocks(6,10,ta,0,'a'),[mt2,wt2]=blocks(6+wt1,10,tb,0,'b');
    let x=6+wt1+wt2;svg=mt1+mt2;
    if(o>=10){svg+=rod(x,10,'new');x+=S+6;}
    const oa=o>=10?0:a%10,ob=o>=10?o-10:b%10,[mo1,wo1]=blocks(x+10,10,0,oa,'a'),[mo2,wo2]=blocks(x+10+wo1+(oa?4:0),10,0,ob,'b');
    svg+=mo1+mo2;w=x+10+wo1+wo2+10;
  }
  return svgWrap(Math.max(w,160),S*10+24,svg,joined?'Tens together and ones together':`${a} and ${b} in base-ten blocks`);
}
/* Widget: pick a + b from pairs, then put tens with tens and ones with ones. */
const tensOnesAdd=PAIRS=>el=>{
  const q=Q(el);let p=0,joined=false;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} + ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],t=Math.floor(a/10)+Math.floor(b/10),o=a%10+b%10;press(el,p);
    q('f').innerHTML=addBlocks(a,b,joined);
    q('go').textContent=joined?'Split them again':'Put tens with tens and ones with ones';
    q('r').innerHTML=joined?`Tens: <b>${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${t*10}</b>. Ones: <b>${a%10} + ${b%10} = ${o}</b>.`+(o>=10?`<br><span class="dimline">${o} ones is 1 ten and ${o-10} ones, so make a new ten.</span>`:'')+`<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span>`:`<b>${a} + ${b}</b><br><span class="dimline">Tall rods are tens. Small squares are ones.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;joined=false;draw();}});
  q('go').onclick=()=>{joined=!joined;draw();};
  draw();
};

/* Tape diagrams to compare two amounts. rows: [{label, n, show}] where show is the number to write (or '?').
   diff: label for the difference piece after the shorter tape, or null for none. */
function tapes(rows,{diff=null}={}){
  const big=Math.max(...rows.map(r=>r.n)),u=Math.min(16,300/big),L=78,H=34,W=L+big*u+60;
  let o='';
  rows.forEach((r,i)=>{
    const y=10+i*(H+18);
    o+=`<text class="lbl en" x="${L-10}" y="${y+H/2}">${r.label}</text><rect class="tape t${i}" x="${L}" y="${y}" width="${r.n*u}" height="${H}" rx="4"/><text class="lbl" x="${L+r.n*u/2}" y="${y+H/2}">${r.show}</text>`;
    if(diff!==null&&r.n<big)o+=`<rect class="tape gap" x="${L+r.n*u}" y="${y}" width="${(big-r.n)*u}" height="${H}" rx="4"/><text class="lbl cy" x="${L+(r.n+big)*u/2}" y="${y+H/2}">${diff}</text>`;
  });
  return svgWrap(W,10+rows.length*(H+18),o,'Tape diagram');
}
/* One tape split into parts, with a bracket and the total above. parts: [{n, show, hi}] (show: the number to write, or '?';
   hi: outline that part), total: what to write above (a number or '?'), label: what the picture says to a screen reader. */
function partWhole(parts,total,label='Tape diagram'){
  const sum=parts.reduce((s,p)=>s+p.n,0),W=340,u=W/sum,X=10,Y=48,H=40;
  let o=`<path class="brace" d="M${X},${Y-8} v-8 H${X+W} v8"/><text class="lbl${total==='?'?' cy':''}" x="${X+W/2}" y="${Y-30}">${total}</text>`,x=X;
  parts.forEach((p,i)=>{
    o+=`<rect class="tape t${i%2}${p.hi?' hi':''}" x="${x}" y="${Y}" width="${p.n*u}" height="${H}" rx="4"/><text class="lbl${p.show==='?'?' cy':''}" x="${x+p.n*u/2}" y="${Y+H/2}">${p.show}</text>`;
    x+=p.n*u;
  });
  return svgWrap(W+2*X,Y+H+6,o,label);
}

/* A number line from lo to hi, with a tick every `step` (taller every `big`). lab(v): which ticks get a number (default: the tall ones).
   u: pixels per 1. ls: label class ('s' small, '' normal). end: an arrowhead on the right, since the line keeps going.
   arrows: [{a, b, lv, q}] straight arrows above the line from a to b at level lv (0 is lowest), labelled with their length,
     or ? when q and not shown.
   hops: [{a, b, t, q}] curved jumps from a to b labelled t (q: blue).  pts: [{v, cls, t}] dots on the line (cls 'b': blue);
     t is written under the dot, and tick numbers too close to it are left off.  tap: every tick can be tapped (data-v);
   tap 'cand' makes each tick a tap answer for engine.js instead (.cand, data-id = the number).  Returns the svg. */
function numLine(lo,hi,{u=Math.min(18,380/(hi-lo)),step=1,big=5,lab=v=>v%big===0,ls='s',end=false,arrows=[],shown=false,hops=[],pts=[],tap=false,label='Number line'}={}){
  const X=16,top=Math.max(0,...arrows.map(r=>r.lv||0)),Y=40+top*38+(hops.length?32:0),x=v=>X+(v-lo)*u,L='lbl'+(ls?' '+ls:''),near=pts.filter(p=>p.t!=null).map(p=>p.v);
  let o=`<line class="axis" x1="${X}" y1="${Y}" x2="${x(hi)+(end?14:0)}" y2="${Y}"/>`;
  if(end)o+=`<polygon class="arrh ax" points="${x(hi)+24},${Y} ${x(hi)+12},${Y-7} ${x(hi)+12},${Y+7}"/>`;
  range(Math.round((hi-lo)/step)+1).forEach(i=>{
    const v=lo+i*step,b=v%big===0;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-(b?8:4)}" x2="${x(v)}" y2="${Y+(b?8:4)}"/>`+(lab(v)&&near.every(w=>Math.abs(w-v)*u>=30)?`<text class="${L}" x="${x(v)}" y="${Y+22}">${v}</text>`:'');
  });
  arrows.forEach(({a,b,lv=0,q})=>{
    const y=Y-18-lv*38,d=b>a?1:-1,t=q&&!shown?'?':Math.abs(b-a);
    o+=`<path class="guide" d="M${x(b)},${y}V${Y}${a?`M${x(a)},${y}V${Y}`:''}"/><line class="arr${q?' q':''}" x1="${x(a)}" y1="${y}" x2="${x(b)-d*6}" y2="${y}"/><polygon class="arrh${q?' q':''}" points="${x(b)},${y} ${x(b)-d*10},${y-6} ${x(b)-d*10},${y+6}"/><text class="lbl s${q?' cy':''}" x="${(x(a)+x(b))/2}" y="${y-12}">${t}</text>`;
  });
  hops.forEach(({a,b,t,q})=>{
    /* a curve from a to b peaking h above the line; the arrowhead follows the curve's direction at b */
    const xa=x(a),xb=x(b),m=(xa+xb)/2,y=Y-4,h=Math.min(30,8+Math.abs(xb-xa)*.35),n=Math.hypot(xb-m,2*h),ux=(xb-m)/n,uy=2*h/n,c=q?' q':'';
    const bx=xb-ux*11,by=y-uy*11;
    o+=`<path class="hop${c}" d="M${xa},${y}Q${m},${y-2*h} ${bx},${by}"/><polygon class="arrh${c}" points="${xb},${y} ${bx-uy*6},${by+ux*6} ${bx+uy*6},${by-ux*6}"/><text class="${L}${q?' cy':''}" x="${m}" y="${y-h-12}">${t}</text>`;
  });
  pts.forEach(({v,cls='',t})=>{o+=`<circle class="pt ${cls}" cx="${x(v)}" cy="${Y}" r="7"/>`+(t!=null?`<text class="${L} ${cls==='b'?'cy':'gd'}" x="${x(v)}" y="${Y+22}">${t}</text>`:'');});
  if(tap)range(Math.round((hi-lo)/step)+1).forEach(i=>{const v=lo+i*step,at=`x="${x(v)-step*u/2}" y="${Y-34}" width="${step*u}" height="66"`;o+=tap==='cand'?`<rect class="cand hit" data-id="${v}" tabindex="0" role="button" aria-label="Tick mark ${i+1}" ${at}/>`:`<rect class="hit" data-v="${v}" ${at}/>`;});
  return svgWrap(X*2+(hi-lo)*u+(end?26:0),Y+32,o,label);
}

/* Counting on or back in jumps, not drawn to scale: start, then moves like [-3,-5,-10]. shown: how many jumps to draw.
   ask: the last number is a ?. */
function jumps(start,moves,shown=moves.length,ask=false){
  const G=96,R=24,Y=78,W=2*R+moves.length*G+16,end=moves.slice(0,shown).reduce((s,d)=>s+d,start);let o='',v=start;
  const node=(i,val)=>`<circle class="jn${i?'':' st'}" cx="${8+R+i*G}" cy="${Y}" r="${R}"/><text class="lbl${ask&&i===shown?' cy':''}" x="${8+R+i*G}" y="${Y}">${ask&&i===shown?'?':val}</text>`;
  o+=node(0,start);
  moves.slice(0,shown).forEach((d,i)=>{
    const x0=8+R+i*G,x1=x0+G;v+=d;
    o+=`<path class="jarc" d="M${x0+8},${Y-R} Q${(x0+x1)/2},${Y-R-52} ${x1-8},${Y-R}"/><polygon class="jhead" points="${x1-8},${Y-R} ${x1-18},${Y-R-8} ${x1-4},${Y-R-12}"/><text class="lbl cy" x="${(x0+x1)/2}" y="${Y-R-34}">${d>0?'+':'−'}${Math.abs(d)}</text>`+node(i+1,v);
  });
  return svgWrap(W,Y+R+6,o,`Jumps from ${start}: `+moves.slice(0,shown).map(d=>(d>0?'plus ':'minus ')+Math.abs(d)).join(', ')+(shown?(ask?', landing on a question mark':`, landing on ${end}`):''));
}

/* Base-ten diagrams small enough for hundreds: a hundred is a 10 × 10 square, a ten a stick of 10, a one a small square (BT pixels each). */
const BT=7,FW=10*BT;
const btGrid=(x,y,cols,rows)=>range(cols-1).map(i=>`<line x1="${x+(i+1)*BT}" y1="${y}" x2="${x+(i+1)*BT}" y2="${y+rows*BT}"/>`).join('')+range(rows-1).map(i=>`<line x1="${x}" y1="${y+(i+1)*BT}" x2="${x+cols*BT}" y2="${y+(i+1)*BT}"/>`).join('');
const flat=(x,y,cls='')=>`<g class="flat ${cls}"><rect x="${x}" y="${y}" width="${FW}" height="${FW}"/>${btGrid(x,y,10,10)}</g>`;
const stick=(x,y,cls='')=>`<g class="rod ${cls}"><rect x="${x}" y="${y}" width="${BT}" height="${FW}"/>${btGrid(x,y,1,10)}</g>`;
const cube1=(x,y,cls='')=>`<rect class="unit1 ${cls}" x="${x}" y="${y}" width="${BT}" height="${BT}"/>`;
/* h hundreds (rows of 5), t tens (a gap after every 5), and o ones (columns of 5) from x, y.
   cls: {h, t, o} classes for each place; tr: the last tr tens came from a broken hundred. Returns [markup, width, height]. */
function hto(x,y,h,t,o,{cls={},tr=0}={}){
  let m='',X=x;
  range(h).forEach(i=>{m+=flat(x+i%5*(FW+8),y+Math.floor(i/5)*(FW+8),cls.h||'');});
  if(h)X+=Math.min(h,5)*(FW+8)+6;
  range(t).forEach(i=>{m+=stick(X+i*(BT+4)+Math.floor(i/5)*5,y,(i>=t-tr?'tr':'')+' '+(cls.t||''));});
  if(t)X+=t*(BT+4)+Math.floor((t-1)/5)*5+10;
  range(o).forEach(i=>{m+=cube1(X+Math.floor(i/5)*(BT+5),y+FW-BT-(i%5)*(BT+5),cls.o||'');});
  if(o)X+=Math.ceil(o/5)*(BT+5);
  return [m,X-x,Math.max(FW,Math.ceil(h/5)*(FW+8)-8)];
}
const htoFig=(h,t,o,opt={},label)=>{const [m,w,ht]=hto(8,8,h,t,o,opt);return svgWrap(Math.max(w+16,120),ht+16,m,label||`${h} hundreds, ${t} tens, and ${o} ones`);};
const digits=n=>[Math.floor(n/100),Math.floor(n/10)%10,n%10];
/* n in blocks: hundreds gold, tens blue, ones green */
const numBlocks=(n,label)=>{const [h,t,o]=digits(n);return htoFig(h,t,o,{cls:{t:'b',o:'c'}},label||`${n} in base-ten blocks`);};
/* the name of a whole number up to 999: numWords(406) is "four hundred six" */
const numWords=(()=>{
  const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],
    TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  return n=>{
    const h=Math.floor(n/100),r=n%100,rw=r<20?ONES[r]:TENS[Math.floor(r/10)]+(r%10?'-'+ONES[r%10]:'');
    return h?`${ONES[h]} hundred${r?' '+rw:''}`:rw;
  };
})();
/* a place-value chart: rows [[label, n]]; hi: the column to outline in every row (0 hundreds, 1 tens, 2 ones) */
const pvChart=(rows,hi=-1)=>`<table class="pv"><tr><th></th><th>Hundreds</th><th>Tens</th><th>Ones</th></tr>${rows.map(([l,n])=>`<tr><th>${l}</th>${digits(n).map((d,i)=>`<td class="p${i}${i===hi?' hi':''}">${d}</td>`).join('')}</tr>`).join('')}</table>`;


/* ---------- flat shapes, solid shapes, equal parts, pattern blocks, clocks, and money ---------- */
/* Flat shapes in a 100 × 100 box, by number of sides. Some are tilted, stretched, or bent in, so the name comes from counting sides. */
const regular=(n,a0=-90)=>range(n).map(i=>{const a=(a0+360*i/n)*Math.PI/180;return [50+46*Math.cos(a),50+46*Math.sin(a)];});
const SHAPES={
  3:[[[50,6],[96,88],[4,88]],[[10,8],[10,92],[84,92]],[[4,78],[96,92],[66,12]],[[8,14],[92,14],[38,92]]],
  4:[[[12,12],[88,12],[88,88],[12,88]],[[4,26],[96,26],[96,74],[4,74]],[[50,4],[88,50],[50,96],[12,50]],[[26,18],[74,18],[96,82],[4,82]],[[20,8],[92,30],[70,92],[6,58]],[[50,6],[92,92],[50,64],[8,92]]],
  5:[regular(5),[[50,6],[92,40],[92,92],[8,92],[8,40]],[[8,22],[58,6],[96,50],[62,92],[6,78]]],
  6:[regular(6,0),[[8,6],[46,6],[46,58],[92,58],[92,94],[8,94]],[[4,42],[30,6],[76,14],[96,56],[66,94],[20,86]]],
};
const SHAPE_NAME={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon'};
/* quadrilaterals by name, for side lengths and square corners */
const QUADS={square:SHAPES[4][0],rectangle:SHAPES[4][1],rhombus:SHAPES[4][2],trapezoid:SHAPES[4][3]};
/* Shape pts drawn from x, y, s pixels across. cls: its class. nums: number each side. lens: a label for each side.
   sq: mark the square corners. Returns markup. */
function shapeAt(pts,x,y,s,{cls='shp',nums=false,lens=null,sq=false}={}){
  const P=pts.map(([a,b])=>[x+a*s/100,y+b*s/100]),n=P.length,f=v=>+v.toFixed(1),
    sg=Math.sign(P.reduce((t,[a,b],i)=>{const [c,d]=P[(i+1)%n];return t+a*d-c*b;},0));
  let o=`<polygon class="${cls}" points="${P.map(p=>p.map(f).join(',')).join(' ')}"/>`;
  P.forEach(([a,b],i)=>{
    const [c,d]=P[(i+1)%n],[e,g]=P[(i+n-1)%n],L=Math.hypot(c-a,d-b),t=nums?i+1:lens?lens[i]:null;
    /* labels sit outside the side (the outward normal depends on which way the points go round) */
    if(t!=null){const k=lens?21:17;o+=`<text class="lbl${lens?'':' s'} cy" x="${f((a+c)/2+sg*(d-b)/L*k)}" y="${f((b+d)/2-sg*(c-a)/L*k)}">${t}</text>`;}
    if(sq){
      const lu=Math.hypot(e-a,g-b),u=[(e-a)/lu,(g-b)/lu],w=[(c-a)/L,(d-b)/L],k=11;
      if(Math.abs(u[0]*w[0]+u[1]*w[1])<.03&&(u[0]*w[1]-u[1]*w[0])*sg<0)o+=`<path class="sqc" d="M${f(a+u[0]*k)},${f(b+u[1]*k)}L${f(a+(u[0]+w[0])*k)},${f(b+(u[1]+w[1])*k)}L${f(a+w[0]*k)},${f(b+w[1]*k)}"/>`;
    }
  });
  return o;
}
const shapeFig=(pts,{s=180,...o}={},label)=>{const m=o.lens?48:30;return svgWrap(s+2*m,s+2*m,shapeAt(pts,m,m,s,o),label||`A ${SHAPE_NAME[pts.length]}`);};

/* n pictures w wide and h tall, side by side (they wrap onto two rows on a phone); draw(i) returns picture i's markup.
   letters: write A, B, C, … under them. tap: each picture is a tap answer for engine.js (.cand, data-id = its place,
   read as "<tap> 1", "<tap> 2", …). label: what each picture is (numbered, or lettered). */
function picRow(n,w,h,draw,{letters=false,tap=null,label='Picture'}={}){
  return `<div class="picrow">${range(n).map(i=>svgWrap(w,h+(letters?30:0),draw(i)+(letters?`<text class="lbl" x="${w/2}" y="${h+14}">${'ABCD'[i]}</text>`:'')
    +(tap?`<rect class="cand hit" data-id="${i}" tabindex="0" role="button" aria-label="${tap} ${i+1}" x="4" y="4" width="${w-8}" height="${h-8}" rx="10"/>`:''),`${label} ${letters?'ABCD'[i]:i+1}`)).join('')}</div>`;
}
/* flat shapes side by side: list [[pts, shapeAt options], …] */
const shapeRow=(list,o={})=>{const m=list.some(([,q])=>q&&q.lens)?45:24;return picRow(list.length,200,200,i=>shapeAt(list[i][0],m,m,200-2*m,list[i][1]),o);};

/* Solid shapes as corners (x, y, z: z goes back) and faces. Drawn at an angle, so the front, top, and right faces show. */
const BOXF=[[0,1,2,3],[4,5,6,7],[0,3,7,4],[1,2,6,5],[0,1,5,4],[3,2,6,7]],CUBEV=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
const SOLIDS={
  cube:{name:'cube',v:CUBEV,f:BOXF,faces:[[6,'square']]},
  box:{name:'box',v:CUBEV.map(([x,y,z])=>[x*1.7,y,z*.7]),f:BOXF,faces:[[6,'rectangle']]},
  pyramid:{name:'pyramid',v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1],[.5,1.1,.5]],f:[[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]],faces:[[1,'square'],[4,'triangle']]},
  prism:{name:'triangle prism',v:[[0,0,0],[1.2,0,0],[.6,1,0],[0,0,1.4],[1.2,0,1.4],[.6,1,1.4]],f:[[0,1,2],[3,4,5],[0,1,4,3],[1,2,5,4],[2,0,3,5]],faces:[[2,'triangle'],[3,'rectangle']]},
};
/* A solid shape, s pixels to a unit. back: show the edges at the back as dashed lines. */
function solidFig(kind,{back=false,s=110,label}={}){
  const S=SOLIDS[kind],V=S.v,P=V.map(([x,y,z])=>[(x+.45*z)*s,(-y-.35*z)*s]),avg=f=>[0,1,2].map(i=>f.reduce((t,j)=>t+V[j][i],0)/f.length),mid=avg(range(V.length));
  /* a face shows when its outside faces the viewer, who looks along (−.45, −.35, 1) */
  const F=S.f.map(f=>{
    const [a,b,c]=f.map(i=>V[i]),u=[0,1,2].map(i=>b[i]-a[i]),w=[0,1,2].map(i=>c[i]-a[i]),n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],
      fc=avg(f),sg=Math.sign(n.reduce((t,v,i)=>t+v*(fc[i]-mid[i]),0)),N=n.map(v=>v*sg/Math.hypot(...n));
    return {f,N,vis:-.45*N[0]-.35*N[1]+N[2]<0};
  });
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),X=v=>+(v-Math.min(...xs)+8).toFixed(1),Y=v=>+(v-Math.min(...ys)+8).toFixed(1),pt=i=>`${X(P[i][0])},${Y(P[i][1])}`;
  const edges=vis=>new Set(F.filter(q=>q.vis===vis).flatMap(({f})=>f.map((a,i)=>[a,f[(i+1)%f.length]].sort().join('-'))));
  const seen=edges(true);
  let o=F.filter(q=>q.vis).map(({f,N})=>`<polygon class="sf ${N[1]>.5?'t':N[0]>.5?'r':'f'}" points="${f.map(pt).join(' ')}"/>`).join('');
  if(back)[...edges(false)].filter(e=>!seen.has(e)).forEach(e=>{const [a,b]=e.split('-');o+=`<path class="hid" d="M${pt(a)}L${pt(b)}"/>`;});
  return svgWrap(Math.max(...xs)-Math.min(...xs)+16,Math.max(...ys)-Math.min(...ys)+16,o,label||`A ${S.name}`);
}

/* Equal parts. PART[n]: the name of 1 part and of more than 1. partName(3, 2) is "2 thirds". */
const PART={2:['half','halves'],3:['third','thirds'],4:['fourth','fourths'],5:['fifth','fifths'],6:['sixth','sixths'],8:['eighth','eighths'],10:['tenth','tenths'],12:['twelfth','twelfths'],100:['hundredth','hundredths']};
const partName=(n,k=1)=>`${k} ${PART[n][k===1?0:1]}`;
/* The parts of a shape cut n ways, as path data, in a box s tall from x, y. shape: 'circle', 'square', or 'rect' (twice as wide as tall).
   how: 'v' strips side by side, 'h' strips on top of each other, 'grid' 2 × 2, 'diag' corner to corner (2 or 4 parts),
   or 'uneq' parts that are not the same size (a circle cut by a line off the middle, or strips of different widths). */
function shareParts(shape,n,how,x,y,s){
  const f=v=>+v.toFixed(1);
  if(shape==='circle'){
    const r=s/2,cx=x+r,cy=y+r,p=a=>{const t=(a-90)*Math.PI/180;return `${f(cx+r*Math.cos(t))},${f(cy+r*Math.sin(t))}`;};
    if(n===1)return [`M${cx-r},${cy}a${r},${r} 0 1 0 ${2*r},0a${r},${r} 0 1 0 ${-2*r},0Z`];
    if(how==='uneq'&&n===2){const lx=f(cx+.4*r),dy=f(Math.sqrt(.84)*r);return [`M${lx},${cy-dy}A${r},${r} 0 0 1 ${lx},${cy+dy}Z`,`M${lx},${cy+dy}A${r},${r} 0 1 1 ${lx},${cy-dy}Z`];}
    const A=how==='uneq'?{3:[160,120,80],4:[130,50,130,50]}[n]:range(n).map(()=>360/n);let a=0;
    return A.map(w=>{const d=`M${cx},${cy}L${p(a)}A${r},${r} 0 ${w>180?1:0} 1 ${p(a+w)}Z`;a+=w;return d;});
  }
  const W=shape==='rect'?2*s:s,box=(a,b,c,d)=>`M${f(x+a)},${f(y+b)}H${f(x+c)}V${f(y+d)}H${f(x+a)}Z`;
  if(how==='grid')return [box(0,0,W/2,s/2),box(W/2,0,W,s/2),box(W/2,s/2,W,s),box(0,s/2,W/2,s)];
  if(how==='diag'){
    const P=[[x,y],[x+W,y],[x+W,y+s],[x,y+s]],c=[x+W/2,y+s/2];
    return n===2?[`M${P[0]}L${P[1]}L${P[2]}Z`,`M${P[0]}L${P[2]}L${P[3]}Z`]:range(4).map(i=>`M${c}L${P[i]}L${P[(i+1)%4]}Z`);
  }
  const F=how==='uneq'?{2:[.62,.38],3:[.46,.32,.22],4:[.34,.28,.22,.16]}[n]:range(n).map(()=>1/n);let t=0;
  return F.map(w=>{const d=how==='h'?box(0,t*s,W,(t+w)*s):box(t*W,0,(t+w)*W,s);t+=w;return d;});
}
/* A shape cut into parts (see shareParts). shade: the parts to color in. tap: parts can be tapped (data-i). */
function shareFig(shape,n,how,{shade=[],s=150,tap=false,label}={}){
  const W=shape==='rect'?2*s:s;
  return svgWrap(W+12,s+12,shareParts(shape,n,how,6,6,s).map((d,i)=>`<path class="pc${shade.includes(i)?' on':''}"${tap?` data-i="${i}"`:''} d="${d}"/>`).join(''),
    label||`A ${shape==='rect'?'rectangle':shape} cut into ${n} ${how==='uneq'?'parts that are not the same size':'equal parts'}, ${shade.length} shaded`);
}

/* same-size shapes side by side, cut into parts: list [{n, how, shade}, …] (see shareParts) */
const shareRow=(shape,list,o={})=>{const W=shape==='rect'?260:140;return picRow(list.length,W+30,170,i=>{const {n,how='v',shade=[]}=list[i];return shareParts(shape,n,how,15,15,140).map((d,j)=>`<path class="pc${shade.includes(j)?' on':''}" d="${d}"/>`).join('');},o);};

/* Pattern blocks. PB[big][small]: how many small blocks fill a big one. */
const PB={hexagon:{triangle:6,rhombus:3,trapezoid:2},trapezoid:{triangle:3},rhombus:{triangle:2}};
/* A big block filled with small ones (show: true for all of them, or how many to draw; 0 or false for just the outline
   and one small block to count with). s: the side of a triangle in pixels. */
function pbFig(big,small,{show=true,s=70,label}={}){
  const V=range(6).map(k=>[s*Math.cos(k*Math.PI/3),s*Math.sin(k*Math.PI/3)]),C=[0,0],R=i=>V[i%6];
  const out={hexagon:V,trapezoid:[V[3],V[4],V[5],V[0]],rhombus:[C,V[4],V[5],V[0]]}[big];
  const all={
    hexagon:{triangle:range(6).map(k=>[C,R(k),R(k+1)]),rhombus:[0,2,4].map(k=>[C,R(k),R(k+1),R(k+2)]),trapezoid:[[V[0],V[1],V[2],V[3]],[V[3],V[4],V[5],V[0]]]},
    trapezoid:{triangle:[3,4,5].map(k=>[C,R(k),R(k+1)])},
    rhombus:{triangle:[4,5].map(k=>[C,R(k),R(k+1)])},
  }[big][small];
  const k=show===true?all.length:show||0,xs=out.map(p=>p[0]),ys=out.map(p=>p[1]),x0=Math.min(...xs)-8,y0=Math.min(...ys)-8,
    pts=l=>l.map(([a,b])=>`${+(a-x0).toFixed(1)},${+(b-y0).toFixed(1)}`).join(' ');
  const o=(k?all.slice(0,k):all.slice(0,1)).map(l=>`<polygon class="pb ${small}" points="${pts(l)}"/>`).join('')+(k===all.length?'':`<polygon class="pb out" points="${pts(out)}"/>`);
  return svgWrap(Math.max(...xs)-x0+8,Math.max(...ys)-y0+8,o,label||`A ${big} with ${k===all.length?all.length:k||1} ${small}${(k||1)>1?'s':''} in it`);
}

/* A clock showing h:m (h 1 to 12). r: radius. shade: [from, to] minutes of the face to color in (a half or a quarter).
   fives: write the minutes (00, 05, … 55) around the outside. */
const hm=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;
function clockFig(h,m,{r=100,shade=null,fives=false,label}={}){
  const c=r+(fives?34:6),f=v=>+v.toFixed(1),pt=(min,d)=>{const a=(min*6-90)*Math.PI/180;return [f(c+d*Math.cos(a)),f(c+d*Math.sin(a))];};
  let o=`<circle class="clk" cx="${c}" cy="${c}" r="${r}"/>`;
  if(shade){const [a,b]=shade,[x1,y1]=pt(a,r-3),[x2,y2]=pt(b,r-3);o+=`<path class="clk-sh" d="M${c},${c}L${x1},${y1}A${r-3},${r-3} 0 ${b-a>30?1:0} 1 ${x2},${y2}Z"/>`;}
  range(60).forEach(i=>{const [x1,y1]=pt(i,r-(i%5?7:14)),[x2,y2]=pt(i,r-3);o+=`<line class="clk-t${i%5?'':' f'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;});
  range(12).forEach(i=>{const [x,y]=pt(i*5,r*.72);o+=`<text class="clk-n" x="${x}" y="${y}" style="font-size:${f(r*.2)}px">${i||12}</text>`;
    if(fives){const [a,b]=pt(i*5,r+18);o+=`<text class="lbl s cy" x="${a}" y="${b}">${String(i*5).padStart(2,'0')}</text>`;}});
  const [hx,hy]=pt((h%12)*5+m/12,r*.5),[mx,my]=pt(m,r*.8);
  o+=`<line class="clk-h" x1="${c}" y1="${c}" x2="${hx}" y2="${hy}"/><line class="clk-m" x1="${c}" y1="${c}" x2="${mx}" y2="${my}"/><circle class="clk-c" cx="${c}" cy="${c}" r="${f(r*.06)}"/>`;
  return svgWrap(2*c,2*c,o,label||`A clock showing ${hm(h,m)}`);
}

/* The day from midnight to midnight: a.m. from midnight to noon and p.m. from noon to midnight. at: an arrow at that hour (0 to 24), or null. */
function dayBar(at,label){
  const x=v=>14+v*14;
  return svgWrap(364,96,`<rect class="dayam" x="${x(0)}" y="22" width="168" height="34"/><rect class="daypm" x="${x(12)}" y="22" width="168" height="34"/><text class="lbl dk" x="${x(6)}" y="39">a.m.</text><text class="lbl" x="${x(18)}" y="39">p.m.</text>`
    +[[0,'midnight',42],[12,'noon',0],[24,'midnight',-42]].map(([v,t,d])=>`<line class="tick" x1="${x(v)}" y1="16" x2="${x(v)}" y2="62"/><text class="lbl s" x="${x(v)+d}" y="80">${t}</text>`).join('')
    +(at==null?'':`<polygon class="arrh" points="${x(at)},20 ${x(at)-9},4 ${x(at)+9},4"/>`),label||'A bar for the whole day: a.m. from midnight to noon, and p.m. from noon to midnight');
}

/* Coins and dollar bills. COINS: each one's name, plural, value in cents, and radius (sizes follow the real coins: a dime is smallest). */
const COINS={q:{name:'quarter',pl:'quarters',v:25,r:35},d:{name:'dime',pl:'dimes',v:10,r:26},n:{name:'nickel',pl:'nickels',v:5,r:31},p:{name:'penny',pl:'pennies',v:1,r:28},B:{name:'dollar bill',pl:'dollar bills',v:100}};
const centsOf=list=>list.reduce((t,k)=>t+COINS[k].v,0);
/* "$2 and 35¢", "$3", or "35¢" */
const amt=c=>{const d=Math.floor(c/100),r=c%100;return d&&r?`$${d} and ${r}¢`:d?`$${d}`:`${r}¢`;};
/* Money: a list of 'B' (a dollar bill), 'q', 'd', 'n', and 'p', drawn bills first and then coins, in rows no wider than W.
   vals: write what each one is worth under it. */
function moneyFig(list,{vals=false,W=470,label}={}){
  const bills=list.filter(k=>k==='B'),coins=list.filter(k=>k!=='B'),L=vals?22:0;
  let o='',x=6,y=6,w=0,row=0;
  /* place a thing iw wide and ih tall, starting a new row when it doesn't fit */
  const put=(iw,ih)=>{if(x>6&&x+iw>W){x=6;y+=row+10+L;row=0;}const at=[x,y];x+=iw+10;w=Math.max(w,x-4);row=Math.max(row,ih);return at;};
  bills.forEach(()=>{
    const [a,b]=put(118,54);
    o+=`<g class="bill"><rect x="${a}" y="${b}" width="118" height="54" rx="4"/><rect class="in" x="${a+5}" y="${b+5}" width="108" height="44" rx="2"/><ellipse class="in" cx="${a+59}" cy="${b+27}" rx="15" ry="18"/><text x="${a+22}" y="${b+27}">1</text><text x="${a+96}" y="${b+27}">1</text></g>`+(vals?`<text class="lbl s gd" x="${a+59}" y="${b+68}">$1</text>`:'');
  });
  if(bills.length&&coins.length)x=W;
  coins.forEach(k=>{
    const {name,v,r}=COINS[k],[a,b]=put(2*r,70);
    o+=`<g class="cn ${k==='p'?'cu':'ag'}"><circle cx="${a+r}" cy="${b+35}" r="${r}"/><circle class="in" cx="${a+r}" cy="${b+35}" r="${r-5}"/><text x="${a+r}" y="${b+35}">${name.toUpperCase()}</text></g>`+(vals?`<text class="lbl s gd" x="${a+r}" y="${b+84}">${v}¢</text>`:'');
  });
  const say=(n,w)=>n?`${n} ${w}${n>1?'s':''}`:'';
  return svgWrap(w,y+row+6+L,o,label||[say(bills.length,'dollar bill'),say(coins.length,'coin')].filter(Boolean).join(' and '));
}

/* ---------- factors and multiples ---------- */
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
/* 20 lockers in two rows of 10; open[v] is true when locker v is open. hi: lockers outlined in gold. sel: the locker picked (cyan). */
function lockers(open,{hi=[],sel=null}={}){
  const L=28,G=2,H=64;let o='';
  range(20).forEach(i=>{
    const v=i+1,x=2+i%10*(L+G),y=4+Math.floor(i/10)*(H+34);
    o+=`<g data-v="${v}"><rect class="lk${open[v]?' open':''}${hi.includes(v)?' hi':''}${v===sel?' sel':''}" x="${x}" y="${y}" width="${L}" height="${H}" rx="2"/>`
      +(open[v]?`<polygon class="door" points="${x},${y} ${x+9},${y+8} ${x+9},${y+H-8} ${x},${y+H}"/>`:`<path class="vent" d="M${x+7},${y+10}h14M${x+7},${y+15}h14M${x+7},${y+20}h14"/>`)
      +`<text class="lbl s${v===sel?' cy':''}" x="${x+L/2}" y="${y+H+16}">${v}</text></g>`;
  });
  return svgWrap(10*(L+G)+2,2*(H+34),o,'20 lockers. Open: '+(range(20).filter(i=>open[i+1]).map(i=>i+1).join(', ')||'none'));
}

/* ---------- fractions ---------- */
/* n/d written stacked. The slash is kept for screen readers and copied text, hidden on screen. */
const fr=(n,d)=>`<span class="fr"><span>${n}</span><span class="sr">/</span><span>${d}</span></span>`;
/* the same in a picture, centered on x, y */
const frT=(x,y,n,d,cls='')=>{const w=5+4.5*Math.max(String(n).length,String(d).length);return `<g class="frt ${cls}"><text class="lbl s" x="${x}" y="${y-10}">${n}</text><line x1="${x-w}" y1="${y}" x2="${x+w}" y2="${y}"/><text class="lbl s" x="${x}" y="${y+11}">${d}</text></g>`;};
/* Fraction strips, one row under another, every whole the same width so rows line up.
   rows: [{d, k, cls, lab, parts, grp, out}]: each whole cut into d equal parts and the first k shaded (cls 'b' blue, 'g' green; gold by default);
   k more than d draws more wholes. lab: [n, d] written to the left of the row. parts: false leaves 1/d out of the parts.
   grp: the shaded parts in groups of grp (or of each size in a list, like [2, 3]), every other group blue. out: the last `out` shaded parts are taken away (crossed out).
   wholes: how many wholes each row has room for (default: as many as the rows need), so the strips keep their size as k grows.
   stack: a row's wholes go one under another, each as wide as the picture, instead of side by side.
   empty: draw all `wholes` wholes in every row, the ones not reached yet unshaded. */
function strips(rows,{wholes=0,stack=false,empty=false,W=560,label}={}){
  const nW=r=>Math.max(1,Math.ceil(r.k/r.d)),M=Math.max(wholes,...rows.map(nW)),L=rows.some(r=>r.lab)?54:4,G=M>1&&!stack?14:0,
    U=stack?W-L-4:(W-L-4-G*(M-1))/M,H=50,RG=12,lines=stack?M:1;
  let o='';
  rows.forEach((r,ri)=>{
    const y0=4+ri*lines*(H+RG),p=U/r.d,ends=Array.isArray(r.grp)?r.grp.map((g,i)=>r.grp.slice(0,i+1).reduce((a,b)=>a+b)):null,
      blue=j=>r.grp&&(ends?ends.findIndex(e=>j<e):Math.floor(j/r.grp))%2===1;
    if(r.lab)o+=frT(L/2-2,y0+H/2,...r.lab);
    range(empty?M:nW(r)).forEach(w=>range(r.d).forEach(i=>{
      const x=L+(stack?0:w*(U+G))+i*p,y=y0+(stack?w*(H+RG):0),j=w*r.d+i,on=j<r.k,gone=on&&j>=r.k-(r.out||0);
      o+=`<rect class="fs${on?' on '+(blue(j)?'b':r.cls||''):''}${gone?' gone':''}" x="${x}" y="${y}" width="${p}" height="${H}"/>`;
      if(r.parts!==false&&p>=30)o+=frT(x+p/2,y+H/2,1,r.d,on&&!gone?'dk':'');
      if(gone)o+=xOut(x+p/2-8,y+H/2-8,16,16);
    }));
  });
  return svgWrap(W,8+rows.length*lines*(H+RG)-RG,o,label||'Fraction strips: '+rows.map(r=>`${r.k} ${PART[r.d][r.k===1?0:1]}`).join(', '));
}
/* Number lines from 0 to `wholes`, one under another, lined up. rows: [{d, pts, hops, tap, labs}]: a tick every 1/d (tall at whole
   numbers, which get their number); labs: every tick gets its fraction; pts: [{k, cls}] dots at k/d ('b' blue, 'g' green);
   hops: that many jumps of 1/d from 0, or [[from, to, cls], …]: jumps of 1/d from from/d to to/d ('q' blue);
   tap: each tick can be tapped (data-v = its k, data-r = the row).
   marks: [{v, t}] a dashed line through every row at v (in wholes), with t ([n, d] or text) above it. */
function fracLine(rows,{wholes=1,W=480,marks=[],label}={}){
  const X=26,U=(W-2*X)/wholes,top=marks.length?44:rows[0].hops&&rows[0].hops.length!==0?34:18,RH=rows.some(r=>r.labs)?84:64,x=v=>X+v*U,Y=i=>top+18+i*RH;
  let o='';
  marks.forEach(({v,t})=>{o+=`<line class="guide" x1="${x(v)}" y1="${top-4}" x2="${x(v)}" y2="${Y(rows.length-1)+14}"/>`+(Array.isArray(t)?frT(x(v),top-22,...t,'cy'):`<text class="lbl s cy" x="${x(v)}" y="${top-16}">${t}</text>`);});
  rows.forEach((r,ri)=>{
    const y=Y(ri),n=r.d*wholes;
    o+=`<line class="axis" x1="${x(0)-6}" y1="${y}" x2="${x(wholes)+6}" y2="${y}"/>`;
    range(n+1).forEach(k=>{
      const whole=k%r.d===0,tx=x(k/r.d);
      o+=`<line class="tick" x1="${tx}" y1="${y-(whole?11:7)}" x2="${tx}" y2="${y+(whole?11:7)}"/>`;
      if(r.labs&&k)o+=frT(tx,y+32,k,r.d);
      else if(whole)o+=`<text class="lbl" x="${tx}" y="${y+26}">${k/r.d}</text>`;
    });
    (Array.isArray(r.hops)?r.hops:[[0,r.hops||0,'']]).forEach(([f,t,c=''])=>range(t-f).forEach(i=>{const a=x((f+i)/r.d),b=x((f+i+1)/r.d);o+=`<path class="hop${c?' '+c:''}" d="M${a},${y-3}Q${(a+b)/2},${y-3-Math.min(40,(b-a)*.8)} ${b},${y-3}"/>`;}));
    (r.pts||[]).forEach(({k,cls=''})=>{o+=`<circle class="pt ${cls}" cx="${x(k/r.d)}" cy="${y}" r="8"/>`;});
    if(r.tap)range(n+1).forEach(k=>{const w=U/r.d;o+=`<rect class="hit" data-r="${ri}" data-v="${k}" x="${x(k/r.d)-w/2}" y="${y-24}" width="${w}" height="48"/>`;});
  });
  return svgWrap(W,Y(rows.length-1)+RH-26,o,label||`Number line${rows.length>1?'s':''} from 0 to ${wholes}`);
}
/* A line plot: counts {k: how many} from lo to hi, one X for each, at k/d (d 1: whole numbers; otherwise every tick is a fraction).
   mark: highlight k. tap: ticks can be tapped (data-v = k). diff: [a, b] draws an arrow from a to b under the line, labelled with b − a.
   unit: written under the line. u: pixels between ticks. */
function lineplot(counts,lo,hi,{d=1,mark=null,tap=false,diff=null,unit='inches',u=56,label}={}){
  const top=Math.max(3,...Object.values(counts)),X=30,Y=16+top*26,x=v=>X+(v-lo)*u,F=d>1,say=k=>F?`${k}/${d}`:k;
  let o='',y=Y+(F?60:44);
  if(mark!==null)o+=`<rect class="colhi" x="${x(mark)-u/2+3}" y="4" width="${u-6}" height="${Y+(F?46:30)}" rx="8"/>`;
  o+=`<line class="axis" x1="${X-18}" y1="${Y}" x2="${x(hi)+18}" y2="${Y}"/>`;
  range(hi-lo+1).forEach(i=>{
    const v=lo+i,h=v===mark;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-6}" x2="${x(v)}" y2="${Y+6}"/>`+(F&&v%d?frT(x(v),Y+28,v,d,h?'cy':''):`<text class="lbl${h?' cy':''}" x="${x(v)}" y="${Y+22}">${v/d}</text>`);
    range(counts[v]||0).forEach(j=>{o+=`<text class="xm${h?' hi':''}" x="${x(v)}" y="${Y-16-j*26}">X</text>`;});
    if(tap)o+=`<rect class="hit" data-v="${v}" x="${x(v)-u/2}" y="0" width="${u}" height="${Y+(F?50:34)}"/>`;
  });
  if(diff){
    const [a,b]=diff;
    o+=`<line class="arr" x1="${x(a)+6}" y1="${y}" x2="${x(b)-6}" y2="${y}"/><polygon class="arrh" points="${x(a)},${y} ${x(a)+10},${y-6} ${x(a)+10},${y+6}"/><polygon class="arrh" points="${x(b)},${y} ${x(b)-10},${y-6} ${x(b)-10},${y+6}"/>`
      +(F?frT((x(a)+x(b))/2,y-22,b-a,d,'cy'):`<text class="lbl s cy" x="${(x(a)+x(b))/2}" y="${y-10}">${b-a}</text>`);
    y+=24;
  }
  o+=`<text class="lbl s" x="${(X+x(hi))/2}" y="${y}">${unit}</text>`;
  return svgWrap(X*2+(hi-lo)*u,y+12,o,label||`Line plot of lengths in ${unit}: `+range(hi-lo+1).map(i=>`${counts[lo+i]||0} at ${say(lo+i)}`).join(', '));
}
/* A hundred grid: 1 whole cut into 10 columns (tenths) of 10 squares (hundredths). cells: a class for each square filled, column by
   column from the top left ('a' gold, 'b' blue), like cellsOf([30, 'a'], [25, 'b']). */
function hundredGrid(cells,{label}={}){
  const C=26,X=4;let o='';
  range(100).forEach(i=>{const c=cells[i];o+=`<rect class="hg${c?' '+c:''}" x="${X+Math.floor(i/10)*C}" y="${X+i%10*C}" width="${C}" height="${C}"/>`;});
  o+=range(9).map(i=>`<line class="hgt" x1="${X+(i+1)*C}" y1="${X}" x2="${X+(i+1)*C}" y2="${X+10*C}"/>`).join('')+`<rect class="hgw" x="${X}" y="${X}" width="${10*C}" height="${10*C}"/>`;
  return svgWrap(10*C+2*X,10*C+2*X,o,label||`A hundred grid with ${cells.filter(Boolean).length} of 100 squares shaded`);
}
