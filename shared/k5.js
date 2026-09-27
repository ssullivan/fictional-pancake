/* Pictures and controls for K–5 pages: ten-frames, cubes, base-ten blocks, tape diagrams, number lines, and − n + steppers.
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
   hto(x, y, h, t, o, {cls, tr}), htoFig(h, t, o, opt, label)   small base-ten diagrams with hundreds; numBlocks(n) draws n
   digits(n), numWords(n)            [hundreds, tens, ones] of n, and its name ("four hundred six")
   pvChart(rows, hi)                 a hundreds-tens-ones chart (html table)
   stepper(k, label), steppers(el, st, lim, draw)          − n + buttons
   seg(label, opts), press(el, m)    a row of choice buttons
   SHAPES[sides], SHAPE_NAME[sides], QUADS    flat shapes in a 100 × 100 box; shapeAt(pts, x, y, s, {…}) (markup), shapeFig(pts, {…}, label)
   picRow(n, w, h, draw, {letters, tap}), shapeRow(list, {…}), shareRow(shape, list, {…})   pictures side by side, lettered or to tap
   SOLIDS, solidFig(kind, {back})    cubes, boxes, pyramids, and prisms drawn at an angle, with the back edges dashed
   shareFig(shape, n, how, {shade}), PART, partName(n, k)   a circle or rectangle cut into halves, thirds, or fourths
   PB, pbFig(big, small, {show})     pattern blocks: a hexagon, trapezoid, or rhombus filled with smaller blocks
   clockFig(h, m, {shade, fives}), hm(h, m), dayBar(at)   a clock face, "3:05", and the day from midnight to midnight
   COINS, moneyFig(list, {vals}), centsOf(list), amt(c)   coins and dollar bills, their total, and "$2 and 35¢" */
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

/* − n + buttons. Markup for one number k; wire them all with steppers(). */
const stepper=(k,label)=>`<span class="stepper"><span>${label}</span><button type="button" class="ghost-btn" data-k="${k}" data-d="-1" aria-label="${label}: one less">−</button><b data-${k}></b><button type="button" class="ghost-btn" data-k="${k}" data-d="1" aria-label="${label}: one more">+</button></span>`;
function steppers(el,st,lim,draw){
  el.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const k=b.dataset.k,v=st[k]+ +b.dataset.d;if(v<lim[k][0]||v>lim[k][1])return;st[k]=v;draw();});
}
/* a row of choice buttons (data-m); the pressed one gets aria-pressed */
const seg=(label,opts)=>`<div class="seg" role="group" aria-label="${label}">${opts.map(([id,t])=>`<button type="button" data-m="${id}">${t}</button>`).join('')}</div>`;
const press=(el,m)=>el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===String(m)));

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
const PART={2:['half','halves'],3:['third','thirds'],4:['fourth','fourths']};
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
