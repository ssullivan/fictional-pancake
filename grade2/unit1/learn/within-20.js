/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 1: Add and subtract within 20. Its widgets and steps; loaded by within-20.html. */
function wAdd(el){
  const q=Q(el),st={a:6,b:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('a','Yellow')}${stepper('b','Blue')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st;q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=tenFrames(cellsOf([a,'a'],[b,'b']),{label:`${a} yellow and ${b} blue counters`});
    q('r').innerHTML=`<b>${a} + ${b} = ${a+b}</b>`+(a+b>10?`<br><span class="dimline">The first frame is full: 10 and ${a+b-10} more make ${a+b}.</span>`:a+b===10?`<br><span class="ok">That fills a whole frame: 10!</span>`:'');
  };
  steppers(el,st,{a:[0,10],b:[0,10]},draw);draw();
}
function wTake(el){
  const q=Q(el),N=14,out=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([N,'a']),{out,label:`${N} counters. Tap counters to take them away.`});
    q('r').innerHTML=`<b>${N} − ${out.size} = ${N-out.size}</b>`+(out.size?`<br><span class="dimline">You took away ${out.size}. ${N-out.size} are left.</span>`:'<br><span class="dimline">Tap a counter to take it away.</span>');
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(!g)return;const i=+g.dataset.i;out.has(i)?out.delete(i):out.add(i);draw();});
  q('clr').onclick=()=>{out.clear();draw();};
  draw();
}
function wFamily(el){
  const q=Q(el),PAIRS=[[8,5],[6,9],[4,7]];let p=0,f=0;
  el.innerHTML=`<div class="fig" data-f></div><div data-eq></div><div class="wrow"><button type="button" class="ghost-btn" data-new>New cubes</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],t=a+b,facts=[[`${a} + ${b} = ${t}`,''],[`${b} + ${a} = ${t}`,''],[`${t} − ${b} = ${a}`,'b'],[`${t} − ${a} = ${b}`,'a']];
    q('eq').innerHTML=seg('Facts',facts.map(([s],i)=>[i,s]));press(el,f);
    const off=facts[f][1];
    q('f').innerHTML=svgWrap(t*CUBE+8,CUBE+8,cubes(4,4,a,'a'+(off==='a'?' off':''))+cubes(4+a*CUBE,4,b,'b'+(off==='b'?' off':'')),`${a} yellow cubes and ${b} blue cubes`);
    q('r').innerHTML=f<2?`Put the yellow and blue cubes together: <b>${facts[f][0]}</b>.`:`Start with all ${t} and take away the ${off==='a'?'yellow':'blue'} ones: <b>${facts[f][0]}</b>.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){f=+b.dataset.m;draw();}});
  q('new').onclick=()=>{p=(p+1)%PAIRS.length;f=0;draw();};
  draw();
}
function wMissing(el){
  const q=Q(el),A=8,T=13;let b=0;
  el.innerHTML=`<p class="eq">${A} + <b class="q">?</b> = ${T}</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([A,'a'],[b,'b']),{tap:true,label:`${A} yellow counters. Tap empty squares to add blue counters.`});
    q('r').innerHTML=b===T-A?`<span class="ok"><b>${A} + ${b} = ${T}</b>. The missing number is ${b}.</span>`:`<b>${A} + ${b} = ${A+b}</b><br><span class="dimline">${A+b<T?`Tap empty squares to add more. You need ${T} in all.`:`That’s more than ${T}. Tap a blue counter to take it back.`}</span>`;
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(!g)return;const i=+g.dataset.i;if(i>=A+b)b++;else if(i>=A)b--;draw();});
  q('clr').onclick=()=>{b=0;draw();};
  draw();
}
/* this chapter's quick-check figures (common.js has the shared ones) */
Object.assign(F,{
  add84:tenFrames(cellsOf([8,'a'],[4,'b']),{label:'8 yellow and 4 blue counters'})
});
const STEPS=[
    {title:'Put together to add',widget:wAdd,
      body:'<p>When you put two groups together, you <b>add</b>.</p><p>Use the + and − buttons to change each group. Watch the first frame fill up to 10.</p>',
      check:{kind:'num',answer:12,fig:F.add84,q:'How many counters are there in all?',
        misc:[[8,'That’s only the yellow counters. Count the blue ones too.'],[4,'That’s only the blue counters. Count the yellow ones too.']],
        explain:'8 + 4 = 12. The first frame has 10, and 2 more makes 12.'}},
    {title:'Take away to subtract',widget:wTake,
      body:'<p>When you take some away, you <b>subtract</b>. The number left is smaller.</p><p>Tap counters to take them away.</p>',
      check:{kind:'num',unit:'stickers',answer:9,q:'Mai has 15 stickers. Mai gives 6 stickers to Diego. How many stickers does Mai have now?',
        misc:[[21,'You added. Mai gave stickers away, so Mai has fewer now.'],[6,'That’s how many Mai gave away. How many are left?']],
        explain:'15 − 6 = 9. Take away 5 to get to 10, then 1 more to get to 9.'}},
    {title:'One picture, four facts',widget:wFamily,
      body:'<p>The same cubes show an addition fact and a subtraction fact. 8 + 5 = 13 and 13 − 5 = 8 use the same three numbers.</p><p>Tap each fact to see it in the cubes.</p>',
      check:{kind:'mc',q:'Which fact goes with 9 + 6 = 15?',
        choices:[{id:'a',label:'15 − 6 = 9'},{id:'b',label:'9 − 6 = 3'},{id:'c',label:'15 + 6 = 21'},{id:'d',label:'6 + 3 = 9'}],answer:'a',
        why:{b:'This fact uses 3. The facts that go together use only 9, 6, and 15.',c:'15 + 6 makes a new number, 21. The facts that go together use only 9, 6, and 15.',d:'This fact uses 3. The facts that go together use only 9, 6, and 15.'},
        explain:'9 + 6 = 15, 6 + 9 = 15, 15 − 6 = 9, and 15 − 9 = 6 all use 9, 6, and 15.'}},
    {title:'Find the missing number',widget:wMissing,
      body:'<p>Sometimes you know the total but not one part. <b>8 + ? = 13</b> asks: what do you add to 8 to make 13?</p><p>Tap empty squares to add blue counters until there are 13.</p>',
      check:{kind:'num',answer:9,q:'What number makes this true? <b>7 + ? = 16</b>',
        misc:[[23,'That’s 7 + 16. Find the number you add to 7 to make 16.'],[16,'16 is the total. What do you add to 7 to get to 16?']],
        explain:'7 + 3 = 10, and 10 + 6 = 16. 3 + 6 = 9, so 7 + 9 = 16.'}}
  ];
