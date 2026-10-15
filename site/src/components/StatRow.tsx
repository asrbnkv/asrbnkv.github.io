import clsx from "clsx";
import { Fragment } from "react";
import type { StoryClause } from "@/content";
import styles from "./Charts.module.css";

/**
 * The stat row (03 §14 A3; 01 §7.8 composition A): values at the statement
 * step in LS 700, their captions in Small UNDER them, on a three-column
 * rhythm (two columns on phones). Values are the content layer's exact
 * figures (localizeFigure for French spacing).
 */
export function StatRow({
  items,
  className,
}: {
  items: readonly { value: string; caption: string }[];
  className?: string;
}) {
  return (
    <ul className={clsx(styles.stats, className)}>
      {items.map((item) => (
        <li key={item.caption} className={styles.stat}>
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statCaption}>{item.caption}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A user story as a card (01 §7.10, 03 §14 A1): "As a", "I want", "so that"
 * hang in a 5.2em column as Small muted words on the baseline of their
 * clause; each clause in Figtree 500 at body size; "so that…" always starts
 * its own line. One <p> of clause spans (02 §2.6), so assistive tech reads
 * the verbatim sentence, never three fragments; an elided label ("En tant
 * qu’") takes no space before its clause. Get the clauses with splitStory()
 * from "@/content/stories".
 */
export function StoryCard({
  clauses,
  labelId,
  className,
}: {
  clauses: readonly StoryClause[];
  /** id on the first clause ("As a B2B partner"), so an <article aria-labelledby> can name the story by it (03 §3.2). */
  labelId?: string;
  className?: string;
}) {
  return (
    <p className={clsx(styles.card, className)}>
      {clauses.map((c, i) => (
        <Fragment key={c.label}>
          {i > 0 ? " " : null}
          <span className={styles.clause} id={i === 0 ? labelId : undefined}>
            <span className={styles.clauseLabel}>{c.label}</span>
            {/['’]$/.test(c.label) ? null : " "}
            <span className={styles.clauseText}>{c.text}</span>
          </span>
        </Fragment>
      ))}
    </p>
  );
}
