/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4), chapter 7: Add and subtract. Its widgets and steps; loaded by add-subtract.html. */
/* n of place e: "1 ten", "3 hundreds" */
const pn=(n,e)=>`${n} ${PL[e][n===1?0:1]}`;
/* the text with its first letter capitalized */
const cap=text=>text[0].toUpperCase()+text.slice(1);
/* "becomes" for 1 and "become" for more */
const bec=n=>n===1?'becomes':'become';
/* what one worked column says (html). step: one of algSteps' steps; op: '+' or '−' */
function colSay(step,op){
  const {i,top,bot,cin,val,digit,carry,from}=step,head=`<b>${cap(PL[i][1])}:</b> `;
  if(op==='+')return head+`${top} + ${bot}${cin?' + 1':''} = ${val}.`
    +(carry?` That’s ${pn(1,i+1)} and ${pn(val-10,i)}: write ${digit}, and put the 1 above the ${PL[i+1][1]}.`:` Write ${val}.`);
  if(step.blank)return head+`${top} − ${bot} = 0. A 0 at the front of a number isn’t written.`;
  if(from===null)return head+`${top} − ${bot} = ${val}. Write ${digit}.`;
  /* regrouping: the digit was `was` before it got 10 more; the place regrouped from is now `now`; skipped: the 0 places in between */
  const was=top-10,now=step.marks[0].v,skipped=range(from-i-1).map(k=>PL[i+1+k][1]);
  return head+`${was} is less than ${bot}, so regroup`+(skipped.length?`, but there are no ${skipped.join(' or ')}. Regroup`:'')
    +` 1 ${PL[from][0]}: ${pn(now+1,from)} ${bec(now+1)} ${now}, `+(skipped.length?`the 0 ${skipped.join(' and 0 ')} become 9${skipped.length>1?' each':''}, `:'')
    +`and ${pn(was,i)} ${bec(was)} ${top}. ${top} − ${bot} = ${val}. Write ${digit}.`;
}
/* A widget for the standard algorithm, one column at a time. PROBS: [[a, b], …]; op: '+' or '−'. */
const wAlg=(PROBS,op)=>el=>{
  /* columns: how many columns are worked so far */
  const q=Q(el);let problemIndex=0,columns=0;
  el.innerHTML=seg('Problem',PROBS.map(([a,b],i)=>[i,`${commas(a)} ${op} ${commas(b)}`]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go>Next column</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=PROBS[problemIndex],steps=algSteps(a,b,op),done=columns===steps.length;press(el,problemIndex);q('go').disabled=done;
    q('f').innerHTML=algFig(a,b,op,columns);
    q('r').innerHTML=(columns?colSay(steps[columns-1],op):'Line up the places. Start with the ones, on the right.')
      +(done?`<br><span class="ok">${commas(a)} ${op} ${commas(b)} = <b>${commas(op==='+'?a+b:a-b)}</b>.</span>`:columns?`<br><span class="dimline">Next: the ${PL[steps[columns].i][1]}.</span>`:'');
  };
  q('go').onclick=()=>{if(columns<algSteps(...PROBS[problemIndex],op).length)columns++;draw();};
  q('clr').onclick=()=>{columns=0;draw();};
  el.addEventListener('click',e=>{const problemBtn=e.target.closest('[data-m]');if(problemBtn){problemIndex=+problemBtn.dataset.m;columns=0;draw();}});
  draw();
};
const STEPS=[
    {title:'Add in columns',widget:wAlg([[4625,2318],[36450,21380],[125700,48200]],'+'),
      body:'<p>The <b>standard algorithm</b> adds one place at a time, starting with the ones. When a place adds up to 10 or more, 10 of that unit make 1 of the next: <b>regroup</b> it, and write a small 1 above the next place.</p><p>Pick a problem. Work it one column at a time.</p>',
      check:{kind:'num',unit:'people',answer:35950,q:'Oak Hill has 12,450 people. Pine Lake has 23,500. How many people live in the two towns?',
        misc:[[11050,'You subtracted. The people in both towns together means add.'],[35850,'Check the hundreds: 4 + 5 = 9.']],
        explain:'12,450 + 23,500: ones 0 + 0 = 0, tens 5 + 0 = 5, hundreds 4 + 5 = 9, thousands 2 + 3 = 5, ten-thousands 1 + 2 = 3. That’s 35,950 people.'}},
    {title:'Subtract in columns',widget:wAlg([[5462,2138],[47315,12160],[83400,51600]],'−'),
      body:'<p>Subtract one place at a time too, starting with the ones. When the top digit is too small, <b>regroup</b>: take 1 from the next place to the left, and it becomes 10 in this place.</p><p>Pick a problem. Work it one column at a time.</p>',
      check:{kind:'num',unit:'feet',answer:8110,q:'A mountain trail climbs 14,260 feet. Hikers have climbed 6,150 feet so far. How many feet are left to climb?',
        misc:[[20410,'You added. How many are left means subtract.'],[12110,'In the thousands, 4 is less than 6, so regroup 1 ten-thousand: 14 − 6 = 8. You did 6 − 4.']],
        explain:'Ones 0 − 0 = 0, tens 6 − 5 = 1, hundreds 2 − 1 = 1. In the thousands, 4 is less than 6: regroup 1 ten-thousand to make 14 thousands, and 14 − 6 = 8. That leaves 8,110 feet.'}},
    {title:'Subtract across zeros',widget:wAlg([[5000,1250],[40000,12500],[10000,3600]],'−'),
      body:'<p>To take 5 tens from 5,000, you need tens, but there are none, and no hundreds either. Take 1 thousand: it becomes 10 hundreds. Take 1 of those hundreds: it becomes 10 tens. So 5,000 is 4 thousands, 9 hundreds, and 10 tens.</p><p>Pick a problem. Work it one column at a time.</p>',
      check:{kind:'num',unit:'rolls',answer:1550,q:'A bakery made 3,000 rolls this month and sold 1,450. How many rolls are left?',
        misc:[[2450,'In each column you took the smaller digit from the bigger one. 0 tens can’t give 5: regroup from the thousands first.'],[4450,'You added. How many are left means subtract.']],
        explain:'3,000 is 2 thousands, 9 hundreds, and 10 tens. Tens: 10 − 5 = 5. Hundreds: 9 − 4 = 5. Thousands: 2 − 1 = 1. That leaves 1,550 rolls.'}}
  ];
