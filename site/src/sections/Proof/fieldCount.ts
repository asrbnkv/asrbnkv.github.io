/**
 * Scene D counts its dot field in (02-home.md §3.9, 01 §7.9): the scene, not
 * the field's own observer, decides when rows arrive, so the 80 dots always
 * answer the figure and never race it. Browser only.
 *
 * The host ([data-field-host], Scenes.module.css) shows a cell once its row
 * is under --shown:
 *   "scrub"    pinned: the rows follow the reader's scroll (240ms a row)
 *   "cascade"  flow: one roll call, 40ms a row, once
 *   "now"      keyboard focus: the finished field, no transition
 * The caption ([data-full]) follows the last row. Under reduced motion and
 * without JS the CSS shows every dot and nothing here runs.
 */
export function fieldRows(host: HTMLElement): number {
  const fig = host.querySelector<HTMLElement>("figure");
  const rows = Number(fig?.style.getPropertyValue("--rows"));
  return Number.isFinite(rows) && rows > 0 ? rows : 8;
}

export function showRows(host: HTMLElement, n: number, how: "scrub" | "cascade" | "now") {
  const rows = fieldRows(host);
  const shown = Math.max(0, Math.min(rows, Math.round(n)));
  if (host.style.getPropertyValue("--shown") === String(shown) && host.dataset.count === how) return;
  host.dataset.count = how;
  host.style.setProperty("--shown", String(shown));
  if (shown >= rows) host.setAttribute("data-full", "");
  else host.removeAttribute("data-full");
}

/** Forget the count: the CSS state (every dot shown without JS or motion). */
export function releaseRows(host: HTMLElement) {
  delete host.dataset.count;
  host.style.removeProperty("--shown");
  host.removeAttribute("data-full");
}
