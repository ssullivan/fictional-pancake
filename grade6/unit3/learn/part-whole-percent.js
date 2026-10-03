/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 6: Part, whole, or percent. Its widgets and steps; loaded by part-whole-percent.html. */
/* parts and their percents: [part, percent] */
const WHOLE=[[12,30],[18,60],[9,90],[35,70]];
/* The whole from a part: a part that is P% fills P/10 tenths of the tape (a button finds the whole). */
function wWhole(el){
  const q=Q(el);let partIndex=0,shown=false;
  el.innerHTML=seg('Part',WHOLE.map(([part,percent],i)=>[i,`${part} is ${percent}%`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [part,percent]=WHOLE[partIndex],tenths=percent/10,each=part/tenths,whole=each*10;press(el,partIndex);
    q('f').innerHTML=pctTape(10,tenths,{W:whole,part,qW:!shown,each})(shown);
    q('go').textContent=shown?'Hide the whole':'Find the whole';
    q('r').innerHTML=shown?`${percent}% is ${tenths} tenths. ${part} ÷ ${tenths} = ${fmt(each)} in each tenth, so the whole is 10 × ${fmt(each)} = <b>${fmt(whole)}</b>.`
      :`<b>${part} is ${percent}% of what?</b> <span class="dimline">The part fills ${tenths} of the 10 boxes.</span>`;
  };
  q('go').onclick=()=>{shown=!shown;draw();};
  el.addEventListener('click',e=>{const partBtn=e.target.closest('[data-m]');if(partBtn){partIndex=+partBtn.dataset.m;shown=false;draw();}});
  draw();
}

/* parts and wholes: [part, whole] */
const FIND=[[18,24],[9,36],[14,20],[30,25]];
/* The percent a part is: part ÷ whole, as hundredths. */
function wPercent(el){
  const q=Q(el);let pairIndex=0;
  el.innerHTML=seg('Part and whole',FIND.map(([part,whole],i)=>[i,`${part} of ${whole}`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [part,whole]=FIND[pairIndex],percent=part/whole*100;press(el,pairIndex);
    q('f').innerHTML=pctPoint(whole,percent,part);
    q('r').innerHTML=`${part} out of ${whole}: ${part} ÷ ${whole} = ${fmt(part/whole)}, so ${part} is <b>${fmt(percent)}%</b> of ${whole}.`+(percent>100?`<br><span class="dimline">The part is more than the whole, so it’s more than 100%.</span>`:'');
  };
  el.addEventListener('click',e=>{const pairBtn=e.target.closest('[data-m]');if(pairBtn){pairIndex=+pairBtn.dataset.m;draw();}});
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
