/**
 * Locales. English is served at "/", French at "/fr/".
 * Adding a locale means: a new Dictionary implementation, a new route group
 * in src/app, and an entry here.
 */
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<
  Locale,
  {
    /** Value for <html lang> and hreflang. */
    htmlLang: string;
    /** Open Graph locale. */
    ogLocale: string;
    /** URL prefix ("" for the default locale). No trailing slash. */
    prefix: string;
    /** Intl locale for number and date formatting. */
    intl: string;
  }
> = {
  en: { htmlLang: "en", ogLocale: "en_GB", prefix: "", intl: "en-GB" },
  fr: { htmlLang: "fr", ogLocale: "fr_FR", prefix: "/fr", intl: "fr-FR" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}
