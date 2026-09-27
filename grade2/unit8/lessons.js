/* Learn Equal Groups (Grade 2 Unit 8): figures, widgets, and the chapters. Loaded by learn.html.
   Number lines (numLine), connecting cubes (cubes), steppers, and choice buttons come from shared/k5.js. */
const NAMES=['Mai','Diego'];
const pl=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
/* "4 + 4 + 4": n equal addends of a */
const addends=(n,a)=>Array(n).fill(a).join(' + ');

/* ---------- figures ---------- */
/* a counter at x, y (cls 'a' gold, 'b' blue, plus 'moved' for a white ring), and a dashed ring around one with no partner */
const ctr=(x,y,cls='a',r=14)=>`<g class="ctr ${cls}"><circle cx="${x}" cy="${y}" r="${r}"/></g>`;
const ring=(x,y,r=14)=>`<circle class="extra" cx="${x}" cy="${y}" r="${r+6}"/>`;
/* n counters from x, y in rows of 10, with a gap after every 5 */
const pileAt=(x,y,n,cls='a')=>range(n).map(i=>ctr(x+(i%10)*36+(i%10>=5?10:0),y+Math.floor(i/10)*36,cls)).join('');
const pile=(n,label)=>svgWrap(Math.min(n,10)*36+(n>5?10:0)+12,Math.ceil(n/10)*36+12,pileAt(24,24,n),label||`${n} counters`);

/* n counters being shared by 2 friends, 1 to each at a time: `given` of them are on the plates, the rest wait on top.
   When 1 is left that can't be shared, it gets a ring. */
function plateFig(n,given){
  const left=n-given,each=given/2,Y=Math.ceil(n/10)*36+34,alone=left===1&&given>0;
  let o=`<text class="lbl s dm st" x="10" y="12">To share</text>`+pileAt(24,40,left,alone?'b':'a')+(alone?ring(24,40):'');
  [0,1].forEach(k=>{
    const x=10+k*236;
    o+=`<rect class="plate" x="${x}" y="${Y}" width="214" height="96" rx="20"/><text class="lbl" x="${x+107}" y="${Y+116}">${NAMES[k]}</text>`+range(each).map(i=>ctr(x+35+(i%5)*36,Y+30+Math.floor(i/5)*36)).join('');
  });
  return svgWrap(460,Y+130,o,`${n} counters. ${NAMES[0]} has ${each}, ${NAMES[1]} has ${each}, and ${left} ${left===1?'is':'are'} left`);
}

/* n counters in pairs, one above the other, each pair outlined. mark: ring the one with no partner (odd n). */
function pairsFig(n,{mark=true,label}={}){
  const k=Math.floor(n/2),odd=n%2,x=i=>32+i*44+Math.floor(i/5)*12;
  let o=range(k).map(i=>`<rect class="pairbox" x="${x(i)-20}" y="4" width="40" height="84" rx="20"/>`+ctr(x(i),26)+ctr(x(i),66)).join('');
  if(odd)o+=ctr(x(k),26,mark?'b':'a')+(mark?ring(x(k),26):'');
  return svgWrap(x(k+odd-1)+32,92,o,label||`${n} counters: ${pl(k,'pair')}`+(odd?' and 1 with no partner':', none left over'));
}

/* cube trains, one under the other: rows [[n, cls, extra]]; extra green cubes go on the end. The count is written after each. */
function trainsFig(rows,label){
  const most=Math.max(...rows.map(([n,,x=0])=>n+x));
  const o=rows.map(([n,cls,x=0],i)=>{const y=8+i*46;return cubes(8,y,n,cls)+cubes(8+n*CUBE,y,x,'x')+`<text class="lbl" x="${8+(n+x)*CUBE+22}" y="${y+CUBE/2-1}">${n+x}</text>`;}).join('');
  return svgWrap(8+most*CUBE+46,rows.length*46+6,o,label);
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
/* counters at [column, row] spots (fractions allowed), for pictures that aren't arrays */
function spots(pts,label){
  const W=Math.max(...pts.map(p=>p[0]))+1,H=Math.max(...pts.map(p=>p[1]))+1;
  return svgWrap(2*AP+W*G,2*AP+H*G,pts.map(([x,y])=>ctr(AP+G/2+x*G,AP+G/2+y*G,'a',16)).join(''),label);
}

/* r rows of c square tiles, gap pixels apart (0: pushed together into a rectangle). The picture keeps the same size either way. */
function tileFig(r,c,{gap=0,label}={}){
  const T=40,S=14,W=c*T+(c-1)*S,H=r*T+(r-1)*S,dx=(W-c*T-(c-1)*gap)/2,dy=(H-r*T-(r-1)*gap)/2;
  let o=range(r*c).map(n=>`<rect class="tile" x="${8+dx+n%c*(T+gap)}" y="${8+dy+Math.floor(n/c)*(T+gap)}" width="${T}" height="${T}"/>`).join('');
  if(!gap)o+=`<rect class="rim" x="${8+dx}" y="${8+dy}" width="${c*T}" height="${r*T}"/>`;
  return svgWrap(W+16,H+16,o,label||(gap?`${r*c} square tiles in ${pl(r,'row')} of ${c}, with gaps`:`A rectangle made of ${r*c} squares: ${pl(r,'row')} of ${c}`));
}

/* A w × h rectangle cut into pieces: rects [[x, y, w, h]] in units of U pixels.
   on(i): color piece i in. num(i): a number to write in piece i. tap: pieces can be tapped (data-i). */
const fx=v=>+v.toFixed(2);
function pieces(w,h,rects,{U=56,on=()=>false,num=()=>null,tap=false,label}={}){
  const o=rects.map(([x,y,a,b],i)=>{
    const X=fx(6+x*U),Y=fx(6+y*U),n=num(i);
    return `<g${tap?` data-i="${i}"`:''}><rect class="pc${on(i)?' on':''}" x="${X}" y="${Y}" width="${fx(a*U)}" height="${fx(b*U)}"/>`+(n!=null?`<text class="lbl dk" x="${fx(X+a*U/2)}" y="${fx(Y+b*U/2)}">${n}</text>`:'')+'</g>';
  }).join('');
  return svgWrap(12+w*U,12+h*U,o,label);
}
/* the pieces of a w × h rectangle cut into r rows and c columns */
const cutGrid=(w,h,r,c)=>range(r*c).map(n=>[n%c*w/c,Math.floor(n/c)*h/r,w/c,h/r]);

/* ---------- Chapter 1: share and make pairs ---------- */
function wShare(el){
  const q=Q(el),st={n:12};let given=0;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Counters')}</div><div class="wrow"><button type="button" class="btn" data-one>Give 1 to each</button><button type="button" class="ghost-btn" data-all>Share them all</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n}=st,left=n-given,each=given/2,done=left<2,[a,b]=NAMES;
    q('n').textContent=n;q('f').innerHTML=plateFig(n,given);
    q('one').disabled=q('all').disabled=done;
    q('r').innerHTML=!given?`<b>${n}</b> counters to share fairly: ${a} and ${b} get the same number.<br><span class="dimline">Tap Give 1 to each.</span>`
      :!done?`${a} has <b>${each}</b>. ${b} has <b>${each}</b>. ${left} left to share.`
      :left?`<b>${a} and ${b} each get ${each}</b>, and <b>1 is left over</b>.<br><span class="dimline">That 1 can’t be shared fairly. Try another number.</span>`
      :`<span class="ok"><b>${a} and ${b} each get ${each}</b>, with none left over.</span><br><span class="dimline">${n} can be shared fairly. Try another number.</span>`;
  };
  steppers(el,st,{n:[2,20]},()=>{given=0;draw();});
  q('one').onclick=()=>{given+=2;draw();};
  q('all').onclick=()=>{given=st.n-st.n%2;draw();};
  q('clr').onclick=()=>{given=0;draw();};
  draw();
}
function wPairs(el){
  const q=Q(el),st={n:9};let paired=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Counters')}<button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n}=st,k=Math.floor(n/2);
    q('n').textContent=n;q('go').textContent=paired?'Mix them up':'Make pairs';
    q('f').innerHTML=paired?pairsFig(n):pile(n);
    q('r').innerHTML=!paired?`<b>${n}</b> counters. Does every counter have a partner?<br><span class="dimline">Tap Make pairs.</span>`
      :n%2?`<b>${pl(k,'pair')} and 1 more.</b><br><span class="dimline">1 counter has no partner.</span>`
      :`<span class="ok"><b>${pl(k,'pair')}.</b></span><br><span class="dimline">Every counter has a partner.</span>`;
  };
  steppers(el,st,{n:[1,20]},()=>{paired=false;draw();});
  q('go').onclick=()=>{paired=!paired;draw();};
  draw();
}

/* ---------- Chapter 2: odd and even ---------- */
/* tap 1 to 20 to see each one in pairs; tapped numbers stay colored, even gold and odd blue */
function wOddEven(el){
  const q=Q(el),seen=new Set();let n=null;
  el.innerHTML=`<div class="nums" role="group" aria-label="Numbers 1 to 20">${range(20).map(i=>`<button type="button" data-v="${i+1}">${i+1}</button>`).join('')}</div><div class="fig" data-f hidden></div><p class="readout" data-r></p>`;
  const draw=()=>{
    el.querySelectorAll('[data-v]').forEach(b=>{const v=+b.dataset.v;b.className=seen.has(v)?(v%2?'od':'ev'):'';b.setAttribute('aria-pressed',v===n);});
    q('f').hidden=!n;if(n)q('f').innerHTML=pairsFig(n);
    q('r').innerHTML=!n?'Tap a number to put it in pairs.'
      :(n%2?`<b>${n} is odd.</b> ${pl(Math.floor(n/2),'pair')} and 1 left over.`:`<b>${n} is even.</b> ${pl(n/2,'pair')}, none left over.`)
      +`<br><span class="dimline">${seen.size<5?'Tap more numbers.':'Even numbers are gold. Odd numbers are blue. Even, odd, even, odd…'}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){n=+b.dataset.v;seen.add(n);draw();}});
  draw();
}
/* count by 2s on a number line from 0 or from 1 */
function wSkip(el){
  const q=Q(el);let s=0,k=0;
  el.innerHTML=seg('Start',[[0,'Start at 0'],[1,'Start at 1']])+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Hop 2</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const land=range(k+1).map(i=>s+2*i);press(el,s);
    q('f').innerHTML=numLine(0,20,{u:24,big:10,ls:'',lab:()=>true,hops:range(k).map(i=>({a:s+2*i,b:s+2*i+2,t:'+2'})),pts:land.map(v=>({v})),
      label:`A number line from 0 to 20. Hops of 2 from ${s} land on ${land.join(', ')}`});
    q('go').disabled=s+2*k+2>20;
    q('r').innerHTML=`You say <b>${land.join(', ')}</b>`+(k<3?'<br><span class="dimline">Tap Hop 2.</span>'
      :s?'<br><span class="dimline">From 1, you land on the <b>odd</b> numbers: the ones you skipped from 0.</span>'
      :'<br><span class="dimline">From 0, you land on the <b>even</b> numbers. Each hop adds a pair.</span>');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){s=+b.dataset.m;k=0;draw();}});
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  draw();
}
/* move cubes between two trains until they're as fair as they can be. FAIR: [cubes, cubes in the top train to start] */
const FAIR=[[16,12],[11,8],[14,3],[9,7],[20,14],[13,2]];
function wFair(el){
  const q=Q(el);let p=0,a=FAIR[0][1];
  el.innerHTML=seg('Cubes',FAIR.map(([n],i)=>[i,`${n} cubes`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-dn>Move 1 down ↓</button><button type="button" class="ghost-btn" data-up>Move 1 up ↑</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=FAIR[p][0],b=n-a,lo=Math.min(a,b);press(el,p);
    q('f').innerHTML=trainsFig([[a,'a'],[b,'b']],`Two cube trains: ${a} cubes and ${b} cubes`);
    q('dn').disabled=!a;q('up').disabled=!b;
    q('r').innerHTML=a===b?`<span class="ok"><b>${a} + ${b} = ${n}</b>. Two equal trains!</span><br><span class="dimline">${n} is <b>even</b>.</span>`
      :Math.abs(a-b)===1?`<b>${a} + ${b} = ${n}</b>. That’s as close as it gets: ${lo} + ${lo} + 1.<br><span class="dimline">${n} is <b>odd</b>. There’s always 1 extra cube.</span>`
      :`${a} + ${b} = ${n}. Not fair yet!<br><span class="dimline">Move cubes to make the trains the same length.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;a=FAIR[p][1];draw();}});
  q('dn').onclick=()=>{a--;draw();};
  q('up').onclick=()=>{a++;draw();};
  draw();
}
/* n as a double, or a double and 1 more (the green cube) */
function wDoubles(el){
  const q=Q(el),st={n:14};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Number')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n}=st,k=Math.floor(n/2),odd=n%2;q('n').textContent=n;
    q('f').innerHTML=trainsFig([[k,'a',odd],[k,'b']],`Two trains of ${k} cubes`+(odd?', and 1 more cube':''));
    q('r').innerHTML=odd?`<b>${n} = ${k} + ${k} + 1</b><br><span class="dimline">A double and 1 more, so ${n} is <b>odd</b>.</span>`
      :`<b>${n} = ${k} + ${k}</b><br><span class="dimline">Two equal addends, so ${n} is <b>even</b>.</span>`;
  };
  steppers(el,st,{n:[2,20]},draw);draw();
}

/* ---------- Chapter 3: arrays ---------- */
function wArray(el){
  const q=Q(el),st={rows:3,cols:4};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st;q('rows').textContent=r;q('cols').textContent=c;
    q('f').innerHTML=arr(r,c);
    q('r').innerHTML=`<b>${pl(r,'row')} of ${c}</b>: ${c} in each row.<br><span class="dimline">${pl(c,'column')} of ${r}: ${r} in each column. ${r*c} in all.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);draw();
}
/* tap a counter to see its row and column */
const RC=[[3,4],[2,5],[4,3],[5,5]];
function wRowsCols(el){
  const q=Q(el);let p=0,hi=null;
  el.innerHTML=seg('Array',RC.map(([r,c],i)=>[i,`${r} rows of ${c}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [r,c]=RC[p];press(el,p);
    q('f').innerHTML=arr(r,c,{hi,tap:true,label:`An array: ${r} rows with ${c} in each row. Tap a counter.`});
    q('r').innerHTML=!hi?`${r} rows of ${c}. Tap any counter.`
      :`This counter is in <b>row ${hi[0]+1}</b> and <b>column ${hi[1]+1}</b>.<br><span class="dimline">Its row goes across and has ${c}. Its column goes up and down and has ${r}.</span>`;
  };
  el.addEventListener('click',e=>{
    const m=e.target.closest('[data-m]'),t=e.target.closest('[data-i]');
    if(m){p=+m.dataset.m;hi=null;draw();}
    else if(t){const c=RC[p][1];hi=[Math.floor(t.dataset.i/c),t.dataset.i%c];draw();}
  });
  draw();
}
/* count an array one row or one column at a time, with a running total */
const CNT=[[3,5],[4,2],[2,4],[5,3]];
function wCount(el){
  const q=Q(el);let p=0,mode=null,k=0;
  el.innerHTML=seg('Array',CNT.map(([r,c],i)=>[i,`${r} rows of ${c}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-br>Count a row</button><button type="button" class="btn" data-bc>Count a column</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [r,c]=CNT[p],n=mode==='r'?r:c,each=mode==='r'?c:r,w=mode==='r'?'row':'column';press(el,p);
    q('f').innerHTML=arr(r,c,mode?{band:mode,k,sum:true}:{});
    q('r').innerHTML=!mode?`${r} rows of ${c}. Count them by rows or by columns.`
      :`Count by ${w}s: <b>${range(k).map(i=>each*(i+1)).join(', ')}</b>`
        +(k===n?`<br><span class="ok">${r*c} in all: ${pl(n,w)} of ${each}.</span>`:`<br><span class="dimline">Each ${w} has ${each}. Tap Count a ${w} again.</span>`);
  };
  const go=m=>()=>{if(mode!==m||k===(m==='r'?CNT[p][0]:CNT[p][1])){mode=m;k=1;}else k++;draw();};
  q('br').onclick=go('r');q('bc').onclick=go('c');
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;mode=null;k=0;draw();}});
  draw();
}

/* ---------- Chapter 4: equal addends ---------- */
/* an array and its equation, adding the rows (and, with 'c' in modes, the columns) */
const eqW=modes=>el=>{
  const q=Q(el),st={rows:3,cols:4},seen=new Set();let m=modes[0];
  el.innerHTML=(modes.length>1?seg('Add',[['r','Add the rows'],['c','Add the columns']]):'')+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st,n=m==='r'?r:c,each=m==='r'?c:r,w=m==='r'?'row':'column';seen.add(m);
    q('rows').textContent=r;q('cols').textContent=c;if(modes.length>1)press(el,m);
    q('f').innerHTML=arr(r,c,{band:m});
    q('r').innerHTML=`<b>${addends(n,each)} = ${r*c}</b><br><span class="dimline">${pl(n,w)} of ${each}. Each ${w} is one addend.</span>`
      +(seen.size>1?`<br><span class="ok">By rows or by columns, it’s ${r*c} in all.</span>`:'');
  };
  steppers(el,st,{rows:[2,5],cols:[2,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){m=b.dataset.m;draw();}});
  draw();
};
/* build the array for an equation. BUILD: [addend, how many of them] */
const BUILD=[[3,4],[5,2],[2,5],[4,3]];
function wBuild(el){
  const q=Q(el),st={rows:2,cols:2};let p=0;
  el.innerHTML=seg('Equation',BUILD.map(([a,n],i)=>[i,addends(n,a)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,n]=BUILD[p],{rows:r,cols:c}=st,eq=`${addends(n,a)} = ${a*n}`,byR=r===n&&c===a,byC=c===n&&r===a;
    q('rows').textContent=r;q('cols').textContent=c;press(el,p);
    q('f').innerHTML=arr(r,c,{band:byC&&!byR?'c':'r'});
    q('r').innerHTML=byR?`<span class="ok">Yes! ${pl(n,'row')} of ${a}: <b>${eq}</b>.</span>`
      :byC?`<span class="ok">Yes! ${pl(n,'column')} of ${a}: <b>${eq}</b>.</span><br><span class="dimline">Columns work too.</span>`
      :`Your array: ${pl(r,'row')} of ${c}. Make one that shows <b>${addends(n,a)}</b>.<br><span class="dimline">Each ${a} is one row. How many ${a}s are there?</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* ---------- Chapter 5: rectangles and squares ---------- */
function wTiles(el){
  const q=Q(el),st={rows:3,cols:4};let push=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st;q('rows').textContent=r;q('cols').textContent=c;
    q('go').textContent=push?'Pull them apart':'Push them together';
    q('f').innerHTML=tileFig(r,c,{gap:push?0:14});
    q('r').innerHTML=push?`<span class="ok">A rectangle made of ${r*c} squares!</span><br><span class="dimline">No gaps and no overlaps. ${pl(r,'row')} of ${c}: ${addends(r,c)} = ${r*c}.</span>`
      :`<b>${pl(r*c,'tile')}</b> in ${pl(r,'row')} of ${c}.<br><span class="dimline">Tap Push them together.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},()=>{push=false;draw();});
  q('go').onclick=()=>{push=!push;draw();};
  draw();
}
/* cut a rectangle (CUT: [width, height]) into rows and columns until the pieces are squares */
const CUT=[[4,3],[5,2],[4,2]];
function wCut(el){
  const q=Q(el),st={rows:2,cols:2};let p=0;
  el.innerHTML=seg('Rectangle',CUT.map((_,i)=>[i,`Rectangle ${i+1}`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [w,h]=CUT[p],{rows:r,cols:c}=st,pw=w/c,ph=h/r,sq=Math.abs(pw-ph)<1e-9;
    q('rows').textContent=r;q('cols').textContent=c;press(el,p);
    q('f').innerHTML=pieces(w,h,cutGrid(w,h,r,c),{U:Math.min(64,300/w),on:()=>sq,label:`A rectangle cut into ${pl(r,'row')} and ${pl(c,'column')}`+(sq?' of squares':'')});
    q('r').innerHTML=sq?`<span class="ok">Same-size squares! ${pl(r,'row')} of ${c}: ${r*c} squares.</span>`
      :pw>ph?`${pl(r,'row')} and ${pl(c,'column')}. These pieces are wider than they are tall.<br><span class="dimline">Try more columns, or fewer rows.</span>`
      :`${pl(r,'row')} and ${pl(c,'column')}. These pieces are taller than they are wide.<br><span class="dimline">Try more rows, or fewer columns.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* tap each square of a rectangle to count it */
function wCountSq(el){
  const q=Q(el),st={rows:3,cols:4};let order=[];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st,n=r*c;q('rows').textContent=r;q('cols').textContent=c;
    q('f').innerHTML=pieces(c,r,cutGrid(c,r,r,c),{on:i=>order.includes(i),num:i=>order.includes(i)?order.indexOf(i)+1:null,tap:true,
      label:`A rectangle cut into ${pl(r,'row')} of ${c} squares, ${order.length} counted`});
    q('r').innerHTML=order.length===n?`<span class="ok"><b>${pl(n,'square')}!</b></span><br><span class="dimline">${pl(r,'row')} of ${c}: ${addends(r,c)} = ${n}.</span>`
      :order.length?`You counted <b>${order.length}</b> so far.`:'Tap each square to count it.';
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},()=>{order=[];draw();});
  el.addEventListener('click',e=>{const t=e.target.closest('[data-i]');if(t&&!order.includes(+t.dataset.i)){order.push(+t.dataset.i);draw();}});
  q('clr').onclick=()=>{order=[];draw();};
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  crackers:pile(14,'14 crackers'),
  line11:pairsFig(11,{mark:false,label:'11 students standing in pairs'}),
  train16:trainsFig([[16,'a']],'A train of 16 cubes'),
  train11:trainsFig([[11,'a']],'A train of 11 cubes'),
  hop6:numLine(0,20,{u:24,big:10,ls:'',lab:()=>true,hops:[0,2,4].map(a=>({a,b:a+2,t:'+2'})),pts:[0,2,4,6].map(v=>({v})),label:'A number line from 0 to 20 with hops of 2 from 0 to 6'}),
  notRows:spots([[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2],[3,2]],'Picture A'),
  rows34:arr(3,4,{label:'Picture B'}),
  mixed:spots([[.2,.1],[1.4,.3],[2.1,0],[3.2,.4],[.6,1.1],[1.9,1.2],[2.7,1.1],[.1,2],[1.2,1.9],[2.3,2.2],[3.4,1.6],[3,2.6]],'Picture C'),
  a43:arr(4,3),
  a25:arr(2,5),
  a35:arr(3,5,{band:'r'}),
  a24:arr(2,4),
  chairs:arr(4,5,{label:'4 rows of chairs with 5 in each row'}),
  t25:tileFig(2,5),
  pan:pieces(3,4,cutGrid(3,4,4,3),{label:'A pan cut into 4 rows of 3 pieces'}),
};
const cutPic=(rects,l)=>pieces(4,3,rects,{U:40,label:l});

/* ---------- chapters ---------- */
const ICON={
  share:'<ellipse cx="16" cy="48" rx="14" ry="8" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><ellipse cx="48" cy="48" rx="14" ry="8" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><g fill="#ffc93c"><circle cx="10" cy="42" r="4.5"/><circle cx="22" cy="42" r="4.5"/><circle cx="42" cy="42" r="4.5"/><circle cx="54" cy="42" r="4.5"/></g><circle cx="32" cy="16" r="5" fill="#7fe3ff"/><circle cx="32" cy="16" r="10" fill="none" stroke="#f3f6fb" stroke-width="1.5" stroke-dasharray="3 3"/>',
  oddeven:'<g fill="none" stroke="#f3f6fb" stroke-width="2"><rect x="3" y="12" width="14" height="36" rx="7"/><rect x="19" y="12" width="14" height="36" rx="7"/><rect x="35" y="12" width="14" height="36" rx="7"/></g><g fill="#ffc93c"><circle cx="10" cy="22" r="5"/><circle cx="10" cy="38" r="5"/><circle cx="26" cy="22" r="5"/><circle cx="26" cy="38" r="5"/><circle cx="42" cy="22" r="5"/><circle cx="42" cy="38" r="5"/></g><circle cx="57" cy="22" r="5" fill="#7fe3ff"/>',
  array:'<rect x="3" y="7" width="58" height="16" rx="8" fill="none" stroke="#ffc93c" stroke-width="2"/><g fill="#ffc93c">'+range(12).map(i=>`<circle cx="${11+i%4*14}" cy="${15+Math.floor(i/4)*16}" r="5"/>`).join('')+'</g>',
  addends:'<g fill="#ffc93c">'+range(6).map(i=>`<circle cx="${14+i%3*18}" cy="${10+Math.floor(i/3)*16}" r="6"/>`).join('')+'</g><text x="32" y="56" fill="#f3f6fb" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">3 + 3</text>',
  squares:'<g fill="none" stroke="#f3f6fb" stroke-width="2"><rect x="4" y="10" width="56" height="42"/><path d="M18,10V52M32,10V52M46,10V52M4,24H60M4,38H60"/></g><g fill="#ffc93c"><rect x="5" y="11" width="12" height="12"/><rect x="19" y="11" width="12" height="12"/><rect x="33" y="11" width="12" height="12"/></g>',
};
const CH=[
  {icon:'share',title:'Share and make pairs',lessons:'Lessons 1–2',blurb:'Share things fairly between 2 friends, and see if everyone gets a partner.',steps:[
    {title:'Share fairly',widget:wShare,
      body:'<p>To <b>share fairly</b> with 2 friends, each friend gets the same number.</p><p>Pick how many counters. Give 1 to each friend until you can’t anymore. Is any left over?</p>',
      check:{kind:'num',unit:'crackers',answer:7,fig:F.crackers,q:'Lin and Han share 14 crackers fairly. How many crackers does each one get?',
        misc:[[14,'That’s all the crackers. Split them into 2 equal groups.'],[28,'That’s 14 + 14. Sharing splits 14 into 2 equal groups.'],[6,'6 + 6 = 12. There are 14 crackers.'],[8,'8 + 8 = 16. That’s too many.']],
        explain:'Give 1 to each, again and again. Each one gets 7, with none left over: 7 + 7 = 14.'}},
    {title:'Partners make pairs',widget:wPairs,
      body:'<p>A <b>pair</b> is 2 things that go together. If every counter has a partner, none are left over.</p><p>Pick how many counters. Then make pairs.</p>',
      check:{kind:'mc',stack:true,fig:F.line11,q:'11 students line up with a partner. Does every student have a partner?',
        choices:[{id:'a',label:'Yes, every student has a partner.'},{id:'b',label:'No, 1 student has no partner.'},{id:'c',label:'No, 2 students have no partner.'}],answer:'b',
        why:{a:'Look at the end of the line. 1 student is alone.',c:'2 students left over would make one more pair.'},
        explain:'11 makes 5 pairs and 1 more. 1 student has no partner.'}}
  ]},
  {icon:'oddeven',title:'Odd and even',lessons:'Lessons 3–4',blurb:'Tell if a number is odd or even with pairs, counting by 2s, and doubles.',steps:[
    {title:'Odd or even?',widget:wOddEven,
      body:'<p>A number is <b>even</b> if it makes pairs with none left over. A number is <b>odd</b> if 1 is left over.</p><p>Tap numbers to put them in pairs. Look for a pattern.</p>',
      check:{kind:'mc',q:'Which number is even?',
        choices:[{id:'9',label:'9'},{id:'15',label:'15'},{id:'16',label:'16'},{id:'11',label:'11'}],answer:'16',
        why:{9:'9 makes 4 pairs and 1 left over, so 9 is odd.',15:'15 makes 7 pairs and 1 left over, so 15 is odd.',11:'11 makes 5 pairs and 1 left over, so 11 is odd.'},
        explain:'16 makes 8 pairs with none left over, so 16 is even.'}},
    {title:'Count by 2s',widget:wSkip,
      body:'<p>Count by 2s from 0: 0, 2, 4, 6, 8. Each hop adds one more pair, so you land on the <b>even</b> numbers.</p><p>Tap Hop 2. Then try starting at 1.</p>',
      check:{kind:'mc',fig:F.hop6,q:'Han counts by 2s, starting at 0. Which number will Han say?',
        choices:[{id:'a',label:'15'},{id:'b',label:'18'},{id:'c',label:'9'}],answer:'b',
        why:{a:'From 0, hops of 2 land on even numbers: 12, 14, 16. 15 is skipped.',c:'From 0, hops of 2 land on 6, 8, 10. 9 is skipped. It’s odd.'},
        explain:'0, 2, 4, 6, 8, 10, 12, 14, 16, 18. Han says 18, an even number.'}},
    {title:'Make two equal trains',widget:wFair,
      body:'<p>Snap cubes into 2 trains. If the trains can be the <b>same length</b>, the number is even. If 1 cube is always extra, it’s odd.</p><p>Pick a number. Move cubes until the trains are as fair as they can be.</p>',
      check:{kind:'num',unit:'cubes',answer:8,fig:F.train16,q:'Elena breaks this train of 16 cubes into 2 trains that are the same length. How many cubes are in each train?',
        misc:[[16,'That’s all the cubes. Make 2 equal trains.'],[32,'That’s 16 + 16. Split 16 into 2 equal trains.'],[7,'7 + 7 = 14. You need 16.'],[9,'9 + 9 = 18. That’s too many.']],
        explain:'8 + 8 = 16, so each train has 8 cubes. 16 is even.'}},
    {title:'A double and 1 more',widget:wDoubles,
      body:'<p>An even number is a <b>double</b>: two equal addends, like 7 + 7 = 14.</p><p>An odd number is a double and <b>1 more</b>, like 7 + 7 + 1 = 15.</p><p>Change the number. Watch for the green cube.</p>',
      check:{kind:'mc',fig:F.train11,q:'Which one shows 11 as a double and 1 more?',
        choices:[{id:'a',label:'11 = 5 + 5 + 1'},{id:'b',label:'11 = 6 + 6'},{id:'c',label:'11 = 10 + 1'}],answer:'a',
        why:{b:'6 + 6 = 12, not 11.',c:'10 + 1 = 11, but 10 and 1 aren’t a double. A double is the same number twice, like 5 + 5.'},
        explain:'5 + 5 is a double, and 1 more makes 11. So 11 is odd.'}}
  ]},
  {icon:'array',title:'Arrays',lessons:'Lessons 7–8',blurb:'Put things in rows and columns, and count them by rows or by columns.',steps:[
    {title:'What is an array?',widget:wArray,
      body:'<p>An <b>array</b> is things in <b>rows</b> and <b>columns</b>. Rows go across. Columns go up and down.</p><p>In an array, every row has the same number. Change the rows and columns.</p>',
      check:{kind:'mc',q:'Which picture is an array?',
        choices:[{id:'a',label:F.notRows},{id:'b',label:F.rows34},{id:'c',label:F.mixed}],answer:'b',
        why:{a:'The rows aren’t the same. The middle row has only 3.',c:'These counters aren’t in rows and columns.'},
        explain:'Picture B has 3 rows with 4 in each row. Every row is the same, so it’s an array.'}},
    {title:'Rows and columns',widget:wRowsCols,
      body:'<p>A <b>row</b> goes across, like friends sitting side by side. A <b>column</b> goes up and down, like a stack of blocks.</p><p>Tap any counter to see its row and its column.</p>',
      check:{kind:'num',answer:4,fig:F.a43,q:'How many rows are in this array?',
        misc:[[3,'That’s how many columns. Rows go across.'],[12,'That’s all the counters. Count the rows that go across.'],[7,'That’s the rows and columns together. Just count the rows.']],
        explain:'There are 4 rows going across, with 3 counters in each row.'}},
    {title:'Count by rows or columns',widget:wCount,
      body:'<p>You can count an array <b>by rows</b> or <b>by columns</b>. Add on the number in each row, like 5, 10, 15.</p><p>Tap Count a row or Count a column.</p>',
      check:{kind:'num',answer:2,fig:F.a25,q:'How many counters are in each column?',
        misc:[[5,'That’s how many are in each row. Columns go up and down.'],[10,'That’s all the counters. Look at just one column.']],
        explain:'Each column has 2 counters, one on top of the other. 5 columns of 2 is 10 in all.'}}
  ]},
  {icon:'addends',title:'Equal addends',lessons:'Lessons 9–10',blurb:'Add the rows or the columns of an array, and build an array from an equation.',steps:[
    {title:'Add the rows',widget:eqW(['r']),
      body:'<p>Every row of an array has the same number, so you can add that number again and again: 4 + 4 + 4 = 12. These are <b>equal addends</b>.</p><p>Change the rows and columns. Watch the equation.</p>',
      check:{kind:'num',answer:15,fig:F.a35,q:'Each row has 5 counters. How many counters are there in all?',
        misc:[[8,'5 + 3 adds one row and the number of rows. Add 5 for every row: 5 + 5 + 5.'],[10,'That’s 2 rows. There are 3 rows of 5.'],[20,'That’s 4 rows. Count the rows again.']],
        explain:'5 + 5 + 5 = 15. 3 rows of 5 is 15 counters.'}},
    {title:'By rows or by columns',widget:eqW(['r','c']),
      body:'<p>You can add the columns too! 3 rows of 4 is 4 + 4 + 4. It’s also 4 columns of 3: 3 + 3 + 3 + 3. Both make 12.</p><p>Tap Add the rows, then Add the columns.</p>',
      check:{kind:'mc',fig:F.a24,q:'Which equation does <b>not</b> match this array?',
        choices:[{id:'a',label:'4 + 4 = 8'},{id:'b',label:'2 + 2 + 2 + 2 = 8'},{id:'c',label:'2 + 4 = 6'}],answer:'c',
        why:{a:'4 + 4 adds the 2 rows of 4. It matches.',b:'2 + 2 + 2 + 2 adds the 4 columns of 2. It matches.'},
        explain:'2 + 4 adds the number of rows and the number in a row. The array has 8 counters, not 6.'}},
    {title:'Build an array',widget:wBuild,
      body:'<p>You can go the other way too: start with an equation and build its array. Each addend is one row.</p><p>Pick an equation. Change the rows and columns to match it.</p>',
      check:{kind:'num',unit:'chairs',answer:20,fig:F.chairs,q:'Priya sets up chairs in 4 rows, with 5 chairs in each row. How many chairs is that?',
        misc:[[9,'4 + 5 adds the rows and the chairs in one row. Add 5 for every row.'],[15,'That’s 3 rows. There are 4 rows: 5 + 5 + 5 + 5.'],[16,'That’s 4 rows of 4. Each row has 5 chairs.']],
        explain:'5 + 5 + 5 + 5 = 20 chairs. Two 5s make 10, and 10 + 10 = 20.'}}
  ]},
  {icon:'squares',title:'Rectangles and squares',lessons:'Lessons 11–12',blurb:'Push square tiles into a rectangle, and cut a rectangle into same-size squares.',steps:[
    {title:'Arrays make rectangles',widget:wTiles,
      body:'<p>Square tiles in an array can push together to make a <b>rectangle</b>, with no gaps and no overlaps.</p><p>Build an array of tiles, then push them together.</p>',
      check:{kind:'num',unit:'squares',answer:10,fig:F.t25,q:'How many squares make this rectangle?',
        misc:[[7,'2 + 5 adds the rows and the squares in one row. Count every square: 5 + 5.'],[5,'That’s one row. There are 2 rows of 5.']],
        explain:'2 rows of 5: 5 + 5 = 10 squares.'}},
    {title:'Cut into squares',widget:wCut,
      body:'<p>You can cut a rectangle into rows and columns of <b>same-size squares</b>. Each square is as wide as it is tall.</p><p>Pick a rectangle. Change the rows and columns until every piece is a square.</p>',
      check:{kind:'mc',q:'Which rectangle is cut into same-size squares?',
        choices:[{id:'a',label:cutPic([[0,0,2,2],[2,0,1,1],[3,0,1,1],[2,1,1,1],[3,1,1,1],[0,2,1,1],[1,2,1,1],[2,2,1,1],[3,2,1,1]],'Picture A')},{id:'b',label:cutPic(cutGrid(4,3,3,2),'Picture B')},{id:'c',label:cutPic(cutGrid(4,3,3,4),'Picture C')}],answer:'c',
        why:{a:'These are squares, but they aren’t all the same size. The big one is as big as 4 small ones.',b:'These pieces are wider than they are tall. They’re rectangles, not squares.'},
        explain:'Picture C is cut into 3 rows of 4 same-size squares: 12 squares.'}},
    {title:'Count the squares',widget:wCountSq,
      body:'<p>Once a rectangle is cut into squares, count them one at a time, by rows, or by columns.</p><p>Tap each square to count it. Then change the rows and columns.</p>',
      check:{kind:'num',unit:'pieces',answer:12,fig:F.pan,q:'A pan of cornbread is cut into 4 rows, with 3 pieces in each row. How many pieces are there?',
        misc:[[7,'4 + 3 adds the rows and the pieces in one row. Add 3 for every row.'],[9,'That’s 3 rows. There are 4 rows of 3.'],[16,'That’s 4 rows of 4. Each row has 3 pieces.']],
        explain:'3 + 3 + 3 + 3 = 12 pieces.'}}
  ]}
];
