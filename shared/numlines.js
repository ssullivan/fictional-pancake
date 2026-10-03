/* Tape diagrams and number lines for K–5 pages. Styles are in numlines.css. Needs util.js and figures.js (svgWrap).

   tapes(rows, {diff})               tape diagram comparing two amounts
   partWhole(parts, total)           one tape split into parts, with the total above
   numLine(lo, hi, {…})              a number line with arrows, jumps, dots, and tappable ticks (svg)
   jumps(start, moves, shown, ask)   an open number line: counting on or back in jumps, not drawn to scale (svg) */
/* Tape diagrams to compare two amounts. rows: [{label, n, show}] where show is the number to write (or '?').
   diff: label for the difference piece after the shorter tape, or null for none. */
function tapes(rows,{diff=null}={}){
  /* unitW is pixels per 1, so the longest tape is at most 300 wide; the labels take labelW on the left */
  const longest=Math.max(...rows.map(r=>r.n)),unitW=Math.min(16,300/longest),labelW=78,tapeH=34,width=labelW+longest*unitW+60;
  let markup='';
  rows.forEach((r,i)=>{
    const y=10+i*(tapeH+18);
    markup+=`<text class="lbl en" x="${labelW-10}" y="${y+tapeH/2}">${r.label}</text>`
      +`<rect class="tape t${i}" x="${labelW}" y="${y}" width="${r.n*unitW}" height="${tapeH}" rx="4"/>`
      +`<text class="lbl" x="${labelW+r.n*unitW/2}" y="${y+tapeH/2}">${r.show}</text>`;
    /* a shorter tape gets a dashed piece out to the longest one's end: the difference */
    if(diff!==null&&r.n<longest){
      markup+=`<rect class="tape gap" x="${labelW+r.n*unitW}" y="${y}" width="${(longest-r.n)*unitW}" height="${tapeH}" rx="4"/>`
        +`<text class="lbl cy" x="${labelW+(r.n+longest)*unitW/2}" y="${y+tapeH/2}">${diff}</text>`;
    }
  });
  return svgWrap(width,10+rows.length*(tapeH+18),markup,'Tape diagram');
}
/* One tape split into parts, with a bracket and the total above. parts: [{n, show, hi}] (show: the number to write, or '?';
   hi: outline that part), total: what to write above (a number or '?'), label: what the picture says to a screen reader. */
function partWhole(parts,total,label='Tape diagram'){
  /* the whole tape is tapeW wide, so each 1 is unitW */
  const sum=parts.reduce((s,p)=>s+p.n,0),tapeW=340,unitW=tapeW/sum,left=10,tapeY=48,tapeH=40;
  let markup=`<path class="brace" d="M${left},${tapeY-8} v-8 H${left+tapeW} v8"/><text class="lbl${total==='?'?' cy':''}" x="${left+tapeW/2}" y="${tapeY-30}">${total}</text>`,x=left;
  parts.forEach((p,i)=>{
    /* parts alternate between two colors (t0, t1) */
    markup+=`<rect class="tape t${i%2}${p.hi?' hi':''}" x="${x}" y="${tapeY}" width="${p.n*unitW}" height="${tapeH}" rx="4"/>`
      +`<text class="lbl${p.show==='?'?' cy':''}" x="${x+p.n*unitW/2}" y="${tapeY+tapeH/2}">${p.show}</text>`;
    x+=p.n*unitW;
  });
  return svgWrap(tapeW+2*left,tapeY+tapeH+6,markup,label);
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
  /* the line is at height lineY, below room for the arrows (38 pixels a level) and the hops */
  const topLevel=Math.max(0,...arrows.map(r=>r.lv||0)),lineY=40+topLevel*38+(hops.length?32:0),xOf=v=>pad+(v-lo)*u,
    labelCls='lbl'+(ls?' '+ls:''),
    /* the values of dots with text under them: tick numbers within 30 pixels of one are left off */
    dotsWithText=pts.filter(p=>p.t!=null).map(p=>p.v),ticks=Math.round((hi-lo)/step)+1;
  let markup=`<line class="axis" x1="${pad}" y1="${lineY}" x2="${xOf(hi)+(end?14:0)}" y2="${lineY}"/>`;
  if(end)markup+=`<polygon class="arrh ax" points="${xOf(hi)+24},${lineY} ${xOf(hi)+12},${lineY-7} ${xOf(hi)+12},${lineY+7}"/>`;
  range(ticks).forEach(i=>{
    const v=lo+i*step,tall=v%big===0;
    markup+=`<line class="tick" x1="${xOf(v)}" y1="${lineY-(tall?8:4)}" x2="${xOf(v)}" y2="${lineY+(tall?8:4)}"/>`;
    if(lab(v)&&dotsWithText.every(w=>Math.abs(w-v)*u>=30))markup+=`<text class="${labelCls}" x="${xOf(v)}" y="${lineY+22}">${fmt(v)}</text>`;
  });
  arrows.forEach(({a,b,lv=0,q})=>{
    /* dashed guides drop from the arrow's ends to the line (none from 0, where the line starts) */
    const y=lineY-18-lv*38,dir=b>a?1:-1,text=q&&!shown?'?':Math.abs(b-a);
    markup+=`<path class="guide" d="M${xOf(b)},${y}V${lineY}${a?`M${xOf(a)},${y}V${lineY}`:''}"/>`
      +`<line class="arr${q?' q':''}" x1="${xOf(a)}" y1="${y}" x2="${xOf(b)-dir*6}" y2="${y}"/>`
      +`<polygon class="arrh${q?' q':''}" points="${xOf(b)},${y} ${xOf(b)-dir*10},${y-6} ${xOf(b)-dir*10},${y+6}"/>`
      +`<text class="lbl s${q?' cy':''}" x="${(xOf(a)+xOf(b))/2}" y="${y-12}">${text}</text>`;
  });
  hops.forEach(({a,b,t,q})=>{
    /* a curve from a to b peaking about h above the line (higher for longer hops, up to 30) */
    const xa=xOf(a),xb=xOf(b),mid=(xa+xb)/2,y=lineY-4,h=Math.min(30,8+Math.abs(xb-xa)*.35),
      /* (ux, uy): which way the curve is heading at b, from its control point (mid, y − 2h) */
      len=Math.hypot(xb-mid,2*h),ux=(xb-mid)/len,uy=2*h/len,cls=q?' q':'';
    /* the curve stops 11 pixels short of b, at the arrowhead's base (baseX, baseY) */
    const baseX=xb-ux*11,baseY=y-uy*11;
    markup+=`<path class="hop${cls}" d="M${xa},${y}Q${mid},${y-2*h} ${baseX},${baseY}"/>`
      +`<polygon class="arrh${cls}" points="${xb},${y} ${baseX-uy*6},${baseY+ux*6} ${baseX+uy*6},${baseY-ux*6}"/>`
      +`<text class="${labelCls}${q?' cy':''}" x="${mid}" y="${y-h-12}">${t}</text>`;
  });
  pts.forEach(({v,cls='',t})=>{
    markup+=`<circle class="pt ${cls}" cx="${xOf(v)}" cy="${lineY}" r="7"/>`;
    if(t!=null)markup+=`<text class="${labelCls} ${cls==='b'?'cy':'gd'}" x="${xOf(v)}" y="${lineY+22}">${t}</text>`;
  });
  /* tap targets: a box around each tick, a step wide */
  if(tap)range(ticks).forEach(i=>{
    const v=lo+i*step,box=`x="${xOf(v)-step*u/2}" y="${lineY-34}" width="${step*u}" height="66"`;
    markup+=tap==='cand'
      ?`<rect class="cand hit" data-id="${v}" tabindex="0" role="button" aria-label="Tick mark ${i+1}" ${box}/>`
      :`<rect class="hit" data-v="${v}" ${box}/>`;
  });
  return svgWrap(pad*2+(hi-lo)*u+(end?26:0),lineY+32,markup,label);
}

/* Counting on or back in jumps, not drawn to scale: start, then moves like [-3,-5,-10]. shown: how many jumps to draw.
   ask: the last number is a ?. */
function jumps(start,moves,shown=moves.length,ask=false){
  /* each number is a circle (radius nodeR) at height nodeY, jumpW apart */
  const jumpW=96,nodeR=24,nodeY=78,width=2*nodeR+moves.length*jumpW+16,end=moves.slice(0,shown).reduce((s,d)=>s+d,start);
  const nodeX=i=>8+nodeR+i*jumpW,
    node=(i,val)=>`<circle class="jn${i?'':' st'}" cx="${nodeX(i)}" cy="${nodeY}" r="${nodeR}"/><text class="lbl${ask&&i===shown?' cy':''}" x="${nodeX(i)}" y="${nodeY}">${ask&&i===shown?'?':val}</text>`;
  let markup=node(0,start),v=start;
  moves.slice(0,shown).forEach((d,i)=>{
    /* an arc from the top of one circle to the top of the next, labelled +d or −d */
    const x0=nodeX(i),x1=x0+jumpW,top=nodeY-nodeR;v+=d;
    markup+=`<path class="jarc" d="M${x0+8},${top} Q${(x0+x1)/2},${top-52} ${x1-8},${top}"/>`
      +`<polygon class="jhead" points="${x1-8},${top} ${x1-18},${top-8} ${x1-4},${top-12}"/>`
      +`<text class="lbl cy" x="${(x0+x1)/2}" y="${top-34}">${d>0?'+':'−'}${Math.abs(d)}</text>`+node(i+1,v);
  });
  const said=moves.slice(0,shown).map(d=>(d>0?'plus ':'minus ')+Math.abs(d)).join(', ');
  return svgWrap(width,nodeY+nodeR+6,markup,`Jumps from ${start}: `+said+(shown?(ask?', landing on a question mark':`, landing on ${end}`):''));
}
