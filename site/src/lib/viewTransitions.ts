/**
 * Cross-document view transitions (01 §6.6): names exist only for the
 * navigation in progress. An inline <head> script (no React), composed with
 * the boot script by RootDocument, so `pagereveal` is heard before the first
 * render of the new page.
 *
 *  - Marks (PairMark, TypeSetPair `vt`) hold their names in data-vt and carry
 *    none at rest; a case cover's Pair carries its names permanently, a
 *    cover's TypeSetPair (data-vt inside #top) is named when its case is
 *    carried in or out.
 *  - pageswap (old page): going to a case, name only the mark inside the
 *    clicked link (a back/forward from the home may use an index mark in
 *    view); going home from a case, the cover keeps its names if its dots
 *    are in view. Every other tr-* name is set to none. The carried slug goes
 *    to sessionStorage for the new page.
 *  - pagereveal (new page): a case keeps its cover's names only if the old
 *    page carried that case; the home names its index mark for the case it
 *    came back from, if that mark is in view. Everything else is muted. A
 *    carried pair with no landing leaves with the old page
 *    (html[data-vt-orphan], 120ms).
 *  - Names and mutes are written as rules in one <style id="vt-carry"> in
 *    <head> (:nth-child paths from the nearest id), never as inline styles:
 *    React-owned nodes are never touched before hydration (a style or
 *    attribute written there is a hydration mismatch). The sheet is removed
 *    when the transition ends, or when the page is shown again (bfcache).
 */
const SOURCE = `(function(){
if(!('onpagereveal' in window))return;
var K='trema-carry',h=document.documentElement,last=null,lastAt=0,sheet=null,rules=[];
function slugOf(u){try{var m=/\\/work\\/([^\\/?#]+)/.exec(new URL(u,location.href).pathname);return m?m[1]:null}catch(e){return null}}
function pathOf(u){try{return new URL(u,location.href).pathname}catch(e){return ''}}
function isHome(u){var p=pathOf(u);return p==='/'||p==='/fr/'||p==='/fr'}
function esc(s){return window.CSS&&CSS.escape?CSS.escape(s):s}
function sel(el){var p=[];while(el&&el.nodeType===1&&el!==h){if(el.id){p.unshift('#'+esc(el.id));return p.join('>')}var i=1,s=el;while((s=s.previousElementSibling))i++;p.unshift(':nth-child('+i+')');el=el.parentElement}p.unshift(':root');return p.join('>')}
function setName(el,n){rules.push(sel(el)+'{view-transition-name:'+n+'!important;view-transition-class:'+(n==='none'?'none':'trema')+'!important}')}
function commit(){if(!rules.length)return;if(!sheet){sheet=document.createElement('style');sheet.id='vt-carry';document.head.appendChild(sheet)}sheet.textContent=rules.join('')}
function reset(){rules=[];if(sheet){sheet.remove();sheet=null}h.removeAttribute('data-vt-orphan')}
function inView(el){var r=el.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight}
function nameMark(s,scope,any){var a=document.querySelectorAll('[data-vt="tr-'+s+'-a"]'),pick=null,i;
for(i=0;i<a.length&&!pick;i++)if(scope&&scope.contains(a[i]))pick=a[i];
for(i=0;i<a.length&&!pick&&any;i++)if(inView(a[i]))pick=a[i];
if(!pick)return false;var b=pick.parentElement&&pick.parentElement.querySelector('[data-vt="tr-'+s+'-b"]');
setName(pick,'tr-'+s+'-a');if(b)setName(b,'tr-'+s+'-b');return true}
function named(){var els=document.querySelectorAll('[data-pair-disc],[data-vt],[style*="--vt-"] *'),out=[];
for(var i=0;i<els.length;i++){var n=getComputedStyle(els[i]).viewTransitionName;if(n&&n.indexOf('tr-')===0)out.push([els[i],n])}return out}
function muteOthers(keep){var l=named();for(var i=0;i<l.length;i++)if(!keep||l[i][1].indexOf('tr-'+keep+'-')!==0)setName(l[i][0],'none')}
function keepsInView(s){var l=named();for(var i=0;i<l.length;i++)if(l[i][1].indexOf('tr-'+s+'-')===0&&inView(l[i][0]))return true;return false}
function store(v){try{sessionStorage.setItem(K,v)}catch(e){}}
function take(){try{var v=sessionStorage.getItem(K);sessionStorage.removeItem(K);return v}catch(e){return null}}
addEventListener('click',function(e){var t=e.target;last=t&&t.closest?t.closest('a'):null;lastAt=Date.now()},true);
addEventListener('pageswap',function(e){reset();if(!e.viewTransition||!e.activation||!e.activation.entry){store('');return}
var url=e.activation.entry.url,to=slugOf(url),here=slugOf(location.href),keep=null,
link=last&&Date.now()-lastAt<4000&&pathOf(last.href)===pathOf(url)?last:null,
trav=e.activation.navigationType==='traverse';
if(to&&to!==here){if(nameMark(to,link,!link&&trav&&!here))keep=to}
else if(here&&(to===here||isHome(url))){var top=document.getElementById('top'),a=top&&top.querySelector('[data-vt="tr-'+here+'-a"]');if(a&&inView(a)){nameMark(here,top,false);keep=here}else if(keepsInView(here))keep=here}
muteOthers(keep);commit();store(keep||'')});
addEventListener('pagereveal',function(e){reset();var carried=take();if(!e.viewTransition)return;
var act=window.navigation&&navigation.activation,from=act&&act.from?slugOf(act.from.url):null,here=slugOf(location.href),keep=null;
if(here){if(carried===here){nameMark(here,document.getElementById('top'),false);keep=here}}else if(from&&carried===from&&nameMark(from,document.getElementById('work'),true))keep=from;
muteOthers(keep);commit();if(carried&&!keep)h.setAttribute('data-vt-orphan','');
e.viewTransition.finished.then(reset,reset)});
addEventListener('pageshow',function(e){if(e.persisted)reset()});
})();`;

export function viewTransitionScript(): string {
  return SOURCE.replace(/\n/g, "");
}
