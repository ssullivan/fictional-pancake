/* Learn Fraction Equivalence and Comparison (Grade 4 Unit 2), chapter 3: Fractions on number lines. Its widgets and steps; loaded by number-lines.html. */
/* the denominators to choose from */
const LD=[2,3,4,6,8];
/* A number line from 0 to 2 in d parts: tap a tick to name its fraction. */
function wPoint(el){
  /* k: the tick tapped, in parts from 0 (null before one is) */
  const q=Q(el);let d=4,k=null;
  el.innerHTML=seg('Equal parts',LD.map(v=>[v,PART[v][1]]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,d);
    q('f').innerHTML=fracLine([{d,tap:true,hops:k||0,pts:k===null?[]:[{k}]}],{wholes:2,label:`Number line from 0 to 2 in ${PART[d][1]}`+(k===null?'':`, with a point at ${k}/${d}`)});
    const wholes=Math.floor(k/d),rest=k%d;
    q('r').innerHTML=k===null?`Each whole is cut into ${d} equal parts, so each jump is ${fr(1,d)}. Tap a tick mark.`
      :!k?`That’s 0: no jumps yet.`
      :`This point is <b>${fr(k,d)}</b>: ${k} jump${k>1?'s':''} of ${fr(1,d)} from 0.<br>`+(k<d?'It’s less than 1.':!rest?`<span class="ok">${fr(k,d)} = ${wholes}.</span>`:`<span class="ok">It’s more than 1: ${wholes} and ${fr(rest,d)}.</span>`);
  };
  el.addEventListener('click',e=>{
    const denBtn=e.target.closest('[data-m]');if(denBtn){d=+denBtn.dataset.m;k=null;draw();return;}
    const tick=e.target.closest('[data-v]');if(tick){k=+tick.dataset.v;draw();}
  });
  draw();
}
/* fractions to place against the benchmarks 0, 1/2, and 1 */
const BENCH=[[1,4],[3,8],[5,8],[4,6],[5,6],[7,10]];
/* How close a fraction is to 0, 1/2, and 1, on a number line with 1/2 marked. */
function wBench(el){
  const q=Q(el);let fracIndex=0;
  el.innerHTML=seg('Fraction',BENCH.map((f,i)=>[i,frA(f)]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* distances: [benchmark, distance from it in d parts]; closest: the benchmarks at the least distance */
    const [n,d]=BENCH[fracIndex],half=d/2,distances=[[0,n],[1/2,Math.abs(n-half)],[1,d-n]],least=Math.min(...distances.map(x=>x[1])),
      closest=distances.filter(x=>x[1]===least).map(x=>x[0]);press(el,fracIndex);
    const name=v=>v===1/2?fr(1,2):v;
    q('f').innerHTML=fracLine([{d,pts:[{k:n}]}],{marks:[{v:1/2,t:[1,2]}],label:`Number line from 0 to 1 in ${PART[d][1]}, with 1/2 marked and a point at ${n}/${d}`});
    q('r').innerHTML=`${halfWhy([n,d])}.<br>`
      +(closest.length>1?`It’s halfway between ${name(closest[0])} and ${name(closest[1])}: ${fr(least,d)} from each.`
        :`<span class="ok">It’s closest to <b>${name(closest[0])}</b>: just ${fr(least,d)} away.</span>`)
      +`<br><span class="dimline">Distance to 0: ${fr(n,d)}. To ${fr(1,2)}: ${fr(Math.abs(n-half),d)}. To 1: ${fr(d-n,d)}.</span>`;
  };
  el.addEventListener('click',e=>{const fracBtn=e.target.closest('[data-m]');if(fracBtn){fracIndex=+fracBtn.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  trail:fracLine([{d:8,pts:[{k:3}]}],{label:'A number line from 0 to 1 cut into 8 equal parts, with a point at the third tick after 0'})
};
const STEPS=[
    {title:'Name the point',widget:wPoint,
      body:'<p>On a number line, the space from 0 to 1 is 1 whole. Cut it into 4 equal parts and each jump is '+fr(1,4)+'. A point 3 jumps from 0 is at '+fr(3,4)+'. Past 1, keep counting: 5 jumps is '+fr(5,4)+'.</p><p>Pick the parts, then tap a tick mark.</p>',
      check:{kind:'mc',q:'The number line is a trail 1 mile long. Andre stopped at the dot. How far along the trail is Andre?',fig:F.trail,
        choices:[{id:'a',label:fr(4,8)+' mile'},{id:'b',label:fr(3,8)+' mile'},{id:'c',label:fr(3,9)+' mile'}],answer:'b',
        why:{a:'You counted the tick marks, starting with the one at 0. Count the jumps from 0 instead.',c:'There are 9 tick marks, but 8 equal parts from 0 to 1. The parts are eighths.'},
        explain:'From 0 to 1 is cut into 8 equal parts, so each jump is '+fr(1,8)+' mile. The dot is 3 jumps from 0: '+fr(3,8)+' mile.'}},
    {title:'Close to 0, 1/2, or 1',widget:wBench,
      body:'<p>0, '+fr(1,2)+', and 1 are <b>benchmarks</b>: numbers that are easy to find. To tell if a fraction is more or less than '+fr(1,2)+', ask: is the top number more or less than half of the bottom number?</p><p>Pick a fraction. Which benchmark is it closest to?</p>',
      check:{kind:'mc',q:'Which of these fills a measuring cup less than '+fr(1,2)+' full?',
        choices:[{id:'a',label:fr(5,8)+' cup'},{id:'b',label:fr(4,6)+' cup'},{id:'c',label:fr(3,8)+' cup'}],answer:'c',
        why:{a:fr(1,2)+' is '+fr(4,8)+', and 5 eighths is more than 4 eighths.',b:fr(1,2)+' is '+fr(3,6)+', and 4 sixths is more than 3 sixths.'},
        explain:fr(1,2)+' is '+fr(4,8)+'. 3 is less than half of 8, so '+fr(3,8)+' is less than '+fr(1,2)+'.'}}
  ];
