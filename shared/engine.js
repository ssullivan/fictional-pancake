/* Game engine shared by every game: a home screen of stations (zones), rounds of 8 problems (10 for the boss),
   10 points for a first-try answer and 5 after a miss or a hint, stars saved in localStorage.
   Needs util.js (and speak.js with readAloud). Screens and ids are in the page's HTML (#home, #play, #done); styles are in game.css.

   Game.init({
     saveKey: 'g6u3-save',          localStorage key; unique across the whole site
     zones: [{id, name, lessons, blurb, gen}],   gen() deals one problem; the zone with id 'boss' is the final round
     icons: {zoneId: '<svg markup, 64×64 viewBox>'},
     words: {
       right: 'Nailed it!',         title after a right answer
       miss: 'Not quite. …',        fallback message when a wrong number matches no known mistake
       titles: [0★, 1★, 2★, 3★],    results title for each star count
       next: 'Try the next station, or go for the Final Lap.',   results message at 3 stars
       stuck: 'Use "Show me a hint" when you’re stuck. …',       results message at 0–1 stars
       tap: 'Tap your answer in the picture.',                     note under a tap problem
     },
     readAloud?: true,              a "Read to me" button that reads the problem, its choices, and the feedback (young readers)
     near: (x, y) => boolean,       optional: how close a typed number must be (default ±0.011)
     figure: (p, show) => html,     optional: draw p.fig another way (default p.fig(show, done))
     zoneNote: zone => html,        optional: extra line on a station card
     onQuestion: state => {},       optional: runs before each problem is shown
     onMiss: msg => boolean,        optional: runs after a wrong answer; return true to take over the screen
     onAnswer: (state, ok) => {},   optional: runs when a problem ends, right (ok) or out of tries
   })

   A problem from gen() is {kind, prompt, explain, hint?, fig?} plus, by kind:
     num:  answer, unit, misc?: [[wrong value, message]]
     pair: answer: [x, y], labels: [x label, y label], equiv?: any equivalent ratio counts, pmisc?: [[[x, y], message]]
     mc:   answer: choice id, choices: [{id, label}], why?: {choice id: message}, stack?: one choice per row
     tap:  answer: id of the right .cand element in the figure (data-id), why?: {id: message}
   A 2-choice mc problem gets one try; everything else gets two.
   Links can start a station directly: index.html#<zone id>.

   Also: Game.state (the round in progress), Game.stars(zoneId) (best stars so far), and
   Game.drawFig, Game.finishQ, Game.advance for games that add their own answer modes. */
const Game=(()=>{
  let cfg,save,G=null;
  const near=(x,y)=>(cfg.near||((a,b)=>Math.abs(a-b)<.011))(x,y);
  const sameRatio=(u,v,x,y)=>u>0&&v>0&&near(u*y,v*x);
  const persist=()=>{try{localStorage.setItem(cfg.saveKey,JSON.stringify(save));}catch(e){}};
  const starSvg=on=>`<svg viewBox="0 0 24 24" aria-hidden="true"><polygon class="${on?'star-on':'star-off'}" points="12,2 15,9 22.5,9.3 16.6,14 18.7,21.5 12,17.2 5.3,21.5 7.4,14 1.5,9.3 9,9"/></svg>`;
  const starRow=n=>[0,1,2].map(i=>starSvg(i<n)).join('');

  function show(id){['home','play','done'].forEach(s=>$(s).hidden=s!==id);window.scrollTo(0,0);}
  function renderHome(){
    $('hp').textContent=save.points;
    $('hs').textContent=Object.values(save.stars).reduce((a,b)=>a+b,0);
    $('hsMax').textContent=cfg.zones.length*3;
    $('zones').innerHTML=cfg.zones.map(z=>`
    <button class="zone ${z.id==='boss'?'boss':''}" data-z="${z.id}" type="button">
      <svg class="icon" viewBox="0 0 64 64" aria-hidden="true">${cfg.icons[z.id]}</svg>
      <p class="eyebrow">${z.lessons}</p>
      <h3>${z.name}</h3>
      <p>${z.blurb}</p>${cfg.zoneNote?cfg.zoneNote(z):''}
      <span class="meta"><span class="stars" aria-label="${save.stars[z.id]||0} of 3 stars">${starRow(save.stars[z.id]||0)}</span><span class="go">Play →</span></span>
    </button>`).join('');
  }

  function start(zid){
    const z=cfg.zones.find(q=>q.id===zid);
    G={z,i:0,n:zid==='boss'?10:8,pts:0,streak:0};
    $('zname').textContent=z.name;show('play');nextQ();
  }
  const hush=()=>{if(typeof Say!=='undefined')Say.hush();};
  function advance(){G.i++;nextQ();}
  function nextQ(){
    hush();
    if(G.i>=G.n)return finish();
    G.p=G.z.gen();G.tries=0;G.hinted=false;G.done=false;G.marks={};
    if(cfg.onQuestion)cfg.onQuestion(G);
    renderQ();
  }
  function drawFig(){
    const p=G.p,fig=$('fig');
    fig.hidden=!p.fig;
    if(!p.fig)return;
    const show=G.hinted||G.done;
    fig.innerHTML=cfg.figure?cfg.figure(p,show):p.fig(show,G.done);
    Object.entries(G.marks).forEach(([id,c])=>{const el=fig.querySelector(`.cand[data-id="${id}"]`);if(el)el.classList.add(c);});
  }
  function setStreak(){$('streak').innerHTML=`Streak <b>${G.streak}</b>`;$('streak').classList.toggle('hot',G.streak>=3);}
  function renderQ(){
    const p=G.p;
    $('qnum').textContent=`Problem ${G.i+1} of ${G.n}`;
    $('prompt').innerHTML=p.prompt;
    $('prog').style.width=(G.i/G.n*100)+'%';
    $('pts').textContent=G.pts;setStreak();
    $('hint').hidden=true;$('feedback').innerHTML='';
    drawFig();
    const hintBtn=p.hint?`<button type="button" class="link-btn" id="hintBtn">Show me a hint</button>`:'';
    if(p.kind==='num'||p.kind==='pair'){
      const fields=p.kind==='num'
        ?`<label for="inp" class="sr">Your answer</label><input id="inp" inputmode="decimal" placeholder="?"><span class="unit">${p.unit}</span>`
        :`<span class="pairlab"><input id="inp" class="sm" inputmode="decimal" placeholder="?" aria-label="Number of ${p.labels[0]}"><small>${p.labels[0]}</small></span><span class="colon">:</span><span class="pairlab"><input id="inp2" class="sm" inputmode="decimal" placeholder="?" aria-label="Number of ${p.labels[1]}"><small>${p.labels[1]}</small></span>`;
      $('answer').innerHTML=`<form class="ans" id="af" autocomplete="off">${fields}<button class="btn" id="checkBtn">Check</button></form><div class="tools" style="margin-top:12px">${hintBtn}</div>`;
      $('af').addEventListener('submit',e=>{e.preventDefault();if(G.done)return advance();submit(p.kind==='num'?$('inp').value:[$('inp').value,$('inp2').value]);});
      setTimeout(()=>{const i=$('inp');if(i&&window.matchMedia('(pointer:fine)').matches)i.focus();},30);
    }else if(p.kind==='mc'){
      $('answer').innerHTML=`<div class="choices${p.stack?' stack':''}">${p.choices.map(c=>`<button type="button" class="choice" data-c="${c.id}">${c.label}</button>`).join('')}</div><div class="tools" style="margin-top:12px">${hintBtn}</div>`;
      $('answer').querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{if(!G.done&&!b.disabled)submit(b.dataset.c);}));
    }else{
      $('answer').innerHTML=`<div class="tools"><span class="tapnote">${cfg.words.tap||'Tap your answer in the picture.'}</span>${hintBtn}</div>`;
    }
    const hb=$('hintBtn');if(hb)hb.addEventListener('click',showHint);
  }
  function showHint(){
    if(G.hinted)return;G.hinted=true;
    drawFig();
    $('hint').innerHTML=G.p.hint;$('hint').hidden=false;
    const hb=$('hintBtn');if(hb)hb.disabled=true;
  }
  /* Marks a choice right ('yes') or wrong ('no'): a choice button, or a .cand element in a tap figure. */
  function mark(id,c){
    if(G.p.kind==='tap'){G.marks[id]=c==='yes'?'right':'wrong';return drawFig();}
    const b=$('answer').querySelector(`.choice[data-c="${id}"]`);if(b){b.classList.add(c);if(c==='no')b.disabled=true;}
  }
  function submit(v){
    if(G.done)return;
    const p=G.p;let ok,msg;
    if(p.kind==='num'){
      const n=parseNum(v);
      if(isNaN(n)){$('feedback').innerHTML='<div class="fb info"><p>Type a number first.</p></div>';return;}
      ok=near(n,p.answer);
      if(!ok){const m=(p.misc||[]).find(([x])=>near(n,x));msg=m?m[1]:cfg.words.miss;}
    }else if(p.kind==='pair'){
      const [u,w]=v.map(parseNum);
      if(isNaN(u)||isNaN(w)){$('feedback').innerHTML='<div class="fb info"><p>Fill in both numbers first.</p></div>';return;}
      const [x,y]=p.answer;
      ok=p.equiv?sameRatio(u,w,x,y):(near(u,x)&&near(w,y));
      if(!ok){const m=(p.pmisc||[]).find(([[mx,my]])=>sameRatio(u,w,mx,my));msg=m?m[1]:'Not quite. Count each kind again.';}
    }else{ok=v===p.answer;if(!ok)msg=(p.why&&p.why[v])||'Not quite.';}
    G.tries++;
    if(ok){
      const gain=(G.tries===1&&!G.hinted)?10:5;G.pts+=gain;G.streak++;
      if(p.kind==='mc'||p.kind==='tap')mark(v,'yes');
      return finishQ(true,`${cfg.words.right} +${gain}`,'');
    }
    G.streak=0;setStreak();
    const maxTries=(p.kind==='mc'&&p.choices.length===2)?1:2;
    if(p.kind==='mc'||p.kind==='tap')mark(v,'no');
    if(cfg.onMiss&&cfg.onMiss(msg))return;
    if(G.tries<maxTries){
      $('feedback').innerHTML=`<div class="fb bad"><h4>Not yet</h4><p>${msg}</p><p>Try once more${G.hinted||!p.hint?'':', or tap <b>Show me a hint</b>'}.</p></div>`;
      const i=$('inp');if(i)i.select();
      return;
    }
    if(p.kind==='mc'||p.kind==='tap')mark(p.answer,'yes');
    finishQ(false,'Here’s how it works',msg);
  }
  /* Ends the problem: shows the worked answer and a Next button. */
  function finishQ(ok,title,msg){
    G.done=true;
    if(cfg.onAnswer)cfg.onAnswer(G,ok);
    drawFig();
    $('pts').textContent=G.pts;setStreak();
    $('answer').querySelectorAll('button').forEach(b=>b.disabled=true);
    $('answer').querySelectorAll('input').forEach(i=>i.readOnly=true);
    const last=G.i+1>=G.n;
    $('feedback').innerHTML=`<div class="fb ${ok?'good':'bad'}"><h4>${title}</h4>${msg?`<p>${msg}</p>`:''}<p class="work">${G.p.explain}</p><button type="button" class="btn" id="nextBtn">${last?'See results':'Next problem →'}</button></div>`;
    $('nextBtn').addEventListener('click',advance);
    $('nextBtn').focus({preventScroll:true});
    $('feedback').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function finish(){
    const max=G.n*10,pct=G.pts/max,st=pct>=.9?3:pct>=.7?2:pct>=.5?1:0;
    save.stars[G.z.id]=Math.max(save.stars[G.z.id]||0,st);save.points+=G.pts;persist();
    $('dzone').textContent=G.z.name;
    $('dstars').innerHTML=starRow(st);
    $('dtitle').textContent=cfg.words.titles[st];
    $('dmsg').textContent=`You scored ${G.pts} of ${max} points. `+(st===3?cfg.words.next:st===2?'One more round could get you 3 stars.':cfg.words.stuck);
    show('done');
  }

  function init(c){
    cfg=c;save={stars:{},points:0};
    try{const s=JSON.parse(localStorage.getItem(cfg.saveKey)||'null');if(s&&typeof s==='object')save=Object.assign(save,s);}catch(e){}
    $('zones').addEventListener('click',e=>{const b=e.target.closest('.zone');if(b)start(b.dataset.z);});
    const tap=e=>{const c=e.target.closest('.cand');if(c&&G&&!G.done&&G.p.kind==='tap'&&!c.classList.contains('wrong'))return submit(c.dataset.id),true;};
    $('fig').addEventListener('click',tap);
    $('fig').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&tap(e))e.preventDefault();});
    $('quit').addEventListener('click',()=>{hush();renderHome();show('home');});
    /* read the problem, then its choices, then any hint and feedback; never the picture, which could give the answer away */
    if(cfg.readAloud&&typeof Say!=='undefined'&&Say.ok())$('prompt').before(Say.btn('Read to me',()=>[$('prompt'),...$('answer').querySelectorAll('.choice'),...($('hint').hidden?[]:[$('hint')]),...$('feedback').querySelectorAll('h4,p:not(.work)')]));
    $('again').addEventListener('click',()=>start(G.z.id));
    $('tomap').addEventListener('click',()=>{renderHome();show('home');});
    renderHome();
    const z=location.hash.slice(1);if(cfg.zones.some(q=>q.id===z))start(z);
  }

  return {init,drawFig,finishQ,advance,stars:id=>save.stars[id]||0,get state(){return G;}};
})();
