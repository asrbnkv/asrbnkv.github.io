import clsx from "clsx";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { Rich } from "@/components/Rich";
import { StoryCard } from "@/components/StatRow";
import { splitStory } from "@/content";
import t from "@/styles/type.module.css";
import c from "./Case.module.css";
import { Lines } from "./Lines";
import type { CaseView } from "./model";
import styles from "./Context.module.css";

/**
 * "What I walked into" (03 §3.1), stone, a split row: the H2 on cols 1–7,
 * the lead statement and the body on 8–12. Under the H2, only where the
 * source has names, the names list at the statement step (never a logo):
 * the retailers, the partners and their deals, the kinds of freelance work.
 */
export function CaseContext({ view }: { view: CaseView }) {
  const { copy, locale, headings } = view;
  const names = copy.names;
  return (
    <Reveal as="section" data-field="stone" aria-labelledby="context-title" className={clsx(c.chapter, styles.context)}>
      <div className={clsx(c.grid, c.split)}>
        <h2 id="context-title" data-reveal="" className={clsx(t.display, c.h2)}>
          <Lines text={headings.context} />
        </h2>
        <div className={c.text}>
          <p data-reveal="" className={clsx(t.statement, c.lead)}>
            {copy.lead}
          </p>
          {copy.contextBody ? (
            <p data-reveal="" className={clsx(t.body, c.body)}>
              <Rich text={copy.contextBody} locale={locale} />
            </p>
          ) : null}
        </div>
        {names ? (
          <div className={clsx(c.under, styles.names)}>
            <Reveal as="ul" stagger={45} className={styles.list}>
              {names.items.map((item, i) => (
                <li key={item.name} data-reveal="" className={styles.item} style={{ "--n": i } as CSSProperties}>
                  <span className={clsx(t.statement, styles.name)}>{item.name}</span>
                  {item.note ? <span className={clsx(t.small, t.muted, styles.note)}>{item.note}</span> : null}
                </li>
              ))}
            </Reveal>
            {names.caption ? (
              <p data-reveal="" className={clsx(t.small, styles.caption)}>
                {names.caption}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

/**
 * "Who the users were" (03 §3.2), paper: the card. Two user stories as
 * static story cards (type on the field, not boxes), staggered: card 1 on
 * cols 1–6, card 2 on 8–12 starting lower. Each card is an article named
 * by its first clause.
 */
export function CaseUsers({ view }: { view: CaseView }) {
  const { project, locale, dict } = view;
  const stories = project?.stories;
  if (!stories?.length) return null;
  return (
    <Reveal as="section" data-field="paper" aria-labelledby="users-title" className={c.chapter}>
      <h2 id="users-title" data-reveal="" className={clsx(t.display, c.h2)}>
        <Lines text={dict.caseStudy.headings.users} />
      </h2>
      <div className={clsx(c.grid, styles.cards)}>
        {stories.map((story) => {
          const clauses = splitStory(story, locale);
          return (
            <article
              key={story}
              data-reveal=""
              aria-label={clauses ? `${clauses[0].label} ${clauses[0].text}` : undefined}
              className={styles.card}
            >
              {clauses ? <StoryCard clauses={clauses} /> : <p className={t.body}>{story}</p>}
            </article>
          );
        })}
      </div>
    </Reveal>
  );
}
