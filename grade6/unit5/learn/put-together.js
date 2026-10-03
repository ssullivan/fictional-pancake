/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 6: Putting it together. Its widgets and steps; loaded by put-together.html. */
/* the diner's menu: each item's stepper key (k), name [one, many], and price */
const MENU=[{k:'ta',name:['taco','tacos'],c:2.25},{k:'le',name:['lemonade','lemonades'],c:1.4},{k:'co',name:['cookie','cookies'],c:0.75}];
const BILLS=[5,10,20];
/* An order at the diner (a stepper for each item): add it up, then make change from a bill (or find out the money is short). */
function wOrder(el){
  /* the steppers' values: how many of each item, by its key */
  const q=Q(el),values={ta:2,le:1,co:0};let billIndex=1;
  el.innerHTML=`<div class="wrow">${MENU.map(item=>stepper(item.k,`${item.name[1][0].toUpperCase()+item.name[1].slice(1)} (${money(item.c)})`)).join('')}</div>`+seg('Pay with',BILLS.map((bill,i)=>[i,`$${bill} bill`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* rows: [what, cost] for each item ordered */
    const bill=BILLS[billIndex],rows=MENU.filter(item=>values[item.k]).map(item=>[`${values[item.k]} × ${item.name[0]} at ${money(item.c)}`,values[item.k]*item.c]),total=rows.reduce((sum,[,cost])=>sum+cost,0);
    MENU.forEach(item=>q(item.k).textContent=values[item.k]);press(el,billIndex);
    q('f').innerHTML=rows.length?`<table class="rt" aria-label="The order"><tbody>${rows.map(([label,cost])=>`<tr><td>${label}</td><td>${money(cost)}</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${money(total)}</b></td></tr></tbody></table>`:'<p class="note">Nothing ordered yet.</p>';
    q('r').innerHTML=!rows.length?'Add something to the order.'
      :total>bill?`<span class="no">The total is ${money(total)}, more than the $${bill} bill: ${money(total-bill)} short.</span>`
      :`Total: <b>${money(total)}</b>. Change from $${bill}: $${bill}.00 − ${money(total)} = <b>${money(bill-total)}</b>.`;
  };
  steppers(el,values,{ta:[0,4],le:[0,3],co:[0,4]},draw);
  el.addEventListener('click',e=>{const billBtn=e.target.closest('[data-m]');if(billBtn){billIndex=+billBtn.dataset.m;draw();}});
  draw();
}
const STEPS=[
  {title:'Orders and change',widget:wOrder,
    body:'<p>Real problems take a few steps: multiply for more than one of something, add the order, then subtract to make change. Line up the decimal points each time.</p><p>Build an order and pick a bill to pay with.</p>',
    check:{kind:'num',unit:'dollars',answer:1.85,q:'Lin buys 3 tacos at $2.25 each and a lemonade for $1.40, then pays with a $10 bill. How much change does Lin get?',
      misc:[[8.15,'That’s the total. The change is $10.00 − $8.15.'],[6.35,'3 tacos cost 3 × $2.25 = $6.75, not $2.25.']],
      explain:'3 × $2.25 = $6.75. $6.75 + $1.40 = $8.15. $10.00 − $8.15 = $1.85.'}}
];
