import clsx from "clsx";
import { TypeSetPair } from "@/components/Marks";
import { Pair } from "@/components/Pair";
import t from "@/styles/type.module.css";
import type { StoriesLabels, StoryView } from "./model";
import styles from "./Stories.module.css";

/**
 * One story's panel (01 §7.10, 02 §2.2), the same in every mode:
 *   1. the story card: one <p>, its three clauses as spans, so it reads as
 *      the verbatim sentence; "As a / I want / so that" hang in their own
 *      column on desktop and run in on phones; "so that…" starts its line;
 *   2. What I did · What happened: side by side over a drawing (from 1280px),
 *      or, for a story with no drawing, What I did at the measure and What
 *      happened as the payoff, at the statement step;
 *   3. the drawing: Pair M (its lead value is the payoff) or the type-set pair;
 *   4. the case link.
 * It reads top down in every story (the ask, what I did, what happened,
 * the case); in the tab panel a shorter story's spare height falls under
 * its case link, never inside it.
 * The pairs are drawn parted (static): storyMotion.ts parts them as a WAAPI
 * overlay, so no-JS, keyboard and reduced motion all read the true drawing.
 * Motion hooks: data-story-part (rise + blur), data-story-clip (the result,
 * revealed by clip), data-story-tail (the link, last), data-story-mark (the
 * drawing that parts with the tab's marker).
 */
export function StoryBody({
  story,
  labels,
  heading: Heading,
}: {
  story: StoryView;
  labels: StoriesLabels;
  /** h3 in the tab panel; h4 under an accordion row (its button sits in an h3). */
  heading: "h3" | "h4";
}) {
  const last = story.clauses.length - 1;
  const visual = story.visual;
  return (
    <div className={styles.body}>
      <p className={styles.story}>
        {story.clauses.map((clause, i) => (
          <span key={i} className={styles.clause} data-story-part="">
            {clause.label ? (
              <span className={styles.clauseLabel}>
                {clause.label}
                {clause.join}
              </span>
            ) : null}
            <span className={styles.clauseText}>{i < last ? `${clause.text} ` : clause.text}</span>
          </span>
        ))}
      </p>

      {visual ? (
        <div className={styles.outcome} data-cols="2">
          <div data-story-part="">
            <Heading className={styles.outcomeHeading}>{labels.whatIBuilt}</Heading>
            <p className={styles.outcomeText}>{story.built}</p>
          </div>
          <div data-story-clip="">
            <Heading className={styles.outcomeHeading}>{labels.whatHappened}</Heading>
            <p className={styles.outcomeText}>{story.happened}</p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.outcome} data-story-part="">
            <div>
              <Heading className={styles.outcomeHeading}>{labels.whatIBuilt}</Heading>
              <p className={styles.outcomeText}>{story.built}</p>
            </div>
          </div>
          <div className={clsx(styles.result, styles.payoffBlock)} data-story-clip="">
            <Heading className={styles.outcomeHeading}>{labels.whatHappened}</Heading>
            <p className={styles.payoff}>{story.happened}</p>
          </div>
        </>
      )}

      {visual ? (
        <div className={clsx(styles.result, styles.visual)} data-story-clip="">
          {visual.kind === "pair" ? (
            <div data-story-mark="">
              <Pair size="M" data={visual.data} copy={visual.copy} motion="static" lead />
            </div>
          ) : (
            <>
              <p className={styles.typeSet} data-story-mark="">
                <TypeSetPair before={visual.before} after={visual.after} joiner={visual.joiner} motion="static" />
              </p>
              <p className={clsx(t.small, styles.typeSetCaption)}>{visual.caption}</p>
            </>
          )}
        </div>
      ) : null}

      <p className={styles.caseLine} data-story-tail="">
        <a href={story.caseHref} className={styles.caseLink}>
          {labels.readCase} <span className={styles.caseTitle}>{story.caseTitle}</span>
        </a>
      </p>
    </div>
  );
}
