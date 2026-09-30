/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 6: Find the unknown. Its widgets and steps; loaded by unknowns.html. */
/* guess and check the unknown factor: [groups, in each, which one is unknown] */
const UK=[[4,5,'n'],[3,6,'g'],[6,4,'n']];
const ukEq=([g,n,u])=>`${u==='g'?'?':g} × ${u==='n'?'?':n} = ${g*n}`;
function wTry(el){
  const q=Q(el),st={t:1};let p=0;
  el.innerHTML=seg('Equation',UK.map((e,i)=>[i,ukEq(e)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('t','Try')}</div><p class="eq" data-e></p><p class="readout" data-o></p>`;
  const draw=()=>{
    const [g,n,u]=UK[p],t=st.t,G=u==='g'?t:g,N=u==='n'?t:n,got=G*N,want=g*n;press(el,p);q('t').textContent=t;
    q('f').innerHTML=groupsFig(G,N);
    q('e').innerHTML=`${G} × ${N} = ${got}`;
    q('o').innerHTML=`Find the ? in <b>${ukEq(UK[p])}</b>: ${u==='g'?`how many groups of ${n} make ${want}?`:`${g} groups of how many make ${want}?`}<br>`
      +(got===want?`<span class="ok">${G} × ${N} = ${want}. The unknown is ${t}.</span>`
        :`${G} × ${N} = ${got}. That’s too ${got<want?'few':'many'}: you need ${want}.`);
  };
  steppers(el,st,{t:[1,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.t=1;draw();}});
  draw();
}
/* hops of a bigger factor on a number line */
function wHops(el){
  const q=Q(el),st={k:3};let n=7;
  el.innerHTML=seg('Hops of',[6,7,8,9].map(v=>[v,`Hops of ${v}`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('k','Hops')}</div><p class="readout" data-o></p>`;
  const draw=()=>{
    const k=st.k;press(el,n);q('k').textContent=k;
    q('f').innerHTML=hopLine(n,n*10,k);
    q('o').innerHTML=`${pl(k,'hop')} of ${n}: <b>${k} × ${n} = ${k*n}</b>.<br><span class="dimline">Count by ${n}s: ${countBy(n,k)}.</span>`;
  };
  steppers(el,st,{k:[1,10]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;draw();}});
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
