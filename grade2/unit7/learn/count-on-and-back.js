/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 1: Count on and count back. Its widgets and steps; loaded by count-on-and-back.html. */
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
/* the quick checks' figures */
const F={
  hops356:jumps(356,[200,10,3],3,true),
  b572:numBlocks(572),
  gap:numLine(390,410,{u:26,ls:'',end:true,lab:v=>v%10===0,pts:[{v:396,t:396},{v:402,cls:'b',t:402}],label:'A number line from 390 to 410 with dots at 396 and 402'})
};
const STEPS=[
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
  ];
