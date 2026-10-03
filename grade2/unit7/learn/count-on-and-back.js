/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 1: Count on and count back. Its widgets and steps; loaded by count-on-and-back.html. */
/* One jump at a time on an open number line. problems: [{a, moves, label}]; intro(problem) shows before the first jump,
   done(problem, end) after the last. */
const jumpW=(problems,intro,done)=>el=>{
  /* jumpsMade: how many of the problem's jumps are drawn */
  const q=Q(el);let problemIndex=0,jumpsMade=0;
  el.innerHTML=seg('Problem',problems.map((problem,i)=>[i,problem.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const problem=problems[problemIndex],count=problem.moves.length;let at=problem.a;press(el,problemIndex);
    q('f').innerHTML=jumps(problem.a,problem.moves,jumpsMade);
    /* each jump so far as an equation */
    const lines=problem.moves.slice(0,jumpsMade).map(move=>{const eq=`${at} ${move>0?'+':'−'} ${Math.abs(move)} = ${at+move}`;at+=move;return `<b>${eq}</b>`;});
    q('go').textContent=jumpsMade<count?(jumpsMade?'Next jump':'Jump!'):'Start over';
    q('r').innerHTML=jumpsMade?lines.join('<br>')+(jumpsMade===count?'<br>'+done(problem,at):''):intro(problem);
  };
  el.addEventListener('click',e=>{const problemBtn=e.target.closest('[data-m]');if(problemBtn){problemIndex=+problemBtn.dataset.m;jumpsMade=0;draw();}});
  q('go').onclick=()=>{jumpsMade=jumpsMade<problems[problemIndex].moves.length?jumpsMade+1:0;draw();};
  draw();
};
const HOPS=[{a:245,moves:[100,30,2],label:'245 + 132'},{a:468,moves:[-200,-20,-5],label:'468 − 225'},{a:327,moves:[200,50],label:'327 + 250'}];
/* Count on or back by hundreds, then tens, then ones. */
const wHops=jumpW(HOPS,problem=>{const sum=problem.moves.reduce((total,move)=>total+move,0);return `${problem.label}: start at <b>${problem.a}</b>.<br><span class="dimline">${Math.abs(sum)} is ${partsOf(Math.abs(sum))}. Jump ${sum>0?'on':'back'} by hundreds, then tens, then ones.</span>`;},
  (problem,end)=>`<span class="ok">${problem.label} = ${end}</span>`);
/* + and − 10 or 100 (buttons), staying inside three-digit numbers and never going past a 9 or a 0: only one digit changes. */
function wMore(el){
  /* before: the number before the last change; change: how much it changed (0 before the first) */
  const q=Q(el);let n=347,before=null,change=0;
  const moves=[-100,-10,10,100];
  el.innerHTML=`<div data-c></div><div class="fig" data-f></div><div class="wrow">${moves.map(move=>`<button type="button" class="ghost-btn" data-add="${move}">${move>0?'+':'−'} ${Math.abs(move)}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* changed: the place that changed (0 hundreds, 1 tens; −1 before the first change) */
    const [hundreds,tens]=digits(n),changed=change?(Math.abs(change)===100?0:1):-1;
    q('c').innerHTML=pvChart([['',n]],changed);q('f').innerHTML=numBlocks(n);
    el.querySelectorAll('[data-add]').forEach(b=>{const move=+b.dataset.add;b.disabled=move===100?hundreds>=9:move===-100?hundreds<=1:move===10?tens>=9:tens<=0;});
    q('r').innerHTML=!change?'Tap a button. Which digit changes?'
      :`<b>${Math.abs(change)} ${change>0?'more':'less'} than ${before} is ${n}.</b><br><span class="dimline">Only the ${PL[changed]} digit changed: ${cnt(digits(before)[changed],changed)} to ${cnt(digits(n)[changed],changed)}.</span>`;
  };
  el.addEventListener('click',e=>{const moveBtn=e.target.closest('[data-add]');if(moveBtn&&!moveBtn.disabled){change=+moveBtn.dataset.add;before=n;n+=change;draw();}});
  draw();
}
const GAPS=[{a:196,moves:[4,200,3],label:'403 − 196'},{a:480,moves:[20,20],label:'520 − 480'},{a:350,moves:[50,200,10],label:'610 − 350'}];
/* Subtract by counting on from the smaller number, stopping at the next hundred. */
const wGaps=jumpW(GAPS,problem=>{const end=problem.moves.reduce((total,move)=>total+move,problem.a);return `How far is it from <b>${problem.a}</b> to <b>${end}</b>?<br><span class="dimline">Count on from ${problem.a}. Stop at the next hundred on the way.</span>`;},
  (problem,end)=>`Add up the jumps: <b>${problem.moves.join(' + ')} = ${end-problem.a}</b>.<br><span class="ok">${end} − ${problem.a} = ${end-problem.a}</span>`);
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
