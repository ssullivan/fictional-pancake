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
  let cfg,CH,save,TOTAL,cleanupW=null;
  /* ---------- read aloud (shared/speak.js) ---------- */
  const hasSay=typeof Say!=='undefined';
  const canSpeak=()=>cfg.readAloud&&hasSay&&Say.ok();
  const hush=()=>{if(hasSay)Say.hush();},sayBtn=(l,e)=>Say.btn(l,e);

  /* ---------- quick checks ---------- */
  const near=(a,b)=>Math.abs(a-b)<.011;
  function renderCheck(el,c,onDone){
    el.innerHTML=`<section class="check" aria-label="Quick check"><p class="eyebrow">Quick check</p><p class="cq">${c.q}</p>${c.fig?`<div class="fig">${c.fig}</div>`:''}<div data-a></div><div data-fb role="status" aria-live="polite"></div></section>`;
    const q=Q(el),ans=q('a'),fb=q('fb');let tries=0,done=false;
    if(canSpeak())el.querySelector('.cq').before(sayBtn('Read the question',()=>[el.querySelector('.cq'),...ans.querySelectorAll('.choice')]));
    if(c.kind==='num'){
      ans.innerHTML=`<form class="ans" autocomplete="off"><label class="sr" for="cin">Your answer</label><input id="cin" ${c.frac?'inputmode="text" placeholder="like 2 1/3"':'inputmode="decimal" placeholder="?"'}><span class="unit">${c.unit||''}</span><button class="btn">Check</button></form>`;
      ans.querySelector('form').addEventListener('submit',e=>{e.preventDefault();submit($('cin').value);});
    }else{
      ans.innerHTML=`<div class="choices${c.stack?' stack':''}">${c.choices.map(x=>`<button type="button" class="choice" data-c="${x.id}">${x.label}</button>`).join('')}</div>`;
      ans.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>{if(!done&&!b.disabled)submit(b.dataset.c);}));
    }
    const mark=(id,cls)=>{const b=ans.querySelector(`.choice[data-c="${id}"]`);if(b){b.classList.add(cls);if(cls==='no')b.disabled=true;}};
    function submit(v){
      if(done)return;let ok,msg;
      if(c.kind==='num'){
        const n=parseNum(v);
        if(isNaN(n)){fb.innerHTML='<div class="fb info"><p>Type a number first.</p></div>';return;}
        ok=near(n,c.answer);
        if(!ok){const m=(c.misc||[]).find(([x])=>near(n,x));msg=m?m[1]:'Not quite. Look at the picture again.';}
      }else{ok=v===c.answer;if(!ok)msg=c.why[v]||'Not quite.';}
      tries++;
      if(ok){if(c.kind==='mc')mark(v,'yes');return end(true,tries===1?'Nice!':'Got it!','');}
      if(c.kind==='mc')mark(v,'no');
      if(tries<(c.kind==='mc'&&c.choices.length===2?1:2)){fb.innerHTML=`<div class="fb bad"><h4>Not yet</h4><p>${msg}</p><p>Try once more.</p></div>`;const i=$('cin');if(i)i.select();return;}
      if(c.kind==='mc')mark(c.answer,'yes');
      end(false,'Here’s how it works',msg);
    }
    function end(ok,title,msg){
      done=true;ans.querySelectorAll('button').forEach(b=>b.disabled=true);ans.querySelectorAll('input').forEach(i=>i.readOnly=true);
      fb.innerHTML=`<div class="fb ${ok?'good':'bad'}"><h4>${title}</h4>${msg?`<p>${msg}</p>`:''}<p class="work">${c.explain}</p></div>`;
      onDone();
    }
  }

  /* ---------- save & pages ---------- */
  const persist=()=>{try{localStorage.setItem(cfg.saveKey,JSON.stringify(save));}catch(e){}};
  const skey=(ci,si)=>`${CH[ci].id}/${si+1}`;
  /* progress for the unit; steps saved by the old single page (c2s1) move to their chapter's id */
  function load(u){
    cfg=u;CH=u.chapters;save={steps:{}};
    try{const s=JSON.parse(localStorage.getItem(cfg.saveKey)||'null');if(s&&s.steps)save=s;}catch(e){}
    const old=Object.keys(save.steps).filter(k=>/^c\d+s\d+$/.test(k));
    if(old.length){
      old.forEach(k=>{const [,c,st]=k.match(/^c(\d+)s(\d+)$/),id=(cfg.legacy||[])[c-1];if(id&&save.steps[k])save.steps[`${id}/${st}`]=1;delete save.steps[k];});
      persist();
    }
    TOTAL=CH.reduce((s,c)=>s+c.steps,0);
  }
  function renderHome(){
    $('hdone').textContent=Object.keys(save.steps).filter(k=>save.steps[k]).length;$('htot').textContent=TOTAL;
    $('chapters').innerHTML=CH.map((c,ci)=>{
      const S=Array.from({length:c.steps}),d=S.filter((_,si)=>save.steps[skey(ci,si)]).length,first=S.findIndex((_,si)=>!save.steps[skey(ci,si)]);
      return `<a class="zone" href="learn/${c.id}.html#s${first<0?1:first+1}"><svg class="icon" viewBox="0 0 64 64" aria-hidden="true">${cfg.icons[c.icon]}</svg><p class="eyebrow">Chapter ${ci+1} · ${c.lessons}</p><h3>${c.title}</h3><p>${c.blurb}</p><span class="meta"><span class="prog${d===c.steps?' full':''}">${d===c.steps?'✓ Done':`${d}/${c.steps} steps`}</span><span class="go">${d?(d===c.steps?'Review →':'Continue →'):'Start →'}</span></span></a>`;
    }).join('');
  }
  function home(u){
    load(u);
    /* an old link to a step of the single page goes to that step's chapter page */
    const m=location.hash.match(/^#c(\d+)(?:s(\d+)|done)$/),id=m&&(cfg.legacy||[])[m[1]-1];
    if(id)return location.replace(`learn/${id}.html#${m[2]?'s'+m[2]:'done'}`);
    renderHome();
  }

  /* ---------- a chapter page ---------- */
  let ci,STEPS;
  function dots(si){
    $('dots').innerHTML=STEPS.map((_,i)=>`<a href="#s${i+1}" class="dot${i===si?' cur':''}${save.steps[skey(ci,i)]?' done':''}" aria-label="Step ${i+1}${save.steps[skey(ci,i)]?', done':''}"></a>`).join('');
  }
  function renderStep(si){
    const ch=CH[ci],st=STEPS[si],key=skey(ci,si),last=si+1===STEPS.length;
    $('cname').textContent=`${ci+1}. ${ch.title}`;dots(si);
    $('snum').textContent=`Step ${si+1} of ${STEPS.length} · ${ch.lessons}`;
    $('stitle').textContent=st.title;$('sbody').innerHTML=st.body;
    if(canSpeak())$('sbody').prepend(sayBtn('Read to me',()=>[$('stitle'),...$('sbody').querySelectorAll('p')]));
    /* a fresh, empty #widget each step, so listeners a widget added to it don't outlive its step */
    const old=$('widget'),w=old.cloneNode(false);old.replaceWith(w);w.hidden=!st.widget;
    if(st.widget)cleanupW=st.widget(w)||null;
    const next=$('next'),gate=$('gate');
    const finish=()=>{save.steps[key]=1;persist();next.disabled=false;gate.textContent='';dots(si);};
    $('check').hidden=!st.check;$('check').innerHTML='';
    if(st.check){renderCheck($('check'),st.check,finish);const ok=!!save.steps[key];next.disabled=!ok;gate.textContent=ok?'':'Answer the quick check to go on.';}
    else{next.disabled=false;gate.textContent='';}
    $('prev').href=si?`#s${si}`:'../learn.html';$('prev').textContent=si?'← Back':'← Chapters';
    next.textContent=last?'Finish chapter →':'Next →';
    next.onclick=()=>{if(!st.check){save.steps[key]=1;persist();}location.hash=last?'#done':`#s${si+2}`;};
  }
  function renderDone(){
    const ch=CH[ci],nx=CH[ci+1];
    $('cname').textContent=`${ci+1}. ${ch.title}`;dots(-1);
    $('snum').textContent=`Chapter ${ci+1} complete`;$('stitle').textContent='Nice work!';
    $('sbody').innerHTML=`<p>You finished <b>${ch.title}</b>.</p>`+(ch.game&&cfg.game?`<div class="practice"><p class="eyebrow">Practice it</p><a class="btn" href="../#${ch.game.zone}">Play ${ch.game.name} →</a><p>in ${cfg.game}, the game for this unit.</p></div>`:'');
    $('widget').hidden=true;$('check').hidden=true;$('gate').textContent='';
    $('prev').href=`#s${STEPS.length}`;$('prev').textContent='← Back';
    const next=$('next');next.disabled=false;next.textContent=nx?`Next: ${nx.title} →`:'Back to chapters';
    next.onclick=()=>{location.href=nx?`${nx.id}.html#s1`:'../learn.html';};
  }
  function route(){
    if(cleanupW){try{cleanupW();}catch(e){}cleanupW=null;}
    hush();
    const m=location.hash.match(/^#(?:s(\d+)|(done))$/);
    if(m&&m[2])renderDone();else renderStep(Math.min(Math.max(m?+m[1]:1,1),STEPS.length)-1);
  }
  function chapter(u,id,steps){
    load(u);ci=CH.findIndex(c=>c.id===id);STEPS=steps;
    if(ci<0)throw new Error(`No chapter "${id}" in learn/chapters.js`);
    if(CH[ci].steps!==steps.length)console.error(`Chapter "${id}" has ${steps.length} steps, but learn/chapters.js says ${CH[ci].steps}`);
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