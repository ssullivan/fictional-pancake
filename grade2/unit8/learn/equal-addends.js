/* Learn Equal Groups (Grade 2 Unit 8), chapter 4: Equal addends. Its widgets and steps; loaded by equal-addends.html. */
/* an array and its equation, adding the rows (and, with 'c' in modes, the columns) */
const eqW=modes=>el=>{
  const q=Q(el),st={rows:3,cols:4},seen=new Set();let m=modes[0];
  el.innerHTML=(modes.length>1?seg('Add',[['r','Add the rows'],['c','Add the columns']]):'')+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st,n=m==='r'?r:c,each=m==='r'?c:r,w=m==='r'?'row':'column';seen.add(m);
    q('rows').textContent=r;q('cols').textContent=c;if(modes.length>1)press(el,m);
    q('f').innerHTML=arr(r,c,{band:m});
    q('r').innerHTML=`<b>${addends(n,each)} = ${r*c}</b><br><span class="dimline">${pl(n,w)} of ${each}. Each ${w} is one addend.</span>`
      +(seen.size>1?`<br><span class="ok">By rows or by columns, it’s ${r*c} in all.</span>`:'');
  };
  steppers(el,st,{rows:[2,5],cols:[2,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){m=b.dataset.m;draw();}});
  draw();
};
/* build the array for an equation. BUILD: [addend, how many of them] */
const BUILD=[[3,4],[5,2],[2,5],[4,3]];
function wBuild(el){
  const q=Q(el),st={rows:2,cols:2};let p=0;
  el.innerHTML=seg('Equation',BUILD.map(([a,n],i)=>[i,addends(n,a)]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,n]=BUILD[p],{rows:r,cols:c}=st,eq=`${addends(n,a)} = ${a*n}`,byR=r===n&&c===a,byC=c===n&&r===a;
    q('rows').textContent=r;q('cols').textContent=c;press(el,p);
    q('f').innerHTML=arr(r,c,{band:byC&&!byR?'c':'r'});
    q('r').innerHTML=byR?`<span class="ok">Yes! ${pl(n,'row')} of ${a}: <b>${eq}</b>.</span>`
      :byC?`<span class="ok">Yes! ${pl(n,'column')} of ${a}: <b>${eq}</b>.</span><br><span class="dimline">Columns work too.</span>`
      :`Your array: ${pl(r,'row')} of ${c}. Make one that shows <b>${addends(n,a)}</b>.<br><span class="dimline">Each ${a} is one row. How many ${a}s are there?</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  a35:arr(3,5,{band:'r'}),
  a24:arr(2,4),
  chairs:arr(4,5,{label:'4 rows of chairs with 5 in each row'})
};
const STEPS=[
    {title:'Add the rows',widget:eqW(['r']),
      body:'<p>Every row of an array has the same number, so you can add that number again and again: 4 + 4 + 4 = 12. These are <b>equal addends</b>.</p><p>Change the rows and columns. Watch the equation.</p>',
      check:{kind:'num',answer:15,fig:F.a35,q:'Each row has 5 counters. How many counters are there in all?',
        misc:[[8,'5 + 3 adds one row and the number of rows. Add 5 for every row: 5 + 5 + 5.'],[10,'That’s 2 rows. There are 3 rows of 5.'],[20,'That’s 4 rows. Count the rows again.']],
        explain:'5 + 5 + 5 = 15. 3 rows of 5 is 15 counters.'}},
    {title:'By rows or by columns',widget:eqW(['r','c']),
      body:'<p>You can add the columns too! 3 rows of 4 is 4 + 4 + 4. It’s also 4 columns of 3: 3 + 3 + 3 + 3. Both make 12.</p><p>Tap Add the rows, then Add the columns.</p>',
      check:{kind:'mc',fig:F.a24,q:'Which equation does <b>not</b> match this array?',
        choices:[{id:'a',label:'4 + 4 = 8'},{id:'b',label:'2 + 2 + 2 + 2 = 8'},{id:'c',label:'2 + 4 = 6'}],answer:'c',
        why:{a:'4 + 4 adds the 2 rows of 4. It matches.',b:'2 + 2 + 2 + 2 adds the 4 columns of 2. It matches.'},
        explain:'2 + 4 adds the number of rows and the number in a row. The array has 8 counters, not 6.'}},
    {title:'Build an array',widget:wBuild,
      body:'<p>You can go the other way too: start with an equation and build its array. Each addend is one row.</p><p>Pick an equation. Change the rows and columns to match it.</p>',
      check:{kind:'num',unit:'chairs',answer:20,fig:F.chairs,q:'Priya sets up chairs in 4 rows, with 5 chairs in each row. How many chairs is that?',
        misc:[[9,'4 + 5 adds the rows and the chairs in one row. Add 5 for every row.'],[15,'That’s 3 rows. There are 4 rows: 5 + 5 + 5 + 5.'],[16,'That’s 4 rows of 4. Each row has 5 chairs.']],
        explain:'5 + 5 + 5 + 5 = 20 chairs. Two 5s make 10, and 10 + 10 = 20.'}}
  ];
