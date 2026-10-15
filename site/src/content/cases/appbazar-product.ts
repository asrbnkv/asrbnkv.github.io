/**
 * Words for the appbazar-product case, EN + FR (03-case-and-pages.md; final
 * deck in .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts
 * (numbers, years, stack) live in ../projects.ts; this file holds words.
 * Cover P: +100% over its scale. Every number here traces to
 * content-source.md (the $2M Playrix activation and the partner deals come
 * from the CV). MAU +40% has no period in the sources, so its pair says
 * "before" and "after", never "same period". The headline is the PO's
 * judgment (requests in, priorities out), not the input; the stat row holds
 * only figures the sources state (no count of the named partner deals).
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

export const appbazarProduct: Localized<ProjectCopy<"appbazar-product">> = {
  en: {
    company: "AppBazar (MTS)",
    title: "Requests in, priorities out",
    h1: "Requests in,\npriorities out",
    shortTitle: "AppBazar product",
    metricCaption: "DAU in the first three months",
    tagline: "90+ B2B partners, one RICE-style roadmap, two-week sprints.",
    meta: "Product & Account Manager at\u00a0AppBazar\u00a0(MTS), Dec\u00a02022\u00a0–\u00a0Aug\u00a02023",
    ogAlt: "Requests in, priorities out: +100% DAU in the first three months.",
    stats: { mau: "MAU", churn: "Churn", partners: "B2B partners" },
    cover: {
      pair: {
        before: { value: "×1", text: "at the start" },
        after: { value: "×2", text: "three months in" },
        caption: "Daily active users (DAU), first three months. Scale 0 to ×2.",
        sentence: "Daily active users at AppBazar (MTS) went from ×1 to ×2 in the first three months, on a scale from 0 to ×2.",
      },
    },
    lead: "Client needs, partner requests and engineering work lived in separate worlds.",
    contextBody:
      "AppBazar was a mobile-app marketplace inside the MTS telecom ecosystem: an App Store with local payment methods, and a subscription. I was the link between the commercial side, 90+ B2B partners and the product team, and there was no structured way to turn what partners asked for into prioritised product work.",
    names: {
      items: [
        { name: "Tencent", note: "exclusive publishing agreement" },
        { name: "NetEase", note: "contract" },
        { name: "MiHoYo", note: "contract" },
        { name: "Playrix", note: "$2M marketing activation" },
      ],
      caption: "International partnerships I negotiated and closed",
    },
    actions: [
      "Ran the product loop end to end, with engineering, marketing, legal, sales and finance.",
      "Turned requests from 90+ B2B partners into user stories and specs in the backlog, and prioritised them on the roadmap.",
      "Shipped the subscription, with in-game currency and bonuses.",
    ],
    month: {
      caption:
        "A typical month of the loop: a call with engineering every working day, sprint planning every two weeks, a product review every month.",
      sentence:
        "One month of the loop at AppBazar (MTS), drawn as 20 working days: a call with engineering every working day, sprint planning every two weeks, and a product review once a month.",
    },
    prioritization:
      "I prioritised the roadmap with a RICE-style lens: reach, impact, confidence, effort. Partner requests touching the most installs and revenue for the least build shipped first.",
    changedLead: "DAU doubled in the first three months, and MAU grew 40%.",
    changedBody: "The roadmap ran on client demand.",
    abTest:
      "I A/B tested the subscription screens, button labels and copy on the front end. The winning wording converted about 50% better at sign-up.",
    pairs: {
      changed: {
        before: { value: "×1", text: "before" },
        after: { value: "×1.4", text: "after" },
        caption: "Monthly active users (MAU), before and after. Scale 0 to ×2.",
        sentence: "Monthly active users at AppBazar (MTS) grew 40%, from ×1 to ×1.4, on a scale from 0 to ×2.",
      },
      tested: {
        before: { value: "×1", text: "the other wording" },
        after: { value: "about ×1.5", text: "the winning wording" },
        caption: "Sign-up conversion by wording, front-end A/B test. Scale 0 to ×2.",
        sentence: "The winning wording converted about 50% better than the other: about ×1.5, on a scale from 0 to ×2.",
      },
    },
    statRow: [
      { value: "under 5%", caption: "churn" },
      { value: "90+", caption: "B2B partners" },
    ],
    stories: [
      "As a B2B partner, I want my feature requests to reach the product team and land on the roadmap, so that the marketplace evolves around what actually drives my installs and revenue.",
      "As a user, I want one subscription that gives in-game currency and bonuses across apps, so that I can access paid content and perks without paying full price for each.",
    ],
    retro: {
      line: "Prioritise harder.",
      reason: "The roadmap tried to please too many partners at once. Fewer, bigger bets would have moved the metrics more.",
    },
  },
  fr: {
    company: "AppBazar (MTS)",
    title: "Des demandes aux priorités",
    h1: "Des demandes\naux priorités",
    shortTitle: "Produit AppBazar",
    metricCaption: "de DAU sur les trois premiers mois",
    tagline: "Plus de 90 partenaires B2B, une roadmap façon RICE, des sprints de deux semaines.",
    meta: "Product & Account Manager chez\u00a0AppBazar\u00a0(MTS), déc.\u00a02022\u00a0–\u00a0août\u00a02023",
    ogAlt: "Des demandes aux priorités : +100% de DAU sur les trois premiers mois.",
    stats: { mau: "MAU", churn: "Churn", partners: "Partenaires B2B" },
    cover: {
      pair: {
        before: { value: "×1", text: "au départ" },
        after: { value: "×2", text: "trois mois plus tard" },
        caption: "Utilisateurs actifs quotidiens (DAU), trois premiers mois. Échelle de 0 à ×2.",
        sentence:
          "Le nombre d'utilisateurs actifs quotidiens d'AppBazar (MTS) a doublé sur les trois premiers mois : de ×1 à ×2, sur une échelle de 0 à ×2.",
      },
    },
    lead: "Clients, partenaires et équipe tech vivaient chacun dans leur monde.",
    contextBody:
      "AppBazar était une marketplace d'applications mobiles au sein de l'écosystème télécom MTS : un App Store avec des moyens de paiement locaux, et un abonnement. J'étais le lien entre l'équipe commerciale, plus de 90 partenaires B2B et l'équipe produit, et rien ne transformait les demandes des partenaires en priorités produit.",
    names: {
      items: [
        { name: "Tencent", note: "accord d'édition exclusif" },
        { name: "NetEase", note: "contrat" },
        { name: "MiHoYo", note: "contrat" },
        { name: "Playrix", note: "activation marketing de 2 M$" },
      ],
      caption: "Partenariats internationaux négociés et conclus",
    },
    actions: [
      "J'ai piloté la boucle produit de bout en bout, avec l'équipe tech, le marketing, le juridique, les ventes et la finance.",
      "J'ai transformé les demandes de plus de 90 partenaires B2B en user stories et en specs dans le backlog, puis je les ai priorisées dans la roadmap.",
      "J'ai lancé l'abonnement, avec monnaie virtuelle et bonus.",
    ],
    month: {
      caption:
        "Un mois type de la boucle : un appel avec l'équipe tech chaque jour ouvré, un sprint planning tous les quinze jours, une revue produit chaque mois.",
      sentence:
        "Un mois de la boucle chez AppBazar (MTS), représenté en 20 jours ouvrés : un appel avec l'équipe tech chaque jour ouvré, un sprint planning tous les quinze jours et une revue produit par mois.",
    },
    prioritization:
      "J'ai priorisé la roadmap en m'inspirant de la méthode RICE (reach, impact, confidence, effort) : d'abord les demandes partenaires les plus porteuses en installations et en revenus, pour un minimum de développement.",
    changedLead: "Le DAU a doublé sur les trois premiers mois, et le MAU a progressé de 40%.",
    changedBody:
      "La roadmap suivait la demande client.",
    abTest:
      "J'ai testé en A/B les écrans d'abonnement, les libellés de boutons et les textes. À l'inscription, la formulation gagnante a obtenu un taux de conversion supérieur d'environ 50%.",
    pairs: {
      changed: {
        before: { value: "×1", text: "avant" },
        after: { value: "×1,4", text: "après" },
        caption: "Utilisateurs actifs mensuels (MAU), avant et après. Échelle de 0 à ×2.",
        sentence:
          "Le nombre d'utilisateurs actifs mensuels d'AppBazar (MTS) a augmenté de 40% : de ×1 à ×1,4, sur une échelle de 0 à ×2.",
      },
      tested: {
        before: { value: "×1", text: "l'autre formulation" },
        after: { value: "environ ×1,5", text: "la formulation gagnante" },
        caption: "Conversion à l'inscription selon la formulation (test A/B). Échelle de 0 à ×2.",
        sentence:
          "La formulation gagnante a obtenu un taux de conversion supérieur d'environ 50% à celui de l'autre : environ ×1,5, sur une échelle de 0 à ×2.",
      },
    },
    statRow: [
      { value: "moins de 5%", caption: "de churn" },
      { value: "90+", caption: "partenaires B2B" },
    ],
    stories: [
      "En tant que partenaire B2B, je veux que mes demandes de fonctionnalités parviennent à l'équipe produit et soient inscrites à la roadmap, pour que la marketplace évolue en fonction de ce qui génère vraiment mes installations et mes revenus.",
      "En tant qu'utilisateur, je veux un abonnement unique qui m'offre monnaie virtuelle et bonus dans plusieurs apps, pour accéder au contenu payant et aux avantages sans payer plein tarif à chaque fois.",
    ],
    retro: {
      line: "Prioriser plus radicalement.",
      reason:
        "La roadmap voulait contenter trop de partenaires à la fois. Moins de paris, mais plus ambitieux, auraient davantage fait bouger les indicateurs.",
    },
  },
};
