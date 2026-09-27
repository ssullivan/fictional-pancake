/* Learn Geometry, Time, and Money (Grade 2 Unit 6): figures, widgets, and the chapters. Loaded by learn.html.
   Flat and solid shapes, equal parts, pattern blocks, clocks, coins, steppers, and choice buttons come from shared/k5.js. */

/* ---------- figures ---------- */
/* a blank picture that says so */
const empty=t=>svgWrap(200,40,`<text class="lbl s" x="100" y="20">${t}</text>`,t);
/* thumbnail buttons (data-m) with a small picture in each */
const thumbs=(label,list)=>`<div class="thumbs" role="group" aria-label="${label}">${list.map(([id,svg])=>`<button type="button" class="thumb" data-m="${id}">${svg}</button>`).join('')}</div>`;

/* ---------- Chapter 1: shapes ---------- */
const GAL=[SHAPES[3][2],SHAPES[4][4],SHAPES[4][5],SHAPES[5][1],SHAPES[6][1],SHAPES[6][2]];
function wSides(el){
  const q=Q(el);let p=0,counted=false;
  el.innerHTML=thumbs('Shape',GAL.map((s,i)=>[i,shapeFig(s,{s:100},`Shape ${i+1}`)]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const s=GAL[p],n=s.length;press(el,p);el.querySelectorAll('.thumb').forEach((b,i)=>b.classList.toggle('cur',i===p));
    q('f').innerHTML=shapeFig(s,{s:200,nums:counted},`Shape ${p+1}`);
    q('go').textContent=counted?'Hide the numbers':'Count the sides';
    q('r').innerHTML=counted?`<b>${n} sides</b> and <b>${n} corners</b>.<br><span class="ok">It’s a <b>${SHAPE_NAME[n]}</b>.</span>`
      :`How many sides? Put your finger on one side and go all the way around.<br><span class="dimline">3 sides: triangle. 4: quadrilateral. 5: pentagon. 6: hexagon.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;counted=false;draw();}});
  q('go').onclick=()=>{counted=!counted;draw();};
  draw();
}
/* a dot grid: tap dots to make corners, and tap the first dot again to close the shape */
const GX=6,GY=5,GS=56,dotAt=i=>[20+i%GX*GS,20+Math.floor(i/GX)*GS];
function wDraw(el){
  const q=Q(el);let goal=3,pts=[],closed=false;
  el.innerHTML=seg('Draw',[3,4,5,6].map(n=>[n,`A ${SHAPE_NAME[n]}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  /* corners: dots where the drawing turns (a dot in the middle of a straight side isn't a corner) */
  const corners=()=>pts.filter((v,j)=>cross(dotAt(pts[(j+pts.length-1)%pts.length]),dotAt(v),dotAt(pts[(j+1)%pts.length]))!==0).length;
  const tangled=()=>{
    const S=pts.map((v,j)=>[dotAt(v),dotAt(pts[(j+1)%pts.length])]),n=S.length;
    return S.some(([a,b],i)=>S.some(([c,d],j)=>j>i+1&&!(i===0&&j===n-1)&&cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0));
  };
  const draw=()=>{
    press(el,goal);
    const P=pts.map(v=>dotAt(v).join(',')).join(' ');
    q('f').innerHTML=svgWrap(40+(GX-1)*GS,40+(GY-1)*GS,(closed?`<polygon class="shp" points="${P}"/>`:pts.length>1?`<polyline class="drawn" points="${P}"/>`:'')
      +range(GX*GY).map(i=>{const [x,y]=dotAt(i);return `<circle class="dotg${!closed&&pts.length>2&&i===pts[0]?' first':''}" cx="${x}" cy="${y}" r="${pts.includes(i)?7:5}"/><circle class="hit" data-i="${i}" cx="${x}" cy="${y}" r="24"/>`;}).join(''),'A grid of dots to draw on');
    const n=closed?corners():0,name=SHAPE_NAME[goal];
    q('r').innerHTML=!closed?(pts.length<3?`Draw a <b>${name}</b>. Tap dots to make its corners.`:`${pts.length} corners so far. Tap the <b>gold dot</b> to close the shape.`)
      :tangled()?'<span class="no">The sides cross each other.</span> Start over and go around the outside.'
      :n<3?'<span class="no">Those dots are all in a line.</span> That’s not a shape. Start over.'
      :n===goal?`<span class="ok">You drew a <b>${name}</b>! It has ${n} sides and ${n} corners.</span><br><span class="dimline">Pick another shape to draw.</span>`
      :`That shape has <b>${n} sides</b> and <b>${n} corners</b>${SHAPE_NAME[n]?`: a ${SHAPE_NAME[n]}`:''}.<br><span class="dimline">A ${name} has ${goal} sides. Start over and try again.</span>`;
  };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-m]');if(b){goal=+b.dataset.m;pts=[];closed=false;draw();return;}
    const d=e.target.closest('[data-i]');if(!d||closed)return;const i=+d.dataset.i;
    if(i===pts[0]&&pts.length>2)closed=true;else if(!pts.includes(i))pts.push(i);
    draw();
  });
  q('clr').onclick=()=>{pts=[];closed=false;draw();};
  draw();
}
const CM=36;
function wSideLen(el){
  const q=Q(el),st={w:5,h:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('w','Long')}${stepper('h','Tall')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {w,h}=st,X=56,Y=42,x2=X+w*CM,y2=Y+h*CM,k=11;q('w').textContent=w;q('h').textContent=h;
    const grid=range(7).map(i=>`<line class="gridl" x1="${X+i*CM}" y1="${Y}" x2="${X+i*CM}" y2="${Y+5*CM}"/>`).join('')+range(6).map(i=>`<line class="gridl" x1="${X}" y1="${Y+i*CM}" x2="${X+6*CM}" y2="${Y+i*CM}"/>`).join('');
    const marks=[[X,Y,1,1],[x2,Y,-1,1],[x2,y2,-1,-1],[X,y2,1,-1]].map(([a,b,u,v])=>`<path class="sqc" d="M${a+u*k},${b}V${b+v*k}H${a}"/>`).join('');
    q('f').innerHTML=svgWrap(X+6*CM+60,Y+5*CM+36,grid+`<rect class="shp" x="${X}" y="${Y}" width="${w*CM}" height="${h*CM}"/>`+marks
      +`<text class="lbl s cy" x="${(X+x2)/2}" y="${Y-16}">${w} cm</text><text class="lbl s cy" x="${(X+x2)/2}" y="${y2+16}">${w} cm</text><text class="lbl s cy en" x="${X-8}" y="${(Y+y2)/2}">${h} cm</text><text class="lbl s cy st" x="${x2+8}" y="${(Y+y2)/2}">${h} cm</text>`,
      `A shape ${w} centimeters long and ${h} centimeters tall on a centimeter grid`);
    q('r').innerHTML=`Sides: <b>${w} cm, ${h} cm, ${w} cm, ${h} cm</b>. 4 square corners.<br>`+(w===h?`<span class="ok">All 4 sides are the same length, and every corner is a square corner. It’s a <b>square</b>!</span>`
      :`<span class="dimline">Sides across from each other match. It’s a <b>rectangle</b>. Can you make all 4 sides the same length?</span>`);
  };
  steppers(el,st,{w:[1,6],h:[1,5]},draw);
  draw();
}
const SOL=[['cube','Cube'],['box','Box'],['pyramid','Pyramid'],['prism','Triangle prism']];
function wSolid(el){
  const q=Q(el);let k='cube',back=false;
  el.innerHTML=seg('Solid shape',SOL)+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const S=SOLIDS[k],svg=solidFig(k,{back,s:130}),seen=(svg.match(/class="sf /g)||[]).length,all=S.faces.reduce((t,[n])=>t+n,0);press(el,k);
    q('f').innerHTML=svg;
    q('go').textContent=back?'Hide the back':'Show the back';
    q('r').innerHTML=`You can see <b>${seen} faces</b> from the front.`+(back?`<br><span class="ok">A ${S.name} has <b>${all} faces</b>: ${S.faces.map(([n,w])=>`${n} ${w}${n>1?'s':''}`).join(' and ')}.</span><br><span class="dimline">The dashed lines are edges on the back.</span>`
      :`<br><span class="dimline">Some faces are on the back and the bottom. How many faces in all?</span>`);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=b.dataset.m;back=false;draw();}});
  q('go').onclick=()=>{back=!back;draw();};
  draw();
}

/* ---------- Chapter 2: halves, thirds, and fourths ---------- */
const FILL=[['triangle',6],['rhombus',3],['trapezoid',2]];
function wBlocks(el){
  const q=Q(el),st={n:1};let p=0;
  el.innerHTML=seg('Blocks',FILL.map(([b],i)=>[i,b[0].toUpperCase()+b.slice(1)+(b==='rhombus'?'es':'s')]))+`<div class="fig" data-f></div><div class="wrow">${stepper('n','Blocks')}</div><p class="readout" data-r></p>`;
  const lim={n:[1,6]};
  const draw=()=>{
    const [b,max]=FILL[p],n=st.n,pl=b==='rhombus'?'rhombuses':b+'s';press(el,p);q('n').textContent=n;
    q('f').innerHTML=pbFig('hexagon',b,{show:n,s:90});
    q('r').innerHTML=n===max?`<span class="ok"><b>${max} ${pl}</b> make a hexagon!</span><br><span class="dimline">Try another kind of block.</span>`
      :`<b>${n} ${n>1?pl:b}</b>. Tap + to fill the hexagon.`;
  };
  steppers(el,st,lim,draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;st.n=1;lim.n[1]=FILL[p][1];draw();}});
  draw();
}
function wShare(el){
  const q=Q(el);let shape='circle',n=2,on=[];
  el.innerHTML=seg('Shape',[['circle','Circle'],['rect','Rectangle']])+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,shape);
    q('c').innerHTML=[2,3,4].map(k=>`<button type="button" class="chip" data-e="${k}" aria-pressed="${k===n}">${PART[k][1][0].toUpperCase()+PART[k][1].slice(1)}</button>`).join('');
    q('f').innerHTML=shareFig(shape,n,'v',{shade:on,tap:true,s:170});
    const k=on.length,w=shape==='rect'?'rectangle':'circle';
    q('r').innerHTML=`${n} equal parts. Each part is <b>1 ${PART[n][0]}</b> of the ${w}.<br>`+(!k?'<span class="dimline">Tap a part to color it in.</span>'
      :k===n?`<span class="ok"><b>${partName(n,n)}</b> make the whole ${w}!</span>`:`<span class="ok"><b>${partName(n,k)}</b> colored in.</span>`);
  };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-m]');if(b){shape=b.dataset.m;on=[];draw();return;}
    const c=e.target.closest('[data-e]');if(c){n=+c.dataset.e;on=[];draw();return;}
    const d=e.target.closest('[data-i]');if(d){const i=+d.dataset.i;on=on.includes(i)?on.filter(j=>j!==i):[...on,i];draw();}
  });
  draw();
}
const CUTS=[['grid','Squares'],['v','Strips'],['diag','Triangles'],['uneq','Uneven']];
function wSameSize(el){
  const q=Q(el);let c='grid';
  el.innerHTML=seg('Cut',CUTS)+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,c);
    q('f').innerHTML=shareFig('square',4,c,{shade:[0,2],s:180});
    q('r').innerHTML=c==='uneq'?'<span class="no">4 pieces, but they are not the same size.</span> These are <b>not</b> fourths.<br><span class="dimline">Fourths have to be equal.</span>'
      :`4 equal pieces: each one is <b>1 fourth</b> of the square.<br><span class="dimline">Try the other cuts. The pieces look different, but each is still 1 fourth of the same square.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){c=b.dataset.m;draw();}});
  draw();
}
function wWhole(el){
  const q=Q(el),st={n:2};let k=0;
  el.innerHTML=`<p class="story">Cut a granola bar into equal pieces. Then eat them one at a time!</p><div class="fig" data-f></div><div class="wrow">${stepper('n','Pieces')}<button type="button" class="btn" data-go>Eat a piece</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=st.n;q('n').textContent=n;q('go').disabled=k>=n;
    q('f').innerHTML=shareFig('rect',n,'v',{shade:range(k),s:120,label:`A granola bar cut into ${n} equal pieces, ${k} eaten`});
    q('r').innerHTML=(k===n?`<span class="ok">You ate the whole thing! <b>${partName(n,n)}</b> make 1 whole bar.</span>`:`Each piece is <b>1 ${PART[n][0]}</b>.${k?` You ate <b>${partName(n,k)}</b>.`:''}`)
      +`<br><span class="dimline">More pieces means smaller pieces. 1 fourth is less than 1 third, and 1 third is less than 1 half.</span>`;
  };
  steppers(el,st,{n:[2,4]},()=>{k=0;draw();});
  q('go').onclick=()=>{k++;draw();};
  draw();
}

/* ---------- Chapter 3: tell time ---------- */
const QTR=[['0',"o’clock"],['15','Quarter past'],['30','Half past'],['45','Quarter till']];
function wQuarters(el){
  const q=Q(el),st={h:3};let m=15;
  el.innerHTML=seg('Minutes',QTR)+`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hour')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const h=st.h,nx=h%12+1;press(el,m);q('h').textContent=h;
    q('f').innerHTML=clockFig(h,m,{shade:m?[m===45?45:0,m===45?60:m]:null});
    const say={0:`${h} o’clock`,15:`quarter past ${h}`,30:`half past ${h}`,45:`quarter till ${nx}`}[m];
    q('r').innerHTML=`<span class="ok"><b>${hm(h,m)}</b> is <b>${say}</b>.</span><br><span class="dimline">`+{
      0:`The long minute hand points straight up to 12. The short hour hand points to ${h}.`,
      15:`The minute hand went a quarter of the way around: 15 minutes past ${h}.`,
      30:`The minute hand went halfway around: 30 minutes. The hour hand is halfway between ${h} and ${nx}.`,
      45:`The minute hand went three quarters of the way around: 45 minutes. One more quarter and it’s ${nx} o’clock.`}[m]+'</span>';
  };
  steppers(el,st,{h:[1,12]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){m=+b.dataset.m;draw();}});
  draw();
}
function wFives(el){
  const q=Q(el),st={h:2,mn:7};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('h','Hour')}${stepper('mn','Minutes')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const {h,mn:f}=st,m=f*5;q('h').textContent=h;q('mn').textContent=m;
    q('f').innerHTML=clockFig(h,m,{fives:true});
    q('r').innerHTML=(f?`The minute hand points to the <b>${f}</b>. Count by 5s: ${range(Math.min(f,4)).map(i=>5*(i+1)).join(', ')}${f>4?`, … <b>${m}</b>`:''} minutes.`
      :'The minute hand points to 12: <b>0 minutes</b>, so it’s o’clock.')
      +`<br>The hour hand ${f?`is past ${h}`:`points to ${h}`}, so the hour is <b>${h}</b>.<br><span class="ok"><b>${hm(h,m)}</b></span>`;
  };
  steppers(el,st,{h:[1,12],mn:[0,11]},draw);
  draw();
}
const DAY=[['Wake up',7,0,1],['School starts',8,30,1],['Lunch',11,45,1],['Soccer practice',4,15,0],['Dinner',6,0,0],['Bedtime',8,0,0],['Sound asleep',2,0,1]];
function wAmPm(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Time of day',DAY.map(([t],i)=>[i,t]))+`<div class="fig" data-f></div><div class="fig" data-d></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [what,h,m,am]=DAY[p],at=(am?h%12:h%12+12)+m/60;press(el,p);
    q('f').innerHTML=clockFig(h,m,{r:90});
    q('d').innerHTML=dayBar(at,`A bar for the whole day, from midnight to noon (a.m.) and noon to midnight (p.m.), with an arrow at ${what.toLowerCase()}`);
    q('r').innerHTML=`${what}: <b>${hm(h,m)} ${am?'a.m.':'p.m.'}</b><br><span class="dimline">`+(am?'<b>a.m.</b> is from midnight to noon: night and morning.':'<b>p.m.</b> is from noon to midnight: afternoon, evening, and night.')+` The clock looks the same at ${hm(h,m)} a.m. and ${hm(h,m)} p.m.</span>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

/* ---------- Chapter 4: coins ---------- */
/* a list of coins from counts {B, q, d, n, p}, the biggest value first */
const coinList=c=>['B','q','d','n','p'].flatMap(k=>Array(c[k]||0).fill(k));
/* stepper keys for coins (a stepper named d would clash with the buttons' data-d) */
const SK={B:'bills',q:'qs',d:'ds',n:'ns',p:'ps'},fromSteps=st=>Object.fromEntries(Object.entries(SK).map(([k,v])=>[k,st[v]||0]));
/* the running total, counting the biggest coins first: "10, 20, 25, 26" */
const countUp=list=>{let t=0;return list.map(k=>t+=COINS[k].v).join(', ');};
function wPND(el){
  const q=Q(el),st={ds:2,ns:1,ps:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('ds','Dimes')}${stepper('ns','Nickels')}${stepper('ps','Pennies')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const list=coinList(fromSteps(st)),t=centsOf(list);Object.keys(st).forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=list.length?moneyFig(list,{vals:true}):empty('No coins yet');
    q('r').innerHTML=t?`Count by 10s, then 5s, then 1s: ${countUp(list)}.<br><span class="ok"><b>${t}¢</b></span>`+(st.ds&&st.ns?'<br><span class="dimline">A dime is smaller than a nickel, but it’s worth more!</span>':'')
      :'A dime is 10¢, a nickel is 5¢, and a penny is 1¢. Add some coins.';
  };
  steppers(el,st,{ds:[0,5],ns:[0,4],ps:[0,5]},draw);
  draw();
}
function wQuarter(el){
  const q=Q(el),st={q:2};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('q','Quarters')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=st.q;q('q').textContent=n;
    q('f').innerHTML=n?moneyFig(coinList({q:n}),{vals:true}):empty('No quarters yet');
    q('r').innerHTML=n===4?'Count by 25s: 25, 50, 75, 100.<br><span class="ok"><b>4 quarters is 100¢. That’s 1 dollar!</b></span>'
      :n?`Count by 25s: ${countUp(coinList({q:n}))}.<br><span class="ok"><b>${n*25}¢</b></span><br><span class="dimline">${4-n} more ${4-n>1?'quarters make':'quarter makes'} a dollar.</span>`
      :'A quarter is worth 25¢. Add some quarters.';
  };
  steppers(el,st,{q:[0,4]},draw);
  draw();
}
function wDollar(el){
  const q=Q(el);let list=[];
  el.innerHTML=`<p class="story">Make a dollar: 100¢. Add coins until you get there.</p><div class="wrow">${['q','d','n','p'].map(k=>`<button type="button" class="ghost-btn" data-add="${k}">+ ${COINS[k].name}</button>`).join('')}<button type="button" class="ghost-btn" data-clr>Start over</button></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=centsOf(list);
    el.querySelectorAll('[data-add]').forEach(b=>{b.disabled=t+COINS[b.dataset.add].v>100||list.length>=20;});
    const sorted=['q','d','n','p'].flatMap(k=>list.filter(c=>c===k));
    q('f').innerHTML=list.length?moneyFig(sorted):empty('No coins yet');
    q('r').innerHTML=t===100?`<span class="ok"><b>You made a dollar!</b> ${countUp(sorted)}. 100¢ = $1.</span><br><span class="dimline">Start over and find another way.</span>`
      :t?`<b>${t}¢</b> so far. <b>${100-t}¢</b> more to make a dollar.`:'Tap a coin to add it.';
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b&&!b.disabled){list.push(b.dataset.add);draw();}});
  q('clr').onclick=()=>{list=[];draw();};
  draw();
}

/* ---------- Chapter 5: money problems ---------- */
function wDollarsCents(el){
  const q=Q(el),st={bills:2,qs:1,ds:1,ps:3};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow">${stepper('bills','Dollar bills')}${stepper('qs','Quarters')}${stepper('ds','Dimes')}${stepper('ps','Pennies')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    const list=coinList(fromSteps(st)),t=centsOf(list),c=t%100,d=st.bills;Object.keys(st).forEach(k=>{q(k).textContent=st[k];});
    q('f').innerHTML=list.length?moneyFig(list,{vals:true}):empty('No money yet');
    q('r').innerHTML=`Dollars: <b>${d}</b>. Cents: ${c?`${countUp(list.filter(k=>k!=='B'))}, so <b>${c}</b>`:'<b>0</b>'}.<br><span class="ok"><b>${d} dollar${d===1?'':'s'} and ${c} cent${c===1?'':'s'}</b>${t?`: ${amt(t)}`:''}</span><br><span class="dimline">Count the dollars. Then count the cents.</span>`;
  };
  steppers(el,st,{bills:[0,5],qs:[0,3],ds:[0,2],ps:[0,4]},draw);
  draw();
}
const SHOP=[['sticker',15],['pencil',30],['eraser',20],['bouncy ball',45],['whistle',35]];
function wShop(el){
  const q=Q(el);let got=[];
  el.innerHTML=`<p class="story">You have <b>$1</b>. That’s 100¢. Tap things to buy them. Tap again to put them back.</p><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const t=got.reduce((s,i)=>s+SHOP[i][1],0);
    q('c').innerHTML=SHOP.map(([n,c],i)=>`<button type="button" class="chip" data-e="${i}" aria-pressed="${got.includes(i)}"${!got.includes(i)&&t+c>100?' disabled':''}>${n}: ${c}¢</button>`).join('');
    q('r').innerHTML=got.length?`You spent ${got.map(i=>SHOP[i][1]).join(' + ')} = <b>${t}¢</b>.<br><span class="ok">100 − ${t} = <b>${100-t}¢</b> left.</span>`+(t===100?'<br><span class="dimline">You spent the whole dollar!</span>':'')
      :'What can you buy with 100¢?';
  };
  el.addEventListener('click',e=>{const c=e.target.closest('[data-e]');if(!c||c.disabled)return;const i=+c.dataset.e;got=got.includes(i)?got.filter(j=>j!==i):[...got,i];draw();});
  draw();
}

/* ---------- chapters ---------- */
const ICON={
  shapes:'<polygon points="8,52 24,14 40,52" fill="rgba(255,201,60,.35)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><polygon points="44,20 58,30 53,48 35,48 30,30" fill="rgba(127,227,255,.3)" stroke="#7fe3ff" stroke-width="3" stroke-linejoin="round"/>',
  parts:'<circle cx="32" cy="32" r="24" fill="rgba(170,205,255,.12)" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32V8A24,24 0 0 1 56,32Z" fill="#ffc93c" stroke="#f3f6fb" stroke-width="3"/><path d="M32,32V56M8,32H32" stroke="#f3f6fb" stroke-width="3"/>',
  clock:'<circle cx="32" cy="32" r="25" fill="#f3f6fb" stroke="#ffc93c" stroke-width="4"/><path d="M32,32L42,40" stroke="#0a2340" stroke-width="5" stroke-linecap="round"/><path d="M32,32V12" stroke="#e0445e" stroke-width="3.5" stroke-linecap="round"/><circle cx="32" cy="32" r="2.5" fill="#0a2340"/>',
  coins:'<circle cx="24" cy="36" r="18" fill="#cdd6e1" stroke="#f3f6fb" stroke-width="2"/><circle cx="24" cy="36" r="14" fill="none" stroke="rgba(10,35,64,.3)"/><circle cx="46" cy="22" r="13" fill="#d9895a" stroke="#f5c6a5" stroke-width="2"/><text x="24" y="40" font-family="monospace" font-weight="700" font-size="11" text-anchor="middle" fill="#0a2340">25¢</text>',
  shop:'<path d="M10,26L28,8H54V34L36,52Z" fill="rgba(255,201,60,.3)" stroke="#ffc93c" stroke-width="3" stroke-linejoin="round"/><circle cx="45" cy="17" r="4" fill="none" stroke="#ffc93c" stroke-width="2.5"/><text x="32" y="36" font-family="monospace" font-weight="700" font-size="13" text-anchor="middle" fill="#f3f6fb" transform="rotate(-45 32 32)">45¢</text>',
};
const CH=[
  {icon:'shapes',title:'Shapes',game:{zone:'shapes',name:'Shape Tent'},lessons:'Lessons 1–4',blurb:'Count sides and corners, draw shapes, look at side lengths and square corners, and count the faces of solid shapes.',steps:[
    {title:'Sides and corners',widget:wSides,
      body:'<p>A shape’s name tells how many <b>sides</b> it has. A <b>triangle</b> has 3. A <b>quadrilateral</b> has 4. A <b>pentagon</b> has 5. A <b>hexagon</b> has 6.</p><p>Shapes can look very different and still have the same name. Pick a shape and count.</p>',
      check:{kind:'num',unit:'sides',answer:6,fig:shapeFig(SHAPES[6][1],{s:150},'A shape shaped like the letter L'),q:'How many sides does this shape have?',
        misc:[[4,'The L shape has short sides too. Count every straight side.'],[5,'Count again. Start at one corner and go all the way around.'],[2,'Count every straight side, all the way around.']],
        explain:'It has 6 sides and 6 corners, so it’s a hexagon, even though it doesn’t look like the other hexagons.'}},
    {title:'Draw shapes',widget:wDraw,
      body:'<p>Each side is a straight line. A <b>corner</b> is where two sides meet. A shape always has the same number of sides and corners.</p><p>Pick a shape. Tap dots to draw it.</p>',
      check:{kind:'num',unit:'sides',answer:5,q:'Lin drew a shape with 5 corners. How many sides does it have?',
        misc:[[4,'A shape has the same number of sides as corners.'],[6,'A shape has the same number of sides as corners.']],
        explain:'Every corner is where two sides meet. 5 corners means 5 sides: a pentagon.'}},
    {title:'Side lengths',widget:wSideLen,
      body:'<p>Some shapes have sides that are the same length. A corner like the corner of a paper is a <b>square corner</b>.</p><p>A <b>square</b> has 4 sides that are all the same length and 4 square corners. Change the sides and see.</p>',
      check:{kind:'mc',q:'Which shape has 4 sides that are all the same length?',fig:shapeRow([[QUADS.rectangle,{lens:['6 cm','3 cm','6 cm','3 cm']}],[QUADS.square,{lens:['4 cm','4 cm','4 cm','4 cm']}],[QUADS.trapezoid,{lens:['3 cm','4 cm','6 cm','4 cm']}]],{letters:true,label:'Shape'}),
        choices:[{id:'a',label:'A'},{id:'b',label:'B'},{id:'c',label:'C'}],answer:'b',
        why:{a:'Shape A has two sides that are 6 cm and two that are 3 cm.',c:'Shape C has sides of 3, 4, 6, and 4 cm. They aren’t all the same.'},
        explain:'Every side of shape B is 4 cm. It’s a square.'}},
    {title:'Solid shapes',widget:wSolid,
      body:'<p>A <b>solid shape</b> isn’t flat. Its flat sides are called <b>faces</b>. A <b>cube</b> has faces that are all squares.</p><p>Some faces hide on the back. Pick a shape and show the back.</p>',
      check:{kind:'num',unit:'faces',answer:6,fig:solidFig('cube',{s:110}),q:'How many faces does a cube have?',
        misc:[[3,'That’s how many you can see. There are more on the back, the bottom, and the left.'],[8,'8 is the number of corners. Count the flat faces.'],[12,'12 is the number of edges. Count the flat faces.'],[4,'Don’t forget the top and the bottom.']],
        explain:'Front and back, top and bottom, left and right: a cube has 6 square faces.'}}
  ]},
  {icon:'parts',title:'Halves, thirds, and fourths',game:{zone:'parts',name:'Pie Stand'},lessons:'Lessons 6–9',blurb:'Build shapes from smaller shapes, cut shapes into equal parts, and see that more parts means smaller parts.',steps:[
    {title:'Build with blocks',widget:wBlocks,
      body:'<p>Small shapes can fill a bigger shape. Pattern blocks can make a <b>hexagon</b> in different ways.</p><p>Pick a block. Fill the hexagon.</p>',
      check:{kind:'num',unit:'triangles',answer:3,fig:pbFig('trapezoid','triangle',{show:0,s:90}),q:'How many triangles make this trapezoid?',
        misc:[[6,'6 triangles make a whole hexagon. The trapezoid is half a hexagon.'],[2,'2 triangles make a rhombus. The trapezoid is bigger.'],[1,'That one triangle only fills part of it. How many fill it all?']],
        explain:'3 triangles fill the trapezoid. 2 trapezoids make a hexagon, and 6 triangles do too.'}},
    {title:'Equal parts',widget:wShare,
      body:'<p>Cut a shape into 2 <b>equal</b> parts: each is a <b>half</b>. 3 equal parts: each is a <b>third</b>. 4 equal parts: each is a <b>fourth</b>, or a quarter.</p><p>Pick a shape and how many parts. Tap parts to color them.</p>',
      check:{kind:'mc',q:'What part of the circle is shaded?',fig:shareFig('circle',3,'v',{shade:[0],s:140}),
        choices:[{id:'a',label:'1 half'},{id:'b',label:'1 fourth'},{id:'c',label:'1 third'}],answer:'c',
        why:{a:'Count all the parts. There are 3 equal parts, not 2.',b:'A fourth is 1 of 4 equal parts. Count the parts.'},
        explain:'The circle has 3 equal parts. 1 of them is shaded: 1 third.'}},
    {title:'Same size, different shape',widget:wSameSize,
      body:'<p>There are lots of ways to cut a square into fourths. The pieces can look different, but they must be the <b>same size</b>.</p><p>Try each cut.</p>',
      check:{kind:'mc',q:'Which picture shows fourths?',
        choices:[{id:'a',label:shareFig('square',4,'uneq',{s:90,label:'Picture A'})},{id:'b',label:shareFig('square',4,'diag',{s:90,label:'Picture B'})},{id:'c',label:shareFig('square',3,'v',{s:90,label:'Picture C'})}],answer:'b',
        why:{a:'That one has 4 pieces, but they are not the same size.',c:'That one has 3 equal pieces. Those are thirds.'},
        explain:'The square cut corner to corner has 4 equal pieces, so each one is a fourth.'}},
    {title:'The whole thing',widget:wWhole,
      body:'<p>2 halves make a whole. 3 thirds make a whole. 4 fourths make a whole.</p><p>The more pieces you cut, the <b>smaller</b> each piece is.</p>',
      check:{kind:'mc',q:'Two pizzas are the same size. One is cut into halves. The other is cut into fourths. Which piece is bigger?',fig:shareRow('circle',[{n:2,shade:[0]},{n:4,shade:[0]}],{label:'Pizza'}),
        choices:[{id:'a',label:'1 half'},{id:'b',label:'1 fourth'},{id:'c',label:'They’re the same'}],answer:'a',
        why:{b:'The pizza cut into fourths has more pieces, so each piece is smaller.',c:'Look at the shaded pieces. Cutting into more pieces makes each piece smaller.'},
        explain:'Halves are bigger than fourths. Fewer pieces means bigger pieces.'}}
  ]},
  {icon:'clock',title:'Tell time',game:{zone:'time',name:'Clock Tower'},lessons:'Lessons 11–13',blurb:'Read half past, quarter past, and quarter till, count by 5s to tell time, and use a.m. and p.m.',steps:[
    {title:'Half past and quarter past',widget:wQuarters,
      body:'<p>The <b>short hand</b> shows the hour. The <b>long hand</b> shows the minutes.</p><p>When the long hand goes halfway around, it’s <b>half past</b>. A quarter of the way around is <b>quarter past</b>. Three quarters around is <b>quarter till</b> the next hour.</p>',
      check:{kind:'mc',q:'What time is it?',fig:clockFig(8,30,{shade:[0,30],r:90}),
        choices:[{id:'a',label:'Half past 9'},{id:'b',label:'Half past 8'},{id:'c',label:'Quarter past 8'}],answer:'b',
        why:{a:'The hour hand is between 8 and 9. It hasn’t gotten to 9 yet.',c:'A quarter is 15 minutes. The shaded part is half the clock.'},
        explain:'The long hand went halfway around: 30 minutes. The short hand is past 8. Half past 8 is 8:30.'}},
    {title:'Count by 5',widget:wFives,
      body:'<p>The minute hand moves 5 minutes from one number to the next. To tell the minutes, <b>count by 5s</b>.</p><p>Change the hour and the minutes.</p>',
      check:{kind:'mc',q:'What time does the clock show?',fig:clockFig(2,40,{r:90}),
        choices:[{id:'a',label:'2:40'},{id:'b',label:'8:10'},{id:'c',label:'2:08'}],answer:'a',
        why:{b:'The short hand shows the hour. The long hand shows the minutes.',c:'The long hand points to the 8. Count by 5s: 8 fives is 40 minutes.'},
        explain:'The short hand is between 2 and 3, so the hour is 2. The long hand points to 8: 5, 10, 15, 20, 25, 30, 35, 40. It’s 2:40.'}},
    {title:'a.m. or p.m.?',widget:wAmPm,
      body:'<p>A clock goes around twice every day. <b>a.m.</b> times are from midnight to noon. <b>p.m.</b> times are from noon to midnight.</p><p>Pick a time of day.</p>',
      check:{kind:'mc',q:'Which time makes sense for eating dinner?',
        choices:[{id:'a',label:'6:00 a.m.'},{id:'b',label:'11:00 p.m.'},{id:'c',label:'6:00 p.m.'}],answer:'c',
        why:{a:'6:00 a.m. is early in the morning, before breakfast.',b:'11:00 p.m. is late at night, when most people are asleep.'},
        explain:'Dinner is in the evening, after noon. 6:00 p.m. makes sense.'}}
  ]},
  {icon:'coins',title:'Coins',game:{zone:'coins',name:'Coin Toss'},lessons:'Lessons 15–17',blurb:'Know pennies, nickels, dimes, and quarters, count coins, and make a dollar.',steps:[
    {title:'Pennies, nickels, and dimes',widget:wPND,
      body:'<p>A <b>penny</b> is 1 cent (1¢). A <b>nickel</b> is 5¢. A <b>dime</b> is 10¢.</p><p>To count coins, start with the ones worth the most. Count by 10s, then 5s, then 1s.</p>',
      check:{kind:'num',unit:'cents',answer:28,fig:moneyFig(coinList({d:2,n:1,p:3})),q:'How much money is this?',
        misc:[[6,'That’s the number of coins. A dime is 10¢, a nickel is 5¢, and a penny is 1¢.'],[18,'A dime is worth 10¢. The nickel is the one worth 5¢.'],[24,'A nickel is worth 5¢, not 1¢.']],
        explain:'Count by 10s, then 5s, then 1s: 10, 20, 25, 26, 27, 28. That’s 28¢.'}},
    {title:'Quarters',widget:wQuarter,
      body:'<p>A <b>quarter</b> is 25¢. It’s the biggest coin here.</p><p>4 quarters make 100¢. That’s 1 dollar. Add quarters and count by 25s.</p>',
      check:{kind:'num',unit:'cents',answer:75,fig:moneyFig(coinList({q:3})),q:'How much money is 3 quarters?',
        misc:[[3,'That’s how many quarters. Each one is worth 25¢.'],[30,'A quarter is 25¢, not 10¢.'],[15,'A quarter is 25¢, not 5¢.'],[50,'Count all 3 quarters: 25, 50, …']],
        explain:'Count by 25s: 25, 50, 75. 3 quarters is 75¢.'}},
    {title:'Make a dollar',widget:wDollar,
      body:'<p>100¢ is the same as <b>1 dollar</b> ($1). There are lots of ways to make a dollar with coins.</p>',
      check:{kind:'num',unit:'cents',answer:30,fig:moneyFig(coinList({q:2,d:2})),q:'How much more money do you need to make a dollar?',
        misc:[[70,'That’s how much is here. How much more to get to 100¢?'],[100,'A dollar is 100¢, but some of it is here already.'],[40,'Count the coins again: 25, 50, 60, 70.']],
        explain:'25, 50, 60, 70. From 70¢, count on by 10s to 100: 80, 90, 100. That’s 30¢ more.'}}
  ]},
  {icon:'shop',title:'Money problems',game:{zone:'shop',name:'Prize Shop'},lessons:'Lessons 18–19',blurb:'Count dollars and cents together, and solve story problems about buying things.',steps:[
    {title:'Dollars and cents',widget:wDollarsCents,
      body:'<p>We count <b>dollars</b> and <b>cents</b> separately. 2 dollar bills and 35¢ is 2 dollars and 35 cents. We write it <b>$2 and 35¢</b>.</p><p>Change the money and count.</p>',
      check:{kind:'mc',q:'How much money is this?',fig:moneyFig(coinList({B:2,q:1,d:1})),
        choices:[{id:'a',label:'37¢'},{id:'b',label:'$2 and 35¢'},{id:'c',label:'$4'}],answer:'b',
        why:{a:'A dollar bill is worth 100¢, not 1¢.',c:'There are 2 dollar bills. The coins are cents, not dollars.'},
        explain:'Dollars: 2. Cents: 25, 35. That’s 2 dollars and 35 cents: $2 and 35¢.'}},
    {title:'Story problems',widget:wShop,
      body:'<p>When you buy something, you spend money, so you have <b>less</b> left. To find what’s left, subtract. To find what two things cost together, add.</p>',
      check:{kind:'num',unit:'cents',answer:35,q:'Mai has 80¢. Mai buys a bouncy ball for 45¢. How much money does Mai have left?',
        misc:[[125,'That’s adding. Mai spends money, so there is less left.'],[45,'That’s the price of the ball. How much is left after paying?'],[80,'That’s what Mai had before buying the ball.']],
        explain:'80 − 45 = 35. Or count up from 45: 55, 65, 75 is 30 more, and 5 more is 80. Mai has 35¢ left.'}}
  ]}
];
