/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 4: Jump by tens and ones. Its widgets and steps; loaded by tens-and-ones.html. */
/* One jump at a time. list: [{a, steps, label}]; steps are signed (+10, +10, +3, …). */
const jumper=(list,say)=>el=>{
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Problem',list.map((x,i)=>[i,x.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=list[p],hs=hopsFrom(P.a,P.steps),end=P.a+P.steps.reduce((s,n)=>s+n,0),at=k?hs[k-1].b:P.a,[lo,hi]=around(P.a,end);press(el,p);
    q('f').innerHTML=line(lo,hi,{lab:v=>v%10===0,hops:hs.slice(0,k),pts:[{v:P.a,t:P.a},...(k?[{v:at,cls:'b',t:at}]:[])],label:`${P.label} on a number line`+(k?`: jumps ${hs.slice(0,k).map(h=>h.t).join(', ')} to ${at}`:'')});
    q('go').textContent=k<hs.length?(k?'Next jump':'Jump!'):'Start over';
    q('r').innerHTML=!k?say(P):`${hs.slice(0,k).map(h=>`<b>${h.a} ${h.t[0]} ${h.t.slice(1)} = ${h.b}</b>`).join('<br>')}`+(k===hs.length?`<br><span class="ok">${P.label} = ${end}</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  q('go').onclick=()=>{k=k<list[p].steps.length?k+1:0;draw();};
  draw();
};
const TENS=[
  {a:34,steps:[10,10,3],label:'34 + 23'},
  {a:56,steps:[10,10,10,1],label:'56 + 31'},
  {a:78,steps:[-10,-10,-5],label:'78 − 25'},
];
const TOTEN=[
  {a:28,steps:[2,5],label:'28 + 7'},
  {a:57,steps:[3,5],label:'57 + 8'},
  {a:43,steps:[-3,-3],label:'43 − 6'},
  {a:62,steps:[-2,-3],label:'62 − 5'},
];
/* the quick checks' figures */
const F={
  tens45:line(40,80,{lab:v=>v%10===0,hops:hopsFrom(45,[10,10,10,2]),pts:[{v:45,t:45},{v:77,cls:'b',t:'?'}],label:'Jumps from 45: plus 10, plus 10, plus 10, plus 2'}),
  toTen36:line(30,50,{lab:v=>v%10===0,hops:hopsFrom(36,[4,4]),pts:[{v:36,t:36},{v:44,cls:'b',t:'?'}],label:'36 plus 8: jumps of 4 and 4 from 36'})
};
const STEPS=[
    {title:'Tens, then ones',widget:jumper(TENS,P=>`${P.label}: start at <b>${P.a}</b>. <span class="dimline">Jump by tens first, then the ones.</span>`),
      body:'<p>To add or subtract a number like 23, jump by <b>tens</b> first: 10, 10. Then jump the <b>ones</b>: 3.</p><p>Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:77,fig:F.tens45,q:'What is 45 + 32? Where do the jumps land?',
        misc:[[75,'Don’t forget the last jump of 2.'],[65,'32 has 3 tens. Count the jumps of 10: 3 of them.'],[50,'Each big jump is 10, not 1.']],
        explain:'45 + 10 = 55, + 10 = 65, + 10 = 75, + 2 = 77. So 45 + 32 = 77.'}},
    {title:'Jump to a ten',widget:jumper(TOTEN,P=>{const up=P.steps[0]>0;return `${P.label}: start at <b>${P.a}</b>.<br><span class="dimline">First jump ${up?'up':'back'} to ${P.a+P.steps[0]}. Then jump the rest.</span>`;}),
      body:'<p>A <b>ten</b> is an easy place to stop. 28 + 7: jump 2 to get to 30, then 5 more. 7 is 2 and 5.</p><p>Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:44,fig:F.toTen36,q:'What is 36 + 8?',
        misc:[[48,'You jumped 4 to 40, then 8 more. Only 4 are left to jump: 8 is 4 and 4.'],[28,'Adding means jumping right.'],[43,'Count the spaces: from 40, 4 more is 44.']],
        explain:'36 + 4 = 40. 8 is 4 and 4, so 4 more: 40 + 4 = 44.'}}
  ];
