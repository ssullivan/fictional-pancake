/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 5: Nets & surface area. Its widgets and steps; loaded by nets.html. */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cen=P=>[P.reduce((s,p)=>s+p[0],0)/P.length,P.reduce((s,p)=>s+p[1],0)/P.length];
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
/* the quick checks' figures */
const F={};
F.net421=netSvg(rectNet(4,2,1));
F.pyr65=netSvg(pyramidNet(6,5),{u:26});
F.cubeNetCheck=netSvg(cubeNet([[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]],true),{labels:false,u:44});
const STEPS=[
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
  ];
