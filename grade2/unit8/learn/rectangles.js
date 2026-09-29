/* Learn Equal Groups (Grade 2 Unit 8), chapter 5: Rectangles and squares. Its widgets and steps; loaded by rectangles.html. */
/* r rows of c square tiles, gap pixels apart (0: pushed together into a rectangle). The picture keeps the same size either way. */
function tileFig(r,c,{gap=0,label}={}){
  const T=40,S=14,W=c*T+(c-1)*S,H=r*T+(r-1)*S,dx=(W-c*T-(c-1)*gap)/2,dy=(H-r*T-(r-1)*gap)/2;
  let o=range(r*c).map(n=>`<rect class="tile" x="${8+dx+n%c*(T+gap)}" y="${8+dy+Math.floor(n/c)*(T+gap)}" width="${T}" height="${T}"/>`).join('');
  if(!gap)o+=`<rect class="rim" x="${8+dx}" y="${8+dy}" width="${c*T}" height="${r*T}"/>`;
  return svgWrap(W+16,H+16,o,label||(gap?`${r*c} square tiles in ${pl(r,'row')} of ${c}, with gaps`:`A rectangle made of ${pl(r*c,'square')}: ${pl(r,'row')} of ${c}`));
}
/* A w × h rectangle cut into pieces: rects [[x, y, w, h]] in units of U pixels.
   on(i): color piece i in. num(i): a number to write in piece i. tap: pieces can be tapped (data-i). */
const fx=v=>+v.toFixed(2);
function pieces(w,h,rects,{U=56,on=()=>false,num=()=>null,tap=false,label}={}){
  const o=rects.map(([x,y,a,b],i)=>{
    const X=fx(6+x*U),Y=fx(6+y*U),n=num(i);
    return `<g${tap?` data-i="${i}"`:''}><rect class="pc${on(i)?' on':''}" x="${X}" y="${Y}" width="${fx(a*U)}" height="${fx(b*U)}"/>`+(n!=null?`<text class="lbl dk" x="${fx(X+a*U/2)}" y="${fx(Y+b*U/2)}">${n}</text>`:'')+'</g>';
  }).join('');
  return svgWrap(12+w*U,12+h*U,o,label);
}
/* the pieces of a w × h rectangle cut into r rows and c columns */
const cutGrid=(w,h,r,c)=>range(r*c).map(n=>[n%c*w/c,Math.floor(n/c)*h/r,w/c,h/r]);
function wTiles(el){
  const q=Q(el),st={rows:3,cols:4};let push=false;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st;q('rows').textContent=r;q('cols').textContent=c;
    q('go').textContent=push?'Pull them apart':'Push them together';
    q('f').innerHTML=tileFig(r,c,{gap:push?0:14});
    q('r').innerHTML=push?`<span class="ok">A rectangle made of ${pl(r*c,'square')}!</span><br><span class="dimline">No gaps and no overlaps. ${pl(r,'row')} of ${c}: ${addends(r,c)} = ${r*c}.</span>`
      :`<b>${pl(r*c,'tile')}</b> in ${pl(r,'row')} of ${c}.<br><span class="dimline">Tap Push them together.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},()=>{push=false;draw();});
  q('go').onclick=()=>{push=!push;draw();};
  draw();
}
/* cut a rectangle (CUT: [width, height]) into rows and columns until the pieces are squares */
const CUT=[[4,3],[5,2],[4,2]];
function wCut(el){
  const q=Q(el),st={rows:2,cols:2};let p=0;
  el.innerHTML=seg('Rectangle',CUT.map((_,i)=>[i,`Rectangle ${i+1}`]))+`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [w,h]=CUT[p],{rows:r,cols:c}=st,pw=w/c,ph=h/r,sq=Math.abs(pw-ph)<1e-9;
    q('rows').textContent=r;q('cols').textContent=c;press(el,p);
    q('f').innerHTML=pieces(w,h,cutGrid(w,h,r,c),{U:Math.min(64,300/w),on:()=>sq,label:`A rectangle cut into ${pl(r,'row')} and ${pl(c,'column')}`+(sq?' of squares':'')});
    q('r').innerHTML=sq?`<span class="ok">Same-size squares! ${pl(r,'row')} of ${c}: ${r*c} squares.</span>`
      :pw>ph?`${pl(r,'row')} and ${pl(c,'column')}. These pieces are wider than they are tall.<br><span class="dimline">Try more columns, or fewer rows.</span>`
      :`${pl(r,'row')} and ${pl(c,'column')}. These pieces are taller than they are wide.<br><span class="dimline">Try more rows, or fewer columns.</span>`;
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* tap each square of a rectangle to count it */
function wCountSq(el){
  const q=Q(el),st={rows:3,cols:4};let order=[];
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('rows','Rows')}${stepper('cols','Columns')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {rows:r,cols:c}=st,n=r*c;q('rows').textContent=r;q('cols').textContent=c;
    q('f').innerHTML=pieces(c,r,cutGrid(c,r,r,c),{on:i=>order.includes(i),num:i=>order.includes(i)?order.indexOf(i)+1:null,tap:true,
      label:`A rectangle cut into ${pl(r,'row')} of ${c} squares, ${order.length} counted`});
    q('r').innerHTML=order.length===n?`<span class="ok"><b>${pl(n,'square')}!</b></span><br><span class="dimline">${pl(r,'row')} of ${c}: ${addends(r,c)} = ${n}.</span>`
      :order.length?`You counted <b>${order.length}</b> so far.`:'Tap each square to count it.';
  };
  steppers(el,st,{rows:[1,5],cols:[1,5]},()=>{order=[];draw();});
  el.addEventListener('click',e=>{const t=e.target.closest('[data-i]');if(t&&!order.includes(+t.dataset.i)){order.push(+t.dataset.i);draw();}});
  q('clr').onclick=()=>{order=[];draw();};
  draw();
}
const cutPic=(rects,l)=>pieces(4,3,rects,{U:40,label:l});
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
