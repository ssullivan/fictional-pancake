/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 6: Prisms, pyramids & nets. Its widgets and steps; loaded by prisms-and-pyramids.html. */
/* build a prism or pyramid on any base from triangle to octagon */
function wBuild(el){
  const q=Q(el),st={n:5};let kind='prism',api=null;
  el.innerHTML=seg('Kind',[['prism','Prism'],['pyramid','Pyramid']])+`<div class="wrow">${stepper('n','Sides on the base')}</div><div data-st></div>`;
  const make=()=>solidOf(kind,st.n,{a:st.n>6?1.4:2,h:kind==='prism'?2.4:2.6});
  const read=s=>{
    const n=s.n,P=POLYGON[n],c=countsOf(kind,n);
    return `A <b>${s.name}</b>. `+(kind==='prism'
      ?`Faces: 2 ${P}s + ${n} rectangles = <b>${c.faces}</b>. Edges: ${n} + ${n} + ${n} = <b>${c.edges}</b>. Vertices: ${n} + ${n} = <b>${c.vertices}</b>.`
      :`Faces: 1 ${P} + ${n} triangles = <b>${c.faces}</b>. Edges: ${n} + ${n} = <b>${c.edges}</b>. Vertices: ${n} + 1 = <b>${c.vertices}</b>.`);
  };
  api=polyView(q('st'),make(),{bases:true,read});
  const draw=()=>{press(el,kind);q('n').textContent=st.n;api.set(make());};
  steppers(el,st,{n:[3,8]},draw);
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{kind=b.dataset.m;draw();});
  press(el,kind);q('n').textContent=st.n;
  return ()=>api.dispose();
}
/* fold a net: a list of [label, kind, sides, options] */
const foldList=(list,read)=>el=>{
  const q=Q(el);let at=0,api=null;
  el.innerHTML=seg('Net',list.map(([l],i)=>[i,l]))+'<div data-st></div><p class="readout" data-say></p>';
  const go=()=>{if(api)api.dispose();const [,kind,n,o]=list[at];press(el,at);api=solid3D(q('st'),netOf(kind,n,o),{fold:0,slider:true,labels:false});q('say').innerHTML=read(list[at]);};
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{if(+b.dataset.m!==at){at=+b.dataset.m;go();}});
  go();
  return ()=>api&&api.dispose();
};
const TYLER=[['Square prism','prism',4,{a:1,h:2.2}],['Cube','prism',4,{a:1.6,h:1.6}]];
const NETS=[['Triangular prism','prism',3,{a:1.8,h:2.4}],['Triangular pyramid','pyramid',3,{a:2.2,h:1.9}],['Pentagonal pyramid','pyramid',5,{a:1.6,h:1.8}],['Hexagonal prism','prism',6,{a:1.1,h:2.2}]];
const netSay=([l,kind,n])=>`This net has ${kind==='prism'?`2 ${POLYGON[n]}s and ${n} rectangles`:`1 ${POLYGON[n]} and ${n} triangles`}. Fold it into a <b>${l.toLowerCase()}</b>.`;

/* the quick checks' figures */
const F={
  tyler:netFig(netOf('prism',4,{a:1,h:2.2}),{W:260,label:'A net: a row of 4 tall rectangles, with a square above the second and a square below the first'}),
  pentNet:netFig(netOf('prism',5,{a:1.2,h:2}),{W:340,label:'A net: a row of 5 rectangles with a pentagon above one and a pentagon below another'}),
};
const STEPS=[
  {title:'Prisms and pyramids',widget:wBuild,
    body:'<p>A <b>prism</b> has two matching <b>bases</b>, one at each end, joined by rectangles. A <b>pyramid</b> has one base, and triangles that meet at one vertex.</p><p>Both are named for the shape of their base: a prism with pentagon bases is a <b>pentagonal prism</b>. Pick a kind and change the base.</p>',
    check:{kind:'mc',q:'A polyhedron has one hexagon, and six triangles that meet at a point. What is it called?',
      choices:[{id:'hpyr',label:'A hexagonal pyramid'},{id:'hpri',label:'A hexagonal prism'},{id:'tpyr',label:'A triangular pyramid'}],answer:'hpyr',
      why:{hpri:'A hexagonal prism has two hexagons joined by rectangles. This one has a single hexagon and triangles.',tpyr:'The triangles are the sides. A pyramid is named for its base, and the base is the hexagon.'},
      explain:'One base, with triangles meeting at a point, makes a pyramid. The base is a hexagon, so it’s a hexagonal pyramid.'}},
  {title:'Named for the base',widget:foldList(TYLER,([l])=>l==='Cube'?'A <b>cube</b> is a square prism whose rectangles are squares too.':'The 2 bases are squares. The 4 faces around the side are rectangles. It’s still a <b>square prism</b>.'),
    body:'<p>A <b>square prism</b> has two square bases. The faces around its side only have to be rectangles. When they are squares too, it’s a <b>cube</b>, a special kind of square prism.</p><p>Fold each net to compare.</p>',
    check:{kind:'mc',stack:true,fig:F.tyler,q:'Tyler says this can’t be a net for a square prism, because not all the faces are squares. Do you agree?',
      choices:[{id:'no',label:'No. Only the 2 bases have to be squares. The other faces can be rectangles.'},{id:'all',label:'Yes. Every face of a square prism is a square.'},{id:'rect',label:'Yes. It has rectangles, so it can only be a rectangular prism.'}],answer:'no',
      why:{all:'A prism with every face a square is a cube. A square prism only needs its 2 bases to be squares.',rect:'It is a rectangular prism too, since a square is a rectangle. But its bases are squares, so it is also a square prism.'},
      explain:'The 2 small squares are the bases, one at each end. The 4 rectangles wrap around the side. So it folds into a square prism, and Tyler is wrong.'}},
  {title:'Nets of prisms and pyramids',widget:foldList(NETS,netSay),
    body:'<p>A net shows every face of a polyhedron once, laid flat. You can tell what it folds into by counting its shapes: a prism’s net has 2 bases and a rectangle for each side of the base. A pyramid’s net has 1 base and a triangle for each side.</p><p>Pick a net and fold it.</p>',
    check:{kind:'mc',fig:F.pentNet,q:'What polyhedron does this net fold into?',
      choices:[{id:'pp',label:'A pentagonal prism'},{id:'py',label:'A pentagonal pyramid'},{id:'hp',label:'A hexagonal prism'}],answer:'pp',
      why:{py:'A pyramid’s net has one base and triangles. This one has 2 pentagons and rectangles.',hp:'Count the rectangles: there are 5, one for each side of a pentagon. A hexagonal prism would have 6.'},
      explain:'2 pentagon bases and 5 rectangles: it folds into a pentagonal prism.'}}
];
