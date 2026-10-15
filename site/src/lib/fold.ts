/**
 * The first-screen rule (01 §3.4, measured): the fold never cuts a block of
 * the home's first chapter. The monument stays width-bound (no height term);
 * when a block after the name cannot sit wholly above the fold with 24px of
 * clearance (the pair's labels 48px), that block and everything after it
 * start below the fold, and the bar's Email me carries the action (§7.2), so
 * the first screen holds exactly one, whole.
 *
 * An inline script placed right after the chapter (HomePage): it runs before
 * first paint, again when the fonts have loaded, and on a change of width or
 * small-viewport height (never on a phone's toolbar moving). It only writes
 * <html data-fold="n"> and --fold-mt (React never manages those), and
 * globals.css gives the chapter's nth child that margin-top: its own margin
 * again, under the fold. Boxes are read from layout (offsetTop/-Height), so
 * the load beat's rise never skews them. Without JS nothing moves and the
 * bar shows its Email me (<noscript> in Bar).
 */
const SOURCE = `(function(){
var h=document.documentElement,id=__ID__,key='';
function svh(){var p=document.createElement('div');p.style.cssText='position:fixed;top:0;left:0;width:1px;height:100svh;visibility:hidden;pointer-events:none';document.body.appendChild(p);var v=p.getBoundingClientRect().height;p.remove();return v||innerHeight}
function fold(force){var root=document.getElementById(id);if(!root)return;var H=svh(),k=innerWidth+'x'+Math.round(H);
if(!force&&k===key)return;key=k;h.removeAttribute('data-fold');h.style.removeProperty('--fold-mt');
var y0=root.getBoundingClientRect().top+scrollY,kids=root.children,best=-1,bestTop=1/0,bestMt=0;
for(var i=1;i<kids.length;i++){var el=kids[i],cs=getComputedStyle(el);
if(cs.position==='absolute'||cs.position==='fixed'||cs.display==='none'||!el.offsetHeight)continue;
var top=y0+el.offsetTop,all=top+el.offsetHeight,band=0;if(top>=H)continue;
var fr=el.getBoundingClientRect(),n=el.querySelectorAll('[data-pair-drawing],[data-pair-label],[data-pair-legend],[data-pair-measure]');
for(var j=0;j<n.length;j++){var r=n[j].getBoundingClientRect();if(!r.height)continue;var b=top+r.bottom-fr.top;all=Math.max(all,b);if(!n[j].hasAttribute('data-pair-measure'))band=Math.max(band,b)}
var bad=el.hasAttribute('data-pair')?((band||all)>H-48||all>H-24):all>H-24;
if(bad&&top<bestTop){best=i;bestTop=top;bestMt=parseFloat(cs.marginTop)||0}}
if(best<0)return;h.style.setProperty('--fold-mt',Math.ceil(H-bestTop+2*bestMt)+'px');h.setAttribute('data-fold',String(best+1))}
window.__fold=function(){fold(true)};fold(true);
var raf=0;addEventListener('resize',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){fold(false)})});
addEventListener('load',function(){fold(true)});
try{document.fonts.addEventListener('loadingdone',function(){fold(true)});document.fonts.ready.then(function(){fold(true)})}catch(e){}
})();`;

export function foldScript(id: string): string {
  return SOURCE.replace("__ID__", JSON.stringify(id)).replace(/\n/g, "");
}
