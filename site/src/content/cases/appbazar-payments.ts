/**
 * Words for the appbazar-payments case, EN + FR (03-case-and-pages.md; final
 * deck in .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts
 * live in ../projects.ts. Cover C: 97% on its dot, over the 60–70% capsule.
 * The restructuring is told with one set of numbers (80+ partners, about
 * 97% kept); the retro says "every contract", with no number (the legacy
 * reflection says 90+). He rolled the payments out and onboarded the
 * partners; no source says he built the rails, so no line claims it.
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

export const appbazarPayments: Localized<ProjectCopy<"appbazar-payments">> = {
  en: {
    company: "AppBazar (MTS)",
    title: "Keeping 80+ partners on board",
    h1: "Keeping 80+\npartners on board",
    shortTitle: "AppBazar payments",
    metricCaption: "of clients kept through the restructuring",
    tagline: "Local payment rails, then every partner contract to save.",
    meta: "Product & Account Manager at\u00a0AppBazar\u00a0(MTS), Dec\u00a02022\u00a0–\u00a0Aug\u00a02023",
    ogAlt: "Keeping 80+ partners on board: 97% of clients kept through a restructuring, where management expected 60 to 70%.",
    stats: { churn: "First-year churn", expected: "Expected by management", onboarded: "Partners onboarded" },
    cover: {
      caption: "of clients kept through the restructuring",
      pair: {
        before: { value: "60–70%", text: "expected by management" },
        after: { value: "about 97%", text: "kept" },
        caption: "Clients kept through the restructuring. Scale 0 to 100%.",
        sentence:
          "About 97% of clients were kept through the restructuring, where management expected 60 to 70%, on a scale from 0 to 100%.",
      },
    },
    lead: "Russian users could not pay for apps through the App Store or Google Play.",
    contextBody:
      "The platform needed payment rails built on local methods, so that developers could earn on it. Then a restructuring put every partner contract at risk: payments would be cut off unless each contract was re-signed under a new entity.",
    actions: [
      "Rolled out payments on local methods: Russian cards, phone balance, partner bonuses and top-up cards.",
      "Onboarded 80+ partners: documentation, setup support and adoption tracking, roughly three weeks each.",
      "When a restructuring put every contract at risk, re-signed 80+ partners myself, through calls, emails and custom agreements.",
    ],
    sum: {
      terms: [
        { op: "", text: "Russian cards" },
        { op: "+", text: "Phone balance" },
        { op: "+", text: "Partner bonuses" },
        { op: "+", text: "Top-up cards" },
        { op: "=", text: "Local payments" },
      ],
      outputs: [{ text: "80+ partners onboarded, about three weeks each" }, { text: "Commissions lower than the App Store's" }],
      sentence:
        "Russian cards, phone balance, partner bonuses and top-up cards make up the local payment rails: 80+ partners onboarded in about three weeks each, on commissions lower than the App Store's.",
    },
    changedLead: "Management expected to keep 60 to 70% of clients. I kept about 97%.",
    changedBody:
      "80+ partners live and earning, on commissions lower than the App Store's. The CEOs flagged the result repeatedly, and the payment system was later extended to other ecosystem projects.",
    related: "More of my AppBazar work: [the product case](case:appbazar-product).",
    dotFields: {
      expected: "Expected by management: 60 to 70 in 100",
      kept: "Kept: about 97 in 100",
      note: "One dot, one per cent of clients.",
      sentence: "Two fields of 100 dots: management expected to keep 60 to 70 clients in 100, and about 97 in 100 were kept.",
    },
    statRow: [
      { value: "80+", caption: "partners onboarded" },
      { value: "about 3 weeks", caption: "per partner, to full adoption" },
    ],
    stories: [
      "As a Russian user, I want to pay for apps and in-app purchases with local methods (Russian cards, phone balance, partner bonuses, top-up cards), so that I can buy what I want when the App Store and Google Play don't accept my payments.",
      "As an app developer, I want a lower commission than the App Store's, so that I keep more revenue while reaching users I would otherwise lose.",
    ],
    retro: {
      line: "Write the playbook earlier.",
      reason: "The migration playbook, so that re-signing every contract didn't rest on me alone.",
    },
  },
  fr: {
    company: "AppBazar (MTS)",
    title: "Garder plus de 80 partenaires",
    h1: "Garder plus de\n80 partenaires",
    shortTitle: "Paiements AppBazar",
    metricCaption: "des clients conservés pendant la restructuration",
    tagline: "Des paiements locaux, puis tous les contrats partenaires à sauver.",
    meta: "Product & Account Manager chez\u00a0AppBazar\u00a0(MTS), déc.\u00a02022\u00a0–\u00a0août\u00a02023",
    ogAlt: "Garder plus de 80 partenaires : 97% des clients conservés pendant une restructuration, quand la direction en attendait 60 à 70%.",
    stats: { churn: "Churn la première année", expected: "Attendus par la direction", onboarded: "Partenaires intégrés" },
    cover: {
      caption: "des clients conservés pendant la restructuration",
      pair: {
        before: { value: "60–70%", text: "attendus par la direction" },
        after: { value: "environ 97%", text: "conservés" },
        caption: "Clients conservés pendant la restructuration. Échelle de 0 à 100%.",
        sentence:
          "Environ 97% des clients ont été conservés pendant la restructuration, quand la direction en attendait 60 à 70%, sur une échelle de 0 à 100%.",
      },
    },
    lead: "Les utilisateurs russes ne pouvaient pas payer leurs apps via l'App Store ou Google Play.",
    contextBody:
      "La plateforme devait accepter des moyens de paiement locaux pour que les développeurs puissent y gagner de l'argent. Puis une restructuration a mis tous les contrats partenaires en péril : sans re-signature au nom d'une nouvelle entité, les paiements seraient coupés.",
    actions: [
      "J'ai déployé le paiement par moyens locaux : cartes russes, solde mobile, bonus partenaires et cartes de recharge.",
      "J'ai intégré plus de 80 partenaires au système de paiement : documentation, aide au paramétrage et suivi de l'adoption, en trois semaines environ pour chacun.",
      "Quand une restructuration a mis tous les contrats en péril, j'ai re-signé moi-même ceux de plus de 80 partenaires, au téléphone, par e-mail et avec des accords sur mesure.",
    ],
    sum: {
      terms: [
        { op: "", text: "Cartes russes" },
        { op: "+", text: "Solde mobile" },
        { op: "+", text: "Bonus partenaires" },
        { op: "+", text: "Cartes de recharge" },
        { op: "=", text: "Paiements locaux" },
      ],
      outputs: [
        { text: "Plus de 80 partenaires intégrés, en trois semaines environ chacun" },
        { text: "Des commissions inférieures à celles de l'App Store" },
      ],
      sentence:
        "Cartes russes, solde mobile, bonus partenaires et cartes de recharge forment le paiement local : plus de 80 partenaires intégrés, en trois semaines environ chacun, avec des commissions inférieures à celles de l'App Store.",
    },
    changedLead: "La direction tablait sur 60 à 70% de clients conservés. J'en ai gardé environ 97%.",
    changedBody:
      "Plus de 80 partenaires actifs, qui généraient des revenus sur la plateforme avec des commissions inférieures à celles de l'App Store. La direction générale a souligné le résultat à plusieurs reprises, et le système de paiement a ensuite été étendu à d'autres projets de l'écosystème.",
    related: "Le reste de mon travail chez AppBazar : [l'étude de cas produit](case:appbazar-product).",
    dotFields: {
      expected: "Attendus par la direction : 60 à 70 sur 100",
      kept: "Conservés : environ 97 sur 100",
      note: "Un point, un pour cent des clients.",
      sentence:
        "Deux grilles de 100 points : la direction pensait conserver 60 à 70 clients sur 100 ; environ 97 sur 100 l'ont été.",
    },
    statRow: [
      { value: "80+", caption: "partenaires intégrés" },
      { value: "environ 3 semaines", caption: "par partenaire, jusqu'à l'adoption complète" },
    ],
    stories: [
      "En tant qu'utilisateur russe, je veux payer mes apps et mes achats in-app avec des moyens locaux (cartes russes, solde mobile, bonus partenaires, cartes de recharge), pour acheter ce qui me plaît quand l'App Store et Google Play n'acceptent pas mes paiements.",
      "En tant qu'éditeur d'apps, je veux une commission plus basse que celle de l'App Store, pour garder plus de revenus tout en touchant des utilisateurs que je perdrais sinon.",
    ],
    retro: {
      line: "Écrire le playbook plus tôt.",
      reason: "Le playbook de migration, pour que la re-signature de chaque contrat ne repose pas sur moi seul.",
    },
  },
};
