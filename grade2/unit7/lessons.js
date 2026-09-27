/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7): figures, widgets, and the chapters. Loaded by learn.html.
   Base-ten pieces (flat, stick, cube1, xOut), open number lines (jumps), place-value charts (pvChart), and choice buttons come from shared/k5.js. */
const PL=['hundreds','tens','ones'];

/* ---------- figures ---------- */
/* A place-value mat: a row of blocks for each number, with hundreds, tens, and ones in lined-up columns.
   rows: [{lab, h, t, o}]; h, t, o give a class for each block (build them with cellsOf): 'a' gold, 'b' blue,
   'new' a new ten or hundred, 'tr' from a broken ten or hundred, plus ' gone' to cross it out.
   fit: {h, t, o} how many blocks each column needs room for, so the columns stay put as blocks come and go. */
function mat(rows,label,fit={}){
  const most=k=>Math.max(fit[k]||0,...rows.map(r=>r[k].length)),H=most('h'),T=most('t'),O=most('o'),L=rows.some(r=>r.lab)?64:0;
  const w=[Math.max(Math.min(H,5)*(FW+8)-8,76),Math.max(T*(BT+4)+Math.floor((T-1)/5)*5-4,50),Math.max(Math.ceil(O/5)*(BT+5)-5,50)];
  const X=[10+L,34+L+w[0],58+L+w[0]+w[1]],gone=c=>c.includes('gone');
  let y=34,o='';
  rows.forEach(r=>{
    r.h.forEach((c,i)=>{const x=X[0]+i%5*(FW+8),yy=y+Math.floor(i/5)*(FW+8);o+=flat(x,yy,c)+(gone(c)?xOut(x,yy,FW,FW):'');});
    r.t.forEach((c,i)=>{const x=X[1]+i*(BT+4)+Math.floor(i/5)*5;o+=stick(x,y,c)+(gone(c)?xOut(x,y,BT,FW):'');});
    r.o.forEach((c,i)=>{const x=X[2]+Math.floor(i/5)*(BT+5),yy=y+FW-BT-(i%5)*(BT+5);o+=cube1(x,yy,c)+(gone(c)?xOut(x,yy,BT,BT):'');});
    if(r.lab)o+=`<text class="lbl en" x="${L}" y="${y+FW/2}">${r.lab}</text>`;
    y+=Math.max(FW,Math.ceil(r.h.length/5)*(FW+8)-8)+20;
  });
  const head=PL.map((p,i)=>`<text class="lbl s dm" x="${X[i]+w[i]/2}" y="14">${p}</text>`).join('')+[1,2].map(i=>`<path class="guide" d="M${X[i]-12},4V${y-10}"/>`).join('');
  return svgWrap(X[2]+w[2]+10,y-6,head+o,label);
}
/* n as one row of the mat, every block in class cls */
const bl=(n,cls='a',lab)=>{const [h,t,o]=digits(n);return {lab,h:cellsOf([h,cls]),t:cellsOf([t,cls]),o:cellsOf([o,cls])};};
/* a + b on the mat, one row each */
const apart=(a,b)=>mat([bl(a,'a',a),bl(b,'b',`+ ${b}`)],`${a} and ${b} in base-ten blocks`);
/* lines like "700 − 300 = 400", one under the other */
const byPlace=lines=>`<div class="bp">${lines.map(l=>`<p class="eq">${l}</p>`).join('')}</div>`;
/* "1 hundred, 3 tens, and 2 ones", leaving out places with 0 */
function partsOf(n){
  const p=digits(n).map((d,i)=>d?`${d} ${d===1?PL[i].slice(0,-1):PL[i]}`:'').filter(Boolean);
  return p.length>1?p.slice(0,-1).join(', ')+(p.length>2?',':'')+' and '+p[p.length-1]:p[0];
}

/* ---------- widgets used in more than one chapter ---------- */
/* One jump at a time on an open number line. list: [{a, moves, label}]; intro(P) shows before the first jump, done(P, end) after the last. */
const jumpW=(list,intro,done)=>el=>{
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Problem',list.map((x,i)=>[i,x.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=list[p],n=P.moves.length;let v=P.a;press(el,p);
    q('f').innerHTML=jumps(P.a,P.moves,k);
    const lines=P.moves.slice(0,k).map(d=>{const s=`${v} ${d>0?'+':'−'} ${Math.abs(d)} = ${v+d}`;v+=d;return `<b>${s}</b>`;});
    q('go').textContent=k<n?(k?'Next jump':'Jump!'):'Start over';
    q('r').innerHTML=k?lines.join('<br>')+(k===n?'<br>'+done(P,v):''):intro(P);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  q('go').onclick=()=>{k=k<list[p].moves.length?k+1:0;draw();};
  draw();
};

/* The blocks for a + b, one stage at a time: apart, together, then a new ten and a new hundred when the ones or tens make 10. */
function addStages(a,b){
  const [ha,ta,oa]=digits(a),[hb,tb,ob]=digits(b),S=[{rows:[bl(a,'a',a),bl(b,'b',`+ ${b}`)]}];
  let h=cellsOf([ha,'a'],[hb,'b']),t=cellsOf([ta,'a'],[tb,'b']),o=cellsOf([oa,'a'],[ob,'b']);
  S.push({h,t,o});
  if(o.length>=10){o=o.slice(10);t=[...t,'new'];S.push({h,t,o,made:'ten'});}
  if(t.length>=10){t=t.slice(10);h=[...h,'new'];S.push({h,t,o,made:'hundred'});}
  return S;
}
/* the mat for stage s of addStages, with room in each column for every stage */
function stageFig(a,b,S,s){
  const fit={};['h','t','o'].forEach(k=>{fit[k]=Math.max(...S.slice(1).map(x=>x[k].length));});
  return s.rows?mat(s.rows,`${a} and ${b} in base-ten blocks`,fit):mat([s],`${s.h.length} hundreds, ${s.t.length} tens, and ${s.o.length} ones`,fit);
}
/* Widget: pick a + b, then put the blocks together and make each new ten or hundred. */
const addW=PROBS=>el=>{
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Problem',PROBS.map(([a,b],i)=>[i,`${a} + ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PROBS[p],[ha,ta,oa]=digits(a),[hb,tb,ob]=digits(b),S=addStages(a,b),s=S[k],nx=S[k+1];press(el,p);
    q('f').innerHTML=stageFig(a,b,S,s);
    q('go').textContent=!nx?'Start over':!k?'Put them together':nx.made==='ten'?'Make a new ten':'Make a new hundred';
    const next=!nx?`<br><span class="ok"><b>${a} + ${b} = ${a+b}</b></span><br><span class="dimline">${s.h.length} hundreds, ${s.t.length} tens, ${s.o.length} ones: ${s.h.length*100} + ${s.t.length*10} + ${s.o.length}</span>`
      :nx.made==='ten'?`<br><span class="dimline">${s.o.length} ones! Trade 10 ones for a new ten.</span>`:nx.made==='hundred'?`<br><span class="dimline">${s.t.length} tens! Trade 10 tens for a new hundred.</span>`:'';
    q('r').innerHTML=!k?`<b>${a} + ${b}</b><br><span class="dimline">Big squares are hundreds, sticks are tens, and small squares are ones.</span>`
      :k===1?`Hundreds: <b>${ha} + ${hb} = ${ha+hb}</b>. Tens: <b>${ta} + ${tb} = ${ta+tb}</b>. Ones: <b>${oa} + ${ob} = ${oa+ob}</b>.`+next
      :s.made==='ten'?`10 ones make <b>a new ten</b>. Now there are ${s.t.length} tens and ${s.o.length} ones.`+next
      :`10 tens make <b>a new hundred</b>. Now there are ${s.h.length} hundreds and ${s.t.length} tens.`+next;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  q('go').onclick=()=>{k=k+1<addStages(...PROBS[p]).length?k+1:0;draw();};
  draw();
};

/* Widget: pick a − b, then take away the ones, tens, and hundreds. brk: which breaks it offers ('t' a ten, 'h' a hundred, 'th' both, '' none). */
const subW=(PROBS,brk='')=>el=>{
  const q=Q(el);let p=0,s;
  const reset=()=>{s={bh:0,bt:0,h:0,t:0,o:0,msg:''};};
  el.innerHTML=seg('Problem',PROBS.map(([a,b],i)=>[i,`${a} − ${b}`]))+`<div class="fig" data-f></div><div class="wrow">`
    +(brk.includes('h')?'<button type="button" class="btn" data-bh>Break a hundred</button>':'')+(brk.includes('t')?'<button type="button" class="btn" data-bt>Break a ten</button>':'')
    +`<button type="button" class="ghost-btn" data-to>Take away ones</button><button type="button" class="ghost-btn" data-tt>Take away tens</button><button type="button" class="ghost-btn" data-th>Take away hundreds</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  /* the blocks now: H hundreds; g gold tens and tr tens from a broken hundred; oa gold ones and 10 from a broken ten */
  const now=()=>{const [ha,ta,oa]=digits(PROBS[p][0]);let g=ta,tr=10*s.bh;if(s.bt){if(g)g--;else tr--;}return {H:ha-s.bh,g,tr,T:g+tr,oa,O:oa+10*s.bt};};
  const cross=(list,n,on)=>on?list.map((c,i)=>i>=list.length-n?c+' gone':c):list;
  const draw=()=>{
    const [a,b]=PROBS[p],[hb,tb,ob]=digits(b),{H,g,tr,T,oa,O}=now(),all=s.h&&s.t&&s.o;press(el,p);
    q('f').innerHTML=mat([{h:cross(cellsOf([H,'a']),hb,s.h),t:cross(cellsOf([g,'a'],[tr,'tr']),tb,s.t),o:cross(cellsOf([oa,'a'],[10*s.bt,'tr']),ob,s.o)}],
      `${H} hundreds, ${T} tens, and ${O} ones`+(s.h||s.t||s.o?', with some crossed out':''),{h:digits(a)[0],t:digits(a)[1]+(brk.includes('h')?10:0),o:digits(a)[2]+(brk.includes('t')?10:0)});
    if(q('bh'))q('bh').disabled=!!(s.bh||s.t);
    if(q('bt'))q('bt').disabled=!!(s.bt||s.o);
    q('to').disabled=!!s.o;q('tt').disabled=!!s.t;q('th').disabled=!!s.h;
    const green=s.bh&&s.bt?'The green tens came from a broken hundred, and the green ones from a broken ten.':s.bh?'The green tens came from a broken hundred.':s.bt?'The green ones came from a broken ten.':'';
    q('r').innerHTML=all?`<span class="ok">You took away ${b}. <b>${a} − ${b} = ${a-b}</b>.</span><br><span class="dimline">${H-hb} hundreds, ${T-tb} tens, and ${O-ob} ones are left.</span>`
      :(s.msg?`<span class="no">${s.msg}</span>`:`Take away <b>${b}</b>: ${partsOf(b)}.`)
      +`<br><span class="dimline">${green?`${a} is now ${H} hundreds, ${T} tens, and ${O} ones. ${green}`:brk==='t'?'Are there enough ones to take away?':brk==='h'?'Are there enough tens to take away?':brk?'Check the ones first, then the tens.':'Take away each place.'}</span>`;
  };
  const act=f=>()=>{s.msg=f()||'';draw();};
  if(q('bh'))q('bh').onclick=act(()=>{const {H}=now();if(H-(s.h?digits(PROBS[p][1])[0]:0)<1)return 'There are no hundreds left to break.';s.bh=1;});
  if(q('bt'))q('bt').onclick=act(()=>{const {T}=now();if(T-(s.t?digits(PROBS[p][1])[1]:0)<1)return 'There are no tens to break. Break a hundred first.';s.bt=1;});
  q('to').onclick=act(()=>{const {T,O}=now(),ob=digits(PROBS[p][1])[2];if(O<ob)return `Only ${O} ones, and you need to take away ${ob}. `+(!brk?'':T?'Break a ten first.':'There are no tens to break. Break a hundred first.');s.o=1;});
  q('tt').onclick=act(()=>{const {T}=now(),tb=digits(PROBS[p][1])[1];if(T<tb)return `Only ${T} tens, and you need to take away ${tb}. Break a hundred first.`;s.t=1;});
  q('th').onclick=act(()=>{s.h=1;});
  q('clr').onclick=()=>{reset();draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;reset();draw();}});
  reset();draw();
};

/* Widget: one problem done different ways. W: [{label, fig, say}]. Once every way has been seen, it says they all agree. */
const waysW=(eq,ans,W)=>el=>{
  const q=Q(el),seen=new Set();let k=0;
  el.innerHTML=`<p class="eq">${eq} = <b class="q">?</b></p>`+seg('Way',W.map((w,i)=>[i,w.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,k);seen.add(k);
    q('f').innerHTML=W[k].fig;
    q('r').innerHTML=W[k].say+(seen.size===W.length?`<br><span class="ok">Every way gets <b>${eq} = ${ans}</b>.</span>`:`<br><span class="dimline">Now tap another way.</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;draw();}});
  draw();
};

/* ---------- Chapter 1: count on and count back ---------- */
const HOPS=[{a:245,moves:[100,30,2],label:'245 + 132'},{a:468,moves:[-200,-20,-5],label:'468 − 225'},{a:327,moves:[200,50],label:'327 + 250'}];
const wHops=jumpW(HOPS,P=>{const d=P.moves.reduce((s,m)=>s+m,0);return `${P.label}: start at <b>${P.a}</b>.<br><span class="dimline">${Math.abs(d)} is ${partsOf(Math.abs(d))}. Jump ${d>0?'on':'back'} by hundreds, then tens, then ones.</span>`;},
  (P,end)=>`<span class="ok">${P.label} = ${end}</span>`);
/* + and − 10 or 100, staying inside three-digit numbers and never going past a 9 or a 0 */
function wMore(el){
  const q=Q(el);let n=347,prev=null,d=0;
  const moves=[-100,-10,10,100];
  el.innerHTML=`<div data-c></div><div class="fig" data-f></div><div class="wrow">${moves.map(m=>`<button type="button" class="ghost-btn" data-add="${m}">${m>0?'+':'−'} ${Math.abs(m)}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [h,t]=digits(n),ch=d?(Math.abs(d)===100?0:1):-1;
    q('c').innerHTML=pvChart([['',n]],ch);q('f').innerHTML=numBlocks(n);
    el.querySelectorAll('[data-add]').forEach(b=>{const m=+b.dataset.add;b.disabled=m===100?h>=9:m===-100?h<=1:m===10?t>=9:t<=0;});
    q('r').innerHTML=!d?'Tap a button. Which digit changes?'
      :`<b>${Math.abs(d)} ${d>0?'more':'less'} than ${prev} is ${n}.</b><br><span class="dimline">Only the ${PL[ch]} digit changed: ${digits(prev)[ch]} ${PL[ch]} to ${digits(n)[ch]} ${PL[ch]}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b&&!b.disabled){d=+b.dataset.add;prev=n;n+=d;draw();}});
  draw();
}
const GAPS=[{a:196,moves:[4,200,3],label:'403 − 196'},{a:480,moves:[20,20],label:'520 − 480'},{a:350,moves:[50,200,10],label:'610 − 350'}];
const wGaps=jumpW(GAPS,P=>{const b=P.moves.reduce((s,m)=>s+m,P.a);return `How far is it from <b>${P.a}</b> to <b>${b}</b>?<br><span class="dimline">Count on from ${P.a}. Stop at the next hundred on the way.</span>`;},
  (P,end)=>`Add up the jumps: <b>${P.moves.join(' + ')} = ${end-P.a}</b>.<br><span class="ok">${end} − ${P.a} = ${end-P.a}</span>`);

/* ---------- Chapter 2: add and subtract by place ---------- */
const wByPlaceAdd=addW([[342,235],[416,253],[530,264]]);
const wByPlaceSub=subW([[578,235],[694,352],[865,431]]);
const wSubWays=waysW('785 − 342',443,[
  {label:'By place',fig:byPlace(['700 − 300 = <b>400</b>','80 − 40 = <b>40</b>','5 − 2 = <b>3</b>','400 + 40 + 3 = <b>443</b>']),say:'Take away the hundreds, the tens, and the ones. Then put the parts back together.'},
  {label:'Count back',fig:jumps(785,[-300,-40,-2]),say:'Start at 785. Jump back 3 hundreds, then 4 tens, then 2 ones. You land on 443.'},
  {label:'Count on',fig:jumps(342,[400,40,3]),say:'Start at 342 and count on to 785. The jumps are 400, 40, and 3: 400 + 40 + 3 = 443.'},
]);

/* ---------- Chapter 3: make a new ten or hundred ---------- */
const wNewTen=addW([[347,125],[268,217],[456,38]]);
/* add ones and tens, and trade 10 of them for 1 of the next place */
function wTradeUp(el){
  const q=Q(el);let h,t,o,said;
  const reset=()=>{h=['a','a'];t=cellsOf([7,'a']);o=cellsOf([6,'a']);said='';};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-po>+ 1 one</button><button type="button" class="ghost-btn" data-pt>+ 1 ten</button><button type="button" class="btn" data-mt>Trade 10 ones for a ten</button><button type="button" class="btn" data-mh>Trade 10 tens for a hundred</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const H=h.length,T=t.length,O=o.length,n=100*H+10*T+O;
    q('f').innerHTML=mat([{h,t,o}],`${H} hundreds, ${T} tens, and ${O} ones`,{h:5,t:10,o:10});
    q('po').disabled=O>=10||n>=999;q('pt').disabled=T>=10||n+10>999;q('mt').disabled=O<10;q('mh').disabled=T<10;
    q('r').innerHTML=`<b>${H} hundreds, ${T} tens, and ${O} ones</b> is ${H*100} + ${T*10} + ${O} = <b>${n}</b>.<br>`
      +(O>=10?'<span class="dimline">10 ones! Trade them for 1 ten.</span>':T>=10?'<span class="dimline">10 tens! Trade them for 1 hundred.</span>':said?`<span class="ok">${said}</span>`:'<span class="dimline">Add ones or tens until you have 10.</span>');
  };
  q('po').onclick=()=>{o=[...o,'a'];said='';draw();};
  q('pt').onclick=()=>{t=[...t,'a'];said='';draw();};
  q('mt').onclick=()=>{o=o.slice(10);t=[...t,'new'];said='10 ones became 1 ten. Same number, fewer blocks!';draw();};
  q('mh').onclick=()=>{t=t.slice(10);h=[...h,'new'];said='10 tens became 1 hundred. Same number, fewer blocks!';draw();};
  q('clr').onclick=()=>{reset();draw();};
  reset();draw();
}
const wNewHundred=addW([[263,152],[381,145],[574,62]]);

/* ---------- Chapter 4: add three-digit numbers ---------- */
const wBoth=addW([[367,258],[178,145],[459,376]]);
const S298=addStages(298,135);
const wAddWays=waysW('298 + 135',433,[
  {label:'Make a hundred',fig:jumps(298,[2,100,30,3]),say:'298 is close to 300. Jump 2 to get to 300. 135 is 2 and 133, so jump 133 more: 100, then 30, then 3.'},
  {label:'By place',fig:byPlace(['200 + 100 = <b>300</b>','90 + 30 = <b>120</b>','8 + 5 = <b>13</b>','300 + 120 + 13 = <b>433</b>']),say:'Add the hundreds, the tens, and the ones. Then add the parts.'},
  {label:'Blocks',fig:stageFig(298,135,S298,S298[S298.length-1]),say:'8 + 5 = 13 ones: make a new ten. 9 + 3 + 1 = 13 tens: make a new hundred. That’s 4 hundreds, 3 tens, and 3 ones.'},
]);

/* ---------- Chapter 5: subtract three-digit numbers ---------- */
const wBreakTen=subW([[352,128],[574,249],[690,315]],'t');
const wBreakHundred=subW([[527,253],[416,182],[635,271]],'h');
const THINK=[
  {a:645,b:328,hi:2,say:'Ones: 5 is less than 8, so <b>break a ten</b>. After that there are 3 tens, and that’s enough to take away 2 tens.'},
  {a:645,b:382,hi:1,say:'Ones: 5 is enough to take away 2. Tens: 4 is less than 8, so <b>break a hundred</b>.'},
  {a:645,b:321,hi:-1,say:'5 ones is enough for 1 one. 4 tens is enough for 2 tens. 6 hundreds is enough for 3 hundreds. <b>Nothing to break!</b>'},
  {a:503,b:498,hi:-1,say:'503 and 498 are very close. <b>Count on</b> instead: 498 + 2 = 500, and 3 more is 503. 2 + 3 = 5.'},
];
function wThink(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Problem',THINK.map(({a,b},i)=>[i,`${a} − ${b}`]))+`<div data-c></div><div class="wrow"><button type="button" class="btn" data-go>Show me</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b,hi,say}=THINK[p];press(el,p);
    q('c').innerHTML=pvChart([['',a],['−',b]],shown?hi:-1);
    q('go').hidden=shown;
    q('r').innerHTML=shown?`${say}<br><span class="ok"><b>${a} − ${b} = ${a-b}</b></span>`:'Look at each place. Will you need to break a ten? A hundred? Or are the numbers close?';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=true;draw();};
  draw();
}
const wBreakBoth=subW([[432,158],[523,268],[400,125]],'th');

/* ---------- quick-check figures ---------- */
const F={
  hops356:jumps(356,[200,10,3],3,true),
  b572:numBlocks(572),
  gap:numLine(390,410,{u:26,ls:'',end:true,lab:v=>v%10===0,pts:[{v:396,t:396},{v:402,cls:'b',t:402}],label:'A number line from 390 to 410 with dots at 396 and 402'}),
  books:apart(526,243),
  seats:mat([bl(687)],'687 in base-ten blocks'),
  cans:apart(238,145),
  m2135:mat([{h:cellsOf([2,'a']),t:cellsOf([13,'a']),o:cellsOf([5,'a'])}],'2 hundreds, 13 tens, and 5 ones'),
  zoo:apart(372,145),
  kids:mat([bl(463)],'463 in base-ten blocks'),
  balloons:mat([bl(436)],'436 in base-ten blocks'),
  pv423:pvChart([['',423],['−',167]]),
};

/* ---------- chapters ---------- */
const ICON={
  jump:'<path d="M2,50H62" stroke="#f3f6fb" stroke-width="3"/><path d="M6,48Q22,14 38,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><path d="M38,48Q46,32 54,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><text x="22" y="22" fill="#ffc93c" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">+100</text><text x="47" y="32" fill="#ffc93c" font-size="10" font-weight="700" text-anchor="middle" font-family="monospace">+10</text>',
  place:'<rect x="4" y="12" width="26" height="26" fill="#ffc93c" stroke="#0a2340"/><path d="M4,25h26M17,12v26" stroke="rgba(10,35,64,.4)"/><rect x="36" y="12" width="6" height="26" fill="#ffc93c" stroke="#0a2340"/><rect x="46" y="12" width="6" height="26" fill="#ffc93c" stroke="#0a2340"/><rect x="56" y="32" width="6" height="6" fill="#ffc93c" stroke="#0a2340"/><path d="M4,46H60" stroke="#f3f6fb" stroke-width="2.5"/><text x="32" y="60" fill="#f3f6fb" font-size="12" font-weight="700" text-anchor="middle" font-family="monospace">+ − by place</text>',
  newten:'<g fill="#ffc93c" stroke="#0a2340" stroke-width="1"><rect x="6" y="16" width="7" height="7"/><rect x="6" y="26" width="7" height="7"/><rect x="6" y="36" width="7" height="7"/><rect x="6" y="46" width="7" height="7"/><rect x="16" y="16" width="7" height="7"/><rect x="16" y="26" width="7" height="7"/><rect x="16" y="36" width="7" height="7"/><rect x="16" y="46" width="7" height="7"/></g><path d="M28,34h10m-4,-4l4,4l-4,4" stroke="#f3f6fb" stroke-width="2" fill="none"/><rect x="44" y="8" width="8" height="48" fill="#5fe0a8" stroke="#fff" stroke-width="2"/>',
  add3:'<rect x="4" y="8" width="22" height="22" fill="#ffc93c" stroke="#0a2340"/><rect x="4" y="34" width="22" height="22" fill="#7fe3ff" stroke="#0a2340"/><text x="34" y="37" fill="#f3f6fb" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">+</text><rect x="42" y="20" width="20" height="20" fill="#5fe0a8" stroke="#fff" stroke-width="2"/>',
  sub3:'<rect x="4" y="10" width="30" height="30" fill="#ffc93c" stroke="#0a2340"/><path d="M4,25h30M19,10v30" stroke="rgba(10,35,64,.4)"/><path d="M38,40h10m-4,-4l4,4l-4,4" stroke="#f3f6fb" stroke-width="2" fill="none"/><g fill="#5fe0a8" stroke="#0a2340" stroke-width="1"><rect x="52" y="10" width="4" height="30"/><rect x="58" y="10" width="4" height="30"/></g><path d="M2,56L36,6" stroke="#ff7b7b" stroke-width="3" stroke-linecap="round" opacity=".8"/>',
};
const CH=[
  {icon:'jump',title:'Count on and count back',lessons:'Lessons 1–3',blurb:'Jump by hundreds, tens, and ones, see which digit changes, and count on to find a difference.',steps:[
    {title:'Jump by hundreds, tens, and ones',widget:wHops,
      body:'<p>To add 132, you can jump <b>1 hundred</b>, then <b>3 tens</b>, then <b>2 ones</b>. To subtract, jump back the same way.</p><p>Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:569,fig:F.hops356,q:'Start at 356. Jump on 200, then 10, then 3. Where do you land?',
        misc:[[559,'You skipped the jump of 10. 356 + 200 = 556, then 556 + 10 = 566.'],[566,'Don’t forget the last jump of 3.'],[143,'These jumps go on, so add. Each jump takes you to a bigger number.']],
        explain:'356 + 200 = 556. 556 + 10 = 566. 566 + 3 = 569.'}},
    {title:'10 more, 100 more',widget:wMore,
      body:'<p>Add <b>10</b>, and only the <b>tens</b> digit goes up by 1. Add <b>100</b>, and only the <b>hundreds</b> digit goes up by 1.</p><p>Tap the buttons. Watch which digit changes.</p>',
      check:{kind:'num',answer:472,fig:F.b572,q:'What is 100 less than 572?',
        misc:[[562,'That’s 10 less. 100 less changes the hundreds digit.'],[672,'That’s 100 more. Less means go down.'],[571,'That’s 1 less. Take away a whole hundred.']],
        explain:'572 is 5 hundreds, 7 tens, and 2 ones. 100 less is 4 hundreds, 7 tens, and 2 ones: 472. Only the hundreds digit changes.'}},
    {title:'Count on to subtract',widget:wGaps,
      body:'<p>To find <b>403 − 196</b>, you can count on from 196 to 403. Stop at a hundred on the way, then add up the jumps.</p><p>Counting on is quick when the numbers are close, or near a hundred. Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:6,fig:F.gap,q:'What is 402 − 396? Count on from 396.',
        misc:[[798,'You added. The difference is how far apart the numbers are.'],[4,'396 to 400 is 4. Keep going to 402.'],[2,'400 to 402 is 2. Don’t forget 396 to 400.'],[194,'402 has only 2 ones, so you can’t flip them to do 6 − 2. Count on from 396 instead.']],
        explain:'396 to 400 is 4. 400 to 402 is 2. 4 + 2 = 6, so 402 − 396 = 6.'}}
  ]},
  {icon:'place',title:'Add and subtract by place',lessons:'Lesson 4',blurb:'Put hundreds with hundreds, tens with tens, and ones with ones, and find more than one way.',steps:[
    {title:'Hundreds with hundreds',widget:wByPlaceAdd,
      body:'<p>To add, put <b>hundreds with hundreds</b>, <b>tens with tens</b>, and <b>ones with ones</b>.</p><p>Pick a problem, then put the blocks together.</p>',
      check:{kind:'num',unit:'books',answer:769,fig:F.books,q:'A library has 526 picture books and 243 chapter books. How many books is that?',
        misc:[[283,'You subtracted. Put the two kinds of books together, so add.'],[7609,'7 hundreds, 6 tens, and 9 ones only needs three digits: one for each place.'],[569,'Add the hundreds too: 5 hundreds + 2 hundreds = 7 hundreds.']],
        explain:'Hundreds: 500 + 200 = 700. Tens: 20 + 40 = 60. Ones: 6 + 3 = 9. 526 + 243 = 769 books.'}},
    {title:'Take away by place',widget:wByPlaceSub,
      body:'<p>To subtract, take away the <b>ones</b>, the <b>tens</b>, and the <b>hundreds</b>.</p><p>Pick a problem, then take away each place.</p>',
      check:{kind:'num',unit:'seats',answer:235,fig:F.seats,q:'A theater has 687 seats. People sit in 452 of them. How many seats are empty?',
        misc:[[1139,'You added. Some seats are full, so the empty ones are fewer than 687. Subtract.'],[635,'You took away the tens and ones. Take away the 4 hundreds too.'],[287,'You took away the 4 hundreds. Take away the 5 tens and 2 ones too.']],
        explain:'Ones: 7 − 2 = 5. Tens: 8 − 5 = 3. Hundreds: 6 − 4 = 2. 687 − 452 = 235 empty seats.'}},
    {title:'Different ways',widget:wSubWays,
      body:'<p>There’s more than one way to subtract. You can take away by place, count back, or count on.</p><p>Tap each way for 785 − 342.</p>',
      check:{kind:'mc',stack:true,q:'Which one is a right way to find <b>563 − 241</b>?',
        choices:[{id:'a',label:'563 − 200 = 363, then 363 − 40 = 323, then 323 − 1 = 322'},{id:'b',label:'5 − 2 = 3, 6 − 4 = 2, 3 − 1 = 2, so it’s 3 + 2 + 2 = 7'},{id:'c',label:'563 − 200 = 363, then 363 − 4 = 359, then 359 − 1 = 358'}],answer:'a',
        why:{b:'Each digit keeps its place. 3 hundreds, 2 tens, and 2 ones is 322, not 7.',c:'The 4 in 241 is 4 tens, so take away 40, not 4.'},
        explain:'Take away 2 hundreds, then 4 tens, then 1 one: 563 − 241 = 322.'}}
  ]},
  {icon:'newten',title:'Make a new ten or hundred',lessons:'Lessons 6–8',blurb:'Trade 10 ones for a ten and 10 tens for a hundred when you add.',steps:[
    {title:'Make a new ten',widget:wNewTen,
      body:'<p>When the ones add up to <b>10 or more</b>, trade 10 ones for a <b>new ten</b>.</p><p>Pick a problem. Put the blocks together, then make a new ten.</p>',
      check:{kind:'num',unit:'cans',answer:383,fig:F.cans,q:'A school food drive got 238 cans on Monday and 145 cans on Tuesday. How many cans is that?',
        misc:[[373,'You didn’t count the new ten. 8 + 5 = 13 ones is 1 ten and 3 ones.'],[3713,'13 ones is 1 ten and 3 ones. Put the new ten with the other tens.'],[93,'You subtracted. The school got more cans, so add.']],
        explain:'Hundreds: 200 + 100 = 300. Tens: 30 + 40 = 70. Ones: 8 + 5 = 13, a new ten and 3 ones. 300 + 70 + 13 = 383 cans.'}},
    {title:'Trade up',widget:wTradeUp,
      body:'<p><b>10 ones</b> make a ten. <b>10 tens</b> make a hundred. Trading changes the blocks, not the number.</p><p>Add ones and tens. Trade when you get 10.</p>',
      check:{kind:'num',answer:335,fig:F.m2135,q:'What number do these blocks show?',
        misc:[[2135,'13 tens is 1 hundred and 3 tens. Trade 10 tens for a hundred.'],[235,'13 tens is 130, not 30. 200 + 130 + 5 = 335.']],
        explain:'2 hundreds, 13 tens, and 5 ones. Trade 10 tens for a hundred: 3 hundreds, 3 tens, and 5 ones. That’s 335.'}},
    {title:'Make a new hundred',widget:wNewHundred,
      body:'<p>When the tens add up to <b>10 or more</b>, trade 10 tens for a <b>new hundred</b>.</p><p>Pick a problem. Put the blocks together, then make a new hundred.</p>',
      check:{kind:'num',unit:'visitors',answer:517,fig:F.zoo,q:'A zoo had 372 visitors in the morning and 145 visitors in the afternoon. How many visitors is that?',
        misc:[[417,'You didn’t count the new hundred. 7 + 4 = 11 tens is 1 hundred and 1 ten.'],[4117,'11 tens is 1 hundred and 1 ten. Put the new hundred with the other hundreds.'],[227,'You subtracted. Put the morning and afternoon visitors together.']],
        explain:'Hundreds: 300 + 100 = 400. Tens: 70 + 40 = 110, a new hundred and 1 ten. Ones: 2 + 5 = 7. 400 + 110 + 7 = 517 visitors.'}}
  ]},
  {icon:'add3',title:'Add three-digit numbers',lessons:'Lessons 9–10',blurb:'Make a new ten and a new hundred in one problem, and pick the easiest way to add.',steps:[
    {title:'A new ten and a new hundred',widget:wBoth,
      body:'<p>Some problems need a <b>new ten</b> and a <b>new hundred</b>. Start with the ones. Count the new ten when you add the tens!</p><p>Pick a problem and make each trade.</p>',
      check:{kind:'mc',q:'Which one makes a new ten <b>and</b> a new hundred?',
        choices:[{id:'a',label:'365 + 247'},{id:'b',label:'365 + 224'},{id:'c',label:'365 + 182'}],answer:'a',
        why:{b:'Ones: 5 + 4 = 9. Tens: 6 + 2 = 8. No new ten, and no new hundred.',c:'Ones: 5 + 2 = 7, so no new ten. Tens: 6 + 8 = 14 makes only a new hundred.'},
        explain:'Ones: 5 + 7 = 12, a new ten. Tens: 6 + 4 + the new ten = 11 tens, a new hundred. 365 + 247 = 612.'}},
    {title:'Add your way',widget:wAddWays,
      body:'<p>You can add by place, with blocks, or by making a hundred first. Pick the way that makes it easiest.</p><p>Tap each way for 298 + 135.</p>',
      check:{kind:'num',answer:545,q:'What is 199 + 346? Hint: 199 is 1 away from 200.',
        misc:[[546,'You added 1 to 199 to make 200. Take that 1 from 346: 200 + 345.'],[147,'You subtracted. This is adding.'],[445,'By place: 90 + 40 = 130 and 9 + 6 = 15. Don’t lose the new hundred.']],
        explain:'Move 1 from 346 to 199: 200 + 345 = 545.'}}
  ]},
  {icon:'sub3',title:'Subtract three-digit numbers',lessons:'Lessons 12–16',blurb:'Break a ten or a hundred when you need to, and think before you subtract.',steps:[
    {title:'Break a ten',widget:wBreakTen,
      body:'<p>If there aren’t enough ones to take away, <b>break a ten</b> into 10 ones.</p><p>Pick a problem. Break a ten when you need to, then take away.</p>',
      check:{kind:'num',unit:'students',answer:225,fig:F.kids,q:'A school has 463 students. 238 students ride the bus. How many students don’t ride the bus?',
        misc:[[235,'463 has only 3 ones, so you can’t flip them to do 8 − 3. Break a ten: 13 − 8 = 5 ones, and 5 − 3 = 2 tens.'],[701,'You added. Some students ride the bus, so the rest are fewer than 463.']],
        explain:'Break a ten: 463 is 4 hundreds, 5 tens, and 13 ones. Ones: 13 − 8 = 5. Tens: 5 − 3 = 2. Hundreds: 4 − 2 = 2. 463 − 238 = 225 students.'}},
    {title:'Break a hundred',widget:wBreakHundred,
      body:'<p>If there aren’t enough tens to take away, <b>break a hundred</b> into 10 tens.</p><p>Pick a problem. Break a hundred when you need to, then take away.</p>',
      check:{kind:'num',unit:'balloons',answer:264,fig:F.balloons,q:'A party store had 436 balloons. It sold 172 balloons. How many balloons are left?',
        misc:[[344,'436 has only 3 tens, so you can’t flip them to do 7 − 3. Break a hundred: 13 − 7 = 6 tens.'],[364,'You broke a hundred, so there are only 3 hundreds left. 3 − 1 = 2 hundreds.'],[608,'You added. The store sold balloons, so there are fewer now.']],
        explain:'Break a hundred: 436 is 3 hundreds, 13 tens, and 6 ones. Ones: 6 − 2 = 4. Tens: 13 − 7 = 6. Hundreds: 3 − 1 = 2. 436 − 172 = 264 balloons.'}},
    {title:'Think before you subtract',widget:wThink,
      body:'<p>Before you subtract, look at each place. Are there enough ones? Enough tens? If the numbers are close, you can count on.</p><p>Pick a problem. Think, then tap Show me.</p>',
      check:{kind:'mc',q:'Which one needs you to <b>break a hundred</b>?',
        choices:[{id:'a',label:'734 − 291'},{id:'b',label:'734 − 218'},{id:'c',label:'734 − 212'}],answer:'a',
        why:{b:'734 has 4 ones, and 218 has 8 ones. That needs a ten broken, not a hundred.',c:'734 has enough ones, tens, and hundreds to take away 212. Nothing to break.'},
        explain:'734 has 3 tens, and 291 has 9 tens. Break a hundred into 10 tens: 13 tens. 734 − 291 = 443.'}},
    {title:'Break a ten and a hundred',widget:wBreakBoth,
      body:'<p>Some problems need you to break a <b>ten</b> and a <b>hundred</b>. Check the ones first, then the tens.</p><p>Pick a problem. In 400 − 125 there are no tens to break, so break a hundred first!</p>',
      check:{kind:'mc',q:'What do you need to break to find <b>423 − 167</b>?',fig:F.pv423,
        choices:[{id:'a',label:'A ten and a hundred'},{id:'b',label:'Just a ten'},{id:'c',label:'Nothing'}],answer:'a',
        why:{b:'After you break a ten, 423 has only 1 ten left. 167 has 6 tens, so break a hundred too.',c:'423 has 3 ones, and 167 has 7 ones. There aren’t enough ones.'},
        explain:'3 ones is less than 7, so break a ten: 1 ten and 13 ones. 1 ten is less than 6, so break a hundred: 11 tens. 423 − 167 = 256.'}}
  ]}
];
