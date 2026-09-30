/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 3: Numbers to 1,000,000. Its widgets and steps; loaded by big-numbers.html. */
/* thousands as small blocks: 10 make a ten-thousand bar, 10 bars a hundred-thousand square, 10 squares a million.
   Level i is drawn as 10 of level i − 1, every other one blue. */
const LEVELS=[{v:1000,name:'one thousand'},{v:10000,name:'ten thousand'},{v:100000,name:'one hundred thousand'},{v:1000000,name:'one million'}];
const blk=(x,y,s,cls)=>`<rect class="hg ${cls}" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
const bar=(x,y,s,cls)=>range(10).map(i=>blk(x+i*s,y,s,cls)).join('');
const sheet=(x,y,s,cls)=>range(10).map(r=>bar(x,y+r*s,s,cls)).join('');
function thousandsFig(i){
  const c=j=>j%2?'b':'a';let o='',w,h;
  if(i===0){o=blk(10,10,60,'a');w=h=80;}
  else if(i===1){o=range(10).map(j=>blk(10+j*30,10,30,c(j))).join('');w=320;h=50;}
  else if(i===2){o=range(10).map(j=>bar(10,10+j*22,22,c(j))).join('');w=240;h=240;}
  else{o=range(10).map(j=>sheet(10+j%5*96,10+Math.floor(j/5)*96,8.8,c(j))).join('');w=490;h=204;}
  return svgWrap(w,h,o,i?`10 groups of ${commas(LEVELS[i-1].v)}: ${commas(LEVELS[i].v)}`:'1 block: 1,000');
}
function wTen(el){
  const q=Q(el);let i=0;
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Make 10 of them</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const L=LEVELS[i];q('go').disabled=i===LEVELS.length-1;
    q('f').innerHTML=thousandsFig(i);
    q('e').innerHTML=i?`10 × ${commas(LEVELS[i-1].v)} = ${commas(L.v)}`:'1,000';
    q('r').innerHTML=!i?`Each block is <b>1,000</b>: one thousand. Make 10 of them.`
      :`<span class="ok">10 ${LEVELS[i-1].name.replace(/^one /,'')}s make <b>${commas(L.v)}</b>: ${L.name}.</span>`
        +`<br><span class="dimline">10 times as many: one more 0.${i<LEVELS.length-1?' Make 10 again.':''}</span>`;
  };
  q('go').onclick=()=>{if(i<LEVELS.length-1)i++;draw();};
  q('clr').onclick=()=>{i=0;draw();};
  draw();
}
/* tap a digit to see what it's worth; the number in words and in expanded form */
const NUMS=[305020,47600,800009,303030];
const expanded=n=>WIDE.filter(e=>digitAt(n,e)).map(e=>commas(digitAt(n,e)*10**e)).join(' + ');
function wPlace(el){
  const q=Q(el);let p=0,e=null;
  el.innerHTML=seg('Number',NUMS.map((v,i)=>[i,commas(v)]))+`<div data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const v=NUMS[p];press(el,p);
    q('c').innerHTML=pvChart([['',v]],-1,{places:WIDE,tap:true});
    if(e!==null)q('c').querySelector(`[data-e="${e}"]`).setAttribute('aria-pressed','true');
    const d=e===null?0:digitAt(v,e);
    q('r').innerHTML=(e===null?'Tap a digit to see what it’s worth.':`The ${d} is in the <b>${PLACE[e].toLowerCase()}</b> place, so it’s worth ${d} ${PL[e][d===1?0:1]}: <b>${commas(d*10**e)}</b>.`)
      +`<br><b>${commas(v)}</b>: ${numWords(v)}.<br><span class="dimline">Expanded: ${expanded(v)}.</span>`;
  };
  el.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-m]');if(b){p=+b.dataset.m;e=null;draw();return;}
    const t=ev.target.closest('[data-e]');if(t){e=+t.dataset.e;draw();}
  });
  draw();
}
const STEPS=[
    {title:'How much is 10,000?',widget:wTen,
      body:'<p>10 hundreds make 1,000. In the same way, <b>10 thousands make 10,000</b>, and 10 ten-thousands make 100,000. Each place is worth 10 times the place to its right.</p><p>Make 10 of them, again and again.</p>',
      check:{kind:'num',unit:'seats',answer:10000,q:'A stadium has 10 sections. Each section has 1,000 seats. How many seats does the stadium have?',
        misc:[[1010,'You added 10. There are 10 groups of 1,000: that’s 10 × 1,000.'],[100000,'That’s 100 thousands. 10 groups of 1,000 is 10 thousands.']],
        explain:'10 thousands is 10,000. The stadium has 10,000 seats.'}},
    {title:'What each digit is worth',widget:wPlace,
      body:'<p>In 305,020, the 3 is in the hundred-thousands place, so it’s worth 300,000. The 5 is worth 5,000 and the 2 is worth 20. Written as a sum, that’s <b>300,000 + 5,000 + 20</b>. The comma sits between the thousands and the hundreds.</p><p>Pick a number. Tap a digit.</p>',
      check:{kind:'mc',q:'A city has 406,500 people. What is the 6 worth?',
        choices:[{id:'a',label:'600'},{id:'b',label:'6,000'},{id:'c',label:'60,000'}],answer:'b',
        why:{a:'Count the places from the right: ones, tens, hundreds, thousands. The 6 is in the thousands place, just left of the comma.',c:'The 6 is just left of the comma, in the thousands place. 60,000 would need the 6 one place farther left.'},
        explain:'406,500 is 4 hundred-thousands, 0 ten-thousands, 6 thousands, and 5 hundreds. The 6 is worth 6,000.'}}
  ];
