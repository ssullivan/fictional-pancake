/* Learn Factors and Multiples (Grade 4 Unit 1): code used by more than one chapter. Loaded by the chapter pages in learn/, after chapters.js. */
const list=a=>a.join(', ');
/* Try 1, 2, 3, … rows in turn; each one that works is a factor pair. Stop when the next pair would be a turnaround. */
const pairsHunt=NUMS=>el=>{
  const q=Q(el);let n=NUMS[0],k=0;
  el.innerHTML=seg('Number',NUMS.map(v=>[v,v]))+`<div class="fig" data-f></div><div class="wrow"><button type="button" class="btn" data-go></button><button type="button" class="ghost-btn" data-clr>Start over</button></div><div class="chips" data-c></div><p class="readout" data-r></p>`;
  const draw=()=>{
    const done=(k+1)*(k+1)>n,found=pairsOf(n).filter(([a])=>a<=k);press(el,n);
    q('f').innerHTML=k?tiles(k,n):`<p class="note">${n} tiles. Try 1 row, then 2 rows, then 3 rows, …</p>`;
    q('go').textContent=k?`Try ${k+1} rows`:'Try 1 row';q('go').disabled=done;
    q('c').innerHTML=found.map(([a,b])=>`<span class="chip found">${a} × ${b}</span>`).join('');
    q('r').innerHTML=!k?`Find every factor pair of <b>${n}</b>.`
      :(n%k?`${k} rows leave ${n%k} left over. ${k} is not a factor of ${n}.`:`<b>${k} × ${n/k} = ${n}</b>. That’s a factor pair!`)
      +(done?`<br><span class="ok">Done! ${k+1} × ${k+1} is more than ${n}, so any other pair is a turnaround of one you have.</span><br>Factors of ${n}: <b>${list(factors(n))}</b>`:'');
  };
  q('go').onclick=()=>{k++;draw();};
  q('clr').onclick=()=>{k=0;draw();};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){n=+b.dataset.m;k=0;draw();}});
  draw();
};
