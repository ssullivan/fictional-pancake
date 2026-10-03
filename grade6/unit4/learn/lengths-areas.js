/* Learn Dividing Fractions (Grade 6 Unit 4), chapter 6: Lengths and areas. Its widgets and steps; loaded by lengths-areas.html. */
/* how many times as long: lay copies of the shorter length along the longer one */
const LONGER=[
  {x:frac(15,4),y:frac(3,2),a:'the long song',b:'the short song',u:'minutes'},
  {x:frac(9,2),y:frac(3,4),a:'the shelf',b:'a book',u:'feet'},
  {x:frac(10,3),y:frac(5,6),a:'the path',b:'one stride',u:'yards'},
];
function wMeasure(el){
  const q=Q(el),st={k:0},lim={k:[0,6]};let p=0;
  el.innerHTML=seg('Compare',LONGER.map((c,i)=>[i,`${fx(c.x)} and ${fx(c.y)} ${c.u}`]))+`<div class="wrow">${stepper('k','Copies')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const c=LONGER[p],qt=fDiv(c.x,c.y),{k}=st,full=Math.floor(fVal(qt));press(el,p);q('k').textContent=k;
    q('f').innerHTML=groupTape(c.x,c.y,{upto:k,label:`Tape diagram: ${c.a}, ${ftx(c.x)} ${c.u}, with ${k} copies of ${c.b}, ${ftx(c.y)} ${c.u}`});
    q('r').innerHTML=!k?`How many times as long as ${c.b} (${fx(c.y)} ${c.u}) is ${c.a} (${fx(c.x)} ${c.u})? Lay copies of ${c.b} along it.`
      :k<=full&&k<lim.k[1]?`${k} cop${k>1?'ies':'y'} of ${c.b} reach${k>1?'':'es'} ${fx(fMul(frac(k),c.y))} ${c.u}.`
      :`<span class="ok">${fx(c.x)} ÷ ${fx(c.y)} = <b>${fx(qt)}</b>: ${c.a} is ${fx(qt)} times as long as ${c.b}.</span><br><span class="dimline">${fx(qt)} × ${fx(c.y)} = ${fx(c.x)}.</span>`;
  };
  const setMax=()=>{lim.k[1]=Math.ceil(fVal(fDiv(LONGER[p].x,LONGER[p].y)));};
  steppers(el,st,lim,draw);
  onPick(el,m=>{p=+m;setMax();st.k=0;draw();});
  setMax();draw();
}

/* a rectangle measured in quarter inches, tiled in 1/4-inch squares */
function wArea(el){
  const q=Q(el),st={w:14,h:9};
  el.innerHTML=`<div class="wrow">${stepper('w','Width')}${stepper('h','Height')}</div><div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const w=frac(st.w,4),h=frac(st.h,4),A=fMul(w,h);
    q('w').innerHTML=`${fx(w)} in`;q('h').innerHTML=`${fx(h)} in`;
    q('f').innerHTML=rectGrid(w,h,4);
    q('e').innerHTML=`${fx(w)} × ${fx(h)} = ${fr(st.w,4)} × ${fr(st.h,4)} = ${fr(st.w*st.h,16)}${A[0]===st.w*st.h&&A[0]<16?'':` = ${fx(A)}`}`;
    q('r').innerHTML=`Each small square is ${fr(1,4)} inch on a side, and 16 of them fill a square inch, so each is <b>${fr(1,16)} square inch</b>. There ${st.w*st.h>1?'are':'is'} ${st.w} × ${st.h} = ${st.w*st.h} small square${st.w*st.h>1?'s':''}: <b>${fx(A)} square inch${fVal(A)>1?'es':''}</b>.`
      +`<br><span class="dimline">Length × width works for fractional sides too: multiply the tops (${st.w} × ${st.h} squares) and the bottoms (4 × 4 = 16 squares to a square inch).</span>`;
  };
  steppers(el,st,{w:[1,16],h:[1,12]},draw);
  draw();
}

/* a missing side (area ÷ side), or tiles along a length (length ÷ tile) */
const MISSING=[
  {kind:'side',A:frac(11),s:frac(11,3),u:'meters'},
  {kind:'side',A:frac(405,8),s:frac(45,4),u:'inches'},
  {kind:'tiles',L:frac(21,2),s:frac(3,2),u:'feet'},
  {kind:'tiles',L:frac(13,2),s:frac(3,2),u:'feet'},
];
/* a rectangle with one side known, its area inside, and the other side a "?", drawn to scale */
function sideFig(A,s,u){
  const o=fVal(fDiv(A,s)),k=Math.min(300/fVal(s),160/o),w=fVal(s)*k,h=o*k,X=80,Y=14;
  return svgWrap(X+w+20,Y+h+50,`<rect class="rg-out" x="${X}" y="${Y}" width="${w}" height="${h}" style="fill:rgba(255,201,60,.3)"/>`+fT(X+w/2,Y+h/2,A,{unit:'sq '+u.slice(0,2)})+fT(X+w/2,Y+h+24,s,{unit:u})+qbox(X-34,Y+h/2),`A rectangle with area ${ftx(A)} square ${u} and one side ${ftx(s)} ${u}; the other side is unknown`);
}
function wMissing(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Problem',MISSING.map((m,i)=>[i,m.kind==='side'?`Area ${fx(m.A)}, side ${fx(m.s)}`:`${fx(m.L)} ft in ${fx(m.s)} ft tiles`]))+`<div class="fig" data-f></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const m=MISSING[p];press(el,p);
    if(m.kind==='side'){
      const o=fDiv(m.A,m.s);
      q('f').innerHTML=sideFig(m.A,m.s,m.u);
      q('e').innerHTML=`${fx(m.s)} × <span class="q">?</span> = ${fx(m.A)}`;
      q('r').innerHTML=`Side × side = area, so divide the area by the side you know: ${fx(m.A)} ÷ ${fx(m.s)} = ${fim(m.A)} × ${fim(fInv(m.s))} = <b>${fx(o)} ${m.u}</b>.<br><span class="dimline">Check: ${fx(m.s)} × ${fx(o)} = ${fx(m.A)}.</span>`;
    }else{
      const n=fDiv(m.L,m.s),full=Math.floor(fVal(n));
      q('f').innerHTML=groupTape(m.L,m.s,{label:`Tape diagram: ${ftx(m.L)} feet in tiles ${ftx(m.s)} feet long`});
      q('e').innerHTML=`<span class="q">?</span> × ${fx(m.s)} = ${fx(m.L)}`;
      q('r').innerHTML=`How many ${fx(m.s)}-foot tiles fit along ${fx(m.L)} feet? ${fx(m.L)} ÷ ${fx(m.s)} = <b>${fx(n)}</b>.`
        +(isWhole(n)?' The tiles fit exactly.':` That’s ${full} whole tiles and ${fx(fSub(n,frac(full)))} of a tile, so the last tile has to be cut.`);
    }
  };
  onPick(el,m=>{p=+m;draw();});
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
