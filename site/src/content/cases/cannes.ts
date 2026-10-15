/**
 * Words for the cannes case, EN + FR (03-case-and-pages.md; final deck in
 * .aaa/brief/copy-deck.md). Owned by the case-study agent. Facts live in
 * ../projects.ts. Cover T: "3 days" over the type-set pair. No year and no
 * date anywhere (the screens show 2026, the legacy says 2025: open item for
 * Artem). Every value in the day strip is read off the app's own screens
 * (c_day, c_alt); the fourth film's title is cut off there, so it stays
 * a label. The source has no reflection: no retro chapter.
 */
import type { Localized } from "../localized";
import type { ProjectCopy } from "./types";

/** Day-strip arithmetic (03 §16): the bars sum to 476 minutes (7h 56m); after the skip, 337 (5h 37m). */
export const CANNES_DAY = {
  start: "08:45",
  end: "22:50",
  minutes: { plan: 476, skipped: 337 },
} as const;

export const cannes: Localized<ProjectCopy<"cannes">> = {
  en: {
    company: "Personal project",
    title: "A planner for Cannes",
    h1: "A planner\nfor Cannes",
    shortTitle: "Cannes planner",
    metricValue: "3 days",
    metricCaption: "planned by the app I built",
    tagline: "A personal schedule out of festival chaos.",
    meta: "Personal project, at the Cannes Film Festival",
    ogAlt: "A planner for Cannes: 3 festival days, planned by the app I built.",
    stats: { days: "Days planned", auto: "Schedule generation" },
    cover: {
      typeSet: { before: "A mess of listings", after: "one clear plan", spoken: "A mess of listings to one clear plan" },
      context: "My festival, before and after the app.",
    },
    lead: "Screening times were everywhere and nowhere.",
    contextBody:
      "I went to the Cannes Film Festival. Screenings were scattered across sources, with no single view and no search, so building my own schedule was painful.",
    actions: [
      "Pulled the festival's screening data into one place.",
      "Generated a personal schedule from my picks: what to watch, when and where.",
      "Added timed transfers, meals and breaks between films.",
      "Built in alternatives for some slots, each with a one-line note.",
    ],
    changedLead: "Every film, bus and meal on one timed plan.",
    pan: { openFull: "Open the full day plan" },
    dayStrip: {
      films: [
        { title: "Minotaur", time: "08:45–11:05", venue: "Cineum Aurore" },
        { title: "L'Inconnue", time: "13:45–16:04", venue: "Arcades 2" },
        { title: "Fatherland", time: "19:10–20:32", venue: "Arcades 1" },
        { title: "4th film", time: "until 22:50" },
      ],
      counters: {
        plan: [
          { value: "4", word: "films" },
          { value: "7h 56m", word: "in the dark" },
          { value: "1", word: "transfer" },
        ],
        skipped: [
          { value: "3", word: "films" },
          { value: "5h 37m", word: "in the dark" },
          { value: "1", word: "transfer" },
        ],
      },
      skip: "Skip “L'Inconnue”",
      keep: "Keep “L'Inconnue”",
      alternatives: [
        { title: "Victorian Psycho", time: "14:00–15:30", venue: "Debussy", note: "shorter, frees the evening" },
        { title: "Sheep in the Box", time: "14:00–16:06", venue: "Arcades 1", note: "if you catch a ticket" },
      ],
      noScript:
        "Skip “L'Inconnue” and the plan re-tallies to 3 films and 5h 37m in the dark, with two alternatives in its slot: “Victorian Psycho” (14:00–15:30, Debussy) and “Sheep in the Box” (14:00–16:06, Arcades 1).",
      caption: "One festival day from the plan, timed by the app.",
      sentence:
        "“Minotaur”, 08:45 to 11:05, Cineum Aurore; “L'Inconnue”, 13:45 to 16:04, Arcades 2; “Fatherland”, 19:10 to 20:32, Arcades 1; a fourth film until 22:50.",
    },
  },
  fr: {
    company: "Projet personnel",
    title: "Un planning pour Cannes",
    h1: "Un planning\npour Cannes",
    shortTitle: "Planning Cannes",
    metricValue: "3 jours",
    metricCaption: "planifiés par l'app que j'ai créée",
    tagline: "Un programme personnel, né du chaos du festival.",
    meta: "Projet personnel, au Festival de Cannes",
    ogAlt: "Un planning pour Cannes : 3 jours de festival, planifiés par l'app que j'ai créée.",
    stats: { days: "Jours planifiés", auto: "Planning automatique" },
    cover: {
      typeSet: {
        before: "Un fouillis d'horaires",
        after: "un planning clair",
        spoken: "D'un fouillis d'horaires à un planning clair",
      },
      context: "Mon festival, avant et après l'app.",
    },
    lead: "Les horaires des séances étaient partout et nulle part.",
    contextBody:
      "J'étais au Festival de Cannes. Les séances étaient éparpillées entre plusieurs sources, sans vue d'ensemble ni moteur de recherche : établir mon propre planning était pénible.",
    actions: [
      "J'ai rassemblé les données des séances du festival en un seul endroit.",
      "J'ai généré un planning personnel à partir de mes choix : quoi voir, quand et où.",
      "J'ai intégré au planning les trajets, les repas et les pauses entre les films, tous minutés.",
      "J'ai prévu des alternatives sur certains créneaux, chacune avec une courte note.",
    ],
    changedLead: "Chaque film, chaque bus, chaque repas sur un seul planning minuté.",
    pan: { openFull: "Ouvrir le planning complet" },
    dayStrip: {
      films: [
        { title: "Minotaur", time: "08:45–11:05", venue: "Cineum Aurore" },
        { title: "L'Inconnue", time: "13:45–16:04", venue: "Arcades 2" },
        { title: "Fatherland", time: "19:10–20:32", venue: "Arcades 1" },
        { title: "4e film", time: "jusqu'à 22\u202fh\u202f50" },
      ],
      counters: {
        plan: [
          { value: "4", word: "films" },
          { value: "7 h 56", word: "dans le noir" },
          { value: "1", word: "transfert" },
        ],
        skipped: [
          { value: "3", word: "films" },
          { value: "5 h 37", word: "dans le noir" },
          { value: "1", word: "transfert" },
        ],
      },
      skip: "Écarter « L'Inconnue »",
      keep: "Garder « L'Inconnue »",
      alternatives: [
        { title: "Victorian Psycho", time: "14:00–15:30", venue: "Debussy", note: "plus court, libère la soirée" },
        { title: "Sheep in the Box", time: "14:00–16:06", venue: "Arcades 1", note: "si vous trouvez un billet" },
      ],
      noScript:
        "Écartez « L'Inconnue » et le planning se recalcule : 3 films et 5\u202fh\u202f37 dans le noir, avec deux alternatives sur son créneau, « Victorian Psycho » (de 14\u202fh à 15\u202fh\u202f30, Debussy) et « Sheep in the Box » (de 14\u202fh à 16\u202fh\u202f06, Arcades 1).",
      caption: "Une journée de festival, telle que l'app l'a minutée.",
      sentence:
        "« Minotaur », de 8\u202fh\u202f45 à 11\u202fh\u202f05, Cineum Aurore ; « L'Inconnue », de 13\u202fh\u202f45 à 16\u202fh\u202f04, Arcades 2 ; « Fatherland », de 19\u202fh\u202f10 à 20\u202fh\u202f32, Arcades 1 ; un quatrième film jusqu'à 22\u202fh\u202f50.",
    },
  },
};
