/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 3: Jumps on the number line. Its widgets and steps; loaded by jumps.html. */
function wJump(el){
  const q=Q(el),st={s:26,n:5};let d=1;
  el.innerHTML=seg('Way',[[1,'Add: jump right'],[-1,'Subtract: jump left']])+`<div class="fig" data-f></div><div class="wrow">${stepper('s','Start')}${stepper('n','Jump')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {s,n}=st,e=s+d*n;press(el,d);q('s').textContent=s;q('n').textContent=n;
    q('f').innerHTML=line(15,40,{u:22,lab:v=>v%10===0,hops:[{a:s,b:e,t:sgn(d*n)}],pts:[{v:s,t:s},{v:e,cls:'b',t:e}],label:`A number line: start at ${s} and jump ${d>0?'right':'left'} ${n} to ${e}`});
    q('r').innerHTML=`Start at <b>${s}</b>. Jump <b>${n}</b> to the ${d>0?'right':'left'}. You land on <b>${e}</b>.<br><span class="ok"><b>${s} ${d>0?'+':'−'} ${n} = ${e}</b></span>`;
  };
  steppers(el,st,{s:[25,30],n:[1,9]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){d=+b.dataset.m;draw();}});
  draw();
}
/* match each picture to its equation */
const EQS=['18 + 7 = 25','25 − 7 = 18','18 + 5 = 23'],EQPICS=[
  {a:18,n:7,ok:0,why:{1:'The jump goes right, so it’s adding, not subtracting.',2:'Count the jump: from 18 to 25 is 7, not 5.'}},
  {a:25,n:-7,ok:1,why:{0:'The jump goes left, so it’s subtracting. It starts at 25.',2:'The jump starts at 25 and goes left.'}},
  {a:18,n:5,ok:2,why:{0:'The jump ends at 23, not 25. Count the jump: it’s 5.',1:'The jump goes right, so it’s adding.'}},
];
function wEquation(el){
  const q=Q(el);let p=0,e=null;
  el.innerHTML=seg('Picture',EQPICS.map((_,i)=>[i,`Picture ${i+1}`]))+`<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=EQPICS[p],b=P.a+P.n;press(el,p);
    q('f').innerHTML=line(15,30,{u:28,lab:v=>v%5===0||v===P.a||v===b,hops:[{a:P.a,b,t:Math.abs(P.n)}],pts:[{v:P.a},{v:b,cls:'b'}],label:`A jump from ${P.a} to ${b}`});
    q('c').innerHTML=EQS.map((t,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}">${t}</button>`).join('');
    q('r').innerHTML=e===null?'Which equation matches the jump? Where does it start? Which way does it go?'
      :e===P.ok?`<span class="ok">Yes! Start at ${P.a}, jump ${Math.abs(P.n)} ${P.n>0?'right':'left'}, land on ${b}: <b>${EQS[P.ok]}</b>.</span>`
      :`<span class="no">Not that one.</span> ${P.why[e]}`;
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=null;draw();return;}const c=ev.target.closest('[data-e]');if(c){e=+c.dataset.e;draw();}});
  draw();
}
const DIFFS=[[27,33],[45,52],[38,61]];
function wDiff(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Numbers',DIFFS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=DIFFS[p],t=Math.ceil(a/10)*10,[lo,hi]=around(a,b),st=[t-a,b-t];press(el,p);
    q('f').innerHTML=line(lo,hi,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],hops:shown?hopsFrom(a,st).map((h,i)=>({...h,t:st[i]})):[],lab:v=>v%10===0,label:`A number line with dots at ${a} and ${b}`+(shown?`, jumps of ${st[0]} and ${st[1]} from ${a} to ${b}`:'')});
    q('go').textContent=shown?'Start over':`Jump from ${a} to ${b}`;
    q('r').innerHTML=shown?`${a} to ${t} is <b>${st[0]}</b>. ${t} to ${b} is <b>${st[1]}</b>. ${st[0]} + ${st[1]} = ${b-a}.<br><span class="ok">The difference is <b>${b-a}</b>: ${a} + ${b-a} = ${b}, and ${b} − ${a} = ${b-a}.</span>`
      :`The <b>difference</b> between ${a} and ${b} is how far apart they are.<br><span class="dimline">Jump from the smaller number to the bigger one. Stop at a ten on the way.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}
/* the quick checks' figures */
const F={
  back6:line(40,50,{u:34,hops:[{a:47,b:41,t:'−6'}],pts:[{v:47,t:47},{v:41,cls:'b',t:'?'}],label:'A number line: start at 47 and jump 6 to the left'}),
  eq52:line(40,55,{u:28,lab:v=>v%5===0||v===44||v===52,hops:[{a:52,b:44,t:8}],pts:[{v:52},{v:44,cls:'b'}],label:'A jump of 8 from 52 to 44'}),
  diff:line(40,60,{lab:v=>v%10===0,pts:[{v:46,t:46},{v:53,cls:'b',t:53}],label:'A number line with dots at 46 and 53'})
};
const STEPS=[
    {title:'Jump to add and subtract',widget:wJump,
      body:'<p>To <b>add</b>, start at the first number and jump <b>right</b>. To <b>subtract</b>, jump <b>left</b>.</p><p>Change the start and the jump. Try both ways.</p>',
      check:{kind:'num',answer:41,fig:F.back6,q:'Start at 47. Jump 6 to the left. Where do you land?',
        misc:[[53,'Left means subtract. You jumped right.'],[42,'Count the spaces, not the start: 46, 45, 44, 43, 42, 41.']],
        explain:'Jumping left subtracts. 47 − 6 = 41.'}},
    {title:'Equations and jumps',widget:wEquation,
      body:'<p>An <b>equation</b> tells the story of a jump: where it starts, how far it goes, and where it lands.</p><p>Pick a picture. Tap the equation that matches.</p>',
      check:{kind:'mc',q:'Which equation matches the jump?',fig:F.eq52,
        choices:[{id:'a',label:'52 − 8 = 44'},{id:'b',label:'52 + 8 = 60'},{id:'c',label:'44 − 8 = 36'}],answer:'a',
        why:{b:'The jump goes left, so it’s subtracting.',c:'The jump starts at 52, not 44.'},
        explain:'The jump starts at 52, goes 8 to the left, and lands on 44: 52 − 8 = 44.'}},
    {title:'The difference',widget:wDiff,
      body:'<p>The <b>difference</b> between two numbers is the length between them. Jump from one to the other and add up the jumps.</p><p>Pick two numbers, then jump.</p>',
      check:{kind:'num',answer:7,fig:F.diff,q:'What is the difference between 46 and 53?',
        misc:[[99,'You added. The difference is the space between them.'],[4,'46 to 50 is 4. Keep going to 53.'],[3,'50 to 53 is 3. Don’t forget 46 to 50.'],[13,'53 has only 3 ones. Jump 46 to 50 (4), then 50 to 53 (3).']],
        explain:'46 to 50 is 4. 50 to 53 is 3. 4 + 3 = 7, so the difference is 7.'}}
  ];
