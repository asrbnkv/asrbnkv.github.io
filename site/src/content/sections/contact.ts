import type { Localized } from "../localized";

/**
 * Words of the `contact` chapter (src/sections/Contact/), EN + FR.
 * Claim: He is one email away, and he wants the reader's mess: the close calls back his own line 'I turn commercial chaos into systems that teams rely on'.
 * Spec: .aaa/brief/design-spec/02-home.md §10.3 (copy deck, budgets).
 * Final deck: .aaa/brief/copy-deck.md.
 *
 * Links and the address come from SITE. Nothing is ever sent from the page:
 * the composer writes a mailto. Case pages reuse this chapter unchanged.
 *
 * Owned by the contact section agent: add, rename or remove fields freely; the
 * interface below is the only contract and TypeScript asks for both
 * languages. Facts used only by this chapter may live here too, as
 * exported constants. Type plain text: typography.ts curls apostrophes and
 * sets French spaces at load.
 */
export interface ContactCopy {
  /** 1 line on 9 columns. */
  h2: string;
  /** ≤ 2 lines on 7 columns (measured). */
  statement: string;
  /** Copy button label. */
  copy: string;
  /** Copy button label after copying (1.6s). */
  copied: string;
  /** aria-live announcement. */
  copiedLive: string;
  /** aria-live announcement when no clipboard exists and Copy selects the address instead. */
  selectedLive: string;
  composer: {
    /**
     * The fill-in sentence: five text parts around the four fields
     * (name, company, role, chaos): part 0, field, part 1, field, part 2,
     * field, part 3, field, part 4. ≤ 2 lines on 8 columns with empty fields.
     */
    sentence: readonly [string, string, string, string, string];
    /** The fields' accessible names and placeholders, in field order. */
    fieldNames: readonly [string, string, string, string];
    button: string;
    /** Small, under the button (aria-describedby). */
    note: string;
    /** Mailto subjects; {company} is replaced. */
    subject: string;
    subjectWithCompany: string;
    /**
     * The mail body, one clause per filled field, joined by line breaks.
     * {name}, {company}, {role}, {chaos} are replaced; a clause whose field
     * is empty is dropped (intro picks the form that matches what is filled).
     */
    body: {
      greeting: string;
      intro: string;
      introNameOnly: string;
      introCompanyOnly: string;
      role: string;
      chaos: string;
    };
    /** The no-JS fallback form: one textarea (label and placeholder). */
    fallback: { label: string; placeholder: string };
  };
  /** The three other ways, each with its one-line description. */
  ways: { linkedin: { label: string; note: string }; cv: { label: string; note: string }; ai: { label: string; note: string } };
}

export const contact: Localized<ContactCopy> = {
  en: {
    h2: "Send me your chaos",
    statement: "Requests piling up, reports that take days, clients about to leave: I've fixed all three. Tell me yours.",
    copy: "Copy",
    copied: "Copied",
    copiedLive: "Address copied",
    selectedLive: "Address selected",
    composer: {
      sentence: ["I'm", "at", ". The role:", ". The problem to solve:", "."],
      fieldNames: ["Your name", "Company", "Role", "The problem, in one sentence"],
      button: "Write the email",
      note: "Opens your email app. Nothing is sent from this page.",
      subject: "Product Owner role",
      subjectWithCompany: "Product Owner role at {company}",
      body: {
        greeting: "Hello Artem,",
        intro: "I'm {name} at {company}.",
        introNameOnly: "I'm {name}.",
        introCompanyOnly: "I'm at {company}.",
        role: "The role: {role}.",
        chaos: "The problem to solve, in one sentence: {chaos}.",
      },
      fallback: { label: "Your message", placeholder: "The role, the team, and your chaos in one sentence." },
    },
    ways: {
      linkedin: {
        label: "LinkedIn",
        note: "linkedin.com/in/srbnkv",
      },
      cv: {
        label: "Download CV",
        note: "One page, PDF, in French.",
      },
      ai: {
        label: "Talk to my AI twin",
        note: "A custom GPT built on my experience. Ask it about my work in French, English or Russian. Opens ChatGPT.",
      },
    },
  },
  fr: {
    h2: "Confiez-moi votre chaos",
    statement: "Demandes qui s'empilent, rapports qui prennent des jours, clients sur\u00a0le\u00a0départ : j'ai\u00a0réglé les trois. Et chez vous ?",
    copy: "Copier",
    copied: "Copié",
    copiedLive: "Adresse copiée",
    selectedLive: "Adresse sélectionnée",
    composer: {
      sentence: ["Je suis", ", chez", ". Le poste :", ". Le problème à résoudre :", "."],
      fieldNames: ["Votre nom", "Entreprise", "Poste", "Le problème, en une phrase"],
      button: "Écrire l'e-mail",
      note: "Ouvre votre messagerie. Rien n'est envoyé depuis cette page.",
      subject: "Poste de Product Owner",
      subjectWithCompany: "Poste de Product Owner chez {company}",
      body: {
        greeting: "Bonjour Artem,",
        intro: "Je suis {name}, chez {company}.",
        introNameOnly: "Je suis {name}.",
        introCompanyOnly: "Je travaille chez {company}.",
        role: "Le poste : {role}.",
        chaos: "Le problème à résoudre, en une phrase : {chaos}.",
      },
      fallback: { label: "Votre message", placeholder: "Le poste, l'équipe et votre chaos en une phrase." },
    },
    ways: {
      linkedin: {
        label: "LinkedIn",
        note: "linkedin.com/in/srbnkv",
      },
      cv: {
        label: "Télécharger le CV",
        note: "Une page, en PDF.",
      },
      ai: {
        label: "Parler à mon jumeau IA",
        note: "Un GPT personnalisé, nourri de mon parcours. Posez-\u2060lui vos questions sur mon travail, en français, en anglais ou en russe. S'ouvre dans ChatGPT.",
      },
    },
  },
};
