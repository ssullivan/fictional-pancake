/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2): figures, widgets, and the chapters. Loaded by learn.html.
   Ten-frames, base-ten blocks, tape diagrams, jumps, and the controls come from shared/k5.js. */
const tensOf=n=>Math.floor(n/10);

/* ---------- figures ---------- */
/* Base-ten blocks in a row. items: numbers, {n, cls, opt} (opt goes to blocks()), or strings like '+' drawn between them. */
function bpic(items,label){
  let x=6,o='';
  items.forEach(it=>{
    if(typeof it==='string'){o+=`<text class="lbl big" x="${x+14}" y="${10+S*5}">${it}</text>`;x+=34;return;}
    const {n,t=tensOf(n),u=n%10,cls='a',opt={}}=typeof it==='number'?{n:it}:it,[m,w]=blocks(x,10,t,u,cls,opt);
    o+=m;x+=w+14;
  });
  return svgWrap(Math.max(x,120),S*10+20,o,label);
}
/* one number as blocks, t tens and u ones (u can be more than 9 after breaking a ten) */
const tu=(t,u,label=`${t} tens and ${u} ones`)=>bpic([{t,u}],label);
/* ---------- Chapter 1: add and subtract to compare ---------- */
const BEADS=[[47,25],[38,16],[56,34]];
function wCompare(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Numbers',BEADS.map(([a,b],i)=>[i,`Jada ${a}, Han ${b}`]))+`<div class="fig" data-t></div><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=BEADS[p],d=a-b;press(el,p);
    q('t').innerHTML=tapes([{label:'Jada',n:a,show:a},{label:'Han',n:b,show:b}],{diff:shown?d:'?'});
    q('f').innerHTML=bpic([{n:a,opt:shown?{outT:tensOf(b),outO:b%10}:{}}],shown?`Jada’s ${a} beads with ${b} crossed out`:`Jada’s ${a} beads`);
    q('go').textContent=shown?'Start over':`Take away Han’s ${b}`;
    q('r').innerHTML=shown?`Tens: <b>${tensOf(a)} − ${tensOf(b)} = ${tensOf(d)}</b> tens. Ones: <b>${a%10} − ${b%10} = ${d%10}</b>.<br><span class="ok"><b>${a} − ${b} = ${d}</b>. Jada has ${d} more beads than Han.</span>`:`Jada has ${a} beads. Han has ${b}. How many more beads does Jada have?<br><span class="dimline">Take Han’s amount away from Jada’s. What’s left is the difference.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}
const ONS=[[34,58],[27,49],[45,78]];
function wCountOn(el){
  const q=Q(el);let p=0,t=0,u=0;
  el.innerHTML=seg('Numbers',ONS.map(([a,c],i)=>[i,`${a} + ? = ${c}`]))+`<p class="eq" data-e></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-bt>+ 1 ten</button><button type="button" class="ghost-btn" data-bu>+ 1 one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,c]=ONS[p],add=10*t+u,now=a+add;press(el,p);
    q('e').innerHTML=`${a} + <b class="q">?</b> = ${c}`;
    q('f').innerHTML=bpic([a,'+',{t,u,cls:'b'}],`${a} in yellow blocks and ${add} added in blue`);
    q('r').innerHTML=now===c?`<span class="ok"><b>${a} + ${add} = ${c}</b>. You added ${t} tens and ${u} ones: the missing number is ${add}.</span>`:now>c?`<b>${a} + ${add} = ${now}</b><br><span class="dimline">That’s more than ${c}. Start over and add fewer.</span>`:`<b>${a} + ${add} = ${now}</b><br><span class="dimline">${c-now>=10?`Add tens first. You need to get to ${c}.`:`Close! Now add ones to get to ${c}.`}</span>`;
  };
  q('bt').onclick=()=>{t++;draw();};q('bu').onclick=()=>{u++;draw();};
  q('clr').onclick=()=>{t=u=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;t=u=0;draw();}});
  draw();
}
const STORIES=[
  {label:'Get more',story:'Diego has 35 cards. Diego gets 21 more cards. How many cards does Diego have now?',parts:[[35,'35'],[21,'21']],total:'?',eq:'35 + 21 = ?',ans:'Diego gets more, so add: 35 + 21 = 56 cards.'},
  {label:'Take away',story:'Priya has 58 beads. Priya uses 25 beads on a necklace. How many beads are left?',parts:[[25,'25'],[33,'?']],total:'58',eq:'58 − 25 = ?',ans:'Priya uses some up, so subtract: 58 − 25 = 33 beads.'},
  {label:'How many were added?',story:'Kiran has 24 stamps. Kiran gets some more. Now Kiran has 45 stamps. How many stamps did Kiran get?',parts:[[24,'24'],[21,'?']],total:'45',eq:'24 + ? = 45, or 45 − 24 = ?',ans:'Count on from 24 to 45, or subtract: 45 − 24 = 21 stamps.'},
];
function wStory(el){
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Kind of story',STORIES.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the equation</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=STORIES[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=partWhole(K.parts.map(([n,show])=>({n,show})),K.total);
    q('go').hidden=shown;
    q('r').innerHTML=shown?`<b>${K.eq}</b><br><span class="ok">${K.ans}</span>`:'Where is the <b>?</b> in the tape? Is it the whole or a part?';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=true;draw();};
  draw();
}

/* ---------- Chapter 2: subtract your way ---------- */
const TAKES=[[58,23],[76,41],[49,26]];
function wTakeAway(el){
  const q=Q(el);let p=0,t=0,u=0;
  el.innerHTML=seg('Numbers',TAKES.map(([a,b],i)=>[i,`${a} − ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-bt>Take away 1 ten</button><button type="button" class="ghost-btn" data-bu>Take away 1 one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TAKES[p],gone=10*t+u;press(el,p);
    q('f').innerHTML=bpic([{n:a,opt:{outT:t,outO:u}}],`${a} in blocks with ${t} tens and ${u} ones crossed out`);
    q('bt').disabled=t>=tensOf(a);q('bu').disabled=u>=a%10;
    q('r').innerHTML=gone===b?`<span class="ok">You took away ${tensOf(b)} tens and ${b%10} ones. <b>${a} − ${b} = ${a-b}</b>.</span>`:gone>b||t>tensOf(b)||u>b%10?`That’s more than ${b}. <span class="dimline">Start over. ${b} is ${tensOf(b)} tens and ${b%10} ones.</span>`:`Taken away: <b>${gone}</b> of ${b}<br><span class="dimline">${b} is ${tensOf(b)} tens and ${b%10} ones. ${a-gone} blocks are left.</span>`;
  };
  q('bt').onclick=()=>{t++;draw();};q('bu').onclick=()=>{u++;draw();};
  q('clr').onclick=()=>{t=u=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;t=u=0;draw();}});
  draw();
}
const WAYS=[
  {id:'back',label:'Get to a ten first',start:63,moves:[-3,-5,-10],say:'Take away 3 to get to 60. 3 + 5 = 8, so take away 5 more: 55. Then take away the ten: 45.'},
  {id:'tens',label:'Tens first',start:63,moves:[-10,-3,-5],say:'Take away the ten: 53. Take away 3 to get to 50, then 5 more: 45.'},
  {id:'up',label:'Add up from 18',start:18,moves:[2,40,3],say:'Count up from 18: 2 gets to 20, 40 gets to 60, and 3 more is 63. 2 + 40 + 3 = 45.'},
];
function wWays(el){
  const q=Q(el);let k=0,n=0;
  el.innerHTML=`<p class="eq">63 − 18 = <b class="q">?</b></p>`+seg('Way',WAYS.map((w,i)=>[i,w.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const W=WAYS[k],done=n===W.moves.length;press(el,k);
    q('f').innerHTML=jumps(W.start,W.moves,n);
    q('go').textContent=done?'Start over':'Next jump';
    q('r').innerHTML=done?`<span class="ok">${W.say}</span><br>Every way gets <b>63 − 18 = 45</b>.`:n?`<span class="dimline">Keep going.</span>`:k===2?'Start at 18 and count up to 63. How far did you go?':'There are only 3 ones in 63, but 18 has 8 ones. Take away in smaller parts.';
  };
  q('go').onclick=()=>{n=n===WAYS[k].moves.length?0:n+1;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;n=0;draw();}});
  draw();
}

/* ---------- Chapter 3: decompose a ten ---------- */
const TRADES=[[42,17],[53,26],[71,35]];
function wTrade(el){
  const q=Q(el);let p=0,broke=false,t=0,u=0;
  el.innerHTML=seg('Numbers',TRADES.map(([a,b],i)=>[i,`${a} − ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-brk>Break a ten</button><button type="button" class="ghost-btn" data-bt>Take away 1 ten</button><button type="button" class="ghost-btn" data-bu>Take away 1 one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TRADES[p],T=tensOf(a)-(broke?1:0),U=a%10+(broke?10:0),gone=10*t+u;press(el,p);
    q('f').innerHTML=bpic([{t:T,u:U,opt:{traded:broke?10:0,outT:t,outO:u}}],`${T} tens and ${U} ones, with ${t} tens and ${u} ones crossed out`);
    q('brk').disabled=broke;q('bt').disabled=t>=T;q('bu').disabled=u>=U;
    q('r').innerHTML=gone===b?`<span class="ok">You took away ${b}. <b>${a} − ${b} = ${a-b}</b>.</span>`:gone>b||t>tensOf(b)||u>b%10?`That’s more than ${b}. <span class="dimline">Start over. ${b} is ${tensOf(b)} tens and ${b%10} ones.</span>`
      :!broke&&u>=U?`<b>Only ${a%10} ones!</b> <span class="dimline">You need to take away ${b%10} ones. Break a ten into 10 ones.</span>`
      :`Take away <b>${tensOf(b)} tens and ${b%10} ones</b>.<br><span class="dimline">${broke?`${a} is now ${T} tens and ${U} ones. The green ones came from the broken ten.`:`${a} has only ${a%10} ones. Will you need to break a ten?`}</span>`;
  };
  q('brk').onclick=()=>{broke=true;draw();};
  q('bt').onclick=()=>{t++;draw();};q('bu').onclick=()=>{u++;draw();};
  q('clr').onclick=()=>{broke=false;t=u=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;broke=false;t=u=0;draw();}});
  draw();
}
const SHOWS=[45,62,31];
function wShow(el){
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Number',SHOWS.map((n,i)=>[i,n]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-brk>Break a ten</button><button type="button" class="ghost-btn" data-back>Put 10 ones back</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=SHOWS[p],T=tensOf(n)-k,U=n%10+10*k;press(el,p);
    q('f').innerHTML=bpic([{t:T,u:U,opt:{traded:10*k}}],`${T} tens and ${U} ones`);
    q('brk').disabled=T<1||k>=2;q('back').disabled=!k;
    q('r').innerHTML=`<b>${T} tens and ${U} ones</b>: ${10*T} + ${U} = ${n}<br><span class="dimline">${k?'Still '+n+'! Breaking a ten changes how it looks, not how many.':'Break a ten to show it another way.'}</span>`;
  };
  q('brk').onclick=()=>{k++;draw();};q('back').onclick=()=>{k--;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  draw();
}

/* ---------- Chapter 4: add and subtract within 100 ---------- */
const MIXED=[[36,27,'+'],[36,23,'+'],[64,28,'−'],[64,23,'−']];
function wNewOrBreak(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Problem',MIXED.map(([a,b,op],i)=>[i,`${a} ${op} ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b,op]=MIXED[p],add=op==='+',oa=a%10,ob=b%10;press(el,p);
    if(add){
      q('f').innerHTML=addBlocks(a,b,shown);
      q('r').innerHTML=!shown?`<b>${a} + ${b}</b><br><span class="dimline">Will the ones make a new ten?</span>`:oa+ob>=10?`Ones: ${oa} + ${ob} = ${oa+ob}. That’s <b>a new ten</b> and ${oa+ob-10} ones.<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span>`:`Ones: ${oa} + ${ob} = ${oa+ob}. No new ten this time.<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span>`;
    }else{
      const brk=shown&&oa<ob,T=tensOf(a)-(brk?1:0),U=oa+(brk?10:0);
      q('f').innerHTML=bpic([{t:T,u:U,opt:shown?{traded:brk?10:0,outT:tensOf(b),outO:ob}:{}}],shown?`${a} with ${b} crossed out`:`${a} in blocks`);
      q('r').innerHTML=!shown?`<b>${a} − ${b}</b><br><span class="dimline">Are there enough ones to take away ${ob}?</span>`:oa<ob?`Only ${oa} ones, so <b>break a ten</b>: now there are ${U} ones. Take away ${ob}.<br><span class="ok"><b>${a} − ${b} = ${a-b}</b></span>`:`${oa} ones is enough to take away ${ob}. No ten to break.<br><span class="ok"><b>${a} − ${b} = ${a-b}</b></span>`;
    }
    q('go').textContent=shown?'Start over':add?'Put them together':'Take it away';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}

/* ---------- Chapter 5: story problems ---------- */
const WHERE=[
  {label:'Whole unknown',story:'Andre has 36 red cubes and 25 blue cubes. How many cubes does Andre have?',parts:[[36,'36'],[25,'25']],total:'?',ans:'The whole is missing, so add the parts: 36 + 25 = 61 cubes.'},
  {label:'Part unknown',story:'Lin had 70 crayons. Some crayons broke. Now Lin has 45 crayons that aren’t broken. How many crayons broke?',parts:[[45,'45'],[25,'?']],total:'70',ans:'A part is missing: 45 + ? = 70, or 70 − 45 = 25 crayons.'},
  {label:'Start unknown',story:'Noah had some stickers. Noah got 24 more stickers. Now Noah has 60. How many stickers did Noah have at first?',parts:[[36,'?'],[24,'24']],total:'60',ans:'The start is missing: ? + 24 = 60, or 60 − 24 = 36 stickers.'},
];
function wWhere(el){
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Kind of story',WHERE.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Show the answer</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=WHERE[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=partWhole(K.parts.map(([n,show])=>({n,show,hi:show==='?'})),K.total);
    q('go').hidden=shown;
    q('r').innerHTML=shown?`<span class="ok">${K.ans}</span>`:'Which number in the story is the whole? Which are parts?';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=true;draw();};
  draw();
}
const EQS=[
  {story:'Some ducks were in the pond. 25 more ducks came. Now there are 60 ducks. How many ducks were in the pond at first?',eqs:['? + 25 = 60','60 − 25 = ?'],parts:[[35,'?'],[25,'25']],total:'60',a:35,check:'35 + 25 = 60'},
  {story:'Elena had 82 pages to read. Elena read some pages. Now Elena has 40 pages left. How many pages did Elena read?',eqs:['82 − ? = 40','40 + ? = 82'],parts:[[40,'40'],[42,'?']],total:'82',a:42,check:'82 − 42 = 40'},
];
function wEquations(el){
  const q=Q(el);let k=0,e=-1;
  el.innerHTML=seg('Story',EQS.map((_,i)=>[i,`Story ${i+1}`]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const K=EQS[k];press(el,k);
    q('s').textContent=K.story;
    q('f').innerHTML=partWhole(K.parts.map(([n,show])=>({n,show})),K.total);
    q('c').innerHTML=K.eqs.map((x,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}">${x}</button>`).join('');
    q('r').innerHTML=e<0?'Tap an equation. Does it match the story?':`<b>${K.eqs[e].replace('?',`<span class="ok">${K.a}</span>`)}</b><br><span class="dimline">It matches the story. Both equations give ${K.a}. Check: ${K.check}.</span>`;
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){k=+b.dataset.m;e=-1;draw();return;}const c=ev.target.closest('[data-e]');if(c){e=+c.dataset.e;draw();}});
  draw();
}
function wTwoStep(el){
  const q=Q(el);let n=0;
  el.innerHTML=`<p class="story">Kiran has 28 stickers. Kiran gets 15 more stickers. Then Kiran gives 20 stickers to Mai. How many stickers does Kiran have now?</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=n===0?partWhole([{n:28,show:'28'},{n:15,show:'15'}],'?','28 and 15 make the whole')
      :partWhole([{n:28,show:'28'},{n:15,show:'15'}],'43','28 and 15 make 43')+partWhole([{n:20,show:'20'},{n:23,show:n>1?'23':'?',hi:true}],'43','43 is 20 and a part left');
    q('go').textContent=n===0?'Step 1: gets more':n===1?'Step 2: gives some away':'Start over';
    q('r').innerHTML=n===0?'This story has two steps. What happens first?':n===1?`Step 1: <b>28 + 15 = 43</b> stickers.<br><span class="dimline">Now Kiran gives 20 away. What’s left?</span>`:`Step 1: <b>28 + 15 = 43</b>. Step 2: <b>43 − 20 = 23</b>.<br><span class="ok">Kiran has 23 stickers now.</span>`;
  };
  q('go').onclick=()=>{n=(n+1)%3;draw();};
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  lin:tapes([{label:'Lin',n:68,show:68},{label:'Noah',n:35,show:35}],{diff:'?'}),
  on26:bpic([26,'+','?'],'26 in blocks, plus how many?'),
  elena:partWhole([{n:30,show:'30'},{n:32,show:'?'}],'62','62 blocks: 30 put away and some left out'),
  han67:bpic([67],'67 marbles in blocks: 6 tens and 7 ones'),
  b52:bpic([52],'52 in blocks: 5 tens and 2 ones'),
  b54:bpic([54],'54 in blocks: 5 tens and 4 ones'),
  mai:addBlocks(45,38,false),
  b57:bpic([57],'57 in blocks: 5 tens and 7 ones'),
  diego:partWhole([{n:27,show:'?'},{n:18,show:'18'}],'45','Some marbles and 18 more make 45'),
  cards:partWhole([{n:34,show:'34'},{n:25,show:'25'}],'?','34 and 25 make the whole'),
};
const apples=(p,total,label)=>partWhole(p.map(([n,show])=>({n,show})),total,label);

/* ---------- chapters ---------- */
const ICON={
  tape:'<rect x="4" y="14" width="56" height="14" rx="2" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="4" y="36" width="34" height="14" rx="2" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><rect x="38" y="36" width="22" height="14" rx="2" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 3"/>',
  take:'<g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="8" y="8" width="8" height="48"/><rect x="20" y="8" width="8" height="48"/><rect x="32" y="8" width="8" height="48" opacity=".35"/><rect x="46" y="48" width="8" height="8"/><rect x="46" y="38" width="8" height="8" opacity=".35"/></g><g stroke="#ff7b7b" stroke-width="3" stroke-linecap="round"><path d="M29,58L43,6"/><path d="M43,50L57,34"/></g>',
  trade:'<g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="6" y="8" width="8" height="48"/><rect x="18" y="8" width="8" height="48"/></g><path d="M30,32h8m-3,-4l4,4l-4,4" stroke="#f3f6fb" stroke-width="2" fill="none"/><g fill="#5fe0a8" stroke="#0a2340" stroke-width="1"><rect x="44" y="8" width="7" height="7"/><rect x="44" y="18" width="7" height="7"/><rect x="44" y="28" width="7" height="7"/><rect x="44" y="38" width="7" height="7"/><rect x="44" y="48" width="7" height="7"/><rect x="54" y="8" width="7" height="7"/><rect x="54" y="18" width="7" height="7"/><rect x="54" y="28" width="7" height="7"/><rect x="54" y="38" width="7" height="7"/><rect x="54" y="48" width="7" height="7"/></g>',
  newten:'<g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="8" y="8" width="8" height="48"/><rect x="20" y="8" width="8" height="48"/></g><g fill="#7fe3ff" stroke="#0a2340" stroke-width="1"><rect x="32" y="8" width="8" height="48"/></g><rect x="44" y="8" width="8" height="48" fill="#5fe0a8" stroke="#fff" stroke-width="2"/><rect x="56" y="48" width="6" height="8" fill="#ffc93c"/>',
  story:'<path d="M6,20 v-8 H58 v8" fill="none" stroke="#7fe3ff" stroke-width="2.5"/><rect x="6" y="26" width="30" height="18" rx="2" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2"/><rect x="36" y="26" width="22" height="18" rx="2" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="2"/><text x="47" y="40" fill="#7fe3ff" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const CH=[
  {icon:'tape',title:'Add and subtract to compare',lessons:'Lessons 1–3',blurb:'Find how many more, count on to find a missing number, and decide whether a story adds or subtracts.',steps:[
    {title:'How many more?',widget:wCompare,
      body:'<p>To find how many more, you can <b>subtract</b>. Take the smaller amount away from the bigger one. What’s left is the difference.</p><p>Pick numbers, then take Han’s beads away from Jada’s.</p>',
      check:{kind:'num',unit:'stickers',answer:33,fig:F.lin,q:'Lin has 68 stickers. Noah has 35 stickers. How many more stickers does Lin have than Noah?',
        misc:[[103,'You added. “How many more” asks for the difference, so subtract.'],[68,'That’s how many Lin has. How many more than Noah?'],[35,'That’s how many Noah has. How many more does Lin have?']],
        explain:'68 − 35 = 33. Tens: 6 − 3 = 3 tens. Ones: 8 − 5 = 3. Lin has 33 more stickers.'}},
    {title:'Find the missing number',widget:wCountOn,
      body:'<p><b>34 + ? = 58</b> asks: what do you add to 34 to make 58? Count on by tens, then by ones.</p><p>Add tens and ones until you reach the total.</p>',
      check:{kind:'num',answer:23,fig:F.on26,q:'What number makes this true? <b>26 + ? = 49</b>',
        misc:[[75,'That’s 26 + 49. Find the number you add to 26 to make 49.'],[49,'49 is the total. What do you add to 26 to get to 49?']],
        explain:'Count on from 26: 2 tens gets to 46, and 3 ones gets to 49. 20 + 3 = 23, so 26 + 23 = 49.'}},
    {title:'Add or subtract?',widget:wStory,
      body:'<p>A tape diagram shows a story. The whole tape is the <b>total</b>. The pieces are the <b>parts</b>. If the total is missing, add. If a part is missing, subtract or count on.</p><p>Tap each kind of story.</p>',
      check:{kind:'mc',stack:true,q:'Elena has 62 blocks. Elena puts 30 blocks away. How many blocks are still out?',fig:F.elena,
        choices:[{id:'a',label:'62 − 30 = ?'},{id:'b',label:'62 + 30 = ?'},{id:'c',label:'? − 62 = 30'}],answer:'a',
        why:{b:'Elena puts blocks away, so there are fewer out. Subtract.',c:'62 is how many blocks Elena starts with, so the equation starts with 62.'},
        explain:'62 − 30 = 32. 32 blocks are still out.'}}
  ]},
  {icon:'take',title:'Subtract your way',lessons:'Lessons 5–6',blurb:'Take away tens and ones, and find different ways to subtract when there aren’t enough ones.',steps:[
    {title:'Take away tens, then ones',widget:wTakeAway,
      body:'<p>To subtract, you can take away the <b>tens</b>, then the <b>ones</b>.</p><p>Pick a problem, then take away tens and ones.</p>',
      check:{kind:'num',unit:'marbles',answer:33,fig:F.han67,q:'Han has 67 marbles. Han gives 34 marbles to Lin. How many marbles does Han have now?',
        misc:[[101,'You added. Han gave marbles away, so Han has fewer now.'],[34,'That’s how many Han gave away. How many are left?'],[37,'You took away the tens. Take away the 4 ones too.'],[63,'You took away the ones. Take away the 3 tens too.']],
        explain:'Take away 3 tens: 67 − 30 = 37. Take away 4 ones: 37 − 4 = 33 marbles.'}},
    {title:'Not enough ones',widget:wWays,
      body:'<p>In <b>63 − 18</b>, there are only 3 ones in 63, but you need to take away 8. You can take away in smaller parts, or count up.</p><p>Pick a way, then tap Next jump.</p>',
      check:{kind:'mc',stack:true,q:'Which way works for <b>52 − 7</b>?',fig:F.b52,
        choices:[{id:'a',label:'52 − 2 = 50, then 50 − 5 = 45'},{id:'b',label:'7 − 2 = 5, so the answer is 55'},{id:'c',label:'52 − 2 = 50, then 50 − 7 = 43'}],answer:'a',
        why:{b:'You can’t flip the ones around. 52 has only 2 ones, and you need to take away 7.',c:'That takes away 2 and then 7: 9 in all. You only take away 7, and 7 = 2 + 5.'},
        explain:'7 is 2 and 5. Take away 2 to get to 50, then 5 more: 52 − 7 = 45.'}}
  ]},
  {icon:'trade',title:'Break a ten',lessons:'Lessons 7–8',blurb:'Trade a ten for 10 ones so you can take away, and show one number in different ways.',steps:[
    {title:'Trade a ten for 10 ones',widget:wTrade,
      body:'<p>If there aren’t enough ones, <b>break a ten</b> into 10 ones. The number stays the same, but now you have enough ones to take away.</p><p>Pick a problem. Break a ten when you need to, then take away.</p>',
      check:{kind:'num',unit:'beads',answer:26,fig:F.b54,q:'Priya has 54 beads. Priya uses 28 beads on a bracelet. How many beads are left?',
        misc:[[34,'You did 8 − 4 in the ones. 54 has only 4 ones, so break a ten: 14 − 8 = 6.'],[82,'You added. Priya used beads, so subtract.'],[36,'You broke a ten but forgot to take it from the tens: 5 tens is now 4 tens.']],
        explain:'Break a ten: 54 is 4 tens and 14 ones. 14 − 8 = 6 ones, and 4 − 2 = 2 tens. 54 − 28 = 26 beads.'}},
    {title:'Different ways to show a number',widget:wShow,
      body:'<p>45 is 4 tens and 5 ones. It’s also <b>3 tens and 15 ones</b>. Breaking a ten changes how it looks, not how many there are.</p><p>Pick a number, then break a ten.</p>',
      check:{kind:'mc',q:'Which one shows <b>52</b>?',
        choices:[{id:'a',label:tu(5,12)},{id:'b',label:tu(4,12)},{id:'c',label:tu(4,2)}],answer:'b',
        why:{a:'That’s 5 tens and 12 ones: 50 + 12 = 62. When a ten breaks, there’s 1 fewer ten.',c:'That’s 4 tens and 2 ones: 42. Where did the broken ten’s 10 ones go?'},
        explain:'4 tens and 12 ones: 40 + 12 = 52. It’s 52 with one ten broken into ones.'}}
  ]},
  {icon:'newten',title:'Add and subtract within 100',lessons:'Lesson 9',blurb:'Make a new ten when you add, break a ten when you subtract, and know which one a problem needs.',steps:[
    {title:'Make a new ten',widget:tensOnesAdd([[45,38],[27,36],[34,25]]),
      body:'<p>When you add, put tens with tens and ones with ones. If there are 10 or more ones, they make a <b>new ten</b>.</p><p>Pick a problem, then put the blocks together.</p>',
      check:{kind:'num',unit:'stickers',answer:83,fig:F.mai,q:'Mai has 45 stickers. Mai gets 38 more stickers. How many stickers does Mai have now?',
        misc:[[73,'You didn’t count the new ten. 5 + 8 = 13 ones is 1 ten and 3 ones.'],[7,'You subtracted. Mai gets more, so add.'],[713,'5 + 8 = 13 is 1 ten and 3 ones. Put the new ten with the other tens.']],
        explain:'Tens: 40 + 30 = 70. Ones: 5 + 8 = 13, a new ten and 3 ones. 70 + 13 = 83 stickers.'}},
    {title:'New ten or break a ten?',widget:wNewOrBreak,
      body:'<p>Adding can make a <b>new ten</b>. Subtracting can need you to <b>break a ten</b>. Look at the ones to know.</p><p>Pick a problem, then show it with blocks.</p>',
      check:{kind:'mc',q:'Which one needs you to <b>break a ten</b>?',fig:F.b57,
        choices:[{id:'a',label:'57 − 24'},{id:'b',label:'57 − 29'},{id:'c',label:'57 + 29'}],answer:'b',
        why:{a:'57 has 7 ones. That’s enough to take away 4 ones.',c:'That’s adding. 7 + 9 = 16 ones makes a new ten, but nothing breaks.'},
        explain:'57 has 7 ones, but 29 has 9 ones. Break a ten to get 17 ones: 57 − 29 = 28.'}}
  ]},
  {icon:'story',title:'Story problems',lessons:'Lessons 11–14',blurb:'Show stories with tape diagrams and equations, find the missing part, and solve two-step stories.',steps:[
    {title:'Story problems and diagrams',widget:wWhere,
      body:'<p>In a story, the <b>?</b> can be the whole, a part, or even the start. A tape diagram shows where it goes.</p><p>Tap each kind of story.</p>',
      check:{kind:'mc',q:'Jada picks 28 apples. Han picks some apples too. Together they pick 64 apples. Which diagram matches the story?',
        choices:[{id:'a',label:apples([[28,'28'],[36,'?']],'64','Parts 28 and question mark, total 64')},{id:'b',label:apples([[28,'28'],[64,'64']],'?','Parts 28 and 64, total question mark')},{id:'c',label:apples([[28,'28'],[36,'?']],'?','Parts 28 and question mark, total question mark')}],answer:'a',
        why:{b:'64 is how many they pick together: the whole, not a part.',c:'The story tells you 64. Where does 64 go? It’s how many they pick together: the whole.'},
        explain:'28 is Jada’s part, Han’s part is ?, and 64 is the whole. 28 + ? = 64, so Han picks 36.'}},
    {title:'Story problems and equations',widget:wEquations,
      body:'<p>More than one equation can match a story. <b>? + 25 = 60</b> and <b>60 − 25 = ?</b> both find the missing part.</p><p>Tap each equation to see that it matches.</p>',
      check:{kind:'num',unit:'marbles',answer:27,fig:F.diego,q:'Diego had some marbles. Diego got 18 more marbles. Now Diego has 45 marbles. How many marbles did Diego have at first?',
        misc:[[63,'You added 45 and 18. 45 is how many Diego has now, after getting more. Diego had fewer at first.'],[18,'That’s how many Diego got. How many did Diego have before that?'],[37,'You broke a ten but kept 4 tens. After breaking a ten, 45 is 3 tens and 15 ones: 3 − 1 = 2 tens.']],
        explain:'? + 18 = 45, so 45 − 18 = 27. Check: 27 + 18 = 45.'}},
    {title:'Two-step stories',widget:wTwoStep,
      body:'<p>Some stories have <b>two steps</b>. Solve the first step, then use that answer in the second step.</p><p>Tap to do one step at a time.</p>',
      check:{kind:'num',unit:'cards',answer:29,fig:F.cards,q:'Elena has 34 cards. Elena buys 25 more cards. Then Elena gives 30 cards away. How many cards does Elena have now?',
        misc:[[59,'That’s step 1: 34 + 25 = 59. Now Elena gives 30 away.'],[89,'You added all three. Elena gives 30 away, so subtract that part.'],[4,'You skipped the cards Elena bought. First add 34 + 25.']],
        explain:'Step 1: 34 + 25 = 59. Step 2: 59 − 30 = 29 cards.'}}
  ]}
];
