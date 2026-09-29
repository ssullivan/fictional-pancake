/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 6: Squares & cubes. Its widgets and steps; loaded by cubes.html. */
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
const STEPS=[
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
  ];
