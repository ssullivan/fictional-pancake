/* Learn Equal Groups (Grade 2 Unit 8), chapter 5: Rectangles and squares. Its widgets and steps; loaded by rectangles.html. */
/* rows of cols square tiles, gap pixels apart (0: pushed together into a rectangle). The picture keeps the same size either way. */
function tileFig(rows,cols,{gap=0,label}={}){
  /* tiles are tileSize square; the picture is sized for the widest gap (MAX_GAP), and the tiles are centered in it */
  const tileSize=40,MAX_GAP=14,width=cols*tileSize+(cols-1)*MAX_GAP,height=rows*tileSize+(rows-1)*MAX_GAP,
    dx=(width-cols*tileSize-(cols-1)*gap)/2,dy=(height-rows*tileSize-(rows-1)*gap)/2;
  let markup=range(rows*cols).map(n=>`<rect class="tile" x="${8+dx+n%cols*(tileSize+gap)}" y="${8+dy+Math.floor(n/cols)*(tileSize+gap)}" width="${tileSize}" height="${tileSize}"/>`).join('');
  if(!gap)markup+=`<rect class="rim" x="${8+dx}" y="${8+dy}" width="${cols*tileSize}" height="${rows*tileSize}"/>`;
  return svgWrap(width+16,height+16,markup,label||(gap?`${rows*cols} square tiles in ${pl(rows,'row')} of ${cols}, with gaps`:`A rectangle made of ${pl(rows*cols,'square')}: ${pl(rows,'row')} of ${cols}`));
}
/* v to 2 decimal places, so pieces cut in thirds write short numbers */
const fx=v=>+v.toFixed(2);
/* A w × h rectangle cut into pieces: rects [[x, y, width, height]] in units of U pixels.
   on(i): color piece i in. num(i): a number to write in piece i. tap: pieces can be tapped (data-i). */
function pieces(w,h,rects,{U=56,on=()=>false,num=()=>null,tap=false,label}={}){
  const markup=rects.map(([x,y,width,height],i)=>{
    const left=fx(6+x*U),top=fx(6+y*U),n=num(i);
    return `<g${tap?` data-i="${i}"`:''}><rect class="pc${on(i)?' on':''}" x="${left}" y="${top}" width="${fx(width*U)}" height="${fx(height*U)}"/>`+(n!=null?`<text class="lbl dk" x="${fx(left+width*U/2)}" y="${fx(top+height*U/2)}">${n}</text>`:'')+'</g>';
  }).join('');
  return svgWrap(12+w*U,12+h*U,markup,label);
}
/* the pieces of a w × h rectangle cut into `rows` rows and `cols` columns */
const cutGrid=(w,h,rows,cols)=>range(rows*cols).map(n=>[n%cols*w/cols,Math.floor(n/cols)*h/rows,w/cols,h/rows]);
/* Square tiles in rows and columns (a stepper for each): push them together into a rectangle. */
function wTiles(el){
  /* pushed: the tiles are pushed together (and come apart when a stepper changes) */
  const q=Q(el),values={rows:3,cols:4};let pushed=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows,cols}=values;q('rows').textContent=rows;q('cols').textContent=cols;
    q('go').textContent=pushed?'Pull them apart':'Push them together';
    q('f').innerHTML=tileFig(rows,cols,{gap:pushed?0:14});
    q('r').innerHTML=pushed?`<span class="ok">A rectangle made of ${pl(rows*cols,'square')}!</span><br><span class="dimline">No gaps and no overlaps. ${pl(rows,'row')} of ${cols}: ${addends(rows,cols)} = ${rows*cols}.</span>`
      :`<b>${pl(rows*cols,'tile')}</b> in ${pl(rows,'row')} of ${cols}.<br><span class="dimline">Tap Push them together.</span>`;
  };
  steppers(el,values,{rows:[1,5],cols:[1,5]},()=>{pushed=false;draw();});
  q('go').onclick=()=>{pushed=!pushed;draw();};
  draw();
}
/* rectangles to cut: [width, height] */
const CUT=[[4,3],[5,2],[4,2]];
/* Cut a rectangle into rows and columns (a stepper for each) until the pieces are same-size squares. */
function wCut(el){
  const q=Q(el),values={rows:2,cols:2};let rectIndex=0;
  el.innerHTML=seg('Rectangle',CUT.map((_,i)=>[i,`Rectangle ${i+1}`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* each piece is pieceW by pieceH; they're squares when those match */
    const [w,h]=CUT[rectIndex],{rows,cols}=values,pieceW=w/cols,pieceH=h/rows,squares=Math.abs(pieceW-pieceH)<1e-9;
    q('rows').textContent=rows;q('cols').textContent=cols;press(el,rectIndex);
    q('f').innerHTML=pieces(w,h,cutGrid(w,h,rows,cols),{U:Math.min(64,300/w),on:()=>squares,label:`A rectangle cut into ${pl(rows,'row')} and ${pl(cols,'column')}`+(squares?' of squares':'')});
    q('r').innerHTML=squares?`<span class="ok">Same-size squares! ${pl(rows,'row')} of ${cols}: ${rows*cols} squares.</span>`
      :pieceW>pieceH?`${pl(rows,'row')} and ${pl(cols,'column')}. These pieces are wider than they are tall.<br><span class="dimline">Try more columns, or fewer rows.</span>`
      :`${pl(rows,'row')} and ${pl(cols,'column')}. These pieces are taller than they are wide.<br><span class="dimline">Try more rows, or fewer columns.</span>`;
  };
  steppers(el,values,{rows:[1,5],cols:[1,5]},draw);
  el.addEventListener('click',e=>{const rectBtn=e.target.closest('[data-m]');if(rectBtn){rectIndex=+rectBtn.dataset.m;draw();}});
  draw();
}
/* Tap each square of a rectangle (a stepper for the rows and one for the columns) to count it. */
function wCountSq(el){
  /* order: the squares tapped, in order (each gets its count written in it) */
  const q=Q(el),values={rows:3,cols:4};let order=[];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows,cols}=values,total=rows*cols;q('rows').textContent=rows;q('cols').textContent=cols;
    q('f').innerHTML=pieces(cols,rows,cutGrid(cols,rows,rows,cols),{on:i=>order.includes(i),num:i=>order.includes(i)?order.indexOf(i)+1:null,tap:true,
      label:`A rectangle cut into ${pl(rows,'row')} of ${cols} squares, ${order.length} counted`});
    q('r').innerHTML=order.length===total?`<span class="ok"><b>${pl(total,'square')}!</b></span><br><span class="dimline">${pl(rows,'row')} of ${cols}: ${addends(rows,cols)} = ${total}.</span>`
      :order.length?`You counted <b>${order.length}</b> so far.`:'Tap each square to count it.';
  };
  steppers(el,values,{rows:[1,5],cols:[1,5]},()=>{order=[];draw();});
  el.addEventListener('click',e=>{const square=e.target.closest('[data-i]');if(square&&!order.includes(+square.dataset.i)){order.push(+square.dataset.i);draw();}});
  q('clr').onclick=()=>{order=[];draw();};
  draw();
}
/* a 4 × 3 rectangle cut into these pieces, for a quick check's choices */
const cutPic=(rects,label)=>pieces(4,3,rects,{U:40,label});
/* the quick checks' figures */
const F={
  t25:tileFig(2,5),
  pan:pieces(3,4,cutGrid(3,4,4,3),{label:'A pan cut into 4 rows of 3 pieces'})
};
const STEPS=[
    {title:'Arrays make rectangles',widget:wTiles,
      body:'<p>Square tiles in an array can push together to make a <b>rectangle</b>, with no gaps and no overlaps.</p><p>Build an array of tiles, then push them together.</p>',
      check:{kind:'num',unit:'squares',answer:10,fig:F.t25,q:'How many squares make this rectangle?',
        misc:[[7,'2 + 5 adds the rows and the squares in one row. Count every square: 5 + 5.'],[5,'That’s one row. There are 2 rows of 5.']],
        explain:'2 rows of 5: 5 + 5 = 10 squares.'}},
    {title:'Cut into squares',widget:wCut,
      body:'<p>You can cut a rectangle into rows and columns of <b>same-size squares</b>. Each square is as wide as it is tall.</p><p>Pick a rectangle. Change the rows and columns until every piece is a square.</p>',
      check:{kind:'mc',q:'Which rectangle is cut into same-size squares?',
        choices:[{id:'a',label:cutPic([[0,0,2,2],[2,0,1,1],[3,0,1,1],[2,1,1,1],[3,1,1,1],[0,2,1,1],[1,2,1,1],[2,2,1,1],[3,2,1,1]],'Picture A')},{id:'b',label:cutPic(cutGrid(4,3,3,2),'Picture B')},{id:'c',label:cutPic(cutGrid(4,3,3,4),'Picture C')}],answer:'c',
        why:{a:'These are squares, but they aren’t all the same size. The big one is as big as 4 small ones.',b:'These pieces are wider than they are tall. They’re rectangles, not squares.'},
        explain:'Picture C is cut into 3 rows of 4 same-size squares: 12 squares.'}},
    {title:'Count the squares',widget:wCountSq,
      body:'<p>Once a rectangle is cut into squares, count them one at a time, by rows, or by columns.</p><p>Tap each square to count it. Then change the rows and columns.</p>',
      check:{kind:'num',unit:'pieces',answer:12,fig:F.pan,q:'A pan of cornbread is cut into 4 rows, with 3 pieces in each row. How many pieces are there?',
        misc:[[7,'4 + 3 adds the rows and the pieces in one row. Add 3 for every row.'],[9,'That’s 3 rows. There are 4 rows of 3.'],[16,'That’s 4 rows of 4. Each row has 3 pieces.']],
        explain:'3 + 3 + 3 + 3 = 12 pieces.'}}
  ];
