/* Prisms and pyramids for Grade 6 pages: their faces, edges, and vertices, their names, drawings with the hidden edges dashed,
   curved solids that aren't polyhedra, and nets that fold (in a Learn page's buildNet) or lie flat. Styles are in solids.css.
   Nothing here needs a page, so tools/fuzz.mjs can load it.

   solidOf(kind, n, {a, h, rect})   a prism or pyramid (kind 'prism' | 'pyramid') on a regular n-gon base with sides a, height h
                                    (rect: [l, w] for a rectangle base instead). Returns {kind, n, name, base, V, F, E, bases}:
                                    corners [x, y, z] (y is up), faces as lists of corners (outward), edges as pairs, and which faces are bases
   countsOf(kind, n)                {faces, edges, vertices} by the rule (a prism: n + 2, 3n, 2n; a pyramid: n + 1, 2n, n + 1)
   BASE_NAME[n], POLYGON[n]         'pentagonal' and 'pentagon'
   seenOf(s, {yaw, pitch})          what a drawing shows: {faces, edges, vertices} you can see (and which ones)
   solidSvg(s, {W, yaw, pitch, dots, bases, label})   a drawing: the faces you can see, hidden edges dashed; dots marks every
                                    vertex (hidden ones hollow); bases colors the bases gold
   CURVED[kind], curvedSvg(kind, {W})   shapes that aren't polyhedra: cylinder, cone, sphere, and a box with no lid, and why
   netOf(kind, n, {a, h, rect, top, bottom})   a net: flat faces, each hinged to a parent face, with the angle it folds at
                                    (a prism's top and bottom bases hang off side rectangles top and bottom)
   netFig(net, {W, label})          a net drawn flat */
const POLYGON={3:'triangle',4:'square',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon'};
const BASE_NAME={3:'triangular',4:'square',5:'pentagonal',6:'hexagonal',7:'heptagonal',8:'octagonal'};
const countsOf=(kind,n)=>kind==='prism'?{faces:n+2,edges:3*n,vertices:2*n}:{faces:n+1,edges:2*n,vertices:n+1};

/* base corners [x, z], counterclockwise, with a side facing the front (+z), or a corner when the sides are odd,
   so a drawing from the front and a little to the side shows at least two side faces */
function basePoly(n,{a=2,rect=null}={}){
  if(rect){const [l,w]=rect;return [[-l/2,w/2],[l/2,w/2],[l/2,-w/2],[-l/2,-w/2]];}
  const r=a/(2*Math.sin(Math.PI/n));
  return Array.from({length:n},(_,k)=>{const t=Math.PI/2+(n%2?0:Math.PI/n)+2*Math.PI*k/n;return [r*Math.cos(t),r*Math.sin(t)];});
}
const sub3=(p,q)=>[p[0]-q[0],p[1]-q[1],p[2]-q[2]];
const cross3=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
const dot3=(u,v)=>u[0]*v[0]+u[1]*v[1]+u[2]*v[2];
const mean=P=>P[0].map((_,i)=>P.reduce((s,p)=>s+p[i],0)/P.length);

function solidOf(kind,n,{a=2,h=3,rect=null}={}){
  const B=basePoly(rect?4:n,{a,rect});n=B.length;
  const V=B.map(([x,z])=>[x,0,z]),bot=B.map((_,k)=>k);let F;
  if(kind==='prism'){
    B.forEach(([x,z])=>V.push([x,h,z]));
    F=[bot,bot.map(k=>n+k),...bot.map(k=>[k,(k+1)%n,n+(k+1)%n,n+k])];
  }else{
    V.push([0,h,0]);
    F=[bot,...bot.map(k=>[k,(k+1)%n,n])];
  }
  /* turn every face so its corners go counterclockwise seen from outside */
  const C=mean(V);
  F=F.map(f=>{const P=f.map(i=>V[i]),nm=cross3(sub3(P[1],P[0]),sub3(P[2],P[0]));return dot3(nm,sub3(mean(P),C))<0?f.slice().reverse():f;});
  const E=[],seen=new Set();
  F.forEach(f=>f.forEach((i,j)=>{const k=f[(j+1)%f.length],key=Math.min(i,k)+'-'+Math.max(i,k);if(!seen.has(key)){seen.add(key);E.push([Math.min(i,k),Math.max(i,k)]);}}));
  const sq=rect?rect[0]===rect[1]:n===4,base=rect&&!sq?'rectangle':POLYGON[n];
  const name=kind==='prism'&&sq&&h===(rect?rect[0]:a)?'cube':`${rect&&!sq?'rectangular':BASE_NAME[n]} ${kind}`;
  return {kind,n,name,base,V,F,E,bases:kind==='prism'?[0,1]:[0]};
}

/* ---------- drawings ---------- */
const svgOf=(w,h,body,label,vb=`0 0 ${w} ${h}`)=>`<svg viewBox="${vb}" style="max-width:${Math.round(w)}px" role="img" aria-label="${label}">${body}</svg>`;
const r1d=v=>Math.round(v*10)/10;
/* turned by yaw around the up axis, then tipped toward you by pitch so the top shows; [screen x, screen y, depth] */
function view3(p,yaw,pitch){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const x=p[0]*cy+p[2]*sy,z=-p[0]*sy+p[2]*cy,y=p[1]*cp-z*sp,z2=p[1]*sp+z*cp;
  return [x,-y,z2];
}
/* which faces point toward you, which edges are drawn solid, and which vertices show, for a drawing at yaw and pitch (degrees) */
function seenOf(s,{yaw=-28,pitch=22}={}){
  const Y=yaw*Math.PI/180,Pt=pitch*Math.PI/180;
  const front=s.F.map(f=>{const Q=f.map(i=>s.V[i]),nm=view3(cross3(sub3(Q[1],Q[0]),sub3(Q[2],Q[0])),Y,Pt);return nm[2]>1e-6;});
  const next=(f,i,j)=>{const d=Math.abs(f.indexOf(i)-f.indexOf(j));return f.includes(i)&&f.includes(j)&&(d===1||d===f.length-1);};
  const edge=s.E.map(([i,j])=>s.F.some((f,fi)=>front[fi]&&next(f,i,j)));
  const vert=s.V.map((_,i)=>s.F.some((f,fi)=>front[fi]&&f.includes(i)));
  return {front,edge,vert,faces:front.filter(Boolean).length,edges:edge.filter(Boolean).length,vertices:vert.filter(Boolean).length};
}
function solidSvg(s,{W=260,yaw=-28,pitch=22,dots=false,bases=false,label}={}){
  const Y=yaw*Math.PI/180,Pt=pitch*Math.PI/180,P=s.V.map(p=>view3(p,Y,Pt)),{front,edge,vert}=seenOf(s,{yaw,pitch});
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),k=Math.min((W-24)/(Math.max(...xs)-x0),(W*1.1-24)/(Math.max(...ys)-y0));
  const X=i=>r1d(12+(P[i][0]-x0)*k),Yv=i=>r1d(12+(P[i][1]-y0)*k),H=r1d((Math.max(...ys)-y0)*k+24),Wd=r1d((Math.max(...xs)-x0)*k+24);
  let o='';
  s.F.forEach((f,fi)=>{if(front[fi])o+=`<polygon class="sd-face${bases&&s.bases.includes(fi)?' sd-base':''}" points="${f.map(i=>X(i)+','+Yv(i)).join(' ')}"/>`;});
  s.E.forEach((e,ei)=>{o+=`<line class="sd-edge${edge[ei]?'':' sd-hid'}" x1="${X(e[0])}" y1="${Yv(e[0])}" x2="${X(e[1])}" y2="${Yv(e[1])}"/>`;});
  if(dots)s.V.forEach((_,i)=>{o+=`<circle class="sd-vert${vert[i]?'':' sd-hid'}" cx="${X(i)}" cy="${Yv(i)}" r="5"/>`;});
  return svgOf(Wd,H,o,label||`A ${s.name}. Dashed lines are edges at the back.`);
}

/* Shapes that aren't polyhedra, and why */
const CURVED={
  cylinder:{name:'cylinder',why:'Its side is curved, so not every face is a polygon.'},
  cone:{name:'cone',why:'Its side is curved, and its base is a circle, not a polygon.'},
  sphere:{name:'sphere',why:'It is curved all over. It has no flat faces at all.'},
  open:{name:'box with no lid',why:'It isn’t closed: one face is missing, so it doesn’t hold in any space.'},
};
function curvedSvg(kind,{W=160,label}={}){
  const k=W/130,f=v=>r1d(v*k),A=(x,y)=>`${f(x)},${f(y)}`,arc=(x1,x2,y,ry,sweep)=>`M${A(x1,y)} A${f((x2-x1)/2)},${f(ry)} 0 0 ${sweep} ${A(x2,y)}`;
  let o='',h=150;
  const E=`A${f(50)},${f(16)} 0 0`,front=`${E} 0 ${A(115,125)}`,back=`<path class="sd-edge sd-hid" d="M${A(15,125)} ${E} 1 ${A(115,125)}"/>`;
  if(kind==='cylinder'){
    const side=`M${A(15,25)} L${A(15,125)} ${front} L${A(115,25)}`;
    o=`<path class="sd-face" d="${side} Z"/><ellipse class="sd-face sd-base" cx="${f(65)}" cy="${f(25)}" rx="${f(50)}" ry="${f(16)}"/>${back}`
      +`<path class="sd-edge" d="${side}"/><ellipse class="sd-edge" cx="${f(65)}" cy="${f(25)}" rx="${f(50)}" ry="${f(16)}"/>`;
  }else if(kind==='cone'){
    const side=`M${A(65,10)} L${A(15,125)} ${front} Z`;
    o=`<path class="sd-face" d="${side}"/>${back}<path class="sd-edge" d="${side}"/>`;
  }else if(kind==='sphere'){
    h=135;
    o=`<circle class="sd-face" cx="${f(65)}" cy="${f(67)}" r="${f(55)}"/><path class="sd-edge sd-hid" d="${arc(10,120,67,15,1)}"/><path class="sd-edge" d="${arc(10,120,67,15,0)}"/><circle class="sd-edge" fill="none" cx="${f(65)}" cy="${f(67)}" r="${f(55)}"/>`;
  }else{
    /* a box with no lid, seen from above: the inside walls show through the open top */
    const s=solidOf('prism',4,{rect:[3,2],h:1.2}),Y=-30*Math.PI/180,Pt=42*Math.PI/180,P=s.V.map(p=>view3(p,Y,Pt));
    const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),kk=(W-20)/(Math.max(...xs)-x0);
    const X=i=>r1d(10+(P[i][0]-x0)*kk),Yv=i=>r1d(10+(P[i][1]-y0)*kk);h=((Math.max(...ys)-y0)*kk+20)/k;
    const walls=s.F.filter((_,fi)=>fi!==1).map(f=>{const Q=f.map(i=>s.V[i]),nm=view3(cross3(sub3(Q[1],Q[0]),sub3(Q[2],Q[0])),Y,Pt);return {f,front:nm[2]>0};});
    walls.filter(w=>!w.front).forEach(w=>{o+=`<polygon class="sd-face sd-in" points="${w.f.map(i=>X(i)+','+Yv(i)).join(' ')}"/>`;});
    walls.filter(w=>w.front).forEach(w=>{o+=`<polygon class="sd-face sd-out" points="${w.f.map(i=>X(i)+','+Yv(i)).join(' ')}"/>`;});
    s.E.forEach(([i,j])=>{o+=`<line class="sd-edge" x1="${X(i)}" y1="${Yv(i)}" x2="${X(j)}" y2="${Yv(j)}"/>`;});
  }
  return svgOf(f(130),f(h),o,label||`A ${CURVED[kind].name}`);
}

/* ---------- nets ---------- */
/* Faces are {id, name, poly: corners [x, y] in the flat net, parent, hinge: the edge shared with the parent, angle: how far it turns
   at full fold, col: a color number (bases 0)}. A prism's sides are a row of rectangles, each hinged to the one before. */
function netOf(kind,n,{a=2,h=3,rect=null,top=1,bottom=0}={}){
  const B=basePoly(rect?4:n,{a,rect});n=B.length;
  const nm=rect&&rect[0]!==rect[1]?'Rectangle':cap1(POLYGON[n]),col=k=>n%2&&k===n-1?3:1+k%2;
  const d2=(p,q)=>Math.hypot(q[0]-p[0],q[1]-p[1]);
  if(kind==='pyramid'){
    const faces=[{id:'base',name:nm,poly:B.map(p=>p.slice()),col:0}];
    B.forEach((A,k)=>{
      const Bk=B[(k+1)%n],ux=Bk[0]-A[0],uy=Bk[1]-A[1],L=Math.hypot(ux,uy),t=-(A[0]*ux+A[1]*uy)/(L*L),M=[A[0]+t*ux,A[1]+t*uy],d=Math.hypot(...M),s=Math.hypot(d,h);
      faces.push({id:'t'+k,name:'Triangle',poly:[A,Bk,[M[0]+M[0]/d*s,M[1]+M[1]/d*s]],parent:'base',hinge:[A,Bk],angle:Math.PI-Math.atan2(h,d),col:col(k)});
    });
    return {faces};
  }
  const L=B.map((p,k)=>d2(p,B[(k+1)%n])),x=[0];L.forEach((l,k)=>x.push(x[k]+l));
  const turn=k=>{const p=B[(k+n-1)%n],q=B[k],r=B[(k+1)%n],u=[q[0]-p[0],q[1]-p[1]],v=[r[0]-q[0],r[1]-q[1]];return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))));};
  const faces=B.map((_,k)=>({id:'s'+k,name:'Rectangle',poly:[[x[k],0],[x[k+1],0],[x[k+1],h],[x[k],h]],col:col(k),...(k?{parent:'s'+(k-1),hinge:[[x[k],0],[x[k],h]],angle:turn(k)}:{})}));
  /* a base laid against side k's edge along y = at, on the far side of that edge from the rectangle */
  const baseOn=(k,at,out,id)=>{
    const A=B[k],Bk=B[(k+1)%n],P0=[x[k],at],P1=[x[k+1],at],ang=Math.atan2(P1[1]-P0[1],P1[0]-P0[0])-Math.atan2(Bk[1]-A[1],Bk[0]-A[0]);
    let poly=B.map(p=>{const dx=p[0]-A[0],dy=p[1]-A[1];return [P0[0]+dx*Math.cos(ang)-dy*Math.sin(ang),P0[1]+dx*Math.sin(ang)+dy*Math.cos(ang)];});
    if((poly.reduce((s,p)=>s+p[1],0)/n-at)*out<0)poly=poly.map(([px,py])=>[px,2*at-py]);
    return {id,name:nm,poly,parent:'s'+k,hinge:[P0,P1],angle:Math.PI/2,col:0};
  };
  faces.push(baseOn(top,0,-1,'top'),baseOn(bottom,h,1,'bottom'));
  return {faces};
}
const cap1=s=>s[0].toUpperCase()+s.slice(1);
function netFig(net,{W=320,label='A net'}={}){
  const P=net.faces.flatMap(f=>f.poly),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys);
  const k=Math.min((W-16)/(Math.max(...xs)-x0),(W*1.15-16)/(Math.max(...ys)-y0)),X=v=>r1d(8+(v-x0)*k),Y=v=>r1d(8+(v-y0)*k);
  const o=net.faces.map(f=>`<polygon class="sd-net${f.col?'':' sd-base'}" points="${f.poly.map(([a,b])=>X(a)+','+Y(b)).join(' ')}"/>`).join('');
  return svgOf(r1d((Math.max(...xs)-x0)*k+16),r1d((Math.max(...ys)-y0)*k+16),o,label);
}
