/* Blueprint Builders (Grade 6 Unit 1): the problem generators, station list, and icons. Loaded by index.html and by tools/fuzz.mjs. */
const U=40;
const fmt=n=>(Math.round(n*100)/100).toLocaleString('en-US');
const r1=n=>Math.round(n*10)/10;

/* ---------- figure builder (grid units → SVG) ---------- */
class Fig{
  constructor(){this.bb=[Infinity,Infinity,-Infinity,-Infinity];this.ly={base:[],hint:[],build:[]};this.L=this.ly.base;}
  onHint(){this.L=this.ly.hint;return this;}
  on(n){this.L=this.ly[n];return this;}
  ext(x,y){const b=this.bb;if(x<b[0])b[0]=x;if(y<b[1])b[1]=y;if(x>b[2])b[2]=x;if(y>b[3])b[3]=y;}
  P(p){p.forEach(q=>this.ext(q[0],q[1]));return p.map(q=>`${q[0]*U},${q[1]*U}`).join(' ');}
  poly(p,cls='shape',attr=''){this.L.push(`<polygon class="${cls}" points="${this.P(p)}" ${attr}/>`);return this;}
  line(x1,y1,x2,y2,cls='edge'){this.ext(x1,y1);this.ext(x2,y2);this.L.push(`<line class="${cls}" x1="${x1*U}" y1="${y1*U}" x2="${x2*U}" y2="${y2*U}"/>`);return this;}
  lbl(x,y,t,cls=''){t=String(t);const w=t.length*13.5+18;this.ext(x,y);this.L.push(`<g class="lbl ${cls}"><rect x="${x*U-w/2}" y="${y*U-17}" width="${w}" height="34" rx="8"/><text x="${x*U}" y="${y*U+1}">${t}</text></g>`);return this;}
  txt(x,y,t){this.L.push(`<text class="area-t" x="${x*U}" y="${y*U}">${t}</text>`);return this;}
  ra(x,y,ux,uy,vx,vy,s=.42){const q=[[x+ux*s,y+uy*s],[x+(ux+vx)*s,y+(uy+vy)*s],[x+vx*s,y+vy*s]];this.L.push(`<polyline class="ra" points="${q.map(p=>p[0]*U+','+p[1]*U).join(' ')}"/>`);return this;}
  cand(id,x1,y1,x2,y2){this.ext(x1,y1);this.ext(x2,y2);const a=`x1="${x1*U}" y1="${y1*U}" x2="${x2*U}" y2="${y2*U}"`;this.L.push(`<g class="cand" data-id="${id}" tabindex="0" role="button" aria-label="Segment ${id}"><line class="hit" ${a}/><line class="seg" ${a}/></g>`);return this;}
  svg(withHint,extra=[]){
    const pad=1.3,[a,b,c,d]=this.bb;
    const x0=Math.floor(a-pad),y0=Math.floor(b-pad),x1=Math.ceil(c+pad),y1=Math.ceil(d+pad);
    let g='';
    for(let x=x0;x<=x1;x++)g+=`<line x1="${x*U}" y1="${y0*U}" x2="${x*U}" y2="${y1*U}"/>`;
    for(let y=y0;y<=y1;y++)g+=`<line x1="${x0*U}" y1="${y*U}" x2="${x1*U}" y2="${y*U}"/>`;
    return `<svg viewBox="${x0*U} ${y0*U} ${(x1-x0)*U} ${(y1-y0)*U}" role="img" aria-label="Figure drawn on grid paper"><g class="grid">${g}</g>${this.ly.base.join('')}${extra.map(n=>this.ly[n].join('')).join('')}${withHint?`<g class="hl">${this.ly.hint.join('')}</g>`:''}</svg>`;
  }
}
function outward(p1,p2,pts,d=.85){
  const cx=pts.reduce((s,p)=>s+p[0],0)/pts.length,cy=pts.reduce((s,p)=>s+p[1],0)/pts.length;
  const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2;let vx=mx-cx,vy=my-cy;const L=Math.hypot(vx,vy)||1;
  return [mx+vx/L*d,my+vy/L*d];
}
function box(f,l,w,h,lab){
  const d=w*.5;
  f.poly([[0,d],[l,d],[l+d,0],[d,0]],'shape top');
  f.poly([[l,d],[l+d,0],[l+d,h],[l,d+h]],'shape side');
  f.poly([[0,d],[l,d],[l,d+h],[0,d+h]],'shape');
  if(lab[0]!=null)f.lbl(l/2,d+h+.8,lab[0]);
  if(lab[1]!=null)f.lbl(l+d/2+.85,h+d/2+.35,lab[1]);
  if(lab[2]!=null)f.lbl(-.85,d+h/2,lab[2]);
  return d;
}
const SQ='square units';

/* ---------- Zone 1: parallelograms ---------- */
function genPara(){
  const b=R(4,9),h=R(3,7),s=R(1,Math.min(3,b-2)),m=pick([1,-1]),W=b+s;
  const X=x=>m>0?x:W-x;
  const sl=r1(Math.hypot(s,h));
  const type=pick(['area','area','tap','missing']);
  const f=new Fig();
  f.poly([[X(0),h],[X(b),h],[X(W),0],[X(s),0]]);
  if(type==='tap'){
    f.lbl(X(b/2),h+.8,'base');
    const xc=(s+b)/2;
    const c=shuffle([
      {ok:1,p:[X(xc),0,X(xc),h],lp:[X(xc+.6),h*.3]},
      {why:'That is a side of the parallelogram. It leans, so it does not meet the base at a right angle.',p:[X(0),h,X(s),0],lp:[X(s/2-.7),h/2]},
      {why:'This segment leans. A height has to meet the base at a right angle, like the corner of a sheet of paper.',p:[X(W-.4),0,X(b-.3),h],lp:[X((W+b-.7)/2+.7),h*.62]}
    ]);
    const why={};let ans;
    c.forEach((k,i)=>{const id='ABC'[i];f.cand(id,...k.p);if(k.ok)ans=id;else why[id]=k.why;});
    c.forEach((k,i)=>f.lbl(...k.lp,'ABC'[i],'letter'));
    f.onHint();f.ra(X(xc),h,0,-1,m,0);
    return {kind:'tap',fig:f,answer:ans,why,
      prompt:'Tap the segment that is a <b>height</b> for this base.',
      hint:'Look for the segment that makes a square corner with the base. Follow the grid lines.',
      explain:'A height meets the base at a right angle. It can sit anywhere between the base and the opposite side, even inside the shape.'};
  }
  f.line(X(s),0,X(s),h,'hgt');f.ra(X(s),h,0,-1,m,0);
  f.lbl(X(b/2),h+.8,b);
  f.lbl(X(s+.85),h/2,type==='missing'?'?':h,type==='missing'?'q':'h');
  f.lbl(X(s/2-.85),h/2-.2,sl,'dim');
  f.onHint();
  f.poly([[X(s),0],[X(W),0],[X(W),h],[X(s),h]],'ghost');
  f.poly([[X(0),h],[X(s),0],[X(s),h]],'piece slide',`style="--dx:${m*b*U}px"`);
  const hint='Cut off the triangle on one end and slide it to the other end. The parallelogram turns into a rectangle with the same base and height.';
  if(type==='missing'){
    const A=b*h;
    return {kind:'num',unit:'units',fig:f,answer:h,hint,
      prompt:`This parallelogram has an area of ${A} square units and a base of ${b} units. How tall is its height?`,
      misc:[[A-b,'Area comes from multiplying, so undo it by dividing: area ÷ base.'],[A/2,'Halving is for triangles. Here, height = area ÷ base.'],[sl,'That is the slanted side. The height is the dashed segment.']],
      explain:`Area = base × height, so height = ${A} ÷ ${b} = ${h} units.`};
  }
  return {kind:'num',unit:SQ,fig:f,answer:b*h,hint,
    prompt:'Find the area of this parallelogram.',
    misc:[[b*sl,'You multiplied by the slanted side. Use the height: the dashed segment that meets the base at a right angle.'],
          [b*h/2,'Halving is for triangles. A parallelogram is base × height with no halving.'],
          [2*b+2*sl,'That is the distance around the shape (perimeter). Area measures the space inside.'],
          [b+h,'Area multiplies the base and height. It does not add them.']],
    explain:`Area = base × height = ${b} × ${h} = ${b*h} square units. The slanted side (${sl}) isn't needed.`};
}

/* ---------- Zone 2: triangles ---------- */
function genTri(){
  const b=R(3,9);let h=R(2,7);
  const shape=pick(['acute','acute','right','obtuse','obtuse']);
  const ax=shape==='right'?pick([0,b]):shape==='acute'?R(1,b-1):pick([b+R(1,3),-R(1,3)]);
  let type=pick(['area','area','tap','missing']);
  if(shape==='right'&&type==='tap')type='area';
  if(type==='missing'&&(b*h)%2)h++;
  const A=[0,h],B=[b,h],C=[ax,0],area=b*h/2,out=ax>b||ax<0;
  const f=new Fig();f.poly([A,B,C]);
  if(out)f.line(ax>b?b:ax,h,ax>b?ax:0,h,'ext');
  const vx=ax>=b?-1:1;
  if(type==='tap'){
    f.lbl(b/2,h+.8,'base');
    const sideEnd=out?(ax>b?B:A):(ax>b/2?A:B);
    let p=out?b/2:(ax>b/2?ax-2:ax+2);p=Math.min(b-.5,Math.max(.5,p));
    if(!out&&Math.abs(p-sideEnd[0])<.6)p=(p+ax)/2;
    const segs=shuffle([
      {ok:1,p:[ax,0,ax,h]},
      {why:'That is a side of the triangle. It does not meet the base at a right angle.',p:[ax,0,sideEnd[0],h]},
      {why:out?'This segment leans. For this triangle the height falls outside: extend the base and drop a straight-down segment to it.':'This segment leans. A height makes a right angle with the base.',p:[ax,0,p,h]}
    ]);
    const why={};let ans;
    segs.forEach((k,i)=>{const id='ABC'[i];f.cand(id,...k.p);if(k.ok)ans=id;else why[id]=k.why;});
    segs.forEach((k,i)=>{const [x1,y1,x2,y2]=k.p;const t=.62;f.lbl(x1+(x2-x1)*t+.55,y1+(y2-y1)*t,'ABC'[i],'letter');});
    f.onHint();f.ra(ax,h,0,-1,vx,0);
    return {kind:'tap',fig:f,answer:ans,why,
      prompt:'Tap the segment that is the <b>height</b> for this base.',
      hint:out?'The height can be outside the triangle. Look for a straight-down segment that meets the dotted extension of the base at a square corner.':'Look for the segment that makes a square corner with the base.',
      explain:out?'For this obtuse triangle, the height lands outside. We extend the base (dotted) and measure straight down to it.':'The height goes from the top vertex straight down to the base, making a right angle.'};
  }
  const hx=ax===0?-.85:ax===b?b+.85:ax>b?ax+.85:ax<0?ax-.85:(ax<=b/2?ax+.85:ax-.85);
  if(ax!==0&&ax!==b)f.line(ax,0,ax,h,'hgt');
  f.ra(ax,h,0,-1,vx,0);
  f.lbl(b/2,h+.8,b);
  f.lbl(hx,h/2,type==='missing'?'?':h,type==='missing'?'q':'h');
  const sides=[[C,A],[C,B]].filter(([p,q])=>p[0]!==q[0]).sort((u,v)=>Math.hypot(v[0][0]-v[1][0],h)-Math.hypot(u[0][0]-u[1][0],h));
  const sd=sides[0],sl=r1(Math.hypot(sd[0][0]-sd[1][0],h));
  f.lbl(...outward(sd[0],sd[1],[A,B,C]),sl,'dim');
  f.onHint();f.poly([B,[b+ax,0],C],'ghost');
  const hint='Two copies of any triangle fit together into a parallelogram with the same base and height. The triangle is half of that parallelogram.';
  if(type==='missing'){
    return {kind:'num',unit:'units',fig:f,answer:h,hint,
      prompt:`This triangle has an area of ${fmt(area)} square units and a base of ${b} units. What is its height?`,
      misc:[[area/b,'The triangle is half of base × height. Double the area first, then divide by the base.'],[area*2,'That is base × height. Now divide by the base.']],
      explain:`½ × ${b} × height = ${fmt(area)}, so ${b} × height = ${b*h}, and height = ${h} units.`};
  }
  return {kind:'num',unit:SQ,fig:f,answer:area,hint,
    prompt:'Find the area of this triangle.',
    misc:[[b*h,'That is the area of the whole parallelogram. A triangle is half of it, so divide by 2.'],
          [b*sl/2,'You used the slanted side. Use the height: the dashed segment at a right angle to the base.'],
          [b*sl,'You used the slanted side and forgot to halve. Use base × height ÷ 2.']],
    explain:`Area = ½ × base × height = ½ × ${b} × ${h} = ${fmt(area)} square units.${out?' The height lands outside this triangle, so the base is extended with a dotted line.':''}`};
}

/* ---------- Zone 3: trapezoids & other polygons ---------- */
function genPoly(){
  const t=pick(['trap','trap','L','house']);
  const f=new Fig();
  if(t==='trap'){
    const a=R(6,10),c=R(2,a-2);let h=R(2,6);if(((a+c)*h)%2)h++;
    const o=R(0,a-c),area=(a+c)*h/2;
    f.poly([[0,h],[a,h],[o+c,0],[o,0]]);
    f.lbl(a/2,h+.8,a);f.lbl(o+c/2,-.8,c);
    if(o===0){f.ra(0,h,0,-1,1,0);f.lbl(-.85,h/2,h,'h');}
    else{f.line(o,0,o,h,'hgt');f.ra(o,h,0,-1,1,0);f.lbl(o+.85,h/2,h,'h');}
    f.onHint();f.poly([[a,h],[a+c,h],[a+o+c,0],[o+c,0]],'ghost');f.lbl(a+c/2,h+.8,c,'h');
    return {kind:'num',unit:SQ,fig:f,answer:area,
      prompt:'Find the area of this trapezoid.',
      hint:`Rotate a copy of the trapezoid and fit it on the end. Together they make a parallelogram with base ${a} + ${c} and height ${h}. The trapezoid is half.`,
      misc:[[(a+c)*h,'Close! That is the parallelogram made from two copies. One trapezoid is half of it.'],[a*h,'You used only the bottom side. Both parallel sides count.'],[c*h,'You used only the top side. Both parallel sides count.']],
      explain:`Two copies make a parallelogram: (${a} + ${c}) × ${h} = ${(a+c)*h}. Half of that is ${fmt(area)} square units.`};
  }
  if(t==='L'){
    const W=R(6,9),H=R(5,8),w=R(2,W-3),hh=R(2,H-3),area=W*H-w*hh,lw=W-w;
    f.poly([[0,0],[lw,0],[lw,hh],[W,hh],[W,H],[0,H]]);
    f.lbl(W/2,H+.8,W);f.lbl(-.85,H/2,H);f.lbl(lw/2,-.8,lw);f.lbl(W+.85,hh+(H-hh)/2,H-hh);
    f.onHint();f.line(lw,hh,lw,H,'hgt');f.txt(lw/2,H/2,lw*H);f.txt(lw+w/2,hh+(H-hh)/2,w*(H-hh));f.lbl(lw+w/2,hh-.8,w,'h');
    return {kind:'num',unit:SQ,fig:f,answer:area,
      prompt:'Find the area of this shape.',
      hint:`Split it into two rectangles. The missing width on the right is ${W} − ${lw} = ${w}.`,
      misc:[[W*H,'That counts the missing corner too. Subtract the cut-out, or split the shape into two rectangles.'],[2*W+2*H,'That is the perimeter. Area counts the squares inside.'],[lw*H+W*(H-hh),'Your two rectangles overlap. Split the shape so no part is counted twice.']],
      explain:`${lw} × ${H} = ${lw*H}, plus ${w} × ${H-hh} = ${w*(H-hh)}. Total: ${area} square units.`};
  }
  const W=R(4,9),H=R(2,5);let r=R(2,4);if((W*r)%2)r++;
  const p=W/2,area=W*H+W*r/2;
  f.poly([[0,r],[p,0],[W,r],[W,r+H],[0,r+H]]);
  f.lbl(W/2,r+H+.8,W);f.lbl(-.85,r+H/2,H);
  f.line(p,0,p,r,'hgt');f.ra(p,r,0,-1,1,0);f.lbl(p+.9,r*.55,r,'h');
  f.onHint();f.line(0,r,W,r,'hgt');f.txt(W/2,r+H/2,W*H);f.txt(p-.9,r*.62,W*r/2);
  return {kind:'num',unit:SQ,fig:f,answer:area,
    prompt:'Find the area of this house-shaped pentagon.',
    hint:'Split it into a rectangle (the walls) and a triangle (the roof). Find each area and add.',
    misc:[[W*H+W*r,'The roof is a triangle, so its area is half of base × height.'],[W*H,'Don’t forget the triangle roof on top.'],[W*r/2,'That is only the roof. Add the rectangle underneath.']],
    explain:`Rectangle: ${W} × ${H} = ${W*H}. Roof: ½ × ${W} × ${r} = ${W*r/2}. Total: ${area} square units.`};
}

/* ---------- Zone 4: nets & surface area ---------- */
const CUBE_OK=(()=>{const v=[];for(let a=0;a<4;a++)for(let b=0;b<4;b++)v.push([[a,0],[0,1],[1,1],[2,1],[3,1],[b,2]]);
  [1,2,3].forEach(x=>v.push([[0,0],[1,0],[1,1],[2,1],[3,1],[x,2]]));
  v.push([[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]]);return v;})();
const CUBE_BAD=[
  {c:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],why:'Six in a row wraps all the way around, so the last squares overlap the first ones.'},
  {c:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],why:'It has a 2×2 block. Four squares can’t all fold around one corner of a cube, so faces overlap.'},
  {c:[[0,0],[1,0],[0,1],[1,1],[2,1],[3,1]],why:'It has a 2×2 block. Four squares can’t all fold around one corner of a cube, so faces overlap.'},
  {c:[[1,0],[0,1],[1,1],[2,1],[3,1],[4,1]],why:'A row of 5 wraps past the start, so two faces land in the same spot.'},
  {c:[[0,0],[0,1],[1,1],[2,1],[3,1],[4,1]],why:'A row of 5 wraps past the start, so two faces land in the same spot.'}];
function genNet(){
  const t=pick(['box','rnet','rnet','cube','tri']);
  const f=new Fig();
  if(t==='cube'){
    const good=Math.random()<.5,src=good?pick(CUBE_OK):pick(CUBE_BAD);
    let cells=(good?src:src.c).map(p=>p.slice());
    const k=R(0,3);for(let i=0;i<k;i++)cells=cells.map(([x,y])=>[y,-x]);
    if(Math.random()<.5)cells=cells.map(([x,y])=>[-x,y]);
    const mx=Math.min(...cells.map(p=>p[0])),my=Math.min(...cells.map(p=>p[1]));
    cells.forEach(([x,y])=>{x-=mx;y-=my;f.poly([[x,y],[x+1,y],[x+1,y+1],[x,y+1]]);});
    return {kind:'mc',fig:f,answer:good?'yes':'no',
      choices:[{id:'yes',label:'Yes, it folds into a cube'},{id:'no',label:'No, faces would overlap'}],
      why:good?{no:'Try it: pick one square as the bottom and fold its neighbors up as walls. Every square finds its own face.'}:{yes:src.why},
      prompt:'Will this net fold up into a cube?',
      hint:'Pick one square to be the bottom. Fold the squares next to it up as walls. Watch for two squares that would land on the same face.',
      explain:good?'Yes. When it folds, each of the 6 squares covers a different face of the cube.':src.why};
  }
  if(t==='tri'){
    const L=R(3,8),SA=12+12*L;
    f.poly([[0,3],[3,3],[3,3+L],[0,3+L]]);f.poly([[3,3],[7,3],[7,3+L],[3,3+L]]);f.poly([[7,3],[12,3],[12,3+L],[7,3+L]]);
    f.poly([[3,3],[7,3],[3,0]]);f.poly([[3,3+L],[7,3+L],[3,6+L]]);
    f.ra(3,3,0,-1,1,0);f.ra(3,3+L,0,1,1,0);
    f.lbl(1.5,3+L+.8,3);f.lbl(5,3.75,4);f.lbl(9.5,2.2,5);f.lbl(2.15,1.5,3);f.lbl(5.75,1.1,5);f.lbl(-.85,3+L/2,L);
    f.onHint();
    f.poly([[0,3],[3,3],[3,3+L],[0,3+L]],'fb2');f.poly([[3,3],[7,3],[7,3+L],[3,3+L]],'fb2');f.poly([[7,3],[12,3],[12,3+L],[7,3+L]],'fb2');
    f.poly([[3,3],[7,3],[3,0]],'fa');f.poly([[3,3+L],[7,3+L],[3,6+L]],'fa');
    f.txt(1.5,3+L/2,3*L);f.txt(5,3+L/2,4*L);f.txt(9.5,3+L/2,5*L);f.txt(4.2,2.1,6);f.txt(4.2,3.9+L,6);
    return {kind:'num',unit:SQ,fig:f,answer:SA,
      prompt:'This net folds into a triangular prism. The triangles are right triangles. What is its surface area?',
      hint:'Find the area of all 5 pieces and add them: 3 rectangles plus 2 triangles. Each triangle is ½ × 4 × 3.',
      misc:[[6+12*L,'There are two triangles, one at each end.'],[12*L,'Don’t forget the two triangle faces.'],[24+12*L,'Each triangle is ½ × 4 × 3 = 6, not 12.']],
      explain:`Rectangles: ${3*L} + ${4*L} + ${5*L} = ${12*L}. Triangles: 6 + 6 = 12. Surface area = ${SA} square units.`};
  }
  const l=R(2,6),w=R(2,4),h=R(2,5),SA=2*(l*w+l*h+w*h);
  const misc=[[l*w+l*h+w*h,'That covers only 3 faces. A prism has 6: every face has a twin on the opposite side.'],[l*w*h,'That is the volume (cubes that fill it). Surface area covers the outside.']];
  const explain=`Faces come in pairs: 2×(${l}×${w}) + 2×(${l}×${h}) + 2×(${w}×${h}) = ${2*l*w} + ${2*l*h} + ${2*w*h} = ${SA} square units.`;
  if(t==='box'){
    const d=box(f,l,w,h,[l,w,h]);
    f.onHint();f.txt(l/2,d+h/2,l*h);f.txt((l+d)/2,d/2,l*w);f.txt(l+d/2,d/2+h/2,w*h);
    return {kind:'num',unit:SQ,fig:f,answer:SA,misc,explain,
      prompt:'Find the surface area of this rectangular prism.',
      hint:'Each face you can see has a matching face hidden on the opposite side. Find these 3 areas, then double them.'};
  }
  const faces=[
    {r:[w,0,l,w],c:'fa',a:l*w},{r:[w,w,l,h],c:'fb2',a:l*h},{r:[w,w+h,l,w],c:'fa',a:l*w},{r:[w,2*w+h,l,h],c:'fb2',a:l*h},
    {r:[0,w,w,h],c:'fc',a:w*h},{r:[w+l,w,w,h],c:'fc',a:w*h}];
  const rect=([x,y,rw,rh])=>[[x,y],[x+rw,y],[x+rw,y+rh],[x,y+rh]];
  faces.forEach(q=>f.poly(rect(q.r)));
  f.lbl(w+l/2,-.8,l);f.lbl(w-.85,w/2,w);f.lbl(-.85,w+h/2,h);
  f.onHint();faces.forEach(q=>{f.poly(rect(q.r),q.c);f.txt(q.r[0]+q.r[2]/2,q.r[1]+q.r[3]/2,q.a);});
  return {kind:'num',unit:SQ,fig:f,answer:SA,misc,explain,
    prompt:'This net folds into a rectangular prism. What is its surface area?',
    hint:'Find the area of each of the 6 rectangles and add them. Matching colors are matching faces.'};
}

/* ---------- Zone 5: squares & cubes ---------- */
const UNIT_Q=[['the length of a fence around a garden','ft',1],['the carpet covering a bedroom floor','ft',2],['the sand that fills a sandbox','ft',3],
  ['the wrapping paper covering a gift box','in',2],['the space inside a cereal box','in',3],['the height of a bookshelf','in',1],
  ['the paint covering a wall','m',2],['the water filling a swimming pool','m',3]];
const DIM_MSG={1:'That measures length: a distance in one direction.',2:'Square units measure area: a flat surface to cover.',3:'Cubic units measure volume: space that gets filled.'};
function genCube(){
  const t=pick(['sq','cu','sqroot','cubeSA','cubeSA','cuberoot','units','expr']);
  const f=new Fig();
  if(t==='sq'||t==='sqroot'){
    const n=t==='sq'?R(2,12):R(3,11);
    f.poly([[0,0],[n,0],[n,n],[0,n]]);f.lbl(n/2,n+.8,t==='sq'?n:'?',t==='sq'?'':'q');
    if(t==='sq')return {kind:'num',unit:'',fig:f,answer:n*n,
      prompt:`What is ${n}<sup>2</sup>?`,
      hint:`${n}<sup>2</sup> is the area of a square with side ${n}. Count the grid squares, or multiply ${n} × ${n}.`,
      misc:[[2*n,`${n}<sup>2</sup> means ${n} × ${n}, not ${n} × 2.`],[n+2,`The small 2 means multiply ${n} by itself.`]],
      explain:`${n}<sup>2</sup> = ${n} × ${n} = ${n*n}. It’s the area of a square with side ${n}.`};
    return {kind:'num',unit:'units',fig:f,answer:n,
      prompt:`A square has an area of ${n*n} square units. How long is each side?`,
      hint:`Look for the number that, times itself, makes ${n*n}.`,
      misc:[[n*n/2,`Area is side × side. Find the number that times itself makes ${n*n}.`],[n*n/4,'Dividing by 4 works for perimeter, not area.']],
      explain:`${n} × ${n} = ${n*n}, so each side is ${n} units.`};
  }
  if(t==='cu'||t==='cuberoot'){
    const n=R(2,5);const V=n**3;
    box(f,n,n,n,[t==='cu'?n:'?',null,null]);
    if(t==='cu')return {kind:'num',unit:'',fig:f,answer:V,
      prompt:`What is ${n}<sup>3</sup>?`,
      hint:`${n}<sup>3</sup> is the volume of a cube with edge ${n}: ${n} × ${n} × ${n}.`,
      misc:[[3*n,`${n}<sup>3</sup> means ${n} × ${n} × ${n}, not ${n} × 3.`],[n*n,`That is ${n}<sup>2</sup>. Cubed means one more factor of ${n}.`]],
      explain:`${n}<sup>3</sup> = ${n} × ${n} × ${n} = ${V}. It’s the volume of a cube with edge ${n}.`};
    return {kind:'num',unit:'units',fig:f,answer:n,
      prompt:`A cube has a volume of ${V} cubic units. How long is each edge?`,
      hint:`Look for the number that, multiplied by itself 3 times, makes ${V}.`,
      misc:[[V/3,`Volume is edge × edge × edge. Find the number used 3 times as a factor.`]],
      explain:`${n} × ${n} × ${n} = ${V}, so each edge is ${n} units.`};
  }
  if(t==='cubeSA'){
    const s=R(2,9),d=box(f,s,s,s,[s,null,null]);
    f.onHint();f.txt(s/2,d+s/2,s*s);f.txt((s+d)/2,d/2,s*s);f.txt(s+d/2,d/2+s/2,s*s);
    return {kind:'num',unit:SQ,fig:f,answer:6*s*s,
      prompt:`Find the surface area of a cube with edges of ${s} units.`,
      hint:`A cube has 6 identical square faces. Each face is ${s} × ${s}.`,
      misc:[[s**3,'That is the volume. Surface area covers the 6 square faces.'],[4*s*s,'A cube has 6 faces, not 4.'],[s*s,'That is just one face. A cube has 6.'],[6*s,`Each face is ${s} × ${s} = ${s*s}. Multiply that by 6.`]],
      explain:`One face: ${s} × ${s} = ${s*s}. Six faces: 6 × ${s*s} = ${6*s*s} square units. (You can write it 6 · ${s}<sup>2</sup>.)`};
  }
  if(t==='units'){
    const [q,u,dim]=pick(UNIT_Q);
    const lab=[u,u+'<sup>2</sup>',u+'<sup>3</sup>'];
    const why={};[1,2,3].forEach(d=>{if(d!==dim)why['d'+d]=DIM_MSG[d];});
    return {kind:'mc',fig:null,answer:'d'+dim,choices:[1,2,3].map(d=>({id:'d'+d,label:lab[d-1]})),why,
      prompt:`Which unit fits <b>${q}</b>?`,
      hint:'Is it a distance (length), a surface to cover (area), or a space to fill (volume)?',
      explain:DIM_MSG[dim]+` So use ${lab[dim-1]}.`};
  }
  let n=R(2,9),k=R(3,4);if(n===k)n++;
  const prod=Array(k).fill(n).join(' × ');
  const ch=shuffle([{id:'a',label:`${n}<sup>${k}</sup>`},{id:'b',label:`${k}<sup>${n}</sup>`},{id:'c',label:`${n} × ${k}`},{id:'d',label:`${n*k}`}]);
  return {kind:'mc',fig:null,answer:'a',choices:ch,
    why:{b:'The big number is what gets multiplied. The small raised number counts how many times.',c:`${n} × ${k} is ${n} added ${k} times. Repeated multiplication uses an exponent.`,d:`${n*k} is ${n} × ${k}. The expression multiplies ${n} by itself.`},
    prompt:`Which means the same as ${prod}?`,
    hint:`Count how many times ${n} is used as a factor. That count becomes the small raised number.`,
    explain:`${n} is multiplied ${k} times, so it’s ${n}<sup>${k}</sup> = ${n**k}.`};
}

/* ---------- Zone 6: frame & subtract (shape inside a rectangle) ---------- */
const PCLS=['fa','fb2','fc','fd'];
const piece=(pts,h,v,kind='tri')=>({pts,legs:[h,v],kind,area:kind==='rect'?h*v:h*v/2});
const pieceWork=q=>q.kind==='rect'?`${q.legs[0]} × ${q.legs[1]} = ${fmt(q.area)}`:`${q.legs[0]} × ${q.legs[1]} ÷ 2 = ${fmt(q.area)}`;
const cen=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];
function shoelace(p){let s=0;for(let i=0;i<p.length;i++){const[x1,y1]=p[i],[x2,y2]=p[(i+1)%p.length];s+=x1*y2-x2*y1;}return Math.abs(s)/2;}
function sideLabels(f,W,H,sh){
  const seg=(vals,put)=>{vals=[...new Set(vals)].sort((a,b)=>a-b);for(let i=0;i<vals.length-1;i++)put((vals[i]+vals[i+1])/2,vals[i+1]-vals[i]);};
  seg([0,W,...sh.filter(p=>p[1]===0).map(p=>p[0])],(m,v)=>f.lbl(m,-.8,v));
  seg([0,W,...sh.filter(p=>p[1]===H).map(p=>p[0])],(m,v)=>f.lbl(m,H+.8,v));
  seg([0,H,...sh.filter(p=>p[0]===0).map(p=>p[1])],(m,v)=>f.lbl(-.85,m,v));
  seg([0,H,...sh.filter(p=>p[0]===W).map(p=>p[1])],(m,v)=>f.lbl(W+.85,m,v));
}
function shapeOf(t){
  if(t==='corner'){
    const W=R(6,11),H=R(4,8),b=R(1,W-1),c=R(1,H-1),A=[0,H],B=[b,0],C=[W,c];
    return {W,H,name:'triangle',shape:[A,B,C],pieces:[piece([A,[0,0],B],b,H),piece([B,[W,0],C],W-b,c),piece([C,[W,H],A],W,H-c)]};
  }
  if(t==='edge'){
    const W=R(6,11),H=R(5,8),a=R(1,H-2);let c=R(1,H-2);if(c===a)c=a===1?2:a-1;
    const b=R(1,W-1),A=[0,a],B=[b,0],C=[W,c],lo=Math.max(a,c);
    const tri=a<c?piece([A,[0,lo],C],W,lo-a):piece([C,[W,lo],A],W,lo-c);
    return {W,H,name:'triangle',shape:[A,B,C],pieces:[piece([A,[0,0],B],b,a),piece([B,[W,0],C],W-b,c),tri,piece([[0,lo],[W,lo],[W,H],[0,H]],W,H-lo,'rect')]};
  }
  if(t==='quad'||t==='psym'){
    let W,H,p,q,r,s,name='quadrilateral';
    if(t==='psym'){W=R(6,11);H=R(5,8);p=R(1,W-1);q=R(1,H-1);r=W-p;s=H-q;name='parallelogram';}
    else if(Math.random()<.4){const n=R(5,9),k=R(1,n-1);W=H=n;p=q=k;r=s=n-k;name='square';}
    else{W=R(6,11);H=R(5,8);p=R(1,W-1);q=R(1,H-1);r=R(1,W-1);s=R(1,H-1);}
    const P1=[p,0],P2=[W,q],P3=[r,H],P4=[0,s];
    return {W,H,name,shape:[P1,P2,P3,P4],pieces:[piece([P1,[W,0],P2],W-p,q),piece([P2,[W,H],P3],W-r,H-q),piece([P3,[0,H],P4],r,H-s),piece([P4,[0,0],P1],p,s)]};
  }
  if(t==='para'){
    const W=R(6,11),H=R(3,7),p=R(1,W-3),A=[0,H],B=[W-p,H],C=[W,0],D=[p,0];
    return {W,H,name:'parallelogram',shape:[A,B,C,D],pieces:[piece([A,[0,0],D],p,H),piece([B,[W,H],C],p,H)],
      extra:`Check: base ${W-p} × height ${H} = ${(W-p)*H}. Same answer!`};
  }
  if(t==='dent'){
    const W=R(6,11),H=R(4,8),m2=R(1,W-1),d=R(1,H-2);
    const ok=[];for(let m=1;m<W;m++)if(m>m2*d/H+.01&&m<W-(W-m2)*d/H-.01)ok.push(m);
    if(!ok.length)return null;
    const m=pick(ok);
    return {W,H,name:'shape',shape:[[0,0],[m,d],[W,0],[m2,H]],notch:[[m,d],[m,0],d],
      pieces:[piece([[0,0],[W,0],[m,d]],W,d,'base'),piece([[0,0],[0,H],[m2,H]],m2,H),piece([[W,0],[W,H],[m2,H]],W-m2,H)]};
  }
  return null;
}
function frameFig(s){
  const {W,H}=s,fx=Math.random()<.5,fy=Math.random()<.5,tr=Math.random()<.5;
  const T=([x,y])=>{if(fx)x=W-x;if(fy)y=H-y;return tr?[y,x]:[x,y];};
  const W2=tr?H:W,H2=tr?W:H,sh=s.shape.map(T);
  s.pieces.forEach((q,i)=>{q.P=q.pts.map(T);q.k='ABCD'[i];});
  const Rc=W*H,S=s.pieces.reduce((a,q)=>a+q.area,0),ans=Rc-S;
  if(ans<=0||Math.abs(shoelace(sh)-ans)>.01)return null;
  const f=new Fig();
  f.poly([[0,0],[W2,0],[W2,H2],[0,H2]],'frame');
  f.poly(sh,'shape solid');
  if(s.notch){const a=T(s.notch[0]),b=T(s.notch[1]),v=a[0]===b[0];f.line(a[0],a[1],b[0],b[1],'hgt');f.lbl((a[0]+b[0])/2+(v?.8:0),(a[1]+b[1])/2+(v?0:.8),s.notch[2],'h');}
  sideLabels(f,W2,H2,sh);
  f.on('build');
  s.pieces.forEach((q,i)=>f.poly(q.P,'pc '+PCLS[i],`data-k="${q.k}"`));
  s.pieces.forEach(q=>f.lbl(...cen(q.P),q.k,'letter'));
  f.onHint();
  s.pieces.forEach((q,i)=>f.poly(q.P,PCLS[i]));
  s.pieces.forEach(q=>f.lbl(...cen(q.P),`${q.k}: ${fmt(q.area)}`,'letter'));
  return {f,R:Rc,ans};
}
function frameWork(s,fr){
  return [`Rectangle: ${s.W} × ${s.H} = ${fr.R}`,...s.pieces.map(q=>`${q.k}: ${pieceWork(q)}`),
    `Shape: ${fr.R} − ${s.pieces.map(q=>fmt(q.area)).join(' − ')} = ${fmt(fr.ans)}`];
}
function spotLines(s,fr){
  const P=s.pieces;
  for(const e of shuffle(['halve','halve','leg','rect','final'])){
    let rc=fr.R,rLine=`Rectangle: ${s.W} × ${s.H} = ${fr.R}`,bad,why;
    const vals=P.map(q=>q.area),lines=P.map(q=>`${q.k}: ${pieceWork(q)}`);
    if(e==='rect'){rc=fr.R+pick([s.W,s.H]);rLine=`Rectangle: ${s.W} × ${s.H} = ${rc}`;bad=0;why=`${s.W} × ${s.H} is ${fr.R}, not ${rc}.`;}
    else if(e==='halve'||e==='leg'){
      const i=pick(P.map((q,j)=>j).filter(j=>P[j].kind!=='rect')),q=P[i];
      if(e==='halve'){vals[i]=q.legs[0]*q.legs[1];lines[i]=`${q.k}: ${q.legs[0]} × ${q.legs[1]} = ${vals[i]}`;why=`Piece ${q.k} is a triangle, so it needs ÷ 2. It should be ${fmt(q.area)}.`;}
      else{const full=[s.W,s.H],j=pick([0,1]);if(q.legs[j]===full[j])continue;const L=q.legs.slice();L[j]=full[j];vals[i]=L[0]*L[1]/2;
        lines[i]=`${q.k}: ${L[0]} × ${L[1]} ÷ 2 = ${fmt(vals[i])}`;why=`Piece ${q.k} used ${full[j]}, the whole side of the rectangle. Its side is only ${q.legs[j]}, so it should be ${fmt(q.area)}.`;}
      bad=i+1;
    }
    let fin=rc-vals.reduce((a,b)=>a+b,0);
    if(e==='final'){fin=fr.ans+pick([-3,-2,2,3,5]);bad=P.length+1;why=`${fr.R} − ${P.map(q=>fmt(q.area)).join(' − ')} is ${fmt(fr.ans)}, not ${fmt(fin)}.`;}
    if(fin<=0)continue;
    return {all:[rLine,...lines,`Shape: ${rc} − ${vals.map(fmt).join(' − ')} = ${fmt(fin)}`],bad,why};
  }
  return null;
}
function makeReverse(){
  const H=R(3,6),p=R(1,4),base=R(3,7),W=base+p,A=base*H,f=new Fig();
  f.poly([[0,0],[W,0],[W,H],[0,H]],'frame');f.poly([[0,H],[base,H],[W,0],[p,0]],'shape solid');
  f.lbl(-.85,H/2,H);f.lbl(p/2,-.8,p);f.lbl(W/2,H+.8,'?','q');
  f.onHint();f.poly([[0,H],[0,0],[p,0]],'fb2');f.poly([[base,H],[W,H],[W,0]],'fb2');f.line(p,0,p,H,'hgt');f.lbl(base/2,H-.8,'base','h');
  return {kind:'num',unit:'units',fig:f,answer:W,
    prompt:`The shaded parallelogram has an area of ${A} square units. How wide is the rectangle around it?`,
    hint:'The parallelogram and the rectangle have the same height. Find the parallelogram’s base first (area ÷ height), then add the width of one corner triangle.',
    misc:[[base,'That’s the parallelogram’s base. The rectangle is wider: add the corner triangle’s width.'],[A-p,'Area ÷ height gives the base. Then add the corner triangle’s width.'],[base-p,'Add the corner triangle’s width to the base, don’t subtract it.']],
    explain:`Parallelogram: base × ${H} = ${A}, so base = ${A} ÷ ${H} = ${base}.<br>Rectangle width: ${base} + ${p} = ${W} units.`};
}
function makeFrame(t){
  if(t==='reverse')return makeReverse();
  const s=shapeOf(t==='spot'?pick(['corner','edge','quad']):t);if(!s)return null;
  const fr=frameFig(s);if(!fr)return null;
  const work=frameWork(s,fr);
  let hint='Draw the rectangle around the shape. Find the area of each unshaded piece, then subtract them all from the rectangle.';
  if(s.notch)hint+=' Piece A sits on the rectangle’s edge: ½ × that edge × the height up to the dent.';
  if(t==='spot'){
    const sp=spotLines(s,fr);if(!sp)return null;
    const why={};sp.all.forEach((l,i)=>{if(i<sp.bad)why['l'+i]='That line checks out. Is every triangle halved? Is every length right?';else if(i>sp.bad)why['l'+i]='That line uses an earlier mistake. Find where the mistake starts.';});
    return {kind:'mc',stack:true,showBuild:true,fig:fr.f,answer:'l'+sp.bad,why,
      choices:sp.all.map((l,i)=>({id:'l'+i,label:l})),
      prompt:`A classmate found the area of the shaded ${s.name}. Which line has the first mistake?`,
      hint:'Check each line against the grid: count the sides of each piece, and make sure every triangle is halved.',
      explain:`${sp.why}<br><br>Correct work:<br>${work.join('<br>')} square units.`};
  }
  const R0=fr.R,S=R0-fr.ans,tris=s.pieces.filter(q=>q.kind!=='rect').reduce((a,q)=>a+q.area,0);
  const misc=[[R0,'That’s the whole rectangle. Now subtract the unshaded pieces.'],[S,'That’s the unshaded area around the shape. Subtract it from the rectangle.'],
    [R0-S-tris,'The triangles weren’t halved. Each corner triangle is half of a rectangle.'],[fr.ans*2,'Check your subtraction. Find each piece’s area, then subtract them from the rectangle.']];
  s.pieces.forEach(q=>{misc.push([fr.ans+q.area,'One unshaded piece wasn’t subtracted.']);misc.push([fr.ans-q.area,q.kind==='rect'?'One piece was subtracted twice.':'A triangle wasn’t halved, or a piece was subtracted twice.']);});
  return {kind:'num',unit:SQ,fig:fr.f,answer:fr.ans,hint,
    misc:misc.filter(([v])=>v>0&&Math.abs(v-fr.ans)>.01),
    prompt:`Find the area of the shaded ${s.name}.`,
    explain:work.join('<br>')+' square units.'+(s.extra?'<br>'+s.extra:''),
    build:{R:R0,pieces:s.pieces}};
}
const dentsOpen=()=>Game.stars('frame')>=2;
function genFrame(){
  const pool=['corner','corner','edge','quad','quad','para','psym','spot','spot','reverse'];
  if(dentsOpen())pool.push('dent','dent','dent','dent');
  const t=pick(pool);
  for(let i=0;i<60;i++){const p=makeFrame(t);if(p)return p;}
  return makeFrame('reverse');
}

/* ---------- zones ---------- */
const ICON={
  para:'<polygon points="6,50 44,50 58,14 20,14" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="20" y1="14" x2="20" y2="50" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  tri:'<polygon points="6,52 40,52 54,10" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="40" y1="52" x2="54" y2="52" stroke="#a9c4e4" stroke-width="2" stroke-dasharray="2 4"/><line x1="54" y1="10" x2="54" y2="52" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  poly:'<polygon points="4,50 60,50 44,16 18,16" fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="3"/><line x1="18" y1="16" x2="18" y2="50" stroke="#7fe3ff" stroke-width="2.5" stroke-dasharray="5 4"/>',
  net:'<g fill="rgba(255,201,60,.18)" stroke="#ffc93c" stroke-width="2.5"><rect x="22" y="4" width="14" height="14"/><rect x="8" y="18" width="14" height="14"/><rect x="22" y="18" width="14" height="14"/><rect x="36" y="18" width="14" height="14"/><rect x="22" y="32" width="14" height="14"/><rect x="22" y="46" width="14" height="14"/></g>',
  cube:'<g stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"><polygon points="10,22 38,22 52,10 24,10" fill="rgba(255,201,60,.35)"/><polygon points="38,22 52,10 52,40 38,52" fill="rgba(255,201,60,.08)"/><rect x="10" y="22" width="28" height="30" fill="rgba(255,201,60,.18)"/></g>',
  frame:'<rect x="5" y="12" width="54" height="40" fill="none" stroke="#f3f6fb" stroke-width="2.5"/><polygon points="5,52 30,12 59,26" fill="rgba(255,201,60,.5)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/>',
  boss:'<rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#7fe3ff" stroke-width="2" stroke-dasharray="5 4"/><polygon points="32,12 38,26 53,27 41,37 45,52 32,43 19,52 23,37 11,27 26,26" fill="#ffc93c"/>'
};
const ZONES=[
  {id:'para',name:'Parallelogram Plaza',lessons:'Lessons 4–6',blurb:'Base, height, and why the slanted side doesn’t count.',gen:genPara},
  {id:'tri',name:'Triangle Tower',lessons:'Lessons 7–10',blurb:'Half of a parallelogram, including heights that land outside.',gen:genTri},
  {id:'poly',name:'Polygon Park',lessons:'Lessons 2–3, 11',blurb:'Trapezoids, L-shapes, and pentagons. Decompose and rearrange.',gen:genPoly},
  {id:'net',name:'Net Factory',lessons:'Lessons 12–16',blurb:'Fold nets, spot cube nets, and add up every face.',gen:genNet},
  {id:'cube',name:'Squares & Cubes Lab',lessons:'Lessons 16–18',blurb:'Exponents, cube surface area, and area vs. volume units.',gen:genCube},
  {id:'frame',name:'Frame & Subtract',lessons:'Lessons 3, 10–12',blurb:'Shapes inside a rectangle. Find the rectangle, subtract the pieces around the shape.',gen:genFrame},
  {id:'boss',name:'Final Blueprint',lessons:'Whole unit · 10 problems',blurb:'A mixed review from every zone. Aim for 3 stars.',gen:()=>pick([genPara,genTri,genPoly,genNet,genCube,genFrame])()}
];
