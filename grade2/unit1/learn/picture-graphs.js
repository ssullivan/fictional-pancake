/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 3: Picture graphs. Its widgets and steps; loaded by picture-graphs.html. */
const COLORS=[{c:'red',label:'Red'},{c:'blue',label:'Blue'},{c:'green',label:'Green'},{c:'yellow',label:'Yellow'}];
function wSort(el){
  const q=Q(el),PILE=['blue','red','green','blue','yellow','red','blue','green','blue','red','yellow','blue'],done=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-one>Sort one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let o=`<text class="lbl st" x="4" y="14">${done.size<PILE.length?'Tap a vote to sort it':'All sorted!'}</text>`;
    // two rows of six, each note with a 44px tap area
    PILE.forEach((c,i)=>{const x=26+i%6*44,y=48+Math.floor(i/6)*44;if(!done.has(i))o+=`<g data-i="${i}" class="tapme"><rect class="hit" x="${x-22}" y="${y-22}" width="44" height="44"/>${PIC.note(x,y,c)}</g>`;});
    const rows=COLORS.map(k=>({...k,pic:'note',n:[...done].filter(i=>PILE[i]===k.c).length}));
    q('f').innerHTML=svgWrap(6*44+8,120,o,'Sticky notes to sort')+picGraph(rows,{max:6,title:'Our favorite colors'});
    const counts=rows.map(r=>`${r.label} ${r.n}`).join(', ');
    q('r').innerHTML=done.size===PILE.length?`<span class="ok">All ${PILE.length} votes sorted! ${counts}.</span>`:`Sorted: <b>${done.size}</b> of ${PILE.length}`;
  };
  q('f').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(g){done.add(+g.dataset.i);draw();}});
  q('one').onclick=()=>{const i=PILE.findIndex((_,i)=>!done.has(i));if(i>=0){done.add(i);draw();}};
  q('clr').onclick=()=>{done.clear();draw();};
  draw();
}
const WEATHER=[{label:'Sunny',n:9,pic:'sun'},{label:'Cloudy',n:7,pic:'cloud'},{label:'Rainy',n:5,pic:'rain'}];
function wReadPic(el){
  const q=Q(el);let hi=-1;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((r,i)=>`<button type="button" class="ghost-btn" data-row="${i}">${r.label}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=picGraph(WEATHER,{hi,title:'Weather on school days in March',unit:'1 day'});
    q('r').innerHTML=hi<0?'Tap a kind of weather to count its row.':`There were <b>${WEATHER[hi].n} ${WEATHER[hi].label.toLowerCase()} days</b>.`+(hi===0?' That’s the longest row: the most days.':hi===2?' That’s the shortest row: the fewest days.':'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b){hi=+b.dataset.row;draw();}});
  draw();
}
function wTotal(el){
  const q=Q(el),added=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((r,i)=>`<button type="button" class="ghost-btn" data-row="${i}">Add ${r.label.toLowerCase()}</button>`).join('')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const order=[...added];
    q('f').innerHTML=picGraph(WEATHER,{hi:order.length?order[order.length-1]:-1,title:'Weather on school days in March',unit:'1 day'});
    el.querySelectorAll('[data-row]').forEach(b=>b.disabled=added.has(+b.dataset.row));
    const sum=order.reduce((s,i)=>s+WEATHER[i].n,0);
    q('r').innerHTML=!order.length?'Add each row to find how many days in all.':`<b>${order.map(i=>WEATHER[i].n).join(' + ')} = ${sum}</b>`+(order.length===WEATHER.length?`<br><span class="ok">There were ${sum} school days in all.</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-row]');if(b){added.add(+b.dataset.row);draw();}});
  q('clr').onclick=()=>{added.clear();draw();};
  draw();
}
/* this chapter's quick-check figures (common.js has the shared ones) */
Object.assign(F,{
  colors:picGraph([{label:'Red',n:4,pic:'note',c:'red'},{label:'Blue',n:6,pic:'note',c:'blue'},{label:'Green',n:3,pic:'note',c:'green'},{label:'Yellow',n:5,pic:'note',c:'yellow'}],{title:'Favorite colors in Room 12'}),
  weather:picGraph(WEATHER,{title:'Weather on school days in March',unit:'1 day'}),
  pets:picGraph([{label:'Dogs',n:6,pic:'dot',c:'yellow'},{label:'Cats',n:4,pic:'dot',c:'blue'},{label:'Fish',n:3,pic:'dot',c:'green'}],{title:'Pets in Room 8',unit:'1 pet'})
});
const STEPS=[
    {title:'Sort the votes',widget:wSort,
      body:'<p>A class voted for their favorite color. Each sticky note is one vote.</p><p>Tap each note to put it in its row. A <b>picture graph</b> shows each vote as one picture.</p>',
      check:{kind:'num',unit:'students',answer:5,fig:F.colors,q:'How many students chose yellow?',
        misc:[[18,'That’s every vote. Count only the yellow row.'],[6,'That’s the blue row. Find the row labeled Yellow.'],[4,'That’s the red row. Find the row labeled Yellow.']],
        explain:'The yellow row has 5 pictures, and each picture is 1 student.'}},
    {title:'Read a picture graph',widget:wReadPic,
      body:'<p>The longest row has the <b>most</b>. The shortest row has the <b>fewest</b>.</p><p>Tap each kind of weather to count its row.</p>',
      check:{kind:'mc',q:'Which kind of day happened the fewest times?',fig:F.weather,
        choices:[{id:'sun',label:'Sunny'},{id:'cloud',label:'Cloudy'},{id:'rain',label:'Rainy'}],answer:'rain',
        why:{sun:'Sunny has the most pictures. Fewest means the shortest row.',cloud:'Cloudy has fewer than sunny, but rainy has even fewer.'},
        explain:'Rainy has 5 pictures, the shortest row: 5 is fewer than 7 and 9.'}},
    {title:'How many in all?',widget:wTotal,
      body:'<p>To find how many in all, add every row.</p><p>Tap to add each row.</p>',
      check:{kind:'num',unit:'pets',answer:13,fig:F.pets,q:'How many pets are in this graph in all?',
        misc:[[6,'That’s only the dogs. Add all three rows.'],[10,'That’s dogs and cats. Add the fish too.'],[3,'That’s only the fish. Add all three rows.']],
        explain:'6 + 4 + 3 = 13 pets.'}}
  ];
