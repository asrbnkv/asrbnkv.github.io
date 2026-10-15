/**
 * The inline <head> script that runs before first paint (no React, no
 * bundle). It is the only thing hidden states depend on:
 *
 *  - html.js           hide-then-reveal states may apply (globals.css)
 *  - html.fonts-ready  the load beat may start: set when the display face
 *                      has loaded, or after 700ms at most (01 §6.1)
 *  - safety net        if the motion layer (<MotionRoot>, which adds
 *                      html.motion-ready) has not booted after 4s, html.js is
 *                      removed so no content can stay hidden
 *
 *  - html.beat-seen    a later view of the home in the same tab session (a
 *                      return from a case, a reload, the EN/FR switch): the
 *                      load beat is one 200ms opacity step instead of the
 *                      1.5s beat (sessionStorage 'trema-beat', set by the
 *                      first home view). The hero, the monument and the
 *                      flight key their beat off it.
 *  - iOS press feedback  an empty passive touchstart listener, so :active
 *                      (links' opacity 0.7, buttons' scale) fires in Safari
 *
 * `fr404`: on the bilingual 404, a path under /fr/ switches <html lang> to fr
 * before paint (03 §11).
 */
export function bootScript({
  displayFamily,
  fr404 = false,
}: {
  displayFamily: string;
  fr404?: boolean;
}): string {
  const family = JSON.stringify(`800 1em ${displayFamily}`);
  const lang404 = fr404
    ? "if(location.pathname.indexOf('/fr/')===0){h.lang='fr';h.setAttribute('data-lang','fr')}else{h.setAttribute('data-lang','en')}"
    : "";
  return (
    "(function(){var h=document.documentElement;h.classList.add('js');" +
    lang404 +
    "document.addEventListener('touchstart',function(){},{passive:true});" +
    "if(/^\\/(fr\\/?)?$/.test(location.pathname)){try{if(sessionStorage.getItem('trema-beat'))h.classList.add('beat-seen');else sessionStorage.setItem('trema-beat','1')}catch(e){}}" +
    // the home's first-screen rule (lib/fold.ts) re-measures with the real
    // faces in the same frame the load beat starts
    "var r=function(){try{window.__fold&&window.__fold()}catch(e){}h.classList.add('fonts-ready')},t=setTimeout(r,700);" +
    `try{document.fonts.load(${family}).then(function(){clearTimeout(t);r()},function(){})}catch(e){}` +
    "setTimeout(function(){if(!h.classList.contains('motion-ready'))h.classList.remove('js')},4000)})();"
  );
}
