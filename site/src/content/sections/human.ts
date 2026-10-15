import type { Localized } from "../localized";

/**
 * Words of the `human` chapter (src/sections/Human/), EN + FR.
 * Claim: Off the clock he still builds: at the Cannes Film Festival he built an app that planned his three days.
 * Spec: .aaa/brief/design-spec/02-home.md §9.3 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * No year is printed anywhere in this chapter (the screens show 2026, the
 * legacy says 2025: an open item for Artem). `c_alt` and `c_film` alt text
 * and captions are `dict.media`. Interests come from the legacy
 * `T.interests`; there is no Letterboxd URL in the sources, so no link.
 *
 * Owned by the human section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */
export interface HumanCopy {
  /** 1 line from 390 up; U+00A0 inside the time (FR: U+202F around the h). */
  h2: string;
  /**
   * The H2 in parts, so the time is read in words:
   * <span aria-hidden>{time}</span><span class="visually-hidden">{spoken}</span> {rest}.
   * U+00A0 glues `rest`, so a 2-line H2 (EN on 7 columns, about 1024–1150) breaks only after the time.
   */
  h2Parts: { time: string; spoken: string; rest: string };
  /** ≤ 3 lines on 6 columns (measured). U+00A0 keeps “So I built” / « J'ai donc créé » whole, so no line ends on “I” or « J'ai ». */
  statement: string;
  /** Off the clock: body size, 48px under the statement (cols 1–5, ≤ 30em): 2 lines from 1024 up, EN and FR. */
  body: string;
  /** The Pan window's accessible name (role="img"): the counters exactly as on the screen. */
  panAlt: string;
  /** Under the window, 1–2 Small lines (U+00A0 keeps “planned it:” / « l'a planifiée » whole). Never "recording" or "video". */
  panCaption: string;
  /** Case link label, followed by `dict.projects.cannes.title` (body size, underlined, right after the note). */
  readCase: string;
}

export const human: Localized<HumanCopy> = {
  en: {
    h2: "7h\u00a056m in\u00a0the\u00a0dark",
    h2Parts: { time: "7h\u00a056m", spoken: "7 hours 56 minutes", rest: "in\u00a0the\u00a0dark" },
    statement:
      "At the Cannes Film Festival, screening times were everywhere and nowhere. So\u00a0I\u00a0built an app that planned my three days.",
    body: "Off the clock: tennis, volleyball, travel and the films I log on Letterboxd.",
    panAlt:
      "My app's plan for one festival day: 4 films, 7h 56m in the dark, 1 transfer, with the buses and meals timed between screenings.",
    panCaption: "One festival day as my app planned\u00a0it: buses, meals and films, all timed.",
    readCase: "Read the case:",
  },
  fr: {
    h2: "7 h 56 dans le noir",
    h2Parts: { time: "7\u202fh\u202f56", spoken: "7 heures 56", rest: "dans\u00a0le\u00a0noir" },
    statement:
      "Au Festival de Cannes, les horaires des\u00a0séances étaient partout et nulle part. J'ai\u00a0donc\u00a0créé une app qui a planifié mes trois jours.",
    body: "En dehors du travail : tennis, volley, voyages et les films que je note sur Letterboxd.",
    panAlt:
      "Le planning d'une journée de festival, généré par mon app : 4 films, 7 h 56 dans le noir, 1 transfert, avec les bus et les repas minutés entre les séances.",
    panCaption: "Une journée de festival telle que mon app l'a\u00a0planifiée : bus, repas et films, tout est minuté.",
    readCase: "Voir le projet :",
  },
};
