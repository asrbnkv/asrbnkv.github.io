import type { Locale } from "./locales";

/**
 * A user story as three hanging clauses (01 §7.10, 02 §0.3 item 2):
 * "As a" / "I want" / "so that" (FR "En tant que" / "je veux" / "pour que").
 * Concatenating each label and text gives back the original sentence
 * exactly (joinStory), so the legacy wording is never changed.
 */
export interface StoryClause {
  /** The hanging word(s), set in Small, muted. */
  label: string;
  /** The clause itself, with its trailing comma or full stop. */
  text: string;
}

const PATTERNS: Record<Locale, RegExp> = {
  en: /^(As an?) (.+?,) (I want) (.+?,) (so that|so) (.+)$/,
  fr: /^(En tant qu(?:e |['’])) ?(.+?,) (je veux|j['’]aimerais) (.+?,) (pour que|pour|afin que|afin de) (.+)$/,
};

/** Split a story sentence into its three clauses, or null if it does not follow the form. */
export function splitStory(sentence: string, locale: Locale): [StoryClause, StoryClause, StoryClause] | null {
  const m = sentence.match(PATTERNS[locale]);
  if (!m) return null;
  return [
    { label: m[1].trimEnd(), text: m[2] },
    { label: m[3], text: m[4] },
    { label: m[5], text: m[6] },
  ];
}

/** The inverse of splitStory: label + text, joined as the sentence was written. */
export function joinStory(clauses: readonly StoryClause[]): string {
  return clauses
    .map((c) => (/['’]$/.test(c.label) ? `${c.label}${c.text}` : `${c.label} ${c.text}`))
    .join(" ");
}
