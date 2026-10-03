/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 6: Find the unknown. Its widgets and steps; loaded by unknowns.html. */
/* equations with an unknown factor: [groups, in each, which one is unknown ('g' or 'n')] */
const UK=[[4,5,'n'],[3,6,'g'],[6,4,'n']];
/* the equation with a ? for the unknown: "4 × ? = 20" */
const ukEq=([groups,perGroup,unknown])=>`${unknown==='g'?'?':groups} × ${unknown==='n'?'?':perGroup} = ${groups*perGroup}`;
/* Guess and check the unknown factor: a stepper tries numbers in its place. */
function wTry(el){
  /* the stepper's value: t, the number tried */
  const q=Q(el),values={t:1};let eqIndex=0;
  el.innerHTML=seg('Equation',UK.map((equation,i)=>[i,ukEq(equation)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('t','Try')}</div><p class="eq" data-e></p><p class="readout" data-o></p>`;
  const draw=()=>{
    /* the groups drawn: the equation's, with the number tried in place of the unknown */
    const [groups,perGroup,unknown]=UK[eqIndex],tried=values.t,triedGroups=unknown==='g'?tried:groups,triedEach=unknown==='n'?tried:perGroup,
      got=triedGroups*triedEach,want=groups*perGroup;press(el,eqIndex);q('t').textContent=tried;
    q('f').innerHTML=groupsFig(triedGroups,triedEach);
    q('e').innerHTML=`${triedGroups} × ${triedEach} = ${got}`;
    q('o').innerHTML=`Find the ? in <b>${ukEq(UK[eqIndex])}</b>: ${unknown==='g'?`how many groups of ${perGroup} make ${want}?`:`${groups} groups of how many make ${want}?`}<br>`
      +(got===want?`<span class="ok">${triedGroups} × ${triedEach} = ${want}. The unknown is ${tried}.</span>`
        :`${triedGroups} × ${triedEach} = ${got}. That’s too ${got<want?'few':'many'}: you need ${want}.`);
  };
  steppers(el,values,{t:[1,10]},draw);
  el.addEventListener('click',e=>{const eqBtn=e.target.closest('[data-m]');if(eqBtn){eqIndex=+eqBtn.dataset.m;values.t=1;draw();}});
  draw();
}
/* Hops of a bigger factor (6 to 9) on a number line; a stepper sets how many hops. */
function wHops(el){
  /* the stepper's value: k hops; hopSize: what each hop is */
  const q=Q(el),values={k:3};let hopSize=7;
  el.innerHTML=seg('Hops of',[6,7,8,9].map(size=>[size,`Hops of ${size}`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('k','Hops')}</div><p class="readout" data-o></p>`;
  const draw=()=>{
    const hops=values.k;press(el,hopSize);q('k').textContent=hops;
    q('f').innerHTML=hopLine(hopSize,hopSize*10,hops);
    q('o').innerHTML=`${pl(hops,'hop')} of ${hopSize}: <b>${hops} × ${hopSize} = ${hops*hopSize}</b>.<br><span class="dimline">Count by ${hopSize}s: ${countBy(hopSize,hops)}.</span>`;
  };
  steppers(el,values,{k:[1,10]},draw);
  el.addEventListener('click',e=>{const sizeBtn=e.target.closest('[data-m]');if(sizeBtn){hopSize=+sizeBtn.dataset.m;draw();}});
  draw();
}
const STEPS=[
    {title:'Find the unknown',widget:wTry,
      body:'<p>An equation can have an <b>unknown</b>, shown with a ? or a box. In 4 × ? = 20, the ? is how many are in each group. Try numbers until the equation is true.</p><p>Pick an equation, then try numbers.</p>',
      check:{kind:'num',q:'Kiran puts 4 pencils in each cup and uses 28 pencils. How many cups are there? (? × 4 = 28)',answer:7,unit:'cups',
        misc:[[24,'That’s 28 − 4. How many groups of 4 make 28?'],[32,'That’s 28 + 4. How many groups of 4 make 28?'],[4,'That’s how many pencils are in each cup.']],
        explain:'Count by 4s: 4, 8, 12, 16, 20, 24, 28. That’s 7 fours, so 7 × 4 = 28 and there are 7 cups.'}},
    {title:'More factors, more problems',widget:wHops,
      body:'<p>For bigger factors like 6, 7, 8, and 9, count by them on a number line. Each hop is one group.</p><p>Pick a factor, then change the number of hops.</p>',
      check:{kind:'mc',q:'A spider has 8 legs. How many legs do 6 spiders have? Which equation matches?',
        choices:[{id:'a',label:'6 + 8 = ?'},{id:'b',label:'8 × ? = 6'},{id:'c',label:'6 × 8 = ?'}],answer:'c',
        why:{a:'That adds. 6 spiders is 6 groups of 8 legs.',b:'The ? is the number of legs, and 6 is the number of spiders.'},
        explain:'6 spiders are 6 groups of 8 legs: 6 × 8 = ?. The unknown is 48.'}}
  ];
