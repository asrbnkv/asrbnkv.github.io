"use client";

import { useEffect, type RefObject } from "react";

/**
 * A lesson leads to its case (01 §7.13): with a fine pointer, a click
 * anywhere on a poster row follows the row's case link, so the row does
 * what its hover promises (Retro.module.css: pointer cursor, the case's
 * underline doubles). The link stays the one real control: it is what the
 * keyboard, assistive tech, touch and no-JS visitors use.
 *
 * Left alone: clicks on any control, a click that ends a text selection
 * (every word of the wall stays selectable), touch and coarse pointers (a
 * thumb lands on a lesson to scroll, not to leave). A modified or middle
 * click opens the case in a new tab, as the link itself would.
 */
export function useRowLinks(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    const linkFor = (event: MouseEvent): HTMLAnchorElement | null => {
      if (event.defaultPrevented || !fine.matches) return null;
      if ("pointerType" in event && (event as PointerEvent).pointerType === "touch") return null;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest("a, button, input, select, textarea, summary, label")) return null;
      const row = target.closest<HTMLElement>("[data-poster]");
      if (!row || !root.contains(row)) return null;
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && row.contains(selection.anchorNode)) return null;
      return row.querySelector<HTMLAnchorElement>("a[href]");
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const link = linkFor(event);
      if (!link) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) window.open(link.href, "_blank", "noopener");
      else link.click();
    };

    const onAuxClick = (event: MouseEvent) => {
      if (event.button !== 1) return;
      const link = linkFor(event);
      if (link) window.open(link.href, "_blank", "noopener");
    };

    root.addEventListener("click", onClick);
    root.addEventListener("auxclick", onAuxClick);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("auxclick", onAuxClick);
    };
  }, [ref]);
}
