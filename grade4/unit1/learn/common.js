/* Learn Factors and Multiples (Grade 4 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
/* items joined with commas: "2, 4, 6" */
const list=items=>items.join(', ');
/* A widget for the numbers in NUMS: try 1, 2, 3, … rows of tiles in turn; each one that works is a factor pair.
   It stops when the next pair would be a turnaround. */
const pairsHunt=NUMS=>el=>{
  /* rowsTried: the most rows tried so far (0 before the first try) */
  const q=Q(el);let n=NUMS[0],rowsTried=0;
  el.innerHTML=seg('Number',NUMS.map(v=>[v,v]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    /* done once the next number of rows times itself passes n: every pair after that is a turnaround */
    const done=(rowsTried+1)*(rowsTried+1)>n,found=pairsOf(n).filter(([a])=>a<=rowsTried);press(el,n);
    q('f').innerHTML=rowsTried?tiles(rowsTried,n):`<p class="note">${n} tiles. Try 1 row, then 2 rows, then 3 rows, …</p>`;
    q('go').textContent=rowsTried?`Try ${rowsTried+1} rows`:'Try 1 row';q('go').disabled=done;
    q('c').innerHTML=found.map(([a,b])=>`<span class="chip found">${a} × ${b}</span>`).join('');
    q('r').innerHTML=!rowsTried?`Find every factor pair of <b>${n}</b>.`
      :(n%rowsTried?`${rowsTried} rows leave ${n%rowsTried} left over. ${rowsTried} is not a factor of ${n}.`:`<b>${rowsTried} × ${n/rowsTried} = ${n}</b>. That’s a factor pair!`)
      +(done?`<br><span class="ok">Done! ${rowsTried+1} × ${rowsTried+1} is more than ${n}, so any other pair is a turnaround of one you have.</span><br>Factors of ${n}: <b>${list(factors(n))}</b>`:'');
  };
  q('go').onclick=()=>{rowsTried++;draw();};
  q('clr').onclick=()=>{rowsTried=0;draw();};
  el.addEventListener('click',e=>{const numberBtn=e.target.closest('[data-m]');if(numberBtn){n=+numberBtn.dataset.m;rowsTried=0;draw();}});
  draw();
};
