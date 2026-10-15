import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { ANCHORS, homeHref, PAIRS } from "@/content";
import { LOOP_ORDER, LOOP_PAIR } from "@/content/sections/method";
import t from "@/styles/type.module.css";
import type { SectionProps } from "../types";
import styles from "./Method.module.css";
import { MethodRoot } from "./MethodRoot";
import { MonthRing } from "./MonthRing";
import { INK_BOTTOM, INK_BOTTOM_PHONE, INK_TOP, INK_TOP_PHONE } from "./ring";
import { RowPair } from "./RowPair";

const TITLE_ID = "method-title";

/** The ring's ink extent in R, from 600px (-l) and on phones (-s): ring.ts. */
const INK_VARS = {
  "--ink-top-l": INK_TOP,
  "--ink-bottom-l": INK_BOTTOM,
  "--ink-top-s": INK_TOP_PHONE,
  "--ink-bottom-s": INK_BOTTOM_PHONE,
} as CSSProperties;

/**
 * `method`: How I run the loop (02-home.md §6). Paper field.
 *
 * Claim: he runs the whole Product Owner loop on a real cadence: a call
 * with engineering every day, sprint planning every two weeks, a product
 * review every month, with RICE ranking, A/B tests and measured results in
 * between.
 *
 * The chapter's object is the month itself, drawn as the loop it names: a
 * ring of working days (MonthRing.tsx, ring.ts) with the H2 set inside it.
 * From 768px the title is split: the ring on the left half, the statement
 * on the right with its last baseline on the H2's last baseline. From
 * 1024px the ring then holds (sticky) while the loop, a real <ol> (the
 * sequence is information), scrolls past it on the right; the hold ends
 * with the last step on the H2's baseline, and both leave together. Each
 * step: its name at the statement step, its line in body text under it.
 * The Test step ends with its pair, drawn to scale.
 *
 * Reading order: the H2, the month (its sentence and caption), the
 * statement, the loop.
 *
 * Motion (MethodRoot.tsx): one trigger opens the chapter, heading first,
 * then the statement; the month lights round the ring once most of it is in
 * view, and the review closes it; the loop's rows rise one by one (70ms;
 * each step name a beat before its line); the Test pair parts once its row
 * has risen and it is in view; when the last step arrives, week 1 lifts
 * again ("…then the loop starts again").
 */
export function Method({ locale, dict }: SectionProps) {
  const copy = dict.home.method;
  const storiesHref = homeHref(locale, ANCHORS.stories);

  return (
    <MethodRoot
      id={ANCHORS.method}
      data-field="paper"
      aria-labelledby={TITLE_ID}
      lang={locale}
      className={styles.root}
      style={INK_VARS}
    >
      <div className={styles.layout}>
        <div className={styles.stage} data-stage="">
          <h2 id={TITLE_ID} data-reveal="" data-open="title" className={clsx(t.display, styles.title)}>
            {copy.h2}
          </h2>
          <MonthRing copy={copy.month} />
        </div>

        <div className={styles.head}>
          <p data-reveal="" data-open="statement" className={clsx(t.statement, styles.statement)}>
            {copy.statement}
          </p>
        </div>

        {/* role="list": Safari drops list semantics from a list styled without markers. */}
        <Reveal as="ol" role="list" className={styles.loop} data-loop="">
          {LOOP_ORDER.map((id) => {
            const item = copy.loop[id];
            const pairId = LOOP_PAIR[id];
            const pairCopy = pairId ? dict.home.pairs[pairId] : undefined;
            return (
              <li key={id} data-reveal="" className={styles.item}>
                <span className={clsx(t.statementStrong, styles.step)}>
                  {item.step}
                  <span className="visually-hidden">.</span>
                </span>{" "}
                <span className={clsx(t.body, styles.line)}>{linkInside(item.text, item.link, storiesHref)}</span>
                {pairId && pairCopy ? (
                  <RowPair
                    size="M"
                    data={PAIRS[pairId]}
                    copy={{ ...pairCopy, sentence: copy.testPair.sentence }}
                    labels="attached"
                    caption={pairCopy.legend}
                    max={copy.testPair.max}
                    className={styles.pair}
                  />
                ) : null}
              </li>
            );
          })}
        </Reveal>
      </div>
    </MethodRoot>
  );
}

/** The line with its one inline link (Collect: "user stories" → the stories). */
function linkInside(text: string, link: string | undefined, href: string): ReactNode {
  if (!link) return text;
  const at = text.indexOf(link);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <a href={href}>{link}</a>
      {text.slice(at + link.length)}
    </>
  );
}
