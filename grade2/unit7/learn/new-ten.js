/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 3: Make a new ten or hundred. Its widgets and steps; loaded by new-ten.html. */
/* Put the blocks together, making a new ten. */
const wNewTen=addW([[347,125],[268,217],[456,38]]);
/* Add ones and tens (buttons), and trade 10 of them for 1 of the next place. */
function wTradeUp(el){
  /* hundreds, tens, ones: each block's class, as the mat takes them; said: what the last trade did */
  const q=Q(el);let hundreds,tens,ones,said;
  const reset=()=>{hundreds=['a','a'];tens=cellsOf([7,'a']);ones=cellsOf([6,'a']);said='';};
  el.innerHTML=`<div class="fig" data-f></div><div class="wrow"><button type="button" class="ghost-btn" data-po>+ 1 one</button><button type="button" class="ghost-btn" data-pt>+ 1 ten</button><button type="button" class="btn" data-mt>Trade 10 ones for a ten</button><button type="button" class="btn" data-mh>Trade 10 tens for a hundred</button><button type="button" class="ghost-btn" data-clr>Start over</button></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const hundredsCount=hundreds.length,tensCount=tens.length,onesCount=ones.length,n=100*hundredsCount+10*tensCount+onesCount;
    q('f').innerHTML=mat([{h:hundreds,t:tens,o:ones}],`${cnt(hundredsCount,0)}, ${cnt(tensCount,1)}, and ${cnt(onesCount,2)}`,{h:5,t:10,o:10});
    /* adding stops at 10 of a place, and before 999 */
    q('po').disabled=onesCount>=10||n>=999;q('pt').disabled=tensCount>=10||n+10>999;q('mt').disabled=onesCount<10;q('mh').disabled=tensCount<10;
    q('r').innerHTML=`<b>${cnt(hundredsCount,0)}, ${cnt(tensCount,1)}, and ${cnt(onesCount,2)}</b> is ${hundredsCount*100} + ${tensCount*10} + ${onesCount} = <b>${n}</b>.<br>`
      +(onesCount>=10?'<span class="dimline">10 ones! Trade them for 1 ten.</span>':tensCount>=10?'<span class="dimline">10 tens! Trade them for 1 hundred.</span>':said?`<span class="ok">${said}</span>`:'<span class="dimline">Add ones or tens until you have 10.</span>');
  };
  q('po').onclick=()=>{ones=[...ones,'a'];said='';draw();};
  q('pt').onclick=()=>{tens=[...tens,'a'];said='';draw();};
  q('mt').onclick=()=>{ones=ones.slice(10);tens=[...tens,'new'];said='10 ones became 1 ten. Same number, fewer blocks!';draw();};
  q('mh').onclick=()=>{tens=tens.slice(10);hundreds=[...hundreds,'new'];said='10 tens became 1 hundred. Same number, fewer blocks!';draw();};
  q('clr').onclick=()=>{reset();draw();};
  reset();draw();
}
/* Put the blocks together, making a new hundred. */
const wNewHundred=addW([[263,152],[381,145],[574,62]]);
/* the quick checks' figures */
const F={
  cans:apart(238,145),
  m2135:mat([{h:cellsOf([2,'a']),t:cellsOf([13,'a']),o:cellsOf([5,'a'])}],'2 hundreds, 13 tens, and 5 ones'),
  zoo:apart(372,145)
};
const STEPS=[
    {title:'Make a new ten',widget:wNewTen,
      body:'<p>When the ones add up to <b>10 or more</b>, trade 10 ones for a <b>new ten</b>.</p><p>Pick a problem. Put the blocks together, then make a new ten.</p>',
      check:{kind:'num',unit:'cans',answer:383,fig:F.cans,q:'A school food drive got 238 cans on Monday and 145 cans on Tuesday. How many cans is that?',
        misc:[[373,'You didn’t count the new ten. 8 + 5 = 13 ones is 1 ten and 3 ones.'],[3713,'13 ones is 1 ten and 3 ones. Put the new ten with the other tens.'],[93,'You subtracted. The school got more cans, so add.']],
        explain:'Hundreds: 200 + 100 = 300. Tens: 30 + 40 = 70. Ones: 8 + 5 = 13, a new ten and 3 ones. 300 + 70 + 13 = 383 cans.'}},
    {title:'Trade up',widget:wTradeUp,
      body:'<p><b>10 ones</b> make a ten. <b>10 tens</b> make a hundred. Trading changes the blocks, not the number.</p><p>Add ones and tens. Trade when you get 10.</p>',
      check:{kind:'num',answer:335,fig:F.m2135,q:'What number do these blocks show?',
        misc:[[2135,'13 tens is 1 hundred and 3 tens. Trade 10 tens for a hundred.'],[235,'13 tens is 130, not 30. 200 + 130 + 5 = 335.']],
        explain:'2 hundreds, 13 tens, and 5 ones. Trade 10 tens for a hundred: 3 hundreds, 3 tens, and 5 ones. That’s 335.'}},
    {title:'Make a new hundred',widget:wNewHundred,
      body:'<p>When the tens add up to <b>10 or more</b>, trade 10 tens for a <b>new hundred</b>.</p><p>Pick a problem. Put the blocks together, then make a new hundred.</p>',
      check:{kind:'num',unit:'visitors',answer:517,fig:F.zoo,q:'A zoo had 372 visitors in the morning and 145 visitors in the afternoon. How many visitors is that?',
        misc:[[417,'You didn’t count the new hundred. 7 + 4 = 11 tens is 1 hundred and 1 ten.'],[4117,'11 tens is 1 hundred and 1 ten. Put the new hundred with the other hundreds.'],[227,'You subtracted. Put the morning and afternoon visitors together.']],
        explain:'Hundreds: 300 + 100 = 400. Tens: 70 + 40 = 110, a new hundred and 1 ten. Ones: 2 + 5 = 7. 400 + 110 + 7 = 517 visitors.'}}
  ];
