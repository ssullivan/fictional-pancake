/* Learn Measuring Length (Grade 2 Unit 3), chapter 1: Units of length. Its widgets and steps; loaded by units.html. */
/* units laid end to end: cubes (1 cm), paper clips (3 cm), erasers (5 cm) */
const UNITK={cube:{cm:1,name:'cubes'},clip:{cm:3,name:'paper clips'},eraser:{cm:5,name:'erasers'}};
/* `count` units of one kind end to end from x, y; u: pixels per cm */
const unitRow=(kind,count,x,y,u)=>range(count).map(i=>{
  const size=UNITK[kind].cm*u,left=x+i*size;
  return kind==='cube'?`<rect class="cube a" x="${left+1}" y="${y}" width="${size-2}" height="${size-2}" rx="2"/>`
    :kind==='clip'?`<g class="clip"><rect x="${left+2}" y="${y}" width="${size-4}" height="16" rx="8"/><rect x="${left+7}" y="${y+4}" width="${size-16}" height="8" rx="4"/></g>`
    :`<rect class="eraser" x="${left+1}" y="${y}" width="${size-2}" height="18" rx="4"/>`;
}).join('');
/* an object len cm long with rows of units under it: rows [[unit, how many], …]; u: pixels per cm */
function unitsFig(kind,len,rows,u){
  let markup=thing(kind,10,8,len*u),y=46;
  rows.forEach(([unit,count])=>{markup+=unitRow(unit,count,10,y,u);y+=(unit==='cube'?u:18)+14;});
  return svgWrap(20+len*u,y,markup,`A ${NAME[kind]} measured with `+rows.map(([unit,count])=>`${count} ${UNITK[unit].name}`).join(' and '));
}
/* The same pencil measured in cubes, paper clips, or erasers: longer units take fewer. */
function wUnits(el){
  const q=Q(el);let unit='cube';
  el.innerHTML=seg('Unit',Object.keys(UNITK).map(id=>[id,UNITK[id].name.replace(/^./,c=>c.toUpperCase())]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {name}=UNITK[unit],count=15/UNITK[unit].cm;press(el,unit);
    q('f').innerHTML=unitsFig('pencil',15,[[unit,count]],24);
    q('r').innerHTML=`The pencil is <b>${count} ${name}</b> long.<br><span class="dimline">${unit==='cube'?'Cubes are small, so it takes a lot of them.':unit==='clip'?'A paper clip is longer than a cube, so it takes fewer.':'An eraser is the longest unit here, so it takes the fewest.'}</span>`;
  };
  el.addEventListener('click',e=>{const unitBtn=e.target.closest('[data-m]');if(unitBtn){unit=unitBtn.dataset.m;draw();}});
  draw();
}
/* objects to measure in cubes: [kind, cm] */
const CUBEIT=[['crayon',9],['marker',13],['glue',10]];
/* Line up cubes under an object (a stepper) until they reach its end. */
function wCubes(el){
  const q=Q(el),values={n:0};let objectIndex=0;
  el.innerHTML=seg('Object',CUBEIT.map(([kind],i)=>[i,NAME[kind]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Cubes')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [kind,len]=CUBEIT[objectIndex],count=values.n;press(el,objectIndex);q('n').textContent=count;
    q('f').innerHTML=svgWrap(20+16*CUBE,86,thing(kind,10,8,len*CUBE)+cubes(10,48,count,'a'),`A ${NAME[kind]} with ${count} cubes under it`);
    q('r').innerHTML=count===len?`<span class="ok">The ${NAME[kind]} is <b>${len} cubes</b> long. Each cube is 1 centimeter, so it’s <b>${len} cm</b> long.</span>`
      :`<b>${count}</b> cubes<br><span class="dimline">${count>len?'That goes past the end. Take some away.':count?'Not to the end yet. Add more cubes.':`Line up cubes from one end of the ${NAME[kind]}. No gaps!`}</span>`;
  };
  steppers(el,values,{n:[0,16]},draw);
  el.addEventListener('click',e=>{const objectBtn=e.target.closest('[data-m]');if(objectBtn){objectIndex=+objectBtn.dataset.m;values.n=0;draw();}});
  draw();
}
/* objects to measure on a ruler: [kind, cm] */
const RULEIT=[['pencil',7],['crayon',9],['glue',5]];
/* Slide an object along a ruler (a stepper): it's still as long, counted from where it starts. */
function wRuler(el){
  const q=Q(el),values={at:0};let objectIndex=0;
  el.innerHTML=seg('Object',RULEIT.map(([kind],i)=>[i,NAME[kind]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('at','Start at')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [kind,len]=RULEIT[objectIndex],start=values.at,end=start+len;press(el,objectIndex);q('at').textContent=start;
    q('f').innerHTML=ruler(15,{obj:{kind,at:start,len},span:true});
    q('r').innerHTML=start===0?`It starts at <b>0</b> and ends at <b>${end}</b>.<br><span class="ok">The ${NAME[kind]} is <b>${len} cm</b> long.</span><br><span class="dimline">Now slide it so it starts at another number.</span>`
      :`It starts at <b>${start}</b> and ends at <b>${end}</b>. Is it ${end} cm long? No!<br><span class="ok">Count the spaces, or subtract: <b>${end} − ${start} = ${len} cm</b>.</span>`;
  };
  steppers(el,values,{at:[0,6]},draw);
  el.addEventListener('click',e=>{const objectBtn=e.target.closest('[data-m]');if(objectBtn){objectIndex=+objectBtn.dataset.m;values.at=0;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  book:unitsFig('book',24,[['clip',8],['cube',24]],14),
  pencil12:svgWrap(20+12*CUBE,86,thing('pencil',10,8,12*CUBE)+cubes(10,48,12,'a'),'A pencil with 12 cubes under it'),
  crayon29:ruler(15,{obj:{kind:'crayon',at:2,len:7}})
};
const STEPS=[
    {title:'Same-size units',widget:wUnits,
      body:'<p>To measure, line up <b>units</b> that are all the same size, end to end, with no gaps. Then count them.</p><p>Tap each unit. See how many it takes to go across the pencil.</p>',
      check:{kind:'mc',q:'Lin measures a book with paper clips and gets 8. Han measures the same book with cubes and gets 24. Who is right?',fig:F.book,
        choices:[{id:'a',label:'Both of them'},{id:'b',label:'Only Lin'},{id:'c',label:'Only Han'}],answer:'a',
        why:{b:'Han’s cubes are small, so it takes more of them. Han is right too.',c:'Lin’s paper clips are longer than cubes, so it takes fewer. Lin is right too.'},
        explain:'Both are right. A paper clip is longer than a cube, so it takes fewer paper clips (8) than cubes (24) to go across the same book.'}},
    {title:'Measure in centimeters',widget:wCubes,
      body:'<p>A small cube is <b>1 centimeter</b> long. We write <b>cm</b>. Everyone’s centimeter is the same size, so everyone gets the same answer.</p><p>Pick a thing, then add cubes until they reach the end.</p>',
      check:{kind:'num',unit:'cm',answer:12,fig:F.pencil12,q:'Each cube is 1 centimeter long. How long is the pencil?',
        misc:[[11,'Count every cube, even the last one.'],[13,'Count each cube just one time.']],
        explain:'12 cubes go from one end of the pencil to the other. Each is 1 cm, so the pencil is 12 cm long.'}},
    {title:'Use a ruler',widget:wRuler,
      body:'<p>A ruler is like cubes in a row, with numbers. Line the end of the thing up with <b>0</b>. The number at the other end is its length.</p><p>What if it doesn’t start at 0? Slide it and see.</p>',
      check:{kind:'num',unit:'cm',answer:7,fig:F.crayon29,q:'How long is the crayon?',
        misc:[[9,'9 is where the crayon ends. It starts at 2, not 0.'],[2,'2 is where the crayon starts. How many spaces does it cover?'],[11,'You added. Count the spaces from 2 to 9, or subtract: 9 − 2.']],
        explain:'The crayon starts at 2 and ends at 9. 9 − 2 = 7, so it’s 7 cm long.'}}
  ];
