/* Learn Introducing Ratios (Grade 6 Unit 2), chapter 1: Ratios. Its widgets and steps; loaded by ratios.html. */
const [CIRC,SQ]=MARKS;
const isAre=n=>n===1?'is':'are';

/* two amounts, and the ratio each way round */
function wRatio(el){
  const q=Q(el),st={a:3,b:2};
  el.innerHTML=`<div class="wrow">${stepper('a','Circles')}${stepper('b','Squares')}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {a,b}=st;q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=rowsDiagram([{sh:CIRC,n:a},{sh:SQ,n:b}],{label:`${a} circles and ${b} squares`});
    q('r').innerHTML=`The ratio of circles to squares is <b>${a} : ${b}</b>.<br>The ratio of squares to circles is <b>${b} : ${a}</b>.<br><span class="dimline">For every ${a} ${a===1?'circle':'circles'}, there ${isAre(b)} ${b} ${b===1?'square':'squares'}.</span>`;
  };
  steppers(el,st,{a:[1,9],b:[1,9]},draw);
  draw();
}

/* a ratio in equal groups: 6 : 9 is 3 groups of 2 : 3 */
const GROUPS=[[6,9],[8,4],[10,15],[12,8]];
function wGroups(el){
  const q=Q(el);let p=0,grouped=false;
  el.innerHTML=seg('Ratio',GROUPS.map(([a,b],i)=>[i,`${a} : ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-g></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=GROUPS[p],g=gcd(a,b);press(el,p);
    q('f').innerHTML=rowsDiagram([{sh:CIRC,n:a},{sh:SQ,n:b}],{groups:grouped?g:0,label:`${a} circles and ${b} squares`+(grouped?`, in ${g} equal groups`:'')});
    q('g').textContent=grouped?'Ungroup':'Put them in equal groups';
    q('r').innerHTML=grouped?`<b>${g}</b> equal groups, each with <b>${a/g}</b> circles and <b>${b/g}</b> squares.<br><span class="ok">For every ${a/g} circles, there ${isAre(b/g)} ${b/g} ${b/g===1?'square':'squares'}: ${a} : ${b} and ${a/g} : ${b/g} describe the same mix.</span>`
      :`${a} circles and ${b} squares: the ratio is <b>${a} : ${b}</b>.<br><span class="dimline">Put them in equal groups to see the smaller pattern inside.</span>`;
  };
  q('g').onclick=()=>{grouped=!grouped;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;grouped=false;draw();}});
  draw();
}

const STEPS=[
  {title:'What is a ratio?',widget:wRatio,
    body:'<p>A <b>ratio</b> compares two amounts. 3 circles and 2 squares make the ratio <b>3 : 2</b>, said “3 to 2.”</p><p>Order matters: in “the ratio of circles to squares,” the number of circles comes first. Change the numbers and watch both ratios.</p>',
    check:{kind:'mc',q:'A recipe uses 3 cups of flour and 2 cups of sugar. What is the ratio of <b>sugar to flour</b>?',
      choices:[{id:'a',label:'2 : 3'},{id:'b',label:'3 : 2'},{id:'c',label:'2 : 5'}],answer:'a',
      why:{b:'That’s flour to sugar. The first number goes with the first thing named: sugar.',c:'5 is all the cups together. This compares sugar to flour, not sugar to the whole.'},
      explain:'Sugar comes first: 2 cups of sugar to 3 cups of flour is 2 : 3.'}},
  {title:'Equal groups',widget:wGroups,
    body:'<p>You can often split a ratio into equal groups. 6 circles and 9 squares make 3 groups, each with 2 circles and 3 squares. So “for every 2 circles, there are 3 squares.”</p><p>Pick a ratio and put it in equal groups.</p>',
    check:{kind:'mc',stack:true,q:'A jar has 12 red beads and 8 blue beads. Which sentence is true?',
      choices:[{id:'a',label:'For every 3 red beads, there are 2 blue beads.'},{id:'b',label:'For every 3 blue beads, there are 2 red beads.'},{id:'c',label:'There are 4 more red beads, so the ratio is 4 : 1.'}],answer:'a',
      why:{b:'That has the colors switched. There are more red beads than blue ones.',c:'4 is the difference between 12 and 8. A ratio compares the amounts: 12 : 8.'},
      explain:'12 : 8 splits into 4 equal groups of 3 red and 2 blue. For every 3 red beads, there are 2 blue beads.'}}
];
