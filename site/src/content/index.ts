/**
 * Content layer entry point. Components import from "@/content" only.
 *
 *   const dict = getDictionary(locale);
 *   dict.home.edge.h2                      (src/content/sections/edge.ts)
 *   dict.projects.havaianas.shortTitle     (src/content/cases/havaianas.ts)
 *   dict.chrome.emailMe                    (en.ts / fr.ts, shared)
 *   PROJECTS.havaianas.metric, PAIRS.dau   (shared facts)
 */
import { buildDictionary, type Dictionary } from "./dictionary";
import type { Locale } from "./locales";
import { polishDeep } from "./typography";

const DICTIONARIES: Record<Locale, Dictionary> = {
  en: polishDeep(buildDictionary("en"), "en"),
  fr: polishDeep(buildDictionary("fr"), "fr"),
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type {
  CaseStudyLabels,
  Dictionary,
  FreelanceCopy,
  HomeCopy,
  HomeSectionId,
  PairCopy,
  PairLabel,
  ProjectCopy,
  ProjectsCopy,
  RichText,
  SharedDictionary,
} from "./dictionary";
export type { Localized } from "./localized";
export * from "./locales";
export * from "./site";
export * from "./media";
export * from "./projects";
export * from "./profile";
export * from "./format";
export * from "./home";
export { localizeFigure, polishString } from "./typography";
export * from "./routes";
export * from "./stories";
