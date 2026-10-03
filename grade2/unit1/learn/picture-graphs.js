/* Learn Adding, Subtracting, and Working with Data (Grade 2 Unit 1), chapter 3: Picture graphs. Its widgets and steps; loaded by picture-graphs.html. */
const COLORS=[{c:'red',label:'Red'},{c:'blue',label:'Blue'},{c:'green',label:'Green'},{c:'yellow',label:'Yellow'}];
/* Sort a pile of sticky-note votes into a picture graph: tap a note to sort it. */
function wSort(el){
  /* PILE: each vote's color; sorted: the votes sorted so far */
  const q=Q(el),PILE=['blue','red','green','blue','yellow','red','blue','green','blue','red','yellow','blue'],sorted=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-one>Sort one</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let markup=`<text class="lbl st" x="4" y="14">${sorted.size<PILE.length?'Tap a vote to sort it':'All sorted!'}</text>`;
    // two rows of six, each note with a 44px tap area
    PILE.forEach((color,i)=>{const x=26+i%6*44,y=48+Math.floor(i/6)*44;if(!sorted.has(i))markup+=`<g data-i="${i}" class="tapme"><rect class="hit" x="${x-22}" y="${y-22}" width="44" height="44"/>${PIC.note(x,y,color)}</g>`;});
    const rows=COLORS.map(color=>({...color,pic:'note',n:[...sorted].filter(i=>PILE[i]===color.c).length}));
    q('f').innerHTML=svgWrap(6*44+8,120,markup,'Sticky notes to sort')+picGraph(rows,{max:6,title:'Our favorite colors'});
    const counts=rows.map(row=>`${row.label} ${row.n}`).join(', ');
    q('r').innerHTML=sorted.size===PILE.length?`<span class="ok">All ${PILE.length} votes sorted! ${counts}.</span>`:`Sorted: <b>${sorted.size}</b> of ${PILE.length}`;
  };
  q('f').addEventListener('click',e=>{const note=e.target.closest('[data-i]');if(note){sorted.add(+note.dataset.i);draw();}});
  q('one').onclick=()=>{const next=PILE.findIndex((_,i)=>!sorted.has(i));if(next>=0){sorted.add(next);draw();}};
  q('clr').onclick=()=>{sorted.clear();draw();};
  draw();
}
const WEATHER=[{label:'Sunny',n:9,pic:'sun'},{label:'Cloudy',n:7,pic:'cloud'},{label:'Rainy',n:5,pic:'rain'}];
/* Tap a kind of weather to count its row. */
function wReadPic(el){
  /* picked: the row picked (-1 for none) */
  const q=Q(el);let picked=-1;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((row,i)=>`<button type="button" class="ghost-btn" data-row="${i}">${row.label}</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=picGraph(WEATHER,{hi:picked,title:'Weather on school days in March',unit:'1 day'});
    q('r').innerHTML=picked<0?'Tap a kind of weather to count its row.':`There were <b>${WEATHER[picked].n} ${WEATHER[picked].label.toLowerCase()} days</b>.`+(picked===0?' That’s the longest row: the most days.':picked===2?' That’s the shortest row: the fewest days.':'');
  };
  el.addEventListener('click',e=>{const rowBtn=e.target.closest('[data-row]');if(rowBtn){picked=+rowBtn.dataset.row;draw();}});
  draw();
}
/* Add the rows one at a time to find how many days in all. */
function wTotal(el){
  /* added: the rows added so far, in the order they were added */
  const q=Q(el),added=new Set();
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${WEATHER.map((row,i)=>`<button type="button" class="ghost-btn" data-row="${i}">Add ${row.label.toLowerCase()}</button>`).join('')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const order=[...added];
    q('f').innerHTML=picGraph(WEATHER,{hi:order.length?order[order.length-1]:-1,title:'Weather on school days in March',unit:'1 day'});
    el.querySelectorAll('[data-row]').forEach(b=>b.disabled=added.has(+b.dataset.row));
    const sum=order.reduce((total,i)=>total+WEATHER[i].n,0);
    q('r').innerHTML=!order.length?'Add each row to find how many days in all.':`<b>${order.map(i=>WEATHER[i].n).join(' + ')} = ${sum}</b>`+(order.length===WEATHER.length?`<br><span class="ok">There were ${sum} school days in all.</span>`:'');
  };
  el.addEventListener('click',e=>{const rowBtn=e.target.closest('[data-row]');if(rowBtn){added.add(+rowBtn.dataset.row);draw();}});
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
