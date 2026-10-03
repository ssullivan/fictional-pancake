/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 1: Multiples. Its widgets and steps; loaded by multiples.html. */
/* the numbers to count by */
const HOPN=[2,3,4,5,6,7,8,9];
/* Hop by n on a number line; a stepper adds hops, and each landing is a multiple of n. */
function wHops(el){
  const q=Q(el),values={hops:0};let n=3;
  el.innerHTML=seg('Count by',HOPN.map(v=>[v,`by ${v}s`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('hops','Hops')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const hops=values.hops;press(el,n);q('hops').textContent=hops;
    q('f').innerHTML=hopLine(n,10*n,hops);
    q('r').innerHTML=hops?`<b>${hops} × ${n} = ${hops*n}</b>, so ${hops*n} is a multiple of ${n}.<br><span class="dimline">Multiples of ${n} so far: ${list(range(hops).map(i=>(i+1)*n))}</span>`
      :`Start at 0. Tap + to hop by ${n}s.`;
  };
  steppers(el,values,{hops:[0,10]},draw);
  el.addEventListener('click',e=>{const countBtn=e.target.closest('[data-m]');if(countBtn){n=+countBtn.dataset.m;values.hops=0;draw();}});
  draw();
}
/* numbers to count by (n), and the numbers (t) to ask about */
const TARGET=[{n:4,t:[18,20,30]},{n:6,t:[34,36,40]},{n:7,t:[27,28,45]},{n:9,t:[45,50,54]}];
/* Is t a multiple of n? Hops of n either land on t or jump over it. */
function wIsMultiple(el){
  /* target: the number asked about (null before a question is tapped) */
  const q=Q(el);let countIndex=0,target=null;
  el.innerHTML=seg('Count by',TARGET.map(({n},i)=>[i,`by ${n}s`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n,t:targets}=TARGET[countIndex];press(el,countIndex);
    q('c').innerHTML=targets.map(v=>`<button type="button" class="chip" data-t="${v}" aria-pressed="${v===target}">Is ${v} a multiple of ${n}?</button>`).join('');
    if(target===null){q('f').innerHTML=hopLine(n,10*n,10);q('r').innerHTML=`Tap a question. Do the hops of ${n} land on the number?`;return;}
    /* hops: whole hops of n that fit in the target; when they don't land on it, one more hops past it */
    const hops=Math.floor(target/n),lands=target%n===0;
    q('f').innerHTML=hopLine(n,(hops+1)*n,lands?hops:hops+1,{mark:target});
    q('r').innerHTML=lands?`<span class="ok">Yes! ${hops} hops of ${n} land right on ${target}: <b>${hops} × ${n} = ${target}</b>.</span><br>${target} is a multiple of ${n}.`
      :`<span class="no">No.</span> Hops of ${n} land on <b>${hops*n}</b> and <b>${(hops+1)*n}</b>, and ${target} is in between.<br><span class="dimline">${target} is not a multiple of ${n}.</span>`;
  };
  el.addEventListener('click',e=>{
    const countBtn=e.target.closest('[data-m]');if(countBtn){countIndex=+countBtn.dataset.m;target=null;draw();return;}
    const question=e.target.closest('[data-t]');if(question){target=+question.dataset.t;draw();}
  });
  draw();
}
/* the quick checks' figures */
const F={
  six:hopLine(6,36,3,{label:'Number line counting by 6s: 6, 12, 18'})
};
const STEPS=[
    {title:'Skip-count to find multiples',widget:wHops,
      body:'<p>Counting by 3s from 0 lands on 3, 6, 9, 12, … These are the <b>multiples</b> of 3. Each one is 3 times a whole number: 4 × 3 = 12.</p><p>Pick a number, then hop along the number line.</p>',
      check:{kind:'num',answer:30,fig:F.six,q:'Kiran counts by 6s: 6, 12, 18, … What is the 5th number Kiran says?',
        misc:[[11,'You added 5 + 6. Five hops of 6 is 5 × 6.'],[36,'That’s the 6th number. Count them: 6, 12, 18, 24, 30.'],[24,'That’s the 4th number. Hop one more time.']],
        explain:'6, 12, 18, 24, 30. The 5th multiple of 6 is 5 × 6 = 30.'}},
    {title:'Is it a multiple?',widget:wIsMultiple,
      body:'<p>A number is a multiple of 4 if hops of 4 from 0 land right on it. If the hops jump over it, it’s not.</p><p>Pick a number to count by, then tap a question.</p>',
      check:{kind:'mc',q:'Stickers come in packs of 7. Which number of stickers can Lin get by buying whole packs?',
        choices:[{id:'a',label:'17'},{id:'b',label:'27'},{id:'c',label:'21'}],answer:'c',
        why:{a:'2 packs is 14 and 3 packs is 21. 17 is in between, so it’s not a multiple of 7.',b:'It ends in 7, but that doesn’t matter. 3 packs is 21 and 4 packs is 28, so 27 is not a multiple of 7.'},
        explain:'3 × 7 = 21, so 3 packs is 21 stickers. 21 is a multiple of 7.'}}
  ];
