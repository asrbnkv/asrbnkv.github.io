/**
 * The end frame of a curtain page (01 §7.15). At the end of the page the band
 * between the bar and the footer shows the tail of the last chapter, and the
 * bar's bottom edge must never cut a line of it in half. The footer takes the
 * least height (its own stack, or the desktop minimum, up to the viewport
 * under the bar) at which the strip from 2px over the bar's bottom edge to
 * --fit-clear under it holds no text, form field or picture of <main>: the
 * band then starts on empty field or on a whole group.
 *
 * That extra height never stretches the footer's own composition (Footer.
 * module.css): it all goes to the hem, a band on top of the footer in the
 * last chapter's own colour, so the end frame reads as the close's own
 * bottom margin over the footer the spec draws. Nothing ever goes over the
 * name or between the name and the row.
 *
 * Positions are layout positions (the offset chain), so a part still waiting
 * for its entrance, translated, is measured where it will rest.
 */

const OVER = 2; // px over the bar's bottom edge
// The most spare the footer keeps over its own stack (3:2 over the name and
// over the row): at most about 150px of ink over the A's cap and 110px from
// the m's foot to the row. The desktop minimum leaves more on tall screens
// (151px at 1920×1080, 358px at 2560×1440); the band under the bar then shows
// a little more of the close, and the hem keeps it whole.
const SPARE = 112;
const BOXES = "img, svg, video, canvas, input, textarea, select, button, [role='img']";
const PROPS = ["--hem", "--hem-color", "--curtain-cap"] as const;

/** Layout top of an element in the document: offsets only, no transforms. */
function layoutTop(el: HTMLElement) {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/** The nearest HTML element at or above `el` (an SVG part has no offsets). */
function hostOf(el: Element | null): HTMLElement | null {
  let n = el;
  while (n && !(n instanceof HTMLElement)) n = n.parentElement;
  return n;
}

/** The colour of <main>'s last field: the hem continues it. */
function lastFieldColour(main: HTMLElement) {
  for (let el = main.lastElementChild; el; el = el.previousElementSibling) {
    if (el instanceof HTMLElement && el.hasAttribute("data-field") && el.offsetHeight > 0) {
      return getComputedStyle(el).backgroundColor;
    }
  }
  return getComputedStyle(main).backgroundColor;
}

/** Removes everything the fit set (or only the hem). */
export function clearFit(footer: HTMLElement, props: readonly string[] = PROPS) {
  for (const p of props) footer.style.removeProperty(p);
}

export function fitCurtain(footer: HTMLElement, main: HTMLElement) {
  const cs = getComputedStyle(footer);
  const px = (prop: string) => parseFloat(cs.getPropertyValue(prop)) || 0;
  const name = footer.querySelector<HTMLElement>("[data-monument]");
  const row = footer.querySelector<HTMLElement>("[data-footer-row]");
  const first = row?.firstElementChild;
  if (!name || !row || !first) return clearFit(footer);

  // The footer's own stack, without the hem or its share of the spare.
  const stack =
    parseFloat(cs.paddingTop) +
    name.getBoundingClientRect().height +
    parseFloat(getComputedStyle(name).marginBottom) +
    (row.getBoundingClientRect().bottom - first.getBoundingClientRect().top) +
    parseFloat(cs.paddingBottom);
  footer.style.setProperty("--curtain-cap", `${Math.ceil(stack + SPARE)}px`);
  const base = Math.max(stack, Math.min(px("--curtain-min"), stack + SPARE));

  const clear = () => clearFit(footer, ["--hem", "--hem-color"]);
  const bar = document.querySelector<HTMLElement>("[data-bar]");
  const vh = window.innerHeight;
  const mh = main.offsetHeight;
  if (!bar || mh <= vh) return clear();
  const barBottom = bar.offsetHeight + (parseFloat(getComputedStyle(bar).top) || 0);
  // Main always keeps a sliver under the bar, so the bar follows its field.
  const max = Math.min(vh - barBottom - 1, parseFloat(cs.maxHeight) || vh);

  // At the end of the page the document's bottom meets the viewport's, so
  // main's bottom edge sits at view − (footer height).
  const footerH = footer.getBoundingClientRect().height;
  const tail = Math.max(0, document.documentElement.scrollHeight - (layoutTop(main) + mh + footerH));
  const view = vh - tail;
  const s0 = barBottom - OVER;
  const s1 = barBottom + (px("--fit-clear") || 24);

  // Each box of main's last screen bans the footer heights that would put it
  // across the strip: (view + top − mh − s1, view + bottom − mh − s0).
  const mainTop = layoutTop(main);
  const mainRectTop = main.getBoundingClientRect().top;
  const floor = mh - vh; // nothing above this line (from main's top) can show
  const banned: Array<[number, number]> = [];
  const shifts = new Map<HTMLElement, number>();
  const shift = (el: HTMLElement) => {
    let s = shifts.get(el);
    if (s === undefined) {
      s = el.getBoundingClientRect().top - mainRectTop - (layoutTop(el) - mainTop);
      shifts.set(el, s);
    }
    return s;
  };
  const add = (rect: DOMRect, host: HTMLElement) => {
    if (rect.width < 2 || rect.height < 2) return;
    const s = shift(host);
    const top = rect.top - mainRectTop - s;
    const bottom = rect.bottom - mainRectTop - s;
    if (bottom < floor) return;
    banned.push([view + top - mh - s1, view + bottom - mh - s0]);
  };

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
      const el = node as Element;
      if (el.matches(".visually-hidden, [hidden], [inert]")) return NodeFilter.FILTER_REJECT;
      if (!(el instanceof HTMLElement)) return NodeFilter.FILTER_ACCEPT;
      // Not laid out in the page (display: none, or fixed to the viewport).
      if (el.offsetParent === null && getComputedStyle(el).display !== "contents") return NodeFilter.FILTER_REJECT;
      // Whole chapters that end above the last screen.
      if (el.offsetHeight > 0 && layoutTop(el) - mainTop + el.offsetHeight < floor) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      const host = hostOf(node.parentElement);
      if (!host || getComputedStyle(node.parentElement ?? host).visibility === "hidden") continue;
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) add(rect, host);
    } else if ((node as Element).matches(BOXES)) {
      const el = node as Element;
      const host = hostOf(el);
      if (host && getComputedStyle(el).visibility !== "hidden") add(el.getBoundingClientRect(), host);
    }
  }
  range.detach();

  // The least height at or above the base that no box bans.
  let h = base;
  for (let moved = true; moved; ) {
    moved = false;
    for (const [lo, hi] of banned) {
      if (h > lo && h < hi) {
        h = hi + 1; // a whole pixel: subpixel layout never lands a line in the strip
        moved = true;
      }
    }
  }
  const hem = Math.ceil(Math.min(h, max) - base);
  if (hem < 1) return clear();
  footer.style.setProperty("--hem", `${hem}px`);
  footer.style.setProperty("--hem-color", lastFieldColour(main));
}
