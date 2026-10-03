/* Learn Factors and Multiples (Grade 4 Unit 1), chapter 2: Factor pairs. Its widgets and steps; loaded by factor-pairs.html. */
/* how many tiles each choice has */
const RECTN=[12,18,24];
/* Put n tiles in equal rows: a stepper sets the rows, and rows with none left over make a factor pair. */
function wRows(el){
  /* the stepper's value and its limits: at most one row per tile */
  const q=Q(el),values={rows:1},limits={rows:[1,RECTN[0]]};let n=RECTN[0];
  el.innerHTML=seg('Tiles',RECTN.map(v=>[v,`${v} tiles`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const rows=values.rows,perRow=Math.floor(n/rows),left=n%rows;press(el,n);q('rows').textContent=rows;
    q('f').innerHTML=tiles(rows,n);
    q('r').innerHTML=!left?`<span class="ok"><b>${rows} × ${perRow} = ${n}</b>. ${rows} and ${perRow} are a <b>factor pair</b> of ${n}.</span><br><span class="dimline">Try another number of rows.</span>`
      :`${rows} rows of ${perRow} is ${rows*perRow}, with <b>${left}</b> left over.<br><span class="dimline">${rows} rows don’t work, so ${rows} is not a factor of ${n}.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const tilesBtn=e.target.closest('[data-m]');if(tilesBtn){n=+tilesBtn.dataset.m;values.rows=1;limits.rows[1]=n;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  plants:tiles(4,24,'24 plants in 4 equal rows')
};
const STEPS=[
    {title:'Rectangles and factor pairs',widget:wRows,
      body:'<p>Put 12 tiles in 3 equal rows and you get a rectangle: 3 × 4 = 12. So <b>3 and 4 are a factor pair</b> of 12, and each is a <b>factor</b> of 12.</p><p>Pick a number of tiles, then change the rows. When do they make a rectangle?</p>',
      check:{kind:'num',unit:'plants',answer:6,fig:F.plants,q:'A gardener plants 24 tomato plants in 4 equal rows. How many plants are in each row?',
        misc:[[20,'You subtracted. Equal rows means 4 × ? = 24.'],[28,'You added. Equal rows means 4 × ? = 24.'],[96,'That’s 24 × 4. Find the number that goes with 4 to make 24.']],
        explain:'4 × 6 = 24, so there are 6 plants in each row. 4 and 6 are a factor pair of 24.'}},
    {title:'Find all the factor pairs',widget:pairsHunt([20,30,36]),
      body:'<p>To find every factor pair, try 1 row, 2 rows, 3 rows, and so on. Once the pairs start to turn around (5 × 4 after 4 × 5), you have them all.</p><p>Pick a number and keep trying rows.</p>',
      check:{kind:'mc',stack:true,q:'Which list shows all the factor pairs of 16?',
        choices:[{id:'a',label:'1 × 16, 2 × 8'},{id:'b',label:'1 × 16, 2 × 8, 3 × 5'},{id:'c',label:'1 × 16, 2 × 8, 4 × 4'}],answer:'c',
        why:{a:'4 × 4 = 16 too. A square is a rectangle, so 4 × 4 counts.',b:'3 × 5 = 15, not 16. 3 is not a factor of 16.'},
        explain:'Try 1, 2, 3, and 4 rows: 1 × 16, 2 × 8, and 4 × 4 work, and 3 doesn’t. After 4, the pairs turn around.'}}
  ];
