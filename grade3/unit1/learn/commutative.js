/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 8: Turn it around. Its widgets and steps; loaded by commutative.html. */
/* turn an array a quarter turn: the rows become the columns */
const TA=[[3,5],[2,7],[4,6]];
function wTurn(el){
  const q=Q(el);let p=0,turned=false;
  el.innerHTML=seg('Array',TA.map(([r,c],i)=>[i,`${r} × ${c}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const [r,c]=TA[p],R=turned?c:r,C=turned?r:c;press(el,p);
    q('go').textContent=turned?'Turn it back':'Turn it';
    q('f').innerHTML=arrayFig(R,C,{band:'r'});
    q('o').innerHTML=`${pl(R,'row')} of ${C}: <b>${R} × ${C} = ${r*c}</b>.`
      +(turned?`<br><span class="ok">Same counters, just turned. So ${r} × ${c} = ${c} × ${r}.</span>`:'<br><span class="dimline">Turn the array and see what changes.</span>');
  };
  q('go').onclick=()=>{turned=!turned;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;turned=false;draw();}});
  draw();
}
/* hops both ways land on the same number */
const TF=[[2,9],[5,8],[3,7]];
function wFact(el){
  const q=Q(el);let p=0,w=0;
  el.innerHTML=`<div data-top>${seg('Factors',TF.map(([a,b],i)=>[i,`${a} and ${b}`]))}</div><div data-bot></div><div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const [a,b]=TF[p],[k,n]=w?[a,b]:[b,a];
    q('bot').innerHTML=seg('Which hops',[[0,`${b} hops of ${a}`],[1,`${a} hops of ${b}`]]);press(q('top'),p);press(q('bot'),w);
    q('f').innerHTML=hopLine(n,a*b+Math.max(a,b),k);
    q('o').innerHTML=`${k} hops of ${n}: <b>${k} × ${n} = ${a*b}</b>.<br><span class="dimline">${b} × ${a} and ${a} × ${b} land on the same number, so if you know one, you know the other.</span>`;
  };
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')p=+h[1];else w=+h[1];draw();});
  draw();
}
const STEPS=[
    {title:'Turn the array',widget:wTurn,
      body:'<p>Turn an array a quarter turn, and its rows become columns. It has the same number of counters, so the product stays the same: <b>3 × 5 = 5 × 3</b>. You can multiply factors in any order. This is the <b>commutative property</b>.</p><p>Pick an array, then turn it.</p>',
      check:{kind:'mc',q:'Andre knows 6 × 4 = 24. Which equation is also true?',
        choices:[{id:'a',label:'4 × 6 = 24'},{id:'b',label:'4 × 6 = 10'},{id:'c',label:'4 × 6 = 46'}],answer:'a',
        why:{b:'4 + 6 = 10, but 4 × 6 is 4 groups of 6.',c:'Turning the factors around doesn’t turn the product around. It’s still 24.'},
        explain:'The factors can go in any order, so 4 × 6 = 6 × 4 = 24.'}},
    {title:'Use a fact you know',widget:wFact,
      body:'<p>If you know one fact, you know its turnaround too. 9 hops of 2 and 2 hops of 9 both land on 18.</p><p>Pick two factors, then try the hops both ways.</p>',
      check:{kind:'num',q:'Priya knows 5 × 8 = 40. What is 8 × 5?',answer:40,
        misc:[[13,'That’s 8 + 5. Multiply: 8 groups of 5.'],[35,'That’s 7 × 5. 8 × 5 is one more 5.'],[85,'Turning the factors around doesn’t change the product.']],
        explain:'8 × 5 is the turnaround of 5 × 8, so it’s 40 too.'}}
  ];
