/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 5: Dividing decimals. Its widgets and steps; loaded by divide-decimals.html. */
/* multiply both numbers by 10 until the divisor is a whole number: the quotient doesn't change */
const SCALE=[[1.8,0.3],[4.5,0.05],[7.2,1.2],[0.96,0.08],[3,0.25]];
function wScale(el){
  const q=Q(el);let p=0,s=0;
  el.innerHTML=seg('Divide',SCALE.map(([a,b],i)=>[i,`${fmt(a)} ÷ ${fmt(b)}`]))+`<p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Multiply both by 10</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=SCALE[p],k=10**s,A=a*k,B=b*k,whole=places(B)===0;press(el,p);
    q('e').innerHTML=`${fmt(A)} ÷ ${fmt(B)}`;
    q('go').disabled=whole;
    q('r').innerHTML=!s?`Multiply both numbers by 10 until you divide by a whole number. The answer stays the same.`
      :`Both numbers × ${k.toLocaleString('en-US')}: ${fmt(a)} ÷ ${fmt(b)} is the same as ${fmt(A)} ÷ ${fmt(B)}.`
      +(whole?`<br><span class="ok">Now you divide by a whole number: ${fmt(A)} ÷ ${fmt(B)} = <b>${fmt(a/b)}</b>, so ${fmt(a)} ÷ ${fmt(b)} = ${fmt(a/b)}.</span>`:'');
  };
  q('go').onclick=()=>{s++;draw();};
  q('clr').onclick=()=>{s=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;s=0;draw();}});
  draw();
}

const STEPS=[
  {title:'Make it a whole number',widget:wScale,
    body:'<p>Multiplying both numbers in a division by the same number doesn’t change the answer: 1.8 ÷ 0.3 is the same as 18 ÷ 3. So multiply both by 10 (or 100) until you are dividing by a whole number.</p><p>Pick a division and multiply.</p>',
    check:{kind:'num',unit:'cups',answer:12,q:'How many 0.25-liter cups can you fill from 3 liters of juice?',
      misc:[[0.75,'That’s 3 × 0.25. Divide: how many 0.25s fit in 3?'],[1.2,'Multiply both numbers by the same thing: 3 ÷ 0.25 is 300 ÷ 25, not 30 ÷ 25.']],
      explain:'3 ÷ 0.25 is the same as 300 ÷ 25 = 12 cups.'}}
];
