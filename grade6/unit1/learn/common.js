/* Learn Area & Surface Area (Grade 6 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const COLS=['#ffc93c','#7fe3ff','#ff8ac4','#5fe0a8','#b69cff','#ff9f5a'];
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
/* poly: face corners in the flat net, [x,y]. hinge: the edge shared with the parent.
   angle: how far the face turns at full fold (default 90°). */
const Rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
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
/* ---------- nets that fold in 3D (nets, prisms and pyramids) ---------- */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cen=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];
function netSvg(net,{counted=new Set(),labels=true,tap=false,maxW=440,u=40}={}){
  const xs=net.faces.flatMap(f=>f.poly.map(p=>p[0])),ys=net.faces.flatMap(f=>f.poly.map(p=>p[1]));
  const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const P=plane({xmin,xmax,ymin,ymax,u:Math.min(u,maxW/(xmax-xmin)),pad:14,down:true});
  let o='';
  net.faces.forEach(f=>{o+=`<polygon class="nf${tap?' tap':''}" data-id="${f.id}" points="${P.pts(f.poly)}" style="fill:${COLS[f.col%6]}${counted.has(f.id)?'cc':'4d'}"/>`;});
  if(labels)net.faces.forEach(f=>{const [x,y]=cen(f.poly);o+=P.text(x,y,(counted.has(f.id)?'✓ ':'')+f.dims,'lbl s');});
  return P.svg(o,'A net: the flat pattern of a 3D shape');
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

/* ---------- a polyhedron (or a solid that isn't one) to turn and tap (polyhedra, prisms and pyramids) ---------- */
const PLURAL={faces:'faces',edges:'edges',vertices:'vertices'},ONE={faces:'face',edges:'edge',vertices:'vertex'};
/* shape: a solid from shared/solids.js (solidOf), or {curved: 'cylinder' | 'cone' | 'sphere' | 'open' | 'flat'}.
   opts.count: 'faces', 'edges', or 'vertices' to tap and count them. opts.point: mark one face, one edge, and one vertex.
   opts.bases: color the bases gold. opts.read(shape, api): the readout under the view.
   api.set(shape) swaps in another shape. Without WebGL it shows a drawing (solids.js) instead. */
function polyView(el,shape,opts={}){
  const api={counted:new Set(),disposed:false};let S=null,T=null,grp=null,hits=[],faceMeshes=[],paint=()=>{};
  el.innerHTML=`<div class="view3d" data-v><p class="loading">Loading 3D…</p></div><div class="wrow" data-ctl></div><p class="readout" data-r></p>`;
  const q=Q(el),k=opts.count;
  const total=()=>shape.curved?0:{faces:shape.F.length,edges:shape.E.length,vertices:shape.V.length}[k];
  const read=()=>{
    if(opts.read){q('r').innerHTML=opts.read(shape,api);return;}
    if(!k)return;
    const n=api.counted.size,t=total();
    q('r').innerHTML=api.mode==='flat'?`This ${shape.name} has <b>${t} ${PLURAL[k]}</b>. Dashed lines are edges at the back.`
      :n===t?`<span class="ok">All ${t} ${PLURAL[k]} of the ${shape.name}!</span>`
      :`${n} ${n===1?ONE[k]:PLURAL[k]} counted. <span class="dimline">Tap each one once. Turn the shape to find the ones at the back${k==='faces'?' and on the bottom':''}.</span>`;
  };
  api.set=s=>{shape=s;api.counted.clear();if(S)build();else if(api.mode==='flat')flat();read();};
  function flat(){
    api.mode='flat';
    const pic=shape.curved?(shape.curved==='flat'?`<svg viewBox="0 0 130 90" style="max-width:160px" role="img" aria-label="A flat hexagon"><polygon class="sd-face sd-base" points="30,15 100,15 125,45 100,75 30,75 5,45"/><polygon class="sd-edge" points="30,15 100,15 125,45 100,75 30,75 5,45"/></svg>`:curvedSvg(shape.curved))
      :solidSvg(shape,{dots:k==='vertices',bases:opts.bases});
    q('v').outerHTML=`<div data-v><p class="note">The 3D view can’t load on this device, so here is a drawing.</p><div class="fig">${pic}</div></div>`;
  }
  const dispose=o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>m.dispose());};
  function build(){
    const THREE=T.THREE,{CSS2DObject}=T;
    if(grp){S.scene.remove(grp);grp.traverse(o=>{dispose(o);if(o.element)o.element.remove();});}
    grp=new THREE.Group();hits=[];faceMeshes=[];
    const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide,roughness:.75,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,...o});
    const tag=(t,p)=>{const d=document.createElement('div');d.className='flabel on';d.textContent=t;const o=new CSS2DObject(d);o.position.copy(p);grp.add(o);};
    let R=1.6;
    const Y=new THREE.Vector3(0,1,0),rod=(a,b,r,m)=>{const d=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),10),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(Y,d.normalize());return o;};
    const white=()=>new THREE.MeshBasicMaterial({color:0xf3f6fb});
    if(shape.curved){
      const c=shape.curved,m=mat(COLS[1]);let g;
      if(c==='cylinder')g=new THREE.CylinderGeometry(1.1,1.1,2.4,48);
      else if(c==='cone')g=new THREE.ConeGeometry(1.2,2.6,48);
      else if(c==='sphere')g=new THREE.SphereGeometry(1.4,48,32);
      else if(c==='flat'){const sh=new THREE.Shape();for(let i=0;i<6;i++){const a=i*Math.PI/3;sh[i?'lineTo':'moveTo'](1.5*Math.cos(a),1.5*Math.sin(a));}g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);}
      else g=new THREE.BoxGeometry(2.6,1.4,1.8);
      const mesh=new THREE.Mesh(g,c==='open'?[m,m,new THREE.MeshBasicMaterial({visible:false}),m,m,m]:c==='flat'?mat(COLS[0]):m);grp.add(mesh);
      /* white edges like the polyhedra's: rings where a curved side meets a flat base (a sphere has none), rods on straight edges */
      const ring=(r,y)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,64),white());t.rotation.x=Math.PI/2;t.position.y=y;grp.add(t);};
      if(c==='cylinder'){ring(1.1,1.2);ring(1.1,-1.2);}
      else if(c==='cone')ring(1.2,-1.3);
      else if(c!=='sphere'){const P=new THREE.EdgesGeometry(g,40).attributes.position;for(let i=0;i<P.count;i+=2)grp.add(rod(new THREE.Vector3().fromBufferAttribute(P,i),new THREE.Vector3().fromBufferAttribute(P,i+1),.035,white()));}
    }else{
      const top=Math.max(...shape.V.map(p=>p[1])),V=shape.V.map(p=>new THREE.Vector3(p[0],p[1]-top/2,p[2]));
      R=Math.max(...V.map(v=>v.length()));
      shape.F.forEach((f,fi)=>{
        const P=f.map(i=>V[i]),tri=[];for(let i=1;i<P.length-1;i++)tri.push(P[0],P[i],P[i+1]);
        const g=new THREE.BufferGeometry().setFromPoints(tri);g.computeVertexNormals();
        const mesh=new THREE.Mesh(g,mat(opts.bases&&shape.bases.includes(fi)?COLS[0]:COLS[1]));mesh.userData={kind:'faces',id:fi};grp.add(mesh);faceMeshes.push(mesh);
      });
      const clear=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
      shape.E.forEach(([i,j],ei)=>{
        const e=rod(V[i],V[j],.035,white());grp.add(e);
        if(k==='edges'){const h=rod(V[i],V[j],.16,clear);h.userData={kind:'edges',id:ei,show:e};grp.add(h);hits.push(h);}
      });
      V.forEach((v,vi)=>{
        const s=new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),white());s.position.copy(v);grp.add(s);
        if(k==='vertices'){const h=new THREE.Mesh(new THREE.SphereGeometry(.24,12,8),clear);h.position.copy(v);h.userData={kind:'vertices',id:vi,show:s};grp.add(h);hits.push(h);}
      });
      if(opts.point){
        /* a side face, the edge along its top, and a vertex at the corner, each marked and named */
        const fi=shape.F.length-1,f=shape.F[fi],P=f.map(i=>V[i]),mid=P.reduce((s,p)=>s.add(p),new THREE.Vector3()).divideScalar(P.length);
        faceMeshes[fi].material.color.set(COLS[2]);tag('face',mid);
        const e=shape.E.find(([i,j])=>f.includes(i)&&f.includes(j)&&V[i].y===V[j].y&&V[i].y>=Math.max(...P.map(p=>p.y))-1e-6)||shape.E.find(([i,j])=>f.includes(i)&&f.includes(j));
        grp.add(rod(V[e[0]],V[e[1]],.07,new THREE.MeshBasicMaterial({color:COLS[0]})));tag('edge',V[e[0]].clone().add(V[e[1]]).multiplyScalar(.5).multiplyScalar(1.12));
        const top=shape.kind==='pyramid'?V[V.length-1]:V[e[1]],dot=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),new THREE.MeshBasicMaterial({color:COLS[3]}));dot.position.copy(top);grp.add(dot);tag('vertex',top.clone().multiplyScalar(1.18));
      }
    }
    /* a quarter turn's worth of yaw, so no side of a prism starts out edge-on */
    if(!shape.curved)grp.rotation.y=-.45;
    S.scene.add(grp);S.frame(R*3.3+1);paint();
  }
  paint=()=>{
    if(!S)return;
    const on=id=>api.counted.has(id);
    faceMeshes.forEach(m=>{if(k==='faces'){m.material.emissive.set(on(m.userData.id)?0xffc93c:0x000000);m.material.emissiveIntensity=on(m.userData.id)?.55:0;}});
    hits.forEach(h=>{h.userData.show.material.color.set(on(h.userData.id)?0xffc93c:0xf3f6fb);h.userData.show.scale.setScalar(on(h.userData.id)?1.9:1);});
    S.render();read();
  };
  api.ready=load3D().then(t=>{
    if(api.disposed)return;T=t;api.mode='3d';S=stage(el,T,6);
    const {THREE}=T;build();
    q('ctl').innerHTML=`<button type="button" class="ghost-btn" data-spin="-1" aria-label="Turn left">⟲</button><button type="button" class="ghost-btn" data-spin="1" aria-label="Turn right">⟳</button>`+(k?`<button type="button" class="ghost-btn" data-clr>Start over</button>`:'');
    q('ctl').querySelectorAll('[data-spin]').forEach(b=>b.onclick=()=>S.spin(+b.dataset.spin));
    if(k)q('clr').onclick=()=>{api.counted.clear();paint();};
    const hint=document.createElement('p');hint.className='hint3d';hint.textContent=k?`Drag to turn · tap each ${ONE[k]}`:'Drag to turn · pinch to zoom';S.view.appendChild(hint);
    /* a tap counts the face, edge, or vertex under it; an edge or vertex only counts if no face is in front of it */
    const ray=new THREE.Raycaster(),ptr=new THREE.Vector2(),cv=S.renderer.domElement;let down=null;
    cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
    cv.addEventListener('pointerup',e=>{
      if(!k||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;down=null;
      const r=cv.getBoundingClientRect();ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
      ray.setFromCamera(ptr,S.camera);
      const got=ray.intersectObjects([...faceMeshes,...hits],false),face=got.find(h=>h.object.userData.kind==='faces'),want=got.find(h=>h.object.userData.kind===k);
      if(!want||(k!=='faces'&&face&&want.distance>face.distance+.25))return;
      const id=want.object.userData.id;api.counted.has(id)?api.counted.delete(id):api.counted.add(id);paint();
    });
  },()=>{if(!api.disposed){flat();read();}});
  read();
  api.dispose=()=>{api.disposed=true;if(S){grp&&grp.traverse(o=>{if(o.element)o.element.remove();});S.dispose();}};
  return api;
}
