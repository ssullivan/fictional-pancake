/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 4: Dividing whole numbers. Its widgets and steps; loaded by divide-whole.html. */
/* partial quotients: take away easy chunks of groups until nothing is left */
const CHUNKS=[[156,12,[10,3]],[384,16,[20,4]],[252,7,[30,6]],[1000,8,[100,25]]];
function wChunks(el){
  const q=Q(el);let p=0,k=0;
  el.innerHTML=seg('Divide',CHUNKS.map(([N,d],i)=>[i,`${N.toLocaleString('en-US')} ÷ ${d}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Take a chunk</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [N,d,cs]=CHUNKS[p];press(el,p);
    let rem=N;const lines=[`${d} ) ${N}`];
    cs.slice(0,k).forEach(c=>{rem-=c*d;lines.push(`  − ${c*d}   <span class="rev">${c} × ${d}</span>`,`    ${rem}`);});
    q('f').innerHTML=`<pre class="vert" role="img" aria-label="Partial quotients for ${N} divided by ${d}">${lines.join('\n')}</pre>`;
    q('go').disabled=k>=cs.length;
    q('r').innerHTML=!k?`How many groups of ${d} are in ${N.toLocaleString('en-US')}? Take away a chunk of groups you can find easily.`
      :k<cs.length?`${cs.slice(0,k).join(' + ')} groups so far, with <b>${rem}</b> left.`
      :`<span class="ok">Nothing left: ${cs.join(' + ')} = <b>${cs.reduce((a,b)=>a+b)} groups</b>, so ${N.toLocaleString('en-US')} ÷ ${d} = ${N/d}.</span>`;
  };
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;k=0;draw();}});
  draw();
}

/* keep dividing past the ones place: what's left becomes tenths, then hundredths */
const PAST=[[7,4],[3,8],[10,4],[9,2],[12,5]];
const PN=['ones','tenths','hundredths','thousandths'],PN1=['one','tenth','hundredth','thousandth'];
const u=(n,k)=>`${n} ${n===1?PN1[k]:PN[k]}`;
function steps(X,n){
  const out=[];let q0=Math.floor(X/n),rem=X-q0*n,pl=0;
  out.push(`${X} ÷ ${n} = ${u(q0,0)}${rem?`, with ${u(rem,0)} left`:''}.`);
  while(rem&&pl<3){pl++;const v=rem*10,qd=Math.floor(v/n);out.push(`${u(rem,pl-1)} = ${u(v,pl)}. ${v} ÷ ${n} = ${u(qd,pl)}${v-qd*n?`, with ${u(v-qd*n,pl)} left`:''}.`);rem=v-qd*n;}
  return out;
}
function wPast(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Divide',PAST.map(([X,n],i)=>[i,`${X} ÷ ${n}`]))+`<p class="readout" data-r></p>`;
  const draw=()=>{
    const [X,n]=PAST[p];press(el,p);
    q('r').innerHTML=steps(X,n).join('<br>')+`<br><b>${X} ÷ ${n} = ${fmt(X/n)}</b>`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Partial quotients',widget:wChunks,
    body:'<p>To divide, take away groups in easy chunks: 10 groups, 20 groups, 100 groups. Keep going until nothing is left, then add up the groups.</p><p>Pick a division and take chunks.</p>',
    check:{kind:'num',unit:'boxes',answer:13,q:'A baker packs 156 cookies into boxes of 12. How many boxes does the baker fill?',
      misc:[[12,'12 boxes hold 144 cookies, and 12 are left: that’s one more box.'],[168,'That’s 156 + 12. Divide: how many 12s fit in 156?'],[1872,'That’s 156 × 12. Divide: how many 12s fit in 156?']],
      explain:'10 boxes hold 120 cookies, leaving 36. 3 more boxes hold 36. 10 + 3 = 13 boxes.'}},
  {title:'Keep going past the ones',widget:wPast,
    body:'<p>When a division leaves something over, you can keep going: turn what’s left into tenths (1 one is 10 tenths) and divide those, then hundredths.</p><p>Pick a division.</p>',
    check:{kind:'num',unit:'dollars',answer:2.4,q:'5 friends share $12 equally. How much does each friend get?',
      misc:[[2,'That leaves $2 not shared. $2 is 20 dimes: 4 more dimes each.'],[2.2,'2 with 2 left over isn’t 2.2. The $2 left is 20 tenths: 20 ÷ 5 = 4 tenths each.'],[60,'That’s $12 × 5. Share it: divide.']],
      explain:'12 ÷ 5 = 2 with 2 left. 2 ones are 20 tenths, and 20 ÷ 5 = 4 tenths. Each friend gets $2.40.'}}
];
