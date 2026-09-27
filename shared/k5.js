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
   seg(label, opts), press(el, m)    a row of choice buttons */
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
