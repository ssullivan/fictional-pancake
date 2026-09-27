/* Learn Area & Surface Area (Grade 6 Unit 1): widgets, figures, 3D nets, and the chapters. Loaded by learn.html. */
const fmt=n=>(Math.round(n*10)/10).toLocaleString('en-US');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLS=['#ffc93c','#7fe3ff','#ff8ac4','#5fe0a8','#b69cff','#ff9f5a'];
const cen=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];

/* ---------- 2D graph paper ---------- */
/* down:true draws y increasing downward (used for nets, to match the 3D view from the front) */
function plane({xmin=0,xmax,ymin=0,ymax,u=36,pad=26,down=false}){
  const X=x=>pad+(x-xmin)*u,Y=y=>down?pad+(y-ymin)*u:pad+(ymax-y)*u,W=(xmax-xmin)*u+2*pad,H=(ymax-ymin)*u+2*pad;
  const P={X,Y,W,H,u};
  P.grid=()=>{let o='';for(let i=xmin;i<=xmax;i++)o+=`<line class="gl" x1="${X(i)}" y1="${Y(ymin)}" x2="${X(i)}" y2="${Y(ymax)}"/>`;for(let j=ymin;j<=ymax;j++)o+=`<line class="gl" x1="${X(xmin)}" y1="${Y(j)}" x2="${X(xmax)}" y2="${Y(j)}"/>`;return o;};
  P.pts=L=>L.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ');
  P.poly=(L,cls)=>`<polygon class="${cls}" points="${P.pts(L)}"/>`;
  P.line=(a,b,cls)=>`<line class="${cls}" x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}"/>`;
  P.text=(x,y,t,cls='lbl',dx=0,dy=0)=>`<text class="${cls}" x="${X(x)+dx}" y="${Y(y)+dy}">${t}</text>`;
  P.rt=(x,y,sx=1,sy=1)=>`<polyline class="rt" points="${X(x+.35*sx)},${Y(y)} ${X(x+.35*sx)},${Y(y+.35*sy)} ${X(x)},${Y(y+.35*sy)}"/>`;
  P.svg=(body,label)=>`<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="${label}">${body}</svg>`;
  return P;
}
/* a height from a top point down to the base line y=0, extending the base [x0,x1] if the foot lands outside */
function heightMark(P,x,h,x0,x1){
  let o='';
  if(x<x0)o+=P.line([x,0],[x0,0],'ext');
  if(x>x1)o+=P.line([x1,0],[x,0],'ext');
  return o+P.line([x,h],[x,0],'hgt')+P.rt(x,0,x>(x0+x1)/2?-1:1);
}

/* ---------- Chapter 1 widgets ---------- */
function wTile(el){
  const q=Q(el),cells=[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2]];
  const K=(x,y)=>x+','+y,inS=new Set(cells.map(c=>K(...c))),on=new Set(),P=plane({xmax:8,ymax:4,u:44});
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-one>Place a square</button><button type="button" class="ghost-btn" data-clr>Clear</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let o=P.grid();const s=P.u;
    cells.forEach(([x,y])=>{const k=K(x,y);o+=on.has(k)?`<rect class="tile" data-k="${k}" x="${P.X(x)+3}" y="${P.Y(y+1)+3}" width="${s-6}" height="${s-6}" rx="3"/>`:`<rect class="hit" data-k="${k}" x="${P.X(x)}" y="${P.Y(y+1)}" width="${s}" height="${s}"/>`;});
    cells.forEach(([x,y])=>[[0,-1,[x,y],[x+1,y]],[0,1,[x,y+1],[x+1,y+1]],[-1,0,[x,y],[x,y+1]],[1,0,[x+1,y],[x+1,y+1]]].forEach(([dx,dy,a,b])=>{if(!inS.has(K(x+dx,y+dy)))o+=P.line(a,b,'edge');}));
    q('f').innerHTML=P.svg(o,'An outlined shape on a grid. Tap squares to tile it.');
    q('r').innerHTML=on.size===cells.length?`<span class="ok">Covered with no gaps and no overlaps! It took <b>${cells.length}</b> unit squares, so the area is ${cells.length} square units.</span>`:`Squares placed: <b>${on.size}</b>`;
  };
  q('f').addEventListener('click',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;on.has(k)?on.delete(k):on.add(k);draw();});
  q('one').onclick=()=>{const c=cells.find(c=>!on.has(K(...c)));if(c){on.add(K(...c));draw();}};
  q('clr').onclick=()=>{on.clear();draw();};
  draw();
}
function wSlide(el){
  const q=Q(el),P=plane({xmax:6,ymax:4,u:46});
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the gold piece <input type="range" min="0" max="100" value="0" data-s></label></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=q('s').value/100,dx=-4*t,dy=-3*t;
    const main=[[2,0],[6,0],[6,3],[0,3],[0,1],[2,1]],bump=[[4,3],[6,3],[6,4],[4,4]].map(([x,y])=>[x+dx,y+dy]);
    const o=P.grid()+P.poly([[0,0],[2,0],[2,1],[0,1]],'ghost')+P.poly(main,'sh-b')+P.text(3.5,1.9,'16')+P.poly(bump,'sh-a')+P.text(5+dx,3.5+dy,'2');
    q('f').innerHTML=P.svg(o,'A shape with a piece that slides into a gap');
    q('r').innerHTML=t===1?`<span class="ok">Now it’s a 6 × 3 rectangle: 6 × 3 = <b>18</b> square units. Same area as before!</span>`:`Area: 16 + 2 = <b>18</b> square units`;
  };
  q('s').addEventListener('input',draw);draw();
}
function wTwoWays(el){
  const q=Q(el),P=plane({xmax:6,ymax:4,u:46}),S=[[0,0],[6,0],[6,2],[4,4],[0,4]];let m='split';
  el.innerHTML=`<div class="seg" role="group" aria-label="Method"><button type="button" data-m="split">Split it</button><button type="button" data-m="frame">Frame it</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    let o=P.grid(),r;
    if(m==='split'){
      o+=P.poly([[0,0],[4,0],[4,4],[0,4]],'sh-a')+P.poly([[4,0],[6,0],[6,2],[4,2]],'sh-b')+P.poly([[4,2],[6,2],[4,4]],'sh-c')+P.text(2,2,'16')+P.text(5,1,'4')+P.text(4.62,2.62,'2','lbl s');
      r='Split: 4 × 4 = 16, 2 × 2 = 4, and the triangle is half of a 2 × 2 square, so 2. <b>16 + 4 + 2 = 22</b> square units.';
    }else{
      o+=P.poly([[0,0],[6,0],[6,4],[0,4]],'ghost')+P.poly(S,'sh-a')+P.poly([[6,2],[6,4],[4,4]],'sh-c cut')+P.text(2.5,2,'shape')+P.text(5.35,3.35,'2','lbl s');
      r='Frame: 6 × 4 = 24. Take away the corner triangle (half of a 2 × 2 square = 2). <b>24 − 2 = 22</b> square units.';
    }
    q('f').innerHTML=P.svg(o,m==='split'?'The shape split into a square, a rectangle, and a triangle':'The shape inside a 6 by 4 rectangle');
    q('r').innerHTML=r+'<br><span class="dimline">Both ways give the same area.</span>';
    el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));
  };
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw();});
  draw();
}

/* ---------- Chapter 2 widgets ---------- */
function wParaCut(el){
  const q=Q(el),SETS=[[6,4,2],[5,3,2],[7,3,3],[4,5,1],[6,3,3]];let k=0;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the triangle <input type="range" min="0" max="100" value="0" data-s></label><button type="button" class="ghost-btn" data-n>New parallelogram</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [b,h,o]=SETS[k],t=q('s').value/100,P=plane({xmax:b+o,ymax:h,u:40});
    const tri=[[0,0],[o,0],[o,h]].map(([x,y])=>[x+t*b,y]),rest=[[o,0],[b,0],[b+o,h],[o,h]];
    const g=P.grid()+P.poly(rest,'sh-a')+P.poly(tri,'sh-b')+P.line([o,0],[o,h],'hgt')+P.rt(o,0)+P.text(o,h/2,`${h}`,'lbl st',8)+P.text(b/2+t*o,0,`${b}`,'lbl',0,16);
    q('f').innerHTML=P.svg(g,`Parallelogram with base ${b} and height ${h}`);
    q('r').innerHTML=t===1?`<span class="ok">It’s a ${b} × ${h} rectangle now: ${b} × ${h} = <b>${b*h}</b> square units.</span> The parallelogram had the same area: base × height.`:`Base ${b}, height ${h}. Slide the blue triangle all the way to the other end.`;
  };
  q('s').addEventListener('input',draw);
  q('n').onclick=()=>{k=(k+1)%SETS.length;q('s').value=0;draw();};
  draw();
}
function wParaLean(el){
  const q=Q(el),P=plane({xmin:-3,xmax:11,ymax:4,u:32});
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the top edge <input type="range" min="-3" max="6" step="0.5" value="2" data-s></label></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const o=+q('s').value,out=o<0||o>5;
    const g=P.grid()+P.poly([[0,0],[5,0],[5+o,4],[o,4]],'sh-a')+heightMark(P,o,4,0,5)+P.text(2.5,0,'5','lbl',0,16)+(o<2.5+o/2?P.text(o,2,'4','lbl en',-8):P.text(o,2,'4','lbl st',8))+P.text(5+o/2,2,fmt(Math.hypot(o,4)),'lbl s cy st',10);
    q('f').innerHTML=P.svg(g,'Parallelogram with base 5 and height 4');
    q('r').innerHTML=`Base <b>5</b> · Height <b>4</b> · Slanted side <b>${fmt(Math.hypot(o,4))}</b><br>Area = 5 × 4 = <b>20</b> square units, however far it leans.${out?'<br><span class="dimline">The height is outside the shape now, so the base is extended with a dotted line.</span>':''}`;
  };
  q('s').addEventListener('input',draw);draw();
}

/* ---------- Chapter 3 widgets ---------- */
function wTriCopy(el){
  const q=Q(el),SETS=[[6,4,2],[6,3,5],[4,4,1],[5,4,-1]];let k=0;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Turn the copy <input type="range" min="0" max="100" value="0" data-s></label><button type="button" class="ghost-btn" data-n>New triangle</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [b,h,c]=SETS[k],t=q('s').value/100,M=[(b+c)/2,h/2],r=Math.max(Math.hypot(...M),Math.hypot(b-M[0],M[1]));
    const xmin=Math.floor(Math.min(0,c,M[0]-r)),xmax=Math.ceil(Math.max(b,c,M[0]+r)),ymin=Math.floor(M[1]-r),ymax=Math.ceil(Math.max(h,M[1]+r));
    const P=plane({xmin,xmax,ymin,ymax,u:Math.min(34,440/(xmax-xmin))}),th=Math.PI*t;
    const rot=([x,y])=>{const dx=x-M[0],dy=y-M[1];return [M[0]+dx*Math.cos(th)-dy*Math.sin(th),M[1]+dx*Math.sin(th)+dy*Math.cos(th)];};
    const T=[[0,0],[b,0],[c,h]];
    const g=P.grid()+P.poly(T.map(rot),'sh-b')+P.poly(T,'sh-a')+heightMark(P,c,h,0,b)+`<circle class="pt" cx="${P.X(M[0])}" cy="${P.Y(M[1])}" r="4"/>`+P.text(b/2,0,`${b}`,'lbl',0,16)+(c<(b+c)/3?P.text(c,h/2,`${h}`,'lbl en',-8):P.text(c,h/2,`${h}`,'lbl st',8));
    q('f').innerHTML=P.svg(g,`Triangle with base ${b} and height ${h}, and a turning copy`);
    q('r').innerHTML=t===1?`<span class="ok">Two copies make a parallelogram: ${b} × ${h} = ${b*h}. One triangle is half of that: <b>${b*h/2}</b> square units.</span>`:`Turn the blue copy around the dot in the middle of the slanted side.`;
  };
  q('s').addEventListener('input',draw);
  q('n').onclick=()=>{k=(k+1)%SETS.length;q('s').value=0;draw();};
  draw();
}
function wTriApex(el){
  const q=Q(el),P=plane({xmin:-3,xmax:9,ymax:4,u:34});
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><label class="slider">Slide the top corner <input type="range" min="-3" max="9" step="0.5" value="2" data-s></label></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const c=+q('s').value,out=c<0||c>6;
    const g=P.grid()+P.line([-3,4],[9,4],'ext')+P.poly([[0,0],[6,0],[c,4]],'sh-a')+heightMark(P,c,4,0,6)+P.text(3,0,'6','lbl',0,16)+(c<(6+c)/3?P.text(c,2,'4','lbl en',-8):P.text(c,2,'4','lbl st',8));
    q('f').innerHTML=P.svg(g,'Triangle with base 6 and height 4');
    q('r').innerHTML=`Base <b>6</b> · Height <b>4</b> · Area = ½ × 6 × 4 = <b>12</b> square units${out?'<br><span class="dimline">The height lands outside the triangle, so the base is extended with a dotted line.</span>':''}`;
  };
  q('s').addEventListener('input',draw);draw();
}

/* ---------- Chapter 4 widget ---------- */
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

/* ---------- nets: flat faces, each hinged to a parent ---------- */
/* poly: face corners in the flat net, [x,y]. hinge: the edge shared with the parent.
   angle: how far the face turns at full fold (default 90°). */
const Rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
function rectNet(l,w,h){
  const x0=h,y0=h;
  return {faces:[
    {id:'bottom',name:'Bottom',poly:Rect(x0,y0,x0+l,y0+w),col:0,dims:`${l} × ${w}`,area:l*w},
    {id:'front',name:'Front',poly:Rect(x0,y0+w,x0+l,y0+w+h),parent:'bottom',hinge:[[x0,y0+w],[x0+l,y0+w]],col:1,dims:`${l} × ${h}`,area:l*h},
    {id:'back',name:'Back',poly:Rect(x0,0,x0+l,y0),parent:'bottom',hinge:[[x0,y0],[x0+l,y0]],col:1,dims:`${l} × ${h}`,area:l*h},
    {id:'left',name:'Left',poly:Rect(0,y0,x0,y0+w),parent:'bottom',hinge:[[x0,y0],[x0,y0+w]],col:2,dims:`${w} × ${h}`,area:w*h},
    {id:'right',name:'Right',poly:Rect(x0+l,y0,x0+l+h,y0+w),parent:'bottom',hinge:[[x0+l,y0],[x0+l,y0+w]],col:2,dims:`${w} × ${h}`,area:w*h},
    {id:'top',name:'Top',poly:Rect(x0,y0+w+h,x0+l,y0+2*w+h),parent:'front',hinge:[[x0,y0+w+h],[x0+l,y0+w+h]],col:0,dims:`${l} × ${w}`,area:l*w}
  ]};
}
/* right-triangle prism: legs 3 and 4, long side 5, length 6 */
function triPrismNet(){
  const L=6,a=Math.atan2(3,4);
  return {faces:[
    {id:'r4',name:'Rectangle',poly:Rect(3,3,7,3+L),col:2,dims:'4 × 6',area:24},
    {id:'r3',name:'Rectangle',poly:Rect(0,3,3,3+L),parent:'r4',hinge:[[3,3],[3,3+L]],col:1,dims:'3 × 6',area:18},
    {id:'r5',name:'Rectangle',poly:Rect(7,3,12,3+L),parent:'r4',hinge:[[7,3],[7,3+L]],angle:Math.PI-a,col:3,dims:'5 × 6',area:30},
    {id:'t1',name:'Triangle',poly:[[3,3+L],[7,3+L],[3,6+L]],parent:'r4',hinge:[[3,3+L],[7,3+L]],col:0,dims:'½ × 4 × 3',area:6},
    {id:'t2',name:'Triangle',poly:[[3,3],[7,3],[3,0]],parent:'r4',hinge:[[3,3],[7,3]],col:0,dims:'½ × 4 × 3',area:6}
  ]};
}
/* square pyramid: base b, triangle faces with height s */
function pyramidNet(b,s){
  const x0=s,y0=s,m=b/2,ang=Math.PI-Math.acos(m/s),T=(poly,hinge,id)=>({id,name:'Triangle',poly,parent:'base',hinge,angle:ang,col:1,dims:`½ × ${b} × ${s}`,area:b*s/2});
  return {faces:[
    {id:'base',name:'Base',poly:Rect(x0,y0,x0+b,y0+b),col:0,dims:`${b} × ${b}`,area:b*b},
    T([[x0,y0],[x0+b,y0],[x0+m,y0-s]],[[x0,y0],[x0+b,y0]],'t1'),
    T([[x0,y0+b],[x0+b,y0+b],[x0+m,y0+b+s]],[[x0,y0+b],[x0+b,y0+b]],'t2'),
    T([[x0,y0],[x0,y0+b],[x0-s,y0+m]],[[x0,y0],[x0,y0+b]],'t3'),
    T([[x0+b,y0],[x0+b,y0+b],[x0+b+s,y0+m]],[[x0+b,y0],[x0+b,y0+b]],'t4')
  ]};
}
/* six unit squares; each folds 90° up from its neighbor, starting at the square with the most neighbors */
function cubeNet(cells,valid){
  const K=(c,r)=>c+','+r,has=new Set(cells.map(c=>K(...c)));
  const nb=([c,r])=>[[c+1,r],[c-1,r],[c,r+1],[c,r-1]].filter(p=>has.has(K(...p)));
  const root=cells.reduce((a,b)=>nb(b).length>nb(a).length?b:a),sq=(c,r)=>Rect(c,r,c+1,r+1);
  const faces=[{id:K(...root),name:'Square',poly:sq(...root),col:0,dims:'1 × 1',area:1}],seen=new Set([K(...root)]),todo=[root];
  while(todo.length){
    const p=todo.shift(),[c,r]=p;
    for(const n of nb(p)){
      const k=K(...n);if(seen.has(k))continue;seen.add(k);todo.push(n);
      const [c2,r2]=n,hinge=c2>c?[[c+1,r],[c+1,r+1]]:c2<c?[[c,r],[c,r+1]]:r2>r?[[c,r+1],[c+1,r+1]]:[[c,r],[c+1,r]];
      faces.push({id:k,name:'Square',poly:sq(...n),parent:K(...p),hinge,col:faces.length,dims:'1 × 1',area:1});
    }
  }
  return {faces,valid};
}
const CUBE_NETS=[
  {cells:[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],valid:true},
  {cells:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],valid:false},
  {cells:[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],valid:true},
  {cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[1,1]],valid:false},
  {cells:[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],valid:true},
  {cells:[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],valid:true}
];
function netSvg(net,{counted=new Set(),labels=true,tap=false,maxW=440,u=40}={}){
  const xs=net.faces.flatMap(f=>f.poly.map(p=>p[0])),ys=net.faces.flatMap(f=>f.poly.map(p=>p[1]));
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const P=plane({xmin,xmax,ymin,ymax,u:Math.min(u,maxW/(xmax-xmin)),pad:14,down:true});
  let o='';
  net.faces.forEach(f=>{o+=`<polygon class="nf${tap?' tap':''}" data-id="${f.id}" points="${P.pts(f.poly)}" style="fill:${COLS[f.col%6]}${counted.has(f.id)?'cc':'4d'}"/>`;});
  if(labels)net.faces.forEach(f=>{const [x,y]=cen(f.poly);o+=P.text(x,y,(counted.has(f.id)?'✓ ':'')+f.dims,'lbl s');});
  return P.svg(o,'A net: the flat pattern of a 3D shape');
}
const thumbSvg=cells=>{const s=10,xs=cells.map(c=>c[0]),ys=cells.map(c=>c[1]),w=(Math.max(...xs)+1)*s,h=(Math.max(...ys)+1)*s;
  return `<svg viewBox="-2 -2 ${w+4} ${h+4}" aria-hidden="true">${cells.map(([c,r])=>`<rect x="${c*s}" y="${r*s}" width="${s}" height="${s}" fill="rgba(127,227,255,.35)" stroke="#7fe3ff" stroke-width="1.2"/>`).join('')}</svg>`;};

/* ---------- 3D (three.js, loaded only when needed) ---------- */
let T3P=null;
function load3D(){
  if(T3P)return T3P;
  T3P=(async()=>{
    const c=document.createElement('canvas'),gl=c.getContext('webgl2')||c.getContext('webgl');
    if(!gl)throw new Error('no WebGL');
    const ext=gl.getExtension('WEBGL_lose_context');if(ext)ext.loseContext();
    const timeout=new Promise((_,no)=>setTimeout(()=>no(new Error('timed out')),10000));
    const [THREE,oc,css]=await Promise.race([Promise.all([import('three'),import('three/addons/controls/OrbitControls.js'),import('three/addons/renderers/CSS2DRenderer.js')]),timeout]);
    return {THREE,OrbitControls:oc.OrbitControls,CSS2DRenderer:css.CSS2DRenderer,CSS2DObject:css.CSS2DObject};
  })();
  T3P.catch(()=>{});
  return T3P;
}
/* Folding: every face sits in an inner group drawn in flat net coordinates. Its outer group turns
   around the hinge line, and children hang off the parent's inner group, so folds stack up. */
function buildNet(THREE,net){
  const V=p=>new THREE.Vector3(p[0],0,p[1]);
  const root=new THREE.Group(),holder=new THREE.Group(),nodes={},list=[];root.add(holder);
  for(const f of net.faces){
    const outer=new THREE.Group(),inner=new THREE.Group();outer.add(inner);
    let axis=null,sign=1;
    if(f.parent){
      const a=V(f.hinge[0]),b=V(f.hinge[1]);
      outer.position.copy(a);inner.position.copy(a).negate();axis=b.clone().sub(a).normalize();
      sign=V(cen(f.poly)).sub(a).applyAxisAngle(axis,.1).y>0?1:-1;
      nodes[f.parent].inner.add(outer);
    }else holder.add(outer);
    const n={f,outer,inner,axis,sign,angle:f.angle??Math.PI/2};nodes[f.id]=n;list.push(n);
  }
  const setFold=t=>{for(const n of list)if(n.axis)n.outer.quaternion.setFromAxisAngle(n.axis,n.sign*n.angle*t);};
  const corners=n=>n.f.poly.map(p=>n.inner.localToWorld(V(p)));
  const bbox=()=>{root.updateMatrixWorld(true);const b=new THREE.Box3();list.forEach(n=>corners(n).forEach(p=>b.expandByPoint(p)));return b;};
  setFold(1);const b1=bbox();setFold(0);const b0=bbox();
  /* folded shape is closed when every edge meets exactly one other edge and no two faces land in the same spot */
  const check=()=>{
    setFold(1);root.updateMatrixWorld(true);
    const P=list.map(corners),E=[];
    P.forEach((pts,i)=>pts.forEach((p,j)=>E.push({i,a:p,b:pts[(j+1)%pts.length]})));
    const same=(e,g)=>(e.a.distanceTo(g.a)<1e-3&&e.b.distanceTo(g.b)<1e-3)||(e.a.distanceTo(g.b)<1e-3&&e.b.distanceTo(g.a)<1e-3);
    const edgesOk=E.every(e=>E.filter(g=>g!==e&&g.i!==e.i&&same(e,g)).length===1);
    const C=P.map(pts=>pts.reduce((s,p)=>s.add(p),new THREE.Vector3()).divideScalar(pts.length)),overlaps=[];
    for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++)if(C[i].distanceTo(C[j])<.05)overlaps.push([list[i].f.id,list[j].f.id]);
    return {closed:edgesOk&&!overlaps.length,overlaps};
  };
  return {root,holder,nodes,list,setFold,check,b0,b1};
}
function stage(el,T,dist){
  const {THREE,OrbitControls,CSS2DRenderer}=T,view=Q(el)('v');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  view.prepend(renderer.domElement);
  const lab=new CSS2DRenderer();lab.domElement.className='labels3d';view.appendChild(lab.domElement);
  const scene=new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff,0x2a4870,1.9));
  const sun=new THREE.DirectionalLight(0xffffff,1.3);sun.position.set(4,10,6);scene.add(sun);
  const camera=new THREE.PerspectiveCamera(38,4/3,.1,1000),controls=new OrbitControls(camera,renderer.domElement);
  controls.enablePan=false;
  const S={THREE,scene,camera,controls,renderer,view,before:null,
    render(){if(S.before)S.before();renderer.render(scene,camera);lab.render(scene,camera);},
    frame(d){camera.position.copy(new THREE.Vector3(.45,.68,.62).normalize().multiplyScalar(d));controls.target.set(0,0,0);controls.minDistance=d*.35;controls.maxDistance=d*2.2;controls.update();S.render();},
    spin(dir){const off=camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),dir*Math.PI/8);camera.position.copy(controls.target).add(off);controls.update();S.render();},
    dispose(){ro.disconnect();controls.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>m.dispose());});renderer.dispose();renderer.forceContextLoss();}};
  controls.addEventListener('change',()=>S.render());
  const ro=new ResizeObserver(()=>{const w=view.clientWidth,h=view.clientHeight;if(!w||!h)return;renderer.setSize(w,h);lab.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();S.render();});
  ro.observe(view);
  const ld=view.querySelector('.loading');if(ld)ld.remove();
  S.frame(dist);
  return S;
}
/* A net you can fold, turn, and tap. Falls back to a flat SVG net without WebGL. */
function solid3D(el,net,opts={}){
  const api={t:opts.fold??1,locked:!!opts.locked,disposed:false,mode:'loading'},counted=new Set();
  let cleanup=()=>{},paint=()=>{},applyLock=()=>{};
  api.dispose=()=>{api.disposed=true;cleanup();};
  api.setLocked=v=>{api.locked=v;applyLock();};
  el.innerHTML=`<div class="view3d" data-v><p class="loading">Loading 3D…</p></div><div class="wrow" data-ctl></div>${opts.count?'<div class="chips" data-chips></div>':''}<p class="readout" data-r></p>`;
  const q=Q(el);
  const updCount=()=>{
    if(!opts.count)return;
    const fs=net.faces.filter(f=>counted.has(f.id)),tot=fs.reduce((s,f)=>s+f.area,0),n=net.faces.length;
    q('r').innerHTML=!fs.length?'Tap a face (or a button) to add its area.':fs.length===n?`<span class="ok">All ${n} faces: ${fs.map(f=>f.area).join(' + ')} = <b>${tot}</b> square units. That’s the surface area!</span>`:`Faces counted: ${fs.map(f=>f.area).join(' + ')} = <b>${tot}</b> · ${n-fs.length} face${n-fs.length>1?'s':''} left`;
    q('chips').querySelectorAll('[data-id]').forEach(b=>b.setAttribute('aria-pressed',counted.has(b.dataset.id)));
  };
  const toggle=id=>{counted.has(id)?counted.delete(id):counted.add(id);updCount();paint();};
  api.toggle=toggle;api.counted=counted;
  if(opts.count){
    q('chips').innerHTML=net.faces.map(f=>`<button type="button" class="chip" data-id="${f.id}" aria-pressed="false">${f.name} ${f.dims}</button>`).join('');
    q('chips').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)toggle(b.dataset.id);});
    updCount();
  }
  const done=t=>{if(t>=1&&opts.onFolded)opts.onFolded();};

  function initFlat(){
    api.mode='flat';
    const draw=()=>{q('v').outerHTML=`<div data-v><p class="note">The 3D view can’t load on this device, so here is the flat net. Each face appears once.</p><div class="fig">${netSvg(net,{counted,tap:opts.count,labels:opts.labels!==false})}</div></div>`;};
    paint=draw;draw();
    el.addEventListener('click',e=>{const p=e.target.closest('polygon[data-id]');if(p&&opts.count)toggle(p.dataset.id);});
    if(opts.onFolded){q('ctl').innerHTML=`<button type="button" class="ghost-btn" data-fbtn>Check it</button>`;q('fbtn').onclick=()=>done(1);applyLock=()=>{q('fbtn').disabled=api.locked;};applyLock();}
    api.check=()=>({closed:net.valid!==false,overlaps:[]});
    api.animateTo=t=>done(t);
  }
  function init3D(T){
    api.mode='3d';
    const {THREE,CSS2DObject}=T,B=buildNet(THREE,net);
    const s0=B.b0.getSize(new THREE.Vector3()),s1=B.b1.getSize(new THREE.Vector3()),c0=B.b0.getCenter(new THREE.Vector3()),c1=B.b1.getCenter(new THREE.Vector3());
    const S=stage(el,T,opts.slider?Math.max(s0.x,s0.z)*1.45+1.5:Math.max(s1.x,s1.y,s1.z)*2.3+1);
    S.scene.add(B.root);
    const meshes=[];
    B.list.forEach(n=>{
      const f=n.f,pts=f.poly.map(p=>new THREE.Vector3(p[0],0,p[1])),tri=[];
      for(let i=1;i<pts.length-1;i++)tri.push(pts[0],pts[i],pts[i+1]);
      const geo=new THREE.BufferGeometry().setFromPoints(tri);geo.computeVertexNormals();
      n.mat=new THREE.MeshStandardMaterial({color:COLS[f.col%6],side:THREE.DoubleSide,roughness:.75,metalness:0,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
      const mesh=new THREE.Mesh(geo,n.mat);mesh.userData.id=f.id;n.inner.add(mesh);meshes.push(mesh);
      n.inner.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xf3f6fb})));
      if(opts.labels!==false){const d=document.createElement('div');d.className='flabel';d.textContent=f.dims;const lo=new CSS2DObject(d),[cx,cy]=cen(f.poly);lo.position.set(cx,0,cy);n.inner.add(lo);n.label=lo;n.ldiv=d;}
    });
    /* show a label only on the side of its face that points at the camera */
    const up=new THREE.Vector3(0,1,0),qt=new THREE.Quaternion();
    S.before=()=>{
      if(opts.labels===false)return;
      B.root.updateMatrixWorld(true);
      const C=B.list.map(n=>{const P=n.f.poly.map(p=>n.inner.localToWorld(new THREE.Vector3(p[0],0,p[1])));return P.reduce((s,p)=>s.add(p),new THREE.Vector3()).divideScalar(P.length);});
      const mid=C.reduce((s,p)=>s.add(p),new THREE.Vector3()).divideScalar(C.length);
      B.list.forEach((n,i)=>{
        const nm=up.clone().applyQuaternion(n.inner.getWorldQuaternion(qt));
        if(api.t<.5?nm.y<0:nm.dot(C[i].clone().sub(mid))<0)nm.negate();
        n.label.visible=nm.dot(S.camera.position.clone().sub(C[i]))>0;
      });
    };
    let bad=new Set();
    paint=()=>{B.list.forEach(n=>{const on=counted.has(n.f.id);n.mat.color.set(bad.has(n.f.id)?0xff4d4d:COLS[n.f.col%6]);n.mat.emissive.set(bad.has(n.f.id)?0xff3b3b:on?COLS[n.f.col%6]:0x000000);n.mat.emissiveIntensity=bad.has(n.f.id)?.5:on?.45:0;if(n.ldiv){n.ldiv.textContent=(on?'✓ ':'')+n.f.dims;n.ldiv.classList.toggle('on',on);}});S.render();};
    api.markBad=ids=>{bad=new Set(ids);paint();};
    let raf=0;
    const setT=t=>{api.t=t;B.setFold(t);B.holder.position.lerpVectors(c0,c1,t).negate();const s=q('fold');if(s)s.value=Math.round(t*100);const fb=q('fbtn');if(fb)fb.textContent=t<1?'Fold it':'Unfold it';S.render();};
    api.setT=setT;
    api.animateTo=target=>{
      cancelAnimationFrame(raf);
      if(reduceMotion){setT(target);return done(target);}
      const from=api.t,start=performance.now(),D=1300*Math.abs(target-from)+1;
      const step=now=>{const k=Math.min(1,(now-start)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;setT(from+(target-from)*e);if(k<1)raf=requestAnimationFrame(step);else done(target);};
      raf=requestAnimationFrame(step);
    };
    api.check=()=>{const r=B.check();B.setFold(api.t);S.render();return r;};
    q('ctl').innerHTML=(opts.slider?`<label class="slider"><span>Net</span><input type="range" min="0" max="100" value="${Math.round(api.t*100)}" data-fold aria-label="Fold amount"><span>Solid</span></label><button type="button" class="ghost-btn" data-fbtn>Fold it</button>`:'')
      +`<button type="button" class="ghost-btn" data-spin="-1" aria-label="Turn left">⟲</button><button type="button" class="ghost-btn" data-spin="1" aria-label="Turn right">⟳</button>`;
    q('ctl').querySelectorAll('[data-spin]').forEach(b=>b.onclick=()=>S.spin(+b.dataset.spin));
    if(opts.slider){
      q('fold').addEventListener('input',e=>{cancelAnimationFrame(raf);setT(e.target.value/100);if(+e.target.value===100)done(1);});
      q('fbtn').onclick=()=>api.animateTo(api.t<1?1:0);
      applyLock=()=>{q('fold').disabled=api.locked;q('fbtn').disabled=api.locked;};applyLock();
    }
    const hint=document.createElement('p');hint.className='hint3d';hint.textContent=opts.count?'Drag to turn · tap a face':'Drag to turn · pinch to zoom';S.view.appendChild(hint);
    /* tap = press and release without dragging */
    const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();let down=null;
    const cv=S.renderer.domElement;
    cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
    cv.addEventListener('pointerup',e=>{
      if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;down=null;
      const r=cv.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
      ray.setFromCamera(ptr,S.camera);const hit=ray.intersectObjects(meshes,false)[0];
      if(hit&&opts.count)toggle(hit.object.userData.id);
    });
    setT(api.t);paint();
    cleanup=()=>{cancelAnimationFrame(raf);S.dispose();};
    api.stage=S;api.build=B;
  }
  api.ready=load3D().then(T=>{if(!api.disposed)init3D(T);},()=>{if(!api.disposed)initFlat();});
  return api;
}

/* ---------- Chapter 5 widgets ---------- */
function wPick(el){
  const q=Q(el),SOL={tri:{label:'Triangular prism',net:triPrismNet},pyr:{label:'Square pyramid',net:()=>pyramidNet(4,3)}};let m='tri',api=null;
  el.innerHTML=`<div class="seg" role="group" aria-label="Shape">${Object.entries(SOL).map(([k,v])=>`<button type="button" data-m="${k}">${v.label}</button>`).join('')}</div><div data-st></div>`;
  const go=()=>{if(api)api.dispose();api=solid3D(q('st'),SOL[m].net(),{fold:0,slider:true,count:true});el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));};
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{if(m!==b.dataset.m){m=b.dataset.m;go();}});
  go();
  return ()=>api&&api.dispose();
}
function wCubeNets(el){
  const q=Q(el),tried={};let cur=-1,api=null,pred=null;
  el.innerHTML=`<div class="thumbs" data-th role="group" aria-label="Pick a net"></div><div data-st></div><div class="wrow" data-pr></div><p class="readout" data-res></p>`;
  const thumbs=()=>{q('th').innerHTML=CUBE_NETS.map((n,i)=>`<button type="button" class="thumb${i===cur?' cur':''}" data-i="${i}" aria-label="Net ${i+1}${tried[i]?(tried[i]==='yes'?', folds into a cube':', does not fold into a cube'):''}">${thumbSvg(n.cells)}<span class="${tried[i]||''}">${tried[i]==='yes'?'✓ cube':tried[i]==='no'?'✗ not':'Net '+(i+1)}</span></button>`).join('');};
  const reveal=()=>{
    if(!pred||!api)return;
    const r=api.check(),ok=r.closed,right=(pred==='yes')===ok;
    tried[cur]=ok?'yes':'no';thumbs();
    if(!ok&&api.markBad)api.markBad(r.overlaps.flat());
    q('res').innerHTML=`${right?'<span class="ok">You predicted it!</span>':'<span class="no">Surprise!</span>'} ${ok?'It folds into a cube: all 6 faces land in different places and close it up.':'It doesn’t fold into a cube. Two faces land on the same spot (shown in red), so one side of the cube is left open.'}${Object.keys(tried).length<CUBE_NETS.length?' Try another net.':' You tried them all!'}`;
  };
  const choose=i=>{
    if(api)api.dispose();cur=i;pred=null;thumbs();
    api=solid3D(q('st'),cubeNet(CUBE_NETS[i].cells,CUBE_NETS[i].valid),{fold:0,slider:true,labels:false,locked:true,onFolded:reveal});
    q('pr').innerHTML=`<span class="note" style="margin:0">Will it fold into a cube?</span><button type="button" class="ghost-btn" data-p="yes">Yes, a cube</button><button type="button" class="ghost-btn" data-p="no">No</button>`;
    q('pr').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{pred=b.dataset.p;q('pr').querySelectorAll('[data-p]').forEach(x=>{x.disabled=true;x.style.borderColor=x===b?'var(--gold)':'';});api.setLocked(false);q('res').innerHTML='Now fold it: tap <b>Fold it</b> or use the slider.';});
    q('res').innerHTML='Make a prediction first.';
  };
  q('th').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)choose(+b.dataset.i);});
  choose(0);
  return ()=>api&&api.dispose();
}

/* ---------- Chapter 6 widget: a cube of unit cubes ---------- */
function wCubes(el){
  const q=Q(el);let s=3,mode='faces',S=null,grp=null,disposed=false;
  el.innerHTML=`<div class="view3d" data-v><p class="loading">Loading 3D…</p></div><div class="wrow"><label class="slider">Edge length <input type="range" min="1" max="6" value="3" data-s><b data-sv>3</b></label><div class="seg" style="margin:0" role="group" aria-label="Show"><button type="button" data-m="faces">Faces</button><button type="button" data-m="cubes">Cubes</button></div><span data-sp></span></div><p class="readout" data-r></p>`;
  const read=()=>{q('sv').textContent=s;
    q('r').innerHTML=`<span class="${mode==='faces'?'':'dimline'}">One face: ${s} × ${s} = ${s}² = ${s*s} square units<br>Surface area: 6 × ${s*s} = <b>${6*s*s}</b> square units</span><br><span class="${mode==='cubes'?'':'dimline'}">Volume: ${s} × ${s} × ${s} = ${s}³ = <b>${s**3}</b> cubic units</span>`;
    el.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===mode));};
  const flat=()=>{const P=plane({xmax:s,ymax:s,u:Math.min(44,300/s)});q('v').outerHTML=`<div data-v><p class="note">The 3D view can’t load on this device. Here is one face of the cube.</p><div class="fig">${P.svg(P.poly(Rect(0,0,s,s),'sh-a')+P.grid(),'One face of the cube')}</div></div>`;};
  const build=()=>{
    if(!S)return flat();
    const THREE=S.THREE;
    if(grp){S.scene.remove(grp);grp.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>m.dispose());});}
    grp=new THREE.Group();const h=s/2;
    if(mode==='faces'){
      const mats=[0,0,1,1,2,2].map(c=>new THREE.MeshStandardMaterial({color:COLS[c],roughness:.75,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(s,s,s),mats));
      const L=[],e=h+.004;
      for(let i=0;i<=s;i++){const v=-h+i;
        for(const sg of [-1,1]){
          L.push(sg*e,-h,v, sg*e,h,v, sg*e,v,-h, sg*e,v,h);
          L.push(-h,sg*e,v, h,sg*e,v, v,sg*e,-h, v,sg*e,h);
          L.push(-h,v,sg*e, h,v,sg*e, v,-h,sg*e, v,h,sg*e);
        }}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(L,3));
      grp.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x0d2a4e})));
    }else{
      const m=new THREE.InstancedMesh(new THREE.BoxGeometry(.86,.86,.86),new THREE.MeshStandardMaterial({roughness:.7}),s**3),M=new THREE.Matrix4(),c=new THREE.Color();let i=0;
      for(let x=0;x<s;x++)for(let y=0;y<s;y++)for(let z=0;z<s;z++){M.makeTranslation(x-h+.5,y-h+.5,z-h+.5);m.setMatrixAt(i,M);m.setColorAt(i,c.set(COLS[(x+y+z)%2]));i++;}
      grp.add(m);
    }
    S.scene.add(grp);S.frame(s*2.9+2.5);
  };
  q('s').addEventListener('input',e=>{s=+e.target.value;read();build();});
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;read();build();});
  read();
  load3D().then(T=>{if(disposed)return;S=stage(el,T,s*2.9+2.5);q('sp').innerHTML=`<button type="button" class="ghost-btn" data-spin="-1" aria-label="Turn left">⟲</button> <button type="button" class="ghost-btn" data-spin="1" aria-label="Turn right">⟳</button>`;q('sp').querySelectorAll('[data-spin]').forEach(b=>b.onclick=()=>S.spin(+b.dataset.spin));build();},()=>{if(!disposed)flat();});
  return ()=>{disposed=true;if(S)S.dispose();};
}

/* ---------- quick-check figures ---------- */
const F={};
{const P=plane({xmax:5,ymax:3,u:44});F.rect53=P.svg(P.grid()+P.poly(Rect(0,0,5,3),'sh-a'),'A 5 by 3 rectangle on a grid');}
{const P=plane({xmax:5,ymax:4,u:42});F.notch=P.svg(P.grid()+P.poly([[0,0],[5,0],[5,4],[3,4],[3,3],[1,3],[1,4],[0,4]],'sh-a'),'A 5 by 4 rectangle with a 2 by 1 notch cut from the top');}
{const P=plane({xmax:7,ymax:3,u:44});F.para=P.svg(P.grid()+P.poly([[0,0],[5,0],[7,3],[2,3]],'sh-a')+heightMark(P,2,3,0,5)+P.text(2.5,0,'5','lbl',0,16)+P.text(2,1.5,'3','lbl st',8)+P.text(1,1.5,'3.6','lbl s cy en',-10),'Parallelogram with base 5, height 3, and slanted side 3.6');}
{const P=plane({xmax:8,ymax:3,u:44});F.whichH=P.svg(P.grid()+P.poly([[0,0],[6,0],[8,3],[2,3]],'sh-a')+P.line([4,3],[4,0],'seg-a')+P.rt(4,0)+P.line([0,0],[2,3],'seg-b')+P.line([5,3],[6,0],'seg-c')+P.text(4,1.5,'A','lbl',12)+P.text(1,1.5,'B','lbl cy',-14)+P.text(5.5,1.5,'C','lbl',14),'Parallelogram with three segments labeled A, B, and C');}
{const P=plane({xmax:7,ymax:4,u:40});F.leanPara=P.svg(P.grid()+P.poly([[0,0],[3,0],[7,4],[4,4]],'sh-a')+heightMark(P,4,4,0,3)+P.text(1.5,0,'3','lbl',0,16)+P.text(4,2,'4','lbl st',8)+P.text(2,2,'5.7','lbl s cy en',-10),'A leaning parallelogram with base 3 and height 4, and a slanted side of 5.7');}
{const P=plane({xmax:8,ymax:5,u:40});F.tri85=P.svg(P.grid()+P.poly([[0,0],[8,0],[3,5]],'sh-a')+heightMark(P,3,5,0,8)+P.text(4,0,'8','lbl',0,16)+P.text(3,2.5,'5','lbl st',8),'Triangle with base 8 and height 5');}
{const P=plane({xmax:16,ymax:3,u:28});F.threeTri=P.svg(P.grid()+P.poly([[0,0],[4,0],[1,3]],'sh-a')+P.poly([[5,0],[9,0],[9,3]],'sh-b')+P.poly([[10,0],[14,0],[15.5,3]],'sh-c')+P.text(2,0,'A','lbl',0,14)+P.text(7,0,'B','lbl',0,14)+P.text(12,0,'C','lbl',0,14),'Three triangles, A, B, and C, on the same grid');}
{const P=plane({xmax:7,ymax:5,u:40});F.obtuse=P.svg(P.grid()+P.poly([[0,0],[4,0],[7,5]],'sh-a')+heightMark(P,7,5,0,4)+P.text(2,0,'4','lbl',0,16)+P.text(7,2.5,'5','lbl en',-10),'A leaning triangle with base 4 and height 5, drawn outside the triangle');}
{const P=plane({xmax:6,ymax:7,u:36});F.house=P.svg(P.grid()+P.poly(Rect(0,0,6,4),'sh-a')+P.poly([[0,4],[6,4],[3,7]],'sh-b')+P.line([3,7],[3,4],'hgt')+P.text(3,0,'6','lbl',0,16)+P.text(0,2,'4','lbl en',-10)+P.text(3,5.5,'3','lbl st',8),'A house shape: a 6 by 4 rectangle with a triangle roof of height 3');}
const shapeSvg=b=>`<svg viewBox="0 0 90 70" aria-hidden="true">${b}</svg>`;
F.polyChoices={
  pent:shapeSvg('<polygon class="sh-a" points="45,6 84,32 70,64 20,64 6,32"/>'),
  circ:shapeSvg('<circle class="sh-a" cx="45" cy="35" r="28"/>'),
  open:shapeSvg('<polyline fill="none" stroke="#ffc93c" stroke-width="3" points="8,60 26,10 45,55 64,10 82,60"/>'),
  bow:shapeSvg('<polygon class="sh-a" points="10,10 80,60 80,10 10,60"/>')
};
F.net421=netSvg(rectNet(4,2,1));
F.pyr65=netSvg(pyramidNet(6,5),{u:26});
F.cubeNetCheck=netSvg(cubeNet([[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]],true),{labels:false,u:44});

/* ---------- chapters ---------- */
const ICON={
  area:'<g fill="rgba(255,201,60,.45)" stroke="#ffc93c" stroke-width="2"><rect x="6" y="30" width="14" height="14"/><rect x="20" y="30" width="14" height="14"/><rect x="34" y="30" width="14" height="14"/><rect x="6" y="16" width="14" height="14"/><rect x="20" y="16" width="14" height="14"/></g><rect x="6" y="44" width="14" height="14" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="3 3"/>',
  para:'<polygon points="4,52 42,52 60,14 22,14" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="2.5"/><line x1="22" y1="14" x2="22" y2="52" stroke="#f3f6fb" stroke-width="2" stroke-dasharray="4 3"/>',
  tri:'<polygon points="6,54 46,54 20,12" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><polygon points="46,54 60,12 20,12" fill="rgba(127,227,255,.2)" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="4 3"/>',
  poly:'<polygon points="6,54 58,54 46,20 18,20" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="2.5"/><line x1="18" y1="20" x2="18" y2="54" stroke="#7fe3ff" stroke-width="2"/><line x1="46" y1="20" x2="46" y2="54" stroke="#7fe3ff" stroke-width="2"/>',
  net:'<g stroke="#f3f6fb" stroke-width="1.5"><rect x="22" y="4" width="18" height="14" fill="rgba(127,227,255,.5)"/><rect x="4" y="18" width="18" height="18" fill="rgba(255,138,196,.5)"/><rect x="22" y="18" width="18" height="18" fill="rgba(255,201,60,.6)"/><rect x="40" y="18" width="18" height="18" fill="rgba(255,138,196,.5)"/><rect x="22" y="36" width="18" height="14" fill="rgba(127,227,255,.5)"/><rect x="22" y="50" width="18" height="12" fill="rgba(255,201,60,.6)"/></g>',
  cube:'<g stroke="#f3f6fb" stroke-width="1.8" stroke-linejoin="round"><polygon points="32,6 56,18 32,30 8,18" fill="rgba(127,227,255,.55)"/><polygon points="8,18 32,30 32,58 8,46" fill="rgba(255,201,60,.55)"/><polygon points="56,18 32,30 32,58 56,46" fill="rgba(255,138,196,.5)"/></g>'
};
const CH=[
  {icon:'area',title:'What is area?',lessons:'Lessons 1–3',blurb:'Cover shapes with unit squares, and see why cutting and moving pieces keeps the area the same.',game:{zone:'frame',name:'Frame & Subtract'},steps:[
    {title:'Cover it with squares',widget:wTile,
      body:'<p>The <b>area</b> of a shape is the number of unit squares it takes to cover it, with no gaps and no overlaps.</p><p>Tap each square inside the outline to tile the shape.</p>',
      check:{kind:'num',unit:'square units',answer:15,fig:F.rect53,q:'How many unit squares cover this rectangle?',
        misc:[[8,'That’s 5 + 3, the two side lengths added. Count the squares inside: 3 rows of 5.'],[16,'That’s the distance around the outside (perimeter). Area counts the squares inside.']],
        explain:'3 rows of 5 squares: 3 × 5 = 15 square units.'}},
    {title:'Cut and move: same area',widget:wSlide,
      body:'<p>Cut a shape into pieces and move them around without overlapping, and the area stays the same. Every piece is still there.</p><p>Slide the gold piece into the gap.</p>',
      check:{kind:'mc',q:'Andre cuts a paper shape into two pieces and tapes them together a new way, with no gaps or overlaps. What happens to the area?',
        choices:[{id:'up',label:'It gets bigger'},{id:'down',label:'It gets smaller'},{id:'same',label:'It stays the same'}],answer:'same',
        why:{up:'No paper was added. The same pieces cover the same number of squares.',down:'No paper was lost. The same pieces cover the same number of squares.'},
        explain:'Moving pieces changes the shape, not the amount of space it covers.'}},
    {title:'Two ways to find area',widget:wTwoWays,
      body:'<p><b>Split it:</b> cut the shape into pieces you know, then add. <b>Frame it:</b> draw a rectangle around it, then subtract the parts that aren’t in the shape.</p><p>Try both buttons.</p>',
      check:{kind:'num',unit:'square units',answer:18,fig:F.notch,q:'A 5 × 4 rectangle has a notch cut out of the top. What is the area of the shape?',
        misc:[[20,'That’s the whole 5 × 4 rectangle. Subtract the notch.'],[22,'The notch is missing, so subtract it instead of adding it.']],
        explain:'Frame it: 5 × 4 = 20. The notch is 2 × 1 = 2. 20 − 2 = 18 square units.'}}
  ]},
  {icon:'para',title:'Parallelograms',lessons:'Lessons 4–6',blurb:'Turn a parallelogram into a rectangle, and find the height that really counts.',game:{zone:'para',name:'Parallelogram Plaza'},steps:[
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
  ]},
  {icon:'tri',title:'Triangles',lessons:'Lessons 7–10',blurb:'Two copies of a triangle make a parallelogram, so a triangle is half of base × height.',game:{zone:'tri',name:'Triangle Tower'},steps:[
    {title:'A triangle is half a parallelogram',widget:wTriCopy,
      body:'<p>Make a copy of any triangle and turn it around. The two copies fit together into a parallelogram.</p><p>So a triangle’s area is <b>½ × base × height</b>.</p>',
      check:{kind:'num',unit:'square units',answer:20,fig:F.tri85,q:'What is the area of this triangle?',
        misc:[[40,'8 × 5 = 40 is the whole parallelogram. A triangle is half of it.'],[13,'Multiply the base and height, then take half.']],
        explain:'½ × 8 × 5 = ½ × 40 = 20 square units.'}},
    {title:'Slide the top corner',widget:wTriApex,
      body:'<p>Slide the top corner left and right, staying at the same height. The base stays 6 and the height stays 4, so the area never changes, even when the triangle leans way over.</p>',
      check:{kind:'mc',fig:F.threeTri,q:'Which triangle has the <b>most</b> area?',
        choices:[{id:'A',label:'A'},{id:'B',label:'B'},{id:'C',label:'C'},{id:'S',label:'All the same'}],answer:'S',
        why:{A:'Count the grid squares: every triangle has base 4 and height 3.',B:'B looks different because it has a right angle, but its base is 4 and its height is 3, like the others.',C:'C leans the most, but its base is still 4 and its height is still 3.'},
        explain:'All three have base 4 and height 3, so each area is ½ × 4 × 3 = 6 square units.'}},
    {title:'Heights outside the triangle',
      body:'<p>For a triangle that leans past its base, the height lands outside. Extend the base with a dotted line and measure straight up from it to the top corner.</p>',
      check:{kind:'num',unit:'square units',answer:10,fig:F.obtuse,q:'What is the area of this triangle?',
        misc:[[20,'That’s the whole parallelogram. Take half: ½ × 4 × 5.'],[17.5,'The base is only 4. The dotted part is just an extension of the base line.']],
        explain:'Base 4, height 5 (measured outside the triangle): ½ × 4 × 5 = 10 square units.'}}
  ]},
  {icon:'poly',title:'Polygons',lessons:'Lesson 11',blurb:'Break any polygon into rectangles and triangles, or frame it and subtract.',game:{zone:'poly',name:'Polygon Park'},steps:[
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
  ]},
  {icon:'net',title:'Nets & surface area',lessons:'Lessons 12–15',blurb:'Spin 3D shapes, unfold them into nets, and add up every face.',game:{zone:'net',name:'Net Factory'},steps:[
    {title:'What is surface area?',widget:el=>{const a=solid3D(el,rectNet(4,3,2),{fold:1,count:true});return a.dispose;},
      body:'<p>A <b>polyhedron</b> is a 3D shape whose faces are all polygons. Its <b>surface area</b> is the total area of all its faces: how much paper it would take to cover it with no gaps or overlaps.</p><p>Drag to turn this box. Tap each face to add its area, including the ones on the back and the bottom.</p>',
      check:{kind:'mc',q:'How many faces does a rectangular prism (a box) have?',
        choices:[{id:'3',label:'3'},{id:'4',label:'4'},{id:'6',label:'6'},{id:'8',label:'8'}],answer:'6',
        why:{'3':'You can only see 3 faces at a time, but there are more on the back, side, and bottom.','4':'Count again: top and bottom, front and back, left and right.','8':'A box has 8 corners (vertices), but its faces are the flat sides.'},
        explain:'Top and bottom, front and back, left and right: 6 faces. Opposite faces match.'}},
    {title:'Unfold it into a net',widget:el=>{const a=solid3D(el,rectNet(4,3,2),{fold:0,slider:true,count:true});return a.dispose;},
      body:'<p>A <b>net</b> is a flat pattern that folds up into a 3D shape. Each face appears in the net exactly once, so adding up the net gives the surface area.</p><p>Fold and unfold the box. Matching colors show matching faces.</p>',
      check:{kind:'num',unit:'square units',answer:28,fig:F.net421,q:'This net folds into a 4 × 2 × 1 box. What is the box’s surface area?',
        misc:[[14,'That’s only 3 faces. The net has 6: each pair of matching faces counts twice.'],[8,'4 × 2 × 1 = 8 is the volume. Surface area adds the areas of all 6 faces.']],
        explain:'8 + 8 + 4 + 4 + 2 + 2 = 28 square units.'}},
    {title:'Prisms and pyramids',widget:wPick,
      body:'<p>A <b>prism</b> has two matching bases joined by rectangles. A <b>pyramid</b> has one base and triangles that meet at a point.</p><p>Pick a shape, fold it up, and tap faces to add up its surface area.</p>',
      check:{kind:'num',unit:'square units',answer:96,fig:F.pyr65,q:'This net folds into a square pyramid. What is its surface area?',
        misc:[[156,'Each triangle is ½ × 6 × 5 = 15, not 6 × 5 = 30.'],[60,'Don’t forget the square base: 6 × 6 = 36.'],[51,'There are 4 triangles, one on each side of the base.']],
        explain:'Base 6 × 6 = 36. Each triangle ½ × 6 × 5 = 15, and there are 4: 60. 36 + 60 = 96 square units.'}},
    {title:'Will it fold into a cube?',widget:wCubeNets,
      body:'<p>Every cube net has 6 squares, but not every set of 6 squares folds into a cube.</p><p>Pick a net, predict, then fold it to find out.</p>',
      check:{kind:'mc',fig:F.cubeNetCheck,q:'Will this net fold into a cube?',
        choices:[{id:'yes',label:'Yes'},{id:'no',label:'No'}],answer:'yes',
        why:{no:'It does fold: the row of 4 wraps around the sides, and the two squares on the ends become the top and bottom.'},
        explain:'The row of 4 wraps around to make the sides. The square above and the square below close the top and bottom.'}}
  ]},
  {icon:'cube',title:'Squares & cubes',lessons:'Lessons 16–18',blurb:'Exponents, the surface area of a cube, and square units vs. cubic units.',game:{zone:'cube',name:'Squares & Cubes Lab'},steps:[
    {title:'Squared and cubed',widget:wCubes,
      body:'<p>A number times itself can be written with an <b>exponent</b>: 5 × 5 = 5², said “5 squared.” 5 × 5 × 5 = 5³, said “5 cubed.”</p><p>A cube with edge length <i>s</i> has 6 square faces, so its surface area is <b>6 × s²</b>. Its volume is <b>s³</b>.</p>',
      check:{kind:'num',unit:'square cm',answer:96,q:'A cube has edges that are 4 cm long. What is its surface area?',
        misc:[[64,'4 × 4 × 4 = 64 is the volume (cubic cm). Surface area is 6 faces of 4 × 4.'],[16,'That’s one face. A cube has 6 faces.'],[24,'6 × 4 multiplies by the edge. Each face is 4 × 4 = 16.']],
        explain:'Each face is 4² = 16 square cm. 6 × 16 = 96 square cm.'}},
    {title:'Square units or cubic units?',
      body:'<p>Surface area covers the outside, so it’s measured in <b>square units</b> (cm², in²). Volume fills the inside, so it’s measured in <b>cubic units</b> (cm³, in³).</p>',
      check:{kind:'mc',stack:true,q:'Which unit makes sense for the amount of wrapping paper that covers a box?',
        choices:[{id:'sq',label:'square centimeters (cm²)'},{id:'cu',label:'cubic centimeters (cm³)'},{id:'cm',label:'centimeters (cm)'}],answer:'sq',
        why:{cu:'Cubic units measure how much fits inside the box (volume). Paper covers the outside.',cm:'Centimeters measure length, like one edge. Paper covers an area.'},
        explain:'Wrapping paper covers the surface, so it’s measured in square units: square centimeters.'}},
    {title:'Reading exponents',
      body:'<p>The small raised number tells how many times the number is used as a factor. 2⁴ = 2 × 2 × 2 × 2 = 16.</p>',
      check:{kind:'mc',stack:true,q:'What does <b>5³</b> mean?',
        choices:[{id:'a',label:'5 × 5 × 5'},{id:'b',label:'5 × 3'},{id:'c',label:'5 + 5 + 5'}],answer:'a',
        why:{b:'The 3 isn’t multiplied by 5. It tells how many 5s to multiply.',c:'Exponents mean multiplying, not adding.'},
        explain:'5³ = 5 × 5 × 5 = 125.'}}
  ]}
];
