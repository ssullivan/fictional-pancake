/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 6: Part, whole, or percent. Its widgets and steps; loaded by part-whole-percent.html. */
/* the whole from a part: a part that is P% fills P/10 tenths of the tape */
const WHOLE=[[12,30],[18,60],[9,90],[35,70]];
function wWhole(el){
  const q=Q(el);let p=0,shown=false;
  el.innerHTML=seg('Part',WHOLE.map(([a,P],i)=>[i,`${a} is ${P}%`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,P]=WHOLE[p],k=P/10,each=a/k,W=each*10;press(el,p);
    q('f').innerHTML=pctTape(10,k,{W,part:a,qW:!shown,each})(shown);
    q('go').textContent=shown?'Hide the whole':'Find the whole';
    q('r').innerHTML=shown?`${P}% is ${k} tenths. ${a} ÷ ${k} = ${fmt(each)} in each tenth, so the whole is 10 × ${fmt(each)} = <b>${fmt(W)}</b>.`
      :`<b>${a} is ${P}% of what?</b> <span class="dimline">The part fills ${k} of the 10 boxes.</span>`;
  };
  q('go').onclick=()=>{shown=!shown;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;shown=false;draw();}});
  draw();
}

/* the percent a part is: part ÷ whole, as hundredths */
const FIND=[[18,24],[9,36],[14,20],[30,25]];
function wPercent(el){
  const q=Q(el);let p=0;
  el.innerHTML=seg('Part and whole',FIND.map(([a,W],i)=>[i,`${a} of ${W}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,W]=FIND[p],P=a/W*100;press(el,p);
    q('f').innerHTML=pctPoint(W,P,a);
    q('r').innerHTML=`${a} out of ${W}: ${a} ÷ ${W} = ${fmt(a/W)}, so ${a} is <b>${fmt(P)}%</b> of ${W}.`+(P>100?`<br><span class="dimline">The part is more than the whole, so it’s more than 100%.</span>`:'');
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Find the whole',widget:wWhole,
    body:'<p>When you know a part and its percent, work backward. If 12 is 30%, then 12 fills 3 of the 10 tenths, so each tenth is 4 and the whole is 40.</p><p>Pick a part, think it through, then find the whole.</p>',
    check:{kind:'num',unit:'',answer:40,q:'12 is 30% of what number?',
      misc:[[3.6,'That’s 30% of 12. Here 12 is the part, and it’s 30% of the whole.'],[4,'That’s 10%, one tenth. The whole is 10 tenths.'],[42,'That’s 12 + 30. 30% is 3 tenths: 12 ÷ 3 × 10.']],
      explain:'30% is 3 tenths. 12 ÷ 3 = 4 in each tenth, so the whole is 10 × 4 = 40.'}},
  {title:'Find the percent',widget:wPercent,
    body:'<p>To find what percent a part is, divide the part by the whole. 18 out of 24 is 18 ÷ 24 = 0.75, which is 75 hundredths: 75%.</p><p>Pick a part and a whole.</p>',
    check:{kind:'num',unit:'%',answer:75,q:'18 of the 24 students in a class play an instrument. What percent of the class plays one?',
      misc:[[18,'That’s the number of students who play. Compare it with the whole class: 18 ÷ 24.'],[133.33,'That’s 24 ÷ 18, the whole divided by the part. Divide the part by the whole: 18 ÷ 24.'],[25,'That’s the percent who don’t play one.']],
      explain:'18 ÷ 24 = 0.75, so 75% of the class plays an instrument.'}}
];
