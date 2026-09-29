/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 2: Halves, thirds, and fourths. Its widgets and steps; loaded by halves-thirds-fourths.html. */
const FILL=[['triangle',6],['rhombus',3],['trapezoid',2]];
function wBlocks(el){
  const q=Q(el),st={n:1};let p=0;
  el.innerHTML=seg('Blocks',FILL.map(([b],i)=>[i,b[0].toUpperCase()+b.slice(1)+(b==='rhombus'?'es':'s')]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Blocks')}</div><p class="readout" data-r></p>`;
  const lim={n:[1,6]};
  const draw=()=>{
    const [b,max]=FILL[p],n=st.n,pl=b==='rhombus'?'rhombuses':b+'s';press(el,p);q('n').textContent=n;
    q('f').innerHTML=pbFig('hexagon',b,{show:n,s:90});
    q('r').innerHTML=n===max?`<span class="ok"><b>${max} ${pl}</b> make a hexagon!</span><br><span class="dimline">Try another kind of block.</span>`
      :`<b>${n} ${n>1?pl:b}</b>. Tap + to fill the hexagon.`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.n=1;lim.n[1]=FILL[p][1];draw();}});
  draw();
}
function wShare(el){
  const q=Q(el);let shape='circle',n=2,on=[];
  el.innerHTML=seg('Shape',[['circle','Circle'],['rect','Rectangle']])+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,shape);
    q('c').innerHTML=[2,3,4].map(k=>`<button type="button" class="chip" data-e="${k}" aria-pressed="${k===n}">${PART[k][1][0].toUpperCase()+PART[k][1].slice(1)}</button>`).join('');
    q('f').innerHTML=shareFig(shape,n,'v',{shade:on,tap:true,s:170});
    const k=on.length,w=shape==='rect'?'rectangle':'circle';
    q('r').innerHTML=`${n} equal parts. Each part is <b>1 ${PART[n][0]}</b> of the ${w}.<br>`+(!k?'<span class="dimline">Tap a part to color it in.</span>'
      :k===n?`<span class="ok"><b>${partName(n,n)}</b> make the whole ${w}!</span>`:`<span class="ok"><b>${partName(n,k)}</b> colored in.</span>`);
  };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-m]');if(b){shape=b.dataset.m;on=[];draw();return;}
    const c=e.target.closest('[data-e]');if(c){n=+c.dataset.e;on=[];draw();return;}
    const d=e.target.closest('[data-i]');if(d){const i=+d.dataset.i;on=on.includes(i)?on.filter(j=>j!==i):[...on,i];draw();}
  });
  draw();
}
const CUTS=[['grid','Squares'],['v','Strips'],['diag','Triangles'],['uneq','Uneven']];
function wSameSize(el){
  const q=Q(el);let c='grid';
  el.innerHTML=seg('Cut',CUTS)+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,c);
    q('f').innerHTML=shareFig('square',4,c,{shade:[0,2],s:180});
    q('r').innerHTML=c==='uneq'?'<span class="no">4 pieces, but they are not the same size.</span> These are <b>not</b> fourths.<br><span class="dimline">Fourths have to be equal.</span>'
      :`4 equal pieces: each one is <b>1 fourth</b> of the square.<br><span class="dimline">Try the other cuts. The pieces look different, but each is still 1 fourth of the same square.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){c=b.dataset.m;draw();}});
  draw();
}
function wWhole(el){
  const q=Q(el),st={n:2};let k=0;
  el.innerHTML=`<p class="story">Cut a granola bar into equal pieces. Then eat them one at a time!</p><div class="fig" data-f></div><div class="wrow">${stepper('n','Pieces')}<button type="button" class="btn" data-go>Eat a piece</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=st.n;q('n').textContent=n;q('go').disabled=k>=n;
    q('f').innerHTML=shareFig('rect',n,'v',{shade:range(k),s:120,label:`A granola bar cut into ${n} equal pieces, ${k} eaten`});
    q('r').innerHTML=(k===n?`<span class="ok">You ate the whole thing! <b>${partName(n,n)}</b> make 1 whole bar.</span>`:`Each piece is <b>1 ${PART[n][0]}</b>.${k?` You ate <b>${partName(n,k)}</b>.`:''}`)
      +`<br><span class="dimline">More pieces means smaller pieces. 1 fourth is less than 1 third, and 1 third is less than 1 half.</span>`;
  };
  steppers(el,st,{n:[2,4]},()=>{k=0;draw();});
  q('go').onclick=()=>{k++;draw();};
  draw();
}
const STEPS=[
    {title:'Build with blocks',widget:wBlocks,
      body:'<p>Small shapes can fill a bigger shape. Pattern blocks can make a <b>hexagon</b> in different ways.</p><p>Pick a block. Fill the hexagon.</p>',
      check:{kind:'num',unit:'triangles',answer:3,fig:pbFig('trapezoid','triangle',{show:0,s:90}),q:'How many triangles make this trapezoid?',
        misc:[[6,'6 triangles make a whole hexagon. The trapezoid is half a hexagon.'],[2,'2 triangles make a rhombus. The trapezoid is bigger.'],[1,'That one triangle only fills part of it. How many fill it all?']],
        explain:'3 triangles fill the trapezoid. 2 trapezoids make a hexagon, and 6 triangles do too.'}},
    {title:'Equal parts',widget:wShare,
      body:'<p>Cut a shape into 2 <b>equal</b> parts: each is a <b>half</b>. 3 equal parts: each is a <b>third</b>. 4 equal parts: each is a <b>fourth</b>, or a quarter.</p><p>Pick a shape and how many parts. Tap parts to color them.</p>',
      check:{kind:'mc',q:'What part of the circle is shaded?',fig:shareFig('circle',3,'v',{shade:[0],s:140}),
        choices:[{id:'a',label:'1 half'},{id:'b',label:'1 fourth'},{id:'c',label:'1 third'}],answer:'c',
        why:{a:'Count all the parts. There are 3 equal parts, not 2.',b:'A fourth is 1 of 4 equal parts. Count the parts.'},
        explain:'The circle has 3 equal parts. 1 of them is shaded: 1 third.'}},
    {title:'Same size, different shape',widget:wSameSize,
      body:'<p>There are lots of ways to cut a square into fourths. The pieces can look different, but they must be the <b>same size</b>.</p><p>Try each cut.</p>',
      check:{kind:'mc',q:'Which picture shows fourths?',
        choices:[{id:'a',label:shareFig('square',4,'uneq',{s:90,label:'Picture A'})},{id:'b',label:shareFig('square',4,'diag',{s:90,label:'Picture B'})},{id:'c',label:shareFig('square',3,'v',{s:90,label:'Picture C'})}],answer:'b',
        why:{a:'That one has 4 pieces, but they are not the same size.',c:'That one has 3 equal pieces. Those are thirds.'},
        explain:'The square cut corner to corner has 4 equal pieces, so each one is a fourth.'}},
    {title:'The whole thing',widget:wWhole,
      body:'<p>2 halves make a whole. 3 thirds make a whole. 4 fourths make a whole.</p><p>The more pieces you cut, the <b>smaller</b> each piece is.</p>',
      check:{kind:'mc',q:'Two pizzas are the same size. One is cut into halves. The other is cut into fourths. Which piece is bigger?',fig:shareRow('circle',[{n:2,shade:[0]},{n:4,shade:[0]}],{label:'Pizza'}),
        choices:[{id:'a',label:'1 half'},{id:'b',label:'1 fourth'},{id:'c',label:'They’re the same'}],answer:'a',
        why:{b:'The pizza cut into fourths has more pieces, so each piece is smaller.',c:'Look at the shaded pieces. Cutting into more pieces makes each piece smaller.'},
        explain:'Halves are bigger than fourths. Fewer pieces means bigger pieces.'}}
  ];
