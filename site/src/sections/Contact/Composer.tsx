"use client";

import clsx from "clsx";
import { Fragment, useRef, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/Button";
import { SITE } from "@/content";
import type { ContactCopy } from "@/content/sections/contact";
import t from "@/styles/type.module.css";
import { COMPOSER_FIELDS, composeMail, type ComposerField } from "./composeMail";
import styles from "./Contact.module.css";
import { NoteSentences } from "./NoteSentences";

/**
 * The composer (02-home.md §10.1, graft #8): a fill-in letter that writes
 * the email, set at the statement step. Four real fields sit in the
 * sentence on 2px ink rules; "Write the email" (the chapter's one filled
 * button, the width of its label, 24px under the sentence) opens the
 * reader's mail app with the subject and a body made of the clauses they
 * filled (composeMail.ts). Nothing is sent from the page. The sentence, the
 * button and the note are the form's three rows: from 1024px they are the
 * chapter's rows too, so the other ways hang on their baselines.
 *
 * - Each clause ("The role: [Role].") keeps together on a line while it
 *   fits; the problem gets the last line to itself and grows with the
 *   answer, so no answer ever scrolls out of view.
 * - A blank is as wide as its name, or its answer, plus 0.4ch: the rule
 *   ends just past the word, the stop sits 0.12em after it, and the line
 *   only grows as you type (sizers in CSS; data-value is written on input).
 * - Enter moves to the next blank; in the last one it writes the email.
 * - The fields carry no name, so a submit before hydration still opens a
 *   clean mailto with the subject only. This form shows only under
 *   html.js; the no-JS form is in the HTML beside it (Contact.tsx).
 */
const AUTOCOMPLETE: Record<ComposerField, string> = {
  name: "name",
  company: "organization",
  role: "organization-title",
  chaos: "off",
};

const fieldId = (field: ComposerField) => `contact-${field}`;

/** An answer that already ends a sentence. */
const TERMINAL = /[.!?…]\s*$/u;

type Bit = { kind: "text"; text: string } | { kind: "field"; index: number; glue: string };

/** The sentence's parts around the fields, cut into clauses at each full stop. */
function clausesOf(sentence: ContactCopy["composer"]["sentence"]): Bit[][] {
  const [lead, ...after] = sentence;
  const clauses: Bit[][] = [];
  let current: Bit[] = lead ? [{ kind: "text", text: lead }] : [];
  COMPOSER_FIELDS.forEach((_, index) => {
    const part = after[index] ?? "";
    const glue = /^[.,;:!?]/u.exec(part)?.[0] ?? "";
    const rest = part.slice(glue.length).trim();
    current.push({ kind: "field", index, glue });
    if (/[.!?]/u.test(glue)) {
      clauses.push(current);
      current = [];
    }
    if (rest) current.push({ kind: "text", text: rest });
  });
  if (current.length) clauses.push(current);
  return clauses;
}

type FieldBit = Extract<Bit, { kind: "field" }>;

/** A clause's units: the words before a blank stay with it ("chez [Entreprise]."). */
function unitsOf(bits: Bit[]): { text: string; field?: FieldBit }[] {
  const units: { text: string; field?: FieldBit }[] = [];
  let text = "";
  for (const bit of bits) {
    if (bit.kind === "text") {
      text = text ? `${text} ${bit.text}` : bit.text;
    } else {
      units.push({ text, field: bit });
      text = "";
    }
  }
  if (text) units.push({ text });
  return units;
}

interface ComposerProps {
  copy: ContactCopy["composer"];
}

export function Composer({ copy }: ComposerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const last = COMPOSER_FIELDS.length - 1;

  const field = (f: ComposerField) =>
    formRef.current?.elements.namedItem(fieldId(f)) as HTMLInputElement | HTMLTextAreaElement | null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(COMPOSER_FIELDS.map((f) => [f, field(f)?.value ?? ""]));
    window.location.assign(composeMail(values, copy).href);
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const next = COMPOSER_FIELDS[index + 1];
    if (next) field(next)?.focus();
    else formRef.current?.requestSubmit();
  };

  // The blank's sizer follows the answer (CSS reads data-value); an answer
  // that ends its own sentence ("…nobody owns it.") hides the stop after it.
  const onInput = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    const slot = el.parentElement;
    if (!slot) return;
    slot.dataset.value = el.value;
    slot.toggleAttribute("data-terminal", TERMINAL.test(el.value));
  };

  const blank = (index: number) => {
    const f = COMPOSER_FIELDS[index];
    const name = copy.fieldNames[index];
    const shared = {
      id: fieldId(f),
      className: styles.input,
      "aria-label": name,
      placeholder: name,
      autoComplete: AUTOCOMPLETE[f],
      enterKeyHint: index === last ? ("send" as const) : ("next" as const),
      onKeyDown: onKeyDown(index),
      onInput,
    };
    return (
      <span className={clsx(styles.blank, index === last && styles.chaos)} data-blank={f} data-ph={name}>
        {index === last ? (
          <textarea {...shared} rows={1} autoCapitalize="sentences" spellCheck />
        ) : (
          <input {...shared} type="text" autoCapitalize="words" spellCheck={f === "role"} />
        )}
        <span className={styles.rule} aria-hidden="true">
          <span className={styles.ruleInk} style={{ "--rule-i": index } as CSSProperties} />
        </span>
      </span>
    );
  };

  const glue = (mark: string) =>
    mark ? (
      <span className={styles.glue} data-stop={mark === "." ? "" : undefined}>
        {mark}
      </span>
    ) : null;

  return (
    <form
      ref={formRef}
      action={SITE.links.email}
      method="get"
      onSubmit={onSubmit}
      className={styles.composer}
      data-handoff=""
    >
      <input type="hidden" name="subject" value={copy.subject} />
      <p className={clsx(t.statement, styles.sentence)} data-reveal="">
        {clausesOf(copy.sentence).map((bits, c) => {
          const chaos = bits.find((b) => b.kind === "field" && b.index === last);
          return (
            <Fragment key={c}>
              {c > 0 ? " " : null}
              <span className={styles.clause}>
                {unitsOf(bits.filter((b) => b !== chaos)).map(({ text, field: f }, k) => (
                  <Fragment key={k}>
                    {k > 0 ? " " : null}
                    <span className={styles.unit}>
                      {text}
                      {text && f ? " " : null}
                      {f ? (
                        <span className={styles.blankGroup}>
                          {blank(f.index)}
                          {glue(f.glue)}
                        </span>
                      ) : null}
                    </span>
                  </Fragment>
                ))}
              </span>
              {chaos?.kind === "field" ? (
                <span className={styles.chaosRow}>
                  {blank(chaos.index)}
                  {glue(chaos.glue)}
                </span>
              ) : null}
            </Fragment>
          );
        })}
      </p>
      {/* The slot carries the entrance; the button keeps its own press. */}
      <span className={styles.sendSlot} data-reveal="ui">
        <Button type="submit" className={styles.sendButton} aria-describedby="contact-note">
          {copy.button}
        </Button>
      </span>
      <p id="contact-note" className={clsx(t.small, styles.note)} data-reveal="ui">
        <NoteSentences text={copy.note} />
      </p>
    </form>
  );
}
