/* Learn From Hundredths to Hundred-thousands (Grade 4 Unit 4): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* k hundredths as a decimal, as short as it goes: 47 → "0.47", 50 → "0.5", 100 → "1" */
const dS=k=>k%100===0?String(k/100):(k/100).toFixed(k%10?2:1);
/* the columns hundred-thousands to ones */
const WIDE=[5,4,3,2,1,0];
/* a place's name for 1 and for more: PL[3] is ['thousand', 'thousands'] */
const PL={5:['hundred-thousand','hundred-thousands'],4:['ten-thousand','ten-thousands'],3:['thousand','thousands'],2:['hundred','hundreds'],1:['ten','tens'],0:['one','ones']};
const SYM={'<':'&lt;','>':'&gt;','=':'='};
const signOf=(a,b)=>a<b?'<':a>b?'>':'=';
/* Pick <, =, or >, then see why. pairs: [[a, b], …] of {v, t}: the value and how it's written.
   show(a, b): a picture of both; why(a, b): html saying how they compare. */
const wSign=(pairs,{show,why})=>el=>{
  const q=Q(el);let p=0,pick=null;
  el.innerHTML=seg('Numbers',pairs.map(([a,b],i)=>[i,`${a.t} and ${b.t}`]))+`<div class="chips" data-c></div><div class="fig" data-f></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const [a,b]=pairs[p],s=signOf(a.v,b.v);press(el,p);
    q('c').innerHTML=['<','=','>'].map(k=>`<button type="button" class="chip" data-s="${k}" aria-pressed="${k===pick}">${a.t} ${SYM[k]} ${b.t}</button>`).join('');
    q('f').hidden=!pick;q('f').innerHTML=pick?show(a,b):'';
    q('r').innerHTML=!pick?'Which is true? Think first, then tap.'
      :(pick===s?'<span class="ok">Yes!</span> ':'<span class="no">Not quite.</span> ')+why(a,b)+` <b>${a.t} ${SYM[s]} ${b.t}</b>.`;
  };
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){p=+b.dataset.m;pick=null;draw();return;}const s=e.target.closest('[data-s]');if(s){pick=s.dataset.s;draw();}});
  draw();
};
