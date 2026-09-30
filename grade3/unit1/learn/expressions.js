/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 5: Expressions and equations. Its widgets and steps; loaded by expressions.html. */
/* a story as a multiplication expression, then its product */
const EXS=[{g:4,n:5,groups:'bags',things:'apples'},{g:3,n:8,groups:'spiders',things:'legs'},{g:2,n:5,groups:'hands',things:'fingers'},{g:6,n:4,groups:'cars',things:'wheels'}];
function wExpr(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Story',EXS.map((s,i)=>[i,`${s.g} ${s.groups}`]))+`<div class="fig" data-f></div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the product</button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {g,n,groups,things}=EXS[p];press(el,p);q('go').disabled=shown;
    q('f').innerHTML=groupsFig(g,n,{label:`${g} ${groups} with ${n} ${things} each`});
    q('e').innerHTML=shown?`${g} × ${n} = ${g*n}`:`${g} × ${n}`;
    q('o').innerHTML=`${g} ${groups} with ${n} ${things} each: <b>${g} × ${n}</b>.<br><span class="dimline">Say “${g} times ${n}”: ${g} groups of ${n}. ${g} and ${n} are the <b>factors</b>.</span>`
      +(shown?`<br><span class="ok">${countBy(n,g)}. ${g} × ${n} = ${g*n}, so there are ${g*n} ${things}. ${g*n} is the <b>product</b>.</span>`:'');
  };
  q('go').onclick=()=>{shown=true;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  draw();
}
/* an equation, written either way around */
function wEq(el){
  const q=Q(el),st={g:3,n:4};let flip=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('g','Groups')}${stepper('n','In each group')}</div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Write it the other way</button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {g,n}=st,p=g*n;q('g').textContent=g;q('n').textContent=n;
    q('f').innerHTML=groupsFig(g,n);
    q('e').innerHTML=flip?`${p} = ${g} × ${n}`:`${g} × ${n} = ${p}`;
    q('o').innerHTML=`${pl(g,'group')} of ${n} is ${p}.<br><span class="dimline">The = sign means both sides are worth the same, so ${g} × ${n} = ${p} and ${p} = ${g} × ${n} say the same thing.</span>`;
  };
  q('go').onclick=()=>{flip=!flip;draw();};
  steppers(el,st,{g:[1,5],n:[1,10]},draw);draw();
}
/* the quick checks' figures */
const F={
  g35:groupsFig(3,5,{label:'3 circles with 5 dots in each'})
};
const STEPS=[
    {title:'Multiplication expressions',widget:wExpr,
      body:'<p>An <b>expression</b> like <b>4 × 5</b> means 4 groups of 5. The first number tells how many groups, and the second tells how many in each group. The numbers you multiply are <b>factors</b>, and the answer is the <b>product</b>.</p><p>Pick a story, then find the product.</p>',
      check:{kind:'mc',q:'Mai puts 3 flowers in each of 6 vases. Which expression matches the story?',
        choices:[{id:'a',label:'3 × 6'},{id:'b',label:'6 × 3'},{id:'c',label:'6 + 3'}],answer:'b',
        why:{a:'That’s 3 groups of 6. There are 6 vases, with 3 flowers in each.',c:'That adds 3 to 6. For equal groups, multiply: 6 groups of 3.'},
        explain:'6 vases are 6 groups, with 3 flowers in each: 6 × 3.'}},
    {title:'Multiplication equations',widget:wEq,
      body:'<p>An <b>equation</b> uses an = sign to show that two things are worth the same, like <b>3 × 4 = 12</b>. It can be written either way around: 12 = 3 × 4.</p><p>Change the groups, then write the equation the other way.</p>',
      check:{kind:'mc',q:'Which equation matches the picture?',fig:F.g35,
        choices:[{id:'a',label:'3 + 5 = 8'},{id:'b',label:'15 = 3 × 5'},{id:'c',label:'5 = 3 × 15'}],answer:'b',
        why:{a:'That adds a group and a count. The picture shows 3 groups of 5.',c:'15 is the total. It goes by itself on one side: 15 = 3 × 5.'},
        explain:'3 groups of 5 is 15. 15 = 3 × 5 says the same thing as 3 × 5 = 15.'}}
  ];
