import type { PairId } from "../home";
import type { Localized } from "../localized";
import type { CaseSlug } from "../projects";

/**
 * Words of the `edge` chapter (src/sections/Edge/), EN + FR.
 * Claim: He has sat in the client's chair: he managed the accounts whose requests fill a backlog and turned what they asked for into user stories and systems.
 * Spec: .aaa/brief/design-spec/02-home.md §2.2 and §2.4 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Owned by the edge section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */

export type StoryId = "b2bPartner" | "user" | "salesAnalyst" | "manager" | "russianUser" | "developer";

/**
 * The six stories, in the order every surface shows them (02 §2.2). The
 * story sentence itself is `dict.projects[case].stories[story]` (legacy wording),
 * split into hanging clauses with `splitStory`. `visual` is the shared pair
 * drawn under the story (`PAIRS[visual]` + `dict.home.pairs[visual]`), the
 * type-set pair (`typeSet` below), or nothing.
 */
/** The three cases the stories come from (each has `stories` in dict.projects). */
export type StoryCase = Extract<CaseSlug, "appbazar-product" | "havaianas" | "appbazar-payments">;

export const EDGE_STORIES: readonly {
  id: StoryId;
  case: StoryCase;
  story: 0 | 1;
  visual: PairId | "typeSet" | null;
}[] = [
  { id: "b2bPartner", case: "appbazar-product", story: 0, visual: "mau" },
  { id: "user", case: "appbazar-product", story: 1, visual: "abWording" },
  { id: "salesAnalyst", case: "havaianas", story: 0, visual: "typeSet" },
  { id: "manager", case: "havaianas", story: 1, visual: null },
  { id: "russianUser", case: "appbazar-payments", story: 0, visual: null },
  { id: "developer", case: "appbazar-payments", story: 1, visual: "retention" },
];

export interface StoryCopy {
  /** The row (tab or accordion button): the persona as the story names it. */
  persona: string;
  /** Company, in Small at the row's end (under the persona below 1280px). */
  company: string;
  /** "What I built": ≤ 150 characters EN, 175 FR. */
  built: string;
  /** "What happened": ≤ 130 characters EN, 150 FR. */
  happened: string;
}

export interface EdgeCopy {
  /** ≤ 2 lines everywhere (1 line measured from 390 up). */
  h2: string;
  /** About 25 words (EN 24, FR 26); ≤ 3 lines on 7 columns at 1440 and on 8 at 1100 (measured); FR 5 lines at 390. */
  statement: string;
  /** One line of Small under each client group. */
  clientsContext: { retail: string; partners: string };
  /** Invitation to pick a story (`#stories-invite`, names the tablist); ≤ 2 lines on 7 columns. */
  invite: string;
  /** Panel column heading. */
  whatIBuilt: string;
  /** Panel column heading. */
  whatHappened: string;
  /** Case link label, followed by the case title (`dict.projects[case].title`). */
  readCase: string;
  /** The six stories' row and panel words. */
  stories: Record<StoryId, StoryCopy>;
  /** The sales analyst's type-set pair: struck "Days", then "hours" (01 §7.7; the wording the legacy site and the CV share), and its Small caption. */
  typeSet: {
    before: string;
    after: string;
    caption: string;
    /** Read by assistive tech in place of the inline pair ("Days to hours"). */
    joiner: string;
  };
}

export const edge: Localized<EdgeCopy> = {
  en: {
    h2: "I also speak client",
    statement:
      "At AppBazar, the MTS app store, I\u00a0translated the\u00a0requests of\u00a090+\u00a0partners into user stories. At\u00a0Havaianas, the data of\u00a020+\u00a0retail accounts into decisions.",
    clientsContext: {
      retail: "Five of the 20+ retail accounts I managed at Havaianas France, 2023–25.",
      partners:
        "Four of the 90+ B2B partners I managed at AppBazar (MTS), 2022–23. With Tencent, I closed an exclusive publishing agreement.",
    },
    invite: "Pick a user story to see what I\u00a0did and what happened next.",
    whatIBuilt: "What I did",
    whatHappened: "What happened",
    readCase: "Read the case:",
    stories: {
      b2bPartner: {
        persona: "As a B2B partner",
        company: "AppBazar (MTS)",
        built: "A loop from 90+ partners’ requests to user stories, specs and a RICE-style roadmap, run in two-week sprints.",
        happened: "The roadmap ran on partner demand, and MAU grew 40%.",
      },
      user: {
        persona: "As a user",
        company: "AppBazar (MTS)",
        built: "The subscription, shipped with engineering: in-game currency and bonuses, then A/B tests on its screens, button labels and copy.",
        happened: "The winning wording converted about 50% better at sign-up.",
      },
      salesAnalyst: {
        persona: "As a sales analyst",
        company: "Havaianas",
        built: "One model linking sell-in, sell-out and stock, with dashboards by product, store and region, and upsell recommendations from stock.",
        happened: "Weekly data work fell from days to hours, and upsell results nearly doubled in one season.",
      },
      manager: {
        persona: "As a manager",
        company: "Havaianas",
        built: "A semi-automated model in Excel and Power BI, documented in full so the team could run it every week, without me.",
        happened: "The whole France team relied on it daily, and European development managers flagged it as genuinely useful.",
      },
      russianUser: {
        persona: "As a Russian user",
        company: "AppBazar (MTS)",
        built: "The payment rollout on those local methods, for apps and in-app purchases on AppBazar.",
        happened: "The payment system went live and was later extended to other projects in the MTS ecosystem.",
      },
      developer: {
        persona: "As an app developer",
        company: "AppBazar (MTS)",
        built: "Onboarding for 80+ partners, with documentation, setup support and adoption tracking, on commissions below the App Store's.",
        happened: "Through a restructuring, about 97% of clients stayed, where management expected 60 to 70%.",
      },
    },
    typeSet: { before: "Days", after: "hours", caption: "Weekly data work, per person.", joiner: "to" },
  },
  fr: {
    h2: "Je parle aussi client",
    statement:
      "Chez AppBazar, l'app store de\u00a0MTS, j'ai traduit les\u00a0demandes de plus\u00a0de\u00a090 partenaires en\u00a0user\u00a0stories. Chez Havaianas, les\u00a0données de plus\u00a0de\u00a020 comptes en décisions.",
    clientsContext: {
      retail: "Cinq comptes retail parmi les plus de 20 que je gérais chez Havaianas France, 2023–2025.",
      partners:
        "Quatre partenaires parmi les plus de 90 que je gérais chez AppBazar (MTS), 2022–2023. Avec Tencent, j'ai conclu un accord d'édition exclusif.",
    },
    invite: "Choisissez une user story : vous verrez ce que j'ai mis en place et ce qui a changé ensuite.",
    whatIBuilt: "Ce que j'ai mis en place",
    whatHappened: "Ce qui a changé",
    readCase: "Voir le projet :",
    stories: {
      b2bPartner: {
        persona: "En tant que partenaire B2B",
        company: "AppBazar (MTS)",
        built: "Une boucle produit : les demandes de plus de 90 partenaires devenaient des user stories, des specs, puis une roadmap priorisée façon RICE, livrée en sprints de deux semaines.",
        happened: "La roadmap suivait la demande des partenaires, et le MAU a progressé de 40%.",
      },
      user: {
        persona: "En tant qu'utilisateur",
        company: "AppBazar (MTS)",
        built: "L'abonnement, livré avec l'équipe tech : monnaie virtuelle et bonus, puis des tests A/B sur ses écrans, ses libellés de boutons et ses textes.",
        happened: "La formulation gagnante a obtenu un taux de conversion à l'inscription supérieur d'environ 50%.",
      },
      salesAnalyst: {
        persona: "En tant qu'analyste des ventes",
        company: "Havaianas",
        built: "Un seul modèle reliant sell-in, sell-out et stock, avec des tableaux de bord par produit, magasin et région, et des recommandations d'upsell en fonction du stock.",
        happened: "Le traitement hebdomadaire des données est passé de plusieurs jours à quelques heures, et l'upsell a presque doublé en une saison.",
      },
      manager: {
        persona: "En tant que manager",
        company: "Havaianas",
        built: "Un modèle semi-automatisé sous Excel et Power BI, entièrement documenté pour que l'équipe le fasse tourner chaque semaine, sans moi.",
        happened: "Toute l'équipe France s'appuyait sur l'outil au quotidien, et des responsables du développement en Europe l'ont jugé vraiment utile.",
      },
      russianUser: {
        persona: "En tant qu'utilisateur russe",
        company: "AppBazar (MTS)",
        built: "Le déploiement des paiements par ces moyens locaux, pour les apps comme pour les achats in-app sur AppBazar.",
        happened: "Le système de paiement a été mis en service, puis étendu à d'autres projets de l'écosystème MTS.",
      },
      developer: {
        persona: "En tant qu'éditeur d'apps",
        company: "AppBazar (MTS)",
        built: "L'intégration de plus de 80 partenaires, avec documentation, aide au paramétrage et suivi de l'adoption, avec des commissions inférieures à celles de l'App Store.",
        happened: "Malgré une restructuration, environ 97% des clients sont restés, quand la direction en attendait 60 à 70%.",
      },
    },
    typeSet: {
      before: "Des jours",
      after: "quelques heures",
      caption: "Traitement hebdomadaire des données, par personne.",
      joiner: "à",
    },
  },
};
