import { mailtoHref } from "@/content";
import type { ContactCopy } from "@/content/sections/contact";

/**
 * The composer's mail (02-home.md §10.1): four fields become a subject and
 * a body, and nothing else. Pure, so the sentence form and its tests share it.
 *
 * - Subject: "Product Owner role at {company}", or "Product Owner role"
 *   without a company.
 * - Body: the greeting, then one clause per filled field. The intro picks
 *   the form that matches what is filled ("I'm {name} at {company}." /
 *   "I'm {name}." / "I'm at {company}."); an empty field's clause drops out.
 * - A value that already ends a sentence (". ! ? …") keeps its own mark, so
 *   "Why is churn so high?" never becomes "…high?.".
 */
export const COMPOSER_FIELDS = ["name", "company", "role", "chaos"] as const;
export type ComposerField = (typeof COMPOSER_FIELDS)[number];
export type ComposerValues = Record<ComposerField, string>;

type ComposerCopy = ContactCopy["composer"];

const TERMINAL = /[.!?…]$/u;

/** Trim and collapse the whitespace a reader may paste in. */
function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/gu, " ").trim();
}

/** Replace each {key} in the template; drop the template's full stop after a value that ends a sentence. */
function fill(template: string, vars: Partial<ComposerValues>): string {
  return template.replace(/\{(\w+)\}(\.?)/gu, (_, key: string, stop: string) => {
    const value = vars[key as ComposerField] ?? "";
    return stop && TERMINAL.test(value) ? value : value + stop;
  });
}

export function composeMail(raw: Partial<ComposerValues>, copy: ComposerCopy) {
  const v: ComposerValues = {
    name: clean(raw.name),
    company: clean(raw.company),
    role: clean(raw.role),
    chaos: clean(raw.chaos),
  };
  const { body } = copy;

  const subject = v.company ? fill(copy.subjectWithCompany, v) : copy.subject;

  const intro = v.name && v.company
    ? body.intro
    : v.name
      ? body.introNameOnly
      : v.company
        ? body.introCompanyOnly
        : null;

  const clauses = [
    intro && fill(intro, v),
    v.role && fill(body.role, v),
    v.chaos && fill(body.chaos, v),
  ].filter((c): c is string => Boolean(c));

  // CRLF, as RFC 6068 asks of a mailto body.
  const text = [body.greeting, "", ...clauses].join("\r\n");
  return { subject, body: text, href: mailtoHref(subject, text) };
}
