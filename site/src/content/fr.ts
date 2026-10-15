import type { SharedDictionary } from "./dictionary";
import { DISPLAY_NAME } from "./site";

/**
 * French dictionary. Source: legacy-content.json, with the missing accents
 * restored (données, à problème, dès le départ, système, état, réponse, ...)
 * and the register unified on "vous" (the legacy mixed "tu" and "vous").
 *
 * Write plain spaces and straight apostrophes: typography.ts adds the French
 * narrow no-break spaces before ? ! ; : and % and curls apostrophes at load.
 */
export const fr: SharedDictionary = {
  locale: "fr",

  meta: {
    siteTitle: "Artem Serebryannikov · Product Owner / Product Manager, Paris",
    siteDescription:
      "Product Owner à Paris, ancien Key Account Manager. DAU doublé en trois mois, environ 97% des clients conservés en pleine restructuration. Français, anglais, russe.",
    titleTemplate: "%s · Artem Serebryannikov",
    homeTitle: "Artem Serebryannikov · Product Owner / Product Manager, Paris",
    caseDescriptionTemplate: "%s Une étude de cas d'Artem Serebryannikov, Product Owner à Paris.",
    ogAlt: "Artem Serebryannikov, Product Owner, Paris.",
    ogLine: "Paris · français, anglais, russe",
  },

  common: {
    present: "depuis {from}",
    languageName: "Français",
    skipToContent: "Aller au contenu",
    to: "à",
    opensInNewTab: "(s'ouvre dans un nouvel onglet)",
  },

  chrome: {
    wordmark: DISPLAY_NAME,
    homeLabel: "Artem Serebryannikov, accueil",
    navLabel: "Principale",
    nav: {
      work: "Projets",
      method: "Méthode",
      about: "Parcours",
      contact: "Contact",
    },
    emailMe: "Écrivez-moi",
    emailSubject: "Poste de Product Owner",
    cv: "CV",
    cvLong: "Télécharger le CV",
    cvNote: "PDF",
    linkedin: "LinkedIn",
    aiTwin: "Parler à mon jumeau IA",
    aiTwinNote: "Un GPT personnalisé, nourri de mon parcours. Posez-lui vos questions sur mon travail, en français, en anglais ou en russe.",
    menu: "Menu",
    menuClose: "Fermer",
    menuLabel: "Menu",
    switchTo: {
      short: "EN",
      long: "English",
      label: "English version",
    },
    allWork: "Tous les projets",
  },

  person: {
    name: DISPLAY_NAME,
    role: "Product Owner / Product Manager",
    footerRole: "Product Owner / Product Manager · Paris",
    location: "Paris",
  },

  experience: {
    heading: "Expérience",
    items: {
      havaianas: {
        industry: "Retail",
        title: "Key Account Manager et chef de projet retail, Havaianas France",
        note: "Plus de 20 grands comptes retail en France, et le système d'analyse des ventes que j'ai créé de toutes pièces.",
      },
      appbazar: {
        industry: "SaaS / IT",
        title: "Product & Account Manager, AppBazar (MTS)",
        note: "Une marketplace d'apps mobiles avec paiements intégrés. Je pilotais la roadmap, plus de 90 comptes partenaires B2B, le CRM et le déploiement des paiements.",
      },
      freedomFinance: {
        industry: "Fintech",
        title: "Stage de Product Manager, Freedom Finance",
        note: "J'ai automatisé le reporting d'analyse des ordres sur Excel.",
      },
      freelance: {
        industry: "Web, design et IA",
        title: "Freelance web et IA",
        note: "Depuis oct. 2025 : l'IA intégrée aux workflows de design et de gestion de projet de mes clients, et mon tracker de candidatures, aujourd'hui en bêta. Depuis 2020 : plus de 15 sites et prototypes.",
      },
    },
  },

  education: {
    heading: "Formation",
    items: {
      icn: {
        title: "Master, ICN Business School, Paris",
        note: "Luxury & Design Management. Mémoire noté 18/20.",
      },
      erasmus: {
        title: "Erasmus, Avans University of Applied Sciences, Breda",
        note: "Business Leadership & Sustainability. Projet mené pour la municipalité.",
      },
      hse: {
        title: "Bachelor, Higher School of Economics, Moscou",
        note: "International Business Administration. Top 5% de la promotion.",
      },
    },
  },

  certifications: {
    heading: "Certifications produit",
    items: {
      google: "Google PM Certificate",
      tinkoff: "Tinkoff Product Analytics",
      alpha: "Alpha Product Manager",
      yandex: "Yandex School of Product Managers",
    },
  },

  skills: {
    heading: "Compétences et outils",
    filters: {
      all: "Tout",
      product: "Produit",
      account: "Grands comptes",
      data: "Data & Tech",
      design: "Design",
      ai: "IA",
      soft: "Savoir-être",
      lang: "Langues",
    },
    groups: {
      product: {
        label: "Produit",
        items: ["Roadmap", "User stories", "Backlog", "Tests A/B", "Analytics produit"],
      },
      metrics: {
        label: "Métriques",
        items: ["DAU", "MAU", "LTV", "Taux de churn", "MRR", "Conversion", "NPS"],
      },
      account: {
        label: "Gestion des grands comptes",
        items: [
          "Rétention client",
          "Négociation B2B",
          "Onboarding",
          "Cross-sell & upsell",
          "Santé des comptes",
          "Gestion du pipeline et des parties prenantes",
        ],
      },
      data: {
        label: "Data",
        items: ["Excel avancé", "Power BI", "SQL", "Python", "Google Sheets"],
      },
      crmTools: {
        label: "CRM et gestion de projet",
        items: ["Salesforce", "HubSpot", "Notion", "Monday", "Jira", "Trello"],
      },
      design: {
        label: "Design",
        items: ["Figma", "UI et prototypage", "Branding et identité visuelle", "Webflow", "Tilda"],
      },
      ai: {
        label: "IA",
        items: ["Claude", "ChatGPT", "Gemini", "Copilot", "Lovable"],
      },
      soft: {
        label: "Savoir-être",
        items: [
          "Résistant au stress",
          "Structuré",
          "Autonome",
          "Force de proposition",
          "Esprit critique",
          "Apprentissage rapide",
          "Communication transverse",
        ],
      },
      languages: {
        label: "Langues",
        items: ["Français courant", "Anglais bilingue", "Russe, langue maternelle"],
      },
    },
  },

  languages: {
    fr: { name: "Français", level: "Courant" },
    en: { name: "Anglais", level: "Bilingue" },
    ru: { name: "Russe", level: "Langue maternelle" },
  },

  media: {
    roadmap: {
      alt: "La roadmap de mon tracker de candidatures, environ cinq mois de la livraison du MVP au lancement public : MVP et stabilisation terminés, une bêta fermée puis une bêta ouverte, l'extension Chrome développée en parallèle, et un repère indiquant que la bêta est en ligne.",
      caption: "Roadmap produit : environ cinq mois, de la livraison du MVP au lancement public",
    },
    add: {
      alt: "Le formulaire New application du tracker : collez le lien d'une offre, cliquez sur Auto-fill et l'IA remplit le reste.",
      caption: "Ajouter une candidature : collez le lien de l'offre, l'IA remplit le reste",
    },
    ai: {
      alt: "Le menu IA d'une candidature dans le tracker : Analyse match, Interview prep, Cover letter et Research company.",
      caption: "L'IA sur chaque candidature : analyse du match, préparation d'entretien, lettre de motivation, recherche sur l'entreprise",
    },
    c_day: {
      alt: "Le planning d'une journée de festival dans mon app Cannes : 4 films, 7\u202fh\u202f56 dans le noir, 1 transfert. « Minotaur » à 8\u202fh\u202f45, « L'Inconnue » à 13\u202fh\u202f45 et « Fatherland » à 19\u202fh\u202f10, avec les bus et les repas minutés entre les séances.",
      caption: "Le planning d'une journée : séances, trajets et repas, tout est minuté",
    },
    c_rhythm: {
      alt: "Le planning d'une autre journée dans mon app Cannes : 5 films, 10\u202fh\u202f55 dans le noir, 1 transfert, et « Victorian Psycho » marqué comme facultatif.",
      caption: "Le rythme d'une autre journée : cinq films, 10\u202fh\u202f55 dans le noir",
    },
    c_alt: {
      alt: "Mon app Cannes, une fois le film « L'Inconnue » écarté : la journée se recalcule à 3 films et 5\u202fh\u202f37 dans le noir, et deux autres films sont proposés sur son créneau, « Victorian Psycho » et « Sheep in the Box ».",
      caption: "Un film écarté, et deux autres proposés sur le\u00A0même créneau",
    },
    c_alt_slot: {
      alt: "« L'Inconnue » barré à 13:45, et les deux films proposés sur son créneau : « Victorian Psycho », 14:00–15:30 à Debussy, et « Sheep in the Box », 14:00–16:06 aux Arcades 1.",
      caption: "Un film écarté, et deux autres proposés sur le\u00A0même créneau",
    },
    c_film: {
      alt: "La fiche d'un film dans mon app Cannes : « Victorian Psycho », Un Certain Regard, 90 minutes, de 15\u202fh\u202f15 à 16\u202fh\u202f45, aux Arcades 3, avec un synopsis et une raison de le voir.",
      caption: "La fiche d'un film : synopsis, pourquoi le\u00A0voir, horaire et salle",
    },
    ab_feed: {
      alt: "L'app grand public d'AppBazar, en russe : le fil, avec un jeu de sport mis en avant et une rangée de jeux gratuits par genre.",
      caption: "AppBazar : la marketplace grand public, avec paiements intégrés",
    },
    fl_slide: {
      alt: "Un collage de mes travaux freelance : pages de sites, catalogue de boutique, slides de présentation, logos, posts pour les réseaux et visuels publicitaires, dont une bannière de soldes de mobilier.",
      caption: "Sélection de travaux freelance : sites, identités de marque, slides et visuels publicitaires",
    },
    portrait: {
      alt: "Artem Serebryannikov",
    },
  },

  notFound: {
    metaTitle: "Page introuvable",
    title: "Cette page n'est pas dans le backlog.",
    home: "Retour à l'accueil",
    work: "Voir les projets",
  },
};
