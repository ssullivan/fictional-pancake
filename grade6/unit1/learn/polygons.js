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
const shapeSvg=b=>`<svg viewBox="0 0 90 70" aria-hidden="true">${b}</svg>`;
/* the quick checks' figures */
const F={};
{const P=plane({xmax:6,ymax:7,u:36});F.house=P.svg(P.grid()+P.poly(Rect(0,0,6,4),'sh-a')+P.poly([[0,4],[6,4],[3,7]],'sh-b')+P.line([3,7],[3,4],'hgt')+P.text(3,0,'6','lbl',0,16)+P.text(0,2,'4','lbl en',-10)+P.text(3,5.5,'3','lbl st',8),'A house shape: a 6 by 4 rectangle with a triangle roof of height 3');}
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
        explain:'The five-sided shape is closed, has straight sides, and its sides only meet at the corners.'}}
  ];
