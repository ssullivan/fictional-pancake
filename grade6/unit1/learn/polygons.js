/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 4: Polygons. Its widgets and steps; loaded by polygons.html. */
function wDecomp(el){
  const q=Q(el),P=plane({xmax:8,ymax:4,u:46}),T=[[0,0],[8,0],[6,4],[2,4]];let m='rect';
  el.innerHTML=`<div class="seg" role="group" aria-label="Method"><button type="button" data-m="rect">Rectangle + triangles</button><button type="button" data-m="tri">Two triangles</button><button type="button" data-m="frame">Frame it</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let o=P.grid(),r;
    if(m==='rect'){o+=P.poly([[0,0],[2,0],[2,4]],'sh-b')+P.poly([[2,0],[6,0],[6,4],[2,4]],'sh-a')+P.poly([[6,0],[8,0],[6,4]],'sh-b')+P.text(1.35,1.1,'4')+P.text(4,2,'16')+P.text(6.65,1.1,'4');
      r='Each end triangle is ½ × 2 × 4 = 4. The rectangle is 4 × 4 = 16. <b>4 + 16 + 4 = 24</b> square units.';}
    else if(m==='tri'){o+=P.poly([[0,0],[8,0],[6,4]],'sh-a')+P.poly([[0,0],[6,4],[2,4]],'sh-c')+P.text(4.9,1.3,'16')+P.text(2.7,2.9,'8');
      r='The bottom triangle is ½ × 8 × 4 = 16. The top triangle has base 4 (the top side) and height 4: ½ × 4 × 4 = 8. <b>16 + 8 = 24</b> square units.';}
    else{o+=P.poly([[0,0],[8,0],[8,4],[0,4]],'ghost')+P.poly(T,'sh-a')+P.poly([[0,0],[2,4],[0,4]],'sh-c cut')+P.poly([[8,0],[8,4],[6,4]],'sh-c cut')+P.text(.65,2.9,'4')+P.text(7.35,2.9,'4')+P.text(4,2,'shape');
      r='The frame is 8 × 4 = 32. Take away the two corner triangles of 4 each. <b>32 − 8 = 24</b> square units.';}
    q('f').innerHTML=P.svg(o,'A trapezoid broken into pieces');
    q('r').innerHTML=r+'<br><span class="dimline">Every way gives 24.</span>';
    el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));
  };
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw();});
  draw();
}
/* a shape with a hole: the shaded part is the outer polygon minus the inner one */
const holePath=(P,outer,hole,cls='sh-a')=>`<path class="${cls}" fill-rule="evenodd" d="${[outer,hole].map(L=>'M'+P.pts(L).replace(/ /g,'L')+'Z').join('')}"/>`;
/* a triangle (base 12, height 6) with a square hole. Drag the hole, or use the arrows, and change its size: the shaded area is
   whole − hole wherever the hole sits. When it sits on the base under the top, the lengths come in pieces, like the worksheets. */
function wHole(el){
  const q=Q(el),B=12,HT=6,AX=6,P=plane({xmax:B,ymin:-1,ymax:7,u:40}),st={sz:2};
  let pos={x:5,y:0},moved=false,drag=null;
  /* integer spots where the hole fits, at least 1 unit in from each slanted side (the sides are y = x and y = 12 − x) */
  const fits=(x,y,s)=>y>=0&&x>=y+s+1&&x<=B-1-2*s-y;
  const spots=s=>{const o=[];for(let y=0;y<=HT;y++)for(let x=0;x<=B;x++)if(fits(x,y,s))o.push({x,y});return o;};
  const nearest=(tx,ty,s)=>spots(s).reduce((a,b)=>(b.x-tx)**2+(b.y-ty)**2<(a.x-tx)**2+(a.y-ty)**2?b:a);
  const MV={left:[-1,0],right:[1,0],up:[0,1],down:[0,-1]};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('sz','Hole size')}<span class="arrows">${Object.keys(MV).map(k=>`<button type="button" class="ghost-btn" data-mv="${k}" aria-label="Move the hole ${k}">${{left:'←',right:'→',up:'↑',down:'↓'}[k]}</button>`).join('')}</span></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const s=st.sz,{x,y}=pos,W=B*HT/2,S=s*s,onBase=y===0&&x<AX&&AX<x+s,f=q('f');
    const hadFocus=!!(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('[data-hole]'));
    let o=P.grid()+holePath(P,[[0,0],[B,0],[AX,HT]],Rect(x,y,x+s,y+s));
    if(onBase)o+=P.line([AX,HT],[AX,s],'hgt')+P.rt(AX,s)+P.text(AX,(HT+s)/2,HT-s,'lbl st',8)
      +P.text(x/2,0,x,'lbl',0,16)+P.text(x+s/2,0,s,'lbl',0,16)+P.text((x+s+B)/2,0,B-x-s,'lbl',0,16)+P.text(x,s/2,s,'lbl en',-8);
    else o+=P.line([AX,HT],[AX,0],'hgt')+P.rt(AX,0)+P.text(AX,HT-1.2,HT,'lbl st',8)+P.text(B/2,0,B,'lbl',0,16)+P.text(x,y+s/2,s,'lbl en',-8);
    const pad=.35*P.u;
    o+=`<g class="holeg${drag?' drag':''}" data-hole tabindex="0" role="button" aria-label="The hole, ${s} by ${s}. Drag it, or use the arrow keys.">`
      +`<rect class="hole-hit" x="${P.X(x)-pad}" y="${P.Y(y+s)-pad}" width="${s*P.u+2*pad}" height="${s*P.u+2*pad}"/>`
      +`<rect class="hole" x="${P.X(x)}" y="${P.Y(y+s)}" width="${s*P.u}" height="${s*P.u}"/></g>`;
    f.innerHTML=P.svg(o,`A triangle with base 12 and height 6, with a ${s} by ${s} square hole cut out`);
    if(hadFocus)f.querySelector('[data-hole]').focus({preventScroll:true});
    q('sz').textContent=s;
    el.querySelectorAll('[data-mv]').forEach(b=>{const [dx,dy]=MV[b.dataset.mv];b.disabled=!fits(x+dx,y+dy,s);});
    q('r').innerHTML=(onBase?`Base: ${x} + ${s} + ${B-x-s} = ${B}. Height: ${HT-s} + ${s} = ${HT}.<br>`:'')
      +`Whole triangle: ${B} × ${HT} ÷ 2 = <b>${W}</b>. Hole: ${s} × ${s} = <b>${S}</b>.<br>Shaded: ${W} − ${S} = <b>${W-S}</b> square units.`
      +`<br><span class="dimline">${moved?`The hole moved, but the shaded area is still ${W-S}. Only the hole’s size changes it.`:'Drag the hole anywhere inside the triangle.'}</span>`;
  };
  const go=n=>{if(n.x===pos.x&&n.y===pos.y)return;pos=n;moved=true;draw();};
  steppers(el,st,{sz:[1,3]},()=>{pos=nearest(pos.x,pos.y,st.sz);moved=false;draw();});
  el.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const [dx,dy]=MV[b.dataset.mv];if(fits(pos.x+dx,pos.y+dy,st.sz))go({x:pos.x+dx,y:pos.y+dy});});
  /* dragging: the pointer in grid units (the svg keeps its shape, so one scale fits both ways) */
  const f=q('f'),at=e=>{const r=f.querySelector('svg').getBoundingClientRect(),k=P.W/r.width;return [((e.clientX-r.left)*k-(P.X(0)))/P.u,7-((e.clientY-r.top)*k-P.Y(7))/P.u];};
  f.addEventListener('pointerdown',e=>{if(!e.target.closest('[data-hole]'))return;e.preventDefault();const [ux,uy]=at(e);drag={dx:ux-pos.x,dy:uy-pos.y};f.setPointerCapture(e.pointerId);e.target.closest('[data-hole]').classList.add('drag');});
  f.addEventListener('pointermove',e=>{if(!drag)return;const [ux,uy]=at(e);go(nearest(ux-drag.dx,uy-drag.dy,st.sz));});
  /* touch-action doesn't reach shapes inside an svg, so a finger on the hole would also scroll the page. (pointerdown mustn't
     redraw: touchstart comes after it, and an element taken out of the page doesn't pass its events up to f.) */
  f.addEventListener('touchstart',e=>{if(e.target.closest('[data-hole]'))e.preventDefault();},{passive:false});
  const up=()=>{if(drag){drag=null;draw();}};
  f.addEventListener('pointerup',up);f.addEventListener('pointercancel',up);
  f.addEventListener('keydown',e=>{const k={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(!k||!e.target.closest('[data-hole]'))return;e.preventDefault();const [dx,dy]=MV[k];if(fits(pos.x+dx,pos.y+dy,st.sz))go({x:pos.x+dx,y:pos.y+dy});});
  draw();
}
const shapeSvg=b=>`<svg viewBox="0 0 90 70" aria-hidden="true">${b}</svg>`;
/* the quick checks' figures */
const F={};
{const P=plane({xmax:6,ymax:7,u:36});F.house=P.svg(P.grid()+P.poly(Rect(0,0,6,4),'sh-a')+P.poly([[0,4],[6,4],[3,7]],'sh-b')+P.line([3,7],[3,4],'hgt')+P.text(3,0,'6','lbl',0,16)+P.text(0,2,'4','lbl en',-10)+P.text(3,5.5,'3','lbl st',8),'A house shape: a 6 by 4 rectangle with a triangle roof of height 3');}
{const P=plane({xmax:10,ymin:-1,ymax:6,u:38});F.holeTri=P.svg(P.grid()+holePath(P,[[0,0],[10,0],[5,6]],Rect(4,0,6,2))+P.line([5,6],[5,2],'hgt')+P.rt(5,2)
  +P.text(5,4,'4','lbl st',8)+P.text(2,0,'4','lbl',0,16)+P.text(5,0,'2','lbl',0,16)+P.text(8,0,'4','lbl',0,16)+P.text(4,1,'2','lbl en',-8),
  'A shaded triangle with a 2 by 2 square cut out of the middle of its base. Along the base: 4, 2, 4. A dashed line from the top down to the square: 4.');}
F.polyChoices={
  pent:shapeSvg('<polygon class="sh-a" points="45,6 84,32 70,64 20,64 6,32"/>'),
  circ:shapeSvg('<circle class="sh-a" cx="45" cy="35" r="28"/>'),
  open:shapeSvg('<polyline fill="none" stroke="#ffc93c" stroke-width="3" points="8,60 26,10 45,55 64,10 82,60"/>'),
  bow:shapeSvg('<polygon class="sh-a" points="10,10 80,60 80,10 10,60"/>')
};
const STEPS=[
    {title:'Break it into pieces',widget:wDecomp,
      body:'<p>To find the area of a polygon, break it into rectangles and triangles and add them up. Or frame it with a rectangle and subtract the corners.</p><p>Try each way on this trapezoid.</p>',
      check:{kind:'num',unit:'square units',answer:33,fig:F.house,q:'What is the area of this house shape?',
        misc:[[42,'6 × 7 frames the whole thing. The corners beside the roof aren’t part of the shape.'],[51,'The roof is a triangle: ½ × 6 × 3 = 9, not 18.'],[24,'Don’t forget the roof!']],
        explain:'Rectangle 6 × 4 = 24. Roof triangle ½ × 6 × 3 = 9. 24 + 9 = 33 square units.'}},
    {title:'What is a polygon?',
      body:'<p>A <b>polygon</b> is a flat, closed shape made only of straight sides. The sides meet only at their ends and never cross each other.</p>',
      check:{kind:'mc',q:'Which one is a polygon?',
        choices:[{id:'pent',label:F.polyChoices.pent},{id:'circ',label:F.polyChoices.circ},{id:'open',label:F.polyChoices.open},{id:'bow',label:F.polyChoices.bow}],answer:'pent',
        why:{circ:'A circle is curved. A polygon has only straight sides.',open:'This shape isn’t closed. A polygon’s sides connect all the way around.',bow:'These sides cross each other in the middle. A polygon’s sides only meet at their ends.'},
        explain:'The five-sided shape is closed, has straight sides, and its sides only meet at the corners.'}},
    {title:'Shapes with holes',widget:wHole,
      body:'<p>Some shapes have a hole cut out. Find the area of the <b>whole</b> shape as if nothing were cut out, then <b>subtract the hole</b>.</p><p>Watch for lengths that come in pieces. When the hole sits on the base, the base is all the pieces along the bottom, and the height is the dashed line plus the side of the hole.</p><p>Drag the hole around, and change its size.</p>',
      check:{kind:'num',unit:'square units',answer:26,fig:F.holeTri,q:'Find the area of the shaded region. The square is cut out of the triangle.',
        misc:[[30,'That’s the whole triangle, hole and all. Now subtract the square.'],[34,'The square is a hole, so subtract its area. Don’t add it.'],
          [56,'The big shape is a triangle, so its area is half of base × height: 10 × 6 ÷ 2 = 30.'],[16,'The height goes from the base all the way to the top: 4 + 2 = 6.'],
          [20,'The base runs all the way across the bottom, under the hole too: 4 + 2 + 4 = 10.'],[28,'The hole is a square: 2 × 2 = 4. Don’t halve it.']],
        explain:'Base: 4 + 2 + 4 = 10. Height: 4 + 2 = 6.<br>Whole triangle: 10 × 6 ÷ 2 = 30. Hole: 2 × 2 = 4.<br>Shaded: 30 − 4 = 26 square units.'}}
  ];
