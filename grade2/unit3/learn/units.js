/* Learn Measuring Length (Grade 2 Unit 3), chapter 1: Units of length. Its widgets and steps; loaded by units.html. */
/* units laid end to end: cubes (1 cm), paper clips (3 cm), erasers (5 cm) */
const UNITK={cube:{cm:1,name:'cubes'},clip:{cm:3,name:'paper clips'},eraser:{cm:5,name:'erasers'}};
const unitRow=(k,n,x,y,u)=>range(n).map(i=>{
  const s=UNITK[k].cm*u,a=x+i*s;
  return k==='cube'?`<rect class="cube a" x="${a+1}" y="${y}" width="${s-2}" height="${s-2}" rx="2"/>`
    :k==='clip'?`<g class="clip"><rect x="${a+2}" y="${y}" width="${s-4}" height="16" rx="8"/><rect x="${a+7}" y="${y+4}" width="${s-16}" height="8" rx="4"/></g>`
    :`<rect class="eraser" x="${a+1}" y="${y}" width="${s-2}" height="18" rx="4"/>`;
}).join('');
/* an object len cm long with rows of units under it: rows [[unit, how many], …]; u: pixels per cm */
function unitsFig(kind,len,rows,u){
  let o=thing(kind,10,8,len*u),y=46;
  rows.forEach(([k,n])=>{o+=unitRow(k,n,10,y,u);y+=(k==='cube'?u:18)+14;});
  return svgWrap(20+len*u,y,o,`A ${NAME[kind]} measured with `+rows.map(([k,n])=>`${n} ${UNITK[k].name}`).join(' and '));
}
function wUnits(el){
  const q=Q(el);let k='cube';
  el.innerHTML=seg('Unit',Object.keys(UNITK).map(id=>[id,UNITK[id].name.replace(/^./,c=>c.toUpperCase())]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const U=UNITK[k],n=15/U.cm;press(el,k);
    q('f').innerHTML=unitsFig('pencil',15,[[k,n]],24);
    q('r').innerHTML=`The pencil is <b>${n} ${U.name}</b> long.<br><span class="dimline">${k==='cube'?'Cubes are small, so it takes a lot of them.':k==='clip'?'A paper clip is longer than a cube, so it takes fewer.':'An eraser is the longest unit here, so it takes the fewest.'}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=b.dataset.m;draw();}});
  draw();
}
const CUBEIT=[['crayon',9],['marker',13],['glue',10]];
function wCubes(el){
  const q=Q(el),st={n:0};let p=0;
  el.innerHTML=seg('Object',CUBEIT.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Cubes')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=CUBEIT[p],n=st.n;press(el,p);q('n').textContent=n;
    q('f').innerHTML=svgWrap(20+16*CUBE,86,thing(k,10,8,len*CUBE)+cubes(10,48,n,'a'),`A ${NAME[k]} with ${n} cubes under it`);
    q('r').innerHTML=n===len?`<span class="ok">The ${NAME[k]} is <b>${len} cubes</b> long. Each cube is 1 centimeter, so it’s <b>${len} cm</b> long.</span>`
      :`<b>${n}</b> cubes<br><span class="dimline">${n>len?'That goes past the end. Take some away.':n?'Not to the end yet. Add more cubes.':`Line up cubes from one end of the ${NAME[k]}. No gaps!`}</span>`;
  };
  steppers(el,st,{n:[0,16]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.n=0;draw();}});
  draw();
}
const RULEIT=[['pencil',7],['crayon',9],['glue',5]];
function wRuler(el){
  const q=Q(el),st={at:0};let p=0;
  el.innerHTML=seg('Object',RULEIT.map(([k],i)=>[i,NAME[k]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('at','Start at')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,len]=RULEIT[p],a=st.at,b=a+len;press(el,p);q('at').textContent=a;
    q('f').innerHTML=ruler(15,{obj:{kind:k,at:a,len},span:true});
    q('r').innerHTML=a===0?`It starts at <b>0</b> and ends at <b>${b}</b>.<br><span class="ok">The ${NAME[k]} is <b>${len} cm</b> long.</span><br><span class="dimline">Now slide it so it starts at another number.</span>`
      :`It starts at <b>${a}</b> and ends at <b>${b}</b>. Is it ${b} cm long? No!<br><span class="ok">Count the spaces, or subtract: <b>${b} − ${a} = ${len} cm</b>.</span>`;
  };
  steppers(el,st,{at:[0,6]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.at=0;draw();}});
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
