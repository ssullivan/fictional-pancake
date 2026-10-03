/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 6: Lengths and areas. Its widgets and steps; loaded by lengths-areas.html. */
/* lengths to compare: a is x long, b is y */
const LONGER=[
  {x:frac(15,4),y:frac(3,2),a:'the long song',b:'the short song',u:'minutes'},
  {x:frac(9,2),y:frac(3,4),a:'the shelf',b:'a book',u:'feet'},
  {x:frac(10,3),y:frac(5,6),a:'the path',b:'one stride',u:'yards'},
];
/* How many times as long: lay copies of the shorter length along the longer one (a stepper adds copies). */
function wMeasure(el){
  const q=Q(el),values={k:0},limits={k:[0,6]};let pairIndex=0;
  el.innerHTML=seg('Compare',LONGER.map((pair,i)=>[i,`${fx(pair.x)} and ${fx(pair.y)} ${pair.u}`]))+`<div class="wrow">${stepper('k','Copies')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const pair=LONGER[pairIndex],quotient=fDiv(pair.x,pair.y),{k}=values,full=Math.floor(fVal(quotient));press(el,pairIndex);q('k').textContent=k;
    q('f').innerHTML=groupTape(pair.x,pair.y,{upto:k,label:`Tape diagram: ${pair.a}, ${ftx(pair.x)} ${pair.u}, with ${k} copies of ${pair.b}, ${ftx(pair.y)} ${pair.u}`});
    q('r').innerHTML=!k?`How many times as long as ${pair.b} (${fx(pair.y)} ${pair.u}) is ${pair.a} (${fx(pair.x)} ${pair.u})? Lay copies of ${pair.b} along it.`
      :k<=full&&k<limits.k[1]?`${k} cop${k>1?'ies':'y'} of ${pair.b} reach${k>1?'':'es'} ${fx(fMul(frac(k),pair.y))} ${pair.u}.`
      :`<span class="ok">${fx(pair.x)} ÷ ${fx(pair.y)} = <b>${fx(quotient)}</b>: ${pair.a} is ${fx(quotient)} times as long as ${pair.b}.</span><br><span class="dimline">${fx(quotient)} × ${fx(pair.y)} = ${fx(pair.x)}.</span>`;
  };
  /* the stepper goes as far as the copies that cover the longer length */
  const setMax=()=>{limits.k[1]=Math.ceil(fVal(fDiv(LONGER[pairIndex].x,LONGER[pairIndex].y)));};
  steppers(el,values,limits,draw);
  onPick(el,id=>{pairIndex=+id;setMax();values.k=0;draw();});
  setMax();draw();
}

/* A rectangle measured in quarter inches (a stepper for each side), tiled in 1/4-inch squares. */
function wArea(el){
  /* the steppers' values: w and h, in quarter inches */
  const q=Q(el),values={w:14,h:9};
  el.innerHTML=`<div class="wrow">${stepper('w','Width')}${stepper('h','Height')}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const w=frac(values.w,4),h=frac(values.h,4),A=fMul(w,h);
    q('w').innerHTML=`${fx(w)} in`;q('h').innerHTML=`${fx(h)} in`;
    q('f').innerHTML=rectGrid(w,h,4);
    q('e').innerHTML=`${fx(w)} × ${fx(h)} = ${fr(values.w,4)} × ${fr(values.h,4)} = ${fr(values.w*values.h,16)}${A[0]===values.w*values.h&&A[0]<16?'':` = ${fx(A)}`}`;
    q('r').innerHTML=`Each small square is ${fr(1,4)} inch on a side, and 16 of them fill a square inch, so each is <b>${fr(1,16)} square inch</b>. There ${values.w*values.h>1?'are':'is'} ${values.w} × ${values.h} = ${values.w*values.h} small square${values.w*values.h>1?'s':''}: <b>${fx(A)} square inch${fVal(A)>1?'es':''}</b>.`
      +`<br><span class="dimline">Length × width works for fractional sides too: multiply the tops (${values.w} × ${values.h} squares) and the bottoms (4 × 4 = 16 squares to a square inch).</span>`;
  };
  steppers(el,values,{w:[1,16],h:[1,12]},draw);
  draw();
}

/* a missing side (area A ÷ side s), or tiles along a length (L ÷ tile s) */
const MISSING=[
  {kind:'side',A:frac(11),s:frac(11,3),u:'meters'},
  {kind:'side',A:frac(405,8),s:frac(45,4),u:'inches'},
  {kind:'tiles',L:frac(21,2),s:frac(3,2),u:'feet'},
  {kind:'tiles',L:frac(13,2),s:frac(3,2),u:'feet'},
];
/* a rectangle with one side known, its area inside, and the other side a "?", drawn to scale (fitting 300 by 160) */
function sideFig(A,s,u){
  const other=fVal(fDiv(A,s)),scale=Math.min(300/fVal(s),160/other),width=fVal(s)*scale,height=other*scale,left=80,top=14;
  return svgWrap(left+width+20,top+height+50,`<rect class="rg-out" x="${left}" y="${top}" width="${width}" height="${height}" style="fill:rgba(255,201,60,.3)"/>`+fT(left+width/2,top+height/2,A,{unit:'sq '+u.slice(0,2)})+fT(left+width/2,top+height+24,s,{unit:u})+qbox(left-34,top+height/2),`A rectangle with area ${ftx(A)} square ${u} and one side ${ftx(s)} ${u}; the other side is unknown`);
}
/* A missing side, or tiles along a length: both divide. */
function wMissing(el){
  const q=Q(el);let problemIndex=0;
  el.innerHTML=seg('Problem',MISSING.map((problem,i)=>[i,problem.kind==='side'?`Area ${fx(problem.A)}, side ${fx(problem.s)}`:`${fx(problem.L)} ft in ${fx(problem.s)} ft tiles`]))+`<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const problem=MISSING[problemIndex];press(el,problemIndex);
    if(problem.kind==='side'){
      const other=fDiv(problem.A,problem.s);
      q('f').innerHTML=sideFig(problem.A,problem.s,problem.u);
      q('e').innerHTML=`${fx(problem.s)} × <span class="q">?</span> = ${fx(problem.A)}`;
      q('r').innerHTML=`Side × side = area, so divide the area by the side you know: ${fx(problem.A)} ÷ ${fx(problem.s)} = ${fim(problem.A)} × ${fim(fInv(problem.s))} = <b>${fx(other)} ${problem.u}</b>.<br><span class="dimline">Check: ${fx(problem.s)} × ${fx(other)} = ${fx(problem.A)}.</span>`;
    }else{
      const tiles=fDiv(problem.L,problem.s),full=Math.floor(fVal(tiles));
      q('f').innerHTML=groupTape(problem.L,problem.s,{label:`Tape diagram: ${ftx(problem.L)} feet in tiles ${ftx(problem.s)} feet long`});
      q('e').innerHTML=`<span class="q">?</span> × ${fx(problem.s)} = ${fx(problem.L)}`;
      q('r').innerHTML=`How many ${fx(problem.s)}-foot tiles fit along ${fx(problem.L)} feet? ${fx(problem.L)} ÷ ${fx(problem.s)} = <b>${fx(tiles)}</b>.`
        +(isWhole(tiles)?' The tiles fit exactly.':` That’s ${full} whole tiles and ${fx(fSub(tiles,frac(full)))} of a tile, so the last tile has to be cut.`);
    }
  };
  onPick(el,id=>{problemIndex=+id;draw();});
  draw();
}

const STEPS=[
  {title:'How many times as long?',widget:wMeasure,
    body:'<p>One song lasts 1 '+fr(1,2)+' minutes and another 3 '+fr(3,4)+' minutes. How many times as long is the second song? Count how many copies of 1 '+fr(1,2)+' fit in 3 '+fr(3,4)+': 3 '+fr(3,4)+' ÷ 1 '+fr(1,2)+' = 2 '+fr(1,2)+'.</p><p>Pick two lengths and lay down copies of the shorter one.</p>',
    check:{kind:'num',unit:'times as tall',answer:1.5,frac:true,q:'A zookeeper is 6 '+fr(1,4)+' feet tall. A young giraffe is 9 '+fr(3,8)+' feet tall. How many times as tall as the zookeeper is the giraffe?',
      misc:[[3.13,'That’s how much taller the giraffe is. “How many times as tall” asks how many zookeeper heights fit in the giraffe’s: divide.'],[0.67,'That’s 6 '+fr(1,4)+' ÷ 9 '+fr(3,8)+', the zookeeper compared to the giraffe. Divide the giraffe’s height by the zookeeper’s.'],[58.59,'That’s 9 '+fr(3,8)+' × 6 '+fr(1,4)+'. Divide to compare.']],
      explain:'9 '+fr(3,8)+' ÷ 6 '+fr(1,4)+' = '+fr(75,8)+' × '+fr(4,25)+' = '+fr(300,200)+' = 1 '+fr(1,2)+'. Check: 1 '+fr(1,2)+' × 6 '+fr(1,4)+' = 9 '+fr(3,8)+'.'}},
  {title:'Area with fractional sides',widget:wArea,
    body:'<p>A rectangle 3 '+fr(1,2)+' inches by 2 '+fr(1,4)+' inches can be tiled with squares '+fr(1,4)+' inch on a side. 16 of those fill 1 square inch, so each is '+fr(1,16)+' square inch. Count them, or multiply: '+fr(7,2)+' × '+fr(9,4)+' = '+fr(63,8)+' = 7 '+fr(7,8)+' square inches.</p><p>Change the width and height.</p>',
    check:{kind:'num',unit:'square inches',answer:11.875,frac:true,q:'A rectangle is 2 '+fr(1,2)+' inches by 4 '+fr(3,4)+' inches. What is its area?',
      misc:[[8,'That multiplies only the whole numbers, 2 × 4. Write each side as a fraction: '+fr(5,2)+' × '+fr(19,4)+'.'],[7.25,'That adds the sides. Area is length times width.'],[14.5,'That’s the perimeter, the distance around. Area is length times width.']],
      explain:fr(5,2)+' × '+fr(19,4)+' = '+fr(95,8)+' = 11 '+fr(7,8)+' square inches.'}},
  {title:'Find a missing side',widget:wMissing,
    body:'<p>If you know the area of a rectangle and one side, divide to find the other side: side × ? = area. The same division tells how many tiles of a fractional size fit along a length.</p><p>Pick a problem.</p>',
    check:{kind:'num',unit:'inches',answer:5,frac:true,q:'A rectangle has an area of 17 '+fr(1,2)+' square inches. Its shorter side is 3 '+fr(1,2)+' inches. How long is its longer side?',
      misc:[[14,'That’s 17 '+fr(1,2)+' − 3 '+fr(1,2)+'. Side × side = area, so divide.'],[61.25,'That’s 17 '+fr(1,2)+' × 3 '+fr(1,2)+'. You know the area and one side: divide.'],[0.2,'That’s 3 '+fr(1,2)+' ÷ 17 '+fr(1,2)+'. Divide the area by the side.']],
      explain:'17 '+fr(1,2)+' ÷ 3 '+fr(1,2)+' = '+fr(35,2)+' × '+fr(2,7)+' = 5 inches. Check: 3 '+fr(1,2)+' × 5 = 17 '+fr(1,2)+'.'}}
];
