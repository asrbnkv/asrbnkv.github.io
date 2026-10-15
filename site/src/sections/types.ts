import type { Dictionary, Locale, RouteKey } from "@/content";

/**
 * Every section receives the locale and its dictionary. No section reads
 * the URL, fetches, or hard-codes copy: all words come from `dict`
 * (its own words: dict.home.<id>), all facts from "@/content".
 */
export interface SectionProps {
  locale: Locale;
  dict: Dictionary;
  /** The page the section is on (the footer's language switch keeps it). Default: home. */
  route?: RouteKey;
}
