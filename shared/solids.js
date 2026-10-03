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
  /* the corners sit on a circle of radius r, which gives sides of length a */
  const r=a/(2*Math.sin(Math.PI/n));
  return Array.from({length:n},(_,k)=>{const t=Math.PI/2+(n%2?0:Math.PI/n)+2*Math.PI*k/n;return [r*Math.cos(t),r*Math.sin(t)];});
}
/* 3D vectors as [x, y, z]: p − q, the cross product (perpendicular to both), the dot product, and the average of a list of points */
const sub3=(p,q)=>[p[0]-q[0],p[1]-q[1],p[2]-q[2]];
const cross3=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
const dot3=(u,v)=>u[0]*v[0]+u[1]*v[1]+u[2]*v[2];
const mean=P=>P[0].map((_,i)=>P.reduce((s,p)=>s+p[i],0)/P.length);

function solidOf(kind,n,{a=2,h=3,rect=null}={}){
  const base=basePoly(rect?4:n,{a,rect});n=base.length;
  /* corners 0…n−1 are the bottom base (y = 0); a prism's top base is n…2n−1, a pyramid's apex is n */
  const V=base.map(([x,z])=>[x,0,z]),bottom=base.map((_,k)=>k);let F;
  if(kind==='prism'){
    base.forEach(([x,z])=>V.push([x,h,z]));
    /* the two bases, then a rectangle for each side k, from bottom corner k round to top corner k */
    F=[bottom,bottom.map(k=>n+k),...bottom.map(k=>[k,(k+1)%n,n+(k+1)%n,n+k])];
  }else{
    V.push([0,h,0]);
    F=[bottom,...bottom.map(k=>[k,(k+1)%n,n])];
  }
  /* turn every face so its corners go counterclockwise seen from outside: its normal must point away from the center */
  const center=mean(V);
  F=F.map(f=>{const P=f.map(i=>V[i]),normal=cross3(sub3(P[1],P[0]),sub3(P[2],P[0]));return dot3(normal,sub3(mean(P),center))<0?f.slice().reverse():f;});
  /* the edges: each side of each face, once (as [smaller corner, larger corner]) */
  const E=[],seen=new Set();
  F.forEach(f=>f.forEach((i,j)=>{
    const k=f[(j+1)%f.length],key=Math.min(i,k)+'-'+Math.max(i,k);
    if(!seen.has(key)){seen.add(key);E.push([Math.min(i,k),Math.max(i,k)]);}
  }));
  const square=rect?rect[0]===rect[1]:n===4,baseName=rect&&!square?'rectangle':POLYGON[n];
  /* a square prism as tall as its base is wide is a cube */
  const name=kind==='prism'&&square&&h===(rect?rect[0]:a)?'cube':`${rect&&!square?'rectangular':BASE_NAME[n]} ${kind}`;
  return {kind,n,name,base:baseName,V,F,E,bases:kind==='prism'?[0,1]:[0]};
}

/* ---------- drawings ---------- */
/* like svgWrap (figures.js), with a viewBox of its own */
const svgOf=(w,h,body,label,vb=`0 0 ${w} ${h}`)=>`<svg viewBox="${vb}" style="max-width:${Math.round(w)}px" role="img" aria-label="${label}">${body}</svg>`;
/* round to 1 decimal place */
const r1d=v=>Math.round(v*10)/10;
/* turned by yaw around the up axis, then tipped toward you by pitch so the top shows; [screen x, screen y, depth] */
function view3(p,yaw,pitch){
  const cosYaw=Math.cos(yaw),sinYaw=Math.sin(yaw),cosPitch=Math.cos(pitch),sinPitch=Math.sin(pitch);
  const x=p[0]*cosYaw+p[2]*sinYaw,z=-p[0]*sinYaw+p[2]*cosYaw,y=p[1]*cosPitch-z*sinPitch,depth=p[1]*sinPitch+z*cosPitch;
  return [x,-y,depth];
}
/* which faces point toward you, which edges are drawn solid, and which vertices show, for a drawing at yaw and pitch (degrees) */
function seenOf(s,{yaw=-28,pitch=22}={}){
  const yawRad=yaw*Math.PI/180,pitchRad=pitch*Math.PI/180;
  /* a face points toward you when its normal, turned like the drawing, comes out of the screen */
  const front=s.F.map(f=>{const P=f.map(i=>s.V[i]),normal=view3(cross3(sub3(P[1],P[0]),sub3(P[2],P[0])),yawRad,pitchRad);return normal[2]>1e-6;});
  /* are corners i and j next to each other on face f? */
  const adjacent=(f,i,j)=>{const d=Math.abs(f.indexOf(i)-f.indexOf(j));return f.includes(i)&&f.includes(j)&&(d===1||d===f.length-1);};
  /* an edge or vertex shows when it's on a face that does */
  const edge=s.E.map(([i,j])=>s.F.some((f,fi)=>front[fi]&&adjacent(f,i,j)));
  const vert=s.V.map((_,i)=>s.F.some((f,fi)=>front[fi]&&f.includes(i)));
  return {front,edge,vert,faces:front.filter(Boolean).length,edges:edge.filter(Boolean).length,vertices:vert.filter(Boolean).length};
}
function solidSvg(s,{W=260,yaw=-28,pitch=22,dots=false,bases=false,label}={}){
  const yawRad=yaw*Math.PI/180,pitchRad=pitch*Math.PI/180,P=s.V.map(p=>view3(p,yawRad,pitchRad)),{front,edge,vert}=seenOf(s,{yaw,pitch});
  /* scale to fit W wide (and at most 1.1 W tall) with a 12-pixel margin */
  const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),
    scale=Math.min((W-24)/(Math.max(...xs)-x0),(W*1.1-24)/(Math.max(...ys)-y0));
  const X=i=>r1d(12+(P[i][0]-x0)*scale),Y=i=>r1d(12+(P[i][1]-y0)*scale),
    height=r1d((Math.max(...ys)-y0)*scale+24),width=r1d((Math.max(...xs)-x0)*scale+24);
  let markup='';
  s.F.forEach((f,fi)=>{if(front[fi])markup+=`<polygon class="sd-face${bases&&s.bases.includes(fi)?' sd-base':''}" points="${f.map(i=>X(i)+','+Y(i)).join(' ')}"/>`;});
  s.E.forEach((e,ei)=>{markup+=`<line class="sd-edge${edge[ei]?'':' sd-hid'}" x1="${X(e[0])}" y1="${Y(e[0])}" x2="${X(e[1])}" y2="${Y(e[1])}"/>`;});
  if(dots)s.V.forEach((_,i)=>{markup+=`<circle class="sd-vert${vert[i]?'':' sd-hid'}" cx="${X(i)}" cy="${Y(i)}" r="5"/>`;});
  return svgOf(width,height,markup,label||`A ${s.name}. Dashed lines are edges at the back.`);
}

/* Shapes that aren't polyhedra, and why */
const CURVED={
  cylinder:{name:'cylinder',why:'Its side is curved, so not every face is a polygon.'},
  cone:{name:'cone',why:'Its side is curved, and its base is a circle, not a polygon.'},
  sphere:{name:'sphere',why:'It is curved all over. It has no flat faces at all.'},
  open:{name:'box with no lid',why:'It isn’t closed: one face is missing, so it doesn’t hold in any space.'},
};
/* Drawn in a 130-wide box scaled to W. The cylinder and cone sit on an ellipse 100 wide at y = 125: its front half solid, its back half dashed. */
function curvedSvg(kind,{W=160,label}={}){
  const scale=W/130,f=v=>r1d(v*scale),A=(x,y)=>`${f(x)},${f(y)}`,
    /* half an ellipse from x1 to x2 at height y (sweep 1 the top half, 0 the bottom) */
    arc=(x1,x2,y,ry,sweep)=>`M${A(x1,y)} A${f((x2-x1)/2)},${f(ry)} 0 0 ${sweep} ${A(x2,y)}`;
  let markup='',h=150;
  const ellipseArc=`A${f(50)},${f(16)} 0 0`,front=`${ellipseArc} 0 ${A(115,125)}`,back=`<path class="sd-edge sd-hid" d="M${A(15,125)} ${ellipseArc} 1 ${A(115,125)}"/>`;
  if(kind==='cylinder'){
    const side=`M${A(15,25)} L${A(15,125)} ${front} L${A(115,25)}`;
    markup=`<path class="sd-face" d="${side} Z"/><ellipse class="sd-face sd-base" cx="${f(65)}" cy="${f(25)}" rx="${f(50)}" ry="${f(16)}"/>${back}`
      +`<path class="sd-edge" d="${side}"/><ellipse class="sd-edge" cx="${f(65)}" cy="${f(25)}" rx="${f(50)}" ry="${f(16)}"/>`;
  }else if(kind==='cone'){
    const side=`M${A(65,10)} L${A(15,125)} ${front} Z`;
    markup=`<path class="sd-face" d="${side}"/>${back}<path class="sd-edge" d="${side}"/>`;
  }else if(kind==='sphere'){
    h=135;
    markup=`<circle class="sd-face" cx="${f(65)}" cy="${f(67)}" r="${f(55)}"/><path class="sd-edge sd-hid" d="${arc(10,120,67,15,1)}"/><path class="sd-edge" d="${arc(10,120,67,15,0)}"/><circle class="sd-edge" fill="none" cx="${f(65)}" cy="${f(67)}" r="${f(55)}"/>`;
  }else{
    /* a box with no lid, seen from above: the inside walls show through the open top */
    const box=solidOf('prism',4,{rect:[3,2],h:1.2}),yawRad=-30*Math.PI/180,pitchRad=42*Math.PI/180,P=box.V.map(p=>view3(p,yawRad,pitchRad));
    const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),boxScale=(W-20)/(Math.max(...xs)-x0);
    const X=i=>r1d(10+(P[i][0]-x0)*boxScale),Y=i=>r1d(10+(P[i][1]-y0)*boxScale);
    h=((Math.max(...ys)-y0)*boxScale+20)/scale;
    /* every face but the top (face 1); the walls facing away are seen from inside, so they're drawn first */
    const walls=box.F.filter((_,fi)=>fi!==1).map(face=>{const Q=face.map(i=>box.V[i]),normal=view3(cross3(sub3(Q[1],Q[0]),sub3(Q[2],Q[0])),yawRad,pitchRad);return {face,front:normal[2]>0};});
    walls.filter(w=>!w.front).forEach(w=>{markup+=`<polygon class="sd-face sd-in" points="${w.face.map(i=>X(i)+','+Y(i)).join(' ')}"/>`;});
    walls.filter(w=>w.front).forEach(w=>{markup+=`<polygon class="sd-face sd-out" points="${w.face.map(i=>X(i)+','+Y(i)).join(' ')}"/>`;});
    box.E.forEach(([i,j])=>{markup+=`<line class="sd-edge" x1="${X(i)}" y1="${Y(i)}" x2="${X(j)}" y2="${Y(j)}"/>`;});
  }
  return svgOf(f(130),f(h),markup,label||`A ${CURVED[kind].name}`);
}

/* ---------- nets ---------- */
/* Faces are {id, name, poly: corners [x, y] in the flat net, parent, hinge: the edge shared with the parent, angle: how far it turns
   at full fold, col: a color number (bases 0)}. A prism's sides are a row of rectangles, each hinged to the one before. */
function netOf(kind,n,{a=2,h=3,rect=null,top=1,bottom=0}={}){
  const base=basePoly(rect?4:n,{a,rect});n=base.length;
  /* side colors alternate 1, 2, 1, 2…; with an odd number of sides the last is 3, so no two neighbors match */
  const baseName=rect&&rect[0]!==rect[1]?'Rectangle':cap1(POLYGON[n]),col=k=>n%2&&k===n-1?3:1+k%2;
  const dist=(p,q)=>Math.hypot(q[0]-p[0],q[1]-p[1]);
  if(kind==='pyramid'){
    /* the base stays where it is; a triangle unfolds outward from each of its sides */
    const faces=[{id:'base',name:baseName,poly:base.map(p=>p.slice()),col:0}];
    base.forEach((A,k)=>{
      /* foot: the point on side A–B nearest the base's center (0, 0), toCenter its distance from it;
         slant: the triangle's height, from the side up to the apex (h above the center) */
      const B=base[(k+1)%n],ux=B[0]-A[0],uy=B[1]-A[1],sideLen=Math.hypot(ux,uy),t=-(A[0]*ux+A[1]*uy)/(sideLen*sideLen),
        foot=[A[0]+t*ux,A[1]+t*uy],toCenter=Math.hypot(...foot),slant=Math.hypot(toCenter,h);
      /* flat, the apex is slant past the foot, straight out from the center; folded, it turns up by 180° less the slope of the face */
      const apex=[foot[0]+foot[0]/toCenter*slant,foot[1]+foot[1]/toCenter*slant];
      faces.push({id:'t'+k,name:'Triangle',poly:[A,B,apex],parent:'base',hinge:[A,B],angle:Math.PI-Math.atan2(h,toCenter),col:col(k)});
    });
    return {faces};
  }
  /* a prism's sides: a row of rectangles h tall, side k from x = xAt[k] to xAt[k + 1] */
  const sideLens=base.map((p,k)=>dist(p,base[(k+1)%n])),xAt=[0];sideLens.forEach((l,k)=>xAt.push(xAt[k]+l));
  /* how far side k folds against side k − 1: the base's turn at corner k (180° less its inside angle) */
  const turn=k=>{
    const p=base[(k+n-1)%n],q=base[k],r=base[(k+1)%n],u=[q[0]-p[0],q[1]-p[1]],v=[r[0]-q[0],r[1]-q[1]];
    return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))));
  };
  const faces=base.map((_,k)=>({id:'s'+k,name:'Rectangle',poly:[[xAt[k],0],[xAt[k+1],0],[xAt[k+1],h],[xAt[k],h]],col:col(k),
    ...(k?{parent:'s'+(k-1),hinge:[[xAt[k],0],[xAt[k],h]],angle:turn(k)}:{})}));
  /* A base laid against side k's edge along y = at, on the far side of that edge from the rectangle (out: −1 above, 1 below).
     The base is turned so its side k lines up with the rectangle's edge, then flipped across that edge if it landed on the wrong side. */
  const baseOn=(k,at,out,id)=>{
    const A=base[k],B=base[(k+1)%n],P0=[xAt[k],at],P1=[xAt[k+1],at],
      angle=Math.atan2(P1[1]-P0[1],P1[0]-P0[0])-Math.atan2(B[1]-A[1],B[0]-A[0]);
    let poly=base.map(p=>{const dx=p[0]-A[0],dy=p[1]-A[1];return [P0[0]+dx*Math.cos(angle)-dy*Math.sin(angle),P0[1]+dx*Math.sin(angle)+dy*Math.cos(angle)];});
    if((poly.reduce((s,p)=>s+p[1],0)/n-at)*out<0)poly=poly.map(([px,py])=>[px,2*at-py]);
    return {id,name:baseName,poly,parent:'s'+k,hinge:[P0,P1],angle:Math.PI/2,col:0};
  };
  faces.push(baseOn(top,0,-1,'top'),baseOn(bottom,h,1,'bottom'));
  return {faces};
}
/* "pentagon" → "Pentagon" */
const cap1=s=>s[0].toUpperCase()+s.slice(1);
function netFig(net,{W=320,label='A net'}={}){
  /* scale to fit W wide (and at most 1.15 W tall) with an 8-pixel margin */
  const P=net.faces.flatMap(f=>f.poly),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys);
  const scale=Math.min((W-16)/(Math.max(...xs)-x0),(W*1.15-16)/(Math.max(...ys)-y0)),X=v=>r1d(8+(v-x0)*scale),Y=v=>r1d(8+(v-y0)*scale);
  const markup=net.faces.map(f=>`<polygon class="sd-net${f.col?'':' sd-base'}" points="${f.poly.map(([a,b])=>X(a)+','+Y(b)).join(' ')}"/>`).join('');
  return svgOf(r1d((Math.max(...xs)-x0)*scale+16),r1d((Math.max(...ys)-y0)*scale+16),markup,label);
}
