/* Learn Introducing Multiplication (Grade 3 Unit 1), chapter 1: Scaled picture graphs. Its widgets and steps; loaded by picture-graphs.html. */
/* how one row of a picture graph adds up, when each picture shows k */
function rowWhy(r,k,unit){
  const whole=Math.floor(r.n/k),half=r.n%k;
  if(k===1)return `${r.label}: ${pl(whole,'picture')}, and each one shows 1 ${unit}. <b>${pl(r.n,unit)}</b>.`;
  return `${r.label}: ${half?`${whole} and a half pictures`:pl(whole,'picture')}. Each picture shows ${k} ${unit}s${half?`, and half a picture shows ${half}`:''}.`
    +`<br>Count by ${k}s: ${countBy(k,whole)}${half?`, and ${half} more`:''}. <b>${pl(r.n,unit)}</b>.`;
}
/* read a picture graph with each picture showing 1 or 2 */
const FRUIT=[{label:'Apples',n:12,pic:'dot',c:'red'},{label:'Bananas',n:7,pic:'dot',c:'yellow'},{label:'Grapes',n:10,pic:'dot',c:'green'},{label:'Pears',n:4,pic:'dot',c:'blue'}];
function wKey(el){
  const q=Q(el);let k=2,hi=-1;
  el.innerHTML=seg('Each picture shows',[[1,'1 vote'],[2,'2 votes']])+`<div class="fig" data-f></div><p class="readout" data-o></p>`;
  const draw=()=>{
    press(el,k);
    q('f').innerHTML=picGraph(FRUIT,{scale:k,unit:pl(k,'vote'),hi,tap:true,title:'Favorite fruit in Room 9'});
    q('o').innerHTML=hi<0?`Each picture shows <b>${pl(k,'vote')}</b>. Tap a row to count it.`:rowWhy(FRUIT[hi],k,'vote');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]'),t=e.target.closest('[data-r]');if(b){k=+b.dataset.m;draw();}else if(t){hi=+t.dataset.r;draw();}});
  draw();
}
/* make a picture graph from a table: + and − add or take away 5 votes, which is a picture or half a picture */
const TRIP=[{label:'Zoo',n:20,pic:'note',c:'green'},{label:'Museum',n:10,pic:'note',c:'blue'},{label:'Farm',n:15,pic:'note',c:'yellow'}];
const pics=(v,k)=>{const w=Math.floor(v/k);return v%k?(w?`${w}½`:'½'):String(w);};
function wBuild(el){
  const q=Q(el),st={zoo:0,museum:0,farm:0},keys=Object.keys(st);let k=5;
  el.innerHTML=seg('Each picture shows',[[5,'5 votes'],[10,'10 votes']])+`<div class="fig" data-f></div><div class="wrow">${TRIP.map((r,i)=>stepper(keys[i],r.label)).join('')}</div><p class="readout" data-o></p>`;
  const draw=()=>{
    press(el,k);
    const rows=TRIP.map((r,i)=>({...r,n:st[keys[i]]*5})),done=rows.every((r,i)=>r.n===TRIP[i].n);
    keys.forEach(key=>{q(key).textContent=pics(st[key]*5,k);});
    q('f').innerHTML=picGraph(rows,{scale:k,max:30,unit:`${k} votes`,title:'Our class trip vote'});
    q('o').innerHTML=`Each picture shows ${k} votes${k===10?', and half a picture shows 5':''}.<br>`
      +rows.map((r,i)=>{const want=TRIP[i].n;return r.n===want?`${r.label}: ${r.n} ✓`:`${r.label}: ${r.n}. The table says ${want}.`;}).join('<br>')
      +(done?`<br><span class="ok">Your graph matches the table, with ${pics(45,k)} pictures in all.</span>`:'');
  };
  steppers(el,st,{zoo:[0,6],museum:[0,6],farm:[0,6]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){k=+b.dataset.m;draw();}});
  draw();
}
/* the quick checks' figures */
const F={
  recess:picGraph([{label:'Tag',n:8,pic:'note',c:'red'},{label:'Jump rope',n:7,pic:'note',c:'blue'},{label:'Soccer',n:10,pic:'note',c:'green'},{label:'Swings',n:4,pic:'note',c:'yellow'}],{scale:2,unit:'2 students',title:'Favorite recess games'})
};
const STEPS=[
    {title:'Each picture can show more than 1',widget:wKey,
      body:'<p>In a <b>scaled picture graph</b>, each picture can stand for more than 1. The <b>key</b> under the graph tells how many. When each picture shows 2, count by 2s, and half a picture shows 1.</p><p>Switch the key, then tap a row to count it.</p>',
      check:{kind:'num',q:'How many students chose jump rope?',fig:F.recess,answer:7,unit:'students',
        misc:[[4,'That’s the number of pictures. Each picture shows 2 students.'],[6,'Don’t forget the half picture. It shows 1 more.'],[8,'The last picture is only half, so it shows 1, not 2.']],
        explain:'Jump rope has 3 and a half pictures. Count by 2s: 2, 4, 6, and the half picture is 1 more. 7 students.'}},
    {title:'Make a scaled picture graph',widget:wBuild,
      body:'<p>A class voted on a trip: <b>Zoo 20, Museum 10, Farm 15</b>. To make a picture graph, pick a key, then draw enough pictures for each number.</p><p>Use + and − to match the table. Then switch the key and match it again.</p>',
      check:{kind:'num',q:'In a picture graph, each picture shows 10 votes. Soccer got 30 votes. How many pictures go in the soccer row?',answer:3,unit:'pictures',
        misc:[[30,'That’s the number of votes. Each picture shows 10 votes.'],[10,'That’s what one picture shows. How many 10s make 30?'],[6,'That would be right if each picture showed 5 votes.']],
        explain:'Count by 10s: 10, 20, 30. That’s 3 pictures.'}}
  ];
