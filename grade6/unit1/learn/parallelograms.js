/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 2: Parallelograms. Its widgets and steps; loaded by parallelograms.html. */
/* a number to one decimal place, with commas */
const fmt=n=>(Math.round(n*10)/10).toLocaleString('en-US');
/* cut the triangle off a parallelogram and slide it across to make a rectangle. SETS: [base, height, how far the top leans] */
function wParaCut(el){
  const q=Q(el),SETS=[[6,4,2],[5,3,2],[7,3,3],[4,5,1],[6,3,3]];let setIndex=0;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the triangle <input type="range" min="0" max="100" value="0" data-s></label><button type="button" class="ghost-btn" data-n>New parallelogram</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [b,h,lean]=SETS[setIndex],progress=q('s').value/100,P=plane({xmax:b+lean,ymax:h,u:40});
    const tri=[[0,0],[lean,0],[lean,h]].map(([x,y])=>[x+progress*b,y]),rest=[[lean,0],[b,0],[b+lean,h],[lean,h]];
    const markup=P.grid()+P.poly(rest,'sh-a')+P.poly(tri,'sh-b')+P.line([lean,0],[lean,h],'hgt')+P.rt(lean,0)+P.text(lean,h/2,`${h}`,'lbl st',8)+P.text(b/2+progress*lean,0,`${b}`,'lbl',0,16);
    q('f').innerHTML=P.svg(markup,`Parallelogram with base ${b} and height ${h}`);
    q('r').innerHTML=progress===1?`<span class="ok">It’s a ${b} × ${h} rectangle now: ${b} × ${h} = <b>${b*h}</b> square units.</span> The parallelogram had the same area: base × height.`:`Base ${b}, height ${h}. Slide the blue triangle all the way to the other end.`;
  };
  q('s').addEventListener('input',draw);
  q('n').onclick=()=>{setIndex=(setIndex+1)%SETS.length;q('s').value=0;draw();};
  draw();
}
/* slide the top edge to lean the parallelogram: base and height stay 5 and 4, so the area stays 20 */
function wParaLean(el){
  const q=Q(el),P=plane({xmin:-3,xmax:11,ymax:4,u:32});
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the top edge <input type="range" min="-3" max="6" step="0.5" value="2" data-s></label></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const lean=+q('s').value,out=lean<0||lean>5;
    /* the height's label goes on whichever side of the height line has more room */
    const markup=P.grid()+P.poly([[0,0],[5,0],[5+lean,4],[lean,4]],'sh-a')+heightMark(P,lean,4,0,5)+P.text(2.5,0,'5','lbl',0,16)+(lean<2.5+lean/2?P.text(lean,2,'4','lbl en',-8):P.text(lean,2,'4','lbl st',8))+P.text(5+lean/2,2,fmt(Math.hypot(lean,4)),'lbl s cy st',10);
    q('f').innerHTML=P.svg(markup,'Parallelogram with base 5 and height 4');
    q('r').innerHTML=`Base <b>5</b> · Height <b>4</b> · Slanted side <b>${fmt(Math.hypot(lean,4))}</b><br>Area = 5 × 4 = <b>20</b> square units, however far it leans.${out?'<br><span class="dimline">The height is outside the shape now, so the base is extended with a dotted line.</span>':''}`;
  };
  q('s').addEventListener('input',draw);draw();
}
/* the quick checks' figures */
const F={};
{const P=plane({xmax:7,ymax:3,u:44});F.para=P.svg(P.grid()+P.poly([[0,0],[5,0],[7,3],[2,3]],'sh-a')+heightMark(P,2,3,0,5)+P.text(2.5,0,'5','lbl',0,16)+P.text(2,1.5,'3','lbl st',8)+P.text(1,1.5,'3.6','lbl s cy en',-10),'Parallelogram with base 5, height 3, and slanted side 3.6');}
{const P=plane({xmax:8,ymax:3,u:44});F.whichH=P.svg(P.grid()+P.poly([[0,0],[6,0],[8,3],[2,3]],'sh-a')+P.line([4,3],[4,0],'seg-a')+P.rt(4,0)+P.line([0,0],[2,3],'seg-b')+P.line([5,3],[6,0],'seg-c')+P.text(4,1.5,'A','lbl',12)+P.text(1,1.5,'B','lbl cy',-14)+P.text(5.5,1.5,'C','lbl',14),'Parallelogram with three segments labeled A, B, and C');}
{const P=plane({xmax:7,ymax:4,u:40});F.leanPara=P.svg(P.grid()+P.poly([[0,0],[3,0],[7,4],[4,4]],'sh-a')+heightMark(P,4,4,0,3)+P.text(1.5,0,'3','lbl',0,16)+P.text(4,2,'4','lbl st',8)+P.text(2,2,'5.7','lbl s cy en',-10),'A leaning parallelogram with base 3 and height 4, and a slanted side of 5.7');}
const STEPS=[
    {title:'Parallelogram → rectangle',widget:wParaCut,
      body:'<p>A <b>parallelogram</b> has two pairs of parallel sides. Cut the triangle off one end and slide it to the other end, and it becomes a rectangle with the same area.</p><p>So the area of a parallelogram is <b>base × height</b>.</p>',
      check:{kind:'num',unit:'square units',answer:15,fig:F.para,q:'What is the area of this parallelogram?',
        misc:[[18,'5 × 3.6 uses the slanted side. Use the height: the dashed line that makes a right angle with the base.'],[7.5,'That’s half. A parallelogram isn’t cut in half: its area is base × height.'],[17.2,'That’s the distance around. Area is base × height.']],
        explain:'Base × height = 5 × 3 = 15 square units. The slanted side (3.6) isn’t the height.'}},
    {title:'The height, not the slanted side',widget:wParaLean,
      body:'<p>The <b>height</b> is the distance straight up from the base, making a right angle with it, not the length of the slanted side.</p><p>Slide the top edge. The slanted side changes, but the base and the height don’t, so the area doesn’t either.</p>',
      check:{kind:'mc',fig:F.whichH,q:'Which segment is a <b>height</b> for the bottom base?',
        choices:[{id:'A',label:'A'},{id:'B',label:'B'},{id:'C',label:'C'}],answer:'A',
        why:{B:'B is a side of the parallelogram. It’s slanted, so it doesn’t make a right angle with the base.',C:'C is slanted. A height has to meet the base at a right angle.'},
        explain:'A goes straight down to the base and makes a right angle (see the little square), so it’s a height.'}},
    {title:'Heights outside the shape',
      body:'<p>When a parallelogram leans a lot, its height can land outside the shape. Extend the base with a dotted line and measure straight up from it.</p><p>The area is still base × height.</p>',
      check:{kind:'num',unit:'square units',answer:12,fig:F.leanPara,q:'What is the area of this leaning parallelogram?',
        misc:[[17.1,'3 × 5.7 uses the slanted side. The height is the dashed line: 4.'],[6,'That’s half. For a parallelogram, don’t halve: base × height.'],[20,'The base is only 3 units. The dotted part is just an extension of the base line.']],
        explain:'Base 3 × height 4 = 12 square units, even though the height lands outside.'}}
  ];
