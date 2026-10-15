import { casesCopy, type CaseStudyLabels, type FreelanceCopy, type ProjectsCopy } from "./cases";
import { en } from "./en";
import { fr } from "./fr";
import type { Locale } from "./locales";
import type { MediaId } from "./media";
import type {
  CertificationId,
  EducationId,
  ExperienceId,
  SkillFilterId,
  SkillGroupId,
} from "./profile";
import { homeCopy, type HomeCopy } from "./sections";
import type { SpokenLanguage } from "./site";

/**
 * The dictionary, composed per locale from three kinds of word modules:
 *
 *   SharedDictionary   en.ts / fr.ts: chrome, meta, profile labels, media
 *                      alt text, the 404. Content/design-system owner.
 *   dict.home.<id>     src/content/sections/<id>.ts, one per home chapter.
 *                      Each section agent owns its own module.
 *   dict.projects,     src/content/cases/<slug>.ts + labels.ts. The
 *   .freelance,        case-study agent owns that folder.
 *   .caseStudy
 *
 * getDictionary(locale) (index.ts) returns buildDictionary(locale) after
 * typography.ts has polished every string.
 */

/**
 * Inline rich text. Plain string with two markups, rendered by <Rich>:
 *   **bold**                 -> <strong>
 *   [label](case:<slug>)     -> link to a case study in the current locale
 *   [label](https://...)     -> external link
 * No raw HTML.
 */
export type RichText = string;

/** Words that belong to no single chapter: implemented by en.ts and fr.ts. */
export interface SharedDictionary {
  locale: Locale;

  meta: {
    /** og:site_name and JSON-LD name. */
    siteTitle: string;
    /** Default meta description. */
    siteDescription: string;
    /** <title> template for inner pages, "%s" = page title. */
    titleTemplate: string;
    homeTitle: string;
    /** Description template for case pages, "%s" = case tagline. */
    caseDescriptionTemplate: string;
    /** Alt text of the home's social card (03 §13). */
    ogAlt: string;
    /** The social card's bottom line: city and languages (03 §13). */
    ogLine: string;
  };

  common: {
    /** An ongoing period: a word after the dash ("2020–now"), or a template with {from} ("depuis 2020"). */
    present: string;
    /** Name of this language, written in itself ("English", "Français"). */
    languageName: string;
    skipToContent: string;
    /** Read in place of a type-set pair's drawing: "Days to hours". */
    to: string;
    /** Opens in a new tab (screen-reader suffix). */
    opensInNewTab: string;
  };

  /** The bar, the phone menu and the controls every page shares (01 §7.2–7.5). */
  chrome: {
    /** The bar's wordmark ("Artëm Serebryannikov", the font's own ë). */
    wordmark: string;
    /** Accessible name of the wordmark link. */
    homeLabel: string;
    /** Accessible name of the main navigation landmark. */
    navLabel: string;
    nav: { work: string; method: string; about: string; contact: string };
    /** The primary action, and the subject its mailto writes. */
    emailMe: string;
    emailSubject: string;
    /** The bar's short CV link, its long form, and what the file is. */
    cv: string;
    cvLong: string;
    cvNote: string;
    linkedin: string;
    aiTwin: string;
    aiTwinNote: string;
    /** Phone menu button and its sheet's name. */
    menu: string;
    /** The same button's label while the sheet is open. */
    menuClose: string;
    menuLabel: string;
    /** The language switch, written in the TARGET language (it carries lang). */
    switchTo: { short: string; long: string; label: string };
    /** "All work" link (case pages, 404). */
    allWork: string;
  };

  person: {
    /**
     * The one visible spelling of his name, with the font's own ë: the bar's
     * wordmark, the footer row, the menu, the 404. Machine-readable places
     * (title, meta, JSON-LD, alt, aria-label) keep the plain "Artem" of
     * SITE.name, as recruiters and search read it (02 §1, argument §3.9).
     */
    name: string;
    /** Role line, positioning confirmed by the user: lead with Product Owner. */
    role: string;
    /** Footer role line. */
    footerRole: string;
    location: string;
  };

  experience: {
    heading: string;
    items: Record<ExperienceId, { industry: string; title: string; note: string }>;
  };

  education: {
    heading: string;
    items: Record<EducationId, { title: string; note: string }>;
  };

  certifications: {
    heading: string;
    items: Record<CertificationId, string>;
  };

  skills: {
    heading: string;
    filters: Record<SkillFilterId, string>;
    groups: Record<SkillGroupId, { label: string; items: readonly string[] }>;
  };

  languages: Record<SpokenLanguage, { name: string; level: string }>;

  /** Alt text (required) and caption (optional) for every image in MEDIA. */
  media: Record<MediaId, { alt: string; caption?: string }>;

  /** The bilingual 404 (03 §11). */
  notFound: {
    /** Document title part ("Page not found"). */
    metaTitle: string;
    /** The h1 line at the statement step. */
    title: string;
    home: string;
    work: string;
  };
}

/** The full dictionary every component receives. */
export interface Dictionary extends SharedDictionary {
  /** One group per home chapter + the shared pair words. */
  home: HomeCopy;
  projects: ProjectsCopy;
  freelance: FreelanceCopy;
  caseStudy: CaseStudyLabels;
}

const SHARED: Record<Locale, SharedDictionary> = { en, fr };

/** Compose a locale's dictionary from its modules (unpolished; see index.ts). */
export function buildDictionary(locale: Locale): Dictionary {
  return { ...SHARED[locale], home: homeCopy(locale), ...casesCopy(locale) };
}

export type { CaseStudyLabels, FreelanceCopy, ProjectCopy, ProjectsCopy } from "./cases";
export type { HomeCopy, HomeSectionId } from "./sections";
export type { PairCopy, PairLabel } from "./pairs";
