/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1): figures, widgets, and the chapters. Loaded by learn.html. */
const range=n=>[...Array(n).keys()];
const cellsOf=(...groups)=>groups.flatMap(([n,c])=>Array(n).fill(c));

/* ---------- figures ---------- */
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
/* tens and ones as blocks from x; returns [markup, width] */
function blocks(x,y,tens,ones,cls=''){
  let o='';
  range(tens).forEach(i=>o+=rod(x+i*(S+6),y,cls));
  const ox=x+tens*(S+6)+(tens?6:0);
  range(ones).forEach(i=>o+=one(ox+Math.floor(i/5)*(S+4),y+S*10-S-(i%5)*(S+4),cls));
  return [o,ox+Math.ceil(ones/5)*(S+4)-x];
}

/* pictures for picture graphs, centered at x, y */
const PIC={
  note:(x,y,c)=>`<rect class="sticky ${c}" x="${x-13}" y="${y-13}" width="26" height="26" rx="4"/>`,
  sun:(x,y)=>`<g class="p-sun"><circle cx="${x}" cy="${y}" r="8"/>${range(8).map(i=>{const a=i*Math.PI/4,c=Math.cos(a),s=Math.sin(a);return `<line x1="${x+c*11}" y1="${y+s*11}" x2="${x+c*15}" y2="${y+s*15}"/>`;}).join('')}</g>`,
  cloud:(x,y)=>`<g class="p-cloud"><circle cx="${x-6}" cy="${y+2}" r="7"/><circle cx="${x+2}" cy="${y-3}" r="9"/><circle cx="${x+8}" cy="${y+3}" r="6"/><rect x="${x-13}" y="${y+2}" width="21" height="7" rx="3"/></g>`,
  rain:(x,y)=>`<path class="p-rain" d="M${x},${y-13} C${x+4},${y-5} ${x+10},${y} ${x+10},${y+5} A10,10 0 0 1 ${x-10},${y+5} C${x-10},${y} ${x-4},${y-5} ${x},${y-13}Z"/>`,
  dot:(x,y,c)=>`<circle class="sticky ${c}" cx="${x}" cy="${y}" r="12"/>`,
};
/* Picture graph: rows [{label, n, pic, c}], one picture = 1. hi: index of a row to highlight. */
function picGraph(rows,{hi=-1,max=Math.max(...rows.map(r=>r.n)),title='',unit='1'}={}){
  const L=92,P=34,T=title?30:6,W=Math.max(L+max*P+16,title.length*10+16),H=T+rows.length*P+34;
  let o=title?`<text class="lbl st" x="4" y="16">${title}</text>`:'';
  rows.forEach((r,i)=>{
    const y=T+i*P;
    if(i===hi)o+=`<rect class="rowhi" x="2" y="${y}" width="${W-4}" height="${P}" rx="6"/>`;
    o+=`<text class="lbl en" x="${L-10}" y="${y+P/2}">${r.label}</text><line class="axis" x1="${L}" y1="${y}" x2="${L}" y2="${y+P}"/>`;
    range(r.n).forEach(k=>o+=PIC[r.pic](L+P/2+k*P,y+P/2,r.c));
  });
  o+=`<text class="lbl s st" x="4" y="${H-10}">Each picture shows ${unit}.</text>`;
  return svgWrap(W,H,o,'Picture graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
/* Bar graph with a scale of 1. rows [{label, n, c}]. edit: every square of every column can be tapped (data-r, data-v).
   hi: index of a bar to highlight. diff: [small, big] row indexes, shows how much taller the big bar is (with its size if showDiff). */
function barGraph(rows,{max=10,edit=false,hi=-1,diff=null,showDiff=false,title=''}={}){
  const BW=58,GAP=32,UH=24,L=36,T=title?44:12,W=Math.max(L+rows.length*(BW+GAP)+GAP,title.length*10+16),H=T+max*UH+36,Y=v=>T+(max-v)*UH,X=i=>L+GAP+i*(BW+GAP);
  let o=title?`<text class="lbl st" x="4" y="18">${title}</text>`:'';
  range(max+1).forEach(v=>o+=`<line class="gl" x1="${L}" y1="${Y(v)}" x2="${W-6}" y2="${Y(v)}"/><text class="lbl s en" x="${L-8}" y="${Y(v)}">${v}</text>`);
  o+=`<line class="axis" x1="${L}" y1="${Y(0)}" x2="${W-6}" y2="${Y(0)}"/><line class="axis" x1="${L}" y1="${Y(max)}" x2="${L}" y2="${Y(0)}"/>`;
  rows.forEach((r,i)=>{
    if(r.n)o+=`<rect class="bar ${r.c}${i===hi?' hi':''}" x="${X(i)}" y="${Y(r.n)}" width="${BW}" height="${r.n*UH}"/>`;
    o+=`<text class="lbl s" x="${X(i)+BW/2}" y="${Y(0)+18}">${r.label}</text>`;
    if(edit)range(max).forEach(v=>o+=`<rect class="hit" data-r="${i}" data-v="${v+1}" x="${X(i)}" y="${Y(v+1)}" width="${BW}" height="${UH}"/>`);
  });
  if(diff){
    const [s,b]=diff,ys=Y(rows[s].n),yb=Y(rows[b].n),xb=X(b)+BW+6;
    o+=`<line class="match" x1="${X(s)}" y1="${ys}" x2="${X(b)+BW}" y2="${ys}"/><path class="brace" d="M${xb},${yb} h6 V${ys} h-6"/>`;
    o+=`<text class="lbl cy st" x="${xb+10}" y="${(ys+yb)/2}">${showDiff?rows[b].n-rows[s].n:'?'}</text>`;
  }
  return svgWrap(W+(diff?18:0),H,o,'Bar graph: '+rows.map(r=>`${r.label} ${r.n}`).join(', '));
}
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

/* − n + buttons. Markup for one number k; wire them all with steppers(). */
const stepper=(k,label)=>`<span class="stepper"><span>${label}</span><button type="button" class="ghost-btn" data-k="${k}" data-d="-1" aria-label="${label}: one less">−</button><b data-${k}></b><button type="button" class="ghost-btn" data-k="${k}" data-d="1" aria-label="${label}: one more">+</button></span>`;
function steppers(el,st,lim,draw){
  el.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const k=b.dataset.k,v=st[k]+ +b.dataset.d;if(v<lim[k][0]||v>lim[k][1])return;st[k]=v;draw();});
}
/* a row of choice buttons (data-m); the pressed one gets aria-pressed */
const seg=(label,opts)=>`<div class="seg" role="group" aria-label="${label}">${opts.map(([id,t])=>`<button type="button" data-m="${id}">${t}</button>`).join('')}</div>`;
const press=(el,m)=>el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===String(m)));

/* ---------- Chapter 1: add and subtract within 20 ---------- */
function wAdd(el){
  const q=Q(el),st={a:6,b:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('a','Yellow')}${stepper('b','Blue')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st;q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=tenFrames(cellsOf([a,'a'],[b,'b']),{label:`${a} yellow and ${b} blue counters`});
    q('r').innerHTML=`<b>${a} + ${b} = ${a+b}</b>`+(a+b>10?`<br><span class="dimline">The first frame is full: 10 and ${a+b-10} more make ${a+b}.</span>`:a+b===10?`<br><span class="ok">That fills a whole frame: 10!</span>`:'');
  };
  steppers(el,st,{a:[0,10],b:[0,10]},draw);draw();
}
function wTake(el){
  const q=Q(el),N=14,out=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([N,'a']),{out,label:`${N} counters. Tap counters to take them away.`});
    q('r').innerHTML=`<b>${N} − ${out.size} = ${N-out.size}</b>`+(out.size?`<br><span class="dimline">You took away ${out.size}. ${N-out.size} are left.</span>`:'<br><span class="dimline">Tap a counter to take it away.</span>');
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(!g)return;const i=+g.dataset.i;out.has(i)?out.delete(i):out.add(i);draw();});
  q('clr').onclick=()=>{out.clear();draw();};
  draw();
}
function wFamily(el){
  const q=Q(el),PAIRS=[[8,5],[6,9],[4,7]];let p=0,f=0;
  el.innerHTML=`<div class="fig" data-f></div><div data-eq></div><div class="wrow"><button type="button" class="ghost-btn" data-new>New cubes</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],t=a+b,facts=[[`${a} + ${b} = ${t}`,''],[`${b} + ${a} = ${t}`,''],[`${t} − ${b} = ${a}`,'b'],[`${t} − ${a} = ${b}`,'a']];
    q('eq').innerHTML=seg('Facts',facts.map(([s],i)=>[i,s]));press(el,f);
    const off=facts[f][1];
    q('f').innerHTML=svgWrap(t*CUBE+8,CUBE+8,cubes(4,4,a,'a'+(off==='a'?' off':''))+cubes(4+a*CUBE,4,b,'b'+(off==='b'?' off':'')),`${a} yellow cubes and ${b} blue cubes`);
    q('r').innerHTML=f<2?`Put the yellow and blue cubes together: <b>${facts[f][0]}</b>.`:`Start with all ${t} and take away the ${off==='a'?'yellow':'blue'} ones: <b>${facts[f][0]}</b>.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){f=+b.dataset.m;draw();}});
  q('new').onclick=()=>{p=(p+1)%PAIRS.length;f=0;draw();};
  draw();
}
function wMissing(el){
  const q=Q(el),A=8,T=13;let b=0;
  el.innerHTML=`<p class="eq">${A} + <b class="q">?</b> = ${T}</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([A,'a'],[b,'b']),{tap:true,label:`${A} yellow counters. Tap empty squares to add blue counters.`});
    q('r').innerHTML=b===T-A?`<span class="ok"><b>${A} + ${b} = ${T}</b>. The missing number is ${b}.</span>`:`<b>${A} + ${b} = ${A+b}</b><br><span class="dimline">${A+b<T?`Tap empty squares to add more. You need ${T} in all.`:`That’s more than ${T}. Tap a blue counter to take it back.`}</span>`;
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(!g)return;const i=+g.dataset.i;if(i>=A+b)b++;else if(i>=A)b--;draw();});
  q('clr').onclick=()=>{b=0;draw();};
  draw();
}

/* ---------- Chapter 2: add your way ---------- */
function wMakeTen(el){
  const q=Q(el),PAIRS=[[9,5],[8,6],[7,5],[8,7]];let p=0,moved=false;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} + ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],need=10-a;press(el,p);
    const cells=moved?[...cellsOf([a,'a'],[need,'b moved']),...cellsOf([b-need,'b'])]:[...cellsOf([a,'a'],[need,null]),...cellsOf([b,'b'])];
    q('f').innerHTML=tenFrames(cells,{label:moved?`10 in the first frame and ${b-need} in the second`:`${a} yellow in the first frame and ${b} blue in the second`});
    q('go').textContent=moved?'Move them back':`Move ${need} to make a ten`;
    q('r').innerHTML=moved?`<span class="ok"><b>${a} + ${b} = 10 + ${b-need} = ${a+b}</b></span><br><span class="dimline">${need} blue moved over to fill the first frame. ${b-need} are left.</span>`:`<b>${a} + ${b}</b><br><span class="dimline">The first frame needs ${need} more to make a ten.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;moved=false;draw();}});
  q('go').onclick=()=>{moved=!moved;draw();};
  draw();
}
function wDoubles(el){
  const q=Q(el),st={n:6};let more=false;
  el.innerHTML=`<div class="wrow">${stepper('n','Cubes')}</div>`+seg('Kind',[['d','Double'],['m','One more']])+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n}=st,m=more?n+1:n;q('n').textContent=n;press(el,more?'m':'d');
    q('f').innerHTML=svgWrap(10*CUBE+8,2*CUBE+12,cubes(4,4,n,'a')+cubes(4,CUBE+8,m,'b')+(more?`<rect class="extra" x="${4+n*CUBE-2}" y="${CUBE+6}" width="${CUBE+2}" height="${CUBE+2}" rx="5"/>`:''),`${n} yellow cubes above ${m} blue cubes`);
    q('r').innerHTML=more?`<b>${n} + ${m} = ${n+m}</b><br><span class="dimline">${n} + ${n} = ${2*n}, and 1 more makes ${n+m}.</span>`:`<b>${n} + ${n} = ${2*n}</b><br><span class="dimline">A double: two rows the same length.</span>`;
  };
  steppers(el,st,{n:[1,9]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){more=b.dataset.m==='m';draw();}});
  draw();
}
function wTensOnes(el){
  const q=Q(el),PAIRS=[[24,13],[31,15],[26,17]];let p=0,joined=false;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} + ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],t=Math.floor(a/10)+Math.floor(b/10),o=a%10+b%10;press(el,p);
    let svg,w;
    if(!joined){
      const [m1,w1]=blocks(6,10,Math.floor(a/10),a%10,'a'),[m2,w2]=blocks(6+w1+34,10,Math.floor(b/10),b%10,'b');
      svg=m1+`<text class="lbl big" x="${6+w1+17}" y="${10+S*5}">+</text>`+m2;w=6+w1+34+w2+6;
    }else{
      // tens with tens, then ones with ones; 10 ones become a new ten (outlined)
      const ta=Math.floor(a/10),tb=Math.floor(b/10),[mt1,wt1]=blocks(6,10,ta,0,'a'),[mt2,wt2]=blocks(6+wt1,10,tb,0,'b');
      let x=6+wt1+wt2;svg=mt1+mt2;
      if(o>=10){svg+=rod(x,10,'new');x+=S+6;}
      const oa=o>=10?0:a%10,ob=o>=10?o-10:b%10,[mo1,wo1]=blocks(x+10,10,0,oa,'a'),[mo2,wo2]=blocks(x+10+wo1+(oa?4:0),10,0,ob,'b');
      svg+=mo1+mo2;w=x+10+wo1+wo2+10;
    }
    q('f').innerHTML=svgWrap(Math.max(w,160),S*10+24,svg,joined?'Tens together and ones together':`${a} and ${b} in base-ten blocks`);
    q('go').textContent=joined?'Split them again':'Put tens with tens and ones with ones';
    q('r').innerHTML=joined?`Tens: <b>${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${t*10}</b>. Ones: <b>${a%10} + ${b%10} = ${o}</b>.`+(o>=10?`<br><span class="dimline">${o} ones is 1 ten and ${o-10} ones, so make a new ten.</span>`:'')+`<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span>`:`<b>${a} + ${b}</b><br><span class="dimline">Tall rods are tens. Small squares are ones.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;joined=false;draw();}});
  q('go').onclick=()=>{joined=!joined;draw();};
  draw();
}

/* ---------- Chapter 3: picture graphs ---------- */
const COLORS=[{c:'red',label:'Red'},{c:'blue',label:'Blue'},{c:'green',label:'Green'},{c:'yellow',label:'Yellow'}];
function wSort(el){
  const q=Q(el),PILE=['blue','red','green','blue','yellow','red','blue','green','blue','red','yellow','blue'],done=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-one>Sort one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let o=`<text class="lbl st" x="4" y="14">${done.size<PILE.length?'Tap a vote to sort it':'All sorted!'}</text>`;
    // two rows of six, each note with a 44px tap area
    PILE.forEach((c,i)=>{const x=26+i%6*44,y=48+Math.floor(i/6)*44;if(!done.has(i))o+=`<g data-i="${i}" class="tapme"><rect class="hit" x="${x-22}" y="${y-22}" width="44" height="44"/>${PIC.note(x,y,c)}</g>`;});
    const rows=COLORS.map(k=>({...k,pic:'note',n:[...done].filter(i=>PILE[i]===k.c).length}));
    q('f').innerHTML=svgWrap(6*44+8,120,o,'Sticky notes to sort')+picGraph(rows,{max:6,title:'Our favorite colors'});
    const counts=rows.map(r=>`${r.label} ${r.n}`).join(', ');
    q('r').innerHTML=done.size===PILE.length?`<span class="ok">All ${PILE.length} votes sorted! ${counts}.</span>`:`Sorted: <b>${done.size}</b> of ${PILE.length}`;
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(g){done.add(+g.dataset.i);draw();}});
  q('one').onclick=()=>{const i=PILE.findIndex((_,i)=>!done.has(i));if(i>=0){done.add(i);draw();}};
  q('clr').onclick=()=>{done.clear();draw();};
  draw();
}
const WEATHER=[{label:'Sunny',n:9,pic:'sun'},{label:'Cloudy',n:7,pic:'cloud'},{label:'Rainy',n:5,pic:'rain'}];
function wReadPic(el){
  const q=Q(el);let hi=-1;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((r,i)=>`<button type="button" class="ghost-btn" data-row="${i}">${r.label}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=picGraph(WEATHER,{hi,title:'Weather on school days in March',unit:'1 day'});
    q('r').innerHTML=hi<0?'Tap a kind of weather to count its row.':`There were <b>${WEATHER[hi].n} ${WEATHER[hi].label.toLowerCase()} days</b>.`+(hi===0?' That’s the longest row: the most days.':hi===2?' That’s the shortest row: the fewest days.':'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b){hi=+b.dataset.row;draw();}});
  draw();
}
function wTotal(el){
  const q=Q(el),added=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((r,i)=>`<button type="button" class="ghost-btn" data-row="${i}">Add ${r.label.toLowerCase()}</button>`).join('')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const order=[...added];
    q('f').innerHTML=picGraph(WEATHER,{hi:order.length?order[order.length-1]:-1,title:'Weather on school days in March',unit:'1 day'});
    el.querySelectorAll('[data-row]').forEach(b=>b.disabled=added.has(+b.dataset.row));
    const sum=order.reduce((s,i)=>s+WEATHER[i].n,0);
    q('r').innerHTML=!order.length?'Add each row to find how many days in all.':`<b>${order.map(i=>WEATHER[i].n).join(' + ')} = ${sum}</b>`+(order.length===WEATHER.length?`<br><span class="ok">There were ${sum} school days in all.</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b){added.add(+b.dataset.row);draw();}});
  q('clr').onclick=()=>{added.clear();draw();};
  draw();
}

/* ---------- Chapter 4: bar graphs ---------- */
const SNACKS=[{label:'Apples',n:6,c:'red'},{label:'Crackers',n:3,c:'yellow'},{label:'Yogurt',n:8,c:'blue'},{label:'Carrots',n:5,c:'green'}];
function wBuildBar(el){
  const q=Q(el),h=SNACKS.map(()=>0);
  el.innerHTML=`<table class="tally"><caption>Snacks our class chose</caption><tr><th>Snack</th><th>Students</th></tr>${SNACKS.map(s=>`<tr><td>${s.label}</td><td>${s.n}</td></tr>`).join('')}</table><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=barGraph(SNACKS.map((s,i)=>({...s,n:h[i]})),{edit:true,title:'Tap in each column to set its bar'});
    const right=h.filter((v,i)=>v===SNACKS[i].n).length;
    q('r').innerHTML=right===SNACKS.length?'<span class="ok">Your bar graph matches the table!</span>':`Bars that match the table: <b>${right}</b> of ${SNACKS.length}`;
  };
  q('f').addEventListener('click',e=>{const t=e.target.closest('[data-r]');if(t){const r=+t.dataset.r,v=+t.dataset.v;h[r]=h[r]===v?v-1:v;draw();}});
  draw();
}
const BOOKS=[{label:'Mai',n:4,c:'green'},{label:'Diego',n:7,c:'blue'},{label:'Elena',n:5,c:'red'}];
function wReadBar(el){
  const q=Q(el);let hi=-1;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${SNACKS.map((s,i)=>`<button type="button" class="ghost-btn" data-row="${i}">${s.label}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=barGraph(SNACKS,{hi,title:'Snacks our class chose'});
    q('r').innerHTML=hi<0?'Tap a snack to read its bar.':`Follow the top of the ${SNACKS[hi].label.toLowerCase()} bar across to the numbers: <b>${SNACKS[hi].n} students</b> chose ${SNACKS[hi].label.toLowerCase()}.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b){hi=+b.dataset.row;draw();}});
  draw();
}
const PETS=[{label:'Dogs',n:7,pic:'dot',c:'yellow'},{label:'Cats',n:5,pic:'dot',c:'blue'},{label:'Fish',n:3,pic:'dot',c:'green'}];
function wTwoGraphs(el){
  const q=Q(el);let m='pic';
  el.innerHTML=seg('Graph',[['pic','Picture graph'],['bar','Bar graph']])+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,m);
    q('f').innerHTML=m==='pic'?picGraph(PETS,{title:'Pets our class has',unit:'1 pet'}):barGraph(PETS,{max:8,title:'Pets our class has'});
    q('r').innerHTML=`Both graphs show <b>7 dogs, 5 cats, and 3 fish</b>. ${m==='pic'?'Here you count the pictures.':'Here you read where each bar stops.'}`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){m=b.dataset.m;draw();}});
  draw();
}
const ASK=[
  {q:'How many students chose yogurt?',hi:2,a:'8 students. Read the top of the yogurt bar.'},
  {q:'Which snack did the fewest students choose?',hi:1,a:'Crackers: the shortest bar, 3 students.'},
  {q:'How many students chose apples or carrots?',hi:-1,a:'6 + 5 = 11 students. Add the two bars.'},
  {q:'Which snack tastes the best?',hi:-1,a:'The graph can’t answer that. It only shows how many students chose each snack.'},
];
function wAsk(el){
  const q=Q(el);let k=-1;
  el.innerHTML=`<div class="fig" data-f></div><div class="chips">${ASK.map((a,i)=>`<button type="button" class="chip" data-a="${i}">${a.q}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    el.querySelectorAll('[data-a]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.a===k));
    q('f').innerHTML=barGraph(SNACKS,{hi:k<0?-1:ASK[k].hi,title:'Snacks our class chose'});
    q('r').innerHTML=k<0?'Tap a question. Can the graph answer it?':ASK[k].a;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b){k=+b.dataset.a;draw();}});
  draw();
}

/* ---------- Chapter 5: compare ---------- */
function wMore(el){
  const q=Q(el),st={a:9,b:5};let show=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('a','Dogs')}${stepper('b','Cats')}</div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st,rows=[{label:'Dogs',n:a,c:'yellow'},{label:'Cats',n:b,c:'blue'}];q('a').textContent=a;q('b').textContent=b;
    const d=a===b?null:a>b?[1,0]:[0,1],big=Math.max(a,b),small=Math.min(a,b),bigL=a>b?'dogs':'cats',smallL=a>b?'cats':'dogs';
    q('f').innerHTML=barGraph(rows,{diff:d,showDiff:show,title:'Dogs and cats at the pet shelter'});
    q('go').textContent=show?'Hide the difference':'Show how many more';
    q('go').hidden=!d;
    q('r').innerHTML=!d?`<b>${a} dogs and ${b} cats</b>: the same number, so neither has more.`:show?`<span class="ok"><b>${big} − ${small} = ${big-small}</b>, or <b>${small} + ${big-small} = ${big}</b>.</span><br>There are ${big-small} more ${bigL} than ${smallL}.`:`How many more ${bigL} than ${smallL}? Look at how much taller the ${bigL} bar is.`;
  };
  steppers(el,st,{a:[1,10],b:[1,10]},draw);
  q('go').onclick=()=>{show=!show;draw();};
  draw();
}
function wTape(el){
  const q=Q(el),st={a:12,b:7};
  el.innerHTML=`<div class="wrow">${stepper('a','Priya')}${stepper('b','Kiran')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st;q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=tapes([{label:'Priya',n:a,show:a},{label:'Kiran',n:b,show:b}],{diff:a===b?null:Math.abs(a-b)});
    q('r').innerHTML=a===b?`Priya and Kiran each have <b>${a}</b> stickers. The tapes are the same length.`:`The dashed piece is the difference: <b>${Math.max(a,b)} − ${Math.min(a,b)} = ${Math.abs(a-b)}</b>.<br>${a>b?'Priya':'Kiran'} has ${Math.abs(a-b)} more stickers than ${a>b?'Kiran':'Priya'}.`;
  };
  steppers(el,st,{a:[1,20],b:[1,20]},draw);draw();
}
const KINDS=[
  {id:'diff',label:'How many more?',story:'Jada has 34 books. Han has 22 books. How many more books does Jada have than Han?',rows:[['Jada',34,'34'],['Han',22,'22']],diff:'?',ans:'34 − 22 = 12, or 22 + 12 = 34. Jada has 12 more books.'},
  {id:'big',label:'Bigger one unknown',story:'Han has 22 books. Jada has 12 more books than Han. How many books does Jada have?',rows:[['Jada',34,'?'],['Han',22,'22']],diff:'12',ans:'Jada has more, so add: 22 + 12 = 34 books.'},
  {id:'small',label:'Smaller one unknown',story:'Jada has 34 books. Han has 12 fewer books than Jada. How many books does Han have?',rows:[['Jada',34,'34'],['Han',22,'?']],diff:'12',ans:'Han has fewer, so subtract: 34 − 12 = 22 books.'},
];
function wKinds(el){
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Kind of problem',KINDS.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the answer</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=KINDS[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=tapes(K.rows.map(([label,n,show])=>({label,n,show})),{diff:K.diff});
    q('go').hidden=shown;
    q('r').innerHTML=shown?`<span class="ok">${K.ans}</span>`:'Where is the <b>?</b> in the tapes? That’s what the problem asks.';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=true;draw();};
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  add84:tenFrames(cellsOf([8,'a'],[4,'b']),{label:'8 yellow and 4 blue counters'}),
  make86:tenFrames([...cellsOf([8,'a'],[2,null]),...cellsOf([6,'b'])],{label:'8 yellow in the first frame and 6 blue in the second'}),
  colors:picGraph([{label:'Red',n:4,pic:'note',c:'red'},{label:'Blue',n:6,pic:'note',c:'blue'},{label:'Green',n:3,pic:'note',c:'green'},{label:'Yellow',n:5,pic:'note',c:'yellow'}],{title:'Favorite colors in Room 12'}),
  weather:picGraph(WEATHER,{title:'Weather on school days in March',unit:'1 day'}),
  pets:picGraph([{label:'Dogs',n:6,pic:'dot',c:'yellow'},{label:'Cats',n:4,pic:'dot',c:'blue'},{label:'Fish',n:3,pic:'dot',c:'green'}],{title:'Pets in Room 8',unit:'1 pet'}),
  snacks:barGraph(SNACKS,{title:'Snacks our class chose'}),
  books:barGraph(BOOKS,{title:'Books read this week'}),
  petsPic:picGraph(PETS,{title:'Pets our class has',unit:'1 pet'}),
  stickers:tapes([{label:'Elena',n:15,show:15},{label:'Noah',n:9,show:'?'}],{diff:'6'}),
};
const petBars=ns=>barGraph(PETS.map((p,i)=>({...p,n:ns[i]})),{max:8});

/* ---------- chapters ---------- */
const ICON={
  cubes:'<g stroke="#f3f6fb" stroke-width="1.5"><rect x="4" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="16" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="28" y="24" width="12" height="12" rx="2" fill="#ffc93c"/><rect x="40" y="24" width="12" height="12" rx="2" fill="#7fe3ff"/><rect x="52" y="24" width="10" height="12" rx="2" fill="#7fe3ff"/></g>',
  ten:'<g fill="none" stroke="#a9c4e4" stroke-width="1.5"><rect x="4" y="18" width="56" height="24"/><line x1="15.2" y1="18" x2="15.2" y2="42"/><line x1="26.4" y1="18" x2="26.4" y2="42"/><line x1="37.6" y1="18" x2="37.6" y2="42"/><line x1="48.8" y1="18" x2="48.8" y2="42"/><line x1="4" y1="30" x2="60" y2="30"/></g><g fill="#ffc93c"><circle cx="9.6" cy="24" r="4"/><circle cx="20.8" cy="24" r="4"/><circle cx="32" cy="24" r="4"/><circle cx="43.2" cy="24" r="4"/><circle cx="54.4" cy="24" r="4"/><circle cx="9.6" cy="36" r="4"/><circle cx="20.8" cy="36" r="4"/></g><g fill="#7fe3ff"><circle cx="32" cy="36" r="4"/><circle cx="43.2" cy="36" r="4"/><circle cx="54.4" cy="36" r="4"/></g>',
  pic:'<g><rect x="6" y="10" width="12" height="12" rx="2" fill="#ff7b7b"/><rect x="22" y="10" width="12" height="12" rx="2" fill="#ff7b7b"/><rect x="6" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="22" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="38" y="26" width="12" height="12" rx="2" fill="#6fa8ff"/><rect x="6" y="42" width="12" height="12" rx="2" fill="#5fe0a8"/></g>',
  bar:'<line x1="6" y1="56" x2="60" y2="56" stroke="#f3f6fb" stroke-width="2"/><rect x="10" y="30" width="12" height="26" fill="#ff7b7b"/><rect x="26" y="16" width="12" height="40" fill="#6fa8ff"/><rect x="42" y="38" width="12" height="18" fill="#5fe0a8"/>',
  tape:'<rect x="4" y="14" width="56" height="14" rx="2" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="4" y="36" width="34" height="14" rx="2" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="38" y="36" width="22" height="14" rx="2" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 3"/>',
};
const CH=[
  {icon:'cubes',title:'Add and subtract within 20',lessons:'Lessons 1–3',blurb:'Put groups together, take some away, and see how adding and subtracting fit together.',steps:[
    {title:'Put together to add',widget:wAdd,
      body:'<p>When you put two groups together, you <b>add</b>.</p><p>Use the + and − buttons to change each group. Watch the first frame fill up to 10.</p>',
      check:{kind:'num',answer:12,fig:F.add84,q:'How many counters are there in all?',
        misc:[[8,'That’s only the yellow counters. Count the blue ones too.'],[4,'That’s only the blue counters. Count the yellow ones too.']],
        explain:'8 + 4 = 12. The first frame has 10, and 2 more makes 12.'}},
    {title:'Take away to subtract',widget:wTake,
      body:'<p>When you take some away, you <b>subtract</b>. The number left is smaller.</p><p>Tap counters to take them away.</p>',
      check:{kind:'num',unit:'stickers',answer:9,q:'Mai has 15 stickers. Mai gives 6 stickers to Diego. How many stickers does Mai have now?',
        misc:[[21,'You added. Mai gave stickers away, so Mai has fewer now.'],[6,'That’s how many Mai gave away. How many are left?']],
        explain:'15 − 6 = 9. Take away 5 to get to 10, then 1 more to get to 9.'}},
    {title:'One picture, four facts',widget:wFamily,
      body:'<p>The same cubes show an addition fact and a subtraction fact. 8 + 5 = 13 and 13 − 5 = 8 use the same three numbers.</p><p>Tap each fact to see it in the cubes.</p>',
      check:{kind:'mc',q:'Which fact goes with 9 + 6 = 15?',
        choices:[{id:'a',label:'15 − 6 = 9'},{id:'b',label:'9 − 6 = 3'},{id:'c',label:'15 + 6 = 21'},{id:'d',label:'6 + 3 = 9'}],answer:'a',
        why:{b:'This fact uses 3. The facts that go together use only 9, 6, and 15.',c:'15 + 6 makes a new number, 21. The facts that go together use only 9, 6, and 15.',d:'This fact uses 3. The facts that go together use only 9, 6, and 15.'},
        explain:'9 + 6 = 15, 6 + 9 = 15, 15 − 6 = 9, and 15 − 9 = 6 all use 9, 6, and 15.'}},
    {title:'Find the missing number',widget:wMissing,
      body:'<p>Sometimes you know the total but not one part. <b>8 + ? = 13</b> asks: what do you add to 8 to make 13?</p><p>Tap empty squares to add blue counters until there are 13.</p>',
      check:{kind:'num',answer:9,q:'What number makes this true? <b>7 + ? = 16</b>',
        misc:[[23,'That’s 7 + 16. Find the number you add to 7 to make 16.'],[16,'16 is the total. What do you add to 7 to get to 16?']],
        explain:'7 + 3 = 10, and 10 + 6 = 16. 3 + 6 = 9, so 7 + 9 = 16.'}}
  ]},
  {icon:'ten',title:'Add your way',lessons:'Lessons 4–5',blurb:'Make a ten, use doubles, and add bigger numbers with tens and ones.',steps:[
    {title:'Make a ten',widget:wMakeTen,
      body:'<p>10 is easy to add to. To add 9 + 5, move 1 of the 5 over to make 10. Then 10 + 4 = 14.</p><p>Pick numbers, then move counters to fill the first frame.</p>',
      check:{kind:'mc',q:'Which is the same as <b>8 + 6</b>?',fig:F.make86,
        choices:[{id:'a',label:'10 + 4'},{id:'b',label:'10 + 6'},{id:'c',label:'8 + 10'},{id:'d',label:'10 + 2'}],answer:'a',
        why:{b:'To make 10, 2 of the 6 move over to the 8. That leaves 4, not 6.',c:'The 6 doesn’t turn into 10. Move 2 of the 6 over to make the 8 a ten.',d:'8 needs 2 more to make a ten. That leaves 4 of the 6, not 2.'},
        explain:'8 + 2 = 10, and 4 of the 6 are left: 8 + 6 = 10 + 4 = 14.'}},
    {title:'Doubles and one more',widget:wDoubles,
      body:'<p>A <b>double</b> adds a number to itself, like 6 + 6 = 12. If you know a double, you know the one next to it: 6 + 7 is 1 more.</p><p>Change the cubes, then tap One more.</p>',
      check:{kind:'num',answer:13,q:'You know 6 + 6 = 12. What is <b>6 + 7</b>?',
        misc:[[12,'That’s 6 + 6. 7 is 1 more than 6, so the answer is 1 more.'],[14,'That’s 7 + 7. 6 + 7 is 1 less than that.']],
        explain:'6 + 7 is 6 + 6 and 1 more: 12 + 1 = 13.'}},
    {title:'Tens and ones',widget:wTensOnes,
      body:'<p>To add bigger numbers, add the <b>tens</b> together and the <b>ones</b> together. If there are 10 or more ones, they make a new ten.</p><p>Pick numbers, then put the tens and ones together.</p>',
      check:{kind:'num',unit:'marbles',answer:37,q:'Lin has 23 marbles. Noah gives Lin 14 more marbles. How many marbles does Lin have now?',
        misc:[[9,'You subtracted. Lin got more marbles, so add.'],[27,'You added the ones. Add the tens too: 20 + 10 = 30.'],[33,'You added the tens. Add the ones too: 3 + 4 = 7.']],
        explain:'Tens: 20 + 10 = 30. Ones: 3 + 4 = 7. 30 + 7 = 37 marbles.'}}
  ]},
  {icon:'pic',title:'Picture graphs',lessons:'Lessons 7–8',blurb:'Sort votes into a picture graph, then read it to find the most, the fewest, and the total.',steps:[
    {title:'Sort the votes',widget:wSort,
      body:'<p>A class voted for their favorite color. Each sticky note is one vote.</p><p>Tap each note to put it in its row. A <b>picture graph</b> shows each vote as one picture.</p>',
      check:{kind:'num',unit:'students',answer:5,fig:F.colors,q:'How many students chose yellow?',
        misc:[[18,'That’s every vote. Count only the yellow row.'],[6,'That’s the blue row. Find the row labeled Yellow.'],[4,'That’s the red row. Find the row labeled Yellow.']],
        explain:'The yellow row has 5 pictures, and each picture is 1 student.'}},
    {title:'Read a picture graph',widget:wReadPic,
      body:'<p>The longest row has the <b>most</b>. The shortest row has the <b>fewest</b>.</p><p>Tap each kind of weather to count its row.</p>',
      check:{kind:'mc',q:'Which kind of day happened the fewest times?',fig:F.weather,
        choices:[{id:'sun',label:'Sunny'},{id:'cloud',label:'Cloudy'},{id:'rain',label:'Rainy'}],answer:'rain',
        why:{sun:'Sunny has the most pictures. Fewest means the shortest row.',cloud:'Cloudy has fewer than sunny, but rainy has even fewer.'},
        explain:'Rainy has 5 pictures, the shortest row: 5 is fewer than 7 and 9.'}},
    {title:'How many in all?',widget:wTotal,
      body:'<p>To find how many in all, add every row.</p><p>Tap to add each row.</p>',
      check:{kind:'num',unit:'pets',answer:13,fig:F.pets,q:'How many pets are in this graph in all?',
        misc:[[6,'That’s only the dogs. Add all three rows.'],[10,'That’s dogs and cats. Add the fish too.'],[3,'That’s only the fish. Add all three rows.']],
        explain:'6 + 4 + 3 = 13 pets.'}}
  ]},
  {icon:'bar',title:'Bar graphs',lessons:'Lessons 9–11',blurb:'Build bar graphs, read them with the scale, and ask questions a graph can answer.',steps:[
    {title:'Build a bar graph',widget:wBuildBar,
      body:'<p>A <b>bar graph</b> shows each number as a bar. The numbers on the side tell how tall each bar is.</p><p>Tap in each column to make its bar match the table.</p>',
      check:{kind:'mc',q:'Which snack did the most students choose?',fig:F.snacks,
        choices:[{id:'apples',label:'Apples'},{id:'crackers',label:'Crackers'},{id:'yogurt',label:'Yogurt'},{id:'carrots',label:'Carrots'}],answer:'yogurt',
        why:{apples:'Apples has a tall bar, 6, but yogurt’s bar is taller.',crackers:'Crackers has the shortest bar. That’s the fewest.',carrots:'Carrots has 5. Look for the tallest bar.'},
        explain:'Yogurt has the tallest bar: 8 students.'}},
    {title:'Read a bar graph',widget:wReadBar,
      body:'<p>To read a bar, look at the top of the bar and follow the line across to the numbers.</p><p>Tap each snack to read its bar.</p>',
      check:{kind:'num',unit:'books',answer:7,fig:F.books,q:'How many books did Diego read?',
        misc:[[4,'That’s Mai’s bar. Find the bar labeled Diego.'],[5,'That’s Elena’s bar. Find the bar labeled Diego.'],[16,'That’s all three bars together. Read only Diego’s bar.']],
        explain:'The top of Diego’s bar lines up with 7.'}},
    {title:'Two graphs, same data',widget:wTwoGraphs,
      body:'<p>A picture graph and a bar graph can show the same numbers.</p><p>Switch between the two graphs.</p>',
      check:{kind:'mc',q:'Which bar graph shows the same data as this picture graph?',fig:F.petsPic,
        choices:[{id:'a',label:petBars([5,7,3])},{id:'b',label:petBars([7,5,3])},{id:'c',label:petBars([7,5,4])}],answer:'b',
        why:{a:'The dog and cat bars are switched. Dogs have 7 pictures.',c:'Count the fish again: 3 pictures, so the bar stops at 3.'},
        explain:'7 dogs, 5 cats, and 3 fish: the bars stop at 7, 5, and 3.'}},
    {title:'Ask the graph a question',widget:wAsk,
      body:'<p>A graph can answer questions about its numbers: how many, which is most, how many in all.</p><p>Tap each question. Can the graph answer it?</p>',
      check:{kind:'mc',stack:true,q:'Which question can this graph answer?',fig:F.snacks,
        choices:[{id:'a',label:'What time is snack?'},{id:'b',label:'How many students chose apples?'},{id:'c',label:'How many apples are at the store?'}],answer:'b',
        why:{a:'The graph shows which snacks students chose, not times.',c:'The graph counts students’ choices, not apples at a store.'},
        explain:'The graph shows how many students chose each snack: 6 chose apples.'}}
  ]},
  {icon:'tape',title:'Compare',lessons:'Lessons 13–16',blurb:'Find how many more or fewer with bar graphs and tape diagrams.',steps:[
    {title:'How many more?',widget:wMore,
      body:'<p>To find how many more, compare two amounts. The difference is how much taller one bar is.</p><p>Change the numbers, then show how many more.</p>',
      check:{kind:'num',unit:'students',answer:3,fig:F.snacks,q:'How many more students chose apples than crackers?',
        misc:[[9,'That’s apples and crackers together. “How many more” asks for the difference.'],[6,'That’s how many chose apples. How much taller is the apple bar than the cracker bar?']],
        explain:'6 − 3 = 3, or 3 + 3 = 6. 3 more students chose apples.'}},
    {title:'Tape diagrams',widget:wTape,
      body:'<p>A <b>tape diagram</b> shows each amount as a tape. The longer tape is the bigger amount. The extra piece is the difference.</p><p>Change how many stickers each friend has.</p>',
      check:{kind:'num',unit:'stickers',answer:9,fig:F.stickers,q:'Noah has 6 fewer stickers than Elena. Elena has 15 stickers. How many stickers does Noah have?',
        misc:[[21,'“Fewer” means Noah has less than Elena. Take 6 away from 15.'],[6,'6 is how many fewer. How many does Noah have?']],
        explain:'15 − 6 = 9. Noah’s tape is 6 shorter than Elena’s.'}},
    {title:'Three kinds of compare problems',widget:wKinds,
      body:'<p>A compare problem can ask for the difference, the bigger amount, or the smaller amount. Draw the tapes, then find the <b>?</b></p><p>Tap each kind of problem.</p>',
      check:{kind:'num',unit:'pages',answer:38,q:'Andre read 25 pages. Han read 13 more pages than Andre. How many pages did Han read?',
        misc:[[12,'Han read <b>more</b> than Andre, so Han’s number is bigger than 25. Add 13.']],
        explain:'Han read more, so add: 25 + 13 = 38. Tens: 20 + 10 = 30. Ones: 5 + 3 = 8.'}}
  ]}
];
