import clsx from "clsx";
import { Button, CvLink, textButtonBodyClass, textButtonClass } from "@/components/Button";
import { ANCHORS, mailtoHref, SITE } from "@/content";
import type { ContactCopy } from "@/content/sections/contact";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import { AddressRow } from "./AddressRow";
import { CloseReveal } from "./CloseReveal";
import { Composer } from "./Composer";
import { NoteSentences } from "./NoteSentences";
import styles from "./Contact.module.css";

/**
 * The close: "Send me your chaos" (02-home.md §10, 01 §7.14). Orange, the
 * accent's one full field; ink text only.
 *
 * One screen from 1024px, in three bands on two left edges (columns 1 and
 * 7): the ask (the H2 on 1–6, the statement on 7–12 on its last baseline),
 * the address across the measure with Copy 24px after it, then the letter
 * that writes the email (1–6) beside the three other ways (7–12), which
 * hang on the letter's baselines: LinkedIn and the CV on its first line,
 * the AI twin on the button's label. The gaps between the bands share the
 * screen's spare height (Contact.module.css), so the close holds one screen
 * down to 768px tall. #contact-actions holds the address, the composer (with
 * its no-JS form beside it) and the ways. One filled button: "Write the
 * email".
 *
 * Motion (02 §10.4, CloseReveal): entrances in reading order, each part at
 * the chapter's line; the address draws its rule and its letters rise out
 * of their own line, and the letter waits for it; feedback per 01 §7.4; no
 * scrub. On the home and the case pages, <main> lifts off the ink footer
 * under this field. Case pages reuse this chapter unchanged.
 */
export function Contact({ dict }: SectionProps) {
  const copy = dict.home.contact;
  const { ways } = copy;
  const wayLink = clsx(textButtonClass, textButtonBodyClass);
  return (
    <CloseReveal
      id={ANCHORS.contact}
      data-field="orange"
      aria-labelledby="contact-title"
      className={styles.root}
    >
      <h2 id="contact-title" data-reveal="" className={clsx(t.display, styles.title)}>
        {copy.h2}
      </h2>
      <p data-reveal="" className={clsx(t.statement, styles.statement)}>
        {copy.statement}
      </p>

      <div id="contact-actions" data-handoff="" className={styles.actions}>
        <AddressRow
          email={SITE.email}
          href={mailtoHref(copy.composer.subject)}
          labels={{
            copy: copy.copy,
            copied: copy.copied,
            copiedLive: copy.copiedLive,
            selectedLive: copy.selectedLive,
          }}
        />
        <Composer copy={copy.composer} />
        <MailFallback copy={copy.composer} />

        <ul role="list" className={styles.ways}>
          <li data-reveal="ui" className={clsx(styles.way, styles.wayLinkedin)}>
            <a href={SITE.links.linkedin} aria-describedby="contact-linkedin-note" className={wayLink}>
              {ways.linkedin.label}
            </a>
            <span id="contact-linkedin-note" className={clsx(t.small, styles.wayNote)}>
              {ways.linkedin.note}
            </span>
          </li>
          <li data-reveal="ui" className={clsx(styles.way, styles.wayCv)}>
            <CvLink id="contact-cv" size="body" label={ways.cv.label} note={ways.cv.note} className={styles.cv} />
          </li>
          <li data-reveal="ui" className={clsx(styles.way, styles.wayAi)}>
            <a href={SITE.links.aiTwin} aria-describedby="contact-ai-note" className={wayLink}>
              {ways.ai.label}
            </a>
            <span id="contact-ai-note" className={clsx(t.small, styles.wayNote, styles.aiNote)}>
              {ways.ai.note}
            </span>
          </li>
        </ul>
      </div>
    </CloseReveal>
  );
}

/**
 * Without JS (02 §10.1): a plain mailto form with the subject and one body
 * textarea. It is in the HTML beside the sentence form, in the same three
 * rows, and shows only when html.js is absent, so nothing swaps after
 * hydration.
 */
function MailFallback({ copy }: { copy: ContactCopy["composer"] }) {
  return (
    <form action={SITE.links.email} method="get" className={styles.fallback}>
      <input type="hidden" name="subject" value={copy.subject} />
      <div className={styles.fallbackField}>
        <label htmlFor="contact-message" className={clsx(t.body, styles.fallbackLabel)}>
          {copy.fallback.label}
        </label>
        <textarea
          id="contact-message"
          name="body"
          rows={3}
          placeholder={copy.fallback.placeholder}
          className={clsx(t.body, styles.textarea)}
        />
      </div>
      <span className={styles.sendSlot}>
        <Button type="submit" className={styles.sendButton} aria-describedby="contact-note-plain">
          {copy.button}
        </Button>
      </span>
      <p id="contact-note-plain" className={clsx(t.small, styles.note)}>
        <NoteSentences text={copy.note} />
      </p>
    </form>
  );
}
