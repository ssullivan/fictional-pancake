/* Learn Area & Surface Area (Grade 6 Unit 1), chapter 5: Polyhedra. Its widgets and steps; loaded by polyhedra.html. */
/* the shapes to pick from, as [label, kind, sides on the base, solidOf options] */
const MEET=[['Cube','prism',4,{a:2,h:2}],['Triangular prism','prism',3],['Square pyramid','pyramid',4],['Pentagonal prism','prism',5],['Hexagonal pyramid','pyramid',6]];
/* the solid for a MEET-style entry */
const shapeOf=([,kind,n,options])=>solidOf(kind,n,options||{a:2,h:kind==='prism'?2.4:2.6});
/* a row of shape buttons over a polyhedron view; list: MEET-style entries */
const pickSolid=(list,opts)=>el=>{
  const q=Q(el);let at=0,api=null;
  el.innerHTML=seg('Shape',list.map(([label],i)=>[i,label]))+'<div data-st></div>';
  api=polyView(q('st'),shapeOf(list[0]),opts);press(el,0);
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{if(+b.dataset.m!==at){at=+b.dataset.m;press(el,at);api.set(shapeOf(list[at]));}});
  return ()=>api.dispose();
};
/* a readout of a solid's faces, edges, and vertices */
const allThree=s=>{const counts=countsOf(s.kind,s.n);return `A ${s.name} has <b>${counts.faces} faces</b>, <b>${counts.edges} edges</b>, and <b>${counts.vertices} vertices</b>.`;};

/* not polyhedra, and one that is */
const NOT=[['Cylinder',{curved:'cylinder'}],['Cone',{curved:'cone'}],['Sphere',{curved:'sphere'}],['Box with no lid',{curved:'open'}],['Flat hexagon',{curved:'flat'}],['Hexagonal prism',null]];
/* why each isn't a polyhedron */
const NOT_WHY={...Object.fromEntries(Object.entries(CURVED).map(([id,curved])=>[id,curved.why])),flat:'It’s flat: a polygon, not a 3D shape. It has no space inside.'};
/* tap through shapes that aren't polyhedra (and one that is), each saying why */
function wNot(el){
  const q=Q(el);let at=0,api=null;
  const shape=i=>NOT[i][1]||solidOf('prism',6,{a:1.2,h:2.2});
  el.innerHTML=seg('Shape',NOT.map(([label],i)=>[i,label]))+'<div data-st></div>';
  api=polyView(q('st'),shape(0),{read:s=>s.curved?`<span class="no">Not a polyhedron.</span> ${NOT_WHY[s.curved]}`
    :`<span class="ok">A polyhedron!</span> It’s closed, and all 8 faces are polygons: 2 hexagons and 6 rectangles.`});
  press(el,0);
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{if(+b.dataset.m!==at){at=+b.dataset.m;press(el,at);api.set(shape(at));}});
  return ()=>api.dispose();
}

/* the quick checks' figures */
const F={
  hexPrism:solidSvg(solidOf('prism',6,{a:1.6,h:3})),
  sqPyr:solidSvg(solidOf('pyramid',4,{a:3,h:2.6})),
  pentPrism:solidSvg(solidOf('prism',5,{a:2,h:2.4}),{dots:true}),
};
const STEPS=[
  {title:'What is a polyhedron?',widget:pickSolid(MEET,{point:true,read:s=>`A <b>${s.name}</b>. ${allThree(s)}`}),
    body:'<p>A <b>polyhedron</b> is a closed 3D shape whose faces are all polygons. Each flat side is a <b>face</b>. Two faces meet at an <b>edge</b>, and edges meet at a corner called a <b>vertex</b> (more than one: <b>vertices</b>).</p><p>Pick a shape and drag to turn it. One face, one edge, and one vertex are marked.</p>',
    check:{kind:'mc',q:'Two faces of a polyhedron meet along a line segment. What is that segment called?',
      choices:[{id:'e',label:'An edge'},{id:'v',label:'A vertex'},{id:'f',label:'A face'},{id:'b',label:'A base'}],answer:'e',
      why:{v:'A vertex is a corner, a single point where edges meet. A segment is longer than a point.',f:'A face is a flat side. The segment is where two faces meet.',b:'A base is a face that names a prism or pyramid, not a segment.'},
      explain:'Where two faces meet is an edge. Where edges meet is a vertex.'}},
  {title:'Count the faces',widget:pickSolid(MEET.slice(1),{count:'faces'}),
    body:'<p>To count faces, you have to count the ones you can’t see too: the back and the bottom.</p><p>Tap each face once. Turn the shape to find them all.</p>',
    check:{kind:'num',unit:'faces',answer:8,fig:F.hexPrism,q:'How many faces does a hexagonal prism have?',
      misc:[[6,'Those are the rectangles around the sides. Add the hexagon on the top and the one on the bottom.'],[7,'Don’t forget the hexagon on the bottom. You can’t see it from here.'],[18,'18 is the number of edges. Count the flat faces.'],[12,'12 is the number of vertices (corners). Count the flat faces.']],
      explain:'2 hexagons (top and bottom) + 6 rectangles (around the sides) = 8 faces.'}},
  {title:'Count the edges',widget:pickSolid(MEET.slice(1),{count:'edges'}),
    body:'<p>An <b>edge</b> is where two faces meet. Dashed lines in a drawing are edges at the back.</p><p>Tap each edge once. Count the edges around the base, then the ones going up.</p>',
    check:{kind:'num',unit:'edges',answer:8,fig:F.sqPyr,q:'How many edges does a square pyramid have?',
      misc:[[4,'That’s just the edges around the square base. Add the 4 edges that go up to the top.'],[5,'5 is the number of faces or vertices. Count where two faces meet.'],[12,'12 is the edges of a box. A pyramid has no top face: its triangles meet at one point.']],
      explain:'4 edges around the base + 4 edges up to the top = 8 edges.'}},
  {title:'Count the vertices',widget:pickSolid(MEET.slice(1),{count:'vertices'}),
    body:'<p>A <b>vertex</b> is a corner, where edges meet. Count every corner, including the hidden ones.</p><p>Tap each vertex once.</p>',
    check:{kind:'num',unit:'vertices',answer:10,fig:F.pentPrism,q:'How many vertices does a pentagonal prism have?',
      misc:[[5,'That’s one pentagon. The other pentagon has 5 corners too.'],[7,'7 is the number of faces. Count the corners.'],[15,'15 is the number of edges. Count the corners.']],
      explain:'5 corners on the top pentagon + 5 on the bottom pentagon = 10 vertices.'}},
  {title:'What isn’t a polyhedron?',widget:wNot,
    body:'<p>Not every 3D shape is a polyhedron. A polyhedron has to be <b>closed</b>, and <b>every face has to be a polygon</b>: flat, with straight sides.</p><p>Pick each shape. Why is it, or isn’t it, a polyhedron?</p>',
    check:{kind:'mc',q:'Which one is a polyhedron?',
      choices:[{id:'cyl',label:'A cylinder'},{id:'cone',label:'A cone'},{id:'tri',label:'A triangular pyramid'},{id:'sph',label:'A sphere'}],answer:'tri',
      why:{cyl:'A cylinder’s side is curved, so not all its faces are polygons.',cone:'A cone’s side is curved, and its base is a circle.',sph:'A sphere is curved all over. It has no flat faces.'},
      explain:'A triangular pyramid is closed, and its 4 faces are all triangles. The others have curved surfaces.'}}
];
