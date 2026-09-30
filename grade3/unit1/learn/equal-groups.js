/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 4: Equal groups. Its widgets and steps; loaded by equal-groups.html. */
/* how many groups, and how many in each */
function wGroups(el){
  const q=Q(el),st={g:4,n:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('g','Groups')}${stepper('n','In each group')}</div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {g,n}=st;q('g').textContent=g;q('n').textContent=n;
    q('f').innerHTML=groupsFig(g,n);
    q('o').innerHTML=`<b>${pl(g,'group')} of ${n}</b>. `+(g===1?`1 group of ${n} is just ${n}.`
      :`${addends(g,n)} = <b>${g*n}</b>.<br><span class="dimline">Count by ${n}s: ${countBy(n,g)}.</span>`);
  };
  steppers(el,st,{g:[1,6],n:[1,10]},draw);draw();
}
/* the same story as a drawing or a diagram */
const STORY=[{g:3,n:6,groups:'packs',things:'juice boxes',say:'3 packs of juice boxes, 6 in each pack'},{g:5,n:2,groups:'vases',things:'flowers',say:'5 vases with 2 flowers in each'},{g:4,n:8,groups:'boxes',things:'crayons',say:'4 boxes of crayons, 8 in each box'}];
const tapeOf=(g,n,label)=>partWhole(range(g).map(()=>({n:1,show:n})),'?',label||`Tape diagram: ${g} equal parts of ${n}, and the whole unknown`);
function wDiagram(el){
  const q=Q(el);let p=0,m='draw';
  el.innerHTML=`<div data-top>${seg('Story',STORY.map((s,i)=>[i,`${s.g} ${s.groups}`]))}</div><div data-bot>${seg('Show it as',[['draw','Drawing'],['tape','Diagram']])}</div><div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw=()=>{
    const {g,n,groups,things,say}=STORY[p];press(q('top'),p);press(q('bot'),m);
    q('f').innerHTML=m==='draw'?groupsFig(g,n,{label:`${g} circles with ${n} dots in each`}):tapeOf(g,n);
    q('o').innerHTML=`${say[0].toUpperCase()+say.slice(1)}: ${g} groups of ${n}.<br>`
      +(m==='draw'?`<span class="dimline">Each circle is one of the ${groups}. The dots are the ${things}.</span>`:`<span class="dimline">The diagram has ${g} equal parts, one for each of the ${groups}. Each part is ${n}. The ? is the whole.</span>`)
      +`<br>${addends(g,n)} = <b>${g*n} ${things}</b>.`;
  };
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')p=+h[1];else m=h[1];draw();});
  draw();
}
/* the quick checks' figures */
const F={
  berries:groupsFig(5,4,{label:'5 plates with 4 strawberries on each'}),
  t45:tapeOf(4,5,'Diagram A'),t54:tapeOf(5,4,'Diagram B'),
  tsum:partWhole([{n:4,show:4},{n:5,show:5}],'?','Diagram C')
};
const STEPS=[
    {title:'Equal groups',widget:wGroups,
      body:'<p><b>Equal groups</b> all have the same number in them. To find how many in all, add the same number again and again, or count by it.</p><p>Change the number of groups and how many are in each.</p>',
      check:{kind:'num',q:'Each plate has the same number of strawberries. How many strawberries are there in all?',fig:F.berries,answer:20,unit:'strawberries',
        misc:[[9,'You added 5 + 4. There are 5 groups of 4: 4 + 4 + 4 + 4 + 4.'],[5,'That’s the number of plates. Count the strawberries.'],[4,'That’s how many are on one plate. There are 5 plates.']],
        explain:'5 groups of 4: 4 + 4 + 4 + 4 + 4 = 20. Or count by 4s: 4, 8, 12, 16, 20.'}},
    {title:'Drawings and diagrams',widget:wDiagram,
      body:'<p>You can show equal groups with a <b>drawing</b>, like circles with dots, or a <b>diagram</b> with equal parts. Both show how many groups and how many in each.</p><p>Pick a story, then switch between the drawing and the diagram.</p>',
      check:{kind:'mc',q:'Which diagram shows 4 bags with 5 oranges in each bag?',stack:true,
        choices:[{id:'a',label:F.t45},{id:'b',label:F.t54},{id:'c',label:F.tsum}],answer:'a',
        why:{b:'That’s 5 groups of 4. There are 4 bags, so the diagram needs 4 parts.',c:'That’s just 4 and 5. Each of the 4 bags has 5, so every part is 5.'},
        explain:'Diagram A has 4 equal parts, one for each bag, and each part is 5.'}}
  ];
