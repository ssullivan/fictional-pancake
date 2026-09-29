/* Learn Adding and Subtracting within 1,000 (Grade 2 Unit 7), chapter 4: Add three-digit numbers. Its widgets and steps; loaded by add.html. */
const wBoth=addW([[367,258],[178,145],[459,376]]);
const S298=addStages(298,135);
const wAddWays=waysW('298 + 135',433,[
  {label:'Make a hundred',fig:jumps(298,[2,100,30,3]),say:'298 is close to 300. Jump 2 to get to 300. 135 is 2 and 133, so jump 133 more: 100, then 30, then 3.'},
  {label:'By place',fig:byPlace(['200 + 100 = <b>300</b>','90 + 30 = <b>120</b>','8 + 5 = <b>13</b>','300 + 120 + 13 = <b>433</b>']),say:'Add the hundreds, the tens, and the ones. Then add the parts.'},
  {label:'Blocks',fig:stageFig(298,135,S298,S298[S298.length-1]),say:'8 + 5 = 13 ones: make a new ten. 9 + 3 + 1 = 13 tens: make a new hundred. That’s 4 hundreds, 3 tens, and 3 ones.'},
]);
const STEPS=[
    {title:'A new ten and a new hundred',widget:wBoth,
      body:'<p>Some problems need a <b>new ten</b> and a <b>new hundred</b>. Start with the ones. Count the new ten when you add the tens!</p><p>Pick a problem and make each trade.</p>',
      check:{kind:'mc',q:'Which one makes a new ten <b>and</b> a new hundred?',
        choices:[{id:'a',label:'365 + 247'},{id:'b',label:'365 + 224'},{id:'c',label:'365 + 182'}],answer:'a',
        why:{b:'Ones: 5 + 4 = 9. Tens: 6 + 2 = 8. No new ten, and no new hundred.',c:'Ones: 5 + 2 = 7, so no new ten. Tens: 6 + 8 = 14 makes only a new hundred.'},
        explain:'Ones: 5 + 7 = 12, a new ten. Tens: 6 + 4 + the new ten = 11 tens, a new hundred. 365 + 247 = 612.'}},
    {title:'Add your way',widget:wAddWays,
      body:'<p>You can add by place, with blocks, or by making a hundred first. Pick the way that makes it easiest.</p><p>Tap each way for 298 + 135.</p>',
      check:{kind:'num',answer:545,q:'What is 199 + 346? Hint: 199 is 1 away from 200.',
        misc:[[546,'You added 1 to 199 to make 200. Take that 1 from 346: 200 + 345.'],[147,'You subtracted. This is adding.'],[445,'By place: 90 + 40 = 130 and 9 + 6 = 15. Don’t lose the new hundred.']],
        explain:'Move 1 from 346 to 199: 200 + 345 = 545.'}}
  ];
