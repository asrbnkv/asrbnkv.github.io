"use client";

import { useEffect } from "react";

/**
 * The bar's behaviour (01-system.md §5.3, §7.2, §7.3), wired to the DOM the
 * server rendered. Observers only: no scroll listener.
 *
 * 1. Field: the bar takes the [data-field] under its bottom edge (a 1px
 *    observer line), the innermost one when fields nest, and copies that
 *    field's --theme-color into <meta name="theme-color"> and the field's
 *    name into <html data-bar-field> (the page scrollbar's colours). Fields
 *    mounted after hydration are followed too (a MutationObserver).
 * 2. Hand-off: the bar's Email me hides while any [data-handoff] element is
 *    wholly in view (one cut by the fold or passing under the bar does not
 *    count: on a short screen the hero's actions start below the fold and
 *    the bar carries Email me from load). The links beside it slide by its
 *    width plus the gap
 *    (--handoff-x, measured), so nothing reflows (CLS 0): on the home it
 *    starts hidden and out of flow, so the links need no measure at first
 *    paint (Bar.module.css, .ctaOut).
 * 3. Current chapter: the nav link whose chapter crosses 40% of the viewport
 *    height gets aria-current="true".
 * 4. Menu: focus goes to the first link on open; a link click closes it.
 *    The toggle reads "Close" while the sheet is open (Bar.module.css) and
 *    carries aria-expanded.
 * 5. Language switch: on activation, every [data-lang-switch] link (bar,
 *    menu, footer) takes the chapter in view as its hash (the one crossing
 *    40% of the viewport, the aria-current line), so the reader lands on
 *    the same chapter in the other language; none on the first chapter.
 */
export function BarBehaviour() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-bar]");
    if (!bar) return;
    const cleanups: Array<() => void> = [];
    // From now on a state change may animate (the surname's fade-in on
    // phones uses @starting-style, never on the first paint).
    bar.dataset.ready = "";
    cleanups.push(() => delete bar.dataset.ready);

    // ── 1. Field following + toolbar tint ───────────────────────────────
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const themeMeta = meta;
    const root = document.documentElement;
    const isField = (el: Element): el is HTMLElement =>
      el instanceof HTMLElement && el.hasAttribute("data-field") && el !== bar && !bar.contains(el);
    const fields = new Set<HTMLElement>(
      Array.from(document.querySelectorAll<HTMLElement>("[data-field]")).filter(isField),
    );
    const underLine = new Set<Element>();
    let fieldIO: IntersectionObserver | null = null;

    const applyField = () => {
      let deepest: HTMLElement | null = null;
      for (const el of underLine) {
        if (!el.isConnected || !el.hasAttribute("data-field")) continue;
        if (!deepest || deepest.contains(el)) deepest = el as HTMLElement;
      }
      const field = deepest?.dataset.field ?? "paper";
      if (bar.dataset.field !== field) bar.dataset.field = field;
      // The page's scrollbar takes the same field (globals.css), so a classic
      // scrollbar never runs a paper stripe beside an ink chapter.
      if (root.dataset.barField !== field) root.dataset.barField = field;
      const tint = getComputedStyle(bar).getPropertyValue("--theme-color").trim();
      if (tint && themeMeta.content !== tint) themeMeta.content = tint;
    };

    const buildFieldIO = () => {
      fieldIO?.disconnect();
      underLine.clear();
      const h = Math.round(bar.getBoundingClientRect().height);
      const below = Math.max(0, window.innerHeight - h - 1);
      fieldIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) underLine.add(e.target);
            else underLine.delete(e.target);
          }
          applyField();
        },
        { rootMargin: `-${h}px 0px -${below}px 0px`, threshold: 0 },
      );
      fields.forEach((f) => fieldIO!.observe(f));
    };
    buildFieldIO();
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(buildFieldIO);
    };
    window.addEventListener("resize", onResize);

    // Fields that mount after hydration (a story panel swapped in, a stage
    // rendered on the client) are followed too, and removed ones forgotten:
    // the bar always takes the innermost field under its bottom line.
    const collect = (node: Node, into: HTMLElement[]) => {
      if (!(node instanceof HTMLElement)) return;
      if (isField(node)) into.push(node);
      node.querySelectorAll<HTMLElement>("[data-field]").forEach((el) => {
        if (isField(el)) into.push(el);
      });
    };
    const fieldMO = new MutationObserver((records) => {
      let changed = false;
      for (const r of records) {
        if (r.type === "attributes") {
          const el = r.target as HTMLElement;
          if (el === bar || bar.contains(el)) continue;
          if (isField(el) && el.isConnected && !fields.has(el)) {
            fields.add(el);
            fieldIO?.observe(el);
          } else if (!el.hasAttribute("data-field") && fields.delete(el)) {
            fieldIO?.unobserve(el);
            underLine.delete(el);
          }
          changed = true;
          continue;
        }
        const gone: HTMLElement[] = [];
        r.removedNodes.forEach((n) => collect(n, gone));
        for (const el of gone) {
          if (el.isConnected) continue;
          fields.delete(el);
          fieldIO?.unobserve(el);
          changed = underLine.delete(el) || changed;
        }
        const added: HTMLElement[] = [];
        r.addedNodes.forEach((n) => collect(n, added));
        for (const el of added) {
          if (fields.has(el) || !el.isConnected) continue;
          fields.add(el);
          fieldIO?.observe(el);
        }
      }
      if (changed) applyField();
    });
    fieldMO.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-field"],
    });
    cleanups.push(() => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRaf);
      fieldMO.disconnect();
      fieldIO?.disconnect();
      delete root.dataset.barField;
    });

    // ── 2. CTA hand-off ─────────────────────────────────────────────────
    const cta = bar.querySelector<HTMLElement>("[data-bar-cta]");
    if (cta && bar.dataset.cta !== "none") {
      const measure = () => {
        const gap = parseFloat(getComputedStyle(cta.parentElement!).columnGap) || 0;
        bar.style.setProperty("--handoff-x", `${cta.getBoundingClientRect().width + gap}px`);
      };
      // Measured before the first hand-off state lands (the links slide by it).
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(cta);
      cleanups.push(() => ro.disconnect());

      const targets = Array.from(document.querySelectorAll("[data-handoff]"));
      if (targets.length === 0) {
        bar.dataset.cta = "shown";
      } else {
        const inView = new Set<Element>();
        const barH = Math.round(bar.getBoundingClientRect().height);
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting && e.intersectionRatio >= 0.98) inView.add(e.target);
              else inView.delete(e.target);
            }
            bar.dataset.cta = inView.size > 0 ? "hidden" : "shown";
          },
          { rootMargin: `-${barH}px 0px 0px 0px`, threshold: [0, 0.98, 1] },
        );
        targets.forEach((t) => io.observe(t));
        cleanups.push(() => io.disconnect());
      }
    }

    // ── 3. Current chapter ──────────────────────────────────────────────
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-bar] [data-nav]"));
    const ids = Array.from(new Set(links.map((a) => a.dataset.nav!)));
    const chapters = ids
      .filter((id) => links.some((a) => a.getAttribute("href") === `#${id}`))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (chapters.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const id = (e.target as HTMLElement).id;
            for (const a of links) {
              if (a.dataset.nav !== id) continue;
              if (e.isIntersecting) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            }
          }
        },
        { rootMargin: "-40% 0px -60% 0px", threshold: 0 },
      );
      chapters.forEach((c) => io.observe(c));
      cleanups.push(() => io.disconnect());
    }

    // ── 4. Phone menu ───────────────────────────────────────────────────
    const menu = bar.querySelector<HTMLElement>("[data-menu]");
    if (menu) {
      // The toggle names its action ("Menu" / "Close"): aria-expanded and
      // the accessible name follow the popover from the synchronous
      // beforetoggle, so a reader landing back on it (Esc) hears "Menu,
      // collapsed" while the visible labels are still cross-fading. The
      // server leaves aria-expanded off: without JS the browser exposes the
      // popover invoker's state itself, which a static "false" would mask.
      const toggle = bar.querySelector<HTMLElement>("[data-menu-toggle]");
      const sync = (open: boolean) => {
        if (!toggle) return;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.querySelectorAll<HTMLElement>("[data-label]").forEach((label) => {
          const shown = (label.dataset.label === "close") === open;
          if (shown) label.removeAttribute("aria-hidden");
          else label.setAttribute("aria-hidden", "true");
        });
      };
      sync(menu.matches(":popover-open"));
      const onBeforeToggle = (e: Event) => sync((e as ToggleEvent).newState === "open");
      const onToggle = (e: Event) => {
        const open = (e as ToggleEvent).newState === "open";
        sync(open);
        if (open) menu.querySelector<HTMLElement>("a")?.focus();
      };
      const onClick = (e: MouseEvent) => {
        if ((e.target as Element).closest("a") && menu.matches(":popover-open")) menu.hidePopover();
      };
      menu.addEventListener("beforetoggle", onBeforeToggle);
      menu.addEventListener("toggle", onToggle);
      menu.addEventListener("click", onClick);
      cleanups.push(() => {
        menu.removeEventListener("beforetoggle", onBeforeToggle);
        menu.removeEventListener("toggle", onToggle);
        menu.removeEventListener("click", onClick);
      });
    }

    // ── 5. Language switch keeps the chapter ───────────────────────────
    const onSwitch = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-lang-switch]");
      if (!a) return;
      const url = new URL(a.href, location.href);
      const line = window.innerHeight * 0.4;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      url.hash = current && current !== sections[0] ? current.id : "";
      a.href = url.href;
    };
    document.addEventListener("click", onSwitch, true);
    cleanups.push(() => document.removeEventListener("click", onSwitch, true));

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
