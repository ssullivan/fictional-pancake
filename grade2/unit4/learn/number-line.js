/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4), chapter 1: Numbers on the number line. Its widgets and steps; loaded by number-line.html. */
/* A number line drawn right or wrong, for "which one is right?": tick labels at positions (0..1 across the line) */
function badLine(labels,positions,label){
  const width=300,left=18,lineY=26;
  let markup=`<line class="axis" x1="${left}" y1="${lineY}" x2="${width-left}" y2="${lineY}"/>`;
  labels.forEach((text,i)=>{const x=left+positions[i]*(width-2*left);markup+=`<line class="tick" x1="${x}" y1="${lineY-8}" x2="${x}" y2="${lineY+8}"/><text class="lbl" x="${x}" y="${lineY+24}">${text}</text>`;});
  return svgWrap(width,lineY+36,markup,label);
}
/* n positions spread evenly from 0 to 1 */
const even=n=>range(n).map(i=>i/(n-1));
/* A dot on a number line from 0 to 20 (a stepper moves it): its number is how many lengths it is from 0. */
function wLength(el){
  const q=Q(el),values={n:6};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Number')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=values.n;q('n').textContent=n;
    q('f').innerHTML=numLine(0,20,{u:30,ls:'',end:true,lab:()=>true,arrows:n?[{a:0,b:n}]:[],pts:[{v:n}],label:`A number line from 0 to 20 with a dot at ${n}`});
    q('r').innerHTML=n?`The dot is at <b>${n}</b>. It is <b>${n} ${n>1?'lengths':'length'}</b> from 0.<br><span class="dimline">${n>1?`Each space is 1 length. Count them: ${n>6?`1, 2, 3, … ${n}`:range(n).map(i=>i+1).join(', ')}.`:'One space from 0 is 1.'}</span>`
      :'The dot is at <b>0</b>. That’s where we start. Tap <b>+</b> to move it.';
  };
  steppers(el,values,{n:[0,20]},draw);
  draw();
}
/* what makes a number line: a picture (fig) and what it says */
const FEAT=[
  {label:'Equal spaces',f:()=>numLine(0,10,{u:40,ls:'',end:true,lab:()=>true,hops:range(10).map(i=>({a:i,b:i+1,t:1})),label:'A number line from 0 to 10 with a jump of 1 in every space'}),
    say:'Every space is the <b>same length</b>: 1. That’s how we know where each number goes.'},
  {label:'Bigger to the right',f:()=>numLine(0,10,{u:40,ls:'',end:true,lab:()=>true,pts:[{v:3},{v:8,cls:'b'}],label:'A number line from 0 to 10 with dots at 3 and 8'}),
    say:'Numbers get <b>bigger</b> as you go <b>right</b>. 8 is to the right of 3, and 8 is more than 3.'},
  {label:'Keeps going',f:()=>numLine(40,50,{u:40,ls:'',end:true,lab:()=>true,label:'A number line from 40 to 50 with an arrow at the end'}),
    say:'The <b>arrow</b> means the line keeps going, past 100 and more. A number line can show just a part, like 40 to 50.'},
];
/* Pick a feature to see it on a number line. */
function wFeatures(el){
  const q=Q(el);let featureIndex=0;
  el.innerHTML=seg('Feature',FEAT.map((feature,i)=>[i,feature.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{press(el,featureIndex);q('f').innerHTML=FEAT[featureIndex].f();q('r').innerHTML=FEAT[featureIndex].say;};
  el.addEventListener('click',e=>{const featureBtn=e.target.closest('[data-m]');if(featureBtn){featureIndex=+featureBtn.dataset.m;draw();}});
  draw();
}
/* Tap a tick with no number: the readout counts on from the ten before it, or back from the ten after. */
function wTicks(el){
  /* picked: the tick tapped (null before one is) */
  const q=Q(el);let picked=null;
  el.innerHTML=`<p class="story">Only the tens have numbers. Tap any tick mark.</p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=line(30,50,{u:26,lab:v=>v%10===0,tap:true,pts:picked===null?[]:[{v:picked,t:picked}],label:'A number line from 30 to 50; only 30, 40, and 50 have numbers'});
    if(picked===null){q('r').innerHTML='Which number goes there?';return;}
    /* tenBefore and past: the ten before the tick, and how far past it the tick is */
    const tenBefore=Math.floor(picked/10)*10,past=picked-tenBefore;
    q('r').innerHTML=!past?`<span class="ok">That’s <b>${picked}</b>. It has its number already!</span>`
      :`<span class="ok">That tick is <b>${picked}</b>.</span><br><span class="dimline">`+(past<=5?`Count on from ${tenBefore}: ${range(past).map(i=>tenBefore+i+1).join(', ')}.`:`Count back from ${tenBefore+10}: ${range(10-past).map(i=>tenBefore+9-i).join(', ')}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{const tick=e.target.closest('[data-v]');if(tick){picked=+tick.dataset.v;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  dot14:numLine(0,20,{u:30,ls:'',end:true,pts:[{v:14,cls:'b',t:'?'}],label:'A number line from 0 to 20 with a dot. Only 0, 5, 10, 15, and 20 have numbers.'}),
  dot74:line(60,80,{u:26,lab:v=>v%10===0,pts:[{v:74,cls:'b',t:'?'}],label:'A number line from 60 to 80 with a dot. Only 60, 70, and 80 have numbers.'})
};
const STEPS=[
    {title:'Numbers are lengths',widget:wLength,
      body:'<p>A <b>number line</b> is like a ruler. Each number is a <b>length from 0</b>. 6 is 6 spaces from 0.</p><p>Tap <b>+</b> and <b>−</b> to move the dot. Watch the arrow from 0 grow.</p>',
      check:{kind:'num',answer:14,fig:F.dot14,q:'What number is the dot at?',
        misc:[[16,'The dot is to the left of 15, so it’s less than 15. Count back 1 from 15.'],[4,'That’s how far past 10 it is. Start at 10 and count on 4.'],[13,'Count the spaces, not the tick marks. From 10, go 1, 2, 3, 4.']],
        explain:'The dot is 4 spaces past 10, or 1 space before 15. It’s at 14.'}},
    {title:'Parts of a number line',widget:wFeatures,
      body:'<p>Every number line has the same rules. The spaces are <b>equal</b>. Numbers get <b>bigger to the right</b>. The <b>arrow</b> means it keeps going.</p><p>Tap each rule to see it.</p>',
      check:{kind:'mc',q:'Which number line is made the right way?',stack:true,
        choices:[
          {id:'a',label:badLine([0,1,2,3,4,5],[0,.1,.2,.5,.7,1],'Number line 0 to 5 with uneven spaces')},
          {id:'b',label:badLine([0,1,2,3,4,5],even(6),'Number line 0 to 5 with equal spaces')},
          {id:'c',label:badLine([0,1,3,2,4,5],even(6),'Number line with 0, 1, 3, 2, 4, 5 in that order')}],answer:'b',
        why:{a:'Look at the spaces. Some are long and some are short. They must all be equal.',c:'Look at 3 and 2. They are in the wrong order. Numbers get bigger to the right.'},
        explain:'The middle one has equal spaces, and the numbers go 0, 1, 2, 3, 4, 5 from left to right.'}},
    {title:'Tick marks with no numbers',widget:wTicks,
      body:'<p>Some tick marks don’t have numbers. Find a tick with a number and <b>count on</b> or <b>count back</b>, 1 for each space.</p>',
      check:{kind:'num',answer:74,fig:F.dot74,q:'What number is the dot at?',
        misc:[[75,'Don’t count the tick at 70. Count the spaces after 70: 71, 72, 73, 74.'],[76,'76 is 4 back from 80. The dot is 4 past 70.'],[64,'Look at the tens. The dot is between 70 and 80.']],
        explain:'Start at 70 and count on: 71, 72, 73, 74. The dot is at 74.'}}
  ];
