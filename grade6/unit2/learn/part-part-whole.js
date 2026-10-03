/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 6: Part-part-whole. Its widgets and steps; loaded by part-part-whole.html. */
/* the ratios a : b to choose from, and what the parts are */
const TAPES=[[2,3],[3,5],[1,4]],BEADS={A:'red beads',B:'blue beads'};
/* A tape diagram for a : b with k in each box (a stepper). */
function wTape(el){
  /* the stepper's value: k in each box */
  const q=Q(el),values={k:4};let ratioIndex=0;
  el.innerHTML=seg('Ratio',TAPES.map(([a,b],i)=>[i,`${a} : ${b}`]))+`<div class="wrow">${stepper('k','In each box')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=TAPES[ratioIndex],{k}=values;press(el,ratioIndex);q('k').textContent=k;
    q('f').innerHTML=tapeFig(BEADS,a,b,k,{showA:true,showB:true,showT:true})(true);
    q('r').innerHTML=`Each box is <b>${k}</b>. Red: ${a} × ${k} = <b>${a*k}</b>. Blue: ${b} × ${k} = <b>${b*k}</b>.<br>Total: ${a+b} boxes × ${k} = <b>${(a+b)*k}</b> beads.`;
  };
  steppers(el,values,{k:[1,9]},draw);
  el.addEventListener('click',e=>{const ratioBtn=e.target.closest('[data-m]');if(ratioBtn){ratioIndex=+ratioBtn.dataset.m;draw();}});
  draw();
}

/* problems where one amount is known: part A, part B, or the total (T), and its value v */
const KNOWN=[
  {A:'red paint',B:'white paint',a:3,b:5,know:'A',v:12,unit:'cups'},
  {A:'boys',B:'girls',a:2,b:3,know:'T',v:25,unit:''},
  {A:'dogs',B:'cats',a:4,b:1,know:'B',v:6,unit:''},
];
/* One amount is known (a part or the total): divide it by its boxes to find each box, then everything else. */
function wWhole(el){
  /* shown: the boxes are filled in */
  const q=Q(el);let problemIndex=0,shown=false;
  el.innerHTML=seg('Problem',KNOWN.map((problem,i)=>[i,`${problem.A} : ${problem.B}`]))+`<p class="note" data-say></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* boxes: how many boxes the known amount fills; perBox: what each box is worth */
    const problem=KNOWN[problemIndex],{a,b,know,v}=problem,boxes=know==='A'?a:know==='B'?b:a+b,perBox=v/boxes;press(el,problemIndex);
    const what=know==='A'?problem.A:know==='B'?problem.B:'in all';
    q('say').textContent=`The ratio of ${problem.A} to ${problem.B} is ${a} : ${b}. There are ${v} ${know==='T'?'in all':problem.unit?`${problem.unit} of ${what}`:what}.`;
    q('f').innerHTML=tapeFig(problem,a,b,perBox,{showA:shown||know==='A',showB:shown||know==='B',showT:shown||know==='T',qa:!shown&&know!=='A',qb:!shown&&know!=='B',qt:!shown&&know!=='T'})(shown);
    q('go').textContent=shown?'Hide the boxes':'Show the boxes';
    q('r').innerHTML=shown?`${v} fills <b>${boxes}</b> ${boxes===1?'box':'boxes'}, so each box is ${v} ÷ ${boxes} = <b>${perBox}</b>.<br>${problem.A}: ${a} × ${perBox} = <b>${a*perBox}</b>. ${problem.B}: ${b} × ${perBox} = <b>${b*perBox}</b>. In all: ${a+b} × ${perBox} = <b>${(a+b)*perBox}</b>.`
      :'<span class="dimline">Which boxes does the amount you know fill? Show the boxes to check.</span>';
  };
  q('go').onclick=()=>{shown=!shown;draw();};
  el.addEventListener('click',e=>{const problemBtn=e.target.closest('[data-m]');if(problemBtn){problemIndex=+problemBtn.dataset.m;shown=false;draw();}});
  draw();
}

/* the quick checks' figures */
const F={
  club:tapeFig({A:'boys',B:'girls'},2,3,5,{qb:true,showT:true})(false),
  paint:tapeFig({A:'red',B:'white'},3,5,4,{showA:true,qt:true})(false),
};
const STEPS=[
  {title:'Tape diagrams',widget:wTape,
    body:'<p>A <b>tape diagram</b> shows a ratio as boxes that are all the same size: 2 : 3 is 2 boxes and 3 boxes. When you know the total, split it evenly into all the boxes.</p><p>Pick a ratio and change what’s in each box.</p>',
    check:{kind:'num',unit:'girls',answer:15,fig:F.club,q:'The ratio of boys to girls in a club is 2 : 3. There are 25 students. How many are girls?',
      misc:[[10,'That’s the boys: 2 boxes of 5.'],[5,'That’s one box: 25 ÷ 5 boxes. The girls have 3 boxes.'],[75,'That’s 25 × 3. First split 25 into 2 + 3 = 5 equal boxes.']],
      explain:'2 + 3 = 5 boxes hold 25 students, so each box is 5. The girls have 3 boxes: 15 girls.'}},
  {title:'From a part to the whole',widget:wWhole,
    body:'<p>You can start from one part too. If you know the red paint, divide it by the red boxes to find each box. Then you can find the other part and the total.</p><p>Pick a problem, think it through, then show the boxes.</p>',
    check:{kind:'num',unit:'cups',answer:32,fig:F.paint,q:'Paint is mixed 3 cups of red to 5 cups of white. Kiran uses 12 cups of red. How many cups of paint are there in all?',
      misc:[[20,'That’s the white paint. Add the red too: 12 + 20.'],[4,'That’s one box: 12 ÷ 3. There are 3 + 5 = 8 boxes in all.'],[96,'That’s 12 × 8. Each box is 12 ÷ 3 = 4, and there are 8 boxes.']],
      explain:'12 cups of red fill 3 boxes, so each box is 4 cups. 8 boxes in all: 8 × 4 = 32 cups.'}}
];
