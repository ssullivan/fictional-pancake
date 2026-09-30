/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 6: Round. Its widgets and steps; loaded by round.html. */
const TO=[1000,10000,100000];
const roundTo=(n,P)=>Math.floor(n/P+.5)*P;
const nearest=P=>`the nearest ${P===1000?'thousand':P===10000?'ten thousand':'hundred thousand'}`;
/* n on a number line from the multiple of P below it to the one above, with the halfway point */
function roundLine(n,P,label){
  const L=Math.floor(n/P)*P,s=P/10;
  return numLine(0,10,{u:36,step:1,big:5,pad:36,fmt:v=>commas(L+v*s),pts:[{v:(n-L)/s,t:commas(n)}],label:label||`Number line from ${commas(L)} to ${commas(L+P)}, with ${commas(L+P/2)} halfway and a point at ${commas(n)}`});
}
/* how n rounds to the nearest P */
function roundWhy(n,P){
  const L=Math.floor(n/P)*P,H=L+P/2,r=roundTo(n,P);
  if(n===L)return `${commas(n)} is already a multiple of ${commas(P)}. Rounded to ${nearest(P)}, it stays <b>${commas(n)}</b>.`;
  return `${commas(n)} is between ${commas(L)} and ${commas(L+P)}. Halfway is ${commas(H)}. `
    +(n===H?`${commas(n)} is exactly halfway, and then we round up`:`${commas(n)} is ${n<H?'less':'more'} than ${commas(H)}, so it’s closer to ${commas(r)}`)
    +`.<br><span class="ok">Rounded to ${nearest(P)}: <b>${commas(r)}</b>.</span>`;
}
/* pick a number and a place to round to */
const RN=[7380,46500,182900,725300];
function wRound(el){
  const q=Q(el);let p=1,P=1000;
  el.innerHTML=`<div data-top>${seg('Number',RN.map((v,i)=>[i,commas(v)]))}</div><div data-bot>${seg('Round to',TO.map(v=>[v,`Nearest ${commas(v)}`]))}</div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const n=RN[p];press(Q(el)('top'),p);press(Q(el)('bot'),P);
    q('bot').querySelectorAll('[data-m]').forEach(b=>{b.disabled=+b.dataset.m>n;});
    q('f').innerHTML=roundLine(n,P);
    q('r').innerHTML=roundWhy(n,P);
  };
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top'){p=+h[1];if(P>RN[p])P=1000;}else P=+h[1];draw();});
  draw();
}
/* estimate a sum or difference by rounding first */
const EST=[[38950,'+',21200],[62100,'−',29800],[405000,'+',289000]];
function wEstimate(el){
  const q=Q(el);let p=0,P=1000,exact=false;
  el.innerHTML=`<div data-top>${seg('Problem',EST.map(([a,op,b],i)=>[i,`${commas(a)} ${op} ${commas(b)}`]))}</div><div data-bot>${seg('Round to',TO.slice(0,2).map(v=>[v,`Nearest ${commas(v)}`]))}</div><p class="eq" data-e></p><div class="wrow"><button type="button" class="btn" data-go>Find the exact answer</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,op,b]=EST[p],ra=roundTo(a,P),rb=roundTo(b,P),est=op==='+'?ra+rb:ra-rb,ex=op==='+'?a+b:a-b;press(q('top'),p);press(q('bot'),P);q('go').disabled=exact;
    q('e').innerHTML=`${commas(ra)} ${op} ${commas(rb)} = ${commas(est)}`;
    q('r').innerHTML=`${commas(a)} is about ${commas(ra)}, and ${commas(b)} is about ${commas(rb)}. So ${commas(a)} ${op} ${commas(b)} is about <b>${commas(est)}</b>.`
      +(exact?`<br><span class="ok">Exact: ${commas(a)} ${op} ${commas(b)} = ${commas(ex)}. The estimate is ${est===ex?'exactly right':`off by ${commas(Math.abs(ex-est))}`}.</span>`:'<br><span class="dimline">Rounded numbers are easy to add or subtract in your head.</span>');
  };
  q('go').onclick=()=>{exact=true;draw();};
  el.addEventListener('click',e=>{const h=segHit(e,['top','bot']);if(!h)return;if(h[0]==='top')p=+h[1];else P=+h[1];exact=false;draw();});
  draw();
}
/* the quick checks' figures */
const F={
  game:roundLine(46700,1000,'Number line from 46,000 to 47,000, with 46,500 halfway and a point at 46,700')
};
const STEPS=[
    {title:'The nearest thousand, ten thousand, or hundred thousand',widget:wRound,
      body:'<p>To <b>round</b> a number, find the two multiples it’s between, and pick the closer one. 7,380 is between 7,000 and 8,000. It’s less than halfway, 7,500, so it rounds to 7,000. A number exactly halfway rounds up.</p><p>Pick a number and a place to round to.</p>',
      check:{kind:'mc',q:'46,700 people went to a baseball game. What is 46,700 rounded to the nearest thousand?',fig:F.game,
        choices:[{id:'a',label:'46,000'},{id:'b',label:'50,000'},{id:'c',label:'47,000'}],answer:'c',
        why:{a:'46,700 is past the halfway point, 46,500, so it’s closer to 47,000.',b:'50,000 is 46,700 rounded to the nearest ten thousand. The nearest thousand is 46,000 or 47,000.'},
        explain:'46,700 is between 46,000 and 47,000. It’s more than halfway, 46,500, so it rounds to 47,000.'}},
    {title:'Estimate with rounded numbers',widget:wEstimate,
      body:'<p>To <b>estimate</b>, round the numbers first, then add or subtract the rounded ones in your head. 38,950 + 21,200 is about 39,000 + 21,000, which is 60,000. An estimate also helps you check an exact answer.</p><p>Pick a problem and a place to round to.</p>',
      check:{kind:'mc',q:'A zoo had 24,800 visitors in May and 31,100 in June. Round each to the nearest thousand. About how many visitors came in the two months?',
        choices:[{id:'a',label:'About 56,000'},{id:'b',label:'About 55,000'},{id:'c',label:'About 55,900'}],answer:'a',
        why:{b:'24,800 is closer to 25,000 than to 24,000: it’s past 24,500.',c:'That’s the exact total. Round first: 25,000 + 31,000.'},
        explain:'24,800 rounds to 25,000 and 31,100 rounds to 31,000. 25,000 + 31,000 = 56,000.'}}
  ];
