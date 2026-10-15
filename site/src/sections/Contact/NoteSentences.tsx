import { Fragment } from "react";
import styles from "./Contact.module.css";

/**
 * A Small note whose sentences never break apart: the line breaks at a
 * full stop or not at all ("Ouvre votre messagerie. / Rien n'est envoyé
 * depuis cette page.").
 */
export function NoteSentences({ text }: { text: string }) {
  return text.split(/(?<=[.!?])\s+/u).map((sentence, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <span className={styles.noteSentence}>{sentence}</span>
    </Fragment>
  ));
}
