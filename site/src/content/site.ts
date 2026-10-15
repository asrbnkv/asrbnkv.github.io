/**
 * The one VISIBLE spelling of his name (wordmark, footer row, menu, 404),
 * with the font's own ë, as the legacy wordmark wrote it (Artëm, the Russian
 * ё). Machine-readable places (title, meta, JSON-LD, alt, aria-label) keep
 * SITE.name, the plain "Artem" recruiters and search use.
 */
export const DISPLAY_NAME = "Artëm Serebryannikov";

/**
 * Locale-independent identity and links. Facts only: every value here traces
 * to .aaa/brief/content-source.md or legacy-content.json.
 * Never add his phone number.
 */
export const SITE = {
  /** Canonical origin (GitHub Pages user site). No trailing slash. */
  url: "https://asrbnkv.github.io",
  name: "Artem Serebryannikov",
  givenName: "Artem",
  familyName: "Serebryannikov",
  /** Legacy wordmark, with the Russian ё. Optional to use. */
  wordmark: "Artëm.",
  city: "Paris",
  email: "asrbnkv@gmail.com",
  links: {
    email: "mailto:asrbnkv@gmail.com",
    linkedin: "https://www.linkedin.com/in/srbnkv/",
    /** Custom GPT "AI twin", answers in FR / EN / RU. */
    aiTwin: "https://chatgpt.com/g/g-68fb50401e788191a88c482d0a39606d-ai-rtem",
  },
  /** How links are written out when shown as text. */
  display: {
    linkedin: "linkedin.com/in/srbnkv",
  },
  cv: {
    /** Served from public/. */
    href: "/Artem_Serebryannikov_CV.pdf",
    downloadName: "Artem_Serebryannikov_CV.pdf",
  },
} as const;

/**
 * A mailto URL with a written subject (and optional body), URL-encoded.
 * The primary action everywhere: <ButtonLink href={mailtoHref(dict.chrome.emailSubject)}>.
 */
export function mailtoHref(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${SITE.email}${params.length ? `?${params.join("&")}` : ""}`;
}

/** Languages he speaks (labels live in the dictionary under `languages`). */
export const SPOKEN_LANGUAGES = ["fr", "en", "ru"] as const;
export type SpokenLanguage = (typeof SPOKEN_LANGUAGES)[number];
