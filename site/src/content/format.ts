import { LOCALE_META, type Locale } from "./locales";

/** A span of years. `to` omitted = a single year; "present" = ongoing. */
export type Period = { from: number; to?: number | "present" };
/** A single month, ISO "YYYY-MM". */
export type MonthDate = { month: `${number}-${number}${number}` };
export type DateValue = Period | MonthDate;

export function isMonthDate(d: DateValue): d is MonthDate {
  return "month" in d;
}

/**
 * Format a period with an en dash: "2023–2025", "2025–" style is avoided;
 * ongoing periods use the dictionary's "present": a word after the dash
 * ("2020–now"), or a template with {from} ("depuis 2020", French).
 * `short` gives "2023–25".
 */
export function formatPeriod(
  p: Period,
  presentWord: string,
  opts: { short?: boolean } = {},
): string {
  if (p.to === undefined || p.to === p.from) return String(p.from);
  if (p.to === "present") {
    return presentWord.includes("{from}")
      ? presentWord.replace("{from}", String(p.from))
      : `${p.from}–${presentWord}`;
  }
  const to =
    opts.short && Math.floor(p.to / 100) === Math.floor(p.from / 100)
      ? String(p.to).slice(2)
      : String(p.to);
  return `${p.from}–${to}`;
}

/** "Jan 2026" / "janv. 2026". */
export function formatMonth(m: MonthDate, locale: Locale): string {
  const [y, mo] = m.month.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, mo - 1, 1)));
}

export function formatDate(d: DateValue, locale: Locale, presentWord: string): string {
  return isMonthDate(d) ? formatMonth(d, locale) : formatPeriod(d, presentWord);
}

/** Machine-readable value for <time dateTime>. */
export function dateTimeAttr(d: DateValue): string {
  return isMonthDate(d) ? d.month : String(d.from);
}
