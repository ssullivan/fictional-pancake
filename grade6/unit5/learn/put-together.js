/* Learn Arithmetic in Base Ten (Grade 6 Unit 5), chapter 6: Putting it together. Its widgets and steps; loaded by put-together.html. */
/* an order at the diner: add it up, then make change (or find out the money is short) */
const MENU=[{k:'ta',name:['taco','tacos'],c:2.25},{k:'le',name:['lemonade','lemonades'],c:1.4},{k:'co',name:['cookie','cookies'],c:0.75}];
const BILLS=[5,10,20];
function wOrder(el){
  const q=Q(el),st={ta:2,le:1,co:0};let p=1;
  el.innerHTML=`<div class="wrow">${MENU.map(m=>stepper(m.k,`${m.name[1][0].toUpperCase()+m.name[1].slice(1)} (${money(m.c)})`)).join('')}</div>`+seg('Pay with',BILLS.map((b,i)=>[i,`$${b} bill`]))+`<div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const bill=BILLS[p],rows=MENU.filter(m=>st[m.k]).map(m=>[`${st[m.k]} × ${m.name[0]} at ${money(m.c)}`,st[m.k]*m.c]),total=rows.reduce((t,[,c])=>t+c,0);
    MENU.forEach(m=>q(m.k).textContent=st[m.k]);press(el,p);
    q('f').innerHTML=rows.length?`<table class="rt" aria-label="The order"><tbody>${rows.map(([l,c])=>`<tr><td>${l}</td><td>${money(c)}</td></tr>`).join('')}<tr><td><b>Total</b></td><td><b>${money(total)}</b></td></tr></tbody></table>`:'<p class="note">Nothing ordered yet.</p>';
    q('r').innerHTML=!rows.length?'Add something to the order.'
      :total>bill?`<span class="no">The total is ${money(total)}, more than the $${bill} bill: ${money(total-bill)} short.</span>`
      :`Total: <b>${money(total)}</b>. Change from $${bill}: $${bill}.00 − ${money(total)} = <b>${money(bill-total)}</b>.`;
  };
  steppers(el,st,{ta:[0,4],le:[0,3],co:[0,4]},draw);
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;draw();}});
  draw();
}

const STEPS=[
  {title:'Orders and change',widget:wOrder,
    body:'<p>Real problems take a few steps: multiply for more than one of something, add the order, then subtract to make change. Line up the decimal points each time.</p><p>Build an order and pick a bill to pay with.</p>',
    check:{kind:'num',unit:'dollars',answer:1.85,q:'Lin buys 3 tacos at $2.25 each and a lemonade for $1.40, then pays with a $10 bill. How much change does Lin get?',
      misc:[[8.15,'That’s the total. The change is $10.00 − $8.15.'],[6.35,'3 tacos cost 3 × $2.25 = $6.75, not $2.25.']],
      explain:'3 × $2.25 = $6.75. $6.75 + $1.40 = $8.15. $10.00 − $8.15 = $1.85.'}}
];
