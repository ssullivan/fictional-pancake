/* Learn Equal Groups (Grade 2 Unit 8), chapter 2: Odd and even. Its widgets and steps; loaded by odd-and-even.html. */
/* cube trains, one under the other: rows [[n, cls, extra]]; extra green cubes go on the end. The count is written after each. */
function trainsFig(rows,label){
  const longest=Math.max(...rows.map(([n,,extra=0])=>n+extra));
  const markup=rows.map(([n,cls,extra=0],i)=>{const y=8+i*46;return cubes(8,y,n,cls)+cubes(8+n*CUBE,y,extra,'x')+`<text class="lbl" x="${8+(n+extra)*CUBE+22}" y="${y+CUBE/2-1}">${n+extra}</text>`;}).join('');
  return svgWrap(8+longest*CUBE+46,rows.length*46+6,markup,label);
}
/* Tap 1 to 20 to see each one in pairs; tapped numbers stay colored, even gold and odd blue. */
function wOddEven(el){
  /* seen: the numbers tapped; picked: the last one (null before one is) */
  const q=Q(el),seen=new Set();let picked=null;
  el.innerHTML=`<div class="nums" role="group" aria-label="Numbers 1 to 20">${range(20).map(i=>`<button type="button" data-v="${i+1}">${i+1}</button>`).join('')}</div><div class="fig" data-f hidden></div><p class="readout" data-r></p>`;
  const draw=()=>{
    el.querySelectorAll('[data-v]').forEach(b=>{const v=+b.dataset.v;b.className=seen.has(v)?(v%2?'od':'ev'):'';b.setAttribute('aria-pressed',v===picked);});
    q('f').hidden=!picked;if(picked)q('f').innerHTML=pairsFig(picked);
    q('r').innerHTML=!picked?'Tap a number to put it in pairs.'
      :(picked%2?`<b>${picked} is odd.</b> ${pl(Math.floor(picked/2),'pair')} and 1 left over.`:`<b>${picked} is even.</b> ${pl(picked/2,'pair')}, none left over.`)
      +`<br><span class="dimline">${seen.size<5?'Tap more numbers.':'Even numbers are gold. Odd numbers are blue. Even, odd, even, odd…'}</span>`;
  };
  el.addEventListener('click',e=>{const numberBtn=e.target.closest('[data-v]');if(numberBtn){picked=+numberBtn.dataset.v;seen.add(picked);draw();}});
  draw();
}
/* Count by 2s on a number line from 0 or from 1, one hop at a time. */
function wSkip(el){
  /* start: 0 or 1; hops: how many hops so far */
  const q=Q(el);let start=0,hops=0;
  el.innerHTML=seg('Start',[[0,'Start at 0'],[1,'Start at 1']])+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Hop 2</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const landings=range(hops+1).map(i=>start+2*i);press(el,start);
    q('f').innerHTML=numLine(0,20,{u:24,big:10,ls:'',lab:()=>true,hops:range(hops).map(i=>({a:start+2*i,b:start+2*i+2,t:'+2'})),pts:landings.map(v=>({v})),
      label:`A number line from 0 to 20. Hops of 2 from ${start} land on ${landings.join(', ')}`});
    q('go').disabled=start+2*hops+2>20;
    q('r').innerHTML=`You say <b>${landings.join(', ')}</b>`+(hops<3?'<br><span class="dimline">Tap Hop 2.</span>'
      :start?'<br><span class="dimline">From 1, you land on the <b>odd</b> numbers: the ones you skipped from 0.</span>'
      :'<br><span class="dimline">From 0, you land on the <b>even</b> numbers. Each hop adds a pair.</span>');
  };
  el.addEventListener('click',e=>{const startBtn=e.target.closest('[data-m]');if(startBtn){start=+startBtn.dataset.m;hops=0;draw();}});
  q('go').onclick=()=>{hops++;draw();};
  q('clr').onclick=()=>{hops=0;draw();};
  draw();
}
/* cubes to share between two trains: [cubes, cubes in the top train to start] */
const FAIR=[[16,12],[11,8],[14,3],[9,7],[20,14],[13,2]];
/* Move cubes between two trains until they're as fair as they can be: equal for even, one apart for odd. */
function wFair(el){
  /* top: the cubes in the top train */
  const q=Q(el);let setIndex=0,top=FAIR[0][1];
  el.innerHTML=seg('Cubes',FAIR.map(([n],i)=>[i,`${n} cubes`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-dn>Move 1 down ↓</button><button type="button" class="ghost-btn" data-up>Move 1 up ↑</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=FAIR[setIndex][0],bottom=n-top,shorter=Math.min(top,bottom);press(el,setIndex);
    q('f').innerHTML=trainsFig([[top,'a'],[bottom,'b']],`Two cube trains: ${top} cubes and ${bottom} cubes`);
    q('dn').disabled=!top;q('up').disabled=!bottom;
    q('r').innerHTML=top===bottom?`<span class="ok"><b>${top} + ${bottom} = ${n}</b>. Two equal trains!</span><br><span class="dimline">${n} is <b>even</b>.</span>`
      :Math.abs(top-bottom)===1?`<b>${top} + ${bottom} = ${n}</b>. That’s as close as it gets: ${shorter} + ${shorter} + 1.<br><span class="dimline">${n} is <b>odd</b>. There’s always 1 extra cube.</span>`
      :`${top} + ${bottom} = ${n}. Not fair yet!<br><span class="dimline">Move cubes to make the trains the same length.</span>`;
  };
  el.addEventListener('click',e=>{const setBtn=e.target.closest('[data-m]');if(setBtn){setIndex=+setBtn.dataset.m;top=FAIR[setIndex][1];draw();}});
  q('dn').onclick=()=>{top--;draw();};
  q('up').onclick=()=>{top++;draw();};
  draw();
}
/* A number (a stepper) as a double, or a double and 1 more (the green cube). */
function wDoubles(el){
  const q=Q(el),values={n:14};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Number')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n}=values,half=Math.floor(n/2),odd=n%2;q('n').textContent=n;
    q('f').innerHTML=trainsFig([[half,'a',odd],[half,'b']],`Two trains of ${half} cubes`+(odd?', and 1 more cube':''));
    q('r').innerHTML=odd?`<b>${n} = ${half} + ${half} + 1</b><br><span class="dimline">A double and 1 more, so ${n} is <b>odd</b>.</span>`
      :`<b>${n} = ${half} + ${half}</b><br><span class="dimline">Two equal addends, so ${n} is <b>even</b>.</span>`;
  };
  steppers(el,values,{n:[2,20]},draw);draw();
}
/* the quick checks' figures */
const F={
  train16:trainsFig([[16,'a']],'A train of 16 cubes'),
  train11:trainsFig([[11,'a']],'A train of 11 cubes'),
  hop6:numLine(0,20,{u:24,big:10,ls:'',lab:()=>true,hops:[0,2,4].map(a=>({a,b:a+2,t:'+2'})),pts:[0,2,4,6].map(v=>({v})),label:'A number line from 0 to 20 with hops of 2 from 0 to 6'})
};
const STEPS=[
    {title:'Odd or even?',widget:wOddEven,
      body:'<p>A number is <b>even</b> if it makes pairs with none left over. A number is <b>odd</b> if 1 is left over.</p><p>Tap numbers to put them in pairs. Look for a pattern.</p>',
      check:{kind:'mc',q:'Which number is even?',
        choices:[{id:'9',label:'9'},{id:'15',label:'15'},{id:'16',label:'16'},{id:'11',label:'11'}],answer:'16',
        why:{9:'9 makes 4 pairs and 1 left over, so 9 is odd.',15:'15 makes 7 pairs and 1 left over, so 15 is odd.',11:'11 makes 5 pairs and 1 left over, so 11 is odd.'},
        explain:'16 makes 8 pairs with none left over, so 16 is even.'}},
    {title:'Count by 2s',widget:wSkip,
      body:'<p>Count by 2s from 0: 0, 2, 4, 6, 8. Each hop adds one more pair, so you land on the <b>even</b> numbers.</p><p>Tap Hop 2. Then try starting at 1.</p>',
      check:{kind:'mc',fig:F.hop6,q:'Han counts by 2s, starting at 0. Which number will Han say?',
        choices:[{id:'a',label:'15'},{id:'b',label:'18'},{id:'c',label:'9'}],answer:'b',
        why:{a:'From 0, hops of 2 land on even numbers: 12, 14, 16. 15 is skipped.',c:'From 0, hops of 2 land on 6, 8, 10. 9 is skipped. It’s odd.'},
        explain:'0, 2, 4, 6, 8, 10, 12, 14, 16, 18. Han says 18, an even number.'}},
    {title:'Make two equal trains',widget:wFair,
      body:'<p>Snap cubes into 2 trains. If the trains can be the <b>same length</b>, the number is even. If 1 cube is always extra, it’s odd.</p><p>Pick a number. Move cubes until the trains are as fair as they can be.</p>',
      check:{kind:'num',unit:'cubes',answer:8,fig:F.train16,q:'Elena breaks this train of 16 cubes into 2 trains that are the same length. How many cubes are in each train?',
        misc:[[16,'That’s all the cubes. Make 2 equal trains.'],[32,'That’s 16 + 16. Split 16 into 2 equal trains.'],[7,'7 + 7 = 14. You need 16.'],[9,'9 + 9 = 18. That’s too many.']],
        explain:'8 + 8 = 16, so each train has 8 cubes. 16 is even.'}},
    {title:'A double and 1 more',widget:wDoubles,
      body:'<p>An even number is a <b>double</b>: two equal addends, like 7 + 7 = 14.</p><p>An odd number is a double and <b>1 more</b>, like 7 + 7 + 1 = 15.</p><p>Change the number. Watch for the green cube.</p>',
      check:{kind:'mc',fig:F.train11,q:'Which one shows 11 as a double and 1 more?',
        choices:[{id:'a',label:'11 = 5 + 5 + 1'},{id:'b',label:'11 = 6 + 6'},{id:'c',label:'11 = 10 + 1'}],answer:'a',
        why:{b:'6 + 6 = 12, not 11.',c:'10 + 1 = 11, but 10 and 1 aren’t a double. A double is the same number twice, like 5 + 5.'},
        explain:'5 + 5 is a double, and 1 more makes 11. So 11 is odd.'}}
  ];
