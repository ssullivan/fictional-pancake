/* Learn Numbers to 1,000 (Grade 2 Unit 5), chapter 5: Compare and order. Its widgets and steps; loaded by compare-and-order.html. */
const PVC=[[436,463],[718,299],[652,658]];
/* Compare two numbers in a place-value chart, at the first place where their digits differ. */
function wPlaceCompare(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Numbers',PVC.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* at: the first place (0 hundreds, 1 tens, 2 ones) where the digits differ */
    const [a,b]=PVC[pairIndex],digitsA=digits(a),digitsB=digits(b),at=digitsA.findIndex((d,j)=>d!==digitsB[j]),placeName=['hundreds','tens','ones'][at];press(el,pairIndex);
    q('c').innerHTML=pvChart([['',a],['',b]],at);
    q('r').innerHTML=(at?`Same ${at===1?'hundreds':'hundreds and tens'}, so look at the ${placeName}.<br>`:'Start with the biggest place: hundreds.<br>')+`${digitsA[at]} ${placeName} ${digitsA[at]>digitsB[at]?'is more than':'is less than'} ${digitsB[at]} ${placeName}.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span>`;
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
  draw();
}
const ORDER=[506,560,65,605];
/* Tap the numbers from least to greatest; a wrong tap asks for a smaller one. */
function wOrder(el){
  /* placed: the numbers in order so far; miss: the last wrong tap */
  const q=Q(el),sorted=[...ORDER].sort((a,b)=>a-b);let placed=[],miss=null;
  el.innerHTML=`<p class="story">Tap the numbers from least to greatest.</p><div class="chips" data-c></div><p class="eq" data-s></p><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('c').innerHTML=ORDER.map(n=>`<button type="button" class="chip" data-e="${n}"${placed.includes(n)?' disabled aria-pressed="true"':''}>${n}</button>`).join('');
    q('s').textContent=placed.length?placed.join(', '):'';
    q('r').innerHTML=placed.length===ORDER.length?'<span class="ok">Least to greatest! 65 has no hundreds, so it’s least. Then 506, 560, 605.</span>'
      :miss!==null?`<span class="no">Not ${miss} yet.</span> Is there a number less than ${miss}? Look at the hundreds first.`
      :`Which number is ${placed.length?'next':'least'}?`;
  };
  el.addEventListener('click',e=>{const chip=e.target.closest('[data-e]');if(!chip||chip.disabled)return;const n=+chip.dataset.e;if(n===sorted[placed.length]){placed.push(n);miss=null;}else miss=n;draw();});
  q('clr').onclick=()=>{placed=[];miss=null;draw();};
  draw();
}
const STEPS=[
    {title:'Compare by place',widget:wPlaceCompare,
      body:'<p>To compare, start with the <b>hundreds</b>. If they’re the same, look at the <b>tens</b>. Then the <b>ones</b>.</p><p>Pick two numbers.</p>',
      check:{kind:'mc',q:'Which number is greatest?',
        choices:[{id:'a',label:'389'},{id:'b',label:'412'},{id:'c',label:'398'}],answer:'b',
        why:{a:'389 has only 3 hundreds. Is there a number with more hundreds?',c:'398 has big tens and ones, but only 3 hundreds. 412 has 4 hundreds.'},
        explain:'412 has 4 hundreds. The others have 3 hundreds, so 412 is greatest.'}},
    {title:'Put numbers in order',widget:wOrder,
      body:'<p>To put numbers in order, compare them place by place. <b>Least</b> is the smallest, and <b>greatest</b> is the biggest.</p>',
      check:{kind:'mc',q:'Which list goes from least to greatest?',
        choices:[{id:'a',label:'247, 274, 427'},{id:'b',label:'274, 247, 427'},{id:'c',label:'427, 274, 247'}],answer:'a',
        why:{b:'274 and 247 have the same hundreds. Compare the tens: 4 tens is less than 7 tens, so 247 comes first.',c:'That goes from greatest to least. Start with the smallest.'},
        explain:'247 and 274 both have 2 hundreds, and 4 tens < 7 tens, so 247 comes first. 427 has 4 hundreds, so it’s greatest.'}}
  ];
