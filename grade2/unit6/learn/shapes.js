/* Learn Geometry, Time, and Money (Grade 2 Unit 6), chapter 1: Shapes. Its widgets and steps; loaded by shapes.html. */
/* thumbnail buttons (data-m) with a small picture in each: list [[id, svg], …] */
const thumbs=(label,list)=>`<div class="thumbs" role="group" aria-label="${label}">${list.map(([id,svg])=>`<button type="button" class="thumb" data-m="${id}">${svg}</button>`).join('')}</div>`;
/* the shapes to choose from */
const GAL=[SHAPES[3][2],SHAPES[4][4],SHAPES[4][5],SHAPES[5][1],SHAPES[6][1],SHAPES[6][2]];
/* Pick a shape and count its sides; a button numbers them. */
function wSides(el){
  /* counted: the sides are numbered */
  const q=Q(el);let shapeIndex=0,counted=false;
  el.innerHTML=thumbs('Shape',GAL.map((shape,i)=>[i,shapeFig(shape,{s:100},`Shape ${i+1}`)]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const shape=GAL[shapeIndex],sides=shape.length;press(el,shapeIndex);el.querySelectorAll('.thumb').forEach((b,i)=>b.classList.toggle('cur',i===shapeIndex));
    q('f').innerHTML=shapeFig(shape,{s:200,nums:counted},`Shape ${shapeIndex+1}`);
    q('go').textContent=counted?'Hide the numbers':'Count the sides';
    q('r').innerHTML=counted?`<b>${sides} sides</b> and <b>${sides} corners</b>.<br><span class="ok">It’s a <b>${SHAPE_NAME[sides]}</b>.</span>`
      :`How many sides? Put your finger on one side and go all the way around.<br><span class="dimline">3 sides: triangle. 4: quadrilateral. 5: pentagon. 6: hexagon.</span>`;
  };
  el.addEventListener('click',e=>{const shapeBtn=e.target.closest('[data-m]');if(shapeBtn){shapeIndex=+shapeBtn.dataset.m;counted=false;draw();}});
  q('go').onclick=()=>{counted=!counted;draw();};
  draw();
}
/* a dot grid GX columns by GY rows, GS pixels apart: tap dots to make corners, and tap the first dot again to close the shape.
   dotAt(i): where dot i is */
const GX=6,GY=5,GS=56,dotAt=i=>[20+i%GX*GS,20+Math.floor(i/GX)*GS];
/* Draw a shape with a number of sides on a dot grid, and see what was drawn: its corners, or why it isn't a shape. */
function wDraw(el){
  /* goal: the sides to draw; dots: the dots tapped, in order; closed: the shape is closed */
  const q=Q(el);let goal=3,dots=[],closed=false;
  el.innerHTML=seg('Draw',[3,4,5,6].map(n=>[n,`A ${SHAPE_NAME[n]}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  /* the cross product of a→b and a→c: 0 when the three are in a line, and its sign says which way the path turns at b */
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  /* corners: dots where the drawing turns (a dot in the middle of a straight side isn't a corner) */
  const corners=()=>dots.filter((v,j)=>cross(dotAt(dots[(j+dots.length-1)%dots.length]),dotAt(v),dotAt(dots[(j+1)%dots.length]))!==0).length;
  /* whether two sides that don't share a corner cross: each one's ends are on opposite sides of the other */
  const tangled=()=>{
    const sides=dots.map((v,j)=>[dotAt(v),dotAt(dots[(j+1)%dots.length])]),count=sides.length;
    return sides.some(([a,b],i)=>sides.some(([c,d],j)=>j>i+1&&!(i===0&&j===count-1)&&cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0));
  };
  const draw=()=>{
    press(el,goal);
    const points=dots.map(v=>dotAt(v).join(',')).join(' ');
    /* the first dot turns gold once it can close the shape; each dot has a 48-pixel tap area */
    q('f').innerHTML=svgWrap(40+(GX-1)*GS,40+(GY-1)*GS,(closed?`<polygon class="shp" points="${points}"/>`:dots.length>1?`<polyline class="drawn" points="${points}"/>`:'')
      +range(GX*GY).map(i=>{const [x,y]=dotAt(i);return `<circle class="dotg${!closed&&dots.length>2&&i===dots[0]?' first':''}" cx="${x}" cy="${y}" r="${dots.includes(i)?7:5}"/><circle class="hit" data-i="${i}" cx="${x}" cy="${y}" r="24"/>`;}).join(''),'A grid of dots to draw on');
    const sides=closed?corners():0,name=SHAPE_NAME[goal];
    q('r').innerHTML=!closed?(dots.length<3?`Draw a <b>${name}</b>. Tap dots to make its corners.`:`${dots.length} corners so far. Tap the <b>gold dot</b> to close the shape.`)
      :tangled()?'<span class="no">The sides cross each other.</span> Start over and go around the outside.'
      :sides<3?'<span class="no">Those dots are all in a line.</span> That’s not a shape. Start over.'
      :sides===goal?`<span class="ok">You drew a <b>${name}</b>! It has ${sides} sides and ${sides} corners.</span><br><span class="dimline">Pick another shape to draw.</span>`
      :`That shape has <b>${sides} sides</b> and <b>${sides} corners</b>${SHAPE_NAME[sides]?`: a ${SHAPE_NAME[sides]}`:''}.<br><span class="dimline">A ${name} has ${goal} sides. Start over and try again.</span>`;
  };
  el.addEventListener('click',e=>{
    const goalBtn=e.target.closest('[data-m]');if(goalBtn){goal=+goalBtn.dataset.m;dots=[];closed=false;draw();return;}
    const dot=e.target.closest('[data-i]');if(!dot||closed)return;const i=+dot.dataset.i;
    /* tapping the first dot closes the shape; a dot already used is skipped */
    if(i===dots[0]&&dots.length>2)closed=true;else if(!dots.includes(i))dots.push(i);
    draw();
  });
  q('clr').onclick=()=>{dots=[];closed=false;draw();};
  draw();
}
/* pixels per cm on the grid */
const CM=36;
/* A rectangle on a centimeter grid (a stepper for each side): all 4 sides the same makes a square. */
function wSideLen(el){
  const q=Q(el),values={w:5,h:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('w','Long')}${stepper('h','Tall')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* the grid starts at left, top; right and bottom are the rectangle's other sides; markSize: the square-corner marks */
    const {w:long,h:tall}=values,left=56,top=42,right=left+long*CM,bottom=top+tall*CM,markSize=11;q('w').textContent=long;q('h').textContent=tall;
    const grid=range(7).map(i=>`<line class="gridl" x1="${left+i*CM}" y1="${top}" x2="${left+i*CM}" y2="${top+5*CM}"/>`).join('')+range(6).map(i=>`<line class="gridl" x1="${left}" y1="${top+i*CM}" x2="${left+6*CM}" y2="${top+i*CM}"/>`).join('');
    /* a square-corner mark at each corner, pointing in */
    const marks=[[left,top,1,1],[right,top,-1,1],[right,bottom,-1,-1],[left,bottom,1,-1]].map(([x,y,dx,dy])=>`<path class="sqc" d="M${x+dx*markSize},${y}V${y+dy*markSize}H${x}"/>`).join('');
    q('f').innerHTML=svgWrap(left+6*CM+60,top+5*CM+36,grid+`<rect class="shp" x="${left}" y="${top}" width="${long*CM}" height="${tall*CM}"/>`+marks
      +`<text class="lbl s cy" x="${(left+right)/2}" y="${top-16}">${long} cm</text><text class="lbl s cy" x="${(left+right)/2}" y="${bottom+16}">${long} cm</text><text class="lbl s cy en" x="${left-8}" y="${(top+bottom)/2}">${tall} cm</text><text class="lbl s cy st" x="${right+8}" y="${(top+bottom)/2}">${tall} cm</text>`,
      `A shape ${long} centimeters long and ${tall} centimeters tall on a centimeter grid`);
    q('r').innerHTML=`Sides: <b>${long} cm, ${tall} cm, ${long} cm, ${tall} cm</b>. 4 square corners.<br>`+(long===tall?`<span class="ok">All 4 sides are the same length, and every corner is a square corner. It’s a <b>square</b>!</span>`
      :`<span class="dimline">Sides across from each other match. It’s a <b>rectangle</b>. Can you make all 4 sides the same length?</span>`);
  };
  steppers(el,values,{w:[1,6],h:[1,5]},draw);
  draw();
}
/* the solid shapes, and their button labels */
const SOL=[['cube','Cube'],['box','Box'],['pyramid','Pyramid'],['prism','Triangle prism']];
/* A solid shape: count the faces you can see, then show the back to count them all. */
function wSolid(el){
  const q=Q(el);let kind='cube',back=false;
  el.innerHTML=seg('Solid shape',SOL)+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* seen: the faces drawn from the front */
    const solid=SOLIDS[kind],svg=solidFig(kind,{back,s:130}),seen=(svg.match(/class="sf /g)||[]).length,faces=solid.faces.reduce((total,[n])=>total+n,0);press(el,kind);
    q('f').innerHTML=svg;
    q('go').textContent=back?'Hide the back':'Show the back';
    q('r').innerHTML=`You can see <b>${seen} faces</b> from the front.`+(back?`<br><span class="ok">A ${solid.name} has <b>${faces} faces</b>: ${solid.faces.map(([n,shape])=>`${n} ${shape}${n>1?'s':''}`).join(' and ')}.</span><br><span class="dimline">The dashed lines are edges on the back.</span>`
      :`<br><span class="dimline">Some faces are on the back and the bottom. How many faces in all?</span>`);
  };
  el.addEventListener('click',e=>{const kindBtn=e.target.closest('[data-m]');if(kindBtn){kind=kindBtn.dataset.m;back=false;draw();}});
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
