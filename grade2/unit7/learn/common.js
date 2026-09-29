/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const PL=['hundreds','tens','ones'];
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
