/* Learn Addition and Subtraction on the Number Line (Grade 2 Unit 4): figures, widgets, and the chapters. Loaded by learn.html.
   Number lines (numLine), steppers, and choice buttons come from shared/k5.js. */

/* ---------- figures ---------- */
/* A number line from lo to hi with every number shown when there's room, else every 5 or 10 (or o.lab).
   Tick numbers too close to a labelled dot are left off so they don't overlap. */
function line(lo,hi,o={}){
  const u=o.u||Math.min(34,560/(hi-lo)),lab=o.lab||(v=>hi-lo<=12||v%(hi-lo<=30?5:10)===0),near=(o.pts||[]).filter(p=>p.t!=null).map(p=>p.v);
  return numLine(lo,hi,{ls:'',end:true,...o,u,lab:v=>lab(v)&&near.every(w=>w===v||Math.abs(w-v)*u>=30)});
}
/* jumps from a by each of steps (signed), labelled +n or −n: hopsFrom(34, [10, 10, 3]) */
const sgn=n=>n>0?`+${n}`:`−${-n}`;
function hopsFrom(a,steps){
  let v=a;
  return steps.map(n=>{const h={a:v,b:v+n,t:sgn(n)};v+=n;return h;});
}
/* the tens around a and b: [lo, hi] so the line has room for both */
const around=(a,b)=>[Math.floor(Math.min(a,b)/10)*10,Math.ceil((Math.max(a,b)+1)/10)*10];
/* A number line drawn wrong, for "which one is right?": labels at positions xs (0..1 across the line) */
function badLine(labels,xs,label){
  const W=300,X=18,Y=26;
  let o=`<line class="axis" x1="${X}" y1="${Y}" x2="${W-X}" y2="${Y}"/>`;
  labels.forEach((t,i)=>{const x=X+xs[i]*(W-2*X);o+=`<line class="tick" x1="${x}" y1="${Y-8}" x2="${x}" y2="${Y+8}"/><text class="lbl" x="${x}" y="${Y+24}">${t}</text>`;});
  return svgWrap(W,Y+36,o,label);
}
const even=n=>range(n).map(i=>i/(n-1));

/* ---------- Chapter 1: numbers on the number line ---------- */
function wLength(el){
  const q=Q(el),st={n:6};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('n','Number')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=st.n;q('n').textContent=n;
    q('f').innerHTML=numLine(0,20,{u:30,ls:'',end:true,lab:()=>true,arrows:n?[{a:0,b:n}]:[],pts:[{v:n}],label:`A number line from 0 to 20 with a dot at ${n}`});
    q('r').innerHTML=n?`The dot is at <b>${n}</b>. It is <b>${n} ${n>1?'lengths':'length'}</b> from 0.<br><span class="dimline">${n>1?`Each space is 1 length. Count them: ${n>6?`1, 2, 3, … ${n}`:range(n).map(i=>i+1).join(', ')}.`:'One space from 0 is 1.'}</span>`
      :'The dot is at <b>0</b>. That’s where we start. Tap <b>+</b> to move it.';
  };
  steppers(el,st,{n:[0,20]},draw);
  draw();
}
const FEAT=[
  {label:'Equal spaces',f:()=>numLine(0,10,{u:40,ls:'',end:true,lab:()=>true,hops:range(10).map(i=>({a:i,b:i+1,t:1})),label:'A number line from 0 to 10 with a jump of 1 in every space'}),
    say:'Every space is the <b>same length</b>: 1. That’s how we know where each number goes.'},
  {label:'Bigger to the right',f:()=>numLine(0,10,{u:40,ls:'',end:true,lab:()=>true,pts:[{v:3},{v:8,cls:'b'}],label:'A number line from 0 to 10 with dots at 3 and 8'}),
    say:'Numbers get <b>bigger</b> as you go <b>right</b>. 8 is to the right of 3, and 8 is more than 3.'},
  {label:'Keeps going',f:()=>numLine(40,50,{u:40,ls:'',end:true,lab:()=>true,label:'A number line from 40 to 50 with an arrow at the end'}),
    say:'The <b>arrow</b> means the line keeps going, past 100 and more. A number line can show just a part, like 40 to 50.'},
];
function wFeatures(el){
  const q=Q(el);let k=0;
  el.innerHTML=seg('Feature',FEAT.map((f,i)=>[i,f.label]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{press(el,k);q('f').innerHTML=FEAT[k].f();q('r').innerHTML=FEAT[k].say;};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;draw();}});
  draw();
}
/* tap a tick with no number: the readout counts on from the ten before it */
function wTicks(el){
  const q=Q(el);let v=null;
  el.innerHTML=`<p class="story">Only the tens have numbers. Tap any tick mark.</p><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    q('f').innerHTML=line(30,50,{u:26,lab:v=>v%10===0,tap:true,pts:v===null?[]:[{v,t:v}],label:'A number line from 30 to 50; only 30, 40, and 50 have numbers'});
    if(v===null){q('r').innerHTML='Which number goes there?';return;}
    const t=Math.floor(v/10)*10,o=v-t;
    q('r').innerHTML=!o?`<span class="ok">That’s <b>${v}</b>. It has its number already!</span>`
      :`<span class="ok">That tick is <b>${v}</b>.</span><br><span class="dimline">`+(o<=5?`Count on from ${t}: ${range(o).map(i=>t+i+1).join(', ')}.`:`Count back from ${t+10}: ${range(10-o).map(i=>t+9-i).join(', ')}.`)+`</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b){v=+b.dataset.v;draw();}});
  draw();
}

/* ---------- Chapter 2: compare and estimate ---------- */
const PAIRS=[[38,83],[47,52],[65,56],[29,31]];
function wCompare(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Numbers',PAIRS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PAIRS[p],[lo,hi]=around(a,b),big=Math.max(a,b),sm=Math.min(a,b);press(el,p);
    q('f').innerHTML=line(lo,hi,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],label:`A number line with dots at ${a} and ${b}`});
    q('r').innerHTML=`<b>${big}</b> is farther right, so ${big} is greater.<br><span class="ok"><b>${a} ${a>b?'>':'<'} ${b}</b></span><br><span class="dimline">${a>b?`${a} is greater than ${b}`:`${a} is less than ${b}`}. ${Math.floor(a/10)!==Math.floor(b/10)?`Look at the tens: ${Math.floor(big/10)} tens is more than ${Math.floor(sm/10)} tens.`:`Same tens, so look at the ones: ${big%10} ones is more than ${sm%10} ones.`}</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}
/* a 0 to 100 line with only 0, 50, and 100 marked, and a dot to estimate */
const estLine=(v,shown,t=shown?v:null)=>line(0,100,{u:5,step:shown?10:50,big:shown?10:50,lab:v=>v%(shown?10:50)===0,pts:[{v,cls:'b',t}],label:shown?`A number line from 0 to 100 marked every 10, with a dot at ${v}`:'A number line with 0, 50, and 100, and a dot to estimate'});
const EST=[{v:48,ok:50},{v:21,ok:20},{v:88,ok:90}],GUESS=[20,50,90];
function wEstimate(el){
  const q=Q(el);let p=0,e=-1,shown=false;
  el.innerHTML=seg('Dot',EST.map((_,i)=>[i,`Dot ${'ABC'[i]}`]))+`<div class="fig" data-f></div><div class="chips" data-c></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {v,ok}=EST[p];press(el,p);
    q('f').innerHTML=estLine(v,shown);
    q('c').innerHTML=GUESS.map((g,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}"${shown?' disabled':''}>about ${g}</button>`).join('');
    q('go').disabled=e<0;q('go').textContent=shown?'Try another':'Show the tens';
    q('r').innerHTML=e<0?'About what number is the dot at? Is it near 0, 50, or 100? Tap an estimate.'
      :!shown?`Your estimate: <b>about ${GUESS[e]}</b>. Now show the tens to check.`
      :`The dot is at <b>${v}</b>. You said about ${GUESS[e]}.<br>`+(GUESS[e]===ok?'<span class="ok">Great estimate!</span>':`<span class="dimline">About ${ok} is closer. An estimate doesn’t have to be exact.</span>`);
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=-1;shown=false;draw();return;}const c=ev.target.closest('[data-e]');if(c&&!shown){e=+c.dataset.e;draw();}});
  q('go').onclick=()=>{if(shown){p=(p+1)%EST.length;e=-1;shown=false;}else shown=true;draw();};
  draw();
}

/* ---------- Chapter 3: jumps ---------- */
function wJump(el){
  const q=Q(el),st={s:26,n:5};let d=1;
  el.innerHTML=seg('Way',[[1,'Add: jump right'],[-1,'Subtract: jump left']])+`<div class="fig" data-f></div><div class="wrow">${stepper('s','Start')}${stepper('n','Jump')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {s,n}=st,e=s+d*n;press(el,d);q('s').textContent=s;q('n').textContent=n;
    q('f').innerHTML=line(15,40,{u:22,lab:v=>v%10===0,hops:[{a:s,b:e,t:sgn(d*n)}],pts:[{v:s,t:s},{v:e,cls:'b',t:e}],label:`A number line: start at ${s} and jump ${d>0?'right':'left'} ${n} to ${e}`});
    q('r').innerHTML=`Start at <b>${s}</b>. Jump <b>${n}</b> to the ${d>0?'right':'left'}. You land on <b>${e}</b>.<br><span class="ok"><b>${s} ${d>0?'+':'−'} ${n} = ${e}</b></span>`;
  };
  steppers(el,st,{s:[25,30],n:[1,9]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){d=+b.dataset.m;draw();}});
  draw();
}
/* match each picture to its equation */
const EQS=['18 + 7 = 25','25 − 7 = 18','18 + 5 = 23'],EQPICS=[
  {a:18,n:7,ok:0,why:{1:'The jump goes right, so it’s adding, not subtracting.',2:'Count the jump: from 18 to 25 is 7, not 5.'}},
  {a:25,n:-7,ok:1,why:{0:'The jump goes left, so it’s subtracting. It starts at 25.',2:'The jump starts at 25 and goes left.'}},
  {a:18,n:5,ok:2,why:{0:'The jump ends at 23, not 25. Count the jump: it’s 5.',1:'The jump goes right, so it’s adding.'}},
];
function wEquation(el){
  const q=Q(el);let p=0,e=null;
  el.innerHTML=seg('Picture',EQPICS.map((_,i)=>[i,`Picture ${i+1}`]))+`<div class="fig" data-f></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=EQPICS[p],b=P.a+P.n;press(el,p);
    q('f').innerHTML=line(15,30,{u:28,lab:v=>v%5===0||v===P.a||v===b,hops:[{a:P.a,b,t:Math.abs(P.n)}],pts:[{v:P.a},{v:b,cls:'b'}],label:`A jump from ${P.a} to ${b}`});
    q('c').innerHTML=EQS.map((t,i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${i===e}">${t}</button>`).join('');
    q('r').innerHTML=e===null?'Which equation matches the jump? Where does it start? Which way does it go?'
      :e===P.ok?`<span class="ok">Yes! Start at ${P.a}, jump ${Math.abs(P.n)} ${P.n>0?'right':'left'}, land on ${b}: <b>${EQS[P.ok]}</b>.</span>`
      :`<span class="no">Not that one.</span> ${P.why[e]}`;
  };
  el.addEventListener('click',ev=>{const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=null;draw();return;}const c=ev.target.closest('[data-e]');if(c){e=+c.dataset.e;draw();}});
  draw();
}
const DIFFS=[[27,33],[45,52],[38,61]];
function wDiff(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Numbers',DIFFS.map(([a,b],i)=>[i,`${a} and ${b}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=DIFFS[p],t=Math.ceil(a/10)*10,[lo,hi]=around(a,b),st=[t-a,b-t];press(el,p);
    q('f').innerHTML=line(lo,hi,{pts:[{v:a,t:a},{v:b,cls:'b',t:b}],hops:shown?hopsFrom(a,st).map((h,i)=>({...h,t:st[i]})):[],lab:v=>v%10===0,label:`A number line with dots at ${a} and ${b}`+(shown?`, jumps of ${st[0]} and ${st[1]} from ${a} to ${b}`:'')});
    q('go').textContent=shown?'Start over':`Jump from ${a} to ${b}`;
    q('r').innerHTML=shown?`${a} to ${t} is <b>${st[0]}</b>. ${t} to ${b} is <b>${st[1]}</b>. ${st[0]} + ${st[1]} = ${b-a}.<br><span class="ok">The difference is <b>${b-a}</b>: ${a} + ${b-a} = ${b}, and ${b} − ${a} = ${b-a}.</span>`
      :`The <b>difference</b> between ${a} and ${b} is how far apart they are.<br><span class="dimline">Jump from the smaller number to the bigger one. Stop at a ten on the way.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}

/* ---------- Chapter 4: tens and ones ---------- */
/* One jump at a time. list: [{a, steps, label}]; steps are signed (+10, +10, +3, …). */
const jumper=(list,say)=>el=>{
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Problem',list.map((x,i)=>[i,x.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const P=list[p],hs=hopsFrom(P.a,P.steps),end=P.a+P.steps.reduce((s,n)=>s+n,0),at=k?hs[k-1].b:P.a,[lo,hi]=around(P.a,end);press(el,p);
    q('f').innerHTML=line(lo,hi,{lab:v=>v%10===0,hops:hs.slice(0,k),pts:[{v:P.a,t:P.a},...(k?[{v:at,cls:'b',t:at}]:[])],label:`${P.label} on a number line`+(k?`: jumps ${hs.slice(0,k).map(h=>h.t).join(', ')} to ${at}`:'')});
    q('go').textContent=k<hs.length?(k?'Next jump':'Jump!'):'Start over';
    q('r').innerHTML=!k?say(P):`${hs.slice(0,k).map(h=>`<b>${h.a} ${h.t[0]} ${h.t.slice(1)} = ${h.b}</b>`).join('<br>')}`+(k===hs.length?`<br><span class="ok">${P.label} = ${end}</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  q('go').onclick=()=>{k=k<list[p].steps.length?k+1:0;draw();};
  draw();
};
const TENS=[
  {a:34,steps:[10,10,3],label:'34 + 23'},
  {a:56,steps:[10,10,10,1],label:'56 + 31'},
  {a:78,steps:[-10,-10,-5],label:'78 − 25'},
];
const TOTEN=[
  {a:28,steps:[2,5],label:'28 + 7'},
  {a:57,steps:[3,5],label:'57 + 8'},
  {a:43,steps:[-3,-3],label:'43 − 6'},
  {a:62,steps:[-2,-3],label:'62 − 5'},
];

/* ---------- Chapter 5: unknowns and stories ---------- */
const MISS=[
  {a:27,steps:[3,20],label:'27 + ? = 50',eq:'3 + 20 = 23',ans:'? = 23, because 27 + 23 = 50.'},
  {a:36,steps:[4,10,5],label:'36 + ? = 55',eq:'4 + 10 + 5 = 19',ans:'? = 19, because 36 + 19 = 55.'},
  {a:64,steps:[-4,-20],label:'64 − ? = 40',eq:'4 + 20 = 24',ans:'? = 24, because 64 − 24 = 40.'},
];
function wMissing(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Equation',MISS.map((m,i)=>[i,m.label]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const M=MISS[p],end=M.a+M.steps.reduce((s,n)=>s+n,0),[lo,hi]=around(M.a,end),hs=hopsFrom(M.a,M.steps).map(h=>({...h,t:Math.abs(h.b-h.a)}));press(el,p);
    q('f').innerHTML=line(lo,hi,{lab:v=>v%10===0,pts:[{v:M.a,t:M.a},{v:end,cls:'b',t:end}],hops:shown?hs:[{a:M.a,b:end,t:'?',q:true}],label:`${M.label} on a number line`});
    q('go').textContent=shown?'Start over':'Jump to find ?';
    q('r').innerHTML=shown?`Add up the jumps: <b>${M.eq}</b><br><span class="ok">${M.ans}</span>`
      :`Start at <b>${M.a}</b>. How far is it to <b>${end}</b>? That’s the <b>?</b>.<br><span class="dimline">Jump to the next ten first, then by tens.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}
const STORIES=[
  {label:'More stickers',story:'Lin has 35 stickers. Lin gets 20 more. How many stickers does Lin have now?',a:35,steps:[10,10],eq:'35 + 20 = 55',ans:'Lin has 55 stickers now.'},
  {label:'Kids go inside',story:'There are 52 kids on the playground. 8 kids go inside. How many kids are still on the playground?',a:52,steps:[-2,-6],eq:'52 − 8 = 44',ans:'44 kids are still on the playground.'},
  {label:'Pages to read',story:'Clare has read 26 pages. Clare wants to read 40 pages. How many more pages does Clare need to read?',a:26,steps:[4,10],eq:'26 + 14 = 40',ans:'Clare needs to read 14 more pages.'},
];
function wStories(el){
  const q=Q(el);let k=0,shown=false;
  el.innerHTML=seg('Story',STORIES.map((x,i)=>[i,x.label]))+`<p class="story" data-s></p><div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const S=STORIES[k],end=S.a+S.steps.reduce((s,n)=>s+n,0),[lo,hi]=around(S.a,end);press(el,k);
    q('s').textContent=S.story;
    q('f').innerHTML=line(lo,hi,{lab:v=>v%10===0,pts:[{v:S.a,t:S.a},...(shown?[{v:end,cls:'b',t:end}]:[])],hops:shown?hopsFrom(S.a,S.steps):[],label:`${S.label}: a number line starting at ${S.a}`});
    q('go').textContent=shown?'Start over':'Show the jumps';
    q('r').innerHTML=shown?`<b>${S.eq}</b><br><span class="ok">${S.ans}</span>`:'Where do you start? Do you jump right (more) or left (fewer)?';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;shown=false;draw();}});
  q('go').onclick=()=>{shown=!shown;draw();};
  draw();
}

/* ---------- quick-check figures ---------- */
const F={
  dot14:numLine(0,20,{u:30,ls:'',end:true,pts:[{v:14,cls:'b',t:'?'}],label:'A number line from 0 to 20 with a dot. Only 0, 5, 10, 15, and 20 have numbers.'}),
  dot74:line(60,80,{u:26,lab:v=>v%10===0,pts:[{v:74,cls:'b',t:'?'}],label:'A number line from 60 to 80 with a dot. Only 60, 70, and 80 have numbers.'}),
  cmp:line(40,70,{pts:[{v:46,t:46},{v:64,cls:'b',t:64}],label:'A number line with dots at 46 and 64'}),
  est:estLine(73,false,'?'),
  back6:line(40,50,{u:34,hops:[{a:47,b:41,t:'−6'}],pts:[{v:47,t:47},{v:41,cls:'b',t:'?'}],label:'A number line: start at 47 and jump 6 to the left'}),
  eq52:line(40,55,{u:28,lab:v=>v%5===0||v===44||v===52,hops:[{a:52,b:44,t:8}],pts:[{v:52},{v:44,cls:'b'}],label:'A jump of 8 from 52 to 44'}),
  diff:line(40,60,{lab:v=>v%10===0,pts:[{v:46,t:46},{v:53,cls:'b',t:53}],label:'A number line with dots at 46 and 53'}),
  tens45:line(40,80,{lab:v=>v%10===0,hops:hopsFrom(45,[10,10,10,2]),pts:[{v:45,t:45},{v:77,cls:'b',t:'?'}],label:'Jumps from 45: plus 10, plus 10, plus 10, plus 2'}),
  toTen36:line(30,50,{lab:v=>v%10===0,hops:hopsFrom(36,[4,4]),pts:[{v:36,t:36},{v:44,cls:'b',t:'?'}],label:'36 plus 8: jumps of 4 and 4 from 36'}),
  miss38:line(30,60,{lab:v=>v%10===0,hops:[{a:38,b:60,t:'?',q:true}],pts:[{v:38,t:38},{v:60,cls:'b',t:60}],label:'A number line: from 38 to 60 is ?'}),
  books:line(30,50,{lab:v=>v%10===0,pts:[{v:43,t:43}],label:'A number line from 30 to 50 with a dot at 43'}),
};

/* ---------- chapters ---------- */
const ICON={
  line:'<path d="M4,40H56" stroke="#f3f6fb" stroke-width="3"/><polygon points="62,40 54,35 54,45" fill="#f3f6fb"/><path d="M8,34v12M20,36v8M32,34v12M44,36v8" stroke="#f3f6fb" stroke-width="2.5"/><circle cx="44" cy="40" r="6" fill="#ffc93c"/>',
  compare:'<path d="M4,44H60" stroke="#f3f6fb" stroke-width="3"/><circle cx="18" cy="44" r="6" fill="#ffc93c"/><circle cx="46" cy="44" r="6" fill="#7fe3ff"/><text x="32" y="28" fill="#5fe0a8" font-size="22" font-weight="700" text-anchor="middle" font-family="monospace">&lt;</text>',
  jump:'<path d="M4,48H60" stroke="#f3f6fb" stroke-width="3"/><path d="M12,46Q32,6 50,42" fill="none" stroke="#ffc93c" stroke-width="3.5"/><polygon points="52,47 44,40 53,36" fill="#ffc93c"/>',
  tens:'<path d="M2,50H62" stroke="#f3f6fb" stroke-width="3"/><path d="M6,48Q16,28 26,46M26,48Q36,28 46,46" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M46,48Q51,38 56,46" fill="none" stroke="#7fe3ff" stroke-width="3"/><text x="16" y="24" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+10</text><text x="36" y="24" fill="#ffc93c" font-size="11" font-weight="700" text-anchor="middle" font-family="monospace">+10</text>',
  story:'<path d="M4,50H60" stroke="#f3f6fb" stroke-width="3"/><path d="M10,48Q32,12 54,46" fill="none" stroke="#7fe3ff" stroke-width="3.5"/><text x="32" y="24" fill="#7fe3ff" font-size="18" font-weight="700" text-anchor="middle" font-family="monospace">?</text>',
};
const CH=[
  {icon:'line',title:'Numbers on the number line',lessons:'Lessons 1–3',blurb:'See each number as a length from 0, learn the parts of a number line, and find numbers at tick marks.',steps:[
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
  ]},
  {icon:'compare',title:'Compare and estimate',lessons:'Lessons 4–5',blurb:'Use the number line to see which number is greater, and estimate where a dot is.',steps:[
    {title:'Compare numbers',widget:wCompare,
      body:'<p>The number farther to the <b>right</b> is <b>greater</b>. We write <b>&gt;</b> for “is greater than” and <b>&lt;</b> for “is less than”.</p><p>The open side faces the bigger number. Pick two numbers.</p>',
      check:{kind:'mc',q:'Which is true?',fig:F.cmp,
        choices:[{id:'a',label:'46 > 64'},{id:'b',label:'46 < 64'},{id:'c',label:'46 = 64'}],answer:'b',
        why:{a:'46 is to the left of 64, so 46 is less. The open side faces the bigger number.',c:'They aren’t the same number. 46 is to the left of 64.'},
        explain:'46 is to the left of 64, so 46 is less than 64: 46 < 64. 4 tens is less than 6 tens.'}},
    {title:'Estimate on a number line',widget:wEstimate,
      body:'<p>When there aren’t many tick marks, you can still <b>estimate</b>. Is the dot near 0, near 50 (the middle), or near 100?</p><p>Pick a dot and an estimate. Then show the tens to check.</p>',
      check:{kind:'mc',q:'About what number is the dot at?',fig:F.est,
        choices:[{id:'a',label:'about 25'},{id:'b',label:'about 75'},{id:'c',label:'about 95'}],answer:'b',
        why:{a:'25 is between 0 and 50. The dot is past 50.',c:'95 is very close to 100. The dot is about halfway between 50 and 100.'},
        explain:'The dot is about halfway between 50 and 100, so it’s about 75. (It’s really at 73.)'}}
  ]},
  {icon:'jump',title:'Jumps on the number line',lessons:'Lessons 7–9',blurb:'Add by jumping right and subtract by jumping left, match jumps to equations, and find the difference.',steps:[
    {title:'Jump to add and subtract',widget:wJump,
      body:'<p>To <b>add</b>, start at the first number and jump <b>right</b>. To <b>subtract</b>, jump <b>left</b>.</p><p>Change the start and the jump. Try both ways.</p>',
      check:{kind:'num',answer:41,fig:F.back6,q:'Start at 47. Jump 6 to the left. Where do you land?',
        misc:[[53,'Left means subtract. You jumped right.'],[42,'Count the spaces, not the start: 46, 45, 44, 43, 42, 41.']],
        explain:'Jumping left subtracts. 47 − 6 = 41.'}},
    {title:'Equations and jumps',widget:wEquation,
      body:'<p>An <b>equation</b> tells the story of a jump: where it starts, how far it goes, and where it lands.</p><p>Pick a picture. Tap the equation that matches.</p>',
      check:{kind:'mc',q:'Which equation matches the jump?',fig:F.eq52,
        choices:[{id:'a',label:'52 − 8 = 44'},{id:'b',label:'52 + 8 = 60'},{id:'c',label:'44 − 8 = 36'}],answer:'a',
        why:{b:'The jump goes left, so it’s subtracting.',c:'The jump starts at 52, not 44.'},
        explain:'The jump starts at 52, goes 8 to the left, and lands on 44: 52 − 8 = 44.'}},
    {title:'The difference',widget:wDiff,
      body:'<p>The <b>difference</b> between two numbers is the length between them. Jump from one to the other and add up the jumps.</p><p>Pick two numbers, then jump.</p>',
      check:{kind:'num',answer:7,fig:F.diff,q:'What is the difference between 46 and 53?',
        misc:[[99,'You added. The difference is the space between them.'],[4,'46 to 50 is 4. Keep going to 53.'],[3,'50 to 53 is 3. Don’t forget 46 to 50.'],[13,'53 has only 3 ones. Jump 46 to 50 (4), then 50 to 53 (3).']],
        explain:'46 to 50 is 4. 50 to 53 is 3. 4 + 3 = 7, so the difference is 7.'}}
  ]},
  {icon:'tens',title:'Jump by tens and ones',lessons:'Lessons 10–11',blurb:'Make big jumps of ten, then small jumps of ones, and jump to a ten to make it easy.',steps:[
    {title:'Tens, then ones',widget:jumper(TENS,P=>`${P.label}: start at <b>${P.a}</b>. <span class="dimline">Jump by tens first, then the ones.</span>`),
      body:'<p>To add or subtract a number like 23, jump by <b>tens</b> first: 10, 10. Then jump the <b>ones</b>: 3.</p><p>Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:77,fig:F.tens45,q:'What is 45 + 32? Where do the jumps land?',
        misc:[[75,'Don’t forget the last jump of 2.'],[65,'32 has 3 tens. Count the jumps of 10: 3 of them.'],[50,'Each big jump is 10, not 1.']],
        explain:'45 + 10 = 55, + 10 = 65, + 10 = 75, + 2 = 77. So 45 + 32 = 77.'}},
    {title:'Jump to a ten',widget:jumper(TOTEN,P=>{const up=P.steps[0]>0;return `${P.label}: start at <b>${P.a}</b>.<br><span class="dimline">First jump ${up?'up':'back'} to ${P.a+P.steps[0]}. Then jump the rest.</span>`;}),
      body:'<p>A <b>ten</b> is an easy place to stop. 28 + 7: jump 2 to get to 30, then 5 more. 7 is 2 and 5.</p><p>Pick a problem, then tap to jump.</p>',
      check:{kind:'num',answer:44,fig:F.toTen36,q:'What is 36 + 8?',
        misc:[[48,'You jumped 4 to 40, then 8 more. Only 4 are left to jump: 8 is 4 and 4.'],[28,'Adding means jumping right.'],[43,'Count the spaces: from 40, 4 more is 44.']],
        explain:'36 + 4 = 40. 8 is 4 and 4, so 4 more: 40 + 4 = 44.'}}
  ]},
  {icon:'story',title:'Unknowns and stories',lessons:'Lessons 12–13',blurb:'Find the missing jump in an equation, and show story problems on a number line.',steps:[
    {title:'Find the missing jump',widget:wMissing,
      body:'<p>In <b>27 + ? = 50</b>, you know where to start and where to land. The <b>?</b> is how far you jump.</p><p>Pick an equation. Jump to find the <b>?</b>.</p>',
      check:{kind:'num',answer:22,fig:F.miss38,q:'38 + ? = 60. What is the missing number?',
        misc:[[98,'You added 38 and 60. The ? is the jump from 38 to 60.'],[2,'38 to 40 is 2. Keep jumping to 60.'],[20,'40 to 60 is 20. Don’t forget 38 to 40.'],[32,'Jump to 40 first: that’s 2. Then 20 more to 60.']],
        explain:'38 to 40 is 2. 40 to 60 is 20. 2 + 20 = 22, so 38 + 22 = 60.'}},
    {title:'Story problems',widget:wStories,
      body:'<p>A number line can show a story. Find the <b>start</b>. Jump <b>right</b> if there are more. Jump <b>left</b> if there are fewer.</p><p>Pick a story, then show the jumps.</p>',
      check:{kind:'num',answer:34,fig:F.books,q:'The class library has 43 books. The class gives away 9 books. How many books are left?',
        misc:[[52,'Gave away means fewer books. Jump left.'],[33,'If you jumped back 10, that’s 1 too many. Jump forward 1: 34.'],[36,'43 − 3 = 40. 9 is 3 and 6, so jump 6 more: 40 − 6 = 34.']],
        explain:'43 − 3 = 40. 9 is 3 and 6, so 40 − 6 = 34. There are 34 books left.'}}
  ]}
];
