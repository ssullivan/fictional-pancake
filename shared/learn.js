/* Learn pages. A unit's Learn page (learn.html) lists its chapters, and each chapter is a page of its own (learn/<id>.html) with
   steps: one idea each, something to move, and a quick check (#s2 is step 2, #done the end of the chapter). Progress for the whole
   unit is saved in localStorage. Needs util.js (and speak.js with readAloud). Styles are in learn.css.

   The unit is described once, in learn/chapters.js, which its Learn page and every chapter page load:
   const UNIT={
     saveKey: 'g6u1-learn',       localStorage key; unique across the whole site
     game?: 'Blueprint Builders', the unit's game (index.html next to learn.html), if it has one
     readAloud?: true,            a "Read to me" button on each step and quick check (browser speech; for young readers)
     icons: {iconId: '<svg markup, 64×64 viewBox>'},
     legacy?: ['area', …],        chapter ids in their order when the unit was one page (learn.html#c2s1), so progress saved
                                  then, and old links, still find their chapter; leave it off for new units
     chapters: [{
       id, icon, title, lessons, blurb,   id names the chapter's page: learn/<id>.html and its script learn/<id>.js
       steps: 3,                  how many steps it has (tools/check.mjs checks this against the page)
       game?: {zone, name},       the game zone to practice in at the end of the chapter (../#zone)
     }]
   };
   Learn.home(UNIT)                  on learn.html: fills #chapters with a card for each chapter and its progress
   Learn.chapter(UNIT, id, steps)    on learn/<id>.html: draws the chapter, where steps are [{
       title, body,             body is HTML
       widget?: el => cleanup?, draws into el; may return a function that runs when the step is left
       check?: {kind: 'num', q, answer, unit?, misc?: [[wrong value, message]], explain, fig?, frac?}   frac: the answer may be a
                                fraction or mixed number (a keyboard with / and space on phones, instead of the decimal keypad)
             | {kind: 'mc', q, answer, choices: [{id, label}], why: {id: message}, explain, fig?, stack?}
   }]
   Next unlocks once a step's quick check is answered (steps without a check unlock right away). */
const Learn=(()=>{
  let cfg,chapters,save,totalSteps,cleanupWidget=null;
  /* ---------- read aloud (shared/speak.js) ---------- */
  const hasSay=typeof Say!=='undefined';
  const canSpeak=()=>cfg.readAloud&&hasSay&&Say.ok();
  const hush=()=>{if(hasSay)Say.hush();},sayBtn=(label,els)=>Say.btn(label,els);

  /* ---------- quick checks ---------- */
  /* is a typed number close enough to the answer? */
  const near=(a,b)=>Math.abs(a-b)<.011;
  /* Draws a quick check (see check? in the header) into el; onDone runs once it's answered, right or out of tries.
     Like a game problem: two tries (one with only two choices), and a wrong answer shows its named mistake. */
  function renderCheck(el,check,onDone){
    el.innerHTML=`<section class="check" aria-label="Quick check"><p class="eyebrow">Quick check</p><p class="cq">${check.q}</p>${check.fig?`<div class="fig">${check.fig}</div>`:''}<div data-a></div><div data-fb role="status" aria-live="polite"></div></section>`;
    const q=Q(el),answerBox=q('a'),feedback=q('fb');let tries=0,done=false;
    if(canSpeak())el.querySelector('.cq').before(sayBtn('Read the question',()=>[el.querySelector('.cq'),...answerBox.querySelectorAll('.choice')]));
    if(check.kind==='num'){
      /* a fraction answer needs / and space, so it gets the full keyboard instead of the number pad */
      const keyboard=check.frac?'inputmode="text" placeholder="like 2 1/3"':'inputmode="decimal" placeholder="?"';
      answerBox.innerHTML=`<form class="ans" autocomplete="off"><label class="sr" for="cin">Your answer</label><input id="cin" ${keyboard}><span class="unit">${check.unit||''}</span><button class="btn">Check</button></form>`;
      answerBox.querySelector('form').addEventListener('submit',e=>{e.preventDefault();submit($('cin').value);});
    }else{
      answerBox.innerHTML=`<div class="choices${check.stack?' stack':''}">${check.choices.map(c=>`<button type="button" class="choice" data-c="${c.id}">${c.label}</button>`).join('')}</div>`;
      answerBox.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{if(!done&&!b.disabled)submit(b.dataset.c);}));
    }
    /* color a choice button right ('yes') or wrong ('no'); a wrong one can't be picked again */
    const mark=(id,verdict)=>{const b=answerBox.querySelector(`.choice[data-c="${id}"]`);if(b){b.classList.add(verdict);if(verdict==='no')b.disabled=true;}};
    function submit(value){
      if(done)return;let ok,msg;
      if(check.kind==='num'){
        const n=parseNum(value);
        if(isNaN(n)){feedback.innerHTML='<div class="fb info"><p>Type a number first.</p></div>';return;}
        ok=near(n,check.answer);
        if(!ok){const mistake=(check.misc||[]).find(([wrong])=>near(n,wrong));msg=mistake?mistake[1]:'Not quite. Look at the picture again.';}
      }else{ok=value===check.answer;if(!ok)msg=check.why[value]||'Not quite.';}
      tries++;
      if(ok){if(check.kind==='mc')mark(value,'yes');return end(true,tries===1?'Nice!':'Got it!','');}
      if(check.kind==='mc')mark(value,'no');
      /* with only two choices, a second try would give the answer away */
      const maxTries=check.kind==='mc'&&check.choices.length===2?1:2;
      if(tries<maxTries){
        feedback.innerHTML=`<div class="fb bad"><h4>Not yet</h4><p>${msg}</p><p>Try once more.</p></div>`;
        const input=$('cin');if(input)input.select();
        return;
      }
      if(check.kind==='mc')mark(check.answer,'yes');
      end(false,'Here’s how it works',msg);
    }
    /* lock the answer and show the worked answer */
    function end(ok,title,msg){
      done=true;answerBox.querySelectorAll('button').forEach(b=>b.disabled=true);answerBox.querySelectorAll('input').forEach(i=>i.readOnly=true);
      feedback.innerHTML=`<div class="fb ${ok?'good':'bad'}"><h4>${title}</h4>${msg?`<p>${msg}</p>`:''}<p class="work">${check.explain}</p></div>`;
      onDone();
    }
  }

  /* ---------- save & pages ---------- */
  /* save.steps holds a 1 for each finished step, under "<chapter id>/<step number>" (step numbers start at 1) */
  const persist=()=>{try{localStorage.setItem(cfg.saveKey,JSON.stringify(save));}catch(e){}};
  const stepKey=(chapterIndex,stepIndex)=>`${chapters[chapterIndex].id}/${stepIndex+1}`;
  const stepDone=(chapterIndex,stepIndex)=>!!save.steps[stepKey(chapterIndex,stepIndex)];
  /* progress for the unit; steps saved by the old single page (c2s1) move to their chapter's id */
  function load(unit){
    cfg=unit;chapters=unit.chapters;save={steps:{}};
    try{const saved=JSON.parse(localStorage.getItem(cfg.saveKey)||'null');if(saved&&saved.steps)save=saved;}catch(e){}
    const oldKeys=Object.keys(save.steps).filter(k=>/^c\d+s\d+$/.test(k));
    if(oldKeys.length){
      oldKeys.forEach(k=>{
        const [,chapterNum,stepNum]=k.match(/^c(\d+)s(\d+)$/),id=(cfg.legacy||[])[chapterNum-1];
        if(id&&save.steps[k])save.steps[`${id}/${stepNum}`]=1;
        delete save.steps[k];
      });
      persist();
    }
    totalSteps=chapters.reduce((sum,c)=>sum+c.steps,0);
  }
  /* learn.html: steps done in the unit, and a card for each chapter that opens at its first unfinished step */
  function renderHome(){
    $('hdone').textContent=Object.keys(save.steps).filter(k=>save.steps[k]).length;$('htot').textContent=totalSteps;
    $('chapters').innerHTML=chapters.map((ch,chapterIndex)=>{
      const stepIndexes=range(ch.steps),
        stepsDone=stepIndexes.filter(si=>stepDone(chapterIndex,si)).length,
        firstUnfinished=stepIndexes.findIndex(si=>!stepDone(chapterIndex,si)),
        finished=stepsDone===ch.steps;
      const progress=finished?'✓ Done':`${stepsDone}/${ch.steps} steps`,
        go=stepsDone?(finished?'Review →':'Continue →'):'Start →';
      return `<a class="zone" href="learn/${ch.id}.html#s${firstUnfinished<0?1:firstUnfinished+1}"><svg class="icon" viewBox="0 0 64 64" aria-hidden="true">${cfg.icons[ch.icon]}</svg><p class="eyebrow">Chapter ${chapterIndex+1} · ${ch.lessons}</p><h3>${ch.title}</h3><p>${ch.blurb}</p><span class="meta"><span class="prog${finished?' full':''}">${progress}</span><span class="go">${go}</span></span></a>`;
    }).join('');
  }
  function home(unit){
    load(unit);
    /* an old link to a step of the single page (#c2s1 or #c2done) goes to that step's chapter page */
    const m=location.hash.match(/^#c(\d+)(?:s(\d+)|done)$/),id=m&&(cfg.legacy||[])[m[1]-1];
    if(id)return location.replace(`learn/${id}.html#${m[2]?'s'+m[2]:'done'}`);
    renderHome();
  }

  /* ---------- a chapter page ---------- */
  let chapterIndex,steps;
  /* a dot for each step, linking to it: the current one (cur, or none when stepIndex is -1) and the finished ones marked */
  function dots(stepIndex){
    $('dots').innerHTML=steps.map((_,i)=>{
      const done=stepDone(chapterIndex,i);
      return `<a href="#s${i+1}" class="dot${i===stepIndex?' cur':''}${done?' done':''}" aria-label="Step ${i+1}${done?', done':''}"></a>`;
    }).join('');
  }
  function renderStep(stepIndex){
    const ch=chapters[chapterIndex],step=steps[stepIndex],key=stepKey(chapterIndex,stepIndex),last=stepIndex+1===steps.length;
    $('cname').textContent=`${chapterIndex+1}. ${ch.title}`;dots(stepIndex);
    $('snum').textContent=`Step ${stepIndex+1} of ${steps.length} · ${ch.lessons}`;
    $('stitle').textContent=step.title;$('sbody').innerHTML=step.body;
    if(canSpeak())$('sbody').prepend(sayBtn('Read to me',()=>[$('stitle'),...$('sbody').querySelectorAll('p')]));
    /* a fresh, empty #widget each step, so listeners a widget added to it don't outlive its step */
    const old=$('widget'),widget=old.cloneNode(false);old.replaceWith(widget);widget.hidden=!step.widget;
    if(step.widget)cleanupWidget=step.widget(widget)||null;
    /* Next stays locked (with a note in #gate) until the quick check is answered, now or on an earlier visit */
    const next=$('next'),gate=$('gate');
    const finish=()=>{save.steps[key]=1;persist();next.disabled=false;gate.textContent='';dots(stepIndex);};
    $('check').hidden=!step.check;$('check').innerHTML='';
    if(step.check){
      renderCheck($('check'),step.check,finish);
      const doneBefore=!!save.steps[key];
      next.disabled=!doneBefore;gate.textContent=doneBefore?'':'Answer the quick check to go on.';
    }else{next.disabled=false;gate.textContent='';}
    $('prev').href=stepIndex?`#s${stepIndex}`:'../learn.html';$('prev').textContent=stepIndex?'← Back':'← Chapters';
    next.textContent=last?'Finish chapter →':'Next →';
    /* a step without a check counts as done when the student moves on */
    next.onclick=()=>{if(!step.check){save.steps[key]=1;persist();}location.hash=last?'#done':`#s${stepIndex+2}`;};
  }
  /* #done: the end of the chapter, with a link to its game zone and to the next chapter */
  function renderDone(){
    const ch=chapters[chapterIndex],nextCh=chapters[chapterIndex+1];
    $('cname').textContent=`${chapterIndex+1}. ${ch.title}`;dots(-1);
    $('snum').textContent=`Chapter ${chapterIndex+1} complete`;$('stitle').textContent='Nice work!';
    const practice=ch.game&&cfg.game?`<div class="practice"><p class="eyebrow">Practice it</p><a class="btn" href="../#${ch.game.zone}">Play ${ch.game.name} →</a><p>in ${cfg.game}, the game for this unit.</p></div>`:'';
    $('sbody').innerHTML=`<p>You finished <b>${ch.title}</b>.</p>`+practice;
    $('widget').hidden=true;$('check').hidden=true;$('gate').textContent='';
    $('prev').href=`#s${steps.length}`;$('prev').textContent='← Back';
    const next=$('next');next.disabled=false;next.textContent=nextCh?`Next: ${nextCh.title} →`:'Back to chapters';
    next.onclick=()=>{location.href=nextCh?`${nextCh.id}.html#s1`:'../learn.html';};
  }
  /* show the step in the hash (#s2), or the end (#done); a missing or out-of-range step shows the nearest one */
  function route(){
    if(cleanupWidget){try{cleanupWidget();}catch(e){}cleanupWidget=null;}
    hush();
    const m=location.hash.match(/^#(?:s(\d+)|(done))$/);
    if(m&&m[2])return renderDone();
    const stepNum=Math.min(Math.max(m?+m[1]:1,1),steps.length);
    renderStep(stepNum-1);
  }
  function chapter(unit,id,chapterSteps){
    load(unit);chapterIndex=chapters.findIndex(c=>c.id===id);steps=chapterSteps;
    if(chapterIndex<0)throw new Error(`No chapter "${id}" in learn/chapters.js`);
    if(chapters[chapterIndex].steps!==steps.length)console.error(`Chapter "${id}" has ${steps.length} steps, but learn/chapters.js says ${chapters[chapterIndex].steps}`);
    document.body.insertAdjacentHTML('afterbegin',`<div class="app">
  <section id="lesson">
    <div class="bar">
      <a class="ghost-btn" href="../learn.html">← Chapters</a>
      <div class="bar-mid"><div class="zn" id="cname"></div><div class="dots" id="dots"></div></div>
    </div>
    <article class="card">
      <p class="eyebrow" id="snum"></p>
      <h2 id="stitle"></h2>
      <div class="sbody" id="sbody"></div>
      <div id="widget"></div>
      <div id="check"></div>
      <div class="nav"><a class="ghost-btn" id="prev" href="#">← Back</a><button type="button" class="btn" id="next">Next →</button><span class="gate" id="gate"></span></div>
    </article>
  </section>
</div>`);
    addEventListener('hashchange',route);
    route();
  }
  return {home,chapter};
})();
