/* Learn Equal Groups (Grade 2 Unit 8), chapter 3: Arrays. Its widgets and steps; loaded by arrays.html. */
/* counters at [column, row] spots (fractions allowed), for pictures that aren't arrays */
function spots(pts,label){
  const W=Math.max(...pts.map(p=>p[0]))+1,H=Math.max(...pts.map(p=>p[1]))+1;
  const G=ARRAY.g,AP=ARRAY.pad;
  return svgWrap(2*AP+W*G,2*AP+H*G,pts.map(([x,y])=>ctr(AP+G/2+x*G,AP+G/2+y*G,'a',16)).join(''),label);
}
function wArray(el){
  const q=Q(el),st={rows:3,cols:4};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st;q('rows').textContent=r;q('cols').textContent=c;
    q('f').innerHTML=arrayFig(r,c);
    q('r').innerHTML=`<b>${pl(r,'row')} of ${c}</b>: ${c} in each row.<br><span class="dimline">${pl(c,'column')} of ${r}: ${r} in each column. ${r*c} in all.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);draw();
}
/* tap a counter to see its row and column */
const RC=[[3,4],[2,5],[4,3],[5,5]];
function wRowsCols(el){
  const q=Q(el);let p=0,hi=null;
  el.innerHTML=seg('Array',RC.map(([r,c],i)=>[i,`${r} rows of ${c}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [r,c]=RC[p];press(el,p);
    q('f').innerHTML=arrayFig(r,c,{hi,tap:true,label:`An array: ${r} rows with ${c} in each row. Tap a counter.`});
    q('r').innerHTML=!hi?`${r} rows of ${c}. Tap any counter.`
      :`This counter is in <b>row ${hi[0]+1}</b> and <b>column ${hi[1]+1}</b>.<br><span class="dimline">Its row goes across and has ${c}. Its column goes up and down and has ${r}.</span>`;
  };
  el.addEventListener('click',e=>{
    const m=e.target.closest('[data-m]'),t=e.target.closest('[data-i]');
    if(m){p=+m.dataset.m;hi=null;draw();}
    else if(t){const c=RC[p][1];hi=[Math.floor(t.dataset.i/c),t.dataset.i%c];draw();}
  });
  draw();
}
/* count an array one row or one column at a time, with a running total */
const CNT=[[3,5],[4,2],[2,4],[5,3]];
function wCount(el){
  const q=Q(el);let p=0,mode=null,k=0;
  el.innerHTML=seg('Array',CNT.map(([r,c],i)=>[i,`${r} rows of ${c}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-br>Count a row</button><button type="button" class="btn" data-bc>Count a column</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [r,c]=CNT[p],n=mode==='r'?r:c,each=mode==='r'?c:r,w=mode==='r'?'row':'column';press(el,p);
    q('f').innerHTML=arrayFig(r,c,mode?{band:mode,k,sum:true}:{});
    q('r').innerHTML=!mode?`${r} rows of ${c}. Count them by rows or by columns.`
      :`Count by ${w}s: <b>${range(k).map(i=>each*(i+1)).join(', ')}</b>`
        +(k===n?`<br><span class="ok">${r*c} in all: ${pl(n,w)} of ${each}.</span>`:`<br><span class="dimline">Each ${w} has ${each}. Tap Count a ${w} again.</span>`);
  };
  const go=m=>()=>{if(mode!==m||k===(m==='r'?CNT[p][0]:CNT[p][1])){mode=m;k=1;}else k++;draw();};
  q('br').onclick=go('r');q('bc').onclick=go('c');
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;mode=null;k=0;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  notRows:spots([[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2],[3,2]],'Picture A'),
  rows34:arrayFig(3,4,{label:'Picture B'}),
  mixed:spots([[.2,.1],[1.4,.3],[2.1,0],[3.2,.4],[.6,1.1],[1.9,1.2],[2.7,1.1],[.1,2],[1.2,1.9],[2.3,2.2],[3.4,1.6],[3,2.6]],'Picture C'),
  a43:arrayFig(4,3),
  a25:arrayFig(2,5)
};
const STEPS=[
    {title:'What is an array?',widget:wArray,
      body:'<p>An <b>array</b> is things in <b>rows</b> and <b>columns</b>. Rows go across. Columns go up and down.</p><p>In an array, every row has the same number. Change the rows and columns.</p>',
      check:{kind:'mc',q:'Which picture is an array?',
        choices:[{id:'a',label:F.notRows},{id:'b',label:F.rows34},{id:'c',label:F.mixed}],answer:'b',
        why:{a:'The rows aren’t the same. The middle row has only 3.',c:'These counters aren’t in rows and columns.'},
        explain:'Picture B has 3 rows with 4 in each row. Every row is the same, so it’s an array.'}},
    {title:'Rows and columns',widget:wRowsCols,
      body:'<p>A <b>row</b> goes across, like friends sitting side by side. A <b>column</b> goes up and down, like a stack of blocks.</p><p>Tap any counter to see its row and its column.</p>',
      check:{kind:'num',answer:4,fig:F.a43,q:'How many rows are in this array?',
        misc:[[3,'That’s how many columns. Rows go across.'],[12,'That’s all the counters. Count the rows that go across.'],[7,'That’s the rows and columns together. Just count the rows.']],
        explain:'There are 4 rows going across, with 3 counters in each row.'}},
    {title:'Count by rows or columns',widget:wCount,
      body:'<p>You can count an array <b>by rows</b> or <b>by columns</b>. Add on the number in each row, like 5, 10, 15.</p><p>Tap Count a row or Count a column.</p>',
      check:{kind:'num',answer:2,fig:F.a25,q:'How many counters are in each column?',
        misc:[[5,'That’s how many are in each row. Columns go up and down.'],[10,'That’s all the counters. Look at just one column.']],
        explain:'Each column has 2 counters, one on top of the other. 5 columns of 2 is 10 in all.'}}
  ];
