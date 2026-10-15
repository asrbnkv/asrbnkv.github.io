import type { Locale } from "./locales";

/**
 * Typographic polish applied to every dictionary string at load, so authors
 * can type plain text:
 *  - all locales: straight apostrophe between letters -> ’ (U+2019)
 *  - all locales: non-breaking hyphen (U+2011) inside short compounds whose
 *    halves should never part at a line end ("RICE-style", "sell-in",
 *    "in-app", "re-signed", "e-mail", "job-search", "Claude-powered", and
 *    every X-to-Y compound: "ready-to-send", "end-to-end"). Both shipping
 *    subsets map U+2011 to their hyphen glyph (.aaa/derived/fonts/make-fonts.py).
 *  - fr: narrow no-break space (U+202F) before ? ! ; and %, no-break space
 *        (U+00A0) before : (only when the colon is followed by a space or
 *        ends the string, so URLs and "case:" links are untouched), and
 *        U+202F inside guillemets: « le dieu d'Excel » (03 §12)
 *  - fr: no-break space (U+00A0) between a numeral and the word after it
 *        (« plus de 90 partenaires », « 3 jours »), so no line starts with a
 *        bare noun
 */
const NNBSP = " ";
const NBSP = " ";

const NBHY = "\u2011";
const TIGHT_COMPOUNDS =
  /\b(?:RICE-style|two-week|sell-in|sell-out|in-app|in-game|top-up|front-end|back-end|sign-up|follow-ups?|re-sign|re-tallies|e-mail|e-commerce|on-brand|one-click|job-search|Claude-powered|[A-Za-z]+-to-[A-Za-z]+\b)/gi;

export function polishString(text: string, locale: Locale): string {
  let s = text
    .replace(/(\p{L})'(?=\p{L})/gu, "$1’")
    .replace(TIGHT_COMPOUNDS, (m) => m.replace(/-/g, NBHY));
  if (locale === "fr") {
    s = s
      .replace(/(\S)[   ]?([?!;])(?=\s|$|\*)/g, `$1${NNBSP}$2`)
      .replace(/(\S)[   ]?:(?=\s|$)/g, `$1${NBSP}:`)
      .replace(/(\d)[   ]?%/g, `$1${NNBSP}%`)
      .replace(/«[   ]?/g, `«${NNBSP}`)
      .replace(/[   ]?»/g, `${NNBSP}»`)
      .replace(/(\d) (?=\p{L})/gu, `$1${NBSP}`);
  }
  return s;
}

/** Recursively polish every string in a value, preserving its type. */
export function polishDeep<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return polishString(value, locale) as T;
  if (Array.isArray(value)) return value.map((v) => polishDeep(v, locale)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = polishDeep(v, locale);
    return out as T;
  }
  return value;
}

/** Write a shared figure ("97%", "+40%") the way a locale expects. */
export function localizeFigure(value: string, locale: Locale): string {
  return locale === "fr" ? value.replace(/(\d)[   ]?%/g, `$1${NNBSP}%`) : value;
}
