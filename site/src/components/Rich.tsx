import { Fragment, type ReactNode } from "react";
import { caseHref, isCaseSlug, type Locale, type RichText } from "@/content";

/**
 * Renders dictionary RichText: **bold**, [label](case:<slug>), [label](https://...).
 * Use for any dictionary field typed RichText; plain strings render as-is.
 * Links are plain <a>: navigations between pages are full loads, so the
 * cross-document view transition (01 §6.6) runs.
 */
export function Rich({ text, locale }: { text: RichText; locale: Locale }) {
  return <>{parse(text, locale)}</>;
}

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function parse(text: string, locale: Locale): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) out.push(<Fragment key={key++}>{text.slice(last, index)}</Fragment>);
    if (m[1] !== undefined) {
      out.push(<strong key={key++}>{parse(m[1], locale)}</strong>);
    } else {
      const label = m[2];
      const target = m[3];
      if (target.startsWith("case:")) {
        const slug = target.slice(5);
        out.push(
          isCaseSlug(slug) ? (
            <a key={key++} href={caseHref(locale, slug)}>
              {label}
            </a>
          ) : (
            <Fragment key={key++}>{label}</Fragment>
          ),
        );
      } else {
        out.push(
          <a key={key++} href={target} target="_blank" rel="noopener noreferrer">
            {label}
          </a>,
        );
      }
    }
    last = index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return out;
}

/** Plain-text version (for meta tags, aria-labels). */
export function richToPlain(text: RichText): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}
