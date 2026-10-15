import type { Localized } from "../localized";

/**
 * Words of the `proof` chapter (src/sections/Proof/), EN + FR.
 * Claim: What he shipped moved the numbers: DAU +100% in three months, upsell 2× in one season, about 97% of clients kept where management expected 60–70%, and 80+ accounts on one system.
 * Spec: .aaa/brief/design-spec/02-home.md §3.8 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Figures are shared facts (`FIGURES` in home.ts); pair labels and hidden
 * sentences are the shared `dict.home.pairs.dau` (scene A) and
 * `.retention` (scene C); the stat values of scene A are
 * `PROJECTS["appbazar-product"].stats`; the quote is
 * `dict.projects.havaianas.quote.text`.
 *
 * Owned by the proof section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

/** The head of a scene: the measure (h3, statement step) and its case reference (Small). */
export interface SceneHead {
  /** Names the measure; 1 line on 5 columns at 1440. */
  h3: string;
  /** Company, case and years. */
  ref: string;
}

export interface ProofCopy {
  /** The centred title card (the page's one rest). ≤ 2 lines. */
  h2: string;
  /** ≤ 2 lines on 7 columns. */
  statement: string;
  /**
   * Scene A, over its scale: +100%. `copy` is the mess the number ends
   * (the AppBazar product case's context lead, verbatim from the final deck),
   * so A keeps the title card's promise like B, C and D. `stats` are the stat
   * row's captions, in the order of PROJECTS["appbazar-product"].stats
   * (+40%, <5%, 90+).
   */
  a: SceneHead & { copy: string; stats: readonly [string, string, string] };
  /**
   * Scene B, quote poster: 2×. `copy` ≤ 40 words; `attribution` is the
   * quote's figcaption; `quoteMarks` wrap dict.projects.havaianas.quote.text
   * (“ ” in English, « » in French: typography.ts adds the U+202F inside).
   */
  b: SceneHead & {
    copy: string;
    /** "~~Days~~ ●—● hours": the consolidation the copy starts from, as the deck words it on the Havaianas cover and in the stories (01 §7.7; `joiner` is read in place of the inline pair). */
    typeSet: { before: string; after: string; joiner: string };
    attribution: string;
    quoteMarks: readonly [string, string];
  };
  /** Scene C, on its dot: about 97%. `copy` ≤ 40 words, ≤ 6 lines on 4 columns. */
  c: SceneHead & { copy: string };
  /**
   * Scene D, unit field: 80+. `typeSet` is "~~No CRM~~ ●—● 80+ accounts on
   * one system" (`spoken` is how it reads); `fieldCaption` sits under the
   * 80-dot field, `fieldSentence` is its visually hidden sentence.
   */
  d: SceneHead & {
    copy: string;
    typeSet: { before: string; after: string; spoken: string };
    fieldCaption: string;
    fieldSentence: string;
    markets: string;
    marketsCaption: string;
  };
  /** Case link label (plus a visually hidden case title). */
  readCase: string;
  /** Joins the label and the hidden case title: "Read the case: Requests in, priorities out". */
  readCaseSep: string;
}

export const proof: Localized<ProofCopy> = {
  en: {
    h2: "Shipped, then measured",
    statement: "Four cases from AppBazar and Havaianas. Each\u00a0starts with a\u00a0mess and ends with a number.",
    a: {
      h3: "Daily active users, first three months",
      ref: "AppBazar (MTS), product and roadmap, 2022–23",
      copy: "Client needs, partner requests and engineering work lived in separate worlds.",
      stats: ["MAU", "churn", "B2B partners"],
    },
    b: {
      h3: "Upsell nearly doubled in one season",
      ref: "Havaianas France, sales intelligence, 2023–25",
      copy: "Sell-in, sell-out and stock arrived every week from different sources and took days to consolidate. My model combined them and showed the team where to upsell, based on stock.",
      typeSet: { before: "Days", after: "hours", joiner: "to" },
      attribution: "Managers at Havaianas",
      quoteMarks: ["“", "”"],
    },
    c: {
      h3: "Clients kept through a restructuring",
      ref: "AppBazar (MTS), payments and contracts, 2022–23",
      copy: "The restructuring put every partner contract at risk. Management expected to keep 60\u00a0to\u00a070%. I\u00a0re-signed 80+ partners myself, through calls, emails and custom agreements.",
    },
    d: {
      h3: "B2B accounts on one system",
      ref: "AppBazar (MTS), CRM from zero, 2022–23",
      copy: "I designed the data model, stages and workflows in Salesforce, with Notion for docs and Slack for alerts. The whole commercial team adopted it.",
      typeSet: {
        before: "No CRM",
        after: "the team's daily tool",
        spoken: "No CRM to the team's daily tool",
      },
      fieldCaption: "One dot, one account. 80 dots for 80+ accounts.",
      fieldSentence: "80 dots, one per account: 80+ B2B accounts on one CRM.",
      markets: "China, Spain, Poland, India",
      marketsCaption: "Four markets on one pipeline.",
    },
    readCase: "Read the case",
    readCaseSep: ": ",
  },
  fr: {
    h2: "Livré, puis mesuré",
    statement: "Quatre projets, chez\u00a0AppBazar et Havaianas. Chacun part du\u00a0désordre et aboutit à un chiffre.",
    a: {
      h3: "DAU sur les trois premiers mois",
      ref: "AppBazar (MTS), produit et roadmap, 2022–2023",
      copy: "Clients, partenaires et équipe tech vivaient chacun dans leur monde.",
      stats: ["MAU", "churn", "partenaires B2B"],
    },
    b: {
      h3: "Upsell presque doublé en une saison",
      ref: "Havaianas France, intelligence commerciale, 2023–2025",
      copy: "Chaque semaine, sell-in, sell-out et stock arrivaient de sources différentes, et il fallait des jours pour les consolider. Mon modèle les réunissait et montrait à l'équipe où faire de l'upsell, selon le stock.",
      typeSet: { before: "Des jours", after: "quelques\u00a0heures", joiner: "à" },
      attribution: "Les managers de Havaianas",
      quoteMarks: ["«", "»"],
    },
    c: {
      h3: "Clients conservés malgré une restructuration",
      ref: "AppBazar (MTS), paiements et contrats, 2022–2023",
      copy: "La restructuration mettait en péril tous les contrats partenaires. La direction pensait en conserver 60\u00a0à\u00a070%. J'ai re-signé moi-même les contrats de plus de 80 partenaires, au téléphone, par e-mail et avec des accords sur mesure.",
    },
    d: {
      h3: "Comptes B2B dans un seul CRM",
      ref: "AppBazar (MTS), CRM créé de toutes pièces, 2022–2023",
      copy: "J'ai conçu le modèle de données, les étapes et les workflows dans Salesforce, avec Notion pour la doc et Slack pour les alertes. Toute l'équipe commerciale a adopté le CRM.",
      typeSet: {
        before: "Aucun CRM",
        after: "l'outil quotidien de l'équipe",
        spoken: "Aucun CRM, puis l'outil quotidien de l'équipe",
      },
      fieldCaption: "Un point, un compte : 80 points pour plus de 80 comptes.",
      fieldSentence: "80 points, un par compte : plus de 80 comptes B2B dans un seul CRM.",
      markets: "Chine, Espagne, Pologne, Inde",
      marketsCaption: "Quatre marchés, un seul pipeline.",
    },
    readCase: "Voir le projet",
    readCaseSep: "\u00a0: ",
  },
};
