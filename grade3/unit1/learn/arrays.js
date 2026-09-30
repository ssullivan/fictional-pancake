/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 7: Arrays. Its widgets and steps; loaded by arrays.html. */
/* rows and columns, and the expression for them */
function wArr(el){
  const q=Q(el),st={r:3,c:5};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('r','Rows')}${stepper('c','In each row')}</div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {r,c}=st;q('r').textContent=r;q('c').textContent=c;
    q('f').innerHTML=arrayFig(r,c,{band:'r'});
    q('o').innerHTML=`<b>${pl(r,'row')} of ${c}</b>: ${r} × ${c} = ${r*c}.<br><span class="dimline">Each row is a group of ${c}. Count by ${c}s: ${countBy(c,r)}.</span>`;
  };
  steppers(el,st,{r:[1,5],c:[1,10]},draw);draw();
}
/* array stories: count one row at a time */
const AS=[{t:'Chairs',r:5,c:6,u:'chairs',s:'5 rows of chairs, with 6 chairs in each row'},{t:'Eggs',r:2,c:6,u:'eggs',s:'An egg carton with 2 rows of 6 eggs'},{t:'Garden',r:4,c:7,u:'plants',s:'A garden with 4 rows of 7 plants'},{t:'Stamps',r:3,c:8,u:'stamps',s:'A sheet of stamps, 3 rows of 8'}];
function wStory(el){
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Story',AS.map((a,i)=>[i,a.t]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Count a row</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {r,c,u,s}=AS[p];press(el,p);q('go').disabled=k===r;
    q('f').innerHTML=arrayFig(r,c,{band:'r',k,sum:true,label:`${s}: ${r} rows of ${c}`});
    q('o').innerHTML=`${s}.<br>`+(!k?'How many in all? Tap Count a row.'
      :`Count by ${c}s: ${countBy(c,k)}`+(k===r?`.<br><span class="ok">${r} × ${c} = ${r*c} ${u}.</span>`:'…'));
  };
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  a46:arrayFig(4,6)
};
const STEPS=[
    {title:'Arrays',widget:wArr,
      body:'<p>An <b>array</b> puts things in equal <b>rows</b> (across) and <b>columns</b> (up and down). Each row is a group, so 3 rows of 5 is 3 × 5.</p><p>Change the rows and how many are in each row.</p>',
      check:{kind:'mc',q:'Which expression matches this array?',fig:F.a46,
        choices:[{id:'a',label:'4 + 6'},{id:'b',label:'6 + 6 + 6'},{id:'c',label:'4 × 6'}],answer:'c',
        why:{a:'That adds a row and a column. There are 4 rows of 6.',b:'That’s only 3 rows of 6. Count the rows again.'},
        explain:'4 rows with 6 in each row: 4 × 6. That’s 6 + 6 + 6 + 6 = 24.'}},
    {title:'Solve array problems',widget:wStory,
      body:'<p>Lots of things come in arrays: chairs in rows, eggs in a carton, plants in a garden. Multiply the rows by how many are in each row.</p><p>Pick a story, then count it one row at a time.</p>',
      check:{kind:'num',q:'A muffin pan has 3 rows with 4 muffins in each row. How many muffins does it hold?',answer:12,unit:'muffins',
        misc:[[7,'You added 3 + 4. Multiply: 3 rows of 4.'],[3,'That’s the number of rows. Each row has 4.'],[4,'That’s one row. There are 3 rows.']],
        explain:'3 rows of 4: 3 × 4 = 12. Count by 4s: 4, 8, 12.'}}
  ];
