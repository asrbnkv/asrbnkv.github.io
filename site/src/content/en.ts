import type { SharedDictionary } from "./dictionary";
import { DISPLAY_NAME } from "./site";

/**
 * English dictionary. Source: .aaa/brief/legacy-content.json (T, PROJECTS,
 * EXPERIENCE, ...). Legacy all-caps labels are stored in sentence case:
 * casing is presentation. Legacy arrows ("→", "←") are dropped: arrows are
 * presentation too.
 *
 * Straight apostrophes are fine here: typography.ts curls them at load.
 */
export const en: SharedDictionary = {
  locale: "en",

  meta: {
    siteTitle: "Artem Serebryannikov · Product Owner / Product Manager, Paris",
    siteDescription:
      "Product Owner in Paris, ex-Key Account Manager. DAU doubled in three months, about 97% of clients kept through a restructuring. French, English, Russian.",
    titleTemplate: "%s · Artem Serebryannikov",
    homeTitle: "Artem Serebryannikov · Product Owner / Product Manager, Paris",
    caseDescriptionTemplate: "%s A case study by Artem Serebryannikov, Product Owner in Paris.",
    ogAlt: "Artem Serebryannikov, Product Owner, Paris.",
    ogLine: "Paris · French, English, Russian",
  },

  common: {
    present: "now",
    languageName: "English",
    skipToContent: "Skip to content",
    to: "to",
    opensInNewTab: "(opens in a new tab)",
  },

  chrome: {
    wordmark: DISPLAY_NAME,
    homeLabel: "Artem Serebryannikov, home",
    navLabel: "Main",
    nav: {
      work: "Work",
      method: "Method",
      about: "About",
      contact: "Contact",
    },
    emailMe: "Email me",
    emailSubject: "Product Owner role",
    cv: "CV",
    cvLong: "Download CV",
    cvNote: "PDF, in French",
    linkedin: "LinkedIn",
    aiTwin: "Talk to my AI twin",
    aiTwinNote: "A custom GPT built on my experience. Ask it about my work in French, English or Russian.",
    menu: "Menu",
    menuClose: "Close",
    menuLabel: "Menu",
    switchTo: {
      short: "FR",
      long: "Français",
      label: "version française",
    },
    allWork: "All work",
  },

  person: {
    name: DISPLAY_NAME,
    role: "Product Owner / Product Manager",
    footerRole: "Product Owner / Product Manager · Paris",
    location: "Paris",
  },

  experience: {
    heading: "Experience",
    items: {
      havaianas: {
        industry: "Retail",
        title: "Key Account Manager and retail project lead, Havaianas France",
        note: "20+ major French retail accounts, and the sales analytics system I built from zero.",
      },
      appbazar: {
        industry: "SaaS / IT",
        title: "Product & Account Manager, AppBazar (MTS)",
        note: "A mobile-app marketplace with integrated payments. I owned the roadmap, 90+ B2B partner accounts, the CRM and the payment rollout.",
      },
      freedomFinance: {
        industry: "Fintech",
        title: "Product Manager intern, Freedom Finance",
        note: "I automated the order-analysis reporting system in Excel.",
      },
      freelance: {
        industry: "Web, design and AI",
        title: "Freelance web and AI",
        note: "Since Oct 2025: AI built into clients’ design and project workflows, and my job-search tracker, now in beta. Since 2020: 15+ sites and prototypes.",
      },
    },
  },

  education: {
    heading: "Education",
    items: {
      icn: {
        title: "Master's, ICN Business School, Paris",
        note: "Luxury & Design Management. Thesis 18/20.",
      },
      erasmus: {
        title: "Erasmus, Avans University of Applied Sciences, Breda",
        note: "Business Leadership & Sustainability. Led a project for the city council.",
      },
      hse: {
        title: "Bachelor's, Higher School of Economics, Moscow",
        note: "International Business Administration. Top 5% of the programme.",
      },
    },
  },

  certifications: {
    heading: "Product certifications",
    items: {
      google: "Google PM Certificate",
      tinkoff: "Tinkoff Product Analytics",
      alpha: "Alpha Product Manager",
      yandex: "Yandex School of Product Managers",
    },
  },

  skills: {
    heading: "Skills & tools",
    filters: {
      all: "All",
      product: "Product",
      account: "Account",
      data: "Data & Tech",
      design: "Design",
      ai: "AI",
      soft: "Soft",
      lang: "Languages",
    },
    groups: {
      product: {
        label: "Product",
        items: ["Roadmap", "User stories", "Backlog", "A/B testing", "Product analytics"],
      },
      metrics: {
        label: "Metrics",
        items: ["DAU", "MAU", "LTV", "Churn rate", "MRR", "Conversion", "NPS"],
      },
      account: {
        label: "Account management",
        items: [
          "Client retention",
          "B2B negotiation",
          "Onboarding",
          "Cross-sell & upsell",
          "Account health",
          "Pipeline & stakeholder management",
        ],
      },
      data: {
        label: "Data",
        items: ["Advanced Excel", "Power BI", "SQL", "Python", "Google Sheets"],
      },
      crmTools: {
        label: "CRM and delivery",
        items: ["Salesforce", "HubSpot", "Notion", "Monday", "Jira", "Trello"],
      },
      design: {
        label: "Design",
        items: ["Figma", "UI and prototyping", "Branding and visual identity", "Webflow", "Tilda"],
      },
      ai: {
        label: "AI",
        items: ["Claude", "ChatGPT", "Gemini", "Copilot", "Lovable"],
      },
      soft: {
        label: "Soft skills",
        items: [
          "Stress-resistant",
          "Structured",
          "Autonomous",
          "Proactive",
          "Critical thinking",
          "Fast learner",
          "Cross-team communication",
        ],
      },
      languages: {
        label: "Languages",
        items: ["French (fluent)", "English (bilingual)", "Russian (native)"],
      },
    },
  },

  languages: {
    fr: { name: "French", level: "Fluent" },
    en: { name: "English", level: "Bilingual" },
    ru: { name: "Russian", level: "Native" },
  },

  media: {
    roadmap: {
      alt: "My job-search tracker's roadmap, about five months from the shipped MVP to public launch: MVP and stabilisation done, a closed beta then an open beta, the Chrome extension built in parallel, and a marker saying the beta is live.",
      caption: "Product roadmap: about five months, from the shipped MVP to public launch",
    },
    add: {
      alt: "The tracker's New application form: paste a job link, press Auto-fill, and AI fills in the details.",
      caption: "Add an application: paste a job link, AI fills in the details",
    },
    ai: {
      alt: "The tracker's AI menu on an application: Analyse match, Interview prep, Cover letter and Research company.",
      caption: "AI on every application: match analysis, interview prep, cover letter, company research",
    },
    c_day: {
      alt: "My Cannes planner, showing one festival day: 4 films, 7h\u00a056m in the dark, 1 transfer. “Minotaur” at 08:45, “L'Inconnue” at 13:45 and “Fatherland” at 19:10, with buses and meals timed in between.",
      caption: "One day's plan: screenings, transfers and meals, all timed",
    },
    c_rhythm: {
      alt: "My Cannes planner, showing another festival day: 5 films, 10h\u00a055m in the dark, 1 transfer, with “Victorian Psycho” marked optional.",
      caption: "Another day's rhythm: five films, 10h\u00a055m in the dark",
    },
    c_alt: {
      alt: "My Cannes planner with “L'Inconnue” skipped: the day re-tallies to 3 films and 5h\u00a037m in the dark, and two alternatives fill its slot, “Victorian Psycho” and “Sheep in the Box”.",
      caption: "A skipped film, and the two alternatives in its slot",
    },
    c_alt_slot: {
      alt: "“L'Inconnue” struck out at 13:45, and the two alternatives in its slot: “Victorian Psycho”, 14:00–15:30 at Debussy, and “Sheep in the Box”, 14:00–16:06 at Arcades 1.",
      caption: "A skipped film, and the two alternatives in its slot",
    },
    c_film: {
      alt: "A film card in my Cannes planner: “Victorian Psycho”, Un Certain Regard, 90 minutes, 15:15–16:45 at Arcades 3, with a synopsis and a reason to see it.",
      caption: "A film card: synopsis, why see it, time and venue",
    },
    ab_feed: {
      alt: "AppBazar's consumer app, in Russian: the feed, with a featured sports game and a row of free games by genre.",
      caption: "AppBazar: the consumer marketplace, with integrated payments",
    },
    fl_slide: {
      alt: "A collage of my freelance work: website pages, a shop catalogue, presentation slides, logos, social posts and ad creatives, including a furniture sale banner.",
      caption: "Selected freelance work: sites, brand identities, slides and ad creatives",
    },
    portrait: {
      alt: "Artem Serebryannikov",
    },
  },

  notFound: {
    metaTitle: "Page not found",
    title: "This page isn't in the backlog.",
    home: "Back to the home page",
    work: "See the work",
  },
};
