/* Tape diagrams and number lines for K–5 pages. Styles are in numlines.css. Needs util.js and figures.js (svgWrap).

   tapes(rows, {diff})               tape diagram comparing two amounts
   partWhole(parts, total)           one tape split into parts, with the total above
   numLine(lo, hi, {…})              a number line with arrows, jumps, dots, and tappable ticks (svg)
   jumps(start, moves, shown, ask)   an open number line: counting on or back in jumps, not drawn to scale (svg) */
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
   u: pixels per 1. ls: label class ('s' small, '' normal). fmt(v): how a tick's number is written (like v => commas(v*1000)).
   pad: room left and right of the line, for long numbers at its ends. end: an arrowhead on the right, since the line keeps going.
   arrows: [{a, b, lv, q}] straight arrows above the line from a to b at level lv (0 is lowest), labelled with their length,
     or ? when q and not shown.
   hops: [{a, b, t, q}] curved jumps from a to b labelled t (q: blue).  pts: [{v, cls, t}] dots on the line (cls 'b': blue);
     t is written under the dot, and tick numbers too close to it are left off.  tap: every tick can be tapped (data-v);
   tap 'cand' makes each tick a tap answer for engine.js instead (.cand, data-id = the number).  Returns the svg. */
function numLine(lo,hi,{u=Math.min(18,380/(hi-lo)),step=1,big=5,lab=v=>v%big===0,fmt=v=>v,pad=16,ls='s',end=false,arrows=[],shown=false,hops=[],pts=[],tap=false,label='Number line'}={}){
  const X=pad,top=Math.max(0,...arrows.map(r=>r.lv||0)),Y=40+top*38+(hops.length?32:0),x=v=>X+(v-lo)*u,L='lbl'+(ls?' '+ls:''),near=pts.filter(p=>p.t!=null).map(p=>p.v);
  let o=`<line class="axis" x1="${X}" y1="${Y}" x2="${x(hi)+(end?14:0)}" y2="${Y}"/>`;
  if(end)o+=`<polygon class="arrh ax" points="${x(hi)+24},${Y} ${x(hi)+12},${Y-7} ${x(hi)+12},${Y+7}"/>`;
  range(Math.round((hi-lo)/step)+1).forEach(i=>{
    const v=lo+i*step,b=v%big===0;
    o+=`<line class="tick" x1="${x(v)}" y1="${Y-(b?8:4)}" x2="${x(v)}" y2="${Y+(b?8:4)}"/>`+(lab(v)&&near.every(w=>Math.abs(w-v)*u>=30)?`<text class="${L}" x="${x(v)}" y="${Y+22}">${fmt(v)}</text>`:'');
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
