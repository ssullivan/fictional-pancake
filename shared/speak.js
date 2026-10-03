/* Read aloud for young readers (K–2): a button that reads parts of the page with the browser's built-in voice.
   Styles (.say) are in theme.css. Used by learn.js and engine.js when a page turns on readAloud.

   Say.ok()              true when the browser can speak
   Say.hush()            stops reading
   Say.btn(label, els)   a button that reads the elements els() returns, in order; pictures are read by their aria-label.
                         A second tap stops it. */
const Say=(()=>{
  const ok=()=>'speechSynthesis' in window;
  const hush=()=>{if(ok())speechSynthesis.cancel();};
  /* what to say for an element: its text, with each picture replaced by its description (aria-label) */
  const speakable=el=>{
    const copy=el.cloneNode(true);
    copy.querySelectorAll('svg').forEach(svg=>svg.replaceWith(svg.getAttribute('aria-label')||''));
    return copy.textContent.replace(/\s+/g,' ').trim();
  };
  function btn(label,els){
    const button=document.createElement('button');button.type='button';button.className='say';
    button.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>${label}`;
    button.onclick=()=>{
      if(speechSynthesis.speaking){hush();return;}
      /* each element's text ends with a period (unless it has its own punctuation), so the voice pauses between them */
      const text=els().map(speakable).filter(Boolean).map(t=>/[.?!:]$/.test(t)?t:t+'.').join(' ');
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.rate=.9;speechSynthesis.speak(utterance);
    };
    return button;
  }
  return {ok,hush,btn};
})();
