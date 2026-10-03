/* Learn Extending Operations to Fractions (Grade 4 Unit 3), chapter 4: Subtract fractions. Its widgets and steps; loaded by subtract.html. */
/* the denominators to subtract in */
const SD=[4,5,6,8,10];
/* a/d − b/d: shade a parts and cross out the last b (a stepper for each; b stays at most a). */
function wTake(el){
  const q=Q(el),values={a:5,b:2},limits={a:[1,6],b:[0,5]};let d=6;
  el.innerHTML=seg('Parts',SD.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><div class="wrow">${stepper('a','Start with')}${stepper('b','Take away')}</div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    limits.b[1]=values.a;values.b=Math.min(values.b,values.a);
    const {a,b}=values,left=a-b;press(el,d);q('a').textContent=a;q('b').textContent=b;
    q('f').innerHTML=strips([{d,k:a,out:b}],{label:`${a} ${PART[d][a>1?1:0]}, with ${b} crossed out`});
    q('e').innerHTML=`${fr(a,d)} − ${fr(b,d)} = ${fr(left,d)}`;
    q('r').innerHTML=(!b?`Nothing taken away yet: still ${partName(d,a)}.`:`Take ${partName(d,b)} away from ${partName(d,a)}: <b>${partName(d,left)}</b> ${left===1?'is':'are'} left.`+(left?'':' Nothing is left.'))
      +`<br><span class="dimline">Subtract the top numbers: ${a} − ${b} = ${left}. The parts are still ${PART[d][1]}.</span>`;
  };
  steppers(el,values,limits,draw);
  el.addEventListener('click',e=>{const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;limits.a[1]=d;values.a=Math.min(values.a,d);draw();}});
  draw();
}
/* a mixed number minus a fraction, with too few parts to take away: trade 1 whole for d parts first.
   [k, d, t]: k/d take away t/d */
const TRADE=[[9,4,3],[8,6,5],[11,5,3],[19,8,5]];
/* Trade 1 whole for d parts, then take away: a button for each. */
function wTrade(el){
  const q=Q(el);let problemIndex=0,traded=false,taken=false;
  el.innerHTML=seg('Problem',TRADE.map(([k,d,t],i)=>[i,`${mixed(k,d)} − ${fr(t,d)}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-tr>Trade 1 whole</button><button type="button" class="btn" data-tk></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="eq" data-e></p><p class="readout" data-r></p>`;
  const draw=()=>{
    const [k,d,t]=TRADE[problemIndex],wholes=Math.floor(k/d),rest=k%d,whole={d:1,k:1,parts:false};press(el,problemIndex);
    /* after the trade, one whole is cut into d parts beside the rest */
    const rows=traded?[...Array(wholes-1).fill(whole),{d,k:d+rest,out:taken?t:0}]:[...Array(wholes).fill(whole),{d,k:rest}];
    q('f').innerHTML=strips(rows,{wholes:2,label:traded?`${wholes-1} whole${wholes-1===1?'':'s'} and ${d+rest} ${PART[d][1]}`+(taken?`, with ${t} crossed out`:''):`${wholes} wholes and ${partName(d,rest)}`});
    q('tr').disabled=traded;q('tk').disabled=!traded||taken;q('tk').innerHTML=`Take away ${fr(t,d)}`;
    /* the number written after the trade: "1 and 7/4" */
    const afterTrade=`${wholes-1?`${wholes-1} and `:''}${fr(d+rest,d)}`;
    q('e').innerHTML=`${mixed(k,d)} − ${fr(t,d)} = `+(taken?`<b>${mixed(k-t,d)}</b>`:'?');
    q('r').innerHTML=!traded?`There ${rest===1?'is':'are'} only ${partName(d,rest)}: not enough to take away ${partName(d,t)}. Trade 1 whole for ${partName(d,d)}.`
      :!taken?`1 whole is ${fr(d,d)}, so ${mixed(k,d)} is ${afterTrade}. Now there are ${partName(d,d+rest)}: enough to take away ${t}.`
      :`<span class="ok">${afterTrade} − ${fr(t,d)} = `+(wholes-1?`${wholes-1} and ${fr(d+rest-t,d)}, and that’s <b>${mixed(k-t,d)}</b>`:`<b>${fr(d+rest-t,d)}</b>`)+`.</span>`;
  };
  q('tr').onclick=()=>{traded=true;draw();};
  q('tk').onclick=()=>{if(traded)taken=true;draw();};
  q('clr').onclick=()=>{traded=taken=false;draw();};
  el.addEventListener('click',e=>{const problemBtn=e.target.closest('[data-m]');if(problemBtn){problemIndex=+problemBtn.dataset.m;traded=taken=false;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  pizza:strips([{d:8,k:7,out:3}],{label:'A strip in eighths with 7 shaded and 3 of them crossed out'})
};
const STEPS=[
    {title:'Take parts away',widget:wTake,
      body:'<p>To subtract '+fr(2,6)+' from '+fr(5,6)+', take 2 sixths away from 5 sixths. 3 sixths are left: '+fr(5,6)+' − '+fr(2,6)+' = '+fr(3,6)+'. The parts don’t change size, so only the top numbers are subtracted.</p><p>Pick the parts, then change how many to start with and take away.</p>',
      check:{kind:'mc',q:'After lunch, '+fr(7,8)+' of a pizza was left. Then Diego ate '+fr(3,8)+' of the pizza. How much of the pizza is left now?',fig:F.pizza,
        choices:[{id:'a',label:fr(4,8)},{id:'b',label:fr(10,8)},{id:'c',label:fr(3,8)}],answer:'a',
        why:{b:'You added. Diego ate some of the pizza, so take 3 eighths away.',c:'That’s the part Diego ate. How much is left after that?'},
        explain:fr(7,8)+' − '+fr(3,8)+' = '+fr('7 − 3',8)+' = '+fr(4,8)+' of the pizza.'}},
    {title:'Trade a whole for parts',widget:wTrade,
      body:'<p>To find 2 '+fr(1,4)+' − '+fr(3,4)+', you need 3 fourths, but there’s only 1. Trade 1 whole for '+fr(4,4)+': 2 '+fr(1,4)+' is the same as 1 and '+fr(5,4)+'. Now take 3 fourths away: 1 and '+fr(2,4)+' are left.</p><p>Pick a problem. Trade a whole, then take away.</p>',
      check:{kind:'mc',q:'A board is 3 '+fr(1,4)+' feet long. Lin cuts off '+fr(3,4)+' foot. How long is the board now?',
        choices:[{id:'a',label:'3 '+fr(2,4)+' feet'},{id:'b',label:'2 '+fr(2,4)+' feet'},{id:'c',label:'2 '+fr(1,4)+' feet'}],answer:'b',
        why:{a:'You took 1 fourth from 3 fourths, the wrong way around. Lin cut 3 fourths off the board, so the board gets shorter.',c:'That’s taking away 1 whole foot. Lin cut off only '+fr(3,4)+' foot.'},
        explain:'Trade 1 foot for '+fr(4,4)+': 3 '+fr(1,4)+' is 2 and '+fr(5,4)+'. Take away '+fr(3,4)+': 2 and '+fr(2,4)+' is left, so the board is 2 '+fr(2,4)+' feet long.'}}
  ];
