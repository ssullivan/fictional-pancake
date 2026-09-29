/* Learn Adding and Subtracting within 100 (Grade 2 Unit 2), chapter 2: Subtract your way. Its widgets and steps; loaded by subtract-your-way.html. */
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
/* the quick checks' figures */
const F={
  han67:bpic([67],'67 marbles in blocks: 6 tens and 7 ones'),
  b52:bpic([52],'52 in blocks: 5 tens and 2 ones')
};
const STEPS=[
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
  ];
