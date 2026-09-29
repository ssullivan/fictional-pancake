/* Learn Unit Rates and Percentages (Grade 6 Unit 3), chapter 5: Benchmark percents. Its widgets and steps; loaded by benchmarks.html. */
/* benchmark percents as fractions, and how to find them */
const BENCH={10:['1/10',v=>`${money(v)} ÷ 10`,v=>v/10],25:['1/4',v=>`${money(v)} ÷ 4`,v=>v/4],50:['1/2',v=>`${money(v)} ÷ 2`,v=>v/2],75:['3/4',v=>`${money(v)} ÷ 4 × 3`,v=>v/4*3]};
const PRICES=[{what:'jacket',v:40},{what:'book',v:12},{what:'pair of shoes',v:80},{what:'bike',v:200}];
/* a price seg (data-m) and a row of percent chips (data-p) */
function benchWidget(el,percents,read){
  const q=Q(el);let p=0,P=percents[1];
  el.innerHTML=seg('Price',PRICES.map((x,i)=>[i,`${x.what} ${money(x.v)}`]))+`<div class="chips" role="group" aria-label="Percent">${percents.map(v=>`<button type="button" class="chip" data-p="${v}">${v}%</button>`).join('')}</div><p class="readout" data-r></p>`;
  const draw=()=>{
    press(el,p);el.querySelectorAll('[data-p]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.p===P));
    q('r').innerHTML=read(PRICES[p],P);
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();return;}const c=e.target.closest('[data-p]');if(c){P=+c.dataset.p;draw();}});
  draw();
}
const wBench=el=>benchWidget(el,[10,25,50,75],({what,v},P)=>{const [f,how,of]=BENCH[P];
  return `${P}% is ${f}, so ${P}% of ${money(v)} is ${how(v)} = <b>${money(of(v))}</b>.`;});
const wSale=el=>benchWidget(el,[10,25,50],({what,v},P)=>{const d=BENCH[P][2](v);
  return `Discount: ${P}% of ${money(v)} is <b>${money(d)}</b>.<br>Sale price: ${money(v)} − ${money(d)} = <b>${money(v-d)}</b>, which is ${100-P}% of the price.`;});

const STEPS=[
  {title:'10%, 25%, 50%, and 75%',widget:wBench,
    body:'<p>Some percents are easy fractions: 10% is 1/10, 25% is 1/4, 50% is 1/2, and 75% is 3/4. Use them to find a percent in your head.</p><p>Pick a price and a percent.</p>',
    check:{kind:'num',unit:'dollars',answer:10,q:'A $40 jacket is 25% off. How many dollars is the discount?',
      misc:[[30,'That’s the price after the discount. The discount is the part taken off: 25% of $40.'],[15,'That’s $40 − 25. 25% is a quarter: $40 ÷ 4.'],[1.6,'That’s $40 ÷ 25. 25% is 1/4, so divide by 4.']],
      explain:'25% is 1/4, and $40 ÷ 4 = $10.'}},
  {title:'Sale prices',widget:wSale,
    body:'<p>A <b>discount</b> is a percent taken off the price. Find the discount, then subtract it. Or notice that 25% off leaves 75% of the price.</p><p>Pick a price and a discount.</p>',
    check:{kind:'num',unit:'dollars',answer:60,q:'Shoes cost $80. They are 25% off. What is the sale price?',
      misc:[[20,'That’s the discount. Take it off the $80.'],[55,'That’s $80 − 25. Take off 25% of $80, which is $20.'],[100,'That adds 25%. A discount takes it off.']],
      explain:'25% of $80 is $20. $80 − $20 = $60.'}}
];
