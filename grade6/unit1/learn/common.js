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
