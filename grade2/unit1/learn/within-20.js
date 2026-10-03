/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 1: Add and subtract within 20. Its widgets and steps; loaded by within-20.html. */
/* Put two groups of counters together in ten-frames (a stepper for each group). */
function wAdd(el){
  /* the steppers' values: a yellow counters, b blue */
  const q=Q(el),values={a:6,b:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('a','Yellow')}${stepper('b','Blue')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=values;q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=tenFrames(cellsOf([a,'a'],[b,'b']),{label:`${a} yellow and ${b} blue counters`});
    q('r').innerHTML=`<b>${a} + ${b} = ${a+b}</b>`+(a+b>10?`<br><span class="dimline">The first frame is full: 10 and ${a+b-10} more make ${a+b}.</span>`:a+b===10?`<br><span class="ok">That fills a whole frame: 10!</span>`:'');
  };
  steppers(el,values,{a:[0,10],b:[0,10]},draw);draw();
}
/* Tap counters to take them away (tap again to put one back). */
function wTake(el){
  /* START: how many counters there are; taken: the ones tapped away */
  const q=Q(el),START=14,taken=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([START,'a']),{out:taken,label:`${START} counters. Tap counters to take them away.`});
    q('r').innerHTML=`<b>${START} − ${taken.size} = ${START-taken.size}</b>`+(taken.size?`<br><span class="dimline">You took away ${taken.size}. ${START-taken.size} are left.</span>`:'<br><span class="dimline">Tap a counter to take it away.</span>');
  };
  q('f').addEventListener('click',e=>{const counter=e.target.closest('[data-i]');if(!counter)return;const i=+counter.dataset.i;taken.has(i)?taken.delete(i):taken.add(i);draw();});
  q('clr').onclick=()=>{taken.clear();draw();};
  draw();
}
/* One picture, four facts: tap a fact to see it in the cubes (subtracting dims the cubes taken away). */
function wFamily(el){
  const q=Q(el),PAIRS=[[8,5],[6,9],[4,7]];let pairIndex=0,factIndex=0;
  el.innerHTML=`<div class="fig" data-f></div><div data-eq></div><div class="wrow"><button type="button" class="ghost-btn" data-new>New cubes</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* each fact, and which color it takes away ('' for the adding facts) */
    const [a,b]=PAIRS[pairIndex],total=a+b,facts=[[`${a} + ${b} = ${total}`,''],[`${b} + ${a} = ${total}`,''],[`${total} − ${b} = ${a}`,'b'],[`${total} − ${a} = ${b}`,'a']];
    q('eq').innerHTML=seg('Facts',facts.map(([fact],i)=>[i,fact]));press(el,factIndex);
    const off=facts[factIndex][1];
    q('f').innerHTML=svgWrap(total*CUBE+8,CUBE+8,cubes(4,4,a,'a'+(off==='a'?' off':''))+cubes(4+a*CUBE,4,b,'b'+(off==='b'?' off':'')),`${a} yellow cubes and ${b} blue cubes`);
    q('r').innerHTML=factIndex<2?`Put the yellow and blue cubes together: <b>${facts[factIndex][0]}</b>.`:`Start with all ${total} and take away the ${off==='a'?'yellow':'blue'} ones: <b>${facts[factIndex][0]}</b>.`;
  };
  el.addEventListener('click',e=>{const factBtn=e.target.closest('[data-m]');if(factBtn){factIndex=+factBtn.dataset.m;draw();}});
  q('new').onclick=()=>{pairIndex=(pairIndex+1)%PAIRS.length;factIndex=0;draw();};
  draw();
}
/* Find the missing number in 8 + ? = 13: tap empty squares to add blue counters (tap a blue one to take it back). */
function wMissing(el){
  /* START + added = TOTAL when done */
  const q=Q(el),START=8,TOTAL=13;let added=0;
  el.innerHTML=`<p class="eq">${START} + <b class="q">?</b> = ${TOTAL}</p><div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=tenFrames(cellsOf([START,'a'],[added,'b']),{tap:true,label:`${START} yellow counters. Tap empty squares to add blue counters.`});
    q('r').innerHTML=added===TOTAL-START?`<span class="ok"><b>${START} + ${added} = ${TOTAL}</b>. The missing number is ${added}.</span>`:`<b>${START} + ${added} = ${START+added}</b><br><span class="dimline">${START+added<TOTAL?`Tap empty squares to add more. You need ${TOTAL} in all.`:`That’s more than ${TOTAL}. Tap a blue counter to take it back.`}</span>`;
  };
  /* a tap on an empty square adds one; a tap on a blue counter takes one back */
  q('f').addEventListener('click',e=>{const square=e.target.closest('[data-i]');if(!square)return;const i=+square.dataset.i;if(i>=START+added)added++;else if(i>=START)added--;draw();});
  q('clr').onclick=()=>{added=0;draw();};
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
