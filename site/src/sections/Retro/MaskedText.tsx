import { Fragment } from "react";
import styles from "./Retro.module.css";

/**
 * Display text that can rise out of its own baseline (Retro.module.css, the
 * masked rise): plain inline words at rest, each in a clip box while its
 * block waits. Server-rendered; the chapter's script (choreography.ts) only
 * sets attributes and delays on it.
 */

/** "Write the playbook earlier." → phrases split on plain spaces, each
 *  phrase split on the no-break spaces that glue it. */
export type Phrases = readonly (readonly string[])[];

export function toPhrases(text: string): Phrases {
  return text.split(" ").map((phrase) => phrase.split(" "));
}

/** The words of a masked block (the H2 or a poster line); the block itself
 *  carries `data-masked` and the `masked` class. */
export function MaskedWords({ phrases }: { phrases: Phrases }) {
  return phrases.map((phrase, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      {phrase.length > 1 ? (
        // A glued phrase never wraps; its words still rise one by one.
        <span className={styles.phrase}>
          {phrase.map((word, j) => (
            <Fragment key={j}>
              {j > 0 ? " " : null}
              <Word>{word}</Word>
            </Fragment>
          ))}
        </span>
      ) : (
        <Word>{phrase[0]}</Word>
      )}
    </Fragment>
  ));
}

/** One word: the outer span is the clip, the inner one the rising word. */
function Word({ children }: { children: string }) {
  return (
    <span className={styles.mask}>
      <span data-word="" className={styles.word}>
        {children}
      </span>
    </span>
  );
}

/** A reason (body text) whose hyphenated compounds never break at their own
 *  hyphen ("lui-même", "re-signing"): a balanced rag would otherwise end a
 *  line on "lui-". */
export function KeepCompounds({ text }: { text: string }) {
  return text.split(/(\p{L}+-\p{L}+)/u).map((chunk, i) =>
    i % 2 === 1 ? (
      <span key={i} className={styles.phrase}>
        {chunk}
      </span>
    ) : (
      chunk
    ),
  );
}
