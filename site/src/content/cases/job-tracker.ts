/**
 * Words for the job-tracker case, EN + FR (03-case-and-pages.md; final deck
 * in .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts live in
 * ../projects.ts. Cover T: "1 click" over the span pair (nothing struck).
 * Never printed: the app's in-UI name. Action 3 names every AI feature the
 * sources show (the ai screen's four menu items plus the legacy follow-up
 * timing) without a count: no source says which five the legacy's "5 AI
 * actions" are. The roadmap body reads its plan off his own screen (closed
 * beta of 10–20 users, then open beta), in the past tense: the plan is not
 * captioned as current until Artem dates it. The status says only "the beta
 * is live" (the screen's own marker) until Artem confirms open beta. No stat row:
 * SSO and "beta" were features, not results (round 2).
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

export const jobTracker: Localized<ProjectCopy<"job-tracker">> = {
  en: {
    company: "Personal project",
    title: "An AI tracker for the job search",
    h1: "An AI tracker\nfor the job search",
    shortTitle: "Job-search tracker",
    metricValue: "1 click",
    metricCaption: "from a job post to a full AI analysis",
    tagline: "Designed and run like a product, from roadmap to beta.",
    meta: "Personal project, since 2025",
    ogAlt: "An AI tracker for the job search: 1 click from a job post to a full AI analysis.",
    stats: { aiActions: "AI actions per job", sso: "Accounts", beta: "Live now" },
    cover: {
      typeSet: { before: "A job post", after: "a full AI analysis", spoken: "From a job post to a full AI analysis" },
      context: "Paste a job link and let AI fill in the details.",
    },
    lead: "A job search spans many companies, stages and follow-up dates. Run\u00a0it by hand and you lose track.",
    contextBody:
      "No tool I tried tracked it the way I needed, so I built my own.",
    actions: [
      "Shipped a full MVP, with personal accounts and SSO.",
      "Built one-click job parsing from a URL.",
      "Added AI to every job: company research, a CV fit score, interview prep, a cover letter, and follow-up timing with ready-to-send text.",
      "Designed analytics by company, industry and status.",
      "Built a Chrome extension that captures a job when you apply.",
    ],
    changedLead: "The beta is live.",
    changedBody: "Next: automatic vacancy tracking, direct replies and auto follow-ups.",
    roadmap: {
      h2: "From MVP\nto launch",
      body: "The roadmap I drew up for it: the core MVP, then stabilisation, a closed beta of 10–20 users for feedback and an open beta before launch, with the Chrome extension built in parallel.",
      openFull: "Open the roadmap full size",
    },
    retro: {
      line: "Plan the migration from day one.",
      reason:
        "My account rollout wiped progress for users who were there before the beta.",
    },
  },
  fr: {
    company: "Projet personnel",
    title: "Un tracker IA de candidatures",
    h1: "Un tracker IA\nde candidatures",
    shortTitle: "Tracker IA",
    metricValue: "1 clic",
    metricCaption: "de l'offre à l'analyse IA complète",
    tagline: "Conçu et piloté comme un\u00a0produit, de la roadmap à la bêta.",
    meta: "Projet personnel, depuis 2025",
    ogAlt: "Un tracker IA de candidatures : 1 clic, de l'offre à l'analyse IA complète.",
    stats: { aiActions: "Actions IA par offre", sso: "Comptes", beta: "En ligne" },
    statValues: { beta: "Bêta" },
    cover: {
      typeSet: {
        before: "Une offre",
        after: "une analyse IA complète",
        spoken: "D'une offre à une analyse IA complète",
      },
      context: "Collez le lien d'une offre : l'IA remplit le reste.",
    },
    lead: "Une recherche d'emploi, c'est beaucoup d'entreprises, d'étapes et de dates de relance. À la main, on perd le fil.",
    contextBody:
      "Aucun des outils que j'ai essayés ne la suivait comme je le voulais : j'ai donc créé le mien.",
    actions: [
      "J'ai livré un MVP complet, avec comptes personnels et SSO.",
      "J'ai développé l'import d'une offre en un clic, à partir de son URL.",
      "J'ai ajouté l'IA à chaque offre : recherche sur l'entreprise, score d'adéquation du CV, préparation d'entretien, lettre de motivation et date de relance conseillée, avec un message prêt à envoyer.",
      "J'ai intégré des statistiques par entreprise, secteur et statut.",
      "J'ai créé une extension Chrome qui enregistre l'offre au moment où vous postulez.",
    ],
    changedLead: "La bêta est en ligne.",
    changedBody: "À venir : suivi automatique des offres, réponses directes et relances automatiques.",
    roadmap: {
      h2: "Du MVP\nau lancement",
      body: "La roadmap que j'ai établie : le MVP, puis la stabilisation, une bêta fermée de 10 à 20 utilisateurs pour recueillir des retours et une bêta ouverte avant le lancement, avec l'extension Chrome développée en parallèle.",
      openFull: "Agrandir la roadmap",
    },
    retro: {
      line: "Anticiper la migration.",
      reason:
        "En déployant les comptes, j'ai effacé la progression des premiers utilisateurs, arrivés avant la bêta. La migration a sa place dans la roadmap dès le premier jour.",
    },
  },
};
