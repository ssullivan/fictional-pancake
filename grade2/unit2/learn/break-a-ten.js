/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2), chapter 3: Break a ten. Its widgets and steps; loaded by break-a-ten.html. */
/* one number as blocks, t tens and u ones (u can be more than 9 after breaking a ten) */
const tu=(t,u,label=`${t} tens and ${u} ones`)=>bpic([{t,u}],label);
const TRADES=[[42,17],[53,26],[71,35]];
/* "1 ten" or "3 tens" */
const tens=n=>`${n} ten${n===1?'':'s'}`;
/* Take away with blocks, breaking a ten when there aren't enough ones: buttons break a ten and take away tens and ones. */
function wTrade(el){
  /* broke: a ten is broken into ones; tensOut and onesOut: how many are crossed out */
  const q=Q(el);let problemIndex=0,broke=false,tensOut=0,onesOut=0;
  el.innerHTML=seg('Numbers',TRADES.map(([a,b],i)=>[i,`${a} − ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-brk>Break a ten</button><button type="button" class="ghost-btn" data-bt>Take away 1 ten</button><button type="button" class="ghost-btn" data-bu>Take away 1 one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* tensNow and onesNow: the blocks after any break; gone: how much is taken away */
    const [a,b]=TRADES[problemIndex],tensNow=tensOf(a)-(broke?1:0),onesNow=a%10+(broke?10:0),gone=10*tensOut+onesOut;press(el,problemIndex);
    q('f').innerHTML=bpic([{t:tensNow,u:onesNow,opt:{traded:broke?10:0,outT:tensOut,outO:onesOut}}],`${tensNow} tens and ${onesNow} ones, with ${tensOut} tens and ${onesOut} ones crossed out`);
    q('brk').disabled=broke;q('bt').disabled=tensOut>=tensNow;q('bu').disabled=onesOut>=onesNow;
    q('r').innerHTML=gone===b?`<span class="ok">You took away ${b}. <b>${a} − ${b} = ${a-b}</b>.</span>`:gone>b||tensOut>tensOf(b)||onesOut>b%10?`That’s more than ${b}. <span class="dimline">Start over. ${b} is ${tens(tensOf(b))} and ${b%10} ones.</span>`
      :!broke&&onesOut>=onesNow?`<b>Only ${a%10} ones!</b> <span class="dimline">You need to take away ${b%10} ones. Break a ten into 10 ones.</span>`
      :`Take away <b>${tens(tensOf(b))} and ${b%10} ones</b>.<br><span class="dimline">${broke?`${a} is now ${tens(tensNow)} and ${onesNow} ones. The green ones came from the broken ten.`:`${a} has only ${a%10} ones. Will you need to break a ten?`}</span>`;
  };
  q('brk').onclick=()=>{broke=true;draw();};
  q('bt').onclick=()=>{tensOut++;draw();};q('bu').onclick=()=>{onesOut++;draw();};
  q('clr').onclick=()=>{broke=false;tensOut=onesOut=0;draw();};
  el.addEventListener('click',e=>{const problemBtn=e.target.closest('[data-m]');if(problemBtn){problemIndex=+problemBtn.dataset.m;broke=false;tensOut=onesOut=0;draw();}});
  draw();
}
const SHOWS=[45,62,31];
/* Show a number another way: break a ten into 10 ones (up to twice), and put them back. */
function wShow(el){
  /* broken: how many tens are broken into ones */
  const q=Q(el);let numberIndex=0,broken=0;
  el.innerHTML=seg('Number',SHOWS.map((n,i)=>[i,n]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-brk>Break a ten</button><button type="button" class="ghost-btn" data-back>Put 10 ones back</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=SHOWS[numberIndex],tensNow=tensOf(n)-broken,onesNow=n%10+10*broken;press(el,numberIndex);
    q('f').innerHTML=bpic([{t:tensNow,u:onesNow,opt:{traded:10*broken}}],`${tensNow} tens and ${onesNow} ones`);
    q('brk').disabled=tensNow<1||broken>=2;q('back').disabled=!broken;
    q('r').innerHTML=`<b>${tens(tensNow)} and ${onesNow} ones</b>: ${10*tensNow} + ${onesNow} = ${n}<br><span class="dimline">${broken?'Still '+n+'! Breaking a ten changes how it looks, not how many.':'Break a ten to show it another way.'}</span>`;
  };
  q('brk').onclick=()=>{broken++;draw();};q('back').onclick=()=>{broken--;draw();};
  el.addEventListener('click',e=>{const numberBtn=e.target.closest('[data-m]');if(numberBtn){numberIndex=+numberBtn.dataset.m;broken=0;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  b54:bpic([54],'54 in blocks: 5 tens and 4 ones')
};
const STEPS=[
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
  ];
