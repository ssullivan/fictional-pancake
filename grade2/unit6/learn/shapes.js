/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 1: Shapes. Its widgets and steps; loaded by shapes.html. */
/* thumbnail buttons (data-m) with a small picture in each */
const thumbs=(label,list)=>`<div class="thumbs" role="group" aria-label="${label}">${list.map(([id,svg])=>`<button type="button" class="thumb" data-m="${id}">${svg}</button>`).join('')}</div>`;
const GAL=[SHAPES[3][2],SHAPES[4][4],SHAPES[4][5],SHAPES[5][1],SHAPES[6][1],SHAPES[6][2]];
function wSides(el){
  const q=Q(el);let p=0,counted=false;
  el.innerHTML=thumbs('Shape',GAL.map((s,i)=>[i,shapeFig(s,{s:100},`Shape ${i+1}`)]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const s=GAL[p],n=s.length;press(el,p);el.querySelectorAll('.thumb').forEach((b,i)=>b.classList.toggle('cur',i===p));
    q('f').innerHTML=shapeFig(s,{s:200,nums:counted},`Shape ${p+1}`);
    q('go').textContent=counted?'Hide the numbers':'Count the sides';
    q('r').innerHTML=counted?`<b>${n} sides</b> and <b>${n} corners</b>.<br><span class="ok">It’s a <b>${SHAPE_NAME[n]}</b>.</span>`
      :`How many sides? Put your finger on one side and go all the way around.<br><span class="dimline">3 sides: triangle. 4: quadrilateral. 5: pentagon. 6: hexagon.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;counted=false;draw();}});
  q('go').onclick=()=>{counted=!counted;draw();};
  draw();
}
/* a dot grid: tap dots to make corners, and tap the first dot again to close the shape */
const GX=6,GY=5,GS=56,dotAt=i=>[20+i%GX*GS,20+Math.floor(i/GX)*GS];
function wDraw(el){
  const q=Q(el);let goal=3,pts=[],closed=false;
  el.innerHTML=seg('Draw',[3,4,5,6].map(n=>[n,`A ${SHAPE_NAME[n]}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  /* corners: dots where the drawing turns (a dot in the middle of a straight side isn't a corner) */
  const corners=()=>pts.filter((v,j)=>cross(dotAt(pts[(j+pts.length-1)%pts.length]),dotAt(v),dotAt(pts[(j+1)%pts.length]))!==0).length;
  const tangled=()=>{
    const S=pts.map((v,j)=>[dotAt(v),dotAt(pts[(j+1)%pts.length])]),n=S.length;
    return S.some(([a,b],i)=>S.some(([c,d],j)=>j>i+1&&!(i===0&&j===n-1)&&cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0));
  };
  const draw=()=>{
    press(el,goal);
    const P=pts.map(v=>dotAt(v).join(',')).join(' ');
    q('f').innerHTML=svgWrap(40+(GX-1)*GS,40+(GY-1)*GS,(closed?`<polygon class="shp" points="${P}"/>`:pts.length>1?`<polyline class="drawn" points="${P}"/>`:'')
      +range(GX*GY).map(i=>{const [x,y]=dotAt(i);return `<circle class="dotg${!closed&&pts.length>2&&i===pts[0]?' first':''}" cx="${x}" cy="${y}" r="${pts.includes(i)?7:5}"/><circle class="hit" data-i="${i}" cx="${x}" cy="${y}" r="24"/>`;}).join(''),'A grid of dots to draw on');
    const n=closed?corners():0,name=SHAPE_NAME[goal];
    q('r').innerHTML=!closed?(pts.length<3?`Draw a <b>${name}</b>. Tap dots to make its corners.`:`${pts.length} corners so far. Tap the <b>gold dot</b> to close the shape.`)
      :tangled()?'<span class="no">The sides cross each other.</span> Start over and go around the outside.'
      :n<3?'<span class="no">Those dots are all in a line.</span> That’s not a shape. Start over.'
      :n===goal?`<span class="ok">You drew a <b>${name}</b>! It has ${n} sides and ${n} corners.</span><br><span class="dimline">Pick another shape to draw.</span>`
      :`That shape has <b>${n} sides</b> and <b>${n} corners</b>${SHAPE_NAME[n]?`: a ${SHAPE_NAME[n]}`:''}.<br><span class="dimline">A ${name} has ${goal} sides. Start over and try again.</span>`;
  };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-m]');if(b){goal=+b.dataset.m;pts=[];closed=false;draw();return;}
    const d=e.target.closest('[data-i]');if(!d||closed)return;const i=+d.dataset.i;
    if(i===pts[0]&&pts.length>2)closed=true;else if(!pts.includes(i))pts.push(i);
    draw();
  });
  q('clr').onclick=()=>{pts=[];closed=false;draw();};
  draw();
}
const CM=36;
function wSideLen(el){
  const q=Q(el),st={w:5,h:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('w','Long')}${stepper('h','Tall')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {w,h}=st,X=56,Y=42,x2=X+w*CM,y2=Y+h*CM,k=11;q('w').textContent=w;q('h').textContent=h;
    const grid=range(7).map(i=>`<line class="gridl" x1="${X+i*CM}" y1="${Y}" x2="${X+i*CM}" y2="${Y+5*CM}"/>`).join('')+range(6).map(i=>`<line class="gridl" x1="${X}" y1="${Y+i*CM}" x2="${X+6*CM}" y2="${Y+i*CM}"/>`).join('');
    const marks=[[X,Y,1,1],[x2,Y,-1,1],[x2,y2,-1,-1],[X,y2,1,-1]].map(([a,b,u,v])=>`<path class="sqc" d="M${a+u*k},${b}V${b+v*k}H${a}"/>`).join('');
    q('f').innerHTML=svgWrap(X+6*CM+60,Y+5*CM+36,grid+`<rect class="shp" x="${X}" y="${Y}" width="${w*CM}" height="${h*CM}"/>`+marks
      +`<text class="lbl s cy" x="${(X+x2)/2}" y="${Y-16}">${w} cm</text><text class="lbl s cy" x="${(X+x2)/2}" y="${y2+16}">${w} cm</text><text class="lbl s cy en" x="${X-8}" y="${(Y+y2)/2}">${h} cm</text><text class="lbl s cy st" x="${x2+8}" y="${(Y+y2)/2}">${h} cm</text>`,
      `A shape ${w} centimeters long and ${h} centimeters tall on a centimeter grid`);
    q('r').innerHTML=`Sides: <b>${w} cm, ${h} cm, ${w} cm, ${h} cm</b>. 4 square corners.<br>`+(w===h?`<span class="ok">All 4 sides are the same length, and every corner is a square corner. It’s a <b>square</b>!</span>`
      :`<span class="dimline">Sides across from each other match. It’s a <b>rectangle</b>. Can you make all 4 sides the same length?</span>`);
  };
  steppers(el,st,{w:[1,6],h:[1,5]},draw);
  draw();
}
const SOL=[['cube','Cube'],['box','Box'],['pyramid','Pyramid'],['prism','Triangle prism']];
function wSolid(el){
  const q=Q(el);let k='cube',back=false;
  el.innerHTML=seg('Solid shape',SOL)+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const S=SOLIDS[k],svg=solidFig(k,{back,s:130}),seen=(svg.match(/class="sf /g)||[]).length,all=S.faces.reduce((t,[n])=>t+n,0);press(el,k);
    q('f').innerHTML=svg;
    q('go').textContent=back?'Hide the back':'Show the back';
    q('r').innerHTML=`You can see <b>${seen} faces</b> from the front.`+(back?`<br><span class="ok">A ${S.name} has <b>${all} faces</b>: ${S.faces.map(([n,w])=>`${n} ${w}${n>1?'s':''}`).join(' and ')}.</span><br><span class="dimline">The dashed lines are edges on the back.</span>`
      :`<br><span class="dimline">Some faces are on the back and the bottom. How many faces in all?</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=b.dataset.m;back=false;draw();}});
  q('go').onclick=()=>{back=!back;draw();};
  draw();
}
const STEPS=[
    {title:'Sides and corners',widget:wSides,
      body:'<p>A shape’s name tells how many <b>sides</b> it has. A <b>triangle</b> has 3. A <b>quadrilateral</b> has 4. A <b>pentagon</b> has 5. A <b>hexagon</b> has 6.</p><p>Shapes can look very different and still have the same name. Pick a shape and count.</p>',
      check:{kind:'num',unit:'sides',answer:6,fig:shapeFig(SHAPES[6][1],{s:150},'A shape shaped like the letter L'),q:'How many sides does this shape have?',
        misc:[[4,'The L shape has short sides too. Count every straight side.'],[5,'Count again. Start at one corner and go all the way around.'],[2,'Count every straight side, all the way around.']],
        explain:'It has 6 sides and 6 corners, so it’s a hexagon, even though it doesn’t look like the other hexagons.'}},
    {title:'Draw shapes',widget:wDraw,
      body:'<p>Each side is a straight line. A <b>corner</b> is where two sides meet. A shape always has the same number of sides and corners.</p><p>Pick a shape. Tap dots to draw it.</p>',
      check:{kind:'num',unit:'sides',answer:5,q:'Lin drew a shape with 5 corners. How many sides does it have?',
        misc:[[4,'A shape has the same number of sides as corners.'],[6,'A shape has the same number of sides as corners.']],
        explain:'Every corner is where two sides meet. 5 corners means 5 sides: a pentagon.'}},
    {title:'Side lengths',widget:wSideLen,
      body:'<p>Some shapes have sides that are the same length. A corner like the corner of a paper is a <b>square corner</b>.</p><p>A <b>square</b> has 4 sides that are all the same length and 4 square corners. Change the sides and see.</p>',
      check:{kind:'mc',q:'Which shape has 4 sides that are all the same length?',fig:shapeRow([[QUADS.rectangle,{lens:['6 cm','3 cm','6 cm','3 cm']}],[QUADS.square,{lens:['4 cm','4 cm','4 cm','4 cm']}],[QUADS.trapezoid,{lens:['3 cm','4 cm','6 cm','4 cm']}]],{letters:true,label:'Shape'}),
        choices:[{id:'a',label:'A'},{id:'b',label:'B'},{id:'c',label:'C'}],answer:'b',
        why:{a:'Shape A has two sides that are 6 cm and two that are 3 cm.',c:'Shape C has sides of 3, 4, 6, and 4 cm. They aren’t all the same.'},
        explain:'Every side of shape B is 4 cm. It’s a square.'}},
    {title:'Solid shapes',widget:wSolid,
      body:'<p>A <b>solid shape</b> isn’t flat. Its flat sides are called <b>faces</b>. A <b>cube</b> has faces that are all squares.</p><p>Some faces hide on the back. Pick a shape and show the back.</p>',
      check:{kind:'num',unit:'faces',answer:6,fig:solidFig('cube',{s:110}),q:'How many faces does a cube have?',
        misc:[[3,'That’s how many you can see. There are more on the back, the bottom, and the left.'],[8,'8 is the number of corners. Count the flat faces.'],[12,'12 is the number of edges. Count the flat faces.'],[4,'Don’t forget the top and the bottom.']],
        explain:'Front and back, top and bottom, left and right: a cube has 6 square faces.'}}
  ];
