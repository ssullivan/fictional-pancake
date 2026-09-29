/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 1: Multiples. Its widgets and steps; loaded by multiples.html. */
const HOPN=[2,3,4,5,6,7,8,9];
function wHops(el){
  const q=Q(el),st={hops:0};let n=3;
  el.innerHTML=seg('Count by',HOPN.map(v=>[v,`by ${v}s`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('hops','Hops')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const k=st.hops;press(el,n);q('hops').textContent=k;
    q('f').innerHTML=hopLine(n,10*n,k);
    q('r').innerHTML=k?`<b>${k} × ${n} = ${k*n}</b>, so ${k*n} is a multiple of ${n}.<br><span class="dimline">Multiples of ${n} so far: ${list(range(k).map(i=>(i+1)*n))}</span>`
      :`Start at 0. Tap + to hop by ${n}s.`;
  };
  steppers(el,st,{hops:[0,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;st.hops=0;draw();}});
  draw();
}
const TARGET=[{n:4,t:[18,20,30]},{n:6,t:[34,36,40]},{n:7,t:[27,28,45]},{n:9,t:[45,50,54]}];
function wIsMultiple(el){
  const q=Q(el);let p=0,t=null;
  el.innerHTML=seg('Count by',TARGET.map(({n},i)=>[i,`by ${n}s`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {n,t:T}=TARGET[p];press(el,p);
    q('c').innerHTML=T.map(v=>`<button type="button" class="chip" data-t="${v}" aria-pressed="${v===t}">Is ${v} a multiple of ${n}?</button>`).join('');
    if(t===null){q('f').innerHTML=hopLine(n,10*n,10);q('r').innerHTML=`Tap a question. Do the hops of ${n} land on the number?`;return;}
    const k=Math.floor(t/n),yes=t%n===0;
    q('f').innerHTML=hopLine(n,(k+1)*n,yes?k:k+1,{mark:t});
    q('r').innerHTML=yes?`<span class="ok">Yes! ${k} hops of ${n} land right on ${t}: <b>${k} × ${n} = ${t}</b>.</span><br>${t} is a multiple of ${n}.`
      :`<span class="no">No.</span> Hops of ${n} land on <b>${k*n}</b> and <b>${(k+1)*n}</b>, and ${t} is in between.<br><span class="dimline">${t} is not a multiple of ${n}.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;t=null;draw();return;}const c=e.target.closest('[data-t]');if(c){t=+c.dataset.t;draw();}});
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
